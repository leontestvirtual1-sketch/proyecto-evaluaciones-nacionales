import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Prueba, Asignatura, Pregunta } from '../types';
import {
  BookOpen,
  PlusCircle,
  Search,
  Clock,
  Check,
  Copy,
  BarChart2,
  FileText,
  Printer,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Layers,
  Eye,
  X,
  HelpCircle,
  FileCheck,
  BookMarked,
  Mail,
  Edit3
} from 'lucide-react';
import { EditarPreguntaModal } from '../components/EditarPreguntaModal';
import { UserProfile, RendicionPrueba } from '../types';
import { EnviarEvaluacionModal } from '../components/EnviarEvaluacionModal';
import { PrintEvaluacionModal } from '../components/PrintEvaluacionModal';
import { IngresoRespuestasModal } from '../components/IngresoRespuestasModal';
import { useAcademicData } from '../context/AcademicDataContext';
import { CatalogoEvaluacionesModal } from '../components/CatalogoEvaluacionesModal';
import { EnunciadoRenderer } from '../components/common/EnunciadoRenderer';
import { resolveImageUrl } from '../lib/storage';
import { supabase } from '../lib/supabaseClient';
import { mapRowToPregunta } from '../hooks/useBancoPreguntas';
import { preguntasLenguaje2MMock } from '../data/len2mQuestionsMock';
import { preguntasLenguaje2MJunioMock } from '../data/len2mJunioQuestionsMock';
import { preguntasLenguaje2MAbrilMock } from '../data/len2mAbrilQuestionsMock';
import { preguntasMatematica6BMock } from '../data/mat6bQuestionsMock';


interface EvaluacionMetadata {
  tipo: 'paes' | 'simce' | 'diagnostica' | 'aula';
  tipoLabel: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  anio?: string;
  edicion?: 'Regular' | 'Invierno';
  forma?: string;
  materiaOficial?: string;
}

function parseEvaluacionInfo(p: Prueba): EvaluacionMetadata {
  const full = `${p.titulo} ${p.id} ${p.descripcion || ''}`.toLowerCase();

  if (full.includes('paes') || full.includes('demre')) {
    const yearMatch = full.match(/\b(202\d)\b/);
    const anio = yearMatch ? yearMatch[1] : undefined;
    const isInvierno = full.includes('invierno');
    const edicion: 'Regular' | 'Invierno' = isInvierno ? 'Invierno' : 'Regular';
    const formaMatch = full.match(/forma\s*(\d+)/i);
    const forma = formaMatch ? `Forma ${formaMatch[1]}` : undefined;

    let materiaOficial = 'Competencia Lectora';
    if (full.includes('matemática 1') || full.includes('matematica 1') || full.includes('m1')) {
      materiaOficial = 'Competencia Matemática 1 (M1)';
    } else if (full.includes('matemática 2') || full.includes('matematica 2') || full.includes('m2')) {
      materiaOficial = 'Competencia Matemática 2 (M2)';
    } else if (full.includes('historia')) {
      materiaOficial = 'Historia y Cs. Sociales';
    } else if (full.includes('ciencias')) {
      materiaOficial = 'Ciencias';
    } else if (full.includes('lectora') || full.includes('lengua') || full.includes('lenguaje')) {
      materiaOficial = 'Competencia Lectora';
    }

    return {
      tipo: 'paes',
      tipoLabel: 'PAES Oficial',
      badgeBg: 'bg-indigo-500/15',
      badgeText: 'text-indigo-400',
      badgeBorder: 'border-indigo-500/30',
      anio,
      edicion,
      forma,
      materiaOficial,
    };
  }

  if (full.includes('simce')) {
    return {
      tipo: 'simce',
      tipoLabel: 'SIMCE Oficial',
      badgeBg: 'bg-cyan-500/15',
      badgeText: 'text-cyan-400',
      badgeBorder: 'border-cyan-500/30',
    };
  }

  if (full.includes('diagnóstic') || full.includes('diagnostica') || full.includes('diag')) {
    return {
      tipo: 'diagnostica',
      tipoLabel: 'Diagnóstica',
      badgeBg: 'bg-amber-500/15',
      badgeText: 'text-amber-400',
      badgeBorder: 'border-amber-500/30',
    };
  }

  return {
    tipo: 'aula',
    tipoLabel: 'Evaluación Institucional',
    badgeBg: 'bg-slate-500/15',
    badgeText: 'text-slate-400',
    badgeBorder: 'border-slate-500/30',
  };
}

interface PruebaFacsimilModalProps {
  isOpen: boolean;
  prueba: Prueba | null;
  preguntas: Pregunta[];
  isProduction?: boolean;
  canEdit?: boolean;
  onClose: () => void;
}

