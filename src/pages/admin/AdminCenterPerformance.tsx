import { useMemo, useState } from 'react';
import { centerRows } from '../../data/adminOfficialsData';
import { ActionLinks, DataTable, OpsFilterBar, OpsPageIntro, SectionCard, StatusBadge } from '../../components/operations/OperationsUI';

export function AdminCenterPerformance() {
  const [search, setSearch] = useState('');
  const [block, setBlock] = useState('All Blocks');
  const [month, setMonth] = useState('June 2026');
  const [performance, setPerformance] = useState('All Levels');

  const filtered = useMemo(() => centerRows.filter((row) => {
    const query = search.toLowerCase();
    const matchesQuery = !query || [row.id, row.name, row.workerName, row.supervisorName, row.block].some((value) => value.toLowerCase().includes(query));
    const matchesBlock = block === 'All Blocks' || row.block === block;
    const matchesPerformance = performance === 'All Levels'
      || (performance === 'High Performing' && row.performanceScore >= 85)
      || (performance === 'Needs Attention' && row.performanceScore < 70)
      || (performance === 'Stable' && row.performanceScore >= 70 && row.performanceScore < 85);
    return matchesQuery && matchesBlock && matchesPerformance && month === 'June 2026';
  }), [search, block, month, performance]);

  return (
    <div className="space-y-6">
      <OpsPageIntro
        eyebrow="Center Performance"
        title="Center-wise performance"
        description="Track attendance updates, nutrition risk, learning completion, activity completion, and overall performance for each center in one operational table."
      />

      <SectionCard title="Center performance table" description="Search and filter by district, block, center, month, and performance level.">
        <OpsFilterBar
          search={search}
          setSearch={setSearch}
          filters={[
            { label: 'Block', value: block, onChange: setBlock, options: ['All Blocks', ...Array.from(new Set(centerRows.map((row) => row.block)))] },
            { label: 'Month', value: month, onChange: setMonth, options: ['June 2026'] },
            { label: 'Performance', value: performance, onChange: setPerformance, options: ['All Levels', 'High Performing', 'Stable', 'Needs Attention'] },
          ]}
        />
        <div className="mt-5">
          <DataTable
            headers={['Center Name', 'Worker Name', 'Supervisor Name', 'Children Tracked', 'SAM/MAM Cases', 'Attendance/Visit Updates', 'Learning Completion', 'Activity Completion', 'Nutrition Forecast Risk', 'Overall Performance Score', 'Actions']}
            rows={filtered.map((row) => [
              row.name,
              row.workerName,
              row.supervisorName,
              String(row.childrenTracked),
              `${row.samCases} / ${row.mamCases}`,
              row.attendanceUpdates,
              `${row.learningCompletion}%`,
              `${row.activityCompletion}%`,
              <StatusBadge key={`${row.id}-risk`} value={row.nutritionRisk} />,
              `${row.performanceScore}%`,
              <ActionLinks key={`${row.id}-actions`} links={[{ label: 'View Center Profile', to: `/admin/center-performance/${row.id}` }]} />,
            ])}
          />
        </div>
      </SectionCard>
    </div>
  );
}
