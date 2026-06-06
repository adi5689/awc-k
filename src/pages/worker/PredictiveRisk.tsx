import { useState } from 'react';
import { Activity, AlertTriangle, CheckCircle2, Download, HeartPulse, Route } from 'lucide-react';
import { mockChildren } from '../../data/mockData';
import { cn } from '../../utils';
import { downloadCsv } from '../../utils/exportFiles';

const childPool = mockChildren.filter((child) => child.awcId === 'awc1').slice(0, 8);
type ReferralStatus = 'Pending' | 'Referred' | 'Followed-up';

function normalizeBand(status: string) {
  if (status.includes('sam') || status === 'SAM') return 'SAM';
  if (status.includes('mam') || status === 'MAM') return 'MAM';
  return 'Normal';
}

function predict(child: (typeof childPool)[number]) {
  const current = normalizeBand(child.nutritionStatus);
  const latest = child.nutritionHistory.at(-1);
  const muac = latest?.muac ?? 135;
  let score = 0;
  if (child.attendanceRate < 75) score += 24;
  if (child.learningScore < 50) score += 24;
  if (muac < 115) score += 32;
  else if (muac < 125) score += 20;
  if (current === 'SAM') score += 25;
  if (current === 'MAM') score += 14;
  const confidence = Math.min(96, 58 + score);
  const predicted = score >= 65 ? 'SAM' : score >= 35 ? 'MAM' : 'Normal';
  return { current, predicted, confidence, muac };
}

function bandClasses(band: string) {
  if (band === 'SAM') return 'border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950/30 dark:text-red-200';
  if (band === 'MAM') return 'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200';
  return 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-200';
}

export function PredictiveRisk() {
  const [referralStatus, setReferralStatus] = useState<Record<string, ReferralStatus>>({});
  const forecasts = childPool.map((child) => ({ child, ...predict(child) }));
  const atRisk = forecasts.filter((item) => item.predicted !== 'Normal');
  const getReferralStatus = (childId: string, predicted: string): ReferralStatus =>
    referralStatus[childId] ?? (predicted === 'Normal' ? 'Followed-up' : 'Pending');
  const referralDue = atRisk.filter((item) => getReferralStatus(item.child.id, item.predicted) !== 'Followed-up').length;

  const advanceReferral = (childId: string, predicted: string) => {
    const current = getReferralStatus(childId, predicted);
    const next: ReferralStatus = current === 'Pending' ? 'Referred' : current === 'Referred' ? 'Followed-up' : 'Pending';
    setReferralStatus((status) => ({ ...status, [childId]: next }));
  };

  const exportReferralCsv = () => {
    downloadCsv(`icds-health-referrals-${new Date().toISOString().slice(0, 10)}.csv`, atRisk.map((item) => ({
      referral_id: `REF-${item.child.id.toUpperCase()}`,
      child_id: item.child.id,
      child_name: item.child.name,
      predicted_band: item.predicted,
      current_band: item.current,
      confidence_percent: item.confidence,
      muac_mm: item.muac,
      attendance_percent: item.child.attendanceRate,
      learning_score: item.child.learningScore,
      referral_status: getReferralStatus(item.child.id, item.predicted),
      destination: item.predicted === 'SAM' ? 'NRC / PHC nutrition referral' : 'ICDS counselling and home visit',
      next_due_date: new Date(Date.now() + (item.predicted === 'SAM' ? 3 : 7) * 86400000).toISOString().slice(0, 10),
    })));
  };

  return (
    <div className="space-y-6">
      <section className="rounded-[1.75rem] border border-border bg-card p-6 shadow-sm">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
          <HeartPulse size={24} />
        </div>
        <p className="mt-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">D. Nutrition-Learning Linked Predictive Model</p>
        <h2 className="mt-1 text-3xl font-bold tracking-tight text-foreground">30-Day MAM/SAM Risk Prediction</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
          Maps learning outcomes, attendance, POSHAN-style nutrition indicators, and post-content assessment scores into a combined risk queue.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Metric icon={Activity} label="Children forecasted" value={forecasts.length} />
        <Metric icon={AlertTriangle} label="Predicted MAM/SAM" value={atRisk.length} />
        <Metric icon={Route} label="Counselling/referral due" value={referralDue} />
      </section>

      <section className="rounded-[1.75rem] border border-border bg-card p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Child-wise prediction</p>
            <h3 className="mt-1 text-xl font-bold text-foreground">Risk drivers and ICDS/Health action</h3>
          </div>
          <button
            type="button"
            onClick={exportReferralCsv}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-2 text-xs font-bold text-foreground hover:bg-muted"
          >
            <Download size={14} />
            Export Referral CSV
          </button>
        </div>
        <div className="mt-5 grid gap-4">
          {forecasts.map((item) => {
            const status = getReferralStatus(item.child.id, item.predicted);
            const drivers = [
              item.child.attendanceRate < 75 ? 'Low attendance' : null,
              item.child.learningScore < 50 ? 'Low learning score' : null,
              item.muac < 125 ? `MUAC ${item.muac}mm` : null,
              item.current !== 'Normal' ? `Current ${item.current}` : null,
              'Post-content test result included',
            ].filter(Boolean);
            return (
              <div key={item.child.id} className="grid gap-4 rounded-2xl border border-border bg-background/60 p-4 lg:grid-cols-[1fr_110px_110px_110px_135px_1.2fr] lg:items-center">
                <div>
                  <p className="font-bold text-foreground">{item.child.name}</p>
                  <p className="text-xs text-muted-foreground">Attendance {item.child.attendanceRate}% / Learning {item.child.learningScore}%</p>
                </div>
                <span className={cn('rounded-full border px-3 py-1 text-center text-xs font-bold', bandClasses(item.current))}>{item.current}</span>
                <span className={cn('rounded-full border px-3 py-1 text-center text-xs font-bold', bandClasses(item.predicted))}>{item.predicted}</span>
                <p className="text-sm font-black text-foreground">{item.confidence}% confidence</p>
                <button
                  type="button"
                  onClick={() => advanceReferral(item.child.id, item.predicted)}
                  className={cn(
                    'inline-flex items-center justify-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold',
                    status === 'Followed-up'
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-200'
                      : status === 'Referred'
                        ? 'border-sky-200 bg-sky-50 text-sky-800 dark:border-sky-900 dark:bg-sky-950/30 dark:text-sky-200'
                        : 'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200'
                  )}
                >
                  {status === 'Followed-up' && <CheckCircle2 size={13} />}
                  {status}
                </button>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Drivers</p>
                  <p className="mt-1 text-sm leading-6 text-foreground">{drivers.join(', ')}</p>
                  <p className="mt-2 text-sm font-bold text-foreground">
                    {item.predicted === 'SAM' ? 'Flag referral and weekly home follow-up' : item.predicted === 'MAM' ? 'Schedule counselling and diet diversity check' : 'Continue routine monitoring'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function Metric({ icon: Icon, label, value }: { icon: typeof Activity; label: string; value: number }) {
  return (
    <div className="rounded-[1.5rem] border border-border bg-card p-5 shadow-sm">
      <Icon className="text-rose-600 dark:text-rose-300" size={22} />
      <p className="mt-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="mt-1 text-3xl font-black text-foreground">{value}</p>
    </div>
  );
}
