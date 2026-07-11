import { Link } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import { ArrowRight, Search } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, BarChart, Bar, PieChart, Pie, Cell, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { cn } from '@/utils';

// ─── STATUS COLOR MAP ──────────────────────────────────────────────────────────

const statusClassMap: Record<string, string> = {
  active: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800',
  completed: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800',
  published: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800',
  approved: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800',
  low: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800',
  'on track': 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800',
  excellent: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800',
  pending: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
  inactive: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
  draft: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
  warning: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800',
  review: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800',
  medium: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800',
  delayed: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800',
  critical: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800',
  failed: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800',
  high: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800',
  escalated: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800',
};

// ─── PAGE INTRO ────────────────────────────────────────────────────────────────

export function OpsPageIntro({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow: string;
  title: string;
  description: string;
  actions?: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-4xl">
          <p className="text-xs font-bold uppercase tracking-wider text-primary">{eyebrow}</p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground">{title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
        </div>
        {actions ? <div className="flex flex-wrap gap-3 shrink-0">{actions}</div> : null}
      </div>
    </section>
  );
}

// ─── METRIC GRID ───────────────────────────────────────────────────────────────

export function OpsMetricGrid({
  items,
}: {
  items: Array<{ label: string; value: string; trend?: string; detail?: string; icon?: LucideIcon }>;
}) {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Card key={item.label} className="rounded-xl shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{item.label}</p>
                  <p className="mt-2 text-3xl font-bold tabular-nums tracking-tight text-foreground">{item.value}</p>
                </div>
                {Icon ? (
                  <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
                    <Icon size={18} />
                  </div>
                ) : null}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{item.trend ?? item.detail}</p>
            </CardContent>
          </Card>
        );
      })}
    </section>
  );
}

// ─── STATUS BADGE ──────────────────────────────────────────────────────────────

export function StatusBadge({ value }: { value: string }) {
  const tone = statusClassMap[value.toLowerCase()] ?? 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
  return <span className={cn('inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold', tone)}>{value}</span>;
}

// ─── SECTION CARD ──────────────────────────────────────────────────────────────

