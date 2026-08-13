import React from 'react';
import { UserProfile } from '../types';
import {
  GraduationCap,
  BookOpen,
  UserCheck,
  Moon,
  Sun,
  School,
  Sparkles
} from 'lucide-react';

interface NavbarProps {
  user: UserProfile;
  onRoleChange: (role: 'profesor' | 'alumno') => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  onRoleChange,
  darkMode,
  onToggleDarkMode
}) => {
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
                Plataforma Docente de Evaluaciones, Tabulación & Planes de Reforzamiento
              </p>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* School badge */}
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 text-xs font-medium border border-slate-200 dark:border-slate-700">
              <School className="w-3.5 h-3.5 text-indigo-500" />
              <span>{user.establecimiento}</span>
            </div>

            {/* Role Switcher */}
            <div className="flex items-center bg-slate-200/80 dark:bg-slate-800 p-1 rounded-xl border border-slate-300/50 dark:border-slate-700">
              <button
                onClick={() => onRoleChange('profesor')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  user.rol === 'profesor'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Profesor</span>
              </button>
              <button
                onClick={() => onRoleChange('alumno')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  user.rol === 'alumno'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Alumno</span>
              </button>
            </div>

            {/* Dark mode toggle */}
            <button
              onClick={onToggleDarkMode}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Cambiar tema"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
