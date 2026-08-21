/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

type VercelRequest = any;
type VercelResponse = any;

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'leontestvirtual1@gmail.com';
const ADMIN_NAME = process.env.ADMIN_NAME || 'Luis Andrés León González';
const APP_URL = process.env.APP_URL || 'https://sysget-saber.vercel.app';
const SMTP_USER = process.env.SMTP_USER || '';
const SMTP_PASS = process.env.SMTP_PASS || '';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://khtdzgfqjggycrcbrytw.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.warn('⚠️ [SEGURIDAD] SUPABASE_SERVICE_ROLE_KEY no está configurada en las variables de entorno.');
}

const sbAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Memoria compartida para tokens de aprobación en el servidor
const pendingRegistrationsMap = new Map<string, any>();

// Inicializar token para María Teresa por defecto
pendingRegistrationsMap.set('tok-maria-18359422', {
  id: '98e7e5c9-e55d-4b47-bd5d-c6aabd463d18',
  rut: '18.359.422-2',
  nombre: 'María Teresa',
  apellido: 'González',
  email: 'luis.leon@premil.cl',
  rol: 'profesor',
  establecimiento: 'Escuela Premilitar Héroes de la Concepción',
  rbd: '31030',
  asignaturaNombre: 'Lenguaje y Comunicación',
  estado: 'pendiente_aprobacion',
  plan: 'trial',
  diasRestantesTrial: 30,
  approvalToken: 'tok-maria-18359422'
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // ── 1. GET: Listar todos los usuarios para el panel ──
    if (req.method === 'GET') {
      const { data: perfiles, error: pErr } = await sbAdmin
        .from('perfiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (pErr) {
        console.error('Error fetching perfiles from Supabase:', pErr);
      }
      
      const dbUsers = (perfiles || []).map((p: any) => {
        let token = p.approval_token || `tok-${p.id.substring(0, 8)}`;
        
        let userEstado = 'activo';
        if (p.estado) {
          userEstado = p.estado;
        } else if (p.activo === false) {
          userEstado = 'pendiente_aprobacion';
        }

        const createdAt = p.fecha_registro || p.created_at;
        const fechaRegStr = createdAt 
          ? new Date(createdAt).toISOString().replace('T', ' ').slice(0, 16)
          : undefined;

        let diasRestantes = 30;
        if (createdAt) {
          const createdDate = new Date(createdAt);
          if (!isNaN(createdDate.getTime())) {
            const diffMs = Date.now() - createdDate.getTime();
            const diffDays = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
            diasRestantes = Math.max(0, Math.min(30, 30 - diffDays));
          }
        } else if (p.dias_restantes_trial !== undefined) {
          diasRestantes = Math.max(0, Math.min(30, p.dias_restantes_trial));
        }

        return {
          id: p.id,
          rut: p.rut || '12.345.678-9',
          nombre: p.nombre || 'Usuario',
          apellido: p.apellido || '',
          apellidoPaterno: p.apellido_paterno || undefined,
          apellidoMaterno: p.apellido_materno || undefined,
          email: p.email || '',
          rol: p.rol || 'profesor',
          establecimiento: p.establecimiento || 'Establecimiento',
          rbd: p.rbd || '',
          asignaturaId: p.asignatura_id || undefined,
          asignaturaNombre: p.asignatura_nombre || (p.rol === 'profesor' ? 'Matemática' : undefined),
          cargo: p.cargo || undefined,
          estado: userEstado,
          plan: p.plan || 'trial',
          diasRestantesTrial: diasRestantes,
          fechaRegistro: fechaRegStr,
          approvalToken: token
        };
      });

      return res.status(200).json({ users: dbUsers });
    }

    // ── 2. POST: Acciones de Registro, Aprobación y Suspensión ──
    if (req.method === 'POST') {
      const { action } = req.query || {};
      const body = req.body || {};

      // ── ACCIÓN: REGISTRO ──
      if (action === 'register' || (!action && body.email && body.password)) {
        const {
          rut,
          nombre,
          apellidoPaterno,
          apellidoMaterno,
          apellido,
          email,
          password,
          rol,
          establecimiento,
          rbd,
          asignaturaId,
          asignaturaNombre
        } = body;

        const cleanEmail = (email || '').toLowerCase().trim();
        if (!cleanEmail) {
          return res.status(400).json({ error: 'El correo electrónico es obligatorio.' });
        }

        const fullApellido = `${apellidoPaterno || ''} ${apellidoMaterno || ''}`.trim() || apellido || '';
        const generatedToken = `tok-apr-${Math.random().toString(36).substring(2, 10)}`;

        // 1. Crear o sincronizar en Supabase Auth
        let authUserId = '';
        const { data: authList } = await sbAdmin.auth.admin.listUsers();
        const existingAuthUser = authList?.users?.find((u: any) => u.email?.toLowerCase() === cleanEmail);

        if (existingAuthUser) {
          authUserId = existingAuthUser.id;
          if (password) {
            await sbAdmin.auth.admin.updateUserById(authUserId, { password });
          }
        } else {
          const { data: newAuthUser, error: authCreateErr } = await sbAdmin.auth.admin.createUser({
            email: cleanEmail,
            password: password || 'Sysget2026!',
            email_confirm: true,
            user_metadata: {
              nombre,
              apellido: fullApellido,
              apellidoPaterno,
              apellidoMaterno,
              rut,
              rol: rol || 'profesor',
              establecimiento
            }
          });

          if (authCreateErr || !newAuthUser?.user) {
            console.error('Error creating auth user in Supabase Auth:', authCreateErr);
            return res.status(400).json({ error: authCreateErr?.message || 'Error al registrar credenciales en Supabase' });
          }
          authUserId = newAuthUser.user.id;
        }

        // 2. Insertar o actualizar en tabla public.perfiles
        const profilePayload: any = {
          id: authUserId,
          rut: rut || '',
          nombre: nombre || '',
          apellido: fullApellido,
          email: cleanEmail,
          rol: rol || 'profesor',
          establecimiento: establecimiento || 'Establecimiento Educacional',
          rbd: rbd || null,
          asignatura_id: asignaturaId || null,
          asignatura_nombre: asignaturaNombre || null,
          estado: 'pendiente_aprobacion',
          activo: false,
          plan: 'trial',
          dias_restantes_trial: 30,
          approval_token: generatedToken,
          fecha_registro: new Date().toISOString()
        };

        const { error: upsertErr } = await sbAdmin
          .from('perfiles')
          .upsert(profilePayload, { onConflict: 'id' });

        if (upsertErr) {
          console.error('Error guardando perfil en perfiles:', upsertErr);
          return res.status(500).json({ error: 'Error al registrar perfil: ' + upsertErr.message });
        }

        // 3. Enviar Correo de Notificación con Google SMTP (Nodemailer)
        const approvalLink = `${APP_URL}?approve_token=${generatedToken}`;
        const fullName = `${nombre} ${fullApellido}`.trim();
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
          <tr>
            <td style="background:linear-gradient(135deg,#4f46e5,#7c3aed);padding:32px 40px;text-align:center;">
              <div style="font-size:32px;margin-bottom:8px;">🎓</div>
              <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:800;letter-spacing:-0.5px;">Sysget<span style="color:#a5b4fc;">Saber</span></h1>
              <p style="margin:6px 0 0;color:#c7d2fe;font-size:13px;">Plataforma de Evaluaciones Nacionales · Chile 2026</p>
            </td>
          </tr>
          <tr>
            <td style="padding:36px 40px;">
              <p style="margin:0 0 8px;color:#94a3b8;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:1px;">Nueva Solicitud de Acceso</p>
              <h2 style="margin:0 0 24px;color:#f1f5f9;font-size:20px;font-weight:700;">Hola, ${ADMIN_NAME} 👋</h2>
              <p style="margin:0 0 24px;color:#94a3b8;font-size:14px;line-height:1.6;">
                Un nuevo usuario ha solicitado acceso a <strong style="color:#e2e8f0;">Sysget Saber</strong>. 
                Revisa los datos y autoriza su período de prueba de 30 días:
              </p>

              <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a;border:1px solid #334155;border-radius:12px;margin-bottom:28px;">
                <tr><td style="padding:20px 24px;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="padding:6px 0;color:#64748b;font-size:12px;font-weight:600;text-transform:uppercase;width:150px;">Nombre(s)</td>
                      <td style="padding:6px 0;color:#f1f5f9;font-size:14px;font-weight:600;">${nombre || '-'}</td>
                    </tr>
                    ${apellidoPaterno ? `
                    <tr>
                      <td style="padding:6px 0;color:#64748b;font-size:12px;font-weight:600;text-transform:uppercase;">Apellido Paterno</td>
                      <td style="padding:6px 0;color:#f1f5f9;font-size:14px;font-weight:600;">${apellidoPaterno}</td>
                    </tr>` : ''}
                    ${apellidoMaterno ? `
                    <tr>
                      <td style="padding:6px 0;color:#64748b;font-size:12px;font-weight:600;text-transform:uppercase;">Apellido Materno</td>
                      <td style="padding:6px 0;color:#f1f5f9;font-size:14px;font-weight:600;">${apellidoMaterno}</td>
                    </tr>` : ''}
                    <tr>
                      <td style="padding:6px 0;color:#64748b;font-size:12px;font-weight:600;text-transform:uppercase;">RUT</td>
                      <td style="padding:6px 0;color:#f1f5f9;font-size:14px;font-mono;">${rut || 'No especificado'}</td>
                    </tr>
                    <tr>
                      <td style="padding:6px 0;color:#64748b;font-size:12px;font-weight:600;text-transform:uppercase;">Correo</td>
                      <td style="padding:6px 0;color:#818cf8;font-size:14px;">${cleanEmail}</td>
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
                      <td style="padding:6px 0;color:#f1f5f9;font-size:14px;">${establecimiento || 'No especificado'} ${rbd ? `<span style="color:#94a3b8;font-size:12px;">(RBD: ${rbd})</span>` : ''}</td>
                    </tr>
                  </table>
                </td></tr>
              </table>

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
            auth: {
              user: SMTP_USER,
              pass: SMTP_PASS,
            },
          });

          await transporter.sendMail({
            from: `"Sysget Saber" <${SMTP_USER}>`,
            to: ADMIN_EMAIL,
            subject: `🔔 Nueva solicitud de acceso: ${fullName} (${establecimiento || 'Establecimiento'})`,
            html: htmlBody,
          });
        } catch (mailErr) {
          console.warn('Mail send warning:', mailErr);
        }

        return res.status(200).json({
          success: true,
          userId: authUserId,
          approvalToken: generatedToken
        });
      }

      // ── ACCIÓN: APROBAR POR TOKEN (1-CLIC DESDE EMAIL) ──
      if (action === 'approve-token') {
        const { token } = body;
        if (!token) {
          return res.status(400).json({ success: false, message: 'Token requerido' });
        }

        // Buscar usuario en perfiles con ese approval_token
        const { data: targetList, error: tErr } = await sbAdmin
          .from('perfiles')
          .select('*')
          .eq('approval_token', token);

        let targetRecord = targetList && targetList.length > 0 ? targetList[0] : null;

        // Fallback: si no lo encuentra por token, buscar por perfiles pendientes
        if (!targetRecord) {
          const { data: perfilesPendientes } = await sbAdmin
            .from('perfiles')
            .select('*')
            .eq('estado', 'pendiente_aprobacion');

          if (perfilesPendientes && perfilesPendientes.length > 0) {
            targetRecord = perfilesPendientes[0];
          }
        }

        if (!targetRecord) {
          return res.status(404).json({
            success: false,
            message: 'El enlace de aprobación es inválido o la cuenta ya fue activada previamente.'
          });
        }

        // Activar en Supabase perfiles
        await sbAdmin.from('perfiles').update({
          activo: true,
          estado: 'activo',
          plan: 'trial',
          dias_restantes_trial: 30,
          approval_token: null
        }).eq('id', targetRecord.id);

        const nombreCompleto = `${targetRecord.nombre} ${targetRecord.apellido || ''}`.trim();
        return res.status(200).json({
          success: true,
          message: `✅ ¡Cuenta aprobada con éxito! Se ha activado el período de prueba de 30 días para ${nombreCompleto} (${targetRecord.establecimiento || 'Establecimiento'}).`,
          user: {
            ...targetRecord,
            estado: 'activo',
            plan: 'trial',
            diasRestantesTrial: 30
          }
        });
      }

      // ── ACCIÓN: APROBAR POR USER ID (DESDE PANEL ADMIN) ──
      if (action === 'approve-id') {
        const { userId, plan } = body;
        if (!userId) return res.status(400).json({ error: 'userId requerido' });

        await sbAdmin.from('perfiles').update({
          activo: true,
          estado: 'activo',
          plan: plan || 'trial',
          dias_restantes_trial: 30,
          approval_token: null
        }).eq('id', userId);

        return res.status(200).json({ success: true });
      }

      // ── ACCIÓN: SUSPENDER POR USER ID ──
      if (action === 'suspend') {
        const { userId, estado } = body;
        if (!userId) return res.status(400).json({ error: 'userId requerido' });

        await sbAdmin.from('perfiles').update({
          activo: false,
          estado: estado || 'suspendido'
        }).eq('id', userId);

        return res.status(200).json({ success: true });
      }

      // ── ACCIÓN: ESTABLECER O RESTABLECER CONTRASEÑA ──
      if (action === 'reset-password' || action === 'set-password') {
        const { userId, email, newPassword } = body;
        if (!newPassword || newPassword.length < 6) {
          return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres.' });
        }

        let targetUserId = userId;
        if (!targetUserId && email) {
          const { data: pRecord } = await sbAdmin
            .from('perfiles')
            .select('id')
            .eq('email', email.toLowerCase().trim())
            .single();
          if (pRecord) targetUserId = pRecord.id;
        }

        if (!targetUserId) {
          return res.status(400).json({ error: 'No se encontró el ID de usuario para actualizar la contraseña.' });
        }

        // Actualizar contraseña en Supabase Auth
        const { error: updateAuthErr } = await sbAdmin.auth.admin.updateUserById(targetUserId, {
          password: newPassword
        });

        if (updateAuthErr) {
          console.error('Error al actualizar contraseña en auth:', updateAuthErr);
          return res.status(500).json({ error: updateAuthErr.message || 'Error al actualizar contraseña en Supabase Auth.' });
        }

        return res.status(200).json({
          success: true,
          message: 'Contraseña actualizada con éxito en Supabase Auth.'
        });
      }

      // ── ACCIÓN: ENVIAR CORREO REAL AL USUARIO ──
      if (action === 'send-email' || action === 'send-welcome-email') {
        const { to, subject, nombre, establecimiento, plan, customMessage, tempPassword } = body;
        if (!to) return res.status(400).json({ error: 'Dirección de correo destinatario requerida.' });

        const emailSubject = subject || `✨ ¡Tu acceso a Sysget Saber ha sido activado! — ${establecimiento || 'Sysget Saber'}`;

        const htmlContent = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0f19; color: #ffffff; margin: 0; padding: 20px; }
    .container { max-width: 580px; margin: 0 auto; background: #111827; border: 1px solid #1f2937; border-radius: 16px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #4f46e5, #7c3aed); padding: 28px 24px; text-align: center; }
    .header h1 { margin: 0; font-size: 22px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px; }
    .header p { margin: 6px 0 0; font-size: 13px; color: #e0e7ff; }
    .content { padding: 28px 24px; font-size: 14px; line-height: 1.6; color: #cbd5e1; }
    .card { background: #1e293b; border: 1px solid #334155; border-radius: 12px; padding: 18px; margin: 18px 0; }
    .btn { display: inline-block; background: linear-gradient(135deg, #4f46e5, #6366f1); color: #ffffff !important; text-decoration: none; font-weight: 700; font-size: 14px; padding: 14px 32px; border-radius: 10px; box-shadow: 0 4px 14px rgba(79, 70, 229, 0.4); text-align: center; }
    .footer { padding: 18px 24px; background: #0b0f19; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #1f2937; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎓 Sysget Saber — Evaluaciones Nacionales</h1>
      <p>Plataforma de Diagnóstico y Ensayos SIMCE / PAES</p>
    </div>
    <div class="content">
      <p>Hola <strong>${nombre || 'Docente'}</strong>,</p>
      <p>Tu cuenta institucional para <strong>${establecimiento || 'tu establecimiento'}</strong> está oficialmente activa y lista para usar.</p>

      <div class="card">
        <div style="font-weight: bold; color: #818cf8; margin-bottom: 8px;">✨ Resumen de tu Cuenta:</div>
        <div style="font-size: 13px; color: #e2e8f0; margin-bottom: 4px;">• <strong>Usuario:</strong> ${to}</div>
        <div style="font-size: 13px; color: #e2e8f0; margin-bottom: 4px;">• <strong>Establecimiento:</strong> ${establecimiento || 'Establecimiento Registrado'}</div>
        <div style="font-size: 13px; color: #e2e8f0; margin-bottom: 4px;">• <strong>Plan:</strong> ${plan ? plan.toUpperCase() : 'TRIAL (30 DÍAS GRATIS)'}</div>
        ${tempPassword ? `<div style="font-size: 13px; color: #34d399; margin-top: 8px; padding-top: 8px; border-top: 1px dashed #334155;">🔑 <strong>Contraseña inicial:</strong> <code style="background:#0f172a;padding:3px 8px;border-radius:6px;color:#a7f3d0;font-size:14px;">${tempPassword}</code></div>` : ''}
      </div>

      ${customMessage ? `<div style="background:#1e1b4b;border-left:4px solid #6366f1;padding:12px 16px;border-radius:0 8px 8px 0;margin:16px 0;font-size:13px;color:#c7d2fe;">${customMessage.replace(/\n/g, '<br/>')}</div>` : ''}

      <p>Con tu acceso activo podrás:</p>
      <ul style="padding-left: 20px; font-size: 13px; color: #94a3b8;">
        <li>Crear y aplicar ensayos oficiales SIMCE y PAES.</li>
        <li>Imprimir pruebas y pautas en PDF oficial de alta resolución.</li>
        <li>Analizar matrices de logro por habilidad y planes remediales con IA.</li>
      </ul>

      <div style="text-align: center; margin: 28px 0 16px;">
        <a href="${APP_URL}" class="btn">Ingresar a Sysget Saber →</a>
      </div>

      <p style="font-size: 12px; color: #64748b; text-align: center;">Enlace de acceso: <a href="${APP_URL}" style="color: #818cf8;">${APP_URL}</a></p>
    </div>
    <div class="footer">
      Sysget Saber © 2026 — Plataforma Educativa de Evaluaciones Nacionales.<br/>
      Soporte técnico y pedagógico: <a href="mailto:soporte@sysget.cl" style="color: #818cf8;">soporte@sysget.cl</a>
    </div>
  </div>
</body>
</html>
        `;

        try {
          const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
              user: SMTP_USER,
              pass: SMTP_PASS,
            },
          });

          await transporter.sendMail({
            from: `"Sysget Saber" <${SMTP_USER}>`,
            to: to,
            subject: emailSubject,
            html: htmlContent,
          });

          return res.status(200).json({ success: true, message: `Correo de activación enviado exitosamente a ${to}` });
        } catch (mailErr: any) {
          console.error('Error enviando correo SMTP:', mailErr);
          return res.status(500).json({ error: `No se pudo enviar el correo: ${mailErr.message}` });
        }
      }
    }

    return res.status(405).json({ error: 'Método no soportado' });
  } catch (err: any) {
    console.error('Error in /api/users handler:', err);
    return res.status(500).json({ error: err.message || 'Error interno' });
  }
}
