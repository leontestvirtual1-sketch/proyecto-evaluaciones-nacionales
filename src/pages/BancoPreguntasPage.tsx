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
  Award
} from 'lucide-react';

interface BancoPreguntasPageProps {
  preguntas: Pregunta[];
  asignaturas: Asignatura[];
  ejes: EjeTematico[];
  habilidades: Habilidad[];
  onAddPregunta: (p: Pregunta) => void;
  onUpdatePregunta: (p: Pregunta) => void;
  onDeletePregunta: (id: string) => void;
}

export const BancoPreguntasPage: React.FC<BancoPreguntasPageProps> = ({
  preguntas,
  asignaturas,
  ejes,
  habilidades,
  onAddPregunta,
  onUpdatePregunta,
  onDeletePregunta,
}) => {
  const [search, setSearch] = useState('');
  const [asignaturaFilter, setAsignaturaFilter] = useState('');
  const [ejeFilter, setEjeFilter] = useState('');
  const [habilidadFilter, setHabilidadFilter] = useState('');
  const [dificultadFilter, setDificultadFilter] = useState('');
  const [tipoFilter, setTipoFilter] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingPregunta, setEditingPregunta] = useState<Pregunta | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Filtered Questions
  const filtered = preguntas.filter(p => {
    const matchSearch = p.enunciado.toLowerCase().includes(search.toLowerCase()) ||
      p.fuente.toLowerCase().includes(search.toLowerCase());
    const matchAsig = !asignaturaFilter || p.asignaturaId === asignaturaFilter;
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

  const totalSeleccionMultiple = preguntas.filter(p => p.tipo === 'seleccion_multiple').length;
  const totalDesarrollo = preguntas.filter(p => p.tipo === 'desarrollo').length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Library className="w-6 h-6 text-indigo-500" /> Banco de Preguntas Institucional
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Gestión de ítems calibrados por Asignatura, Eje Temático y Habilidad Cognitiva
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
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Total Preguntas</span>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{preguntas.length}</p>
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
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500">Oficiales Liberadas</span>
          <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {preguntas.filter(p => p.fuente.toLowerCase().includes('oficial') || p.fuente.toLowerCase().includes('liberada')).length}
          </p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="glass-card p-4 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
          <Filter className="w-4 h-4 text-indigo-500" />
          <span>Filtros de Búsqueda y Taxonomía Curricular</span>
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
          <select
            value={asignaturaFilter}
            onChange={e => setAsignaturaFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="">Todas las Asignaturas</option>
            {asignaturas.map(a => <option key={a.id} value={a.id}>{a.nombre}</option>)}
          </select>

          {/* Eje filter */}
          <select
            value={ejeFilter}
            onChange={e => setEjeFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="">Todos los Ejes</option>
            {ejes.map(e => <option key={e.id} value={e.id}>{e.nombre}</option>)}
          </select>

          {/* Dificultad filter */}
          <select
            value={dificultadFilter}
            onChange={e => setDificultadFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="">Todas las Dificultades</option>
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
            <option value="">Todos los Tipos</option>
            <option value="seleccion_multiple">Selección Múltiple</option>
            <option value="desarrollo">Desarrollo</option>
          </select>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <HelpCircle className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-500">No se encontraron preguntas con estos filtros</p>
            <p className="text-xs text-slate-400 mt-1">Limpia los criterios de búsqueda o crea un nuevo ítem</p>
          </div>
        ) : (
          filtered.map((preg, idx) => {
            const ejeName = ejes.find(e => e.id === preg.ejeTematicoId)?.nombre || 'General';
            const habName = habilidades.find(h => h.id === preg.habilidadId)?.nombre || 'General';
            const isExpanded = expandedId === preg.id;

            let difColor = 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
            if (preg.dificultad === 'media') difColor = 'bg-amber-500/10 text-amber-600 border-amber-500/20';
            if (preg.dificultad === 'alta') difColor = 'bg-rose-500/10 text-rose-600 border-rose-500/20';

            return (
              <div
                key={preg.id}
                className="glass-card p-5 space-y-4 hover:shadow-md transition-all duration-200"
              >
                {/* Header tags */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3 text-xs">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-md border border-indigo-500/20">
                      Ítem #{idx + 1} — {preg.nivel}
                    </span>

                    <span className={`px-2 py-0.5 rounded-md font-semibold border capitalize ${difColor}`}>
                      Dificultad {preg.dificultad}
                    </span>

                    <span className="px-2 py-0.5 rounded-md font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {preg.tipo === 'seleccion_multiple' ? 'Selección Múltiple' : 'Desarrollo Escrito'}
                    </span>
                  </div>

                  <span className="text-slate-400 text-[11px]">
                    Fuente: <strong>{preg.fuente}</strong>
                  </span>
                </div>

                {/* Enunciado */}
                <div className="space-y-1.5">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white leading-relaxed">
                    {preg.enunciado}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 pt-1">
                    <span>Eje: <strong className="text-slate-700 dark:text-slate-300">{ejeName}</strong></span>
                    <span>•</span>
                    <span>Habilidad: <strong className="text-slate-700 dark:text-slate-300">{habName}</strong></span>
                  </div>
                </div>

                {/* Alternatives Grid / Preview */}
                {preg.tipo === 'seleccion_multiple' && preg.alternativas.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/60">
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : preg.id)}
                      className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      <span>{isExpanded ? 'Ocultar alternativas' : 'Ver alternativas (4)'}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    {isExpanded && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 animate-fade-in">
                        {preg.alternativas.map(alt => (
                          <div
                            key={alt.letra}
                            className={`p-2.5 rounded-xl border text-xs flex items-start gap-2.5 ${
                              alt.es_correcta
                                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-medium'
                                : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            <span
                              className={`w-5 h-5 rounded-md font-bold text-[11px] flex items-center justify-center flex-shrink-0 ${
                                alt.es_correcta
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                              }`}
                            >
                              {alt.letra}
                            </span>
                            <span className="pt-0.5">{alt.texto}</span>
                            {alt.es_correcta && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 ml-auto flex-shrink-0" />
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Actions Footer */}
                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                  <button
                    onClick={() => handleDuplicate(preg)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5 text-indigo-400" /> Duplicar
                  </button>

                  <button
                    onClick={() => { setEditingPregunta(preg); setModalOpen(true); }}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-emerald-500" /> Editar
                  </button>

                  <button
                    onClick={() => onDeletePregunta(preg.id)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Eliminar
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal */}
      <PreguntaFormModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditingPregunta(null); }}
        onSave={p => {
          if (editingPregunta) onUpdatePregunta(p);
          else onAddPregunta(p);
        }}
        editPregunta={editingPregunta}
        asignaturas={asignaturas}
        ejes={ejes}
        habilidades={habilidades}
      />
    </div>
  );
};
