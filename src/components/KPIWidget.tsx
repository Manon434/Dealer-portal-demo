import type { ReactNode } from 'react';
import clsx from 'clsx';

interface KPIWidgetProps {
  label: string;
  value: string;
  hint: string;
  icon: ReactNode;
  tone?: 'default' | 'warning' | 'positive';
}

export function KPIWidget({ label, value, hint, icon, tone = 'default' }: KPIWidgetProps) {
  return (
    <article
      className={clsx(
        'rounded-xl border bg-white p-4 shadow-panel',
        tone === 'warning' && 'border-amber-300',
        tone === 'positive' && 'border-emerald-200',
        tone === 'default' && 'border-mill-200',
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-mill-800/70">{label}</p>
        <span
          className={clsx(
            'rounded-md p-2',
            tone === 'warning' && 'bg-amber-50 text-amber-700',
            tone === 'positive' && 'bg-emerald-50 text-emerald-700',
            tone === 'default' && 'bg-mill-100 text-mill-800',
          )}
        >
          {icon}
        </span>
      </div>
      <p className="mt-3 break-all font-mono text-xl font-semibold tracking-tight text-mill-950 sm:text-2xl">{value}</p>
      <p className="mt-1 text-sm text-mill-800/70">{hint}</p>
    </article>
  );
}
