import { AlertTriangle, Info, AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/utils';
import type { ReactNode } from 'react';

type AlertProps = {
  title: string;
  description: string;
  tone?: 'info' | 'warning' | 'critical' | 'success';
  action?: ReactNode;
  className?: string;
};

const toneConfig = {
  info: {
    container: 'border-sky-200 bg-sky-50/80 dark:border-sky-800 dark:bg-sky-950/30',
    icon: 'text-sky-600 dark:text-sky-400',
    Icon: Info,
  },
  warning: {
    container: 'border-amber-200 bg-amber-50/80 dark:border-amber-800 dark:bg-amber-950/30',
    icon: 'text-amber-600 dark:text-amber-400',
    Icon: AlertTriangle,
  },
  critical: {
    container: 'border-red-200 bg-red-50/80 dark:border-red-800 dark:bg-red-950/30',
    icon: 'text-red-600 dark:text-red-400',
    Icon: AlertCircle,
  },
  success: {
    container: 'border-emerald-200 bg-emerald-50/80 dark:border-emerald-800 dark:bg-emerald-950/30',
    icon: 'text-emerald-600 dark:text-emerald-400',
    Icon: CheckCircle2,
  },
} as const;

export function Alert({ title, description, tone = 'info', action, className }: AlertProps) {
  const config = toneConfig[tone];
  const ToneIcon = config.Icon;

  return (
    <div
      role="alert"
      className={cn(
        'rounded-xl border p-4 shadow-xs',
        config.container,
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn('mt-0.5 shrink-0', config.icon)}>
          <ToneIcon size={18} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-foreground">{title}</p>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          {action ? <div className="mt-3">{action}</div> : null}
        </div>
      </div>
    </div>
  );
}
