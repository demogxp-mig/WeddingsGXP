import React from 'react';

interface StatsCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  description?: string;
  progressPercent?: number;
  progressColor?: string;
  auxiliary?: React.ReactNode;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  label,
  value,
  subValue,
  description,
  progressPercent,
  progressColor = 'bg-stone-800',
  auxiliary,
}) => {
  return (
    <div className="bg-white border border-stone-200/80 rounded-xl p-5 shadow-xs transition-shadow hover:shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <span className="text-xs uppercase tracking-wider text-stone-600 font-medium">
          {label}
        </span>
        {auxiliary}
      </div>

      <div className="mt-2.5 flex items-baseline gap-2">
        <span className="text-3xl font-serif text-stone-900 tracking-tight tabular-nums">
          {value}
        </span>
        {subValue && (
          <span className="text-xs text-stone-600 font-medium tabular-nums">
            {subValue}
          </span>
        )}
      </div>

      {progressPercent !== undefined && (
        <div className="mt-3">
          <div className="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${progressColor}`}
              style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
            />
          </div>
        </div>
      )}

      {description && (
        <div className="mt-2 text-xs text-stone-600">
          {description}
        </div>
      )}
    </div>
  );
};
