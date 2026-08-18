import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  Legend,
  Cell
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  Target,
  Users,
  BarChart2,
  ChevronDown,
  ChevronUp,
  Info
} from 'lucide-react';
import {
  SIMCE_PREMIL_RESULTADO_2025,
  SIMCE_PREMIL_TENDENCIA_GSE,
  SIMCE_PREMIL_NIVELES,
  SIMCE_PREMIL_SEXO,
  SIMCE_PREMIL_ESTABLECIMIENTO,
} from '../data/simceHistoricoPremilData';

type TabId = 'tendencia' | 'niveles' | 'sexo';

// ─── Tooltip personalizado ───────────────────────────────────────────
const CustomTooltipTendencia = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const colegio = payload.find((p: any) => p.dataKey === 'puntajeColegio');
  const gse = payload.find((p: any) => p.dataKey === 'puntajeNacionalGSE');
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs shadow-xl">
      <p className="font-bold text-white mb-2">{label}</p>
      {colegio && (
        <p className="text-indigo-300">🏫 Premilitar: <strong>{colegio.value} pts</strong></p>
      )}
      {gse && (
        <p className="text-slate-400">🇨🇱 GSE Medio Bajo: <strong>{gse.value} pts</strong></p>
      )}
      {colegio && gse && (
        <p className={`mt-1.5 font-bold ${colegio.value >= gse.value ? 'text-emerald-400' : 'text-rose-400'}`}>
          Brecha: {colegio.value - gse.value > 0 ? '+' : ''}{colegio.value - gse.value} pts
        </p>
      )}
    </div>
  );
};

const CustomTooltipNiveles = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs shadow-xl">
      <p className="font-bold text-white mb-2">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.fill || p.color }}>
          {p.name}: <strong>{p.value}%</strong>
        </p>
      ))}
    </div>
  );
};

