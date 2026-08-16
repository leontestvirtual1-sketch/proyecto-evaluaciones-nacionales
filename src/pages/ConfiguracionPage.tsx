import React, { useState, useEffect } from 'react';
import { UserProfile, Asignatura } from '../types';
import { asignaturasMock } from '../data/mockData';
import { getSupabaseConfig, testSupabaseConnection } from '../lib/supabaseClient';
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
  Award,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  PlusCircle,
  Trash2,
  Layers,
  GraduationCap
} from 'lucide-react';

interface ConfiguracionPageProps {
  user: UserProfile;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  asignaturas?: Asignatura[];
  onUpdateAsignaturas?: (newAsigs: Asignatura[]) => void;
}

const asignaturasSugeridasMINEDUC = [
  { codigo: 'HIST', nombre: 'Historia, Geografía y Ciencias Sociales', icono: '🏛️' },
  { codigo: 'ING', nombre: 'Idioma Extranjero: Inglés', icono: '🇬🇧' },
  { codigo: 'EF', nombre: 'Educación Física y Salud', icono: '🏃' },
  { codigo: 'ART', nombre: 'Artes Visuales', icono: '🎨' },
  { codigo: 'MUS', nombre: 'Música', icono: '🎵' },
  { codigo: 'TEC', nombre: 'Tecnología', icono: '💻' },
  { codigo: 'FILO', nombre: 'Filosofía', icono: '🧠' },
  { codigo: 'FIS', nombre: 'Física', icono: '⚡' },
  { codigo: 'QUIM', nombre: 'Química', icono: '🧪' },
  { codigo: 'BIO', nombre: 'Biología', icono: '🧬' }
];

