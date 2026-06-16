import { useMemo, useState } from 'react';
import { learningDetailRows } from '../../data/adminOfficialsData';
import {
  ActionLinks,
  DataTable,
  OpsFilterBar,
  OpsMetricGrid,
  OpsPageIntro,
  ProgressBar,
  SectionCard,
  StatusBadge,
} from '../../components/operations/OperationsUI';

export function OfficialsLearningDetails() {
  const [search, setSearch] = useState('');
  const [completionStatus, setCompletionStatus] = useState('All Status');
  const [month, setMonth] = useState('June 2026');

  const filtered = useMemo(() =>
    learningDetailRows.filter((row) => {
      const query = search.toLowerCase();
      const matchesSearch = !query || [row.centerName, row.workerName, row.supervisorName].some((v) => v.toLowerCase().includes(query));
      const matchesStatus = completionStatus === 'All Status' || row.status === completionStatus;
      return matchesSearch && matchesStatus && month === 'June 2026';
    }),
    [search, completionStatus, month]
  );

  const avgCompletion = Math.round(learningDetailRows.reduce((acc, r) => acc + r.completionPercentage, 0) / learningDetailRows.length);
  const excellentCount = learningDetailRows.filter((r) => r.status === 'Excellent').length;
  const delayedCount = learningDetailRows.filter((r) => r.status === 'Delayed').length;
  const totalModulesAssigned = learningDetailRows.reduce((acc, r) => acc + r.modulesAssigned, 0);
  const totalModulesCompleted = learningDetailRows.reduce((acc, r) => acc + r.modulesCompleted, 0);

  return (
    <div className="space-y-6">
      <OpsPageIntro
        eyebrow="Learning Review"
        title="Center-wise learning details"
        description="Track module completion, assessment performance, and last learning activity for workers and supervisors across all assigned centers."
      />

      <OpsMetricGrid
        items={[
          { label: 'Total Modules Assigned', value: String(totalModulesAssigned), detail: `Across ${learningDetailRows.length} centers` },
          { label: 'Total Modules Completed', value: String(totalModulesCompleted), detail: `${Math.round((totalModulesCompleted / totalModulesAssigned) * 100)}% of total` },
          { label: 'Avg Completion Rate', value: `${avgCompletion}%`, detail: 'All assigned centers combined' },
          { label: 'Excellent Centers', value: String(excellentCount), detail: '90%+ completion this cycle' },
          { label: 'Delayed Centers', value: String(delayedCount), detail: 'Below 65% completion' },
          { label: 'On Track Centers', value: String(learningDetailRows.length - excellentCount - delayedCount), detail: '65–89% completion range' },
          { label: 'Avg Assessment Score', value: `${Math.round(learningDetailRows.reduce((acc, r) => acc + r.assessmentScore, 0) / learningDetailRows.length)}%`, detail: 'Mean quiz performance' },
          { label: 'Cycle', value: 'June 2026', detail: 'Current reporting window' },
        ]}
      />

      <SectionCard title="Learning details table" description="Training progress with completion progress bars and drilldown actions for each center.">
        <OpsFilterBar
          search={search}
          setSearch={setSearch}
          filters={[
            { label: 'Completion Status', value: completionStatus, onChange: setCompletionStatus, options: ['All Status', 'Excellent', 'On Track', 'Delayed'] },
            { label: 'Month', value: month, onChange: setMonth, options: ['June 2026', 'May 2026'] },
          ]}
        />
        <div className="mt-5">
          <DataTable
            headers={['Center Name', 'Worker Name', 'Supervisor Name', 'Modules Assigned', 'Modules Completed', 'Completion %', 'Last Activity', 'Assessment Score', 'Status', 'Actions']}
            rows={filtered.map((row) => [
              <div key={row.centerName}>
                <p className="font-semibold">{row.centerName}</p>
              </div>,
              row.workerName,
              row.supervisorName,
              String(row.modulesAssigned),
              String(row.modulesCompleted),
              <div key={`${row.centerName}-progress`} className="min-w-[140px]">
                <ProgressBar value={row.completionPercentage} />
              </div>,
              <div key={`${row.centerName}-activity`}>
                <p className="text-sm">{row.lastLearningActivity}</p>
              </div>,
              <div key={`${row.centerName}-score`}>
                <ProgressBar value={row.assessmentScore} />
              </div>,
              <StatusBadge key={`${row.centerName}-status`} value={row.status} />,
              <ActionLinks
                key={`${row.centerName}-actions`}
                links={[
                  { label: 'View Module Progress' },
                  { label: 'View Worker Learning History' },
                  { label: 'Download Learning Report' },
                ]}
              />,
            ])}
          />
        </div>
      </SectionCard>

      <div className="grid gap-6 md:grid-cols-2">
        <SectionCard title="Top performing centers" description="Centers with highest learning completion this cycle.">
          <div className="space-y-4">
            {[...learningDetailRows]
              .sort((a, b) => b.completionPercentage - a.completionPercentage)
              .slice(0, 3)
              .map((row) => (
                <div key={row.centerName} className="flex items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-foreground truncate">{row.centerName}</p>
                    <p className="text-xs text-muted-foreground">{row.workerName}</p>
                  </div>
                  <div className="w-40">
                    <ProgressBar value={row.completionPercentage} />
                  </div>
                </div>
              ))}
          </div>
        </SectionCard>
        <SectionCard title="Centers needing support" description="Centers where learning progress is below expectations.">
          <div className="space-y-4">
            {[...learningDetailRows]
              .sort((a, b) => a.completionPercentage - b.completionPercentage)
              .slice(0, 3)
              .map((row) => (
                <div key={row.centerName} className="flex items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-foreground truncate">{row.centerName}</p>
                    <p className="text-xs text-muted-foreground">{row.workerName}</p>
                  </div>
                  <div className="w-40">
                    <ProgressBar value={row.completionPercentage} />
                  </div>
                </div>
              ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
