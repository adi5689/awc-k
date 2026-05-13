import { useMemo, useState } from 'react';
import { BarChart3, LineChart, Target, UserRound } from 'lucide-react';
import { mockChildren } from '../../data/mockData';
import { monthlyIntakeByChild } from '../../data/childMonitoringData';
import { cn } from '../../utils';

const childPool = mockChildren.filter((child) => child.awcId === 'awc1').slice(0, 6);

function riskTone(risk: string) {
  if (risk === 'High') return 'border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950/30 dark:text-red-200';
  if (risk === 'Medium') return 'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200';
  return 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-200';
}

export function ChildProgressTracking() {
  const [selectedChildId, setSelectedChildId] = useState(childPool[0]?.id ?? '');
  const selectedChild = childPool.find((child) => child.id === selectedChildId) ?? childPool[0];
  const history = monthlyIntakeByChild[selectedChildId] ?? [];

  const classAverage = Math.round(childPool.reduce((sum, child) => sum + child.learningScore, 0) / childPool.length);
  const peerRank = useMemo(() => {
    const sorted = [...childPool].sort((a, b) => b.learningScore - a.learningScore);
    return sorted.findIndex((child) => child.id === selectedChildId) + 1;
  }, [selectedChildId]);

  const weakestDomain = selectedChild
    ? Object.entries(selectedChild.domainScores).sort((a, b) => a[1] - b[1])[0]
    : ['language', 0];
  const strongestDomain = selectedChild
    ? Object.entries(selectedChild.domainScores).sort((a, b) => b[1] - a[1])[0]
    : ['language', 0];

  return (
    <div className="space-y-6">
      <section className="rounded-[1.75rem] border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300">
              <UserRound size={24} />
            </div>
            <p className="mt-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">B. Child Profiling & Progress Tracking</p>
            <h2 className="mt-1 text-3xl font-bold tracking-tight text-foreground">Unique Child Learning Profile</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
              One frontend surface for profile, longitudinal progress, and peer or age-group comparison analytics.
            </p>
          </div>
          <select
            value={selectedChildId}
            onChange={(event) => setSelectedChildId(event.target.value)}
            className="rounded-xl border border-border bg-background px-4 py-3 text-sm font-semibold text-foreground"
          >
            {childPool.map((child) => (
              <option key={child.id} value={child.id}>{child.name}</option>
            ))}
          </select>
        </div>
      </section>

      {selectedChild && (
        <section className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
          <aside className="space-y-4">
            <div className="rounded-[1.75rem] border border-border bg-card p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Profile summary</p>
              <h3 className="mt-1 text-2xl font-black text-foreground">{selectedChild.name}</h3>
              <div className="mt-4 grid gap-3">
                <InfoRow label="Age group" value={`${Math.floor(selectedChild.ageMonths / 12)}y ${selectedChild.ageMonths % 12}m`} />
                <InfoRow label="Learning persona" value={selectedChild.persona.replace('data.persona.', '').replaceAll('_', ' ')} />
                <InfoRow label="Strongest domain" value={`${String(strongestDomain[0]).replace('_', '-')} (${strongestDomain[1]}%)`} />
                <InfoRow label="Weakest domain" value={`${String(weakestDomain[0]).replace('_', '-')} (${weakestDomain[1]}%)`} />
              </div>
              <div className="mt-4 grid gap-2 sm:grid-cols-3">
                <span className={cn('rounded-xl border px-3 py-2 text-center text-xs font-bold', riskTone(selectedChild.riskFlags.learningRisk))}>
                  Learning {selectedChild.riskFlags.learningRisk}
                </span>
                <span className={cn('rounded-xl border px-3 py-2 text-center text-xs font-bold', riskTone(selectedChild.riskFlags.nutritionRisk))}>
                  Nutrition {selectedChild.riskFlags.nutritionRisk}
                </span>
                <span className={cn('rounded-xl border px-3 py-2 text-center text-xs font-bold', riskTone(selectedChild.riskFlags.combinedRisk))}>
                  Combined {selectedChild.riskFlags.combinedRisk}
                </span>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-border bg-card p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Peer analytics</p>
              <div className="mt-4 grid grid-cols-3 gap-3">
                <Metric label="Child" value={`${selectedChild.learningScore}%`} />
                <Metric label="Class avg" value={`${classAverage}%`} />
                <Metric label="Rank" value={`${peerRank}/${childPool.length}`} />
              </div>
            </div>
          </aside>

          <div className="space-y-4">
            <div className="rounded-[1.75rem] border border-border bg-card p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <LineChart className="text-sky-600 dark:text-sky-300" size={22} />
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Longitudinal tracking</p>
                  <h3 className="text-xl font-bold text-foreground">Learning, attendance, and nutrition trend</h3>
                </div>
              </div>
              <div className="mt-5 space-y-3">
                {history.map((entry) => (
                  <div key={entry.date} className="grid gap-3 rounded-2xl border border-border bg-background/60 p-4 md:grid-cols-[90px_1fr_1fr_1fr] md:items-center">
                    <p className="text-sm font-bold text-foreground">{entry.month}</p>
                    <ProgressLine label="Learning" value={entry.learningScore} tone="bg-sky-500" />
                    <ProgressLine label="Attendance" value={entry.attendanceRate} tone="bg-emerald-500" />
                    <ProgressLine label={`MUAC ${entry.muac}cm`} value={Math.min(100, Math.round((entry.muac / 14) * 100))} tone="bg-amber-500" />
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-border bg-card p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <BarChart3 className="text-sky-600 dark:text-sky-300" size={22} />
                <h3 className="text-xl font-bold text-foreground">Domain comparison</h3>
              </div>
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {Object.entries(selectedChild.domainScores).map(([domain, score]) => (
                  <ProgressLine key={domain} label={domain.replace('_', '-')} value={score} tone="bg-violet-500" />
                ))}
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-sky-200 bg-sky-50 p-5 dark:border-sky-900 dark:bg-sky-950/20">
              <div className="flex gap-3">
                <Target className="mt-1 text-sky-700 dark:text-sky-300" size={22} />
                <div>
                  <p className="font-bold text-sky-950 dark:text-sky-100">Recommended approach</p>
                  <p className="mt-2 text-sm leading-6 text-sky-800 dark:text-sky-200/80">
                    Prioritize {String(weakestDomain[0]).replace('_', '-')} activities at the current difficulty level, then reassess after three guided sessions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl bg-background/70 px-3 py-2">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-bold capitalize text-foreground">{value}</span>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-background/70 p-3 text-center">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-xl font-black text-foreground">{value}</p>
    </div>
  );
}

function ProgressLine({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between gap-3">
        <span className="text-xs font-semibold capitalize text-muted-foreground">{label}</span>
        <span className="text-xs font-bold text-foreground">{value}%</span>
      </div>
      <div className="h-2 rounded-full bg-muted">
        <div className={cn('h-full rounded-full', tone)} style={{ width: `${Math.max(4, Math.min(100, value))}%` }} />
      </div>
    </div>
  );
}
