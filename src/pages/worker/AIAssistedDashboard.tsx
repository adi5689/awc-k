import { AlertTriangle, BrainCircuit, CheckCircle2, Lightbulb, Users } from 'lucide-react';
import { mockChildren } from '../../data/mockData';
import { cn } from '../../utils';

const childPool = mockChildren.filter((child) => child.awcId === 'awc1').slice(0, 8);

function getIndicator(child: (typeof childPool)[number]) {
  if (child.riskFlags.combinedRisk === 'High') return 'red';
  if (child.riskFlags.combinedRisk === 'Medium' || child.attendanceRate < 80 || child.learningScore < 60) return 'yellow';
  return 'green';
}

function indicatorClasses(indicator: string) {
  if (indicator === 'red') return 'border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950/30 dark:text-red-200';
  if (indicator === 'yellow') return 'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200';
  return 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-200';
}

export function AIAssistedDashboard() {
  const red = childPool.filter((child) => getIndicator(child) === 'red').length;
  const yellow = childPool.filter((child) => getIndicator(child) === 'yellow').length;
  const green = childPool.filter((child) => getIndicator(child) === 'green').length;

  const actions = childPool
    .filter((child) => getIndicator(child) !== 'green')
    .map((child) => ({
      child,
      indicator: getIndicator(child),
      reason: child.riskFlags.flags.length
        ? child.riskFlags.flags.map((flag) => flag.replace('status.', '').replace('_', ' ')).join(', ')
        : child.learningScore < 60
          ? 'Learning score below class target'
          : 'Attendance below steady participation threshold',
      action: child.riskFlags.nutritionRisk === 'High'
        ? 'Schedule counselling and referral follow-up'
        : child.learningScore < 60
          ? 'Assign guided activity and reassess after session'
          : 'Call parent and track attendance for 7 days',
    }));

  return (
    <div className="space-y-6">
      <section className="rounded-[1.75rem] border border-border bg-card p-6 shadow-sm">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
          <BrainCircuit size={24} />
        </div>
        <p className="mt-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">C. AI-Assisted Dashboards</p>
        <h2 className="mt-1 text-3xl font-bold tracking-tight text-foreground">Class-wise Intervention Dashboard</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
          Green, yellow, and red indicators with explainable intervention suggestions for the AWW workflow.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        <Metric icon={Users} label="Children tracked" value={childPool.length} tone="bg-sky-100 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300" />
        <Metric icon={CheckCircle2} label="Green" value={green} tone="bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300" />
        <Metric icon={Lightbulb} label="Yellow" value={yellow} tone="bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300" />
        <Metric icon={AlertTriangle} label="Red" value={red} tone="bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300" />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[1.75rem] border border-border bg-card p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Class-wise analytics</p>
          <h3 className="mt-1 text-xl font-bold text-foreground">Risk matrix</h3>
          <div className="mt-5 space-y-3">
            {childPool.map((child) => {
              const indicator = getIndicator(child);
              return (
                <div key={child.id} className="grid gap-3 rounded-2xl border border-border bg-background/60 p-4 md:grid-cols-[1fr_120px_120px_100px] md:items-center">
                  <div>
                    <p className="font-bold text-foreground">{child.name}</p>
                    <p className="text-xs text-muted-foreground">{child.persona.replace('data.persona.', '').replaceAll('_', ' ')}</p>
                  </div>
                  <p className="text-sm font-semibold text-foreground">Learning {child.learningScore}%</p>
                  <p className="text-sm font-semibold text-foreground">Attend {child.attendanceRate}%</p>
                  <span className={cn('rounded-full border px-3 py-1 text-center text-xs font-bold capitalize', indicatorClasses(indicator))}>{indicator}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-border bg-card p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Suggested targeted interventions</p>
          <h3 className="mt-1 text-xl font-bold text-foreground">Action queue</h3>
          <div className="mt-5 space-y-3">
            {actions.map((item) => (
              <div key={item.child.id} className={cn('rounded-2xl border p-4', indicatorClasses(item.indicator))}>
                <div className="flex items-start justify-between gap-3">
                  <p className="font-bold">{item.child.name}</p>
                  <span className="rounded-full bg-white/60 px-2 py-1 text-[10px] font-black uppercase dark:bg-black/20">{item.indicator}</span>
                </div>
                <p className="mt-3 text-xs font-bold uppercase tracking-widest opacity-75">Reason</p>
                <p className="mt-1 text-sm leading-6">{item.reason}</p>
                <p className="mt-3 text-xs font-bold uppercase tracking-widest opacity-75">Suggested action</p>
                <p className="mt-1 text-sm leading-6">{item.action}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function Metric({ icon: Icon, label, value, tone }: { icon: typeof Users; label: string; value: number; tone: string }) {
  return (
    <div className="rounded-[1.5rem] border border-border bg-card p-5 shadow-sm">
      <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl', tone)}>
        <Icon size={20} />
      </div>
      <p className="mt-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="mt-1 text-3xl font-black text-foreground">{value}</p>
    </div>
  );
}
