import { useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { CartesianGrid, Legend, Line, LineChart, Radar, RadarChart, PolarAngleAxis, PolarGrid, PolarRadiusAxis, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ArrowLeft, BadgeCheck, Brain, HeartPulse, MessageSquareHeart, Ruler, Scale, Sparkles, CheckCircle2, XCircle, Star, CalendarDays, BookOpen, Activity, AlertTriangle, ClipboardCheck, ShieldPlus, Syringe, Utensils, Users } from 'lucide-react';
import { mockBadgeAwards, mockMealLogs, mockChildren, mockWeeklyParentReports } from '../../data/mockData';
import { consolidatedAttendanceHistory, developmentByChild, generateGrowthInsights, healthLogsSeed, immunizationByChild, monthlyIntakeByChild, nutritionTrackingByChild } from '../../data/childMonitoringData';
import type { MonthlyIntake } from '../../data/childMonitoringData';
import type { StandardObservationMetricId } from '../../data/ecceLms';
import { cn, formatAge, getGrowthStatus, getProgressStatus } from '../../utils';
import { buildChildLmsSummary } from '../../utils/ecceLmsObservations';
import type { DailyLmsReport, MetricScoreSummary } from '../../utils/ecceLmsObservations';
import { useTranslation } from '../../hooks/useTranslation';
import type { WeeklyParentReport, MealLog, BadgeAward } from '../../types';
import { SideDrawer } from '../../components/ui/side-drawer';

type MetricTone = 'emerald' | 'amber' | 'red' | 'sky' | 'violet';

const parameterIconById: Record<StandardObservationMetricId, typeof Activity> = {
  engagement: Users,
  competencySkill: BadgeCheck,
  communication: MessageSquareHeart,
  independence: Sparkles,
  peerInteraction: Users,
};

function toneFromScore(score: number, count: number): MetricTone {
  if (count === 0) return 'amber';
  if (score >= 75) return 'emerald';
  if (score >= 45) return 'amber';
  return 'red';
}

export function ChildProfile() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { childId } = useParams<{ childId: string }>();
  const [metricsOpen, setMetricsOpen] = useState(false);
  const [metricsTab, setMetricsTab] = useState<'overview' | 'growth' | 'learning' | 'health'>('overview');
  const child = mockChildren.find((entry) => entry.id === childId) ?? null;

  const latestGrowth = child?.nutritionHistory.at(-1);
  const report = (mockWeeklyParentReports[childId as keyof typeof mockWeeklyParentReports] as WeeklyParentReport[])?.at(0);
  const badges = mockBadgeAwards.filter((entry: BadgeAward) => entry.childId === childId);
  const meals = mockMealLogs.filter((entry: MealLog) => entry.childId === childId);

  // Synced Architecture Data Sources
  const currentMonthHistory = consolidatedAttendanceHistory[consolidatedAttendanceHistory.length - 1];
  const attendanceStats = currentMonthHistory?.stats.find(s => s.childId === childId);
  const childDates = currentMonthHistory?.dates ?? [];

  const lmsSummary = useMemo(() => child ? buildChildLmsSummary(child.id) : null, [child]);

  const radarData = useMemo(() => {
    if (!child) return [];
    if (lmsSummary?.hasSavedRecords) {
      return lmsSummary.domainScores.map((summary) => ({
        domain: summary.label,
        score: summary.count > 0 ? summary.score : 0,
      }));
    }

    return [
      { domain: t('domain.cognitive'), score: child.domainScores.cognitive },
      { domain: t('domain.language'), score: child.domainScores.language },
      { domain: t('progress.attendance'), score: attendanceStats?.percent ?? Math.min(100, child.attendanceRate + 4) },
      { domain: t('domain.social'), score: child.domainScores.socio_emotional },
      { domain: t('domain.creativity'), score: Math.min(100, child.learningScore + 5) },
    ];
  }, [attendanceStats?.percent, child, lmsSummary, t]);

  if (!child) {
    return (
      <div className="rounded-3xl border border-border bg-card p-8 text-center shadow-sm">
        <p className="text-muted-foreground">{t('common.no_results')}</p>
      </div>
    );
  }

  const isSupervisorView = location.pathname.startsWith('/supervisor/');
  const locationState = location.state as { from?: string; fromLabel?: string } | null;
  const backTarget = locationState?.from ?? (isSupervisorView ? '/supervisor/awc-list' : '/worker/children');
  const backLabel = locationState?.fromLabel ?? (isSupervisorView ? 'Worker Profile' : t('common.back'));
  const childLmsSummary = lmsSummary!;
  const legacyDomainAverage = Math.round((child.domainScores.language + child.domainScores.numeracy + child.domainScores.cognitive + child.domainScores.socio_emotional) / 4);
  const observedDomainScores = childLmsSummary.domainScores.filter((summary) => summary.count > 0);
  const lmsLearningScore = childLmsSummary.hasSavedRecords ? childLmsSummary.overallScore : Math.round(child.learningScore);
  const lmsDomainAverage = observedDomainScores.length
    ? Math.round(observedDomainScores.reduce((sum, summary) => sum + summary.score, 0) / observedDomainScores.length)
    : legacyDomainAverage;
  const lmsTone = lmsLearningScore >= 70 ? 'emerald' as const : lmsLearningScore >= 45 ? 'amber' as const : 'red' as const;
  const lmsRating = lmsLearningScore >= 80 ? 5 : lmsLearningScore >= 60 ? 4 : lmsLearningScore >= 40 ? 3 : 2;
  const lmsScoreDetail = childLmsSummary.hasSavedRecords
    ? `${childLmsSummary.recordCount} saved observation record(s)`
    : 'No saved LMS observations yet; showing baseline score';
  const latestDailyReport = childLmsSummary.latestDailyReport;
  const learningMetrics = [
    {
      label: 'Observation Records',
      value: childLmsSummary.recordCount,
      total: Math.max(childLmsSummary.recordCount, 1),
      progress: childLmsSummary.hasSavedRecords ? 100 : 0,
      color: 'bg-sky-500',
    },
    {
      label: 'Activities Observed',
      value: childLmsSummary.observedActivities,
      total: Math.max(childLmsSummary.totalActivities, 1),
      progress: childLmsSummary.coveragePercent,
      color: 'bg-emerald-500',
    },
    {
      label: 'Modules Touched',
      value: childLmsSummary.observedModules,
      total: Math.max(childLmsSummary.totalModules, 1),
      progress: Math.round((childLmsSummary.observedModules / Math.max(childLmsSummary.totalModules, 1)) * 100),
      color: 'bg-violet-500',
    },
    {
      label: 'Developing+',
      value: childLmsSummary.developingPlusCount,
      total: Math.max(childLmsSummary.recordCount, 1),
      progress: Math.round((childLmsSummary.developingPlusCount / Math.max(childLmsSummary.recordCount, 1)) * 100),
      color: 'bg-amber-500',
    },
  ];

  const rawGrowthStatus = getGrowthStatus(child.learningScore);
  const rawProgressStatus = getProgressStatus(lmsLearningScore);
  const periodicHistory = monthlyIntakeByChild[child.id] ?? [];
  const latestPeriodic = periodicHistory.at(-1);
  const periodicInsights = generateGrowthInsights(periodicHistory);
  const workingDays = childDates.filter(d => !d.holiday);
  const presentDays = workingDays.filter(d => d.childStatus[childId ?? '']).length;
  const attendancePercent = attendanceStats?.percent ?? child.attendanceRate;
  const firstGrowth = child.nutritionHistory?.[0];
  const growthWeightDelta = latestGrowth && firstGrowth ? Number((latestGrowth.weight - firstGrowth.weight).toFixed(1)) : 0;
  const growthHeightDelta = latestGrowth && firstGrowth ? Number((latestGrowth.height - firstGrowth.height).toFixed(1)) : 0;
  const nutritionTracking = nutritionTrackingByChild[child.id as keyof typeof nutritionTrackingByChild];
  const immunizationRecord = immunizationByChild[child.id];
  const immunizationValues = immunizationRecord ? Object.values(immunizationRecord) : [];
  const immunizationDone = immunizationValues.filter(Boolean).length;
  const immunizationPercent = immunizationValues.length > 0 ? Math.round((immunizationDone / immunizationValues.length) * 100) : 0;
  const developmentChecklist = developmentByChild[child.id];
  const developmentItems = developmentChecklist ? Object.values(developmentChecklist).flat() : [];
  const developmentDone = developmentItems.filter(item => item.done).length;
  const developmentPercent = developmentItems.length > 0 ? Math.round((developmentDone / developmentItems.length) * 100) : 0;
  const healthLog = healthLogsSeed.find(log => log.childId === child.id);
  const healthIssueCount = healthLog ? [healthLog.fever, healthLog.diarrhea, healthLog.cough, healthLog.hospitalVisit].filter(Boolean).length : 0;
  const riskFlags = child.riskFlags.flags.length;
  const individualMetricGroups = [
    {
      title: 'Profile & Attendance',
      metrics: [
        { label: 'Age', value: formatAge(child.ageMonths, t), detail: child.gender === 'M' ? t('status.boy') : t('status.girl'), icon: Users, tone: 'sky' as const },
        { label: 'Attendance', value: `${attendancePercent}%`, detail: `${presentDays}/${workingDays.length} working days`, icon: CalendarDays, tone: attendancePercent >= 80 ? 'emerald' as const : attendancePercent >= 70 ? 'amber' as const : 'red' as const },
        { label: 'Last Attendance', value: child.lastAttendanceDate, detail: child.attendanceRate >= 75 ? 'Regular follow-up' : 'Home visit suggested', icon: ClipboardCheck, tone: child.attendanceRate >= 75 ? 'emerald' as const : 'amber' as const },
      ],
    },
    {
      title: 'Nutrition & Growth',
      metrics: [
        { label: 'Nutrition Status', value: t(child.nutritionStatus), detail: child.nutritionAlert ? t(child.nutritionAlert) : 'No active alert', icon: HeartPulse, tone: child.nutritionStatus === 'status.normal' ? 'emerald' as const : child.nutritionStatus === 'status.mam' ? 'amber' as const : 'red' as const },
        { label: 'Weight Gain', value: `${growthWeightDelta >= 0 ? '+' : ''}${growthWeightDelta} ${t('units.kg')}`, detail: `${latestGrowth?.weight ?? '-'} ${t('units.kg')} current`, icon: Scale, tone: growthWeightDelta >= 0 ? 'emerald' as const : 'red' as const },
        { label: 'Height Gain', value: `${growthHeightDelta >= 0 ? '+' : ''}${growthHeightDelta} ${t('units.cm')}`, detail: `${latestGrowth?.height ?? '-'} ${t('units.cm')} current`, icon: Ruler, tone: 'sky' as const },
        { label: 'MUAC', value: `${latestGrowth?.muac ?? '-'} ${t('units.mm')}`, detail: rawGrowthStatus === 'common.healthy' ? 'Healthy range' : 'Monitor nutrition risk', icon: Activity, tone: rawGrowthStatus === 'common.healthy' ? 'emerald' as const : rawGrowthStatus === 'common.monitor' ? 'amber' as const : 'red' as const },
        { label: 'Meal Diversity', value: `${nutritionTracking?.diversityScore ?? '-'}%`, detail: `${nutritionTracking?.mealsPerDay ?? '-'} meals/day`, icon: Utensils, tone: (nutritionTracking?.diversityScore ?? 0) >= 70 ? 'emerald' as const : (nutritionTracking?.diversityScore ?? 0) >= 50 ? 'amber' as const : 'red' as const },
        { label: 'THR Status', value: nutritionTracking?.thrConsumed ? 'Consumed' : nutritionTracking?.thrReceived ? 'Received' : 'Pending', detail: `Breastfeeding: ${nutritionTracking?.breastfeedingStatus ?? '-'}`, icon: CheckCircle2, tone: nutritionTracking?.thrConsumed ? 'emerald' as const : nutritionTracking?.thrReceived ? 'amber' as const : 'red' as const },
      ],
    },
    {
      title: 'Health & Protection',
      metrics: [
        { label: 'Immunization', value: `${immunizationPercent}%`, detail: `${immunizationDone}/${immunizationValues.length} doses complete`, icon: Syringe, tone: immunizationPercent === 100 ? 'emerald' as const : immunizationPercent >= 60 ? 'amber' as const : 'red' as const },
        { label: 'Health Flags', value: healthIssueCount, detail: healthIssueCount === 0 ? 'No symptoms logged' : `${healthIssueCount} symptom(s) logged`, icon: ShieldPlus, tone: healthIssueCount === 0 ? 'emerald' as const : healthIssueCount <= 2 ? 'amber' as const : 'red' as const },
        { label: 'Combined Risk', value: child.riskFlags.combinedRisk, detail: riskFlags > 0 ? child.riskFlags.flags.map(flag => t(flag)).join(', ') : 'No risk flags', icon: AlertTriangle, tone: child.riskFlags.combinedRisk === 'Low' ? 'emerald' as const : child.riskFlags.combinedRisk === 'Medium' ? 'amber' as const : 'red' as const },
      ],
    },
    {
      title: 'Learning & Development',
      metrics: [
        { label: 'LMS Score', value: `${lmsLearningScore}%`, detail: lmsScoreDetail, icon: BookOpen, tone: lmsTone },
        { label: 'LMS Coverage', value: `${childLmsSummary.coveragePercent}%`, detail: `${childLmsSummary.observedActivities}/${childLmsSummary.totalActivities} activities observed`, icon: Sparkles, tone: childLmsSummary.coveragePercent >= 70 ? 'emerald' as const : childLmsSummary.coveragePercent >= 35 ? 'amber' as const : 'red' as const },
        { label: 'Development Checklist', value: `${developmentPercent}%`, detail: `${developmentDone}/${developmentItems.length} milestones observed`, icon: Brain, tone: developmentPercent >= 75 ? 'emerald' as const : developmentPercent >= 45 ? 'amber' as const : 'red' as const },
        { label: 'Domain Average', value: `${lmsDomainAverage}%`, detail: childLmsSummary.hasSavedRecords ? `${observedDomainScores.length} ECCE LMS domain(s)` : 'Baseline profile domains', icon: BadgeCheck, tone: lmsDomainAverage >= 70 ? 'emerald' as const : lmsDomainAverage >= 45 ? 'amber' as const : 'red' as const },
        { label: 'Follow-up Needed', value: childLmsSummary.followUpCount, detail: 'Emerging, not observed, or parent-connect records', icon: AlertTriangle, tone: childLmsSummary.followUpCount === 0 ? 'emerald' as const : childLmsSummary.followUpCount <= 2 ? 'amber' as const : 'red' as const },
        { label: 'Suggested Activities', value: child.suggestedActivities.length, detail: 'Personalized next activities', icon: Sparkles, tone: 'violet' as const },
      ],
    },
    {
      title: 'Family Engagement',
      metrics: [
        { label: 'Parent Report', value: report ? 'Ready' : 'Pending', detail: report ? t(report.week) : 'No weekly report yet', icon: MessageSquareHeart, tone: report ? 'emerald' as const : 'amber' as const },
        { label: 'Badges Earned', value: badges.length, detail: 'Recognition records', icon: BadgeCheck, tone: badges.length > 0 ? 'emerald' as const : 'amber' as const },
        { label: 'Meal Logs', value: meals.length, detail: 'Meal log entries', icon: Utensils, tone: meals.length > 0 ? 'emerald' as const : 'amber' as const },
      ],
    },
  ];
  const periodicSummaryMetrics = [
    { label: isSupervisorView ? 'Latest Intake' : 'Latest Record', value: latestPeriodic?.month ?? '-', detail: latestPeriodic?.date ?? 'No monthly record', icon: CalendarDays, tone: 'sky' as const },
    ...(isSupervisorView
      ? [{ label: 'Weight', value: latestPeriodic ? `${latestPeriodic.weight} ${t('units.kg')}` : '-', detail: `${growthWeightDelta >= 0 ? '+' : ''}${growthWeightDelta} ${t('units.kg')} total change`, icon: Scale, tone: growthWeightDelta >= 0 ? 'emerald' as const : 'red' as const }]
      : []),
    { label: 'Attendance', value: `${latestPeriodic?.attendanceRate ?? attendancePercent}%`, detail: 'Latest monthly record', icon: ClipboardCheck, tone: (latestPeriodic?.attendanceRate ?? attendancePercent) >= 80 ? 'emerald' as const : 'amber' as const },
    { label: 'Learning', value: `${lmsLearningScore}%`, detail: childLmsSummary.hasSavedRecords ? 'From ECCE LMS monitor' : 'Baseline, no LMS observations', icon: BookOpen, tone: lmsTone },
  ];
  const studentDashboardSections = [
    {
      title: 'Attendance',
      subtitle: 'Daily attendance and regularity signal',
      icon: CalendarDays,
      tone: attendancePercent >= 80 ? 'emerald' as const : attendancePercent >= 70 ? 'amber' as const : 'red' as const,
      targetTab: 'overview' as const,
      metrics: [
        { label: 'Monthly Attendance', value: `${attendancePercent}%`, detail: `${presentDays}/${workingDays.length} working days present`, icon: CalendarDays, tone: attendancePercent >= 80 ? 'emerald' as const : attendancePercent >= 70 ? 'amber' as const : 'red' as const },
        { label: 'Last Attendance', value: child.lastAttendanceDate, detail: child.attendanceRate >= 75 ? 'Regular follow-up' : 'Home visit suggested', icon: ClipboardCheck, tone: child.attendanceRate >= 75 ? 'emerald' as const : 'amber' as const },
      ],
    },
    {
      title: 'Learning',
      subtitle: 'ECCE LMS score, coverage, and observation status',
      icon: BookOpen,
      tone: lmsTone,
      targetTab: 'learning' as const,
      metrics: [
        { label: 'LMS Score', value: `${lmsLearningScore}%`, detail: lmsScoreDetail, icon: BookOpen, tone: lmsTone },
        { label: 'LMS Coverage', value: `${childLmsSummary.coveragePercent}%`, detail: `${childLmsSummary.observedActivities}/${childLmsSummary.totalActivities} activities observed`, icon: Sparkles, tone: childLmsSummary.coveragePercent >= 70 ? 'emerald' as const : childLmsSummary.coveragePercent >= 35 ? 'amber' as const : 'red' as const },
      ],
    },
    {
      title: isSupervisorView ? 'Nutrition & Health' : 'Health & Care',
      subtitle: isSupervisorView ? 'Growth, nutrition band, THR, and health-risk status' : 'Health-risk status and follow-up signals',
      icon: HeartPulse,
      tone: child.riskFlags.combinedRisk === 'Low' ? 'emerald' as const : child.riskFlags.combinedRisk === 'Medium' ? 'amber' as const : 'red' as const,
      targetTab: 'health' as const,
      metrics: isSupervisorView
        ? [
            { label: 'Nutrition Status', value: t(child.nutritionStatus), detail: child.nutritionAlert ? t(child.nutritionAlert) : 'No active alert', icon: HeartPulse, tone: child.nutritionStatus === 'status.normal' ? 'emerald' as const : child.nutritionStatus === 'status.mam' ? 'amber' as const : 'red' as const },
            { label: 'Health Flags', value: healthIssueCount, detail: healthIssueCount === 0 ? 'No symptoms logged' : `${healthIssueCount} symptom(s) logged`, icon: ShieldPlus, tone: healthIssueCount === 0 ? 'emerald' as const : healthIssueCount <= 2 ? 'amber' as const : 'red' as const },
          ]
        : [
            { label: 'Health Flags', value: healthIssueCount, detail: healthIssueCount === 0 ? 'No symptoms logged' : `${healthIssueCount} symptom(s) logged`, icon: ShieldPlus, tone: healthIssueCount === 0 ? 'emerald' as const : healthIssueCount <= 2 ? 'amber' as const : 'red' as const },
            { label: 'Combined Risk', value: child.riskFlags.combinedRisk, detail: riskFlags > 0 ? child.riskFlags.flags.map(flag => t(flag)).join(', ') : 'No risk flags', icon: AlertTriangle, tone: child.riskFlags.combinedRisk === 'Low' ? 'emerald' as const : child.riskFlags.combinedRisk === 'Medium' ? 'amber' as const : 'red' as const },
          ],
    },
  ];
  const trackerSections = [
    { label: 'Overview', tab: 'overview' as const, icon: Activity, detail: 'Latest periodic summary' },
    { label: 'Growth History', tab: 'growth' as const, icon: Scale, detail: 'Weight, height, and MUAC records' },
    { label: 'ECCE LMS', tab: 'learning' as const, icon: BookOpen, detail: 'Observation records, domains, and module progress' },
    { label: 'Health & Care', tab: 'health' as const, icon: ShieldPlus, detail: 'Nutrition, symptoms, and follow-up' },
  ];

  return (
    <div className="space-y-6 pb-10 animate-fade-in">
      <div className="flex items-center justify-between gap-3">
        <button onClick={() => navigate(backTarget)} className="inline-flex items-center gap-2 rounded-2xl border border-border px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-accent transition-colors">
          <ArrowLeft size={16} />
          {backLabel}
        </button>
        {!isSupervisorView && (
          <div className="flex gap-2">
            <button
              onClick={() => navigate('/worker/student-observations', { state: { selectedChildId: child.id, from: location.pathname } })}
              className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-colors"
            >
              <ClipboardCheck size={16} />
              Open ECCE Monitor
            </button>
            <button onClick={() => navigate('/worker/parents')} className="inline-flex items-center gap-2 rounded-2xl bg-sky-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 hover:bg-sky-600 transition-colors">
              <MessageSquareHeart size={16} />
              {t('parents.btn_share')}
            </button>
          </div>
        )}
      </div>

      <section className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm">
        <div className="bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.2),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(34,197,94,0.22),_transparent_32%),linear-gradient(135deg,rgba(255,255,255,0.95),rgba(255,255,255,0.7))] dark:bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.14),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(34,197,94,0.14),_transparent_32%),linear-gradient(135deg,rgba(15,23,42,0.92),rgba(15,23,42,0.7))] p-6 md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex items-start gap-4">
              <div className={cn(
                'flex h-20 w-20 items-center justify-center rounded-[1.75rem] text-3xl font-bold text-white shadow-lg',
                child.gender === 'M'
                  ? 'bg-gradient-to-br from-sky-500 to-blue-600'
                  : 'bg-gradient-to-br from-amber-500 to-orange-500',
              )}>
                {child.name.charAt(0)}
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Student Profile</p>
                <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground">{child.name}</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  {formatAge(child.ageMonths, t)} · {child.gender === 'M' ? t('status.boy') : t('status.girl')} · {child.parentName}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {isSupervisorView && (
                    <span className={cn(
                      'rounded-full px-3 py-1 text-xs font-semibold',
                      rawGrowthStatus === 'common.healthy' && 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
                      rawGrowthStatus === 'common.monitor' && 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
                      rawGrowthStatus === 'common.needs_attention' && 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300',
                    )}>
                      {t(rawGrowthStatus)}
                    </span>
                  )}
                  <span className={cn(
                    'rounded-full px-3 py-1 text-xs font-semibold',
                    rawProgressStatus === 'common.on_track' && 'bg-sky-100 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300',
                    rawProgressStatus === 'common.developing' && 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
                    rawProgressStatus === 'common.needs_attention' && 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300',
                  )}>
                    {t(rawProgressStatus)}
                  </span>
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">{t(child.persona)}</span>
                </div>
              </div>
            </div>

            {isSupervisorView && (
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { label: t('common.height'), value: `${latestGrowth?.height ?? '-'} ${t('units.cm')}`, icon: Ruler },
                  { label: t('common.weight'), value: `${latestGrowth?.weight ?? '-'} ${t('units.kg')}`, icon: Scale },
                  { label: t('common.muac'), value: `${latestGrowth?.muac ?? '-'} ${t('units.mm')}`, icon: HeartPulse },
                ].map((metric) => (
                  <div key={metric.label} className="rounded-3xl border border-white/50 bg-white/70 p-4 shadow-sm backdrop-blur dark:border-white/10 dark:bg-slate-900/50">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <metric.icon size={16} />
                      <span className="text-xs font-semibold uppercase tracking-[0.2em]">{metric.label}</span>
                    </div>
                    <p className="mt-3 text-2xl font-bold text-foreground">{metric.value}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-muted-foreground">Individual Child Dashboard</p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-foreground">Student performance summary</h2>
          </div>
          <button
            type="button"
            onClick={() => setMetricsOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
          >
            <Activity size={16} />
            View Full Tracker
          </button>
        </div>

        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          Daily ECCE Monitor observations, progress report, and follow-up signals for this child.
        </p>

        <DailyEcceProgressReport
          report={latestDailyReport}
          onOpenTracker={() => {
            setMetricsTab('learning');
            setMetricsOpen(true);
          }}
        />

        <div className="mt-6 grid gap-4 xl:grid-cols-3">
          {studentDashboardSections.map((section) => (
            <div key={section.title} className="rounded-[1.75rem] border border-border bg-background/60 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-start gap-3">
                  <div className={cn(
                    'flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl',
                    section.tone === 'emerald' && 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
                    section.tone === 'amber' && 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
                    section.tone === 'red' && 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300',
                  )}>
                    <section.icon size={18} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base font-bold text-foreground">{section.title}</h3>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">{section.subtitle}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setMetricsTab(section.targetTab);
                    setMetricsOpen(true);
                  }}
                  className="shrink-0 rounded-full border border-border px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground transition-colors hover:bg-card hover:text-foreground"
                >
                  Open
                </button>
              </div>

              <div className="mt-4 grid gap-3">
                {section.metrics.map((metric) => (
                  <ChildMetricCard
                    key={`${section.title}-${metric.label}`}
                    label={metric.label}
                    value={metric.value}
                    detail={metric.detail}
                    icon={metric.icon}
                    tone={metric.tone}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {isSupervisorView && (
          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {trackerSections.map((section) => (
              <button
                key={section.label}
                type="button"
                onClick={() => {
                  setMetricsTab(section.tab);
                  setMetricsOpen(true);
                }}
                className="rounded-2xl border border-border bg-background/70 p-4 text-left transition-colors hover:bg-accent"
              >
                <div className="flex items-center gap-2">
                  <section.icon size={16} className="text-primary" />
                  <span className="text-sm font-bold text-foreground">{section.label}</span>
                </div>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">{section.detail}</p>
              </button>
            ))}
          </div>
        )}
      </section>

      <AssessmentRadarCard
        title={t('dashboard.radar.title')}
        description={t('dashboard.radar.desc')}
        radarData={radarData}
      />

      <section className="space-y-6">
          <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <CalendarDays size={18} className="text-sky-500" />
              <h2 className="text-xl font-semibold text-foreground">Attendance Ledger</h2>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Consistent attendance is key to progress. <span className="font-semibold text-foreground">{child.name}</span> has been present for <span className="font-semibold text-sky-600 dark:text-sky-400">{childDates.filter(d => !d.holiday && d.childStatus[childId ?? '']).length}</span> out of the last {childDates.filter(d => !d.holiday).length} working days.
            </p>
            <div className="mt-5 rounded-3xl border border-border bg-background/50 p-5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-foreground">30-Day History</span>
                <span className="text-sm font-bold text-sky-600">{attendanceStats?.percent ?? 0}% Rate</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {childDates.map((d, i) => {
                  if (d.holiday) return <div key={i} className="h-5 w-5 rounded bg-muted opacity-50" title={`${d.date} - Holiday`} />;
                  const isPresent = d.childStatus[childId ?? ''];
                  return (
                    <div key={i} className={cn('flex h-5 w-5 items-center justify-center rounded', isPresent ? 'bg-emerald-500/20 text-emerald-600' : 'bg-red-500/20 text-red-600')} title={`${d.date} - ${isPresent ? 'Present' : 'Absent'}`}>
                      {isPresent ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <BookOpen size={18} className="text-primary" />
                  <h2 className="text-xl font-semibold text-foreground">ECCE Monitor Progress</h2>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  ECCE Monitor score: <span className="font-semibold text-foreground">{lmsLearningScore}%</span>. {childLmsSummary.hasSavedRecords ? `${childLmsSummary.recordCount} saved observation record(s) included.` : 'No saved ECCE observations yet; baseline score shown.'}
                </p>
              </div>
              <div className="flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 dark:border-amber-900/30 dark:bg-amber-950/20 self-start sm:self-auto">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star key={star} size={14} className={cn('fill-current', star <= lmsRating ? 'text-amber-500' : 'text-slate-300 dark:text-slate-700')} />
                ))}
              </div>
            </div>
            
            <div className="mt-5 grid gap-4 grid-cols-2">
              {learningMetrics.map((item) => (
                <div key={item.label} className="rounded-3xl border border-border bg-background/70 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-foreground line-clamp-1">{item.label}</p>
                    <span className="text-sm font-bold text-foreground">{item.value}/{item.total}</span>
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-muted">
                    <div
                      className={cn('h-2 rounded-full', item.color)}
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
      </section>

      <SideDrawer
        open={metricsOpen}
        onOpenChange={(open) => {
          setMetricsOpen(open);
          if (!open) setMetricsTab('overview');
        }}
        title="Periodic Child Metrics"
        description={`${child.name} · monthly records, trends, and follow-up signals`}
        className="sm:max-w-4xl"
      >
        <div className="space-y-5">
          <div className="rounded-[1.5rem] border border-border bg-card p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-lg font-bold text-primary-foreground">
                  {child.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-foreground">{child.name}</p>
                  <p className="text-sm text-muted-foreground">{formatAge(child.ageMonths, t)} · {child.parentName}</p>
                </div>
              </div>
              {isSupervisorView ? (
                <span className={cn(
                  'rounded-full px-3 py-1 text-xs font-bold uppercase',
                  latestPeriodic?.nutritionStatus === 'Normal' && 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
                  latestPeriodic?.nutritionStatus === 'Moderate' && 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
                  latestPeriodic?.nutritionStatus === 'Severe' && 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300',
                )}>
                  {latestPeriodic?.nutritionStatus ?? 'No intake'}
                </span>
              ) : (
                <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-bold uppercase text-sky-700 dark:bg-sky-950/40 dark:text-sky-300">
                  {latestPeriodic?.month ?? 'No monthly record'}
                </span>
              )}
            </div>
          </div>

          <div className="flex gap-1 overflow-x-auto rounded-2xl border border-border bg-muted/30 p-1">
            {[
              { value: 'overview' as const, label: 'Overview', icon: Activity },
              { value: 'growth' as const, label: 'Growth History', icon: Scale },
              { value: 'learning' as const, label: 'ECCE Report', icon: BookOpen },
              { value: 'health' as const, label: 'Health & Care', icon: ShieldPlus },
            ].filter((tab) => isSupervisorView || tab.value !== 'growth').map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() => setMetricsTab(tab.value)}
                className={cn(
                  'flex min-w-fit flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-[11px] font-bold uppercase tracking-wider transition-all',
                  metricsTab === tab.value ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                <tab.icon size={13} />
                {tab.label}
              </button>
            ))}
          </div>

          {metricsTab === 'overview' && (
            <div className="space-y-5">
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {periodicSummaryMetrics.map((metric) => (
                  <ChildMetricCard key={metric.label} {...metric} />
                ))}
              </div>
              <div className="rounded-2xl border border-border bg-card p-4">
                <h4 className="mb-3 text-sm font-bold text-foreground">Latest monthly record</h4>
                {latestPeriodic ? (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {[
                      ['Month', latestPeriodic.month],
                      ['Date', latestPeriodic.date],
                      ...(isSupervisorView
                        ? [
                            ['BMI', latestPeriodic.bmi],
                            ['Nutrition', latestPeriodic.nutritionStatus],
                          ]
                        : []),
                      ['Learning Score', `${latestPeriodic.learningScore}%`],
                      ['Attendance', `${latestPeriodic.attendanceRate}%`],
                    ].map(([label, value]) => (
                      <div key={label} className="rounded-xl border border-border bg-background/60 px-3 py-2">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</p>
                        <p className="mt-1 text-sm font-semibold text-foreground">{value}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No periodic records found.</p>
                )}
              </div>
            </div>
          )}

          {isSupervisorView && metricsTab === 'growth' && (
            <div className="space-y-5">
              <div className="rounded-2xl border border-border bg-card p-4">
                <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-foreground">
                  <Scale size={14} className="text-primary" />
                  Growth trend
                </h4>
                <div className="h-[260px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={periodicHistory}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} />
                      <YAxis yAxisId="weight" orientation="left" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} domain={['dataMin - 1', 'dataMax + 1']} />
                      <YAxis yAxisId="height" orientation="right" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} domain={['dataMin - 2', 'dataMax + 2']} />
                      <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '0.75rem', border: '1px solid hsl(var(--border))', fontSize: '12px' }} />
                      <Legend wrapperStyle={{ fontSize: '10px', fontWeight: 600 }} />
                      <Line yAxisId="weight" type="monotone" dataKey="weight" name="Weight (kg)" stroke="#10b981" strokeWidth={2.5} dot={{ r: 3, fill: '#10b981' }} />
                      <Line yAxisId="height" type="monotone" dataKey="height" name="Height (cm)" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 3, fill: '#3b82f6' }} />
                      <Line yAxisId="weight" type="monotone" dataKey="muac" name="MUAC (cm)" stroke="#f59e0b" strokeWidth={2} dot={{ r: 2.5, fill: '#f59e0b' }} strokeDasharray="5 3" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <MetricHistoryTable history={periodicHistory} />
            </div>
          )}

          {metricsTab === 'learning' && (
            <div className="space-y-5">
              <DailyEcceReportList reports={childLmsSummary.dailyReports} />

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <ChildMetricCard label="LMS Score" value={`${lmsLearningScore}%`} detail={lmsScoreDetail} icon={BookOpen} tone={lmsTone} />
                <ChildMetricCard label="LMS Coverage" value={`${childLmsSummary.coveragePercent}%`} detail={`${childLmsSummary.observedActivities}/${childLmsSummary.totalActivities} activities observed`} icon={Sparkles} tone={childLmsSummary.coveragePercent >= 70 ? 'emerald' : childLmsSummary.coveragePercent >= 35 ? 'amber' : 'red'} />
                <ChildMetricCard label="Follow-up Needed" value={childLmsSummary.followUpCount} detail="Emerging, not observed, or parent-connect records" icon={AlertTriangle} tone={childLmsSummary.followUpCount === 0 ? 'emerald' : childLmsSummary.followUpCount <= 2 ? 'amber' : 'red'} />
                <ChildMetricCard label="Latest Observation" value={childLmsSummary.latestRecord?.date ?? '-'} detail={childLmsSummary.latestRecord?.ageBand ?? 'No saved LMS record yet'} icon={ClipboardCheck} tone={childLmsSummary.latestRecord ? 'sky' : 'amber'} />
              </div>

              <div className="rounded-2xl border border-border bg-card p-4">
                <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-foreground">
                  <BadgeCheck size={14} className="text-primary" />
                  ECCE LMS domain performance
                </h4>
                {childLmsSummary.hasSavedRecords ? (
                  <div className="grid gap-3 md:grid-cols-2">
                    {childLmsSummary.domainScores.map((summary) => (
                      <div key={summary.label} className="rounded-xl border border-border bg-background/60 p-3">
                        <div className="flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-foreground">{summary.label}</p>
                            <p className="mt-1 text-xs font-semibold text-muted-foreground">{summary.count} observation record(s)</p>
                          </div>
                          <span className={cn(
                            'rounded-full px-2.5 py-1 text-xs font-black',
                            summary.count === 0 && 'bg-muted text-muted-foreground',
                            summary.count > 0 && summary.score >= 70 && 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
                            summary.count > 0 && summary.score >= 45 && summary.score < 70 && 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
                            summary.count > 0 && summary.score < 45 && 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300',
                          )}>
                            {summary.count ? `${summary.score}%` : 'NA'}
                          </span>
                        </div>
                        <div className="mt-3 h-2 rounded-full bg-muted">
                          <div
                            className={cn(
                              'h-2 rounded-full',
                              summary.score >= 70 ? 'bg-emerald-500' : summary.score >= 45 ? 'bg-amber-500' : 'bg-red-500'
                            )}
                            style={{ width: `${summary.count ? summary.score : 0}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm font-semibold text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-300">
                    <p className="mb-2">
                      No saved ECCE LMS observations yet. Use the ECCE LMS Monitor and save offline to populate this child dashboard.
                    </p>
                    <button
                      onClick={() => navigate('/worker/student-observations', { state: { selectedChildId: child.id, from: location.pathname } })}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-amber-700 transition-colors"
                    >
                      <ClipboardCheck size={14} />
                      Open ECCE Monitor
                    </button>
                  </div>
                )}
              </div>

              <div className="rounded-2xl border border-border bg-card p-4">
                <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-foreground">
                  <Sparkles size={14} className="text-primary" />
                  Module observations
                </h4>
                {childLmsSummary.moduleScores.some((summary) => summary.count > 0) ? (
                  <div className="grid gap-2 md:grid-cols-2">
                    {childLmsSummary.moduleScores
                      .filter((summary) => summary.count > 0)
                      .sort((a, b) => b.score - a.score)
                      .slice(0, 6)
                      .map((summary) => (
                        <div key={`${summary.domain}-${summary.label}`} className="rounded-xl border border-border bg-background/60 px-3 py-2">
                          <div className="flex items-center justify-between gap-3">
                            <div className="min-w-0">
                              <p className="truncate text-sm font-bold text-foreground">{summary.label}</p>
                              <p className="text-xs font-semibold text-muted-foreground">{summary.domain} / {summary.competency}</p>
                            </div>
                            <span className="shrink-0 text-sm font-black text-foreground">{summary.score}%</span>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-sm font-semibold text-muted-foreground">No module observations saved yet.</p>
                )}
              </div>
            </div>
          )}

          {metricsTab === 'health' && (
            <div className="space-y-5">
              <div className="grid gap-3 sm:grid-cols-2">
                {individualMetricGroups
                  .filter((group) =>
                    isSupervisorView
                      ? ['Health & Protection', 'Nutrition & Growth', 'Family Engagement'].includes(group.title)
                      : ['Health & Protection', 'Family Engagement'].includes(group.title)
                  )
                  .map((group) => (
                    <div key={group.title} className="space-y-3 sm:contents">
                      {group.metrics.map((metric) => (
                        <ChildMetricCard
                          key={`${group.title}-${metric.label}`}
                          label={metric.label}
                          value={metric.value}
                          detail={metric.detail}
                          icon={metric.icon}
                          tone={metric.tone}
                        />
                      ))}
                    </div>
                  ))}
              </div>

              {isSupervisorView && (
                <div className="rounded-2xl border border-border bg-card p-4">
                  <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-foreground">
                    <Sparkles size={14} className="text-primary" />
                    Periodic insights
                  </h4>
                  <div className="space-y-2">
                    {periodicInsights.map((insight) => (
                      <div key={insight.id} className={cn(
                        'rounded-xl border px-3 py-2',
                        insight.type === 'positive' && 'border-emerald-200 bg-emerald-50/50 text-emerald-800 dark:border-emerald-900/40 dark:bg-emerald-950/10 dark:text-emerald-300',
                        insight.type === 'warning' && 'border-amber-200 bg-amber-50/50 text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/10 dark:text-amber-300',
                        insight.type === 'critical' && 'border-red-200 bg-red-50/50 text-red-800 dark:border-red-900/40 dark:bg-red-950/10 dark:text-red-300',
                        insight.type === 'info' && 'border-sky-200 bg-sky-50/50 text-sky-800 dark:border-sky-900/40 dark:bg-sky-950/10 dark:text-sky-300',
                      )}>
                        <p className="text-sm font-bold">{insight.title}</p>
                        <p className="mt-1 text-xs leading-5 opacity-90">{insight.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </SideDrawer>
    </div>
  );
}

function AssessmentRadarCard({
  title,
  description,
  radarData,
}: {
  title: string;
  description: string;
  radarData: Array<{ domain: string; score: number }>;
}) {
  return (
    <section className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-foreground">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(260px,0.95fr)_minmax(260px,1.05fr)] lg:items-center">
        <div className="h-[280px] min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis dataKey="domain" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
              <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
              <Radar dataKey="score" stroke="#38bdf8" fill="#38bdf8" fillOpacity={0.28} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">Assessment details</p>
          <div className="mt-3 grid gap-3">
            {radarData.map((domain) => (
              <div key={domain.domain} className="rounded-2xl border border-border bg-background/70 p-3">
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="min-w-0 truncate font-medium text-foreground">{domain.domain}</span>
                  <span className="shrink-0 font-semibold text-foreground">{domain.score}%</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-muted">
                  <div
                    className={cn(
                      'h-2 rounded-full',
                      domain.score >= 75 ? 'bg-emerald-500' : domain.score >= 45 ? 'bg-amber-500' : 'bg-red-500',
                    )}
                    style={{ width: `${domain.score}%` }}
                  />
                </div>
              </div>
            ))}
            <div className="rounded-2xl border border-dashed border-border px-3 py-2 text-xs font-semibold leading-5 text-muted-foreground">
              Scores reflect the latest saved ECCE Monitor observations where available.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function DailyEcceProgressReport({ report, onOpenTracker }: { report: DailyLmsReport | null; onOpenTracker: () => void }) {
  return (
    <section className="mt-5 rounded-[1.5rem] border border-border bg-background/60 p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-muted-foreground">ECCE Monitor Daily Report</p>
          <h3 className="mt-1 text-xl font-bold text-foreground">
            {report ? `Progress report for ${report.date}` : 'No ECCE monitor report yet'}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {report
              ? `${report.observedActivities} activity observation(s), ${report.domains.length} domain(s), ${report.followUpCount} follow-up signal(s).`
              : 'Save observations from the ECCE Monitor to generate the student daily progress report.'}
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenTracker}
          className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-border bg-card px-3 text-xs font-bold uppercase tracking-wider text-foreground transition-colors hover:bg-accent"
        >
          <ClipboardCheck size={14} />
          Full Report
        </button>
      </div>

      {report ? (
        <div className="mt-4 space-y-4">
          <DailyReportSnapshot report={report} />
          <DailyReportParameterStrip metrics={report.metricScores} />
          <DailyActivityReportRows report={report} compact />
        </div>
      ) : (
        <div className="mt-4 rounded-xl border border-dashed border-border bg-card/60 px-4 py-6 text-sm font-semibold text-muted-foreground">
          ECCE Monitor observations will appear here as daily progress reports.
        </div>
      )}
    </section>
  );
}

function DailyEcceReportList({ reports }: { reports: DailyLmsReport[] }) {
  if (!reports.length) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card px-4 py-10 text-center">
        <BookOpen size={26} className="mx-auto text-muted-foreground/60" />
        <p className="mt-3 text-sm font-bold text-foreground">No ECCE Monitor reports saved yet</p>
        <p className="mt-1 text-sm text-muted-foreground">Daily activity observations will populate this progress report.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reports.map((report) => (
        <div key={report.date} className="rounded-2xl border border-border bg-card p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-muted-foreground">Daily Progress Report</p>
              <h4 className="mt-1 text-lg font-bold text-foreground">{report.date}</h4>
              <p className="mt-1 text-sm text-muted-foreground">
                {report.domains.join(', ') || 'No domain'} / {report.modules.length} module(s)
              </p>
            </div>
            <span className={cn(
              'w-max rounded-full px-3 py-1 text-xs font-black',
              report.score >= 75 && 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
              report.score >= 45 && report.score < 75 && 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
              report.score < 45 && 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300',
            )}>
              {report.score}% daily score
            </span>
          </div>

          <div className="mt-4 space-y-4">
            <DailyReportSnapshot report={report} />
            <DailyReportParameterStrip metrics={report.metricScores} />
            <DailyActivityReportRows report={report} />
          </div>
        </div>
      ))}
    </div>
  );
}

function DailyReportSnapshot({ report }: { report: DailyLmsReport }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <ReportStat label="Daily Score" value={`${report.score}%`} tone={toneFromScore(report.score, report.recordCount)} />
      <ReportStat label="Activities" value={report.observedActivities} tone="sky" />
      <ReportStat label="Developing+" value={report.levelCounts.Developing + report.levelCounts.Achieved} tone="emerald" />
      <ReportStat label="Follow-up" value={report.followUpCount} tone={report.followUpCount ? 'amber' : 'emerald'} />
    </div>
  );
}

function ReportStat({ label, value, tone }: { label: string; value: string | number; tone: MetricTone }) {
  return (
    <div className={cn(
      'rounded-xl border px-3 py-2.5',
      tone === 'emerald' && 'border-emerald-200 bg-emerald-50/70 text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/20 dark:text-emerald-300',
      tone === 'amber' && 'border-amber-200 bg-amber-50/70 text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/20 dark:text-amber-300',
      tone === 'red' && 'border-red-200 bg-red-50/70 text-red-800 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-300',
      tone === 'sky' && 'border-sky-200 bg-sky-50/70 text-sky-800 dark:border-sky-900/50 dark:bg-sky-950/20 dark:text-sky-300',
      tone === 'violet' && 'border-violet-200 bg-violet-50/70 text-violet-800 dark:border-violet-900/50 dark:bg-violet-950/20 dark:text-violet-300',
    )}>
      <p className="text-[10px] font-black uppercase tracking-[0.18em] opacity-70">{label}</p>
      <p className="mt-1 text-lg font-black">{value}</p>
    </div>
  );
}

function DailyReportParameterStrip({ metrics }: { metrics: MetricScoreSummary[] }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">ECCE parameters</p>
      <div className="mt-2 grid gap-2 md:grid-cols-2 xl:grid-cols-5">
        {metrics.map((metric) => {
          const tone = toneFromScore(metric.score, metric.count);
          const Icon = parameterIconById[metric.id];

          return (
            <div key={metric.id} className="rounded-xl border border-border bg-background/60 p-2.5">
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-xs font-black text-foreground">{metric.label}</p>
                <Icon size={13} className="shrink-0 text-muted-foreground" />
              </div>
              <div className="mt-2 flex items-center justify-between gap-2">
                <span className={cn(
                  'text-sm font-black',
                  tone === 'emerald' && 'text-emerald-700 dark:text-emerald-300',
                  tone === 'amber' && 'text-amber-700 dark:text-amber-300',
                  tone === 'red' && 'text-red-700 dark:text-red-300',
                )}>
                  {metric.count ? `${metric.score}%` : 'NA'}
                </span>
                <span className="text-[11px] font-bold text-muted-foreground">
                  {metric.count ? `${metric.averageMark.toFixed(1)}/3` : '0/3'}
                </span>
              </div>
              <div className="mt-2 h-1.5 rounded-full bg-muted">
                <div
                  className={cn(
                    'h-1.5 rounded-full',
                    tone === 'emerald' && 'bg-emerald-500',
                    tone === 'amber' && 'bg-amber-500',
                    tone === 'red' && 'bg-red-500',
                  )}
                  style={{ width: `${metric.count ? metric.score : 0}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DailyActivityReportRows({ report, compact = false }: { report: DailyLmsReport; compact?: boolean }) {
  const activities = compact ? report.activities.slice(0, 3) : report.activities;

  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Activity performance</p>
      <div className="mt-2 space-y-2">
        {activities.map((activity) => {
          const tone = toneFromScore(activity.score, 1);

          return (
            <div key={`${report.date}-${activity.activityId}`} className="rounded-xl border border-border bg-background/60 p-3">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <p className="truncate text-sm font-black text-foreground">{activity.activityTitle}</p>
                  <p className="mt-1 text-xs font-semibold text-muted-foreground">
                    {activity.domain} / {activity.module}
                  </p>
                </div>
                <span className={cn(
                  'w-max shrink-0 rounded-full px-2.5 py-1 text-[11px] font-black',
                  tone === 'emerald' && 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
                  tone === 'amber' && 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
                  tone === 'red' && 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300',
                )}>
                  {activity.score}% / {activity.level}
                </span>
              </div>

              {(activity.quickNote || activity.remediation || activity.parentConnect) && (
                <div className="mt-2 grid gap-2 md:grid-cols-2">
                  {activity.quickNote && (
                    <p className="rounded-lg bg-card px-2.5 py-2 text-xs font-semibold text-muted-foreground">
                      Note: <span className="text-foreground">{activity.quickNote}</span>
                    </p>
                  )}
                  {(activity.parentConnect || activity.level === 'Emerging' || activity.level === 'Not Yet Observed') && (
                    <p className="rounded-lg bg-amber-50 px-2.5 py-2 text-xs font-semibold text-amber-800 dark:bg-amber-950/20 dark:text-amber-300">
                      Follow-up: {activity.remediation}
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {compact && report.activities.length > activities.length && (
          <p className="rounded-xl border border-dashed border-border px-3 py-2 text-xs font-bold text-muted-foreground">
            +{report.activities.length - activities.length} more activity record(s) in full report
          </p>
        )}
      </div>
    </div>
  );
}

function MetricHistoryTable({ history }: { history: MonthlyIntake[] }) {
  if (history.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-muted/20 py-10 text-center text-sm text-muted-foreground">
        No monthly intake records found for this child.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <h4 className="mb-3 text-sm font-bold text-foreground">Monthly Records</h4>
      <div className="max-h-[420px] overflow-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
            <tr>
              <th className="rounded-tl-xl px-4 py-2.5 font-medium">Month</th>
              <th className="px-4 py-2.5 font-medium">Weight</th>
              <th className="px-4 py-2.5 font-medium">Height</th>
              <th className="px-4 py-2.5 font-medium">MUAC</th>
              <th className="px-4 py-2.5 font-medium">BMI</th>
              <th className="px-4 py-2.5 font-medium">Learning</th>
              <th className="px-4 py-2.5 font-medium">Attendance</th>
              <th className="rounded-tr-xl px-4 py-2.5 font-medium">Notes</th>
            </tr>
          </thead>
          <tbody>
            {history.slice().reverse().map((record) => (
              <tr key={record.date} className="border-b border-border/50 last:border-0 hover:bg-muted/20">
                <td className="px-4 py-3 font-medium text-foreground">{record.month}</td>
                <td className="px-4 py-3 text-muted-foreground">{record.weight} kg</td>
                <td className="px-4 py-3 text-muted-foreground">{record.height} cm</td>
                <td className="px-4 py-3 text-muted-foreground">{record.muac} cm</td>
                <td className="px-4 py-3 text-muted-foreground">{record.bmi}</td>
                <td className="px-4 py-3 text-muted-foreground">{record.learningScore}%</td>
                <td className="px-4 py-3 text-muted-foreground">{record.attendanceRate}%</td>
                <td className="px-4 py-3 text-muted-foreground">{record.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ChildMetricCard({
  label,
  value,
  detail,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string | number;
  detail: string;
  icon: typeof Activity;
  tone: 'emerald' | 'amber' | 'red' | 'sky' | 'violet';
}) {
  const styles = {
    emerald: {
      shell: 'border-emerald-200/70 bg-emerald-50/40 dark:border-emerald-900/40 dark:bg-emerald-950/10',
      icon: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
      value: 'text-emerald-700 dark:text-emerald-300',
    },
    amber: {
      shell: 'border-amber-200/70 bg-amber-50/40 dark:border-amber-900/40 dark:bg-amber-950/10',
      icon: 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
      value: 'text-amber-700 dark:text-amber-300',
    },
    red: {
      shell: 'border-red-200/70 bg-red-50/40 dark:border-red-900/40 dark:bg-red-950/10',
      icon: 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300',
      value: 'text-red-700 dark:text-red-300',
    },
    sky: {
      shell: 'border-sky-200/70 bg-sky-50/40 dark:border-sky-900/40 dark:bg-sky-950/10',
      icon: 'bg-sky-100 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300',
      value: 'text-sky-700 dark:text-sky-300',
    },
    violet: {
      shell: 'border-violet-200/70 bg-violet-50/40 dark:border-violet-900/40 dark:bg-violet-950/10',
      icon: 'bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300',
      value: 'text-violet-700 dark:text-violet-300',
    },
  }[tone];

  return (
    <div className={cn('rounded-3xl border p-4 shadow-sm', styles.shell)}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
          <p className={cn('mt-2 truncate text-xl font-bold', styles.value)}>{value}</p>
        </div>
        <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl', styles.icon)}>
          <Icon size={18} />
        </div>
      </div>
      <p className="mt-3 line-clamp-2 text-xs leading-5 text-muted-foreground">{detail}</p>
    </div>
  );
}
