import React from 'react';
import { ShieldAlert, Clock, Mail, LogOut, Building2, AlertTriangle, CheckCircle2, Lock } from 'lucide-react';
import { UserProfile } from '../types';

interface CuentaCaducadaBloqueoProps {
  user: UserProfile;
  reason?: 'trial_expired' | 'suspended' | 'rejected' | 'pending';
  title?: string;
  message?: string;
  onLogout: () => Promise<void> | void;
}

export const CuentaCaducadaBloqueo: React.FC<CuentaCaducadaBloqueoProps> = ({
  user,
  reason = 'trial_expired',
  title = 'Período de Prueba Finalizado',
  message,
  onLogout,
}) => {
  const defaultMsg =
    reason === 'trial_expired'
      ? 'Tu período de prueba institucional de 30 días ha finalizado (0 días restantes). Para continuar administrando cursos, generando evaluaciones SIMCE/PAES y descargando reportes psicométricos, es necesario activar tu suscripción institucional.'
      : reason === 'suspended'
      ? 'Esta cuenta o establecimiento ha sido desactivada temporalmente por el Administrador. Si crees que se trata de un error o deseas reactivar el servicio, comunícate con el equipo de soporte.'
      : 'El acceso a esta cuenta no está habilitado actualmente.';

  const displayMessage = message || defaultMsg;
  const isTrialExpired = reason === 'trial_expired';

  const mailSubject = encodeURIComponent(
    `[Sysget Saber] Solicitud de Activación / Desbloqueo - ${user.establecimiento || 'Colegio'} (RBD: ${user.rbd || 'S/RBD'})`
  );
  const mailBody = encodeURIComponent(
    `Estimado equipo de Sysget Saber,\n\n` +
      `Solicito la reactivación / suscripción institucional para el siguiente establecimiento:\n` +
      `- Establecimiento: ${user.establecimiento}\n` +
      `- RBD: ${user.rbd || 'No indicado'}\n` +
      `- Usuario solicitante: ${user.nombre} ${user.apellido}\n` +
      `- Email: ${user.email}\n` +
      `- RUT: ${user.rut || 'No indicado'}\n\n` +
      `Quedo atento(a) a su pronta respuesta para continuar utilizando la plataforma.\n\nSaludos cordiales.`
  );

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 sm:p-6 text-slate-100 relative overflow-hidden">
      {/* Glow ambient background */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-rose-600/15 via-indigo-600/10 to-amber-500/10 blur-[130px] pointer-events-none rounded-full" />

      <div className="w-full max-w-xl relative z-10 space-y-6">
        {/* Brand header */}
        <div className="flex items-center justify-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-700 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <ShieldAlert className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-black tracking-tight text-white">
            SYSGET <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">SABER</span>
          </span>
        </div>

        {/* Main Card */}
        <div className="bg-slate-900/90 backdrop-blur-2xl border border-rose-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-rose-950/30 space-y-6 animate-scale-up">
          {/* Badge & Icon */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/15 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0 shadow-lg shadow-rose-500/20">
              {isTrialExpired ? <Clock className="w-7 h-7 animate-pulse" /> : <Lock className="w-7 h-7" />}
            </div>
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30">
                <AlertTriangle className="w-3.5 h-3.5" />
                {isTrialExpired ? 'Acceso Caducado (0 Días Restantes)' : 'Cuenta Desactivada'}
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white">{title}</h1>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
            {displayMessage}
          </p>

          {/* Identification Details */}
          <div className="bg-slate-950/40 rounded-2xl p-4 border border-slate-800 text-xs space-y-2.5">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-indigo-400" />
              Datos de la Cuenta y Establecimiento
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300">
              <div>
                <span className="text-slate-500 text-[11px]">Usuario:</span>{' '}
                <strong className="text-white">{user.nombre} {user.apellido}</strong>
              </div>
              <div>
                <span className="text-slate-500 text-[11px]">Email:</span>{' '}
                <span className="font-mono text-indigo-300">{user.email}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[11px]">Colegio:</span>{' '}
                <span className="text-slate-200">{user.establecimiento}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[11px]">RBD:</span>{' '}
                <span className="font-mono text-slate-200">{user.rbd || 'Sin RBD'}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[11px]">Plan:</span>{' '}
                <span className="uppercase font-bold text-amber-400">{user.plan || 'Trial'}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[11px]">Días de Prueba:</span>{' '}
                <strong className="text-rose-400">0 días restantes</strong>
              </div>
            </div>
          </div>

          {/* Value proposition / Plan benefits */}
          <div className="bg-gradient-to-r from-indigo-950/40 to-violet-950/30 border border-indigo-500/20 rounded-2xl p-4 space-y-2 text-xs">
            <div className="font-bold text-indigo-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ¿Qué incluye el Plan Institucional Sysget Saber?
            </div>
            <ul className="text-slate-400 space-y-1 text-[11px] pl-5 list-disc">
              <li>Acceso ilimitado a evaluaciones SIMCE y PAES para todos los docentes del colegio.</li>
              <li>Generador de cuadernillos con membrete MINEDUC e impresión oficial.</li>
              <li>Reportes psicométricos automáticos por ejes temáticos y habilidades curriculares.</li>
              <li>Soporte técnico y pedagógico prioritario.</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <a
              href={`mailto:soporte@sysget.cl?subject=${mailSubject}&body=${mailBody}`}
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all text-center"
            >
              <Mail className="w-4 h-4" />
              Contactar a Soporte para Activar Plan
            </a>

            <button
              onClick={onLogout}
              className="py-3 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 transition-all"
            >
              <LogOut className="w-4 h-4" />
              Cerrar Sesión
            </button>
          </div>
        </div>

        {/* Footer info */}
        <p className="text-center text-[11px] text-slate-500">
          Sysget Saber • Plataforma Nacional de Evaluaciones Estandarizadas • Contacto directo:{' '}
          <a href="mailto:soporte@sysget.cl" className="text-indigo-400 hover:underline">
            soporte@sysget.cl
          </a>
        </p>
      </div>
    </div>
  );
};
