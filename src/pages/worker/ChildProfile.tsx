import { useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, Radar, RadarChart, PolarAngleAxis, PolarGrid, PolarRadiusAxis, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ArrowLeft, BadgeCheck, Brain, HeartPulse, MessageSquareHeart, Ruler, Scale, Sparkles, CheckCircle2, XCircle, Star, CalendarDays, BookOpen, Activity, AlertTriangle, ClipboardCheck, ShieldPlus, Syringe, Utensils, Users } from 'lucide-react';
import { mockBadgeAwards, childDevelopmentInsights, mockMealLogs, mockChildren, mockWeeklyParentReports, learningJourneyByTheme, teachingModulesByTheme, shapeStudioByTheme, storyVideosByTheme } from '../../data/mockData';
import { consolidatedAttendanceHistory, developmentByChild, generateGrowthInsights, healthLogsSeed, immunizationByChild, monthlyIntakeByChild, nutritionTrackingByChild } from '../../data/childMonitoringData';
import type { MonthlyIntake } from '../../data/childMonitoringData';
import { ecceCurriculum } from '../../data/ecceCurriculum';
import { cn, formatAge, getGrowthStatus, getProgressStatus } from '../../utils';
import { useTranslation } from '../../hooks/useTranslation';
import type { WeeklyParentReport, ChildDevelopmentInsight, MealLog, BadgeAward } from '../../types';
import { SideDrawer } from '../../components/ui/side-drawer';

const ECCE_PROGRESS_STORAGE_KEY = 'awc-ecce-learning-progress-v1';

function getEcceProgress(childId?: string) {
  if (!childId || typeof window === 'undefined') {
    return { progress: 0, completedModules: 0, totalModules: ecceCurriculum.length };
  }

  try {
    const saved = JSON.parse(window.localStorage.getItem(ECCE_PROGRESS_STORAGE_KEY) ?? '{}') as Record<string, Record<string, boolean>>;
    const childProgress = saved[childId] ?? {};
    const totalActivities = ecceCurriculum.reduce((sum, module) => sum + module.activities.length, 0);
    const completedActivities = ecceCurriculum.reduce(
      (sum, module) => sum + module.activities.filter((activity) => childProgress[activity.id]).length,
      0,
    );
    const completedModules = ecceCurriculum.filter((module) => module.activities.length > 0 && module.activities.every((activity) => childProgress[activity.id])).length;

    return {
      progress: totalActivities > 0 ? Math.round((completedActivities / totalActivities) * 100) : 0,
      completedModules,
      totalModules: ecceCurriculum.length,
    };
  } catch {
    return { progress: 0, completedModules: 0, totalModules: ecceCurriculum.length };
  }
}

