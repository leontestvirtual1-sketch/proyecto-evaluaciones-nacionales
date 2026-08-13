import React, { useState } from 'react';
import { APP_CONFIG } from '../config/appConfig';
import {
  BookOpen,
  PlusCircle,
  Users,
  KeyRound,
  Edit2,
  Trash2,
  MoreVertical,
  Copy,
  Check,
  RefreshCw,
  X
} from 'lucide-react';

interface Curso {
  id: string;
  nombre: string;
  nivel: string;
  anio: number;
  codigoInvitacion: string;
  totalAlumnos: number;
  establecimiento: string;
}

function generateCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

const cursosIniciales: Curso[] = [
  { id: 'cur-1', nombre: '8° Básico A', nivel: '8° Básico', anio: 2026, codigoInvitacion: 'DEMO2026', totalAlumnos: 28, establecimiento: APP_CONFIG.nombreEstablecimiento },
  { id: 'cur-2', nombre: '8° Básico B', nivel: '8° Básico', anio: 2026, codigoInvitacion: 'BIOB2026', totalAlumnos: 30, establecimiento: APP_CONFIG.nombreEstablecimiento },
  { id: 'cur-3', nombre: 'II Medio A', nivel: 'II Medio', anio: 2026, codigoInvitacion: 'IIMA2026', totalAlumnos: 35, establecimiento: APP_CONFIG.nombreEstablecimiento },
];

interface CursoFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (c: Curso) => void;
  editCurso?: Curso | null;
}

const NIVELES = [
  '1° Básico', '2° Básico', '3° Básico', '4° Básico',
  '5° Básico', '6° Básico', '7° Básico', '8° Básico',
  'I Medio', 'II Medio', 'III Medio', 'IV Medio',
];

const CursoFormModal: React.FC<CursoFormModalProps> = ({ isOpen, onClose, onSave, editCurso }) => {
  const [nombre, setNombre] = useState(editCurso?.nombre || '');
  const [nivel, setNivel] = useState(editCurso?.nivel || '8° Básico');
  const [anio, setAnio] = useState(editCurso?.anio || 2026);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!nombre.trim()) return;
    onSave({
      id: editCurso?.id || `cur-${Date.now()}`,
      nombre,
      nivel,
      anio,
      codigoInvitacion: editCurso?.codigoInvitacion || generateCode(),
      totalAlumnos: editCurso?.totalAlumnos || 0,
      establecimiento: APP_CONFIG.nombreEstablecimiento,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-5">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-violet-500/10 text-violet-600 dark:text-violet-400 rounded-xl">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {editCurso ? 'Editar Curso' : 'Crear Nuevo Curso'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Nombre del Curso</label>
            <input
              type="text"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              placeholder="Ej: 8° Básico A"
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Nivel</label>
              <select
                value={nivel}
                onChange={e => setNivel(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-violet-500/20 transition-all"
              >
                {NIVELES.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Año Escolar</label>
              <input
                type="number"
                value={anio}
                onChange={e => setAnio(Number(e.target.value))}
                min={2024}
                max={2030}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-violet-500/20 transition-all"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
            Cancelar
          </button>
          <button onClick={handleSave} className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white bg-violet-600 hover:bg-violet-500 shadow-md transition-all">
            {editCurso ? 'Guardar Cambios' : 'Crear Curso'}
          </button>
        </div>
      </div>
    </div>
  );
};

export const CursosPage: React.FC = () => {
  const [cursos, setCursos] = useState<Curso[]>(cursosIniciales);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCurso, setEditingCurso] = useState<Curso | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleSave = (c: Curso) => {
    setCursos(prev => {
      const exists = prev.find(p => p.id === c.id);
      return exists ? prev.map(p => p.id === c.id ? c : p) : [c, ...prev];
    });
    setEditingCurso(null);
  };

  const handleDelete = (id: string) => {
    setCursos(prev => prev.filter(c => c.id !== id));
    setActiveMenuId(null);
  };

  const handleRegenCode = (id: string) => {
    setCursos(prev => prev.map(c => c.id === id ? { ...c, codigoInvitacion: generateCode() } : c));
    setActiveMenuId(null);
  };

  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const totalAlumnos = cursos.reduce((acc, c) => acc + c.totalAlumnos, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-violet-500" /> Gestión de Cursos
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {cursos.length} curso(s) activos — {totalAlumnos} alumnos matriculados en {APP_CONFIG.nombreEstablecimiento}
          </p>
        </div>
        <button
          onClick={() => { setEditingCurso(null); setModalOpen(true); }}
          className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md shadow-violet-600/20 transition-all"
        >
          <PlusCircle className="w-4 h-4" /> Crear Nuevo Curso
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="glass-card p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Cursos Activos</p>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{cursos.length}</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-violet-500">Total Alumnos</p>
          <p className="text-2xl font-extrabold text-violet-600 dark:text-violet-400 mt-1">{totalAlumnos}</p>
        </div>
        <div className="glass-card p-4 sm:col-span-1 col-span-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Año Escolar</p>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{APP_CONFIG.anioEscolar}</p>
        </div>
      </div>

      {/* Cursos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {cursos.map(curso => (
          <div
            key={curso.id}
            className="glass-card p-5 space-y-4 hover:shadow-lg transition-all duration-200"
          >
            {/* Card Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-md">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-extrabold text-slate-900 dark:text-white">{curso.nombre}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {curso.nivel} — {curso.anio}
                  </p>
                </div>
              </div>

              {/* Dropdown menu */}
              <div className="relative">
                <button
                  onClick={() => setActiveMenuId(activeMenuId === curso.id ? null : curso.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
                {activeMenuId === curso.id && (
                  <div className="absolute right-0 top-8 z-20 w-44 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-1 animate-fade-in">
                    <button
                      onClick={() => { setEditingCurso(curso); setModalOpen(true); setActiveMenuId(null); }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-violet-500" /> Editar curso
                    </button>
                    <button
                      onClick={() => handleRegenCode(curso.id)}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-amber-500" /> Regenerar código
                    </button>
                    <div className="border-t border-slate-100 dark:border-slate-800 my-1" />
                    <button
                      onClick={() => handleDelete(curso.id)}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Eliminar
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Alumno count */}
            <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
              <Users className="w-4 h-4 text-violet-500" />
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {curso.totalAlumnos} alumno(s) matriculados
              </span>
            </div>

            {/* Invitation Code */}
            <div className="flex items-center justify-between px-3 py-2.5 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Código de Invitación</p>
                  <p className="font-mono font-extrabold text-sm text-slate-900 dark:text-white tracking-widest">
                    {curso.codigoInvitacion}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleCopyCode(curso.id, curso.codigoInvitacion)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                title="Copiar código"
              >
                {copiedId === curso.id
                  ? <Check className="w-4 h-4 text-emerald-500" />
                  : <Copy className="w-4 h-4" />
                }
              </button>
            </div>
          </div>
        ))}

        {/* Add new card shortcut */}
        <button
          onClick={() => { setEditingCurso(null); setModalOpen(true); }}
          className="glass-card p-5 border-dashed border-2 border-violet-400/30 hover:border-violet-500/60 hover:bg-violet-500/5 flex flex-col items-center justify-center gap-2 text-violet-500 transition-all min-h-[180px]"
        >
          <PlusCircle className="w-8 h-8 opacity-60" />
          <span className="text-xs font-semibold">Agregar otro curso</span>
        </button>
      </div>

      <CursoFormModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditingCurso(null); }}
        onSave={handleSave}
        editCurso={editingCurso}
      />
    </div>
  );
};
