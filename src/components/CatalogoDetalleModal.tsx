import React, { useState, useEffect } from 'react';
import {
  X,
  BookOpen,
  CheckCircle2,
  Tag,
  Clock,
  Printer,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ListOrdered,
  FileText,
  KeyRound,
  Loader2,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { EvaluacionCatalogo, Pregunta, Prueba } from '../types';
import { getTipoEvaluacion } from './AdminCatalogoPanel';
import { EnunciadoRenderer } from './common/EnunciadoRenderer';
import { PrintEvaluacionModal } from './PrintEvaluacionModal';

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
  const [filtroEje, setFiltroEje] = useState<string>('todos');
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  useEffect(() => {
    if (!isOpen || !evaluacion) {
      setPreguntas([]);
      return;
    }

    const fetchPreguntas = async () => {
      setIsLoading(true);
      try {
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (authToken) headers['Authorization'] = `Bearer ${authToken}`;

        const res = await fetch(`/api/evaluaciones-catalogo?action=preguntas&evaluacion_id=${evaluacion.id}`, {
          headers,
        });

        if (res.ok) {
          const data = await res.json();
          const items: Pregunta[] = (data.preguntas || []).map((p: any) => ({
            id: p.id,
            asignaturaId: p.asignatura_id,
            ejeTematicoId: p.eje_tematico_id,
            habilidadId: p.habilidad_id,
            tipo: p.tipo,
            nivel: p.nivel,
            dificultad: p.dificultad,
            imagenUrl: p.imagen_url,
            enunciado: p.enunciado,
            alternativas: p.alternativas || [],
            respuestaCorrecta: p.respuesta_correcta,
            puntaje: p.puntaje || 1,
            fuente: p.fuente,
          }));
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

  // Generar objeto Prueba temporal para PrintEvaluacionModal
  const pruebaData: Prueba = {
    id: evaluacion.id,
    titulo: evaluacion.titulo,
    descripcion: evaluacion.descripcionCatalogo || evaluacion.descripcion,
    asignaturaId: evaluacion.asignaturaId,
    asignaturaNombre: evaluacion.asignaturaId === 'asig-1' ? 'Matemática' : evaluacion.asignaturaId === 'asig-2' ? 'Lengua y Literatura' : 'Educación Ciudadana',
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

  return (
    <>
      <div
        className="fixed inset-0 z-[65] flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md"
        role="dialog"
        aria-modal="true"
      >
        <div className="relative w-full max-w-5xl h-[92vh] flex flex-col bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-800 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap mb-1.5">
                <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${tipo.bg} ${tipo.text}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${tipo.dot}`} />
                  {tipo.label}
                </span>
                <span className="text-xs text-slate-400 font-semibold">{evaluacion.nivel}</span>
                <span className="text-slate-600">·</span>
                <span className="text-xs text-slate-400 font-semibold">{evaluacion.totalPreguntas} preguntas</span>
                <span className="text-slate-600">·</span>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${evaluacion.precioCLP === 0 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                  <Tag size={10} className="inline mr-1" />
                  {evaluacion.precioCLP === 0 ? 'Incluida en plan ($0)' : `$${evaluacion.precioCLP.toLocaleString('es-CL')} CLP`}
                </span>
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight truncate">{evaluacion.titulo}</h2>
              <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                {evaluacion.descripcionCatalogo || evaluacion.descripcion || 'Instrumento estandarizado alineado al currículum oficial.'}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setIsPrintModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/20 transition-all"
                title="Abrir motor de impresión y cuadernillo oficial"
              >
                <Printer size={14} />
                <span className="hidden sm:inline">Imprimir Cuadernillo</span>
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                aria-label="Cerrar"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Navigation Bar & Toolbar */}
          <div className="px-6 py-2.5 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between gap-4 flex-wrap">
            {/* Tabs */}
            <div className="flex gap-1 bg-slate-800/80 p-1 rounded-xl">
              <button
                onClick={() => setActiveTab('cuadernillo')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'cuadernillo'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <BookOpen size={14} />
                <span>📝 Cuadernillo de Preguntas ({preguntas.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('pauta')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'pauta'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <KeyRound size={14} />
                <span>📋 Pauta y Solucionario Docente</span>
              </button>
            </div>

            {/* Toggle ver respuestas */}
            {activeTab === 'cuadernillo' && (
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={mostrarRespuestas}
                  onChange={(e) => setMostrarRespuestas(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-800 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                />
                <span className="text-slate-300">Mostrar claves de corrección</span>
              </label>
            )}
          </div>

          {/* Content Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-900/40 space-y-6">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-24 text-slate-400 gap-3">
                <Loader2 size={32} className="animate-spin text-indigo-400" />
                <p className="text-sm font-semibold">Cargando preguntas de la evaluación...</p>
              </div>
            ) : preguntas.length === 0 ? (
              <div className="text-center py-20 text-slate-500 space-y-2">
                <AlertCircle size={36} className="mx-auto opacity-30 text-amber-400" />
                <p className="text-sm font-semibold">No se encontraron preguntas cargadas para esta evaluación.</p>
              </div>
            ) : activeTab === 'cuadernillo' ? (
              /* Vista Cuadernillo */
              <div className="space-y-6 max-w-4xl mx-auto">
                {preguntas.map((p, idx) => (
                  <div
                    key={p.id}
                    className="bg-slate-800/60 border border-slate-700/70 hover:border-slate-600 rounded-2xl p-5 sm:p-6 shadow-sm transition-all"
                  >
                    {/* Header pregunta */}
                    <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-700/50">
                      <div className="flex items-center gap-2.5">
                        <span className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 font-bold text-sm flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <div>
                          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                            Pregunta #{idx + 1}
                          </span>
                          <span className="text-slate-600 mx-1.5">·</span>
                          <span className="text-xs text-slate-400">{p.dificultad ? `Dificultad ${p.dificultad}` : 'Puntuable'}</span>
                        </div>
                      </div>

                      {mostrarRespuestas && (
                        <span className="inline-flex items-center gap-1 text-xs font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-3 py-1 rounded-full">
                          <CheckCircle2 size={13} /> Clave: {p.respuestaCorrecta}
                        </span>
                      )}
                    </div>

                    {/* Enunciado */}
                    <div className="text-sm sm:text-base text-slate-200 leading-relaxed mb-4">
                      <EnunciadoRenderer content={p.enunciado} />
                    </div>

                    {/* Imagen de la pregunta */}
                    {p.imagenUrl && (
                      <div className="my-4 p-2 bg-slate-950/40 rounded-xl border border-slate-700/50 flex justify-center">
                        <img
                          src={p.imagenUrl}
                          alt={`Figura Pregunta ${idx + 1}`}
                          className="max-h-80 max-w-full rounded-lg object-contain bg-white/90 p-2"
                        />
                      </div>
                    )}

                    {/* Alternativas */}
                    <div className="space-y-2.5 mt-4">
                      {p.alternativas.map((alt) => {
                        const isCorrect = alt.letra === p.respuestaCorrecta;
                        return (
                          <div
                            key={alt.letra}
                            className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${
                              mostrarRespuestas && isCorrect
                                ? 'bg-emerald-900/20 border-emerald-500/50 text-emerald-200 font-medium'
                                : 'bg-slate-900/50 border-slate-700/60 text-slate-300'
                            }`}
                          >
                            <span
                              className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                                mostrarRespuestas && isCorrect
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-slate-800 text-slate-400 border border-slate-700'
                              }`}
                            >
                              {alt.letra}
                            </span>
                            <div className="text-sm flex-1 leading-snug pt-0.5">
                              <EnunciadoRenderer content={alt.texto} />
                            </div>
                            {mostrarRespuestas && isCorrect && (
                              <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-1" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Vista Pauta y Solucionario Docente */
              <div className="max-w-4xl mx-auto space-y-4">
                <div className="bg-slate-800/80 border border-slate-700 rounded-2xl overflow-hidden shadow-lg">
                  <div className="p-4 bg-gradient-to-r from-indigo-950/60 to-slate-800 border-b border-slate-700 flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <KeyRound size={16} className="text-indigo-400" />
                        Tabla Oficial de Claves y Especificaciones
                      </h3>
                      <p className="text-xs text-slate-400">Solucionario oficial y desglose por ítem</p>
                    </div>
                    <span className="text-xs font-bold text-slate-300 bg-slate-900/80 px-3 py-1 rounded-full border border-slate-700">
                      Total: {preguntas.length} Ítems
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-900/80 text-slate-400 font-bold border-b border-slate-700 uppercase tracking-wider">
                          <th className="py-3 px-4 text-center w-16">#</th>
                          <th className="py-3 px-4 text-center w-24">Clave</th>
                          <th className="py-3 px-4">Dificultad</th>
                          <th className="py-3 px-4">Puntaje</th>
                          <th className="py-3 px-4">Resumen del Ítem</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-700/50 text-slate-300 font-medium">
                        {preguntas.map((p, idx) => (
                          <tr key={p.id} className="hover:bg-slate-700/30 transition-colors">
                            <td className="py-2.5 px-4 text-center font-bold text-indigo-400">
                              {idx + 1}
                            </td>
                            <td className="py-2.5 px-4 text-center">
                              <span className="inline-block w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold leading-6">
                                {p.respuestaCorrecta}
                              </span>
                            </td>
                            <td className="py-2.5 px-4 capitalize">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                p.dificultad === 'alta' ? 'bg-red-500/10 text-red-400' :
                                p.dificultad === 'media' ? 'bg-amber-500/10 text-amber-400' :
                                'bg-emerald-500/10 text-emerald-400'
                              }`}>
                                {p.dificultad || 'Media'}
                              </span>
                            </td>
                            <td className="py-2.5 px-4 text-slate-400">
                              {p.puntaje || 1} pto.
                            </td>
                            <td className="py-2.5 px-4 text-slate-300 max-w-md truncate">
                              {p.enunciado.replace(/\n+/g, ' ').substring(0, 90)}...
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

      {/* Modal de Impresión */}
      {isPrintModalOpen && (
        <PrintEvaluacionModal
          isOpen={isPrintModalOpen}
          prueba={pruebaData}
          preguntas={preguntas}
          onClose={() => setIsPrintModalOpen(false)}
        />
      )}
    </>
  );
};

export default CatalogoDetalleModal;
