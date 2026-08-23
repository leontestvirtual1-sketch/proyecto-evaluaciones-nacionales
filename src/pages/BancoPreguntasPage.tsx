import React, { useState, useMemo, useCallback } from 'react';
import {
  Pregunta,
  Asignatura,
  EjeTematico,
  Habilidad,
  TipoPregunta,
  DificultadPregunta,
  UserProfile
} from '../types';
import { PreguntaFormModal } from '../components/PreguntaFormModal';
import { useAcademicData } from '../context/AcademicDataContext';
import { useCursos } from '../hooks/useCursos';
import {
  Library,
  PlusCircle,
  Search,
  Filter,
  CheckCircle2,
  HelpCircle,
  Layers,
  Sparkles,
  Edit2,
  Trash2,
  Copy,
  GraduationCap,
  Award,
  Lock,
  AlertCircle,
  Loader2
} from 'lucide-react';

interface BancoPreguntasPageProps {
  preguntas: Pregunta[];
  asignaturas: Asignatura[];
  ejes: EjeTematico[];
  habilidades: Habilidad[];
  docentes?: UserProfile[];
  currentUser?: UserProfile;
  onAddPregunta: (p: Pregunta) => Promise<{ success: boolean; error?: string }> | void;
  onUpdatePregunta: (p: Pregunta) => Promise<{ success: boolean; error?: string }> | void;
  onDeletePregunta: (id: string) => Promise<{ success: boolean; error?: string }> | void;
}

// Normalizador de niveles — clave interna en minúsculas con °
export const normalizeNivel = (lvl?: string): string => {
  if (!lvl) return '';
  const clean = lvl.toLowerCase().trim();
  // Básica
  if ((clean.includes('1') || clean.includes('primer')) && (clean.includes('bás') || clean.includes('bas'))) return '1° básico';
  if ((clean.includes('2') || clean.includes('segund')) && (clean.includes('bás') || clean.includes('bas'))) return '2° básico';
  if ((clean.includes('3') || clean.includes('tercer')) && (clean.includes('bás') || clean.includes('bas'))) return '3° básico';
  if ((clean.includes('4') || clean.includes('cuart'))  && (clean.includes('bás') || clean.includes('bas'))) return '4° básico';
  if ((clean.includes('5') || clean.includes('quint'))  && (clean.includes('bás') || clean.includes('bas'))) return '5° básico';
  if ((clean.includes('6') || clean.includes('sext'))   && (clean.includes('bás') || clean.includes('bas'))) return '6° básico';
  if ((clean.includes('7') || clean.includes('séptim')) && (clean.includes('bás') || clean.includes('bas'))) return '7° básico';
  if ((clean.includes('8') || clean.includes('octav'))  && (clean.includes('bás') || clean.includes('bas'))) return '8° básico';
  // Media
  if ((clean.includes('1') || clean === 'i medio' || clean === 'primero medio') && clean.includes('med')) return '1° medio';
  if ((clean.includes('2') || clean === 'ii medio' || clean === 'segundo medio') && clean.includes('med')) return '2° medio';
  if ((clean.includes('3') || clean === 'iii medio' || clean === 'tercer medio') && clean.includes('med')) return '3° medio';
  if ((clean.includes('4') || clean === 'iv medio'  || clean.includes('cuarto med') || clean.includes('paes')) && clean.includes('med')) return '4° medio';
  return clean;
};

// Metadata visual de niveles escolares
const LEVEL_METADATA: Record<string, { label: string; icon: string; sublabel: string }> = {
  '1° básico': { label: '1° Básico', icon: '🌿', sublabel: 'SIMCE 1° Básico' },
  '2° básico': { label: '2° Básico', icon: '🌱', sublabel: 'SIMCE 2° Básico' },
  '3° básico': { label: '3° Básico', icon: '📘', sublabel: 'SIMCE 3° Básico' },
  '4° básico': { label: '4° Básico', icon: '🔵', sublabel: 'SIMCE 4° Básico' },
  '5° básico': { label: '5° Básico', icon: '📗', sublabel: 'SIMCE 5° Básico' },
  '6° básico': { label: '6° Básico', icon: '🔬', sublabel: 'SIMCE 6° Básico' },
  '7° básico': { label: '7° Básico', icon: '📙', sublabel: 'SIMCE 7° Básico' },
  '8° básico': { label: '8° Básico', icon: '📚', sublabel: 'SIMCE 8° Básico' },
  '1° medio':  { label: '1° Medio',  icon: '🎯', sublabel: 'SIMCE 1° Medio'  },
  '2° medio':  { label: '2° Medio',  icon: '🎓', sublabel: 'SIMCE 2° Medio'  },
  '3° medio':  { label: '3° Medio',  icon: '🏫', sublabel: 'SIMCE 3° Medio'  },
  '4° medio':  { label: '4° Medio',  icon: '🏛️', sublabel: 'PAES Regular'    },
};

