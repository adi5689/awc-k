import { Fragment, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  CalendarDays,
  ChevronDown,
  CheckCircle2,
  Search,
  ShieldAlert,
  TrendingUp,
  Users,
} from 'lucide-react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { cn } from '../../utils';
import { getWorkerContext } from './workerAlertData';

type NutritionBand = 'Healthy' | 'MAM' | 'SAM';

type ForecastPoint = {
  month: string;
  muac: number;
  weight: number;
  height: number;
  band: NutritionBand;
  projected: boolean;
};

type ChildForecast = {
  id: string;
  name: string;
  parentName: string;
  ageMonths: number;
  gender: string;
  attendanceRate: number;
  current: ForecastPoint;
  nextMonth: ForecastPoint;
  secondMonth: ForecastPoint;
  warning: string;
  priority: 'critical' | 'watch' | 'stable';
  trend: number;
  confidence: number;
  chart: ForecastPoint[];
  historyChart: ForecastPoint[];
};

function normalizeBand(status: string, muac: number): NutritionBand {
  const text = status.toLowerCase();
  if (text.includes('sam') || muac < 115) return 'SAM';
  if (text.includes('mam') || muac < 125) return 'MAM';
  return 'Healthy';
}

function bandFromMuac(muac: number): NutritionBand {
  if (muac < 115) return 'SAM';
  if (muac < 125) return 'MAM';
  return 'Healthy';
}

function bandClasses(band: NutritionBand) {
  if (band === 'SAM') return 'border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950/35 dark:text-red-200';
  if (band === 'MAM') return 'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950/35 dark:text-amber-200';
  return 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/35 dark:text-emerald-200';
}

function bandSurfaceClasses(band: NutritionBand) {
  if (band === 'SAM') return 'border-red-200 bg-red-50/80 dark:border-red-900/70 dark:bg-red-950/20';
  if (band === 'MAM') return 'border-amber-200 bg-amber-50/80 dark:border-amber-900/70 dark:bg-amber-950/20';
  return 'border-emerald-200 bg-emerald-50/80 dark:border-emerald-900/70 dark:bg-emerald-950/20';
}

function bandMarkerClasses(band: NutritionBand) {
  if (band === 'SAM') return 'bg-red-500';
  if (band === 'MAM') return 'bg-amber-500';
  return 'bg-emerald-500';
}

function warningFor(secondMonth: NutritionBand, nextMonth: NutritionBand, trend: number) {
  if (secondMonth === 'SAM') return 'Likely SAM within 2 months. Escalate referral and weekly follow-up.';
  if (nextMonth === 'SAM') return 'SAM risk next month. Verify MUAC and start urgent nutrition action.';
  if (secondMonth === 'MAM') return trend < 0 ? 'May slip into MAM. Home visit and THR consumption check needed.' : 'MAM likely. Continue counselling and monitor improvement.';
  return trend < -1 ? 'Healthy now, but MUAC is falling. Keep on watch list.' : 'Healthy trajectory. Routine monthly monitoring.';
}

function fullMonthLabel(date: string) {
  return new Date(date).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
}

function monthLabel(date: string) {
  return new Date(date).toLocaleDateString('en-IN', { month: 'short' });
}

function addMonthsLabel(date: string, months: number) {
  const next = new Date(date);
  next.setMonth(next.getMonth() + months);
  return next.toLocaleDateString('en-IN', { month: 'short' });
}

