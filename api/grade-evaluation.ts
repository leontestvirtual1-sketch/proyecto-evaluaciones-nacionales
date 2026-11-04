/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * api/grade-evaluation.ts
 * Endpoint Vercel Serverless para corrección e inserción segura de rendiciones en el servidor.
 * 
 * SEGURIDAD Y AUDITORÍA (Fase 3.1):
 * - Las claves de respuesta NUNCA se exponen en cliente. Calificación 100% server-side.
 * - Autenticación Bearer: El alumno se deriva estrictamente del JWT (auth.getUser)
 *   ignorando cualquier `alumnoId` del body para evitar suplantación de identidad (IDOR).
 * - Previene doble envío comprobando rendición previa en tabla rendiciones (409 Conflict).
 * - Esquema DB estricto: Mapea a las columnas reales de `public.rendiciones` en Supabase
 *   evitando fallos de schema cache (500).
 * - Generación criptográfica de UUID (crypto.randomUUID()).
 * - Sanitización de entradas para mitigar inyecciones XSS en nombres/RUTs.
 * - Validación de estado de evaluación (403 si la prueba está en borrador o inactiva).
 * - Sin fallbacks inseguros ni credenciales hardcodeadas (Directiva 10).
 */

import { createClient } from '@supabase/supabase-js';
import { setCorsHeaders } from './_utils.js';

type VercelRequest = any;
type VercelResponse = any;

const APP_URL = process.env.APP_URL || 'https://sysget-saber.vercel.app';

// Tabla oficial de transformación PAES Forma 101 Invierno (0 a 60 aciertos en preguntas puntuables)
const TABLA_PAES_INV_2026: Record<number, number> = {
  0: 100, 1: 158, 2: 179, 3: 200, 4: 220, 5: 240, 6: 258, 7: 274, 8: 288, 9: 303,
  10: 318, 11: 335, 12: 351, 13: 365, 14: 377, 15: 386, 16: 396, 17: 408, 18: 422, 19: 437,
  20: 453, 21: 465, 22: 475, 23: 483, 24: 491, 25: 499, 26: 510, 27: 523, 28: 538, 29: 553,
  30: 566, 31: 575, 32: 583, 33: 590, 34: 598, 35: 608, 36: 621, 37: 636, 38: 652, 39: 665,
  40: 676, 41: 685, 42: 693, 43: 703, 44: 716, 45: 732, 46: 748, 47: 763, 48: 777, 49: 790,
  50: 803, 51: 818, 52: 836, 53: 855, 54: 874, 55: 893, 56: 914, 57: 936, 58: 961, 59: 988,
  60: 1000
};

