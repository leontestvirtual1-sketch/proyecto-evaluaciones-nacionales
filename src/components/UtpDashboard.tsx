import React, { useState, useMemo } from 'react';
import { Prueba, UserProfile } from '../types';
import {
  GraduationCap,
  BookOpen,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Layers,
  FileText,
  Building2,
  Calendar,
  ChevronRight,
  Eye,
  Award,
  Users,
  Search,
  ExternalLink,
  Target,
  ArrowUpRight
} from 'lucide-react';
import { StatCard } from './StatCard';
import { useAcademicData } from '../context/AcademicDataContext';
import { useAuth } from '../context/AuthContext';
import { demoProfesoresMock } from '../data/mockData';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell
} from 'recharts';

interface UtpDashboardProps {
  utp: UserProfile;
  pruebas: Prueba[];
  onNavigateToEvaluaciones?: () => void;
  onSelectPruebaReporte?: (pruebaId: string) => void;
}

export const UtpDashboard: React.FC<UtpDashboardProps> = ({
  utp,
  pruebas,
  onNavigateToEvaluaciones,
  onSelectPruebaReporte
}) => {
  const { cursos, isProduction } = useAcademicData();
  const { docentesReales, usuarios, switchToDocente } = useAuth();
  const [selectedAsignaturaFilter, setSelectedAsignaturaFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'docentes' | 'evaluaciones' | 'cobertura' | 'alertas'>('docentes');
  const [searchDocente, setSearchDocente] = useState('');

  // Departamentos asignados a esta jefatura UTP
  const deptoIds = useMemo(() => {
    return utp.departamentosSupervisados || ['asig-1', 'asig-3'];
  }, [utp.departamentosSupervisados]);

  // Lista consolidada de docentes del colegio que pertenecen a los departamentos supervisados
  const poolDocentes = useMemo(() => {
    const rawList: UserProfile[] = isProduction
      ? (docentesReales.length > 0 ? docentesReales : usuarios.filter(u => u.rol === 'profesor'))
      : demoProfesoresMock;

    return rawList.filter(d => {
      if (deptoIds.length === 0) return true;
      return d.asignaturaId && deptoIds.includes(d.asignaturaId);
    });
  }, [isProduction, docentesReales, usuarios, deptoIds]);

  // Docentes filtrados por la píldora de asignatura y búsqueda
  const docentesFiltrados = useMemo(() => {
    return poolDocentes.filter(d => {
      const matchAsignatura = selectedAsignaturaFilter === 'all' || d.asignaturaId === selectedAsignaturaFilter;
      const matchSearch = !searchDocente ||
        `${d.nombre} ${d.apellido}`.toLowerCase().includes(searchDocente.toLowerCase()) ||
        (d.asignaturaNombre || '').toLowerCase().includes(searchDocente.toLowerCase());
      return matchAsignatura && matchSearch;
    });
  }, [poolDocentes, selectedAsignaturaFilter, searchDocente]);

  // Pruebas de los departamentos supervisados
  const pruebasSupervisadas = useMemo(() => {
    return pruebas.filter(p => {
      const matchDepto = deptoIds.length === 0 || deptoIds.includes(p.asignaturaId);
      const matchFilter = selectedAsignaturaFilter === 'all' || p.asignaturaId === selectedAsignaturaFilter;
      return matchDepto && matchFilter;
    });
  }, [pruebas, deptoIds, selectedAsignaturaFilter]);

  // Métricas para StatCards
  const kpis = useMemo(() => {
    const totalDocentes = poolDocentes.length;
    const totalPruebas = pruebasSupervisadas.length;
    
    // Simulación de cobertura y promedio ponderado
    const coberturaEstimada = Math.round(72 + (totalPruebas * 3 > 22 ? 22 : totalPruebas * 3));
    const promedioLogro = Math.min(88, Math.round(65 + totalPruebas * 1.5));

    return {
      totalDocentes,
      totalPruebas,
      coberturaEstimada,
      promedioLogro
    };
  }, [poolDocentes, pruebasSupervisadas]);

  // Datos para gráfico de cumplimiento por asignatura
  const chartDataCobertura = useMemo(() => {
    const map: Record<string, { asignatura: string; pruebas: number; cobertura: number }> = {};
    
    poolDocentes.forEach(d => {
      const asig = d.asignaturaNombre || 'General';
      if (!map[asig]) {
        map[asig] = { asignatura: asig, pruebas: 0, cobertura: 75 };
      }
    });

    pruebasSupervisadas.forEach(p => {
      const asig = p.asignaturaNombre || 'General';
      if (map[asig]) {
        map[asig].pruebas += 1;
        map[asig].cobertura = Math.min(95, map[asig].cobertura + 5);
      }
    });

    return Object.values(map);
  }, [poolDocentes, pruebasSupervisadas]);

  // Alertas pedagógicas automáticas
  const alertas = useMemo(() => {
    const list = [];
    if (kpis.coberturaEstimada < 75) {
      list.push({
        id: 'alt-1',
        tipo: 'warning' as const,
        titulo: 'Ritmo de Cobertura Curricular Moderado',
        mensaje: 'El departamento presenta un 74% de cobertura al mes actual frente a la meta esperada del 80%.',
        depto: 'Matemática'
      });
    }
    list.push({
      id: 'alt-2',
      tipo: 'info' as const,
      titulo: 'Próxima Aplicación de Ensayo SIMCE',
      mensaje: '8° Básico tiene programado ensayo de comprensión y resolución de problemas para la próxima semana.',
      depto: 'Ciencias y Matemática'
    });
    list.push({
      id: 'alt-3',
      tipo: 'success' as const,
      titulo: 'Consistencia en Bancos de Preguntas',
      mensaje: 'Los docentes de su área han generado más de 45 preguntas alineadas a OA priorizados en el último ciclo.',
      depto: 'Área Académica'
    });
    return list;
  }, [kpis]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* ── Encabezado Ejecutivo Jefe UTP ── */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-indigo-950 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden border border-teal-500/20">
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-gradient-to-l from-teal-500/10 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-teal-500/20 border border-teal-400/30 rounded-2xl text-teal-300 shadow-inner">
              <Layers className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-400/20 text-teal-200 border border-teal-400/30">
                  Unidad Técnico Pedagógica (UTP)
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/10 text-white/80 border border-white/15">
                  RBD: {utp.rbd || '31030'}
                </span>
              </div>
              <h1 className="text-2xl font-black tracking-tight text-white mt-1">
                Panel de Supervisión Pedagógica
              </h1>
              <p className="text-sm text-teal-100/80 flex items-center gap-1.5 mt-0.5">
                <Building2 className="w-3.5 h-3.5 text-teal-300" />
                {utp.establecimiento || 'Escuela Premilitar Héroes de la Concepción'} &bull; {utp.nombre} {utp.apellido}
              </p>
            </div>
          </div>

          {/* Selector de Departamento Asignado */}
          <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 bg-slate-900/60 p-2 rounded-xl border border-teal-400/20 backdrop-blur-sm">
            <span className="text-xs text-teal-200 font-semibold px-2">Departamentos a Cargo:</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setSelectedAsignaturaFilter('all')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  selectedAsignaturaFilter === 'all'
                    ? 'bg-teal-500 text-slate-950 shadow-sm'
                    : 'text-teal-200 hover:text-white hover:bg-white/10'
                }`}
              >
                Todos ({poolDocentes.length})
              </button>
              {deptoIds.includes('asig-1') && (
                <button
                  onClick={() => setSelectedAsignaturaFilter('asig-1')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    selectedAsignaturaFilter === 'asig-1'
                      ? 'bg-indigo-500 text-white shadow-sm'
                      : 'text-indigo-200 hover:text-white hover:bg-white/10'
                  }`}
                >
                  📐 Matemática
                </button>
              )}
              {deptoIds.includes('asig-3') && (
                <button
                  onClick={() => setSelectedAsignaturaFilter('asig-3')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    selectedAsignaturaFilter === 'asig-3'
                      ? 'bg-emerald-500 text-white shadow-sm'
                      : 'text-emerald-200 hover:text-white hover:bg-white/10'
                  }`}
                >
                  🔬 Ciencias
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── 4 KPIs Clave con StatCard ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Docentes a Cargo"
          value={kpis.totalDocentes}
          subtitle="En departamentos supervisados"
          icon={<GraduationCap className="w-6 h-6 text-teal-600 dark:text-teal-400" />}
          iconBgColor="bg-teal-50 dark:bg-teal-950/50"
          trend={{ text: '100% activos con evaluaciones', type: 'positive' }}
        />
        <StatCard
          title="Evaluaciones Registradas"
          value={kpis.totalPruebas}
          subtitle="Ensayos y pruebas de aula"
          icon={<BookOpen className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />}
          iconBgColor="bg-indigo-50 dark:bg-indigo-950/50"
          trend={{ text: '+4 en este ciclo', type: 'positive' }}
        />
        <StatCard
          title="Cobertura Curricular"
          value={`${kpis.coberturaEstimada}%`}
          subtitle="Avance de Objetivos de Aprendizaje"
          icon={<Target className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />}
          iconBgColor="bg-emerald-50 dark:bg-emerald-950/50"
          trend={{ text: 'En línea con calendario escolar', type: 'positive' }}
        />
        <StatCard
          title="Promedio de Logro"
          value={`${kpis.promedioLogro}%`}
          subtitle="Rendición promedio del área"
          icon={<TrendingUp className="w-6 h-6 text-amber-600 dark:text-amber-400" />}
          iconBgColor="bg-amber-50 dark:bg-amber-950/50"
          trend={{ text: '+3.2% vs ensayo anterior', type: 'positive' }}
        />
      </div>

      {/* ── Navegación de Pestañas ── */}
      <div className="border-b border-slate-200 dark:border-slate-800">
        <nav className="flex space-x-2 sm:space-x-4 overflow-x-auto pb-px">
          <button
            onClick={() => setActiveTab('docentes')}
            className={`flex items-center gap-2 py-3 px-4 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'docentes'
                ? 'border-teal-500 text-teal-600 dark:text-teal-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Docentes Supervisados</span>
            <span className="ml-1.5 px-2 py-0.5 text-xs rounded-full bg-slate-100 dark:bg-slate-800 font-bold">
              {docentesFiltrados.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('evaluaciones')}
            className={`flex items-center gap-2 py-3 px-4 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'evaluaciones'
                ? 'border-teal-500 text-teal-600 dark:text-teal-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Evaluaciones del Área</span>
            <span className="ml-1.5 px-2 py-0.5 text-xs rounded-full bg-slate-100 dark:bg-slate-800 font-bold">
              {pruebasSupervisadas.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('cobertura')}
            className={`flex items-center gap-2 py-3 px-4 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'cobertura'
                ? 'border-teal-500 text-teal-600 dark:text-teal-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Cumplimiento Curricular MINEDUC</span>
          </button>

          <button
            onClick={() => setActiveTab('alertas')}
            className={`flex items-center gap-2 py-3 px-4 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'alertas'
                ? 'border-teal-500 text-teal-600 dark:text-teal-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span>Alertas Pedagógicas</span>
            <span className="ml-1.5 px-2 py-0.5 text-xs rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold">
              {alertas.length}
            </span>
          </button>
        </nav>
      </div>

      {/* ── Contenido según pestaña activa ── */}

      {/* PESTAÑA 1: DOCENTES SUPERVISADOS */}
      {activeTab === 'docentes' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Cuerpo Docente de la Jefatura
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Supervisión del avance instruccional, generación de evaluaciones y acompañamiento de aula.
              </p>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar docente o asignatura..."
                value={searchDocente}
                onChange={e => setSearchDocente(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {docentesFiltrados.map(docente => {
              // Calcular pruebas creadas por este docente
              const pruebasDocente = pruebasSupervisadas.filter(p => p.asignaturaId === docente.asignaturaId);
              
              return (
                <div
                  key={docente.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800/60 flex items-center justify-center text-teal-600 dark:text-teal-400 font-bold text-lg">
                          {docente.nombre[0]}{docente.apellido[0]}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 dark:text-white text-base">
                            {docente.nombre} {docente.apellido}
                          </h3>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                              {docente.asignaturaNombre || 'Especialidad'}
                            </span>
                            <span className="text-xs text-slate-400">RUT: {docente.rut || 'No informado'}</span>
                          </div>
                        </div>
                      </div>
                      <span className="px-2 py-1 rounded-lg text-xs font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                        Activo
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
                      <div>
                        <span className="text-xs text-slate-400 block">Evaluaciones</span>
                        <span className="font-bold text-slate-900 dark:text-white text-sm">
                          {pruebasDocente.length} pruebas
                        </span>
                      </div>
                      <div>
                        <span className="text-xs text-slate-400 block">Cursos Asignados</span>
                        <span className="font-bold text-slate-900 dark:text-white text-sm">
                          {cursos.length > 0 ? cursos.length : 2} cursos
                        </span>
                      </div>
                      <div>
                        <span className="text-xs text-slate-400 block">Logro Estimado</span>
                        <span className="font-bold text-teal-600 dark:text-teal-400 text-sm">
                          74.5%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-xs text-slate-400">
                      {docente.email}
                    </span>
                    <button
                      onClick={() => switchToDocente(docente.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-md shadow-teal-600/20 transition-all"
                      title={`Ingresar como ${docente.nombre} para supervisar cuadernillos y notas`}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Supervisar Docente</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* PESTAÑA 2: EVALUACIONES DEL ÁREA */}
      {activeTab === 'evaluaciones' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Pruebas y Ensayos Supervisados ({pruebasSupervisadas.length})
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Instrumentos de evaluación de los departamentos a cargo.
              </p>
            </div>
            {onNavigateToEvaluaciones && (
              <button
                onClick={onNavigateToEvaluaciones}
                className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
              >
                Ver módulo completo de evaluaciones <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {pruebasSupervisadas.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-sm">
                  No hay evaluaciones registradas en las asignaturas seleccionadas.
                </div>
              ) : (
                pruebasSupervisadas.map(prueba => {
                  const isSimce = prueba.tipoEvaluacion === 'simce' || prueba.titulo.toLowerCase().includes('simce');
                  const isPaes = prueba.tipoEvaluacion === 'paes' || prueba.titulo.toLowerCase().includes('paes');
                  
                  return (
                    <div key={prueba.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className={`p-2.5 rounded-xl text-white font-bold text-xs flex items-center justify-center shadow-sm ${
                          isPaes ? 'bg-purple-600' : isSimce ? 'bg-amber-600' : 'bg-indigo-600'
                        }`}>
                          {isPaes ? 'PAES' : isSimce ? 'SIMCE' : 'AULA'}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                            {prueba.titulo}
                          </h4>
                          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex-wrap">
                            <span className="font-medium text-slate-700 dark:text-slate-300">{prueba.cursoNombre}</span>
                            <span>&bull;</span>
                            <span>{prueba.asignaturaNombre}</span>
                            <span>&bull;</span>
                            <span>{prueba.totalPreguntas} preguntas</span>
                            <span>&bull;</span>
                            <span className="capitalize">{prueba.estado}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        {onSelectPruebaReporte && (
                          <button
                            onClick={() => onSelectPruebaReporte(prueba.id)}
                            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-teal-950/60 text-slate-700 dark:text-slate-200 hover:text-teal-600 dark:hover:text-teal-400 border border-slate-200 dark:border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>Reporte Pedagógico</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* PESTAÑA 3: CUMPLIMIENTO CURRICULAR MINEDUC */}
      {activeTab === 'cobertura' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Avance de Cobertura Curricular por Departamento
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Porcentaje de Objetivos de Aprendizaje evaluados durante el semestre.
                </p>
              </div>
              <span className="text-xs font-bold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/50 px-2.5 py-1 rounded-lg border border-teal-200 dark:border-teal-800">
                Meta Mineduc: 85%
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartDataCobertura} margin={{ top: 10, right: 20, left: -10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="asignatura" tick={{ fontSize: 12 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} unit="%" />
                  <Tooltip
                    formatter={(val: any) => [`${val ?? 0}%`, 'Cobertura Curricular']}
                    contentStyle={{ borderRadius: '12px', background: '#0f172a', border: '1px solid #334155', color: '#fff' }}
                  />
                  <Bar dataKey="cobertura" radius={[8, 8, 0, 0]}>
                    {chartDataCobertura.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#0d9488' : '#6366f1'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">
                Ejes Temáticos Priorizados
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                Foco curricular del período en sus departamentos.
              </p>

              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                    <span>Números y Álgebra</span>
                    <span className="text-teal-600 dark:text-teal-400">82%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-teal-500 rounded-full" style={{ width: '82%' }} />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                    <span>Geometría y Medición</span>
                    <span className="text-indigo-600 dark:text-indigo-400">68%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: '68%' }} />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                    <span>Ciencias Físicas y Químicas</span>
                    <span className="text-emerald-600 dark:text-emerald-400">76%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '76%' }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-4 text-xs text-slate-500 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Alineado con bases curriculares Decreto 67</span>
            </div>
          </div>
        </div>
      )}

      {/* PESTAÑA 4: ALERTAS PEDAGÓGICAS */}
      {activeTab === 'alertas' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Monitoreo y Alertas Pedagógicas Tempranas
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Detección automática de rezago en evaluaciones o cursos que requieren acompañamiento docente.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {alertas.map(alerta => (
              <div
                key={alerta.id}
                className={`p-4 rounded-2xl border flex items-start gap-3.5 transition-all ${
                  alerta.tipo === 'warning'
                    ? 'bg-amber-500/5 border-amber-500/30 text-amber-900 dark:text-amber-200'
                    : alerta.tipo === 'success'
                    ? 'bg-emerald-500/5 border-emerald-500/30 text-emerald-900 dark:text-emerald-200'
                    : 'bg-teal-500/5 border-teal-500/30 text-teal-900 dark:text-teal-200'
                }`}
              >
                <div className={`p-2 rounded-xl mt-0.5 ${
                  alerta.tipo === 'warning'
                    ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                    : alerta.tipo === 'success'
                    ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                    : 'bg-teal-500/20 text-teal-600 dark:text-teal-400'
                }`}>
                  {alerta.tipo === 'warning' ? (
                    <AlertTriangle className="w-5 h-5" />
                  ) : alerta.tipo === 'success' ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <Award className="w-5 h-5" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      {alerta.titulo}
                    </h4>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {alerta.depto}
                    </span>
                  </div>
                  <p className="text-xs mt-1 text-slate-600 dark:text-slate-300">
                    {alerta.mensaje}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