export const ConfiguracionPage: React.FC<ConfiguracionPageProps> = ({
  user,
  darkMode,
  onToggleDarkMode,
  asignaturas = asignaturasMock,
  onUpdateAsignaturas
}) => {
  const [activeTab, setActiveTab] = useState<'establecimiento' | 'asignaturas' | 'evaluaciones' | 'cloud' | 'perfil'>('establecimiento');

  // Form States
  const [establecimiento, setEstablecimiento] = useState(user.establecimiento || 'Liceo Bicentenario de Excelencia');
  const [rbd, setRbd] = useState('12345-6');
  const [comuna, setComuna] = useState('Santiago');
  const [region, setRegion] = useState('Región Metropolitana');
  const [dependencia, setDependencia] = useState('Subvencionado');

  // Asignaturas State
  const [localAsignaturas, setLocalAsignaturas] = useState<Asignatura[]>(asignaturas);
  const [newCodigo, setNewCodigo] = useState('');
  const [newNombre, setNewNombre] = useState('');
  const [newIcono, setNewIcono] = useState('📚');
  const [isAddingAsig, setIsAddingAsig] = useState(false);

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
  const [feedbackMessage, setFeedbackMessage] = useState<string>('¡Configuración guardada exitosamente en el sistema!');

  // Cloud Supabase Live State
  const supabaseCfg = getSupabaseConfig();
  const [connTest, setConnTest] = useState<{ loading: boolean; tested: boolean; ok: boolean; message: string; latencyMs: number }>({
    loading: false,
    tested: false,
    ok: false,
    message: '',
    latencyMs: 0
  });

  const checkConnection = async () => {
    setConnTest(prev => ({ ...prev, loading: true }));
    const result = await testSupabaseConnection();
    setConnTest({
      loading: false,
      tested: true,
      ok: result.ok,
      message: result.message,
      latencyMs: result.latencyMs
    });
  };

  useEffect(() => {
    if (activeTab === 'cloud' && !connTest.tested && !connTest.loading) {
      checkConnection();
    }
  }, [activeTab]);

  const handleAddAsignatura = () => {
    if (!newCodigo.trim() || !newNombre.trim()) return;
    const newAsig: Asignatura = {
      id: `asig-${Date.now()}`,
      codigo: newCodigo.trim().toUpperCase(),
      nombre: newNombre.trim()
    };
    const updated = [...localAsignaturas, newAsig];
    setLocalAsignaturas(updated);
    onUpdateAsignaturas?.(updated);
    setNewCodigo('');
    setNewNombre('');
    setIsAddingAsig(false);
    setFeedbackMessage(`Especialidad "${newAsig.nombre}" agregada al catálogo global.`);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleAddSugerida = (sug: { codigo: string; nombre: string; icono: string }) => {
    const exists = localAsignaturas.some(a => a.codigo === sug.codigo || a.nombre.toLowerCase() === sug.nombre.toLowerCase());
    if (exists) return;
    const newAsig: Asignatura = {
      id: `asig-${sug.codigo.toLowerCase()}-${Date.now()}`,
      codigo: sug.codigo,
      nombre: sug.nombre
    };
    const updated = [...localAsignaturas, newAsig];
    setLocalAsignaturas(updated);
    onUpdateAsignaturas?.(updated);
    setFeedbackMessage(`Especialidad "${newAsig.nombre}" incorporada.`);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleDeleteAsignatura = (id: string) => {
    if (localAsignaturas.length <= 1) return;
    const target = localAsignaturas.find(a => a.id === id);
    const updated = localAsignaturas.filter(a => a.id !== id);
    setLocalAsignaturas(updated);
    onUpdateAsignaturas?.(updated);
    setFeedbackMessage(`Especialidad "${target?.nombre}" eliminada.`);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateAsignaturas?.(localAsignaturas);
    setFeedbackMessage('¡Configuración guardada exitosamente en el sistema!');
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
            Gestiona la información institucional de tu colegio, catálogo de especialidades docentes y parámetros por defecto de las evaluaciones nacionales.
          </p>
        </div>
      </div>

      {/* Save feedback toast */}
      {savedSuccess && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 px-4 py-3 rounded-xl flex items-center gap-3 text-xs font-bold shadow-lg animate-bounce-short">
          <Check className="w-4 h-4 text-emerald-500" />
          <span>{feedbackMessage}</span>
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
            onClick={() => setActiveTab('asignaturas')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'asignaturas'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span className="flex-1 text-left">Especialidades & Asignaturas</span>
            <span className="px-2 py-0.5 text-[10px] bg-indigo-500/20 text-indigo-300 rounded-full font-mono font-bold">
              {localAsignaturas.length}
            </span>
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

            {/* TAB 2: ESPECIALIDADES & ASIGNATURAS */}
            {activeTab === 'asignaturas' && (
              <div className="space-y-6 animate-fade-in text-left">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-indigo-500" />
                      Catálogo de Especialidades & Asignaturas Curriculares
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Define las especialidades docentes del colegio. Quedan disponibles de inmediato para registrar profesores y crear evaluaciones.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsAddingAsig(!isAddingAsig)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all self-start sm:self-auto"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>{isAddingAsig ? 'Cerrar Formulario' : 'Nueva Especialidad'}</span>
                  </button>
                </div>

                {/* Form to add custom Subject */}
                {isAddingAsig && (
                  <div className="p-4 bg-indigo-50/70 dark:bg-slate-900/90 border border-indigo-200 dark:border-indigo-500/30 rounded-2xl space-y-3 animate-fade-in shadow-inner">
                    <div className="flex items-center gap-2 text-xs font-bold text-indigo-700 dark:text-indigo-300">
                      <PlusCircle className="w-4 h-4 text-indigo-500" />
                      <span>Registrar Nueva Especialidad / Asignatura</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                          Código Sigla (ej. HIST)
                        </label>
                        <input
                          type="text"
                          value={newCodigo}
                          onChange={e => setNewCodigo(e.target.value.toUpperCase())}
                          placeholder="HIST"
                          maxLength={6}
                          className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl font-mono uppercase font-bold outline-none focus:ring-2 focus:ring-indigo-500/20"
                        />
                      </div>

                      <div className="space-y-1 sm:col-span-2">
                        <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                          Nombre Oficial de la Asignatura
                        </label>
                        <input
                          type="text"
                          value={newNombre}
                          onChange={e => setNewNombre(e.target.value)}
                          placeholder="Ej. Historia, Geografía y Ciencias Sociales"
                          className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => { setIsAddingAsig(false); setNewCodigo(''); setNewNombre(''); }}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                      >
                        Cancelar
                      </button>
                      <button
                        type="button"
                        onClick={handleAddAsignatura}
                        disabled={!newCodigo.trim() || !newNombre.trim()}
                        className="px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-md transition-all"
                      >
                        Incorporar al Catálogo
                      </button>
                    </div>
                  </div>
                )}

                {/* Grid of Current Active Subjects */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                    Especialidades Activas en el Sistema ({localAsignaturas.length})
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {localAsignaturas.map(asig => {
                      const isDefault = ['asig-1', 'asig-2', 'asig-3'].includes(asig.id);
                      let iconEmoji = '📚';
                      let colorClass = 'border-indigo-500/30 bg-indigo-500/5 text-indigo-700 dark:text-indigo-300';
                      if (asig.codigo === 'MAT') { iconEmoji = '📐'; colorClass = 'border-sky-500/30 bg-sky-500/5 text-sky-700 dark:text-sky-300'; }
                      else if (asig.codigo === 'LEN') { iconEmoji = '📖'; colorClass = 'border-violet-500/30 bg-violet-500/5 text-violet-700 dark:text-violet-300'; }
                      else if (asig.codigo === 'CN') { iconEmoji = '🔬'; colorClass = 'border-cyan-500/30 bg-cyan-500/5 text-cyan-700 dark:text-cyan-300'; }
                      else if (asig.codigo === 'HIST') { iconEmoji = '🏛️'; colorClass = 'border-amber-500/30 bg-amber-500/5 text-amber-700 dark:text-amber-300'; }
                      else if (asig.codigo === 'ING') { iconEmoji = '🇬🇧'; colorClass = 'border-emerald-500/30 bg-emerald-500/5 text-emerald-700 dark:text-emerald-300'; }

                      return (
                        <div
                          key={asig.id}
                          className={`p-3.5 rounded-2xl border ${colorClass} flex items-center justify-between gap-3 transition-all hover:scale-[1.01]`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="text-xl flex-shrink-0">{iconEmoji}</span>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="font-mono font-black text-xs px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10">
                                  {asig.codigo}
                                </span>
                                <span className="text-[10px] text-slate-400 font-semibold">
                                  {isDefault ? 'Oficial SIMCE' : 'Personalizada'}
                                </span>
                              </div>
                              <p className="font-bold text-xs text-slate-900 dark:text-white truncate mt-0.5">
                                {asig.nombre}
                              </p>
                            </div>
                          </div>

                          {!isDefault && localAsignaturas.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleDeleteAsignatura(asig.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors flex-shrink-0"
                              title="Eliminar especialidad"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Quick Add MINEDUC Suggestions */}
                <div className="p-4 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2.5">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Incorporar Asignaturas Sugeridas del MINEDUC en 1-Clic
                    </h4>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Haz clic sobre cualquier asignatura para habilitarla en el catálogo institucional:
                  </p>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {asignaturasSugeridasMINEDUC.map(sug => {
                      const alreadyAdded = localAsignaturas.some(a => a.codigo === sug.codigo || a.nombre.toLowerCase() === sug.nombre.toLowerCase());
                      if (alreadyAdded) return null;

                      return (
                        <button
                          key={sug.codigo}
                          type="button"
                          onClick={() => handleAddSugerida(sug)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 shadow-sm transition-all hover:scale-105 active:scale-95"
                        >
                          <span>{sug.icono}</span>
                          <span>+ {sug.nombre} ({sug.codigo})</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: REGLAS EVALUATIVAS */}
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
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Cloud className="w-5 h-5 text-indigo-500" />
                      Conexión a Supabase Cloud & PostgreSQL
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Estado en vivo de la conexión con la base de datos remota del proyecto.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={checkConnection}
                    disabled={connTest.loading}
                    className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 transition-all disabled:opacity-50 shadow-sm"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${connTest.loading ? 'animate-spin' : ''}`} />
                    <span>{connTest.loading ? 'Verificando...' : 'Comprobar Conexión'}</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Status Banner */}
                  <div className={`p-4 rounded-xl border flex items-start gap-3 transition-all ${
                    connTest.tested
                      ? connTest.ok
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                        : 'bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300'
                      : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                  }`}>
                    {connTest.tested ? (
                      connTest.ok ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-rose-500 mt-0.5 shrink-0" />
                      )
                    ) : (
                      <Database className="w-5 h-5 text-indigo-500 mt-0.5 shrink-0" />
                    )}
                    <div className="space-y-0.5 text-xs">
                      <div className="font-bold">
                        {connTest.loading
                          ? 'Realizando ping a Supabase Cloud...'
                          : connTest.tested
                          ? connTest.ok
                            ? '✅ Conectado exitosamente a Supabase Cloud'
                            : '⚠️ Error de comunicación con la base de datos'
                          : 'Configuración cargada desde .env.local'}
                      </div>
                      <div className="text-[11px] opacity-90">
                        {connTest.message || `Proyecto configurado: ${supabaseCfg.projectRef}`}
                        {connTest.ok && connTest.latencyMs > 0 && ` • Latencia: ${connTest.latencyMs} ms`}
                      </div>
                    </div>
                  </div>

                  {/* Details Card */}
                  <div className="p-4 bg-slate-950 text-white rounded-xl border border-slate-800 space-y-3 font-mono text-xs shadow-inner">
                    <div className="flex items-center justify-between text-indigo-400 font-bold border-b border-slate-800 pb-2">
                      <span className="flex items-center gap-2">
                        <Server className="w-4 h-4 text-indigo-400" />
                        {supabaseCfg.isCloud ? 'Supabase Managed Cloud' : 'Instancia Local'}
                      </span>
                      <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded text-[10px]">
                        {supabaseCfg.isCloud ? 'CLOUD PRODUCTION' : 'LOCAL DEV'}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-slate-300 text-[11px]">
                      <div>
                        <strong className="text-slate-400">Endpoint URL:</strong>{' '}
                        <span className="text-emerald-400">{supabaseCfg.url}</span>
                      </div>
                      <div>
                        <strong className="text-slate-400">Project Reference ID:</strong>{' '}
                        <span className="text-indigo-300">{supabaseCfg.projectRef}</span>
                      </div>
                      <div>
                        <strong className="text-slate-400">Auth & Data API:</strong>{' '}
                        <span className="text-emerald-400">Activo (PostgREST + RLS)</span>
                      </div>
                      <div>
                        <strong className="text-slate-400">Cifrado de Tráfico:</strong>{' '}
                        <span className="text-emerald-400">TLS 1.3 / HTTPS Obligatorio</span>
                      </div>
                    </div>
                  </div>

                  {/* Vercel Info */}
                  <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl space-y-2">
                    <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                      <Globe className="w-4 h-4" /> Listo para Despliegue en Vercel
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      El proyecto cuenta con compatibilidad dual para variables de entorno (`VITE_` y `NEXT_PUBLIC_`). Todas las solicitudes cliente consumen directamente las tablas en Supabase Cloud.
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

                {/* Password Change Card */}
                <div className="p-5 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl">
                        <Key className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">Seguridad & Contraseña de Acceso</h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">Actualiza tu clave personal para ingresar a Sysget Saber</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                      Protegido por Supabase Auth
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Nueva Contraseña</label>
                      <input
                        type="password"
                        placeholder="Mínimo 6 caracteres"
                        className="w-full px-3.5 py-2.5 text-xs bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Confirmar Nueva Contraseña</label>
                      <input
                        type="password"
                        placeholder="Repite la nueva contraseña"
                        className="w-full px-3.5 py-2.5 text-xs bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </div>
                  </div>
                </div>

                {/* Dark mode switcher */}
                <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
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