export const SimceHistoricoPremilSection: React.FC = () => {
  const [tab, setTab] = useState<TabId>('tendencia');
  const [expanded, setExpanded] = useState(true);

  const r = SIMCE_PREMIL_RESULTADO_2025;
  const est = SIMCE_PREMIL_ESTABLECIMIENTO;

  // tendencia formateada para recharts
  const tendenciaData = SIMCE_PREMIL_TENDENCIA_GSE.map(d => ({
    ...d,
    anio: String(d.anio),
  }));

  // niveles formateados
  const nivelesData = SIMCE_PREMIL_NIVELES.map(d => ({
    ...d,
    anio: String(d.anio),
  }));

  // sexo formateado
  const sexoData = SIMCE_PREMIL_SEXO.map(d => ({
    ...d,
    anio: String(d.anio),
  }));

  const deltaIcon = (val: number) => {
    if (val > 0) return <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />;
    if (val < 0) return <TrendingDown className="w-3.5 h-3.5 text-rose-400" />;
    return <Minus className="w-3.5 h-3.5 text-slate-400" />;
  };

  const deltaColor = (val: number) =>
    val > 0 ? 'text-emerald-400' : val < 0 ? 'text-rose-400' : 'text-slate-400';

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/20">
            <BarChart2 className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              Línea Base Oficial SIMCE
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Agencia de Calidad
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {est.asignatura} • {est.nivel} • {est.nombre} (RBD {est.rbd}) • {est.anioMedicion}
            </p>
          </div>
        </div>
        <button
          onClick={() => setExpanded(v => !v)}
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all self-start sm:self-center"
        >
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {expanded && (
        <>
          {/* KPI Cards 2025 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Puntaje 2025 */}
            <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 text-center space-y-1">
              <p className="text-[10px] uppercase font-bold text-indigo-400 tracking-wide">Puntaje 2025</p>
              <p className="text-3xl font-black text-white">{r.puntajeColegio}</p>
              <p className="text-[10px] text-slate-400">pts oficiales</p>
              <p className="text-[10px] text-indigo-300 flex items-center justify-center gap-1">
                {deltaIcon(2)} <span>+2 vs 2024</span>
              </p>
            </div>

            {/* Meta GSE */}
            <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/20 text-center space-y-1">
              <p className="text-[10px] uppercase font-bold text-rose-400 tracking-wide">Meta GSE</p>
              <p className="text-3xl font-black text-white">{r.puntajeNacionalGSE}</p>
              <p className="text-[10px] text-slate-400">pts (Medio Bajo)</p>
              <p className={`text-[10px] flex items-center justify-center gap-1 font-bold ${deltaColor(r.diferenciaVsGSE)}`}>
                {deltaIcon(r.diferenciaVsGSE)} <span>{r.diferenciaVsGSE} pts de brecha</span>
              </p>
            </div>

            {/* Vs Dependencia */}
            <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/50 text-center space-y-1">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wide">Vs Dependencia</p>
              <p className={`text-3xl font-black ${deltaColor(r.diferenciaVsDependencia)}`}>{r.diferenciaVsDependencia}</p>
              <p className="text-[10px] text-slate-400">vs Part. Subv.</p>
              <p className="text-[10px] text-slate-500">Brecha institucional</p>
            </div>

            {/* Vs Nacional */}
            <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/50 text-center space-y-1">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wide">Vs Nacional</p>
              <p className={`text-3xl font-black ${deltaColor(r.diferenciaVsNacional)}`}>{r.diferenciaVsNacional}</p>
              <p className="text-[10px] text-slate-400">vs prom. país</p>
              <p className="text-[10px] text-slate-500">Brecha nacional</p>
            </div>
          </div>

          {/* Tabs de gráficos */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-2xl border border-slate-800 self-start w-full sm:w-auto overflow-x-auto">
            {([
              { id: 'tendencia', label: '📈 Tendencia GSE', icon: TrendingUp },
              { id: 'niveles',   label: '🎯 Niveles Aprendizaje', icon: Target },
              { id: 'sexo',     label: '👥 Por Género', icon: Users },
            ] as const).map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  tab === t.id
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* ─── Gráfico Tendencia GSE ─────────────────────────────── */}
          {tab === 'tendencia' && (
            <div className="space-y-3 animate-fade-in">
              <div className="flex items-start gap-2 p-3 rounded-xl bg-slate-800/40 border border-slate-700/50">
                <Info className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                <p className="text-xs text-slate-300">
                  El colegio superaba al GSE Medio Bajo en <strong>2016 (+5 pts)</strong>, 
                  cayó al mínimo en <strong>2022 (194 pts)</strong> por efectos de pandemia y 
                  está en recuperación sostenida: <strong>219 pts en 2025 (▲ +25 pts vs 2022)</strong>.
                  La meta 2026 es ≥ 240 pts.
                </p>
              </div>
              <div style={{ height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={tendenciaData} margin={{ top: 5, right: 10, left: -15, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="anio" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                    <YAxis domain={[170, 260]} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                    <Tooltip content={<CustomTooltipTendencia />} />
                    <Legend
                      formatter={(value) =>
                        value === 'puntajeColegio'
                          ? <span className="text-xs text-indigo-300">🏫 Premilitar</span>
                          : <span className="text-xs text-slate-400">🇨🇱 GSE Medio Bajo</span>
                      }
                    />
                    <ReferenceLine y={240} stroke="#f59e0b" strokeDasharray="4 4" label={{ value: 'Meta 240', fill: '#f59e0b', fontSize: 10 }} />
                    <Line
                      type="monotone"
                      dataKey="puntajeColegio"
                      stroke="#6366f1"
                      strokeWidth={3}
                      dot={{ fill: '#6366f1', r: 5, strokeWidth: 2, stroke: '#312e81' }}
                      activeDot={{ r: 7 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="puntajeNacionalGSE"
                      stroke="#475569"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={{ fill: '#475569', r: 4 }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* ─── Gráfico Niveles de Aprendizaje ─────────────────────── */}
          {tab === 'niveles' && (
            <div className="space-y-3 animate-fade-in">
              <div className="grid grid-cols-3 gap-3 text-center text-xs">
                <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/20">
                  <p className="text-rose-400 font-bold text-[10px] uppercase mb-1">Insuficiente 2025</p>
                  <p className="text-2xl font-black text-rose-300">72.0%</p>
                  <p className="text-[10px] text-rose-500 mt-0.5">↓ −11.7 pp vs 2022</p>
                </div>
                <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/20">
                  <p className="text-amber-400 font-bold text-[10px] uppercase mb-1">Elemental 2025</p>
                  <p className="text-2xl font-black text-amber-300">23.8%</p>
                  <p className="text-[10px] text-amber-500 mt-0.5">↑ +10.0 pp vs 2022</p>
                </div>
                <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/20">
                  <p className="text-emerald-400 font-bold text-[10px] uppercase mb-1">Adecuado 2025</p>
                  <p className="text-2xl font-black text-emerald-300">4.3%</p>
                  <p className="text-[10px] text-emerald-500 mt-0.5">↑ +1.9 pp vs 2022</p>
                </div>
              </div>
              <div style={{ height: 230 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={nivelesData} margin={{ top: 5, right: 10, left: -15, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="anio" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                    <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
                    <Tooltip content={<CustomTooltipNiveles />} />
                    <Legend />
                    <Bar dataKey="insuficiente" name="Insuficiente" stackId="a" fill="#f43f5e" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="elemental"    name="Elemental"    stackId="a" fill="#f59e0b" />
                    <Bar dataKey="adecuado"     name="Adecuado"     stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* ─── Gráfico por Género ───────────────────────────────── */}
          {tab === 'sexo' && (
            <div className="space-y-3 animate-fade-in">
              <div className="flex items-start gap-2 p-3 rounded-xl bg-slate-800/40 border border-slate-700/50">
                <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                <p className="text-xs text-slate-300">
                  <strong className="text-amber-300">Alerta pedagógica:</strong> Las mujeres registran 
                  <strong> 230 pts</strong> y los hombres <strong>213 pts</strong> en 2025, 
                  una brecha de <strong>+17 pts</strong>. Los hombres se mantienen estancados desde 2023. 
                  Se requiere estrategia específica de motivación lectora masculina.
                </p>
              </div>
              <div style={{ height: 230 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sexoData} margin={{ top: 5, right: 10, left: -15, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="anio" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                    <YAxis domain={[170, 270]} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                    <Tooltip content={<CustomTooltipNiveles />} />
                    <Legend />
                    <ReferenceLine y={240} stroke="#f59e0b" strokeDasharray="4 4" />
                    <Line
                      type="monotone"
                      dataKey="mujeres"
                      name="👩 Mujeres"
                      stroke="#ec4899"
                      strokeWidth={3}
                      dot={{ fill: '#ec4899', r: 5, strokeWidth: 2, stroke: '#831843' }}
                      activeDot={{ r: 7 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="hombres"
                      name="👨 Hombres"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      dot={{ fill: '#3b82f6', r: 5, strokeWidth: 2, stroke: '#1e3a8a' }}
                      activeDot={{ r: 7 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              {/* Tabla resumen brecha */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-slate-800">
                      <th className="text-left py-2 px-3 text-slate-500 font-bold">Año</th>
                      <th className="text-center py-2 px-3 text-pink-400 font-bold">👩 Mujeres</th>
                      <th className="text-center py-2 px-3 text-blue-400 font-bold">👨 Hombres</th>
                      <th className="text-center py-2 px-3 text-slate-400 font-bold">Brecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SIMCE_PREMIL_SEXO.map(d => (
                      <tr key={d.anio} className="border-b border-slate-800/60 hover:bg-slate-800/30 transition-colors">
                        <td className="py-2 px-3 font-bold text-white">{d.anio}</td>
                        <td className="py-2 px-3 text-center text-pink-300 font-semibold">
                          {d.mujeres} pts {d.significativoMujeres && <span className="text-[9px] text-emerald-400">★</span>}
                        </td>
                        <td className="py-2 px-3 text-center text-blue-300 font-semibold">{d.hombres} pts</td>
                        <td className={`py-2 px-3 text-center font-bold ${d.brechaSexo > 0 ? 'text-pink-400' : d.brechaSexo < 0 ? 'text-blue-400' : 'text-slate-400'}`}>
                          {d.brechaSexo > 0 ? '+' : ''}{d.brechaSexo} pts
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Footer fuente */}
          <div className="flex items-center gap-2 pt-3 border-t border-slate-800">
            <Info className="w-3.5 h-3.5 text-slate-600 shrink-0" />
            <p className="text-[10px] text-slate-600">
              Fuente: {est.fuente} — Datos oficiales. El año 2022 incluye restricciones estadísticas (marcados con *) por tamaño de muestra.
            </p>
          </div>
        </>
      )}
    </div>
  );
};
