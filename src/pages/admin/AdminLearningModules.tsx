import { moduleRows } from '../../data/adminOfficialsData';
import { ActionLinks, DataTable, OpsMetricGrid, OpsPageIntro, ProgressBar, SectionCard, StatusBadge } from '../../components/operations/OperationsUI';
import { Button } from '../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { BookOpen, Upload } from 'lucide-react';

export function AdminLearningModules() {
  const published = moduleRows.filter((m) => m.status === 'Published').length;
  const draft = moduleRows.filter((m) => m.status === 'Draft').length;
  const avgCompletion = Math.round(moduleRows.filter((m) => m.status === 'Published').reduce((acc, m) => acc + m.completionRate, 0) / published);

  return (
    <div className="space-y-6">
      <OpsPageIntro
        eyebrow="Learning Management"
        title="Learning modules"
        description="Add, update, publish, and track training content for workers and supervisors with language-aware operational modules and built-in quiz support."
        actions={<Button><BookOpen size={15} /> Add Module</Button>}
      />

      <OpsMetricGrid
        items={[
          { label: 'Published Modules', value: String(published), detail: 'Live and accessible' },
          { label: 'Draft Modules', value: String(draft), detail: 'Pending review or content' },
          { label: 'Avg Completion Rate', value: `${avgCompletion}%`, detail: 'Across all published modules' },
          { label: 'Total Modules', value: String(moduleRows.length), detail: 'All roles combined' },
        ]}
      />

      <SectionCard title="Module catalogue" description="Operational training content with publish status and completion visibility.">
        <DataTable
          headers={['Module Title', 'Target Role', 'Category', 'Language', 'Status', 'Completion Rate', 'Last Updated', 'Actions']}
          rows={moduleRows.map((row) => [
            <div key={row.id}>
              <p className="font-semibold">{row.title}</p>
              <p className="text-xs text-muted-foreground">{row.duration} · {row.assessmentEnabled ? 'Quiz enabled' : 'No quiz'}</p>
            </div>,
            <span key={`${row.id}-role`} className="inline-flex rounded-full border border-border/70 bg-muted/30 px-2.5 py-1 text-xs font-semibold">{row.targetRole}</span>,
            row.category,
            row.language,
            <StatusBadge key={`${row.id}-status`} value={row.status} />,
            <div key={`${row.id}-progress`} className="min-w-[120px]">
              {row.status === 'Published' ? <ProgressBar value={row.completionRate} /> : <span className="text-xs text-muted-foreground">—</span>}
            </div>,
            row.lastUpdated,
            <ActionLinks
              key={`${row.id}-actions`}
              links={[
                { label: 'Edit Module' },
                { label: 'Upload PDF/Video/Image' },
                { label: 'Publish/Unpublish' },
                { label: 'View Completion Details' },
                { label: 'Delete' },
              ]}
            />,
          ])}
        />
      </SectionCard>

      <SectionCard
        title="Add or update module"
        description="Module form fields required before publishing training content to center teams."
        action={<Button size="sm">Save Module</Button>}
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <label className="block md:col-span-2">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Module Title</span>
            <input className="h-11 w-full rounded-2xl border border-input bg-background px-4 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20" placeholder="e.g. MUAC Measurement Technique" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Estimated Duration</span>
            <input className="h-11 w-full rounded-2xl border border-input bg-background px-4 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20" placeholder="e.g. 20 min" />
          </label>
          <label className="block md:col-span-3">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Description</span>
            <textarea rows={3} className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 resize-none" placeholder="Brief description of the module content and learning objective..." />
          </label>
          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Target Role</p>
            <Select>
              <SelectTrigger className="h-11 rounded-2xl"><SelectValue placeholder="Select role" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Worker">Worker</SelectItem>
                <SelectItem value="Supervisor">Supervisor</SelectItem>
                <SelectItem value="Both">Both</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Category</p>
            <Select>
              <SelectTrigger className="h-11 rounded-2xl"><SelectValue placeholder="Select category" /></SelectTrigger>
              <SelectContent>
                {['Nutrition', 'Health', 'Monitoring', 'Operations', 'Community'].map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Language</p>
            <Select>
              <SelectTrigger className="h-11 rounded-2xl"><SelectValue placeholder="Select language" /></SelectTrigger>
              <SelectContent>
                {['Odia', 'Hindi', 'English'].map((l) => (
                  <SelectItem key={l} value={l}>{l}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Publish Status</p>
            <Select>
              <SelectTrigger className="h-11 rounded-2xl"><SelectValue placeholder="Select status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Draft">Save as Draft</SelectItem>
                <SelectItem value="Published">Publish Now</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Quiz / Assessment</p>
            <Select>
              <SelectTrigger className="h-11 rounded-2xl"><SelectValue placeholder="Assessment" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="enabled">Enabled</SelectItem>
                <SelectItem value="disabled">Disabled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Upload area */}
        <div className="mt-5 rounded-[1.5rem] border-2 border-dashed border-emerald-200 bg-emerald-50/60 p-6 text-center">
          <Upload size={20} className="mx-auto text-emerald-600" />
          <p className="mt-2 text-sm font-bold text-emerald-800">Upload module content</p>
          <p className="mt-1 text-xs text-emerald-700">PDF, MP4, or image files · Max 100 MB per file</p>
          <Button size="sm" variant="outline" className="mt-4 rounded-xl">Select File</Button>
        </div>
      </SectionCard>
    </div>
  );
}
