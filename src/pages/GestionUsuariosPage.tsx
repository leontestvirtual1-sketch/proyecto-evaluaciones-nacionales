import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserProfile, UserEstado, UserPlan } from '../types';
import {
  Users,
  ShieldCheck,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Sparkles,
  Building2,
  Mail,
  Copy,
  Check,
  CreditCard,
  Search,
  Filter,
  ArrowUpRight,
  Send,
  Calendar,
  Lock,
  ChevronDown
} from 'lucide-react';

export const GestionUsuariosPage: React.FC = () => {
  const { usuarios, approveUser, rejectOrSuspendUser, changeUserPlan } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [estadoFilter, setEstadoFilter] = useState<'todos' | UserEstado>('todos');
  const [copiedTokenId, setCopiedTokenId] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [selectedUserForEmailModal, setSelectedUserForEmailModal] = useState<UserProfile | null>(null);

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  const handleApprove = async (u: UserProfile) => {
    await approveUser(u.id, 'trial');
    showToast(`¡Cuenta de ${u.nombre} ${u.apellido} (${u.establecimiento}) aprobada con 30 días de prueba!`);
  };

  const handleSuspend = async (u: UserProfile) => {
    await rejectOrSuspendUser(u.id, 'suspendido');
    showToast(`La cuenta de ${u.nombre} ha sido suspendida.`);
  };

  const handleReactivate = async (u: UserProfile) => {
    await approveUser(u.id, u.plan || 'trial');
    showToast(`La cuenta de ${u.nombre} ha sido reactivada.`);
  };

  const handleChangePlan = async (u: UserProfile, newPlan: UserPlan) => {
    await changeUserPlan(u.id, newPlan);
    showToast(`Plan de ${u.nombre} actualizado a "${newPlan.toUpperCase()}".`);
  };

  const handleCopyLink = (u: UserProfile) => {
    if (!u.approvalToken) return;
    const url = `${window.location.origin}/?approve_token=${u.approvalToken}`;
    navigator.clipboard.writeText(url);
    setCopiedTokenId(u.id);
    setTimeout(() => setCopiedTokenId(null), 2500);
    showToast('Enlace de aprobación directa copiado al portapapeles.');
  };

  // Filtrado
  const filteredUsers = usuarios.filter(u => {
    const matchesSearch =
      u.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.establecimiento.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesEstado = estadoFilter === 'todos' || u.estado === estadoFilter;
    return matchesSearch && matchesEstado;
  });

  // Métricas
  const total = usuarios.length;
  const pendientes = usuarios.filter(u => u.estado === 'pendiente_aprobacion').length;
  const activosTrial = usuarios.filter(u => u.estado === 'activo' && u.plan === 'trial').length;
  const institucional = usuarios.filter(u => u.estado === 'activo' && (u.plan === 'institucional' || u.plan === 'pro')).length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Toast Notificación */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-emerald-600 text-white rounded-xl shadow-2xl border border-emerald-400/40 text-xs font-semibold animate-slide-up">
          <CheckCircle2 className="w-4 h-4" />
          {successToast}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 rounded-xl">
              <Users className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-black text-white">Gestión de Usuarios y Aprobaciones</h1>
          </div>
          <p className="text-xs text-slate-400">
            Control de altas institucionales, activación de período de prueba (30 días) y administración de suscripciones.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            Control de Costo Cero ($0)
          </span>
        </div>
      </div>

      {/* Tarjetas de Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Registrados</span>
            <Users className="w-4 h-4 text-slate-500" />
          </div>
          <div className="text-2xl font-black text-white">{total}</div>
          <p className="text-[11px] text-slate-500">Cuentas en base de datos</p>
        </div>

        <div className="bg-amber-950/20 border border-amber-500/30 p-4 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-xs text-amber-400 font-semibold">
            <span>Solicitudes Pendientes</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-300">{pendientes}</div>
          <p className="text-[11px] text-amber-400/80">Requieren aprobación del admin</p>
        </div>

        <div className="bg-indigo-950/20 border border-indigo-500/30 p-4 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-xs text-indigo-400 font-semibold">
            <span>En Prueba (Trial 30 Días)</span>
            <Sparkles className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-indigo-300">{activosTrial}</div>
          <p className="text-[11px] text-indigo-400/80">Colegios en evaluación activa</p>
        </div>

        <div className="bg-emerald-950/20 border border-emerald-500/30 p-4 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-xs text-emerald-400 font-semibold">
            <span>Planes Institucionales</span>
            <CreditCard className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-300">{institucional}</div>
          <p className="text-[11px] text-emerald-400/80">Suscripciones Pro / Institucional</p>
        </div>
      </div>

      {/* Barra de Búsqueda y Filtros */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/40 p-4 border border-slate-800 rounded-2xl">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre, email o colegio..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-950 text-white border border-slate-700 rounded-xl outline-none focus:border-indigo-500"
          />
        </div>

        {/* Filtro de Estado */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {(
            [
              { id: 'todos', label: 'Todos' },
              { id: 'pendiente_aprobacion', label: `Pendientes (${pendientes})` },
              { id: 'activo', label: 'Activos' },
              { id: 'suspendido', label: 'Suspendidos' },
            ] as const
          ).map(tab => (
            <button
              key={tab.id}
              onClick={() => setEstadoFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                estadoFilter === tab.id
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tabla de Usuarios */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Usuario / RUT</th>
                <th className="py-3.5 px-4">Establecimiento & Rol</th>
                <th className="py-3.5 px-4">Email</th>
                <th className="py-3.5 px-4">Plan & Período</th>
                <th className="py-3.5 px-4">Estado</th>
                <th className="py-3.5 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No se encontraron usuarios que coincidan con los filtros.
                  </td>
                </tr>
              ) : (
                filteredUsers.map(u => (
                  <tr key={u.id} className="hover:bg-slate-800/30 transition-colors">
                    {/* Nombre + RUT */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white">
                        {u.nombre} {u.apellido}
                      </div>
                      <div className="text-[11px] text-slate-500">{u.rut}</div>
                    </td>

                    {/* Colegio + Rol */}
                    <td className="py-3.5 px-4">
                      <div className="text-slate-200 font-medium flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-slate-500" />
                        {u.establecimiento}
                      </div>
                      <div className="text-[11px] text-indigo-400 capitalize">
                        {u.rol} {u.asignaturaNombre ? `• ${u.asignaturaNombre}` : ''}
                      </div>
                    </td>

                    {/* Email */}
                    <td className="py-3.5 px-4">
                      <div className="text-slate-300 font-mono text-[11px]">{u.email}</div>
                      {u.fechaRegistro && (
                        <div className="text-[10px] text-slate-500">Reg: {u.fechaRegistro}</div>
                      )}
                    </td>

                    {/* Plan */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <select
                          value={u.plan || 'trial'}
                          onChange={e => handleChangePlan(u, e.target.value as UserPlan)}
                          className="bg-slate-950 text-slate-200 text-[11px] font-semibold border border-slate-700 rounded-lg px-2 py-1 outline-none focus:border-indigo-500"
                        >
                          <option value="trial">Trial (30 días)</option>
                          <option value="free">Free (Básico)</option>
                          <option value="pro">Pro ($59.990/m)</option>
                          <option value="institucional">Institucional ($99.990/m)</option>
                        </select>
                        {u.plan === 'trial' && u.diasRestantesTrial !== undefined && (
                          <span className="text-[10px] bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 px-1.5 py-0.5 rounded">
                            {u.diasRestantesTrial}d restantes
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Estado */}
                    <td className="py-3.5 px-4">
                      {u.estado === 'pendiente_aprobacion' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                          <Clock className="w-3 h-3" />
                          Pendiente
                        </span>
                      )}
                      {u.estado === 'activo' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                          <CheckCircle2 className="w-3 h-3" />
                          Activo
                        </span>
                      )}
                      {u.estado === 'suspendido' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-500/10 text-rose-300 border border-rose-500/30">
                          <XCircle className="w-3 h-3" />
                          Suspendido
                        </span>
                      )}
                    </td>

                    {/* Acciones */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {u.estado === 'pendiente_aprobacion' ? (
                          <>
                            <button
                              onClick={() => handleApprove(u)}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-[11px] transition-all shadow-md shadow-emerald-600/30 flex items-center gap-1"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Aprobar
                            </button>

                            {u.approvalToken && (
                              <button
                                onClick={() => handleCopyLink(u)}
                                title="Copiar enlace de aprobación directa del correo"
                                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition-all"
                              >
                                {copiedTokenId === u.id ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            )}
                          </>
                        ) : u.estado === 'activo' ? (
                          <button
                            onClick={() => handleSuspend(u)}
                            className="px-2.5 py-1 bg-slate-800 hover:bg-rose-950 hover:text-rose-300 text-slate-400 border border-slate-700 rounded-lg font-semibold text-[11px] transition-all"
                          >
                            Suspender
                          </button>
                        ) : (
                          <button
                            onClick={() => handleReactivate(u)}
                            className="px-2.5 py-1 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 rounded-lg font-semibold text-[11px] transition-all"
                          >
                            Reactivar
                          </button>
                        )}

                        <button
                          onClick={() => setSelectedUserForEmailModal(u)}
                          title="Ver simulación de correo de notificación"
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition-all"
                        >
                          <Mail className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Simulación de Correo (Resend / SMTP $0) */}
      {selectedUserForEmailModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-xl rounded-2xl p-6 space-y-4 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Mail className="w-4 h-4 text-indigo-400" />
                Simulación de Notificación por Email (Resend / SMTP $0)
              </div>
              <button
                onClick={() => setSelectedUserForEmailModal(null)}
                className="text-slate-500 hover:text-white text-xs font-bold"
              >
                ✕ Cerrar
              </button>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 font-sans text-xs">
              <div className="text-slate-400">
                <strong className="text-slate-200">Para:</strong> {selectedUserForEmailModal.email}
              </div>
              <div className="text-slate-400">
                <strong className="text-slate-200">Asunto:</strong> ¡Tu acceso de prueba (Trial 30 Días) a Sysget Saber está activo! 🎓
              </div>

              <div className="p-4 bg-slate-900 rounded-lg border border-slate-800 space-y-3 text-slate-300">
                <p>
                  Hola <strong>{selectedUserForEmailModal.nombre}</strong>,
                </p>
                <p>
                  Tu cuenta institucional para <strong>{selectedUserForEmailModal.establecimiento}</strong> ha sido verificada y activada por el Administrador.
                </p>
                <div className="p-3 bg-indigo-950/40 border border-indigo-500/30 rounded-lg text-indigo-200 space-y-1">
                  <div className="font-bold">✨ Tu Plan Activo: Trial Gratuito 30 Días</div>
                  <div className="text-[11px] text-slate-400">
                    Incluye acceso a ensayos SIMCE 2026, inteligencia pedagógica de reforzamiento y reportes tabulados.
                  </div>
                </div>
                <div className="pt-2 text-center">
                  <a
                    href="#"
                    onClick={e => {
                      e.preventDefault();
                      setSelectedUserForEmailModal(null);
                    }}
                    className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold text-xs shadow-md"
                  >
                    Ingresar a Sysget Saber →
                  </a>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 flex items-center justify-between">
              <span>Servicio de envío: Resend.com (3.000 emails/mes gratis)</span>
              <button
                onClick={() => setSelectedUserForEmailModal(null)}
                className="px-4 py-1.5 bg-slate-800 text-white rounded-lg font-semibold hover:bg-slate-700"
              >
                Cerrar Vista Previa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
