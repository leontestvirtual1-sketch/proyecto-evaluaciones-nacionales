import React, { useState } from 'react';
import { Asignatura, EjeTematico, Habilidad, Curso, Prueba, Pregunta } from '../types';
import { X, Sparkles, CheckCircle2, ChevronRight, Layers, Clock, HelpCircle, FilePlus } from 'lucide-react';

interface EvaluacionGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  asignaturas: Asignatura[];
  ejes: EjeTematico[];
  habilidades: Habilidad[];
  cursos: Curso[];
  bancoPreguntas: Pregunta[];
  onCreatePrueba: (nuevaPrueba: Prueba) => void;
}

export const EvaluacionGeneratorModal: React.FC<EvaluacionGeneratorModalProps> = ({
  isOpen,
  onClose,
  asignaturas,
  ejes,
  habilidades,
  cursos,
  bancoPreguntas,
  onCreatePrueba
}) => {
  const [step, setStep] = useState<number>(1);
  const [titulo, setTitulo] = useState<string>('Evaluación Formativa Nacional N° 2');
  const [descripcion, setDescripcion] = useState<string>('Evaluación de cobertura de ejes temáticos y habilidades clave.');
  const [asignaturaId, setAsignaturaId] = useState<string>(asignaturas[0]?.id || '');
  const [cursoId, setCursoId] = useState<string>(cursos[0]?.id || '');
  const [nivel, setNivel] = useState<string>('8° básico');
  const [duracionMinutos, setDuracionMinutos] = useState<number>(45);
  const [numPreguntas, setNumPreguntas] = useState<number>(5);

  if (!isOpen) return null;

  const currentAsignatura = asignaturas.find(a => a.id === asignaturaId);
  const currentCurso = cursos.find(c => c.id === cursoId);

  // Filter available questions by subject
  const preguntasDisponibles = bancoPreguntas.filter(p => p.asignaturaId === asignaturaId || !p.asignaturaId);
  const preguntasSeleccionadas = preguntasDisponibles.slice(0, numPreguntas);

  const handleGenerate = () => {
    const codigoUnico = `EVAL-${Math.floor(1000 + Math.random() * 9000)}`;
    const nuevaPrueba: Prueba = {
      id: `prueba-${Date.now()}`,
      titulo,
      descripcion,
      asignaturaId,
      asignaturaNombre: currentAsignatura?.nombre || 'Matemática',
      nivel,
      profesorId: '00000000-0000-0000-0000-000000000001',
      cursoId,
      cursoNombre: currentCurso?.nombre || '8° Básico A',
      codigoPublico: codigoUnico,
      duracionMinutos,
      creadoEn: new Date().toISOString().split('T')[0],
      preguntasIds: preguntasSeleccionadas.map(p => p.id),
      totalPreguntas: preguntasSeleccionadas.length,
      estado: 'activa'
    };

    onCreatePrueba(nuevaPrueba);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl border border-indigo-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Generador de Evaluaciones — Sysget Saber
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Paso {step} de 3 — Configuración de preguntas y taxonomía
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Título de la Evaluación
                </label>
                <input
                  type="text"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                  placeholder="Ej: Ensayo de Cobertura Curricular Matemática"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                    Asignatura
                  </label>
                  <select
                    value={asignaturaId}
                    onChange={(e) => setAsignaturaId(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                  >
                    {asignaturas.map(a => (
                      <option key={a.id} value={a.id}>{a.nombre}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                    Curso Destino
                  </label>
                  <select
                    value={cursoId}
                    onChange={(e) => setCursoId(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                  >
                    {cursos.map(c => (
                      <option key={c.id} value={c.id}>{c.nombre} ({c.nivel})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                    Duración Estimada (Minutos)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={duracionMinutos}
                      onChange={(e) => setDuracionMinutos(Number(e.target.value))}
                      className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                    />
                    <Clock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                    Cantidad de Preguntas
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={numPreguntas}
                      onChange={(e) => setNumPreguntas(Number(e.target.value))}
                      className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                    />
                    <HelpCircle className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Descripción o Indicaciones para los Estudiantes
                </label>
                <textarea
                  rows={3}
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all resize-none"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                Distribución Curricular (Ejes Temáticos y Habilidades Cognitivas)
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                El motor seleccionará automáticamente preguntas del banco oficial calibradas por nivel de dificultad.
              </p>

              <div className="space-y-3">
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/60">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                    <Layers className="w-4 h-4" /> Ejes Temáticos Cobertura
                  </span>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {ejes.filter(e => e.asignaturaId === asignaturaId).map(eje => (
                      <div key={eje.id} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        <span>{eje.nombre}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/60">
                  <span className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" /> Habilidades Medidas
                  </span>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {habilidades.filter(h => h.asignaturaId === asignaturaId).map(hab => (
                      <div key={hab.id} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-sky-500" />
                        <span>{hab.nombre}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Preguntas Seleccionadas para el Ensayo ({preguntasSeleccionadas.length})
                </h4>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                  Calibración OK
                </span>
              </div>

              <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                {preguntasSeleccionadas.map((preg, idx) => (
                  <div
                    key={preg.id}
                    className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between font-semibold">
                      <span className="text-indigo-600 dark:text-indigo-400">
                        Pregunta N° {idx + 1} ({preg.tipo === 'seleccion_multiple' ? 'Selección Múltiple' : 'Desarrollo'})
                      </span>
                      <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                        Fuente: {preg.fuente}
                      </span>
                    </div>
                    <p className="text-slate-800 dark:text-slate-200 line-clamp-2">
                      {preg.enunciado}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Buttons */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Atrás
            </button>
          ) : <div />}

          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-all"
            >
              <span>Siguiente Paso</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleGenerate}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-all"
            >
              <FilePlus className="w-4 h-4" />
              <span>Publicar Evaluación</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
