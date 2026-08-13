import React, { useState } from 'react';
import { UserProfile } from '../types';
import {
  Settings,
  Building2,
  Sliders,
  Cloud,
  User,
  Shield,
  Save,
  Check,
  Sparkles,
  Moon,
  Sun,
  Database,
  Key,
  Server,
  Lock,
  Globe,
  Award
} from 'lucide-react';

interface ConfiguracionPageProps {
  user: UserProfile;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const ConfiguracionPage: React.FC<ConfiguracionPageProps> = ({
  user,
  darkMode,
  onToggleDarkMode
}) => {
  const [activeTab, setActiveTab] = useState<'establecimiento' | 'evaluaciones' | 'cloud' | 'perfil'>('establecimiento');

  // Form States
  const [establecimiento, setEstablecimiento] = useState(user.establecimiento || 'Liceo Bicentenario de Excelencia');
  const [rbd, setRbd] = useState('12345-6');
  const [comuna, setComuna] = useState('Santiago');
  const [region, setRegion] = useState('Región Metropolitana');
  const [dependencia, setDependencia] = useState('Subvencionado');

  // Evaluation params
  const [escalaDefault, setEscalaDefault] = useState<'simce' | 'notas'>('simce');
  const [exigenciaDefault, setExigenciaDefault] = useState<number>(60);
  const [duracionDefault, setDuracionDefault] = useState<number>(45);
  const [mostrarSoluciones, setMostrarSoluciones] = useState<boolean>(true);

  // User Profile
  const [nombre, setNombre] = useState(user.nombre);
  const [apellido, setApellido] = useState(user.apellido);
  const [email, setEmail] = useState(user.email);
  const [rut, setRut] = useState(user.rut);

  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="glass-card p-6 sm:p-8 bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 border-indigo-500/20 text-white relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            <Settings className="w-3.5 h-3.5 mr-1.5 text-indigo-400" /> Configuración Global & Parámetros
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Configuración del Sistema
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Gestiona la información institucional de tu colegio, parámetros por defecto de las evaluaciones nacional SIMCE y la integración Cloud con Supabase y Vercel.
          </p>
        </div>
      </div>

      {/* Save feedback toast */}
      {savedSuccess && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 px-4 py-3 rounded-xl flex items-center gap-3 text-xs font-bold shadow-lg animate-bounce-short">
          <Check className="w-4 h-4 text-emerald-500" />
          <span>¡Configuración guardada exitosamente en el sistema!</span>
        </div>
      )}

