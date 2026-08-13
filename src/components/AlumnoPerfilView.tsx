import React, { useState } from 'react';
import { UserProfile, RendicionPrueba } from '../types';
import {
  User,
  Mail,
  GraduationCap,
  Building2,
  Award,
  BookOpen,
  CheckCircle2,
  Moon,
  Sun,
  Save,
  Check,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  FileSpreadsheet
} from 'lucide-react';

interface AlumnoPerfilViewProps {
  alumno: UserProfile;
  historialRendiciones: RendicionPrueba[];
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const AlumnoPerfilView: React.FC<AlumnoPerfilViewProps> = ({
  alumno,
  historialRendiciones,
  darkMode,
  onToggleDarkMode
}) => {
  const [nombre, setNombre] = useState(alumno.nombre);
  const [apellido, setApellido] = useState(alumno.apellido);
  const [email, setEmail] = useState(alumno.email);
  const [rut] = useState(alumno.rut);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const totalRendidas = historialRendiciones.length;
  const promedioLogro = totalRendidas > 0
    ? Math.round(historialRendiciones.reduce((acc, r) => acc + r.porcentajeLogro, 0) / totalRendidas)
    : 0;
  const promedioPuntajeNacional = totalRendidas > 0
    ? Math.round(historialRendiciones.reduce((acc, r) => acc + r.puntajeEscalaNacional, 0) / totalRendidas)
    : 0;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12 max-w-5xl mx-auto">
      {/* Save Success Toast */}
      {savedSuccess && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-emerald-500/40 flex items-center gap-2 animate-bounce-short text-xs font-semibold">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>¡Datos de perfil guardados correctamente!</span>
        </div>
      )}

      {/* Profile Header Banner */}
      <div className="glass-card p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-indigo-500/20 text-white relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-500 via-violet-600 to-amber-400 p-0.5 shadow-xl flex-shrink-0">
              <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center text-2xl font-black text-white">
                {nombre[0]}{apellido[0]}
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Estudiante — 8° Básico A
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Cuenta Verificada
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                {nombre} {apellido}
              </h1>
              <p className="text-xs text-slate-300 flex items-center gap-2">
                <span>RUT: <strong>{rut}</strong></span>
                <span>•</span>
                <span>{email}</span>
              </p>
            </div>
          </div>

          <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700/60 text-xs space-y-1 text-slate-300">
            <p className="font-semibold text-slate-200 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-indigo-400" /> {alumno.establecimiento}
            </p>
            <p className="text-[11px] text-slate-400">Año Académico: <strong>2026 — Chile</strong></p>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-5 flex items-center gap-4">
          <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-2xl border border-indigo-500/20">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Evaluaciones Rendidas</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white">{totalRendidas}</p>
          </div>
        </div>

        <div className="glass-card p-5 flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl border border-emerald-500/20">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">% Logro Promedio</p>
            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{promedioLogro}%</p>
          </div>
        </div>

        <div className="glass-card p-5 flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 text-amber-500 rounded-2xl border border-amber-500/20">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Escala Nacional Promedio</p>
            <p className="text-2xl font-black text-amber-600 dark:text-amber-400">{promedioPuntajeNacional} pts</p>
          </div>
        </div>
      </div>

      {/* Edit Form & Appearance Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Edit Form */}
        <form onSubmit={handleSave} className="lg:col-span-2 glass-card p-6 sm:p-8 space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <User className="w-5 h-5 text-indigo-500" />
              Información Personal del Estudiante
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Actualiza tus nombres y datos de contacto registrados en la plataforma.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Nombres</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Apellidos</label>
              <input
                type="text"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">RUT Estudiante</label>
              <input
                type="text"
                value={rut}
                disabled
                className="w-full px-3.5 py-2.5 text-xs bg-slate-100 dark:bg-slate-900 text-slate-500 border border-slate-300 dark:border-slate-800 rounded-xl cursor-not-allowed"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Correo Electrónico</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md transition-all active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Cambios de Perfil</span>
            </button>
          </div>
        </form>

        {/* Theme Settings Sidebar */}
        <div className="space-y-6">
          <div className="glass-card p-6 space-y-4">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Preferencia de Tema Visual
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Alterna entre el modo oscuro y modo claro según tus preferencias de estudio.
            </p>

            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {darkMode ? <Moon className="w-5 h-5 text-indigo-400" /> : <Sun className="w-5 h-5 text-amber-500" />}
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {darkMode ? 'Modo Oscuro' : 'Modo Claro'}
                </span>
              </div>

              <button
                type="button"
                onClick={onToggleDarkMode}
                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
              >
                Cambiar
              </button>
            </div>
          </div>

          {/* Academic Records Card */}
          <div className="glass-card p-6 space-y-3">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-indigo-400" />
              Resumen de Rendiciones
            </h4>

            {historialRendiciones.length === 0 ? (
              <p className="text-xs text-slate-500 dark:text-slate-400">No registras evaluaciones rendidas aún.</p>
            ) : (
              <div className="space-y-2">
                {historialRendiciones.map(r => (
                  <div key={r.id} className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-xs flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-200 block truncate max-w-[180px]">
                        {r.pruebaId === 'prueba-101' ? 'Matemática 8° Básico' : 'Comprensión Lectora 8° Básico'}
                      </span>
                      <span className="text-[10px] text-slate-400">{r.fechaRendicion}</span>
                    </div>
                    <span className="font-extrabold text-indigo-600 dark:text-indigo-400">{r.puntajeEscalaNacional} pts</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
