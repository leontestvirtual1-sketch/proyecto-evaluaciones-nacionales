import React, { useState } from 'react';
import {
  Printer,
  FileText,
  CheckSquare,
  KeyRound,
  X,
  School,
  Sparkles,
  Download,
  CheckCircle2,
  Users,
  UserCheck,
  User
} from 'lucide-react';
import { Prueba, Pregunta, AlumnoBasico } from '../types';
import { APP_CONFIG } from '../config/appConfig';
import { establecimientosCatalog } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { useAcademicData } from '../context/AcademicDataContext';

interface PrintEvaluacionModalProps {
  isOpen: boolean;
  prueba: Prueba | null;
  preguntas: Pregunta[];
  alumnos?: AlumnoBasico[];
  onClose: () => void;
}

type PrintMode = 'cuadernillo' | 'personalizado' | 'hoja_respuestas' | 'pauta_docente';

export const PrintEvaluacionModal: React.FC<PrintEvaluacionModalProps> = ({
  isOpen,
  prueba,
  preguntas,
  alumnos = [],
  onClose
}) => {
  const { user } = useAuth();
  const { nombreEstablecimientoActivo, isProduction } = useAcademicData();
  const [printMode, setPrintMode] = useState<PrintMode>('cuadernillo');

  // Encontrar el establecimiento actual y su logo oficial
  const establecimientoActual = establecimientosCatalog.find(
    e => (user?.rbd && e.rbd === user.rbd) || (user?.establecimiento && e.nombre.toLowerCase().includes(user.establecimiento.toLowerCase()))
  ) || {
    nombre: nombreEstablecimientoActivo || user?.establecimiento || (isProduction ? 'Escuela Premilitar Héroes de la Concepción' : 'Liceo Bicentenario Los Andes'),
    rbd: user?.rbd || '31030',
    logoUrl: isProduction ? '/logos/escuela-premilitar.png' : undefined,
    lema: isProduction ? 'Ad Altiora, Et Meliora, Semper' : 'Excelencia y Futuro'
  };

  // Filter students belonging to this course
  const alumnosDelCurso = React.useMemo(() => {
    return (alumnos || []).filter(
      a => !prueba?.cursoId || a.cursoId === prueba.cursoId || a.cursoNombre === prueba.cursoNombre
    );
  }, [alumnos, prueba]);
  const listaAlumnos = alumnosDelCurso.length > 0 ? alumnosDelCurso : (alumnos || []);

  // Selected students IDs for personalized booklet printing
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);

  React.useEffect(() => {
    if (listaAlumnos.length > 0) {
      setSelectedStudentIds(listaAlumnos.map(a => a.id));
    }
  }, [listaAlumnos, isOpen, prueba]);

  const toggleSelectStudent = (id: string) => {
    setSelectedStudentIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAllStudents = () => {
    if (selectedStudentIds.length === listaAlumnos.length) {
      setSelectedStudentIds([]);
    } else {
      setSelectedStudentIds(listaAlumnos.map(a => a.id));
    }
  };

  // Filter and prepare questions for this evaluation strictly by preguntasIds
  const preguntasDeLaPrueba = React.useMemo(() => {
    if (!prueba) return [];
    if (prueba.preguntasIds && prueba.preguntasIds.length > 0) {
      const byId = new Map((preguntas || []).map(p => [p.id, p]));
      const list = prueba.preguntasIds.map(id => byId.get(id)).filter((p): p is Pregunta => Boolean(p));
      if (list.length > 0) return list;
    }
    return (preguntas || []).filter(p => p.asignaturaId === prueba.asignaturaId).slice(0, prueba.totalPreguntas || 30);
  }, [prueba, preguntas]);

  // If none matched, fallback to all provided questions up to totalPreguntas
  const itemsToPrint: Pregunta[] = preguntasDeLaPrueba.length > 0
    ? preguntasDeLaPrueba
    : (preguntas || []).slice(0, prueba?.totalPreguntas || 30);

  const selectedStudentsToPrint = listaAlumnos.filter(a => selectedStudentIds.includes(a.id));

  if (!isOpen || !prueba) return null;

  const handlePrint = () => {
    // Set document title so Chrome/Edge uses it as the default PDF filename
    const docSuffix =
      printMode === 'cuadernillo' ? 'Cuadernillo de Evaluación'
      : printMode === 'personalizado' ? `Cuadernillos Personalizados (${selectedStudentsToPrint.length} alumnos)`
      : printMode === 'hoja_respuestas' ? 'Hoja de Respuestas'
      : 'Pauta Clave Docente';
    const originalTitle = document.title;
    document.title = `${prueba.titulo} - ${docSuffix} (${prueba.cursoNombre})`;
    
    // Add temporary class to #root for legacy browser fallback
    const rootEl = document.getElementById('root');
    if (rootEl) rootEl.classList.add('printing-modal-active');

    window.print();

    // Restore after print dialog closes
    setTimeout(() => {
      document.title = originalTitle;
      if (rootEl) rootEl.classList.remove('printing-modal-active');
    }, 1000);
  };

  const modalContent = (
    <div className="print-modal-portal fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      {/* Container - Screen View */}
      <div className="print-modal-inner bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col my-4 overflow-hidden">
        {/* Top Control Bar (Hidden when printing) */}
        <div className="print-control-bar border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 print:hidden">
          {/* Row 1: Header Info & Action Buttons */}
          <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/70 dark:border-slate-800/70">
            <div className="flex items-center gap-3">
              <span className="p-2 bg-indigo-600 text-white rounded-xl shadow-md shadow-indigo-600/30">
                <Printer className="w-5 h-5" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                    Centro de Impresión y Generación de PDF
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                    SIMCE Oficial
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {prueba.titulo} • <strong>{prueba.cursoNombre}</strong> ({prueba.asignaturaNombre})
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2.5 self-end sm:self-center">
              <button
                onClick={handlePrint}
                disabled={printMode === 'personalizado' && selectedStudentsToPrint.length === 0}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all hover:scale-105 active:scale-95"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir / Guardar PDF</span>
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                title="Cerrar modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Row 2: 4 Clear Mode Selector Tabs */}
          <div className="px-4 py-2.5 bg-slate-100 dark:bg-slate-900/90 grid grid-cols-2 lg:grid-cols-4 gap-2">
            <button
              onClick={() => setPrintMode('cuadernillo')}
              className={`flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                printMode === 'cuadernillo'
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/20'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-400'
              }`}
            >
              <FileText className="w-4 h-4 text-indigo-300" />
              <span>1. Cuadernillo Genérico</span>
            </button>

            <button
              onClick={() => setPrintMode('personalizado')}
              className={`flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                printMode === 'personalizado'
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/20'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-400'
              }`}
            >
              <Users className="w-4 h-4 text-indigo-300" />
              <span>2. Por Alumno ({selectedStudentsToPrint.length})</span>
            </button>

            <button
              onClick={() => setPrintMode('hoja_respuestas')}
              className={`flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                printMode === 'hoja_respuestas'
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/20'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-400'
              }`}
            >
              <CheckSquare className="w-4 h-4 text-indigo-300" />
              <span>3. Hoja Respuestas</span>
            </button>

            <button
              onClick={() => setPrintMode('pauta_docente')}
              className={`flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                printMode === 'pauta_docente'
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/20'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-400'
              }`}
            >
              <KeyRound className="w-4 h-4 text-indigo-300" />
              <span>4. Pauta Clave</span>
            </button>
          </div>
        </div>

        {/* Student Selector Bar in Personalizado Mode */}
        {printMode === 'personalizado' && (
          <div className="px-4 py-3 bg-indigo-50/70 dark:bg-slate-950 border-b border-indigo-200/60 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 print:hidden">
            {listaAlumnos.length === 0 ? (
              <div className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-2 py-1">
                <Users className="w-4 h-4 text-indigo-500 shrink-0" />
                <span>No hay estudiantes matriculados en este curso aún. Selecciona la pestaña <strong>"1. Cuadernillo Genérico"</strong> para imprimir una copia con línea en blanco para el nombre.</span>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-bold text-indigo-900 dark:text-indigo-300 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    Alumnos a imprimir ({selectedStudentsToPrint.length} de {listaAlumnos.length}):
                  </span>
                  <button
                    type="button"
                    onClick={handleSelectAllStudents}
                    className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    {selectedStudentIds.length === listaAlumnos.length ? 'Desmarcar Todos' : 'Marcar Todos'}
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto">
                  {listaAlumnos.map((alu, idx) => {
                    const isSelected = selectedStudentIds.includes(alu.id);
                    return (
                      <button
                        key={alu.id}
                        type="button"
                        onClick={() => toggleSelectStudent(alu.id)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all flex items-center gap-1 ${
                          isSelected
                            ? 'bg-indigo-600 text-white shadow-sm'
                            : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-800'
                        }`}
                      >
                        <span>{alu.numeroDeLista || idx + 1}. {alu.nombre} {alu.apellido.split(' ')[0]}</span>
                        {isSelected && <span className="text-[9px]">✓</span>}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}

        {/* Printable Paper Canvas Area */}
        <div className="print-canvas-wrapper p-4 sm:p-8 overflow-y-auto flex-1 bg-slate-100 dark:bg-slate-950/60 print:p-0 print:bg-white print:m-0 print:overflow-visible print:block">
          
          {/* ═════════════════════════════════════════════════════════════
              MODE 1 & 2: CUADERNILLO GENÉRICO / PERSONALIZADO POR ALUMNO
             ═════════════════════════════════════════════════════════════ */}
          {(printMode === 'cuadernillo' || printMode === 'personalizado') && (
            <div className="space-y-12 print:space-y-0">
              {(printMode === 'personalizado' ? (selectedStudentsToPrint.length > 0 ? selectedStudentsToPrint : [null]) : [null]).map((alumno, aluIdx, arr) => (
                <div
                  key={alumno ? alumno.id : `generico-${aluIdx}`}
                  className={`printable-paper-canvas max-w-4xl mx-auto bg-white text-black p-6 sm:p-10 rounded-2xl shadow-xl border border-slate-200 print:shadow-none print:border-0 print:p-0 print:m-0 print:max-w-none print:block print:overflow-visible print:h-auto${aluIdx < arr.length - 1 ? ' break-after-page page-break-after-always' : ''}`}
                >
                  {/* Membrete Oficial con Logo Institucional */}
                  <div className="border-b-2 border-black pb-3 mb-3 text-left">
                    <div className="flex items-start justify-between gap-3">
                      {/* Logo + Información del Colegio */}
                      <div className="flex items-center gap-3">
                        {establecimientoActual.logoUrl && (
                          <img
                            src={establecimientoActual.logoUrl}
                            alt="Logo Institucional"
                            className="w-14 h-14 object-contain print:w-12 print:h-12 shrink-0 rounded-md"
                          />
                        )}
                        <div className="space-y-0.5">
                          <div className="text-[11px] uppercase tracking-wider font-black text-slate-800">
                            {establecimientoActual.nombre}
                          </div>
                          {establecimientoActual.rbd && (
                            <div className="text-[9px] font-bold text-slate-600">
                              RBD: {establecimientoActual.rbd} {establecimientoActual.lema ? `• "${establecimientoActual.lema}"` : ''}
                            </div>
                          )}
                          <h1 className="text-base sm:text-lg font-black text-black tracking-tight uppercase">
                            {prueba.titulo}
                          </h1>
                          <div className="text-[11px] font-semibold text-slate-800">
                            Asignatura: <strong>{prueba.asignaturaNombre}</strong> • Nivel: <strong>{prueba.nivel}</strong> • Curso: <strong>{prueba.cursoNombre}</strong>
                          </div>
                        </div>
                      </div>

                      <div className="text-right text-[9px] text-slate-700 space-y-0.5 border border-black p-1.5 rounded shrink-0">
                        <div>Código: <strong className="font-mono">{prueba.codigoPublico}</strong></div>
                        <div>Tiempo: <strong>{prueba.duracionMinutos} min</strong></div>
                        <div>Ítems: <strong>{itemsToPrint.length} preguntas</strong></div>
                      </div>
                    </div>

                    {/* Student Identification Box */}
                    <div className="mt-2.5 pt-2 border-t border-dashed border-slate-400 grid grid-cols-12 gap-2 text-[11px]">
                      <div className="col-span-12 sm:col-span-6 border-b border-black pb-0.5">
                        <span className="font-bold text-slate-700">Estudiante: </span>
                        <strong className="text-black uppercase">
                          {alumno ? `${alumno.nombre} ${alumno.apellido}` : '____________________________________'}
                        </strong>
                      </div>
                      <div className="col-span-6 sm:col-span-3 border-b border-black pb-0.5">
                        <span className="font-bold text-slate-700">RUT: </span>
                        <strong className="text-black font-mono">
                          {alumno ? alumno.rut : '_______________'}
                        </strong>
                      </div>
                      <div className="col-span-6 sm:col-span-3 border-b border-black pb-0.5">
                        <span className="font-bold text-slate-700">{alumno ? 'N° Lista / Curso:' : 'Fecha:'} </span>
                        <strong className="text-black">
                          {alumno ? `N° ${alumno.numeroDeLista || aluIdx + 1} (${alumno.cursoNombre})` : '___/___/2026'}
                        </strong>
                      </div>
                    </div>
                  </div>

                  {/* Instrucciones Generales */}
                  <div className="bg-slate-50 border border-slate-300 p-2 rounded text-[10px] leading-tight text-left mb-3">
                    <strong>INSTRUCCIONES GENERALES:</strong>
                    <ul className="list-disc list-inside mt-0.5 space-y-0.5 text-slate-800">
                      <li>Lee atentamente cada texto y enunciado antes de contestar.</li>
                      <li>Dispones de {prueba.duracionMinutos} minutos para completar la evaluación.</li>
                      <li>En preguntas de alternativas, marca una sola opción rellenando el círculo en tu Hoja de Respuestas.</li>
                      <li>En preguntas de desarrollo, fundamenta tu respuesta con claridad y letra legible en los renglones provistos.</li>
                    </ul>
                  </div>

                  {/* Question List — Continuous Print Flow */}
                  <div className="space-y-4 pt-1 text-left">
                    {itemsToPrint.map((preg, idx) => {
                      // Helper to render markdown headings and bold cleanly
                      const renderEnunciadoContent = (text: string = '') => {
                        const lines = (text || '').split('\n');
                        return (
                          <div className="space-y-1 text-xs text-slate-900 leading-snug">
                            {lines.map((line, lIdx) => {
                              const trimmed = line ? line.trim() : '';
                              if (!trimmed) return null;
                              if (trimmed.startsWith('## ') || trimmed.startsWith('# ')) {
                                return (
                                  <div key={lIdx} className="font-bold text-xs sm:text-sm text-black pt-1 pb-0.5 border-b border-slate-300">
                                    {trimmed.replace(/^#+\s*/, '')}
                                  </div>
                                );
                              }
                              if (trimmed.startsWith('### ')) {
                                return (
                                  <div key={lIdx} className="font-bold text-xs text-slate-900 pt-0.5">
                                    {trimmed.replace(/^###\s*/, '')}
                                  </div>
                                );
                              }
                              const parts = trimmed.split(/(\*\*.*?\*\*)/g);
                              return (
                                <p key={lIdx} className="leading-relaxed">
                                  {parts.map((part, pIdx) => {
                                    if (part.startsWith('**') && part.endsWith('**')) {
                                      return <strong key={pIdx} className="font-bold text-black">{part.slice(2, -2)}</strong>;
                                    }
                                    return part;
                                  })}
                                </p>
                              );
                            })}
                          </div>
                        );
                      };

                      return (
                        <div key={preg.id || idx} className="page-break-inside-auto space-y-2 pb-3 border-b border-slate-200 last:border-0">
                          {/* Question Number & Enunciado */}
                          <div className="flex items-start gap-2">
                            <span className="font-black text-xs bg-black text-white px-1.5 py-0.5 rounded flex-shrink-0">
                              {idx + 1}
                            </span>
                            <div className="flex-1">
                              {renderEnunciadoContent(preg.enunciado)}
                            </div>
                          </div>

                          {/* Figure / Image if exists */}
                          {preg.imagenUrl && (
                            <div className="my-1.5 flex justify-center page-break-inside-avoid">
                              <img
                                src={preg.imagenUrl}
                                alt={`Figura pregunta ${idx + 1}`}
                                className="max-h-48 max-w-full object-contain border border-slate-300 rounded p-1 bg-white"
                              />
                            </div>
                          )}

                          {/* Alternativas (A, B, C, D) — Protected from splitting awkwardly */}
                          {preg.alternativas && preg.alternativas.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pl-6 pt-1 page-break-inside-avoid">
                              {preg.alternativas.map((alt) => (
                                <div
                                  key={alt.letra}
                                  className="text-xs flex items-start gap-2 p-1 rounded border border-slate-200 bg-slate-50/50"
                                >
                                  <span className="w-4 h-4 rounded-full border border-black font-bold flex items-center justify-center text-[9px] flex-shrink-0 bg-white">
                                    {alt.letra}
                                  </span>
                                  <span className="text-slate-900 leading-tight">{alt.texto}</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            /* Preguntas de Desarrollo / Rúbrica: Espacio pautado compacto para responder */
                            <div className="pl-6 pt-1 space-y-2 page-break-inside-avoid">
                              <div className="text-[10px] text-slate-500 font-semibold italic">Espacio para respuesta del estudiante:</div>
                              <div className="border border-slate-300 rounded-lg p-2 bg-slate-50/30 space-y-3">
                                <div className="border-b border-dotted border-slate-400 h-4"></div>
                                <div className="border-b border-dotted border-slate-400 h-4"></div>
                                <div className="border-b border-dotted border-slate-400 h-4"></div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ═════════════════════════════════════════════════════════════
              MODE 3: HOJA DE RESPUESTAS OFICIAL (BUBBLE SHEET)
             ═════════════════════════════════════════════════════════════ */}
          {printMode === 'hoja_respuestas' && (
            <div className="printable-paper-canvas max-w-4xl mx-auto bg-white text-black p-8 sm:p-12 rounded-2xl shadow-xl border border-slate-200 print:shadow-none print:border-0 print:p-0 print:m-0 print:max-w-none print:block print:overflow-visible print:h-auto">
              {/* Membrete Oficial con Logo */}
              <div className="border-b-2 border-black pb-4 mb-6 text-left">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    {establecimientoActual.logoUrl && (
                      <img
                        src={establecimientoActual.logoUrl}
                        alt="Logo Institucional"
                        className="w-14 h-14 object-contain print:w-12 print:h-12 shrink-0 rounded-md"
                      />
                    )}
                    <div className="space-y-0.5">
                      <div className="text-[11px] uppercase tracking-widest font-black text-slate-800">
                        {establecimientoActual.nombre}
                      </div>
                      <h1 className="text-xl font-black text-black tracking-tight uppercase">
                        HOJA DE RESPUESTAS — {prueba.titulo}
                      </h1>
                      <div className="text-xs font-semibold text-slate-800">
                        Asignatura: <strong>{prueba.asignaturaNombre}</strong> • Nivel: <strong>{prueba.nivel}</strong> • Curso: <strong>{prueba.cursoNombre}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="text-right text-[10px] text-slate-600 space-y-0.5 border border-black p-2 rounded shrink-0">
                    <div>Código Prueba: <strong className="font-mono">{prueba.codigoPublico}</strong></div>
                    <div>Tiempo Límite: <strong>{prueba.duracionMinutos} min</strong></div>
                    <div>Total Ítems: <strong>{itemsToPrint.length} preguntas</strong></div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-dashed border-slate-400 grid grid-cols-12 gap-3 text-xs">
                  <div className="col-span-12 sm:col-span-6 border-b border-black pb-1">
                    <span className="font-bold text-slate-700">Nombre del Estudiante:</span>
                  </div>
                  <div className="col-span-6 sm:col-span-3 border-b border-black pb-1">
                    <span className="font-bold text-slate-700">RUT:</span>
                  </div>
                  <div className="col-span-6 sm:col-span-3 border-b border-black pb-1">
                    <span className="font-bold text-slate-700">Fecha:</span>
                  </div>
                </div>
              </div>

              {/* Bubble Sheet Header Box */}
              <div className="border-2 border-black p-4 rounded-lg bg-slate-50 space-y-3 text-left">
                <div className="text-center font-black uppercase text-sm tracking-wider">
                  HOJA DE RESPUESTAS OFICIAL — {APP_CONFIG.nombreEstablecimiento}
                </div>
                <div className="text-[11px] text-center text-slate-700 leading-relaxed">
                  Rellena completamente el círculo de la alternativa elegida: 
                  <span className="inline-flex items-center gap-1 font-bold ml-2">
                    <span className="w-3.5 h-3.5 rounded-full bg-black inline-block"></span> Correcto
                  </span>
                  <span className="inline-flex items-center gap-1 font-bold ml-3 text-slate-400">
                    <span className="w-3.5 h-3.5 rounded-full border border-black inline-block text-center text-[9px] leading-none">✓</span> Incorrecto
                  </span>
                </div>
              </div>

              {/* Bubble Grid (Multi-column) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
                {Array.from({ length: 4 }).map((_, colIdx) => {
                  const itemsPerCol = Math.ceil(itemsToPrint.length / 4);
                  const colItems = itemsToPrint.slice(colIdx * itemsPerCol, (colIdx + 1) * itemsPerCol);

                  if (colItems.length === 0) return null;

                  return (
                    <div key={colIdx} className="border border-slate-300 rounded-lg p-2 bg-white space-y-1.5 text-left">
                      <div className="text-center text-[10px] font-black uppercase border-b border-slate-200 pb-1 text-slate-600">
                        Ítems {colIdx * itemsPerCol + 1} al {Math.min((colIdx + 1) * itemsPerCol, itemsToPrint.length)}
                      </div>
                      {colItems.map((_, i) => {
                        const num = colIdx * itemsPerCol + i + 1;
                        return (
                          <div key={num} className="flex items-center justify-between py-1 px-1 border-b border-slate-100 last:border-0">
                            <span className="font-bold text-xs w-6 text-slate-700">{num}.</span>
                            <div className="flex items-center gap-1.5">
                              {['A', 'B', 'C', 'D'].map((letra) => (
                                <div
                                  key={letra}
                                  className="w-5 h-5 rounded-full border-2 border-black flex items-center justify-center font-bold text-[10px] text-black"
                                >
                                  {letra}
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>

              {/* Teacher Signature / Score Footer Box */}
              <div className="mt-8 pt-6 border-t-2 border-black grid grid-cols-2 gap-8 text-xs text-left">
                <div className="border border-black p-3 rounded text-center h-24 flex flex-col justify-between">
                  <span className="text-[10px] font-bold uppercase text-slate-600">Firma del Estudiante</span>
                  <div className="border-t border-dashed border-slate-400 pt-1 text-[9px] text-slate-500">
                    Declaro haber revisado mis respuestas
                  </div>
                </div>
                <div className="border border-black p-3 rounded text-center h-24 flex flex-col justify-between">
                  <span className="text-[10px] font-bold uppercase text-slate-600">Uso Exclusivo del Docente / UTP</span>
                  <div className="flex items-center justify-around font-bold text-xs">
                    <span>Puntaje: ____ / {itemsToPrint.length}</span>
                    <span>Nota: ____</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ═════════════════════════════════════════════════════════════
              MODE 4: PAUTA Y CLAVE DOCENTE (RESPUESTAS CORRECTAS)
             ═════════════════════════════════════════════════════════════ */}
          {printMode === 'pauta_docente' && (
            <div className="printable-paper-canvas max-w-4xl mx-auto bg-white text-black p-8 sm:p-12 rounded-2xl shadow-xl border border-slate-200 print:shadow-none print:border-0 print:p-0 print:m-0 print:max-w-none print:block print:overflow-visible print:h-auto text-left">
              {/* Membrete */}
              <div className="border-b-2 border-black pb-4 mb-6 text-left">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    {establecimientoActual.logoUrl && (
                      <img
                        src={establecimientoActual.logoUrl}
                        alt="Logo Institucional"
                        className="w-14 h-14 object-contain print:w-12 print:h-12 shrink-0 rounded-md"
                      />
                    )}
                    <div className="space-y-0.5">
                      <div className="text-[11px] uppercase tracking-widest font-black text-slate-800">
                        {establecimientoActual.nombre}
                      </div>
                      <h1 className="text-xl font-black text-black tracking-tight uppercase">
                        {prueba.titulo}
                      </h1>
                      <div className="text-xs font-semibold text-slate-800">
                        Asignatura: <strong>{prueba.asignaturaNombre}</strong> • Nivel: <strong>{prueba.nivel}</strong> • Curso: <strong>{prueba.cursoNombre}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="text-right text-[10px] text-slate-600 space-y-0.5 border border-black p-2 rounded shrink-0">
                    <div>Código Prueba: <strong className="font-mono">{prueba.codigoPublico}</strong></div>
                    <div>Tiempo Límite: <strong>{prueba.duracionMinutos} min</strong></div>
                    <div>Total Ítems: <strong>{itemsToPrint.length} preguntas</strong></div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-amber-50 border border-amber-300 p-3 rounded text-xs text-amber-900 flex items-center justify-between">
                  <div>
                    <strong>PAUTA DE CORRECCIÓN Y CLAVE OFICIAL:</strong> Uso exclusivo del profesor de asignatura y equipo de UTP.
                  </div>
                  <span className="font-bold">Total: {itemsToPrint.length} ítems</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse border border-slate-300">
                    <thead>
                      <tr className="bg-slate-100 text-slate-800 font-bold uppercase text-[10px]">
                        <th className="border border-slate-300 py-2 px-3 text-center w-12">N°</th>
                        <th className="border border-slate-300 py-2 px-3 text-center w-16">Clave</th>
                        <th className="border border-slate-300 py-2 px-3">Eje Curricular</th>
                        <th className="border border-slate-300 py-2 px-3">Habilidad Cognitiva</th>
                        <th className="border border-slate-300 py-2 px-3 text-center w-20">Dificultad</th>
                        <th className="border border-slate-300 py-2 px-3 text-center w-16">Puntos</th>
                      </tr>
                    </thead>
                    <tbody>
                      {itemsToPrint.map((preg, idx) => {
                        const correcta = preg.alternativas?.find(a => a.es_correcta)?.letra || preg.respuestaCorrecta || 'A';
                        return (
                          <tr key={preg.id || idx} className="hover:bg-slate-50">
                            <td className="border border-slate-300 py-2 px-3 text-center font-bold">{idx + 1}</td>
                            <td className="border border-slate-300 py-2 px-3 text-center font-black text-sm bg-emerald-100 text-emerald-900">
                              {correcta}
                            </td>
                            <td className="border border-slate-300 py-2 px-3">{preg.ejeTematicoId || 'Contenido curricular'}</td>
                            <td className="border border-slate-300 py-2 px-3">{preg.habilidadId || 'Aplicar'}</td>
                            <td className="border border-slate-300 py-2 px-3 text-center capitalize">{preg.dificultad}</td>
                            <td className="border border-slate-300 py-2 px-3 text-center font-bold">{preg.puntaje}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );

  return modalContent;
};