function sanitizeText(str: unknown, maxLen = 200): string {
  if (typeof str !== 'string') return '';
  return str.replace(/[<>]/g, '').trim().slice(0, maxLen);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 1. Cabeceras CORS seguras (Fase 3.4)
  const origin = req.headers?.origin;
  setCorsHeaders(res, origin, {
    methods: 'POST, OPTIONS',
    headers: 'Content-Type, Authorization'
  });

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  // 2. Validación temprana de body (400 Bad Request)
  const { pruebaId, alumnoId, respuestas, tiemposPorPregunta } = req.body || {};

  if (!pruebaId || typeof pruebaId !== 'string' || !respuestas || typeof respuestas !== 'object') {
    return res.status(400).json({ error: 'Datos de rendición incompletos (pruebaId y respuestas requeridos).' });
  }

  // 3. Validación estricta de credenciales de Supabase
  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('Error de configuración: Faltan variables de entorno SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY');
    return res.status(500).json({ error: 'Error interno de configuración del servidor.' });
  }

  const sbAdmin = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false }
  });

  try {
    // 4. Autenticación y derivación segura del estudiante (F-01: Token obligatorio, derivación estricta)
    const authHeader = req.headers?.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';

    if (!token) {
      return res.status(401).json({ error: 'Se requiere iniciar sesión para registrar una rendición.' });
    }

    const { data: { user }, error: authErr } = await sbAdmin.auth.getUser(token);
    if (authErr || !user) {
      return res.status(401).json({ error: 'Token de sesión inválido o expirado.' });
    }

    const { data: actorPerfil } = await sbAdmin
      .from('perfiles')
      .select('id, rol, rbd, es_super_admin, nombre, apellido, rut')
      .eq('id', user.id)
      .maybeSingle();

    if (!actorPerfil) {
      return res.status(403).json({ error: 'Perfil de usuario no encontrado en la plataforma.' });
    }

    let finalAlumnoId: string;
    let finalAlumnoNombre = '';
    let finalAlumnoRut = '';

    if (actorPerfil.rol === 'alumno') {
      // Estudiante rindiendo: identidad fija e inmutable derivada del token de Auth (cero IDOR)
      finalAlumnoId = user.id;
      finalAlumnoNombre = `${actorPerfil.nombre || ''} ${actorPerfil.apellido || ''}`.trim() || user.email || 'Estudiante';
      finalAlumnoRut = actorPerfil.rut || '';
    } else if (actorPerfil.rol === 'profesor' || actorPerfil.rol === 'admin') {
      // Digitación docente / OMR: profesor o admin califica para un alumno específico
      if (!alumnoId || typeof alumnoId !== 'string' || !alumnoId.trim()) {
        return res.status(400).json({ error: 'Para digitación docente u OMR se requiere especificar el alumnoId del estudiante.' });
      }
      finalAlumnoId = alumnoId.trim();

      const { data: targetAlumno } = await sbAdmin
        .from('perfiles')
        .select('id, rbd, nombre, apellido, rut')
        .eq('id', finalAlumnoId)
        .maybeSingle();

      if (!targetAlumno) {
        return res.status(404).json({ error: 'El estudiante especificado no existe en el sistema.' });
      }

      // Verificación de tenant FAIL-CLOSED para administradores y docentes
      if (!actorPerfil.es_super_admin) {
        if (!actorPerfil.rbd || !targetAlumno.rbd) {
          return res.status(403).json({ error: 'Acceso denegado: tanto el evaluador como el estudiante deben tener un establecimiento escolar asignado.' });
        }
        if (targetAlumno.rbd !== actorPerfil.rbd) {
          return res.status(403).json({ error: 'Acceso denegado: el estudiante pertenece a otro establecimiento escolar.' });
        }
      }

      finalAlumnoNombre = `${targetAlumno.nombre || ''} ${targetAlumno.apellido || ''}`.trim() || 'Estudiante';
      finalAlumnoRut = targetAlumno.rut || '';
    } else {
      return res.status(403).json({ error: 'Rol no autorizado para calificar o registrar rendiciones.' });
    }

    // 5. Obtener la evaluación desde Supabase
    const { data: evaluacion, error: evalErr } = await sbAdmin
      .from('evaluaciones')
      .select('*')
      .eq('id', pruebaId)
      .maybeSingle();

    if (evalErr || !evaluacion) {
      return res.status(404).json({ error: 'Evaluación no encontrada en el sistema.' });
    }

    // Validar estado de la evaluación: no permitir rendir pruebas en borrador o inactivas
    if (evaluacion.estado && evaluacion.estado !== 'activa') {
      return res.status(403).json({ error: 'Esta evaluación no se encuentra activa para su rendición.' });
    }

    // Validar aislamiento multi-tenant para estudiantes (F-01)
    if (actorPerfil.rol === 'alumno' && !actorPerfil.es_super_admin) {
      if (!evaluacion.es_catalogo) {
        if (!actorPerfil.rbd || !evaluacion.rbd || actorPerfil.rbd !== evaluacion.rbd) {
          return res.status(403).json({ error: 'Acceso denegado: esta evaluación no pertenece a tu establecimiento escolar.' });
        }
      }
    }

    // Validar relación docente/admin con la evaluación para digitación OMR (F-01)
    if (actorPerfil.rol === 'profesor' || (actorPerfil.rol === 'admin' && !actorPerfil.es_super_admin)) {
      const esAutor = evaluacion.profesor_id === actorPerfil.id || evaluacion.creado_por === actorPerfil.id;
      const esMismoRbd = Boolean(evaluacion.rbd && actorPerfil.rbd && evaluacion.rbd === actorPerfil.rbd);
      const esCatalogo = Boolean(evaluacion.es_catalogo);

      if (!esAutor && !esMismoRbd && !esCatalogo) {
        return res.status(403).json({ error: 'Acceso denegado: no tienes permisos sobre esta evaluación ni pertenece a tu establecimiento.' });
      }

      // Si la evaluación pertenece a un establecimiento específico y no es de catálogo, verificar estricta concordancia con actor
      if (!esCatalogo && evaluacion.rbd && evaluacion.rbd !== actorPerfil.rbd) {
        return res.status(403).json({ error: 'Acceso denegado: la evaluación pertenece a otro establecimiento escolar.' });
      }
    }

    // 6. Prevenir doble envío: verificar si ya existe una rendición finalizada
    const { data: rendExistente } = await sbAdmin
      .from('rendiciones')
      .select('id, estado')
      .eq('prueba_id', pruebaId)
      .eq('alumno_id', finalAlumnoId)
      .maybeSingle();

    if (rendExistente && rendExistente.estado !== 'en_progreso') {
      return res.status(409).json({
        error: 'Esta evaluación ya fue rendida previamente por este estudiante.',
        rendicionId: rendExistente.id
      });
    }

    // 7. Recuperar preguntas oficiales de la prueba
    const preguntaIds: string[] = Array.isArray(evaluacion.preguntas_ids)
      ? evaluacion.preguntas_ids
      : (typeof evaluacion.preguntas_ids === 'string' ? JSON.parse(evaluacion.preguntas_ids || '[]') : []);

    let preguntasDb: any[] = [];
    if (preguntaIds.length > 0) {
      const { data, error: pregErr } = await sbAdmin
        .from('preguntas')
        .select('id, tipo, puntaje, respuesta_correcta, alternativas, fuente')
        .in('id', preguntaIds);

      if (!pregErr && data) preguntasDb = data;
    } else {
      const EVAL_PREGUNTA_PREFIX: Record<string, string> = {
        'eval-paes-mat1-2023-f113': 'preg-paes-m1-23-%',
        'eval-paes-m1-2023': 'preg-paes-m1-23-%',
        'eval-paes-lect-2026-f103': 'preg-paes-lec-26-%',
        'eval-simce-mat-6b-e3': 'preg-mat6b-e3-%',
        'eval-simce-mat-6b-ensayo3': 'preg-mat6b-e3-%',
        'eval-simce-mat-2m-e3': 'preg-mat2m-e3-%',
        'eval-diag-ciu-3m-2026': 'preg-diag-ciu-3m-%'
      };
      const prefix = EVAL_PREGUNTA_PREFIX[pruebaId];
      if (prefix) {
        const { data, error: pregErr } = await sbAdmin
          .from('preguntas')
          .select('id, tipo, puntaje, respuesta_correcta, alternativas, fuente')
          .like('id', prefix)
          .order('id', { ascending: true });

        if (!pregErr && data) preguntasDb = data;
      }
    }

    if (!preguntasDb || preguntasDb.length === 0) {
      return res.status(500).json({ error: 'No se pudieron recuperar las preguntas para calificar.' });
    }

    // 8. Calificar server-side con total hermetismo
    let puntajeObtenido = 0;
    let puntajeMaximo = 0;
    let aciertosPuntuables = 0;
    let tieneDesarrolloPendiente = false;

    // Preguntas piloto oficiales PAES Lectora 2026 Forma 101
    const pilotosPaesLect2026 = new Set([
      'preg-paes-lec-26-10',
      'preg-paes-lec-26-22',
      'preg-paes-lec-26-23',
      'preg-paes-lec-26-52',
      'preg-paes-lec-26-58'
    ]);

    const respuestasDetalladas = preguntasDb.map((p: any) => {
      const respDada = (respuestas[p.id] || '').trim();
      let esCorrecta = false;
      const pPuntaje = Number(p.puntaje) || 1;
      const esPiloto = pilotosPaesLect2026.has(p.id);

      if (p.tipo === 'seleccion_multiple') {
        const claveReal = (p.respuesta_correcta || '').trim().toUpperCase();
        esCorrecta = respDada.toUpperCase() === claveReal && claveReal.length > 0;
        if (esCorrecta) {
          puntajeObtenido += pPuntaje;
          if (!esPiloto) aciertosPuntuables++;
        }
      } else {
        tieneDesarrolloPendiente = true;
        esCorrecta = false;
      }

      puntajeMaximo += pPuntaje;

      const duracionReal = (tiemposPorPregunta && typeof tiemposPorPregunta[p.id] === 'number')
        ? tiemposPorPregunta[p.id]
        : null;

      return {
        preguntaId: p.id,
        respuestaDada: respDada,
        esCorrecta,
        tiempoSegundos: duracionReal
      };
    });

    const porcentajeLogro = puntajeMaximo > 0 ? Math.round((puntajeObtenido / puntajeMaximo) * 100) : 0;

    // 9. Cálculo de Escala Nacional (Oficial vs Estimación)
    let puntajeEscalaNacional: number;
    let tipoEscala: 'PAES Oficial' | 'Estimación Nacional';

    if (pruebaId === 'eval-paes-lect-2026-f103' && TABLA_PAES_INV_2026[aciertosPuntuables] !== undefined) {
      puntajeEscalaNacional = TABLA_PAES_INV_2026[aciertosPuntuables];
      tipoEscala = 'PAES Oficial';
    } else if (pruebaId.includes('paes')) {
      puntajeEscalaNacional = Math.round(100 + (porcentajeLogro / 100) * 900);
      tipoEscala = 'Estimación Nacional';
    } else {
      // Escala SIMCE 100 a 350 puntos
      puntajeEscalaNacional = Math.round(100 + (porcentajeLogro / 100) * 250);
      tipoEscala = 'Estimación Nacional';
    }

    const estadoFinal = tieneDesarrolloPendiente ? 'en_progreso' : 'completada';
    const rendicionId = crypto.randomUUID();
    const ahoraIso = new Date().toISOString();

    const nombreLimpio = sanitizeText(finalAlumnoNombre, 100);
    const rutLimpio = sanitizeText(finalAlumnoRut || '', 20);

    // 10. Persistir en la tabla public.rendiciones respetando el esquema real de Supabase
    // Columnas reales: id, prueba_id, alumno_id, respuestas, puntaje_total, puntaje_maximo, porcentaje_logro, estado, inicio_at, fin_at
    const metadataRendicion = {
      alumnoNombre: nombreLimpio,
      alumnoRut: rutLimpio,
      puntajeEscalaNacional,
      tipoEscala,
      respuestasDetalladas
    };

    const rendicionDbPayload = {
      id: rendicionId,
      prueba_id: pruebaId,
      alumno_id: finalAlumnoId,
      respuestas: metadataRendicion,
      puntaje_total: puntajeObtenido,
      puntaje_maximo: puntajeMaximo,
      porcentaje_logro: porcentajeLogro,
      estado: estadoFinal,
      inicio_at: ahoraIso,
      fin_at: ahoraIso
    };

    // Solo persistir en DB si alumno_id es un UUID válido de usuario/perfil
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(finalAlumnoId);
    let guardadoEnDb = false;

    if (isUuid) {
      const { error: insertErr } = await sbAdmin
        .from('rendiciones')
        .upsert(rendicionDbPayload, { onConflict: 'id' });

      if (insertErr) {
        console.warn('Aviso al persistir en rendiciones:', insertErr.message);
        // Si falló por FK (alumno no registrado en perfiles de DB), continuamos con la entrega del resultado
      } else {
        guardadoEnDb = true;
      }
    }

    
    // 10.b Notificación automática al docente/administrador vía /api/notify-rendicion-docente
    try {
      const notifySecret = process.env.NOTIFY_SECRET;
      if (notifySecret) {
        let profesorEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER || '';
        let profesorNombre = 'Docente';

        if (evaluacion.profesor_id) {
          const { data: profPerfil } = await sbAdmin
            .from('perfiles')
            .select('email, nombre, apellido')
            .eq('id', evaluacion.profesor_id)
            .maybeSingle();

          if (profPerfil?.email) {
            profesorEmail = profPerfil.email;
            profesorNombre = `${profPerfil.nombre || "" } ${profPerfil.apellido || ""}`.trim() || "Docente";
          }
        }

        if (profesorEmail) {
          fetch(`${APP_URL}/api/notify-rendicion-docente`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-notify-secret': notifySecret
            },
            body: JSON.stringify({
              rendicionId,
              pruebaId,
              pruebaTitulo: evaluacion.titulo || 'Evaluación',
              alumnoNombre: nombreLimpio,
              alumnoRut: rutLimpio,
              alumnoEmail: user.email || '',
              docenteEmail: profesorEmail,
              docenteNombre: profesorNombre,
              puntajeObtenido,
              puntajeMaximo,
              porcentajeLogro,
              puntajeEscalaNacional,
              respuestasDetalladas,
              fechaRendicion: ahoraIso.replace('T', ' ').substring(0, 16)
            })
          }).catch(err => console.warn('[grade-evaluation] Error no bloqueante al notificar docente:', err));
        }
      }
    } catch (notifyErr) {
      console.warn('[grade-evaluation] No se pudo coordinar notificación a docente:', notifyErr);
    }

    // 11. Respuesta enriquecida para el cliente (compatible con AlumnoEvaluationView y App)
    return res.status(200).json({
      success: true,
      guardadoEnDb,
      rendicion: {
        id: rendicionId,
        pruebaId,
        alumnoId: finalAlumnoId,
        alumnoNombre: nombreLimpio,
        alumnoRut: rutLimpio,
        fechaRendicion: ahoraIso.replace('T', ' ').substring(0, 16),
        puntajeObtenido,
        puntajeMaximo,
        porcentajeLogro,
        puntajeEscalaNacional,
        escalaOficial: tipoEscala,
        respuestas: respuestasDetalladas,
        estado: estadoFinal === 'completada' ? 'corregida' : 'enviada'
      }
    });

  } catch (err: any) {
    console.error('Error en /api/grade-evaluation:', err);
    return res.status(500).json({ error: 'Error interno al procesar la evaluación' });
  }
}
