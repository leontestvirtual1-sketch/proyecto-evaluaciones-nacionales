import React, { useState, useEffect } from 'react';
import {
  Clock,
  CheckCircle2,
  XCircle,
  Award,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  BookOpen,
  HelpCircle,
  Check,
  AlertCircle
} from 'lucide-react';
import { preguntasMock } from '../data/mockData';
import { Pregunta } from '../types';

interface MiniSIMCERunnerProps {
  onFinish?: () => void;
  onViewPlan?: () => void;
}

export const MiniSIMCERunner: React.FC<MiniSIMCERunnerProps> = ({
  onFinish,
  onViewPlan
}) => {
  const [selectedSubject, setSelectedSubject] = useState<'matematica' | 'ciencias'>('matematica');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(480); // 8 minutes

  // Get 5 questions for selected subject
  const currentQuestions: Pregunta[] = React.useMemo(() => {
    if (selectedSubject === 'matematica') {
      return preguntasMock.filter(p => p.asignaturaId === 'asig-1').slice(0, 5);
    } else {
      return preguntasMock.filter(p => p.asignaturaId === 'asig-3').slice(0, 5);
    }
  }, [selectedSubject]);

  // Timer countdown
  useEffect(() => {
    if (isCompleted) return;
    const timer = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          setIsCompleted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isCompleted]);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (letra: string) => {
    setAnswers(prev => ({ ...prev, [currentIdx]: letra }));
  };

  const handleReset = () => {
    setAnswers({});
    setCurrentIdx(0);
    setIsCompleted(false);
    setSecondsLeft(480);
  };

  // Score calculation
  const totalScore = React.useMemo(() => {
    let score = 0;
    currentQuestions.forEach((q, idx) => {
      if (answers[idx] === q.respuestaCorrecta) {
        score += 1;
      }
    });
    return score;
  }, [currentQuestions, answers]);

  const percentage = Math.round((totalScore / (currentQuestions.length || 1)) * 100);

  const currentQ = currentQuestions[currentIdx];

  return (
    <div className="space-y-6 text-left animate-fade-in max-w-4xl mx-auto">
      {/* Header Bar */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl text-white shadow-lg">
            <Sparkles className="w-6 h-6 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-white">Ensayo Interactivo Tipo SIMCE (Demo)</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                5 Preguntas Clave
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Evaluación diagnóstica con corrección y retroalimentación inmediata por habilidad.
            </p>
          </div>
        </div>

        {/* Subject Selector Buttons */}
        {!isCompleted && (
          <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 self-start sm:self-center">
            <button
              onClick={() => { setSelectedSubject('matematica'); handleReset(); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedSubject === 'matematica'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              📐 Matemática 8°
            </button>
            <button
              onClick={() => { setSelectedSubject('ciencias'); handleReset(); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedSubject === 'ciencias'
                  ? 'bg-sky-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🔬 Ciencias 6°
            </button>
          </div>
        )}
      </div>

      {!isCompleted ? (
        /* QUESTION RUNNER VIEW */
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
          {/* Stepper + Timer */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Pregunta {currentIdx + 1} de {currentQuestions.length}
              </span>
              <div className="flex gap-1.5 ml-2">
                {currentQuestions.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIdx(i)}
                    className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                      i === currentIdx
                        ? 'bg-indigo-600 text-white scale-105 ring-2 ring-indigo-400/40'
                        : answers[i]
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono font-bold text-amber-400">
              <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>Tiempo restante: {formatTimer(secondsLeft)}</span>
            </div>
          </div>

          {/* Question Stem */}
          {currentQ ? (
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                    {currentQ.nivel}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                    Dificultad: {currentQ.dificultad}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white leading-relaxed">
                  {currentQ.enunciado}
                </h3>
              </div>

              {/* Alternatives List */}
              <div className="space-y-3">
                {currentQ.alternativas.map(alt => {
                  const isSelected = answers[currentIdx] === alt.letra;
                  return (
                    <button
                      key={alt.letra}
                      onClick={() => handleSelectOption(alt.letra)}
                      className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg ring-1 ring-indigo-500'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300 hover:bg-slate-950'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-xl font-bold text-xs flex items-center justify-center flex-shrink-0 transition-all ${
                            isSelected
                              ? 'bg-indigo-600 text-white'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {alt.letra}
                        </div>
                        <span className="text-sm font-medium">{alt.texto}</span>
                      </div>
                      {isSelected && <Check className="w-5 h-5 text-indigo-400 flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-400">No hay preguntas disponibles.</p>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between border-t border-slate-800 pt-4">
            <button
              onClick={() => setCurrentIdx(p => Math.max(0, p - 1))}
              disabled={currentIdx === 0}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white text-xs font-bold transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Anterior</span>
            </button>

            {currentIdx < currentQuestions.length - 1 ? (
              <button
                onClick={() => setCurrentIdx(p => p + 1)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition-all"
              >
                <span>Siguiente</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => setIsCompleted(true)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Finalizar Ensayo y Ver Diagnóstico</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        /* RESULT VIEW WITH INSTANT FEEDBACK */
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6 animate-fade-in">
          {/* Top Score Banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-slate-900 to-indigo-950/60 border border-indigo-500/30 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Ensayo SIMCE Calificado</span>
              </div>
              <h3 className="text-2xl font-black text-white">¡Resultado del Diagnóstico!</h3>
              <p className="text-xs text-slate-400">
                Asignatura: <strong className="text-white capitalize">{selectedSubject}</strong> • {currentQuestions.length} Preguntas Evaluadas
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-center p-4 rounded-2xl bg-slate-950/80 border border-slate-800 min-w-[120px]">
                <div className="text-3xl font-black text-indigo-400">{percentage}%</div>
                <div className="text-[11px] font-bold text-slate-400 uppercase mt-0.5">Logro Total</div>
              </div>
              <div className="text-center p-4 rounded-2xl bg-slate-950/80 border border-slate-800 min-w-[120px]">
                <div className="text-3xl font-black text-emerald-400">
                  {totalScore} / {currentQuestions.length}
                </div>
                <div className="text-[11px] font-bold text-slate-400 uppercase mt-0.5">Correctas</div>
              </div>
            </div>
          </div>

          {/* Detailed Question Review */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Revisión Pregunta a Pregunta y Claves Correctas
            </h4>
            <div className="space-y-3">
              {currentQuestions.map((q, idx) => {
                const userAns = answers[idx];
                const isCorrect = userAns === q.respuestaCorrecta;
                return (
                  <div
                    key={q.id}
                    className={`p-4 rounded-2xl border transition-all text-xs space-y-2 ${
                      isCorrect
                        ? 'bg-emerald-500/5 border-emerald-500/20'
                        : 'bg-rose-500/5 border-rose-500/20'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        {isCorrect ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        ) : (
                          <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                        )}
                        <span className="font-bold text-white">Pregunta {idx + 1}: {q.enunciado}</span>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          isCorrect
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-rose-500/20 text-rose-300'
                        }`}
                      >
                        {isCorrect ? 'Correcta (+1 pt)' : 'Incorrecta (0 pts)'}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-[11px] pl-6 pt-1 text-slate-400">
                      <span>Tu respuesta: <strong className={isCorrect ? 'text-emerald-400' : 'text-rose-400'}>{userAns || 'No respondida'}</strong></span>
                      <span>Clave correcta: <strong className="text-emerald-400">{q.respuestaCorrecta}</strong></span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Footer */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Rendir Otro Ensayo Demo</span>
            </button>

            <div className="flex gap-2 w-full sm:w-auto">
              {onViewPlan && (
                <button
                  onClick={onViewPlan}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition-all"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Ver Mi Plan de Reforzamiento</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
