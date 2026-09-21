import React, { useState, useMemo } from 'react';
import {
  Building2,
  ShieldCheck,
  Power,
  PowerOff,
  Search,
  Users,
  Clock,
  CreditCard,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  School
} from 'lucide-react';
import { UserProfile, UserEstado, UserPlan } from '../types';
import { calcularDiasRestantes } from '../utils/userAccess';

export interface ColegioSummary {
  key: string;
  nombre: string;
  rbd?: string;
  comuna?: string;
  dependencia?: string;
  totalUsuarios: number;
  activos: number;
  suspendidos: number;
  pendientes: number;
  estadoGlobal: 'activo' | 'suspendido' | 'parcial';
  planPredominante: UserPlan;
  diasRestantesMin: number;
  usuarios: UserProfile[];
}

interface AdminColegiosPanelProps {
  usuarios: UserProfile[];
  onToggleColegio: (
    filter: { rbd?: string; establecimiento?: string },
    nuevoEstado: UserEstado,
    nuevoPlan?: UserPlan
  ) => Promise<{ error: string | null }>;
  onViewColegioUsers: (establecimiento: string) => void;
  onToast: (msg: string) => void;
}

export const AdminColegiosPanel: React.FC<AdminColegiosPanelProps> = ({
  usuarios,
  onToggleColegio,
  onViewColegioUsers,
  onToast,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState<'todos' | 'activo' | 'suspendido'>('todos');
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  // Agrupar usuarios por colegio (priorizando RBD único o nombre de establecimiento)
  const colegiosList: ColegioSummary[] = useMemo(() => {
    const map = new Map<string, UserProfile[]>();

    usuarios.forEach(u => {
      // Ignorar superadministrador global sin colegio
      if (u.esSuperAdmin && !u.establecimiento) return;

      const rawName = (u.establecimiento || 'Establecimiento Sin Nombre').trim();
      const rawRbd = u.rbd ? u.rbd.trim() : '';
      const key = rawRbd ? `rbd:${rawRbd}` : `nom:${rawName.toLowerCase()}`;

      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(u);
    });

    const result: ColegioSummary[] = [];

    map.forEach((userGroup, key) => {
      const first = userGroup[0];
      const rbd = userGroup.find(u => u.rbd && u.rbd.trim())?.rbd;
      const comuna = userGroup.find(u => u.comuna && u.comuna.trim())?.comuna;
      const dependencia = userGroup.find(u => u.dependencia && u.dependencia.trim())?.dependencia;

      const activos = userGroup.filter(u => u.estado === 'activo').length;
      const suspendidos = userGroup.filter(u => u.estado === 'suspendido').length;
      const pendientes = userGroup.filter(u => u.estado === 'pendiente_aprobacion').length;

      const estadoGlobal: 'activo' | 'suspendido' | 'parcial' =
        suspendidos === userGroup.length
          ? 'suspendido'
          : activos === userGroup.length
          ? 'activo'
          : 'parcial';

      let planPredominante: UserPlan = 'trial';
      if (userGroup.some(u => u.plan === 'institucional')) {
        planPredominante = 'institucional';
      } else if (userGroup.some(u => u.plan === 'pro')) {
        planPredominante = 'pro';
      }

      const trialUsers = userGroup.filter(u => (u.plan || 'trial') === 'trial');
      const diasRestantesMin = trialUsers.length > 0
        ? Math.min(...trialUsers.map(u => calcularDiasRestantes(u)))
        : 30;

      result.push({
        key,
        nombre: first.establecimiento || 'Establecimiento Sin Nombre',
        rbd,
        comuna,
        dependencia,
        totalUsuarios: userGroup.length,
        activos,
        suspendidos,
        pendientes,
        estadoGlobal,
        planPredominante,
        diasRestantesMin,
        usuarios: userGroup,
      });
    });

    return result.sort((a, b) => a.nombre.localeCompare(b.nombre));
  }, [usuarios]);

  // Filtrado
  const filteredColegios = useMemo(() => {
    return colegiosList.filter(col => {
      const matchesSearch =
        col.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (col.rbd && col.rbd.includes(searchTerm)) ||
        (col.comuna && col.comuna.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesEstado =
        filterEstado === 'todos' ||
        (filterEstado === 'activo' && col.estadoGlobal !== 'suspendido') ||
        (filterEstado === 'suspendido' && col.estadoGlobal === 'suspendido');

      return matchesSearch && matchesEstado;
    });
  }, [colegiosList, searchTerm, filterEstado]);

  // Métricas
  const totalColegios = colegiosList.length;
  const activosColegios = colegiosList.filter(c => c.estadoGlobal === 'activo').length;
  const suspendidosColegios = colegiosList.filter(c => c.estadoGlobal === 'suspendido').length;
  const trialColegios = colegiosList.filter(c => c.planPredominante === 'trial').length;

  const handleAction = async (
    col: ColegioSummary,
    nuevoEstado: UserEstado,
    nuevoPlan?: UserPlan
  ) => {
    setIsProcessing(col.key);
    try {
      const res = await onToggleColegio(
        { rbd: col.rbd, establecimiento: col.nombre },
        nuevoEstado,
        nuevoPlan
      );
      if (res?.error) {
        onToast(`Error: ${res.error}`);
      } else {
        if (nuevoEstado === 'suspendido') {
          onToast(`🚫 Colegio "${col.nombre}" y sus ${col.totalUsuarios} cuentas han sido desactivadas.`);
        } else if (nuevoPlan === 'institucional') {
          onToast(`🌟 Colegio "${col.nombre}" activado con Plan Institucional Ilimitado.`);
        } else {
          onToast(`✅ Colegio "${col.nombre}" activado exitosamente con 30 días de prueba.`);
        }
      }
    } catch {
      onToast('Error de comunicación con el servidor.');
    } finally {
      setIsProcessing(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-left">
      {/* Header Info */}
      <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900/60 to-slate-900/60 border border-emerald-500/20 p-6 rounded-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-2 bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 rounded-xl">
                <School className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-black text-white">
                Gestión Centralizada de Colegios y Establecimientos
              </h2>
            </div>
            <p className="text-xs text-slate-400 max-w-2xl">
              Control masivo y eficiente: activa o desactiva con un solo clic el acceso de todos los docentes y directivos de un colegio completo.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-xl text-xs font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Control en Bloque
            </span>
          </div>
        </div>
      </div>

      {/* Métricas de Colegios */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Colegios Registrados</span>
            <Building2 className="w-4 h-4 text-slate-500" />
          </div>
          <div className="text-2xl font-black text-white">{totalColegios}</div>
          <p className="text-[11px] text-slate-500">Establecimientos en plataforma</p>
        </div>

        <div className="bg-emerald-950/20 border border-emerald-500/30 p-4 rounded-2xl space-y-1.5">
          <div className="flex items-center justify-between text-xs text-emerald-400 font-semibold">
            <span>Colegios Activos</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-300">{activosColegios}</div>
          <p className="text-[11px] text-emerald-400/80">Acceso docente habilitado</p>
        </div>

        <div className="bg-rose-950/20 border border-rose-500/30 p-4 rounded-2xl space-y-1.5">
          <div className="flex items-center justify-between text-xs text-rose-400 font-semibold">
            <span>Colegios Desactivados</span>
            <XCircle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-black text-rose-300">{suspendidosColegios}</div>
          <p className="text-[11px] text-rose-400/80">Acceso bloqueado / suspendido</p>
        </div>

        <div className="bg-indigo-950/20 border border-indigo-500/30 p-4 rounded-2xl space-y-1.5">
          <div className="flex items-center justify-between text-xs text-indigo-400 font-semibold">
            <span>En Período de Prueba</span>
            <Clock className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-indigo-300">{trialColegios}</div>
          <p className="text-[11px] text-indigo-400/80">Plan Trial (30 días)</p>
        </div>
      </div>

      {/* Barra de Filtros y Búsqueda */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/40 p-4 border border-slate-800 rounded-2xl">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre, RBD o comuna..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-950 text-white border border-slate-700 rounded-xl outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          {[
            { id: 'todos' as const, label: `Todos (${totalColegios})` },
            { id: 'activo' as const, label: `Activos (${activosColegios})` },
            { id: 'suspendido' as const, label: `Desactivados (${suspendidosColegios})` },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterEstado(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filterEstado === tab.id
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 font-bold'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de Colegios */}
      {filteredColegios.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center text-slate-500">
          No se encontraron colegios con los filtros seleccionados.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredColegios.map(col => {
            const isSuspended = col.estadoGlobal === 'suspendido';
            const isParcial = col.estadoGlobal === 'parcial';
            const isTrial = col.planPredominante === 'trial';
            const isTrialCaducado = isTrial && col.diasRestantesMin <= 0;
            const pctTrial = Math.round((col.diasRestantesMin / 30) * 100);
            const loadingThis = isProcessing === col.key;

            return (
              <div
                key={col.key}
                className={`rounded-2xl border p-5 transition-all shadow-xl flex flex-col justify-between gap-4 ${
                  isSuspended
                    ? 'bg-slate-900/40 border-rose-500/30'
                    : isParcial
                    ? 'bg-slate-900/60 border-amber-500/30'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Header de la tarjeta */}
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                          isSuspended
                            ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                            : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                        }`}
                      >
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-white line-clamp-1">
                          {col.nombre}
                        </h3>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                          {col.rbd && (
                            <span className="font-mono bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800 text-indigo-300 font-semibold">
                              RBD: {col.rbd}
                            </span>
                          )}
                          {col.comuna && <span>• {col.comuna}</span>}
                          {col.dependencia && (
                            <span className="truncate max-w-[140px] text-slate-500">• {col.dependencia}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Estado badge */}
                    <div>
                      {isSuspended ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                          <XCircle className="w-3 h-3" />
                          Desactivado
                        </span>
                      ) : isParcial ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          <AlertTriangle className="w-3 h-3" />
                          Parcial ({col.activos}/{col.totalUsuarios})
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          <CheckCircle2 className="w-3 h-3" />
                          Activo
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Detalle de cuentas y Plan */}
                  <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800/80 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-indigo-400" />
                        Cuentas vinculadas:
                      </span>
                      <strong className="text-white">
                        {col.totalUsuarios} usuario(s) ({col.activos} activos, {col.suspendidos} desactivados)
                      </strong>
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-850">
                      <span className="text-slate-400 flex items-center gap-1.5">
                        <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
                        Plan Predominante:
                      </span>
                      <span className={`uppercase font-bold px-2 py-0.5 rounded text-[10px] border ${
                        col.planPredominante === 'institucional'
                          ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                          : col.planPredominante === 'pro'
                          ? 'bg-sky-500/10 text-sky-300 border-sky-500/30'
                          : 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30'
                      }`}>
                        {col.planPredominante}
                      </span>
                    </div>

                    {isTrial && (
                      <div className="pt-1.5 space-y-1">
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="text-slate-500">Período de Prueba:</span>
                          {isTrialCaducado ? (
                            <span className="text-rose-400 font-extrabold">⚠️ Caducado (0 días restantes)</span>
                          ) : (
                            <span className="text-indigo-300 font-semibold">{col.diasRestantesMin} días restantes ({pctTrial}%)</span>
                          )}
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              isTrialCaducado ? 'bg-rose-500' : pctTrial <= 30 ? 'bg-amber-500' : 'bg-indigo-500'
                            }`}
                            style={{ width: `${Math.max(4, pctTrial)}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Acciones del Colegio */}
                <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
                  <button
                    onClick={() => onViewColegioUsers(col.nombre)}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1 hover:underline py-1"
                  >
                    <span>Ver {col.totalUsuarios} docente(s)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    {/* Botón de Desactivar / Activar Masivo */}
                    {isSuspended ? (
                      <button
                        onClick={() => handleAction(col, 'activo')}
                        disabled={loadingThis}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all disabled:opacity-50"
                      >
                        <Power className="w-3.5 h-3.5" />
                        <span>Activar Colegio</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleAction(col, 'suspendido')}
                        disabled={loadingThis}
                        className="px-3 py-1.5 bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/40 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all disabled:opacity-50"
                      >
                        <PowerOff className="w-3.5 h-3.5" />
                        <span>Desactivar Colegio</span>
                      </button>
                    )}

                    {/* Botón Ascender a Institucional */}
                    {col.planPredominante !== 'institucional' && (
                      <button
                        onClick={() => handleAction(col, 'activo', 'institucional')}
                        disabled={loadingThis}
                        title="Activar suscripción institucional ilimitada para todo el colegio"
                        className="px-2.5 py-1.5 bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white border border-slate-700 hover:border-indigo-500 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all disabled:opacity-50"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-indigo-400 group-hover:text-white" />
                        <span>Plan Institucional</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
