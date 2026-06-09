import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Activity,
  AlertCircle,
  BarChart3,
  BookOpen,
  ShieldCheck,
  MapPin,
  Sparkles,
  Stars,
  TrendingUp,
  Users,
  CalendarCheck2,
  AlertTriangle,
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar,
} from 'recharts';
import { average, cn } from '../../utils';
import { useTranslation } from '../../hooks/useTranslation';
import { getWorkerAlerts, getWorkerContext } from './workerAlertData';
import {
  dashboardHealthSnapshot,
} from '../../data/childMonitoringData';
import { FunctionalScopeFlow, type ScopeFlowItem } from '../../components/FunctionalScopeFlow';
import { lmsCoverageSummary } from '../../data/ecceLms';

const workerScopeFlow: ScopeFlowItem[] = [
  {
    letter: 'A',
    title: 'ECCE LMS monitor',
    description: 'Run the 120-minute planner, guided activity, rubric, evidence, and student observations.',
    path: '/worker/student-observations',
  },
  {
    letter: 'B',
    title: 'Child profile',
    description: 'Review longitudinal progress, domain profile, and peer comparison.',
    path: '/worker/progress-tracking',
  },
  {
    letter: 'C',
    title: 'AI dashboard',
    description: 'Use green, yellow, red class indicators and targeted actions.',
    path: '/worker/ai-dashboard',
  },
  {
    letter: 'D',
    title: 'Offline sync',
    description: 'Track local records, conflicts, retries, and periodic sync.',
    path: '/worker/offline-sync',
  },
];

