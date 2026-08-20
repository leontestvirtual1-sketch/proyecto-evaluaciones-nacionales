/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

type VercelRequest = any;
type VercelResponse = any;

const ADMIN_EMAIL = 'leontestvirtual1@gmail.com';
const ADMIN_NAME = 'Luis Andrés León González';
const APP_URL = 'https://sysget-saber.vercel.app';
const SMTP_USER = 'leontestvirtual1@gmail.com';
const SMTP_PASS = 'SMTP_PASS_REDACTED';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://khtdzgfqjggycrcbrytw.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtodGR6Z2ZxamdneWNyY2JyeXR3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NjY0OTAzNCwiZXhwIjoyMTAyMjI1MDM0fQ.tfXmF7LU7vDXMikpImMOlsei2kQFwqGSGljHrrMuYFE';

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
          diasRestantesTrial: p.dias_restantes_trial ?? 30,
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
    }

    return res.status(405).json({ error: 'Método no soportado' });
  } catch (err: any) {
    console.error('Error in /api/users handler:', err);
    return res.status(500).json({ error: err.message || 'Error interno' });
  }
}
