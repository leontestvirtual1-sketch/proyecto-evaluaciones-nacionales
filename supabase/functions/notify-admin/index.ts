// ============================================================
// Sysget Saber — Edge Function: notify-admin
// Envía un correo al Super Admin cuando un usuario se registra
// Servicio: Google SMTP (Gmail) vía Nodemailer — $0 Costo
// Remitente: Sysget Saber <leontestvirtual1@gmail.com>
// ============================================================

import nodemailer from 'npm:nodemailer@6.9.13';

const ADMIN_EMAIL = 'leontestvirtual1@gmail.com';
const ADMIN_NAME = 'Luis Andrés León González';
const APP_URL = 'https://sysget-saber.vercel.app';

Deno.serve(async (req: Request) => {
  // CORS para llamadas desde el frontend
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Authorization, Content-Type',
      },
    });
  }

  try {
    const SMTP_USER = Deno.env.get('SMTP_USER') || '';
    const SMTP_PASS = Deno.env.get('SMTP_PASS') || '';
    const SMTP_HOST = Deno.env.get('SMTP_HOST') || 'smtp.gmail.com';
    const SMTP_PORT = parseInt(Deno.env.get('SMTP_PORT') || '465', 10);

    // Parsear datos del nuevo usuario desde el frontend
    const body = await req.json();
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
    } = body;

    const approvalLink = `${APP_URL}?approve_token=${approvalToken}`;
    const fullName = `${nombre} ${apellido}`;
    const rolLabel = rol === 'profesor' ? '👨‍🏫 Docente' : rol === 'admin' ? '🛡️ Administrador' : '👤 Alumno';

    // ── Plantilla HTML del correo ──────────────────────────────
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
                Revisa los datos y aprueba o rechaza la solicitud:
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
                      <td style="padding:6px 0;color:#f1f5f9;font-size:14px;">${rut}</td>
                    </tr>
                    <tr>
                      <td style="padding:6px 0;color:#64748b;font-size:12px;font-weight:600;text-transform:uppercase;">Correo</td>
                      <td style="padding:6px 0;color:#818cf8;font-size:14px;">${email}</td>
                    </tr>
                    <tr>
                      <td style="padding:6px 0;color:#64748b;font-size:12px;font-weight:600;text-transform:uppercase;">Rol Solicitado</td>
                      <td style="padding:6px 0;color:#f1f5f9;font-size:14px;">${rolLabel}</td>
                    </tr>
                    ${asignaturaNombre ? `
                    <tr>
                      <td style="padding:6px 0;color:#64748b;font-size:12px;font-weight:600;text-transform:uppercase;">Especialidad</td>
                      <td style="padding:6px 0;color:#a5b4fc;font-size:14px;font-weight:600;">${asignaturaNombre}</td>
                    </tr>` : ''}
                    <tr>
                      <td style="padding:6px 0;color:#64748b;font-size:12px;font-weight:600;text-transform:uppercase;">Establecimiento</td>
                      <td style="padding:6px 0;color:#f1f5f9;font-size:14px;">${establecimiento} ${rbd ? `<span style="color:#94a3b8;font-size:12px;">(RBD: ${rbd})</span>` : ''}</td>
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
                      ✅ Aprobar Acceso con 1 Clic
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
                  ℹ️ <strong>Período de prueba (Trial):</strong> Al aprobar, el usuario obtendrá acceso completo por <strong>30 días</strong>. 
                  Podrás gestionar su plan desde el panel <strong>Gestión de Usuarios</strong>.
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
              <p style="margin:6px 0 0;color:#334155;font-size:10px;">Este correo fue generado automáticamente al recibir una solicitud de registro.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    // ── Enviar via Google SMTP (Nodemailer) ──────────────────────
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465, // true para 465, false para otros
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `"Sysget Saber" <${SMTP_USER}>`,
      to: ADMIN_EMAIL,
      subject: `🔔 Nueva solicitud de acceso: ${fullName} (${establecimiento})`,
      html: htmlBody,
    });

    console.log('Correo enviado exitosamente vía Gmail SMTP:', info.messageId);

    return new Response(
      JSON.stringify({ success: true, messageId: info.messageId }),
      { status: 200, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
    );

  } catch (err) {
    console.error('Edge Function SMTP error:', err);
    return new Response(
      JSON.stringify({ error: 'Error al enviar correo por SMTP', detail: String(err) }),
      { status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
    );
  }
});
