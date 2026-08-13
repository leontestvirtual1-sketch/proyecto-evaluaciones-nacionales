import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: {
    text: string;
    type: 'positive' | 'negative' | 'warning' | 'neutral';
  };
  iconBgColor?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  iconBgColor = 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400'
}) => {
  const getTrendBadge = () => {
    if (!trend) return null;
    let classes = 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
    if (trend.type === 'positive') classes = 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
    if (trend.type === 'negative') classes = 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
    if (trend.type === 'warning') classes = 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';

    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${classes}`}>
        {trend.text}
      </span>
    );
  };

  return (
    <div className="glass-card p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {title}
        </span>
        <div className={`p-2.5 rounded-xl ${iconBgColor}`}>
          {icon}
        </div>
      </div>
      <div className="mt-3 flex items-baseline justify-between">
        <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          {value}
        </div>
        {getTrendBadge()}
      </div>
      {subtitle && (
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          {subtitle}
        </p>
      )}
    </div>
  );
};
