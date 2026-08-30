import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabaseClient";
import { EvaluacionCatalogo, SolicitudEvaluacion, UserProfile } from "../types";
import { getTipoEvaluacion, TipoCategoriaFiltro } from "./AdminCatalogoPanel";
import {
  BookOpen,
  X,
  Search,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Send,
  Loader2,
  Tag,
  Star,
  BookMarked,
  MessageSquare,
  Eye
} from "lucide-react";
import { CatalogoDetalleModal } from "./CatalogoDetalleModal";

interface CatalogoEvaluacionesModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
}

const PLAN_LIMITS: Record<string, number> = {
  free: 0,
  trial: 2,
  pro: 5,
  institucional: 999,
};

export const CatalogoEvaluacionesModal: React.FC<CatalogoEvaluacionesModalProps> = ({
  isOpen,
  onClose,
  currentUser,
}) => {
  const [catalogo, setCatalogo] = useState<EvaluacionCatalogo[]>([]);
  const [misSolicitudes, setMisSolicitudes] = useState<SolicitudEvaluacion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState<TipoCategoriaFiltro>("todos");
  const [selectedEval, setSelectedEval] = useState<EvaluacionCatalogo | null>(null);
  const [mensaje, setMensaje] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [toast, setToast] = useState<{ type: "ok" | "err"; msg: string } | null>(null);
  const [previewEval, setPreviewEval] = useState<EvaluacionCatalogo | null>(null);

  const showToast = (type: "ok" | "err", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4500);
  };

  const loadData = useCallback(async () => {
    if (!isOpen) return;
    setIsLoading(true);
    try {
      // Fetch catálogo filtrado por asignatura del docente
      const params = new URLSearchParams({ action: "catalogo" });
      if (currentUser.asignaturaId) params.set("asignatura_id", currentUser.asignaturaId);

      const session = (await supabase.auth.getSession()).data.session;
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (session?.access_token) headers["Authorization"] = `Bearer ${session.access_token}`;

      const [catRes, solRes] = await Promise.all([
        fetch(`/api/evaluaciones-catalogo?${params}`, { headers }),
        supabase
          .from("solicitudes_evaluacion")
          .select("id, evaluacion_id, estado, created_at, mensaje")
          .eq("profesor_id", currentUser.id)
          .order("created_at", { ascending: false }),
      ]);

      const catData = catRes.ok ? await catRes.json() : { evaluaciones: [] };
      setCatalogo(
        (catData.evaluaciones || []).map((e: any) => ({
          id: e.id,
          titulo: e.titulo,
          descripcion: e.descripcion,
          asignaturaId: e.asignatura_id,
          nivel: e.nivel,
          precioCLP: e.precio_clp ?? 0,
          descripcionCatalogo: e.descripcion_catalogo,
          totalPreguntas: e.total_preguntas ?? (Array.isArray(e.pregunta_ids) ? e.pregunta_ids.length : 0),
        }))
      );

      const solRows = solRes.data || [];
      setMisSolicitudes(
        solRows.map((s: any) => ({
          id: s.id,
          evaluacionId: s.evaluacion_id,
          estado: s.estado,
          createdAt: s.created_at,
          mensaje: s.mensaje,
          establecimiento: currentUser.establecimiento || "",
          profesorId: currentUser.id,
        }))
      );
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [isOpen, currentUser.id, currentUser.asignaturaId, currentUser.establecimiento]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const plan = currentUser.plan || "free";
  const planLimit = PLAN_LIMITS[plan] ?? 0;
  const aprobadas = misSolicitudes.filter((s) => s.estado === "aprobada").length;

  const getSolicitudEstado = (evalId: string): "ninguna" | "pendiente" | "aprobada" | "rechazada" => {
    const sol = misSolicitudes.find((s) => s.evaluacionId === evalId);
    return sol ? (sol.estado as any) : "ninguna";
  };

  const handleSolicitar = async () => {
    if (!selectedEval) return;
    setIsSending(true);
    try {
      const session = (await supabase.auth.getSession()).data.session;
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (session?.access_token) headers["Authorization"] = `Bearer ${session.access_token}`;

      const res = await fetch("/api/evaluaciones-catalogo?action=solicitar", {
        method: "POST",
        headers,
        body: JSON.stringify({
          evaluacionId: selectedEval.id,
          mensaje: mensaje.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al enviar solicitud");

      showToast("ok", "¡Solicitud enviada! El administrador la revisará pronto.");
      setMisSolicitudes((prev) => [
        {
          id: data.solicitud?.id || `sol-${Date.now()}`,
          evaluacionId: selectedEval.id,
          estado: "pendiente",
          createdAt: new Date().toISOString(),
          mensaje,
          establecimiento: currentUser.establecimiento || "",
          profesorId: currentUser.id,
        },
        ...prev,
      ]);
      setSelectedEval(null);
      setMensaje("");
    } catch (e: any) {
      showToast("err", e.message || "No se pudo enviar la solicitud");
    } finally {
      setIsSending(false);
    }
  };

  const filtered = catalogo.filter((e) => {
    const matchesSearch = e.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.descripcion || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.nivel.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;
    if (categoriaFiltro === "todos") return true;
    const tipo = getTipoEvaluacion(e.titulo);
    return tipo.categoria === categoriaFiltro;
  });

  const conteoDiag = catalogo.filter(e => getTipoEvaluacion(e.titulo).categoria === "diagnosticas").length;
  const conteoSimce = catalogo.filter(e => getTipoEvaluacion(e.titulo).categoria === "simce").length;
  const conteoPaes = catalogo.filter(e => getTipoEvaluacion(e.titulo).categoria === "paes").length;

  const estadoBadge = (estado: string) => {
    switch (estado) {
      case "pendiente":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full">
            <Clock size={11} /> Solicitud pendiente
          </span>
        );
      case "aprobada":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">
            <CheckCircle2 size={11} /> Asignada a tus evaluaciones
          </span>
        );
      case "rechazada":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded-full">
            <AlertCircle size={11} /> Solicitud rechazada
          </span>
        );
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="catalogo-title">
      <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col bg-slate-900 rounded-2xl border border-slate-700 shadow-2xl overflow-hidden">
        {/* Toast */}
        {toast && (
          <div className={`absolute top-4 left-1/2 -translate-x-1/2 z-10 px-4 py-2.5 rounded-xl text-sm font-semibold shadow-lg border ${toast.type === "ok" ? "bg-emerald-900/90 border-emerald-500/40 text-emerald-200" : "bg-red-900/90 border-red-500/40 text-red-200"}`}>
            {toast.msg}
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700 bg-gradient-to-r from-indigo-900/50 to-violet-900/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/30 flex items-center justify-center">
              <BookMarked size={18} className="text-indigo-400" />
            </div>
            <div>
              <h2 id="catalogo-title" className="text-base font-bold text-white">📚 Catálogo de Evaluaciones</h2>
              <p className="text-xs text-slate-400">Evaluaciones diagnósticas, SIMCE y PAES disponibles para tu asignatura</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs text-slate-500 uppercase tracking-wide">Plan actual</p>
              <p className="text-sm font-bold text-indigo-400 capitalize">{plan}</p>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors" aria-label="Cerrar">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Plan info bar */}
        <div className="px-6 py-2.5 bg-slate-800/50 border-b border-slate-700/50 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Star size={13} className="text-amber-400" />
            {plan === "institucional" ? (
              <span>Acceso <strong className="text-emerald-400">ilimitado</strong> al catálogo con tu plan Institucional</span>
            ) : planLimit === 0 ? (
              <span>Tu plan <strong className="text-slate-300">Free</strong> no incluye evaluaciones del catálogo. <span className="text-indigo-400 cursor-pointer underline">Actualizar plan →</span></span>
            ) : (
              <span>Tu plan incluye hasta <strong className="text-white">{planLimit}</strong> evaluaciones del catálogo · Usadas: <strong className="text-emerald-400">{aprobadas}</strong></span>
            )}
          </div>
          {plan !== "institucional" && planLimit > 0 && aprobadas >= planLimit && (
            <span className="text-xs font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-1 rounded-full">
              Límite alcanzado — Actualiza a Pro o Institucional
            </span>
          )}
        </div>

        {/* Search & Category Filter */}
        <div className="px-6 pt-4 pb-3 space-y-3">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              id="catalogo-search"
              type="text"
              placeholder="Buscar por título, nivel o tema..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <button
              onClick={() => setCategoriaFiltro("todos")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                categoriaFiltro === "todos"
                  ? "bg-indigo-600 text-white shadow"
                  : "bg-slate-800 text-slate-400 hover:text-white border border-slate-700"
              }`}
            >
              Todos ({catalogo.length})
            </button>

            {conteoDiag > 0 && (
              <button
                onClick={() => setCategoriaFiltro("diagnosticas")}
                className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 ${
                  categoriaFiltro === "diagnosticas"
                    ? "bg-emerald-600 text-white shadow"
                    : "bg-slate-800 text-slate-400 hover:text-emerald-300 border border-slate-700"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Diagnósticas ({conteoDiag})
              </button>
            )}

            {conteoSimce > 0 && (
              <button
                onClick={() => setCategoriaFiltro("simce")}
                className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 ${
                  categoriaFiltro === "simce"
                    ? "bg-blue-600 text-white shadow"
                    : "bg-slate-800 text-slate-400 hover:text-blue-300 border border-slate-700"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-blue-400" />
                SIMCE ({conteoSimce})
              </button>
            )}

            {conteoPaes > 0 && (
              <button
                onClick={() => setCategoriaFiltro("paes")}
                className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 ${
                  categoriaFiltro === "paes"
                    ? "bg-purple-600 text-white shadow"
                    : "bg-slate-800 text-slate-400 hover:text-purple-300 border border-slate-700"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-purple-400" />
                PAES ({conteoPaes})
              </button>
            )}
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-3">
          {isLoading ? (
            <div className="flex items-center justify-center py-16 text-slate-500">
              <Loader2 size={24} className="animate-spin mr-2" /> Cargando catálogo...
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-500 text-center gap-3">
              <BookOpen size={36} className="opacity-30" />
              <p className="text-sm">No hay evaluaciones en esta categoría para tu asignatura.</p>
            </div>
          ) : (
            filtered.map((ev) => {
              const estado = getSolicitudEstado(ev.id);
              const canRequest = planLimit > 0 && (aprobadas < planLimit || plan === "institucional");
              const isGratuita = ev.precioCLP === 0;
              const tipo = getTipoEvaluacion(ev.titulo);

              return (
                <div key={ev.id} className={`rounded-xl border p-4 transition-all ${estado === "aprobada" ? "border-emerald-700/40 bg-emerald-900/10" : "border-slate-700 bg-slate-800/60 hover:border-indigo-600/50 hover:bg-slate-800"}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="text-sm font-semibold text-white truncate">{ev.titulo}</h3>
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${tipo.bg} ${tipo.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${tipo.dot}`} />
                          {tipo.label}
                        </span>
                        {estadoBadge(estado)}
                      </div>
                      <p className="text-xs text-slate-400 mb-2 line-clamp-2">
                        {ev.descripcionCatalogo || ev.descripcion || "Evaluación estandarizada alineada al currículum MINEDUC"}
                      </p>
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="flex items-center gap-1 text-[11px] text-slate-500">
                          <BookOpen size={11} /> {ev.totalPreguntas} preguntas
                        </span>
                        <span className="flex items-center gap-1 text-[11px] text-slate-500">
                          <Clock size={11} /> {ev.nivel}
                        </span>
                        <span className={`flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${isGratuita ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"}`}>
                          <Tag size={10} />
                          {isGratuita ? "Incluida en plan" : `$${ev.precioCLP.toLocaleString("es-CL")} CLP`}
                        </span>
                      </div>
                    </div>

                    {/* Action */}
                    <div className="shrink-0 flex items-center gap-2 flex-wrap sm:flex-nowrap">
                      <button
                        onClick={() => setPreviewEval(ev)}
                        className="flex items-center gap-1 text-xs font-semibold text-slate-300 bg-slate-700/60 hover:bg-indigo-600 hover:text-white px-2.5 py-1.5 rounded-lg transition-colors border border-slate-600/50"
                        title="Ver preguntas y pauta del instrumento"
                      >
                        <Eye size={13} />
                        <span className="hidden sm:inline">Ver Contenido</span>
                      </button>
                      {estado === "aprobada" ? (
                        <span className="flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg">
                          <CheckCircle2 size={14} /> En mis evaluaciones
                        </span>
                      ) : estado === "pendiente" ? (
                        <span className="flex items-center gap-1 text-xs text-yellow-400 bg-yellow-500/10 px-3 py-1.5 rounded-lg">
                          <Loader2 size={14} className="animate-spin" /> Pendiente
                        </span>
                      ) : estado === "rechazada" ? (
                        <span className="flex items-center gap-1 text-xs text-red-400 bg-red-500/10 px-3 py-1.5 rounded-lg">
                          <AlertCircle size={14} /> Rechazada
                        </span>
                      ) : canRequest ? (
                        <button
                          id={`btn-solicitar-${ev.id}`}
                          onClick={() => setSelectedEval(ev)}
                          className="flex items-center gap-1 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          Solicitar <ChevronRight size={13} />
                        </button>
                      ) : (
                        <span className="text-xs text-slate-600 bg-slate-700/50 px-3 py-1.5 rounded-lg">Límite alcanzado</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Solicitar */}
        {selectedEval && (
          <div className="absolute inset-0 bg-slate-900/95 flex flex-col p-6 z-20 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white">Confirmar Solicitud de Evaluación</h3>
              <button onClick={() => setSelectedEval(null)} className="p-1 rounded-lg text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700 mb-4">
              <p className="text-sm font-semibold text-white">{selectedEval.titulo}</p>
              <p className="text-xs text-slate-400 mt-1">{selectedEval.descripcionCatalogo || selectedEval.descripcion}</p>
              <div className="flex gap-3 mt-3 text-xs text-slate-400">
                <span>📚 {selectedEval.totalPreguntas} preguntas</span>
                <span>🎓 {selectedEval.nivel}</span>
                <span className="text-emerald-400 font-semibold">{selectedEval.precioCLP === 0 ? "Gratuita" : `$${selectedEval.precioCLP.toLocaleString("es-CL")}`}</span>
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="mensaje-solicitud" className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                <MessageSquare size={13} /> Mensaje para el Administrador (opcional)
              </label>
              <textarea
                id="mensaje-solicitud"
                rows={3}
                placeholder="Ej: Necesito esta evaluación para aplicar diagnóstico al curso 2° Medio A..."
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 resize-none"
              />
            </div>

            <div className="flex gap-3 mt-auto pt-4 border-t border-slate-800">
              <button
                onClick={() => setSelectedEval(null)}
                className="flex-1 py-2 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-sm font-semibold transition-colors"
              >
                Cancelar
              </button>
              <button
                id="btn-confirmar-solicitud"
                onClick={handleSolicitar}
                disabled={isSending}
                className="flex-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                {isSending ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
                Enviar Solicitud
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal para Visualizar Contenido Completo del Catálogo */}
      {previewEval && (
        <CatalogoDetalleModal
          isOpen={!!previewEval}
          onClose={() => setPreviewEval(null)}
          evaluacion={previewEval}
        />
      )}
    </div>
  );
};

export default CatalogoEvaluacionesModal;
