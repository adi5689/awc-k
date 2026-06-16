import { useMemo, useState } from 'react';
import { chartSeries, predictionRows } from '../../data/adminOfficialsData';
import { DataTable, LinePanel, OpsFilterBar, OpsPageIntro, OpsMetricGrid, PiePanel, SectionCard, StatusBadge } from '../../components/operations/OperationsUI';

export function AdminPredictions() {
  const [district, setDistrict] = useState('All Districts');
  const [block, setBlock] = useState('All Blocks');
  const [month, setMonth] = useState('All Months');
  const [riskLevel, setRiskLevel] = useState('All Levels');

  const filtered = useMemo(() => predictionRows.filter((row) => {
    const matchesDistrict = district === 'All Districts' || row.district === district;
    const matchesBlock = block === 'All Blocks' || row.block === block;
    const matchesMonth = month === 'All Months' || row.month === month;
    const matchesRisk = riskLevel === 'All Levels' || row.riskLevel === riskLevel;
    return matchesDistrict && matchesBlock && matchesMonth && matchesRisk;
  }), [district, block, month, riskLevel]);

  return (
    <div className="space-y-6">
      <OpsPageIntro
        eyebrow="AI Forecast Desk"
        title="AI predictions"
        description="Review prediction batches, risk breakdowns, and month-wise forecast signals generated from validated Poshan tracker uploads."
      />

      <OpsMetricGrid
        items={[
          { label: 'Prediction Batch ID', value: 'PB-6001', detail: 'Latest locked batch' },
          { label: 'Related Upload', value: 'UP-9001', detail: 'June 2026 source feed' },
          { label: 'Total Centers Analyzed', value: '186', detail: 'Across all onboarded centers' },
          { label: 'Model Confidence', value: '93%', detail: 'Latest batch confidence score' },
        ]}
      />

      <OpsFilterBar
        filters={[
          { label: 'District', value: district, onChange: setDistrict, options: ['All Districts', ...Array.from(new Set(predictionRows.map((row) => row.district)))] },
          { label: 'Block', value: block, onChange: setBlock, options: ['All Blocks', ...Array.from(new Set(predictionRows.map((row) => row.block)))] },
          { label: 'Month', value: month, onChange: setMonth, options: ['All Months', ...Array.from(new Set(predictionRows.map((row) => row.month)))] },
          { label: 'Risk Level', value: riskLevel, onChange: setRiskLevel, options: ['All Levels', 'High', 'Medium', 'Low'] },
        ]}
      />

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <LinePanel
          title="Month-wise prediction trend"
          description="Forecasted center risk movement across recent monthly batches."
          data={chartSeries.forecastTrend}
          lines={[
            { key: 'high', color: '#dc2626', name: 'High risk' },
            { key: 'medium', color: '#f59e0b', name: 'Medium risk' },
            { key: 'low', color: '#16a34a', name: 'Low risk' },
          ]}
        />
        <PiePanel title="Malnutrition risk distribution" description="Latest risk grouping for the selected cohort." data={chartSeries.nutritionRiskDistribution} />
      </div>

      <SectionCard title="Prediction batches and center-wise risk comparison" description="Batch summary plus risk-level access to center-level results.">
        <DataTable
          headers={['Prediction Batch ID', 'Related Upload', 'Prediction Date', 'Total Centers Analyzed', 'High Risk Centers', 'Medium Risk Centers', 'Low Risk Centers', 'Model Confidence', 'Status']}
          rows={filtered.map((row) => [
            row.id,
            row.uploadId,
            row.predictionDate,
            String(row.centersAnalyzed),
            String(row.highRiskCenters),
            String(row.mediumRiskCenters),
            String(row.lowRiskCenters),
            `${row.confidence}%`,
            <StatusBadge key={`${row.id}-status`} value={row.status} />,
          ])}
        />
      </SectionCard>
    </div>
  );
}
