import { activityRows } from '../../data/adminOfficialsData';
import { ActionLinks, DataTable, OpsMetricGrid, OpsPageIntro, SectionCard, StatusBadge } from '../../components/operations/OperationsUI';
import { Button } from '../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { ClipboardList, Upload } from 'lucide-react';

export function AdminActivities() {
  const published = activityRows.filter((a) => a.status === 'Published').length;
  const draft = activityRows.filter((a) => a.status === 'Draft').length;
  const review = activityRows.filter((a) => a.status === 'Review').length;

  return (
    <div className="space-y-6">
      <OpsPageIntro
        eyebrow="Activity Content"
        title="Activities"
        description="Manage practical classroom and nutrition activity content with clear age-group targeting, materials lists, step-by-step instructions, and publish controls."
        actions={<Button><ClipboardList size={15} /> Add Activity</Button>}
      />

      <OpsMetricGrid
        items={[
          { label: 'Published Activities', value: String(published), detail: 'Live for center teams' },
          { label: 'Under Review', value: String(review), detail: 'Pending approval or content' },
          { label: 'Draft Activities', value: String(draft), detail: 'Work in progress' },
          { label: 'Total Activities', value: String(activityRows.length), detail: 'All categories combined' },
        ]}
      />

      <SectionCard title="Activity list" description="Published and in-progress activity content for center teams.">
        <DataTable
          headers={['Activity Name', 'Target Age Group', 'Category', 'Required Materials', 'Status', 'Last Updated', 'Actions']}
          rows={activityRows.map((row) => [
            <div key={row.id}>
              <p className="font-semibold">{row.name}</p>
              <p className="text-xs text-muted-foreground">Target role: {row.targetRole}</p>
            </div>,
            <span key={`${row.id}-age`} className="inline-flex rounded-full border border-border/70 bg-muted/30 px-2.5 py-1 text-xs font-semibold">{row.ageGroup}</span>,
            <span
              key={`${row.id}-cat`}
              className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold border ${row.category === 'Nutrition' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : row.category === 'Health' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}
            >
              {row.category}
            </span>,
            <span key={`${row.id}-mat`} className="text-xs text-muted-foreground">{row.materials}</span>,
            <StatusBadge key={`${row.id}-status`} value={row.status} />,
            row.lastUpdated,
            <ActionLinks
              key={`${row.id}-actions`}
              links={[
                { label: 'Edit Activity' },
                { label: 'Upload Instructions' },
                { label: 'Publish/Unpublish' },
                { label: 'Delete' },
              ]}
            />,
          ])}
        />
      </SectionCard>

      <SectionCard
        title="Add or update activity"
        description="Core content fields for publishing a center activity with step-by-step instructions."
        action={<Button size="sm">Save Activity</Button>}
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <label className="block md:col-span-2">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Activity Name</span>
            <input className="h-11 w-full rounded-2xl border border-input bg-background px-4 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20" placeholder="e.g. Healthy Plate Circle Time" />
          </label>
          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Target Age Group</p>
            <Select>
              <SelectTrigger className="h-11 rounded-2xl"><SelectValue placeholder="Select age group" /></SelectTrigger>
              <SelectContent>
                {['3-4 years', '4-5 years', '5-6 years', '4-6 years', 'Adults'].map((a) => (
                  <SelectItem key={a} value={a}>{a}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <label className="block md:col-span-3">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Description</span>
            <textarea rows={2} className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 resize-none" placeholder="Brief description of the activity and its learning goal..." />
          </label>
          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Category</p>
            <Select>
              <SelectTrigger className="h-11 rounded-2xl"><SelectValue placeholder="Select category" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Nutrition">Nutrition</SelectItem>
                <SelectItem value="Education">Education</SelectItem>
                <SelectItem value="Health">Health</SelectItem>
              </SelectContent>
            </Select>
          </div>
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
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Publish Status</p>
            <Select>
              <SelectTrigger className="h-11 rounded-2xl"><SelectValue placeholder="Select status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Draft">Save as Draft</SelectItem>
                <SelectItem value="Review">Submit for Review</SelectItem>
                <SelectItem value="Published">Publish Now</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <label className="block md:col-span-2">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Materials Needed</span>
            <input className="h-11 w-full rounded-2xl border border-input bg-background px-4 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20" placeholder="e.g. Food cards, chart, scissors" />
          </label>
          <label className="block md:col-span-3">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Step-by-step Instructions</span>
            <textarea rows={4} className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 resize-none" placeholder="Step 1: Gather all materials...&#10;Step 2: Arrange children in a circle...&#10;Step 3: ..." />
          </label>
        </div>

        <div className="mt-5 rounded-[1.5rem] border-2 border-dashed border-emerald-200 bg-emerald-50/60 p-6 text-center">
          <Upload size={20} className="mx-auto text-emerald-600" />
          <p className="mt-2 text-sm font-bold text-emerald-800">Upload activity resources</p>
          <p className="mt-1 text-xs text-emerald-700">Images, PDF instruction cards, or demonstration videos · Max 50 MB</p>
          <Button size="sm" variant="outline" className="mt-4 rounded-xl">Select File</Button>
        </div>
      </SectionCard>
    </div>
  );
}