export function WorkerDashboard() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [attendanceView, setAttendanceView] = useState<'weekly' | 'monthly'>('weekly');

  const { currentAWC, centerChildren } = getWorkerContext();
  const workerAlerts = getWorkerAlerts();

  const avgAttendance = average(centerChildren.map((child) => child.attendanceRate));

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

  const immunizationCoverageData = dashboardHealthSnapshot.immunizationBar;

  return (
    <div className="space-y-8 pb-10 animate-fade-in">
      {/* Hero Section */}
      <section className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm">
        <div className="bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.24),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(56,189,248,0.22),_transparent_32%),linear-gradient(135deg,rgba(255,255,255,0.92),rgba(255,255,255,0.7))] dark:bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.16),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(56,189,248,0.14),_transparent_32%),linear-gradient(135deg,rgba(15,23,42,0.92),rgba(15,23,42,0.72))] p-6 md:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                {currentAWC.name}
              </h2>
              <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin size={16} />
                {currentAWC.location}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                  onClick={() => navigate('/worker/attendance')}
                  className="flex items-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <CalendarCheck2 size={18} />
                  {t('dashboard.actions.mark_attendance')}
                </button>
                <button onClick={() => navigate('/worker/student-observations')} className="rounded-2xl border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground hover:bg-accent transition-colors">
                  {t('dashboard.hero.btn_learning')}
                </button>
            </div>
          </div>
        </div>
      </section>

      <FunctionalScopeFlow
        title="AWW daily flow"
        subtitle="Start from child response capture, move into profile review, intervention, prediction, and sync."
        items={workerScopeFlow}
      />

      {/* Stats Overview */}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: t('dashboard.stats.enrolled'),
            value: centerChildren.length,
            icon: Users,
            tone: 'sky',
            meta: `${currentAWC.presentToday} present today`,
          },
          {
            label: 'ECCE Activity Repository',
            value: lmsCoverageSummary.activities,
            icon: BookOpen,
            tone: 'emerald',
            meta: `${lmsCoverageSummary.domains} domains mapped`,
            action: '/worker/student-observations',
          },
          {
            label: 'Daily Planner',
            value: `${lmsCoverageSummary.plannerMinutes}m`,
            icon: Stars,
            tone: 'violet',
            meta: `${lmsCoverageSummary.rubricLevels} observation rubric levels`,
            action: '/worker/student-observations',
          },
          {
            label: 'Classroom Attendance',
            value: `${avgAttendance}%`,
            icon: Activity,
            tone: 'amber',
            meta: attendanceView === 'weekly' ? 'Tracking this week' : 'Tracking month-wise',
          },
          {
            label: 'Critical Alerts',
            value: workerAlerts.length,
            icon: AlertCircle,
            tone: 'red',
            meta: workerAlerts.length > 0 ? 'Tap to review alerts' : 'No urgent alerts',
            action: '/worker/alerts',
          },
          {
            label: 'Fully Immunized',
            value: dashboardHealthSnapshot.fullyImmunized,
            icon: ShieldCheck,
            tone: 'emerald',
            meta: 'Completed tracked vaccines',
            action: '/worker/immunization',
          },
          {
            label: 'Attendance %',
            value: `${dashboardHealthSnapshot.attendancePercent}%`,
            icon: BarChart3,
            tone: 'sky',
            meta: 'Latest monthly average',
            action: '/worker/attendance',
          },
        ].map((card, index) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
            className={cn(
              'group relative overflow-hidden rounded-[1.9rem] border p-5 shadow-sm transition-all duration-300',
              card.tone === 'sky' && 'border-sky-200/80 bg-[linear-gradient(145deg,rgba(240,249,255,0.98),rgba(224,242,254,0.75))] dark:border-sky-900 dark:bg-[linear-gradient(145deg,rgba(12,74,110,0.35),rgba(2,132,199,0.12))]',
              card.tone === 'emerald' && 'border-emerald-200/80 bg-[linear-gradient(145deg,rgba(236,253,245,0.98),rgba(209,250,229,0.72))] dark:border-emerald-900 dark:bg-[linear-gradient(145deg,rgba(6,78,59,0.35),rgba(16,185,129,0.12))]',
              card.tone === 'amber' && 'border-amber-200/80 bg-[linear-gradient(145deg,rgba(255,251,235,0.98),rgba(254,243,199,0.74))] dark:border-amber-900 dark:bg-[linear-gradient(145deg,rgba(120,53,15,0.35),rgba(245,158,11,0.12))]',
              card.tone === 'violet' && 'border-violet-200/80 bg-[linear-gradient(145deg,rgba(245,243,255,0.98),rgba(237,233,254,0.72))] dark:border-violet-900 dark:bg-[linear-gradient(145deg,rgba(76,29,149,0.35),rgba(139,92,246,0.12))]',
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
                card.tone === 'violet' && 'bg-violet-300/30 dark:bg-violet-400/20',
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
                card.tone === 'violet' && 'border-violet-200 bg-white/80 text-violet-700 dark:border-violet-800 dark:bg-violet-950/40 dark:text-violet-300',
                card.tone === 'red' && 'border-red-200 bg-white/80 text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300',
              )}>
                <card.icon size={20} />
              </div>
            </div>
            {card.action ? (
              <div className="relative mt-5 flex items-center justify-between border-t border-black/5 pt-4 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground dark:border-white/10">
                <span>Open details</span>
                <TrendingUp size={14} className="transition-transform group-hover:translate-x-1" />
              </div>
            ) : (
              <div className="relative mt-5 border-t border-black/5 pt-4 text-xs uppercase tracking-[0.2em] text-muted-foreground dark:border-white/10">
                Live centre snapshot
              </div>
            )}
          </motion.div>
        ))}
      </section>

      {/* Aggregate Charts & Insights */}
      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        {/* Left Column: Learning & Attendance Trends */}
        <div className="space-y-6">
          <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-foreground">{t('dashboard.charts.attendance_trend')}</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  {attendanceView === 'weekly'
                    ? 'Attendance trend for the present week across the centre.'
                    : 'Attendance trend for the present month across the centre.'}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="inline-flex rounded-full border border-border bg-background p-1">
                  <button
                    type="button"
                    onClick={() => setAttendanceView('weekly')}
                    className={cn(
                      'rounded-full px-3 py-1.5 text-xs font-semibold transition-colors',
                      attendanceView === 'weekly'
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    Weekly
                  </button>
                  <button
                    type="button"
                    onClick={() => setAttendanceView('monthly')}
                    className={cn(
                      'rounded-full px-3 py-1.5 text-xs font-semibold transition-colors',
                      attendanceView === 'monthly'
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    Monthly
                  </button>
                </div>
                <Activity className="text-amber-500" size={24} />
              </div>
            </div>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={attendanceTrendData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} />
                  <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '1rem', border: '1px solid hsl(var(--border))' }}
                  />
                  <Line type="monotone" dataKey="rate" stroke="#f59e0b" strokeWidth={4} dot={{ r: 4, fill: '#f59e0b' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Column: AI Insights & Quick Actions */}
        <div className="space-y-6">
          <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-foreground">Immunization Coverage Bar Chart</h3>
                <p className="mt-2 text-sm text-muted-foreground">Dummy vaccine coverage across the centre.</p>
              </div>
              <ShieldCheck className="text-sky-500" size={24} />
            </div>
            <div className="mt-6 h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={immunizationCoverageData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="vaccine" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                  <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="coverage" fill="#38bdf8" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm overflow-hidden relative">
            <div className="pointer-events-none absolute top-0 right-0 p-8 opacity-10" aria-hidden="true">
              <Sparkles size={120} className="text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <Stars className="text-primary" size={20} />
              {t('dashboard.insights.center_alerts')}
            </h3>
            <div className="mt-6 space-y-4">
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900">
                <p className="text-sm font-bold text-amber-800 dark:text-amber-300 flex items-center gap-2">
                  <AlertTriangle size={16} />
                  {t('insights.attendance_warning', { count: 3 })}
                </p>
                <p className="mt-2 text-xs text-amber-700 dark:text-amber-400">
                   {t('dashboard.insights.attendance_drop_msg')}
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900">
                <p className="text-sm font-bold text-red-800 dark:text-red-300 flex items-center gap-2">
                  <Activity size={16} />
                  {t('insights.sam_critical', { count: 1 })}
                </p>
                <p className="mt-2 text-xs text-red-700 dark:text-red-400">
                  {t('dashboard.insights.sam_critical_msg')}
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900">
                <p className="text-sm font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                  <TrendingUp size={16} />
                  Learning Growth Success!
                </p>
                <p className="mt-2 text-xs text-emerald-700 dark:text-emerald-400">
                  92% of the center has completed this month\'s "Family" theme modules.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
