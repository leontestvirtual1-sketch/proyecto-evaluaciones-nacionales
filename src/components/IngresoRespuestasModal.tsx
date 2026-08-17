import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  X,
  Upload,
  Camera,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Award,
  AlertCircle,
  FileCheck,
  User,
  Image as ImageIcon,
  Trash2,
  Save,
  Clock
} from 'lucide-react';
import { Prueba, Pregunta, AlumnoBasico, RendicionPrueba, RespuestaAlumno } from '../types';
import { alumnosMock } from '../data/mockData';

interface IngresoRespuestasModalProps {
  isOpen: boolean;
  prueba: Prueba | null;
  preguntas: Pregunta[];
  alumnos?: AlumnoBasico[];
  onClose: () => void;
  onSaveRendicion: (rendicion: RendicionPrueba) => void;
}

export const IngresoRespuestasModal: React.FC<IngresoRespuestasModalProps> = ({
  isOpen,
  prueba,
  preguntas,
  alumnos = alumnosMock,
  onClose,
  onSaveRendicion
}) => {
  // Filter course students
  const alumnosDelCurso = alumnos.filter(a => !prueba?.cursoId || a.cursoId === prueba.cursoId || a.cursoNombre === prueba.cursoNombre);
  const listaAlumnos = alumnosDelCurso.length > 0 ? alumnosDelCurso : alumnos;

  const [selectedAlumnoId, setSelectedAlumnoId] = useState<string>(listaAlumnos[0]?.id || '');
  const [respuestasMarcadas, setRespuestasMarcadas] = useState<Record<string, string>>({});
  const [fotoEvidencia, setFotoEvidencia] = useState<string | null>(null);
  const [isSavedSuccess, setIsSavedSuccess] = useState(false);

  // Filter questions of this test strictly by preguntasIds
  const preguntasDeLaPrueba = React.useMemo(() => {
    if (!prueba) return [];
    if (prueba.preguntasIds && prueba.preguntasIds.length > 0) {
      const byId = new Map(preguntas.map(p => [p.id, p]));
      const list = prueba.preguntasIds.map(id => byId.get(id)).filter((p): p is Pregunta => Boolean(p));
      if (list.length > 0) return list;
    }
    return preguntas.filter(p => p.asignaturaId === prueba.asignaturaId).slice(0, prueba.totalPreguntas || 30);
  }, [prueba, preguntas]);
  const itemsToEvaluate = preguntasDeLaPrueba.length > 0 ? preguntasDeLaPrueba : preguntas.slice(0, prueba?.totalPreguntas || 30);

  const alumnoActual = listaAlumnos.find(a => a.id === selectedAlumnoId) || listaAlumnos[0];

  // Reset or initialize answers when student changes
  useEffect(() => {
    setRespuestasMarcadas({});
    setFotoEvidencia(null);
    setIsSavedSuccess(false);
  }, [selectedAlumnoId, isOpen]);

  if (!isOpen || !prueba) return null;

  // Handler for marking an answer
  const handleSelectAlternative = (preguntaId: string, letra: string) => {
    setRespuestasMarcadas(prev => ({
      ...prev,
      [preguntaId]: prev[preguntaId] === letra ? '' : letra
    }));
  };

  // Handler for image upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFotoEvidencia(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Calculate live results
  let correctas = 0;
  let respondidas = 0;
  const respuestasArray: RespuestaAlumno[] = itemsToEvaluate.map(p => {
    const dada = respuestasMarcadas[p.id] || '';
    if (dada) respondidas++;
    const esCorrecta = dada !== '' && (dada.toUpperCase() === (p.respuestaCorrecta || 'A').toUpperCase());
    if (esCorrecta) correctas++;
    return {
      preguntaId: p.id,
      respuestaDada: dada,
      esCorrecta,
      tiempoSegundos: 45
    };
  });

  const totalPreguntas = itemsToEvaluate.length;
  const porcentajeLogro = totalPreguntas > 0 ? Math.round((correctas / totalPreguntas) * 100) : 0;
  const puntajeSimceEstimado = Math.round(180 + (porcentajeLogro * 1.5)); // Rango ~180 a 330 SIMCE

  const handleSave = (goToNext: boolean = false) => {
    if (!alumnoActual) return;

    const nuevaRendicion: RendicionPrueba = {
      id: `rend-${prueba.id}-${alumnoActual.id}-${Date.now()}`,
      pruebaId: prueba.id,
      alumnoId: alumnoActual.id,
      alumnoNombre: `${alumnoActual.nombre} ${alumnoActual.apellido}`,
      alumnoRut: alumnoActual.rut,
      fechaRendicion: new Date().toISOString().split('T')[0],
      puntajeObtenido: correctas,
      puntajeMaximo: totalPreguntas,
      porcentajeLogro,
      puntajeEscalaNacional: puntajeSimceEstimado,
      respuestas: respuestasArray,
      estado: 'enviada'
    };

    onSaveRendicion(nuevaRendicion);
    setIsSavedSuccess(true);

    if (goToNext) {
      const currentIndex = listaAlumnos.findIndex(a => a.id === selectedAlumnoId);
      if (currentIndex >= 0 && currentIndex < listaAlumnos.length - 1) {
        setTimeout(() => {
          setSelectedAlumnoId(listaAlumnos[currentIndex + 1].id);
          setIsSavedSuccess(false);
        }, 600);
      }
    } else {
      setTimeout(() => {
        setIsSavedSuccess(false);
      }, 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col my-auto text-left overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-md shadow-indigo-600/20">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Ingreso Rápido de Hoja de Respuestas Impresa
                </h3>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-full">
                  Fast-Track 1-Clic
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {prueba.titulo} • <strong className="text-slate-700 dark:text-slate-300">{prueba.cursoNombre}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Toast */}
        {isSavedSuccess && (
          <div className="bg-emerald-500/15 border-b border-emerald-500/30 px-4 py-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-between animate-fade-in">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              ¡Evaluación de {alumnoActual?.nombre} {alumnoActual?.apellido} guardada con éxito ({porcentajeLogro}% logro)!
            </span>
            <span className="text-[10px] opacity-80">Calificación registrada en el libro</span>
          </div>
        )}

        {/* Body 2 Columns Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-hidden">
          
          {/* Column 1: Student Picker & Photo Evidence (4 Cols) */}
          <div className="lg:col-span-4 p-4 border-r border-slate-200 dark:border-slate-800 space-y-4 bg-slate-50/50 dark:bg-slate-950/40 overflow-y-auto">
            
            {/* Student Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>1. Seleccionar Estudiante</span>
                <span className="text-[10px] text-indigo-500 font-mono font-bold">
                  {listaAlumnos.findIndex(a => a.id === selectedAlumnoId) + 1} de {listaAlumnos.length}
                </span>
              </label>
              <select
                value={selectedAlumnoId}
                onChange={e => setSelectedAlumnoId(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                {listaAlumnos.map((a, idx) => (
                  <option key={a.id} value={a.id}>
                    N° {a.numeroDeLista || idx + 1} • {a.nombre} {a.apellido} ({a.rut})
                  </option>
                ))}
              </select>
            </div>

            {/* Student Card Summary */}
            {alumnoActual && (
              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1 text-xs">
                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-indigo-500" />
                  {alumnoActual.nombre} {alumnoActual.apellido}
                </div>
                <div className="text-[11px] text-slate-500 font-mono">RUT: {alumnoActual.rut}</div>
                <div className="text-[11px] text-slate-500">Curso: {alumnoActual.cursoNombre}</div>
              </div>
            )}

            {/* Photo / Camera Evidence Box */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>2. Foto de Respaldo</span>
                <span className="text-[10px] text-slate-400 font-normal">(Opcional)</span>
              </label>

              {fotoEvidencia ? (
                <div className="relative rounded-xl overflow-hidden border border-slate-300 dark:border-slate-700 group">
                  <img
                    src={fotoEvidencia}
                    alt="Hoja de Respuestas"
                    className="w-full h-36 object-cover bg-slate-950"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => setFotoEvidencia(null)}
                      className="p-1.5 bg-rose-600 text-white rounded-lg hover:bg-rose-500 text-xs font-semibold flex items-center gap-1 shadow"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Eliminar
                    </button>
                  </div>
                </div>
              ) : (
                <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors bg-white dark:bg-slate-900/60 text-center">
                  <div className="p-2 bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 rounded-xl mb-1.5">
                    <Camera className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Subir foto de la hoja física
                  </span>
                  <span className="text-[10px] text-slate-400 mt-0.5">
                    Foto desde celular o escaneo JPG/PNG
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Live Score Preview Card */}
            <div className="p-3.5 bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-950 rounded-2xl border border-indigo-500/30 text-white space-y-2">
              <span className="text-[10px] uppercase font-bold text-indigo-300 tracking-wider block">
                Cálculo Inmediato de Puntaje
              </span>
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-xl font-black text-white">{correctas} / {totalPreguntas}</div>
                  <div className="text-[10px] text-slate-300 font-medium">Correctas</div>
                </div>
                <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-xl font-black text-indigo-300">{porcentajeLogro}%</div>
                  <div className="text-[10px] text-slate-300 font-medium">Logro</div>
                </div>
              </div>
              <div className="text-center pt-1 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-slate-300 text-[11px]">SIMCE Estimado:</span>
                <span className="font-mono font-bold text-amber-300 text-sm">{puntajeSimceEstimado} pts</span>
              </div>
            </div>
          </div>

          {/* Column 2: Fast Bubble Marking Grid (8 Cols) */}
          <div className="lg:col-span-8 p-4 sm:p-6 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                <div>
                  <h4 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                    Grilla Óptica de Respuestas (3. Marca la opción del estudiante)
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Haz clic sobre la letra que marcó el estudiante en su hoja física ({respondidas} de {totalPreguntas} ingresadas).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setRespuestasMarcadas({})}
                  className="text-[11px] text-slate-400 hover:text-rose-500 font-semibold transition-colors"
                >
                  Limpiar Todo
                </button>
              </div>

              {/* Grid of Questions */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 max-h-[46vh] overflow-y-auto p-1">
                {itemsToEvaluate.map((preg, idx) => {
                  const num = idx + 1;
                  const marcada = respuestasMarcadas[preg.id] || '';
                  const correcta = (preg.respuestaCorrecta || 'A').toUpperCase();

                  return (
                    <div
                      key={preg.id}
                      className={`p-2 rounded-xl border transition-all ${
                        marcada
                          ? marcada === correcta
                            ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-900 dark:text-emerald-200'
                            : 'bg-rose-500/10 border-rose-500/40 text-rose-900 dark:text-rose-200'
                          : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] font-bold mb-1.5">
                        <span className="text-slate-700 dark:text-slate-300">Pregunta {num}</span>
                        {marcada && (
                          <span className="text-[10px] font-mono">
                            {marcada === correcta ? '✓' : `Clave: ${correcta}`}
                          </span>
                        )}
                      </div>

                      {/* 4 Bubble Buttons A, B, C, D */}
                      <div className="grid grid-cols-4 gap-1">
                        {['A', 'B', 'C', 'D'].map(letra => {
                          const isSelected = marcada === letra;
                          return (
                            <button
                              key={letra}
                              type="button"
                              onClick={() => handleSelectAlternative(preg.id, letra)}
                              className={`py-1 rounded-lg text-xs font-black transition-all ${
                                isSelected
                                  ? letra === correcta
                                    ? 'bg-emerald-600 text-white shadow-sm scale-105'
                                    : 'bg-rose-600 text-white shadow-sm scale-105'
                                  : 'bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:border-indigo-500 text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/40'
                              }`}
                            >
                              {letra}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200 dark:border-slate-800 mt-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all w-full sm:w-auto"
              >
                Cerrar
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => handleSave(false)}
                  disabled={respondidas === 0}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all"
                >
                  <Save className="w-4 h-4 text-indigo-500" />
                  <span>Guardar</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSave(true)}
                  disabled={respondidas === 0}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-600/20 transition-all hover:scale-105 active:scale-95"
                >
                  <span>Guardar y Siguiente Alumno</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
