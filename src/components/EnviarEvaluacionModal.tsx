import React, { useState } from 'react';
import { Mail, Send, X, AlertCircle, CheckCircle2, Loader2, User, KeyRound } from 'lucide-react';
import { Prueba, AlumnoBasico } from '../types';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';

interface EnviarEvaluacionModalProps {
  isOpen: boolean;
  prueba: Prueba | null;
  alumnos?: AlumnoBasico[];
  onClose: () => void;
  onSuccess?: (email: string) => void;
}

export const EnviarEvaluacionModal: React.FC<EnviarEvaluacionModalProps> = ({
  isOpen,
  prueba,
  alumnos = [],
  onClose,
  onSuccess
}) => {
  const { user } = useAuth();
  const [selectedAlumnoId, setSelectedAlumnoId] = useState<string>('manual');
  const [emailInput, setEmailInput] = useState<string>('florenciaangelicaleonpizarro@gmail.com');
  const [nombreInput, setNombreInput] = useState<string>('Florencia León Pizarro');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen || !prueba) return null;

  const handleSelectAlumno = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedAlumnoId(val);
    if (val === 'manual') {
      setEmailInput('');
      setNombreInput('');
      return;
    }

    const al = alumnos.find(a => a.id === val);
    if (al) {
      setNombreInput(`${al.nombre} ${al.apellido}`.trim());
      // Si el alumno tuviera email en el objeto o buscamos por rut
    }
  };

  const handleEnviar = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const emailTrimmed = emailInput.trim();
    const nombreTrimmed = nombreInput.trim();

    if (!emailTrimmed || !nombreTrimmed) {
      setErrorMsg('Debes indicar el nombre y el correo electrónico del alumno.');
      return;
    }

    setIsLoading(true);

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;

      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch('/api/send-evaluacion-alumno', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          pruebaId: prueba.id,
          pruebaTitulo: prueba.titulo,
          pruebaCodigoAcceso: prueba.codigoPublico,
          pruebaDuracionMinutos: prueba.duracionMinutos,
          alumnoEmail: emailTrimmed,
          alumnoNombre: nombreTrimmed,
          docenteNombre: `${user?.nombre || ''} ${user?.apellido || ''}`.trim() || 'Tu Docente'
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al enviar el correo.');
      }

      setSuccessMsg(`¡Ensayo enviado exitosamente a ${emailTrimmed}!`);
      if (onSuccess) {
        onSuccess(emailTrimmed);
      }
      setTimeout(() => {
        onClose();
      }, 2500);
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMsg(error.message || 'Error de conexión con el servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-4 bg-gradient-to-r from-indigo-500/10 via-transparent to-transparent">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-2xl">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                Enviar Ensayo por Correo
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                El alumno recibirá un enlace directo y su código de acceso
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleEnviar} className="p-6 space-y-5">
          {/* Tarjeta de Ensayo */}
          <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                {prueba.asignaturaNombre} • {prueba.nivel}
              </span>
              <span className="text-xs text-slate-500 flex items-center gap-1 font-mono font-bold">
                <KeyRound className="w-3.5 h-3.5" />
                {prueba.codigoPublico}
              </span>
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
              {prueba.titulo}
            </h3>
            <p className="text-xs text-slate-400">
              ⏱ {prueba.duracionMinutos} minutos • 📝 {prueba.totalPreguntas} preguntas
            </p>
          </div>

          {/* Seleccionar alumno de la lista o manual */}
          {alumnos.length > 0 && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Seleccionar Alumno del Curso (Opcional)
              </label>
              <select
                value={selectedAlumnoId}
                onChange={handleSelectAlumno}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-medium outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="manual">Ingreso manual de datos</option>
                {alumnos.map(al => (
                  <option key={al.id} value={al.id}>
                    {al.nombre} {al.apellido} ({al.rut})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Nombre Alumno */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-400" />
              Nombre Completo del Alumno
            </label>
            <input
              type="text"
              required
              value={nombreInput}
              onChange={(e) => setNombreInput(e.target.value)}
              placeholder="Ej: Florencia León Pizarro"
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium"
            />
          </div>

          {/* Email Alumno */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              Correo Electrónico del Alumno
            </label>
            <input
              type="email"
              required
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="ejemplo@gmail.com"
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium"
            />
          </div>

          {/* Alertas */}
          {errorMsg && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-2 text-rose-600 dark:text-rose-400 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold animate-fade-in">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Footer buttons */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading || Boolean(successMsg)}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-600/30 text-xs transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Enviando correo...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Enviar Ensayo</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

