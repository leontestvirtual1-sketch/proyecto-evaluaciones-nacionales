import React, { useState } from 'react';
import {
  GraduationCap,
  PlusCircle,
  Search,
  MoreVertical,
  Mail,
  BookOpen,
  Edit2,
  Trash2,
  UserCheck,
  UserX,
  ChevronDown
} from 'lucide-react';
import { UserProfile } from '../types';
import { cursosMock } from '../data/mockData';

// Local mock profesores
const profesoresIniciales: UserProfile[] = [
  {
    id: '00000000-0000-0000-0000-000000000001',
    rut: '12.345.678-9',
    nombre: 'María',
    apellido: 'González',
    email: 'maria.gonzalez@escuelademo.cl',
    rol: 'profesor',
    establecimiento: 'Escuela Bicentenario Demo'
  },
  {
    id: 'prof-002',
    rut: '14.567.890-1',
    nombre: 'Roberto',
    apellido: 'Morales',
    email: 'r.morales@escuelademo.cl',
    rol: 'profesor',
    establecimiento: 'Escuela Bicentenario Demo'
  },
  {
    id: 'prof-003',
    rut: '16.789.012-3',
    nombre: 'Claudia',
    apellido: 'Fernández',
    email: 'c.fernandez@escuelademo.cl',
    rol: 'profesor',
    establecimiento: 'Escuela Bicentenario Demo'
  },
];

interface ProfesorFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (p: UserProfile) => void;
  editProfesor?: UserProfile | null;
}

const ProfesorFormModal: React.FC<ProfesorFormModalProps> = ({ isOpen, onClose, onSave, editProfesor }) => {
  const [form, setForm] = useState<Partial<UserProfile>>(
    editProfesor || { rut: '', nombre: '', apellido: '', email: '', rol: 'profesor', establecimiento: 'Escuela Bicentenario Demo' }
  );

  if (!isOpen) return null;

  const handleSave = () => {
    if (!form.rut || !form.nombre || !form.apellido || !form.email) return;
    onSave({
      id: editProfesor?.id || `prof-${Date.now()}`,
      rut: form.rut!,
      nombre: form.nombre!,
      apellido: form.apellido!,
      email: form.email!,
      rol: 'profesor',
      establecimiento: form.establecimiento || 'Escuela Bicentenario Demo',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-5">
        <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="p-2 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl">
            <GraduationCap className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            {editProfesor ? 'Editar Profesor' : 'Agregar Nuevo Profesor'}
          </h3>
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Nombre', field: 'nombre', placeholder: 'María' },
              { label: 'Apellido', field: 'apellido', placeholder: 'González' },
            ].map(({ label, field, placeholder }) => (
              <div key={field} className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{label}</label>
                <input
                  type="text"
                  value={(form as any)[field] || ''}
                  onChange={e => setForm(prev => ({ ...prev, [field]: e.target.value }))}
                  placeholder={placeholder}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>
            ))}
          </div>

          {[
            { label: 'RUT', field: 'rut', placeholder: '12.345.678-9', type: 'text' },
            { label: 'Correo Electrónico', field: 'email', placeholder: 'nombre@colegio.cl', type: 'email' },
            { label: 'Establecimiento', field: 'establecimiento', placeholder: 'Nombre del colegio', type: 'text' },
          ].map(({ label, field, placeholder, type }) => (
            <div key={field} className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{label}</label>
              <input
                type={type}
                value={(form as any)[field] || ''}
                onChange={e => setForm(prev => ({ ...prev, [field]: e.target.value }))}
                placeholder={placeholder}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
          ))}
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/20 transition-all"
          >
            {editProfesor ? 'Guardar Cambios' : 'Agregar Profesor'}
          </button>
        </div>
      </div>
    </div>
  );
};

