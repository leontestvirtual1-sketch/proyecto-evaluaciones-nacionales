import React, { useState, useEffect } from 'react';
import { APP_CONFIG } from '../config/appConfig';
import { UserProfile } from '../types';
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

export interface CursoItem {
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

interface CursoFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (c: CursoItem) => void;
  editCurso?: CursoItem | null;
  establecimientoNombre: string;
}

const NIVELES = [
  '1° Básico', '2° Básico', '3° Básico', '4° Básico',
  '5° Básico', '6° Básico', '7° Básico', '8° Básico',
  'I Medio', 'II Medio', 'III Medio', 'IV Medio',
];

const CursoFormModal: React.FC<CursoFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editCurso,
  establecimientoNombre
}) => {
  const [nombre, setNombre] = useState(editCurso?.nombre || '');
  const [nivel, setNivel] = useState(editCurso?.nivel || 'II Medio');
  const [anio, setAnio] = useState(editCurso?.anio || 2026);

  useEffect(() => {
    if (editCurso) {
      setNombre(editCurso.nombre);
      setNivel(editCurso.nivel);
      setAnio(editCurso.anio);
    } else {
      setNombre('');
      setNivel('II Medio');
      setAnio(2026);
    }
  }, [editCurso, isOpen]);

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
      establecimiento: establecimientoNombre,
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
              placeholder="Ej: 2° Medio A"
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Nivel</label>
              <select
                value={nivel}
                onChange={e => setNivel(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-violet-500/20 transition-all text-slate-900 dark:text-white"
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
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-violet-500/20 transition-all text-slate-900 dark:text-white"
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

interface CursosPageProps {
  currentUser?: UserProfile | null;
}

export const CursosPage: React.FC<CursosPageProps> = ({ currentUser }) => {
  const colegioNombre = currentUser?.establecimiento || APP_CONFIG.nombreEstablecimiento;
  const storageKey = `sysget_cursos_${currentUser?.id || 'default'}`;

  // Cursos iniciales aislados según el perfil docente
  const getInitialCursos = (): CursoItem[] => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const savedCursos = JSON.parse(saved) as CursoItem[];
        // Corrige exclusivamente el curso ficticio generado por versiones
        // anteriores para docentes nuevos; no afecta cursos creados por ellos.
        const isLegacyPlaceholder = savedCursos.length === 1 &&
          savedCursos[0]?.nombre === 'Curso 1' &&
          savedCursos[0]?.nivel === '8° Básico' &&
          savedCursos[0]?.totalAlumnos === 0;
        return isLegacyPlaceholder ? [] : savedCursos;
      } catch (err) {
        console.error('Error parsing saved cursos:', err);
      }
    }

    // Por defecto para María Teresa González (Lenguaje 2° Medio)
    if (currentUser?.asignaturaId === 'asig-2' || currentUser?.establecimiento?.includes('Premilitar')) {
      return [
        {
          id: 'cur-2m',
          nombre: '2° Medio',
          nivel: 'II Medio',
          anio: 2026,
          codigoInvitacion: 'LEN2M2026',
          totalAlumnos: 0,
          establecimiento: colegioNombre
        }
      ];
    }

    // Admin demo general: Cursos del Liceo Bicentenario (6° y 8° Básico)
    if (currentUser?.rol === 'admin') {
      return [
        { id: 'curso-6a', nombre: '6° Básico A', nivel: '6° Básico', anio: 2026, codigoInvitacion: 'CN6A2026', totalAlumnos: 25, establecimiento: colegioNombre },
        { id: 'curso-6b', nombre: '6° Básico B', nivel: '6° Básico', anio: 2026, codigoInvitacion: 'CN6B2026', totalAlumnos: 25, establecimiento: colegioNombre },
        { id: 'curso-1', nombre: '8° Básico A', nivel: '8° Básico', anio: 2026, codigoInvitacion: 'DEMO2026', totalAlumnos: 28, establecimiento: colegioNombre },
        { id: 'curso-2', nombre: '8° Básico B', nivel: '8° Básico', anio: 2026, codigoInvitacion: 'BIOB2026', totalAlumnos: 30, establecimiento: colegioNombre },
      ];
    }

    // Docente nuevo: el primer curso debe ser creado explícitamente.
    return [];
  };

  const [cursos, setCursos] = useState<CursoItem[]>(getInitialCursos);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCurso, setEditingCurso] = useState<CursoItem | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Sincronizar en localStorage cada vez que cambien los cursos
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(cursos));
  }, [cursos, storageKey]);

  const handleSave = (c: CursoItem) => {
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
    <div className="space-y-6 animate-fade-in text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-violet-500" /> Gestión de Cursos
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {cursos.length} curso(s) activos — {totalAlumnos} alumnos matriculados en <strong>{colegioNombre}</strong>
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
      {cursos.length === 0 ? (
        <div className="glass-card p-12 text-center space-y-4">
          <div className="w-12 h-12 bg-violet-500/10 text-violet-500 rounded-2xl flex items-center justify-center mx-auto">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Sin cursos registrados</h3>
            <p className="text-xs text-slate-500 mt-1">Crea el primer curso donde aplicarás tus evaluaciones SIMCE.</p>
          </div>
          <button
            onClick={() => { setEditingCurso(null); setModalOpen(true); }}
            className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md transition-all"
          >
            <PlusCircle className="w-4 h-4" /> Crear Curso
          </button>
        </div>
      ) : (
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
                      <div className="my-1 border-t border-slate-100 dark:border-slate-800" />
                      <button
                        onClick={() => handleDelete(curso.id)}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Eliminar curso
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Alumnos count */}
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-950/60 px-3 py-2 rounded-xl">
                <Users className="w-4 h-4 text-violet-500" />
                <span>{curso.totalAlumnos} alumno(s) matriculados</span>
              </div>

              {/* Invitation Code */}
              <div className="p-3 bg-violet-500/5 dark:bg-violet-950/20 border border-violet-500/20 rounded-xl space-y-1">
                <p className="text-[10px] font-bold text-violet-600 dark:text-violet-400 uppercase tracking-wider">
                  Código de auto-registro
                </p>
                <div className="flex items-center justify-between">
                  <span className="font-mono font-extrabold text-sm tracking-wider text-slate-900 dark:text-white">
                    {curso.codigoInvitacion}
                  </span>
                  <button
                    onClick={() => handleCopyCode(curso.id, curso.codigoInvitacion)}
                    className="flex items-center gap-1 text-[11px] text-violet-600 dark:text-violet-400 hover:text-violet-500 font-semibold transition-colors"
                  >
                    {copiedId === curso.id ? (
                      <><Check className="w-3.5 h-3.5 text-emerald-500" /> Copiado</>
                    ) : (
                      <><Copy className="w-3.5 h-3.5" /> Copiar</>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Add Curso Card */}
          <button
            onClick={() => { setEditingCurso(null); setModalOpen(true); }}
            className="border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-violet-500/50 dark:hover:border-violet-500/50 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 text-slate-400 hover:text-violet-500 dark:hover:text-violet-400 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 group-hover:bg-violet-500/10 flex items-center justify-center transition-colors">
              <PlusCircle className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold">Agregar otro curso</span>
          </button>
        </div>
      )}

      {/* Modal */}
      <CursoFormModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditingCurso(null); }}
        onSave={handleSave}
        editCurso={editingCurso}
        establecimientoNombre={colegioNombre}
      />
    </div>
  );
};
