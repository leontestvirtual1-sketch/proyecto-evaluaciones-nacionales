import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../context/AuthContext';
import { UserProfile, UserEstado, UserPlan } from '../types';
import {
  Users,
  ShieldCheck,
  Clock,
  CheckCircle2,
  XCircle,
  Sparkles,
  Building2,
  Mail,
  Copy,
  Check,
  CreditCard,
  Search,
  Send,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  RefreshCw,
  Smartphone,
  Monitor,
  BookMarked,
  Power,
  PowerOff,
  UserPlus,
  GraduationCap,
  X,
  Hash,
  MapPin,
  BookOpen,
  AlertCircle
} from 'lucide-react';
import { asignaturasMock, establecimientosCatalog } from '../data/mockData';
import { COMUNAS_REGION_METROPOLITANA } from '../components/DocenteFormFields';
import { AdminCatalogoPanel } from '../components/AdminCatalogoPanel';
import { AdminColegiosPanel } from '../components/AdminColegiosPanel';
import { calcularDiasRestantes } from '../utils/userAccess';

export const GestionUsuariosPage: React.FC<{ isSandboxMode?: boolean }> = ({ isSandboxMode = false }) => {
  const {
    user,
    usuarios,
    changeUserPlan,
    setUserPassword,
    createUsuarioDirecto,
    loadUsuariosReales,
    approveUser,
    rejectOrSuspendUser,
    setUserEstado,
    setColegioEstado
  } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [estadoFilter, setEstadoFilter] = useState<'todos' | UserEstado>('todos');
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleChangePlan = async (u: UserProfile, newPlan: UserPlan) => {
    await changeUserPlan(u.id, newPlan);
    showToast(`Plan de ${u.nombre} actualizado a "${newPlan.toUpperCase()}".`);
  };

  // Estados para Modal de Envío de Correo Real
  const [selectedUserForEmailModal, setSelectedUserForEmailModal] = useState<UserProfile | null>(null);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailCustomMessage, setEmailCustomMessage] = useState('');
  const [emailIncludePassword, setEmailIncludePassword] = useState(false);
  const [emailTempPassword, setEmailTempPassword] = useState('');
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailPreviewMode, setEmailPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [emailSendResult, setEmailSendResult] = useState<{
    success: boolean;
    to?: string;
    messageId?: string;
    timestamp?: string;
    errorMsg?: string;
    smtpCode?: number;
  } | null>(null);

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
    setEmailSendResult(null);
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
        setEmailSendResult({
          success: false,
          to: selectedUserForEmailModal.email,
          errorMsg: data.error || 'No se pudo enviar el correo.',
          smtpCode: data.smtpCode
        });
      } else {
        setEmailSendResult({
          success: true,
          to: data.to || selectedUserForEmailModal.email,
          messageId: data.messageId,
          timestamp: data.timestamp || new Date().toISOString()
        });
        setSelectedUserForEmailModal(null);
      }
    } catch (e: unknown) {
      const errorMsg = e instanceof Error ? e.message : 'Error de conexión desconocido.';
      setEmailSendResult({
        success: false,
        errorMsg: `Error de conexión: ${errorMsg}`
      });
    } finally {
      setIsSendingEmail(false);
    }
  };

  // Directiva 2: isProductionAdmin determinado por columna DB es_super_admin — sin email hardcodeado.
  const isProductionAdmin = !isSandboxMode && user?.esSuperAdmin;
  const [entornoTab, setEntornoTab] = useState<'produccion' | 'colegios' | 'catalogo' | 'demo'>('produccion');

  // Clasificador estricto de usuario Demo vs Producción
  const isUserDemo = (u: UserProfile) => {
    if (u.esDemo !== undefined) return u.esDemo;
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

  // Estados para Filtro de Rol
  const [rolFilter, setRolFilter] = useState<'todos' | 'director' | 'utp' | 'profesor' | 'admin'>('todos');

  // Estados para Modal de Creación de Usuario / Directivo
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newUserData, setNewUserData] = useState({
    tipoRol: 'utp' as 'director' | 'utp' | 'profesor',
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    rut: '',
    email: '',
    telefono: '',
    establecimiento: 'Escuela Premilitar Héroes de la Concepción',
    rbd: '31030',
    comuna: 'La Granja',
    dependencia: 'Particular Subvencionado',
    asignaturaId: 'asig-1',
    asignaturaNombre: 'Competencia Matemática 1 (M1)',
    cargo: 'Jefe de UTP Competencia Matemática 1 (M1)',
    plan: 'institucional' as UserPlan,
    tempPassword: 'Sysget2026!'
  });
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [createUserError, setCreateUserError] = useState<string | null>(null);

  const getEffectiveRole = (u: UserProfile): 'director' | 'utp' | 'admin' | 'profesor' | 'alumno' => {
    if (u.rol === 'admin' || u.esSuperAdmin) return 'admin';
    const cargoLower = (u.cargo || '').toLowerCase();
    if (u.rol === 'director' || cargoLower.includes('director')) return 'director';
    if (u.rol === 'utp' || cargoLower.includes('utp') || cargoLower.includes('jefe')) return 'utp';
    return (u.rol as 'profesor' | 'alumno') || 'profesor';
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateUserError(null);
    setIsCreatingUser(true);
    try {
      if (!newUserData.email || !newUserData.nombre || !newUserData.apellidoPaterno) {
        throw new Error('Nombre, apellido paterno y correo electrónico son obligatorios.');
      }
      const fullApellido = `${newUserData.apellidoPaterno} ${newUserData.apellidoMaterno}`.trim();

      const res = await createUsuarioDirecto({
        rol: newUserData.tipoRol,
        nombre: newUserData.nombre.trim(),
        apellido: fullApellido,
        apellidoPaterno: newUserData.apellidoPaterno.trim(),
        apellidoMaterno: newUserData.apellidoMaterno.trim(),
        rut: newUserData.rut.trim(),
        email: newUserData.email.toLowerCase().trim(),
        telefono: newUserData.telefono.trim(),
        establecimiento: newUserData.establecimiento,
        rbd: newUserData.rbd,
        comuna: newUserData.comuna,
        dependencia: newUserData.dependencia,
        asignaturaId: newUserData.tipoRol !== 'director' ? newUserData.asignaturaId : undefined,
        asignaturaNombre: newUserData.tipoRol !== 'director' ? newUserData.asignaturaNombre : undefined,
        cargo: newUserData.cargo.trim(),
        plan: newUserData.plan,
        tempPassword: newUserData.tempPassword
      });

      if (res.error) {
        throw new Error(res.error);
      }

      showToast(`✅ ${newUserData.tipoRol === 'director' ? 'Director(a)' : newUserData.tipoRol === 'utp' ? 'Jefe(a) de UTP' : 'Docente'} ${newUserData.nombre} registrado y activado exitosamente en Supabase.`);
      setIsCreateModalOpen(false);
      setNewUserData({
        tipoRol: 'utp',
        nombre: '',
        apellidoPaterno: '',
        apellidoMaterno: '',
        rut: '',
        email: '',
        telefono: '',
        establecimiento: 'Escuela Premilitar Héroes de la Concepción',
        rbd: '31030',
        comuna: 'La Granja',
        dependencia: 'Particular Subvencionado',
        asignaturaId: 'asig-1',
        asignaturaNombre: 'Competencia Matemática 1 (M1)',
        cargo: 'Jefe de UTP Competencia Matemática 1 (M1)',
        plan: 'institucional',
        tempPassword: 'Sysget2026!'
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setCreateUserError(msg);
    } finally {
      setIsCreatingUser(false);
    }
  };

  // Filtrado enriquecido (incluye rol efectivo, cargo, asignatura y RUT)
  const filteredUsers = baseUsersList.filter(u => {
    const effRole = getEffectiveRole(u);
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      u.nombre.toLowerCase().includes(searchLower) ||
      u.apellido.toLowerCase().includes(searchLower) ||
      u.email.toLowerCase().includes(searchLower) ||
      u.establecimiento.toLowerCase().includes(searchLower) ||
      (u.cargo || '').toLowerCase().includes(searchLower) ||
      (u.asignaturaNombre || '').toLowerCase().includes(searchLower) ||
      (u.rut || '').toLowerCase().includes(searchLower) ||
      effRole.toLowerCase().includes(searchLower);

    const matchesEstado = estadoFilter === 'todos' || u.estado === estadoFilter;
    const matchesRol = rolFilter === 'todos' || effRole === rolFilter;
    return matchesSearch && matchesEstado && matchesRol;
  });

  // Métricas y conteos
  const total = baseUsersList.length;
  const pendientes = baseUsersList.filter(u => u.estado === 'pendiente_aprobacion').length;
  const activosTrial = baseUsersList.filter(u => u.estado === 'activo' && u.plan === 'trial').length;
  const institucional = baseUsersList.filter(u => u.estado === 'activo' && (u.plan === 'institucional' || u.plan === 'pro')).length;
  const directoresCount = baseUsersList.filter(u => getEffectiveRole(u) === 'director').length;
  const utpCount = baseUsersList.filter(u => getEffectiveRole(u) === 'utp').length;
  const profesoresCount = baseUsersList.filter(u => getEffectiveRole(u) === 'profesor').length;
  const adminsCount = baseUsersList.filter(u => getEffectiveRole(u) === 'admin').length;

  const calcularDiasRestantesTrial = (u: UserProfile): number => {
    return calcularDiasRestantes(u);
  };

  useEffect(() => {
    if (!emailSendResult && !selectedUserForPassword && !selectedUserForEmailModal && !isCreateModalOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (emailSendResult) setEmailSendResult(null);
        if (selectedUserForPassword) setSelectedUserForPassword(null);
        if (selectedUserForEmailModal) setSelectedUserForEmailModal(null);
        if (isCreateModalOpen) setIsCreateModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [emailSendResult, selectedUserForPassword, selectedUserForEmailModal, isCreateModalOpen]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Toast Notificación */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-emerald-600 text-white rounded-xl shadow-2xl border border-emerald-400/40 text-xs font-semibold animate-slide-up">
          <CheckCircle2 className="w-4 h-4" />
          {successToast}
        </div>
      )}

      {/* Modal Resultado de Envío de Correo */}
      {emailSendResult && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) setEmailSendResult(null);
          }}
        >
          {/* Botón flotante siempre visible para volver atrás / cerrar */}
          <button
            onClick={() => setEmailSendResult(null)}
            className="fixed top-4 right-4 z-[110] flex items-center gap-2 bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-700 shadow-2xl backdrop-blur-md transition-all hover:scale-105 active:scale-95"
            title="Volver atrás / Cerrar (Esc)"
          >
            <X size={15} />
            <span>Volver / Cerrar (Esc)</span>
          </button>

          <div className={`w-full max-w-md rounded-2xl border shadow-2xl p-6 space-y-4 my-auto ${
            emailSendResult.success
              ? 'bg-slate-900 border-emerald-500/40'
              : 'bg-slate-900 border-rose-500/40'
          }`}>
            {/* Icono + título */}
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                emailSendResult.success ? 'bg-emerald-500/20 border border-emerald-500/40' : 'bg-rose-500/20 border border-rose-500/40'
              }`}>
                {emailSendResult.success
                  ? <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  : <XCircle className="w-5 h-5 text-rose-400" />}
              </div>
              <div>
                <h3 className={`text-sm font-bold ${emailSendResult.success ? 'text-emerald-300' : 'text-rose-300'}`}>
                  {emailSendResult.success ? '✅ Correo entregado exitosamente' : '❌ Error al enviar el correo'}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {emailSendResult.success ? 'El servidor SMTP confirmó la entrega.' : 'El servidor SMTP reportó un error.'}
                </p>
              </div>
            </div>

            {/* Detalles */}
            <div className={`rounded-xl p-3 space-y-2 text-xs ${
              emailSendResult.success ? 'bg-emerald-950/30 border border-emerald-800/40' : 'bg-rose-950/30 border border-rose-800/40'
            }`}>
              {emailSendResult.to && (
                <div className="flex justify-between gap-2">
                  <span className="text-slate-400 font-semibold uppercase tracking-wide text-[10px]">Destinatario</span>
                  <span className="text-white font-mono text-[11px]">{emailSendResult.to}</span>
                </div>
              )}
              {emailSendResult.success && emailSendResult.messageId && (
                <div className="flex justify-between gap-2">
                  <span className="text-slate-400 font-semibold uppercase tracking-wide text-[10px]">Message ID</span>
                  <span className="text-emerald-300 font-mono text-[10px] truncate max-w-[200px]">{emailSendResult.messageId}</span>
                </div>
              )}
              {emailSendResult.success && emailSendResult.timestamp && (
                <div className="flex justify-between gap-2">
                  <span className="text-slate-400 font-semibold uppercase tracking-wide text-[10px]">Enviado</span>
                  <span className="text-slate-300 text-[11px]">{new Date(emailSendResult.timestamp).toLocaleString('es-CL')}</span>
                </div>
              )}
              {!emailSendResult.success && emailSendResult.errorMsg && (
                <div className="space-y-1">
                  <span className="text-slate-400 font-semibold uppercase tracking-wide text-[10px]">Detalle del error</span>
                  <p className="text-rose-300 text-[11px] leading-relaxed bg-rose-950/40 rounded-lg p-2">{emailSendResult.errorMsg}</p>
                </div>
              )}
              {!emailSendResult.success && emailSendResult.smtpCode && (
                <div className="flex justify-between gap-2">
                  <span className="text-slate-400 font-semibold uppercase tracking-wide text-[10px]">Código SMTP</span>
                  <span className="text-rose-400 font-mono font-bold">{emailSendResult.smtpCode}</span>
                </div>
              )}
              {!emailSendResult.success && (
                <div className="mt-2 p-2 bg-amber-950/30 border border-amber-700/30 rounded-lg">
                  <p className="text-amber-300 text-[10px] leading-relaxed">
                    💡 <strong>Causa probable:</strong> Las variables <code>SMTP_USER</code> y <code>SMTP_PASS</code> no están configuradas en las variables de entorno de Vercel. Ve a{' '}
                    <span className="font-mono">vercel.com → Settings → Environment Variables</span>.
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={() => setEmailSendResult(null)}
              className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-700"
            >
              Cerrar
            </button>
          </div>
        </div>,
        document.body
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

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-3.5 py-1.5 bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>➕ Nuevo Usuario / Directivo</span>
          </button>

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
            <span>🏢 Cuentas ({prodUsersList.length})</span>
          </button>

          <button
            onClick={() => setEntornoTab('colegios')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              entornoTab === 'colegios'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/20'
                : 'bg-slate-950/60 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>🏫 Colegios & Establecimientos</span>
          </button>

          <button
            onClick={() => setEntornoTab('catalogo')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              entornoTab === 'catalogo'
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/20'
                : 'bg-slate-950/60 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <BookMarked className="w-3.5 h-3.5" />
            <span>📚 Catálogo de Evaluaciones</span>
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

      {entornoTab === 'catalogo' ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <AdminCatalogoPanel onToast={showToast} />
        </div>
      ) : entornoTab === 'colegios' ? (
        <AdminColegiosPanel
          usuarios={prodUsersList}
          onToggleColegio={setColegioEstado}
          onViewColegioUsers={(colegioNombre) => {
            setSearchTerm(colegioNombre);
            setEntornoTab('produccion');
          }}
          onToast={showToast}
        />
      ) : (
        <>

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

      {/* Barra de Búsqueda y Filtros Duales (Estado + Rol) */}
      <div className="space-y-3 bg-slate-900/40 p-4 border border-slate-800 rounded-2xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto flex-1 max-w-lg">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Buscar por nombre, correo, cargo (ej. UTP, Director), especialidad o colegio..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-950 text-white border border-slate-700 rounded-xl outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-500"
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
                { id: 'todos', label: 'Todos los estados' },
                { id: 'pendiente_aprobacion', label: `Pendientes (${pendientes})` },
                { id: 'activo', label: 'Activos' },
                { id: 'suspendido', label: 'Suspendidos' },
              ] as const
            ).map(tab => (
              <button
                key={tab.id}
                onClick={() => setEstadoFilter(tab.id as 'todos' | UserEstado)}
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

        {/* Barra de Filtro de Roles Directivos y Docentes */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80 overflow-x-auto">
          <span className="text-[11px] font-bold text-slate-400 whitespace-nowrap mr-1 flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-indigo-400" /> Rol:
          </span>
          {(
            [
              { id: 'todos', label: `Todos los Roles (${total})`, activeClass: 'bg-indigo-600 text-white shadow-indigo-600/30' },
              { id: 'director', label: `👑 Directores (${directoresCount})`, activeClass: 'bg-violet-600 text-white shadow-violet-600/30' },
              { id: 'utp', label: `📋 Jefes UTP (${utpCount})`, activeClass: 'bg-cyan-600 text-white shadow-cyan-600/30' },
              { id: 'profesor', label: `🎓 Docentes (${profesoresCount})`, activeClass: 'bg-indigo-600 text-white shadow-indigo-600/30' },
              { id: 'admin', label: `🛡️ Admins (${adminsCount})`, activeClass: 'bg-amber-600 text-white shadow-amber-600/30' },
            ] as const
          ).map(tab => (
            <button
              key={tab.id}
              onClick={() => setRolFilter(tab.id as typeof rolFilter)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                rolFilter === tab.id
                  ? `${tab.activeClass || 'bg-indigo-600 text-white shadow-md'} font-bold shadow`
                  : 'bg-slate-950/80 text-slate-400 hover:text-white border border-slate-800/80'
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
                      <div className="flex items-center gap-1.5 text-xs text-slate-200 mb-1">
                        <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate max-w-[200px] font-semibold">{u.establecimiento}</span>
                      </div>
                      {(() => {
                        const effRole = getEffectiveRole(u);
                        if (effRole === 'admin') {
                          return (
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                                <ShieldCheck className="w-3 h-3 text-amber-400" /> Super Admin
                              </span>
                              <span className="text-[11px] text-amber-400/80 font-mono text-[10px]">
                                {u.cargo || 'Super Administrador'}
                              </span>
                            </div>
                          );
                        }
                        if (effRole === 'director') {
                          return (
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-violet-500/20 text-violet-300 border border-violet-500/40">
                                👑 Director(a)
                              </span>
                              <span className="text-[11px] text-slate-300 font-medium">
                                {u.cargo || 'Director General'}
                              </span>
                            </div>
                          );
                        }
                        if (effRole === 'utp') {
                          return (
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                                📋 Jefe(a) UTP
                              </span>
                              <span className="text-[11px] text-cyan-400 font-medium">
                                {u.cargo || (u.asignaturaNombre ? `UTP ${u.asignaturaNombre}` : 'Coordinación UTP')}
                              </span>
                            </div>
                          );
                        }
                        return (
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
                              🎓 Docente
                            </span>
                            <span className="text-[11px] text-slate-400 font-medium">
                              {u.asignaturaNombre || u.cargo || 'Sin asignar'}
                            </span>
                          </div>
                        );
                      })()}
                    </td>

                    {/* Email, Teléfono y Registro */}
                    <td className="py-3.5 px-4">
                      <div className="text-xs font-mono text-slate-300">{u.email}</div>
                      {u.telefono && (
                        <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono mt-0.5">
                          <Smartphone className="w-2.5 h-2.5" />
                          {u.telefono}
                        </div>
                      )}
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
                          const pct = Math.round((diasFinal / 30) * 100);
                          const isCaducado = diasFinal <= 0;
                          return (
                            <div className="flex flex-col gap-1 mt-1">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border inline-flex items-center gap-1 w-fit ${
                                isCaducado
                                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 font-black'
                                  : diasFinal <= 5 
                                    ? 'bg-rose-500/10 text-rose-300 border-rose-500/30' 
                                    : diasFinal <= 15
                                      ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                                      : 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30'
                              }`}>
                                <Clock className="w-2.5 h-2.5" />
                                {isCaducado ? 'CADUCADA (0 días)' : `${diasFinal} días restantes (${pct}%)`}
                              </span>
                              <div className="w-28 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all ${
                                    isCaducado ? 'bg-rose-500' : diasFinal <= 5 ? 'bg-rose-500' : diasFinal <= 15 ? 'bg-amber-500' : 'bg-indigo-500'
                                  }`}
                                  style={{ width: `${Math.max(4, pct)}%` }}
                                />
                              </div>
                            </div>
                          );
                        })()}
                        {u.plan === 'institucional' && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded border inline-flex items-center gap-1 w-fit bg-emerald-500/10 text-emerald-300 border-emerald-500/30">
                            <ShieldCheck className="w-2.5 h-2.5" />
                            Acceso Ilimitado
                          </span>
                        )}
                        {u.plan === 'pro' && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded border inline-flex items-center gap-1 w-fit bg-sky-500/10 text-sky-300 border-sky-500/30">
                            <Sparkles className="w-2.5 h-2.5" />
                            Plan Pro
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
                          Desactivado
                        </span>
                      )}
                      {u.estado === 'rechazado' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-800 text-slate-400 border border-slate-700">
                          <XCircle className="w-3 h-3" />
                          Rechazado
                        </span>
                      )}
                    </td>

                    {/* Acciones */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5 flex-wrap">
                        {/* Botón Desactivar / Activar Usuario */}
                        {u.estado === 'activo' && (
                          <button
                            onClick={async () => {
                              await setUserEstado(u.id, 'suspendido');
                              showToast(`🚫 Cuenta de ${u.nombre} ${u.apellido} desactivada.`);
                            }}
                            title="Desactivar cuenta (bloquear acceso a la plataforma)"
                            className="p-1.5 bg-rose-500/10 hover:bg-rose-600 text-rose-300 hover:text-white rounded-lg border border-rose-500/30 transition-all flex items-center gap-1"
                          >
                            <PowerOff className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {u.estado === 'suspendido' && (
                          <button
                            onClick={async () => {
                              await setUserEstado(u.id, 'activo', 30);
                              showToast(`✅ Cuenta de ${u.nombre} ${u.apellido} reactivada con 30 días.`);
                            }}
                            title="Activar cuenta (reactivar acceso con 30 días de prueba)"
                            className="p-1.5 bg-emerald-500/10 hover:bg-emerald-600 text-emerald-300 hover:text-white rounded-lg border border-emerald-500/30 transition-all flex items-center gap-1"
                          >
                            <Power className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {u.estado === 'pendiente_aprobacion' && (
                          <>
                            <button
                              onClick={async () => {
                                await approveUser(u.id, u.plan || 'trial');
                                showToast(`✅ Solicitud de ${u.nombre} aprobada.`);
                              }}
                              title="Aprobar solicitud de acceso"
                              className="p-1.5 bg-emerald-500/10 hover:bg-emerald-600 text-emerald-300 hover:text-white rounded-lg border border-emerald-500/30 transition-all"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={async () => {
                                await rejectOrSuspendUser(u.id, 'rechazado');
                                showToast(`❌ Solicitud de ${u.nombre} rechazada.`);
                              }}
                              title="Rechazar solicitud"
                              className="p-1.5 bg-rose-500/10 hover:bg-rose-600 text-rose-300 hover:text-white rounded-lg border border-rose-500/30 transition-all"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}

                        {/* Botón Renovar +30 días si el trial caducó */}
                        {u.plan === 'trial' && calcularDiasRestantesTrial(u) <= 0 && u.estado === 'activo' && (
                          <button
                            onClick={async () => {
                              await setUserEstado(u.id, 'activo', 30);
                              showToast(`🎉 Se han renovado 30 días de prueba para ${u.nombre}.`);
                            }}
                            title="Renovar período de prueba (+30 días)"
                            className="px-2 py-1 bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 font-black rounded-lg border border-amber-500/40 text-[10px] flex items-center gap-1 transition-all"
                          >
                            <Clock className="w-3 h-3" />
                            +30d
                          </button>
                        )}

                        {/* Password Modal */}
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
      </>
      )}

      {/* Modal de Establecer / Restablecer Contraseña */}
      {selectedUserForPassword && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto"
          onClick={(e) => { if (e.target === e.currentTarget) setSelectedUserForPassword(null); }}
        >
          <button
            onClick={() => setSelectedUserForPassword(null)}
            className="fixed top-4 right-4 z-[110] flex items-center gap-2 bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-700 shadow-2xl backdrop-blur-md transition-all hover:scale-105 active:scale-95"
            title="Volver atrás / Cerrar (Esc)"
          >
            <X size={15} />
            <span>Volver / Cerrar (Esc)</span>
          </button>
          <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4 my-auto">
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
        </div>,
        document.body
      )}

      {/* Modal Profesional de Despacho de Correo Real */}
      {selectedUserForEmailModal && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in overflow-y-auto"
          onClick={(e) => { if (e.target === e.currentTarget) setSelectedUserForEmailModal(null); }}
        >
          <button
            onClick={() => setSelectedUserForEmailModal(null)}
            className="fixed top-4 right-4 z-[110] flex items-center gap-2 bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-700 shadow-2xl backdrop-blur-md transition-all hover:scale-105 active:scale-95"
            title="Volver atrás / Cerrar (Esc)"
          >
            <X size={15} />
            <span>Volver / Cerrar (Esc)</span>
          </button>
          <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto my-auto">
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
        </div>,
        document.body
      )}

      {/* Modal de Creación de Usuario / Directivo */}
      {isCreateModalOpen && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto animate-fade-in"
          onClick={(e) => { if (e.target === e.currentTarget) setIsCreateModalOpen(false); }}
        >
          <button
            onClick={() => setIsCreateModalOpen(false)}
            className="fixed top-4 right-4 z-[110] flex items-center gap-2 bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-700 shadow-2xl backdrop-blur-md transition-all hover:scale-105 active:scale-95"
            title="Volver atrás / Cerrar (Esc)"
          >
            <X size={15} />
            <span>Volver / Cerrar (Esc)</span>
          </button>
          <div className="bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl w-full max-w-2xl p-6 space-y-5 my-8">
            {/* Header del Modal */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-gradient-to-br from-indigo-500/20 to-violet-500/20 text-indigo-400 border border-indigo-500/30 rounded-2xl">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    <span>Registrar Nuevo Usuario / Directivo</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono">
                      Supabase Activo
                    </span>
                  </h2>
                  <p className="text-xs text-slate-400">
                    Crea credenciales reales en Supabase Auth y activa el perfil en base de datos.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-xl hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Error Alert */}
            {createUserError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{createUserError}</span>
              </div>
            )}

            <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
              {/* Selector de Rol / Cargo */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wide">
                  1. Tipo de Perfil / Rol <span className="text-rose-400">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setNewUserData(prev => ({
                        ...prev,
                        tipoRol: 'director',
                        cargo: 'Director General',
                        plan: 'institucional'
                      }));
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      newUserData.tipoRol === 'director'
                        ? 'bg-violet-950/40 border-violet-500 text-white shadow-lg shadow-violet-500/20 ring-1 ring-violet-500'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    <div className="text-base mb-1">👑</div>
                    <div className="font-bold text-xs text-white">Director(a)</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Mando Global Colegio</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setNewUserData(prev => ({
                        ...prev,
                        tipoRol: 'utp',
                        cargo: `Jefe de UTP ${prev.asignaturaNombre || 'Matemática'}`,
                        plan: 'institucional'
                      }));
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      newUserData.tipoRol === 'utp'
                        ? 'bg-cyan-950/40 border-cyan-500 text-white shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-500'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    <div className="text-base mb-1">📋</div>
                    <div className="font-bold text-xs text-white">Jefe(a) de UTP</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Área / Curricular</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setNewUserData(prev => ({
                        ...prev,
                        tipoRol: 'profesor',
                        cargo: `Docente de ${prev.asignaturaNombre || 'Matemática'}`,
                        plan: 'trial'
                      }));
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      newUserData.tipoRol === 'profesor'
                        ? 'bg-indigo-950/40 border-indigo-500 text-white shadow-lg shadow-indigo-500/20 ring-1 ring-indigo-500'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    <div className="text-base mb-1">🎓</div>
                    <div className="font-bold text-xs text-white">Docente de Aula</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Ensayos y Cursos</div>
                  </button>
                </div>
              </div>

              {/* Fila: Especialidad/Área (si es UTP o Profesor) + Cargo Detallado */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-950/50 rounded-2xl border border-slate-800">
                {newUserData.tipoRol !== 'director' ? (
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1 flex items-center gap-1">
                      <BookOpen className="w-3 h-3 text-indigo-400" /> Especialidad / Área <span className="text-rose-400">*</span>
                    </label>
                    <select
                      value={newUserData.asignaturaId}
                      onChange={e => {
                        const asig = asignaturasMock.find(a => a.id === e.target.value);
                        const asigNom = asig?.nombre || 'Matemática';
                        setNewUserData(prev => ({
                          ...prev,
                          asignaturaId: e.target.value,
                          asignaturaNombre: asigNom,
                          cargo: prev.tipoRol === 'utp' ? `Jefe de UTP ${asigNom}` : `Docente de ${asigNom}`
                        }));
                      }}
                      className="w-full px-3 py-2 bg-slate-900 text-white border border-slate-700 rounded-xl outline-none focus:border-indigo-500 text-xs font-semibold"
                    >
                      {asignaturasMock.map(asig => (
                        <option key={asig.id} value={asig.id}>{asig.nombre} ({asig.codigo})</option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1">
                      Ámbito Directivo
                    </label>
                    <input
                      type="text"
                      disabled
                      value="Dirección y Rectoría Institucional"
                      className="w-full px-3 py-2 bg-slate-950 text-slate-400 border border-slate-800 rounded-xl text-xs font-medium"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1">
                    Cargo Oficial Visible <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newUserData.cargo}
                    onChange={e => setNewUserData(prev => ({ ...prev, cargo: e.target.value }))}
                    placeholder="ej. Jefe de UTP Lenguaje, Director General"
                    className="w-full px-3 py-2 bg-slate-900 text-white border border-slate-700 rounded-xl outline-none focus:border-indigo-500 text-xs"
                  />
                </div>
              </div>

              {/* Datos Personales: Nombre, Apellidos, RUT */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wide">
                  2. Datos Personales
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-0.5">Nombre <span className="text-rose-400">*</span></label>
                    <input
                      type="text"
                      required
                      value={newUserData.nombre}
                      onChange={e => setNewUserData(prev => ({ ...prev, nombre: e.target.value }))}
                      placeholder="ej. Marcela"
                      className="w-full px-3 py-2 bg-slate-950 text-white border border-slate-700 rounded-xl outline-none focus:border-indigo-500 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-0.5">Apellido Paterno <span className="text-rose-400">*</span></label>
                    <input
                      type="text"
                      required
                      value={newUserData.apellidoPaterno}
                      onChange={e => setNewUserData(prev => ({ ...prev, apellidoPaterno: e.target.value }))}
                      placeholder="ej. Morales"
                      className="w-full px-3 py-2 bg-slate-950 text-white border border-slate-700 rounded-xl outline-none focus:border-indigo-500 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-0.5">Apellido Materno</label>
                    <input
                      type="text"
                      value={newUserData.apellidoMaterno}
                      onChange={e => setNewUserData(prev => ({ ...prev, apellidoMaterno: e.target.value }))}
                      placeholder="ej. Rojas"
                      className="w-full px-3 py-2 bg-slate-950 text-white border border-slate-700 rounded-xl outline-none focus:border-indigo-500 text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-0.5">RUT Chileno <span className="text-rose-400">*</span></label>
                    <input
                      type="text"
                      required
                      value={newUserData.rut}
                      onChange={e => setNewUserData(prev => ({ ...prev, rut: e.target.value }))}
                      placeholder="ej. 14.234.567-8"
                      className="w-full px-3 py-2 bg-slate-950 text-white border border-slate-700 rounded-xl outline-none focus:border-indigo-500 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-0.5">Correo Electrónico <span className="text-rose-400">*</span></label>
                    <input
                      type="email"
                      required
                      value={newUserData.email}
                      onChange={e => setNewUserData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="ej. utp.lenguaje@premil.cl"
                      className="w-full px-3 py-2 bg-slate-950 text-white border border-slate-700 rounded-xl outline-none focus:border-indigo-500 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-0.5">Teléfono Celular</label>
                    <input
                      type="tel"
                      value={newUserData.telefono}
                      onChange={e => setNewUserData(prev => ({ ...prev, telefono: e.target.value }))}
                      placeholder="+56 9 9123 4567"
                      className="w-full px-3 py-2 bg-slate-950 text-white border border-slate-700 rounded-xl outline-none focus:border-indigo-500 text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Colegio y RBD */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wide">
                  3. Establecimiento Educacional
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] text-slate-400 mb-0.5">Colegio Oficial</label>
                    <select
                      value={newUserData.rbd}
                      onChange={e => {
                        const selected = establecimientosCatalog.find(est => est.rbd === e.target.value);
                        if (selected) {
                          setNewUserData(prev => ({
                            ...prev,
                            rbd: selected.rbd,
                            establecimiento: selected.nombre,
                            comuna: selected.comuna,
                            dependencia: selected.dependencia
                          }));
                        }
                      }}
                      className="w-full px-3 py-2 bg-slate-950 text-white border border-slate-700 rounded-xl outline-none focus:border-indigo-500 text-xs"
                    >
                      {establecimientosCatalog.map(est => (
                        <option key={est.rbd} value={est.rbd}>{est.nombre} (RBD {est.rbd})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-0.5">RBD</label>
                    <input
                      type="text"
                      required
                      value={newUserData.rbd}
                      onChange={e => setNewUserData(prev => ({ ...prev, rbd: e.target.value }))}
                      placeholder="31030"
                      className="w-full px-3 py-2 bg-slate-950 text-white border border-slate-700 rounded-xl outline-none focus:border-indigo-500 text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Credenciales y Plan */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-indigo-950/20 border border-indigo-900/40 rounded-2xl">
                <div>
                  <label className="block text-[10px] font-bold text-indigo-300 uppercase tracking-wide mb-1 flex items-center gap-1">
                    <Lock className="w-3 h-3 text-indigo-400" /> Contraseña Inicial de Acceso
                  </label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      required
                      value={newUserData.tempPassword}
                      onChange={e => setNewUserData(prev => ({ ...prev, tempPassword: e.target.value }))}
                      placeholder="Sysget2026!"
                      className="flex-1 px-3 py-1.5 bg-slate-950 text-emerald-300 border border-indigo-500/40 rounded-xl text-xs font-mono font-bold outline-none focus:border-indigo-400"
                    />
                    <button
                      type="button"
                      onClick={() => setNewUserData(prev => ({ ...prev, tempPassword: `Saber_${Math.floor(1000 + Math.random() * 9000)}!` }))}
                      title="Generar contraseña aleatoria"
                      className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-indigo-300 rounded-xl text-[11px] font-semibold border border-indigo-800/40"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">Podrá cambiarla en cualquier momento.</p>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-indigo-300 uppercase tracking-wide mb-1 flex items-center gap-1">
                    <CreditCard className="w-3 h-3 text-indigo-400" /> Plan Asignado
                  </label>
                  <select
                    value={newUserData.plan}
                    onChange={e => setNewUserData(prev => ({ ...prev, plan: e.target.value as UserPlan }))}
                    className="w-full px-3 py-1.5 bg-slate-950 text-white border border-indigo-500/40 rounded-xl text-xs font-semibold outline-none focus:border-indigo-400"
                  >
                    <option value="institucional">Institucional ($99.990) - Recomendado Directivos</option>
                    <option value="trial">Trial (30 días de prueba)</option>
                    <option value="pro">Pro ($59.990)</option>
                    <option value="free">Free ($0)</option>
                  </select>
                  <p className="text-[10px] text-slate-400 mt-1">El usuario se creará con estado Activo de inmediato.</p>
                </div>
              </div>

              {/* Botones de Acción */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-all font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isCreatingUser}
                  className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
                >
                  {isCreatingUser ? (
                    <>
                      <Clock className="w-4 h-4 animate-spin" />
                      <span>Creando en Supabase...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Crear y Activar Cuenta</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
