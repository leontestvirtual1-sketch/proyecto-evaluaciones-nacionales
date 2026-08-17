import { UserProfile, UserRole } from '../types';
import { establecimientosCatalog } from '../data/mockData';
import {
  GraduationCap,
  BookOpen,
  UserCheck,
  Moon,
  Sun,
  School,
  Sparkles,
  Home,
  ShieldAlert,
  LogOut
} from 'lucide-react';

interface NavbarProps {
  user: UserProfile;
  onRoleChange: (role: UserRole, extra?: 'ciencias' | 'matematica' | 'lenguaje' | 'premilitar') => void;
  onGoToLanding?: () => void;
  onLogout?: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  onRoleChange,
  onGoToLanding,
  onLogout,
  darkMode,
  onToggleDarkMode
}) => {
  const schoolLogo = user.logoUrl || establecimientosCatalog.find(
    e => (user.rbd && e.rbd === user.rbd) || e.nombre.toLowerCase().includes(user.establecimiento.toLowerCase())
  )?.logoUrl;

  return (
    <header className="sticky top-0 z-40 glass-nav border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600 rounded-xl text-white shadow-md shadow-indigo-600/30 flex items-center justify-center">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 dark:text-white">
                  Sysget<span className="text-indigo-600 dark:text-indigo-400">Saber</span>
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                  <Sparkles className="w-3 h-3 mr-1" /> Chile 2026
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                Evaluaciones Nacionales, Aislamiento por Especialidad & Analítica SIMCE
              </p>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2.5">
            {/* Go to Landing button */}
            {onGoToLanding && (
              <button
                onClick={onGoToLanding}
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-all"
                title="Ver Landing Page de Sysget Saber"
              >
                <Home className="w-3.5 h-3.5 text-indigo-500" />
                <span>Landing</span>
              </button>
            )}

            {/* School badge with dynamic logo (Solo para docentes y alumnos, no para Super Admin) */}
            {user.rol !== 'admin' && (
              <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 text-xs font-semibold border border-slate-200 dark:border-slate-700 truncate max-w-[260px]">
                {schoolLogo ? (
                  <img src={schoolLogo} alt="Logo" className="w-5 h-5 object-contain rounded shrink-0" />
                ) : (
                  <School className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                )}
                <span className="truncate">{user.establecimiento}</span>
              </div>
            )}

            {/* Fast Role Switcher ONLY for Demo Supervisor session OR Return button for Production Admin */}
            {(() => {
              const sessionEmail = localStorage.getItem('sysget_session_email')?.toLowerCase() || '';
              const isProductionAdmin = sessionEmail === 'leontestvirtual1@gmail.com' || sessionEmail === 'leontesvirtual1@gmail.com' || user.email === 'leontestvirtual1@gmail.com';
              const isDemoAdmin = sessionEmail === 'admin@sysget.cl' || user.email === 'admin@sysget.cl';

              if (isProductionAdmin) {
                // Para Admin de Producción: solo mostrar botón volver si está supervisando a un docente
                if (user.rol === 'profesor') {
                  return (
                    <button
                      onClick={() => onRoleChange('admin')}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-md shadow-amber-600/30 transition-all"
                      title="Volver a la vista del Administrador de Producción"
                    >
                      <span>👑 Volver a Admin UTP</span>
                    </button>
                  );
                }
                return (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-xs font-bold">
                    <span>👑 Super Admin UTP</span>
                  </div>
                );
              }

              if (isDemoAdmin || user.rol === 'admin') {
                return (
                  <div className="flex items-center bg-slate-200/80 dark:bg-slate-800 p-1 rounded-xl border border-slate-300/50 dark:border-slate-700 text-xs font-semibold">
                    <button
                      onClick={() => onRoleChange('admin')}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
                        user.rol === 'admin'
                          ? 'bg-amber-600 text-white shadow-sm font-bold'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                      title="Administrador General / UTP Demo"
                    >
                      <span>👑 Admin UTP</span>
                    </button>

                    <button
                      onClick={() => onRoleChange('profesor', 'matematica')}
                      className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-all ${
                        user.rol === 'profesor' && user.asignaturaId === 'asig-1'
                          ? 'bg-indigo-600 text-white shadow-sm font-bold'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                      title="Ver vista como Docente de Matemática (María González)"
                    >
                      <span>📐 Mat</span>
                    </button>

                    <button
                      onClick={() => onRoleChange('profesor', 'ciencias')}
                      className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-all ${
                        user.rol === 'profesor' && user.asignaturaId === 'asig-3'
                          ? 'bg-indigo-600 text-white shadow-sm font-bold'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                      title="Ver vista como Docente de Ciencias Naturales (Patricia Muñoz)"
                    >
                      <span>🔬 C. Nat</span>
                    </button>

                    <button
                      onClick={() => onRoleChange('profesor', 'lenguaje')}
                      className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-all ${
                        user.rol === 'profesor' && user.asignaturaId === 'asig-2'
                          ? 'bg-indigo-600 text-white shadow-sm font-bold'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                      title="Ver vista como Docente de Lenguaje (Carlos Morales)"
                    >
                      <span>📖 Leng</span>
                    </button>

                    <button
                      onClick={() => onRoleChange('alumno')}
                      className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-all ${
                        user.rol === 'alumno'
                          ? 'bg-emerald-600 text-white shadow-sm font-bold'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                      title="Ver vista como Alumno (Pedro Soto)"
                    >
                      <span>🎓 Alumno</span>
                    </button>
                  </div>
                );
              }

              if (user.rol === 'alumno') {
                return (
                  <div className="flex items-center gap-2 bg-emerald-500/10 dark:bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-500/30 text-xs font-bold text-emerald-700 dark:text-emerald-300 shadow-sm">
                    <span>🎓</span>
                    <span>Estudiante: <strong>{user.nombre} {user.apellido}</strong></span>
                  </div>
                );
              }

              return null;
            })()}

            {/* Dark mode toggle */}
            <button
              onClick={onToggleDarkMode}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Cambiar tema"
            >
              {darkMode ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
            </button>

            {/* Logout / Salir button */}
            {onLogout && (
              <button
                onClick={onLogout}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-slate-500 hover:text-rose-500 dark:text-slate-400 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-semibold border border-transparent hover:border-rose-500/20 transition-all"
                title="Cerrar sesión / Salir al Login"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Salir</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};


