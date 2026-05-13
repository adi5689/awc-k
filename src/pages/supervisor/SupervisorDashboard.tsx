// ============================================================
// SUPERVISOR DASHBOARD
// Block-level overview with detailed metrics and AWC table
// ============================================================

import { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { mockAWCs } from '../../data/mockData';
import { cn, simulateAPI, formatIndianNumber } from '../../utils';
import { useTranslation } from '../../hooks/useTranslation';
import { DashboardSkeleton } from '../../components/ui/loading-skeleton';
import {
  Users, TrendingUp, AlertTriangle, Building2, BarChart3,
  ChevronRight, Activity, Apple, ShieldCheck, HeartPulse,
  BookOpen, CalendarCheck2, Sparkles, Stars, PieChart as PieIcon,
  AlertCircle, Crosshair, ClipboardList
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line
} from 'recharts';
import {
  getImmunizationMetrics,
  getLearningGap,
  getLearningRiskLabel,
  getTHRMetrics,
  getNutritionBurden,
} from '../../data/supervisorInsights';
import { FunctionalScopeFlow, type ScopeFlowItem } from '../../components/FunctionalScopeFlow';

const COLORS = ['#10b981', '#f59e0b', '#ef4444']; // Normal, MAM, SAM

const supervisorScopeFlow: ScopeFlowItem[] = [
  {
    letter: 'A',
    title: 'Learning review',
    description: 'Monitor centre-level learning outcomes and identify support gaps.',
    path: '/supervisor/learning',
  },
  {
    letter: 'B',
    title: 'Centre profiles',
    description: 'Open AWC directory and drill into child/centre progress records.',
    path: '/supervisor/awc-list',
  },
  {
    letter: 'C',
    title: 'AI dashboard',
    description: 'Review AWC-wise and block-wise green, yellow, red analytics.',
    path: '/supervisor/ai-dashboard',
  },
  {
    letter: 'D',
    title: 'Predictive risk',
    description: 'Forecast nutrition-learning risk load across centres.',
    path: '/supervisor/predictive-risk',
  },
  {
    letter: 'E',
    title: 'Sync watch',
    description: 'Track pending/error sync centres through the compliance watch.',
    path: '/supervisor',
  },
];

export function SupervisorDashboard() {
  const [loading, setLoading] = useState(true);
  const [attendanceView, setAttendanceView] = useState<'weekly' | 'monthly'>('weekly');
  const [selectedCentreId, setSelectedCentreId] = useState<string>('all');
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    simulateAPI(null, 1000).then(() => setLoading(false));
  }, []);

  const centerWiseData = useMemo(() => {
    return mockAWCs.map((awc) => {
      const thrMetrics = getTHRMetrics(awc);
      const immuneMetrics = getImmunizationMetrics(awc);
      const learningGap = getLearningGap(awc.avgLearningScore);

      return {
        ...awc,
        name: awc.name.replace('AWC ', ''),
        learning: awc.avgLearningScore,
        attendance: awc.attendanceRate,
        thrCoverage: thrMetrics.thrCoverage,
        mddScore: thrMetrics.mddScore,
        immCoverage: immuneMetrics.coverage,
        dueCount: immuneMetrics.dueCount,
        nutritionBurden: getNutritionBurden(awc),
        learningGap,
        riskLabel: getLearningRiskLabel(awc.avgLearningScore),
        syncRisk: awc.syncStatus === 'error' ? 20 : awc.syncStatus === 'pending' ? 10 : 0,
      };
    });
  }, []);

  if (loading) return <DashboardSkeleton />;

  // 1. Calculate block-level metrics
  const totalChildren = mockAWCs.reduce((a, awc) => a + awc.totalChildren, 0);
  const totalPresent = mockAWCs.reduce((a, awc) => a + awc.presentToday, 0);
  const totalCritical = mockAWCs.reduce((a, awc) => a + awc.criticalCases, 0);
  const avgLearning = Math.round(mockAWCs.reduce((a, awc) => a + awc.avgLearningScore, 0) / mockAWCs.length);
  const avgAttendance = Math.round(mockAWCs.reduce((a, awc) => a + awc.attendanceRate, 0) / mockAWCs.length);

  const nutritionTotal = mockAWCs.reduce((a, awc) => ({
    normal: a.normal + awc.nutritionBreakdown.normal,
    mam: a.mam + awc.nutritionBreakdown.mam,
    sam: a.sam + awc.nutritionBreakdown.sam,
  }), { normal: 0, mam: 0, sam: 0 });

  const totalImm = centerWiseData.reduce((sum, awc) => sum + awc.immCoverage, 0);
  const totalThr = centerWiseData.reduce((sum, awc) => sum + awc.thrCoverage, 0);

  const blockAvgImm = Math.round(totalImm / mockAWCs.length);
  const blockAvgThr = Math.round(totalThr / mockAWCs.length);
  const selectedCentre = selectedCentreId === 'all'
    ? null
    : centerWiseData.find((awc) => awc.id === selectedCentreId) ?? null;
  const focusChartData = selectedCentre
    ? centerWiseData.filter((awc) => awc.id === selectedCentre.id)
    : centerWiseData;
  const highestLearningCentre = [...centerWiseData].sort((a, b) => b.learning - a.learning)[0];
  const highestAttendanceCentre = [...centerWiseData].sort((a, b) => b.attendance - a.attendance)[0];
  const highestBurdenCentre = [...centerWiseData].sort((a, b) => b.nutritionBurden - a.nutritionBurden)[0];
  const centreRankings = [...centerWiseData]
    .map((awc) => ({
      ...awc,
      riskScore: Math.round((100 - awc.attendance) + awc.learningGap + awc.nutritionBurden + awc.criticalCases * 4 + awc.syncRisk),
    }))
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, 5);
  const syncIssues = centerWiseData.filter((awc) => awc.syncStatus !== 'synced');
  const criticalCentres = centerWiseData.filter((awc) => awc.status === 'Critical');
  const followUpActions = centreRankings.slice(0, 4).map((awc) => {
    const action =
      awc.syncStatus === 'error'
        ? 'Request immediate data sync'
        : awc.nutritionBreakdown.sam > 0
          ? 'Schedule nutrition verification visit'
          : awc.attendance < 75
            ? 'Call worker for attendance recovery plan'
            : 'Review learning support plan';

    return { awc, action };
  });

  // 2. Trend Data
  const weeklyTrendData = [
    { name: 'Mon', rate: Math.max(avgAttendance - 6, 0) },
    { name: 'Tue', rate: Math.max(avgAttendance - 2, 0) },
    { name: 'Wed', rate: Math.min(avgAttendance + 1, 100) },
    { name: 'Thu', rate: avgAttendance },
    { name: 'Fri', rate: Math.min(avgAttendance + 4, 100) },
    { name: 'Sat', rate: Math.max(avgAttendance - 1, 0) },
    { name: 'Sun', rate: Math.max(avgAttendance - 8, 0) },
  ];

  const monthlyTrendData = [
    { name: 'Nov', rate: Math.max(avgAttendance - 10, 0) },
    { name: 'Dec', rate: Math.max(avgAttendance - 7, 0) },
    { name: 'Jan', rate: Math.max(avgAttendance - 5, 0) },
    { name: 'Feb', rate: Math.max(avgAttendance - 3, 0) },
    { name: 'Mar', rate: Math.min(avgAttendance + 1, 100) },
    { name: 'Apr', rate: avgAttendance },
  ];

  const attendanceTrendData = attendanceView === 'weekly' ? weeklyTrendData : monthlyTrendData;

  const pieChartData = [
    { name: t('nutrition.normal'), value: nutritionTotal.normal },
    { name: t('nutrition.mam'), value: nutritionTotal.mam },
    { name: t('nutrition.sam'), value: nutritionTotal.sam },
  ];

  // Identify struggling centers for AI Insights
  const lowAttendanceCenters = mockAWCs.filter(a => a.attendanceRate < 70);
  const highSamCenters = mockAWCs.filter(a => a.nutritionBreakdown.sam > 3);

  return (
    <div className="space-y-8 pb-10 animate-fade-in">
      {/* Hero Section */}
      <section className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm">
        <div className="bg-[radial-gradient(circle_at_top_left,_rgba(79,70,229,0.15),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(56,189,248,0.12),_transparent_32%),linear-gradient(135deg,rgba(255,255,255,0.92),rgba(255,255,255,0.7))] dark:bg-[radial-gradient(circle_at_top_left,_rgba(79,70,229,0.12),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(56,189,248,0.10),_transparent_32%),linear-gradient(135deg,rgba(15,23,42,0.92),rgba(15,23,42,0.72))] p-6 md:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                {t('supervisor.dashboard_title')}
              </h2>
              <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                <Building2 size={16} />
                {t('supervisor.block_overview')} • {mockAWCs.length} Centres
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <select
                value={selectedCentreId}
                onChange={(event) => setSelectedCentreId(event.target.value)}
                className="min-w-[220px] rounded-2xl border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">Track block total</option>
                {mockAWCs.map((awc) => (
                  <option key={awc.id} value={awc.id}>{awc.name}</option>
                ))}
              </select>
              <button onClick={() => navigate('/supervisor/awc-list')} className="rounded-2xl border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground hover:bg-accent transition-colors shadow-sm">
                View All Centres
              </button>
              <button
                onClick={() => navigate('/supervisor/reports')}
                className="flex items-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <PieIcon size={18} />
                Generate Block Report
              </button>
            </div>
          </div>
        </div>
      </section>

      <FunctionalScopeFlow
        title="Supervisor review flow"
        subtitle="Move from learning and centre profile checks into AI ranking, prediction, and sync compliance."
        items={supervisorScopeFlow}
      />

      {/* 8 Detailed KPI Cards Mirroring Worker Dashboard */}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: 'Total Enrolled (Block)',
            value: formatIndianNumber(totalChildren),
            icon: Users,
            tone: 'sky',
            meta: `${formatIndianNumber(totalPresent)} present today`,
            action: '/supervisor/awc-list'
          },
          {
            label: 'Avg Learning Score',
            value: `${avgLearning}%`,
            icon: BookOpen,
            tone: 'emerald',
            meta: avgLearning >= 70 ? 'On Track' : 'Needs Improvement',
            action: '/supervisor/learning'
          },
          {
            label: 'Avg Attendance',
            value: `${avgAttendance}%`,
            icon: CalendarCheck2,
            tone: avgAttendance >= 80 ? 'sky' : 'amber',
            meta: attendanceView === 'weekly' ? 'Block-wide weekly trend' : 'Block-wide monthly trend',
            action: '/supervisor/attendance'
          },
          {
            label: 'Critical Center Alerts',
            value: totalCritical,
            icon: AlertCircle,
            tone: 'red',
            meta: totalCritical > 0 ? 'Requires immediate attention' : 'All centers clear',
          },
          {
            label: 'Underweight (MAM)',
            value: nutritionTotal.mam,
            icon: HeartPulse,
            tone: 'amber',
            meta: 'Nutrition monitoring required',
            action: '/supervisor/nutrition'
          },
          {
            label: 'Severe Malnutrition (SAM)',
            value: nutritionTotal.sam,
            icon: AlertTriangle,
            tone: 'red',
            meta: 'Highest priority follow-up needed',
            action: '/supervisor/nutrition'
          },
          {
            label: 'Est. Fully Immunized',
            value: `${blockAvgImm}%`,
            icon: ShieldCheck,
            tone: 'emerald',
            meta: 'Block average coverage',
            action: '/supervisor/immunization'
          },
          {
            label: 'Average THR Delivery',
            value: `${blockAvgThr}%`,
            icon: Apple,
            tone: 'sky',
            meta: 'Take Home Ration reach',
            action: '/supervisor/nutrition'
          },
          {
            label: 'Sync / Compliance Issues',
            value: syncIssues.length,
            icon: Crosshair,
            tone: syncIssues.length > 0 ? 'amber' : 'emerald',
            meta: syncIssues.length > 0 ? 'Centres need data follow-up' : 'All centres synced',
            action: '/supervisor/awc-list'
          },
        ].map((card, index) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={cn(
              'group relative overflow-hidden rounded-[1.9rem] border p-5 shadow-sm transition-all duration-300',
              card.tone === 'sky' && 'border-sky-200/80 bg-[linear-gradient(145deg,rgba(240,249,255,0.98),rgba(224,242,254,0.75))] dark:border-sky-900 dark:bg-[linear-gradient(145deg,rgba(12,74,110,0.35),rgba(2,132,199,0.12))]',
              card.tone === 'emerald' && 'border-emerald-200/80 bg-[linear-gradient(145deg,rgba(236,253,245,0.98),rgba(209,250,229,0.72))] dark:border-emerald-900 dark:bg-[linear-gradient(145deg,rgba(6,78,59,0.35),rgba(16,185,129,0.12))]',
              card.tone === 'amber' && 'border-amber-200/80 bg-[linear-gradient(145deg,rgba(255,251,235,0.98),rgba(254,243,199,0.74))] dark:border-amber-900 dark:bg-[linear-gradient(145deg,rgba(120,53,15,0.35),rgba(245,158,11,0.12))]',
              card.tone === 'red' && 'border-red-200/80 bg-[linear-gradient(145deg,rgba(254,242,242,0.98),rgba(254,226,226,0.75))] dark:border-red-900 dark:bg-[linear-gradient(145deg,rgba(127,29,29,0.35),rgba(239,68,68,0.12))]',
              card.action && 'cursor-pointer hover:-translate-y-1 hover:shadow-xl'
            )}
            onClick={() => card.action && navigate(card.action)}
            role={card.action ? 'button' : undefined}
            tabIndex={card.action ? 0 : undefined}
            onKeyDown={(event) => {
              if (card.action && (event.key === 'Enter' || event.key === ' ')) {
                navigate(card.action);
              }
            }}
          >
            <div
              className={cn(
                'pointer-events-none absolute right-0 top-0 h-28 w-28 rounded-full blur-2xl transition-opacity',
                card.tone === 'sky' && 'bg-sky-300/30 dark:bg-sky-400/20',
                card.tone === 'emerald' && 'bg-emerald-300/30 dark:bg-emerald-400/20',
                card.tone === 'amber' && 'bg-amber-300/30 dark:bg-amber-400/20',
                card.tone === 'red' && 'bg-red-300/30 dark:bg-red-400/20',
              )}
            />
            <div className="relative flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground/90">
                  {card.label}
                </p>
                <p className="mt-3 text-4xl font-bold tracking-tight text-foreground">{card.value}</p>
                <p className="mt-3 text-sm font-medium text-muted-foreground">{card.meta}</p>
              </div>
              <div className={cn(
                'flex h-14 w-14 shrink-0 items-center justify-center rounded-[1.25rem] border shadow-sm backdrop-blur',
                card.tone === 'sky' && 'border-sky-200 bg-white/80 text-sky-700 dark:border-sky-800 dark:bg-sky-950/40 dark:text-sky-300',
                card.tone === 'emerald' && 'border-emerald-200 bg-white/80 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300',
                card.tone === 'amber' && 'border-amber-200 bg-white/80 text-amber-700 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300',
                card.tone === 'red' && 'border-red-200 bg-white/80 text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300',
              )}>
                <card.icon size={20} />
              </div>
            </div>
            {card.action ? (
              <div className="relative mt-5 flex items-center justify-between border-t border-black/5 pt-4 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground dark:border-white/10">
                <span>View Details</span>
                <TrendingUp size={14} className="transition-transform group-hover:translate-x-1" />
              </div>
            ) : (
              <div className="relative mt-5 border-t border-black/5 pt-4 text-xs uppercase tracking-[0.2em] text-muted-foreground dark:border-white/10">
                Block Snapshot
              </div>
            )}
          </motion.div>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-muted-foreground">20-centre command view</p>
              <h3 className="mt-1 text-2xl font-bold tracking-tight text-foreground">Priority Centre Ranking</h3>
              <p className="mt-2 text-sm text-muted-foreground">Composite risk score using attendance gap, learning gap, nutrition burden, critical cases, and sync status.</p>
            </div>
            <button
              onClick={() => navigate('/supervisor/awc-list')}
              className="rounded-2xl border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-accent"
            >
              Open Centre Directory
            </button>
          </div>

          <div className="mt-6 space-y-3">
            {centreRankings.map((awc, index) => (
              <button
                key={awc.id}
                type="button"
                onClick={() => navigate(`/supervisor/awc/${awc.id}`)}
                className="flex w-full flex-col gap-3 rounded-[1.5rem] border border-border bg-background/70 p-4 text-left transition-colors hover:bg-accent sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-start gap-3">
                  <div className={cn(
                    'flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-sm font-bold',
                    index === 0 ? 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
                  )}>
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-bold text-foreground">{awc.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{awc.workerName} • {awc.location}</p>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-2 text-right text-xs sm:min-w-[360px]">
                  <div>
                    <p className="text-muted-foreground">Risk</p>
                    <p className="font-bold text-foreground">{awc.riskScore}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Att.</p>
                    <p className="font-bold text-foreground">{awc.attendance}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">SAM</p>
                    <p className="font-bold text-foreground">{awc.nutritionBreakdown.sam}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Sync</p>
                    <p className={cn(
                      'font-bold capitalize',
                      awc.syncStatus === 'synced' && 'text-emerald-600',
                      awc.syncStatus === 'pending' && 'text-amber-600',
                      awc.syncStatus === 'error' && 'text-red-600'
                    )}>{awc.syncStatus}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-muted-foreground">Supervisor follow-up</p>
            <h3 className="mt-1 text-2xl font-bold tracking-tight text-foreground">Action Tracker</h3>
            <p className="mt-2 text-sm text-muted-foreground">Dummy action queue for calls, visits, sync requests, and nutrition escalation.</p>
          </div>

          <div className="mt-6 grid gap-3">
            {followUpActions.map(({ awc, action }) => (
              <div key={awc.id} className="rounded-[1.4rem] border border-border bg-background/70 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-foreground">{awc.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{awc.workerName}</p>
                  </div>
                  <span className={cn(
                    'rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider',
                    awc.status === 'Critical' && 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300',
                    awc.status === 'Warning' && 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
                    awc.status === 'Good' && 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                  )}>{awc.status}</span>
                </div>
                <p className="mt-3 text-sm font-medium text-foreground">{action}</p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  <button onClick={() => navigate(`/supervisor/awc/${awc.id}`)} className="rounded-full bg-primary px-3 py-1.5 font-semibold text-primary-foreground">Open centre</button>
                  <span className="rounded-full border border-border bg-card px-3 py-1.5 text-muted-foreground">Due this week</span>
                  {awc.syncStatus !== 'synced' && <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 font-semibold text-amber-700 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300">Sync follow-up</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-muted-foreground">Supervisor monitoring</p>
            <h3 className="mt-1 text-2xl font-bold tracking-tight text-foreground">Centre Performance Overview</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Review each Anganwadi centre across attendance, learning, nutrition, immunization, and sync readiness.
            </p>
          </div>
          <button
            onClick={() => navigate('/supervisor/awc-list')}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-accent"
          >
            <ClipboardList size={16} />
            Open Directory
          </button>
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-3">
          {centerWiseData.slice(0, 6).map((awc) => {
            const healthTone = awc.nutritionBreakdown.sam > 0 || awc.criticalCases > 0 ? 'red' : awc.nutritionBreakdown.mam > 0 ? 'amber' : 'emerald';

            return (
              <button
                key={awc.id}
                onClick={() => navigate(`/supervisor/awc/${awc.id}`)}
                className="rounded-[1.75rem] border border-border bg-background/60 p-4 text-left transition-all hover:-translate-y-0.5 hover:bg-accent hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-bold text-foreground">{awc.workerName}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{awc.name} · {awc.location}</p>
                  </div>
                  <span className={cn(
                    'rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider',
                    awc.status === 'Good' && 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
                    awc.status === 'Warning' && 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
                    awc.status === 'Critical' && 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300',
                  )}>
                    {awc.status}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2">
                  {[
                    { label: 'Attendance', value: `${awc.attendance}%`, tone: awc.attendance >= 85 ? 'text-emerald-600' : awc.attendance >= 70 ? 'text-amber-600' : 'text-red-600' },
                    { label: 'Learning', value: `${awc.learning}%`, tone: awc.learning >= 70 ? 'text-emerald-600' : awc.learning >= 50 ? 'text-amber-600' : 'text-red-600' },
                    { label: 'Nutrition', value: `${awc.nutritionBreakdown.sam} SAM`, tone: healthTone === 'red' ? 'text-red-600' : healthTone === 'amber' ? 'text-amber-600' : 'text-emerald-600' },
                  ].map((metric) => (
                    <div key={metric.label} className="rounded-2xl border border-border bg-card px-3 py-2">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{metric.label}</p>
                      <p className={cn('mt-1 text-sm font-bold', metric.tone)}>{metric.value}</p>
                    </div>
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[2rem] border border-indigo-200/70 bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.15),_transparent_30%),linear-gradient(135deg,rgba(255,255,255,0.96),rgba(238,242,255,0.88))] p-6 shadow-sm dark:border-indigo-900/40 dark:bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.15),_transparent_30%),linear-gradient(135deg,rgba(49,46,129,0.22),rgba(2,6,23,0.92))]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-indigo-700 dark:text-indigo-300">Tracking Scope</p>
              <h3 className="mt-3 text-xl font-semibold text-foreground">
                {selectedCentre ? `${selectedCentre.name} compared with block totals` : 'Block totals with centre drill-down ready'}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {selectedCentre
                  ? `${selectedCentre.workerName}'s centre is being benchmarked against the overall block so you can spot whether issues are local or systemic.`
                  : 'Use the centre selector to compare a single AWC against block-level totals without leaving the dashboard.'}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/80 text-indigo-600 shadow-sm dark:bg-indigo-950/30 dark:text-indigo-300">
              <Crosshair size={20} />
            </div>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              {
                label: 'Attendance',
                blockValue: `${avgAttendance}%`,
                centreValue: selectedCentre ? `${selectedCentre.attendance}%` : 'Select centre',
                tone: selectedCentre && selectedCentre.attendance < avgAttendance ? 'text-amber-600' : 'text-emerald-600',
              },
              {
                label: 'Learning Score',
                blockValue: `${avgLearning}%`,
                centreValue: selectedCentre ? `${selectedCentre.learning}%` : 'Select centre',
                tone: selectedCentre && selectedCentre.learning < avgLearning ? 'text-amber-600' : 'text-emerald-600',
              },
              {
                label: 'THR Coverage',
                blockValue: `${blockAvgThr}%`,
                centreValue: selectedCentre ? `${selectedCentre.thrCoverage}%` : 'Select centre',
                tone: selectedCentre && selectedCentre.thrCoverage < blockAvgThr ? 'text-amber-600' : 'text-emerald-600',
              },
              {
                label: 'Immunization',
                blockValue: `${blockAvgImm}%`,
                centreValue: selectedCentre ? `${selectedCentre.immCoverage}%` : 'Select centre',
                tone: selectedCentre && selectedCentre.immCoverage < blockAvgImm ? 'text-amber-600' : 'text-emerald-600',
              },
            ].map((item) => (
              <div key={item.label} className="rounded-[1.4rem] border border-white/60 bg-white/80 p-4 shadow-sm dark:border-white/10 dark:bg-slate-950/30">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{item.label}</p>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Block</span>
                    <span className="font-semibold text-foreground">{item.blockValue}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Selected</span>
                    <span className={cn('font-semibold', item.tone)}>{item.centreValue}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-xl font-semibold text-foreground">Centre Spotlight</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {selectedCentre ? 'Current centre diagnostics' : 'Top centre benchmarks across the block'}
              </p>
            </div>
            <ClipboardList className="text-indigo-600" size={22} />
          </div>
          {selectedCentre ? (
            <div className="mt-6 space-y-4">
              <div className="rounded-[1.4rem] border border-border bg-background/60 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-base font-semibold text-foreground">{selectedCentre.name}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{selectedCentre.workerName} • {selectedCentre.location}</p>
                  </div>
                  <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300">
                    {selectedCentre.riskLabel}
                  </span>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-[1.2rem] border border-border bg-background/60 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Children Present</p>
                  <p className="mt-2 text-2xl font-bold text-foreground">{selectedCentre.presentToday}/{selectedCentre.totalChildren}</p>
                </div>
                <div className="rounded-[1.2rem] border border-border bg-background/60 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Nutrition Burden</p>
                  <p className="mt-2 text-2xl font-bold text-foreground">{selectedCentre.nutritionBurden}%</p>
                </div>
                <div className="rounded-[1.2rem] border border-border bg-background/60 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Learning Gap To 70</p>
                  <p className="mt-2 text-2xl font-bold text-foreground">{selectedCentre.learningGap} pts</p>
                </div>
                <div className="rounded-[1.2rem] border border-border bg-background/60 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Overdue Vaccines</p>
                  <p className="mt-2 text-2xl font-bold text-foreground">{selectedCentre.dueCount}</p>
                </div>
              </div>
              <button
                onClick={() => navigate(`/supervisor/awc/${selectedCentre.id}`)}
                className="w-full rounded-[1.25rem] border border-border bg-background/70 px-4 py-4 text-sm font-semibold text-foreground transition-colors hover:bg-accent"
              >
                Open Full Centre Detail
              </button>
            </div>
          ) : (
            <div className="mt-6 space-y-3">
              {[
                { label: 'Best learning', centre: highestLearningCentre, metric: `${highestLearningCentre.learning}% score` },
                { label: 'Best attendance', centre: highestAttendanceCentre, metric: `${highestAttendanceCentre.attendance}% attendance` },
                { label: 'Highest nutrition burden', centre: highestBurdenCentre, metric: `${highestBurdenCentre.nutritionBurden}% burden` },
              ].map((item) => (
                <div key={item.label} className="rounded-[1.2rem] border border-border bg-background/60 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{item.label}</p>
                  <div className="mt-2 flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-foreground">{item.centre.name}</p>
                      <p className="text-xs text-muted-foreground">{item.centre.workerName}</p>
                    </div>
                    <span className="text-sm font-semibold text-foreground">{item.metric}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Aggregate Charts & Insights (Replicating worker style) */}
      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          {/* Trends Line Chart */}
          <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-foreground">Block Attendance Trend</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  {attendanceView === 'weekly'
                    ? 'Average attendance across all centres this week.'
                    : 'Average attendance across all centres this month.'}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="inline-flex rounded-full border border-border bg-background p-1">
                  <button
                    onClick={() => setAttendanceView('weekly')}
                    className={cn('rounded-full px-3 py-1.5 text-xs font-semibold transition-colors', attendanceView === 'weekly' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground')}
                  >Weekly</button>
                  <button
                    onClick={() => setAttendanceView('monthly')}
                    className={cn('rounded-full px-3 py-1.5 text-xs font-semibold transition-colors', attendanceView === 'monthly' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground')}
                  >Monthly</button>
                </div>
                <Activity className="text-indigo-500" size={24} />
              </div>
            </div>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={attendanceTrendData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} />
                  <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '1rem', border: '1px solid hsl(var(--border))' }} />
                  <Line type="monotone" dataKey="rate" stroke="#6366f1" strokeWidth={4} dot={{ r: 4, fill: '#6366f1' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bar Chart - AWC-wise Performance */}
          <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <BarChart3 size={20} className="text-blue-600" />
              Centre-wise Learning & Attendance
            </h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={focusChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Bar dataKey="learning" fill="#3b82f6" name={t('supervisor.chart.learning')} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="attendance" fill="#10b981" name={t('supervisor.chart.attendance')} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* AI Insights & Quick Actions */}
          <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm overflow-hidden relative">
            <div className="pointer-events-none absolute top-0 right-0 p-8 opacity-10" aria-hidden="true">
              <Sparkles size={120} className="text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <Stars className="text-indigo-600" size={20} />
              Block Insights & Alerts
            </h3>
            <div className="mt-6 space-y-4">
              {lowAttendanceCenters.length > 0 ? (
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900">
                  <p className="text-sm font-bold text-amber-800 dark:text-amber-300 flex items-center gap-2">
                    <AlertTriangle size={16} />
                    {lowAttendanceCenters.length} Centre(s) with Low Attendance
                  </p>
                  <p className="mt-2 text-xs text-amber-700 dark:text-amber-400">
                    {lowAttendanceCenters.map(c => c.name).join(', ')} are averaging below 70% attendance. Follow up required.
                  </p>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900">
                  <p className="text-sm font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                    <Activity size={16} />
                    Strong Attendance Matrix
                  </p>
                  <p className="mt-2 text-xs text-emerald-700 dark:text-emerald-400">
                    All centres are maintaining healthy attendance rates.
                  </p>
                </div>
              )}
              
              {highSamCenters.length > 0 && (
                <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900">
                  <p className="text-sm font-bold text-red-800 dark:text-red-300 flex items-center gap-2">
                    <HeartPulse size={16} />
                    High SAM Density
                  </p>
                  <p className="mt-2 text-xs text-red-700 dark:text-red-400">
                    {highSamCenters.map(c => c.name).join(', ')} reported multiple SAM cases. Prioritize supervisor visits to verify interventions.
                  </p>
                </div>
              )}

              <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900">
                <p className="text-sm font-bold text-blue-800 dark:text-blue-300 flex items-center gap-2">
                  <TrendingUp size={16} />
                  Learning Trajectory
                </p>
                <p className="mt-2 text-xs text-blue-700 dark:text-blue-400">
                  {highestLearningCentre.name} is currently leading the block with {highestLearningCentre.learning}% learning performance. Consider sharing its classroom practices.
                </p>
              </div>
            </div>
          </div>

          {/* Pie Chart - Nutrition Categories */}
         <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-foreground">Block Nutrition Distribution</h3>
                <p className="text-sm text-muted-foreground mt-2">Aggregate of Normal, MAM, and SAM.</p>
              </div>
              <PieIcon className="text-emerald-500" size={24} />
            </div>
            <div className="grid md:grid-cols-2 items-center">
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieChartData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-3">
                {pieChartData.map((item, index) => (
                  <div key={item.name} className="flex items-center justify-between p-3 rounded-2xl border border-border bg-background/50">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                      <span className="text-xs font-medium">{item.name}</span>
                    </div>
                    <span className="text-xs font-bold">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Navigations */}
          <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-foreground mb-4">Quick Navigation</h3>
            <div className="grid gap-3">
                {[
                  { label: 'Nutrition Discrepancy Tracking', icon: HeartPulse, action: '/supervisor/nutrition' },
                  { label: 'Block Level Reports', icon: BookOpen, action: '/supervisor/reports' },
                  { label: 'Manage All AWCs', icon: Building2, action: '/supervisor/awc-list' },
                ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => navigate(item.action)}
                  className="flex items-center justify-between rounded-[1.25rem] border border-border bg-background/50 px-4 py-4 text-left hover:bg-accent transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-indigo-600/10 p-3 text-indigo-600 group-hover:scale-110 transition-transform">
                      <item.icon size={18} />
                    </div>
                    <span className="text-sm font-semibold text-foreground">{item.label}</span>
                  </div>
                  <TrendingUp size={16} className="text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-xl font-semibold text-foreground">Sync & Compliance Watch</h3>
                <p className="mt-2 text-sm text-muted-foreground">Centres where delayed sync or critical status can hide real service-delivery gaps.</p>
              </div>
              <Crosshair className="text-indigo-600" size={22} />
            </div>
            <div className="mt-6 space-y-3">
              {[...syncIssues, ...criticalCentres.filter((awc) => !syncIssues.some((item) => item.id === awc.id))].slice(0, 5).map((awc) => (
                <button
                  key={awc.id}
                  onClick={() => {
                    setSelectedCentreId(awc.id);
                  }}
                  className="flex w-full items-start justify-between rounded-[1.3rem] border border-border bg-background/60 p-4 text-left transition-colors hover:bg-accent"
                >
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{awc.syncStatus === 'synced' ? 'Critical centre' : 'Sync follow-up'}</p>
                    <p className="mt-2 font-semibold text-foreground">{awc.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{awc.workerName}</p>
                  </div>
                  <div className="text-right text-xs text-muted-foreground">
                    <p className={cn(
                      'font-bold capitalize',
                      awc.syncStatus === 'synced' && 'text-emerald-600',
                      awc.syncStatus === 'pending' && 'text-amber-600',
                      awc.syncStatus === 'error' && 'text-red-600'
                    )}>{awc.syncStatus}</p>
                    <p className="mt-1">{awc.criticalCases} critical</p>
                    <p className="mt-1">{awc.lastSyncTime ? new Date(awc.lastSyncTime).toLocaleDateString('en-IN') : 'No sync'}</p>
                  </div>
                </button>
              ))}
              {syncIssues.length === 0 && criticalCentres.length === 0 ? (
                <div className="rounded-[1.3rem] border border-border bg-background/60 p-4 text-sm text-muted-foreground">
                  All centres are currently synced and no critical centre needs immediate compliance review.
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {/* AWC List Table */}
      <div className="p-6 rounded-[2rem] border border-border bg-card shadow-sm overflow-hidden">
        <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
          <Building2 size={20} className="text-indigo-600" />
          {t('supervisor.table.title')}
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t('supervisor.table.centre_name')}</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t('supervisor.table.worker')}</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t('supervisor.table.status')}</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t('supervisor.table.children')}</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t('supervisor.table.learning')}</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t('supervisor.table.attendance')}</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t('supervisor.table.alerts')}</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody>
              {centerWiseData.map((awc, i) => (
                <tr
                  key={awc.id}
                  className="border-b border-border/50 hover:bg-accent/50 transition-colors cursor-pointer animate-fade-in opacity-0"
                  style={{ animationDelay: `${i * 0.05}s`, animationFillMode: 'forwards' }}
                  onClick={() => navigate(`/supervisor/awc/${awc.id}`)}
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className={cn('w-2 h-2 rounded-full',
                        awc.status === 'Good' ? 'bg-emerald-500' : awc.status === 'Warning' ? 'bg-amber-500' : 'bg-red-500'
                      )} />
                      <span className="font-medium text-foreground">{awc.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">{awc.workerName}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={cn(
                      'px-2.5 py-1 rounded-full text-xs font-semibold',
                      awc.status === 'Good' ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400' :
                      awc.status === 'Warning' ? 'bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400' :
                      'bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-400'
                    )}>
                      {awc.status === 'Good' ? t('status.good') : awc.status === 'Warning' ? t('status.warning') : t('status.critical')}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center text-foreground font-medium">{awc.presentToday}/{awc.totalChildren}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={cn('font-semibold',
                      awc.avgLearningScore >= 70 ? 'text-emerald-600' : awc.avgLearningScore >= 50 ? 'text-amber-600' : 'text-red-600'
                    )}>{awc.avgLearningScore}%</span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={cn('font-semibold',
                      awc.attendanceRate >= 85 ? 'text-emerald-600' : awc.attendanceRate >= 70 ? 'text-amber-600' : 'text-red-600'
                    )}>{awc.attendanceRate}%</span>
                  </td>
                  <td className="py-3 px-4">
                    {awc.alerts.length > 0 ? (
                      <span className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                        <AlertTriangle size={12} />
                        {t('supervisor.table.alerts_count', { count: awc.alerts.length })}
                      </span>
                    ) : (
                      <span className="text-xs text-emerald-600">{t('supervisor.table.all_clear')}</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <ChevronRight size={16} className="text-muted-foreground" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
