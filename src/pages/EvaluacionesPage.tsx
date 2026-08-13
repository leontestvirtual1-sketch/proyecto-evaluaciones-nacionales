import React, { useState } from 'react';
import { Prueba, Asignatura } from '../types';
import {
  BookOpen,
  PlusCircle,
  Search,
  Filter,
  Clock,
  Check,
  Copy,
  BarChart2,
  FileText,
  Printer,
  Sparkles,
  Share2,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  Layers,
  ArrowRight
} from 'lucide-react';

interface EvaluacionesPageProps {
  pruebas: Prueba[];
  asignaturas: Asignatura[];
  onOpenGenerator: () => void;
  onSelectPruebaReporte: (pruebaId: string) => void;
  onUpdatePruebaEstado: (pruebaId: string, nuevoEstado: 'borrador' | 'activa' | 'finalizada') => void;
}

export const EvaluacionesPage: React.FC<EvaluacionesPageProps> = ({
  pruebas,
  asignaturas,
  onOpenGenerator,
  onSelectPruebaReporte,
  onUpdatePruebaEstado
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAsignatura, setSelectedAsignatura] = useState<string>('todos');
  const [selectedEstado, setSelectedEstado] = useState<string>('todos');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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

  const filteredPruebas = pruebas.filter((prueba) => {
    const matchesSearch =
      prueba.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prueba.codigoPublico.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prueba.asignaturaNombre.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesAsignatura =
      selectedAsignatura === 'todos' || prueba.asignaturaId === selectedAsignatura;
    
    const matchesEstado =
      selectedEstado === 'todos' || prueba.estado === selectedEstado;

    return matchesSearch && matchesAsignatura && matchesEstado;
  });

  const totalActivas = pruebas.filter((p) => p.estado === 'activa').length;
  const totalFinalizadas = pruebas.filter((p) => p.estado === 'finalizada').length;
  const totalBorradores = pruebas.filter((p) => p.estado === 'borrador').length;

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-800 flex items-center gap-2 animate-bounce-short text-xs font-semibold">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="glass-card p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-indigo-500/20 text-white relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <BookOpen className="w-3.5 h-3.5 mr-1.5 text-indigo-400" /> Gestión de Evaluaciones & Ensayos
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Evaluaciones Creadas
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Crea, administra y distribuye pruebas estandarizadas nacionales y ensayos SIMCE. Obtén códigos de acceso directo para tus alumnos y analiza los resultados en tiempo real.
            </p>
          </div>

          <button
            onClick={onOpenGenerator}
            className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-bold px-5 py-3 rounded-xl shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Nueva Evaluación</span>
          </button>
        </div>
      </div>

      {/* Stats Quick Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-card p-4 flex items-center gap-3">
          <div className="p-2.5 bg-indigo-500/10 text-indigo-500 rounded-xl">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Total Ensayos</p>
            <p className="text-xl font-extrabold text-slate-900 dark:text-white">{pruebas.length}</p>
          </div>
        </div>

        <div className="glass-card p-4 flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/10 text-emerald-500 rounded-xl">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Activas</p>
            <p className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">{totalActivas}</p>
          </div>
        </div>

        <div className="glass-card p-4 flex items-center gap-3">
          <div className="p-2.5 bg-slate-500/10 text-slate-500 rounded-xl">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Finalizadas</p>
            <p className="text-xl font-extrabold text-slate-700 dark:text-slate-300">{totalFinalizadas}</p>
          </div>
        </div>

        <div className="glass-card p-4 flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/10 text-amber-500 rounded-xl">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Borradores</p>
            <p className="text-xl font-extrabold text-amber-600 dark:text-amber-400">{totalBorradores}</p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por título, código o materia..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Filter className="w-3.5 h-3.5" />
            <span>Filtrar:</span>
          </div>

          <select
            value={selectedAsignatura}
            onChange={(e) => setSelectedAsignatura(e.target.value)}
            className="px-3 py-2 text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="todos">Todas las Asignaturas</option>
            {asignaturas.map((asig) => (
              <option key={asig.id} value={asig.id}>{asig.nombre}</option>
            ))}
          </select>

          <select
            value={selectedEstado}
            onChange={(e) => setSelectedEstado(e.target.value)}
            className="px-3 py-2 text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
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
            const estadoColor =
              prueba.estado === 'activa'
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                : prueba.estado === 'finalizada'
                ? 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20'
                : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';

            return (
              <div
                key={prueba.id}
                className="glass-card p-6 space-y-5 flex flex-col justify-between hover:border-indigo-500/30 transition-all duration-200"
              >
                {/* Header info */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                        {prueba.asignaturaNombre} — {prueba.nivel}
                      </span>
                      <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold border capitalize ${estadoColor}`}>
                        {prueba.estado}
                      </span>
                    </div>

                    <div className="text-xs text-slate-400 flex items-center gap-1 font-medium">
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
                  <button
                    onClick={() => onSelectPruebaReporte(prueba.id)}
                    className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold py-2.5 rounded-xl shadow-sm transition-all"
                  >
                    <BarChart2 className="w-4 h-4" />
                    <span>Ver Reporte Tabulado & Plan de Reforzamiento</span>
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => showToast(`Imprimiendo prueba en formato PDF (SIMCE Standard)...`)}
                      className="flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold py-2 rounded-xl transition-all"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Descargar PDF</span>
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
    </div>
  );
};
