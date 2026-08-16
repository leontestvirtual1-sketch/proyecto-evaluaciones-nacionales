import React, { useState } from 'react';
import { ReporteTabuladoCurso, ItemPlanReforzamiento } from '../types';
import {
  BarChart3,
  Users,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  Brain,
  BookOpen,
  ArrowLeft,
  Search,
  Sparkles,
  HelpCircle,
  AlertCircle,
  Printer
} from 'lucide-react';


interface ReporteTabuladoViewProps {
  reporte: ReporteTabuladoCurso;
  onBack: () => void;
}

export const ReporteTabuladoView: React.FC<ReporteTabuladoViewProps> = ({
  reporte,
  onBack
}) => {
  const [activeTab, setActiveTab] = useState<'resumen' | 'alumnos' | 'ejes' | 'plan'>('plan');
  const [searchTerm, setSearchTerm] = useState('');

  const rendicionesFiltradas = reporte.rendiciones.filter(r =>
    r.alumnoNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.alumnoRut.includes(searchTerm)
  );

  return (
    <div className="printable-paper-canvas space-y-6 animate-fade-in print:p-4 print:bg-white print:text-black">
      {/* Top Banner & Header */}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card p-6 border-l-4 border-l-indigo-600">
        <div>
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline mb-2"
          >
            <ArrowLeft className="w-4 h-4" /> Volver a Evaluaciones
          </button>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {reporte.pruebaTitulo}
          </h2>
          <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
              Curso: {reporte.cursoNombre}
            </span>
            <span>Rendidos: <strong>{reporte.totalAlumnosRendidos}</strong> de {reporte.totalAlumnosMatriculados} alumnos</span>
          </div>
        </div>

        {/* Global Score Badges and Print Button */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl text-center">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Escala Nacional (100-350)
            </span>
            <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
              {reporte.promedioEscalaNacional} pts
            </span>
          </div>
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-center">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              % Logro Promedio
            </span>
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {reporte.promedioPorcentajeLogro}%
            </span>
          </div>
          <button
            onClick={() => {
              const originalTitle = document.title;
              document.title = `Reporte Tabulado Curricular - ${reporte.pruebaTitulo} (${reporte.cursoNombre})`;
              window.print();
              setTimeout(() => { document.title = originalTitle; }, 1000);
            }}
            className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95 print:hidden"
            title="Imprimir informe oficial o guardar en PDF"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir Reporte PDF</span>
          </button>
        </div>
      </div>


      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto gap-2">
        <button
          onClick={() => setActiveTab('plan')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
            activeTab === 'plan'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-indigo-500/5'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Plan de Acción de Reforzamiento</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-500/10 text-amber-600 font-extrabold border border-amber-500/20">
            Inteligente
          </span>
        </button>

        <button
          onClick={() => setActiveTab('resumen')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
            activeTab === 'resumen'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-indigo-500/5'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Ejes y Preguntas Críticas</span>
        </button>

        <button
          onClick={() => setActiveTab('alumnos')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
            activeTab === 'alumnos'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-indigo-500/5'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Resultados Tabulados Alumnos</span>
        </button>
      </div>

      {/* TAB 1: Plan de Acción de Reforzamiento */}
      {activeTab === 'plan' && (
        <div className="space-y-6 animate-fade-in">
          <div className="p-4 bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-transparent rounded-2xl border border-amber-500/20 flex items-start gap-3">
            <div className="p-2 bg-amber-500 text-white rounded-xl shadow-md">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Diagnóstico Pedagógico y Plan de Acción de Nivelación
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                Generado automáticamente tras tabular las 4 entregas del curso {reporte.cursoNombre}. Identifica los nudos de aprendizaje y propone estrategias directas para la próxima sesión.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {reporte.planAccionReforzamiento.map((item: ItemPlanReforzamiento) => (
              <div
                key={item.id}
                className="glass-card p-6 border-l-4 border-l-rose-500 hover:shadow-lg transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-3">
                  <div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/10 text-rose-600 border border-rose-500/20 mb-1">
                      <AlertTriangle className="w-3 h-3 mr-1" /> Nivel Alerta Crítica: {item.eje}
                    </span>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">
                      {item.titulo}
                    </h4>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    Habilidad afectada: <strong className="text-slate-700 dark:text-slate-200">{item.habilidad}</strong>
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Diagnostico */}
                  <div className="p-4 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200/80 dark:border-slate-800/80 space-y-1.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 text-rose-500" /> Diagnóstico del error recurrente
                    </span>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                      {item.diagnostico}
                    </p>
                  </div>

                  {/* Sugerencia pedagógica */}
                  <div className="p-4 bg-indigo-500/5 dark:bg-indigo-950/40 rounded-xl border border-indigo-500/20 space-y-1.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4" /> Sugerencia Pedagógica Docente
                    </span>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                      {item.sugerenciaPedagogica}
                    </p>
                  </div>
                </div>

                {/* Ejercicios recomendados */}
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Materiales y Recursos Sugeridos para la Clase
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {item.ejerciciosRecomendados.map((rec, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2 shadow-sm"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                        <span className="truncate">{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Desglose por Ejes & Preguntas */}
      {activeTab === 'resumen' && (
        <div className="space-y-6 animate-fade-in">
          {/* Ejes Temáticos Bar Chart Visualization */}
          <div className="glass-card p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-500" />
              Porcentaje de Logro por Eje Temático
            </h3>

            <div className="space-y-4">
              {reporte.desgloseEjes.map(eje => {
                let colorClass = 'bg-emerald-500';
                if (eje.estado === 'alerta') colorClass = 'bg-amber-500';
                if (eje.estado === 'critico') colorClass = 'bg-rose-500';

                return (
                  <div key={eje.ejeId} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-800 dark:text-slate-200">
                        {eje.nombre} ({eje.codigo})
                      </span>
                      <span className="font-extrabold text-slate-900 dark:text-white">
                        {eje.porcentajeLogro}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${colorClass} transition-all duration-500 rounded-full`}
                        style={{ width: `${eje.porcentajeLogro}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Preguntas Más Falladas */}
          <div className="glass-card p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-rose-500" />
              Preguntas con Mayor Tasa de Error (Índice de Dificultad Psicométrica)
            </h3>

            <div className="space-y-3">
              {reporte.preguntasMasFalladas.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2"
                >
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-900 dark:text-white">
                      Pregunta N° {idx + 1}: {item.pregunta?.enunciado || 'Pregunta de evaluación'}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-600 border border-rose-500/20 font-extrabold">
                      {item.porcentajeError}% Falló
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    <strong className="text-amber-600 dark:text-amber-400">Distractor más marcado:</strong> {item.alternativaMasVotada}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Resultados Tabulados por Alumno */}
      {activeTab === 'alumnos' && (
        <div className="glass-card p-6 space-y-4 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-500" />
              Matriz Tabulada por Estudiante
            </h3>

            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar alumno por nombre o RUT..."
                className="w-full sm:w-64 pl-9 pr-3.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
                  <th className="py-3 px-4">Estudiante</th>
                  <th className="py-3 px-4">RUT</th>
                  <th className="py-3 px-4">Puntaje Obtenido</th>
                  <th className="py-3 px-4">% Logro</th>
                  <th className="py-3 px-4">Escala Nacional</th>
                  <th className="py-3 px-4">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {rendicionesFiltradas.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                      {r.alumnoNombre}
                    </td>
                    <td className="py-3 px-4 text-slate-500">{r.alumnoRut}</td>
                    <td className="py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">
                      {r.puntajeObtenido} / {r.puntajeMaximo} pts
                    </td>
                    <td className="py-3 px-4">
                      <span className={`font-extrabold ${r.porcentajeLogro >= 60 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {r.porcentajeLogro}%
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-indigo-600 dark:text-indigo-400">
                      {r.puntajeEscalaNacional} pts
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                        Enviada
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
