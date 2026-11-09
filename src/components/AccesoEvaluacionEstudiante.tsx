import React, { useState } from 'react';
import { Prueba, UserProfile } from '../types';
import {
  GraduationCap,
  Clock,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  User,
  Mail,
  AlertCircle
} from 'lucide-react';

interface AccesoEvaluacionEstudianteProps {
  codigo: string;
  prueba: Prueba | null;
  emailInicial?: string;
  nombreInicial?: string;
  onComenzar: (prueba: Prueba, alumnoPerfil: UserProfile) => void;
  onGoToLoginDocente: () => void;
}

export const AccesoEvaluacionEstudiante: React.FC<AccesoEvaluacionEstudianteProps> = ({
  codigo,
  prueba,
  emailInicial = '',
  nombreInicial = '',
  onComenzar,
  onGoToLoginDocente
}) => {
  const [nombre, setNombre] = useState(nombreInicial);
  const [email, setEmail] = useState(emailInicial);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const safeNombre = nombre.trim();
    if (!safeNombre) {
      setErrorMsg('Por favor indica tu nombre completo antes de comenzar.');
      return;
    }

    if (!prueba) {
      setErrorMsg(`No se encontró una evaluación activa con el código "${codigo}". Consulta con tu docente.`);
      return;
    }

    // Perfil temporal de alumno para la sesión de rendición
    const alumnoPerfil: UserProfile = {
      id: crypto.randomUUID(),
      rut: '',
      nombre: safeNombre,
      apellido: '',
      email: email.trim().toLowerCase(),
      rol: 'alumno',
      establecimiento: prueba.cursoNombre || 'Sysget Saber',
      estado: 'activo',
      plan: 'institucional',
      esSuperAdmin: false,
      esDemo: false
    };

    onComenzar(prueba, alumnoPerfil);
  };

  const esPaes = (prueba?.asignaturaNombre || '').toLowerCase().includes('paes') ||
                 (prueba?.titulo || '').toLowerCase().includes('paes');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-4 sm:p-6 lg:p-8 animate-fade-in">
      
      {/* Header superior */}
      <header className="max-w-4xl w-full mx-auto flex items-center justify-between py-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight text-white flex items-center gap-1.5">
              Sysget<span className="text-indigo-400">Saber</span>
            </h1>
            <p className="text-[11px] text-slate-400">Portal de Evaluaciones del Estudiante</p>
          </div>
        </div>

        <button
          onClick={onGoToLoginDocente}
          className="text-xs font-semibold text-slate-400 hover:text-indigo-400 transition-colors flex items-center gap-1 py-1 px-3 rounded-lg hover:bg-slate-900"
        >
          <span>Acceso Docente</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </header>

      {/* Contenedor central */}
      <main className="max-w-2xl w-full mx-auto my-auto py-8">
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl shadow-indigo-950/40 space-y-8">
          
          {/* Badge y título del ensayo */}
          <div className="space-y-3 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{esPaes ? 'Ensayo Oficial PAES' : 'Evaluación Oficial SIMCE'}</span>
              <span className="font-mono bg-indigo-500/20 px-1.5 py-0.2 rounded text-[11px] text-indigo-300">
                {codigo}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {prueba?.titulo || 'Evaluación Asignada'}
            </h2>

            <p className="text-sm text-slate-400 max-w-md mx-auto">
              Tu docente ha habilitado esta evaluación para ti. No requieres contraseña para rendirla.
            </p>
          </div>

          {/* Tarjeta de métricas de la prueba */}
          {prueba && (
            <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-center">
              <div className="space-y-1">
                <div className="flex items-center justify-center gap-1 text-slate-400 text-xs">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Duración</span>
                </div>
                <p className="text-base font-black text-white">{prueba.duracionMinutos} min</p>
              </div>

              <div className="space-y-1 border-x border-slate-800/80">
                <div className="flex items-center justify-center gap-1 text-slate-400 text-xs">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Preguntas</span>
                </div>
                <p className="text-base font-black text-white">{prueba.totalPreguntas || 65}</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-center gap-1 text-slate-400 text-xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Nivel</span>
                </div>
                <p className="text-base font-black text-white truncate px-1">{prueba.nivel || 'Oficial'}</p>
              </div>
            </div>
          )}

          {/* Formulario de confirmación del estudiante */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Nombre Completo del Estudiante</span>
                </label>
                <input
                  type="text"
                  required
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej: Florencia Angélica León Pizarro"
                  className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Correo Electrónico (Opcional)</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ejemplo@gmail.com"
                  className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium"
                />
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-2 text-rose-400 text-xs font-semibold animate-fade-in">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-base shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span>🚀 Comenzar Evaluación Ahora</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800/80 text-[11px] text-slate-400 leading-relaxed text-center">
              💡 <strong>Instrucciones:</strong> El temporizador comenzará inmediatamente al pulsar el botón. Responde a tu propio ritmo y al terminar pulsa "Entregar Evaluación" para que tu docente reciba los resultados.
            </div>
          </form>

        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-slate-500 py-4 border-t border-slate-900">
        <p>Sysget Saber · Plataforma Nacional de Evaluaciones SIMCE & PAES Chile 2026</p>
      </footer>
    </div>
  );
};

