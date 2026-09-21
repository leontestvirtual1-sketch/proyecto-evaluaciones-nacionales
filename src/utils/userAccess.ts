import { UserProfile, UserEstado, UserPlan } from '../types';

/**
 * Calcula de manera uniforme y precisa los días restantes de prueba (Trial) de un usuario.
 * Prioriza si se configuró explícitamente días restantes (ej. 0 por vencimiento)
 * y calcula con respecto a la fecha de registro (máximo 30 días).
 */
export function calcularDiasRestantes(p: {
  created_at?: string;
  fecha_registro?: string;
  fechaRegistro?: string;
  dias_restantes_trial?: number | null;
  diasRestantesTrial?: number | null;
}): number {
  const explicitDays =
    p.dias_restantes_trial !== undefined && p.dias_restantes_trial !== null
      ? Number(p.dias_restantes_trial)
      : p.diasRestantesTrial !== undefined && p.diasRestantesTrial !== null
      ? Number(p.diasRestantesTrial)
      : undefined;

  // Si fue explícitamente forzado a 0 o negativo
  if (explicitDays !== undefined && !isNaN(explicitDays) && explicitDays <= 0) {
    return 0;
  }

  const dateStr = p.created_at || p.fecha_registro || p.fechaRegistro;
  if (dateStr) {
    const regDate = new Date(dateStr);
    if (!isNaN(regDate.getTime())) {
      const diffMs = Date.now() - regDate.getTime();
      const diffDays = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
      const daysFromDate = Math.max(0, 30 - diffDays);

      if (explicitDays !== undefined && !isNaN(explicitDays)) {
        return Math.min(explicitDays, daysFromDate);
      }
      return daysFromDate;
    }
  }

  if (explicitDays !== undefined && !isNaN(explicitDays)) {
    return Math.max(0, Math.min(30, explicitDays));
  }

  return 30;
}

export interface UserAccessCheck {
  isBlocked: boolean;
  reason?: 'trial_expired' | 'suspended' | 'rejected' | 'pending';
  title?: string;
  message?: string;
}

/**
 * Evalúa si una cuenta de usuario tiene su acceso bloqueado por vencimiento o desactivación.
 * REGLA ESTRICTA:
 * - El Super Administrador nunca es bloqueado.
 * - Cuentas con estado 'suspendido' o 'rechazado' quedan bloqueadas.
 * - Cuentas con plan 'trial' y 0 días restantes quedan BLOQUEADAS (no pueden trabajar ni crear cursos).
 */
export function isUserExpiredOrBlocked(user: UserProfile | null | undefined): UserAccessCheck {
  if (!user) return { isBlocked: false };

  // Super Administrador tiene acceso total irrestricto
  if (user.esSuperAdmin || (user.rol as string) === 'superadmin') {
    return { isBlocked: false };
  }

  if (user.estado === 'suspendido') {
    return {
      isBlocked: true,
      reason: 'suspended',
      title: 'Cuenta Desactivada / Suspendida',
      message: 'Esta cuenta ha sido desactivada temporalmente por el Administrador de Sysget Saber. Por favor contacta a soporte@sysget.cl para reactivar tu acceso.'
    };
  }

  if (user.estado === 'rechazado') {
    return {
      isBlocked: true,
      reason: 'rejected',
      title: 'Solicitud No Aprobada',
      message: 'Tu solicitud de acceso no fue aprobada por el Administrador de Sysget Saber.'
    };
  }

  if (user.estado === 'pendiente_aprobacion') {
    return {
      isBlocked: true,
      reason: 'pending',
      title: 'Cuenta Pendiente de Activación',
      message: 'Tu cuenta se encuentra en proceso de revisión y activación por parte del Administrador.'
    };
  }

  // Verificar si el plan Trial caducó (0 días restantes)
  const plan: UserPlan = user.plan || 'trial';
  const diasRestantes = calcularDiasRestantes(user);

  if (plan === 'trial' && diasRestantes <= 0) {
    return {
      isBlocked: true,
      reason: 'trial_expired',
      title: 'Período de Prueba Finalizado (0 Días Restantes)',
      message: 'Tu período de prueba institucional de 30 días ha concluido. El acceso a las funciones de creación de cursos, evaluaciones y reportes se encuentra inhabilitado hasta la contratación o activación del plan institucional.'
    };
  }

  return { isBlocked: false };
}
