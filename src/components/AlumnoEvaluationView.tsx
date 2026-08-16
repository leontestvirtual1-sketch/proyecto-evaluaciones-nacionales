import React, { useState, useEffect } from 'react';
import { Prueba, Pregunta, UserProfile, RendicionPrueba } from '../types';
import { Clock, CheckCircle2, AlertCircle, ArrowRight, ArrowLeft, Send, Sparkles, Award } from 'lucide-react';

interface AlumnoEvaluationViewProps {
  prueba: Prueba;
  preguntas: Pregunta[];
  alumno: UserProfile;
  onFinish: (rendicion: RendicionPrueba) => void;
  onCancel: () => void;
}

export const AlumnoEvaluationView: React.FC<AlumnoEvaluationViewProps> = ({
  prueba,
  preguntas,
  alumno,
  onFinish,
  onCancel
}) => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [respuestas, setRespuestas] = useState<Record<string, string>>({});
  const [tiempoRestante, setTiempoRestante] = useState<number>(prueba.duracionMinutos * 60);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [completedRendicion, setCompletedRendicion] = useState<RendicionPrueba | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTiempoRestante(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTiempo = (segundos: number) => {
    const min = Math.floor(segundos / 60);
    const seg = segundos % 60;
    return `${min}:${seg < 10 ? '0' : ''}${seg}`;
  };

  const preguntaActual = preguntas[currentIdx];
  const totalRespondidas = Object.keys(respuestas).length;
  const progresoPorcentaje = Math.round((totalRespondidas / preguntas.length) * 100);

  const handleSelectRespuesta = (letraOTexto: string) => {
    setRespuestas(prev => ({
      ...prev,
      [preguntaActual.id]: letraOTexto
    }));
  };

  const handleSubmitEvaluation = () => {
    setIsSubmitting(true);

    let puntajeObtenido = 0;
    let puntajeMaximo = 0;

    const respuestasDetalladas = preguntas.map(p => {
      const respDada = respuestas[p.id] || '';
      let esCorrecta = false;

      if (p.tipo === 'seleccion_multiple') {
        esCorrecta = respDada === p.respuestaCorrecta;
        if (esCorrecta) puntajeObtenido += p.puntaje;
      } else {
        // Desarrollo demo scoring
        esCorrecta = respDada.trim().length > 10;
        if (esCorrecta) puntajeObtenido += p.puntaje;
      }
      puntajeMaximo += p.puntaje;

      return {
        preguntaId: p.id,
        respuestaDada: respDada,
        esCorrecta,
        tiempoSegundos: 45
      };
    });

    const porcentajeLogro = Math.round((puntajeObtenido / puntajeMaximo) * 100);
    // Escala nacional 100 a 350
    const puntajeEscalaNacional = Math.round(100 + (porcentajeLogro / 100) * 250);

    const nuevaRendicion: RendicionPrueba = {
      id: `rend-${Date.now()}`,
      pruebaId: prueba.id,
      alumnoId: alumno.id,
      alumnoNombre: `${alumno.nombre} ${alumno.apellido}`,
      alumnoRut: alumno.rut,
      fechaRendicion: new Date().toISOString().replace('T', ' ').substring(0, 16),
      puntajeObtenido,
      puntajeMaximo,
      porcentajeLogro,
      puntajeEscalaNacional,
      respuestas: respuestasDetalladas,
      estado: 'enviada'
    };

    setTimeout(() => {
      setCompletedRendicion(nuevaRendicion);
      setIsSubmitting(false);
      onFinish(nuevaRendicion);
    }, 800);
  };

  if (completedRendicion) {
    return (
      <div className="max-w-2xl mx-auto glass-card p-8 text-center space-y-6 animate-fade-in my-8">
        <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            ¡Evaluación Enviada Exitosamente!
          </span>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {prueba.titulo}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Tus respuestas fueron enviadas al profesor <strong>María González</strong> para la tabulación del grupo curso.
          </p>
        </div>

        {/* Score Cards */}
        <div className="grid grid-cols-2 gap-4 py-4">
          <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800">
            <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold block">
              Puntaje Obtenido
            </span>
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {completedRendicion.puntajeObtenido} / {completedRendicion.puntajeMaximo}
            </span>
          </div>

          <div className="p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
            <span className="text-xs text-indigo-600 dark:text-indigo-400 uppercase tracking-wider font-semibold block">
              Estimación Escala Nacional
            </span>
            <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
              {completedRendicion.puntajeEscalaNacional} pts
            </span>
          </div>
        </div>

        <button
          onClick={onCancel}
          className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-6 py-3 rounded-xl shadow-md transition-all"
        >
          Volver a mis Evaluaciones
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* Top Runner Bar */}
      <div className="glass-card p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-20 z-30 shadow-md">
        <div>
          <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">
            {prueba.titulo}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Pregunta {currentIdx + 1} de {preguntas.length} — {prueba.asignaturaNombre}
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Timer */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-xs font-bold">
            <Clock className="w-4 h-4 animate-pulse" />
            <span>{formatTiempo(tiempoRestante)}</span>
          </div>

          {/* Cancel button */}
          <button
            onClick={onCancel}
            className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-semibold"
          >
            Salir
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
        <div
          className="h-full bg-indigo-600 transition-all duration-300 rounded-full"
          style={{ width: `${progresoPorcentaje}%` }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Question Card */}
        <div className="lg:col-span-3 glass-card p-6 space-y-6">
          <div className="space-y-2 border-b border-slate-100 dark:border-slate-800 pb-4">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              Pregunta N° {currentIdx + 1}
            </span>
            <h4 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white leading-relaxed whitespace-pre-line">
              {preguntaActual.enunciado}
            </h4>

            {preguntaActual.imagenUrl && (
              <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex justify-center overflow-hidden shadow-sm my-3">
                <img
                  src={preguntaActual.imagenUrl}
                  alt={`Figura Pregunta N° ${currentIdx + 1}`}
                  className="max-h-80 w-auto object-contain rounded-xl"
                />
              </div>
            )}
          </div>

          {/* Alternatives or Textarea */}
          {preguntaActual.tipo === 'seleccion_multiple' ? (
            <div className="space-y-3">
              {preguntaActual.alternativas.map((alt) => {
                const isSelected = respuestas[preguntaActual.id] === alt.letra;
                return (
                  <button
                    key={alt.letra}
                    onClick={() => handleSelectRespuesta(alt.letra)}
                    className={`w-full p-4 rounded-xl border text-left transition-all flex items-start gap-3.5 ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20'
                        : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-indigo-400'
                    }`}
                  >
                    <span
                      className={`w-7 h-7 rounded-lg font-extrabold text-xs flex items-center justify-center flex-shrink-0 ${
                        isSelected
                          ? 'bg-white text-indigo-600'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {alt.letra}
                    </span>
                    <span className="text-sm font-medium pt-0.5">
                      {alt.texto}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                Respuesta Escrita / Justificación
              </label>
              <textarea
                rows={5}
                value={respuestas[preguntaActual.id] || ''}
                onChange={(e) => handleSelectRespuesta(e.target.value)}
                placeholder="Escribe tu procedimiento detallado aquí..."
                className="w-full p-4 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
              />
            </div>
          )}

          {/* Prev / Next controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
              disabled={currentIdx === 0}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Anterior
            </button>

            {currentIdx < preguntas.length - 1 ? (
              <button
                onClick={() => setCurrentIdx(prev => Math.min(preguntas.length - 1, prev + 1))}
                className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-xs font-semibold shadow-sm transition-all"
              >
                Siguiente <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmitEvaluation}
                disabled={isSubmitting}
                className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-md transition-all"
              >
                <Send className="w-4 h-4" /> Finalizar y Enviar
              </button>
            )}
          </div>
        </div>

        {/* Question Grid Navigator */}
        <div className="glass-card p-5 space-y-4 h-fit">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Navegador de Preguntas
          </h4>

          <div className="grid grid-cols-4 gap-2">
            {preguntas.map((p, idx) => {
              const isAnswered = Boolean(respuestas[p.id]);
              const isCurrent = currentIdx === idx;

              let classes = 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400';
              if (isAnswered) classes = 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30';
              if (isCurrent) classes = 'ring-2 ring-indigo-500 bg-indigo-600 text-white';

              return (
                <button
                  key={p.id}
                  onClick={() => setCurrentIdx(idx)}
                  className={`h-10 rounded-xl text-xs font-bold transition-all flex items-center justify-center ${classes}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500/40" />
              <span>Respondida ({totalRespondidas})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-700" />
              <span>Pendiente ({preguntas.length - totalRespondidas})</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
