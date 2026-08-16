import React, { useState } from 'react';
import {
  GraduationCap,
  BookOpen,
  Award,
  Users,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  TrendingUp,
  Brain,
  FileCheck2,
  ChevronRight,
  Eye,
  Sparkles,
  BarChart3,
  Target,
  ArrowUpRight
} from 'lucide-react';
import { SeguimientoDocente } from '../types';
import { seguimientoDocentesMock } from '../data/mockData';

interface SeguimientoDocenteCardProps {
  onSelectPruebaReporte: (pruebaId: string) => void;
}

export const SeguimientoDocenteCard: React.FC<SeguimientoDocenteCardProps> = ({
  onSelectPruebaReporte
}) => {
  const [docentes, setDocentes] = useState<SeguimientoDocente[]>(seguimientoDocentesMock);
  const [selectedAsignatura, setSelectedAsignatura] = useState<string>('todas');
  const [selectedEstadoPME, setSelectedEstadoPME] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDocenteModal, setSelectedDocenteModal] = useState<SeguimientoDocente | null>(null);

  // Filtered teachers
  const filteredDocentes = docentes.filter(d => {
    const matchesSearch =
      d.profesorNombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.asignaturaNombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.cursosAsignados.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesAsignatura =
      selectedAsignatura === 'todas' ||
      (selectedAsignatura === 'asig-1' && d.asignaturaId === 'asig-1') ||
      (selectedAsignatura === 'asig-2' && d.asignaturaId === 'asig-2') ||
      (selectedAsignatura === 'asig-3' && d.asignaturaId === 'asig-3');

    const matchesPME =
      selectedEstadoPME === 'todos' || d.estadoAvancePME === selectedEstadoPME;

    return matchesSearch && matchesAsignatura && matchesPME;
  });

  // Summary Metrics
  const totalEvaluaciones = docentes.reduce((acc, d) => acc + d.totalEvaluacionesCreadas, 0);
  const totalAlumnosEvaluados = docentes.reduce((acc, d) => acc + d.totalAlumnosEvaluados, 0);
  const promedioCobertura = Math.round(
    docentes.reduce((acc, d) => acc + d.coberturaCurricularPorcentaje, 0) / docentes.length
  );
  const promedioLogroGlobal = (
    docentes.reduce((acc, d) => acc + d.promedioLogroAlumnos, 0) / docentes.length
  ).toFixed(1);

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6 animate-fade-in text-left">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-2">
            <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
            <span>Supervisión y Acompañamiento Pedagógico UTP</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
            Seguimiento de Avance Docente & Cobertura Curricular
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl">
            Monitoreo en tiempo real del progreso de cada profesor, cantidad de ensayos aplicados, porcentaje de avance en Objetivos de Aprendizaje (OA) y estimación de logro SIMCE.
          </p>
        </div>

        {/* Global Mini KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/80 p-3 rounded-2xl border border-slate-800/80">
          <div className="px-3 py-1.5 border-r border-slate-800/60 last:border-0">
            <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Docentes</div>
            <div className="text-base font-black text-white">{docentes.length} Prof.</div>
          </div>
          <div className="px-3 py-1.5 border-r border-slate-800/60 last:border-0">
            <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Cob. Media OA</div>
            <div className="text-base font-black text-indigo-400">{promedioCobertura}%</div>
          </div>
          <div className="px-3 py-1.5 border-r border-slate-800/60 last:border-0">
            <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Ensayos</div>
            <div className="text-base font-black text-emerald-400">{totalEvaluaciones} aplic.</div>
          </div>
          <div className="px-3 py-1.5">
            <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Logro Medio</div>
            <div className="text-base font-black text-amber-400">{promedioLogroGlobal}%</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 flex-wrap">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por profesor, curso o materia..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
          {/* Asignatura filter */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setSelectedAsignatura('todas')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                selectedAsignatura === 'todas'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setSelectedAsignatura('asig-1')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                selectedAsignatura === 'asig-1'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              📐 Matemática
            </button>
            <button
              onClick={() => setSelectedAsignatura('asig-2')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                selectedAsignatura === 'asig-2'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              📖 Lenguaje
            </button>
            <button
              onClick={() => setSelectedAsignatura('asig-3')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                selectedAsignatura === 'asig-3'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🔬 Ciencias
            </button>
          </div>

          {/* PME status filter */}
          <select
            value={selectedEstadoPME}
            onChange={(e) => setSelectedEstadoPME(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 font-medium"
          >
            <option value="todos">Estado PME: Todos</option>
            <option value="en_meta">🟢 En Meta (≥70%)</option>
            <option value="en_progreso">🟡 En Progreso (50-69%)</option>
            <option value="requiere_apoyo">🔴 Requiere Apoyo (&lt;50%)</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800/80">
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
              <th className="py-3.5 px-4">Docente & Asignatura</th>
              <th className="py-3.5 px-3">Cursos Asignados</th>
              <th className="py-3.5 px-3 text-center">Evaluaciones</th>
              <th className="py-3.5 px-3 text-center">Cob. Curricular (OA)</th>
              <th className="py-3.5 px-3 text-center">Logro / SIMCE Est.</th>
              <th className="py-3.5 px-4">Foco Pedagógico (Debilidad Crítica)</th>
              <th className="py-3.5 px-3 text-center">Estado PME</th>
              <th className="py-3.5 px-4 text-right">Acción UTP</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
            {filteredDocentes.map((d) => (
              <tr
                key={d.profesorId}
                className="hover:bg-slate-800/50 transition-colors group"
              >
                {/* 1. Docente & Asignatura */}
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${d.avatarColor} flex items-center justify-center font-black text-xs text-white shadow-md flex-shrink-0`}>
                      {d.iniciales}
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-white text-xs group-hover:text-indigo-300 transition-colors truncate">
                        {d.profesorNombre}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">
                        {d.asignaturaNombre}
                      </div>
                    </div>
                  </div>
                </td>

                {/* 2. Cursos */}
                <td className="py-3.5 px-3">
                  <div className="flex flex-wrap gap-1">
                    {d.cursosAsignados.map((curso, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700/50"
                      >
                        {curso}
                      </span>
                    ))}
                  </div>
                </td>

                {/* 3. Evaluaciones Creadas & Activas */}
                <td className="py-3.5 px-3 text-center">
                  <div className="font-black text-white text-xs">
                    {d.totalEvaluacionesCreadas} creadas
                  </div>
                  <div className="text-[10px] font-semibold text-emerald-400">
                    {d.totalEvaluacionesActivas} activas hoy
                  </div>
                </td>

                {/* 4. Cobertura Curricular */}
                <td className="py-3.5 px-3 text-center min-w-[130px]">
                  <div className="flex items-center justify-between text-[11px] font-black mb-1">
                    <span className="text-slate-400">Objetivos</span>
                    <span className={d.coberturaCurricularPorcentaje >= 80 ? 'text-emerald-400' : d.coberturaCurricularPorcentaje >= 65 ? 'text-indigo-400' : 'text-amber-400'}>
                      {d.coberturaCurricularPorcentaje}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        d.coberturaCurricularPorcentaje >= 80
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                          : d.coberturaCurricularPorcentaje >= 65
                          ? 'bg-gradient-to-r from-indigo-500 to-violet-500'
                          : 'bg-gradient-to-r from-amber-500 to-orange-500'
                      }`}
                      style={{ width: `${d.coberturaCurricularPorcentaje}%` }}
                    />
                  </div>
                </td>

                {/* 5. Logro Promedio y Puntaje SIMCE Estimado */}
                <td className="py-3.5 px-3 text-center">
                  <div className="font-black text-white text-xs">
                    {d.promedioLogroAlumnos}%
                  </div>
                  <div className="text-[10px] font-bold text-amber-400 flex items-center justify-center gap-1">
                    <Award className="w-3 h-3 text-amber-400" />
                    <span>~{d.puntajeSimceEstimado} pts</span>
                  </div>
                </td>

                {/* 6. Foco Pedagógico / Eje Crítico */}
                <td className="py-3.5 px-4 max-w-[220px]">
                  <div className="text-[11px] font-medium text-rose-300 leading-tight">
                    {d.ejeMayorDebilidad}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    Fortaleza: <span className="text-slate-400">{d.ejeMayorFortaleza.split('(')[0]}</span>
                  </div>
                </td>

                {/* 7. Estado PME */}
                <td className="py-3.5 px-3 text-center">
                  {d.estadoAvancePME === 'en_meta' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-500/10 text-emerald-300 border border-emerald-500/25">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span>En Meta</span>
                    </span>
                  ) : d.estadoAvancePME === 'en_progreso' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-500/10 text-amber-300 border border-amber-500/25">
                      <Clock className="w-3 h-3 text-amber-400" />
                      <span>En Progreso</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-rose-500/10 text-rose-300 border border-rose-500/25">
                      <AlertTriangle className="w-3 h-3 text-rose-400" />
                      <span>Requiere Apoyo</span>
                    </span>
                  )}
                </td>

                {/* 8. Acciones UTP */}
                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => onSelectPruebaReporte(d.ultimaEvaluacionId)}
                      className="px-2.5 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 text-[11px] font-bold transition-all shadow-sm flex items-center gap-1"
                      title={`Ver matriz y reporte tabulado de ${d.profesorNombre}`}
                    >
                      <BarChart3 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Ver Matriz</span>
                    </button>
                    <button
                      onClick={() => setSelectedDocenteModal(d)}
                      className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700/50 transition-colors"
                      title="Ver ficha pedagógica completa"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer Info */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Datos sincronizados con las últimas rendiciones de ensayos diagnósticos y SIMCE 2026.</span>
        </div>
        <div className="text-slate-500 font-medium">
          Mostrando {filteredDocentes.length} de {docentes.length} profesores activos
        </div>
      </div>

      {/* Modal Detalle Pedagógico del Profesor */}
      {selectedDocenteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl w-full max-w-xl p-6 sm:p-8 space-y-6 text-left relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3.5">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${selectedDocenteModal.avatarColor} flex items-center justify-center font-black text-sm text-white shadow-lg`}>
                  {selectedDocenteModal.iniciales}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    {selectedDocenteModal.profesorNombre}
                  </h3>
                  <p className="text-xs text-indigo-400 font-semibold">
                    {selectedDocenteModal.asignaturaNombre} • {selectedDocenteModal.profesorEmail}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedDocenteModal(null)}
                className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                <div className="text-[10px] text-slate-500 font-bold uppercase">Cobertura OA</div>
                <div className="text-lg font-black text-emerald-400 mt-0.5">
                  {selectedDocenteModal.coberturaCurricularPorcentaje}%
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                <div className="text-[10px] text-slate-500 font-bold uppercase">Logro Alumnos</div>
                <div className="text-lg font-black text-amber-400 mt-0.5">
                  {selectedDocenteModal.promedioLogroAlumnos}%
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                <div className="text-[10px] text-slate-500 font-bold uppercase">SIMCE Est.</div>
                <div className="text-lg font-black text-indigo-400 mt-0.5">
                  {selectedDocenteModal.puntajeSimceEstimado} pts
                </div>
              </div>
            </div>

            {/* Diagnostic Details */}
            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
                <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Mayor Fortaleza Curricular:
                </div>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  {selectedDocenteModal.ejeMayorFortaleza}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 space-y-1">
                <div className="font-bold text-rose-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" /> Foco de Nivelación Recomendado (UTP):
                </div>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  {selectedDocenteModal.ejeMayorDebilidad}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-indigo-400" /> Última Evaluación Aplicada:
                </div>
                <div className="text-slate-300 text-[11px]">
                  <strong>{selectedDocenteModal.ultimaEvaluacionTitulo}</strong>
                </div>
                <div className="text-slate-500 text-[10px]">
                  Fecha: {selectedDocenteModal.ultimaEvaluacionFecha} • {selectedDocenteModal.totalAlumnosEvaluados} alumnos evaluados • {selectedDocenteModal.planesRemedialesGenerados} planes remediales generados
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setSelectedDocenteModal(null)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                Cerrar
              </button>
              <button
                onClick={() => {
                  const evalId = selectedDocenteModal.ultimaEvaluacionId;
                  setSelectedDocenteModal(null);
                  onSelectPruebaReporte(evalId);
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition-all"
              >
                <BarChart3 className="w-4 h-4" />
                <span>Abrir Matriz de Logro Completa</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
