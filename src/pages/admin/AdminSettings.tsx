import { useState } from 'react';
import { auditLogRows, notificationSettings } from '../../data/adminOfficialsData';
import {
  DataTable,
  OpsPageIntro,
  PermissionRow,
  SectionCard,
  StatusBadge,
  TabFilterBar,
} from '../../components/operations/OperationsUI';
import { Button } from '../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';

const PERMISSION_FEATURES = [
  { feature: 'Dashboard — all centers overview', admin: true, official: true },
  { feature: 'View nutrition forecasts', admin: true, official: true },
  { feature: 'View center details', admin: true, official: true },
  { feature: 'View learning progress', admin: true, official: true },
  { feature: 'Review and approve monthly reports', admin: true, official: true },
  { feature: 'View AI prediction batches', admin: true, official: true },
  { feature: 'View alerts', admin: true, official: true },
  { feature: 'Create center logins and credentials', admin: true, official: false },
  { feature: 'Create official logins and credentials', admin: true, official: false },
  { feature: 'Upload Poshan Tracker data', admin: true, official: false },
  { feature: 'Manage learning modules (add/edit/publish)', admin: true, official: false },
  { feature: 'Manage activities (add/edit/publish)', admin: true, official: false },
  { feature: 'Re-run AI prediction batches', admin: true, official: false },
  { feature: 'System settings and configuration', admin: true, official: false },
  { feature: 'Access audit log', admin: true, official: false },
  { feature: 'Manage notification settings', admin: true, official: false },
];

const AUDIT_CATEGORIES = ['All', 'User Management', 'Content', 'Data Upload', 'Settings', 'Report'];

