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
  Filter,
  Sparkles
} from "lucide-react";

interface AdminCatalogoPanelProps {
  authToken?: string;
  onToast?: (msg: string) => void;
}

export type TipoCategoriaFiltro = "todos" | "diagnosticas" | "simce" | "paes";

export function getTipoEvaluacion(titulo: string): { label: string; bg: string; text: string; dot: string; categoria: "diagnosticas" | "simce" | "paes" | "otra" } {
  const t = (titulo || "").toLowerCase();
  if (t.includes("diagnóstic") || t.includes("diagnost") || t.includes("oa")) {
    return {
      label: "Diagnóstica",
      bg: "bg-emerald-500/10 border-emerald-500/30",
      text: "text-emerald-400",
      dot: "bg-emerald-400",
      categoria: "diagnosticas"
    };
  }
  if (t.includes("simce")) {
    return {
      label: "SIMCE",
      bg: "bg-blue-500/10 border-blue-500/30",
      text: "text-blue-400",
      dot: "bg-blue-400",
      categoria: "simce"
    };
  }
  if (t.includes("paes")) {
    return {
      label: "PAES",
      bg: "bg-purple-500/10 border-purple-500/30",
      text: "text-purple-400",
      dot: "bg-purple-400",
      categoria: "paes"
    };
  }
  return {
    label: "Estandarizada",
    bg: "bg-indigo-500/10 border-indigo-500/30",
    text: "text-indigo-400",
    dot: "bg-indigo-400",
    categoria: "otra"
  };
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
  const [categoriaFiltro, setCategoriaFiltro] = useState<TipoCategoriaFiltro>("todos");
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

  const handleAprobar = async (sol: SolicitudEvaluacion) => {
    setIsProcessing(sol.id);
    try {
      const headers = await getHeaders();
      const res = await fetch("/api/evaluaciones-catalogo?action=aprobar", {
        method: "POST",
        headers,
        body: JSON.stringify({ solicitudId: sol.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al aprobar");

      showToast("ok", `Evaluación aprobada y asignada a ${sol.docenteNombre || "el docente"}`);
      setSolicitudes((prev) =>
        prev.map((s) => (s.id === sol.id ? { ...s, estado: "aprobada" } : s))
      );
    } catch (e: any) {
      showToast("err", e.message || "No se pudo aprobar la solicitud");
    } finally {
      setIsProcessing(null);
    }
  };

  const handleRechazar = async (sol: SolicitudEvaluacion) => {
    const motivo = prompt("Motivo del rechazo (opcional):") || undefined;
    setIsProcessing(sol.id);
    try {
      const headers = await getHeaders();
      const res = await fetch("/api/evaluaciones-catalogo?action=rechazar", {
        method: "POST",
        headers,
        body: JSON.stringify({ solicitudId: sol.id, motivo }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al rechazar");

      showToast("ok", "Solicitud rechazada");
      setSolicitudes((prev) =>
        prev.map((s) => (s.id === sol.id ? { ...s, estado: "rechazada" } : s))
      );
    } catch (e: any) {
      showToast("err", e.message || "No se pudo rechazar la solicitud");
    } finally {
      setIsProcessing(null);
    }
  };

  const handleToggleCatalogo = async (ev: EvaluacionCatalogo, esCatalogo: boolean) => {
    setIsProcessing(ev.id);
    try {
      const headers = await getHeaders();
      const res = await fetch("/api/evaluaciones-catalogo?action=marcar-catalogo", {
        method: "POST",
        headers,
        body: JSON.stringify({ evaluacionId: ev.id, esCatalogo }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al actualizar catálogo");

      showToast("ok", esCatalogo ? "Evaluación añadida al catálogo" : "Evaluación retirada del catálogo");
      if (!esCatalogo) {
        setEvalsSinAsignar((prev) => prev.filter((e) => e.id !== ev.id));
      }
    } catch (e: any) {
      showToast("err", e.message || "No se pudo modificar el catálogo");
    } finally {
      setIsProcessing(null);
    }
  };

  const estadoBadge = (estado: string) => {
    switch (estado) {
      case "pendiente":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full">
            <Clock size={11} /> Pendiente
          </span>
        );
      case "aprobada":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">
            <CheckCircle2 size={11} /> Aprobada
          </span>
        );
      case "rechazada":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded-full">
            <XCircle size={11} /> Rechazada
          </span>
        );
      default:
        return null;
    }
  };

  const pendientes = solicitudes.filter((s) => s.estado === "pendiente");
  const resueltas = solicitudes.filter((s) => s.estado !== "pendiente");

  // Filtrado de evaluaciones de catálogo por categoría
  const evalsFiltradas = evalsSinAsignar.filter((ev) => {
    if (categoriaFiltro === "todos") return true;
    const tipo = getTipoEvaluacion(ev.titulo);
    return tipo.categoria === categoriaFiltro;
  });

  const conteoDiagnosticas = evalsSinAsignar.filter(e => getTipoEvaluacion(e.titulo).categoria === "diagnosticas").length;
  const conteoSimce = evalsSinAsignar.filter(e => getTipoEvaluacion(e.titulo).categoria === "simce").length;
  const conteoPaes = evalsSinAsignar.filter(e => getTipoEvaluacion(e.titulo).categoria === "paes").length;

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
          <h3 className="text-base font-bold text-white">Catálogo de Evaluaciones Nacionales</h3>
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

      {/* Main Tabs */}
      <div className="flex gap-1 mb-4 bg-slate-800/60 p-1 rounded-xl">
        {(["solicitudes", "catalogo"] as const).map((tab) => (
          <button
            key={tab}
            id={`tab-catalogo-${tab}`}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${activeTab === tab ? "bg-indigo-600 text-white shadow" : "text-slate-400 hover:text-white"}`}
          >
            {tab === "solicitudes" ? `📋 Solicitudes Docentes${pendientes.length > 0 ? ` (${pendientes.length})` : ""}` : `📚 Evaluaciones en Catálogo (${evalsSinAsignar.length})`}
          </button>
        ))}
      </div>

      {/* Sub-filtros por Tipo de Evaluación cuando está en tab Catálogo */}
      {activeTab === "catalogo" && !isLoading && (
        <div className="flex items-center gap-1.5 mb-3 overflow-x-auto pb-1">
          <button
            onClick={() => setCategoriaFiltro("todos")}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all shrink-0 ${
              categoriaFiltro === "todos"
                ? "bg-indigo-600 text-white shadow"
                : "bg-slate-800/80 text-slate-400 hover:text-white border border-slate-700/60"
            }`}
          >
            Todos ({evalsSinAsignar.length})
          </button>

          <button
            onClick={() => setCategoriaFiltro("diagnosticas")}
            className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 ${
              categoriaFiltro === "diagnosticas"
                ? "bg-emerald-600 text-white shadow"
                : "bg-slate-800/80 text-slate-400 hover:text-emerald-300 border border-slate-700/60"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Evaluaciones Diagnósticas ({conteoDiagnosticas})
          </button>

          <button
            onClick={() => setCategoriaFiltro("simce")}
            className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 ${
              categoriaFiltro === "simce"
                ? "bg-blue-600 text-white shadow"
                : "bg-slate-800/80 text-slate-400 hover:text-blue-300 border border-slate-700/60"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-blue-400" />
            Ensayos SIMCE ({conteoSimce})
          </button>

          {conteoPaes > 0 && (
            <button
              onClick={() => setCategoriaFiltro("paes")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 ${
                categoriaFiltro === "paes"
                  ? "bg-purple-600 text-white shadow"
                  : "bg-slate-800/80 text-slate-400 hover:text-purple-300 border border-slate-700/60"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-purple-400" />
              Ensayos PAES ({conteoPaes})
            </button>
          )}
        </div>
      )}

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
                  <p className="text-[11px] font-semibold text-amber-400 uppercase tracking-wide">⏳ Pendientes de Aprobación</p>
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
          {evalsFiltradas.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <BookMarked size={28} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">No hay evaluaciones en esta categoría</p>
              <p className="text-xs mt-1">Las evaluaciones sin docente asignado aparecerán aquí</p>
            </div>
          ) : (
            evalsFiltradas.map((ev) => {
              const tipo = getTipoEvaluacion(ev.titulo);
              return (
                <div key={ev.id} className="bg-slate-800/60 border border-slate-700 rounded-xl p-3.5 flex items-start gap-3 hover:border-slate-600 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="text-sm font-semibold text-white truncate">{ev.titulo}</p>
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${tipo.bg} ${tipo.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${tipo.dot}`} />
                        {tipo.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <span className="text-[11px] text-slate-400">{ev.nivel}</span>
                      <span className="text-[11px] text-slate-500">·</span>
                      <span className="text-[11px] text-slate-400">{ev.totalPreguntas} preguntas</span>
                      <span className="text-[11px] text-slate-500">·</span>
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
                    className="text-indigo-400 hover:text-red-400 transition-colors mt-0.5"
                  >
                    {isProcessing === ev.id ? <Loader2 size={16} className="animate-spin" /> : <ToggleRight size={20} />}
                  </button>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default AdminCatalogoPanel;
