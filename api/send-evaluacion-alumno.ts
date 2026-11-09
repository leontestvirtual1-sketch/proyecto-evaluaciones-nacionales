// Rate limiting simple en memoria por profesor (max 20 envíos por minuto)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(userId: string, limit = 20, windowMs = 60000): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(userId);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(userId, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (entry.count >= limit) {
    return false;
  }
  entry.count++;
  return true;
}
/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * api/send-evaluacion-alumno.ts
 * Endpoint Vercel Serverless para enviar el acceso a una evaluación por email al alumno.
 *
 * SEGURIDAD:
 * - Autenticación Bearer: Solo docentes/admin autenticados pueden disparar el envío.
 * - NOTIFY_SECRET no requerido aquí (usa auth.getUser en su lugar).
 * - Validación del rol del emisor (profesor o admin).
 * - Sanitización XSS de todos los campos antes de incluirlos en el email.
 * - Rate limit implícito: el endpoint solo envía si la evaluación existe y está activa.
 */

import nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';
import { escapeHtml, setCorsHeaders } from './_utils.js';

type VercelRequest = any;
type VercelResponse = any;

const SMTP_USER  = process.env.SMTP_USER  || '';
const SMTP_PASS  = process.env.SMTP_PASS  || '';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || '';
const APP_URL    = process.env.APP_URL    || 'https://sysget-saber.vercel.app';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 1. CORS
  const origin = req.headers?.origin;
  setCorsHeaders(res, origin, {
    methods: 'POST, OPTIONS',
    headers: 'Content-Type, Authorization',
  });

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST')    return res.status(405).json({ error: 'Método no permitido' });

  // 2. Validar credenciales SMTP
  if (!SMTP_USER || !SMTP_PASS) {
    return res.status(503).json({ error: 'Servicio de correo no configurado en el servidor.' });
  }

  // 3. Autenticación del emisor (docente / admin)
  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({ error: 'Error interno de configuración.' });
  }
  const sbAdmin = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } });

  const authHeader = req.headers?.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
  if (!token) {
    return res.status(401).json({ error: 'Se requiere sesión de docente para enviar evaluaciones.' });
  }

  const { data: { user: emisor }, error: authErr } = await sbAdmin.auth.getUser(token);
  if (authErr || !emisor) {
    return res.status(401).json({ error: 'Token de sesión inválido o expirado.' });
  }

  // Verificar perfil y rol autorizado (F-03: Solo profesores o administradores autorizados)
  const { data: emisorPerfil } = await sbAdmin
    .from('perfiles')
    .select('id, rol, rbd, es_super_admin, nombre, apellido, estado')
    .eq('id', emisor.id)
    .maybeSingle();

  if (!emisorPerfil || (emisorPerfil.rol !== 'profesor' && emisorPerfil.rol !== 'admin')) {
    return res.status(403).json({ error: 'Acceso denegado: solo docentes o administradores pueden enviar evaluaciones.' });
  }

  if (emisorPerfil.estado && emisorPerfil.estado !== 'activo') {
    return res.status(403).json({ error: 'Acceso denegado: cuenta no activa.' });
  }

  // 4. Leer y validar body
  const {
    pruebaId,
    pruebaTitulo,
    pruebaCodigoAcceso,
    pruebaDuracionMinutos,
    alumnoEmail,
    alumnoNombre,
    docenteNombre,
  } = req.body || {};

  if (!pruebaId || !alumnoEmail || !alumnoNombre) {
    return res.status(400).json({ error: 'Campos requeridos: pruebaId, alumnoEmail, alumnoNombre.' });
  }

  // Validar formato email básico
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(alumnoEmail)) {
    return res.status(400).json({ error: 'Formato de email del alumno inválido.' });
  }

  // 5. Verificar que la evaluación existe y está activa (y relación de propiedad)
  const { data: evaluacion, error: evalErr } = await sbAdmin
    .from('evaluaciones')
    .select('id, titulo, estado, codigo_acceso, tiempo_limite, profesor_id, rbd, es_catalogo')
    .eq('id', pruebaId)
    .maybeSingle();

  if (evalErr || !evaluacion) {
    return res.status(404).json({ error: 'Evaluación no encontrada en el sistema.' });
  }
  if (evaluacion.estado && evaluacion.estado !== 'activa') {
    return res.status(403).json({ error: 'Solo se pueden enviar evaluaciones con estado "activa".' });
  }

  // Comprobar que el emisor sea el autor, pertenezca al mismo RBD, o sea superadmin
  const isAuthor = evaluacion.profesor_id === emisor.id;
  const isSameRbd = emisorPerfil.rbd && evaluacion.rbd === emisorPerfil.rbd;
  const isSuper = Boolean(emisorPerfil.es_super_admin);
  const isCatalogo = Boolean(evaluacion.es_catalogo);

  if (!isAuthor && !isSameRbd && !isSuper && !isCatalogo) {
    return res.status(403).json({ error: 'No tienes autorización para distribuir esta evaluación.' });
  }

  // 6. Rate limiting atómico con bloqueo transaccional en PostgreSQL (con fallback en memoria)
  let reservaEnvioId: string | null = null;
  try {
    const { data: reserva, error: rpcErr } = await sbAdmin.rpc('reservar_cupo_envio_evaluacion', {
      p_docente_id: emisor.id,
      p_prueba_id: pruebaId,
      p_alumno_email: alumnoEmail,
      p_alumno_nombre: alumnoNombre,
      p_rbd: emisorPerfil.rbd || evaluacion.rbd || null,
      p_max_cupos: 25,
      p_ventana_segundos: 60,
    });

    if (rpcErr) {
      console.warn('[send-evaluacion-alumno] RPC reservar_cupo_envio_evaluacion no disponible en BD, usando rate-limiting en memoria:', rpcErr.message || rpcErr);
      if (!checkRateLimit(emisor.id, 25, 60000)) {
        return res.status(429).json({ error: 'Has alcanzado el límite de 25 envíos por minuto. Por favor espera un momento antes de continuar.' });
      }
    } else if (reserva && !reserva.permitido) {
      return res.status(429).json({ error: 'Has alcanzado el límite de 25 envíos por minuto. Por favor espera un momento antes de continuar.' });
    } else if (reserva?.permitido) {
      reservaEnvioId = reserva.envio_id || null;
    }
  } catch (rlErr: any) {
    console.warn('[send-evaluacion-alumno] Excepción al reservar cupo en BD, usando rate-limiting en memoria:', rlErr.message || rlErr);
    if (!checkRateLimit(emisor.id, 25, 60000)) {
      return res.status(429).json({ error: 'Has alcanzado el límite de 25 envíos por minuto. Por favor espera un momento antes de continuar.' });
    }
  }

  // Fallback complementario en memoria para ráfagas instantáneas
  if (!checkRateLimit(emisor.id, 25, 60000)) {
    if (reservaEnvioId) {
      try {
        await sbAdmin.rpc('cancelar_reserva_envio_evaluacion', {
          p_envio_id: reservaEnvioId,
          p_docente_id: emisor.id,
        });
      } catch (_cancelErr) {
        // silencioso
      }
    }
    return res.status(429).json({ error: 'Has alcanzado el límite de 25 envíos por minuto. Por favor espera un momento antes de continuar.' });
  }

  // 7. Datos finales (usar los valores de DB como fuente de verdad)
  const safeAlumnoNombre    = escapeHtml(alumnoNombre);
  const safeAlumnoEmail     = escapeHtml(alumnoEmail);
  const safeTitulo          = escapeHtml(evaluacion.titulo || pruebaTitulo || 'Evaluación');
  const safeCodigo          = escapeHtml(evaluacion.codigo_acceso || pruebaCodigoAcceso || '—');
  const safeDuracion        = Number(evaluacion.tiempo_limite || pruebaDuracionMinutos || 60);
  const safeDocenteNombre   = escapeHtml(docenteNombre || 'Tu docente');
  const linkDirecto         = `${APP_URL}?codigo=${encodeURIComponent(evaluacion.codigo_acceso || '')}&email=${encodeURIComponent(alumnoEmail)}&nombre=${encodeURIComponent(alumnoNombre)}`;

  // 7. Construir email HTML para el alumno
  const htmlAlumno = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${safeTitulo} — Sysget Saber</title>
