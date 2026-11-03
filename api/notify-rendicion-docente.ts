/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * api/notify-rendicion-docente.ts
 * Endpoint Vercel Serverless que notifica al docente cuando un alumno termina una evaluación.
 *
 * SEGURIDAD:
 * - Autenticado con NOTIFY_SECRET (header x-notify-secret) para uso server-to-server.
 * - Puede ser llamado por una Supabase Database Webhook o desde grade-evaluation tras guardar.
 * - Sanitización XSS de todos los campos.
 * - No expone claves de respuestas correctas (solo respuesta dada y resultado).
 */

import nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';
import { escapeHtml, setCorsHeaders } from './_utils.js';

type VercelRequest = any;
type VercelResponse = any;

const SMTP_USER    = process.env.SMTP_USER    || '';
const SMTP_PASS    = process.env.SMTP_PASS    || '';
const NOTIFY_SECRET = process.env.NOTIFY_SECRET || '';
const APP_URL      = process.env.APP_URL      || 'https://sysget-saber.vercel.app';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const origin = req.headers?.origin;
  setCorsHeaders(res, origin, {
    methods: 'POST, OPTIONS',
    headers: 'Content-Type, x-notify-secret',
  });

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST')   return res.status(405).json({ error: 'Método no permitido' });

  // Autenticación server-to-server
  if (!NOTIFY_SECRET) {
    return res.status(503).json({ error: 'Notificaciones no configuradas (NOTIFY_SECRET ausente).' });
  }
  const requestSecret = req.headers?.['x-notify-secret'] || '';
  if (requestSecret !== NOTIFY_SECRET) {
    console.warn('[notify-rendicion-docente] Secreto inválido. Origin:', origin);
    return res.status(401).json({ error: 'No autorizado.' });
  }

  if (!SMTP_USER || !SMTP_PASS) {
    return res.status(503).json({ error: 'Servicio de correo no configurado.' });
  }

  // Leer payload (puede venir de Supabase Webhook o de grade-evaluation)
  const {
    rendicionId,
    pruebaId,
    pruebaTitulo,
    alumnoNombre,
    alumnoRut,
    alumnoEmail,
    docenteEmail,
    docenteNombre,
    puntajeObtenido,
    puntajeMaximo,
    porcentajeLogro,
    puntajeEscalaNacional,
    respuestasDetalladas,  // Array de { preguntaId, respuestaDada, esCorrecta }
    fechaRendicion,
  } = req.body || {};

  if (!docenteEmail || !alumnoNombre) {
    return res.status(400).json({ error: 'Campos requeridos: docenteEmail, alumnoNombre.' });
  }

  const safeAlumnoNombre  = escapeHtml(alumnoNombre);
  const safeAlumnoRut     = escapeHtml(alumnoRut || '—');
  const safeAlumnoEmail   = escapeHtml(alumnoEmail || '—');
  const safeDocenteNombre = escapeHtml(docenteNombre || 'Docente');
  const safePruebaTitulo  = escapeHtml(pruebaTitulo || 'Evaluación');
  const safeFecha         = escapeHtml(fechaRendicion || new Date().toISOString().slice(0, 16).replace('T', ' '));
  const puntaje           = Number(puntajeObtenido || 0);
  const maximo            = Number(puntajeMaximo || 0);
  const porcentaje        = Number(porcentajeLogro || 0);
  const escala            = Number(puntajeEscalaNacional || 0);

  const porcentajeColor =
    porcentaje >= 70 ? '#10b981' :
    porcentaje >= 50 ? '#f59e0b' : '#ef4444';

  const porcentajeLabel =
    porcentaje >= 70 ? '✅ Logro Suficiente' :
    porcentaje >= 50 ? '⚠️ Logro Parcial'   : '❌ Logro Insuficiente';

  const reporteUrl = `${APP_URL}?view=reporte&pruebaId=${encodeURIComponent(pruebaId || '')}`;

  // Tabla resumen de respuestas (máximo 34 ítems)
  let tablaRespuestas = '';
  const respArr = Array.isArray(respuestasDetalladas) ? respuestasDetalladas : [];
  if (respArr.length > 0) {
    const filas = respArr.map((r: any, i: number) => {
      const letra = escapeHtml(r.respuestaDada || '—');
      const ok    = r.esCorrecta;
      return `
      <tr style="border-bottom:1px solid #1e293b;">
        <td style="padding:5px 10px;color:#94a3b8;font-size:12px;text-align:center;">${i + 1}</td>
        <td style="padding:5px 10px;color:#f1f5f9;font-size:13px;text-align:center;font-weight:700;">${letra}</td>
        <td style="padding:5px 10px;text-align:center;">
          <span style="display:inline-block;padding:2px 8px;border-radius:6px;font-size:11px;font-weight:700;
                background:${ok ? '#065f46' : '#7f1d1d'};color:${ok ? '#6ee7b7' : '#fca5a5'};">
            ${ok ? '✓' : '✗'}
          </span>
        </td>
      </tr>`;
    }).join('');

    tablaRespuestas = `
      <p style="margin:0 0 12px;color:#94a3b8;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:1px;">
        📋 Detalle de Respuestas
      </p>
      <div style="overflow-x:auto;border-radius:10px;border:1px solid #334155;margin-bottom:24px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
          <thead>
            <tr style="background:#0f172a;">
              <th style="padding:8px 10px;color:#64748b;font-size:11px;text-transform:uppercase;text-align:center;">N°</th>
              <th style="padding:8px 10px;color:#64748b;font-size:11px;text-transform:uppercase;text-align:center;">Resp. Dada</th>
              <th style="padding:8px 10px;color:#64748b;font-size:11px;text-transform:uppercase;text-align:center;">Resultado</th>
            </tr>
          </thead>
          <tbody>${filas}</tbody>
        </table>
      </div>`;
  }

  const htmlDocente = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Resultado de ${safeAlumnoNombre} — Sysget Saber</title>