export function AdminSettings() {
  const [auditCategory, setAuditCategory] = useState('All');

  const filteredAudit = auditCategory === 'All'
    ? auditLogRows
    : auditLogRows.filter((r) => r.category === auditCategory);

  return (
    <div className="space-y-6">
      <OpsPageIntro
        eyebrow="Configuration"
        title="Platform settings"
        description="System-level controls for account policies, upload windows, notification rules, role-based permissions, and audit tracking."
      />

      <Tabs defaultValue="system" className="space-y-4">
        <TabsList className="h-auto flex-wrap justify-start gap-2 rounded-2xl bg-muted/40 p-2">
          <TabsTrigger value="system">System Preferences</TabsTrigger>
          <TabsTrigger value="permissions">Role Permissions</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="upload">Upload Config</TabsTrigger>
          <TabsTrigger value="audit">Audit Log</TabsTrigger>
        </TabsList>

        {/* ── System Preferences ── */}
        <TabsContent value="system">
          <div className="grid gap-6 lg:grid-cols-2">
            <SectionCard title="Account and security" description="Password policies and session management settings.">
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  { label: 'Password reset expiry (days)', value: '30' },
                  { label: 'Session timeout (minutes)', value: '60' },
                  { label: 'Max login attempts', value: '5' },
                  { label: 'OTP expiry (seconds)', value: '120' },
                ].map(({ label, value }) => (
                  <label key={label} className="block">
                    <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{label}</span>
                    <input defaultValue={value} className="h-11 w-full rounded-2xl border border-input bg-background px-4 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20" />
                  </label>
                ))}
              </div>
            </SectionCard>
            <SectionCard title="Reporting and operational windows" description="Cycle dates and upload scheduling rules.">
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  { label: 'Monthly reporting window opens (day)', value: '1' },
                  { label: 'Monthly reporting window closes (day)', value: '15' },
                  { label: 'Upload validation mode', value: 'Strict' },
                  { label: 'AI batch auto-run after upload', value: 'Enabled' },
                  { label: 'Default official access level', value: 'Block Monitoring' },
                  { label: 'Min records for AI run', value: '1000' },
                ].map(({ label, value }) => (
                  <label key={label} className="block">
                    <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{label}</span>
                    <input defaultValue={value} className="h-11 w-full rounded-2xl border border-input bg-background px-4 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20" />
                  </label>
                ))}
              </div>
            </SectionCard>
          </div>
          <div className="mt-4 flex gap-3">
            <Button>Save Changes</Button>
            <Button variant="outline">Reset to Defaults</Button>
          </div>
        </TabsContent>

        {/* ── Role Permissions ── */}
        <TabsContent value="permissions">
          <SectionCard title="Role-based access matrix" description="Feature availability by role. Admin controls are protected and cannot be delegated to Officials without system-level configuration change.">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-4 py-3 text-xs font-black uppercase tracking-[0.16em] text-muted-foreground">Feature</th>
                    <th className="px-4 py-3 text-center text-xs font-black uppercase tracking-[0.16em] text-muted-foreground">Admin</th>
                    <th className="px-4 py-3 text-center text-xs font-black uppercase tracking-[0.16em] text-muted-foreground">Officials</th>
                  </tr>
                </thead>
                <tbody>
                  {PERMISSION_FEATURES.map((pf) => (
                    <PermissionRow key={pf.feature} feature={pf.feature} admin={pf.admin} official={pf.official} />
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>
        </TabsContent>

        {/* ── Notifications ── */}
        <TabsContent value="notifications">
          <SectionCard title="Notification rules" description="Configure which events trigger alerts and to whom they are routed.">
            <DataTable
              headers={['Event', 'Channel', 'Recipients', 'Status']}
              rows={notificationSettings.map((ns) => [
                ns.event,
                <span key={`${ns.id}-ch`} className="inline-flex rounded-full border border-border/70 bg-muted/30 px-2.5 py-1 text-xs font-semibold">{ns.channel}</span>,
                ns.recipients,
                <StatusBadge key={`${ns.id}-status`} value={ns.enabled ? 'Active' : 'Inactive'} />,
              ])}
            />
          </SectionCard>
        </TabsContent>

        {/* ── Upload Config ── */}
        <TabsContent value="upload">
          <div className="grid gap-6 lg:grid-cols-2">
            <SectionCard title="File upload settings" description="Validation, size limits, and format rules for Poshan Tracker uploads.">
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  { label: 'Max file size (MB)', value: '25' },
                  { label: 'Allowed formats', value: 'CSV, XLSX' },
                  { label: 'Duplicate row handling', value: 'Flag and skip' },
                  { label: 'Missing field threshold (%)', value: '10' },
                  { label: 'Month detection', value: 'Auto from sheet name' },
                  { label: 'Preview rows shown', value: '12' },
                ].map(({ label, value }) => (
                  <label key={label} className="block">
                    <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{label}</span>
                    <input defaultValue={value} className="h-11 w-full rounded-2xl border border-input bg-background px-4 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20" />
                  </label>
                ))}
              </div>
            </SectionCard>
            <SectionCard title="Required columns" description="Mandatory fields that must be present in every upload file.">
              <div className="space-y-2">
                {['Center Code', 'Beneficiary ID', 'Beneficiary Type', 'MUAC', 'Weight', 'Height', 'Age', 'Month Year', 'Worker ID'].map((col) => (
                  <div key={col} className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 flex-shrink-0" />
                    <span className="text-sm font-medium text-emerald-800">{col}</span>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>
        </TabsContent>

        {/* ── Audit Log ── */}
        <TabsContent value="audit">
          <SectionCard title="System audit log" description="Recent admin actions recorded for accountability and compliance.">
            <TabFilterBar tabs={AUDIT_CATEGORIES} activeTab={auditCategory} onTabChange={setAuditCategory} />
            <div className="mt-5">
              <DataTable
                headers={['Audit ID', 'Action', 'Performed By', 'Target', 'Category', 'Timestamp']}
                rows={filteredAudit.map((row) => [
                  row.id,
                  row.action,
                  row.performedBy,
                  row.target,
                  <span key={`${row.id}-cat`} className="inline-flex rounded-full border border-border/70 bg-muted/30 px-2.5 py-1 text-xs font-semibold">{row.category}</span>,
                  row.timestamp,
                ])}
              />
            </div>
          </SectionCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