</head>
<body style="margin:0;padding:0;background:#0f172a;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0"
               style="max-width:600px;width:100%;background:#1e293b;border-radius:16px;overflow:hidden;border:1px solid #334155;">

          <!-- HEADER -->
          <tr>
            <td style="background:linear-gradient(135deg,#4f46e5,#7c3aed);padding:32px 40px;text-align:center;">
              <div style="font-size:36px;margin-bottom:8px;">📐</div>
              <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:800;letter-spacing:-0.5px;">
                Sysget<span style="color:#a5b4fc;">Saber</span>
              </h1>
              <p style="margin:6px 0 0;color:#c7d2fe;font-size:13px;">
                Plataforma de Evaluaciones Nacionales · Chile 2026
              </p>
            </td>
          </tr>

          <!-- BODY -->
          <tr>
            <td style="padding:36px 40px;">

              <p style="margin:0 0 8px;color:#94a3b8;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:1px;">
                Evaluación Asignada
              </p>
              <h2 style="margin:0 0 8px;color:#f1f5f9;font-size:20px;font-weight:700;">
                Hola, ${safeAlumnoNombre} 👋
              </h2>
              <p style="margin:0 0 28px;color:#94a3b8;font-size:14px;line-height:1.6;">
                Tu docente <strong style="color:#e2e8f0;">${safeDocenteNombre}</strong> te ha asignado
                la siguiente evaluación. Por favor rínde la cuando estés listo/a.
              </p>

              <!-- EVALUACIÓN CARD -->
              <table width="100%" cellpadding="0" cellspacing="0"
                     style="background:#0f172a;border:1px solid #334155;border-radius:12px;margin-bottom:28px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0 0 4px;color:#64748b;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:1px;">
                      Evaluación
                    </p>
                    <p style="margin:0 0 16px;color:#f1f5f9;font-size:18px;font-weight:800;">
                      ${safeTitulo}
                    </p>

                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding-right:32px;">
                          <p style="margin:0 0 2px;color:#64748b;font-size:11px;font-weight:600;text-transform:uppercase;">
                            Código de Acceso
                          </p>
                          <p style="margin:0;color:#818cf8;font-size:22px;font-weight:800;font-family:monospace;letter-spacing:2px;">
                            ${safeCodigo}
                          </p>
                        </td>
                        <td>
                          <p style="margin:0 0 2px;color:#64748b;font-size:11px;font-weight:600;text-transform:uppercase;">
                            Duración
                          </p>
                          <p style="margin:0;color:#34d399;font-size:18px;font-weight:700;">
                            ⏱ ${safeDuracion} minutos
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- PASOS -->
              <p style="margin:0 0 16px;color:#94a3b8;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:1px;">
                📋 Cómo rendir tu evaluación
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                ${[
                  ['1', 'Acceso directo', `Haz clic en el botón azul "Ir a la Evaluación" o visita <a href="${linkDirecto}" style="color:#818cf8;">${APP_URL}</a>`],
                  ['2', 'Validación con RUT (Cero claves)', 'Ingresa tu RUT chileno oficial para confirmar tu identidad en la nómina. No necesitas contraseñas ni registros.'],
                  ['3', 'Rinde tu prueba', `Cuentas con <strong>${safeDuracion} minutos</strong> y temporizador en pantalla.`],
                  ['4', 'Resultados inmediatos', 'Al finalizar, presiona "Entregar Evaluación". Tu docente recibirá tus respuestas de inmediato.'],
                ].map(([num, title, desc]) => `
                <tr>
                  <td style="padding:8px 0;vertical-align:top;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="vertical-align:top;padding-right:12px;">
                          <div style="width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,#4f46e5,#7c3aed);color:#fff;font-size:13px;font-weight:800;text-align:center;line-height:28px;">
                            ${num}
                          </div>
                        </td>
                        <td style="vertical-align:top;">
                          <p style="margin:0 0 2px;color:#f1f5f9;font-size:14px;font-weight:700;">${title}</p>
                          <p style="margin:0;color:#94a3b8;font-size:13px;line-height:1.5;">${desc}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>`).join('')}
              </table>

              <!-- CTA -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td align="center">
                    <a href="${linkDirecto}"
                       style="display:inline-block;background:linear-gradient(135deg,#4f46e5,#7c3aed);color:#ffffff;text-decoration:none;font-size:15px;font-weight:800;padding:16px 40px;border-radius:12px;letter-spacing:0.3px;box-shadow:0 4px 15px rgba(79,70,229,0.4);">
                      🚀 Ir a la Evaluación
                    </a>
                  </td>
                </tr>
              </table>

              <div style="background:#1e3a5f;border:1px solid #1e40af;border-radius:10px;padding:14px 18px;">
                <p style="margin:0;color:#93c5fd;font-size:12px;line-height:1.5;">
                  💡 <strong>Consejo:</strong> Rinde la evaluación en un lugar sin distracciones.
                  El temporizador se inicia al hacer clic en "Iniciar Evaluación".
                </p>
              </div>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="padding:20px 40px;border-top:1px solid #334155;text-align:center;">
              <p style="margin:0;color:#475569;font-size:11px;">
                Sysget Saber · 2026 · Chile ·
                <a href="${APP_URL}" style="color:#6366f1;text-decoration:none;">sysget-saber.vercel.app</a>
              </p>
              <p style="margin:6px 0 0;color:#334155;font-size:10px;">
                Este correo fue enviado automáticamente. Si crees que fue un error, ignóralo.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  // 8. Enviar email al alumno
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });

    const infoAlumno = await transporter.sendMail({
      from: `"Sysget Saber" <${SMTP_USER}>`,
      to: safeAlumnoEmail,
      replyTo: ADMIN_EMAIL || SMTP_USER,
      subject: `📐 Tu evaluación: ${safeTitulo}`,
      html: htmlAlumno,
    });

    console.log('[send-evaluacion-alumno] Email enviado a alumno:', infoAlumno.messageId);

    return res.status(200).json({
      success: true,
      messageId: infoAlumno.messageId,
      sentTo: alumnoEmail,
      envioId: reservaEnvioId,
    });

  } catch (err: any) {
    console.error('[send-evaluacion-alumno] Error SMTP:', err);
    // Si falló el envío del correo, cancelar la reserva atómica para devolver el cupo al docente
    if (reservaEnvioId) {
      try {
        await sbAdmin.rpc('cancelar_reserva_envio_evaluacion', {
          p_envio_id: reservaEnvioId,
          p_docente_id: emisor.id,
        });
      } catch (_cancelErr) {
        console.warn('[send-evaluacion-alumno] No se pudo cancelar reserva de envío fallido:', _cancelErr);
      }
    }
    return res.status(500).json({ error: 'Error al enviar el correo. Verifica la configuración SMTP.' });
  }
}