function buildForecasts(selectedMonthIndex: number): ChildForecast[] {
  const { centerChildren } = getWorkerContext();

  return centerChildren.map((child) => {
    const selectedEntry = child.nutritionHistory[selectedMonthIndex] ?? child.nutritionHistory.at(-1);
    const selectedIndex = Math.max(0, child.nutritionHistory.findIndex((entry) => entry.date === selectedEntry?.date));
    const recordedWindow = child.nutritionHistory.slice(0, selectedIndex + 1);
    const history = recordedWindow.slice(-3);
    const fallback = history.at(-1) ?? { date: '2026-06-01', weight: 12, height: 88, muac: 130, status: 'Normal' };
    const latest = history.at(-1) ?? fallback;
    const previous = history.at(-2);
    const first = history.at(0) ?? latest;
    const rawTrend = previous ? latest.muac - previous.muac : latest.muac - first.muac;
    const riskDrag = child.attendanceRate < 75 ? -1.4 : child.attendanceRate < 85 ? -0.7 : 0;
    const projectedTrend = Math.max(-4, Math.min(2.5, rawTrend + riskDrag));
    const weightTrend = previous ? Number((latest.weight - previous.weight).toFixed(1)) : 0.2;

    const historicalPoints = history.map((entry, index) => ({
      month: monthLabel(entry.date),
      muac: entry.muac,
      weight: entry.weight,
      height: entry.height,
      band: normalizeBand(entry.status, entry.muac),
      projected: false,
    }));

    const current: ForecastPoint = {
      month: monthLabel(latest.date),
      muac: latest.muac,
      weight: latest.weight,
      height: latest.height,
      band: normalizeBand(String(latest.status), latest.muac),
      projected: false,
    };
    const nextMonth: ForecastPoint = {
      month: addMonthsLabel(latest.date, 1),
      muac: Math.round(latest.muac + projectedTrend),
      weight: Number((latest.weight + weightTrend).toFixed(1)),
      height: Number((latest.height + 0.8).toFixed(1)),
      band: bandFromMuac(Math.round(latest.muac + projectedTrend)),
      projected: true,
    };
    const secondMonth: ForecastPoint = {
      month: addMonthsLabel(latest.date, 2),
      muac: Math.round(latest.muac + projectedTrend * 2),
      weight: Number((latest.weight + weightTrend * 2).toFixed(1)),
      height: Number((latest.height + 1.6).toFixed(1)),
      band: bandFromMuac(Math.round(latest.muac + projectedTrend * 2)),
      projected: true,
    };

    const priority: ChildForecast['priority'] = secondMonth.band === 'SAM' || nextMonth.band === 'SAM'
      ? 'critical'
      : secondMonth.band === 'MAM' || nextMonth.band === 'MAM'
        ? 'watch'
        : 'stable';

    const dedupedHistory = historicalPoints.filter((point) => point.month !== current.month);
    const fullHistory = recordedWindow.slice(-6).map((entry) => ({
      month: monthLabel(entry.date),
      muac: entry.muac,
      weight: entry.weight,
      height: entry.height,
      band: normalizeBand(entry.status, entry.muac),
      projected: false,
    }));

    return {
      id: child.id,
      name: child.name,
      parentName: child.parentName,
      ageMonths: child.ageMonths,
      gender: child.gender,
      attendanceRate: child.attendanceRate,
      current,
      nextMonth,
      secondMonth,
      warning: warningFor(secondMonth.band, nextMonth.band, projectedTrend),
      priority,
      trend: Number(projectedTrend.toFixed(1)),
      confidence: Math.min(95, Math.max(68, 86 - Math.abs(projectedTrend) * 3 + (history.length >= 3 ? 6 : 0))),
      chart: [...dedupedHistory, current, nextMonth, secondMonth],
      historyChart: [...fullHistory.filter((point) => point.month !== current.month), current, nextMonth, secondMonth],
    };
  }).sort((a, b) => {
    const rank: Record<ChildForecast['priority'], number> = { critical: 0, watch: 1, stable: 2 };
    return rank[a.priority] - rank[b.priority] || a.secondMonth.muac - b.secondMonth.muac;
  });
}

