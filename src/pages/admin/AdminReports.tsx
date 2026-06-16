import { useMemo, useState } from 'react';
import { reportRows } from '../../data/adminOfficialsData';
import {
  ActionLinks,
  DataTable,
  OpsFilterBar,
  OpsMetricGrid,
  OpsPageIntro,
  SectionCard,
  StatusBadge,
} from '../../components/operations/OperationsUI';
import { Button } from '../../components/ui/button';
import { Download } from 'lucide-react';

export function AdminReports() {
  const [month, setMonth] = useState('June 2026');
  const [district, setDistrict] = useState('All Districts');
  const [status, setStatus] = useState('All Status');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => reportRows.filter((row) => {
    const query = search.toLowerCase();
    const matchesSearch = !query || [row.id, row.centerName, row.submittedBy].some((v) => v.toLowerCase().includes(query));
    const matchesMonth = month === 'All Months' || row.month === month;
    const matchesStatus = status === 'All Status' || row.status === status;
    return matchesSearch && matchesMonth && matchesStatus;
  }), [month, district, status, search]);

  const submitted = reportRows.filter((r) => r.status !== 'Pending').length;
  const pending = reportRows.filter((r) => r.status === 'Pending').length;
  const approved = reportRows.filter((r) => r.status === 'Approved').length;
  const review = reportRows.filter((r) => r.status === 'Review').length;

  return (
    <div className="space-y-6">
      <OpsPageIntro
        eyebrow="Reporting Desk"
        title="Reports"
        description="District-level reporting workspace for monitoring submissions, review status, and summary quality across all centers. Approve, review, and export center monthly reports."
        actions={
          <Button variant="outline" className="gap-2">
            <Download size={15} />
            Export All Reports
          </Button>
        }
      />

      <OpsMetricGrid
        items={[
          { label: 'Reports Submitted', value: String(submitted), detail: 'For June 2026' },
          { label: 'Reports Pending', value: String(pending), detail: 'Awaiting submission' },
          { label: 'Reports Approved', value: String(approved), detail: 'Cleared by officials' },
          { label: 'Requiring Review', value: String(review), detail: 'Need comments or revision' },
        ]}
      />

      <SectionCard title="Report register" description="Operational reporting ledger for recent monthly submissions with approval workflow.">
        <OpsFilterBar
          search={search}
          setSearch={setSearch}
          filters={[
            { label: 'Month', value: month, onChange: setMonth, options: ['All Months', 'June 2026', 'May 2026'] },
            { label: 'District', value: district, onChange: setDistrict, options: ['All Districts', 'Kalahandi', 'Nuapada'] },
            { label: 'Report Status', value: status, onChange: setStatus, options: ['All Status', 'Submitted', 'Pending', 'Approved', 'Review'] },
          ]}
        />
        <div className="mt-5">
          <DataTable
            headers={['Report ID', 'Center Name', 'Month', 'Submitted By', 'Submission Date', 'Status', 'Nutrition Summary', 'Learning Summary', 'Activity Summary', 'Actions']}
            rows={filtered.map((row) => [
              row.id,
              <div key={row.id}>
                <p className="font-semibold">{row.centerName}</p>
              </div>,
              row.month,
              row.submittedBy,
              row.submissionDate,
              <StatusBadge key={`${row.id}-status`} value={row.status} />,
              row.nutritionSummary,
              row.learningSummary,
              row.activitySummary,
              <ActionLinks
                key={`${row.id}-actions`}
                links={[
                  { label: 'View Report' },
                  { label: 'Download PDF' },
                  { label: 'Approve Report' },
                  { label: 'Mark for Review' },
                  { label: 'Add Comment' },
                ]}
              />,
            ])}
          />
        </div>
      </SectionCard>

      <div className="grid gap-6 md:grid-cols-3">
        <SectionCard title="Submission coverage" description="June 2026 reporting cycle status.">
          <div className="space-y-3 text-sm text-muted-foreground">
            <p><span className="font-semibold text-foreground">{submitted} of {reportRows.length}</span> reports received for June 2026.</p>
            <p>{pending} centers yet to submit — follow-up messages sent via supervisor channel.</p>
            <p>{review} reports are under official review with comments pending worker action.</p>
          </div>
        </SectionCard>
        <SectionCard title="Quality notes" description="Common issues flagged by officials this cycle.">
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• MUAC completeness is the most common flagging reason (3 reports).</p>
            <p>• Activity completion below 15 in 2 reports — under supervisor review.</p>
            <p>• SAM referral documentation missing in 1 high-risk center report.</p>
          </div>
        </SectionCard>
        <SectionCard title="Export options" description="Download aggregated report data for district analysis.">
          <div className="flex flex-col gap-2">
            <Button variant="outline" size="sm" className="w-full rounded-2xl gap-2 justify-start">
              <Download size={14} /> Download June 2026 Summary (CSV)
            </Button>
            <Button variant="outline" size="sm" className="w-full rounded-2xl gap-2 justify-start">
              <Download size={14} /> Download All Reports PDF Pack
            </Button>
            <Button variant="outline" size="sm" className="w-full rounded-2xl gap-2 justify-start">
              <Download size={14} /> Export Nutrition Summary Sheet
            </Button>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