const PruebaFacsimilModal: React.FC<PruebaFacsimilModalProps> = ({
  isOpen,
  prueba,
  preguntas,
  isProduction = false,
  canEdit = false,
  onClose
}) => {
  const [loadedPreguntas, setLoadedPreguntas] = useState<Pregunta[]>([]);
  const [isLoadingPreguntas, setIsLoadingPreguntas] = useState<boolean>(false);
  const [editingPregunta, setEditingPregunta] = useState<Pregunta | null>(null);
  const [mostrarRespuestas, setMostrarRespuestas] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen || !prueba) {
      setLoadedPreguntas([]);
      setIsLoadingPreguntas(false);
      setMostrarRespuestas(false);
      return;
    }
    setMostrarRespuestas(false);

    const byId = new Map<string, Pregunta>();
    (preguntas || []).forEach(p => byId.set(p.id, p));
    const inMem = (prueba.preguntasIds || [])
      .map(id => byId.get(id))
      .filter((p): p is Pregunta => Boolean(p));

    if (prueba.preguntasIds && prueba.preguntasIds.length > 0 && inMem.length === prueba.preguntasIds.length) {
      setLoadedPreguntas(inMem);
      setIsLoadingPreguntas(false);
      return;
    }

    let active = true;
    setIsLoadingPreguntas(true);

    (async () => {
      try {
        // 1. Intentar vía endpoint seguro /api/evaluaciones-catalogo (con Service Role y respuestas correctas para docentes/admins)
        try {
          const { data: { session } } = await supabase.auth.getSession();
          const headers: Record<string, string> = {};
          if (session?.access_token) {
            headers['Authorization'] = `Bearer ${session.access_token}`;
          }

          const apiRes = await fetch(`/api/evaluaciones-catalogo?action=preguntas&evaluacion_id=${encodeURIComponent(prueba.id)}&include_key=1`, { headers });
          if (apiRes.ok) {
            const apiJson = await apiRes.json();
            if (active && Array.isArray(apiJson.preguntas) && apiJson.preguntas.length > 0) {
              const mapped = apiJson.preguntas.map(mapRowToPregunta);
              setLoadedPreguntas(mapped);
              return;
            }
          }
        } catch (apiErr) {
          console.warn('[PruebaFacsimilModal] Fallback a consulta directa:', apiErr);
        }

        // 2. Consulta directa a Supabase (si prueba.preguntasIds está presente)
        if (prueba.preguntasIds && prueba.preguntasIds.length > 0) {
          const { data: dbRows, error } = await supabase
            .from('preguntas')
            .select('*')
            .in('id', prueba.preguntasIds);

          if (!active) return;
          if (!error && dbRows && dbRows.length > 0) {
            const mapped = dbRows.map(mapRowToPregunta);
            const dbMap = new Map(mapped.map(q => [q.id, q]));
            const ordered = prueba.preguntasIds
              .map(id => dbMap.get(id))
              .filter((q): q is Pregunta => Boolean(q));
            setLoadedPreguntas(ordered);
            return;
          }
        }
      } catch (err) {
        console.error('[PruebaFacsimilModal] Error al cargar preguntas:', err);
      } finally {
        if (active) setIsLoadingPreguntas(false);
      }
    })();

    return () => { active = false; };
  }, [isOpen, prueba, preguntas]);

  // Match questions strictly by prueba.preguntasIds if defined, preserving order
  const preguntasDeLaPrueba = React.useMemo(() => {
    if (!prueba) return [];
    if (loadedPreguntas.length > 0) return loadedPreguntas;

    const byId = new Map<string, Pregunta>();
    // Solo cargar mocks en modo desarrollo/demo (Directivas 1 y 2)
    if (!isProduction) {
      [
        ...preguntasLenguaje2MMock,
        ...preguntasLenguaje2MJunioMock,
        ...preguntasLenguaje2MAbrilMock,
        ...preguntasMatematica6BMock
      ].forEach(p => byId.set(p.id, p));
    }
    (preguntas || []).forEach(p => byId.set(p.id, p));

    // Si tiene preguntasIds explícitas en BD, mapearlas en orden estricto
    if (prueba.preguntasIds && prueba.preguntasIds.length > 0) {
      const list = prueba.preguntasIds.map(id => byId.get(id)).filter((p): p is Pregunta => Boolean(p));
      if (list.length > 0) return list;
    }

    // En modo local demo sin BD, permitir mapeo por conveniencia
    if (!isProduction) {
      if (prueba.id === 'prueba-len2m-101' || prueba.id?.startsWith('prueba-len2m-101') || (prueba.titulo.includes('Agosto 2026') && prueba.nivel === '2° Medio')) {
        return preguntasLenguaje2MMock.map(p => byId.get(p.id) || p);
      }
      if (prueba.id === 'prueba-len2m-jun-101' || prueba.id?.startsWith('prueba-len2m-jun') || (prueba.titulo.includes('Junio 2026') && prueba.nivel === '2° Medio')) {
        return preguntasLenguaje2MJunioMock.map(p => byId.get(p.id) || p);
      }
      if (prueba.id === 'prueba-len2m-abr-101' || prueba.id?.startsWith('prueba-len2m-abr') || (prueba.titulo.includes('Abril 2026') && prueba.nivel === '2° Medio')) {
        return preguntasLenguaje2MAbrilMock.map(p => byId.get(p.id) || p);
      }
      if (prueba.id === 'eval-simce-mat-6b-e3' || prueba.id?.startsWith('eval-simce-mat-6b')) {
        return preguntasMatematica6BMock.map(p => byId.get(p.id) || p);
      }
    }

    // Filtrar por asignatura de la prueba
    return (preguntas || []).filter(p => p.asignaturaId === prueba.asignaturaId).slice(0, prueba.totalPreguntas || 30);
  }, [prueba, preguntas, loadedPreguntas, isProduction]);

  // Cerrar con Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !prueba) return null;

  const modalContent = (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Botón flotante siempre visible para volver atrás / cerrar */}
      <button
        onClick={onClose}
        className="fixed top-4 right-4 z-[110] flex items-center gap-2 bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-700 shadow-2xl backdrop-blur-md transition-all hover:scale-105 active:scale-95"
        title="Volver atrás / Cerrar (Esc)"
      >
        <X size={15} />
        <span>Volver / Cerrar (Esc)</span>
      </button>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col my-auto">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-4">
          <div className="space-y-1">
            {(() => {
              const modalMeta = parseEvaluacionInfo(prueba);
              return (
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold border ${modalMeta.badgeBg} ${modalMeta.badgeText} ${modalMeta.badgeBorder}`}>
                    {modalMeta.tipo === 'paes' ? '🏛️ PAES Oficial' : modalMeta.tipo === 'simce' ? '📊 SIMCE Oficial' : modalMeta.tipo === 'diagnostica' ? '📋 Diagnóstica' : 'Evaluación'}
                  </span>
                  {modalMeta.tipo === 'paes' && (
                    <>
                      {modalMeta.anio && (
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-slate-800 text-slate-200 border border-slate-700">
                          {modalMeta.anio}
                        </span>
                      )}
                      {modalMeta.edicion && (
                        <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold border ${modalMeta.edicion === 'Invierno' ? 'bg-sky-500/10 text-sky-400 border-sky-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
                          {modalMeta.edicion}
                        </span>
                      )}
                      {modalMeta.forma && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-purple-500/10 text-purple-300 border border-purple-500/20">
                          {modalMeta.forma}
                        </span>
                      )}
                    </>
                  )}
                  <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                    {modalMeta.tipo === 'paes' && modalMeta.materiaOficial ? `${modalMeta.materiaOficial} — ${prueba.nivel}` : `${prueba.asignaturaNombre} — ${prueba.nivel}`}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    Código: <strong className="font-mono text-indigo-500">{prueba.codigoPublico}</strong>
                  </span>
                  <span className="text-xs text-slate-400">
                    ⏱️ {prueba.duracionMinutos} min • 📝 {preguntasDeLaPrueba.length} preguntas
                  </span>
                </div>
              );
            })()}
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              {prueba.titulo}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {prueba.descripcion}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Toggle Facsímil Limpio vs Pauta con Respuestas */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setMostrarRespuestas(false)}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                  !mostrarRespuestas
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm font-bold'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
                title="Ver facsímil limpio sin respuestas (ideal para ensayar o proyectar en clases)"
              >
                <span>✨</span>
                <span>Facsímil Limpio</span>
              </button>
              <button
                type="button"
                onClick={() => setMostrarRespuestas(true)}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                  mostrarRespuestas
                    ? 'bg-emerald-600 text-white shadow-sm font-bold'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
                title="Ver alternativas correctas destacadas con su clave oficial"
              >
                <span>🔑</span>
                <span>Pauta con Respuestas</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: List of Questions */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 divide-y divide-slate-100 dark:divide-slate-800">
          {isLoadingPreguntas ? (
            <div className="text-center py-16 text-slate-400 space-y-3">
              <div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm font-bold text-slate-200">Cargando preguntas y textos oficiales del DEMRE...</p>
              <p className="text-xs text-slate-500">Recuperando ítems estructurados desde la base de datos...</p>
            </div>
          ) : preguntasDeLaPrueba.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <HelpCircle className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p className="text-sm font-semibold">No se encontraron preguntas cargadas para esta evaluación.</p>
            </div>
          ) : (
            preguntasDeLaPrueba.map((preg, idx) => (
              <div key={preg.id} className={`${idx > 0 ? 'pt-6' : ''} space-y-3`}>
                {/* Header item */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-md border border-indigo-500/20">
                      Pregunta N° {idx + 1}
                    </span>
                    <span className="capitalize text-slate-500 dark:text-slate-400">
                      Dificultad: <strong>{preg.dificultad}</strong>
                    </span>
                    <span>•</span>
                    <span className="text-slate-500 dark:text-slate-400">
                      Puntaje: <strong>{preg.puntaje} pt(s)</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400">
                      Fuente: {preg.fuente}
                    </span>
                    {canEdit && (
                      <button
                        onClick={() => setEditingPregunta(preg)}
                        className="flex items-center gap-1 px-2 py-1 text-[11px] font-semibold rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/20 hover:bg-amber-500/20 transition-colors"
                        title="Editar esta pregunta"
                      >
                        <Edit3 size={11} />
                        Editar
                      </button>
                    )}
                  </div>
                </div>

                {/* Enunciado con EnunciadoRenderer */}
                <div className="text-sm font-semibold text-slate-900 dark:text-white leading-relaxed">
                  <EnunciadoRenderer content={preg.enunciado} imagenUrl={preg.imagenUrl} />
                </div>

                {/* Imagen/Figura si existe (solo si no está insertada inline con [IMAGEN] o Markdown) */}
                {preg.imagenUrl && !(/\[(IMAGEN|FIGURA)\]/i.test(preg.enunciado || '') || preg.enunciado?.includes('![')) && (
                  <div className="p-3 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 flex justify-center overflow-hidden shadow-sm max-w-md my-2">
                    <img
                      src={resolveImageUrl(preg.imagenUrl)}
                      alt={`Figura Pregunta ${idx + 1}`}
                      className="max-h-64 w-auto object-contain rounded-lg"
                    />
                  </div>
                )}

                {/* Alternativas */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {[...preg.alternativas].sort((a, b) => (a.letra || '').localeCompare(b.letra || '')).map(alt => (
                    <div
                      key={alt.letra}
                      className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 transition-all ${
                        alt.es_correcta && mostrarRespuestas
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-semibold'
                          : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span className={`w-5 h-5 rounded-md text-[11px] font-bold flex items-center justify-center flex-shrink-0 ${
                        alt.es_correcta && mostrarRespuestas
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}>
                        {alt.letra}
                      </span>
                      <span className="pt-0.5">
                        <EnunciadoRenderer content={alt.texto} inline={true} />
                      </span>
                      {alt.es_correcta && mostrarRespuestas && (
                        <span className="ml-auto text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400">
                          ✓ Correcta
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Total preguntas estructuradas: <strong>{preguntasDeLaPrueba.length}</strong>
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white text-xs font-bold rounded-xl"
          >
            Cerrar Facsímil
          </button>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined'
    ? createPortal(
        <>
          {modalContent}
          {canEdit && (
            <EditarPreguntaModal
              isOpen={editingPregunta !== null}
              onClose={() => setEditingPregunta(null)}
              pregunta={editingPregunta}
              subfolder="evaluaciones"
              onSaveSuccess={(preguntaActualizada) => {
                setLoadedPreguntas(prev =>
                  prev.map(p => p.id === preguntaActualizada.id ? preguntaActualizada : p)
                );
                setEditingPregunta(null);
              }}
            />
          )}
        </>,
        document.body
      )
    : modalContent;
};

interface EvaluacionesPageProps {
  pruebas: Prueba[];
  asignaturas: Asignatura[];
  bancoPreguntas?: Pregunta[];
  currentUser?: UserProfile;
  isSandboxMode?: boolean;
  onOpenGenerator: () => void;
  onSelectPruebaReporte: (pruebaId: string) => void;
  onUpdatePruebaEstado: (pruebaId: string, nuevoEstado: 'borrador' | 'activa' | 'finalizada') => void;
  onAddRendicion?: (rendicion: RendicionPrueba) => void;
  modulo?: 'evaluaciones' | 'simce' | 'paes' | 'todos';
}

export const EvaluacionesPage: React.FC<EvaluacionesPageProps> = ({
  pruebas,
  asignaturas,
  bancoPreguntas = [],
  currentUser,
  isSandboxMode = false,
  onOpenGenerator,
  onSelectPruebaReporte,
  onUpdatePruebaEstado,
  modulo = 'todos'
}) => {
  const { alumnos } = useAcademicData();
  const isDocente = currentUser?.rol === 'profesor' && currentUser?.asignaturaId;
  const initialAsignatura = isDocente ? currentUser.asignaturaId! : 'todos';

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAsignatura, setSelectedAsignatura] = useState<string>(initialAsignatura);
  const [selectedEstado, setSelectedEstado] = useState<string>('todos');
  const [tipoFiltro, setTipoFiltro] = useState<'todos' | 'paes' | 'simce' | 'diagnostica'>('todos');
  const [anioPaesFiltro, setAnioPaesFiltro] = useState<string>('todos');
  const [nivelSimceFiltro, setNivelSimceFiltro] = useState<string>('todos');
  const [tipoInternoFiltro, setTipoInternoFiltro] = useState<'todos' | 'aula' | 'diagnostica'>('todos');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [facsimilModalOpen, setFacsimilModalOpen] = useState(false);
  const [selectedPruebaForFacsimil, setSelectedPruebaForFacsimil] = useState<Prueba | null>(null);
  const [printModalOpen, setPrintModalOpen] = useState(false);
  const [selectedPruebaForPrint, setSelectedPruebaForPrint] = useState<Prueba | null>(null);
  const [respuestasModalOpen, setRespuestasModalOpen] = useState(false);
  const [selectedPruebaForRespuestas, setSelectedPruebaForRespuestas] = useState<Prueba | null>(null);
  const [catalogoModalOpen, setCatalogoModalOpen] = useState(false);
  const [enviarModalOpen, setEnviarModalOpen] = useState(false);
  const [selectedPruebaForEnviar, setSelectedPruebaForEnviar] = useState<Prueba | null>(null);

  const showToast = (msg: string) => {

    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    showToast(`Código ${code} copiado al portapapeles`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleOpenFacsimil = (p: Prueba) => {
    setSelectedPruebaForFacsimil(p);
    setFacsimilModalOpen(true);
  };

  // If user is a teacher, filter to their subject
  const userPruebas = isDocente ? pruebas.filter(p => p.asignaturaId === currentUser.asignaturaId) : pruebas;

  // Evaluaciones correspondientes al módulo activo
  const moduloPruebas = React.useMemo(() => {
    if (modulo === 'paes') {
      return userPruebas.filter(p => parseEvaluacionInfo(p).tipo === 'paes');
    }
    if (modulo === 'simce') {
      return userPruebas.filter(p => parseEvaluacionInfo(p).tipo === 'simce');
    }
    if (modulo === 'evaluaciones') {
      return userPruebas.filter(p => {
        const t = parseEvaluacionInfo(p).tipo;
        return t === 'aula' || t === 'diagnostica';
      });
    }
    return userPruebas;
  }, [userPruebas, modulo]);

  const conteoTotal = userPruebas.length;
  const conteoPaes = React.useMemo(() => userPruebas.filter(p => parseEvaluacionInfo(p).tipo === 'paes').length, [userPruebas]);
  const conteoSimce = React.useMemo(() => userPruebas.filter(p => parseEvaluacionInfo(p).tipo === 'simce').length, [userPruebas]);
  const conteoDiag = React.useMemo(() => userPruebas.filter(p => parseEvaluacionInfo(p).tipo === 'diagnostica').length, [userPruebas]);
  const conteoInternas = React.useMemo(() => userPruebas.filter(p => {
    const t = parseEvaluacionInfo(p).tipo;
    return t === 'aula' || t === 'diagnostica';
  }).length, [userPruebas]);

  const aniosPaesDisponibles = React.useMemo(() => {
    const set = new Set<string>();
    userPruebas.forEach(p => {
      const meta = parseEvaluacionInfo(p);
      if (meta.tipo === 'paes' && meta.anio) {
        set.add(meta.anio);
      }
    });
    return Array.from(set).sort().reverse();
  }, [userPruebas]);

  const filteredPruebas = moduloPruebas.filter((prueba) => {
    const meta = parseEvaluacionInfo(prueba);

    // Subfiltros según módulo
    if (modulo === 'paes') {
      if (anioPaesFiltro !== 'todos' && meta.anio !== anioPaesFiltro) {
        return false;
      }
    } else if (modulo === 'simce') {
      if (nivelSimceFiltro !== 'todos' && prueba.nivel !== nivelSimceFiltro) {
        return false;
      }
    } else if (modulo === 'evaluaciones') {
      if (tipoInternoFiltro === 'aula' && meta.tipo !== 'aula') return false;
      if (tipoInternoFiltro === 'diagnostica' && meta.tipo !== 'diagnostica') return false;
    } else {
      // Modo consolidado / todos
      if (tipoFiltro !== 'todos' && meta.tipo !== tipoFiltro) {
        return false;
      }
      if (tipoFiltro === 'paes' && anioPaesFiltro !== 'todos' && meta.anio !== anioPaesFiltro) {
        return false;
      }
    }

    const matchesSearch =
      prueba.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prueba.codigoPublico.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prueba.asignaturaNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (meta.materiaOficial && meta.materiaOficial.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (meta.anio && meta.anio.includes(searchTerm));
    
    const matchesAsignatura =
      selectedAsignatura === 'todos' || prueba.asignaturaId === selectedAsignatura;
    
    const matchesEstado =
      selectedEstado === 'todos' || prueba.estado === selectedEstado;

    return matchesSearch && matchesAsignatura && matchesEstado;
  });

  const moduloActivas = moduloPruebas.filter((p) => p.estado === 'activa').length;
  const moduloFinalizadas = moduloPruebas.filter((p) => p.estado === 'finalizada').length;
  const moduloBorradores = moduloPruebas.filter((p) => p.estado === 'borrador').length;

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-800 flex items-center gap-2 animate-bounce-short text-xs font-semibold">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner Dinámico por Módulo */}
      <div className="glass-card p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-indigo-500/20 text-white relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {modulo === 'paes' ? (
                <>🏛️ Módulo PAES Oficiales DEMRE</>
              ) : modulo === 'simce' ? (
                <>📊 Módulo Ensayos SIMCE Estandarizados</>
              ) : modulo === 'evaluaciones' ? (
                <>🏫 Módulo Evaluaciones & Controles Internos</>
              ) : (
                <><BookOpen className="w-3.5 h-3.5 mr-1.5 text-indigo-400" /> Gestión General de Evaluaciones & Ensayos</>
              )}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {modulo === 'paes'
                ? 'PAES Oficiales DEMRE'
                : modulo === 'simce'
                ? 'Ensayos SIMCE Estandarizados'
                : modulo === 'evaluaciones'
                ? (currentUser?.rol === 'profesor' ? `Mis Evaluaciones & Controles — ${currentUser.asignaturaNombre || 'Especialidad'}` : 'Evaluaciones & Controles Internos')
                : (currentUser?.rol === 'profesor' ? `Mis Evaluaciones — ${currentUser.asignaturaNombre || 'Especialidad'}` : 'Evaluaciones Creadas')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              {modulo === 'paes'
                ? 'Catálogo completo de pruebas y facsímiles oficiales liberados por DEMRE (Procesos de Admisión 2023, 2024, 2025 y 2026 Regular e Invierno) para Competencia Lectora, M1, M2, Ciencias (Biología, Física, Química) e Historia.'
                : modulo === 'simce'
                ? 'Batería de ensayos formativos oficiales SIMCE para 4° Básico, 6° Básico y 2° Medio con métricas de logro y cobertura curricular estandarizada MINEDUC.'
                : modulo === 'evaluaciones'
                ? 'Crea, administra y calibra pruebas de unidad, diagnósticos de aula y controles institucionales diseñados por el equipo docente.'
                : 'Crea, administra y distribuye pruebas estandarizadas nacionales y ensayos SIMCE. Obtén códigos de acceso directo para tus alumnos y analiza los resultados en tiempo real.'}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap justify-end">
            {/* Catálogo de Evaluaciones: visible para profesores y administradores */}
            {(currentUser?.rol === 'profesor' || currentUser?.rol === 'admin') && !isSandboxMode && (
              <button
                id="btn-catalogo-evaluaciones"
                onClick={() => setCatalogoModalOpen(true)}
                className="flex items-center justify-center gap-2 bg-violet-700 hover:bg-violet-600 active:bg-violet-800 text-white font-bold px-4 py-3 rounded-xl shadow-lg shadow-violet-700/20 transition-all hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
              >
                <BookMarked className="w-4 h-4" />
                <span className="hidden sm:inline">Catálogo de Evaluaciones</span>
                <span className="sm:hidden">📚</span>
              </button>
            )}
            <button
              onClick={onOpenGenerator}
              className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-bold px-5 py-3 rounded-xl shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
            >
              <PlusCircle className="w-5 h-5" />
              <span>Nueva Evaluación</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Quick Grid adaptada al módulo */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-card p-4 flex items-center gap-3">
          <div className="p-2.5 bg-indigo-500/10 text-indigo-500 rounded-xl">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
              {modulo === 'paes' ? 'Total PAES' : modulo === 'simce' ? 'Total SIMCE' : modulo === 'evaluaciones' ? 'Total Internas' : 'Total Ensayos'}
            </p>
            <p className="text-xl font-extrabold text-slate-900 dark:text-white">{moduloPruebas.length}</p>
          </div>
        </div>

        <div className="glass-card p-4 flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/10 text-emerald-500 rounded-xl">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Activas</p>
            <p className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">{moduloActivas}</p>
          </div>
        </div>

        <div className="glass-card p-4 flex items-center gap-3">
          <div className="p-2.5 bg-slate-500/10 text-slate-500 rounded-xl">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Finalizadas</p>
            <p className="text-xl font-extrabold text-slate-700 dark:text-slate-300">{moduloFinalizadas}</p>
          </div>
        </div>

        <div className="glass-card p-4 flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/10 text-amber-500 rounded-xl">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Borradores</p>
            <p className="text-xl font-extrabold text-amber-600 dark:text-amber-400">{moduloBorradores}</p>
          </div>
        </div>
      </div>

      {/* Selector / Pestañas según Módulo */}
      <div className="glass-card p-4 space-y-3">
        {modulo === 'paes' ? (
          /* Pestañas específicas para Módulo PAES */
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="text-slate-400 font-semibold flex items-center gap-1 mr-1">
              <span>📅 Proceso Admisión:</span>
            </span>
            <button
              onClick={() => setAnioPaesFiltro('todos')}
              className={`px-3 py-1.5 rounded-xl font-bold border transition-all ${
                anioPaesFiltro === 'todos'
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                  : 'bg-slate-900/60 text-slate-300 border-slate-700 hover:border-slate-500'
              }`}
            >
              Todos los Procesos ({conteoPaes})
            </button>
            {aniosPaesDisponibles.map((yr) => {
              const countYr = userPruebas.filter(p => {
                const m = parseEvaluacionInfo(p);
                return m.tipo === 'paes' && m.anio === yr;
              }).length;
              return (
                <button
                  key={yr}
                  onClick={() => setAnioPaesFiltro(yr)}
                  className={`px-3 py-1.5 rounded-xl font-bold border transition-all ${
                    anioPaesFiltro === yr
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                      : 'bg-slate-900/60 text-slate-300 border-slate-700 hover:border-slate-500'
                  }`}
                >
                  Proceso {yr} ({countYr})
                </button>
              );
            })}
          </div>
        ) : modulo === 'simce' ? (
          /* Pestañas específicas para Módulo SIMCE */
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="text-slate-400 font-semibold flex items-center gap-1 mr-1">
              <span>🎓 Nivel Escolar:</span>
            </span>
            {['todos', '2° Medio', '6° Básico', '4° Básico'].map((lvl) => {
              const count = lvl === 'todos'
                ? conteoSimce
                : userPruebas.filter(p => parseEvaluacionInfo(p).tipo === 'simce' && p.nivel === lvl).length;
              return (
                <button
                  key={lvl}
                  onClick={() => setNivelSimceFiltro(lvl)}
                  className={`px-3 py-1.5 rounded-xl font-bold border transition-all ${
                    nivelSimceFiltro === lvl
                      ? 'bg-cyan-600 text-white border-cyan-500 shadow-sm'
                      : 'bg-slate-900/60 text-slate-300 border-slate-700 hover:border-slate-500'
                  }`}
                >
                  {lvl === 'todos' ? `Todos los Niveles (${count})` : `${lvl} (${count})`}
                </button>
              );
            })}
          </div>
        ) : modulo === 'evaluaciones' ? (
          /* Pestañas específicas para Evaluaciones & Controles Internos */
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="text-slate-400 font-semibold flex items-center gap-1 mr-1">
              <span>📋 Tipo de Instrumento:</span>
            </span>
            <button
              onClick={() => setTipoInternoFiltro('todos')}
              className={`px-3 py-1.5 rounded-xl font-bold border transition-all ${
                tipoInternoFiltro === 'todos'
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                  : 'bg-slate-900/60 text-slate-300 border-slate-700 hover:border-slate-500'
              }`}
            >
              Todas las Internas ({conteoInternas})
            </button>
            <button
              onClick={() => setTipoInternoFiltro('aula')}
              className={`px-3 py-1.5 rounded-xl font-bold border transition-all ${
                tipoInternoFiltro === 'aula'
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                  : 'bg-slate-900/60 text-slate-300 border-slate-700 hover:border-slate-500'
              }`}
            >
              🏫 Pruebas de Aula ({userPruebas.filter(p => parseEvaluacionInfo(p).tipo === 'aula').length})
            </button>
            <button
              onClick={() => setTipoInternoFiltro('diagnostica')}
              className={`px-3 py-1.5 rounded-xl font-bold border transition-all ${
                tipoInternoFiltro === 'diagnostica'
                  ? 'bg-amber-600 text-white border-amber-500 shadow-sm'
                  : 'bg-slate-900/60 text-slate-300 border-slate-700 hover:border-slate-500'
              }`}
            >
              📋 Pruebas Diagnósticas ({conteoDiag})
            </button>
          </div>
        ) : (
          /* Modo Consolidado (Todos los Instrumentos) */
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                <button
                  onClick={() => { setTipoFiltro('todos'); setAnioPaesFiltro('todos'); }}
                  className={`px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                    tipoFiltro === 'todos'
                      ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                      : 'bg-slate-900/40 text-slate-400 hover:text-white border border-transparent'
                  }`}
                >
                  <span>Todas las Evaluaciones ({conteoTotal})</span>
                </button>

                <button
                  onClick={() => setTipoFiltro('paes')}
                  className={`px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
                    tipoFiltro === 'paes'
                      ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/30 border border-indigo-400/40 scale-[1.02]'
                      : 'bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 border border-indigo-500/20'
                  }`}
                >
                  <span>🏛️</span>
                  <span>PAES Oficiales DEMRE ({conteoPaes})</span>
                </button>

                <button
                  onClick={() => { setTipoFiltro('simce'); setAnioPaesFiltro('todos'); }}
                  className={`px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
                    tipoFiltro === 'simce'
                      ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30 border border-cyan-400/40 scale-[1.02]'
                      : 'bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 border border-cyan-500/20'
                  }`}
                >
                  <span>📊</span>
                  <span>Ensayos SIMCE ({conteoSimce})</span>
                </button>

                <button
                  onClick={() => { setTipoFiltro('diagnostica'); setAnioPaesFiltro('todos'); }}
                  className={`px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
                    tipoFiltro === 'diagnostica'
                      ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30 border border-amber-400/40 scale-[1.02]'
                      : 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/20'
                  }`}
                >
                  <span>📋</span>
                  <span>Pruebas Diagnósticas ({conteoDiag})</span>
                </button>
              </div>

              {tipoFiltro !== 'todos' && (
                <button
                  onClick={() => { setTipoFiltro('todos'); setAnioPaesFiltro('todos'); }}
                  className="text-xs text-indigo-400 hover:text-indigo-300 underline font-semibold"
                >
                  ✕ Mostrar todas
                </button>
              )}
            </div>

            {/* Sub-filtro de Años / Procesos PAES en modo consolidado */}
            {tipoFiltro === 'paes' && aniosPaesDisponibles.length > 0 && (
              <div className="pt-2.5 border-t border-indigo-500/20 flex items-center gap-2 flex-wrap text-xs">
                <span className="text-slate-400 font-semibold flex items-center gap-1">
                  <span>📅 Proceso PAES:</span>
                </span>
                <button
                  onClick={() => setAnioPaesFiltro('todos')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all ${
                    anioPaesFiltro === 'todos'
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                      : 'bg-slate-900/60 text-slate-300 border-slate-700 hover:border-slate-500'
                  }`}
                >
                  Todos los Procesos ({conteoPaes})
                </button>
                {aniosPaesDisponibles.map((yr) => {
                  const countYr = userPruebas.filter(p => {
                    const m = parseEvaluacionInfo(p);
                    return m.tipo === 'paes' && m.anio === yr;
                  }).length;
                  return (
                    <button
                      key={yr}
                      onClick={() => setAnioPaesFiltro(yr)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all ${
                        anioPaesFiltro === yr
                          ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                          : 'bg-slate-900/60 text-slate-300 border-slate-700 hover:border-slate-500'
                      }`}
                    >
                      PAES {yr} ({countYr})
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Filters Bar */}
      <div className="glass-card p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por título, código o materia..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {!isDocente && (
            <select
              value={selectedAsignatura}
              onChange={(e) => setSelectedAsignatura(e.target.value)}
              className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-semibold outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="todos">Todas las Asignaturas</option>
              {asignaturas.map((a) => (
                <option key={a.id} value={a.id}>{a.nombre}</option>
              ))}
            </select>
          )}

          <select
            value={selectedEstado}
            onChange={(e) => setSelectedEstado(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-semibold outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="todos">Todos los Estados</option>
            <option value="activa">Activa</option>
            <option value="finalizada">Finalizada</option>
            <option value="borrador">Borrador</option>
          </select>
        </div>
      </div>

      {/* Evaluations Grid */}
      {filteredPruebas.length === 0 ? (
        <div className="glass-card p-12 text-center space-y-4">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800/80 rounded-full flex items-center justify-center mx-auto text-slate-400">
            <BookOpen className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">No se encontraron evaluaciones</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Prueba ajustando los filtros de búsqueda o genera una nueva evaluación haciendo clic en el botón superior.
          </p>
          <button
            onClick={onOpenGenerator}
            className="inline-flex items-center gap-2 bg-indigo-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Generar Evaluación</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredPruebas.map((prueba) => {
            const meta = parseEvaluacionInfo(prueba);
            const isPaes = meta.tipo === 'paes';

            const estadoColor =
              prueba.estado === 'activa'
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                : prueba.estado === 'finalizada'
                ? 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20'
                : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';

            return (
              <div
                key={prueba.id}
                className={`glass-card p-6 space-y-5 flex flex-col justify-between transition-all duration-300 ${
                  isPaes
                    ? 'border-indigo-500/40 hover:border-indigo-500/80 shadow-lg hover:shadow-indigo-500/15 ring-1 ring-indigo-500/20'
                    : 'hover:border-slate-700'
                }`}
              >
                {/* Header info */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {/* Badge Instrumento */}
                      <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold border ${meta.badgeBg} ${meta.badgeText} ${meta.badgeBorder} flex items-center gap-1`}>
                        {isPaes ? '🏛️ PAES Oficial' : meta.tipo === 'simce' ? '📊 SIMCE Oficial' : meta.tipo === 'diagnostica' ? '📋 Diagnóstica' : '🏫 Evaluación'}
                      </span>

                      {/* Badges específicos PAES */}
                      {isPaes && (
                        <>
                          {meta.anio && (
                            <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-slate-800 text-slate-200 border border-slate-700">
                              {meta.anio}
                            </span>
                          )}
                          {meta.edicion && (
                            <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold border ${
                              meta.edicion === 'Invierno'
                                ? 'bg-sky-500/10 text-sky-400 border-sky-500/20'
                                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            }`}>
                              {meta.edicion}
                            </span>
                          )}
                          {meta.forma && (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-purple-500/10 text-purple-300 border border-purple-500/20">
                              {meta.forma}
                            </span>
                          )}
                        </>
                      )}

                      {/* Asignatura y Nivel */}
                      <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                        {isPaes && meta.materiaOficial ? `${meta.materiaOficial} — ${prueba.nivel}` : `${prueba.asignaturaNombre} — ${prueba.nivel}`}
                      </span>

                      {/* Estado */}
                      <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold border capitalize ${estadoColor}`}>
                        {prueba.estado}
                      </span>
                    </div>

                    <div className="text-xs text-slate-400 flex items-center gap-1 font-medium whitespace-nowrap">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{prueba.duracionMinutos} min</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                    {prueba.titulo}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                    {prueba.descripcion}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1">
                    <span className="flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-indigo-400" /> {prueba.totalPreguntas} Preguntas
                    </span>
                    <span>•</span>
                    <span>Curso: <strong>{prueba.cursoNombre}</strong></span>
                  </div>
                </div>

                {/* Public Access Code Banner */}
                <div className="p-3.5 bg-slate-100 dark:bg-slate-950/80 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Código para Alumno</span>
                    <strong className="text-indigo-600 dark:text-indigo-400 font-mono text-base tracking-wider">{prueba.codigoPublico}</strong>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopyCode(prueba.codigoPublico)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/20 text-xs font-bold transition-all"
                      title="Copiar código"
                    >
                      {copiedCode === prueba.codigoPublico ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          <span>Copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copiar</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Actions Grid */}
                <div className="space-y-2 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      onClick={() => onSelectPruebaReporte(prueba.id)}
                      className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold py-2.5 rounded-xl shadow-sm transition-all"
                    >
                      <BarChart2 className="w-4 h-4" />
                      <span>Reporte & Reforzamiento</span>
                    </button>

                    <button
                      onClick={() => {
                        setSelectedPruebaForRespuestas(prueba);
                        setRespuestasModalOpen(true);
                      }}
                      className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2.5 rounded-xl shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
                      title="Ingreso rápido de respuestas de hojas impresas"
                    >
                      <FileCheck className="w-4 h-4" />
                      <span>Ingresar Respuestas (Foto/Rápido)</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {/* Enviar por Mail */}
                    <button
                      onClick={() => {
                        setSelectedPruebaForEnviar(prueba);
                        setEnviarModalOpen(true);
                      }}
                      className="flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold py-2 rounded-xl shadow-sm transition-all"
                      title="Enviar prueba por email a un alumno"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Enviar Mail</span>
                    </button>
                    {/* Ver Facsímil */}
                    <button
                      onClick={() => handleOpenFacsimil(prueba)}
                      className="flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-indigo-600 dark:text-indigo-400 text-xs font-bold py-2 rounded-xl transition-all"
                      title="Ver Facsímil con todas las preguntas y figuras"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Ver Ítems</span>
                    </button>

                    <button
                      onClick={() => {
                        setSelectedPruebaForPrint(prueba);
                        setPrintModalOpen(true);
                      }}
                      className="flex items-center justify-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/50 dark:hover:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-xs font-bold py-2 rounded-xl transition-all border border-indigo-500/20"
                      title="Imprimir Cuadernillo de Prueba y Hoja de Respuestas"
                    >
                      <Printer className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Imprimir / PDF</span>
                    </button>

                    <button
                      onClick={() => {
                        const nuevoEstado = prueba.estado === 'activa' ? 'finalizada' : 'activa';
                        onUpdatePruebaEstado(prueba.id, nuevoEstado);
                        showToast(`Estado de "${prueba.titulo}" cambiado a ${nuevoEstado.toUpperCase()}`);
                      }}
                      className="flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold py-2 rounded-xl transition-all"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{prueba.estado === 'activa' ? 'Finalizar' : 'Activar'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Facsímil Inspection Modal */}
      <PruebaFacsimilModal
        isOpen={facsimilModalOpen}
        prueba={selectedPruebaForFacsimil}
        preguntas={bancoPreguntas}
        canEdit={currentUser?.rol === 'admin' || currentUser?.rol === 'profesor'}
        onClose={() => { setFacsimilModalOpen(false); setSelectedPruebaForFacsimil(null); }}
      />

      {/* Printable Test Booklet & Answer Sheet Modal */}
      <PrintEvaluacionModal
        isOpen={printModalOpen}
        prueba={selectedPruebaForPrint}
        preguntas={bancoPreguntas}
        alumnos={alumnos}
        onClose={() => { setPrintModalOpen(false); setSelectedPruebaForPrint(null); }}
      />

      {/* Quick Answer Sheet Input Modal (Photo & Fast-Track) */}
      <IngresoRespuestasModal
        isOpen={respuestasModalOpen}
        prueba={selectedPruebaForRespuestas}
        preguntas={bancoPreguntas}
        alumnos={alumnos}
        onClose={() => { setRespuestasModalOpen(false); setSelectedPruebaForRespuestas(null); }}
        onSaveRendicion={(nuevaRendicion) => {
          showToast(`✅ Rendición guardada para ${nuevaRendicion.alumnoNombre} (${nuevaRendicion.porcentajeLogro}% logro)`);
        }}
      />

      {/* Catálogo SIMCE — solo docentes en producción */}
      
      {/* Enviar Evaluación por Correo Modal */}
      <EnviarEvaluacionModal
        isOpen={enviarModalOpen}
        prueba={selectedPruebaForEnviar}
        alumnos={alumnos}
        onClose={() => { setEnviarModalOpen(false); setSelectedPruebaForEnviar(null); }}
        onSuccess={(email) => {
          showToast(`Evaluacion enviada con exito a ${email}`);
        }}
      />
      {currentUser && !isSandboxMode && (
        <CatalogoEvaluacionesModal
          isOpen={catalogoModalOpen}
          onClose={() => setCatalogoModalOpen(false)}
          currentUser={currentUser}
        />
      )}
    </div>
  );
};

