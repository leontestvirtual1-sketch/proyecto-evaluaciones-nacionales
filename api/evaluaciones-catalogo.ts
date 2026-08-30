/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * api/evaluaciones-catalogo.ts
 * Endpoint Vercel para el catálogo de evaluaciones SIMCE globales.
 * Acciones:
 *   GET  ?action=catalogo           -> Lista evaluaciones del catálogo (filtrado por asignatura opcional)
 *   GET  ?action=solicitudes        -> Admin: lista todas las solicitudes pendientes
 *   POST ?action=solicitar          -> Docente: solicita acceso a evaluación del catálogo
 *   POST ?action=aprobar            -> Admin: aprueba solicitud y asigna evaluación al docente
 *   POST ?action=rechazar           -> Admin: rechaza solicitud
 *   POST ?action=marcar-catalogo    -> Admin: marca/desmarca evaluación como parte del catálogo
 */
import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";

type VercelRequest = any;
type VercelResponse = any;

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "leontestvirtual1@gmail.com";
const CC_EMAIL = process.env.CC_EMAIL || "luisleong.premil@gmail.com";
const SMTP_USER = process.env.SMTP_USER || "";
const SMTP_PASS = process.env.SMTP_PASS || "";
const APP_URL = process.env.APP_URL || "https://sysget-saber.vercel.app";
const ALLOWED_ORIGIN = APP_URL;

const SUPABASE_URL =
  process.env.VITE_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  "https://khtdzgfqjggycrcbrytw.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

const sbAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// ── Auth helpers ─────────────────────────────────────────────────────────────

async function getAuthUser(req: VercelRequest) {
  const authHeader = req.headers?.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  if (!token) return { user: null, error: "No autorizado: falta token." };
  const {
    data: { user },
    error,
  } = await sbAdmin.auth.getUser(token);
  if (error || !user) return { user: null, error: "Token inválido." };
  return { user, error: null };
}

async function requireAdmin(req: VercelRequest) {
  const { user, error } = await getAuthUser(req);
  if (error || !user) return { ok: false, error };
  const { data: perfil } = await sbAdmin
    .from("perfiles")
    .select("rol")
    .eq("id", user.id)
    .maybeSingle();
  if (perfil?.rol !== "admin") return { ok: false, error: "Se requiere rol admin." };
  return { ok: true, userId: user.id };
}

// ── Email helper ─────────────────────────────────────────────────────────────

async function sendMail(opts: {
  to: string;
  subject: string;
  html: string;
  cc?: string;
}) {
  if (!SMTP_USER || !SMTP_PASS) return;
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
  await transporter.sendMail({
    from: `"Sysget Saber" <${SMTP_USER}>`,
    to: opts.to,
    cc: opts.cc,
    subject: opts.subject,
    html: opts.html,
  });
}

// ── Email templates ──────────────────────────────────────────────────────────

