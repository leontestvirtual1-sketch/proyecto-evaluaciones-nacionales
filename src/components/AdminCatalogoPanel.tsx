import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabaseClient";
import { SolicitudEvaluacion, EvaluacionCatalogo } from "../types";
import {
  BookMarked,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  RefreshCw,
  ToggleLeft,
  ToggleRight,
  Tag,
  AlertCircle,
  Send,
} from "lucide-react";

interface AdminCatalogoPanelProps {
  authToken?: string;
  onToast?: (msg: string) => void;
}

export const AdminCatalogoPanel: React.FC<AdminCatalogoPanelProps> = ({
  authToken,
  onToast,
}) => {
  const [solicitudes, setSolicitudes] = useState<SolicitudEvaluacion[]>([]);
  const [evalsSinAsignar, setEvalsSinAsignar] = useState<EvaluacionCatalogo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"solicitudes" | "catalogo">("solicitudes");
  const [toast, setToast] = useState<{ type: "ok" | "err"; msg: string } | null>(null);

  const showToast = (type: "ok" | "err", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4500);
    onToast?.(msg);
  };

  const getHeaders = async () => {
    let token = authToken;
    if (!token) {
      const session = (await supabase.auth.getSession()).data.session;
      token = session?.access_token || "";
    }
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const headers = await getHeaders();
      const [solRes, catRes] = await Promise.all([
        fetch("/api/evaluaciones-catalogo?action=solicitudes", { headers }),
        fetch("/api/evaluaciones-catalogo?action=catalogo", { headers }),
      ]);

      const solData = solRes.ok ? await solRes.json() : { solicitudes: [] };
      const catData = catRes.ok ? await catRes.json() : { evaluaciones: [] };

      setSolicitudes(
        (solData.solicitudes || []).map((s: any) => ({
          id: s.id,
          evaluacionId: s.evaluacion_id,
          evaluacionTitulo: s.evaluaciones?.titulo,
          asignatura: s.evaluaciones?.asignatura_id,
          profesorId: s.profesor_id,
          docenteNombre: s.perfiles ? `${s.perfiles.nombre} ${s.perfiles.apellido}`.trim() : "",
          docenteEmail: s.perfiles?.email,
          establecimiento: s.perfiles?.establecimiento || s.establecimiento,
          rbd: s.perfiles?.rbd || s.rbd,
          mensaje: s.mensaje,
          estado: s.estado,
          createdAt: s.created_at,
        }))
      );

      // Evaluaciones en catálogo (para gestión)
      setEvalsSinAsignar(
        (catData.evaluaciones || []).map((e: any) => ({
          id: e.id,
          titulo: e.titulo,
          descripcion: e.descripcion,
          asignaturaId: e.asignatura_id,
          nivel: e.nivel,
          precioCLP: e.precio_clp ?? 0,
          descripcionCatalogo: e.descripcion_catalogo,
          totalPreguntas: e.total_preguntas ?? 0,
        }))
      );
    } catch (e) {
      console.error("Error loading catalogo admin data:", e);
    } finally {
      setIsLoading(false);
    }
  }, [authToken]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAprobar = async (s: SolicitudEvaluacion) => {
    setIsProcessing(s.id);
    try {
      const headers = await getHeaders();
      const res = await fetch("/api/evaluaciones-catalogo?action=aprobar", {
        method: "POST",
        headers,
        body: JSON.stringify({
          solicitud_id: s.id,
          evaluacion_id: s.evaluacionId,
          profesor_id: s.profesorId,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("ok", `✅ Evaluación asignada a ${s.docenteNombre}`);
        await loadData();
      } else {
        showToast("err", `❌ ${data.message || "Error al aprobar"}`);
      }
    } finally {
      setIsProcessing(null);
    }
  };

  const handleRechazar = async (s: SolicitudEvaluacion) => {
    setIsProcessing(s.id);
    try {
      const headers = await getHeaders();
      const res = await fetch("/api/evaluaciones-catalogo?action=rechazar", {
        method: "POST",
        headers,
        body: JSON.stringify({ solicitud_id: s.id }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("ok", "Solicitud rechazada.");
        await loadData();
      } else {
        showToast("err", `❌ ${data.message}`);
      }
    } finally {
      setIsProcessing(null);
    }
  };

  const handleToggleCatalogo = async (ev: EvaluacionCatalogo, newVal: boolean) => {
    setIsProcessing(ev.id);
    try {
      const headers = await getHeaders();
      const res = await fetch("/api/evaluaciones-catalogo?action=marcar-catalogo", {
        method: "POST",
        headers,
        body: JSON.stringify({ evaluacion_id: ev.id, es_catalogo: newVal }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("ok", data.message);
        await loadData();
      } else {
        showToast("err", `❌ ${data.error}`);
      }
    } finally {
      setIsProcessing(null);
    }
  };

  const pendientes = solicitudes.filter((s) => s.estado === "pendiente");
  const resueltas = solicitudes.filter((s) => s.estado !== "pendiente");

  const estadoBadge = (estado: string) => {
    const conf: Record<string, { label: string; cls: string }> = {
      pendiente: { label: "Pendiente", cls: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30" },
      aprobada: { label: "Aprobada", cls: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" },
      rechazada: { label: "Rechazada", cls: "bg-red-500/20 text-red-300 border-red-500/30" },
    };
    const c = conf[estado] || conf.pendiente;
    return (
      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${c.cls}`}>
        {c.label}
      </span>
    );
  };

  return (
    <div className="relative">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl text-sm font-semibold shadow-lg border ${toast.type === "ok" ? "bg-emerald-900/90 border-emerald-500/40 text-emerald-200" : "bg-red-900/90 border-red-500/40 text-red-200"}`}>
          {toast.msg}
        </div>
      )}

      {/* Panel Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BookMarked size={18} className="text-indigo-400" />
          <h3 className="text-base font-bold text-white">Catálogo SIMCE</h3>
          {pendientes.length > 0 && (
            <span className="bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
              {pendientes.length}
            </span>
          )}
        </div>
        <button
          id="btn-refresh-catalogo"
          onClick={loadData}
          disabled={isLoading}
          className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
          aria-label="Actualizar"
        >
          <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 bg-slate-800/60 p-1 rounded-xl">
        {(["solicitudes", "catalogo"] as const).map((tab) => (
          <button
            key={tab}
            id={`tab-catalogo-${tab}`}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${activeTab === tab ? "bg-indigo-600 text-white shadow" : "text-slate-400 hover:text-white"}`}
          >
            {tab === "solicitudes" ? `📋 Solicitudes${pendientes.length > 0 ? ` (${pendientes.length})` : ""}` : "📚 En Catálogo"}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10 text-slate-500">
          <Loader2 size={20} className="animate-spin" />
        </div>
      ) : activeTab === "solicitudes" ? (
        <div className="space-y-3">
          {solicitudes.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <Send size={28} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">No hay solicitudes aún</p>
            </div>
          ) : (
            <>
              {pendientes.length > 0 && (
                <div className="space-y-2">
                  <p className="text-[11px] font-semibold text-amber-400 uppercase tracking-wide">⏳ Pendientes</p>
                  {pendientes.map((s) => (
                    <div key={s.id} className="bg-slate-800/80 border border-amber-700/30 rounded-xl p-4 hover:border-amber-600/50 transition-colors">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-white truncate">{s.docenteNombre}</p>
                          <p className="text-xs text-slate-400 truncate">{s.docenteEmail}</p>
                          <p className="text-xs text-indigo-400 font-medium mt-0.5 truncate">🎓 {s.evaluacionTitulo}</p>
                          <p className="text-xs text-slate-500 truncate">📍 {s.establecimiento}</p>
                          {s.mensaje && (
                            <p className="text-xs text-slate-400 italic mt-1 line-clamp-2">"{s.mensaje}"</p>
                          )}
                        </div>
                        {estadoBadge(s.estado)}
                      </div>
                      <div className="flex gap-2 mt-3">
                        <button
                          id={`btn-rechazar-${s.id}`}
                          onClick={() => handleRechazar(s)}
                          disabled={isProcessing === s.id}
                          className="flex-1 py-1.5 rounded-lg bg-red-900/30 border border-red-700/30 text-red-400 hover:bg-red-800/40 text-xs font-semibold flex items-center justify-center gap-1 transition-colors disabled:opacity-50"
                        >
                          <XCircle size={13} /> Rechazar
                        </button>
                        <button
                          id={`btn-aprobar-${s.id}`}
                          onClick={() => handleAprobar(s)}
                          disabled={isProcessing === s.id}
                          className="flex-1 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold flex items-center justify-center gap-1 transition-colors disabled:opacity-50"
                        >
                          {isProcessing === s.id ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle2 size={13} />}
                          Aprobar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {resueltas.length > 0 && (
                <div className="space-y-2 mt-4">
                  <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Resueltas</p>
                  {resueltas.map((s) => (
                    <div key={s.id} className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-3 flex items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-300 truncate">{s.docenteNombre}</p>
                        <p className="text-xs text-slate-500 truncate">{s.evaluacionTitulo}</p>
                      </div>
                      {estadoBadge(s.estado)}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        /* Tab: Catálogo */
        <div className="space-y-2">
          {evalsSinAsignar.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <BookMarked size={28} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">No hay evaluaciones en el catálogo</p>
              <p className="text-xs mt-1">Las evaluaciones sin docente asignado aparecerán aquí</p>
            </div>
          ) : (
            evalsSinAsignar.map((ev) => (
              <div key={ev.id} className="bg-slate-800/60 border border-slate-700 rounded-xl p-3 flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{ev.titulo}</p>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    <span className="text-[10px] text-slate-500">{ev.nivel}</span>
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${ev.precioCLP === 0 ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"}`}>
                      <Tag size={8} className="inline mr-0.5" />
                      {ev.precioCLP === 0 ? "Gratuita" : `$${ev.precioCLP.toLocaleString("es-CL")}`}
                    </span>
                  </div>
                </div>
                <button
                  id={`btn-toggle-catalogo-${ev.id}`}
                  onClick={() => handleToggleCatalogo(ev, false)}
                  disabled={isProcessing === ev.id}
                  title="Quitar del catálogo"
                  className="text-indigo-400 hover:text-red-400 transition-colors"
                >
                  {isProcessing === ev.id ? <Loader2 size={16} className="animate-spin" /> : <ToggleRight size={20} />}
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AdminCatalogoPanel;
