import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { centerRows, reportRows } from '../../data/adminOfficialsData';
import { DataTable, DetailTabs, OpsMetricGrid, OpsPageIntro, SectionCard, StatusBadge, SummaryList } from '../../components/operations/OperationsUI';

export function OfficialsCenterDetails() {
  const { centerId } = useParams();
  const center = useMemo(() => centerRows.find((row) => row.id === centerId) ?? centerRows[0], [centerId]);

  return (
    <div className="space-y-6">
      <OpsPageIntro
        eyebrow="Center Detail View"
        title={center.name}
        description="Full center profile for officials with overview, beneficiaries, nutrition, learning, activity completion, reports, and alerts."
      />

      <OpsMetricGrid
        items={[
          { label: 'Center ID', value: center.id, detail: `${center.panchayat}, ${center.block}` },
          { label: 'Current Status', value: center.currentStatus, detail: `Last updated ${center.lastActive}` },
          { label: 'Nutrition Risk', value: center.nutritionRisk, detail: `${center.samCases} SAM / ${center.mamCases} MAM` },
          { label: 'Performance Score', value: `${center.performanceScore}%`, detail: `${center.learningCompletion}% learning completion` },
        ]}
      />

      <DetailTabs
        overview={
          <SectionCard title="Overview tab" description="Beneficiary summary, recent updates, performance score, current risk status, and monthly progress.">
            <SummaryList
              items={[
                `${center.childrenTracked} children, ${center.pregnantWomenTracked} pregnant women, ${center.lactatingMothersTracked} lactating mothers tracked.`,
                `Worker ${center.workerName} and supervisor ${center.supervisorName} are mapped to this center.`,
                `Attendance updates: ${center.attendanceUpdates}; report status: ${center.reportStatus}.`,
              ]}
            />
          </SectionCard>
        }
        beneficiaries={
          <SectionCard title="Beneficiaries tab" description="Children, maternal, and nutrition distribution.">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <Info label="Children count" value={String(center.childrenTracked)} />
              <Info label="Pregnant women count" value={String(center.pregnantWomenTracked)} />
              <Info label="Lactating mothers count" value={String(center.lactatingMothersTracked)} />
              <Info label="Nutrition breakdown" value={`${center.samCases} SAM / ${center.mamCases} MAM`} />
            </div>
          </SectionCard>
        }
        nutrition={
          <SectionCard title="Nutrition tab" description="Current nutrition status, forecast history, and growth monitoring status.">
            <SummaryList
              items={[
                `Current nutrition status is ${center.nutritionRisk}.`,
                'Growth monitoring coverage is under weekly review.',
                'Forecast history shows improvement in low-risk classification over the last two months.',
              ]}
            />
          </SectionCard>
        }
        learning={
          <SectionCard title="Learning tab" description="Module completion and learning status.">
            <div className="grid gap-4 md:grid-cols-3">
              <Info label="Module completion" value={`${center.learningCompletion}%`} />
              <Info label="Worker learning status" value="Active" />
              <Info label="Supervisor learning status" value="Reviewed" />
            </div>
          </SectionCard>
        }
        activities={
          <SectionCard title="Activities tab" description="Assigned and completed activity history.">
            <div className="grid gap-4 md:grid-cols-3">
              <Info label="Activities assigned" value="24" />
              <Info label="Activities completed" value={`${center.activityCompletion}%`} />
              <Info label="Recent activity" value="Healthy Plate Circle Time" />
            </div>
          </SectionCard>
        }
        reports={
          <SectionCard title="Reports tab" description="Monthly submitted reports, pending reports, and download actions.">
            <DataTable
              headers={['Report ID', 'Month', 'Submitted By', 'Status']}
              rows={reportRows.slice(0, 3).map((row) => [row.id, row.month, row.submittedBy, <StatusBadge key={row.id} value={row.status} />])}
            />
          </SectionCard>
        }
        alerts={
          <SectionCard title="Alerts tab" description="High risk, pending action, and missed update alerts.">
            <SummaryList
              items={[
                'Pending action alert: supervisor visit required for nutrition follow-up.',
                'Missed update alert: one hamlet has missing MUAC entries.',
                'High risk alert: monitor SAM cases in the next batch review.',
              ]}
            />
          </SectionCard>
        }
      />
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border/70 bg-muted/20 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{label}</p>
      <p className="mt-2 text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}
