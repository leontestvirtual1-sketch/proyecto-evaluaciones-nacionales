import React, { useState } from 'react';
import {
  Pregunta,
  Asignatura,
  EjeTematico,
  Habilidad,
  TipoPregunta,
  DificultadPregunta
} from '../types';
import { PreguntaFormModal } from '../components/PreguntaFormModal';
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
  ChevronDown,
  ChevronUp,
  Award,
  Lock
} from 'lucide-react';

import { UserProfile } from '../types';

interface BancoPreguntasPageProps {
  preguntas: Pregunta[];
  asignaturas: Asignatura[];
  ejes: EjeTematico[];
  habilidades: Habilidad[];
  currentUser?: UserProfile;
  onAddPregunta: (p: Pregunta) => void;
  onUpdatePregunta: (p: Pregunta) => void;
  onDeletePregunta: (id: string) => void;
}

export const BancoPreguntasPage: React.FC<BancoPreguntasPageProps> = ({
  preguntas,
  asignaturas,
  ejes,
  habilidades,
  currentUser,
  onAddPregunta,
  onUpdatePregunta,
  onDeletePregunta,
}) => {
  const isDocente = currentUser?.rol === 'profesor' && currentUser?.asignaturaId;
  const docenteAsigId = currentUser?.asignaturaId || '';

  // Restrict available subjects and axes if teacher
  const availableAsignaturas = isDocente
    ? asignaturas.filter(a => a.id === docenteAsigId)
    : asignaturas;

  const [search, setSearch] = useState('');
  const [asignaturaFilter, setAsignaturaFilter] = useState(isDocente ? docenteAsigId : '');
  const [ejeFilter, setEjeFilter] = useState('');
  const [habilidadFilter, setHabilidadFilter] = useState('');
  const [dificultadFilter, setDificultadFilter] = useState('');
  const [tipoFilter, setTipoFilter] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingPregunta, setEditingPregunta] = useState<Pregunta | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Active subject context for axes filtering
  const activeSubjectId = isDocente ? docenteAsigId : (asignaturaFilter || '');
  const availableEjes = activeSubjectId
    ? ejes.filter(e => e.asignaturaId === activeSubjectId)
    : ejes;

  const availableHabilidades = activeSubjectId
    ? habilidades.filter(h => h.asignaturaId === activeSubjectId)
    : habilidades;

  // Questions pool strictly isolated for teacher
  const basePreguntas = isDocente
    ? preguntas.filter(p => p.asignaturaId === docenteAsigId)
    : preguntas;

  // Filtered Questions
  const filtered = basePreguntas.filter(p => {
    const matchSearch =
      p.enunciado.toLowerCase().includes(search.toLowerCase()) ||
      p.fuente.toLowerCase().includes(search.toLowerCase());
    const matchAsig = isDocente ? p.asignaturaId === docenteAsigId : (!asignaturaFilter || p.asignaturaId === asignaturaFilter);
    const matchEje = !ejeFilter || p.ejeTematicoId === ejeFilter;
    const matchHab = !habilidadFilter || p.habilidadId === habilidadFilter;
    const matchDif = !dificultadFilter || p.dificultad === dificultadFilter;
    const matchTipo = !tipoFilter || p.tipo === tipoFilter;

    return matchSearch && matchAsig && matchEje && matchHab && matchDif && matchTipo;
  });

  const handleDuplicate = (p: Pregunta) => {
    const duplicada: Pregunta = {
      ...p,
      id: `preg-${Date.now()}`,
      enunciado: `${p.enunciado} (Copia)`,
      fuente: `Copia de ${p.fuente}`,
    };
    onAddPregunta(duplicada);
  };

  const totalSeleccionMultiple = basePreguntas.filter(p => p.tipo === 'seleccion_multiple').length;
  const totalDesarrollo = basePreguntas.filter(p => p.tipo === 'desarrollo').length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Library className="w-6 h-6 text-indigo-500" />
            {isDocente ? `Banco de Preguntas — ${currentUser?.asignaturaNombre || 'Especialidad'}` : 'Banco de Preguntas Institucional'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {isDocente
              ? `Taxonomía curricular y banco de ítems exclusivo para la asignatura de ${currentUser?.asignaturaNombre}`
              : 'Gestión global de ítems calibrados por Asignatura, Eje Temático y Habilidad Cognitiva'}
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

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-card p-4 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Total Preguntas Materia</span>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{basePreguntas.length}</p>
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
            {basePreguntas.filter(p => p.fuente.toLowerCase().includes('oficial') || p.fuente.toLowerCase().includes('liberada') || p.fuente.toLowerCase().includes('simce')).length}
          </p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="glass-card p-4 space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-indigo-500" />
            <span>Filtros de Búsqueda y Taxonomía Curricular</span>
          </div>

          {isDocente && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              <Lock className="w-3 h-3" /> Especialidad Aislada: {currentUser?.asignaturaNombre}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2.5">
          {/* Search text */}
          <div className="sm:col-span-2 relative">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar en el enunciado o fuente..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          </div>

          {/* Asignatura filter */}
          {!isDocente ? (
            <select
              value={asignaturaFilter}
              onChange={e => {
                setAsignaturaFilter(e.target.value);
                setEjeFilter('');
                setHabilidadFilter('');
              }}
              className="px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 font-semibold"
            >
              <option value="">Todas las Asignaturas</option>
              {asignaturas.map(a => <option key={a.id} value={a.id}>{a.nombre}</option>)}
            </select>
          ) : (
            <div className="px-3 py-1.5 text-xs bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5 truncate">
              <span>{currentUser?.asignaturaId === 'asig-1' ? '📐' : currentUser?.asignaturaId === 'asig-3' ? '🔬' : '📖'}</span>
              <span className="truncate">{currentUser?.asignaturaNombre}</span>
            </div>
          )}

          {/* Eje filter strictly filtered by subject */}
          <select
            value={ejeFilter}
            onChange={e => setEjeFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="">Todos los Ejes Temáticos</option>
            {availableEjes.map(e => <option key={e.id} value={e.id}>{e.nombre}</option>)}
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
              No se encontraron preguntas en esta materia con los filtros seleccionados
            </p>
            <p className="text-xs text-slate-400 mt-1">Crea una nueva pregunta o ajusta los criterios de búsqueda</p>
          </div>
        ) : (
          filtered.map(pregunta => {
            const eje = ejes.find(e => e.id === pregunta.ejeTematicoId);
            const hab = habilidades.find(h => h.id === pregunta.habilidadId);
            const asig = asignaturas.find(a => a.id === pregunta.asignaturaId);
            const isExpanded = expandedId === pregunta.id;

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
                    <span className="text-[11px] text-slate-400">
                      {pregunta.nivel} • {pregunta.puntaje} pt(s)
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
                      onClick={() => onDeletePregunta(pregunta.id)}
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
        onSave={p => {
          if (editingPregunta) {
            onUpdatePregunta(p);
          } else {
            onAddPregunta(p);
          }
          setEditingPregunta(null);
        }}
        editPregunta={editingPregunta}
        asignaturas={availableAsignaturas}
        ejes={availableEjes}
        habilidades={availableHabilidades}
      />
    </div>
  );
};
