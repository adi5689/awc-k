import { predictionRows } from '../../data/adminOfficialsData';
import { ActionLinks, DataTable, LinePanel, OpsMetricGrid, OpsPageIntro, SectionCard, StatusBadge } from '../../components/operations/OperationsUI';

export function OfficialsNutritionForecast() {
  return (
    <div className="space-y-6">
      <OpsPageIntro
        eyebrow="Forecast Monitoring"
        title="Nutrition forecast"
        description="Officials can review center-wise nutrition forecast history, risk burden, confidence scores, and recommended next actions."
      />

      <OpsMetricGrid
        items={[
          { label: 'High Risk Centers', value: '7', detail: 'Immediate follow-up' },
          { label: 'Medium Risk Centers', value: '15', detail: 'Home visit and review needed' },
          { label: 'Low Risk Centers', value: '32', detail: 'Routine monitoring' },
          { label: 'Improving Centers', value: '11', detail: 'Risk reduced from last cycle' },
          { label: 'Declining Centers', value: '6', detail: 'Confidence-weighted drop' },
        ]}
      />

      <LinePanel
        title="Historical forecast chart"
        description="Month-wise district forecast context for monitored centers."
        data={[
          { month: 'Jan', high: 12, medium: 18, low: 24 },
          { month: 'Feb', high: 11, medium: 17, low: 26 },
          { month: 'Mar', high: 10, medium: 16, low: 28 },
          { month: 'Apr', high: 10, medium: 16, low: 28 },
          { month: 'May', high: 8, medium: 15, low: 31 },
          { month: 'Jun', high: 7, medium: 15, low: 32 },
        ]}
        lines={[
          { key: 'high', color: '#dc2626', name: 'High risk' },
          { key: 'medium', color: '#f59e0b', name: 'Medium risk' },
          { key: 'low', color: '#16a34a', name: 'Low risk' },
        ]}
      />

      <SectionCard title="Forecast table" description="Center-wise nutrition forecast with history access and risk-factor drilldowns.">
        <DataTable
          headers={['Center Name', 'Month', 'Children Analyzed', 'SAM Risk', 'MAM Risk', 'Underweight Risk', 'Stunting Risk', 'Forecast Status', 'Confidence Score', 'Trend', 'Actions']}
          rows={predictionRows.map((row) => [
            row.center,
            row.month,
            String(Math.max(24, row.centersAnalyzed / 6)),
            `${row.highRiskCenters}`,
            `${row.mediumRiskCenters}`,
            row.riskLevel === 'High' ? 'Elevated' : 'Moderate',
            row.riskLevel === 'High' ? 'Elevated' : row.riskLevel === 'Medium' ? 'Watch' : 'Stable',
            <StatusBadge key={`${row.id}-status`} value={row.riskLevel} />,
            `${row.confidence}%`,
            row.riskLevel === 'Low' ? 'Improving' : row.riskLevel === 'Medium' ? 'Stable' : 'Declining',
            <ActionLinks
              key={`${row.id}-actions`}
              links={[
                { label: 'View Forecast History', to: `/officials/forecast/${row.center}` },
                { label: 'View Risk Factors', to: `/officials/forecast/${row.center}` },
                { label: 'View Recommended Actions', to: `/officials/forecast/${row.center}` },
              ]}
            />,
          ])}
        />
      </SectionCard>
    </div>
  );
}