export function WorkerNutritionForecast() {
  const navigate = useNavigate();
  const { currentAWC } = getWorkerContext();
  const [search, setSearch] = useState('');
  const monthUploads = useMemo(() => {
    const { centerChildren } = getWorkerContext();
    const baseHistory = centerChildren[0]?.nutritionHistory ?? [];
    return baseHistory.map((entry, index) => ({
      index,
      date: entry.date,
      label: fullMonthLabel(entry.date),
      fileName: `poshan-${new Date(entry.date).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }).replace(/\s/g, '-').toLowerCase()}-upload.xlsx`,
      uploadedBy: 'District Admin',
      uploadedOn: new Date(entry.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    }));
  }, []);
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(() => Math.max(0, monthUploads.length - 1));
  const selectedUpload = monthUploads[selectedMonthIndex] ?? monthUploads.at(-1);
  const forecasts = useMemo(() => buildForecasts(selectedMonthIndex), [selectedMonthIndex]);
  const [expandedId, setExpandedId] = useState<string | null>(forecasts[0]?.id ?? null);

  const filteredForecasts = forecasts.filter((item) => {
    const query = search.trim().toLowerCase();
    return !query || [item.name, item.parentName, item.current.band, item.secondMonth.band].some((value) => value.toLowerCase().includes(query));
  });

  const summary = {
    total: forecasts.length,
    critical: forecasts.filter((item) => item.priority === 'critical').length,
    watch: forecasts.filter((item) => item.priority === 'watch').length,
    healthy: forecasts.filter((item) => item.secondMonth.band === 'Healthy').length,
  };

  const selectedMonthLabel = selectedUpload?.label ?? forecasts[0]?.current.month ?? 'Current';
  const nextMonthLabel = forecasts[0]?.nextMonth.month ?? 'Next';
  const secondMonthLabel = forecasts[0]?.secondMonth.month ?? 'Second';

  const toggleChildHistory = (childId: string) => {
    setExpandedId((current) => (current === childId ? null : childId));
  };

  return (
    <div className="space-y-7 pb-10 animate-fade-in">
      <section className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm">
        <div className="bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.18),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(245,158,11,0.14),_transparent_32%),linear-gradient(135deg,rgba(255,255,255,0.96),rgba(240,253,244,0.86))] p-6 dark:bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.16),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(245,158,11,0.12),_transparent_32%),linear-gradient(135deg,rgba(15,23,42,0.94),rgba(2,6,23,0.86))] md:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-3 py-1 text-xs font-black uppercase tracking-[0.22em] text-emerald-700 shadow-sm dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
                <CalendarDays size={14} />
                {selectedUpload?.label ?? 'Monthly'} nutrition forecast
              </p>
              <h2 className="mt-4 text-3xl font-black tracking-tight text-foreground md:text-4xl">{currentAWC.name}</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                Month-wise student nutrition ledger from the admin Excel upload, shown in the same format with two-month predictive warning for SAM, MAM, or healthy status.
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/worker/children')}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-border bg-card px-5 text-sm font-bold text-foreground shadow-sm transition hover:bg-accent"
            >
              <Users size={18} />
              Open children
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        <Metric icon={Users} label="Students in centre" value={summary.total} tone="sky" />
        <Metric icon={ShieldAlert} label="SAM warning" value={summary.critical} tone="red" />
        <Metric icon={AlertTriangle} label="MAM watch" value={summary.watch} tone="amber" />
        <Metric icon={CheckCircle2} label={`Healthy in ${secondMonthLabel}`} value={summary.healthy} tone="emerald" />
      </section>

      <section className="rounded-[1.75rem] border border-border bg-card p-5 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-muted-foreground">Admin monthly Excel uploads</p>
            <h3 className="mt-1 text-xl font-black text-foreground">Month-wise tracking</h3>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
              Each month reflects the uploaded nutrition sheet. Select a month to view the same child-wise ledger, forecast cards, trend chart, and warning logic for that upload cycle.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-background/70 px-4 py-3 text-sm">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-muted-foreground">Selected file</p>
            <p className="mt-1 font-black text-foreground">{selectedUpload?.fileName ?? 'No upload selected'}</p>
            <p className="mt-1 text-xs font-semibold text-muted-foreground">{selectedUpload?.uploadedBy} - {selectedUpload?.uploadedOn}</p>
          </div>
        </div>

        <div className="mt-5 max-w-md">
          <p className="mb-2 text-xs font-black uppercase tracking-[0.16em] text-muted-foreground">Choose month</p>
          <Select
            value={String(selectedMonthIndex)}
            onValueChange={(value) => {
              setSelectedMonthIndex(Number(value));
              setExpandedId(null);
            }}
          >
            <SelectTrigger className="h-14 rounded-2xl border-border bg-background/70 px-4 text-left text-sm font-semibold shadow-sm">
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent>
              {monthUploads.map((upload) => (
                <SelectItem key={upload.date} value={String(upload.index)} className="py-3">
                  {upload.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </section>

      <section className="rounded-[1.75rem] border border-border bg-card p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-muted-foreground">{selectedMonthLabel} student ledger</p>
            <h3 className="mt-1 text-xl font-black text-foreground">Nutrition details and 2-month warning</h3>
          </div>
          <div className="relative w-full max-w-md">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search child, parent, status..."
              className="h-12 w-full rounded-2xl border border-input bg-background pl-12 pr-4 text-sm font-semibold text-foreground outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
        </div>

        <div className="mt-5 overflow-x-auto rounded-2xl border border-border">
          <table className="min-w-[1120px] w-full text-left text-sm">
            <thead className="bg-muted/40 text-xs font-black uppercase tracking-[0.12em] text-muted-foreground">
              <tr>
                <th className="px-4 py-4">Student</th>
                <th className="px-4 py-4">Age</th>
                <th className="px-4 py-4">{selectedMonthLabel} Wt</th>
                <th className="px-4 py-4">{selectedMonthLabel} Ht</th>
                <th className="px-4 py-4">{selectedMonthLabel} MUAC</th>
                <th className="px-4 py-4">Current</th>
                <th className="px-4 py-4">{nextMonthLabel}</th>
                <th className="px-4 py-4">{secondMonthLabel}</th>
                <th className="px-4 py-4">Warning</th>
                <th className="px-4 py-4">Confidence</th>
              </tr>
            </thead>
            <tbody>
              {filteredForecasts.map((item) => {
                const expanded = expandedId === item.id;
                const muacChange = item.secondMonth.muac - item.current.muac;
                const weightChange = Number((item.secondMonth.weight - item.current.weight).toFixed(1));
                const heightChange = Number((item.secondMonth.height - item.current.height).toFixed(1));

                return (
                  <Fragment key={item.id}>
                    <tr
                      onClick={() => toggleChildHistory(item.id)}
                      className={cn(
                        'cursor-pointer border-t border-border transition-colors hover:bg-accent/60',
                        expanded && 'bg-emerald-50/80 dark:bg-emerald-950/25'
                      )}
                    >
                      <td className="px-4 py-4">
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            toggleChildHistory(item.id);
                          }}
                          className="inline-flex items-center gap-2 text-left font-black text-emerald-700 underline-offset-4 transition hover:text-emerald-600 hover:underline dark:text-emerald-300 dark:hover:text-emerald-200"
                          aria-expanded={expanded}
                          aria-controls={`nutrition-history-${item.id}`}
                        >
                          <ChevronDown className={cn('h-4 w-4 transition-transform', expanded && 'rotate-180')} />
                          {item.name}
                        </button>
                        <p className="mt-1 text-xs font-semibold text-muted-foreground">{item.parentName} - Attendance {item.attendanceRate}%</p>
                      </td>
                      <td className="px-4 py-4 font-semibold text-foreground">{item.ageMonths} mo</td>
                      <td className="px-4 py-4 font-semibold text-foreground">{item.current.weight} kg</td>
                      <td className="px-4 py-4 font-semibold text-foreground">{item.current.height} cm</td>
                      <td className="px-4 py-4 font-semibold text-foreground">{item.current.muac} mm</td>
                      <td className="px-4 py-4"><BandPill band={item.current.band} /></td>
                      <td className="px-4 py-4">
                        <div className="space-y-1">
                          <BandPill band={item.nextMonth.band} />
                          <p className="text-xs font-semibold leading-5 text-muted-foreground">
                            {item.nextMonth.weight} kg, {item.nextMonth.height} cm, {item.nextMonth.muac} mm
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="space-y-1">
                          <BandPill band={item.secondMonth.band} />
                          <p className="text-xs font-semibold leading-5 text-muted-foreground">
                            {item.secondMonth.weight} kg, {item.secondMonth.height} cm, {item.secondMonth.muac} mm
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <p className={cn(
                          'max-w-sm text-sm font-semibold leading-6',
                          item.priority === 'critical' && 'text-red-600 dark:text-red-300',
                          item.priority === 'watch' && 'text-amber-600 dark:text-amber-300',
                          item.priority === 'stable' && 'text-emerald-600 dark:text-emerald-300'
                        )}>
                          {item.warning}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">MUAC trend {item.trend >= 0 ? '+' : ''}{item.trend} mm/month</p>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <TrendingUp size={16} className="text-muted-foreground" />
                          <span className="font-black text-foreground">{Math.round(item.confidence)}%</span>
                        </div>
                      </td>
                    </tr>

                    {expanded && (
                      <tr className="border-t border-emerald-200/80 bg-muted/25 dark:border-emerald-900/50">
                        <td colSpan={10} className="p-0">
                          <div
                            id={`nutrition-history-${item.id}`}
                            className="grid border-l-4 border-emerald-500 bg-card xl:grid-cols-[280px_minmax(0,1fr)]"
                          >
                            <aside className="border-b border-border bg-muted/30 p-5 xl:border-b-0 xl:border-r">
                              <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-300">Expanded forecast</p>
                              <h4 className="mt-2 text-xl font-black text-foreground">{item.name}</h4>
                              <p className="mt-1 text-xs font-semibold text-muted-foreground">{item.parentName} - {item.ageMonths} months - Attendance {item.attendanceRate}%</p>

                              <div className={cn('mt-5 rounded-2xl border p-4', bandSurfaceClasses(item.secondMonth.band))}>
                                <div className="flex items-center justify-between gap-3">
                                  <p className="text-xs font-black uppercase tracking-[0.16em] text-muted-foreground">{secondMonthLabel} status</p>
                                  <BandPill band={item.secondMonth.band} />
                                </div>
                                <div className="mt-4 space-y-3 text-sm">
                                  <div className="flex items-center justify-between gap-3">
                                    <span className="font-semibold text-muted-foreground">MUAC change</span>
                                    <span className={cn('font-black', muacChange < 0 ? 'text-red-600 dark:text-red-300' : 'text-emerald-600 dark:text-emerald-300')}>
                                      {muacChange >= 0 ? '+' : ''}{muacChange} mm
                                    </span>
                                  </div>
                                  <div className="flex items-center justify-between gap-3">
                                    <span className="font-semibold text-muted-foreground">Weight change</span>
                                    <span className="font-black text-foreground">{weightChange >= 0 ? '+' : ''}{weightChange} kg</span>
                                  </div>
                                  <div className="flex items-center justify-between gap-3">
                                    <span className="font-semibold text-muted-foreground">Height change</span>
                                    <span className="font-black text-foreground">+{heightChange} cm</span>
                                  </div>
                                  <div className="flex items-center justify-between gap-3">
                                    <span className="font-semibold text-muted-foreground">Confidence</span>
                                    <span className="font-black text-foreground">{Math.round(item.confidence)}%</span>
                                  </div>
                                </div>
                              </div>

                              <div className={cn(
                                'mt-4 rounded-2xl border px-4 py-3 text-sm font-semibold leading-6',
                                item.priority === 'critical' && 'border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/25 dark:text-red-200',
                                item.priority === 'watch' && 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/25 dark:text-amber-200',
                                item.priority === 'stable' && 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/25 dark:text-emerald-200'
                              )}>
                                {item.warning}
                              </div>
                            </aside>

                            <div className="p-5">
                              <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                                <div>
                                  <h5 className="text-base font-black text-foreground">Forecast cards</h5>
                                  <p className="mt-1 text-xs font-semibold text-muted-foreground">Current and projected nutrition status by month.</p>
                                </div>
                                <NutritionLegend />
                              </div>

                              <div className="grid auto-rows-fr gap-3 md:grid-cols-3">
                                <TimelineMonth label="Current" marker="Recorded" point={item.current} />
                                <TimelineMonth label="Next month" marker="Projected" point={item.nextMonth} />
                                <TimelineMonth label="Two months" marker="Projected" point={item.secondMonth} />
                              </div>

                              <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
                                <div className="rounded-2xl border border-border bg-background/65 p-4">
                                  <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                      <h5 className="text-base font-black text-foreground">Trend chart</h5>
                                      <p className="mt-1 text-xs font-semibold text-muted-foreground">MUAC, weight, and height across recorded and projected months.</p>
                                    </div>
                                    <div className="flex flex-wrap gap-2 text-[11px] font-black uppercase tracking-[0.12em] text-muted-foreground">
                                      <span>Recorded</span>
                                      <span className="text-sky-600 dark:text-sky-300">Projected</span>
                                    </div>
                                  </div>
                                  <div className="h-[300px]">
                                  <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={item.historyChart} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
                                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                                      <XAxis dataKey="month" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} axisLine={false} tickLine={false} />
                                      <YAxis yAxisId="growth" domain={['dataMin - 6', 'dataMax + 6']} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} axisLine={false} tickLine={false} />
                                      <YAxis yAxisId="height" orientation="right" domain={['dataMin - 2', 'dataMax + 2']} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} axisLine={false} tickLine={false} />
                                      <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px' }} />
                                      <Legend />
                                      <ReferenceLine yAxisId="growth" y={125} stroke="#f59e0b" strokeDasharray="5 5" label={{ value: 'MAM', fill: '#d97706', fontSize: 11, position: 'insideTopLeft' }} />
                                      <ReferenceLine yAxisId="growth" y={115} stroke="#ef4444" strokeDasharray="5 5" label={{ value: 'SAM', fill: '#dc2626', fontSize: 11, position: 'insideBottomLeft' }} />
                                      <Line yAxisId="growth" type="monotone" dataKey="muac" name="MUAC (mm)" stroke="#0ea5e9" strokeWidth={3} dot={{ r: 5, fill: '#0ea5e9' }} activeDot={{ r: 7 }} />
                                      <Line yAxisId="growth" type="monotone" dataKey="weight" name="Weight (kg)" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} />
                                      <Line yAxisId="height" type="monotone" dataKey="height" name="Height (cm)" stroke="#8b5cf6" strokeWidth={2.5} dot={{ r: 4, fill: '#8b5cf6' }} />
                                    </LineChart>
                                  </ResponsiveContainer>
                                  </div>
                                </div>

                                <div className="rounded-2xl border border-border bg-background/65 p-4">
                                  <h5 className="text-base font-black text-foreground">Readings</h5>
                                  <div className="mt-3 overflow-hidden rounded-xl border border-border">
                                    <table className="w-full text-left text-xs">
                                      <thead className="bg-muted/50 font-black uppercase tracking-[0.12em] text-muted-foreground">
                                        <tr>
                                          <th className="px-3 py-2">Month</th>
                                          <th className="px-3 py-2">MUAC</th>
                                          <th className="px-3 py-2">Wt</th>
                                          <th className="px-3 py-2">Ht</th>
                                          <th className="px-3 py-2">Status</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {item.historyChart.map((point) => (
                                          <tr
                                            key={`${item.id}-${point.month}-${point.projected ? 'projected' : 'actual'}`}
                                            className={cn('border-t border-border', point.projected && 'bg-sky-50/70 dark:bg-sky-950/20')}
                                          >
                                            <td className="px-3 py-2">
                                              <p className="font-black text-foreground">{point.month}</p>
                                              <p className="text-[10px] font-black uppercase tracking-[0.12em] text-muted-foreground">{point.projected ? 'Projected' : 'Recorded'}</p>
                                            </td>
                                            <td className="px-3 py-2 font-bold text-foreground">{point.muac}</td>
                                            <td className="px-3 py-2 font-bold text-foreground">{point.weight}</td>
                                            <td className="px-3 py-2 font-bold text-foreground">{point.height}</td>
                                            <td className="px-3 py-2">
                                              <span className="flex items-center gap-2 font-bold text-foreground">
                                                <span className={cn('h-2.5 w-2.5 rounded-full', bandMarkerClasses(point.band))} />
                                                {point.band}
                                              </span>
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function TimelineMonth({
  label,
  marker,
  point,
}: {
  label: string;
  marker: string;
  point: ForecastPoint;
}) {
  return (
    <div className={cn(
      'relative flex min-h-[172px] flex-col justify-between overflow-hidden rounded-2xl border p-4 shadow-sm',
      bandSurfaceClasses(point.band)
    )}>
      <span className={cn('absolute inset-x-0 top-0 h-1.5', bandMarkerClasses(point.band))} />

      <div className="flex items-start justify-between gap-3 pt-1">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
          <p className="mt-1 text-lg font-black text-foreground">{point.month}</p>
        </div>
        <span className={cn(
          'rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em]',
          point.projected
            ? 'border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900 dark:bg-sky-950/35 dark:text-sky-300'
            : 'border-border bg-card text-muted-foreground'
        )}>
          {marker}
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <BandPill band={point.band} />
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <ReadingTile label="MUAC" value={point.muac} unit="mm" />
        <ReadingTile label="Weight" value={point.weight} unit="kg" />
        <ReadingTile label="Height" value={point.height} unit="cm" />
      </div>
    </div>
  );
}

function ReadingTile({ label, value, unit }: { label: string; value: number; unit: string }) {
  return (
    <div className="rounded-xl border border-white/70 bg-white/75 px-2 py-2 text-center shadow-sm dark:border-white/10 dark:bg-slate-950/30">
      <p className="text-sm font-black text-foreground">{value}</p>
      <p className="mt-0.5 text-[10px] font-black uppercase tracking-[0.1em] text-muted-foreground">{label}</p>
      <p className="text-[10px] font-semibold text-muted-foreground">{unit}</p>
    </div>
  );
}

function NutritionLegend() {
  return (
    <div className="flex flex-wrap gap-2 text-xs font-bold">
      {(['Healthy', 'MAM', 'SAM'] as NutritionBand[]).map((band) => (
        <span key={band} className={cn('inline-flex items-center gap-2 rounded-full border px-3 py-1', bandClasses(band))}>
          <span className={cn('h-2 w-2 rounded-full', bandMarkerClasses(band))} />
          {band}
        </span>
      ))}
    </div>
  );
}

function Metric({ icon: Icon, label, value, tone }: { icon: typeof Users; label: string; value: number; tone: 'sky' | 'red' | 'amber' | 'emerald' }) {
  return (
    <div className="rounded-[1.5rem] border border-border bg-card p-5 shadow-sm">
      <div className={cn(
        'flex h-11 w-11 items-center justify-center rounded-2xl',
        tone === 'sky' && 'bg-sky-100 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300',
        tone === 'red' && 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300',
        tone === 'amber' && 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
        tone === 'emerald' && 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
      )}>
        <Icon size={20} />
      </div>
      <p className="mt-4 text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
      <p className="mt-1 text-3xl font-black text-foreground">{value}</p>
    </div>
  );
}

function BandPill({ band }: { band: NutritionBand }) {
  return (
    <span className={cn('inline-flex min-h-8 items-center rounded-full border px-3 text-xs font-black uppercase', bandClasses(band))}>
      {band}
    </span>
  );
}
