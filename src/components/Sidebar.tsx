import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { establecimientosCatalog, currentUserProfesorPremilitar } from '../data/mockData';
import { UserProfile } from '../types';
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
  ChevronDown,
  Sparkles,
  UserCheck,
  School,
  Building2,
  User
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
  isSandboxMode?: boolean;
}

interface NavItem {
  id: PageId;
  label: string;
  icon: React.ReactNode;
  badge?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ activePage, onNavigate, isSandboxMode = false }) => {
  const { user, usuarios, docentesReales, adminBaseProfile, logout, switchRole, switchToDocente } = useAuth();
  const [expandedRbd, setExpandedRbd] = useState<string | null>('31030');
  
  const pendientesCount = usuarios.filter(u => u.estado === 'pendiente_aprobacion').length;

  const isProductionAdmin = !isSandboxMode && (user?.email === 'leontestvirtual1@gmail.com' || user?.email === 'leontesvirtual1@gmail.com' || adminBaseProfile?.email === 'leontestvirtual1@gmail.com');
  const isSupervisingDocente = user?.rol === 'profesor' && adminBaseProfile?.email === 'leontestvirtual1@gmail.com';

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

  // Agrupación dinámica de colegios y sus docentes para el Super Admin
  const colegiosMap = new Map<string, { rbd: string; nombre: string; logoUrl?: string; docentes: UserProfile[] }>();
  
  establecimientosCatalog.forEach(e => {
    colegiosMap.set(e.rbd || e.nombre, {
      rbd: e.rbd || '31030',
      nombre: e.nombre,
      logoUrl: e.logoUrl,
      docentes: []
    });
  });

  const listaDocentes = docentesReales.length > 0 ? docentesReales : [currentUserProfesorPremilitar];
  listaDocentes.forEach(d => {
    const key = d.rbd || d.establecimiento;
    if (colegiosMap.has(key)) {
      const existing = colegiosMap.get(key)!;
      if (!existing.docentes.some(doc => doc.id === d.id || doc.email === d.email)) {
        existing.docentes.push(d);
      }
    } else {
      colegiosMap.set(key, {
        rbd: d.rbd || '31030',
        nombre: d.establecimiento,
        logoUrl: d.logoUrl,
        docentes: [d]
      });
    }
  });

  return (
    <aside className="hidden lg:flex flex-col w-64 min-h-screen bg-slate-900 border-r border-slate-800 py-5 px-3.5 fixed left-0 top-0 z-30">
      {/* Logo */}
      <div className="px-2 mb-6">
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
      <div className="px-1 mb-5">
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
      <nav className="space-y-1 px-1">
        {items.map(item => (
          <button
            key={item.id}
            onClick={() => !('badge' in item && item.badge === 'Pronto') && onNavigate(item.id)}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all group ${
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

      {/* ÁRBOL DINÁMICO DE ESTABLECIMIENTOS Y DOCENTES — Exclusivo para Super Admin Producción */}
      {isProductionAdmin && (
        <div className="px-1 mt-4 pt-3 border-t border-slate-800 flex-1 flex flex-col min-h-0">
          {isSupervisingDocente && (
            <button
              onClick={() => switchRole('admin', 'prod')}
              className="w-full mb-3 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition-all shadow-sm"
            >
              <span>👑 Volver a Vista Admin</span>
            </button>
          )}

          <div className="flex items-center justify-between px-2 mb-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
            <span className="flex items-center gap-1">
              <School className="w-3 h-3 text-indigo-400" />
              Establecimientos ({colegiosMap.size})
            </span>
            <button
              onClick={() => onNavigate('profesores')}
              className="text-[10px] text-indigo-400 hover:underline lowercase font-normal"
              title="Gestionar Profesores y Colegios"
            >
              + nuevo
            </button>
          </div>

          <div className="space-y-1.5 overflow-y-auto flex-1 pr-1">
            {Array.from(colegiosMap.values()).map(col => {
              const isExpanded = expandedRbd === col.rbd;
              return (
                <div key={col.rbd} className="rounded-xl bg-slate-800/50 border border-slate-700/50 overflow-hidden">
                  <button
                    onClick={() => setExpandedRbd(isExpanded ? null : col.rbd)}
                    className="w-full flex items-center justify-between p-2 text-left hover:bg-slate-800 transition-colors"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {col.logoUrl ? (
                        <img src={col.logoUrl} alt="" className="w-4 h-4 object-contain rounded shrink-0" />
                      ) : (
                        <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                      )}
                      <span className="text-[11px] font-bold text-slate-200 truncate">{col.nombre}</span>
                    </div>
                    <ChevronDown className={`w-3 h-3 text-slate-400 shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </button>

                  {isExpanded && (
                    <div className="bg-slate-950/50 p-1.5 space-y-1 border-t border-slate-800/70">
                      {col.docentes.length === 0 ? (
                        <div className="text-[10px] text-slate-500 px-2 py-1 italic">
                          Sin docentes asignados aún.
                        </div>
                      ) : (
                        col.docentes.map(doc => {
                          const isCurrent = user?.id === doc.id || user?.email === doc.email;
                          return (
                            <button
                              key={doc.id}
                              onClick={() => switchToDocente(doc.id)}
                              className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-[11px] transition-all text-left ${
                                isCurrent
                                  ? 'bg-indigo-600 text-white font-bold shadow-sm'
                                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                              }`}
                              title={`Supervisar a ${doc.nombre} ${doc.apellido} (${doc.asignaturaNombre || 'Docente'})`}
                            >
                              <div className="flex items-center gap-1.5 truncate">
                                <User className="w-3 h-3 text-indigo-400 shrink-0" />
                                <span className="truncate">{doc.nombre} {doc.apellido}</span>
                              </div>
                              <span className="text-[9px] px-1 py-0.5 rounded bg-slate-800 text-slate-400 truncate max-w-[65px]">
                                {doc.asignaturaNombre?.split(' ')[0] || 'Docente'}
                              </span>
                            </button>
                          );
                        })
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Logout */}
      <div className="px-1 mt-auto pt-3 border-t border-slate-800/80">
        <button
          onClick={logout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
};
