import React, { useState, useMemo } from 'react';
import { Prueba, UserProfile } from '../types';
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Layers,
  FileText,
  School,
  Building2,
  Calendar,
  ChevronRight,
  Eye,
  Award
} from 'lucide-react';
import { StatCard } from './StatCard';
import { useAcademicData } from '../context/AcademicDataContext';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  LineChart,
  Line
} from 'recharts';

interface DirectorDashboardProps {
  director: UserProfile;
  pruebas: Prueba[];
  onNavigateToEvaluaciones?: () => void;
  onSelectPruebaReporte?: (pruebaId: string) => void;
}

export const DirectorDashboard: React.FC<DirectorDashboardProps> = ({
  director,
  pruebas,
  onNavigateToEvaluaciones,
  onSelectPruebaReporte
}) => {
  const { cursos } = useAcademicData();
  const [activeTab, setActiveTab] = useState<'resumen' | 'aula' | 'simce' | 'paes'>('resumen');

  // Clasificación de evaluaciones en los 3 pilares requeridos
  const { evaluacionesAula, ensayosSimce, ensayosPaes } = useMemo(() => {
    const aula: Prueba[] = [];
    const simce: Prueba[] = [];
    const paes: Prueba[] = [];

    pruebas.forEach(p => {
      const tipo = p.tipoEvaluacion;
      const titleLower = (p.titulo || '').toLowerCase();
      const codeLower = (p.codigoPublico || '').toLowerCase();

      if (tipo === 'paes' || titleLower.includes('paes') || codeLower.includes('paes')) {
        paes.push(p);
      } else if (tipo === 'simce' || titleLower.includes('simce') || codeLower.includes('simce')) {
        simce.push(p);
      } else {
        aula.push(p);
      }
    });

    return { evaluacionesAula: aula, ensayosSimce: simce, ensayosPaes: paes };
  }, [pruebas]);

  // Métricas para los gráficos de avance curricular institucional
  const coberturaPorNivel = [
    { nivel: '4° Básico', cobertura: 88, meta: 85, color: '#3b82f6' },
    { nivel: '6° Básico', cobertura: 79, meta: 80, color: '#10b981' },
    { nivel: '8° Básico', cobertura: 84, meta: 80, color: '#6366f1' },
    { nivel: '2° Medio', cobertura: 92, meta: 90, color: '#ec4899' },
    { nivel: '4° Medio', cobertura: 86, meta: 85, color: '#8b5cf6' }
  ];

  const tendenciaEnsayos = [
    { periodo: 'Abril', simce: 248, paes: 520 },
    { periodo: 'Mayo', simce: 255, paes: 545 },
    { periodo: 'Junio', simce: 262, paes: 560 },
    { periodo: 'Julio', simce: 268, paes: 580 },
    { periodo: 'Agosto', simce: 276, paes: 612 }
  ];

  return (
    <div className="space-y-8 animate-fade-in text-left">
      {/* ── Banner Institucional de Dirección ──────────────────────────────── */}
      <div className="glass-card p-6 sm:p-8 bg-gradient-to-r from-blue-950/80 via-slate-900/90 to-indigo-950/80 border-blue-500/30 relative overflow-hidden shadow-2xl rounded-3xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                <School className="w-3.5 h-3.5 mr-1.5 text-blue-400" />
                Cuadro de Mando de Dirección • {director.establecimiento}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-2 h-2 rounded-full bg-emerald-400 mr-1.5 animate-pulse" />
                RBD: {director.rbd || '31030'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Bienvenido, {director.nombre} {director.apellido}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Monitoreo ejecutivo integral: seguimiento al cumplimiento de la malla curricular, avance de evaluaciones docentes de aula y resultados de ensayos estandarizados SIMCE y PAES.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigateToEvaluaciones && onNavigateToEvaluaciones()}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold px-4 py-2.5 rounded-2xl shadow-xl shadow-blue-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] border border-blue-400/30 text-xs"
            >
              <BookOpen className="w-4 h-4 text-blue-200" />
              <span>Ver Catálogo Completo</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── KPIs Ejecutivos Principales ───────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<School className="w-5 h-5 text-blue-400" />}
          title="Establecimiento"
          value="1 Colegio"
          subtitle={director.establecimiento}
          trend={{ text: 'RBD ' + (director.rbd || '31030'), type: 'positive' }}
        />
        <StatCard
          icon={<FileText className="w-5 h-5 text-emerald-400" />}
          title="Evaluaciones de Aula"
          value={`${evaluacionesAula.length} Activas`}
          subtitle="Formativa y sumativa docente"
          trend={{ text: '+4 este mes', type: 'positive' }}
        />
        <StatCard
          icon={<Award className="w-5 h-5 text-amber-400" />}
          title="Ensayos SIMCE"
          value={`${ensayosSimce.length} Oficiales`}
          subtitle="Línea base y seguimiento nacional"
          trend={{ text: 'Prom. 276 pts', type: 'positive' }}
        />
        <StatCard
          icon={<GraduationCap className="w-5 h-5 text-purple-400" />}
          title="Ensayos PAES"
          value={`${ensayosPaes.length} Ensayos`}
          subtitle="Proyección Admisión Universitaria"
          trend={{ text: 'Meta: 650 pts', type: 'positive' }}
        />
      </div>

      {/* ── Barra de Navegación por Tipo de Evaluación ────────────────────── */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-md overflow-x-auto">
        <button
          onClick={() => setActiveTab('resumen')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'resumen'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Visión Ejecutiva Integral</span>
        </button>

        <button
          onClick={() => setActiveTab('aula')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'aula'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Evaluaciones Docentes ({evaluacionesAula.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('simce')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'simce'
              ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Ensayos SIMCE ({ensayosSimce.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('paes')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'paes'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Ensayos PAES ({ensayosPaes.length})</span>
        </button>
      </div>

      {/* ── CONTENIDO: Visión Ejecutiva Integral ──────────────────────────── */}
      {activeTab === 'resumen' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico 1: Cumplimiento de Malla Curricular por Nivel */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-blue-400" />
                    Cumplimiento de Malla Curricular MINEDUC
                  </h3>
                  <p className="text-[11px] text-slate-400">Porcentaje de avance por nivel respecto a la meta institucional</p>
                </div>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/20">
                  85.8% Promedio
                </span>
              </div>

              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={coberturaPorNivel} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                    <XAxis dataKey="nivel" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 100]} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                      formatter={(val: any) => [`${val}%`, 'Avance Curricular']}
                    />
                    <Bar dataKey="cobertura" radius={[8, 8, 0, 0]}>
                      {coberturaPorNivel.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Gráfico 2: Evolución de Puntajes SIMCE y PAES */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-400" />
                    Progresión Histórica de Ensayos Estandarizados
                  </h3>
                  <p className="text-[11px] text-slate-400">Puntaje SIMCE (escala 200-350) y PAES (escala 100-1000)</p>
                </div>
                <div className="flex items-center gap-3 text-[11px]">
                  <span className="flex items-center gap-1 text-amber-400 font-bold">
                    <span className="w-2 h-2 rounded-full bg-amber-400" /> SIMCE
                  </span>
                  <span className="flex items-center gap-1 text-purple-400 font-bold">
                    <span className="w-2 h-2 rounded-full bg-purple-400" /> PAES (M1)
                  </span>
                </div>
              </div>

              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={tendenciaEnsayos} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                    <XAxis dataKey="periodo" stroke="#94a3b8" fontSize={11} />
                    <YAxis yAxisId="left" stroke="#f59e0b" fontSize={11} domain={[230, 300]} />
                    <YAxis yAxisId="right" orientation="right" stroke="#a855f7" fontSize={11} domain={[480, 680]} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                    <Line yAxisId="left" type="monotone" dataKey="simce" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4 }} />
                    <Line yAxisId="right" type="monotone" dataKey="paes" stroke="#a855f7" strokeWidth={3} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Cuadro de Alertas Pedagógicas e Intervención */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                Semáforo Institucional de Prioridad Pedagógica
              </h3>
              <span className="text-[11px] text-slate-400 font-medium">Actualizado al último corte evaluativo</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400">Atención: 6° Básico</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">Medio</span>
                </div>
                <p className="text-xs text-slate-300">Eje de Geometría y Mediciones presenta un 58% de logro. Se sugiere plan remedial con fichas descargables.</p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400">Destacado: 2° Medio</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">Óptimo</span>
                </div>
                <p className="text-xs text-slate-300">Comprensión Lectora SIMCE alcanzó 276 puntos promedio (+28 pts sobre la media nacional).</p>
              </div>

              <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-400">Foco PAES: 4° Medio</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300">Plan Intensivo</span>
                </div>
                <p className="text-xs text-slate-300">El 78% de los alumnos rindió el ensayo modelo M1. Programado refuerzo en Habilidad de Modelación.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── CONTENIDO: Pestaña Evaluaciones de Aula ────────────────────────── */}
      {activeTab === 'aula' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-400" />
                Evaluaciones Regulares y Formativas de Aula
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Instrumentos diseñados por el cuerpo docente para seguimiento curricular por curso.
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
              {evaluacionesAula.length} Evaluaciones Disponibles
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {evaluacionesAula.map(p => (
              <div key={p.id} className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition-all space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <span className="font-mono text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      {p.codigoPublico || 'EVAL-AULA'}
                    </span>
                    <h4 className="text-sm font-bold text-white">{p.titulo}</h4>
                    <p className="text-xs text-slate-400 line-clamp-2">{p.descripcion}</p>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-400 shrink-0 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800">
                    {p.cursoNombre || p.nivel}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span>{p.totalPreguntas} preguntas • {p.duracionMinutos} min</span>
                  {onSelectPruebaReporte && (
                    <button
                      onClick={() => onSelectPruebaReporte(p.id)}
                      className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Ver Resultados</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── CONTENIDO: Pestaña Ensayos SIMCE ────────────────────────────────── */}
      {activeTab === 'simce' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                Batería de Ensayos Estandarizados SIMCE
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Monitoreo continuo de estándares de aprendizaje y comparación con la Agencia de Calidad.
              </p>
            </div>
            <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20">
              {ensayosSimce.length} Ensayos Oficiales
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ensayosSimce.map(p => (
              <div key={p.id} className="p-5 rounded-2xl bg-slate-950/60 border border-amber-500/20 hover:border-amber-500/40 transition-all space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <span className="font-mono text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      {p.codigoPublico || 'SIMCE-OFICIAL'}
                    </span>
                    <h4 className="text-sm font-bold text-white">{p.titulo}</h4>
                    <p className="text-xs text-slate-400 line-clamp-2">{p.descripcion}</p>
                  </div>
                  <span className="text-[11px] font-semibold text-amber-300 shrink-0 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                    {p.cursoNombre || p.nivel}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span>{p.totalPreguntas} preguntas • Clavijero Oficial</span>
                  {onSelectPruebaReporte && (
                    <button
                      onClick={() => onSelectPruebaReporte(p.id)}
                      className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Ver Análisis SIMCE</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── CONTENIDO: Pestaña Ensayos PAES ─────────────────────────────────── */}
      {activeTab === 'paes' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-purple-400" />
                Programa de Ensayos PAES (Acceso a la Educación Superior)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Simulaciones oficiales DEMRE en Competencia Lectora, Matemática M1/M2, Ciencias e Historia.
              </p>
            </div>
            <span className="text-xs font-bold text-purple-400 bg-purple-500/10 px-3 py-1.5 rounded-xl border border-purple-500/20">
              {ensayosPaes.length} Instrumentos DEMRE
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ensayosPaes.map(p => (
              <div key={p.id} className="p-5 rounded-2xl bg-slate-950/60 border border-purple-500/20 hover:border-purple-500/40 transition-all space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <span className="font-mono text-[10px] font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                      {p.codigoPublico || 'PAES-DEMRE'}
                    </span>
                    <h4 className="text-sm font-bold text-white">{p.titulo}</h4>
                    <p className="text-xs text-slate-400 line-clamp-2">{p.descripcion}</p>
                  </div>
                  <span className="text-[11px] font-semibold text-purple-300 shrink-0 bg-purple-500/10 px-2.5 py-1 rounded-lg border border-purple-500/20">
                    {p.cursoNombre || p.nivel}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span>{p.totalPreguntas} preguntas • Escala DEMRE 100-1000</span>
                  {onSelectPruebaReporte && (
                    <button
                      onClick={() => onSelectPruebaReporte(p.id)}
                      className="text-purple-400 hover:text-purple-300 font-bold flex items-center gap-1 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Ver Resultados PAES</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
