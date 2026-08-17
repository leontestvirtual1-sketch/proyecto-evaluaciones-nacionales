import React, { useState, useEffect } from 'react';
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
  Key,
  Lock,
  Eye,
  EyeOff,
  Check,
  Sparkles,
  ShieldCheck,
  X
} from 'lucide-react';
import { UserProfile, Asignatura } from '../types';
import { asignaturasMock, cursosMock, currentUserProfesorPremilitar } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

const STORAGE_KEY_PROFESORES = 'sysget_profesores_list';
const STORAGE_KEY_PASSWORDS = 'sysget_custom_passwords';

interface PasswordModalProps {
  isOpen: boolean;
  profesor: UserProfile | null;
  onClose: () => void;
  onSuccess: (profId: string, newPass: string) => void;
}

const PasswordModal: React.FC<PasswordModalProps> = ({ isOpen, profesor, onClose, onSuccess }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !profesor) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    onSuccess(profesor.id, newPassword);
    setNewPassword('');
    setConfirmPassword('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-md p-6 space-y-5">
        <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="p-2.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-2xl">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Restablecer Contraseña
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Profesor: <strong>{profesor.nombre} {profesor.apellido}</strong> ({profesor.email})
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Nueva Contraseña
            </label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="w-full pl-4 pr-10 py-2.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Confirmar Nueva Contraseña
            </label>
            <input
              type={showPass ? 'text' : 'password'}
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="Repite la nueva contraseña"
              className="w-full px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
            <span className="font-semibold block text-slate-700 dark:text-slate-300">Nota de Seguridad:</span>
            <p>El docente podrá utilizar esta contraseña en su próximo inicio de sesión en Sysget Saber.</p>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-500 shadow-md shadow-amber-600/20 transition-all"
            >
              Actualizar Contraseña
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface ProfesorFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (p: UserProfile) => void;
  editProfesor?: UserProfile | null;
  asignaturas?: Asignatura[];
  onNavigateToConfig?: () => void;
}

