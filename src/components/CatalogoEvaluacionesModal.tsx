import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabaseClient";
import { EvaluacionCatalogo, SolicitudEvaluacion, UserProfile } from "../types";
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
} from "lucide-react";

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
  const [selectedEval, setSelectedEval] = useState<EvaluacionCatalogo | null>(null);
  const [mensaje, setMensaje] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [toast, setToast] = useState<{ type: "ok" | "err"; msg: string } | null>(null);

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
  }, [isOpen, currentUser]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const getSolicitudEstado = (evalId: string): "pendiente" | "aprobada" | "rechazada" | null => {
    const s = misSolicitudes.find((s) => s.evaluacionId === evalId);
    return s ? s.estado : null;
  };

  const handleSolicitar = async () => {
    if (!selectedEval) return;
    setIsSending(true);
    try {
      const session = (await supabase.auth.getSession()).data.session;
      const res = await fetch("/api/evaluaciones-catalogo?action=solicitar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token || ""}`,
        },
        body: JSON.stringify({ evaluacion_id: selectedEval.id, mensaje: mensaje.trim() || undefined }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("ok", "✅ " + data.message);
        setSelectedEval(null);
        setMensaje("");
        await loadData();
      } else {
        showToast("err", "❌ " + (data.message || "Error al enviar solicitud"));
      }
    } catch (e: any) {
      showToast("err", "❌ Error de conexión: " + e.message);
    } finally {
      setIsSending(false);
    }
  };

  if (!isOpen) return null;

  const plan = currentUser.plan || "trial";
  const planLimit = PLAN_LIMITS[plan] ?? 0;
  const aprobadas = misSolicitudes.filter((s) => s.estado === "aprobada").length;
  const filtered = catalogo.filter((e) =>
    e.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (e.descripcionCatalogo || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const estadoBadge = (estado: "pendiente" | "aprobada" | "rechazada" | null) => {
    if (!estado) return null;
    const conf = {
      pendiente: { label: "Solicitud pendiente", cls: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30" },
      aprobada: { label: "✓ Aprobada", cls: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" },
      rechazada: { label: "✗ Rechazada", cls: "bg-red-500/20 text-red-300 border-red-500/30" },
    };
    const c = conf[estado];
    return (
      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${c.cls}`}>
        {c.label}
      </span>
    );
  };

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
              <h2 id="catalogo-title" className="text-base font-bold text-white">📚 Catálogo SIMCE</h2>
              <p className="text-xs text-slate-400">Evaluaciones disponibles según tu plan</p>
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

        {/* Search */}
        <div className="px-6 pt-4 pb-3">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              id="catalogo-search"
              type="text"
              placeholder="Buscar evaluación..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
            />
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
              <p className="text-sm">No hay evaluaciones disponibles para tu asignatura en este momento.</p>
            </div>
          ) : (
            filtered.map((ev) => {
              const estado = getSolicitudEstado(ev.id);
              const canRequest = planLimit > 0 && (aprobadas < planLimit || plan === "institucional");
              const isGratuita = ev.precioCLP === 0;

              return (
                <div key={ev.id} className={`rounded-xl border p-4 transition-all ${estado === "aprobada" ? "border-emerald-700/40 bg-emerald-900/10" : "border-slate-700 bg-slate-800/60 hover:border-indigo-600/50 hover:bg-slate-800"}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="text-sm font-semibold text-white truncate">{ev.titulo}</h3>
                        {estadoBadge(estado)}
                      </div>
                      <p className="text-xs text-slate-400 mb-2 line-clamp-2">
                        {ev.descripcionCatalogo || ev.descripcion || "Evaluación SIMCE estandarizada"}
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
                    <div className="shrink-0">
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

        {/* Sub-modal: Formulario de Solicitud */}
        {selectedEval && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-20 p-6">
            <div className="w-full max-w-md bg-slate-900 rounded-2xl border border-indigo-600/40 shadow-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Send size={16} className="text-indigo-400" /> Solicitar acceso
                </h3>
                <button onClick={() => setSelectedEval(null)} className="text-slate-400 hover:text-white" aria-label="Cancelar">
                  <X size={16} />
                </button>
              </div>
              <div className="bg-slate-800/70 rounded-xl px-4 py-3 mb-4 border border-slate-700">
                <p className="text-xs text-slate-400 mb-0.5">Evaluación seleccionada</p>
                <p className="text-sm font-semibold text-white">{selectedEval.titulo}</p>
                <p className="text-xs text-indigo-400 mt-0.5">{selectedEval.nivel}</p>
              </div>
              <label className="block mb-2">
                <span className="flex items-center gap-1 text-xs text-slate-400 mb-1.5">
                  <MessageSquare size={12} /> Mensaje opcional para el administrador
                </span>
                <textarea
                  id="catalogo-mensaje"
                  value={mensaje}
                  onChange={(e) => setMensaje(e.target.value)}
                  placeholder="Ej: Necesito esta evaluación para 2° Medio B, semana próxima."
                  rows={3}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
                />
              </label>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setSelectedEval(null)}
                  className="flex-1 py-2 rounded-lg border border-slate-700 text-sm text-slate-400 hover:bg-slate-800 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  id="btn-confirmar-solicitud"
                  onClick={handleSolicitar}
                  disabled={isSending}
                  className="flex-1 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
                >
                  {isSending ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
                  Enviar solicitud
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CatalogoEvaluacionesModal;