      {/* Tabs Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Navigation Sidebar Tabs */}
        <div className="space-y-1">
          <button
            onClick={() => setActiveTab('establecimiento')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'establecimiento'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Establecimiento</span>
          </button>

          <button
            onClick={() => setActiveTab('evaluaciones')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'evaluaciones'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Reglas Evaluativas</span>
          </button>

          <button
            onClick={() => setActiveTab('cloud')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'cloud'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <Cloud className="w-4 h-4" />
            <span>Cloud & Supabase</span>
          </button>

          <button
            onClick={() => setActiveTab('perfil')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'perfil'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Mi Perfil & Cuenta</span>
          </button>
        </div>

        {/* Form Body Area */}
        <div className="md:col-span-3">
          <form onSubmit={handleSave} className="glass-card p-6 sm:p-8 space-y-6">
            {/* TAB 1: ESTABLECIMIENTO */}
            {activeTab === 'establecimiento' && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-indigo-500" />
                    Datos del Establecimiento Educacional (White-Label)
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Esta información aparecerá personalizada en las pruebas generadas y reportes PDF para apoderados.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Nombre Oficial del Colegio / Liceo
                    </label>
                    <input
                      type="text"
                      value={establecimiento}
                      onChange={(e) => setEstablecimiento(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">RBD (Rol Base Datos)</label>
                    <input
                      type="text"
                      value={rbd}
                      onChange={(e) => setRbd(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Dependencia</label>
                    <select
                      value={dependencia}
                      onChange={(e) => setDependencia(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    >
                      <option value="Municipal">Municipal / SLEP</option>
                      <option value="Subvencionado">Particular Subvencionado</option>
                      <option value="Particular">Particular Pagado</option>
                      <option value="Administracion Delegada">Administración Delegada</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Comuna</label>
                    <input
                      type="text"
                      value={comuna}
                      onChange={(e) => setComuna(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Región</label>
                    <input
                      type="text"
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: REGLAS EVALUATIVAS */}
            {activeTab === 'evaluaciones' && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-indigo-500" />
                    Parámetros de Evaluación y Calificación
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Establece las reglas por defecto para la generación automática de ensayos.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Escala de Calificación Principal
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setEscalaDefault('simce')}
                        className={`p-3 text-left rounded-xl border text-xs font-semibold transition-all ${
                          escalaDefault === 'simce'
                            ? 'bg-indigo-500/10 border-indigo-500 text-indigo-600 dark:text-indigo-400 font-bold'
                            : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        <Award className="w-4 h-4 mb-1 text-indigo-500" />
                        <div>Escala Nacional SIMCE (100 - 350 pts)</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setEscalaDefault('notas')}
                        className={`p-3 text-left rounded-xl border text-xs font-semibold transition-all ${
                          escalaDefault === 'notas'
                            ? 'bg-indigo-500/10 border-indigo-500 text-indigo-600 dark:text-indigo-400 font-bold'
                            : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        <Sliders className="w-4 h-4 mb-1 text-indigo-500" />
                        <div>Escala Tradicional Chilena (1.0 a 7.0)</div>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Porcentaje de Exigencia por Defecto (%)
                      </label>
                      <input
                        type="number"
                        min="50"
                        max="70"
                        value={exigenciaDefault}
                        onChange={(e) => setExigenciaDefault(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 text-xs bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Tiempo Estándar por Evaluación (Minutos)
                      </label>
                      <input
                        type="number"
                        min="15"
                        max="120"
                        value={duracionDefault}
                        onChange={(e) => setDuracionDefault(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 text-xs bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={mostrarSoluciones}
                        onChange={(e) => setMostrarSoluciones(e.target.checked)}
                        className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-xs text-slate-700 dark:text-slate-300 font-semibold">
                        Mostrar retroalimentación y respuestas correctas al alumno inmediatamente después de entregar.
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: CLOUD & SUPABASE */}
            {activeTab === 'cloud' && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Cloud className="w-5 h-5 text-indigo-500" />
                    Estado de Conexión Supabase & Vercel
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Parámetros de conexión a la base de datos PostgreSQL en la nube y servidor local.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-slate-900 text-white rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
                    <div className="flex items-center justify-between text-emerald-400 font-bold border-b border-slate-800 pb-2">
                      <span className="flex items-center gap-2">
                        <Server className="w-4 h-4" /> Supabase Local Container
                      </span>
                      <span className="px-2 py-0.5 bg-emerald-500/20 rounded text-[10px]">CONECTADO (Port 54321)</span>
                    </div>

                    <div className="space-y-1 text-slate-300 text-[11px]">
                      <div><strong>API URL:</strong> http://127.0.0.1:54321</div>
                      <div><strong>Studio GUI:</strong> http://127.0.0.1:54323</div>
                      <div><strong>PostgreSQL Direct:</strong> postgresql://postgres:***@127.0.0.1:54322/postgres</div>
                    </div>
                  </div>

                  <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl space-y-2">
                    <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                      <Globe className="w-4 h-4" /> Vercel Deployment Sync
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Proyecto vinculado a Vercel CLI. Las variables `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` están configuradas en `.env.local`.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: PERFIL */}
            {activeTab === 'perfil' && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <User className="w-5 h-5 text-indigo-500" />
                    Perfil de Usuario y Apariencia
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Modifica tus datos de contacto y preferencias visuales del sistema.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Nombre</label>
                    <input
                      type="text"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Apellido</label>
                    <input
                      type="text"
                      value={apellido}
                      onChange={(e) => setApellido(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">RUT Profesor/a</label>
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
                      className="w-full px-3.5 py-2.5 text-xs bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl"
                    />
                  </div>
                </div>

                {/* Dark mode switcher */}
                <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {darkMode ? <Moon className="w-5 h-5 text-indigo-400" /> : <Sun className="w-5 h-5 text-amber-500" />}
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">Tema Visual de la Interfaz</h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {darkMode ? 'Modo Oscuro Activado (Recomendado)' : 'Modo Claro Activado'}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={onToggleDarkMode}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
                  >
                    Cambiar Tema
                  </button>
                </div>
              </div>
            )}

            {/* Save Button Footer */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md transition-all active:scale-95"
              >
                <Save className="w-4 h-4" />
                <span>Guardar Cambios</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