export const BancoPreguntasPage: React.FC<BancoPreguntasPageProps> = ({
  preguntas,
  asignaturas,
  ejes,
  habilidades,
  docentes = [],
  currentUser,
  onAddPregunta,
  onUpdatePregunta,
  onDeletePregunta,
}) => {
  const userEmail = (currentUser?.email || '').toLowerCase();
  const isPremilTeacher = userEmail.includes('premil') || userEmail.includes('mariateresa') || currentUser?.id === '98e7e5c9-e55d-4b47-bd5d-c6aabd463d18';
  const isSusanaTeacher = userEmail.includes('susana') || userEmail.includes('nentitasusana') || currentUser?.id === 'e14d8a54-fe01-4a6b-a22d-8f8e00000001';
  const isDocente = currentUser?.rol === 'profesor';
  const docenteAsigId = currentUser?.asignaturaId || (isPremilTeacher ? 'asig-2' : isSusanaTeacher ? 'asig-1' : '');

  // Restringir asignaturas para docente
  const availableAsignaturas = isDocente
    ? asignaturas.filter(a => a.id === docenteAsigId)
    : asignaturas;

  // Cargar cursos del docente directamente desde Supabase vía useCursos (sin localStorage)
  const { cursos: userCursos } = useCursos({ currentUser, isSandboxMode: false });

  const [search, setSearch] = useState('');
  // Asignatura pre-aplicada según el rol:
  // - Docente: siempre su asignatura (bloqueado en UI)
  // - Admin: sin filtro inicial (ve todo)
  const [asignaturaFilter, setAsignaturaFilter] = useState(isDocente ? docenteAsigId : '');
  const [establecimientoFilter, setEstablecimientoFilter] = useState('');
  const [docenteFilter, setDocenteFilter] = useState('');
  const [ejeFilter, setEjeFilter] = useState('');
  const [habilidadFilter, setHabilidadFilter] = useState('');
  const [dificultadFilter, setDificultadFilter] = useState('');
  const [tipoFilter, setTipoFilter] = useState('');
  // Nivel inicial: vacío (Todos) para admin; para docente se auto-seleccionará
  // el primer nivel disponible mediante el efecto de sincronización existente
  const [nivelFilter, setNivelFilter] = useState<string>('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingPregunta, setEditingPregunta] = useState<Pregunta | null>(null);
  const [saveStatus, setSaveStatus] = useState<{ type: 'success' | 'error' | 'saving'; msg: string } | null>(null);

  // Catálogo 100% dinámico de docentes para filtros de Admin
  const docentesDisponibles = useMemo(() => {
    const list = docentes && docentes.length > 0 ? docentes : [];
    const map = new Map<string, { id: string; rawId?: string; nombre: string; asignatura: string; asigId: string; establecimiento: string; email: string }>();

    // Base inicial de producción
    map.set('mariateresa', {
      id: 'mariateresa',
      nombre: 'María Teresa González',
      asignatura: 'Lengua y Literatura',
      asigId: 'asig-2',
      establecimiento: 'Escuela Premilitar Héroes de la Concepción',
      email: 'mariateresa.gonzalez@premil.cl'
    });
    map.set('susana', {
      id: 'susana',
      nombre: 'Susana Angélica Pizarro Valenzuela',
      asignatura: 'Matemática',
      asigId: 'asig-1',
      establecimiento: 'Colegio Mi Casa',
      email: 'nentitasusana@hotmail.com'
    });

    list.forEach(d => {
      const emailLower = (d.email || '').toLowerCase();
      const isSusana = emailLower.includes('susana') || (d.nombre && d.nombre.toLowerCase().includes('susana'));
      const isPremil = emailLower.includes('premil') || emailLower.includes('mariateresa');
      const keyId = isSusana ? 'susana' : isPremil ? 'mariateresa' : d.id;

      const docEntry = {
        id: keyId,
        rawId: d.id,
        nombre: `${d.nombre} ${d.apellido || ''}`.trim(),
        asignatura: d.asignaturaNombre || (isSusana ? 'Matemática' : isPremil ? 'Lengua y Literatura' : 'Especialidad'),
        asigId: d.asignaturaId || (isSusana ? 'asig-1' : isPremil ? 'asig-2' : ''),
        establecimiento: d.establecimiento || (isSusana ? 'Colegio Mi Casa' : isPremil ? 'Escuela Premilitar Héroes de la Concepción' : ''),
        email: d.email || ''
      };
      map.set(keyId, docEntry);
    });

    return Array.from(map.values());
  }, [docentes]);

  // Catálogo 100% dinámico de establecimientos para filtros de Admin
  const establecimientosDisponibles = useMemo(() => {
    const setEst = new Set<string>();
    docentesDisponibles.forEach(d => {
      if (d.establecimiento) setEst.add(d.establecimiento);
    });
    preguntas.forEach(p => {
      if (p.establecimiento) setEst.add(p.establecimiento);
    });
    return Array.from(setEst);
  }, [docentesDisponibles, preguntas]);

  // Contexto activo para filtrar ejes y habilidades
  const activeSubjectId = isDocente ? docenteAsigId : (asignaturaFilter || '');
  const availableEjes = activeSubjectId
    ? ejes.filter(e => e.asignaturaId === activeSubjectId)
    : ejes;

  const availableHabilidades = activeSubjectId
    ? habilidades.filter(h => h.asignaturaId === activeSubjectId)
    : habilidades;

  // Lista de niveles dinámicos según cursos del docente y preguntas filtradas por docente/colegio/materia
  const nivelesDisponibles = useMemo(() => {
    const counts: Record<string, number> = {};

    const selectedDoc = !isDocente && docenteFilter
      ? docentesDisponibles.find(d => d.id === docenteFilter || (d.rawId && d.rawId === docenteFilter) || d.email.toLowerCase() === docenteFilter.toLowerCase())
      : null;

    preguntas.forEach(p => {
      // 1. Filtrar por asignatura
      const matchAsig = isDocente
        ? p.asignaturaId === docenteAsigId
        : (!asignaturaFilter || p.asignaturaId === asignaturaFilter);

      // 2. Filtrar por establecimiento dinámico (Admin)
      let matchEstablecimiento = true;
      if (!isDocente && establecimientoFilter) {
        const docForQ = docentesDisponibles.find(d => d.id === p.propietarioId || d.rawId === p.propietarioId || d.asigId === p.asignaturaId);
        matchEstablecimiento = Boolean(
          p.establecimiento === establecimientoFilter ||
          (docForQ && docForQ.establecimiento === establecimientoFilter) ||
          (establecimientoFilter === 'Colegio Mi Casa' && p.asignaturaId === 'asig-1') ||
          (establecimientoFilter.includes('Premilitar') && p.asignaturaId === 'asig-2')
        );
      }

      // 3. Filtrar por docente dinámico (Admin)
      let matchDocente = true;
      if (!isDocente && docenteFilter && selectedDoc) {
        matchDocente = Boolean(
          p.propietarioId === selectedDoc.id ||
          (selectedDoc.rawId && p.propietarioId === selectedDoc.rawId) ||
          p.asignaturaId === selectedDoc.asigId
        );
      }

      if (matchAsig && matchEstablecimiento && matchDocente) {
        const norm = normalizeNivel(p.nivel) || 'Sin nivel';
        counts[norm] = (counts[norm] || 0) + 1;
      }
    });

    const activeKeys = new Set<string>();

    // Añadir niveles de los cursos del docente si aplica
    userCursos.forEach((c: { nivel?: string; nombre?: string }) => {
      const norm = normalizeNivel(c.nivel || c.nombre);
      if (norm) activeKeys.add(norm);
    });

    // Si está filtrado por Susana o Colegio Mi Casa, garantizar sus 3 niveles
    const isUserSusana = (currentUser?.email || '').toLowerCase().includes('susana') || (currentUser?.establecimiento || '').toLowerCase().includes('mi casa');
    if (selectedDoc?.id === 'susana' || establecimientoFilter === 'Colegio Mi Casa' || isUserSusana || (asignaturaFilter === 'asig-1' && !isDocente)) {
      activeKeys.add('4° básico');
      activeKeys.add('6° básico');
      activeKeys.add('8° básico');
    }

    // Añadir niveles donde haya preguntas con los filtros activos
    Object.keys(counts).forEach(k => {
      if (counts[k] > 0) activeKeys.add(k);
    });

    // Niveles estándar si aún no hay ninguno
    if (activeKeys.size === 0) {
      if (!isDocente) {
        activeKeys.add('4° básico');
        activeKeys.add('6° básico');
        activeKeys.add('8° básico');
        activeKeys.add('2° medio');
      } else {
        activeKeys.add('4° básico');
      }
    }

    return Array.from(activeKeys).map(key => {
      const meta = LEVEL_METADATA[key] || {
        label: key.charAt(0).toUpperCase() + key.slice(1),
        icon: '📚',
        sublabel: `Nivel ${key}`
      };
      return {
        key,
        label: meta.label,
        icon: meta.icon,
        sublabel: meta.sublabel,
        count: counts[key] || 0
      };
    });
  }, [preguntas, userCursos, isDocente, docenteAsigId, asignaturaFilter, establecimientoFilter, docenteFilter, docentesDisponibles, currentUser?.email, currentUser?.establecimiento]);

  // Sincronizar nivelFilter:
  // - Para docente: si nivelFilter está vacío, asignar el nivel inicial correspondiente
  // - Admin: puede ver "Todos los Cursos" o filtrar por nivel específico
  React.useEffect(() => {
    if (isDocente && !nivelFilter) {
      if (docenteAsigId === 'asig-2' || (currentUser?.email || '').toLowerCase().includes('premil')) {
        setNivelFilter('2° medio');
      } else {
        setNivelFilter('4° básico');
      }
    }
  }, [isDocente, docenteAsigId, currentUser?.email]);

  // Base de preguntas filtradas por ASIGNATURA, CURSO/NIVEL, ESTABLECIMIENTO y DOCENTE
  const basePreguntas = useMemo(() => {
    const selectedDoc = !isDocente && docenteFilter
      ? docentesDisponibles.find(d => d.id === docenteFilter || (d.rawId && d.rawId === docenteFilter) || d.email.toLowerCase() === docenteFilter.toLowerCase())
      : null;

    return preguntas.filter(p => {
      // 1. Asignatura
      const matchAsig = isDocente
        ? p.asignaturaId === docenteAsigId
        : (!asignaturaFilter || p.asignaturaId === asignaturaFilter);

      // 2. Curso / Nivel
      const matchNivel = !nivelFilter || normalizeNivel(p.nivel) === normalizeNivel(nivelFilter);

      // 3. Establecimiento dinámico (Admin)
      let matchEstablecimiento = true;
      if (!isDocente && establecimientoFilter) {
        const docForQ = docentesDisponibles.find(d => d.id === p.propietarioId || d.rawId === p.propietarioId || d.asigId === p.asignaturaId);
        matchEstablecimiento = Boolean(
          p.establecimiento === establecimientoFilter ||
          (docForQ && docForQ.establecimiento === establecimientoFilter) ||
          (establecimientoFilter === 'Colegio Mi Casa' && p.asignaturaId === 'asig-1') ||
          (establecimientoFilter.includes('Premilitar') && p.asignaturaId === 'asig-2')
        );
      }

      // 4. Docente dinámico (Admin)
      let matchDocente = true;
      if (!isDocente && docenteFilter && selectedDoc) {
        matchDocente = Boolean(
          p.propietarioId === selectedDoc.id ||
          (selectedDoc.rawId && p.propietarioId === selectedDoc.rawId) ||
          p.asignaturaId === selectedDoc.asigId
        );
      }

      return matchAsig && matchNivel && matchEstablecimiento && matchDocente;
    });
  }, [preguntas, isDocente, docenteAsigId, asignaturaFilter, nivelFilter, establecimientoFilter, docenteFilter, docentesDisponibles]);

  // Preguntas filtradas por los criterios secundarios (búsqueda, eje, habilidad, dificultad, tipo)
  const filtered = useMemo(() => {
    return basePreguntas.filter(p => {
      const matchSearch =
        !search.trim() ||
        p.enunciado.toLowerCase().includes(search.toLowerCase()) ||
        p.fuente.toLowerCase().includes(search.toLowerCase());

      const matchEje = !ejeFilter || p.ejeTematicoId === ejeFilter;
      const matchHab = !habilidadFilter || p.habilidadId === habilidadFilter;
      const matchDif = !dificultadFilter || p.dificultad === dificultadFilter;
      const matchTipo = !tipoFilter || p.tipo === tipoFilter;

      return matchSearch && matchEje && matchHab && matchDif && matchTipo;
    });
  }, [basePreguntas, search, ejeFilter, habilidadFilter, dificultadFilter, tipoFilter]);

  const handleDuplicate = async (p: Pregunta) => {
    const duplicada: Pregunta = {
      ...p,
      id: `preg-${Date.now()}`,
      enunciado: `${p.enunciado} (Copia)`,
      fuente: `Copia de ${p.fuente}`,
    };
    setSaveStatus({ type: 'saving', msg: 'Duplicando y guardando en Supabase...' });
    const result = await onAddPregunta(duplicada);
    if (result && !result.success) {
      setSaveStatus({ type: 'error', msg: result.error || 'Error al duplicar pregunta.' });
      setTimeout(() => setSaveStatus(null), 6000);
    } else {
      setSaveStatus({ type: 'success', msg: '✅ Pregunta duplicada y guardada en Supabase' });
      setTimeout(() => setSaveStatus(null), 4000);
    }
  };

  // KPIs dinámicos calculados estrictamente para el Curso / Nivel seleccionado
  const totalPreguntasNivel = basePreguntas.length;
  const totalSeleccionMultiple = basePreguntas.filter(p => p.tipo === 'seleccion_multiple').length;
  const totalDesarrollo = basePreguntas.filter(p => p.tipo === 'desarrollo').length;
  const totalOficiales = basePreguntas.filter(
    p =>
      p.fuente.toLowerCase().includes('oficial') ||
      p.fuente.toLowerCase().includes('liberada') ||
      p.fuente.toLowerCase().includes('simce')
  ).length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Toast feedback Supabase */}
      {saveStatus && (
        <div className={`fixed top-4 right-4 z-[200] flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-sm font-semibold border animate-fade-in ${
          saveStatus.type === 'success' ? 'bg-emerald-600 text-white border-emerald-500' :
          saveStatus.type === 'error'   ? 'bg-rose-600 text-white border-rose-500' :
          'bg-indigo-600 text-white border-indigo-500'
        }`}>
          {saveStatus.type === 'saving' && <Loader2 className="w-4 h-4 animate-spin" />}
          {saveStatus.type === 'success' && <CheckCircle2 className="w-4 h-4" />}
          {saveStatus.type === 'error'   && <AlertCircle className="w-4 h-4" />}
          <span>{saveStatus.msg}</span>
        </div>
      )}
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Library className="w-6 h-6 text-indigo-500" />
            {isDocente ? `Banco de Preguntas — ${currentUser?.asignaturaNombre || 'Especialidad'}` : 'Banco de Preguntas Institucional'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {isDocente
              ? `Taxonomía curricular y banco de ítems organizados por Curso y Nivel Escolar`
              : 'Gestión organizada de ítems calibrados por Curso, Asignatura, Eje Temático y Habilidad Cognitiva'}
          </p>
        </div>

        <button
          onClick={() => { setEditingPregunta(null); setModalOpen(true); }}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md shadow-indigo-600/20 transition-all active:scale-[0.98]"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Crear Nueva Pregunta</span>
        </button>
      </div>

      {/* Selector Principal de Curso / Nivel Escolar */}
      <div className="glass-card p-4 space-y-3 border-indigo-500/20 bg-gradient-to-r from-indigo-500/5 via-transparent to-transparent">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
            <GraduationCap className="w-4 h-4 text-indigo-500" />
            <span>Seleccionar Curso / Nivel para el Banco:</span>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            Mostrando preguntas exclusivas para el nivel seleccionado (sin mezclar cursos)
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          {nivelesDisponibles.map(lvl => {
            const isSelected = normalizeNivel(nivelFilter) === normalizeNivel(lvl.key);
            const countForLvl = preguntas.filter(p => {
              const matchAsig = isDocente ? p.asignaturaId === docenteAsigId : (!asignaturaFilter || p.asignaturaId === asignaturaFilter);
              return matchAsig && normalizeNivel(p.nivel) === normalizeNivel(lvl.key);
            }).length;

            return (
              <button
                key={lvl.key}
                onClick={() => {
                  setNivelFilter(lvl.key);
                  setEjeFilter('');
                  setHabilidadFilter('');
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/20 scale-[1.02]'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-indigo-500/40 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <span>{lvl.icon}</span>
                <span>{lvl.label}</span>
                <span className={`px-1.5 py-0.2 rounded-md text-[10px] font-black ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400'
                }`}>
                  {countForLvl}
                </span>
              </button>
            );
          })}

          <button
            onClick={() => {
              setNivelFilter('');
              setEjeFilter('');
              setHabilidadFilter('');
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
              !nivelFilter
                ? 'bg-slate-800 text-white border-slate-700 shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-400'
            }`}
          >
            <span>🌐</span>
            <span>Todos los Cursos</span>
            <span className="px-1.5 py-0.2 rounded-md text-[10px] font-black bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {isDocente ? preguntas.filter(p => p.asignaturaId === docenteAsigId).length : preguntas.length}
            </span>
          </button>
        </div>
      </div>

      {/* Summary KPI Strip Calculado Estrictamente para el Nivel Seleccionado */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-card p-4 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            {nivelFilter ? `Total ${nivelFilter}` : 'Total Materia'}
          </span>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{totalPreguntasNivel}</p>
        </div>
        <div className="glass-card p-4 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-500">Selección Múltiple</span>
          <p className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">{totalSeleccionMultiple}</p>
        </div>
        <div className="glass-card p-4 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-sky-500">Desarrollo Escrito</span>
          <p className="text-2xl font-extrabold text-sky-600 dark:text-sky-400">{totalDesarrollo}</p>
        </div>
        <div className="glass-card p-4 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500">Oficiales / Liberadas</span>
          <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {totalOficiales}
          </p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="glass-card p-4 space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-indigo-500" />
            <span>Filtros Específicos para {nivelFilter ? nivelFilter.toUpperCase() : 'TODOS LOS CURSOS'}</span>
          </div>

          {isDocente ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              <Lock className="w-3 h-3" /> Especialidad Aislada: {currentUser?.asignaturaNombre}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <Sparkles className="w-3 h-3" /> Vista Administrador: Catálogo Multicolegio y Multidocente
            </span>
          )}
        </div>

        {/* Fila 1 de Filtros (Filtros Principales e Institucionales) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {/* Search text */}
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar en enunciado o fuente..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          </div>

          {/* Filtro Establecimiento (Admin) */}
          {!isDocente ? (
            <select
              value={establecimientoFilter}
              onChange={e => {
                setEstablecimientoFilter(e.target.value);
                setNivelFilter(''); // Ver todas las preguntas del colegio seleccionado
              }}
              className="px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium"
            >
              <option value="">🏢 Todos los Establecimientos</option>
              {establecimientosDisponibles.map(est => (
                <option key={est} value={est}>{est}</option>
              ))}
            </select>
          ) : (
            <div className="px-3 py-1.5 text-xs bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 truncate">
              <span>🏫</span>
              <span className="truncate">{currentUser?.establecimiento || 'Mi Colegio'}</span>
            </div>
          )}

          {/* Filtro Docente (Admin) */}
          {!isDocente ? (
            <select
              value={docenteFilter}
              onChange={e => {
                setDocenteFilter(e.target.value);
                setNivelFilter(''); // Ver todas las preguntas del docente seleccionado
                const doc = docentesDisponibles.find(d => d.id === e.target.value);
                if (doc) {
                  setAsignaturaFilter(doc.asigId);
                } else {
                  setAsignaturaFilter('');
                }
              }}
              className="px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium"
            >
              <option value="">👨‍🏫 Todos los Docentes</option>
              {docentesDisponibles.map(doc => (
                <option key={doc.id} value={doc.id}>{doc.nombre} ({doc.asignatura})</option>
              ))}
            </select>
          ) : (
            <div className="px-3 py-1.5 text-xs bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5 truncate">
              <span>{currentUser?.asignaturaId === 'asig-1' ? '📐' : currentUser?.asignaturaId === 'asig-3' ? '🔬' : '📖'}</span>
              <span className="truncate">{currentUser?.asignaturaNombre}</span>
            </div>
          )}

          {/* Asignatura filter */}
          {!isDocente ? (
            <select
              value={asignaturaFilter}
              onChange={e => {
                setAsignaturaFilter(e.target.value);
                setNivelFilter('');
                setEjeFilter('');
                setHabilidadFilter('');
              }}
              className="px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 font-semibold"
            >
              <option value="">📚 Todas las Asignaturas</option>
              {asignaturas.map(a => <option key={a.id} value={a.id}>{a.nombre}</option>)}
            </select>
          ) : (
            <select
              value={dificultadFilter}
              onChange={e => setDificultadFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="">Toda Dificultad</option>
              <option value="baja">Baja</option>
              <option value="media">Media</option>
              <option value="alta">Alta</option>
            </select>
          )}
        </div>

        {/* Fila 2 de Filtros Pedagógicos (Ejes, Habilidades, Dificultad, Tipo) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 border-t border-slate-100 dark:border-slate-800/80">
          {/* Eje filter strictly filtered by subject */}
          <select
            value={ejeFilter}
            onChange={e => setEjeFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="">Todos los Ejes Temáticos</option>
            {availableEjes.map(e => <option key={e.id} value={e.id}>{e.nombre}</option>)}
          </select>

          {/* Habilidad filter */}
          <select
            value={habilidadFilter}
            onChange={e => setHabilidadFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="">Todas las Habilidades</option>
            {availableHabilidades.map(h => <option key={h.id} value={h.id}>{h.nombre}</option>)}
          </select>

          {/* Dificultad filter */}
          <select
            value={dificultadFilter}
            onChange={e => setDificultadFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="">Toda Dificultad</option>
            <option value="baja">Baja</option>
            <option value="media">Media</option>
            <option value="alta">Alta</option>
          </select>

          {/* Tipo filter */}
          <select
            value={tipoFilter}
            onChange={e => setTipoFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="">Todo Tipo</option>
            <option value="seleccion_multiple">Selección Múltiple</option>
            <option value="desarrollo">Desarrollo</option>
          </select>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <HelpCircle className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
              No se encontraron preguntas para {nivelFilter ? `el curso ${nivelFilter}` : 'los criterios seleccionados'}
            </p>
            <p className="text-xs text-slate-400 mt-1">Crea una nueva pregunta o selecciona otro curso en las pestañas superiores</p>
          </div>
        ) : (
          filtered.map(pregunta => {
            const eje = ejes.find(e => e.id === pregunta.ejeTematicoId);
            const hab = habilidades.find(h => h.id === pregunta.habilidadId);
            const asig = asignaturas.find(a => a.id === pregunta.asignaturaId);
            const isMatematica = pregunta.asignaturaId === 'asig-1';

            const difColor =
              pregunta.dificultad === 'baja'
                ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                : pregunta.dificultad === 'media'
                ? 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                : 'bg-rose-500/10 text-rose-600 border-rose-500/20';

            return (
              <div
                key={pregunta.id}
                className="glass-card p-5 space-y-3 hover:border-slate-300 dark:hover:border-slate-700 transition-all"
              >
                {/* Top badges + actions */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                      {asig?.nombre || 'General'}
                    </span>

                    {/* Badge Dinámico de Autor y Establecimiento */}
                    {!isDocente && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        <span>🏫</span>
                        {(() => {
                          const doc = docentesDisponibles.find(d => d.id === pregunta.propietarioId || d.asigId === pregunta.asignaturaId);
                          if (doc) return `${doc.nombre} — ${doc.establecimiento}`;
                          if (pregunta.fuente && pregunta.fuente !== 'Creada por docente') return pregunta.fuente;
                          return asig?.nombre || 'Docente Institucional';
                        })()}
                      </span>
                    )}

                    {/* Badge de Curso / Nivel */}
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold bg-indigo-600/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30">
                      <GraduationCap className="w-3.5 h-3.5 text-indigo-500" />
                      {pregunta.nivel}
                    </span>

                    {eje && (
                      <span className="px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {eje.nombre}
                      </span>
                    )}
                    {hab && (
                      <span className="px-2 py-0.5 rounded-md text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        {hab.nombre}
                      </span>
                    )}
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase border ${difColor}`}>
                      {pregunta.dificultad}
                    </span>
                    <span className="text-[11px] text-slate-400 font-semibold">
                      {pregunta.puntaje} pt(s)
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleDuplicate(pregunta)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Duplicar pregunta"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => { setEditingPregunta(pregunta); setModalOpen(true); }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Editar pregunta"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={async () => {
                        if (window.confirm('¿Estás seguro de eliminar esta pregunta del banco en Supabase?')) {
                          setSaveStatus({ type: 'saving', msg: 'Eliminando pregunta de Supabase...' });
                          const res = await onDeletePregunta(pregunta.id);
                          if (res && !res.success) {
                            setSaveStatus({ type: 'error', msg: res.error || 'Error al eliminar pregunta.' });
                            setTimeout(() => setSaveStatus(null), 6000);
                          } else {
                            setSaveStatus({ type: 'success', msg: '✅ Pregunta eliminada exitosamente de Supabase' });
                            setTimeout(() => setSaveStatus(null), 4000);
                          }
                        }
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Eliminar pregunta"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Enunciado */}
                <p className="text-sm font-semibold text-slate-900 dark:text-white leading-relaxed whitespace-pre-line">
                  {pregunta.enunciado}
                </p>

                {/* Optional Image */}
                {pregunta.imagenUrl && (
                  <div className="p-3 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 flex justify-center overflow-hidden shadow-sm max-w-md my-2">
                    <img
                      src={pregunta.imagenUrl}
                      alt="Figura / Gráfico"
                      className="max-h-60 w-auto object-contain rounded-lg"
                    />
                  </div>
                )}

                {/* Alternativas Preview */}
                {pregunta.tipo === 'seleccion_multiple' && (
                  <div className="space-y-1.5 pt-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {pregunta.alternativas.map(alt => (
                        <div
                          key={alt.letra}
                          className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 ${
                            alt.es_correcta
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-semibold'
                              : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          <span className={`w-5 h-5 rounded-md text-[11px] font-bold flex items-center justify-center ${
                            alt.es_correcta
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                          }`}>
                            {alt.letra}
                          </span>
                          <span className="truncate">{alt.texto}</span>
                          {alt.es_correcta && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 ml-auto shrink-0" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Footer metadata */}
                <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100 dark:border-slate-800/80 pt-2">
                  <span>Fuente: {pregunta.fuente}</span>
                  <span className="font-mono text-[10px]">ID: {pregunta.id}</span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal Crear/Editar */}
      <PreguntaFormModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditingPregunta(null); }}
        onSave={async p => {
          if (editingPregunta) {
            setSaveStatus({ type: 'saving', msg: 'Actualizando pregunta en Supabase...' });
            const result = await onUpdatePregunta(p);
            if (result && !result.success) {
              setSaveStatus({ type: 'error', msg: result.error || 'Error al actualizar. Intenta de nuevo.' });
              setTimeout(() => setSaveStatus(null), 6000);
            } else {
              setSaveStatus({ type: 'success', msg: '✅ Pregunta actualizada exitosamente en Supabase' });
              setTimeout(() => setSaveStatus(null), 4000);
              setEditingPregunta(null);
            }
          } else {
            setSaveStatus({ type: 'saving', msg: 'Guardando pregunta en Supabase...' });
            const result = await onAddPregunta(p);
            if (result && !result.success) {
              setSaveStatus({ type: 'error', msg: result.error || 'Error al guardar. Intenta de nuevo.' });
              setTimeout(() => setSaveStatus(null), 6000);
            } else {
              setSaveStatus({ type: 'success', msg: '✅ Pregunta guardada exitosamente en Supabase' });
              setTimeout(() => setSaveStatus(null), 4000);
              setEditingPregunta(null);
            }
          }
        }}
        editPregunta={editingPregunta}
        initialNivel={nivelFilter || (nivelesDisponibles[0]?.key) || '4° básico'}
        asignaturas={availableAsignaturas}
        ejes={availableEjes}
        habilidades={availableHabilidades}
      />
    </div>
  );
};
