/* eslint-disable @typescript-eslint/no-explicit-any */
import nodemailer from 'nodemailer';

type VercelRequest = any;
type VercelResponse = any;

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'leontestvirtual1@gmail.com';
const CC_EMAIL = process.env.CC_EMAIL || 'luisleong.premil@gmail.com';
const ADMIN_NAME = process.env.ADMIN_NAME || 'Luis Andrés León González';
const APP_URL = process.env.APP_URL || 'https://sysget-saber.vercel.app';
const SMTP_USER = process.env.SMTP_USER || '';
const SMTP_PASS = process.env.SMTP_PASS || '';

/**
 * SEGURIDAD (S-04): Secreto compartido para autenticar llamadas al endpoint de notificación.
 * Debe configurarse como variable de entorno NOTIFY_SECRET en Vercel (valor largo y aleatorio).
 * Sin este secreto, cualquier llamada es rechazada con 401.
 */
const NOTIFY_SECRET = process.env.NOTIFY_SECRET || '';

function escapeHtml(str: any): string {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

const ALLOWED_ORIGIN = process.env.APP_URL || 'https://sysget-saber.vercel.app';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS restringido
  const origin = req.headers?.origin || '';
  const isAllowed = origin === ALLOWED_ORIGIN || origin.startsWith('http://localhost');
  res.setHeader('Access-Control-Allow-Origin', isAllowed ? origin : ALLOWED_ORIGIN);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-notify-secret');
  res.setHeader('Vary', 'Origin');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // ── AUTENTICACIÓN (S-04): Verificar secreto compartido ──────────────────
  if (!NOTIFY_SECRET) {
    // Fail-secure: si la variable no está configurada, el endpoint está deshabilitado
    console.error('[SEGURIDAD] NOTIFY_SECRET no configurado. Endpoint deshabilitado hasta configurar la variable.');
    return res.status(503).json({ error: 'Servicio de notificaciones no disponible.' });
  }

  const requestSecret = req.headers?.['x-notify-secret'] || '';
  if (requestSecret !== NOTIFY_SECRET) {
    console.warn('[SEGURIDAD] Intento de acceso a notify-admin con secreto inválido. Origin:', origin);
    return res.status(401).json({ error: 'No autorizado.' });
  }

  try {
    const {
      nombre,
      apellido,
      email,
      rol,
      establecimiento,
      rbd,
      asignaturaNombre,
      rut,
      approvalToken,
    } = req.body || {};

    // Validar campos requeridos mínimos
    if (!email || !nombre) {
      return res.status(400).json({ error: 'Campos requeridos: nombre, email.' });
    }


    const safeNombre = escapeHtml(nombre);
    const safeApellido = escapeHtml(apellido);
    const safeEmail = escapeHtml(email);
    const safeEstablecimiento = escapeHtml(establecimiento);
    const safeRbd = escapeHtml(rbd);
    const safeAsignatura = escapeHtml(asignaturaNombre);
    const safeRut = escapeHtml(rut);
    const safeToken = encodeURIComponent(approvalToken || '');

    const approvalLink = `${APP_URL}?approve_token=${safeToken}`;
    const fullName = `${safeNombre} ${safeApellido}`.trim() || 'Nuevo Usuario';
    const rolLabel = rol === 'profesor' ? '👨‍🏫 Docente' : rol === 'admin' ? '🛡️ Administrador' : '👤 Alumno';

    const htmlBody = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Nueva Solicitud de Acceso — Sysget Saber</title>
</head>
<body style="margin:0;padding:0;background:#0f172a;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#1e293b;border-radius:16px;overflow:hidden;border:1px solid #334155;">
          <!-- HEADER -->
          <tr>
            <td style="background:linear-gradient(135deg,#4f46e5,#7c3aed);padding:32px 40px;text-align:center;">
              <div style="font-size:32px;margin-bottom:8px;">🎓</div>
              <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:800;letter-spacing:-0.5px;">Sysget<span style="color:#a5b4fc;">Saber</span></h1>
              <p style="margin:6px 0 0;color:#c7d2fe;font-size:13px;">Plataforma de Evaluaciones Nacionales · Chile 2026</p>
            </td>
          </tr>
          <!-- BODY -->
          <tr>
            <td style="padding:36px 40px;">
              <p style="margin:0 0 8px;color:#94a3b8;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:1px;">Nueva Solicitud de Acceso</p>
              <h2 style="margin:0 0 24px;color:#f1f5f9;font-size:20px;font-weight:700;">Hola, ${ADMIN_NAME} 👋</h2>
              <p style="margin:0 0 24px;color:#94a3b8;font-size:14px;line-height:1.6;">
                Un nuevo usuario ha solicitado acceso a <strong style="color:#e2e8f0;">Sysget Saber</strong>. 
                Revisa los datos y aprueba la solicitud:
              </p>

              <!-- USER CARD -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a;border:1px solid #334155;border-radius:12px;margin-bottom:28px;">
                <tr><td style="padding:20px 24px;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="padding:6px 0;color:#64748b;font-size:12px;font-weight:600;text-transform:uppercase;width:140px;">Nombre</td>
                      <td style="padding:6px 0;color:#f1f5f9;font-size:14px;font-weight:600;">${fullName}</td>
                    </tr>
                    <tr>
                      <td style="padding:6px 0;color:#64748b;font-size:12px;font-weight:600;text-transform:uppercase;">RUT</td>
                      <td style="padding:6px 0;color:#f1f5f9;font-size:14px;">${safeRut || 'No especificado'}</td>
                    </tr>
                    <tr>
                      <td style="padding:6px 0;color:#64748b;font-size:12px;font-weight:600;text-transform:uppercase;">Correo</td>
                      <td style="padding:6px 0;color:#818cf8;font-size:14px;">${safeEmail}</td>
                    </tr>
                    <tr>
                      <td style="padding:6px 0;color:#64748b;font-size:12px;font-weight:600;text-transform:uppercase;">Rol Solicitado</td>
                      <td style="padding:6px 0;color:#f1f5f9;font-size:14px;">${rolLabel}</td>
                    </tr>
                    ${safeAsignatura ? `
                    <tr>
                      <td style="padding:6px 0;color:#64748b;font-size:12px;font-weight:600;text-transform:uppercase;">Especialidad</td>
                      <td style="padding:6px 0;color:#a5b4fc;font-size:14px;font-weight:600;">${safeAsignatura}</td>
                    </tr>` : ''}
                    <tr>
                      <td style="padding:6px 0;color:#64748b;font-size:12px;font-weight:600;text-transform:uppercase;">Establecimiento</td>
                      <td style="padding:6px 0;color:#f1f5f9;font-size:14px;">${safeEstablecimiento || 'No especificado'} ${safeRbd ? `<span style="color:#94a3b8;font-size:12px;">(RBD: ${safeRbd})</span>` : ''}</td>
                    </tr>
                  </table>
                </td></tr>
              </table>

              <!-- CTA BUTTON -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
                <tr>
                  <td align="center">
                    <a href="${approvalLink}"
                       style="display:inline-block;background:linear-gradient(135deg,#10b981,#059669);color:#ffffff;text-decoration:none;font-size:15px;font-weight:800;padding:16px 40px;border-radius:12px;letter-spacing:0.3px;box-shadow:0 4px 15px rgba(16,185,129,0.4);">
                      ✅ Aprobar Acceso con 1 Clic (Trial 30 Días)
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 20px;text-align:center;color:#475569;font-size:12px;">
                O copia este enlace en tu navegador:<br/>
                <a href="${approvalLink}" style="color:#818cf8;word-break:break-all;">${approvalLink}</a>
              </p>

              <div style="background:#1e3a5f;border:1px solid #1e40af;border-radius:10px;padding:14px 18px;margin-bottom:0;">
                <p style="margin:0;color:#93c5fd;font-size:12px;line-height:1.5;">
                  ℹ️ <strong>Período de prueba (Trial):</strong> Al hacer clic en aprobar, el usuario obtendrá acceso completo por <strong>30 días</strong> inmediatamente.
                </p>
              </div>
            </td>
          </tr>
          <!-- FOOTER -->
          <tr>
            <td style="padding:20px 40px;border-top:1px solid #334155;text-align:center;">
              <p style="margin:0;color:#475569;font-size:11px;">
                Sysget Saber © 2026 · Chile · 
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

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `"Sysget Saber" <${SMTP_USER}>`,
      to: ADMIN_EMAIL,
      cc: CC_EMAIL !== ADMIN_EMAIL ? CC_EMAIL : undefined,
      subject: `🔔 Nueva solicitud de acceso: ${fullName} (${establecimiento || 'Establecimiento'})`,
      html: htmlBody,
    });

    console.log('Correo enviado exitosamente vía Gmail SMTP:', info.messageId);

    return res.status(200).json({ success: true, messageId: info.messageId });
  } catch (err: any) {
    console.error('Error al enviar correo por SMTP:', err);
    return res.status(500).json({ error: 'Error al enviar correo por SMTP', detail: String(err?.message || err) });
  }
}
