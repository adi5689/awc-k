import { useMemo, useState } from 'react';
import { alertDetailRows } from '../../data/adminOfficialsData';
import {
  AlertCard,
  OpsMetricGrid,
  OpsPageIntro,
  SectionCard,
  TabFilterBar,
} from '../../components/operations/OperationsUI';

const TABS = ['All', 'High Risk', 'Pending Action', 'Missed Update'];

export function OfficialsAlerts() {
  const [activeTab, setActiveTab] = useState('All');

  const filtered = useMemo(() => {
    if (activeTab === 'All') return alertDetailRows;
    return alertDetailRows.filter((row) => row.alertType === activeTab);
  }, [activeTab]);

  const highCount = alertDetailRows.filter((r) => r.severity === 'High').length;
  const mediumCount = alertDetailRows.filter((r) => r.severity === 'Medium').length;
  const openCount = alertDetailRows.filter((r) => r.status === 'Open').length;
  const inProgressCount = alertDetailRows.filter((r) => r.status === 'In Progress').length;
  const pendingCount = alertDetailRows.filter((r) => r.alertType === 'Pending Action').length;
  const missedCount = alertDetailRows.filter((r) => r.alertType === 'Missed Update').length;

  return (
    <div className="space-y-6">
      <OpsPageIntro
        eyebrow="Alert Desk"
        title="Alerts and escalations"
        description="Operational alerts for high-risk centers, pending supervisor actions, missed data updates, and report review issues across all monitored centers."
      />

      <OpsMetricGrid
        items={[
          { label: 'High Risk Alerts', value: String(highCount), detail: 'Immediate follow-up required' },
          { label: 'Medium Risk Alerts', value: String(mediumCount), detail: 'Review within 48 hours' },
          { label: 'Pending Action Alerts', value: String(pendingCount), detail: 'Action items unresolved' },
          { label: 'Missed Update Alerts', value: String(missedCount), detail: 'Sync or data gap detected' },
          { label: 'Open Alerts', value: String(openCount), detail: 'Not yet acted upon' },
          { label: 'In Progress', value: String(inProgressCount), detail: 'Action underway' },
          { label: 'Resolved This Month', value: '21', detail: 'Closed since 1 Jun 2026' },
          { label: 'Avg Resolution Time', value: '2.4 days', detail: 'District average' },
        ]}
      />

      <SectionCard
        title="Alert register"
        description="Filter by type to see high-risk, pending action, or missed update alerts for your assigned centers."
      >
        <TabFilterBar tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="mt-6 space-y-4">
          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-8 text-center">
              <p className="text-lg font-black text-foreground">No alerts in this category</p>
              <p className="mt-2 text-sm text-muted-foreground">All centers are operating normally for the selected filter.</p>
            </div>
          ) : (
            filtered.map((row) => (
              <AlertCard
                key={row.id}
                center={row.center}
                issue={row.issue}
                severity={row.severity}
                daysOpen={row.daysOpen}
                owner={row.owner}
                recommendedAction={row.recommendedAction}
                status={row.status}
                updated={row.updated}
              />
            ))
          )}
        </div>
      </SectionCard>

      <div className="grid gap-6 md:grid-cols-3">
        <SectionCard title="High risk summary" description="Centers with severe nutrition or attendance issues.">
          <div className="space-y-2 text-sm text-muted-foreground">
            <p><span className="font-semibold text-red-700">Dharamgarh Tribal AWC</span> — SAM forecast high for 3 consecutive weeks. NRC referral pending.</p>
            <p><span className="font-semibold text-red-700">Kanjiaguda Nutrition Centre</span> — Learning gap compounding nutrition risk. Refresher module needed.</p>
          </div>
        </SectionCard>
        <SectionCard title="Pending actions" description="Supervisor or field action items overdue.">
          <div className="space-y-2 text-sm text-muted-foreground">
            <p><span className="font-semibold text-amber-700">Thuamul Rampur AWC 3</span> — Monthly report and attendance update both pending. Deadline today.</p>
            <p><span className="font-semibold text-amber-700">Narla Integrated AWC</span> — Supervisor visit overdue by 8 days. Schedule immediately.</p>
          </div>
        </SectionCard>
        <SectionCard title="Missed updates" description="Data sync gaps and missing field measurements.">
          <div className="space-y-2 text-sm text-muted-foreground">
            <p><span className="font-semibold text-slate-700">Kesinga Ward AWC</span> — MUAC values missing for 12 children in June upload. Confidence dipped to 79%.</p>
            <p><span className="font-semibold text-slate-700">Sinapali Hill AWC</span> — No sync recorded in 48 hours. Connectivity check required.</p>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