</head>
<body style="margin:0;padding:0;background:#0f172a;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0"
               style="max-width:600px;width:100%;background:#1e293b;border-radius:16px;overflow:hidden;border:1px solid #334155;">

          <!-- HEADER -->
          <tr>
            <td style="background:linear-gradient(135deg,#0f766e,#0d9488);padding:28px 40px;text-align:center;">
              <div style="font-size:32px;margin-bottom:8px;">📊</div>
              <h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:800;">
                Resultado de Evaluación Recibido
              </h1>
              <p style="margin:6px 0 0;color:#99f6e4;font-size:13px;">
                Sysget<strong>Saber</strong> · Notificación Automática
              </p>
            </td>
          </tr>

          <!-- BODY -->
          <tr>
            <td style="padding:32px 40px;">
              <h2 style="margin:0 0 20px;color:#f1f5f9;font-size:18px;font-weight:700;">
                Hola, ${safeDocenteNombre} 👋
              </h2>

              <!-- INFO ALUMNO -->
              <table width="100%" cellpadding="0" cellspacing="0"
                     style="background:#0f172a;border:1px solid #334155;border-radius:12px;margin-bottom:24px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0 0 12px;color:#64748b;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:1px;">
                      Alumno/a
                    </p>
                    <p style="margin:0 0 4px;color:#f1f5f9;font-size:18px;font-weight:800;">${safeAlumnoNombre}</p>
                    <p style="margin:0 0 2px;color:#94a3b8;font-size:13px;">RUT: ${safeAlumnoRut}</p>
                    ${safeAlumnoEmail !== '—' ? `<p style="margin:0;color:#818cf8;font-size:13px;">${safeAlumnoEmail}</p>` : ''}
                  </td>
                </tr>
              </table>

              <!-- EVALUACIÓN -->
              <table width="100%" cellpadding="0" cellspacing="0"
                     style="background:#0f172a;border:1px solid #334155;border-radius:12px;margin-bottom:24px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0 0 6px;color:#64748b;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:1px;">
                      Evaluación
                    </p>
                    <p style="margin:0 0 6px;color:#f1f5f9;font-size:16px;font-weight:700;">${safePruebaTitulo}</p>
                    <p style="margin:0;color:#475569;font-size:12px;">Rendida el ${safeFecha}</p>
                  </td>
                </tr>
              </table>

              <!-- RESULTADOS -->
              <p style="margin:0 0 12px;color:#94a3b8;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:1px;">
                🎯 Resultados
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td style="width:50%;padding-right:8px;">
                    <div style="background:#0f172a;border:1px solid #334155;border-radius:10px;padding:16px;text-align:center;">
                      <p style="margin:0 0 4px;color:#64748b;font-size:11px;font-weight:600;text-transform:uppercase;">Puntaje</p>
                      <p style="margin:0;color:#f1f5f9;font-size:24px;font-weight:800;">${puntaje} / ${maximo}</p>
                    </div>
                  </td>
                  <td style="width:50%;padding-left:8px;">
                    <div style="background:#0f172a;border:1px solid #334155;border-radius:10px;padding:16px;text-align:center;">
                      <p style="margin:0 0 4px;color:#64748b;font-size:11px;font-weight:600;text-transform:uppercase;">% Logro</p>
                      <p style="margin:0;color:${porcentajeColor};font-size:24px;font-weight:800;">${porcentaje}%</p>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- ESCALA NACIONAL -->
              <table width="100%" cellpadding="0" cellspacing="0"
                     style="background:linear-gradient(135deg,#1e3a5f,#1e3a8a);border:1px solid #1e40af;border-radius:12px;margin-bottom:24px;">
                <tr>
                  <td style="padding:18px 24px;text-align:center;">
                    <p style="margin:0 0 4px;color:#93c5fd;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:1px;">
                      Puntaje Escala Nacional (SIMCE)
                    </p>
                    <p style="margin:0 0 6px;color:#ffffff;font-size:36px;font-weight:900;">${escala} pts</p>
                    <span style="display:inline-block;padding:4px 16px;border-radius:20px;font-size:12px;font-weight:700;
                          background:${porcentajeColor}33;color:${porcentajeColor};border:1px solid ${porcentajeColor}44;">
                      ${porcentajeLabel}
                    </span>
                  </td>
                </tr>
              </table>

              ${tablaRespuestas}

              <!-- CTA -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
                <tr>
                  <td align="center">
                    <a href="${reporteUrl}"
                       style="display:inline-block;background:linear-gradient(135deg,#0f766e,#0d9488);color:#ffffff;text-decoration:none;font-size:14px;font-weight:800;padding:14px 36px;border-radius:12px;box-shadow:0 4px 15px rgba(13,148,136,0.4);">
                      📈 Ver Reporte Completo del Curso
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="padding:20px 40px;border-top:1px solid #334155;text-align:center;">
              <p style="margin:0;color:#475569;font-size:11px;">
                Sysget Saber · 2026 · Chile ·
                <a href="${APP_URL}" style="color:#6366f1;text-decoration:none;">sysget-saber.vercel.app</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });

    const info = await transporter.sendMail({
      from: `"Sysget Saber" <${SMTP_USER}>`,
      to: docenteEmail,
      subject: `📊 ${safeAlumnoNombre} completó "${safePruebaTitulo}" — ${porcentaje}% logro`,
      html: htmlDocente,
    });

    console.log('[notify-rendicion-docente] Email enviado a docente:', info.messageId);
    return res.status(200).json({ success: true, messageId: info.messageId });

  } catch (err: any) {
    console.error('[notify-rendicion-docente] Error SMTP:', err);
    return res.status(500).json({ error: 'Error al enviar notificación al docente.' });
  }
}

