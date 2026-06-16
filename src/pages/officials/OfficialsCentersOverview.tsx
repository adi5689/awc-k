import { useMemo, useState } from 'react';
import { centerRows } from '../../data/adminOfficialsData';
import {
  ActionLinks,
  DataTable,
  OpsFilterBar,
  OpsPageIntro,
  ProgressBar,
  SectionCard,
  StatusBadge,
} from '../../components/operations/OperationsUI';

export function OfficialsCentersOverview() {
  const [search, setSearch] = useState('');
  const [risk, setRisk] = useState('All Levels');
  const [reportStatus, setReportStatus] = useState('All Reports');
  const [performanceStatus, setPerformanceStatus] = useState('All Status');

  const filtered = useMemo(() => centerRows.filter((row) => {
    const query = search.toLowerCase();
    const matchesQuery = !query || [row.id, row.name, row.block, row.workerName, row.supervisorName].some((v) => v.toLowerCase().includes(query));
    const matchesRisk = risk === 'All Levels' || row.nutritionRisk === risk;
    const matchesReport = reportStatus === 'All Reports' || row.reportStatus === reportStatus;
    const matchesPerformance = performanceStatus === 'All Status' || row.currentStatus === performanceStatus;
    return matchesQuery && matchesRisk && matchesReport && matchesPerformance;
  }), [search, risk, reportStatus, performanceStatus]);

  return (
    <div className="space-y-6">
      <OpsPageIntro
        eyebrow="Assigned Centers"
        title="Centers overview"
        description="Operational view of all monitored centers with status, forecast risk, learning progress, reporting status, and drill-down actions."
      />

      <SectionCard
        title="Center table"
        description="Search and filter by risk level, report status, and performance status. Click any action to open the center detail view."
      >
        <OpsFilterBar
          search={search}
          setSearch={setSearch}
          filters={[
            { label: 'Risk Level', value: risk, onChange: setRisk, options: ['All Levels', 'High', 'Medium', 'Low'] },
            { label: 'Report Status', value: reportStatus, onChange: setReportStatus, options: ['All Reports', 'Submitted', 'Pending', 'Review'] },
            { label: 'Performance Status', value: performanceStatus, onChange: setPerformanceStatus, options: ['All Status', 'On Track', 'Attention Needed', 'Escalated'] },
          ]}
        />
        <div className="mt-5">
          <DataTable
            headers={['Center', 'Location', 'Field Staff', 'Status & Risk', 'Learning Progress', 'Report', 'Actions']}
            rows={filtered.map((row) => [
              /* Center — ID + name stacked */
              <div key={`${row.id}-center`} className="min-w-[160px]">
                <p className="whitespace-nowrap font-mono text-xs text-muted-foreground">{row.id}</p>
                <p className="mt-0.5 font-semibold leading-snug text-foreground">{row.name}</p>
              </div>,

              /* Location — panchayat + block stacked */
              <div key={`${row.id}-loc`} className="min-w-[130px]">
                <p className="font-medium text-foreground">{row.panchayat}</p>
                <p className="text-xs text-muted-foreground">{row.block}</p>
              </div>,

              /* Field Staff — worker + supervisor stacked */
              <div key={`${row.id}-staff`} className="min-w-[140px]">
                <p className="font-medium text-foreground">{row.workerName}</p>
                <p className="text-xs text-muted-foreground">{row.supervisorName}</p>
              </div>,

              /* Status & Risk — two badges stacked */
              <div key={`${row.id}-status`} className="flex flex-col gap-1.5 min-w-[120px]">
                <StatusBadge value={row.currentStatus} />
                <StatusBadge value={row.nutritionRisk} />
              </div>,

              /* Learning progress — % bar */
              <div key={`${row.id}-learning`} className="min-w-[120px]">
                <ProgressBar value={row.learningCompletion} />
              </div>,

              /* Report — status badge + last active */
              <div key={`${row.id}-report`} className="min-w-[110px]">
                <StatusBadge value={row.reportStatus} />
                <p className="mt-1 text-xs text-muted-foreground">{row.lastActive}</p>
              </div>,

              /* Actions */
              <ActionLinks
                key={`${row.id}-actions`}
                links={[
                  { label: 'View Center Details', to: `/officials/center/${row.id}` },
                  { label: 'View Forecast', to: `/officials/forecast/${row.id}` },
                  { label: 'View Reports', to: `/officials/reports/${row.id}` },
                  { label: 'View Learning Details' },
                ]}
              />,
            ])}
          />
        </div>
      </SectionCard>
    </div>
  );
}