export const ProfesoresPage: React.FC = () => {
  const [profesores, setProfesores] = useState<UserProfile[]>(profesoresIniciales);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProfesor, setEditingProfesor] = useState<UserProfile | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const filtered = profesores.filter(p =>
    `${p.nombre} ${p.apellido} ${p.email} ${p.rut}`.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = (prof: UserProfile) => {
    setProfesores(prev => {
      const exists = prev.find(p => p.id === prof.id);
      if (exists) return prev.map(p => p.id === prof.id ? prof : p);
      return [prof, ...prev];
    });
    setEditingProfesor(null);
  };

  const handleDelete = (id: string) => {
    setProfesores(prev => prev.filter(p => p.id !== id));
    setActiveMenuId(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-indigo-500" /> Gestión de Profesores
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {profesores.length} docentes registrados en el establecimiento
          </p>
        </div>
        <button
          onClick={() => { setEditingProfesor(null); setModalOpen(true); }}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md shadow-indigo-600/20 transition-all active:scale-[0.98]"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Agregar Profesor</span>
        </button>
      </div>

      {/* Search */}
      <div className="glass-card p-4 flex items-center gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por nombre, correo o RUT..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>
        <div className="text-xs text-slate-500 whitespace-nowrap font-medium">
          {filtered.length} resultados
        </div>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
                <th className="py-3.5 px-5 text-slate-500 uppercase tracking-wider font-semibold">Docente</th>
                <th className="py-3.5 px-5 text-slate-500 uppercase tracking-wider font-semibold hidden sm:table-cell">RUT</th>
                <th className="py-3.5 px-5 text-slate-500 uppercase tracking-wider font-semibold hidden md:table-cell">Correo</th>
                <th className="py-3.5 px-5 text-slate-500 uppercase tracking-wider font-semibold hidden lg:table-cell">Cursos</th>
                <th className="py-3.5 px-5 text-slate-500 uppercase tracking-wider font-semibold">Estado</th>
                <th className="py-3.5 px-5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <GraduationCap className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-slate-500">No se encontraron profesores</p>
                    <p className="text-xs text-slate-400 mt-1">Ajusta la búsqueda o agrega un nuevo docente</p>
                  </td>
                </tr>
              ) : filtered.map(prof => (
                <tr key={prof.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                  {/* Avatar + Name */}
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-sm">
                        {prof.nombre[0]}{prof.apellido[0]}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">{prof.nombre} {prof.apellido}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5 md:hidden">{prof.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-5 text-slate-600 dark:text-slate-400 hidden sm:table-cell font-mono">
                    {prof.rut}
                  </td>

                  <td className="py-3.5 px-5 hidden md:table-cell">
                    <a href={`mailto:${prof.email}`} className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:underline">
                      <Mail className="w-3 h-3" /> {prof.email}
                    </a>
                  </td>

                  <td className="py-3.5 px-5 hidden lg:table-cell">
                    <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                      <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{cursosMock.length} curso(s)</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-5">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                      <UserCheck className="w-3 h-3" /> Activo
                    </span>
                  </td>

                  {/* Actions dropdown */}
                  <td className="py-3.5 px-4 relative">
                    <button
                      onClick={() => setActiveMenuId(activeMenuId === prof.id ? null : prof.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {activeMenuId === prof.id && (
                      <div className="absolute right-4 top-10 z-20 w-44 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-1 animate-fade-in">
                        <button
                          onClick={() => { setEditingProfesor(prof); setModalOpen(true); setActiveMenuId(null); }}
                          className="w-full flex items-center gap-2 px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-indigo-500" /> Editar datos
                        </button>
                        <button
                          onClick={() => setActiveMenuId(null)}
                          className="w-full flex items-center gap-2 px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        >
                          <UserX className="w-3.5 h-3.5 text-amber-500" /> Desactivar cuenta
                        </button>
                        <div className="border-t border-slate-100 dark:border-slate-800 my-1" />
                        <button
                          onClick={() => handleDelete(prof.id)}
                          className="w-full flex items-center gap-2 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Eliminar
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ProfesorFormModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditingProfesor(null); }}
        onSave={handleSave}
        editProfesor={editingProfesor}
      />
    </div>
  );
};
