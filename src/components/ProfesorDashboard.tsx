import React, { useState, useMemo } from 'react';
import { Prueba, ReporteTabuladoCurso, UserProfile } from '../types';
import { StatCard } from './StatCard';
import { useAuth } from '../context/AuthContext';
import {
  BookOpen,
  Users,
  Award,
  PlusCircle,
  FileText,
  BarChart2,
  Copy,
  Check,
  Brain,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Flame,
  ShieldCheck,
  Eye,
  FileCheck2,
  School,
  Building2,
  User,
  CheckCircle2,
  XCircle,
  Printer,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import {
  simceHistoricoMock,
  mapaCalorCursosMock,
  alumnosAlertasCriticasMock,
  AlumnoAlertaCritica,
  preguntasMock,
  establecimientosCatalog,
} from '../data/mockData';
import { SandboxBeacon } from './SandboxBeacon';
import { SimceHistoricoPremilSection } from './SimceHistoricoPremilSection';
import { PlanMejoramientoModal } from './PlanMejoramientoModal';
import { PrintEvaluacionModal } from './PrintEvaluacionModal';
import { useAcademicData } from '../context/AcademicDataContext';
import {
  PlanMartinModal,
  EvaluacionIAModal,
  AislamientoModal
} from './SandboxSpecialModals';
import { SeguimientoDocenteCard } from './SeguimientoDocenteCard';
import {

  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Cell
} from 'recharts';

interface ProfesorDashboardProps {
  profesor: UserProfile;
  pruebas: Prueba[];
  reporteActivo: ReporteTabuladoCurso;
  isSandboxMode?: boolean;
  onOpenGenerator: () => void;
  onSelectPruebaReporte: (pruebaId: string) => void;
  onNavigateToEvaluaciones?: () => void;
}

export const ProfesorDashboard: React.FC<ProfesorDashboardProps> = ({
  profesor,
  pruebas,
  reporteActivo,
  isSandboxMode = false,
  onOpenGenerator,
  onSelectPruebaReporte,
  onNavigateToEvaluaciones
}) => {
  const { alumnos, isProduction, cursos } = useAcademicData();
  const { usuarios, docentesReales, switchToDocente } = useAuth();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const effectiveAlumnos = useMemo(() => {
    if (alumnos && alumnos.length > 0) return alumnos;
    const fromUsers = (usuarios || []).filter(u => u.rol === 'alumno');
    return fromUsers;
  }, [alumnos, usuarios]);
  const [adminTab, setAdminTab] = useState<'con_sysget' | 'sin_sysget'>('con_sysget');
  const [planMejoramientoOpen, setPlanMejoramientoOpen] = useState(false);
  const [planMartinOpen, setPlanMartinOpen] = useState(false);
  const [evaluacionIAOpen, setEvaluacionIAOpen] = useState(false);
  const [aislamientoOpen, setAislamientoOpen] = useState(false);
  const [printModalOpen, setPrintModalOpen] = useState(false);
  const [selectedPruebaForPrint, setSelectedPruebaForPrint] = useState<Prueba | null>(null);

  // Paginación para Evaluaciones Oficiales en Producción
  const [itemsPorPaginaEvals, setItemsPorPaginaEvals] = useState<number>(10);
  const [paginaActualEvals, setPaginaActualEvals] = useState<number>(1);

  const totalPaginasEvals = Math.ceil(pruebas.length / itemsPorPaginaEvals) || 1;
  const evalsPaginadas = useMemo(() => {
    const start = (paginaActualEvals - 1) * itemsPorPaginaEvals;
    return pruebas.slice(start, start + itemsPorPaginaEvals);
  }, [pruebas, paginaActualEvals, itemsPorPaginaEvals]);

  const isAdmin = profesor.rol === 'admin';
  const isProductionAdmin = isAdmin && !isSandboxMode && !!profesor.esSuperAdmin;
  const evaluacionesActivas = pruebas.filter(prueba => prueba.estado === 'activa').length;
  const ejesCriticos = (reporteActivo.desgloseEjes || []).filter(eje => eje.estado === 'critico').length;
  const isLenguaje = profesor.asignaturaId === 'asig-2' || (profesor.asignaturaNombre || '').toLowerCase().includes('lenguaje');
  const isCiencias = profesor.asignaturaId === 'asig-3' || (profesor.asignaturaNombre || '').toLowerCase().includes('ciencia');
  const isMatematica = !isAdmin && !isLenguaje && !isCiencias;

  // Agrupación dinámica de colegios y sus docentes en producción
  const isUserDemo = (u: UserProfile) => {
    return u.esDemo === true;
  };

  const colegiosList = useMemo(() => {
    const map = new Map<string, { rbd: string; nombre: string; comuna?: string; dependencia?: string; logoUrl?: string; docentes: UserProfile[] }>();

    establecimientosCatalog.forEach(e => {
      if (e.rbd) {
        map.set(e.rbd, {
          rbd: e.rbd,
          nombre: e.nombre,
          comuna: e.comuna || 'Región Metropolitana',
          dependencia: e.dependencia || 'Particular Subvencionado',
          logoUrl: e.logoUrl,
          docentes: []
        });
      }
    });

    const listaDocentes: UserProfile[] = [];

    (docentesReales || []).forEach(d => {
      const idx = listaDocentes.findIndex(x => x.email.toLowerCase() === d.email.toLowerCase() || x.id === d.id);
      if (idx >= 0) {
        listaDocentes[idx] = { ...listaDocentes[idx], ...d };
      } else {
        listaDocentes.push(d);
      }
    });

    (usuarios || []).filter(u => u.rol === 'profesor' && !isUserDemo(u)).forEach(d => {
      const idx = listaDocentes.findIndex(x => x.email.toLowerCase() === d.email.toLowerCase() || x.id === d.id);
      if (idx >= 0) {
        listaDocentes[idx] = { ...listaDocentes[idx], ...d };
      } else {
        listaDocentes.push(d);
      }
    });

    // Asignar cada docente al colegio correspondiente por RBD exacto
    listaDocentes.forEach(d => {
      const rbdKey = (d.rbd || '').trim();
      if (!rbdKey) return;

      let targetCol = map.get(rbdKey);
      if (!targetCol) {
        targetCol = {
          rbd: rbdKey,
          nombre: d.establecimiento || `Establecimiento RBD ${rbdKey}`,
          comuna: 'Establecimiento Registrado',
          dependencia: 'Particular / Subvencionado',
          logoUrl: d.logoUrl,
          docentes: []
        };
        map.set(rbdKey, targetCol);
      }

      if (!targetCol.docentes.some(doc => doc.id === d.id || doc.email.toLowerCase() === d.email.toLowerCase())) {
        targetCol.docentes.push(d);
      }
    });

    return Array.from(map.values());
  }, [docentesReales, usuarios]);

  const totalDocentesProduccion = useMemo(() => {
    return colegiosList.reduce((acc, c) => acc + c.docentes.length, 0);
  }, [colegiosList]);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Ejes data for BarChart
  const ejesChartData = (reporteActivo.desgloseEjes || []).map(e => ({
    name: e.nombre.length > 22 ? e.nombre.substring(0, 20) + '...' : e.nombre,
    fullName: e.nombre,
    logro: e.porcentajeLogro,
    estado: e.estado
  }));

  return (
    <div className="space-y-8 animate-fade-in text-left">
      {/* Welcome Banner */}
      <div className="glass-card p-6 sm:p-8 bg-gradient-to-r from-indigo-950/80 via-slate-900/90 to-slate-900/95 border-indigo-500/30 relative overflow-hidden shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                <Sparkles className="w-3.5 h-3.5 mr-1 text-amber-400" />
                {isProductionAdmin
                  ? '👑 Panel General UTP & Dirección — Control Global'
                  : isAdmin
                  ? '👑 Panel General UTP & Dirección — Control Global Demo'
                  : `Ambiente Docente • ${profesor.asignaturaNombre || 'Especialidad'}`}
              </span>
              {isSandboxMode || profesor.email === 'admin@sysget.cl' ? (
                <SandboxBeacon label="Demo Activa" durationMs={8000} />
              ) : (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 mr-1.5 animate-pulse" />
                  Producción Oficial
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {isProductionAdmin
                ? `Bienvenido, ${profesor.nombre} (Super Administrador / Fundador)`
                : isAdmin
                ? `Bienvenido, ${profesor.nombre} (${profesor.cargo || 'Jefe de UTP'})`
                : `Bienvenido/a, ${profesor.nombre} ${profesor.apellido}`}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              {isProductionAdmin
                ? 'Supervisión integral de establecimientos asociados, estado de nóminas y banco de evaluaciones activas en producción.'
                : isAdmin
                ? 'Supervisión integral de rendimiento SIMCE, mapa de calor por departamento y seguimiento de avances curriculares por colegio.'
                : `Gestión pedagógica de evaluaciones y análisis de logro curricular para la asignatura de ${profesor.asignaturaNombre || 'su departamento'}.`}
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {isProductionAdmin ? (
              <button
                onClick={() => onNavigateToEvaluaciones && onNavigateToEvaluaciones()}
                className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold px-5 py-3 rounded-2xl shadow-xl shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] border border-indigo-400/30 relative"
              >
                <BookOpen className="w-5 h-5 text-indigo-200" />
                <span>Ver Evaluaciones en Producción</span>
              </button>
            ) : isAdmin ? (
              <button
                onClick={() => setPlanMejoramientoOpen(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold px-5 py-3 rounded-2xl shadow-xl shadow-emerald-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] border border-emerald-400/30 relative"
              >
                <FileCheck2 className="w-5 h-5 text-emerald-200" />
                <span>Generar Plan de Mejoramiento Colegio</span>
              </button>
            ) : (
              <button
                onClick={onOpenGenerator}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-bold px-5 py-3 rounded-2xl shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] border border-indigo-400/30 relative"
              >
                <PlusCircle className="w-5 h-5" />
                <span>Crear Ensayo SIMCE</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* KPI Stat Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title={isProductionAdmin ? 'Establecimientos Registrados' : isAdmin ? 'Escala Nacional Promedio' : 'Logro Promedio Global'}
          value={isProductionAdmin ? `${colegiosList.length} Colegio${colegiosList.length !== 1 ? 's' : ''}` : reporteActivo.totalAlumnosRendidos === 0 ? 'Pendiente' : isAdmin ? `${reporteActivo.promedioEscalaNacional} pts` : `${reporteActivo.promedioPorcentajeLogro}%`}
          subtitle={isProductionAdmin ? (colegiosList.length === 1 ? colegiosList[0].nombre : `${colegiosList.length} Establecimientos en Red`) : isAdmin ? reporteActivo.pruebaTitulo : (reporteActivo.totalAlumnosRendidos === 0 ? `Curso ${reporteActivo.cursoNombre} (Sin rendiciones)` : `Curso ${reporteActivo.cursoNombre}`)}
          icon={<School className="w-5 h-5" />}
          trend={{ text: isProductionAdmin ? `${totalDocentesProduccion} Docente${totalDocentesProduccion !== 1 ? 's' : ''} en Producción` : isAdmin ? (isSandboxMode ? 'Datos de demostración' : 'Sin rendiciones registradas') : (reporteActivo.totalAlumnosRendidos === 0 ? 'Esperando aplicación' : 'Resultados del curso'), type: 'positive' }}
          iconBgColor="bg-amber-500/10 text-amber-600 dark:text-amber-400"
        />

        <StatCard
          title={isProductionAdmin ? 'Evaluaciones en Catálogo' : isAdmin ? 'Ejes con Alerta Crítica' : 'Escala Nacional Promedio'}
          value={isProductionAdmin ? `${pruebas.length.toLocaleString('es-CL')} Disponibles` : isAdmin ? `${ejesCriticos}` : (reporteActivo.totalAlumnosRendidos === 0 ? 'Pendiente' : `${reporteActivo.promedioEscalaNacional} pts`)}
          subtitle={isProductionAdmin ? `${pruebas.filter(p => p.tipoEvaluacion === 'paes' || p.id.includes('paes') || p.titulo.toLowerCase().includes('paes')).length} PAES • ${pruebas.filter(p => p.tipoEvaluacion === 'simce' || p.id.includes('simce') || p.titulo.toLowerCase().includes('simce')).length} SIMCE` : isAdmin ? `Según el reporte: ${reporteActivo.pruebaTitulo}` : (reporteActivo.totalAlumnosRendidos === 0 ? 'Evaluación configurada' : 'Rango 100 - 350 pts')}
          icon={<BookOpen className="w-5 h-5" />}
          trend={{ text: isProductionAdmin ? 'En Producción Activa' : isAdmin ? (ejesCriticos > 0 ? 'Requieren atención pedagógica' : 'Sin ejes críticos registrados') : (reporteActivo.totalAlumnosRendidos === 0 ? 'Pauta lista' : 'Resultados del reporte'), type: ejesCriticos > 0 ? 'negative' : 'positive' }}
          iconBgColor="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
        />

        <StatCard
          title={isProductionAdmin ? 'Alumnos Matriculados' : isAdmin ? 'Cursos Disponibles' : 'Evaluaciones Activas'}
          value={isProductionAdmin ? `${effectiveAlumnos.length} Alumno${effectiveAlumnos.length !== 1 ? 's' : ''}` : isAdmin ? `${cursos.length}` : `${evaluacionesActivas}`}
          subtitle={isProductionAdmin ? (effectiveAlumnos.length > 0 ? `${effectiveAlumnos.length} estudiantes registrados en la red` : 'En proceso de inicio de poblamiento') : isAdmin ? `${effectiveAlumnos.length} alumnos en el entorno actual` : 'En estado activo'}
          icon={<Users className="w-5 h-5" />}
          iconBgColor="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
        />

        <StatCard
          title={isProductionAdmin ? 'Rendiciones Aplicadas' : isAdmin ? 'Acciones de Reforzamiento' : 'Alumnos Rendidos'}
          value={isProductionAdmin ? `${reporteActivo.totalAlumnosRendidos > 0 ? reporteActivo.totalAlumnosRendidos : 0} Rendiciones` : isAdmin ? `${reporteActivo.planAccionReforzamiento.length}` : `${reporteActivo.totalAlumnosRendidos} / ${reporteActivo.totalAlumnosMatriculados}`}
          subtitle={isProductionAdmin ? (reporteActivo.totalAlumnosRendidos > 0 ? 'Rendiciones procesadas con éxito' : 'Listo para aplicación e ingreso') : isAdmin ? `En ${reporteActivo.pruebaTitulo}` : (reporteActivo.totalAlumnosRendidos === 0 ? 'Inicio de ciclo de evaluación' : 'Avance de entrega')}
          icon={<Award className="w-5 h-5" />}
          iconBgColor="bg-sky-500/10 text-sky-600 dark:text-sky-400"
        />
      </div>

      {/* ─────────────────────────────────────────────────────────────
          1. ADMIN / UTP SPECIAL SECTION (PRODUCCION VS DEMO)
         ───────────────────────────────────────────────────────────── */}
      {isAdmin && (
        isProductionAdmin ? (
          <div className="space-y-8 animate-fade-in">
            {/* 1. Estado de Establecimientos y Docentes en Producción */}
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2.5">
                    <School className="w-5 h-5 text-indigo-400" />
                    Establecimientos Activos en Producción
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Visualización del estado de configuración, nóminas y evaluaciones por colegio.
                  </p>
                </div>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 self-start sm:self-center">
                  {colegiosList.length} Establecimiento{colegiosList.length !== 1 ? 's' : ''} Asociado{colegiosList.length !== 1 ? 's' : ''}
                </span>
              </div>

              {/* Fichas de Colegios Registrados */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {colegiosList.map(col => (
                  <div
                    key={col.rbd || col.nombre}
                    className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-4 hover:border-slate-700 transition-all flex flex-col justify-between"
                  >
                    <div className="flex items-start gap-4">
                      {col.logoUrl ? (
                        <img
                          src={col.logoUrl}
                          alt={col.nombre}
                          className="w-12 h-12 object-contain rounded-xl bg-slate-900 p-1 border border-slate-700 shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-indigo-600/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                          <Building2 className="w-6 h-6" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-sm font-black text-white truncate" title={col.nombre}>
                            {col.nombre}
                          </h4>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                            RBD: {col.rbd}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {col.comuna || 'Chile'} • {col.dependencia || 'Particular Subvencionado'}
                        </p>
                        <div className="text-[11px] text-slate-300 mt-2.5 flex flex-wrap items-center gap-1.5">
                          <span className="text-slate-400 font-semibold">👤 Docentes ({col.docentes.length}):</span>
                          {col.docentes.length === 0 ? (
                            <span className="text-slate-500 text-xs italic">Sin docentes asignados aún</span>
                          ) : (
                            col.docentes.map(d => (
                              <button
                                key={d.id || d.email}
                                onClick={() => switchToDocente(d.id || d.email)}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 text-[10px] font-bold border border-indigo-500/30 transition-all shadow-sm"
                                title={`Supervisar panel de ${d.nombre} ${d.apellido} (${d.asignaturaNombre || 'Docente'})`}
                              >
                                <User className="w-3 h-3 text-indigo-400" />
                                <span>{d.nombre} {d.apellido}</span>
                                <span className="text-indigo-400/80 font-normal">({d.asignaturaNombre?.split(' ')[0] || 'Docente'})</span>
                              </button>
                            ))
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-800/80 grid grid-cols-3 gap-2 text-center text-xs">
                      {/* Cursos Dinámicos por Colegio */}
                      <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                        <div className="text-slate-400 text-[10px] uppercase font-bold">Cursos</div>
                        <div className="text-sm font-black text-white mt-0.5 truncate" title={(() => {
                          const colCursos = (cursos || []).filter(c =>
                            (c.rbd && c.rbd === col.rbd) ||
                            (c.establecimiento && c.establecimiento.toLowerCase().includes(col.nombre.toLowerCase())) ||
                            (col.rbd === '31030' && (!c.rbd || c.establecimiento?.toLowerCase().includes('premilitar')))
                          );
                          return colCursos.map(c => c.nombre).join(', ') || 'Sin cursos';
                        })()}>
                          {(() => {
                            const colCursos = (cursos || []).filter(c =>
                              (c.rbd && c.rbd === col.rbd) ||
                              (c.establecimiento && c.establecimiento.toLowerCase().includes(col.nombre.toLowerCase())) ||
                              (col.rbd === '31030' && (!c.rbd || c.establecimiento?.toLowerCase().includes('premilitar')))
                            );
                            if (colCursos.length > 0) {
                              return `${colCursos.length} (${colCursos.map(c => c.nombre).join(', ')})`;
                            }
                            if (col.rbd === '31030' && cursos.length > 0) {
                              return `${cursos.length} (${cursos.map(c => c.nombre).join(', ')})`;
                            }
                            return '0 Cursos';
                          })()}
                        </div>
                      </div>

                      {/* Evaluaciones Dinámicas por Colegio */}
                      <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                        <div className="text-slate-400 text-[10px] uppercase font-bold">Evaluaciones</div>
                        <div className="text-sm font-black text-indigo-400 mt-0.5">
                          {(() => {
                            const colCursos = (cursos || []).filter(c =>
                              (c.rbd && c.rbd === col.rbd) ||
                              (c.establecimiento && c.establecimiento.toLowerCase().includes(col.nombre.toLowerCase())) ||
                              (col.rbd === '31030')
                            );
                            const evalsMatch = pruebas.filter(p =>
                              colCursos.some(c => c.nombre === p.cursoNombre || c.id === p.cursoId) ||
                              (col.rbd === '31030' && (p.cursoNombre?.includes('2°') || p.id.includes('2m') || p.id.includes('simce')))
                            );
                            const total = evalsMatch.length > 0 ? evalsMatch.length : pruebas.length;
                            return `${total} Activa${total !== 1 ? 's' : ''}`;
                          })()}
                        </div>
                      </div>

                      {/* Nómina de Alumnos Dinámica por Colegio */}
                      <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                        <div className="text-slate-400 text-[10px] uppercase font-bold">Nómina Alumnos</div>
                        <div className="text-sm font-black text-amber-400 mt-0.5">
                          {(() => {
                            const colCursos = (cursos || []).filter(c =>
                              (c.rbd && c.rbd === col.rbd) ||
                              (c.establecimiento && c.establecimiento.toLowerCase().includes(col.nombre.toLowerCase())) ||
                              (col.rbd === '31030')
                            );
                            const colAlumnos = (effectiveAlumnos || []).filter(a => {
                              const aAny = a as unknown as Record<string, unknown>;
                              if (aAny.rbd && aAny.rbd === col.rbd) return true;
                              if (aAny.establecimiento && typeof aAny.establecimiento === 'string' && aAny.establecimiento.toLowerCase().includes(col.nombre.toLowerCase())) return true;
                              if (colCursos.some(c => c.id === aAny.cursoId || c.nombre === aAny.cursoNombre)) return true;
                              return col.rbd === '31030';
                            });
                            if (colAlumnos.length > 0) {
                              return `${colAlumnos.length} Alumnos`;
                            }
                            return '0 (En proceso)';
                          })()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Módulo de Inicio de Poblamiento Institucional */}
              <div className="p-5 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <h4 className="text-sm font-bold text-white">Ciclo de Poblamiento en Curso</h4>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    El sistema se encuentra en fase inicial de carga. A medida que subas las nóminas de estudiantes (CSV), los resultados históricos de SIMCE (MINEDUC) y las rendiciones, este panel generará las analíticas de desempeño institucional.
                  </p>
                </div>

                <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
                  <button
                    onClick={() => onNavigateToEvaluaciones && onNavigateToEvaluaciones()}
                    className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/20"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Ver Evaluaciones</span>
                  </button>
                  <div className="px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700/60 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Esperando Carga de Nómina</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Línea Base Oficial SIMCE — Agencia de Calidad */}
            <SimceHistoricoPremilSection />

            {/* 3. Resumen de la Evaluación Oficial Cargada con Paginación */}
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-indigo-400" />
                    Evaluaciones Oficiales en Producción
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Instrumentos de evaluación estandarizada cargados en la base de datos ({pruebas.length} en total).
                  </p>
                </div>

                {/* Selector rápido de items por página y navegación superior */}
                <div className="flex items-center gap-3 self-start sm:self-auto flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 font-medium">Ver por página:</span>
                    <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-0.5">
                      {[10, 20, 30, 40].map((num) => (
                        <button
                          key={num}
                          onClick={() => {
                            setItemsPorPaginaEvals(num);
                            setPaginaActualEvals(1);
                          }}
                          className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                            itemsPorPaginaEvals === num
                              ? 'bg-indigo-600 text-white shadow-sm'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>

                  {totalPaginasEvals > 1 && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setPaginaActualEvals(p => Math.max(1, p - 1))}
                        disabled={paginaActualEvals === 1}
                        className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        title="Página anterior"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: totalPaginasEvals }, (_, i) => i + 1).map((hoja) => (
                          <button
                            key={hoja}
                            onClick={() => setPaginaActualEvals(hoja)}
                            className={`w-6 h-6 rounded-md text-xs font-bold transition-all ${
                              paginaActualEvals === hoja
                                ? 'bg-indigo-600 text-white'
                                : 'bg-slate-800/80 text-slate-400 hover:text-white'
                            }`}
                          >
                            {hoja}
                          </button>
                        ))}
                      </div>
                      <button
                        onClick={() => setPaginaActualEvals(p => Math.min(totalPaginasEvals, p + 1))}
                        disabled={paginaActualEvals === totalPaginasEvals}
                        className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        title="Página siguiente"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Lista Paginada de Evaluaciones — Ventana con altura para 10 ítems y Scroll Interno */}
              <div className="space-y-2.5 max-h-[640px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-700 focus:outline-none">
                {evalsPaginadas.map((p: Prueba) => (
                  <div
                    key={p.id}
                    className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900/90 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-[11px] font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 group-hover:border-indigo-500/40 transition-colors">
                          {p.codigoPublico || 'SIMCE-LEN-2M'}
                        </span>
                        <span className="text-xs font-bold text-white group-hover:text-indigo-200 transition-colors">{p.titulo}</span>
                      </div>
                      <p className="text-xs text-slate-400">
                        Curso: <strong>{p.cursoNombre}</strong> • Asignatura: <strong>{p.asignaturaNombre}</strong> • {p.totalPreguntas || 35} preguntas oficiales • {p.duracionMinutos || 90} minutos
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => onNavigateToEvaluaciones && onNavigateToEvaluaciones()}
                        className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-indigo-600 text-white text-xs font-semibold transition-all border border-slate-700 hover:border-indigo-500 shadow-sm"
                      >
                        Centro de Impresión / PDF
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Barra de Paginación y Selector de Hojas */}
              {totalPaginasEvals > 1 && (
                <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="text-xs text-slate-400">
                    Mostrando{' '}
                    <span className="font-bold text-white">
                      {(paginaActualEvals - 1) * itemsPorPaginaEvals + 1}
                    </span>{' '}
                    a{' '}
                    <span className="font-bold text-white">
                      {Math.min(paginaActualEvals * itemsPorPaginaEvals, pruebas.length)}
                    </span>{' '}
                    de <span className="font-bold text-white">{pruebas.length}</span> evaluaciones
                  </div>

                  <div className="flex items-center gap-1.5 self-center sm:self-auto flex-wrap">
                    <button
                      onClick={() => setPaginaActualEvals(p => Math.max(1, p - 1))}
                      disabled={paginaActualEvals === 1}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                      title="Página Anterior"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    {Array.from({ length: totalPaginasEvals }, (_, i) => i + 1).map((hoja) => (
                      <button
                        key={hoja}
                        onClick={() => setPaginaActualEvals(hoja)}
                        className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                          paginaActualEvals === hoja
                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                            : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800'
                        }`}
                      >
                        {hoja}
                      </button>
                    ))}

                    <button
                      onClick={() => setPaginaActualEvals(p => Math.min(totalPaginasEvals, p + 1))}
                      disabled={paginaActualEvals === totalPaginasEvals}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                      title="Página Siguiente"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Comparison Tab "Sin Sysget vs Con Sysget" */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-indigo-400" />
                    Impacto Directivo: ¿Qué cambia en tu Colegio?
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Compara la gestión tradicional de evaluaciones vs la automatización de Sysget Saber.
                  </p>
                </div>

                <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-2xl border border-slate-800 self-start sm:self-center">
                  <button
                    onClick={() => setAdminTab('con_sysget')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      adminTab === 'con_sysget'
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    ✨ Con Sysget Saber
                  </button>
                  <button
                    onClick={() => setAdminTab('sin_sysget')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      adminTab === 'sin_sysget'
                        ? 'bg-rose-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    ❌ Sin Sysget Saber
                  </button>
                </div>
              </div>

              {adminTab === 'con_sysget' ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in text-xs">
                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
                    <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> Diagnóstico Inmediato (0 Horas)
                    </div>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      Las pruebas se corrigen al instante. El equipo directivo visualiza brechas por habilidad y eje curricular el mismo día de rendición.
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 space-y-2">
                    <div className="font-bold text-indigo-300 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> Planes Remediales con IA
                    </div>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      Generación automática de actividades paso a paso por alumno (ej: Martín S. en Álgebra) listas para imprimir o enviar.
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/30 space-y-2">
                    <div className="font-bold text-sky-300 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> Aislamiento por Materia
                    </div>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      Cada profesor opera únicamente en su disciplina, manteniendo orden y confidencialidad pedagógica en toda la institución.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in text-xs">
                  <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 space-y-2">
                    <div className="font-bold text-rose-400 flex items-center gap-1.5">
                      <XCircle className="w-4 h-4" /> Semanas de Corrección Manual
                    </div>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      Revisión de hojas de respuesta en papel o planillas Excel dispersas. La retroalimentación llega cuando el contenido ya pasó.
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 space-y-2">
                    <div className="font-bold text-rose-400 flex items-center gap-1.5">
                      <XCircle className="w-4 h-4" /> Sin Planes Diferenciados
                    </div>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      Se conoce solo la "nota promedio" pero no la causa cognitiva (ej. distractor de Pitágoras vs despeje algebraico).
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 space-y-2">
                    <div className="font-bold text-rose-400 flex items-center gap-1.5">
                      <XCircle className="w-4 h-4" /> Datos Desconectados
                    </div>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      UTP no puede comparar tendencias históricas ni generar el Plan de Mejoramiento (PME) con sustento estadístico claro.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Grid: Historical LineChart + Heatmap Matrix */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Historical Chart */}
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-indigo-400" />
                      Evolución Histórica SIMCE (Últimos 3 Años)
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Tendencia de puntajes y proyección 2026 para el colegio
                    </p>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20">
                    +29 pts Global
                  </span>
                </div>

                <div className="h-64 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={simceHistoricoMock} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="anio" stroke="#94a3b8" fontSize={11} />
                      <YAxis domain={[220, 280]} stroke="#94a3b8" fontSize={11} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '11px' }}
                      />
                      <Line type="monotone" dataKey="matematica" stroke="#818cf8" strokeWidth={3} name="Matemática" dot={{ r: 4 }} />
                      <Line type="monotone" dataKey="lenguaje" stroke="#34d399" strokeWidth={3} name="Lenguaje" dot={{ r: 4 }} />
                      <Line type="monotone" dataKey="ciencias" stroke="#38bdf8" strokeWidth={3} name="Ciencias" dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Heatmap Matrix */}
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Flame className="w-5 h-5 text-amber-400" />
                      Mapa de Calor Curricular por Curso
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Detección rápida de brechas por nivel y materia
                    </p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                        <th className="py-2.5 px-3">Curso</th>
                        <th className="py-2.5 px-3 text-center">Matemática</th>
                        <th className="py-2.5 px-3 text-center">Lenguaje</th>
                        <th className="py-2.5 px-3 text-center">Ciencias</th>
                        <th className="py-2.5 px-3 text-right">Alumnos en Riesgo</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {mapaCalorCursosMock.map((c) => (
                        <tr key={c.cursoId} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-3 px-3">
                            <div className="font-bold text-white">{c.cursoNombre}</div>
                            <div className="text-[10px] text-slate-500">{c.profesorJefe}</div>
                          </td>
                          <td className="py-3 px-3 text-center">
                            <span
                              className={`inline-block px-2.5 py-1 rounded-lg font-bold ${
                                c.matematicaLogro < 50
                                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                  : c.matematicaLogro < 65
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              }`}
                            >
                              {c.matematicaLogro}%
                            </span>
                          </td>
                          <td className="py-3 px-3 text-center">
                            <span
                              className={`inline-block px-2.5 py-1 rounded-lg font-bold ${
                                c.lenguajeLogro < 50
                                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                  : c.lenguajeLogro < 65
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              }`}
                            >
                              {c.lenguajeLogro}%
                            </span>
                          </td>
                          <td className="py-3 px-3 text-center">
                            <span
                              className={`inline-block px-2.5 py-1 rounded-lg font-bold ${
                                c.cienciasLogro < 50
                                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                  : c.cienciasLogro < 65
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              }`}
                            >
                              {c.cienciasLogro}%
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <span className="font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-md">
                              {c.alumnosEnRiesgo} alumnos
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Top Critical Student Alerts Table */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-rose-400" />
                    Alumnos con Brechas Críticas Detectadas por la Analítica
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Estudiantes con desempeño menor a 40% en ejes estructurales SIMCE.
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                      <th className="py-2.5 px-3">Estudiante</th>
                      <th className="py-2.5 px-3">Curso</th>
                      <th className="py-2.5 px-3">Eje Curricular Afectado</th>
                      <th className="py-2.5 px-3 text-center">Logro</th>
                      <th className="py-2.5 px-3 text-right">Acción Pedagógica</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {alumnosAlertasCriticasMock.map((a: AlumnoAlertaCritica) => (
                      <tr key={a.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-3 font-bold text-white">{a.nombre}</td>
                        <td className="py-3 px-3 text-slate-400">{a.curso}</td>
                        <td className="py-3 px-3 text-slate-300">{a.ejeCritico}</td>
                        <td className="py-3 px-3 text-center">
                          <span className="font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                            {a.porcentajeLogro}%
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => setPlanMartinOpen(true)}
                            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer transition-colors"
                          >
                            Ver Plan de Refuerzo →
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* UTP Teacher Progress and Curricular Coverage Tracking */}
            <SeguimientoDocenteCard onSelectPruebaReporte={onSelectPruebaReporte} />
          </div>
        )
      )}


      {/* ─────────────────────────────────────────────────────────────
          2. TEACHER SPECIAL SECTION (NARRATIVE + CHARTS)
         ───────────────────────────────────────────────────────────── */}
      {!isAdmin && (
        <div className="space-y-6">
          {/* Narrative student alert banner for Math */}
          {!isProduction && isMatematica && (
            <div className="p-6 rounded-3xl bg-gradient-to-r from-rose-950/40 via-slate-900 to-indigo-950/30 border border-rose-500/30 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/30 text-rose-400 flex items-center justify-center font-black text-base flex-shrink-0">
                  MS
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">
                      Caso de Estudio: Alumno Martín Sepúlveda (8° Básico B)
                    </h3>
                    <SandboxBeacon label="Acción Estrella ⭐" />
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Brecha severa detectada en <strong className="text-rose-300">Álgebra y Funciones (28% logro)</strong>. Plan de nivelación autogenerado listo para aplicar.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setPlanMartinOpen(true)}
                className="flex items-center gap-2 bg-rose-600 hover:bg-rose-500 active:scale-95 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-rose-600/30 transition-all self-start sm:self-center whitespace-nowrap"
              >
                <Brain className="w-4 h-4" />
                <span>Ver Plan de Reforzamiento de Martín S.</span>
              </button>
            </div>
          )}

          {/* Narrative callout for Science */}
          {!isProduction && isCiencias && (
            <div className="p-6 rounded-3xl bg-gradient-to-r from-sky-950/40 via-slate-900 to-indigo-950/30 border border-sky-500/30 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="p-3 rounded-2xl bg-sky-600/20 border border-sky-500/30 text-sky-400 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">
                      Ambiente Aislado: Ciencias Naturales (6° y 8° Básico)
                    </h3>
                    <SandboxBeacon label="Privacidad Pedagógica ⭐" />
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Los datos de logro de Biología, Física y Química están completamente separados de otras asignaturas.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setAislamientoOpen(true)}
                className="flex items-center gap-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-sky-600/30 transition-all self-start sm:self-center whitespace-nowrap"
              >
                <Eye className="w-4 h-4" />
                <span>Ver Aislamiento Pedagógico</span>
              </button>
            </div>
          )}

          {/* Narrative callout for Language */}
          {!isProduction && isLenguaje && (
            <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-indigo-950/30 border border-purple-500/30 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="p-3 rounded-2xl bg-purple-600/20 border border-purple-500/30 text-purple-400 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-amber-300" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">
                      Evaluación Automática de Escritura y Preguntas Abiertas con IA
                    </h3>
                    <SandboxBeacon label="Demo IA ⭐" />
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Muestra cómo la IA de Sysget califica ensayos y respuestas textuales con rúbricas MINEDUC en 1.2 segundos.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setEvaluacionIAOpen(true)}
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-purple-600/30 transition-all self-start sm:self-center whitespace-nowrap"
              >
                <Brain className="w-4 h-4" />
                <span>Ver Evaluación de Escritura con IA</span>
              </button>
            </div>
          )}

          {/* Gaps by Curricular Axis (Horizontal BarChart Recharts) */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <BarChart2 className="w-5 h-5 text-indigo-400" />
                  Logro Curricular por Eje Temático ({reporteActivo.cursoNombre})
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Porcentaje de acierto por Objetivo de Aprendizaje (Ejes en rojo requieren nivelación urgente)
                </p>
              </div>
            </div>

            <div className="h-56 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ejesChartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                  <XAxis type="number" domain={[0, 100]} stroke="#94a3b8" fontSize={11} unit="%" />
                  <YAxis type="category" dataKey="name" stroke="#cbd5e1" fontSize={11} width={130} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '11px' }}
                    formatter={(val: unknown) => [`${val}% de logro`, 'Rendimiento']}
                  />
                  <Bar dataKey="logro" radius={[0, 8, 8, 0]}>
                    {ejesChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.logro < 50 ? '#f43f5e' : entry.logro < 70 ? '#f59e0b' : '#10b981'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Tabla accesible oculta visualmente — datos completos para lectores de pantalla y tests */}
            <table className="sr-only" aria-label="Logro Curricular por Eje Temático">
              <thead>
                <tr>
                  <th scope="col">Eje Curricular</th>
                  <th scope="col">Rendimiento</th>
                </tr>
              </thead>
              <tbody>
                {(reporteActivo?.desgloseEjes || []).map((eje) => (
                  <tr key={eje.ejeId || eje.nombre}>
                    <td>{eje.nombre}</td>
                    <td>{eje.porcentajeLogro}% de logro</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Plan de Reforzamiento Highlight Callout */}
      {reporteActivo && reporteActivo.planAccionReforzamiento.length > 0 && (
        <div className="glass-card p-6 border-l-4 border-l-amber-500 bg-amber-500/5 space-y-4">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-500 text-white rounded-xl shadow-md">
                <Brain className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Plan de Acción de Reforzamiento Autogenerado Disponible
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {reporteActivo.pruebaTitulo} • {reporteActivo.planAccionReforzamiento.length} planes remediales activos para <strong>{reporteActivo.cursoNombre}</strong>.
                </p>
              </div>
            </div>

            <button
              onClick={() => onSelectPruebaReporte(reporteActivo.pruebaId)}
              className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm transition-all whitespace-nowrap"
            >
              <span>Ver Plan Detallado</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Evaluaciones List Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-500" />
            Evaluaciones y Ensayos Recientes
          </h3>
          {onNavigateToEvaluaciones && (
            <button
              onClick={onNavigateToEvaluaciones}
              className="flex items-center gap-1.5 text-xs font-semibold text-indigo-500 hover:text-indigo-400 transition-colors"
            >
              <span>Ver todas</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {pruebas.length === 0 ? (
          <div className="glass-card p-8 text-center space-y-3">
            <FileText className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto" />
            <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">
              No tienes evaluaciones creadas aún
            </h4>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Crea tu primera evaluación formativa o ensayo SIMCE a partir de las preguntas de tu banco curricular de {profesor.asignaturaNombre || 'tu especialidad'}.
            </p>
            {onOpenGenerator && (
              <button
                onClick={onOpenGenerator}
                className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md transition-all"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>+ Crear Primer Ensayo SIMCE</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pruebas.map((prueba) => (
            <div
              key={prueba.id}
              className="glass-card p-6 space-y-4 hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                    {prueba.asignaturaNombre} — {prueba.nivel}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {prueba.duracionMinutos} min
                  </span>
                </div>

                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  {prueba.titulo}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                  {prueba.descripcion}
                </p>
              </div>

              {/* Code Banner */}
              <div className="p-3 bg-slate-50 dark:bg-slate-950/80 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Código para Alumnos</span>
                  <strong className="text-indigo-600 dark:text-indigo-400 font-mono text-sm">{prueba.codigoPublico}</strong>
                </div>

                <button
                  onClick={() => handleCopyCode(prueba.codigoPublico)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/20 font-semibold transition-colors"
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

              {/* Action */}
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  onClick={() => onSelectPruebaReporte(prueba.id)}
                  className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold py-2.5 rounded-xl transition-all shadow-md shadow-indigo-600/20"
                >
                  <BarChart2 className="w-4 h-4" />
                  <span>Ver Reporte</span>
                </button>

                <button
                  onClick={() => {
                    setSelectedPruebaForPrint(prueba);
                    setPrintModalOpen(true);
                  }}
                  className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 text-xs font-bold py-2.5 rounded-xl transition-all"
                  title="Imprimir Cuadernillo de Evaluación y Hoja de Respuestas"
                >
                  <Printer className="w-4 h-4 text-indigo-400" />
                  <span>Imprimir / PDF</span>
                </button>
              </div>
            </div>
          ))}
          </div>
        )}
      </div>

      {/* MODALS */}
      <PlanMejoramientoModal
        isOpen={planMejoramientoOpen}
        onClose={() => setPlanMejoramientoOpen(false)}
      />
      <PlanMartinModal
        isOpen={planMartinOpen}
        onClose={() => setPlanMartinOpen(false)}
      />
      <EvaluacionIAModal
        isOpen={evaluacionIAOpen}
        onClose={() => setEvaluacionIAOpen(false)}
      />
      <AislamientoModal
        isOpen={aislamientoOpen}
        onClose={() => setAislamientoOpen(false)}
        asignaturaNombre={profesor.asignaturaNombre || 'Ciencias Naturales'}
      />
      <PrintEvaluacionModal
        isOpen={printModalOpen}
        onClose={() => {
          setPrintModalOpen(false);
          setSelectedPruebaForPrint(null);
        }}
        prueba={selectedPruebaForPrint}
        preguntas={preguntasMock}
        alumnos={alumnos}
      />
    </div>
  );
};