function emailSolicitudAdmin(opts: {
  docenteNombre: string;
  docenteEmail: string;
  establecimiento: string;
  evaluacionTitulo: string;
  asignatura: string;
  solicitudId: string;
  mensaje?: string;
}) {
  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"/><title>Solicitud Catálogo — Sysget Saber</title></head>
<body style="margin:0;padding:0;background:#0f172a;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#1e293b;border-radius:16px;overflow:hidden;border:1px solid #334155;">
        <tr><td style="background:linear-gradient(135deg,#4f46e5,#7c3aed);padding:32px 40px;text-align:center;">
          <h1 style="margin:0;color:#fff;font-size:22px;font-weight:800;">📚 Sysget<span style="color:#a5b4fc;">Saber</span></h1>
          <p style="margin:6px 0 0;color:#c7d2fe;font-size:13px;">Nueva Solicitud de Evaluación del Catálogo</p>
        </td></tr>
        <tr><td style="padding:36px 40px;">
          <h2 style="margin:0 0 16px;color:#f1f5f9;font-size:18px;">Solicitud pendiente de aprobación</h2>
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a;border:1px solid #334155;border-radius:12px;margin-bottom:24px;">
            <tr><td style="padding:20px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr><td style="padding:5px 0;color:#64748b;font-size:12px;font-weight:600;width:160px;">DOCENTE</td><td style="padding:5px 0;color:#f1f5f9;font-size:14px;">${opts.docenteNombre}</td></tr>
                <tr><td style="padding:5px 0;color:#64748b;font-size:12px;font-weight:600;">CORREO</td><td style="padding:5px 0;color:#818cf8;font-size:14px;">${opts.docenteEmail}</td></tr>
                <tr><td style="padding:5px 0;color:#64748b;font-size:12px;font-weight:600;">ESTABLECIMIENTO</td><td style="padding:5px 0;color:#f1f5f9;font-size:14px;">${opts.establecimiento}</td></tr>
                <tr><td style="padding:5px 0;color:#64748b;font-size:12px;font-weight:600;">EVALUACIÓN</td><td style="padding:5px 0;color:#a5b4fc;font-size:14px;font-weight:600;">${opts.evaluacionTitulo}</td></tr>
                <tr><td style="padding:5px 0;color:#64748b;font-size:12px;font-weight:600;">ASIGNATURA</td><td style="padding:5px 0;color:#f1f5f9;font-size:14px;">${opts.asignatura}</td></tr>
                ${opts.mensaje ? `<tr><td style="padding:5px 0;color:#64748b;font-size:12px;font-weight:600;">MENSAJE</td><td style="padding:5px 0;color:#94a3b8;font-size:13px;font-style:italic;">"${opts.mensaje}"</td></tr>` : ""}
              </table>
            </td></tr>
          </table>
          <p style="margin:0;color:#94a3b8;font-size:13px;">Accede al panel de administración para aprobar o rechazar esta solicitud.</p>
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:20px;">
            <tr><td align="center">
              <a href="${APP_URL}" style="display:inline-block;background:linear-gradient(135deg,#4f46e5,#7c3aed);color:#fff;text-decoration:none;font-size:14px;font-weight:700;padding:14px 32px;border-radius:10px;">
                🛡️ Ir al Panel Admin
              </a>
            </td></tr>
          </table>
        </td></tr>
        <tr><td style="padding:20px 40px;border-top:1px solid #334155;text-align:center;">
          <p style="margin:0;color:#475569;font-size:11px;">Sysget Saber © 2026 · Chile · <a href="${APP_URL}" style="color:#6366f1;">${APP_URL}</a></p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

function emailAprobacionDocente(opts: {
  docenteNombre: string;
  evaluacionTitulo: string;
  asignatura: string;
}) {
  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"/><title>Acceso Aprobado — Sysget Saber</title></head>
<body style="margin:0;padding:0;background:#0f172a;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#1e293b;border-radius:16px;overflow:hidden;border:1px solid #334155;">
        <tr><td style="background:linear-gradient(135deg,#10b981,#059669);padding:32px 40px;text-align:center;">
          <div style="font-size:48px;margin-bottom:8px;">✅</div>
          <h1 style="margin:0;color:#fff;font-size:22px;font-weight:800;">¡Acceso Aprobado!</h1>
          <p style="margin:6px 0 0;color:#d1fae5;font-size:13px;">Evaluación del Catálogo SIMCE — Sysget Saber</p>
        </td></tr>
        <tr><td style="padding:36px 40px;">
          <p style="margin:0 0 16px;color:#f1f5f9;font-size:16px;">Hola, <strong>${opts.docenteNombre}</strong> 👋</p>
          <p style="margin:0 0 24px;color:#94a3b8;font-size:14px;line-height:1.6;">
            Tu solicitud de acceso a la evaluación <strong style="color:#e2e8f0;">"${opts.evaluacionTitulo}"</strong> 
            (${opts.asignatura}) ha sido <strong style="color:#10b981;">aprobada</strong>. 
            Ya puedes encontrarla en tu panel de evaluaciones.
          </p>
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td align="center">
              <a href="${APP_URL}" style="display:inline-block;background:linear-gradient(135deg,#4f46e5,#7c3aed);color:#fff;text-decoration:none;font-size:14px;font-weight:700;padding:14px 32px;border-radius:10px;">
                📚 Ver mis Evaluaciones
              </a>
            </td></tr>
          </table>
        </td></tr>
        <tr><td style="padding:20px 40px;border-top:1px solid #334155;text-align:center;">
          <p style="margin:0;color:#475569;font-size:11px;">Sysget Saber © 2026 · Chile</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

// ── Handler ──────────────────────────────────────────────────────────────────

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const origin = req.headers?.origin || "";
  const isAllowed =
    origin === ALLOWED_ORIGIN || origin.startsWith("http://localhost");
  res.setHeader(
    "Access-Control-Allow-Origin",
    isAllowed ? origin : ALLOWED_ORIGIN
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  res.setHeader("Vary", "Origin");

  if (req.method === "OPTIONS") return res.status(200).end();

  const { action } = req.query || {};

  try {
    // ── GET: Catálogo de evaluaciones globales ──────────────────────────────
    if (req.method === "GET" && action === "catalogo") {
      const { asignatura_id } = req.query || {};
      let query = sbAdmin
        .from("evaluaciones")
        .select(
          "id, titulo, descripcion, asignatura_id, nivel, precio_clp, descripcion_catalogo, total_preguntas"
        )
        .eq("es_catalogo", true)
        .order("created_at", { ascending: false });

      if (asignatura_id) {
        query = query.eq("asignatura_id", asignatura_id as string);
      }

      const { data, error } = await query;
      if (error) {
        console.error("Error fetching catalogo:", error);
        return res.status(500).json({ error: "Error al cargar el catálogo." });
      }
      return res.status(200).json({ evaluaciones: data || [] });
    }

    // ── GET: Preguntas de una evaluación de catálogo ────────────────────────
    if (req.method === "GET" && action === "preguntas") {
      const { evaluacion_id } = req.query || {};
      if (!evaluacion_id) return res.status(400).json({ error: "evaluacion_id requerido." });

      const EVAL_PREGUNTA_PREFIX: Record<string, string> = {
        'eval-paes-mat1-2023-f113': 'preg-paes-m1-23-%',
        'eval-paes-lect-2026-f103': 'preg-paes-lec-26-%',
        'eval-diag-ciu-3m-2026': 'preg-ciu3m-diag-%',
        'diag_ciudadana_3m_2026': 'preg-ciu3m-diag-%',
        'eval-simce-mat-6b-ensayo3': 'preg-mat6b-e3-%',
        'eval-simce-mat-6b-e3': 'preg-mat6b-e3-%',
        'eval-simce-mat-2m-ensayo3': 'preg-mat2m-e3-%',
        'eval-simce-mat-2m-e3': 'preg-mat2m-e3-%',
        'eval-simce-lect-2m-ensayo6': 'preg-len2m-e6-%',
        'eval-simce-len-2m-e6': 'preg-len2m-e6-%',
      };

      const prefix = EVAL_PREGUNTA_PREFIX[evaluacion_id as string];
      let query = sbAdmin.from("preguntas").select("*").order("id");
      if (prefix) {
        query = query.ilike("id", prefix);
      } else {
        query = query.or(`fuente.ilike.%${evaluacion_id}%,id.ilike.%${evaluacion_id}%`);
      }

      const { data, error } = await query;
      if (error) {
        console.error("Error fetching preguntas:", error);
        return res.status(500).json({ error: "Error al cargar preguntas." });
      }
      return res.status(200).json({ preguntas: data || [] });
    }

    // ── GET: Lista de solicitudes (solo admin) ──────────────────────────────
    if (req.method === "GET" && action === "solicitudes") {
      const adminCheck = await requireAdmin(req);
      if (!adminCheck.ok) return res.status(403).json({ error: adminCheck.error });

      const { data, error } = await sbAdmin
        .from("solicitudes_evaluacion")
        .select(`
          *,
          evaluaciones(titulo, asignatura_id, nivel),
          perfiles:profesor_id(nombre, apellido, email, establecimiento, rbd, asignatura_nombre)
        `)
        .order("created_at", { ascending: false });

      if (error) {
        return res.status(500).json({ error: "Error al cargar solicitudes." });
      }
      return res.status(200).json({ solicitudes: data || [] });
    }

    // ── POST ────────────────────────────────────────────────────────────────
    if (req.method === "POST") {
      const body = req.body || {};

      // ── Docente solicita evaluación del catálogo ──────────────────────────
      if (action === "solicitar") {
        const { user, error: authErr } = await getAuthUser(req);
        if (authErr || !user) return res.status(401).json({ error: authErr });

        const { evaluacion_id, mensaje } = body;
        if (!evaluacion_id)
          return res.status(400).json({ error: "evaluacion_id es requerido." });

        const { data: result, error: rpcErr } = await sbAdmin.rpc(
          "docente_solicitar_evaluacion",
          { p_evaluacion_id: evaluacion_id, p_mensaje: mensaje || null }
        );

        if (rpcErr) {
          console.error("RPC error:", rpcErr);
          return res.status(500).json({ error: rpcErr.message });
        }

        const rpcResult = result as any;

        // Obtener datos para email
        if (rpcResult?.success) {
          const { data: perfil } = await sbAdmin
            .from("perfiles")
            .select("nombre, apellido, email, establecimiento, asignatura_nombre")
            .eq("id", user.id)
            .maybeSingle();

          const { data: evalData } = await sbAdmin
            .from("evaluaciones")
            .select("titulo, asignatura_id")
            .eq("id", evaluacion_id)
            .maybeSingle();

          try {
            await sendMail({
              to: ADMIN_EMAIL,
              cc: CC_EMAIL !== ADMIN_EMAIL ? CC_EMAIL : undefined,
              subject: `📚 Nueva solicitud de catálogo: ${perfil?.nombre} ${perfil?.apellido} — "${evalData?.titulo}"`,
              html: emailSolicitudAdmin({
                docenteNombre: `${perfil?.nombre || ""} ${perfil?.apellido || ""}`.trim(),
                docenteEmail: perfil?.email || user.email || "",
                establecimiento: perfil?.establecimiento || "",
                evaluacionTitulo: evalData?.titulo || evaluacion_id,
                asignatura: perfil?.asignatura_nombre || evalData?.asignatura_id || "",
                solicitudId: rpcResult.solicitudId || "",
                mensaje: mensaje,
              }),
            });
          } catch (mailErr) {
            console.warn("Mail warning:", mailErr);
          }
        }

        return res.status(200).json(rpcResult);
      }

      // ── Admin aprueba solicitud ───────────────────────────────────────────
      if (action === "aprobar") {
        const adminCheck = await requireAdmin(req);
        if (!adminCheck.ok) return res.status(403).json({ error: adminCheck.error });

        const { solicitud_id, evaluacion_id, profesor_id, curso_id } = body;
        if (!solicitud_id || !evaluacion_id || !profesor_id)
          return res.status(400).json({ error: "Faltan campos requeridos." });

        const { data: result, error: rpcErr } = await sbAdmin.rpc(
          "admin_asignar_evaluacion_a_docente",
          {
            p_solicitud_id: solicitud_id,
            p_evaluacion_id: evaluacion_id,
            p_profesor_id: profesor_id,
            p_curso_id: curso_id || null,
          }
        );

        if (rpcErr) return res.status(500).json({ error: rpcErr.message });

        const rpcResult = result as any;

        // Enviar email de confirmación al docente
        if (rpcResult?.success) {
          const { data: perfil } = await sbAdmin
            .from("perfiles")
            .select("nombre, apellido, email, asignatura_nombre")
            .eq("id", profesor_id)
            .maybeSingle();

          const { data: evalData } = await sbAdmin
            .from("evaluaciones")
            .select("titulo, asignatura_id")
            .eq("id", evaluacion_id)
            .maybeSingle();

          try {
            if (perfil?.email) {
              await sendMail({
                to: perfil.email,
                subject: `✅ Acceso aprobado: "${evalData?.titulo}" — Sysget Saber`,
                html: emailAprobacionDocente({
                  docenteNombre: `${perfil?.nombre || ""} ${perfil?.apellido || ""}`.trim(),
                  evaluacionTitulo: evalData?.titulo || "",
                  asignatura: perfil?.asignatura_nombre || evalData?.asignatura_id || "",
                }),
              });
            }
            // CC al admin sobre la aprobación
            await sendMail({
              to: ADMIN_EMAIL,
              cc: CC_EMAIL !== ADMIN_EMAIL ? CC_EMAIL : undefined,
              subject: `✅ Solicitud aprobada: ${rpcResult.docenteNombre} — "${evalData?.titulo}"`,
              html: `<p>La solicitud de <strong>${rpcResult.docenteNombre}</strong> para la evaluación <strong>"${evalData?.titulo}"</strong> fue aprobada correctamente.</p>`,
            });
          } catch (mailErr) {
            console.warn("Mail warning:", mailErr);
          }
        }

        return res.status(200).json(rpcResult);
      }

      // ── Admin rechaza solicitud ───────────────────────────────────────────
      if (action === "rechazar") {
        const adminCheck = await requireAdmin(req);
        if (!adminCheck.ok) return res.status(403).json({ error: adminCheck.error });

        const { solicitud_id, motivo } = body;
        if (!solicitud_id) return res.status(400).json({ error: "solicitud_id requerido." });

        const { data: result, error: rpcErr } = await sbAdmin.rpc(
          "admin_rechazar_solicitud_evaluacion",
          { p_solicitud_id: solicitud_id, p_motivo: motivo || null }
        );

        if (rpcErr) return res.status(500).json({ error: rpcErr.message });
        return res.status(200).json(result);
      }

      // ── Admin marca/desmarca evaluación como catálogo ─────────────────────
      if (action === "marcar-catalogo") {
        const adminCheck = await requireAdmin(req);
        if (!adminCheck.ok) return res.status(403).json({ error: adminCheck.error });

        const {
          evaluacion_id,
          es_catalogo,
          precio_clp,
          descripcion_catalogo,
        } = body;
        if (!evaluacion_id)
          return res.status(400).json({ error: "evaluacion_id requerido." });

        const updates: any = {
          es_catalogo: Boolean(es_catalogo),
          updated_at: new Date().toISOString(),
        };
        if (precio_clp !== undefined) updates.precio_clp = Number(precio_clp);
        if (descripcion_catalogo !== undefined)
          updates.descripcion_catalogo = descripcion_catalogo;

        const { error: updateErr } = await sbAdmin
          .from("evaluaciones")
          .update(updates)
          .eq("id", evaluacion_id);

        if (updateErr)
          return res.status(500).json({ error: updateErr.message });

        return res.status(200).json({
          success: true,
          message: `Evaluación ${es_catalogo ? "agregada al" : "removida del"} catálogo.`,
        });
      }

      return res.status(400).json({ error: "Acción no reconocida." });
    }

    return res.status(405).json({ error: "Método no soportado." });
  } catch (err: any) {
    console.error("Error en evaluaciones-catalogo:", err);
    return res.status(500).json({ error: "Error interno del servidor." });
  }
}
