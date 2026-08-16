import React, { useState } from 'react';
import {
  X,
  FileCheck2,
  TrendingUp,
  Target,
  Calendar,
  AlertTriangle,
  Download,
  CheckCircle2,
  Sparkles,
  School,
  FileText
} from 'lucide-react';
import { APP_CONFIG } from '../config/appConfig';

interface PlanMejoramientoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PlanMejoramientoModal: React.FC<PlanMejoramientoModalProps> = ({
  isOpen,
  onClose
}) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleExportPDF = () => {
    setToastMessage('📄 Generando PDF con marca de agua DEMO... (Próximamente descarga automática)');
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col my-auto overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-indigo-950/60 via-slate-900 to-slate-900">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-violet-600 text-white rounded-2xl shadow-lg shadow-indigo-500/25">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-white">Plan de Mejoramiento Educativo (PME) 2026</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Autogenerado con IA Curricular
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
                <School className="w-3.5 h-3.5 text-indigo-400" />
                <span>{APP_CONFIG.nombreEstablecimiento} • RBD: {APP_CONFIG.rbd}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 text-left text-slate-200">
          {/* Toast Notification */}
          {toastMessage && (
            <div className="p-3 rounded-2xl bg-indigo-600 text-white text-xs font-semibold flex items-center gap-2 shadow-lg animate-fade-in">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* Diagnostic Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Meta Institucional 2026</div>
              <div className="text-2xl font-black text-emerald-400">+15 pts SIMCE</div>
              <div className="text-[11px] text-slate-500 mt-1">Alcanzar 265 pts promedio global</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Foco de Intervención</div>
              <div className="text-2xl font-black text-amber-400">8° Básico B</div>
              <div className="text-[11px] text-slate-500 mt-1">6 alumnos con brecha crítica en Álgebra</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Cobertura Remedial</div>
              <div className="text-2xl font-black text-indigo-400">100% Automatizada</div>
              <div className="text-[11px] text-slate-500 mt-1">Planes individuales listos para docentes</div>
            </div>
          </div>

          {/* Pillars & Strategic Actions */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Target className="w-4 h-4 text-indigo-400" />
              Ejes Estratégicos por Departamento
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Matemática */}
              <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    📐 Departamento Matemática
                  </span>
                  <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md">
                    Prioridad Alta
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Reforzar Álgebra y Funciones (OA 02) y Geometría Pitagórica en 8° Básicos. Aplicar 2 mini-ensayos quincenales de control.
                </p>
                <div className="text-[11px] text-indigo-300 font-semibold flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> Plazo: Marzo - Mayo 2026
                </div>
              </div>

              {/* Ciencias */}
              <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    🔬 Ciencias Naturales
                  </span>
                  <span className="text-[10px] font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-md">
                    Prioridad Media
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Taller de circuitos eléctricos (OA 12) y circulación sanguínea en 6° Básico mediante esquemas visuales interactivos.
                </p>
                <div className="text-[11px] text-indigo-300 font-semibold flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> Plazo: Abril - Junio 2026
                </div>
              </div>

              {/* Lenguaje */}
              <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    📖 Lenguaje y Comunicación
                  </span>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                    Consolidación
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Focalizar en textos no literarios y distinción entre inferencia sustentada vs suposiciones subjetivas en 8° Básico.
                </p>
                <div className="text-[11px] text-indigo-300 font-semibold flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> Plazo: Todo el semestre
                </div>
              </div>
            </div>
          </div>

          {/* Action timeline */}
          <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 space-y-3">
            <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Cronograma de Evaluaciones Nacionales y Simce Interno
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="text-indigo-400 font-bold">1. Diagnóstico Inicial</div>
                <div className="text-slate-400 text-[11px] mt-0.5">100% Alumnos (Rendido)</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="text-amber-400 font-bold">2. Ensayo Intermedio</div>
                <div className="text-slate-400 text-[11px] mt-0.5">Mayo 2026 (En agenda)</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="text-sky-400 font-bold">3. Ensayo General</div>
                <div className="text-slate-400 text-[11px] mt-0.5">Agosto 2026</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="text-emerald-400 font-bold">4. SIMCE Oficial</div>
                <div className="text-slate-400 text-[11px] mt-0.5">Octubre / Noviembre</div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-5 border-t border-slate-800 flex items-center justify-between bg-slate-950/60">
          <span className="text-xs text-slate-400">
            Documento de demostración interactiva • Sysget Saber Chile
          </span>
          <div className="flex gap-2">
            <button
              onClick={handleExportPDF}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-all border border-slate-700"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar PDF (Demo)</span>
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all shadow-md shadow-indigo-600/30"
            >
              Entendido
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
