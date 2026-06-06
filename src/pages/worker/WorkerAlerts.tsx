import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BellRing,
  MapPin,
  Phone,
  ShieldAlert,
  Siren,
  Users,
} from 'lucide-react';
import { cn } from '../../utils';
import { getWorkerAlerts, getWorkerContext } from './workerAlertData';

export function WorkerAlerts() {
  const navigate = useNavigate();
  const { currentAWC, currentWorker } = getWorkerContext();
  const alerts = getWorkerAlerts();
  const [filter, setFilter] = useState<'all' | 'critical' | 'warning'>('all');

  const filteredAlerts = useMemo(() => {
    if (filter === 'all') return alerts;
    return alerts.filter((alert) => alert.severity === filter);
  }, [alerts, filter]);

  const criticalCount = alerts.filter((alert) => alert.severity === 'critical').length;
  const warningCount = alerts.filter((alert) => alert.severity === 'warning').length;
  const careFollowUpCount = alerts.filter((alert) => alert.category === 'care').length;

  const summaryCards = [
    {
      label: 'Total Alerts',
      value: alerts.length,
      helper: 'Active items needing attention',
      icon: BellRing,
      tone: 'slate',
    },
    {
      label: 'Critical',
      value: criticalCount,
      helper: 'Immediate review recommended',
      icon: ShieldAlert,
      tone: 'red',
    },
    {
      label: 'Attendance Follow-up',
      value: warningCount,
      helper: 'Families to reconnect with',
      icon: Users,
      tone: 'amber',
    },
    {
      label: 'Child Follow-up',
      value: careFollowUpCount,
      helper: 'Children needing priority review',
      icon: AlertCircle,
      tone: 'emerald',
    },
  ] as const;

  return (
    <div className="space-y-8 pb-10 animate-fade-in">
      <section className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm">
        <div className="bg-[radial-gradient(circle_at_top_left,_rgba(239,68,68,0.16),_transparent_26%),radial-gradient(circle_at_top_right,_rgba(245,158,11,0.18),_transparent_28%),linear-gradient(135deg,rgba(255,255,255,0.96),rgba(255,247,237,0.9))] p-6 md:p-8 dark:bg-[radial-gradient(circle_at_top_left,_rgba(239,68,68,0.18),_transparent_26%),radial-gradient(circle_at_top_right,_rgba(245,158,11,0.18),_transparent_28%),linear-gradient(135deg,rgba(15,23,42,0.96),rgba(30,41,59,0.88))]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <button
                type="button"
                onClick={() => navigate('/worker')}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowLeft size={14} />
                Back to dashboard
              </button>
              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-[1.35rem] bg-red-100 text-red-700 shadow-sm dark:bg-red-950/40 dark:text-red-300">
                  <Siren size={24} />
                </div>
                <div>
                  <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                    Critical Alerts
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Prioritized alerts for {currentAWC.name} so {currentWorker.name} can act quickly.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-red-200/70 bg-white/75 p-5 shadow-sm backdrop-blur dark:border-red-900/60 dark:bg-slate-900/60">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <MapPin size={16} className="text-red-500" />
                {currentAWC.name}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{currentAWC.location}</p>
              <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                <Phone size={15} />
                Worker contact: {currentAWC.workerPhone}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <div
            key={card.label}
            className={cn(
              'rounded-[1.75rem] border p-5 shadow-sm',
              card.tone === 'slate' && 'border-slate-200 bg-[linear-gradient(145deg,rgba(255,255,255,0.98),rgba(241,245,249,0.82))] dark:border-slate-800 dark:bg-[linear-gradient(145deg,rgba(30,41,59,0.85),rgba(15,23,42,0.95))]',
              card.tone === 'red' && 'border-red-200 bg-[linear-gradient(145deg,rgba(254,242,242,0.98),rgba(254,226,226,0.78))] dark:border-red-900 dark:bg-[linear-gradient(145deg,rgba(127,29,29,0.32),rgba(69,10,10,0.45))]',
              card.tone === 'amber' && 'border-amber-200 bg-[linear-gradient(145deg,rgba(255,251,235,0.98),rgba(254,243,199,0.78))] dark:border-amber-900 dark:bg-[linear-gradient(145deg,rgba(120,53,15,0.32),rgba(69,26,3,0.45))]',
              card.tone === 'emerald' && 'border-emerald-200 bg-[linear-gradient(145deg,rgba(236,253,245,0.98),rgba(209,250,229,0.78))] dark:border-emerald-900 dark:bg-[linear-gradient(145deg,rgba(6,78,59,0.32),rgba(2,44,34,0.45))]',
            )}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  {card.label}
                </p>
                <p className="mt-3 text-4xl font-bold tracking-tight text-foreground">{card.value}</p>
                <p className="mt-3 text-sm text-muted-foreground">{card.helper}</p>
              </div>
              <div className="rounded-2xl border border-white/60 bg-white/70 p-3 text-foreground shadow-sm dark:border-white/10 dark:bg-white/5">
                <card.icon size={20} />
              </div>
            </div>
          </div>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-foreground">Action Queue</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Start with critical issues, then move to attendance follow-up.
          </p>

          <div className="mt-5 space-y-4">
            <div className="rounded-[1.25rem] border border-red-200 bg-red-50/80 p-4 dark:border-red-900 dark:bg-red-950/20">
              <p className="text-sm font-semibold text-red-700 dark:text-red-300">Immediate today</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Review high-priority children first and prepare referral support where needed.
              </p>
            </div>
            <div className="rounded-[1.25rem] border border-amber-200 bg-amber-50/80 p-4 dark:border-amber-900 dark:bg-amber-950/20">
              <p className="text-sm font-semibold text-amber-700 dark:text-amber-300">Family follow-up</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Contact families of children with low attendance and record the reason for absence.
              </p>
            </div>
            <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50/90 p-4 dark:border-slate-800 dark:bg-slate-900/60">
              <p className="text-sm font-semibold text-foreground">Centre checks</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Resolve centre-level issues and update the supervisor if any alert remains blocked.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Active Alert List</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {filteredAlerts.length} alert{filteredAlerts.length === 1 ? '' : 's'} shown for this centre.
              </p>
            </div>
            <div className="inline-flex rounded-full border border-border bg-background p-1">
              {[
                { label: 'All', value: 'all' as const },
                { label: 'Critical', value: 'critical' as const },
                { label: 'Warning', value: 'warning' as const },
              ].map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setFilter(item.value)}
                  className={cn(
                    'rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition-colors',
                    filter === item.value
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {filteredAlerts.length === 0 ? (
            <div className="mt-6 rounded-[1.75rem] border border-border bg-background/60 p-6">
              <p className="text-base font-semibold text-foreground">No alerts in this view</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Try another filter or return later after new sync updates.
              </p>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {filteredAlerts.map((alert) => {
                const isCritical = alert.severity === 'critical';
                const Icon = isCritical ? AlertCircle : AlertTriangle;

                return (
                  <div
                    key={alert.id}
                    className={cn(
                      'rounded-[1.6rem] border p-5 shadow-sm',
                      isCritical
                        ? 'border-red-200 bg-red-50/80 dark:border-red-900 dark:bg-red-950/20'
                        : 'border-amber-200 bg-amber-50/80 dark:border-amber-900 dark:bg-amber-950/20'
                    )}
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="flex items-start gap-4">
                        <div
                          className={cn(
                            'mt-0.5 rounded-2xl p-3',
                            isCritical
                              ? 'bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-300'
                              : 'bg-amber-100 text-amber-600 dark:bg-amber-950/40 dark:text-amber-300'
                          )}
                        >
                          <Icon size={20} />
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-sm font-semibold text-foreground">{alert.title}</p>
                            <span
                              className={cn(
                                'rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]',
                                isCritical
                                  ? 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300'
                                  : 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
                              )}
                            >
                              {alert.severity}
                            </span>
                          </div>
                          <p className="mt-2 text-sm text-muted-foreground">{alert.description}</p>
                          <div className="mt-4 flex flex-wrap gap-2">
                            {alert.childName ? (
                              <span className="rounded-full border border-border bg-background/80 px-3 py-1.5 text-xs font-medium text-foreground">
                                Child: {alert.childName}
                              </span>
                            ) : null}
                            {alert.metric ? (
                              <span className="rounded-full border border-border bg-background/80 px-3 py-1.5 text-xs font-medium text-foreground">
                                {alert.metric}
                              </span>
                            ) : null}
                            <span className="rounded-full border border-border bg-background/80 px-3 py-1.5 text-xs font-medium text-foreground">
                              {alert.category}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="lg:w-72">
                        <div className="rounded-[1.25rem] border border-black/5 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5">
                          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                            Recommended next step
                          </p>
                          <p className="mt-2 text-sm text-foreground">{alert.recommendedAction}</p>
                          <button
                            type="button"
                            onClick={() =>
                              navigate(
                                alert.category === 'care'
                                  ? '/worker/children'
                                  : alert.category === 'attendance'
                                    ? '/worker/children'
                                    : '/worker/insights'
                              )
                            }
                            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
                          >
                            Open related page
                            <ArrowRight size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {alerts.length === 0 ? (
        <div className="rounded-[1.75rem] border border-border bg-card p-6 shadow-sm">
          <p className="text-base font-semibold text-foreground">No active alerts</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Everything looks stable for the centre right now.
          </p>
        </div>
      ) : (
        <section className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-foreground">Centre Reminder</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Update attendance, child follow-up, and escalations after completing today’s alert actions.
          </p>
        </section>
      )}
    </div>
  );
}
