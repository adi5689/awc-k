import { useParams } from 'react-router-dom';
import { chartSeries, predictionRows } from '../../data/adminOfficialsData';
import { LinePanel, OpsMetricGrid, OpsPageIntro, SectionCard, StatusBadge, SummaryList } from '../../components/operations/OperationsUI';

export function OfficialsForecastDetail() {
  const { forecastId } = useParams();
  const forecast = predictionRows.find((row) => row.uploadId === forecastId || row.id === forecastId || row.center === forecastId) ?? predictionRows[0];

  return (
    <div className="space-y-6">
      <OpsPageIntro
        eyebrow="Forecast Detail"
        title={`${forecast.center} nutrition forecast`}
        description="Detailed forecast view with current status, historical trend, risk-factor breakdown, recommendation notes, and previous prediction batch references."
      />

      <OpsMetricGrid
        items={[
          { label: 'Current Forecast', value: forecast.riskLevel, detail: `${forecast.month} batch` },
          { label: 'Confidence Score', value: `${forecast.confidence}%`, detail: forecast.status },
          { label: 'High Risk Centers in Batch', value: String(forecast.highRiskCenters), detail: 'District comparison' },
          { label: 'Children Analyzed', value: String(Math.max(24, Math.round(forecast.centersAnalyzed / 6))), detail: 'For selected center cohort' },
        ]}
      />

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <LinePanel
          title="Historical forecast chart"
          description="Month-wise nutrition trend for the selected operational context."
          data={chartSeries.forecastTrend}
          lines={[
            { key: 'high', color: '#dc2626', name: 'High risk' },
            { key: 'medium', color: '#f59e0b', name: 'Medium risk' },
          ]}
        />
        <SectionCard title="Risk factor breakdown" description="Main issues associated with the current forecast.">
          <SummaryList
            items={[
              'MUAC measurements show a declining trend in the latest upload cycle.',
              'Growth monitoring coverage dropped in two linked hamlets.',
              'Report remarks indicate delayed home visits for identified MAM cases.',
            ]}
          />
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <SectionCard title="Current forecast" description="Center name and location">
          <p className="text-sm text-muted-foreground">{forecast.center} • {forecast.block}, {forecast.district}</p>
          <div className="mt-4"><StatusBadge value={forecast.riskLevel} /></div>
        </SectionCard>
        <SectionCard title="AI-generated recommendation" description="Suggested next action sequence.">
          <SummaryList
            items={[
              'Prioritize home visits for children with low MUAC before the next weekly review.',
              'Verify THR consumption and measurement completeness during the next supervisor visit.',
              'Escalate persistent SAM risk cases to referral pathway if risk remains high next batch.',
            ]}
          />
        </SectionCard>
        <SectionCard title="Previous prediction batches" description="Recent batch references for this center cluster.">
          <SummaryList items={['PB-6001 • June 2026', 'PB-5950 • May 2026', 'PB-5892 • April 2026']} />
        </SectionCard>
      </div>
    </div>
  );
}
