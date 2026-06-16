import { officialProfile } from '../../data/adminOfficialsData';
import {
  OpsMetricGrid,
  OpsPageIntro,
  ProgressBar,
  SectionCard,
} from '../../components/operations/OperationsUI';
import { Building2, CalendarDays, Mail, Phone, ShieldCheck, User } from 'lucide-react';

const ACCESS_PERMISSIONS = [
  { feature: 'View center dashboards', granted: true },
  { feature: 'View nutrition forecasts', granted: true },
  { feature: 'View learning progress', granted: true },
  { feature: 'Review monthly reports', granted: true },
  { feature: 'Approve monthly reports', granted: true },
  { feature: 'View center details', granted: true },
  { feature: 'View AI predictions', granted: true },
  { feature: 'Create center logins', granted: false },
  { feature: 'Create official logins', granted: false },
  { feature: 'Upload Poshan Tracker data', granted: false },
  { feature: 'Manage learning modules', granted: false },
  { feature: 'System settings', granted: false },
];

export function OfficialsProfile() {
  return (
    <div className="space-y-6">
      <OpsPageIntro
        eyebrow="User Profile"
        title="Official profile"
        description="Role summary, contact details, access permissions, and activity overview for the signed-in monitoring user."
      />

      {/* Profile header card */}
      <div className="rounded-[1.75rem] border border-border bg-[linear-gradient(180deg,rgba(240,249,244,0.95),rgba(255,255,255,0.98))] p-6 shadow-sm">
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-3xl font-black text-white shadow-lg">
            {officialProfile.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
          </div>
          <div className="flex-1">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-700">Officials Portal</p>
            <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-900">{officialProfile.name}</h2>
            <p className="mt-0.5 text-sm text-slate-600">{officialProfile.designation} · {officialProfile.department}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                <ShieldCheck size={12} /> Monitoring Role
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
                <Building2 size={12} /> {officialProfile.district}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
                <CalendarDays size={12} /> Joined {officialProfile.joinedDate}
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Last login</p>
            <p className="text-sm font-semibold text-foreground">{officialProfile.lastLogin}</p>
          </div>
        </div>
      </div>

      <OpsMetricGrid
        items={[
          { label: 'Centers Monitored', value: String(officialProfile.centersMonitored), detail: 'Across assigned district' },
          { label: 'Reports Reviewed', value: String(officialProfile.reportsReviewed), detail: 'June 2026 cycle' },
          { label: 'Alerts Resolved', value: String(officialProfile.alertsResolved), detail: 'Since 1 Jun 2026' },
          { label: 'Access Scope', value: 'District', detail: officialProfile.access },
        ]}
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard title="Contact and role details" description="Profile information and district assignment.">
          <div className="space-y-3">
            {[
              { icon: User, label: 'Full Name', value: officialProfile.name },
              { icon: ShieldCheck, label: 'Designation', value: officialProfile.designation },
              { icon: Building2, label: 'Department', value: officialProfile.department },
              { icon: Building2, label: 'Assigned District', value: officialProfile.district },
              { icon: Building2, label: 'Assigned Block', value: officialProfile.block },
              { icon: Mail, label: 'Email', value: officialProfile.email },
              { icon: Phone, label: 'Phone', value: officialProfile.phone },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3 rounded-2xl border border-border/70 bg-muted/20 px-4 py-3">
                <Icon size={15} className="flex-shrink-0 text-emerald-700" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
                  <p className="text-sm font-semibold text-foreground truncate">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <div className="space-y-6">
          <SectionCard title="Access permissions" description="Features available to this official account.">
            <div className="space-y-2">
              {ACCESS_PERMISSIONS.map(({ feature, granted }) => (
                <div key={feature} className="flex items-center gap-3 py-1.5">
                  <span className={`flex-shrink-0 inline-flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold ${granted ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>
                    {granted ? '✓' : '–'}
                  </span>
                  <span className={`text-sm ${granted ? 'text-foreground' : 'text-muted-foreground line-through decoration-slate-300'}`}>{feature}</span>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Activity this month" description="Performance summary for June 2026 cycle.">
            <div className="space-y-4">
              {[
                { label: 'Centers reviewed', value: 48, max: 54 },
                { label: 'Reports approved', value: 45, max: 54 },
                { label: 'Alerts resolved', value: 21, max: 26 },
              ].map(({ label, value, max }) => (
                <div key={label}>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-xs font-semibold text-muted-foreground">{label}</span>
                    <span className="text-xs font-bold text-foreground">{value} / {max}</span>
                  </div>
                  <ProgressBar value={value} max={max} />
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
