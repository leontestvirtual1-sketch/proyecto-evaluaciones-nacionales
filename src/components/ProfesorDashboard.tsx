import React, { useState } from 'react';
import { Prueba, ReporteTabuladoCurso, UserProfile } from '../types';
import { StatCard } from './StatCard';
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
  ArrowRight
} from 'lucide-react';

interface ProfesorDashboardProps {
  profesor: UserProfile;
  pruebas: Prueba[];
  reporteActivo: ReporteTabuladoCurso;
  onOpenGenerator: () => void;
  onSelectPruebaReporte: (pruebaId: string) => void;
  onNavigateToEvaluaciones?: () => void;
}

export const ProfesorDashboard: React.FC<ProfesorDashboardProps> = ({
  profesor,
  pruebas,
  reporteActivo,
  onOpenGenerator,
  onSelectPruebaReporte,
  onNavigateToEvaluaciones
}) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="glass-card p-6 sm:p-8 bg-gradient-to-r from-indigo-900/30 via-slate-900/80 to-slate-900/90 border-indigo-500/20 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <Sparkles className="w-3.5 h-3.5 mr-1 text-amber-400" />
              {profesor.rol === 'admin'
                ? '👑 Panel General UTP & Dirección'
                : `Ambiente Docente • ${profesor.asignaturaNombre || 'Especialidad'}`}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {profesor.rol === 'admin'
                ? `Bienvenido, ${profesor.nombre} (${profesor.cargo || 'Administrador'})`
                : `Bienvenido/a, ${profesor.nombre} ${profesor.apellido}`}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              {profesor.rol === 'admin'
                ? 'Supervisión integral de rendimiento SIMCE, bancos curriculares y gestión de departamentos en Sysget Saber.'
                : `Gestión pedagógica de evaluaciones y análisis de logro curricular para la asignatura de ${profesor.asignaturaNombre || 'su departamento'}.`}
            </p>

          </div>

          <button
            onClick={onOpenGenerator}
            className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-bold px-5 py-3 rounded-xl shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Generar Nueva Evaluación</span>
          </button>
        </div>
      </div>

      {/* KPI Stat Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Logro Promedio Global"
          value={`${reporteActivo.promedioPorcentajeLogro}%`}
          subtitle="Curso 8° Básico A"
          icon={<Award className="w-5 h-5" />}
          trend={{ text: 'Alerta en Geometría', type: 'warning' }}
          iconBgColor="bg-amber-500/10 text-amber-600 dark:text-amber-400"
        />

        <StatCard
          title="Escala Nacional Promedio"
          value={`${reporteActivo.promedioEscalaNacional} pts`}
          subtitle="Rango 100 - 350 pts"
          icon={<BarChart2 className="w-5 h-5" />}
          trend={{ text: '+15 pts vs anterior', type: 'positive' }}
          iconBgColor="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
        />

        <StatCard
          title="Evaluaciones Activas"
          value={pruebas.length}
          subtitle="Ensayos creados"
          icon={<BookOpen className="w-5 h-5" />}
          iconBgColor="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
        />

        <StatCard
          title="Alumnos Rendidos"
          value={`${reporteActivo.totalAlumnosRendidos} / ${reporteActivo.totalAlumnosMatriculados}`}
          subtitle="Avance de entrega 14%"
          icon={<Users className="w-5 h-5" />}
          iconBgColor="bg-sky-500/10 text-sky-600 dark:text-sky-400"
        />
      </div>

      {/* Plan de Reforzamiento Highlight Callout */}
      <div className="glass-card p-6 border-l-4 border-l-amber-500 bg-amber-500/5 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500 text-white rounded-xl shadow-md">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Plan de Acción de Reforzamiento Autogenerado Disponible
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Se detectaron nudos de aprendizaje en <strong>Geometría (Pitágoras)</strong> y <strong>Álgebra</strong> en el curso 8° Básico A.
              </p>
            </div>
          </div>

          <button
            onClick={() => onSelectPruebaReporte('prueba-101')}
            className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm transition-all whitespace-nowrap"
          >
            <span>Ver Plan Detallado</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Evaluaciones List Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-500" />
            Evaluaciones Recientes
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
              <div className="pt-2">
                <button
                  onClick={() => onSelectPruebaReporte(prueba.id)}
                  className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-bold py-2.5 rounded-xl transition-all"
                >
                  <BarChart2 className="w-4 h-4 text-indigo-400" />
                  <span>Ver Reporte Tabulado y Reforzamiento</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
