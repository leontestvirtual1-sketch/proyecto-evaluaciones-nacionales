import React from 'react';
import { Activity, ArrowRight, BarChart3, BookOpen, CalendarDays, CheckCircle2, CircleAlert, ClipboardList, FileText, GraduationCap, Users } from 'lucide-react';
import { Curso, Prueba, ReporteTabuladoCurso, UserProfile } from '../types';

type PortalPageProps = {
  user: UserProfile;
  pruebas: Prueba[];
  cursos: Curso[];
  reporte: ReporteTabuladoCurso;
  onNavigate: (page: 'evaluaciones' | 'monitoreo' | 'resultados') => void;
  onOpenReport: (pruebaId: string) => void;
  onCreateEvaluation?: () => void;
};

const Card: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className = '' }) => (
  <section className={`rounded-2xl border border-slate-200 bg-white shadow-sm ${className}`}>{children}</section>
);

const Status: React.FC<{ estado: Prueba['estado'] }> = ({ estado }) => {
  const config = {
    activa: { label: 'Activa', style: 'bg-emerald-50 text-emerald-700', icon: <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" /> },
    borrador: { label: 'Borrador', style: 'bg-amber-50 text-amber-700', icon: null },
    finalizada: { label: 'Finalizada', style: 'bg-slate-100 text-slate-600', icon: null },
  }[estado];
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${config.style}`}>{config.icon}{config.label}</span>;
};

export const StitchPortalDashboard: React.FC<PortalPageProps> = ({ user, pruebas, cursos, reporte, onNavigate, onOpenReport, onCreateEvaluation }) => {
  const activas = pruebas.filter(prueba => prueba.estado === 'activa').length;
  const estudiantesRendidos = reporte.totalAlumnosRendidos;
  const participacion = reporte.totalAlumnosMatriculados > 0
    ? Math.round((estudiantesRendidos / reporte.totalAlumnosMatriculados) * 100)
    : null;
  const recent = [...pruebas].sort((a, b) => b.creadoEn.localeCompare(a.creadoEn)).slice(0, 5);
  const formatDate = (value: string) => {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? 'Sin fecha' : new Intl.DateTimeFormat('es-CL', { day: '2-digit', month: 'short', year: 'numeric' }).format(date);
  };

  const stats = [
    { label: 'Evaluaciones registradas', value: pruebas.length, note: 'En tu espacio de trabajo', icon: <ClipboardList className="h-5 w-5" />, tone: 'indigo' },
    { label: 'Evaluaciones activas', value: activas, note: 'Disponibles para rendir', icon: <Activity className="h-5 w-5" />, tone: 'emerald' },
    { label: 'Cursos disponibles', value: cursos.length || '—', note: cursos.length ? 'En tu espacio de trabajo' : 'Sin datos cargados', icon: <GraduationCap className="h-5 w-5" />, tone: 'sky' },
    { label: 'Participación del reporte', value: participacion === null ? '—' : `${participacion}%`, note: participacion === null ? 'Sin matrícula para calcular' : `${estudiantesRendidos} de ${reporte.totalAlumnosMatriculados} estudiantes`, icon: <Users className="h-5 w-5" />, tone: 'violet' },
  ];
  const tone = { indigo: 'bg-indigo-50 text-indigo-600', emerald: 'bg-emerald-50 text-emerald-600', sky: 'bg-sky-50 text-sky-600', violet: 'bg-violet-50 text-violet-600' };

  return (
    <div className="space-y-6 pb-8 text-slate-800">
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-indigo-600">Panel principal · {user.establecimiento}</p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">Hola, {user.nombre}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">Resumen de evaluaciones y resultados disponibles en tu espacio de trabajo.</p>
        </div>
        <button onClick={onCreateEvaluation} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200">
          <span className="text-lg leading-none">+</span> Nueva evaluación
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(stat => <Card key={stat.label} className="p-5">
          <div className="flex items-center justify-between"><p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">{stat.label}</p><span className={`rounded-xl p-2.5 ${tone[stat.tone as keyof typeof tone]}`}>{stat.icon}</span></div>
          <p className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900">{stat.value}</p>
          <p className="mt-1 text-xs text-slate-500">{stat.note}</p>
        </Card>)}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="overflow-hidden xl:col-span-2">
          <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div><p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">Seguimiento</p><h2 className="mt-1 text-base font-bold text-slate-900">Evaluaciones recientes</h2></div>
            <button onClick={() => onNavigate('evaluaciones')} className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800">Ver todas <ArrowRight className="h-3.5 w-3.5" /></button>
          </div>
          {recent.length ? <div className="overflow-x-auto"><table className="w-full min-w-[620px] text-left text-sm"><thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wide text-slate-500"><tr><th className="px-5 py-3">Evaluación</th><th className="px-3 py-3">Estado</th><th className="px-3 py-3">Creada</th><th className="px-5 py-3 text-right">Acción</th></tr></thead><tbody className="divide-y divide-slate-100">{recent.map(prueba => <tr key={prueba.id} className="hover:bg-slate-50/80"><td className="px-5 py-4"><p className="font-bold text-slate-800">{prueba.titulo}</p><p className="mt-1 text-xs text-slate-500">{prueba.asignaturaNombre} · {prueba.nivel}</p></td><td className="px-3 py-4"><Status estado={prueba.estado} /></td><td className="px-3 py-4 text-xs text-slate-500">{formatDate(prueba.creadoEn)}</td><td className="px-5 py-4 text-right"><button onClick={() => onOpenReport(prueba.id)} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:border-indigo-200 hover:text-indigo-700">Ver resultados</button></td></tr>)}</tbody></table></div> : <div className="p-10 text-center"><BookOpen className="mx-auto h-8 w-8 text-slate-300"/><p className="mt-3 font-semibold text-slate-700">Todavía no hay evaluaciones</p><p className="mt-1 text-xs text-slate-500">Crea una evaluación para iniciar el seguimiento.</p></div>}
        </Card>

        <div className="space-y-4">
          <Card className="p-5">
            <div className="flex items-center justify-between"><h2 className="text-sm font-bold text-slate-900">Accesos rápidos</h2><CalendarDays className="h-4 w-4 text-slate-400" /></div>
            <div className="mt-3 space-y-2">
              <button onClick={() => onNavigate('evaluaciones')} className="flex w-full items-center gap-3 rounded-xl bg-slate-50 p-3 text-left hover:bg-indigo-50"><span className="rounded-lg bg-indigo-100 p-2 text-indigo-700"><BookOpen className="h-4 w-4" /></span><span className="flex-1"><span className="block text-xs font-bold text-slate-800">Catálogo de evaluaciones</span><span className="block text-[11px] text-slate-500">Gestiona, filtra y programa pruebas</span></span><ArrowRight className="h-4 w-4 text-slate-400" /></button>
              <button onClick={() => onNavigate('monitoreo')} className="flex w-full items-center gap-3 rounded-xl bg-slate-50 p-3 text-left hover:bg-indigo-50"><span className="rounded-lg bg-emerald-100 p-2 text-emerald-700"><Activity className="h-4 w-4" /></span><span className="flex-1"><span className="block text-xs font-bold text-slate-800">Monitoreo de evaluaciones</span><span className="block text-[11px] text-slate-500">Consulta su estado actual</span></span><ArrowRight className="h-4 w-4 text-slate-400" /></button>
              <button onClick={() => onNavigate('resultados')} className="flex w-full items-center gap-3 rounded-xl bg-slate-50 p-3 text-left hover:bg-indigo-50"><span className="rounded-lg bg-violet-100 p-2 text-violet-700"><BarChart3 className="h-4 w-4" /></span><span className="flex-1"><span className="block text-xs font-bold text-slate-800">Resultados y métricas</span><span className="block text-[11px] text-slate-500">Revisa reportes disponibles</span></span><ArrowRight className="h-4 w-4 text-slate-400" /></button>
            </div>
          </Card>
          <Card className="p-5">
            <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600"/><h2 className="text-sm font-bold text-slate-900">Estado del reporte</h2></div>
            <p className="mt-3 text-xs font-semibold text-slate-700">{reporte.pruebaTitulo}</p>
            {reporte.totalAlumnosRendidos ? <p className="mt-1 text-xs text-slate-500">{reporte.totalAlumnosRendidos} rendiciones disponibles para revisar.</p> : <p className="mt-1 flex gap-1.5 text-xs text-slate-500"><CircleAlert className="h-3.5 w-3.5 shrink-0 text-amber-500"/>Aún no hay rendiciones asociadas al reporte.</p>}
            <button onClick={() => onNavigate('resultados')} className="mt-3 text-xs font-bold text-indigo-600 hover:text-indigo-800">Abrir resultados <ArrowRight className="ml-1 inline h-3.5 w-3.5"/></button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export const StitchMonitoringPage: React.FC<Pick<PortalPageProps, 'pruebas' | 'onOpenReport' | 'onNavigate'>> = ({ pruebas, onOpenReport, onNavigate }) => {
  const activas = pruebas.filter(p => p.estado === 'activa');
  const otras = pruebas.filter(p => p.estado !== 'activa');
  return <div className="space-y-6 text-slate-800">
    <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><p className="text-[11px] font-bold uppercase tracking-[0.14em] text-indigo-600">Operación · Estado actual</p><h1 className="mt-1 text-2xl font-extrabold text-slate-900">Monitoreo de evaluaciones</h1><p className="mt-2 text-sm text-slate-500">Estado de las evaluaciones registradas. La plataforma no recibe telemetría de centros ni conexiones en vivo.</p></header>
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3"><Card className="p-5"><p className="text-xs font-bold uppercase text-slate-500">Evaluaciones activas</p><p className="mt-2 text-3xl font-extrabold">{activas.length}</p></Card><Card className="p-5"><p className="text-xs font-bold uppercase text-slate-500">En borrador</p><p className="mt-2 text-3xl font-extrabold">{otras.filter(p => p.estado === 'borrador').length}</p></Card><Card className="p-5"><p className="text-xs font-bold uppercase text-slate-500">Finalizadas</p><p className="mt-2 text-3xl font-extrabold">{otras.filter(p => p.estado === 'finalizada').length}</p></Card></div>
    <Card className="overflow-hidden"><div className="border-b border-slate-100 p-5"><h2 className="font-bold text-slate-900">Evaluaciones en curso y próximas</h2><p className="mt-1 text-xs text-slate-500">El estado refleja la configuración actual de cada evaluación.</p></div>{pruebas.length ? <div className="overflow-x-auto"><table className="w-full min-w-[680px] text-left text-sm"><thead className="bg-slate-50 text-[10px] font-bold uppercase text-slate-500"><tr><th className="px-5 py-3">Instrumento / nivel</th><th className="px-3 py-3">Estado</th><th className="px-3 py-3">Curso</th><th className="px-3 py-3">Preguntas</th><th className="px-5 py-3 text-right">Acción</th></tr></thead><tbody className="divide-y divide-slate-100">{pruebas.map(p => <tr key={p.id}><td className="px-5 py-4"><p className="font-bold">{p.titulo}</p><p className="mt-1 text-xs text-slate-500">{p.asignaturaNombre} · {p.nivel}</p></td><td className="px-3 py-4"><Status estado={p.estado}/></td><td className="px-3 py-4 text-xs text-slate-600">{p.cursoNombre}</td><td className="px-3 py-4 text-xs text-slate-600">{p.totalPreguntas}</td><td className="px-5 py-4 text-right"><button onClick={() => onOpenReport(p.id)} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold hover:text-indigo-700">Ver reporte</button></td></tr>)}</tbody></table></div> : <div className="p-10 text-center text-sm text-slate-500">No hay evaluaciones para monitorear. <button onClick={() => onNavigate('evaluaciones')} className="font-bold text-indigo-600">Ir al catálogo</button></div>}</Card>
  </div>;
};

export const StitchResultsPage: React.FC<Pick<PortalPageProps, 'pruebas' | 'reporte' | 'onOpenReport' | 'onNavigate'>> = ({ pruebas, reporte, onOpenReport, onNavigate }) => {
  const coverage = reporte.totalAlumnosMatriculados ? Math.round((reporte.totalAlumnosRendidos / reporte.totalAlumnosMatriculados) * 100) : null;
  return <div className="space-y-6 text-slate-800">
    <header className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between"><div><p className="text-[11px] font-bold uppercase tracking-[0.14em] text-indigo-600">Reportes · Datos del espacio actual</p><h1 className="mt-1 text-2xl font-extrabold text-slate-900">Resultados y métricas</h1><p className="mt-2 text-sm text-slate-500">Consulta los resultados tabulados disponibles para tus evaluaciones.</p></div><button onClick={() => onOpenReport(reporte.pruebaId)} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-indigo-700"><FileText className="h-4 w-4"/> Abrir reporte principal</button></header>
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"><Card className="p-5"><p className="text-[11px] font-bold uppercase text-slate-500">Puntaje escala nacional</p><p className="mt-2 text-3xl font-extrabold">{reporte.totalAlumnosRendidos ? `${reporte.promedioEscalaNacional} pts` : '—'}</p><p className="mt-1 text-xs text-slate-500">{reporte.totalAlumnosRendidos ? 'Promedio del reporte seleccionado' : 'Sin rendiciones'}</p></Card><Card className="p-5"><p className="text-[11px] font-bold uppercase text-slate-500">Logro promedio</p><p className="mt-2 text-3xl font-extrabold">{reporte.totalAlumnosRendidos ? `${reporte.promedioPorcentajeLogro}%` : '—'}</p><p className="mt-1 text-xs text-slate-500">Del reporte seleccionado</p></Card><Card className="p-5"><p className="text-[11px] font-bold uppercase text-slate-500">Rendiciones</p><p className="mt-2 text-3xl font-extrabold">{reporte.totalAlumnosRendidos}</p><p className="mt-1 text-xs text-slate-500">De {reporte.totalAlumnosMatriculados} estudiantes matriculados</p></Card><Card className="p-5"><p className="text-[11px] font-bold uppercase text-slate-500">Cobertura del reporte</p><p className="mt-2 text-3xl font-extrabold">{coverage === null ? '—' : `${coverage}%`}</p><p className="mt-1 text-xs text-slate-500">Calculada con las rendiciones registradas</p></Card></div>
    <Card className="overflow-hidden"><div className="border-b border-slate-100 p-5"><h2 className="font-bold text-slate-900">Reportes por evaluación</h2><p className="mt-1 text-xs text-slate-500">Selecciona una evaluación para revisar sus resultados y plan de reforzamiento.</p></div>{pruebas.length ? <div className="divide-y divide-slate-100">{pruebas.map(p => <div key={p.id} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm font-bold text-slate-800">{p.titulo}</p><p className="mt-1 text-xs text-slate-500">{p.asignaturaNombre} · {p.nivel} · {p.cursoNombre}</p></div><button onClick={() => onOpenReport(p.id)} className="min-h-10 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:border-indigo-200 hover:text-indigo-700">Abrir resultados <ArrowRight className="ml-1 inline h-3.5 w-3.5"/></button></div>)}</div> : <div className="p-10 text-center text-sm text-slate-500">No hay evaluaciones con reportes en este espacio. <button onClick={() => onNavigate('evaluaciones')} className="font-bold text-indigo-600">Ver evaluaciones</button></div>}</Card>
  </div>;
};
