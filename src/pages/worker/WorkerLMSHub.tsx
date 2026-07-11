import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  BookOpenCheck,
  CalendarDays,
  ClipboardCheck,
  Clock,
  FileBarChart2,
  HeartHandshake,
  LayoutList,
  ListChecks,
  PenTool,
  PlayCircle,
  Route,
  Sparkles,
  Target,
  Users,
  WifiOff,
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { ProgressBar } from '../../components/ui/ProgressBar';
import {
  dailyPlannerSlots,
  lmsCoverageSummary,
  lmsDomains,
  type DailyPlannerSlot,
  type DomainTone,
  type EcceLmsDomain,
} from '../../data/ecceLms';
import { managedChildren, monthlyIntakeByChild } from '../../data/childMonitoringData';
import { average, cn } from '../../utils';
import {
  activityContextById,
  averageScore,
  buildChildLmsSummary,
  getSavedObservationRecords,
  loadRecords,
  todayIso,
} from '../../utils/ecceLmsObservations';

type WorkflowTone = 'emerald' | 'sky' | 'amber' | 'rose' | 'violet' | 'cyan' | 'slate';

const workflowSteps = [
  {
    id: 'plan',
    title: 'Plan',
    label: 'Daily routine',
    path: '/worker/lms',
    icon: CalendarDays,
    tone: 'emerald',
  },
  {
    id: 'teach',
    title: 'Teach',
    label: 'Live activity',
    path: '/worker/learning-session-live',
    icon: PlayCircle,
    tone: 'sky',
  },
  {
    id: 'observe',
    title: 'Observe',
    label: 'Rubric evidence',
    path: '/worker/student-observations',
    icon: ClipboardCheck,
    tone: 'amber',
  },
  {
    id: 'adapt',
    title: 'Adapt',
    label: 'Child pathway',
    path: '/worker/worker-adaptive-learning',
    icon: Route,
    tone: 'violet',
  },
  {
    id: 'connect',
    title: 'Connect',
    label: 'Parent follow-up',
    path: '/worker/parent-engagement',
    icon: HeartHandshake,
    tone: 'rose',
  },
  {
    id: 'report',
    title: 'Report',
    label: 'Export and review',
    path: '/worker/reports',
    icon: FileBarChart2,
    tone: 'cyan',
  },
] as const;

const today = todayIso();

function latestLearningScore(childId: string) {
  const history = monthlyIntakeByChild[childId] ?? [];
  return history.at(-1)?.learningScore ?? 0;
}

function latestAttendance(childId: string) {
  const history = monthlyIntakeByChild[childId] ?? [];
  return history.at(-1)?.attendanceRate ?? 0;
}

function recommendedContext(childId: string, latestActivityId: string | null) {
  if (latestActivityId) {
    const context = activityContextById.get(latestActivityId);
    if (context) {
      const currentIndex = context.module.activities.findIndex((activity) => activity.id === latestActivityId);
      const activity = context.module.activities[currentIndex + 1] ?? context.module.activities[0] ?? context.activity;
      return { domain: context.domain, module: context.module, activity };
    }
  }

  const baseline = latestLearningScore(childId);
  const domain =
    baseline < 45
      ? lmsDomains.find((item) => item.id === 'language')
      : baseline < 65
        ? lmsDomains.find((item) => item.id === 'numeracy')
        : lmsDomains.find((item) => item.id === 'social-emotional');
  const fallbackDomain = domain ?? lmsDomains[0];
  const module = fallbackDomain.modules[0];
  const activity = module.activities[0];

  return { domain: fallbackDomain, module, activity };
}

type ChildLmsActionRow = {
  child: (typeof managedChildren)[number];
  baselineScore: number;
  attendanceRate: number;
  followUpCount: number;
  actionLabel: string;
  context: ReturnType<typeof recommendedContext>;
};

