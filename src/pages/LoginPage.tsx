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
}

const DOCUMENTOS_OFICIALES = [
  {
    num: 1,
    titulo: 'Acta de Calificaciones Finales y Promoción Escolar',
    orientacion: 'Horizontal (Landscape)',
    proposito: 'Formato oficial MINEDUC (Decreto 67). Lista alfabética de alumnos con RUN, Sexo, Fecha de Nacimiento, notas finales por asignatura en vertical, Promedio General, Religión, % Asistencia y Situación Final (Promovido / Reprobado / Y Retirado) con firmas de Director y Docentes.'
  },
  {
    num: 2,
    titulo: 'Informe del Curso - Resumen del Periodo',
    orientacion: 'Horizontal (Landscape)',
    proposito: 'Sábana oficial del curso por periodo (1° Semestre / 2° Semestre / Anual). Desglose por asignatura, Promedio a 1 decimal y a 3 decimales (6.861), % Asistencia, Inasistencias y Atrasos.'
  },
  {
    num: 3,
    titulo: 'Informe Promedios Asignaturas',
    orientacion: 'Horizontal (Landscape)',
    proposito: 'Sábana comparativa con desglose de promedios parciales y finales: P1, P2 y PF por cada asignatura y por cada alumno, más fila resumen de promedios de curso.'
  },
  {
    num: 4,
    titulo: 'Informe de la Asignatura & Analítica UTP',
    orientacion: 'Vertical (Portrait)',
    proposito: 'Página 1: Libro de clases por asignatura con notas parciales (1 a 8) de 1° y 2° semestre, promedio general G y nota final P.\nPágina 2: Executive Pedagogy Dashboard: Tarjetas KPI (Promedio, Aprobación, Brecha Min-Max, Dispersión σ), Matriz Decreto 67 con semáforo pedagógico, Curva de Dificultad Evaluativa por columna y Matriz de Alerta Temprana UTP.'
  }
];

export const LoginPage: React.FC<LoginPageProps> = ({ onGoToRegister, onGoToLanding }) => {
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
              <div className="p-3.5 bg-indigo-950/70 border border-indigo-500/40 rounded-xl space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-300">
                  <span>🎯</span>
                  <span>Evaluación Asignada</span>
                  <span className="ml-auto font-mono bg-indigo-900/80 px-2 py-0.5 rounded text-[11px] text-indigo-200 border border-indigo-700/50">
                    {pendingEvalCode}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-tight">
                  Ingresa con tu correo y contraseña para acceder directamente a tu evaluación.
                </p>
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

        {/* Columna Derecha: Panel de Novedades & Últimas Actualizaciones (7 columnas) */}
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
                    Últimas Actualizaciones & Novedades
                  </h3>
                  <p className="text-xs text-slate-400">
                    Mejoras en el motor pedagógico y suite de documentos oficiales 2026
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 self-start sm:self-center">
                <span>Versión Chile 2026</span>
              </span>
            </div>

            {/* Novedad 1: Aclaración para Profesores sobre Evaluaciones Pendientes "P" */}
            <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 space-y-2 hover:border-indigo-500/50 transition-all">
              <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold">
                <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-mono text-xs font-black shadow-sm">
                  P
                </span>
                <span>Aviso Docente: Evaluaciones Pendientes con Marca "P"</span>
                <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Sin impacto en promedio
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed pl-8">
                Las evaluaciones que aún no son rendidas o están en espera de ingreso se identifican con la letra <strong>"P" (Pendiente)</strong>. 
                <span className="text-amber-300 font-medium"> Este estado no afecta ni altera el cálculo del promedio general</span> de calificaciones de los estudiantes, garantizando rigurosidad estadística conforme a la normativa MINEDUC.
              </p>
            </div>

            {/* Novedad 2: 4 Documentos Oficiales Implementados (Decreto 67 & UTP) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-400" />
                  Nuevos Informes y Documentos Oficiales Disponibles
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
                {DOCUMENTOS_OFICIALES.map((doc) => (
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

            {/* Tip Directivo */}
            <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800/80 flex items-center gap-3 text-xs text-slate-400">
              <Info className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>
                Para generar estos informes de sábana y actas de promoción, accede al módulo de Evaluaciones o Reportes UTP una vez iniciada la sesión.
              </span>
            </div>

          </div>
        </div>

      </div>

      {/* Modal Resumen de los 4 Documentos Oficiales */}
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
                    Resumen de los 4 Documentos Oficiales Implementados
                  </h3>
                  <p className="text-xs text-slate-400">
                    Estándar oficial MINEDUC (Decreto 67) & Analítica Pedagógica UTP
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
              {DOCUMENTOS_OFICIALES.map((doc) => (
                <div key={doc.num} className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-mono text-xs flex items-center justify-center">
                        {doc.num}
                      </span>
                      {doc.titulo}
                    </h4>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-slate-800 text-indigo-300 border border-slate-700 self-start sm:self-auto">
                      Orientación: {doc.orientacion}
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
