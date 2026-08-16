import React, { useState } from 'react';
import { UserProfile, Prueba, RendicionPrueba } from '../types';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  PlayCircle,
  KeyRound,
  Sparkles,
  Award,
  Flame,
  ArrowRight,
  Brain,
  Target,
  RotateCcw
} from 'lucide-react';
import { SandboxBeacon } from './SandboxBeacon';
import { MiniSIMCERunner } from './MiniSIMCERunner';
import { PlanMartinModal } from './SandboxSpecialModals';

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
  const [showInteractiveRunner, setShowInteractiveRunner] = useState(false);
  const [planModalOpen, setPlanModalOpen] = useState(false);

  const handleJoinByCode = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const encontrada = pruebasDisponibles.find(
      p => p.codigoPublico.toLowerCase() === codigoInput.trim().toLowerCase()
    );

    if (encontrada) {
      onStartEvaluation(encontrada);
    } else {
      setErrorMsg('Código no encontrado. Prueba con EVAL-8A-MAT o CN6B-2026.');
    }
  };

  if (showInteractiveRunner) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowInteractiveRunner(false)}
            className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
          >
            ← Volver al Portal del Alumno
          </button>
        </div>
        <MiniSIMCERunner
          onFinish={() => setShowInteractiveRunner(false)}
          onViewPlan={() => setPlanModalOpen(true)}
        />
        <PlanMartinModal
          isOpen={planModalOpen}
          onClose={() => setPlanModalOpen(false)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in text-left">
      {/* Welcome Banner */}
      <div className="glass-card p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-indigo-950/80 to-slate-900 border-indigo-500/30 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <Sparkles className="w-3.5 h-3.5 mr-1" /> Portal del Estudiante SIMCE
              </span>
              <SandboxBeacon label="Demo Activa" durationMs={8000} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              ¡Hola, {alumno.nombre}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Establecimiento: <strong>{alumno.establecimiento}</strong> — Curso: <strong>8° Básico A</strong>
            </p>
          </div>

          {/* Join Code Card */}
          <form onSubmit={handleJoinByCode} className="p-4 bg-slate-950/70 backdrop-blur-md rounded-2xl border border-slate-800 space-y-3 w-full md:w-80 shadow-xl">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <KeyRound className="w-4 h-4 text-indigo-400" /> Ingresar con Código
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={codigoInput}
                onChange={(e) => setCodigoInput(e.target.value)}
                placeholder="Ej: EVAL-8A-MAT"
                className="w-full px-3 py-2 text-xs bg-slate-900 text-white border border-slate-700 rounded-xl uppercase tracking-wider font-mono outline-none focus:border-indigo-400"
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

      {/* STAR ACTION: Interactive Mini-SIMCE Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-900/60 via-purple-900/40 to-slate-900 border-2 border-indigo-500/40 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-400" /> Ensayo Interactivo Inmediato
            </span>
            <SandboxBeacon label="Acción Estrella ⭐" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Rendir Ensayo SIMCE Rápido (5 Preguntas)
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            Prueba la experiencia de rendición con temporizador simulado y recibe corrección instantánea con explicación pregunta a pregunta.
          </p>
        </div>

        <button
          onClick={() => setShowInteractiveRunner(true)}
          className="relative z-10 flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white font-black text-xs shadow-xl shadow-indigo-600/40 transition-all hover:scale-105 active:scale-95 whitespace-nowrap border border-indigo-300/30"
        >
          <PlayCircle className="w-5 h-5" />
          <span>Iniciar Ensayo Demo (Interactivo)</span>
        </button>
      </div>

      {/* Student Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Números y Operaciones</span>
            <span className="text-emerald-400">85% Logro</span>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden">
            <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: '85%' }} />
          </div>
          <p className="text-[11px] text-slate-500">Nivel Consolidado • Operatoria básica dominada</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Álgebra y Funciones</span>
            <span className="text-rose-400">28% Logro</span>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden">
            <div className="bg-rose-500 h-2.5 rounded-full" style={{ width: '28%' }} />
          </div>
          <p className="text-[11px] text-rose-300 font-semibold">Requiere Reforzamiento • Ecuaciones de 1er grado</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Geometría y Pitágoras</span>
            <span className="text-amber-400">55% Logro</span>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden">
            <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: '55%' }} />
          </div>
          <p className="text-[11px] text-slate-500">En Desarrollo • Cálculo de hipotenusa y áreas</p>
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
                  <span>Comenzar Evaluación Oficial</span>
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

      <PlanMartinModal
        isOpen={planModalOpen}
        onClose={() => setPlanModalOpen(false)}
      />
    </div>
  );
};
