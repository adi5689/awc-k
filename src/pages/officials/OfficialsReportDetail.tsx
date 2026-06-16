import { useParams } from 'react-router-dom';
import { reportRows } from '../../data/adminOfficialsData';
import {
  ApprovalBar,
  OpsMetricGrid,
  OpsPageIntro,
  RemarkBox,
  SectionCard,
  StatGrid,
  StatusBadge,
} from '../../components/operations/OperationsUI';

export function OfficialsReportDetail() {
  const { reportId } = useParams();
  const report = reportRows.find((row) => row.id === reportId) ?? reportRows[0];

  return (
    <div className="space-y-6">
      <OpsPageIntro
        eyebrow="Report Detail"
        title={`${report.centerName} — Monthly Report`}
        description="Detailed monthly report review including center information, beneficiary statistics, nutrition status, AI forecast summary, learning and activity completion, and official approval workflow."
      />

      <OpsMetricGrid
        items={[
          { label: 'Report ID', value: report.id, detail: report.month },
          { label: 'Submitted By', value: report.submittedBy, detail: report.submissionDate !== '-' ? `Submitted ${report.submissionDate}` : 'Not yet submitted' },
          { label: 'Approval Status', value: report.status, detail: 'Current official review stage' },
          { label: 'Nutrition Summary', value: report.nutritionSummary.split(',')[0].trim(), detail: report.nutritionSummary },
        ]}
      />

      <ApprovalBar status={report.status} />

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard title="Center information" description="Center profile linked to this monthly report.">
          <StatGrid
            stats={[
              { label: 'Center Name', value: report.centerName },
              { label: 'Month', value: report.month },
              { label: 'Submitted By', value: report.submittedBy },
              { label: 'Submission Date', value: report.submissionDate !== '-' ? report.submissionDate : 'Pending' },
            ]}
          />
        </SectionCard>

        <SectionCard title="Beneficiary statistics" description="Key beneficiary counts from this report period.">
          <StatGrid
            stats={[
              { label: 'Children Tracked', value: '42', sub: '3–6 age group dominant' },
              { label: 'Pregnant Women', value: '7', sub: 'Monthly update complete' },
              { label: 'Lactating Mothers', value: '6', sub: '86% attendance recorded' },
              { label: 'Home Visits', value: '18', sub: 'This reporting cycle' },
            ]}
          />
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <SectionCard title="Nutrition status" description="Malnutrition indicators for this reporting period.">
          <div className="space-y-3">
            <div className="rounded-2xl border border-border/70 bg-muted/20 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Summary</p>
              <p className="mt-2 text-sm text-foreground">{report.nutritionSummary}</p>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge value={report.status === 'Approved' ? 'Low' : report.status === 'Review' ? 'High' : 'Medium'} />
              <span className="text-xs text-muted-foreground">Nutrition risk classification</span>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="AI forecast summary" description="Prediction model assessment linked to this center.">
          <div className="space-y-3">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Batch PB-6001</p>
              <p className="mt-2 text-sm font-semibold text-foreground">93% model confidence</p>
              <p className="mt-1 text-xs text-muted-foreground">Low risk classification for this center in June 2026 batch.</p>
            </div>
            <p className="text-xs text-muted-foreground">Last prediction: 15 Jun 2026 from upload UP-9001</p>
          </div>
        </SectionCard>

        <SectionCard title="Learning & activities" description="Training and activity completion for this month.">
          <div className="space-y-3">
            <div className="rounded-2xl border border-border/70 bg-muted/20 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Learning</p>
              <p className="mt-1 text-sm text-foreground">{report.learningSummary}</p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-muted/20 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Activities</p>
              <p className="mt-1 text-sm text-foreground">{report.activitySummary}</p>
            </div>
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <RemarkBox
          title="Worker Remarks"
          author={report.submittedBy}
          authorRole="Anganwadi Worker"
          content="Field visits completed for the month. Two absentees were followed up at home. MUAC measurements recorded for all tracked children. THR distribution completed by 10th of the month."
        />
        <RemarkBox
          title="Supervisor Remarks"
          author="Rajesh Kumar"
          authorRole="Supervisor, Bhawanipatna"
          content="Visited center on 8 Jun 2026. Verified beneficiary register, immunisation records, and measurement log. Suggested verifying MUAC values for one hamlet cluster before final report close."
        />
        <RemarkBox
          title="Official Comments"
          author="Dr. Anita Patel"
          authorRole="District Programme Officer"
          content="Report reviewed and pending final clearance. Approve once the MUAC measurement note from supervisor is addressed. All other indicators are within acceptable range."
        />
      </div>

      <SectionCard title="Approval decision" description="Take an action on this report after reviewing all sections above.">
        <ApprovalBar status={report.status} />
      </SectionCard>
    </div>
  );
}
