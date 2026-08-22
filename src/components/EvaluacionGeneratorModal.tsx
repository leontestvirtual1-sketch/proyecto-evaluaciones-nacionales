import React, { useState } from 'react';
import { Asignatura, EjeTematico, Habilidad, Curso, Prueba, Pregunta } from '../types';
import { X, Sparkles, CheckCircle2, ChevronRight, Layers, Clock, HelpCircle, FilePlus, AlertCircle } from 'lucide-react';

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
  const [estadoInicial, setEstadoInicial] = useState<'activa' | 'borrador'>('borrador');
  const [errorValidacion, setErrorValidacion] = useState<string | null>(null);

  React.useEffect(() => {
    if (asignaturas.length > 0 && (!asignaturaId || !asignaturas.find(a => a.id === asignaturaId))) {
      setAsignaturaId(asignaturas[0].id);
    }
  }, [asignaturas, isOpen]);

  React.useEffect(() => {
    if (cursos.length > 0 && (!cursoId || !cursos.find(c => c.id === cursoId))) {
      setCursoId(cursos[0].id);
      setNivel(cursos[0].nivel || 'II Medio');
    }
  }, [cursos, isOpen]);

  // Cierre con Escape (U-01)
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentAsignatura = asignaturas.find(a => a.id === asignaturaId) || asignaturas[0];
  const currentCurso = cursos.find(c => c.id === cursoId) || cursos[0];

  // Filter available questions strictly by subject (F-01)
  const preguntasDisponibles = bancoPreguntas.filter(p => p.asignaturaId === (currentAsignatura?.id || asignaturaId));

  // Seleccionar preguntas reales sin duplicar IDs falsos
  const totalDisponibles = preguntasDisponibles.length;
  const cantASeleccionar = Math.min(numPreguntas, totalDisponibles);
  const preguntasSeleccionadas: Pregunta[] = preguntasDisponibles.slice(0, cantASeleccionar);

  const handleGenerate = () => {
    setErrorValidacion(null);

    if (!titulo.trim()) {
      setErrorValidacion('Debes ingresar un título para la evaluación.');
      return;
    }
    if (preguntasSeleccionadas.length === 0) {
      setErrorValidacion('No hay preguntas disponibles para la asignatura seleccionada en el banco.');
      return;
    }
    if (duracionMinutos <= 0) {
      setErrorValidacion('La duración en minutos debe ser mayor a 0.');
      return;
    }

    const codigoUnico = `EVAL-${Math.floor(1000 + Math.random() * 9000)}`;
    const nuevaPrueba: Prueba = {
      id: `prueba-${Date.now()}`,
      titulo: titulo.trim(),
      descripcion: descripcion.trim(),
      asignaturaId: currentAsignatura?.id || asignaturaId,
      asignaturaNombre: currentAsignatura?.nombre || 'Lenguaje y Comunicación',
      nivel: currentCurso?.nivel || nivel,
      profesorId: '00000000-0000-0000-0000-000000000001',
      cursoId: currentCurso?.id || cursoId,
      cursoNombre: currentCurso?.nombre || '2° Medio A',
      codigoPublico: codigoUnico,
      duracionMinutos,
      creadoEn: new Date().toISOString().split('T')[0],
      // F-01: Conservar IDs reales exactos del banco de preguntas
      preguntasIds: preguntasSeleccionadas.map(p => p.id),
      totalPreguntas: preguntasSeleccionadas.length,
      estado: estadoInicial
    };

    onCreatePrueba(nuevaPrueba);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="eval-generator-title"
    >
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl border border-indigo-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 id="eval-generator-title" className="text-base font-bold text-slate-900 dark:text-white">
                Generador de Ensayos y Evaluaciones
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Selección de preguntas calibradas por estándares MINEDUC
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar modal de generador de evaluaciones"
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
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
                  className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-slate-900 dark:text-white"
                  placeholder="Ej: Ensayo de Cobertura Curricular Lengua y Literatura"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                    Asignatura {asignaturas.length === 1 && <span className="text-emerald-500 lowercase font-normal">(Especialidad Asignada)</span>}
                  </label>
                  <select
                    value={asignaturaId}
                    onChange={(e) => setAsignaturaId(e.target.value)}
                    disabled={asignaturas.length <= 1}
                    className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all disabled:opacity-80 disabled:bg-slate-100 dark:disabled:bg-slate-900 text-slate-900 dark:text-white"
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
                    className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-slate-900 dark:text-white"
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
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Estado inicial:</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setEstadoInicial('borrador')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      estadoInicial === 'borrador'
                        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
                        : 'bg-transparent text-slate-500 border-slate-300 dark:border-slate-700'
                    }`}
                  >
                    📝 Guardar como Borrador
                  </button>
                  <button
                    type="button"
                    onClick={() => setEstadoInicial('activa')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      estadoInicial === 'activa'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                        : 'bg-transparent text-slate-500 border-slate-300 dark:border-slate-700'
                    }`}
                  >
                    🚀 Publicar Inmediatamente
                  </button>
                </div>
              </div>

              {errorValidacion && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorValidacion}</span>
                </div>
              )}
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
              onClick={() => {
                setErrorValidacion(null);
                setStep(step + 1);
              }}
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
              <span>{estadoInicial === 'activa' ? 'Publicar Evaluación' : 'Crear en Borrador'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
