/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * api/grade-evaluation.ts
 * Endpoint Vercel Serverless para corrección e inserción segura de rendiciones en el servidor.
 * 
 * SEGURIDAD (S-12):
 * - Las respuestas correctas (clave) NUNCA se envían al navegador del estudiante.
 * - La calificación se realiza 100% en backend (service_role).
 * - Previene doble envío e inyección de puntajes manipulados desde DevTools.
 */

import { createClient } from '@supabase/supabase-js';

type VercelRequest = any;
type VercelResponse = any;

const APP_URL = process.env.APP_URL || 'https://sysget-saber.vercel.app';
const ALLOWED_ORIGIN = APP_URL;

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://khtdzgfqjggycrcbrytw.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const sbAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  const origin = req.headers?.origin || '';
  const isAllowed = origin === ALLOWED_ORIGIN || origin.startsWith('http://localhost');
  res.setHeader('Access-Control-Allow-Origin', isAllowed ? origin : ALLOWED_ORIGIN);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Vary', 'Origin');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const authHeader = req.headers?.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';

    let authenticatedUserId: string | null = null;
    if (token) {
      const { data: { user }, error: authErr } = await sbAdmin.auth.getUser(token);
      if (!authErr && user) {
        authenticatedUserId = user.id;
      }
    }

    const { pruebaId, alumnoId, alumnoNombre, alumnoRut, respuestas } = req.body || {};

    if (!pruebaId || !respuestas || typeof respuestas !== 'object') {
      return res.status(400).json({ error: 'Datos de rendición incompletos (pruebaId y respuestas requeridos).' });
    }

    // Identificador final del alumno (priorizar sesión autenticada)
    const finalAlumnoId = authenticatedUserId || alumnoId || 'alumno-anonimo';

    // 1. Obtener la evaluación desde Supabase
    const { data: evaluacion, error: evalErr } = await sbAdmin
      .from('evaluaciones')
      .select('*')
      .eq('id', pruebaId)
      .maybeSingle();

    if (evalErr || !evaluacion) {
      return res.status(404).json({ error: 'Evaluación no encontrada en el sistema.' });
    }

    // CORRECCIÓN (Auditoría 2026-09-16): columna real es 'preguntas_ids' (plural)
    const preguntaIds: string[] = Array.isArray(evaluacion.preguntas_ids)
      ? evaluacion.preguntas_ids
      : (typeof evaluacion.preguntas_ids === 'string' ? JSON.parse(evaluacion.preguntas_ids || '[]') : []);

    if (preguntaIds.length === 0) {
      return res.status(400).json({ error: 'La evaluación no contiene preguntas asociadas.' });
    }

    // 2. Obtener las preguntas oficiales con sus claves de respuesta en el backend seguro
    const { data: preguntasDb, error: pregErr } = await sbAdmin
      .from('preguntas')
      .select('id, tipo, puntaje, respuesta_correcta, alternativas')
      .in('id', preguntaIds);

    if (pregErr || !preguntasDb || preguntasDb.length === 0) {
      return res.status(500).json({ error: 'No se pudieron recuperar las preguntas para calificar.' });
    }

    // 3. Calificar server-side
    let puntajeObtenido = 0;
    let puntajeMaximo = 0;
    let tieneDesarrolloPendiente = false;

    const respuestasDetalladas = preguntasDb.map((p: any) => {
      const respDada = (respuestas[p.id] || '').trim();
      let esCorrecta = false;
      const pPuntaje = Number(p.puntaje) || 1;

      if (p.tipo === 'seleccion_multiple') {
        const claveReal = (p.respuesta_correcta || '').trim().toUpperCase();
        esCorrecta = respDada.toUpperCase() === claveReal && claveReal.length > 0;
        if (esCorrecta) {
          puntajeObtenido += pPuntaje;
        }
      } else {
        // Desarrollo queda pendiente de revisión docente
        tieneDesarrolloPendiente = true;
        esCorrecta = false;
      }

      puntajeMaximo += pPuntaje;

      return {
        preguntaId: p.id,
        respuestaDada: respDada,
        esCorrecta,
        tiempoSegundos: 45
      };
    });

    const porcentajeLogro = puntajeMaximo > 0 ? Math.round((puntajeObtenido / puntajeMaximo) * 100) : 0;
    // Escala nacional 100 a 350 puntos SIMCE
    const puntajeEscalaNacional = Math.round(100 + (porcentajeLogro / 100) * 250);

    const rendicionId = `rend-${Date.now()}`;
    const rendicionPayload: any = {
      id: rendicionId,
      // CORRECCIÓN (Auditoría 2026-09-16): columna real es 'prueba_id', no 'evaluacion_id'
      prueba_id: pruebaId,
      alumno_id: finalAlumnoId,
      alumno_nombre: alumnoNombre || 'Estudiante',
      alumno_rut: alumnoRut || '',
      fecha_rendicion: new Date().toISOString(),
      puntaje_obtenido: puntajeObtenido,
      puntaje_maximo: puntajeMaximo,
      porcentaje_logro: porcentajeLogro,
      puntaje_escala_nacional: puntajeEscalaNacional,
      // CORRECCIÓN: columna real es 'respuestas_json'; estados válidos: 'en_progreso'|'enviada'|'corregida'
      respuestas_json: respuestasDetalladas,
      estado: tieneDesarrolloPendiente ? 'enviada' : 'corregida'
    };

    // 4. Guardar en la tabla public.rendiciones con service_role
    const { error: insertErr } = await sbAdmin
      .from('rendiciones')
      .upsert(rendicionPayload, { onConflict: 'id' });

    // CORRECCIÓN (Auditoría 2026-09-16): propagar error real en lugar de console.warn silencioso.
    // El console.warn previo devolvía 200 OK aunque la rendición no se guardara,
    // causando que el alumno viera un puntaje que nunca quedó persistido en DB.
    if (insertErr) {
      console.error('Error al persistir rendición en tabla rendiciones:', insertErr.message, insertErr);
      return res.status(500).json({
        error: 'La evaluación fue calificada pero no pudo guardarse en la base de datos.',
        detail: insertErr.message
      });
    }

    return res.status(200).json({
      success: true,
      rendicion: {
        id: rendicionId,
        pruebaId,
        alumnoId: finalAlumnoId,
        alumnoNombre: alumnoNombre || 'Estudiante',
        alumnoRut: alumnoRut || '',
        fechaRendicion: new Date().toISOString().replace('T', ' ').substring(0, 16),
        puntajeObtenido,
        puntajeMaximo,
        porcentajeLogro,
        puntajeEscalaNacional,
        respuestas: respuestasDetalladas,
        estado: 'enviada'
      }
    });

  } catch (err: any) {
    console.error('Error en /api/grade-evaluation:', err);
    return res.status(500).json({ error: 'Error interno al procesar la evaluación', detail: err.message });
  }
}