function getActionLabel(score: number, followUps: number) {
  if (followUps > 0 || score < 45) return 'Immediate support';
  if (score < 65) return 'Guided practice';
  return 'Enrichment';
}

function getDomainCompletion(domain: EcceLmsDomain, observedActivityIds: Set<string>) {
  if (!domain.activities.length) return 0;
  const observed = domain.activities.filter((activity) => observedActivityIds.has(activity.id)).length;
  return Math.round((observed / domain.activities.length) * 100);
}

export function WorkerLMSHub() {
  const [recordSnapshot, setRecordSnapshot] = useState(() => loadRecords());
  const [activeDomainId, setActiveDomainId] = useState(lmsDomains[0]?.id ?? '');

  useEffect(() => {
    const refreshRecords = () => setRecordSnapshot(loadRecords());
    window.addEventListener('storage', refreshRecords);
    window.addEventListener('focus', refreshRecords);
    return () => {
      window.removeEventListener('storage', refreshRecords);
      window.removeEventListener('focus', refreshRecords);
    };
  }, []);

  const savedRecords = useMemo(() => getSavedObservationRecords(recordSnapshot), [recordSnapshot]);
  const todayRecords = useMemo(() => savedRecords.filter((record) => record.date === today), [savedRecords]);
  const observedActivityIds = useMemo(() => new Set(savedRecords.map((record) => record.activityId)), [savedRecords]);

  const childRows = useMemo(() => {
    return managedChildren.map((child) => {
      const summary = buildChildLmsSummary(child.id, savedRecords);
      const baselineScore = summary.hasSavedRecords ? summary.overallScore : latestLearningScore(child.id);
      const context = recommendedContext(child.id, summary.latestRecord?.activityId ?? null);
      const followUpCount = summary.hasSavedRecords
        ? summary.followUpCount
        : child.nutritionStatus === 'Normal' && baselineScore >= 60
          ? 0
          : 1;

      return {
        child,
        summary,
        baselineScore,
        attendanceRate: latestAttendance(child.id),
        followUpCount,
        context,
        actionLabel: getActionLabel(baselineScore, followUpCount),
      };
    });
  }, [savedRecords]);

  const activeDomain = lmsDomains.find((domain) => domain.id === activeDomainId) ?? lmsDomains[0];
  const centerLearningScore = average(childRows.map((row) => row.baselineScore));
  const observedChildrenToday = new Set(todayRecords.map((record) => record.childId)).size;
  const childrenNeedingSupport = childRows.filter((row) => row.followUpCount > 0 || row.baselineScore < 55 || row.child.nutritionStatus !== 'Normal').length;
  const todayScore = todayRecords.length ? averageScore(todayRecords) : centerLearningScore;
  const classCoverage = savedRecords.length
    ? Math.round((observedActivityIds.size / lmsCoverageSummary.activities) * 100)
    : 0;
  const totalFollowUps = childRows.reduce((sum, row) => sum + row.followUpCount, 0);

  const recommendedRows = [...childRows]
    .sort((a, b) => {
      const aRank = a.child.nutritionStatus === 'Severe' ? 0 : a.followUpCount > 0 ? 1 : a.baselineScore < 55 ? 2 : 3;
      const bRank = b.child.nutritionStatus === 'Severe' ? 0 : b.followUpCount > 0 ? 1 : b.baselineScore < 55 ? 2 : 3;
      return aRank - bRank || a.baselineScore - b.baselineScore;
    })
    .slice(0, 4);

  return (
    <div className="mx-auto max-w-[1500px] space-y-6 pb-10 animate-fade-in">
      <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="border-b border-border/70 bg-gradient-to-r from-emerald-50 via-white to-sky-50 p-5 dark:from-emerald-950/20 dark:via-card dark:to-sky-950/20">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                  <BookOpenCheck size={24} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-muted-foreground">Anganwadi LMS</p>
                  <h1 className="mt-1 truncate text-2xl font-black tracking-tight text-foreground md:text-3xl">
                    ECCE learning workflow
                  </h1>
                </div>
              </div>
              <p className="mt-4 max-w-3xl text-sm font-semibold leading-6 text-muted-foreground">
                {new Date(today).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })} · Plan, teach, observe, adapt, connect, and report for every child.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button asChild className="min-h-11 rounded-xl">
                <Link to="/worker/student-observations">
                  <ClipboardCheck size={16} />
                  Start observation
                </Link>
              </Button>
              <Button asChild variant="outline" className="min-h-11 rounded-xl">
                <Link to="/worker/worker-adaptive-learning">
                  <Route size={16} />
                  Adaptive plan
                </Link>
              </Button>
              <Button asChild variant="outline" className="min-h-11 rounded-xl">
                <Link to="/worker/board">
                  <PenTool size={16} />
                  Board
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="grid gap-px bg-border/70 md:grid-cols-2 xl:grid-cols-5">
          <LmsMetric label="Class learning" value={`${centerLearningScore}%`} helper={`${childrenNeedingSupport} need support`} tone={centerLearningScore >= 70 ? 'emerald' : 'amber'} icon={Sparkles} />
          <LmsMetric label="Observed today" value={`${observedChildrenToday}/${managedChildren.length}`} helper={`${todayRecords.length} child records`} tone={observedChildrenToday >= managedChildren.length ? 'emerald' : 'sky'} icon={ClipboardCheck} />
          <LmsMetric label="LMS coverage" value={`${classCoverage}%`} helper={`${observedActivityIds.size}/${lmsCoverageSummary.activities} activities`} tone={classCoverage >= 60 ? 'emerald' : 'violet'} icon={LayoutList} />
          <LmsMetric label="Follow-ups" value={totalFollowUps} helper="Parent and remediation queue" tone={totalFollowUps > 0 ? 'rose' : 'emerald'} icon={AlertTriangle} />
          <LmsMetric label="Today score" value={`${todayScore}%`} helper={todayRecords.length ? 'From saved observations' : 'From latest intake'} tone={todayScore >= 70 ? 'emerald' : todayScore >= 50 ? 'amber' : 'rose'} icon={BarChart3} />
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
        {workflowSteps.map((step, index) => (
          <WorkflowStepCard key={step.id} index={index} {...step} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(340px,0.9fr)]">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-muted-foreground">Daily planner</p>
              <h2 className="mt-1 text-xl font-black text-foreground">Anganwadi activity timetable</h2>
            </div>
            <span className="inline-flex w-fit items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-xs font-black text-muted-foreground">
              <Clock size={14} />
              {lmsCoverageSummary.plannerMinutes} min
            </span>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {dailyPlannerSlots.map((slot, index) => (
              <PlannerSlotCard key={slot.id} slot={slot} index={index} />
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-muted-foreground">Learning queue</p>
              <h2 className="mt-1 text-xl font-black text-foreground">Next child-wise actions</h2>
            </div>
            <Button asChild variant="outline" size="sm" className="rounded-xl">
              <Link to="/worker/worker-adaptive-learning">
                View all
                <ArrowRight size={14} />
              </Link>
            </Button>
          </div>

          <div className="mt-5 space-y-3">
            {recommendedRows.map((row) => (
              <ChildActionRow key={row.child.id} row={row} />
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-muted-foreground">Curriculum library</p>
            <h2 className="mt-1 text-xl font-black text-foreground">ECCE domains, modules, and activity cards</h2>
          </div>
          <div className="grid grid-cols-3 gap-2 rounded-xl border border-border bg-background p-3 text-center">
            <MiniStat label="Domains" value={lmsCoverageSummary.domains} />
            <MiniStat label="Modules" value={lmsCoverageSummary.modules} />
            <MiniStat label="Activities" value={lmsCoverageSummary.activities} />
          </div>
        </div>

        <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
          {lmsDomains.map((domain) => {
            const tone = toneClasses(domain.tone);
            const active = activeDomain.id === domain.id;
            return (
              <button
                key={domain.id}
                type="button"
                onClick={() => setActiveDomainId(domain.id)}
                className={cn(
                  'flex h-11 shrink-0 items-center gap-2 rounded-xl border px-3 text-sm font-black transition-colors',
                  active ? cn(tone.soft, tone.border) : 'border-border bg-background text-muted-foreground hover:text-foreground',
                )}
              >
                <span className={cn('h-2.5 w-2.5 rounded-full', tone.dot)} />
                {domain.shortName}
              </button>
            );
          })}
        </div>

        <div className="mt-5 grid gap-5 xl:grid-cols-[300px_minmax(0,1fr)]">
          <div className={cn('rounded-2xl border p-5', toneClasses(activeDomain.tone).wash, toneClasses(activeDomain.tone).border)}>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-muted-foreground">Active domain</p>
            <h3 className="mt-2 text-lg font-black text-foreground">{activeDomain.name}</h3>
            <p className="mt-2 text-sm font-semibold leading-6 text-muted-foreground">{activeDomain.learningOutcome}</p>
            <ProgressBar
              label="Observed activity coverage"
              value={getDomainCompletion(activeDomain, observedActivityIds)}
              className="mt-5"
              colorOverride={toneClasses(activeDomain.tone).bar}
            />
            <div className="mt-4 flex flex-wrap gap-2">
              {activeDomain.competencyStrands.map((strand) => (
                <span key={strand} className="rounded-lg border border-border bg-card px-2.5 py-1 text-xs font-bold text-muted-foreground">
                  {strand}
                </span>
              ))}
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {activeDomain.modules.map((module) => (
              <ModuleTile key={module.id} domain={activeDomain} moduleTitle={module.title} competency={module.competency} activityCount={module.activities.length} />
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <OperationalLink
          title="Offline learning pack"
          label="Save observations and sync later"
          path="/worker/offline-sync"
          icon={WifiOff}
          tone="amber"
        />
        <OperationalLink
          title="Training knowledge base"
          label="Worker lessons and reference material"
          path="/worker/training"
          icon={BookOpenCheck}
          tone="sky"
        />
        <OperationalLink
          title="Monthly progress reports"
          label="Review center and child learning exports"
          path="/worker/reports"
          icon={FileBarChart2}
          tone="emerald"
        />
      </section>
    </div>
  );
}

function LmsMetric({
  label,
  value,
  helper,
  tone,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  helper: string;
  tone: WorkflowTone;
  icon: typeof Users;
}) {
  return (
    <div className="bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-[10px] font-black uppercase tracking-[0.16em] text-muted-foreground">{label}</p>
          <p className="mt-2 text-2xl font-black text-foreground">{value}</p>
        </div>
        <span className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-lg', workflowToneClasses(tone).soft)}>
          <Icon size={17} />
        </span>
      </div>
      <p className="mt-2 truncate text-xs font-semibold text-muted-foreground">{helper}</p>
    </div>
  );
}

function WorkflowStepCard({
  index,
  title,
  label,
  path,
  icon: Icon,
  tone,
}: {
  index: number;
  title: string;
  label: string;
  path: string;
  icon: typeof Users;
  tone: WorkflowTone;
}) {
  const toneSet = workflowToneClasses(tone);

  return (
    <Link
      to={path}
      className={cn('group min-h-28 rounded-2xl border bg-card p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md', toneSet.border)}
    >
      <div className="flex items-start justify-between gap-3">
        <span className={cn('flex h-10 w-10 items-center justify-center rounded-xl', toneSet.soft)}>
          <Icon size={18} />
        </span>
        <span className="text-xs font-black text-muted-foreground">{String(index + 1).padStart(2, '0')}</span>
      </div>
      <p className="mt-3 text-base font-black text-foreground">{title}</p>
      <div className="mt-1 flex items-center justify-between gap-2">
        <p className="truncate text-xs font-semibold text-muted-foreground">{label}</p>
        <ArrowRight size={14} className="shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
}

function PlannerSlotCard({ slot, index }: { slot: DailyPlannerSlot; index: number }) {
  const linkedDomain = slot.linkedDomain ? lmsDomains.find((domain) => domain.name === slot.linkedDomain) : null;
  const tone = toneClasses(linkedDomain?.tone ?? 'sky');
  const path = slot.linkedDomain ? '/worker/student-observations' : '/worker/attendance';

  return (
    <Link to={path} className="group flex min-h-24 gap-3 rounded-xl border border-border bg-background/70 p-3 transition-all hover:bg-accent/60">
      <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm font-black', tone.soft)}>
        {index + 1}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-black text-foreground">{slot.title}</p>
          <span className="shrink-0 text-xs font-black text-muted-foreground">{slot.durationMinutes}m</span>
        </div>
        <p className="mt-1 line-clamp-2 text-xs font-semibold leading-5 text-muted-foreground">{slot.focus}</p>
        {slot.linkedDomain && (
          <p className={cn('mt-2 inline-flex items-center gap-1 text-xs font-black', tone.text)}>
            <Target size={12} />
            {slot.linkedDomain}
          </p>
        )}
      </div>
    </Link>
  );
}

function ChildActionRow({ row }: { row: ChildLmsActionRow }) {
  const urgent = row.followUpCount > 0 || row.baselineScore < 45 || row.child.nutritionStatus === 'Severe';
  const tone = urgent ? 'rose' : row.baselineScore < 65 ? 'amber' : 'emerald';
  const toneSet = workflowToneClasses(tone);

  return (
    <Link
      to="/worker/student-observations"
      state={{ selectedChildId: row.child.id }}
      className={cn('block rounded-xl border bg-background/70 p-4 transition-all hover:bg-accent/50', urgent ? 'border-rose-200 dark:border-rose-900/60' : 'border-border')}
    >
      <div className="flex items-start gap-3">
        <div className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-black', toneSet.soft)}>
          {row.child.name.charAt(0)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-black text-foreground">{row.child.name}</p>
              <p className="mt-0.5 text-xs font-semibold text-muted-foreground">{row.child.ageLabel} · {row.child.parentName}</p>
            </div>
            <span className={cn('shrink-0 rounded-lg px-2 py-1 text-xs font-black', toneSet.soft)}>{row.baselineScore}%</span>
          </div>
          <p className="mt-3 text-sm font-semibold text-foreground">{row.context.activity.title}</p>
          <div className="mt-2 flex flex-wrap gap-2 text-xs font-bold text-muted-foreground">
            <span className="rounded-lg border border-border bg-card px-2 py-1">{row.actionLabel}</span>
            <span className="rounded-lg border border-border bg-card px-2 py-1">{row.attendanceRate}% attendance</span>
            <span className="rounded-lg border border-border bg-card px-2 py-1">{row.child.nutritionStatus}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function ModuleTile({
  domain,
  moduleTitle,
  competency,
  activityCount,
}: {
  domain: EcceLmsDomain;
  moduleTitle: string;
  competency: string;
  activityCount: number;
}) {
  const tone = toneClasses(domain.tone);

  return (
    <Link to="/worker/student-observations" className="group min-h-40 rounded-xl border border-border bg-background/70 p-4 transition-all hover:-translate-y-0.5 hover:bg-accent/60 hover:shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <span className={cn('flex h-10 w-10 items-center justify-center rounded-lg', tone.soft)}>
          <ListChecks size={18} />
        </span>
        <span className="rounded-lg border border-border bg-card px-2 py-1 text-xs font-black text-muted-foreground">{activityCount} activities</span>
      </div>
      <h3 className="mt-4 line-clamp-2 text-sm font-black text-foreground">{moduleTitle}</h3>
      <p className={cn('mt-2 text-xs font-black', tone.text)}>{competency}</p>
      <div className="mt-4 flex items-center justify-between text-xs font-black text-muted-foreground">
        Activity register
        <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
}

function OperationalLink({
  title,
  label,
  path,
  icon: Icon,
  tone,
}: {
  title: string;
  label: string;
  path: string;
  icon: typeof Users;
  tone: WorkflowTone;
}) {
  const toneSet = workflowToneClasses(tone);

  return (
    <Link to={path} className="group rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start gap-4">
        <span className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-xl', toneSet.soft)}>
          <Icon size={19} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-base font-black text-foreground">{title}</p>
          <p className="mt-1 text-sm font-semibold text-muted-foreground">{label}</p>
        </div>
        <ArrowRight size={16} className="shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
}

function MiniStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="min-w-20">
      <p className="text-[10px] font-black uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
      <p className="mt-1 text-lg font-black text-foreground">{value}</p>
    </div>
  );
}

function workflowToneClasses(tone: WorkflowTone) {
  if (tone === 'emerald') return { soft: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300', border: 'border-emerald-200 dark:border-emerald-900/60' };
  if (tone === 'sky') return { soft: 'bg-sky-100 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300', border: 'border-sky-200 dark:border-sky-900/60' };
  if (tone === 'amber') return { soft: 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300', border: 'border-amber-200 dark:border-amber-900/60' };
  if (tone === 'rose') return { soft: 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300', border: 'border-rose-200 dark:border-rose-900/60' };
  if (tone === 'violet') return { soft: 'bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300', border: 'border-violet-200 dark:border-violet-900/60' };
  if (tone === 'cyan') return { soft: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-300', border: 'border-cyan-200 dark:border-cyan-900/60' };
  return { soft: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300', border: 'border-border' };
}

function toneClasses(tone: DomainTone) {
  const classes: Record<DomainTone, { soft: string; border: string; text: string; bar: string; wash: string; dot: string }> = {
    sky: {
      soft: 'bg-sky-100 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300',
      border: 'border-sky-200 dark:border-sky-900/60',
      text: 'text-sky-700 dark:text-sky-300',
      bar: 'bg-sky-500',
      wash: 'bg-sky-50/70 dark:bg-sky-950/10',
      dot: 'bg-sky-500',
    },
    emerald: {
      soft: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
      border: 'border-emerald-200 dark:border-emerald-900/60',
      text: 'text-emerald-700 dark:text-emerald-300',
      bar: 'bg-emerald-500',
      wash: 'bg-emerald-50/70 dark:bg-emerald-950/10',
      dot: 'bg-emerald-500',
    },
    violet: {
      soft: 'bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300',
      border: 'border-violet-200 dark:border-violet-900/60',
      text: 'text-violet-700 dark:text-violet-300',
      bar: 'bg-violet-500',
      wash: 'bg-violet-50/70 dark:bg-violet-950/10',
      dot: 'bg-violet-500',
    },
    amber: {
      soft: 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
      border: 'border-amber-200 dark:border-amber-900/60',
      text: 'text-amber-700 dark:text-amber-300',
      bar: 'bg-amber-500',
      wash: 'bg-amber-50/70 dark:bg-amber-950/10',
      dot: 'bg-amber-500',
    },
    rose: {
      soft: 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300',
      border: 'border-rose-200 dark:border-rose-900/60',
      text: 'text-rose-700 dark:text-rose-300',
      bar: 'bg-rose-500',
      wash: 'bg-rose-50/70 dark:bg-rose-950/10',
      dot: 'bg-rose-500',
    },
    cyan: {
      soft: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-300',
      border: 'border-cyan-200 dark:border-cyan-900/60',
      text: 'text-cyan-700 dark:text-cyan-300',
      bar: 'bg-cyan-500',
      wash: 'bg-cyan-50/70 dark:bg-cyan-950/10',
      dot: 'bg-cyan-500',
    },
  };

  return classes[tone];
}
