import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  Baby,
  BarChart3,
  BellRing,
  BookOpenCheck,
  CalendarCheck2,
  FileBarChart2,
  HeartPulse,
  Lightbulb,
  Users,
  WifiOff,
} from 'lucide-react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { average, cn } from '../../utils';
import {
  dailyAttendanceSeed,
  developmentByChild,
  getDevelopmentCompletion,
  healthLogsSeed,
  managedChildren,
} from '../../data/childMonitoringData';
import { mockNotifications } from '../../data/mockData';
import { getWorkerAlerts, getWorkerContext } from './workerAlertData';

type DashboardTone = 'emerald' | 'sky' | 'amber' | 'rose' | 'violet' | 'slate';
type PrimaryWorkflow = {
  label: string;
  helper: string;
  path: string;
  icon: typeof Users;
  tone: DashboardTone;
};

const primaryWorkflows = [
  {
    label: 'Mark attendance',
    helper: 'Complete today roster',
    path: '/worker/attendance',
    icon: CalendarCheck2,
    tone: 'emerald',
  },
  {
    label: 'Learning LMS',
    helper: 'Plan, teach, observe',
    path: '/worker/lms',
    icon: BookOpenCheck,
    tone: 'sky',
  },
  {
    label: 'Nutrition forecast',
    helper: 'MAM/SAM watchlist',
    path: '/worker/nutrition-forecast',
    icon: HeartPulse,
    tone: 'rose',
  },
  {
    label: 'Child profiles',
    helper: 'Roster and history',
    path: '/worker/children',
    icon: Users,
    tone: 'violet',
  },
] satisfies PrimaryWorkflow[];

const secondaryWorkflows = [
  { label: 'Growth monitoring', path: '/worker/growth-monitoring', icon: BarChart3, tone: 'emerald' },
  { label: 'Development', path: '/worker/development', icon: Baby, tone: 'violet' },
  { label: 'AI insights', path: '/worker/insights', icon: Lightbulb, tone: 'amber' },
  { label: 'Reports', path: '/worker/reports', icon: FileBarChart2, tone: 'slate' },
  { label: 'Offline sync', path: '/worker/offline-sync', icon: WifiOff, tone: 'amber' },
] satisfies Array<Omit<PrimaryWorkflow, 'helper'>>;

type SecondaryWorkflow = {
  label: string;
  path: string;
  icon: typeof Users;
  tone: DashboardTone;
};