export function ChildProfile() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { childId } = useParams<{ childId: string }>();
  const [metricsOpen, setMetricsOpen] = useState(false);
  const [metricsTab, setMetricsTab] = useState<'overview' | 'growth' | 'learning' | 'health'>('overview');
  const child = mockChildren.find((entry: any) => entry.id === childId) ?? null;

  const latestGrowth = child?.nutritionHistory.at(-1);
  const report = (mockWeeklyParentReports[childId as keyof typeof mockWeeklyParentReports] as WeeklyParentReport[])?.at(0);
  const badges = mockBadgeAwards.filter((entry: BadgeAward) => entry.childId === childId);
  const insights = (childDevelopmentInsights[childId as keyof typeof childDevelopmentInsights] as ChildDevelopmentInsight[] || []);
  const meals = mockMealLogs.filter((entry: MealLog) => entry.childId === childId);

  // Synced Architecture Data Sources
  const currentMonthHistory = consolidatedAttendanceHistory[consolidatedAttendanceHistory.length - 1];
  const attendanceStats = currentMonthHistory?.stats.find(s => s.childId === childId);
  const childDates = currentMonthHistory?.dates ?? [];

  const theme = 'monsoon';
  const activities = learningJourneyByTheme[theme] ?? [];
  const modules = teachingModulesByTheme[theme] ?? [];
  const shapes = shapeStudioByTheme[theme] ?? [];
  const videos = storyVideosByTheme[theme] ?? [];
  
  const rating = child ? (child.learningScore >= 80 ? 5 : child.learningScore >= 60 ? 4 : child.learningScore >= 40 ? 3 : 2) : 0;
  const completionRatio = child ? (child.learningScore / 100) : 0;
  
  const learningMetrics = [
    { label: 'Daily Activities', value: Math.round(completionRatio * activities.length), total: Math.max(activities.length, 1), color: 'bg-emerald-500' },
    { label: 'Teaching Modules', value: Math.round(completionRatio * modules.length), total: Math.max(modules.length, 1), color: 'bg-violet-500' },
    { label: '3D Shapes Studio', value: Math.round(Math.min(completionRatio * 1.5, 1) * shapes.length), total: Math.max(shapes.length, 1), color: 'bg-orange-500' },
    { label: 'Story Videos', value: Math.round(Math.min(completionRatio * 1.2, 1) * videos.length), total: Math.max(videos.length, 1), color: 'bg-sky-500' },
  ];

  const radarData = useMemo(() => {
    if (!child) return [];
    return [
      { domain: t('domain.cognitive'), score: child.domainScores.cognitive },
      { domain: t('domain.language'), score: child.domainScores.language },
      { domain: t('progress.attendance'), score: attendanceStats?.percent ?? Math.min(100, child.attendanceRate + 4) },
      { domain: t('domain.social'), score: child.domainScores.socio_emotional },
      { domain: t('domain.creativity'), score: Math.min(100, child.learningScore + 5) },
    ];
  }, [child, t]);

  if (!child) {
    return (
      <div className="rounded-3xl border border-border bg-card p-8 text-center shadow-sm">
        <p className="text-muted-foreground">{t('common.no_results')}</p>
      </div>
    );
  }

  const isSupervisorView = location.pathname.startsWith('/supervisor/');
  const locationState = location.state as { from?: string; fromLabel?: string } | null;
  const backTarget = isSupervisorView ? locationState?.from ?? '/supervisor/awc-list' : '/worker/children';
  const backLabel = isSupervisorView ? locationState?.fromLabel ?? 'Worker Profile' : t('common.back');

  const rawGrowthStatus = getGrowthStatus(child.learningScore);
  const rawProgressStatus = getProgressStatus(child.learningScore);
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
  const quizAverage = child.quizResults.length > 0
    ? Math.round(child.quizResults.reduce((sum, quiz) => sum + quiz.score, 0) / child.quizResults.length)
    : 0;
  const domainAverage = Math.round((child.domainScores.language + child.domainScores.numeracy + child.domainScores.cognitive + child.domainScores.socio_emotional) / 4);
  const ecceProgress = getEcceProgress(child.id);
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
        { label: 'Learning Score', value: `${Math.round(child.learningScore)}%`, detail: t(child.persona), icon: BookOpen, tone: child.learningScore >= 70 ? 'emerald' as const : child.learningScore >= 45 ? 'amber' as const : 'red' as const },
        { label: 'ECCE Progress', value: `${ecceProgress.progress}%`, detail: `${ecceProgress.completedModules}/${ecceProgress.totalModules} modules complete`, icon: Sparkles, tone: ecceProgress.progress >= 70 ? 'emerald' as const : ecceProgress.progress >= 35 ? 'amber' as const : 'red' as const },
        { label: 'Development Checklist', value: `${developmentPercent}%`, detail: `${developmentDone}/${developmentItems.length} milestones observed`, icon: Brain, tone: developmentPercent >= 75 ? 'emerald' as const : developmentPercent >= 45 ? 'amber' as const : 'red' as const },
        { label: 'Domain Average', value: `${domainAverage}%`, detail: 'Language, numeracy, cognitive, social', icon: BadgeCheck, tone: domainAverage >= 70 ? 'emerald' as const : domainAverage >= 45 ? 'amber' as const : 'red' as const },
        { label: 'Quiz Average', value: `${quizAverage}%`, detail: `${child.quizResults.length} quiz record(s)`, icon: Star, tone: quizAverage >= 70 ? 'emerald' as const : quizAverage >= 45 ? 'amber' as const : 'red' as const },
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
    { label: 'Learning', value: `${latestPeriodic?.learningScore ?? Math.round(child.learningScore)}%`, detail: 'Tracked with monthly intake', icon: BookOpen, tone: (latestPeriodic?.learningScore ?? child.learningScore) >= 70 ? 'emerald' as const : 'amber' as const },
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
      subtitle: 'Learning score, ECCE progress, and activity completion',
      icon: BookOpen,
      tone: child.learningScore >= 70 ? 'emerald' as const : child.learningScore >= 45 ? 'amber' as const : 'red' as const,
      targetTab: 'learning' as const,
      metrics: [
        { label: 'Learning Score', value: `${Math.round(child.learningScore)}%`, detail: t(child.persona), icon: BookOpen, tone: child.learningScore >= 70 ? 'emerald' as const : child.learningScore >= 45 ? 'amber' as const : 'red' as const },
        { label: 'ECCE Progress', value: `${ecceProgress.progress}%`, detail: `${ecceProgress.completedModules}/${ecceProgress.totalModules} modules complete`, icon: Sparkles, tone: ecceProgress.progress >= 70 ? 'emerald' as const : ecceProgress.progress >= 35 ? 'amber' as const : 'red' as const },
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
    { label: 'Learning Trend', tab: 'learning' as const, icon: BookOpen, detail: 'Learning and attendance movement' },
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
          <button onClick={() => navigate('/worker/parents')} className="inline-flex items-center gap-2 rounded-2xl bg-sky-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 hover:bg-sky-600 transition-colors">
            <MessageSquareHeart size={16} />
            {t('parents.btn_share')}
          </button>
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
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">{t('dashboard.development.title')}</p>
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
          A compact child-wise view aligned with the detailed Attendance, Learning, and {isSupervisorView ? 'Nutrition & Health' : 'Health & Care'} sections below.
        </p>

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

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
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
                  <h2 className="text-xl font-semibold text-foreground">Learning Progress</h2>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Overall score: <span className="font-semibold text-foreground">{Math.round(child.learningScore)}%</span> engagement in '{theme}' theme.
                </p>
              </div>
              <div className="flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 dark:border-amber-900/30 dark:bg-amber-950/20 self-start sm:self-auto">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star key={star} size={14} className={cn('fill-current', star <= rating ? 'text-amber-500' : 'text-slate-300 dark:text-slate-700')} />
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
                      style={{ width: `${Math.round((item.value / item.total) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        <div className="space-y-6">
          <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-foreground">{t('dashboard.radar.title')}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{t('dashboard.radar.desc')}</p>
            <div className="mt-4 h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis dataKey="domain" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                  <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar dataKey="score" stroke="#38bdf8" fill="#38bdf8" fillOpacity={0.28} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid gap-3">
              {radarData.map((domain: { domain: string; score: number }) => (
                <div key={domain.domain} className="rounded-2xl border border-border bg-background/70 p-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">{domain.domain}</span>
                    <span className="font-semibold text-foreground">{domain.score}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <Brain size={18} className="text-sky-500" />
              <h2 className="text-xl font-semibold text-foreground">{t('dashboard.development.title')}</h2>
            </div>
            <div className="mt-4 grid gap-4">
              {insights.map((insight) => (
                <div key={insight.id} className="rounded-3xl border border-border bg-background/70 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-foreground">{t(insight.title)}</p>
                    <span className={cn(
                      'rounded-full px-3 py-1 text-xs font-semibold',
                      insight.severity === 'good' && 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
                      insight.severity === 'average' && 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
                      insight.severity === 'critical' && 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300',
                    )}>
                      {t(`status.${insight.severity || 'good'}`)}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">{t(insight.detail)}</p>
                </div>
              ))}
            </div>
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
              { value: 'learning' as const, label: 'Learning Trend', icon: BookOpen },
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
              <div className="rounded-2xl border border-border bg-card p-4">
                <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-foreground">
                  <BookOpen size={14} className="text-primary" />
                  Learning and attendance trend
                </h4>
                <div className="h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={periodicHistory} barCategoryGap="18%">
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} />
                      <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} unit="%" />
                      <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '0.75rem', border: '1px solid hsl(var(--border))', fontSize: '12px' }} />
                      <Legend wrapperStyle={{ fontSize: '10px', fontWeight: 600 }} />
                      <Bar dataKey="learningScore" name="Learning" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                      <Bar dataKey="attendanceRate" name="Attendance" fill="#06b6d4" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <ChildMetricCard label="ECCE Progress" value={`${ecceProgress.progress}%`} detail={`${ecceProgress.completedModules}/${ecceProgress.totalModules} modules complete`} icon={Sparkles} tone={ecceProgress.progress >= 70 ? 'emerald' : ecceProgress.progress >= 35 ? 'amber' : 'red'} />
                <ChildMetricCard label="Development Checklist" value={`${developmentPercent}%`} detail={`${developmentDone}/${developmentItems.length} milestones observed`} icon={Brain} tone={developmentPercent >= 75 ? 'emerald' : developmentPercent >= 45 ? 'amber' : 'red'} />
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
