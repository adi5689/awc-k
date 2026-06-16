import { useMemo, useState } from 'react';
import { reportRows } from '../../data/adminOfficialsData';
import { ActionLinks, DataTable, OpsFilterBar, OpsMetricGrid, OpsPageIntro, SectionCard, StatusBadge } from '../../components/operations/OperationsUI';

export function OfficialsMonthlyReports() {
  const [month, setMonth] = useState('June 2026');
  const [status, setStatus] = useState('All Status');

  const filtered = useMemo(() => reportRows.filter((row) => {
    const matchesMonth = month === 'All Months' || row.month === month;
    const matchesStatus = status === 'All Status' || row.status === status;
    return matchesMonth && matchesStatus;
  }), [month, status]);

  return (
    <div className="space-y-6">
      <OpsPageIntro
        eyebrow="Report Review"
        title="Monthly reports"
        description="Review center-wise monthly reports with approval workflow, comments, and status tracking."
      />

      <OpsMetricGrid
        items={[
          { label: 'Reports Submitted', value: '51', detail: 'For June 2026' },
          { label: 'Reports Pending', value: '3', detail: 'Awaiting submission' },
          { label: 'Reports Approved', value: '45', detail: 'Cleared by officials' },
          { label: 'Reports Requiring Review', value: '6', detail: 'Need comments or revision' },
        ]}
      />

      <SectionCard title="Monthly report register" description="Filter by month, year, district, block, center, and report status.">
        <OpsFilterBar
          filters={[
            { label: 'Month', value: month, onChange: setMonth, options: ['All Months', 'June 2026', 'May 2026'] },
            { label: 'Report Status', value: status, onChange: setStatus, options: ['All Status', 'Submitted', 'Pending', 'Approved', 'Review'] },
          ]}
        />
        <div className="mt-5">
          <DataTable
            headers={['Report ID', 'Center Name', 'Month', 'Submitted By', 'Submission Date', 'Status', 'Nutrition Summary', 'Learning Summary', 'Activity Summary', 'Actions']}
            rows={filtered.map((row) => [
              row.id,
              row.centerName,
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
                  { label: 'View Report', to: `/officials/reports/${row.id}` },
                  { label: 'Download PDF', to: `/officials/reports/${row.id}` },
                  { label: 'Approve Report', to: `/officials/reports/${row.id}` },
                  { label: 'Mark for Review', to: `/officials/reports/${row.id}` },
                  { label: 'Add Comment', to: `/officials/reports/${row.id}` },
                ]}
              />,
            ])}
          />
        </div>
      </SectionCard>
    </div>
  );
}
