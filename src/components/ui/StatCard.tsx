import { cn } from '../../utils';
import type { LucideIcon } from 'lucide-react';

type Tone = 'emerald' | 'amber' | 'red' | 'sky' | 'violet' | 'slate';

const toneStyles: Record<Tone, { icon: string; value: string }> = {
  emerald: {
    icon: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
    value: 'text-emerald-700 dark:text-emerald-300',
  },
  amber: {
    icon: 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
    value: 'text-amber-700 dark:text-amber-300',
  },
  red: {
    icon: 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300',
    value: 'text-red-700 dark:text-red-300',
  },
  sky: {
    icon: 'bg-sky-100 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300',
    value: 'text-sky-700 dark:text-sky-300',
  },
  violet: {
    icon: 'bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300',
    value: 'text-violet-700 dark:text-violet-300',
  },
  slate: {
    icon: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    value: 'text-foreground',
  },
};

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  tone?: Tone;
  subtitle?: string;
  className?: string;
}

export function StatCard({ label, value, icon: Icon, tone = 'slate', subtitle, className }: StatCardProps) {
  const styles = toneStyles[tone];
  return (
    <div className={cn('rounded-xl border border-border bg-card p-5 shadow-sm transition-all duration-200 hover:shadow-md', className)}>
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
          <p className={cn('mt-2 text-3xl font-bold tabular-nums', styles.value)}>{value}</p>
          {subtitle && <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        <div className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-xl', styles.icon)}>
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}
