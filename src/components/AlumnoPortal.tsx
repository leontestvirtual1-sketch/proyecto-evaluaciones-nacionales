import React, { useState } from 'react';
import { UserProfile, Prueba, RendicionPrueba } from '../types';
import { BookOpen, CheckCircle2, Clock, PlayCircle, KeyRound, Sparkles, Award } from 'lucide-react';

interface AlumnoPortalProps {
  alumno: UserProfile;
  pruebasDisponibles: Prueba[];
  historialRendiciones: RendicionPrueba[];
  onStartEvaluation: (prueba: Prueba) => void;
}

export const AlumnoPortal: React.FC<AlumnoPortalProps> = ({
  alumno,
  pruebasDisponibles,
  historialRendiciones,
  onStartEvaluation
}) => {
  const [codigoInput, setCodigoInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleJoinByCode = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const encontrada = pruebasDisponibles.find(
      p => p.codigoPublico.toLowerCase() === codigoInput.trim().toLowerCase()
    );

    if (encontrada) {
      onStartEvaluation(encontrada);
    } else {
      setErrorMsg('Código no encontrado. Verifica con tu profesor el código de evaluación correcto (Ej: EVAL-8A-MAT).');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="glass-card p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-indigo-500/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5 mr-1" /> Portal del Estudiante
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              ¡Hola, {alumno.nombre}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Establecimiento: <strong>{alumno.establecimiento}</strong> — Curso: <strong>8° Básico A</strong>
            </p>
          </div>

          {/* Join Code Card */}
          <form onSubmit={handleJoinByCode} className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 space-y-3 w-full md:w-80">
            <label className="block text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
              <KeyRound className="w-4 h-4 text-indigo-400" /> Ingresar con Código
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={codigoInput}
                onChange={(e) => setCodigoInput(e.target.value)}
                placeholder="Ej: EVAL-8A-MAT"
                className="w-full px-3 py-2 text-xs bg-slate-950/80 text-white border border-slate-700 rounded-xl uppercase tracking-wider font-mono outline-none focus:border-indigo-400"
              />
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all"
              >
                Rendir
              </button>
            </div>
            {errorMsg && (
              <p className="text-[11px] text-rose-300 leading-tight">
                {errorMsg}
              </p>
            )}
          </form>
        </div>
      </div>

      {/* Evaluaciones Pendientes */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-500" />
          Evaluaciones Asignadas para Rendir
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pruebasDisponibles.map((prueba) => (
            <div
              key={prueba.id}
              className="glass-card p-6 space-y-4 hover:shadow-lg transition-all border-l-4 border-l-indigo-600 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                    {prueba.asignaturaNombre}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {prueba.duracionMinutos} min
                  </span>
                </div>

                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  {prueba.titulo}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {prueba.descripcion}
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => onStartEvaluation(prueba)}
                  className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold py-3 rounded-xl shadow-md shadow-indigo-600/30 transition-all hover:scale-[1.01]"
                >
                  <PlayCircle className="w-4 h-4" />
                  <span>Comenzar Evaluación</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Historial de Evaluaciones Rendidas */}
      <div className="glass-card p-6 space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Award className="w-5 h-5 text-emerald-500" />
          Mi Historial de Evaluaciones Rendidas
        </h3>

        <div className="space-y-3">
          {historialRendiciones.map((rend) => (
            <div
              key={rend.id}
              className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between gap-4 text-xs"
            >
              <div className="space-y-1">
                <h4 className="font-bold text-slate-900 dark:text-white">
                  Evaluación Diagnóstica Nacional de Matemática 8° Básico
                </h4>
                <span className="text-slate-500 text-[11px]">
                  Rendida el {rend.fechaRendicion}
                </span>
              </div>

              <div className="flex items-center gap-3 text-right">
                <div>
                  <span className="block text-indigo-600 dark:text-indigo-400 font-extrabold text-sm">
                    {rend.puntajeEscalaNacional} pts
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {rend.porcentajeLogro}% de logro
                  </span>
                </div>
                <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg border border-emerald-500/20">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
