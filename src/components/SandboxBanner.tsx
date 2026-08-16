import React, { useState } from 'react';
import { FlaskConical, X, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';

interface SandboxBannerProps {
  isDemo?: boolean;
}

export const SandboxBanner: React.FC<SandboxBannerProps> = ({ isDemo = true }) => {
  const [dismissed, setDismissed] = useState(false);
  const [ctaClicked, setCtaClicked] = useState(false);
  const [showModal, setShowModal] = useState(false);

  if (!isDemo) return null;

  const handleCTA = () => {
    setShowModal(true);
  };

  return (
    <>
      {/* Top banner */}
      {!dismissed && (
        <div className="sticky top-0 z-[100] flex items-center justify-between px-4 py-2 bg-gradient-to-r from-amber-500/20 via-indigo-900/40 to-amber-500/20 border-b border-amber-500/30 backdrop-blur-md text-slate-100 shadow-sm animate-fade-in">
          <div className="flex items-center gap-2.5 text-xs font-semibold text-amber-200">
            <div className="p-1 bg-amber-500/20 rounded-md text-amber-400">
              <FlaskConical className="w-3.5 h-3.5" />
            </div>
            <span>
              <strong className="text-amber-300 font-black tracking-wide">MODO DEMOSTRACIÓN</strong> — Estás explorando datos de prueba del{' '}
              <span className="text-white font-bold underline decoration-amber-400/50">Liceo Bicentenario Los Andes</span>.
            </span>
          </div>
          <button
            onClick={() => setDismissed(true)}
            className="p-1 rounded-lg text-amber-400/80 hover:text-white hover:bg-amber-500/20 transition-colors flex-shrink-0"
            title="Ocultar aviso"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Floating CTA bottom-right */}
      <div className="fixed bottom-6 right-6 z-[90] animate-bounce-subtle">
        <button
          onClick={handleCTA}
          className="flex items-center gap-2 px-4 py-3 rounded-2xl text-xs font-bold shadow-2xl transition-all bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 text-white shadow-indigo-600/40 hover:scale-105 hover:shadow-indigo-500/60 active:scale-95 border border-indigo-400/30"
          title="Solicitar demo con datos reales de tu colegio"
        >
          <Sparkles className="w-4 h-4 text-amber-300 animate-spin-slow" />
          <span>¿Quieres esto con tu colegio real?</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Contact modal */}
      {showModal && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 text-left relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">Prueba Sysget Saber en tu Colegio</h3>
              <p className="text-xs text-slate-400 mt-1">
                Implementamos diagnósticos SIMCE oficiales y analítica curricular personalizada para tu equipo directivo y docente.
              </p>
            </div>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Nombre del Establecimiento / Colegio"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-indigo-500"
              />
              <input
                type="email"
                placeholder="Correo corporativo o institucional"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-indigo-500"
              />
            </div>

            <button
              onClick={() => {
                setCtaClicked(true);
                setTimeout(() => {
                  setCtaClicked(false);
                  setShowModal(false);
                }, 1500);
              }}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-white text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
            >
              {ctaClicked ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>¡Solicitud Enviada con Éxito!</span>
                </>
              ) : (
                <span>Solicitar Demostración Guiada</span>
              )}
            </button>
          </div>
        </div>
      )}
    </>
  );
};
