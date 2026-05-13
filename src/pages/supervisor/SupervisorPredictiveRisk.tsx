import { AlertTriangle, Building2, HeartPulse, Stethoscope } from 'lucide-react';
import { mockAWCs } from '../../data/mockData';
import { cn } from '../../utils';

function predictedBurden(awc: (typeof mockAWCs)[number]) {
  const nutritionPressure = awc.nutritionBreakdown.sam * 2 + awc.nutritionBreakdown.mam;
  const attendancePressure = Math.max(0, 80 - awc.attendanceRate) / 5;
  const learningPressure = Math.max(0, 65 - awc.avgLearningScore) / 5;
  return Math.round(nutritionPressure + attendancePressure + learningPressure);
}

function statusClasses(value: number) {
  if (value >= 14) return 'border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950/30 dark:text-red-200';
  if (value >= 8) return 'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200';
  return 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-200';
}

export function SupervisorPredictiveRisk() {
  const centres = mockAWCs
    .map((awc) => ({ awc, burden: predictedBurden(awc) }))
    .sort((a, b) => b.burden - a.burden);
  const highRisk = centres.filter((item) => item.burden >= 14);
  const counselling = centres.filter((item) => item.burden >= 8);

  return (
    <div className="space-y-6">
      <section className="rounded-[1.75rem] border border-border bg-card p-6 shadow-sm">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
          <HeartPulse size={24} />
        </div>
        <p className="mt-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">D. Nutrition-Learning Linked Predictive Model</p>
        <h2 className="mt-1 text-3xl font-bold tracking-tight text-foreground">Block Predictive Risk Queue</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
          Aggregates AWC-wise attendance, nutrition burden, and learning score signals into a 30-day block follow-up list.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Metric icon={Building2} label="Centres forecasted" value={centres.length} />
        <Metric icon={AlertTriangle} label="High-risk centres" value={highRisk.length} />
        <Metric icon={Stethoscope} label="Counselling review" value={counselling.length} />
      </section>

      <section className="rounded-[1.75rem] border border-border bg-card p-5 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">AWC-wise prediction</p>
        <h3 className="mt-1 text-xl font-bold text-foreground">30-day MAM/SAM burden forecast</h3>
        <div className="mt-5 space-y-3">
          {centres.slice(0, 14).map(({ awc, burden }) => (
            <div key={awc.id} className="grid gap-4 rounded-2xl border border-border bg-background/60 p-4 lg:grid-cols-[1.1fr_120px_120px_120px_1.1fr] lg:items-center">
              <div>
                <p className="font-bold text-foreground">{awc.name}</p>
                <p className="text-xs text-muted-foreground">{awc.workerName}</p>
              </div>
              <p className="text-sm font-semibold text-foreground">Attend {awc.attendanceRate}%</p>
              <p className="text-sm font-semibold text-foreground">Learn {awc.avgLearningScore}%</p>
              <span className={cn('rounded-full border px-3 py-1 text-center text-xs font-bold', statusClasses(burden))}>{burden} risk load</span>
              <p className="text-sm leading-6 text-foreground">
                {burden >= 14
                  ? 'Prioritize supervisor visit, SAM verification, and health referral review.'
                  : burden >= 8
                    ? 'Review counselling queue and THR distribution status.'
                    : 'Continue routine block monitoring.'}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Metric({ icon: Icon, label, value }: { icon: typeof Building2; label: string; value: number }) {
  return (
    <div className="rounded-[1.5rem] border border-border bg-card p-5 shadow-sm">
      <Icon className="text-rose-600 dark:text-rose-300" size={22} />
      <p className="mt-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="mt-1 text-3xl font-black text-foreground">{value}</p>
    </div>
  );
}
