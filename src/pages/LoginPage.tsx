import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  FileText,
  AlertCircle,
  CheckCircle2,
  BookOpen,
  Info,
  ChevronRight,
  X
} from 'lucide-react';

interface LoginPageProps {
  onGoToRegister: () => void;
  onGoToLanding?: () => void;
  onGoToStudentEval?: () => void;
}

const PILARES_EVALUACIONES = [
  {
    num: 1,
    titulo: 'Banco Oficial SIMCE y PAES 2026',
    orientacion: 'M1, M2, Lectura, Ciencias, Historia',
    proposito: 'Catálogo exhaustivo de reactivos estandarizados DEMRE y MINEDUC con fórmulas matemáticas KaTeX, tablas curriculares y diagramas vectoriales de alta precisión.'
  },
  {
    num: 2,
    titulo: 'Ensayos Digitales con Temporizador Oficial',
    orientacion: 'Portal del Alumno en Vivo',
    proposito: 'Experiencia inmersiva para el estudiante: cronómetro en vivo, navegación fluida, guardado automático progresivo de respuestas y retroalimentación pedagógica instantánea.'
  },
  {
    num: 3,
    titulo: 'Generador de Cuadernillos e Impresión OMR',
    orientacion: 'Formato Impreso & Pautas',
    proposito: 'Generación directa de cuadernillos facsímil tamaño oficio/carta, pautas docentes paso a paso y hojas de respuestas ópticas OMR con membrete institucional dinámico.'
  },
  {
    num: 4,
    titulo: 'Analítica Psicométrica & Matriz Curricular',
    orientacion: 'Escala Oficial & Logro',
    proposito: 'Conversión directa a puntaje PAES (100–1.000 pts) y SIMCE (150–350 pts). Desglose por Ejes Temáticos, Habilidades Cognitivas y Niveles de Logro MINEDUC (Adecuado, Elemental, Insuficiente).'
  }
];

