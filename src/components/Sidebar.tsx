import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  GraduationCap,
  Library,
  Layers,
  Settings,
  LogOut,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  UserCheck
} from 'lucide-react';

export type PageId =
  | 'dashboard'
  | 'evaluaciones'
  | 'cursos'
  | 'alumnos'
  | 'profesores'
  | 'banco-preguntas'
  | 'usuarios'
  | 'configuracion';

interface SidebarProps {
  activePage: PageId;
  onNavigate: (page: PageId) => void;
  collapsed?: boolean;
}

interface NavItem {
  id: PageId;
  label: string;
  icon: React.ReactNode;
  badge?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ activePage, onNavigate }) => {
  const { user, usuarios, logout } = useAuth();
  
  const pendientesCount = usuarios.filter(u => u.estado === 'pendiente_aprobacion').length;

  const NAV_ITEMS_ADMIN: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard General', icon: <LayoutDashboard className="w-4.5 h-4.5" /> },
    { id: 'evaluaciones', label: 'Todas las Evaluaciones', icon: <BookOpen className="w-4.5 h-4.5" /> },
    { id: 'cursos', label: 'Gestión de Cursos', icon: <Layers className="w-4.5 h-4.5" /> },
    { id: 'alumnos', label: 'Alumnos Matriculados', icon: <Users className="w-4.5 h-4.5" /> },
    { id: 'profesores', label: 'Equipo Docente', icon: <GraduationCap className="w-4.5 h-4.5" /> },
    { id: 'banco-preguntas', label: 'Banco de Preguntas', icon: <Library className="w-4.5 h-4.5" /> },
    {
      id: 'usuarios',
      label: 'Gestión de Usuarios',
      icon: <UserCheck className="w-4.5 h-4.5" />,
      badge: pendientesCount > 0 ? `${pendientesCount} pend.` : undefined
    },
    { id: 'configuracion', label: 'Configuración Global', icon: <Settings className="w-4.5 h-4.5" /> },
  ];

  const NAV_ITEMS_PROFESOR: NavItem[] = [
    { id: 'dashboard', label: 'Mi Dashboard', icon: <LayoutDashboard className="w-4.5 h-4.5" /> },
    { id: 'evaluaciones', label: 'Mis Evaluaciones', icon: <BookOpen className="w-4.5 h-4.5" /> },
    { id: 'cursos', label: 'Mis Cursos', icon: <Layers className="w-4.5 h-4.5" /> },
    { id: 'alumnos', label: 'Mis Alumnos', icon: <Users className="w-4.5 h-4.5" /> },
    { id: 'banco-preguntas', label: 'Banco de mi Materia', icon: <Library className="w-4.5 h-4.5" /> },
  ];

  const NAV_ITEMS_ALUMNO: NavItem[] = [
    { id: 'dashboard', label: 'Mis Evaluaciones', icon: <BookOpen className="w-4.5 h-4.5" /> },
  ];

  let items: NavItem[];
  if (user?.rol === 'admin') {
    items = NAV_ITEMS_ADMIN;
  } else if (user?.rol === 'profesor') {
    items = NAV_ITEMS_PROFESOR;
  } else {
    items = NAV_ITEMS_ALUMNO;
  }



  return (
    <aside className="hidden lg:flex flex-col w-64 min-h-screen bg-slate-900 border-r border-slate-800 py-6 px-4 fixed left-0 top-0 z-30">
      {/* Logo */}
      <div className="px-2 mb-8">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-600 rounded-xl shadow-md">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <span className="font-extrabold text-lg text-white tracking-tight">
            Sysget<span className="text-indigo-400">Saber</span>
          </span>
        </div>
        <div className="mt-1 ml-1 flex items-center gap-1 text-[11px] text-slate-500">
          <Sparkles className="w-3 h-3 text-amber-500" />
          <span>Plataforma de Evaluaciones — Chile</span>
        </div>
      </div>

      {/* User Profile Card */}
      <div className="px-2 mb-6">
        <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-md">
            {user?.nombre?.[0]}{user?.apellido?.[0]}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-white truncate">{user?.nombre} {user?.apellido}</p>
            <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
            <div className="flex items-center gap-1 mt-0.5 flex-wrap">
              <span className={`inline-block px-1.5 py-0.5 text-[10px] font-bold rounded-md capitalize ${
                user?.rol === 'admin'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : user?.rol === 'profesor'
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              }`}>
                {user?.rol === 'admin' ? '👑 Admin UTP' : user?.rol === 'profesor' ? 'Docente' : 'Alumno'}
              </span>
              {user?.asignaturaNombre && (
                <span className="inline-block px-1.5 py-0.5 bg-sky-500/20 text-sky-300 border border-sky-500/30 text-[10px] font-bold rounded-md truncate max-w-[120px]">
                  {user.asignaturaNombre}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>


      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-1">
        {items.map(item => (
          <button
            key={item.id}
            onClick={() => !('badge' in item && item.badge === 'Pronto') && onNavigate(item.id)}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
              activePage === item.id
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : item.badge === 'Pronto'
                ? 'text-slate-600 cursor-not-allowed'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {item.icon}
              <span>{item.label}</span>
            </div>
            {item.badge ? (
              <span className="text-[10px] px-1.5 py-0.5 bg-slate-700 text-slate-500 rounded-md">{item.badge}</span>
            ) : activePage === item.id ? (
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            ) : null}
          </button>
        ))}
      </nav>

      {/* Establecimiento badge */}
      <div className="px-2 mt-4 mb-2">
        <div className="px-3 py-2 bg-slate-800/60 rounded-xl border border-slate-700/40 text-[11px] text-slate-400 truncate">
          🏫 {user?.establecimiento}
        </div>
      </div>

      {/* Logout */}
      <div className="px-2">
        <button
          onClick={logout}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
};
