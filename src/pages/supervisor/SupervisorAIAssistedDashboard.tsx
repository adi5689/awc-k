import { AlertTriangle, BarChart3, BrainCircuit, Building2, CheckCircle2 } from 'lucide-react';
import { mockAWCs } from '../../data/mockData';
import { cn } from '../../utils';

function indicator(awc: (typeof mockAWCs)[number]) {
  if (awc.status === 'Critical' || awc.attendanceRate < 60 || awc.nutritionBreakdown.sam >= 4) return 'red';
  if (awc.status === 'Warning' || awc.attendanceRate < 80 || awc.avgLearningScore < 60) return 'yellow';
  return 'green';
}

function indicatorClasses(value: string) {
  if (value === 'red') return 'border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950/30 dark:text-red-200';
  if (value === 'yellow') return 'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200';
  return 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-200';
}

export function SupervisorAIAssistedDashboard() {
  const ranked = [...mockAWCs].sort((a, b) => {
    const score = (awc: typeof a) => awc.criticalCases * 6 + awc.nutritionBreakdown.sam * 4 + Math.max(0, 85 - awc.attendanceRate) + Math.max(0, 70 - awc.avgLearningScore);
    return score(b) - score(a);
  });
  const red = mockAWCs.filter((awc) => indicator(awc) === 'red').length;
  const yellow = mockAWCs.filter((awc) => indicator(awc) === 'yellow').length;
  const green = mockAWCs.filter((awc) => indicator(awc) === 'green').length;

  return (
    <div className="space-y-6">
      <section className="rounded-[1.75rem] border border-border bg-card p-6 shadow-sm">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
          <BrainCircuit size={24} />
        </div>
        <p className="mt-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">C. AI-Assisted Dashboards</p>
        <h2 className="mt-1 text-3xl font-bold tracking-tight text-foreground">AWC-wise and Block-wise Analytics</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
          Supervisor view for colour-coded centre health, risk ranking, and explainable review actions.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        <Metric icon={Building2} label="AWCs monitored" value={mockAWCs.length} />
        <Metric icon={CheckCircle2} label="Green centres" value={green} />
        <Metric icon={BarChart3} label="Yellow centres" value={yellow} />
        <Metric icon={AlertTriangle} label="Red centres" value={red} />
      </section>

      <section className="rounded-[1.75rem] border border-border bg-card p-5 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Priority centre ranking</p>
        <h3 className="mt-1 text-xl font-bold text-foreground">Block action queue</h3>
        <div className="mt-5 overflow-hidden rounded-2xl border border-border">
          <div className="grid grid-cols-[1.2fr_0.7fr_0.7fr_0.7fr_0.8fr] gap-3 border-b border-border bg-muted/50 px-4 py-3 text-xs font-black uppercase tracking-widest text-muted-foreground">
            <span>Centre</span>
            <span>Attendance</span>
            <span>Learning</span>
            <span>SAM/MAM</span>
            <span>Indicator</span>
          </div>
          {ranked.slice(0, 12).map((awc) => {
            const value = indicator(awc);
            return (
              <div key={awc.id} className="grid grid-cols-[1.2fr_0.7fr_0.7fr_0.7fr_0.8fr] gap-3 border-b border-border px-4 py-4 last:border-b-0">
                <div>
                  <p className="font-bold text-foreground">{awc.name}</p>
                  <p className="text-xs text-muted-foreground">{awc.workerName}</p>
                </div>
                <span className="text-sm font-semibold text-foreground">{awc.attendanceRate}%</span>
                <span className="text-sm font-semibold text-foreground">{awc.avgLearningScore}%</span>
                <span className="text-sm font-semibold text-foreground">{awc.nutritionBreakdown.sam}/{awc.nutritionBreakdown.mam}</span>
                <span className={cn('h-fit rounded-full border px-3 py-1 text-center text-xs font-bold capitalize', indicatorClasses(value))}>{value}</span>
              </div>
            );
          })}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {ranked.slice(0, 3).map((awc) => (
          <div key={awc.id} className={cn('rounded-[1.5rem] border p-5', indicatorClasses(indicator(awc)))}>
            <p className="text-xs font-bold uppercase tracking-widest opacity-75">Review action</p>
            <h3 className="mt-2 text-lg font-black">{awc.name}</h3>
            <p className="mt-3 text-sm leading-6">
              Reason: {awc.alerts.length ? awc.alerts.join(', ') : 'Performance below block target in one or more indicators'}.
            </p>
            <p className="mt-3 text-sm font-bold">Suggested action: verify records, schedule AWW call, and review children at combined risk.</p>
          </div>
        ))}
      </section>
    </div>
  );
}

function Metric({ icon: Icon, label, value }: { icon: typeof Building2; label: string; value: number }) {
  return (
    <div className="rounded-[1.5rem] border border-border bg-card p-5 shadow-sm">
      <Icon className="text-blue-600 dark:text-blue-300" size={22} />
      <p className="mt-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="mt-1 text-3xl font-black text-foreground">{value}</p>
    </div>
  );
}