export function WorkerDashboard() {
  const navigate = useNavigate();
  const [trendView, setTrendView] = useState<'week' | 'month'>('week');
  const { currentAWC, currentWorker, centerChildren } = getWorkerContext();
  const alerts = getWorkerAlerts();

  const dashboard = useMemo(() => {
    const presentToday = dailyAttendanceSeed.filter((entry) => entry.present).length;
    const enrolled = managedChildren.length;
    const absentToday = enrolled - presentToday;
    const attendancePercent = enrolled ? Math.round((presentToday / enrolled) * 100) : 0;

    const avgLearning = Math.round(average(centerChildren.map((child) => child.learningScore)));
    const weakLearning = centerChildren.filter((child) => child.learningScore < 60).length;

    const mamChildren = centerChildren.filter((child) => child.nutritionStatus === 'status.mam').length;
    const samChildren = centerChildren.filter((child) => child.nutritionStatus === 'status.sam').length;
    const nutritionRisk = mamChildren + samChildren;

    const developmentRows = managedChildren.map((child) => {
      const checklist = developmentByChild[child.id];
      return {
        child,
        completion: checklist ? getDevelopmentCompletion(checklist) : 0,
      };
    });
    const developmentAverage = Math.round(average(developmentRows.map((row) => row.completion)));
    const developmentSupport = developmentRows.filter((row) => row.completion < 70).length;

    const symptomAlerts = healthLogsSeed.filter((log) => log.fever || log.diarrhea || log.cough || log.hospitalVisit).length;
    const criticalAlerts = alerts.filter((alert) => alert.severity === 'critical').length;
    const unreadNotifications = mockNotifications.filter((notification) => !notification.read).length;
    const syncHealth = currentAWC.syncStatus === 'synced' ? 100 : currentAWC.syncStatus === 'pending' ? 70 : 35;

    return {
      enrolled,
      presentToday,
      absentToday,
      attendancePercent,
      avgLearning,
      weakLearning,
      mamChildren,
      samChildren,
      nutritionRisk,
      developmentAverage,
      developmentSupport,
      symptomAlerts,
      criticalAlerts,
      unreadNotifications,
      syncHealth,
      totalAlerts: alerts.length,
      operationalScore: Math.round((attendancePercent + avgLearning + developmentAverage + syncHealth) / 4),
    };
  }, [alerts, centerChildren, currentAWC.syncStatus]);

  const attendanceTrend = trendView === 'week'
    ? [
        { label: 'Mon', attendance: Math.max(dashboard.attendancePercent - 8, 0), learning: Math.max(dashboard.avgLearning - 4, 0) },
        { label: 'Tue', attendance: Math.max(dashboard.attendancePercent - 3, 0), learning: Math.max(dashboard.avgLearning - 2, 0) },
        { label: 'Wed', attendance: dashboard.attendancePercent, learning: dashboard.avgLearning },
        { label: 'Thu', attendance: Math.min(dashboard.attendancePercent + 2, 100), learning: Math.min(dashboard.avgLearning + 1, 100) },
        { label: 'Fri', attendance: Math.min(dashboard.attendancePercent + 4, 100), learning: Math.min(dashboard.avgLearning + 3, 100) },
        { label: 'Sat', attendance: Math.max(dashboard.attendancePercent - 2, 0), learning: Math.min(dashboard.avgLearning + 2, 100) },
      ]
    : [
        { label: 'Jan', attendance: Math.max(dashboard.attendancePercent - 12, 0), learning: Math.max(dashboard.avgLearning - 8, 0) },
        { label: 'Feb', attendance: Math.max(dashboard.attendancePercent - 8, 0), learning: Math.max(dashboard.avgLearning - 6, 0) },
        { label: 'Mar', attendance: Math.max(dashboard.attendancePercent - 5, 0), learning: Math.max(dashboard.avgLearning - 3, 0) },
        { label: 'Apr', attendance: Math.max(dashboard.attendancePercent - 2, 0), learning: dashboard.avgLearning },
        { label: 'May', attendance: Math.min(dashboard.attendancePercent + 1, 100), learning: Math.min(dashboard.avgLearning + 2, 100) },
        { label: 'Jun', attendance: dashboard.attendancePercent, learning: dashboard.avgLearning },
      ];

  const notifications = [
    ...mockNotifications.map((notification) => ({
      id: notification.id,
      title: formatNotificationTitle(notification.title),
      message: formatNotificationMessage(notification.message),
      meta: formatNotificationTime(notification.time),
      read: notification.read,
      tone: notification.type === 'warning' ? 'amber' as const : notification.type === 'action' ? 'rose' as const : 'sky' as const,
    })),
    ...alerts.slice(0, 2).map((alert) => ({
      id: alert.id,
      title: alert.title,
      message: alert.description,
      meta: alert.severity === 'critical' ? 'Critical alert' : 'Worker action',
      read: false,
      tone: alert.severity === 'critical' ? 'rose' as const : 'amber' as const,
    })),
  ].slice(0, 5);

  return (
    <div className="mx-auto max-w-[1500px] space-y-6 pb-10 animate-fade-in">
      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Worker dashboard</p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground md:text-3xl">{currentAWC.name}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {currentWorker.name} · {currentAWC.location} · Last sync {formatRelativeSync(currentAWC.lastSyncTime)}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 rounded-xl border border-border bg-background p-3 text-center">
            <SummaryNumber label="Score" value={`${dashboard.operationalScore}%`} />
            <SummaryNumber label="Alerts" value={dashboard.totalAlerts} />
            <SummaryNumber label="Sync" value={`${dashboard.syncHealth}%`} />
          </div>
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        <KpiCard
          label="Attendance today"
          value={`${dashboard.attendancePercent}%`}
          helper={`${dashboard.presentToday}/${dashboard.enrolled} present`}
          icon={CalendarCheck2}
          tone={dashboard.attendancePercent >= 85 ? 'emerald' : 'amber'}
          path="/worker/attendance"
          onClick={navigate}
        />
        <KpiCard
          label="Children enrolled"
          value={dashboard.enrolled}
          helper={`${dashboard.absentToday} absent today`}
          icon={Users}
          tone="sky"
          path="/worker/children"
          onClick={navigate}
        />
        <KpiCard
          label="Learning average"
          value={`${dashboard.avgLearning}%`}
          helper={`${dashboard.weakLearning} need support`}
          icon={BookOpenCheck}
          tone={dashboard.avgLearning >= 70 ? 'emerald' : 'amber'}
          path="/worker/progress-tracking"
          onClick={navigate}
        />
        <KpiCard
          label="Nutrition risk"
          value={dashboard.nutritionRisk}
          helper={`${dashboard.samChildren} SAM · ${dashboard.mamChildren} MAM`}
          icon={HeartPulse}
          tone={dashboard.samChildren > 0 ? 'rose' : dashboard.mamChildren > 0 ? 'amber' : 'emerald'}
          path="/worker/nutrition-forecast"
          onClick={navigate}
        />
        <KpiCard
          label="Critical actions"
          value={dashboard.criticalAlerts + dashboard.symptomAlerts}
          helper={`${dashboard.criticalAlerts} alerts · ${dashboard.symptomAlerts} health flags`}
          icon={AlertTriangle}
          tone={dashboard.criticalAlerts + dashboard.symptomAlerts > 0 ? 'rose' : 'emerald'}
          path="/worker/alerts"
          onClick={navigate}
        />
      </section>

      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Operations pulse</p>
            <h2 className="mt-1 text-lg font-semibold text-foreground">Trend and notifications</h2>
            <p className="mt-1 text-sm text-muted-foreground">Attendance, learning, and new centre updates in one working row.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-3 text-xs font-medium text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-sky-500" /> Attendance</span>
              <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Learning</span>
            </div>
            <div className="inline-flex w-fit rounded-lg border border-border bg-background p-1">
              {[
                { label: 'Week', value: 'week' as const },
                { label: 'Month', value: 'month' as const },
              ].map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setTrendView(item.value)}
                  className={cn(
                    'rounded-md px-3 py-1.5 text-xs font-semibold transition-colors',
                    trendView === item.value ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
          <div className="min-w-0 rounded-xl border border-border bg-background/50 p-4">
            <div className="h-[320px] min-h-[320px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={attendanceTrend} margin={{ left: -10, right: 18, top: 12, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                  <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 10 }} />
                  <Line type="monotone" dataKey="attendance" stroke="#0284c7" strokeWidth={3} dot={{ r: 4, fill: '#0284c7', strokeWidth: 0 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="learning" stroke="#059669" strokeWidth={3} dot={{ r: 4, fill: '#059669', strokeWidth: 0 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="min-w-0 rounded-xl border border-border bg-background/50 p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-sm font-semibold text-foreground">Notifications</h3>
                <p className="mt-1 text-xs text-muted-foreground">{dashboard.unreadNotifications} unread updates plus live alerts</p>
              </div>
              <button
                type="button"
                onClick={() => navigate('/worker/alerts')}
                className="rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground hover:bg-accent"
              >
                View alerts
              </button>
            </div>
            <div className="mt-4 divide-y divide-border">
              {notifications.map((notification) => (
                <NotificationItem key={notification.id} {...notification} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground">Primary workflows</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {primaryWorkflows.map((item) => (
              <WorkflowCard key={item.path} {...item} onClick={navigate} />
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground">Supporting registers</h2>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {secondaryWorkflows.map((item) => (
              <SecondaryLink key={item.path} {...item} onClick={navigate} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function SummaryNumber({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="min-w-20">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">{label}</p>
      <p className="mt-1 text-xl font-bold text-foreground">{value}</p>
    </div>
  );
}

function KpiCard({
  label,
  value,
  helper,
  icon: Icon,
  tone,
  path,
  onClick,
}: {
  label: string;
  value: string | number;
  helper: string;
  icon: typeof Users;
  tone: DashboardTone;
  path: string;
  onClick: (path: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onClick(path)}
      className="group rounded-xl border border-border bg-card p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">{label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-foreground">{value}</p>
        </div>
        <span className={cn('rounded-lg p-2', toneClasses(tone))}>
          <Icon size={18} />
        </span>
      </div>
      <div className="mt-3 flex items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">{helper}</p>
        <ArrowRight size={14} className="shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1" />
      </div>
    </button>
  );
}

function NotificationItem({
  title,
  message,
  meta,
  read,
  tone,
}: {
  title: string;
  message: string;
  meta: string;
  read: boolean;
  tone: DashboardTone;
}) {
  return (
    <div className="py-3 first:pt-0 last:pb-0">
      <div className="flex gap-3">
        <div className="flex flex-col items-center">
          <span className={cn(
            'mt-1 h-2.5 w-2.5 rounded-full',
            tone === 'rose' && 'bg-rose-500',
            tone === 'amber' && 'bg-amber-500',
            tone === 'sky' && 'bg-sky-500',
            tone === 'emerald' && 'bg-emerald-500',
            tone === 'violet' && 'bg-violet-500',
            tone === 'slate' && 'bg-slate-500'
          )} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-foreground">{title}</p>
            {!read && <span className="rounded-full bg-foreground px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-background">New</span>}
          </div>
          <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">{message}</p>
          <div className="mt-2 flex items-center gap-2 text-[11px] font-medium text-muted-foreground">
            <BellRing size={12} />
            <span>{meta}</span>
            <span className={cn(
              'rounded-full px-2 py-0.5',
              tone === 'rose' && 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300',
              tone === 'amber' && 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
              tone === 'sky' && 'bg-sky-100 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300',
              tone === 'emerald' && 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
              tone === 'violet' && 'bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300',
              tone === 'slate' && 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
            )}>
              {read ? 'Read' : 'Unread'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function WorkflowCard({
  label,
  helper,
  path,
  icon: Icon,
  tone,
  onClick,
}: {
  label: string;
  helper: string;
  path: string;
  icon: typeof Users;
  tone: DashboardTone;
  onClick: (path: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onClick(path)}
      className="group min-h-28 rounded-xl border border-border bg-background/70 p-4 text-left transition-all hover:-translate-y-0.5 hover:bg-accent hover:shadow-sm"
    >
      <span className={cn('inline-flex rounded-lg p-2', toneClasses(tone))}>
        <Icon size={18} />
      </span>
      <p className="mt-3 font-semibold text-foreground">{label}</p>
      <div className="mt-1 flex items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">{helper}</p>
        <ArrowRight size={14} className="text-muted-foreground transition-transform group-hover:translate-x-1" />
      </div>
    </button>
  );
}

function SecondaryLink({
  label,
  path,
  icon: Icon,
  tone,
  onClick,
}: SecondaryWorkflow & {
  onClick: (path: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onClick(path)}
      className="group flex min-h-11 items-center gap-3 rounded-lg border border-border bg-background/70 px-3 py-2 text-left transition-colors hover:bg-accent"
    >
      <span className={cn('rounded-md p-1.5', toneClasses(tone))}>
        <Icon size={15} />
      </span>
      <span className="min-w-0 flex-1 truncate text-sm font-semibold text-foreground">{label}</span>
      <ArrowRight size={13} className="shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1" />
    </button>
  );
}

function toneClasses(tone: DashboardTone) {
  if (tone === 'emerald') return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300';
  if (tone === 'sky') return 'bg-sky-100 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300';
  if (tone === 'amber') return 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300';
  if (tone === 'rose') return 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300';
  if (tone === 'violet') return 'bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300';
  return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
}

function formatRelativeSync(lastSyncTime: string) {
  const diffMs = Date.now() - new Date(lastSyncTime).getTime();
  const diffMinutes = Math.max(Math.round(diffMs / 60000), 0);

  if (diffMinutes < 1) return 'just now';
  if (diffMinutes < 60) return `${diffMinutes} min ago`;

  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} hr ago`;

  const diffDays = Math.round(diffHours / 24);
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
}

function formatNotificationTitle(title: string) {
  const titles: Record<string, string> = {
    'data.notification.growth_audit.title': 'Growth audit due',
    'data.notification.policy_update.title': 'Policy update',
    'status.warning': 'Attendance warning',
  };

  return titles[title] ?? title;
}

function formatNotificationMessage(message: string) {
  const messages: Record<string, string> = {
    'data.notification.growth_audit.msg': 'Monthly growth measurements need review before the next report is generated.',
    'data.notification.policy_update.msg': 'A new guidance note is available for the worker training and reporting workflow.',
  };

  return messages[message] ?? message;
}

function formatNotificationTime(time?: string) {
  const times: Record<string, string> = {
    'status.hr_ago': 'Recently',
    'status.day_ago': 'Yesterday',
  };

  return time ? times[time] ?? time : 'Latest update';
}