export const LoginPage: React.FC<LoginPageProps> = ({ onGoToRegister, onGoToLanding, onGoToStudentEval }) => {
  const { login } = useAuth();
  const pendingEvalCode = typeof window !== "undefined" ? sessionStorage.getItem("pending_eval_code") : null;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDocModal, setShowDocModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password.trim()) {
      setError('Por favor completa todos los campos (correo y contraseña).');
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await login(email, password);
      if (res?.error) {
        setError(res.error);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al conectar con el servidor.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center p-4 sm:p-6 lg:p-8 relative">
      {/* Botón volver al inicio */}
      {onGoToLanding && (
        <button
          onClick={onGoToLanding}
          className="fixed top-4 left-4 z-50 flex items-center gap-2 bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-700 shadow-xl backdrop-blur-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
          title="Volver a la página de inicio"
        >
          <ArrowLeft size={15} />
          <span>Volver al Inicio</span>
        </button>
      )}

      {/* Background gradient blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-fade-in my-auto py-8">
        
        {/* Columna Izquierda: Formulario de Login (5 columnas) */}
        <div className="lg:col-span-5 space-y-6 max-w-md mx-auto w-full">
          {/* Logo & Title */}
          <div className="text-center space-y-3">
            <div className="inline-flex p-4 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-600/30">
              <GraduationCap className="w-9 h-9 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">
                Sysget<span className="text-indigo-400">Saber</span>
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                Plataforma de Evaluaciones — Chile 2026
              </p>
            </div>
          </div>

          {/* Login Card */}
          <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-5">
            {pendingEvalCode && (
              <div className="p-3.5 bg-indigo-500/15 border border-indigo-500/30 rounded-2xl space-y-2 animate-fade-in text-left">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-indigo-300 text-xs">Evaluación Asignada</span>
                  <span className="font-mono bg-indigo-600 px-2 py-0.5 rounded text-[11px] text-white font-bold">
                    {pendingEvalCode}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  ¿Eres alumno? No necesitas contraseña para responder tu evaluación.
                </p>
                {onGoToStudentEval && (
                  <button
                    type="button"
                    onClick={onGoToStudentEval}
                    className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
                  >
                    <span>🚀 Rendir Evaluación Sin Contraseña</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}
            <div>
              <h2 className="text-xl font-bold text-white">Iniciar Sesión</h2>
              <p className="text-xs text-slate-400 mt-0.5">Ingresa con tu cuenta institucional</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="nombre@colegio.cl"
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-950 text-white border border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-600"
                  />
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 text-sm bg-slate-950 text-white border border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-600"
                  />
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3.5 top-3 text-slate-500 hover:text-slate-300"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Error / Status message */}
              {error && (
                <div className={`p-3.5 rounded-xl text-xs border ${
                  error.includes('pendiente')
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                    : error.includes('suspendida')
                    ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                    : 'bg-rose-500/10 border-rose-500/20 text-rose-300'
                }`}>
                  <div className="font-semibold mb-0.5">
                    {error.includes('pendiente') ? '⏳ Cuenta en Revisión' : error.includes('suspendida') ? '🚫 Cuenta Suspendida' : '⚠️ Error al Iniciar Sesión'}
                  </div>
                  <div className="text-[11px] leading-relaxed text-slate-300">
                    {error}
                  </div>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-600/30 transition-all active:scale-[0.98]"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Ingresar a Sysget Saber</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="text-center text-xs text-slate-400 space-y-2 pt-2 border-t border-slate-800">
              <div>
                ¿No tienes cuenta?{' '}
                <button
                  onClick={onGoToRegister}
                  className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors underline underline-offset-2"
                >
                  Solicita 30 días de prueba gratis
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Panel de Novedades & Capacidades Sysget Saber (7 columnas) */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-slate-900/70 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            
            {/* Encabezado de Novedades */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    Sysget Saber · Suite Nacional de Evaluaciones
                  </h3>
                  <p className="text-xs text-slate-400">
                    Ecosistema de diagnóstico, medición y analítica curricular SIMCE & PAES Chile
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 self-start sm:self-center">
                <span>Versión Chile 2026</span>
              </span>
            </div>

            {/* Novedad 1: Motor Pedagógico y Escalas Oficiales */}
            <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 space-y-2 hover:border-indigo-500/50 transition-all">
              <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold">
                <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-mono text-xs font-black shadow-sm">
                  ⚡
                </span>
                <span>Motor de Medición Pedagógica Oficial</span>
                <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Estándar MINEDUC & DEMRE
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed pl-8">
                Calificación instantánea con conversión a <strong>escala oficial PAES (100 a 1.000 pts)</strong> y <strong>SIMCE (150 a 350 pts)</strong>. Diagnóstico psicométrico inmediato por habilidad cognitiva y niveles de logro (Adecuado, Elemental, Insuficiente) con retroalimentación formativa inmediata para cada alumno.
              </p>
            </div>

            {/* Novedad 2: 4 Pilares de Evaluaciones Nacionales */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-400" />
                  Módulos y Capacidades de la Suite
                </h4>
                <button
                  onClick={() => setShowDocModal(true)}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <span>Ver Especificación Técnica</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PILARES_EVALUACIONES.map((doc) => (
                  <div
                    key={doc.num}
                    className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition-all space-y-1.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-800 text-indigo-300 text-[10px] font-bold flex items-center justify-center border border-slate-700 shrink-0">
                        {doc.num}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 shrink-0">
                        {doc.orientacion}
                      </span>
                    </div>
                    <h5 className="text-xs font-bold text-white leading-snug line-clamp-1" title={doc.titulo}>
                      {doc.titulo}
                    </h5>
                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                      {doc.proposito}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Tip Sysget Saber */}
            <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800/80 flex items-center gap-3 text-xs text-slate-400">
              <Info className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>
                Para asignar ensayos por correo a tus alumnos, generar cuadernillos impresos o consultar la analítica curricular, inicia sesión con tu cuenta institucional.
              </span>
            </div>

          </div>
        </div>

      </div>

      {/* Modal Resumen de la Suite de Evaluaciones */}
      {showDocModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in text-left overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowDocModal(false);
          }}
        >
          <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl w-full max-w-3xl p-6 sm:p-8 space-y-6 my-auto max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    Especificación Técnica: Suite de Evaluaciones Nacionales
                  </h3>
                  <p className="text-xs text-slate-400">
                    Estándares curriculares MINEDUC, DEMRE y analítica pedagógica institucional
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowDocModal(false)}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {PILARES_EVALUACIONES.map((doc) => (
                <div key={doc.num} className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-mono text-xs flex items-center justify-center">
                        {doc.num}
                      </span>
                      {doc.titulo}
                    </h4>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-slate-800 text-indigo-300 border border-slate-700 self-start sm:self-auto">
                      Enfoque: {doc.orientacion}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line pl-8">
                    {doc.proposito}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setShowDocModal(false)}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/30"
              >
                Entendido / Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default LoginPage;
