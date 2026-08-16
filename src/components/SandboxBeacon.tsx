import React, { useState, useEffect } from 'react';

interface SandboxBeaconProps {
  label?: string;
  durationMs?: number;
  className?: string;
}

export const SandboxBeacon: React.FC<SandboxBeaconProps> = ({
  label = 'Acción Estrella ⭐',
  durationMs = 12000,
  className = ''
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), durationMs);
    return () => clearTimeout(timer);
  }, [durationMs]);

  if (!visible) return null;

  return (
    <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm animate-pulse ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
      <span>{label}</span>
    </div>
  );
};
