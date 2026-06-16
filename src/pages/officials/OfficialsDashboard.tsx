import { alertRows, centerRows, chartSeries, officialDashboardCards } from '../../data/adminOfficialsData';
import { BarPanel, CTAButtonLink, DataTable, LinePanel, OpsMetricGrid, OpsPageIntro, PiePanel, SectionCard, StatusBadge } from '../../components/operations/OperationsUI';

export function OfficialsDashboard() {
  return (
    <div className="space-y-6">
      <OpsPageIntro
        eyebrow="Officials Monitoring"
        title="Assigned center monitoring dashboard"
        description="Track center status, nutrition forecasts, report submissions, and learning progress across assigned districts and blocks."
        actions={<CTAButtonLink to="/officials/reports" label="Open Monthly Reports" />}
      />

      <OpsMetricGrid items={officialDashboardCards} />

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <PiePanel
          title="Overall center status"
          description="Assigned centers grouped by current risk profile."
          data={[
            { name: 'On Track', value: centerRows.filter((row) => row.currentStatus === 'On Track').length },
            { name: 'Attention Needed', value: centerRows.filter((row) => row.currentStatus === 'Attention Needed').length },
            { name: 'Escalated', value: centerRows.filter((row) => row.currentStatus === 'Escalated').length },
          ]}
        />
        <LinePanel
          title="Monthly report submission trend"
          description="Report submission progress over recent cycles."
          data={chartSeries.reportSubmissionTrend}
          lines={[
            { key: 'submitted', color: '#16a34a', name: 'Submitted' },
            { key: 'pending', color: '#dc2626', name: 'Pending' },
          ]}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <LinePanel
          title="Nutrition risk forecast by center"
          description="High, medium, and low risk center counts by month."
          data={chartSeries.forecastTrend}
          lines={[
            { key: 'high', color: '#dc2626', name: 'High risk' },
            { key: 'medium', color: '#f59e0b', name: 'Medium risk' },
            { key: 'low', color: '#16a34a', name: 'Low risk' },
          ]}
        />
        <BarPanel
          title="Learning progress chart"
          description="Role completion status for monitored centers."
          data={chartSeries.learningCompletionOverview}
          bars={[{ key: 'completion', color: '#2563eb', name: 'Completion %' }]}
        />
      </div>

      <SectionCard title="High-risk center list" description="Centers needing immediate review by officials.">
        <DataTable
          headers={['Center', 'Block', 'Nutrition Risk', 'Performance Score', 'Last Report Submitted', 'Actions']}
          rows={centerRows.filter((row) => row.nutritionRisk === 'High').map((row) => [
            row.name,
            row.block,
            <StatusBadge key={`${row.id}-risk`} value={row.nutritionRisk} />,
            `${row.performanceScore}%`,
            row.reportStatus,
            <CTAButtonLink key={`${row.id}-action`} to={`/officials/center/${row.id}`} label="View Center Details" />,
          ])}
        />
      </SectionCard>

      <SectionCard title="Recent alerts" description="Latest unresolved monitoring alerts.">
        <DataTable
          headers={['Center', 'Issue', 'Severity', 'Updated']}
          rows={alertRows.map((row) => [row.center, row.issue, <StatusBadge key={`${row.center}-severity`} value={row.severity} />, row.updated])}
        />
      </SectionCard>
    </div>
  );
}