export function SectionCard({
  title,
  description,
  action,
  children,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Card className="rounded-xl shadow-sm">
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
        <div>
          <CardTitle className="text-base font-bold">{title}</CardTitle>
          {description ? <CardDescription className="mt-1">{description}</CardDescription> : null}
        </div>
        {action}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

// ─── FILTER BAR ────────────────────────────────────────────────────────────────

export function OpsFilterBar({
  search,
  setSearch,
  filters,
}: {
  search?: string;
  setSearch?: (value: string) => void;
  filters?: Array<{ label: string; value: string; onChange: (value: string) => void; options: string[] }>;
}) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      {setSearch ? (
        <div className="relative w-full lg:max-w-sm">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search..."
            className="h-10 w-full rounded-lg border border-input bg-background pl-10 pr-4 text-sm outline-none transition-colors hover:border-foreground/25 focus:border-ring focus:ring-2 focus:ring-ring/20"
          />
        </div>
      ) : <div />}
      <div className="grid w-full gap-3 md:grid-cols-2 xl:grid-cols-4">
        {filters?.map((filter) => (
          <div key={filter.label}>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{filter.label}</p>
            <Select value={filter.value} onValueChange={filter.onChange}>
              <SelectTrigger className="h-10 rounded-lg">
                <SelectValue placeholder={filter.label} />
              </SelectTrigger>
              <SelectContent>
                {filter.options.map((option) => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── DATA TABLE ────────────────────────────────────────────────────────────────

export function DataTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: React.ReactNode[][];
}) {
  return (
    <div className="overflow-x-auto scrollbar-thin">
      <table className="min-w-full text-left">
        <thead>
          <tr className="border-b border-border">
            {headers.map((header) => (
              <th key={header} className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index} className="border-b border-border/60 align-middle last:border-b-0 hover:bg-muted/30 transition-colors">
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="px-4 py-3 text-sm text-foreground">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── ACTION LINKS ──────────────────────────────────────────────────────────────

export function ActionLinks({ links }: { links: Array<{ label: string; to?: string }> }) {
  return (
    <div className="flex flex-col items-start gap-1.5 min-w-[160px]">
      {links.map((link) => (
        link.to ? (
          <Link key={link.label} to={link.to} className="whitespace-nowrap text-sm font-medium text-primary hover:text-primary/80 hover:underline underline-offset-2 transition-colors">
            {link.label}
          </Link>
        ) : (
          <button key={link.label} type="button" className="whitespace-nowrap text-left text-sm font-medium text-primary hover:text-primary/80 hover:underline underline-offset-2 transition-colors">
            {link.label}
          </button>
        )
      ))}
    </div>
  );
}

// ─── SUMMARY LIST ──────────────────────────────────────────────────────────────

export function SummaryList({ items }: { items: string[] }) {
  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div key={item} className="flex items-start gap-3 rounded-xl border border-border/70 bg-muted/20 px-4 py-3">
          <div className="mt-1.5 h-2 w-2 rounded-full bg-primary shrink-0" />
          <p className="text-sm text-foreground">{item}</p>
        </div>
      ))}
    </div>
  );
}

// ─── CHART TOOLTIP STYLE ───────────────────────────────────────────────────────

const chartTooltipStyle = {
  backgroundColor: 'hsl(var(--card))',
  border: '1px solid hsl(var(--border))',
  borderRadius: 8,
  fontSize: 12,
  padding: '8px 12px',
};

// ─── LINE CHART PANEL ──────────────────────────────────────────────────────────

export function LinePanel({
  title,
  description,
  data,
  lines,
}: {
  title: string;
  description?: string;
  data: Array<Record<string, string | number>>;
  lines: Array<{ key: string; color: string; name: string }>;
}) {
  return (
    <SectionCard title={title} description={description}>
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ left: -10, right: 16, top: 8, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="month" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={chartTooltipStyle} />
            <Legend />
            {lines.map((line) => (
              <Line key={line.key} type="monotone" dataKey={line.key} stroke={line.color} name={line.name} strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </SectionCard>
  );
}

// ─── BAR CHART PANEL ───────────────────────────────────────────────────────────

export function BarPanel({
  title,
  description,
  data,
  bars,
}: {
  title: string;
  description?: string;
  data: Array<Record<string, string | number>>;
  bars: Array<{ key: string; color: string; name: string }>;
}) {
  return (
    <SectionCard title={title} description={description}>
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ left: -10, right: 16, top: 8, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={chartTooltipStyle} />
            <Legend />
            {bars.map((bar) => (
              <Bar key={bar.key} dataKey={bar.key} fill={bar.color} name={bar.name} radius={[4, 4, 0, 0]} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </SectionCard>
  );
}

// ─── PIE CHART PANEL ───────────────────────────────────────────────────────────

export function PiePanel({
  title,
  description,
  data,
}: {
  title: string;
  description?: string;
  data: Array<{ name: string; value: number }>;
}) {
  const colors = ['#16a34a', '#f59e0b', '#dc2626', '#2563eb', '#7c3aed'];
  return (
    <SectionCard title={title} description={description}>
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={60} outerRadius={88} paddingAngle={3}>
              {data.map((entry, index) => (
                <Cell key={entry.name} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={chartTooltipStyle} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </SectionCard>
  );
}

// ─── DETAIL TABS ───────────────────────────────────────────────────────────────

export function DetailTabs({
  overview,
  beneficiaries,
  nutrition,
  learning,
  activities,
  reports,
  alerts,
}: {
  overview: React.ReactNode;
  beneficiaries: React.ReactNode;
  nutrition: React.ReactNode;
  learning: React.ReactNode;
  activities: React.ReactNode;
  reports: React.ReactNode;
  alerts: React.ReactNode;
}) {
  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <TabsList className="h-auto flex-wrap justify-start gap-1 rounded-xl bg-muted/40 p-1.5">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="beneficiaries">Beneficiaries</TabsTrigger>
        <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
        <TabsTrigger value="learning">Learning</TabsTrigger>
        <TabsTrigger value="activities">Activities</TabsTrigger>
        <TabsTrigger value="reports">Reports</TabsTrigger>
        <TabsTrigger value="alerts">Alerts</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">{overview}</TabsContent>
      <TabsContent value="beneficiaries">{beneficiaries}</TabsContent>
      <TabsContent value="nutrition">{nutrition}</TabsContent>
      <TabsContent value="learning">{learning}</TabsContent>
      <TabsContent value="activities">{activities}</TabsContent>
      <TabsContent value="reports">{reports}</TabsContent>
      <TabsContent value="alerts">{alerts}</TabsContent>
    </Tabs>
  );
}

// ─── INLINE FORM CARD ──────────────────────────────────────────────────────────

export function InlineFormCard({
  title,
  description,
  fields,
}: {
  title: string;
  description: string;
  fields: string[];
}) {
  return (
    <SectionCard
      title={title}
      description={description}
      action={<Button size="sm">Save and Send Credentials</Button>}
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {fields.map((field) => (
          <label key={field} className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">{field}</span>
            <input
              type="text"
              placeholder={field}
              className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition-colors hover:border-foreground/25 focus:border-ring focus:ring-2 focus:ring-ring/20"
            />
          </label>
        ))}
      </div>
    </SectionCard>
  );
}

// ─── UPLOAD WORKSPACE ──────────────────────────────────────────────────────────

export function UploadWorkspace() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <SectionCard title="Upload Poshan Tracker Data" description="CSV or XLSX upload area for the monthly data feed before AI processing.">
        <div className="rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 p-8 text-center">
          <p className="text-base font-bold text-foreground">Drag and drop CSV/XLSX file here</p>
          <p className="mt-2 text-sm text-muted-foreground">Validation, duplicate check, row count, and month mapping will run before submission.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button>Select File</Button>
            <Button variant="outline">Download Template</Button>
          </div>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <MiniState label="Validation status" value="Ready" detail="2 warnings, no blocking errors" />
          <MiniState label="Upload progress" value="74%" detail="Rows parsed and staged" />
          <MiniState label="AI submission" value="Queued" detail="Will trigger after final submit" />
        </div>
      </SectionCard>
      <SectionCard title="Preview and Error Summary" description="Review the first few rows and any invalid entries before sending to the model.">
        <div className="space-y-3">
          <MiniState label="Preview rows" value="12 shown" detail="From 5,482 staged records" />
          <MiniState label="Invalid rows" value="14 rows" detail="Missing MUAC or center code" />
          <MiniState label="Mapped month" value="June 2026" detail="Detected from file sheet name" />
        </div>
        <Button className="mt-5 w-full">Submit to AI Model</Button>
      </SectionCard>
    </div>
  );
}

// ─── MINI STATE ────────────────────────────────────────────────────────────────

function MiniState({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="rounded-xl border border-border bg-muted/20 p-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1.5 text-xl font-bold tabular-nums text-foreground">{value}</p>
      <p className="mt-1 text-sm text-muted-foreground">{detail}</p>
    </div>
  );
}

// ─── EMPTY STATE ───────────────────────────────────────────────────────────────

export function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-dashed border-border p-8 text-center">
      <p className="text-lg font-bold text-foreground">{title}</p>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

// ─── CTA BUTTON LINK ───────────────────────────────────────────────────────────

export function CTAButtonLink({ to, label }: { to: string; label: string }) {
  return (
    <Button asChild>
      <Link to={to}>
        {label}
        <ArrowRight size={16} />
      </Link>
    </Button>
  );
}

// ─── PROGRESS BAR ──────────────────────────────────────────────────────────────

export function ProgressBar({ value, max = 100, color }: { value: number; max?: number; color?: string }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  const barColor = color ?? (pct >= 75 ? '#16a34a' : pct >= 50 ? '#f59e0b' : '#dc2626');
  return (
    <div className="flex items-center gap-3">
      <div className="h-2 flex-1 rounded-full bg-muted overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: barColor }} />
      </div>
      <span className="text-xs font-semibold text-muted-foreground tabular-nums w-8 text-right">{pct}%</span>
    </div>
  );
}

// ─── STAT GRID ─────────────────────────────────────────────────────────────────

export function StatGrid({ stats }: { stats: Array<{ label: string; value: string; sub?: string }> }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-xl border border-border bg-muted/20 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{stat.label}</p>
          <p className="mt-1.5 text-2xl font-bold tabular-nums text-foreground">{stat.value}</p>
          {stat.sub && <p className="mt-1 text-xs text-muted-foreground">{stat.sub}</p>}
        </div>
      ))}
    </div>
  );
}

// ─── ALERT CARD ────────────────────────────────────────────────────────────────

const alertSeverityConfig: Record<string, { bg: string; border: string; dot: string; label: string }> = {
  High: { bg: 'bg-red-50 dark:bg-red-950/30', border: 'border-red-200 dark:border-red-800', dot: 'bg-red-500', label: 'text-red-700 dark:text-red-400' },
  Medium: { bg: 'bg-amber-50 dark:bg-amber-950/30', border: 'border-amber-200 dark:border-amber-800', dot: 'bg-amber-500', label: 'text-amber-700 dark:text-amber-400' },
  Low: { bg: 'bg-slate-50 dark:bg-slate-900/30', border: 'border-slate-200 dark:border-slate-700', dot: 'bg-slate-400', label: 'text-slate-600 dark:text-slate-400' },
};

export function AlertCard({
  center,
  issue,
  severity,
  daysOpen,
  owner,
  recommendedAction,
  status,
  updated,
}: {
  center: string;
  issue: string;
  severity: string;
  daysOpen: number;
  owner: string;
  recommendedAction: string;
  status: string;
  updated: string;
}) {
  const config = alertSeverityConfig[severity] ?? alertSeverityConfig['Low'];
  return (
    <div className={cn('rounded-xl border p-5', config.bg, config.border)}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className={cn('h-2 w-2 rounded-full shrink-0', config.dot)} />
          <p className={cn('text-sm font-bold', config.label)}>{center}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <StatusBadge value={severity} />
          <span className="text-xs text-muted-foreground">{daysOpen}d open</span>
        </div>
      </div>
      <p className="mt-2 text-sm text-foreground leading-relaxed">{issue}</p>
      <div className="mt-3 rounded-lg border border-border/50 bg-background/60 px-3 py-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Recommended</p>
        <p className="mt-1 text-xs text-foreground">{recommendedAction}</p>
      </div>
      <div className="mt-3 flex items-center justify-between gap-2">
        <span className="text-xs text-muted-foreground">Owner: <span className="font-semibold text-foreground">{owner}</span></span>
        <div className="flex items-center gap-2">
          <StatusBadge value={status} />
          <span className="text-xs text-muted-foreground">{updated}</span>
        </div>
      </div>
    </div>
  );
}

// ─── TAB FILTER BAR ────────────────────────────────────────────────────────────

export function TabFilterBar({
  tabs,
  activeTab,
  onTabChange,
}: {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={cn(
            'px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 border',
            activeTab === tab
              ? 'bg-primary text-primary-foreground border-primary shadow-sm'
              : 'bg-background text-muted-foreground border-border hover:border-primary/30 hover:text-foreground'
          )}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

// ─── APPROVAL BAR ──────────────────────────────────────────────────────────────

export function ApprovalBar({
  status,
  onApprove,
  onReview,
}: {
  status: string;
  onApprove?: () => void;
  onReview?: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-muted/20 p-4">
      <div className="flex-1">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Current Status</p>
        <div className="mt-2"><StatusBadge value={status} /></div>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button size="sm" onClick={onApprove}>✓ Approve Report</Button>
        <Button size="sm" variant="outline" className="border-amber-300 text-amber-700 hover:bg-amber-50 dark:border-amber-700 dark:text-amber-400 dark:hover:bg-amber-950/30" onClick={onReview}>
          Mark for Review
        </Button>
        <Button size="sm" variant="outline">Add Comment</Button>
        <Button size="sm" variant="outline">Download PDF</Button>
      </div>
    </div>
  );
}

// ─── REMARK BOX ────────────────────────────────────────────────────────────────

export function RemarkBox({
  title,
  author,
  authorRole,
  content,
}: {
  title: string;
  author: string;
  authorRole: string;
  content: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-muted/20 p-4">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{title}</p>
          <p className="mt-1 text-sm font-semibold text-foreground">{author}</p>
          <p className="text-xs text-muted-foreground">{authorRole}</p>
        </div>
      </div>
      <p className="text-sm text-foreground leading-relaxed">{content}</p>
    </div>
  );
}

// ─── INFO ROW ──────────────────────────────────────────────────────────────────

export function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-muted/20 p-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1.5 text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}

// ─── PERMISSION ROW ────────────────────────────────────────────────────────────

export function PermissionRow({
  feature,
  admin,
  official,
}: {
  feature: string;
  admin: boolean;
  official: boolean;
}) {
  const Tick = ({ ok }: { ok: boolean }) => (
    <span className={cn('inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold', ok ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400' : 'bg-muted text-muted-foreground')}>
      {ok ? '✓' : '–'}
    </span>
  );
  return (
    <tr className="border-b border-border/60 last:border-b-0">
      <td className="px-4 py-3 text-sm text-foreground">{feature}</td>
      <td className="px-4 py-3 text-center"><Tick ok={admin} /></td>
      <td className="px-4 py-3 text-center"><Tick ok={official} /></td>
    </tr>
  );
}
