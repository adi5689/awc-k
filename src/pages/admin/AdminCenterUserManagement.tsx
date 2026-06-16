import { useMemo, useState } from 'react';
import { KeyRound, Plus, Send } from 'lucide-react';
import { centerRows } from '../../data/adminOfficialsData';
import { ActionLinks, DataTable, InlineFormCard, OpsFilterBar, OpsPageIntro, SectionCard, StatusBadge } from '../../components/operations/OperationsUI';
import { Button } from '../../components/ui/button';

export function AdminCenterUserManagement() {
  const [search, setSearch] = useState('');
  const [block, setBlock] = useState('All Blocks');
  const [status, setStatus] = useState('All Status');

  const filtered = useMemo(() => centerRows.filter((row) => {
    const query = search.toLowerCase();
    const matchesQuery = !query || [row.id, row.name, row.workerName, row.supervisorName, row.block].some((value) => value.toLowerCase().includes(query));
    const matchesBlock = block === 'All Blocks' || row.block === block;
    const matchesStatus = status === 'All Status' || row.loginStatus.toLowerCase() === status.toLowerCase();
    return matchesQuery && matchesBlock && matchesStatus;
  }), [search, block, status]);

  return (
    <div className="space-y-6">
      <OpsPageIntro
        eyebrow="Admin Access Control"
        title="Center and user management"
        description="Create, assign, and maintain center logins with a compact operational view of worker assignments, supervisor coverage, account status, and performance."
        actions={<Button><Plus size={16} /> Create Center Login</Button>}
      />

      <SectionCard title="All centers" description="Login management, assignment, and center performance snapshot.">
        <OpsFilterBar
          search={search}
          setSearch={setSearch}
          filters={[
            { label: 'Block', value: block, onChange: setBlock, options: ['All Blocks', ...Array.from(new Set(centerRows.map((row) => row.block)))] },
            { label: 'Login Status', value: status, onChange: setStatus, options: ['All Status', 'Active', 'Pending', 'Warning', 'Inactive'] },
          ]}
        />
        <div className="mt-5">
          <DataTable
            headers={['Center ID', 'Center Name', 'Location', 'Assigned Worker', 'Assigned Supervisor', 'Login Status', 'Last Active', 'Performance Score', 'Actions']}
            rows={filtered.map((row) => [
              row.id,
              <div key={row.id}>
                <p className="font-semibold">{row.name}</p>
                <p className="text-xs text-muted-foreground">{row.address}</p>
              </div>,
              `${row.panchayat}, ${row.block}`,
              <div key={`${row.id}-worker`}>
                <p className="font-semibold">{row.workerName}</p>
                <p className="text-xs text-muted-foreground">{row.workerPhone}</p>
              </div>,
              <div key={`${row.id}-supervisor`}>
                <p className="font-semibold">{row.supervisorName}</p>
                <p className="text-xs text-muted-foreground">{row.supervisorPhone}</p>
              </div>,
              <StatusBadge key={`${row.id}-status`} value={row.loginStatus.charAt(0).toUpperCase() + row.loginStatus.slice(1)} />,
              row.lastActive,
              `${row.performanceScore}%`,
              <ActionLinks
                key={`${row.id}-actions`}
                links={[
                  { label: 'Generate Center ID and Password' },
                  { label: 'Reset Password' },
                  { label: 'Edit Center Details' },
                  { label: 'View Center Profile', to: `/admin/center-performance/${row.id}` },
                  { label: 'Disable Login' },
                  { label: 'Assign Worker' },
                  { label: 'Assign Supervisor' },
                ]}
              />,
            ])}
          />
        </div>
      </SectionCard>

      <InlineFormCard
        title="Create center login"
        description="Provision a new center account with auto-generated credentials and worker-supervisor assignment details."
        fields={[
          'Center Name',
          'District',
          'Block',
          'Panchayat/Ward',
          'Address',
          'Worker Name',
          'Worker Phone',
          'Supervisor Name',
          'Supervisor Phone',
          'Auto-generate Center ID',
          'Auto-generate Password',
        ]}
      />

      <div className="grid gap-6 md:grid-cols-3">
        <SectionCard title="Credential workflow" description="How new center access is issued.">
          <div className="space-y-3 text-sm text-muted-foreground">
            <p><span className="font-semibold text-foreground">1.</span> Validate center and field mapping.</p>
            <p><span className="font-semibold text-foreground">2.</span> Generate center ID and a temporary password.</p>
            <p><span className="font-semibold text-foreground">3.</span> Send credentials to worker and supervisor contacts.</p>
          </div>
        </SectionCard>
        <SectionCard title="Assignment readiness" description="Quick provisioning status.">
          <div className="flex items-center gap-3">
            <KeyRound size={18} className="text-emerald-700" />
            <div>
              <p className="font-semibold text-foreground">92% centers assigned</p>
              <p className="text-sm text-muted-foreground">14 centers still need supervisor mapping.</p>
            </div>
          </div>
        </SectionCard>
        <SectionCard title="Delivery" description="Credentials can be shared through approved channels.">
          <div className="flex items-center gap-3">
            <Send size={18} className="text-emerald-700" />
            <div>
              <p className="font-semibold text-foreground">SMS and printed handover supported</p>
              <p className="text-sm text-muted-foreground">Track acknowledgment before first login.</p>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
