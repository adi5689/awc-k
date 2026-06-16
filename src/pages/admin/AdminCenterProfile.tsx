import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { centerRows, chartSeries, reportRows } from '../../data/adminOfficialsData';
import { DataTable, DetailTabs, LinePanel, OpsMetricGrid, OpsPageIntro, SectionCard, StatusBadge, SummaryList } from '../../components/operations/OperationsUI';

export function AdminCenterProfile() {
  const { centerId } = useParams();
  const center = useMemo(() => centerRows.find((row) => row.id === centerId) ?? centerRows[0], [centerId]);

  return (
    <div className="space-y-6">
      <OpsPageIntro
        eyebrow="Center Profile"
        title={`${center.name} performance detail`}
        description="Detailed center profile combining user assignments, beneficiary counts, nutrition signals, AI forecast, learning progress, activity completion, and monthly report history."
      />

      <OpsMetricGrid
        items={[
          { label: 'Overall Performance Score', value: `${center.performanceScore}%`, detail: center.currentStatus },
          { label: 'Beneficiaries', value: String(center.childrenTracked + center.pregnantWomenTracked + center.lactatingMothersTracked), detail: 'Children, pregnant women, lactating mothers' },
          { label: 'Nutrition Forecast Risk', value: center.nutritionRisk, detail: `${center.samCases} SAM and ${center.mamCases} MAM cases` },
          { label: 'Learning Completion', value: `${center.learningCompletion}%`, detail: `${center.activityCompletion}% activity completion` },
        ]}
      />

      <DetailTabs
        overview={
          <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
            <SectionCard title="Center overview" description="Current operational summary.">
              <div className="grid gap-4 md:grid-cols-2">
                <InfoRow label="Center ID" value={center.id} />
                <InfoRow label="Location" value={`${center.panchayat}, ${center.block}`} />
                <InfoRow label="Worker" value={`${center.workerName} • ${center.workerPhone}`} />
                <InfoRow label="Supervisor" value={`${center.supervisorName} • ${center.supervisorPhone}`} />
                <InfoRow label="Monthly report status" value={center.reportStatus} />
                <InfoRow label="Current status" value={center.currentStatus} />
              </div>
            </SectionCard>
            <LinePanel
              title="Performance trend chart"
              data={chartSeries.performanceTrend}
              lines={[
                { key: 'score', color: '#0f766e', name: 'Performance score' },
                { key: 'attention', color: '#dc2626', name: 'Attention centers' },
              ]}
            />
          </div>
        }
        beneficiaries={
          <SectionCard title="Beneficiary summary" description="Population and monitoring mix for the selected center.">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <InfoRow label="Children count" value={String(center.childrenTracked)} />
              <InfoRow label="Pregnant women count" value={String(center.pregnantWomenTracked)} />
              <InfoRow label="Lactating mothers count" value={String(center.lactatingMothersTracked)} />
              <InfoRow label="Age-group breakdown" value="3-6 years dominant" />
            </div>
          </SectionCard>
        }
        nutrition={
          <div className="space-y-6">
            <SectionCard title="Nutrition status" description="Current burden and risk notes.">
              <div className="grid gap-4 md:grid-cols-3">
                <InfoRow label="Current nutrition risk" value={center.nutritionRisk} />
                <InfoRow label="SAM" value={String(center.samCases)} />
                <InfoRow label="MAM" value={String(center.mamCases)} />
              </div>
            </SectionCard>
            <LinePanel
              title="AI forecast"
              description="District trend context for the selected center."
              data={chartSeries.forecastTrend}
              lines={[
                { key: 'high', color: '#dc2626', name: 'High risk centers' },
                { key: 'medium', color: '#f59e0b', name: 'Medium risk centers' },
              ]}
            />
          </div>
        }
        learning={
          <SectionCard title="Learning progress" description="Training and learning delivery summary.">
            <div className="grid gap-4 md:grid-cols-3">
              <InfoRow label="Module completion" value={`${center.learningCompletion}%`} />
              <InfoRow label="Worker status" value="Active learner" />
              <InfoRow label="Supervisor status" value="Visit review up to date" />
            </div>
          </SectionCard>
        }
        activities={
          <SectionCard title="Activity completion" description="Assigned activity operations and recent completion.">
            <div className="grid gap-4 md:grid-cols-3">
              <InfoRow label="Activity completion" value={`${center.activityCompletion}%`} />
              <InfoRow label="Assigned this month" value="24 activities" />
              <InfoRow label="Recent update" value="Healthy Plate Circle Time" />
            </div>
          </SectionCard>
        }
        reports={
          <SectionCard title="Monthly report history" description="Recent submissions and status for this center.">
            <DataTable
              headers={['Report ID', 'Month', 'Submitted By', 'Submission Date', 'Status']}
              rows={reportRows.slice(0, 2).map((row) => [row.id, row.month, row.submittedBy, row.submissionDate, <StatusBadge key={row.id} value={row.status} />])}
            />
          </SectionCard>
        }
        alerts={
          <SectionCard title="Alerts and recommendations" description="Current center-level risks and recommended actions.">
            <SummaryList
              items={[
                'Schedule supervisor visit within 72 hours if MUAC measurements remain incomplete.',
                'Verify pending monthly report remarks before approval.',
                'Continue close watch on attendance if updates drop below 80% next cycle.',
              ]}
            />
          </SectionCard>
        }
      />
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border/70 bg-muted/20 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{label}</p>
      <p className="mt-2 text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}