const ProfesorFormModal: React.FC<ProfesorFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editProfesor,
  asignaturas = asignaturasMock,
  onNavigateToConfig
}) => {
  const [form, setForm] = useState<Partial<UserProfile>>({
    rut: '',
    nombre: '',
    apellido: '',
    email: '',
    rol: 'profesor',
    establecimiento: 'Liceo Bicentenario Los Andes',
    asignaturaId: asignaturas[0]?.id || 'asig-1',
    asignaturaNombre: asignaturas[0]?.nombre || 'Matemática',
    cargo: `Docente de ${asignaturas[0]?.nombre || 'Matemática'}`
  });

  const [tempPassword, setTempPassword] = useState('demo1234');

  // Sync state whenever editProfesor or isOpen changes
  useEffect(() => {
    if (editProfesor) {
      setForm({
        ...editProfesor,
        asignaturaId: editProfesor.asignaturaId || asignaturas[0]?.id || 'asig-1',
        asignaturaNombre: editProfesor.asignaturaNombre || asignaturas[0]?.nombre || 'Matemática',
        establecimiento: editProfesor.establecimiento || 'Liceo Bicentenario Los Andes'
      });
    } else {
      setForm({
        rut: '',
        nombre: '',
        apellido: '',
        email: '',
        rol: 'profesor',
        establecimiento: 'Liceo Bicentenario Los Andes',
        asignaturaId: asignaturas[0]?.id || 'asig-1',
        asignaturaNombre: asignaturas[0]?.nombre || 'Matemática',
        cargo: `Docente de ${asignaturas[0]?.nombre || 'Matemática'}`
      });
      setTempPassword('demo1234');
    }
  }, [editProfesor, isOpen, asignaturas]);

  if (!isOpen) return null;

  const handleAsignaturaChange = (asigId: string) => {
    const selected = asignaturas.find(a => a.id === asigId);
    setForm(prev => ({
      ...prev,
      asignaturaId: asigId,
      asignaturaNombre: selected?.nombre || '',
      cargo: `Docente de ${selected?.nombre || 'Especialidad'}`
    }));
  };

  const handleSave = () => {
    if (!form.rut || !form.nombre || !form.apellido || !form.email) return;
    const selectedAsig = asignaturas.find(a => a.id === form.asignaturaId);
    onSave({
      id: editProfesor?.id || `prof-${Date.now()}`,
      rut: form.rut!,
      nombre: form.nombre!,
      apellido: form.apellido!,
      email: form.email!,
      rol: 'profesor',
      establecimiento: form.establecimiento || 'Liceo Bicentenario Los Andes',
      asignaturaId: form.asignaturaId || asignaturas[0]?.id || 'asig-1',
      asignaturaNombre: selectedAsig?.nombre || form.asignaturaNombre || asignaturas[0]?.nombre || 'Matemática',
      cargo: form.cargo || `Docente de ${selectedAsig?.nombre || 'Especialidad'}`
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-xl p-4 sm:p-5 flex flex-col my-auto text-left max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                {editProfesor ? `Editar Perfil: ${editProfesor.nombre} ${editProfesor.apellido}` : 'Registrar Nuevo Docente'}
              </h3>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                {editProfesor ? 'Actualiza los datos de especialidad y contacto' : 'Asigna especialidad curricular y credenciales'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body - 2 Compact Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-left flex-1 overflow-y-auto pr-0.5">
          {/* Col 1 */}
          <div className="space-y-2">
            <div className="space-y-0.5">
              <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Nombre
              </label>
              <input
                type="text"
                value={form.nombre || ''}
                onChange={e => setForm(prev => ({ ...prev, nombre: e.target.value }))}
                placeholder="Ej. Patricia"
                className="w-full px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
              />
            </div>

            <div className="space-y-0.5">
              <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                RUT Docente
              </label>
              <input
                type="text"
                value={form.rut || ''}
                onChange={e => setForm(prev => ({ ...prev, rut: e.target.value }))}
                placeholder="13.456.789-0"
                className="w-full px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-mono font-medium"
              />
            </div>

            <div className="space-y-0.5">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Especialidad
                </label>
                {onNavigateToConfig && (
                  <button
                    type="button"
                    onClick={() => { onClose(); onNavigateToConfig(); }}
                    className="text-[9px] text-indigo-500 hover:underline font-semibold"
                  >
                    + Catálogo
                  </button>
                )}
              </div>
              <select
                value={form.asignaturaId || asignaturas[0]?.id || 'asig-1'}
                onChange={e => handleAsignaturaChange(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-bold text-indigo-600 dark:text-indigo-400"
              >
                {asignaturas.map(asig => (
                  <option key={asig.id} value={asig.id}>
                    {asig.codigo === 'MAT' ? '📐' : asig.codigo === 'CN' ? '🔬' : asig.codigo === 'LEN' ? '📖' : asig.codigo === 'HIST' ? '🏛️' : '📚'} {asig.nombre} ({asig.codigo})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-0.5">
              <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Establecimiento
              </label>
              <input
                type="text"
                value={form.establecimiento || 'Liceo Bicentenario Los Andes'}
                onChange={e => setForm(prev => ({ ...prev, establecimiento: e.target.value }))}
                placeholder="Nombre del colegio"
                className="w-full px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>

          {/* Col 2 */}
          <div className="space-y-2">
            <div className="space-y-0.5">
              <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Apellido
              </label>
              <input
                type="text"
                value={form.apellido || ''}
                onChange={e => setForm(prev => ({ ...prev, apellido: e.target.value }))}
                placeholder="Ej. Muñoz"
                className="w-full px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
              />
            </div>

            <div className="space-y-0.5">
              <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Correo Institucional
              </label>
              <input
                type="email"
                value={form.email || ''}
                onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
                placeholder="patricia.munoz@escuelademo.cl"
                className="w-full px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
              />
            </div>

            <div className="space-y-0.5">
              <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Cargo / Nivel Pedagógico
              </label>
              <input
                type="text"
                value={form.cargo || ''}
                onChange={e => setForm(prev => ({ ...prev, cargo: e.target.value }))}
                placeholder="Ej. Docente 6° a 8° Básico"
                className="w-full px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>

            {!editProfesor ? (
              <div className="space-y-0.5">
                <label className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Contraseña Inicial
                </label>
                <input
                  type="text"
                  value={tempPassword}
                  onChange={e => setTempPassword(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs bg-indigo-500/10 dark:bg-slate-950 border border-indigo-500/30 rounded-lg font-mono text-indigo-600 dark:text-indigo-300 font-bold"
                />
              </div>
            ) : (
              <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                💡 <strong className="text-slate-700 dark:text-slate-300">Contraseña:</strong> Usa "Restablecer Contraseña" desde el menú de la tabla.
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-2.5 mt-2.5 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/20 transition-all hover:scale-105 active:scale-95"
          >
            {editProfesor ? 'Guardar Cambios' : 'Registrar Docente'}
          </button>
        </div>
      </div>
    </div>
  );
};

interface ProfesoresPageProps {
  asignaturas?: Asignatura[];
  onNavigateToConfig?: () => void;
}

export const ProfesoresPage: React.FC<ProfesoresPageProps> = ({
  asignaturas = asignaturasMock,
  onNavigateToConfig
}) => {
  // Inicializar desde localStorage para que las eliminaciones y adiciones persistan al refrescar
  const [profesores, setProfesores] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PROFESORES);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (err) {
        console.error('Error cargando profesores desde localStorage:', err);
      }
    }
    // Lista inicial limpia oficial: únicamente María Teresa González
    return [currentUserProfesorPremilitar];
  });

  const [search, setSearch] = useState('');
  const [filterAsignatura, setFilterAsignatura] = useState<string>('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProfesor, setEditingProfesor] = useState<UserProfile | null>(null);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [selectedProfesorForPassword, setSelectedProfesorForPassword] = useState<UserProfile | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const filtered = profesores.filter(p => {
    const matchQuery = `${p.nombre} ${p.apellido} ${p.email} ${p.rut} ${p.cargo || ''}`.toLowerCase().includes(search.toLowerCase());
    const matchAsig = filterAsignatura ? p.asignaturaId === filterAsignatura : true;
    return matchQuery && matchAsig;
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSave = (prof: UserProfile) => {
    setProfesores(prev => {
      const exists = prev.find(p => p.id === prof.id);
      const updated = exists ? prev.map(p => p.id === prof.id ? prof : p) : [prof, ...prev];
      localStorage.setItem(STORAGE_KEY_PROFESORES, JSON.stringify(updated));
      return updated;
    });
    setEditingProfesor(null);
    showToast(`Docente ${prof.nombre} ${prof.apellido} guardado correctamente.`);
  };

  const handleDelete = (id: string) => {
    const p = profesores.find(item => item.id === id);
    setProfesores(prev => {
      const updated = prev.filter(item => item.id !== id);
      localStorage.setItem(STORAGE_KEY_PROFESORES, JSON.stringify(updated));
      return updated;
    });
    setActiveMenuId(null);
    if (p) showToast(`Docente ${p.nombre} ${p.apellido} eliminado.`);
  };

  const handlePasswordResetSuccess = (profId: string, newPass: string) => {
    const prof = profesores.find(p => p.id === profId);
    if (prof) {
      try {
        const passwordsMap = JSON.parse(localStorage.getItem(STORAGE_KEY_PASSWORDS) || '{}');
        passwordsMap[prof.email.toLowerCase().trim()] = newPass;
        localStorage.setItem(STORAGE_KEY_PASSWORDS, JSON.stringify(passwordsMap));
        showToast(`Contraseña de ${prof.nombre} ${prof.apellido} actualizada exitosamente.`);
      } catch (err) {
        console.error('Error guardando contraseña en localStorage:', err);
      }
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Feedback Toast */}
      {toastMessage && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 px-4 py-3 rounded-2xl flex items-center gap-2.5 text-xs font-bold shadow-lg animate-fade-in">
          <Check className="w-4 h-4 text-emerald-500" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-indigo-500" /> Gestión del Equipo Docente
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {profesores.length} docentes registrados con especialidad curricular y aislamiento pedagógico
          </p>
        </div>
        <button
          onClick={() => { setEditingProfesor(null); setModalOpen(true); }}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md shadow-indigo-600/20 transition-all active:scale-[0.98]"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Agregar Docente</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="glass-card p-4 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por nombre, especialidad, correo o RUT..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        {/* Asignatura filter */}
        <select
          value={filterAsignatura}
          onChange={e => setFilterAsignatura(e.target.value)}
          className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 font-semibold w-full sm:w-auto"
        >
          <option value="">Todas las Especialidades</option>
          {asignaturas.map(a => (
            <option key={a.id} value={a.id}>{a.nombre}</option>
          ))}
        </select>

        <div className="text-xs text-slate-500 whitespace-nowrap font-medium hidden sm:block">
          {filtered.length} docentes
        </div>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
                <th className="py-3.5 px-5 text-slate-500 uppercase tracking-wider font-semibold">Docente</th>
                <th className="py-3.5 px-5 text-slate-500 uppercase tracking-wider font-semibold">Especialidad</th>
                <th className="py-3.5 px-5 text-slate-500 uppercase tracking-wider font-semibold hidden sm:table-cell">RUT</th>
                <th className="py-3.5 px-5 text-slate-500 uppercase tracking-wider font-semibold hidden md:table-cell">Correo</th>
                <th className="py-3.5 px-5 text-slate-500 uppercase tracking-wider font-semibold hidden lg:table-cell">Cargo / Nivel</th>
                <th className="py-3.5 px-5 text-slate-500 uppercase tracking-wider font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <GraduationCap className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-slate-500">No se encontraron profesores</p>
                    <p className="text-xs text-slate-400 mt-1">Ajusta los filtros o agrega un nuevo docente</p>
                  </td>
                </tr>
              ) : filtered.map(prof => {
                const asigName = prof.asignaturaNombre || (prof.asignaturaId === 'asig-1' ? 'Matemática' : prof.asignaturaId === 'asig-2' ? 'Lenguaje y Comunicación' : 'Ciencias Naturales');
                let asigBadgeColor = 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20';
                let asigIcon = '📐';
                if (prof.asignaturaId === 'asig-3' || asigName.toLowerCase().includes('ciencia')) {
                  asigBadgeColor = 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20';
                  asigIcon = '🔬';
                } else if (prof.asignaturaId === 'asig-2' || asigName.toLowerCase().includes('lenguaje')) {
                  asigBadgeColor = 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20';
                  asigIcon = '📖';
                }

                return (
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

                    {/* Specialty Badge */}
                    <td className="py-3.5 px-5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border ${asigBadgeColor}`}>
                        <span>{asigIcon}</span>
                        <span>{asigName}</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-5 text-slate-600 dark:text-slate-400 hidden sm:table-cell font-mono">
                      {prof.rut}
                    </td>

                    <td className="py-3.5 px-5 hidden md:table-cell">
                      <a href={`mailto:${prof.email}`} className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:underline">
                        <Mail className="w-3 h-3" /> {prof.email}
                      </a>
                    </td>

                    <td className="py-3.5 px-5 hidden lg:table-cell text-slate-600 dark:text-slate-400 text-xs">
                      {prof.cargo || `Docente de ${asigName}`}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 relative">
                      <div className="flex items-center gap-1">
                        {/* Quick Password Reset Button */}
                        <button
                          onClick={() => { setSelectedProfesorForPassword(prof); setPasswordModalOpen(true); }}
                          className="p-1.5 rounded-lg text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 transition-colors"
                          title="Restablecer o Cambiar Contraseña"
                        >
                          <Key className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => setActiveMenuId(activeMenuId === prof.id ? null : prof.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>

                      {activeMenuId === prof.id && (
                        <div className="absolute right-4 top-10 z-20 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl py-1 animate-fade-in">
                          <button
                            onClick={() => { setEditingProfesor(prof); setModalOpen(true); setActiveMenuId(null); }}
                            className="w-full flex items-center gap-2 px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5 text-indigo-500" /> Editar Especialidad
                          </button>

                          <button
                            onClick={() => { setSelectedProfesorForPassword(prof); setPasswordModalOpen(true); setActiveMenuId(null); }}
                            className="w-full flex items-center gap-2 px-4 py-2 text-xs text-amber-600 dark:text-amber-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                          >
                            <Key className="w-3.5 h-3.5" /> Cambiar Contraseña
                          </button>

                          <div className="border-t border-slate-100 dark:border-slate-800 my-1" />
                          <button
                            onClick={() => handleDelete(prof.id)}
                            className="w-full flex items-center gap-2 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Eliminar Docente
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / Add Modal */}
      <ProfesorFormModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditingProfesor(null); }}
        onSave={handleSave}
        editProfesor={editingProfesor}
        asignaturas={asignaturas}
        onNavigateToConfig={onNavigateToConfig}
      />

      {/* Password Reset Modal */}
      <PasswordModal
        isOpen={passwordModalOpen}
        profesor={selectedProfesorForPassword}
        onClose={() => { setPasswordModalOpen(false); setSelectedProfesorForPassword(null); }}
        onSuccess={handlePasswordResetSuccess}
      />
    </div>
  );
};
