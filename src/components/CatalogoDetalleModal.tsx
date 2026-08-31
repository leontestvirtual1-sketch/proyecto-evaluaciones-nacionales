import React, { useState, useEffect, useCallback } from 'react';
import {
  X,
  BookOpen,
  CheckCircle2,
  Tag,
  Printer,
  KeyRound,
  Loader2,
  AlertCircle,
  Edit3,
} from 'lucide-react';
import { EvaluacionCatalogo, Pregunta, Prueba } from '../types';
import { getTipoEvaluacion } from './AdminCatalogoPanel';
import { EnunciadoRenderer } from './common/EnunciadoRenderer';
import { PrintEvaluacionModal } from './PrintEvaluacionModal';
import { EditarPreguntaModal } from './EditarPreguntaModal';

interface CatalogoDetalleModalProps {
  isOpen: boolean;
  onClose: () => void;
  evaluacion: EvaluacionCatalogo | null;
  authToken?: string;
}

export const CatalogoDetalleModal: React.FC<CatalogoDetalleModalProps> = ({
  isOpen,
  onClose,
  evaluacion,
  authToken,
}) => {
  const [activeTab, setActiveTab] = useState<'cuadernillo' | 'pauta'>('cuadernillo');
  const [preguntas, setPreguntas] = useState<Pregunta[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mostrarRespuestas, setMostrarRespuestas] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [preguntaEnEdicion, setPreguntaEnEdicion] = useState<Pregunta | null>(null);

  // Cerrar con tecla Escape
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isPrintModalOpen) onClose();
    },
    [onClose, isPrintModalOpen]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (!isOpen || !evaluacion) {
      setPreguntas([]);
      setActiveTab('cuadernillo');
      setMostrarRespuestas(false);
      return;
    }

    const fetchPreguntas = async () => {
      setIsLoading(true);
      try {
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (authToken) headers['Authorization'] = `Bearer ${authToken}`;

        const res = await fetch(
          `/api/evaluaciones-catalogo?action=preguntas&evaluacion_id=${evaluacion.id}`,
          { headers }
        );

        if (res.ok) {
          const data = await res.json();
          const items: Pregunta[] = (data.preguntas || []).map((p: any) => {
            // Normalizar alternativas: Supabase JSONB puede llegar como string o array
            let alts: any[] = [];
            if (Array.isArray(p.alternativas)) {
              alts = p.alternativas;
            } else if (typeof p.alternativas === 'string' && p.alternativas.trim()) {
              try { alts = JSON.parse(p.alternativas); } catch { alts = []; }
            }
            return {
              id: p.id,
              asignaturaId: p.asignatura_id,
              ejeTematicoId: p.eje_tematico_id,
              habilidadId: p.habilidad_id,
              tipo: p.tipo,
              nivel: p.nivel,
              dificultad: p.dificultad,
              imagenUrl: p.imagen_url,
              enunciado: p.enunciado,
              alternativas: alts,
              respuestaCorrecta: p.respuesta_correcta,
              puntaje: p.puntaje || 1,
              fuente: p.fuente,
            };
          });
          setPreguntas(items);
        }
      } catch (err) {
        console.error('Error cargando preguntas:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPreguntas();
  }, [isOpen, evaluacion, authToken]);

  if (!isOpen || !evaluacion) return null;

  const tipo = getTipoEvaluacion(evaluacion.titulo);

  const pruebaData: Prueba = {
    id: evaluacion.id,
    titulo: evaluacion.titulo,
    descripcion: evaluacion.descripcionCatalogo || evaluacion.descripcion,
    asignaturaId: evaluacion.asignaturaId,
    asignaturaNombre:
      evaluacion.asignaturaId === 'asig-1'
        ? 'Matemática'
        : evaluacion.asignaturaId === 'asig-2'
        ? 'Lengua y Literatura'
        : 'Educación Ciudadana',
    nivel: evaluacion.nivel,
    profesorId: 'admin',
    cursoId: 'catalogo',
    cursoNombre: evaluacion.nivel,
    codigoPublico: 'CATALOGO',
    duracionMinutos: 140,
    creadoEn: new Date().toISOString(),
    preguntasIds: preguntas.map((p) => p.id),
    totalPreguntas: preguntas.length || evaluacion.totalPreguntas,
    estado: 'activa',
    esCatalogo: true,
    precioCLP: evaluacion.precioCLP,
    descripcionCatalogo: evaluacion.descripcionCatalogo,
  };

  const LETRAS = ['A', 'B', 'C', 'D', 'E'];

  return (
    <>
      {/* Overlay — cerrar al hacer clic fuera */}
      <div
        className="fixed inset-0 z-[65] flex items-end sm:items-center justify-center sm:p-4 bg-black/80 backdrop-blur-md"
        role="dialog"
        aria-modal="true"
        aria-label={`Detalle: ${evaluacion.titulo}`}
        onClick={onClose}
      >
        {/* Botón X flotante — siempre visible en esquina superior derecha */}
        <button
          onClick={onClose}
          className="fixed top-3 right-3 z-[70] w-10 h-10 flex items-center justify-center rounded-xl bg-slate-800 border border-slate-600 text-slate-200 hover:bg-red-600 hover:border-red-500 hover:text-white shadow-xl transition-all"
          aria-label="Cerrar (Esc)"
          title="Cerrar (Esc)"
        >
          <X size={18} />
        </button>

        {/* Panel interior — detener propagación para no cerrar al hacer clic dentro */}
        <div
          className="relative w-full sm:max-w-5xl h-[100dvh] sm:h-auto sm:max-h-[90vh] flex flex-col bg-slate-900 border-0 sm:border border-slate-700 sm:rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 sm:zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* ── HEADER ─────────────────────────────────────────────────── */}
          <div className="px-5 py-4 border-b border-slate-800 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 flex items-start justify-between gap-4 shrink-0">
            <div className="min-w-0 flex-1">
              {/* Badges */}
              <div className="flex items-center gap-2 flex-wrap mb-1.5">
                <span
                  className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${tipo.bg} ${tipo.text}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${tipo.dot}`} />
                  {tipo.label}
                </span>
                <span className="text-xs text-slate-400 font-semibold">{evaluacion.nivel}</span>
                <span className="text-slate-600">·</span>
                <span className="text-xs text-slate-400 font-semibold">
                  {evaluacion.totalPreguntas} preguntas
                </span>
                <span className="text-slate-600">·</span>
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${
                    evaluacion.precioCLP === 0
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}
                >
                  <Tag size={10} />
                  {evaluacion.precioCLP === 0
                    ? 'Incluida en plan'
                    : `$${evaluacion.precioCLP.toLocaleString('es-CL')} CLP`}
                </span>
              </div>

              <h2 className="text-lg font-bold text-white tracking-tight truncate">
                {evaluacion.titulo}
              </h2>
              <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                {evaluacion.descripcionCatalogo ||
                  evaluacion.descripcion ||
                  'Instrumento estandarizado alineado al currículum oficial.'}
              </p>
            </div>

            {/* Acciones header */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setIsPrintModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/20 transition-all"
                title="Abrir motor de impresión y cuadernillo oficial"
              >
                <Printer size={14} />
                <span className="hidden sm:inline">Imprimir</span>
              </button>
              {/* Botón Cerrar — prominente */}
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-red-600/20 hover:border-red-500/40 border border-transparent transition-all"
                aria-label="Cerrar panel de detalle"
                title="Cerrar (Esc)"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* ── BARRA DE TABS + OPCIONES ───────────────────────────────── */}
          <div className="px-5 py-2.5 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between gap-4 flex-wrap shrink-0">
            <div className="flex gap-1 bg-slate-800/80 p-1 rounded-xl">
              <button
                onClick={() => setActiveTab('cuadernillo')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'cuadernillo'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <BookOpen size={13} />
                Cuadernillo
                {!isLoading && preguntas.length > 0 && (
                  <span className="ml-1 bg-white/20 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {preguntas.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('pauta')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'pauta'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <KeyRound size={13} />
                Pauta Docente
              </button>
            </div>

            <div className="flex items-center gap-3">
              {activeTab === 'cuadernillo' && (
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={mostrarRespuestas}
                    onChange={(e) => setMostrarRespuestas(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-800 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                  />
                  Ver claves
                </label>
              )}
              {/* Hint de cierre */}
              <span className="hidden sm:inline text-[10px] text-slate-600 font-medium">
                ESC para cerrar
              </span>
            </div>
          </div>

          {/* ── CUERPO SCROLLABLE ──────────────────────────────────────── */}
          <div className="flex-1 overflow-y-auto bg-slate-900/40">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-28 text-slate-400 gap-3">
                <Loader2 size={32} className="animate-spin text-indigo-400" />
                <p className="text-sm font-semibold">Cargando preguntas...</p>
              </div>
            ) : preguntas.length === 0 ? (
              <div className="text-center py-24 text-slate-500 space-y-2">
                <AlertCircle size={36} className="mx-auto opacity-30 text-amber-400" />
                <p className="text-sm font-semibold">
                  No se encontraron preguntas para esta evaluación.
                </p>
              </div>
            ) : activeTab === 'cuadernillo' ? (
              /* ── TAB: CUADERNILLO ────────────────────────────────── */
              <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 space-y-5">
                {preguntas.map((p, idx) => {
                  const altCorrectaIdx = p.alternativas.findIndex(
                    (a) => a.letra === p.respuestaCorrecta
                  );
                  return (
                    <div
                      key={p.id}
                      className="bg-slate-800/50 border border-slate-700/60 hover:border-slate-600/80 rounded-2xl overflow-hidden shadow transition-all"
                    >
                      {/* ─ Barra superior numeración ─ */}
                      <div className="flex items-center justify-between gap-3 px-5 py-3 bg-slate-900/60 border-b border-slate-700/50">
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-black text-sm flex items-center justify-center shadow-md shadow-indigo-600/30">
                            {idx + 1}
                          </span>
                          <div className="flex flex-col leading-tight">
                            <span className="text-xs font-bold text-white">
                              Pregunta {idx + 1}
                              {p.alternativas.length > 0 && (
                                <span className="ml-2 text-slate-400 font-normal">
                                  · {p.alternativas.length} alternativas
                                </span>
                              )}
                            </span>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              {p.dificultad && (
                                <span
                                  className={`text-[10px] font-bold px-1.5 py-0 rounded-full ${
                                    p.dificultad === 'alta'
                                      ? 'bg-red-500/15 text-red-400'
                                      : p.dificultad === 'media'
                                      ? 'bg-amber-500/15 text-amber-400'
                                      : 'bg-emerald-500/15 text-emerald-400'
                                  }`}
                                >
                                  {p.dificultad.charAt(0).toUpperCase() + p.dificultad.slice(1)}
                                </span>
                              )}
                              <span className="text-[10px] text-slate-500">
                                {p.puntaje || 1} pto.
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {mostrarRespuestas && p.respuestaCorrecta && (
                            <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-2.5 py-1 rounded-full">
                              <CheckCircle2 size={13} />
                              Clave: {p.respuestaCorrecta}
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => setPreguntaEnEdicion(p)}
                            className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 hover:bg-indigo-600 border border-slate-700 hover:border-indigo-500 text-slate-300 hover:text-white rounded-lg text-xs font-bold transition-all shadow-sm"
                            title="Editar enunciado, alternativas, imagen o clave de esta pregunta"
                          >
                            <Edit3 size={12} />
                            <span>Editar</span>
                          </button>
                        </div>
                      </div>

                      {/* ─ Enunciado (si no es sólo un título genérico de recorte) ─ */}
                      {p.enunciado && !p.enunciado.startsWith('Pregunta oficial #') && (
                        <div className="px-5 pt-4 pb-3 text-sm sm:text-[15px] text-slate-100 leading-relaxed">
                          <EnunciadoRenderer content={p.enunciado} />
                        </div>
                      )}

                      {/* ─ Figura Pedagógica / Diagrama Matemático Adjunto ─ */}
                      {p.imagenUrl && (
                        <div className="px-5 py-3 flex justify-center">
                          <div className="bg-white rounded-xl shadow-md border border-slate-300 p-3 sm:p-4 max-w-md mx-auto flex justify-center">
                            <img
                              src={p.imagenUrl}
                              alt={`Figura Pregunta ${idx + 1}`}
                              className="max-h-60 w-auto max-w-full object-contain rounded"
                              loading="lazy"
                            />
                          </div>
                        </div>
                      )}

                      {/* ─ Alternativas de Selección ─ */}
                      {p.alternativas.length > 0 && (
                        <div className="px-5 pb-5 pt-2">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                              {p.alternativas.some(a => a.texto && !a.texto.startsWith('Opción ')) ? 'Alternativas' : 'Marcar Respuesta Oficial'}
                            </span>
                            {mostrarRespuestas && p.respuestaCorrecta && (
                              <span className="text-xs font-bold text-emerald-400">
                                Clave Correcta: <strong className="text-white bg-emerald-600 px-2 py-0.5 rounded-md ml-1">{p.respuestaCorrecta}</strong>
                              </span>
                            )}
                          </div>

                          {/* Siempre mostrar texto si alguna alternativa lo tiene */}
                          {p.alternativas.some(a => a.texto && a.texto.trim().length > 0) ? (
                            /* Alternativas con texto detallado */
                            <div className="space-y-2">
                              {p.alternativas.map((alt, altIdx) => {
                                const isCorrect = alt.letra === p.respuestaCorrecta;
                                const showCorrect = mostrarRespuestas && isCorrect;
                                return (
                                  <div
                                    key={alt.letra}
                                    className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${
                                      showCorrect
                                        ? 'bg-emerald-900/25 border-emerald-500/50'
                                        : 'bg-slate-900/40 border-slate-700/50'
                                    }`}
                                  >
                                    <span
                                      className={`w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center shrink-0 mt-0.5 ${
                                        showCorrect
                                          ? 'bg-emerald-500 text-white shadow shadow-emerald-500/30'
                                          : 'bg-slate-800 text-slate-300 border border-slate-600'
                                      }`}
                                    >
                                      {alt.letra || LETRAS[altIdx]}
                                    </span>
                                    <div
                                      className={`text-sm flex-1 leading-snug pt-0.5 ${
                                        showCorrect ? 'text-emerald-100 font-medium' : 'text-slate-300'
                                      }`}
                                    >
                                      <EnunciadoRenderer content={alt.texto} />
                                    </div>
                                    {showCorrect && (
                                      <CheckCircle2
                                        size={16}
                                        className="text-emerald-400 shrink-0 mt-1"
                                      />
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            /* Solo letras — el contenido visual está en la imagen adjunta */
                            <div className="grid grid-cols-4 gap-2.5 sm:gap-4 max-w-md">
                              {p.alternativas.map((alt) => {
                                const isCorrect = alt.letra === p.respuestaCorrecta;
                                const showCorrect = mostrarRespuestas && isCorrect;
                                return (
                                  <div
                                    key={alt.letra}
                                    className={`flex flex-col items-center justify-center py-2.5 px-3 rounded-xl border font-bold text-sm transition-all ${
                                      showCorrect
                                        ? 'bg-emerald-600/30 border-emerald-500 text-emerald-300 shadow-md shadow-emerald-600/20'
                                        : 'bg-slate-900/60 border-slate-700 text-slate-300 hover:border-slate-500'
                                    }`}
                                  >
                                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black ${
                                      showCorrect ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-200'
                                    }`}>
                                      {alt.letra}
                                    </span>
                                    {showCorrect && (
                                      <span className="text-[10px] text-emerald-400 mt-1 font-semibold flex items-center gap-0.5">
                                        <CheckCircle2 size={10} /> Correcta
                                      </span>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              /* ── TAB: PAUTA DOCENTE ──────────────────────────────── */
              <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 space-y-4">
                <div className="bg-slate-800/80 border border-slate-700 rounded-2xl overflow-hidden shadow-lg">
                  <div className="p-4 bg-gradient-to-r from-indigo-950/60 to-slate-800 border-b border-slate-700 flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <KeyRound size={15} className="text-indigo-400" />
                        Tabla Oficial de Claves y Especificaciones
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Solucionario oficial · {preguntas.length} ítems
                      </p>
                    </div>
                    <span className="text-xs font-bold text-slate-300 bg-slate-900/80 px-3 py-1 rounded-full border border-slate-700">
                      {preguntas.length} ítems
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-900/80 text-slate-400 font-bold border-b border-slate-700 uppercase tracking-wider">
                          <th className="py-3 px-4 text-center w-14">#</th>
                          <th className="py-3 px-4 text-center w-20">Clave</th>
                          <th className="py-3 px-4 w-28">Dificultad</th>
                          <th className="py-3 px-4 w-20">Puntaje</th>
                          <th className="py-3 px-4">Inicio del enunciado</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-700/50 text-slate-300 font-medium">
                        {preguntas.map((p, idx) => (
                          <tr
                            key={p.id}
                            className="hover:bg-slate-700/30 transition-colors"
                          >
                            <td className="py-2.5 px-4 text-center font-bold text-indigo-400">
                              {idx + 1}
                            </td>
                            <td className="py-2.5 px-4 text-center">
                              <span className="inline-flex w-6 h-6 items-center justify-center rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-black">
                                {p.respuestaCorrecta}
                              </span>
                            </td>
                            <td className="py-2.5 px-4">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  p.dificultad === 'alta'
                                    ? 'bg-red-500/10 text-red-400'
                                    : p.dificultad === 'media'
                                    ? 'bg-amber-500/10 text-amber-400'
                                    : 'bg-emerald-500/10 text-emerald-400'
                                }`}
                              >
                                {p.dificultad
                                  ? p.dificultad.charAt(0).toUpperCase() + p.dificultad.slice(1)
                                  : 'Media'}
                              </span>
                            </td>
                            <td className="py-2.5 px-4 text-slate-400">
                              {p.puntaje || 1} pto.
                            </td>
                            <td className="py-2.5 px-4 text-slate-300 max-w-xs truncate text-[11px]">
                              {p.enunciado.replace(/\n+/g, ' ').substring(0, 80)}…
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Impresión (sobre este modal) */}
      {isPrintModalOpen && (
        <PrintEvaluacionModal
          isOpen={isPrintModalOpen}
          prueba={pruebaData}
          preguntas={preguntas}
          onClose={() => setIsPrintModalOpen(false)}
        />
      )}

      {/* Modal de Edición Rápida de Pregunta */}
      {preguntaEnEdicion && (
        <EditarPreguntaModal
          isOpen={!!preguntaEnEdicion}
          onClose={() => setPreguntaEnEdicion(null)}
          pregunta={preguntaEnEdicion}
          subfolder={evaluacion?.id?.replace(/^eval-/, '') || 'catalogo'}
          onSaveSuccess={(actualizada) => {
            setPreguntas((prev) =>
              prev.map((item) => (item.id === actualizada.id ? actualizada : item))
            );
          }}
        />
      )}
    </>
  );
};

export default CatalogoDetalleModal;
