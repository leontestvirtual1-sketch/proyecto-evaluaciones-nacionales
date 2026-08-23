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
  KeyRound,
  Eye,
  EyeOff,
  ChevronDown,
  RefreshCw,
  Smartphone,
  Monitor
} from 'lucide-react';

export const GestionUsuariosPage: React.FC<{ isSandboxMode?: boolean }> = ({ isSandboxMode = false }) => {
  const { user, usuarios, approveUser, rejectOrSuspendUser, changeUserPlan, setUserPassword, loadUsuariosReales } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [estadoFilter, setEstadoFilter] = useState<'todos' | UserEstado>('todos');
  const [copiedTokenId, setCopiedTokenId] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Estados para Modal de Envío de Correo Real
  const [selectedUserForEmailModal, setSelectedUserForEmailModal] = useState<UserProfile | null>(null);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailCustomMessage, setEmailCustomMessage] = useState('');
  const [emailIncludePassword, setEmailIncludePassword] = useState(false);
  const [emailTempPassword, setEmailTempPassword] = useState('');
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailPreviewMode, setEmailPreviewMode] = useState<'desktop' | 'mobile'>('desktop');

  // Estados para Modal de Contraseña
  const [selectedUserForPassword, setSelectedUserForPassword] = useState<UserProfile | null>(null);
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [copiedPassword, setCopiedPassword] = useState(false);

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  const openEmailModal = (u: UserProfile) => {
    setSelectedUserForEmailModal(u);
    setEmailSubject(`✨ ¡Tu cuenta en Sysget Saber ha sido activada! — ${u.establecimiento}`);
    setEmailCustomMessage('');
    setEmailIncludePassword(false);
    setEmailTempPassword('');
  };

  const handleSendRealEmail = async () => {
    if (!selectedUserForEmailModal) return;
    setIsSendingEmail(true);
    try {
      const res = await fetch('/api/users?action=send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: selectedUserForEmailModal.email,
          subject: emailSubject,
          nombre: `${selectedUserForEmailModal.nombre} ${selectedUserForEmailModal.apellido}`.trim(),
          establecimiento: selectedUserForEmailModal.establecimiento,
          plan: selectedUserForEmailModal.plan || 'trial',
          customMessage: emailCustomMessage,
          tempPassword: emailIncludePassword ? emailTempPassword : undefined
        })
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        showToast(`❌ Error al enviar: ${data.error || 'No se pudo enviar el correo'}`);
      } else {
        showToast(`📧 ¡Correo de activación enviado exitosamente a ${selectedUserForEmailModal.email}!`);
        setSelectedUserForEmailModal(null);
      }
    } catch (e: any) {
      showToast(`❌ Error de conexión al enviar correo: ${e.message}`);
    } finally {
      setIsSendingEmail(false);
    }
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

  const isProductionAdmin = !isSandboxMode && user?.email === 'leontestvirtual1@gmail.com';
  const [entornoTab, setEntornoTab] = useState<'produccion' | 'demo'>('produccion');

  // Clasificador estricto de usuario Demo vs Producción
  const isUserDemo = (u: UserProfile) => {
    const email = (u.email || '').toLowerCase();
    const est = (u.establecimiento || '').toLowerCase();
    return email.endsWith('@demo.cl') || email.endsWith('@escuelademo.cl') || email.endsWith('@sysget.cl') || est.includes('demo') || est.includes('bicentenario');
  };

  const demoUsersList = usuarios.filter(u => isUserDemo(u));
  const prodUsersList = usuarios.filter(u => !isUserDemo(u));

  // En modo DEMO (Sandbox): ÚNICAMENTE usuarios demo (María, Patricia, Carlos, Pedro)
  // En modo PRODUCCIÓN: Permite ver Producción Real por defecto o alternar a Demo
  const baseUsersList = isProductionAdmin
    ? (entornoTab === 'produccion' ? prodUsersList : demoUsersList)
    : demoUsersList;

  // Filtrado
  const filteredUsers = baseUsersList.filter(u => {
    const matchesSearch =
      u.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.establecimiento.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesEstado = estadoFilter === 'todos' || u.estado === estadoFilter;
    return matchesSearch && matchesEstado;
  });

  // Métricas
  const total = baseUsersList.length;
  const pendientes = baseUsersList.filter(u => u.estado === 'pendiente_aprobacion').length;
  const activosTrial = baseUsersList.filter(u => u.estado === 'activo' && u.plan === 'trial').length;
  const cuentasFree = baseUsersList.filter(u => u.estado === 'activo' && u.plan === 'free').length;
  const institucional = baseUsersList.filter(u => u.estado === 'activo' && (u.plan === 'institucional' || u.plan === 'pro')).length;

  const calcularDiasRestantesTrial = (u: UserProfile): number => {
    if (u.fechaRegistro) {
      const regDate = new Date(u.fechaRegistro);
      if (!isNaN(regDate.getTime())) {
        const diffMs = Date.now() - regDate.getTime();
        const diffDays = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
        return Math.max(0, Math.min(30, 30 - diffDays));
      }
    }
    if (u.diasRestantesTrial !== undefined) {
      return Math.max(0, Math.min(30, u.diasRestantesTrial));
    }
    return 30;
  };

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
          <button
            onClick={async () => {
              setIsRefreshing(true);
              await (loadUsuariosReales ? loadUsuariosReales() : Promise.resolve());
              setIsRefreshing(false);
              showToast('Perfiles sincronizados con Supabase.');
            }}
            disabled={isRefreshing}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-indigo-400' : ''}`} />
            {isRefreshing ? 'Sincronizando...' : 'Recargar'}
          </button>
          <span className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            Control de Costo Cero ($0)
          </span>
        </div>
      </div>

      {/* Selector de Entorno (Solo Super Admin) */}
      {isProductionAdmin && (
        <div className="flex items-center gap-2 bg-slate-900/60 p-2 border border-slate-800 rounded-2xl">
          <button
            onClick={() => setEntornoTab('produccion')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              entornoTab === 'produccion'
                ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/20'
                : 'bg-slate-950/60 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <span>🏢 Cuentas de Producción Real ({prodUsersList.length})</span>
          </button>

          <button
            onClick={() => setEntornoTab('demo')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              entornoTab === 'demo'
                ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg shadow-amber-500/20'
                : 'bg-slate-950/60 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <span>🎭 Cuentas Demo de Prueba ({demoUsersList.length})</span>
          </button>
        </div>
      )}

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
          <p className="text-[11px] text-emerald-400/80">Suscripciones Pro / Inst</p>
        </div>
      </div>

      {/* Barra de Búsqueda, Filtros y Sincronización */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/40 p-4 border border-slate-800 rounded-2xl">
        <div className="flex items-center gap-2 w-full sm:w-auto flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Buscar por nombre, email o colegio..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-950 text-white border border-slate-700 rounded-xl outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <button
            onClick={() => {
              setIsRefreshing(true);
              window.location.reload();
            }}
            title="Sincronizar usuarios desde Supabase en tiempo real"
            className="p-2 bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700 rounded-xl transition-all flex items-center gap-1 shrink-0"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-indigo-400' : ''}`} />
          </button>
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
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-bold'
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
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-500">
                    No se encontraron usuarios en este filtro.
                  </td>
                </tr>
              ) : (
                filteredUsers.map(u => (
                  <tr key={u.id} className="hover:bg-slate-800/30 transition-colors">
                    {/* Usuario & RUT */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white text-xs">{u.nombre} {u.apellido}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{u.rut}</div>
                    </td>

                    {/* Establecimiento & Rol */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 text-xs text-slate-200">
                        <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate max-w-[200px] font-semibold">{u.establecimiento}</span>
                      </div>
                      <div className="text-[11px] text-indigo-400 font-medium">
                        {u.rol === 'admin' ? 'Admin' : `Profesor • ${u.asignaturaNombre || 'Sin asignar'}`}
                      </div>
                    </td>

                    {/* Email y Registro */}
                    <td className="py-3.5 px-4">
                      <div className="text-xs font-mono text-slate-300">{u.email}</div>
                      {u.fechaRegistro && (
                        <div className="text-[10px] text-slate-500">Reg: {u.fechaRegistro}</div>
                      )}
                    </td>

                    {/* Plan */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col gap-1">
                        <select
                          value={u.plan || 'trial'}
                          onChange={e => handleChangePlan(u, e.target.value as UserPlan)}
                          className="bg-slate-950 text-white border border-slate-700 rounded-lg px-2 py-1 text-[11px] font-semibold focus:border-indigo-500 outline-none w-fit"
                        >
                          <option value="free">Free ($0)</option>
                          <option value="trial">Trial (30 días)</option>
                          <option value="pro">Pro ($59.990)</option>
                          <option value="institucional">Institucional ($99.990)</option>
                        </select>

                        {/* Badges según el plan */}
                        {u.plan === 'trial' && (() => {
                          const diasFinal = calcularDiasRestantesTrial(u);
                          return (
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border inline-flex items-center gap-1 w-fit ${
                              diasFinal <= 5 
                                ? 'bg-rose-500/10 text-rose-300 border-rose-500/30' 
                                : diasFinal <= 15
                                  ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                                  : 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30'
                            }`}>
                              <Clock className="w-2.5 h-2.5" />
                              {diasFinal}d restantes
                            </span>
                          );
                        })()}
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
                        <button
                          onClick={() => {
                            setSelectedUserForPassword(u);
                            setNewPasswordInput('');
                            setShowPassword(false);
                            setCopiedPassword(false);
                          }}
                          title="Establecer o restablecer contraseña de acceso"
                          className="p-1.5 bg-slate-800 hover:bg-indigo-950 hover:text-indigo-300 text-slate-300 rounded-lg border border-slate-700 hover:border-indigo-500/40 transition-all flex items-center gap-1"
                        >
                          <KeyRound className="w-3.5 h-3.5" />
                        </button>

                        {/* Botón Enviar Correo Real de Activación / Bienvenida */}
                        <button
                          onClick={() => openEmailModal(u)}
                          title="Enviar correo de activación y bienvenida al usuario"
                          className="p-1.5 bg-slate-800 hover:bg-indigo-600 hover:text-white text-slate-300 rounded-lg border border-slate-700 hover:border-indigo-500 transition-all"
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

      {/* Modal de Establecer / Restablecer Contraseña */}
      {selectedUserForPassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4 animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="p-2 bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 rounded-xl">
                  <KeyRound className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-bold text-white text-sm">Establecer Contraseña</h3>
                  <p className="text-[11px] text-slate-400">Actualizar credenciales de acceso</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedUserForPassword(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Datos del usuario */}
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-1.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Usuario:</span>
                <span className="font-bold text-white">{selectedUserForPassword.nombre} {selectedUserForPassword.apellido}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Correo:</span>
                <span className="text-indigo-400 font-mono text-[11px]">{selectedUserForPassword.email}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Establecimiento:</span>
                <span className="text-slate-300 truncate max-w-[220px]">{selectedUserForPassword.establecimiento}</span>
              </div>
            </div>

            {/* Input de Nueva Contraseña */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label className="text-slate-300 font-semibold">Nueva Contraseña:</label>
                <button
                  type="button"
                  onClick={() => {
                    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
                    const generated = `Saber_${randomSuffix}!`;
                    setNewPasswordInput(generated);
                  }}
                  className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold hover:underline flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  Generar Automática
                </button>
              </div>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPasswordInput}
                  onChange={e => setNewPasswordInput(e.target.value)}
                  placeholder="Ej: Saber_2026!"
                  className="w-full pl-3 pr-20 py-2.5 bg-slate-950 text-white font-mono text-xs border border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors"
                />
                <div className="absolute right-2 top-2 flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-1 text-slate-400 hover:text-white"
                    title={showPassword ? 'Ocultar' : 'Mostrar'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  {newPasswordInput && (
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(newPasswordInput);
                        setCopiedPassword(true);
                        setTimeout(() => setCopiedPassword(false), 2000);
                      }}
                      className="p-1 text-slate-400 hover:text-white"
                      title="Copiar contraseña"
                    >
                      {copiedPassword ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  )}
                </div>
              </div>
              <p className="text-[10px] text-slate-500">Mínimo 6 caracteres. Se actualizará en Supabase Auth inmediatamente.</p>
            </div>

            {/* Botones de acción */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedUserForPassword(null)}
                className="px-3 py-2 text-xs text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-all font-semibold"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={!newPasswordInput || newPasswordInput.length < 6 || isSavingPassword}
                onClick={async () => {
                  if (!selectedUserForPassword) return;
                  setIsSavingPassword(true);
                  const res = await setUserPassword(selectedUserForPassword.id, selectedUserForPassword.email, newPasswordInput);
                  setIsSavingPassword(false);
                  if (res.error) {
                    showToast(`Error: ${res.error}`);
                  } else {
                    showToast(`✅ Contraseña actualizada para ${selectedUserForPassword.nombre} (${newPasswordInput})`);
                    setSelectedUserForPassword(null);
                  }
                }}
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-500/30 flex items-center gap-1.5 transition-all"
              >
                {isSavingPassword ? (
                  <>
                    <Clock className="w-3.5 h-3.5 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    Guardar Contraseña
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Profesional de Despacho de Correo Real */}
      {selectedUserForEmailModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl p-6 space-y-4 shadow-2xl animate-scale-up max-h-[90vh] overflow-y-auto">
            {/* Header del Modal */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="p-2 bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 rounded-xl">
                  <Mail className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-bold text-white text-sm">Enviar Correo de Activación y Bienvenida</h3>
                  <p className="text-[11px] text-slate-400">Despacho oficial vía Google SMTP / Sysget Saber</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedUserForEmailModal(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Formulario de Parámetros del Correo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <label className="text-slate-400 font-semibold">Destinatario:</label>
                <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono flex items-center justify-between">
                  <span className="truncate">{selectedUserForEmailModal.email}</span>
                  <span className="text-[10px] text-emerald-400 font-bold px-1.5 py-0.5 bg-emerald-500/10 rounded">Verificado</span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-semibold">Establecimiento:</label>
                <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 truncate">
                  {selectedUserForEmailModal.establecimiento}
                </div>
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <label className="text-slate-300 font-semibold">Asunto del Correo:</label>
              <input
                type="text"
                value={emailSubject}
                onChange={e => setEmailSubject(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 text-white border border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 font-medium text-xs"
              />
            </div>

            {/* Mensaje adicional personalizado */}
            <div className="space-y-1 text-xs">
              <label className="text-slate-300 font-semibold">Mensaje Personalizado Adicional (Opcional):</label>
              <textarea
                rows={2}
                value={emailCustomMessage}
                onChange={e => setEmailCustomMessage(e.target.value)}
                placeholder="Ej: Estimada profesora, tus credenciales fueron activadas con el plan Trial de 30 días para evaluar a los cursos..."
                className="w-full px-3 py-2 bg-slate-950 text-white border border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 resize-none text-xs"
              />
            </div>

            {/* Opción de Adjuntar Contraseña */}
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-2 text-xs">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={emailIncludePassword}
                  onChange={e => {
                    setEmailIncludePassword(e.target.checked);
                    if (e.target.checked && !emailTempPassword) {
                      setEmailTempPassword(`Saber_${Math.floor(1000 + Math.random() * 9000)}!`);
                    }
                  }}
                  className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-slate-300 font-medium">Incluir contraseña en el correo</span>
              </label>

              {emailIncludePassword && (
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    value={emailTempPassword}
                    onChange={e => setEmailTempPassword(e.target.value)}
                    placeholder="Contraseña inicial"
                    className="flex-1 px-3 py-1.5 bg-slate-900 text-emerald-300 font-mono text-xs border border-slate-700 rounded-lg focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => setEmailTempPassword(`Saber_${Math.floor(1000 + Math.random() * 9000)}!`)}
                    className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-indigo-300 text-[11px] rounded-lg font-semibold border border-slate-700 flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    Generar
                  </button>
                </div>
              )}
            </div>

            {/* Vista Previa del Correo */}
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span className="font-semibold">Vista Previa del Mensaje:</span>
                <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-lg border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setEmailPreviewMode('desktop')}
                    className={`p-1 rounded ${emailPreviewMode === 'desktop' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-white'}`}
                  >
                    <Monitor className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setEmailPreviewMode('mobile')}
                    className={`p-1 rounded ${emailPreviewMode === 'mobile' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-white'}`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className={`p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3 mx-auto transition-all ${
                emailPreviewMode === 'mobile' ? 'max-w-xs text-[11px]' : 'w-full text-xs'
              }`}>
                <div className="p-3 bg-gradient-to-r from-indigo-900/60 to-violet-900/60 rounded-xl border border-indigo-500/30 text-white font-bold text-center">
                  🎓 Sysget Saber — Evaluaciones Nacionales
                </div>

                <div className="space-y-2 text-slate-300">
                  <p>Hola <strong>{selectedUserForEmailModal.nombre} {selectedUserForEmailModal.apellido}</strong>,</p>
                  <p>Tu cuenta institucional para <strong>{selectedUserForEmailModal.establecimiento}</strong> está activa.</p>

                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg space-y-1 text-slate-300">
                    <div>• <strong>Usuario:</strong> {selectedUserForEmailModal.email}</div>
                    <div>• <strong>Plan:</strong> {(selectedUserForEmailModal.plan || 'trial').toUpperCase()} (30 Días Gratis)</div>
                    {emailIncludePassword && emailTempPassword && (
                      <div className="text-emerald-400 pt-1 border-t border-slate-800 font-mono">
                        🔑 <strong>Contraseña:</strong> {emailTempPassword}
                      </div>
                    )}
                  </div>

                  {emailCustomMessage && (
                    <div className="p-2.5 bg-indigo-950/40 border-l-2 border-indigo-500 text-indigo-200 text-[11px] rounded-r-lg">
                      {emailCustomMessage}
                    </div>
                  )}

                  <div className="pt-2 text-center">
                    <span className="inline-block px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg shadow-md">
                      Ingresar a Sysget Saber →
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer y Botón de Envío Real */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <span className="text-[11px] text-slate-500">Servidor: Google SMTP Oficial (465 SSL)</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedUserForEmailModal(null)}
                  className="px-3 py-2 text-xs text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-all font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  disabled={isSendingEmail}
                  onClick={handleSendRealEmail}
                  className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all"
                >
                  {isSendingEmail ? (
                    <>
                      <Clock className="w-4 h-4 animate-spin" />
                      <span>Enviando correo real...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Enviar Correo Real Ahora</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
