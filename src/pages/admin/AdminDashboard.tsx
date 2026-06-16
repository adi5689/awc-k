import { Activity, BookOpen, BrainCircuit, ShieldAlert, UploadCloud, UserPlus, Users } from 'lucide-react';
import {
  adminSummaryCards,
  alertRows,
  chartSeries,
  recentActivities,
  recentUploads,
} from '../../data/adminOfficialsData';
import {
  ActionLinks,
  BarPanel,
  CTAButtonLink,
  DataTable,
  LinePanel,
  OpsMetricGrid,
  OpsPageIntro,
  PiePanel,
  SectionCard,
  SummaryList,
  StatusBadge,
} from '../../components/operations/OperationsUI';

export function AdminDashboard() {
  return (
    <div className="space-y-6">
      <OpsPageIntro
        eyebrow="Admin Command Centre"
        title="System-wide operations dashboard for centers, users, forecasts, and content."
        description="Monitor the health of the Anganwadi platform with a practical view of user provisioning, Poshan uploads, AI prediction readiness, learning coverage, and centers that need immediate follow-up."
        actions={
          <>
            <CTAButtonLink to="/admin/centers-users" label="Generate Center Login" />
            <CTAButtonLink to="/admin/officials-management" label="Generate Official Login" />
          </>
        }
      />

      <OpsMetricGrid
        items={adminSummaryCards.map((item, index) => ({
          ...item,
          icon: [Users, Users, Users, ShieldAlert, Users, Activity, Activity, BrainCircuit][index],
        }))}
      />

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <LinePanel
          title="Center performance trend"
          description="Overall performance score and the number of centers needing intervention over the last six months."
          data={chartSeries.performanceTrend}
          lines={[
            { key: 'score', color: '#0f766e', name: 'Performance score' },
            { key: 'attention', color: '#dc2626', name: 'Attention centers' },
          ]}
        />
        <PiePanel
          title="Nutrition risk distribution"
          description="Current district distribution from the latest prediction batch."
          data={chartSeries.nutritionRiskDistribution}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <LinePanel
          title="Upload history chart"
          description="Monthly Poshan upload cadence and total records received."
          data={chartSeries.uploadHistory}
          lines={[
            { key: 'uploads', color: '#2563eb', name: 'Uploads' },
            { key: 'records', color: '#16a34a', name: 'Records' },
          ]}
        />
        <BarPanel
          title="Learning completion overview"
          description="Current completion rate by role-specific module group."
          data={chartSeries.learningCompletionOverview}
          bars={[{ key: 'completion', color: '#0f766e', name: 'Completion %' }]}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <SectionCard
          title="Center-wise alert list"
          description="Operational issues that need admin attention before the next reporting cycle."
          action={<CTAButtonLink to="/admin/center-performance" label="Open Performance View" />}
        >
          <DataTable
            headers={['Center', 'Issue', 'Severity', 'Owner', 'Updated']}
            rows={alertRows.map((row) => [
              row.center,
              row.issue,
              <StatusBadge key={`${row.center}-severity`} value={row.severity} />,
              row.owner,
              row.updated,
            ])}
          />
        </SectionCard>
        <div className="space-y-6">
          <SectionCard
            title="Quick actions"
            description="Common admin workflows for account provisioning and data operations."
            action={<UserPlus size={18} className="text-emerald-700" />}
          >
            <ActionLinks
              links={[
                { label: 'Generate Center Login', to: '/admin/centers-users' },
                { label: 'Generate Official Login', to: '/admin/officials-management' },
                { label: 'Upload Poshan Tracker Data', to: '/admin/poshan-uploads' },
                { label: 'Add Learning Module', to: '/admin/learning-modules' },
                { label: 'Add Activity', to: '/admin/activities' },
              ]}
            />
          </SectionCard>
          <SectionCard title="Recent activities" description="Latest system and content operations.">
            <SummaryList items={recentActivities} />
          </SectionCard>
          <SectionCard title="Recent uploads" description="Latest incoming Poshan tracker events.">
            <SummaryList items={recentUploads} />
          </SectionCard>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <SectionCard title="Latest Poshan tracker upload status" description="The current file pipeline status after validation.">
          <div className="space-y-2 text-sm text-muted-foreground">
            <p className="font-semibold text-foreground">June 2026 feed received and processed successfully.</p>
            <p>5,482 records validated, 14 warnings resolved, batch locked for prediction use.</p>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <UploadCloud size={16} className="text-emerald-700" />
            <StatusBadge value="Completed" />
          </div>
        </SectionCard>
        <SectionCard title="AI prediction status" description="Current model processing health for the latest batch.">
          <div className="space-y-2 text-sm text-muted-foreground">
            <p className="font-semibold text-foreground">Batch `PB-6001` completed with 93% confidence.</p>
            <p>19 centers flagged high risk and routed to officials for follow-up review.</p>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <BrainCircuit size={16} className="text-emerald-700" />
            <StatusBadge value="Completed" />
          </div>
        </SectionCard>
        <SectionCard title="Learning and activities" description="Content operations summary for this month.">
          <div className="space-y-2 text-sm text-muted-foreground">
            <p className="font-semibold text-foreground">3 module updates and 2 activity changes published this cycle.</p>
            <p>Worker content adoption continues to outpace supervisor refresher completion.</p>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <BookOpen size={16} className="text-emerald-700" />
            <StatusBadge value="Published" />
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
