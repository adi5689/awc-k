import { useMemo, useState } from 'react';
import { BadgeCheck } from 'lucide-react';
import { officialRows } from '../../data/adminOfficialsData';
import { ActionLinks, DataTable, InlineFormCard, OpsFilterBar, OpsPageIntro, SectionCard, StatusBadge } from '../../components/operations/OperationsUI';

export function AdminOfficialsManagement() {
  const [search, setSearch] = useState('');
  const [accessLevel, setAccessLevel] = useState('All Access');
  const [status, setStatus] = useState('All Status');

  const filtered = useMemo(() => officialRows.filter((row) => {
    const query = search.toLowerCase();
    const matchesQuery = !query || [row.id, row.name, row.designation, row.department, row.block].some((value) => value.toLowerCase().includes(query));
    const matchesAccess = accessLevel === 'All Access' || row.accessLevel === accessLevel;
    const matchesStatus = status === 'All Status' || row.loginStatus.toLowerCase() === status.toLowerCase();
    return matchesQuery && matchesAccess && matchesStatus;
  }), [search, accessLevel, status]);

  return (
    <div className="space-y-6">
      <OpsPageIntro
        eyebrow="Official Accounts"
        title="Officials management"
        description="Provision and monitor district and block officials who review forecasts, reports, and center status without exposing admin-only controls."
      />

      <SectionCard title="All officials" description="Role setup, area mapping, and account activity status.">
        <OpsFilterBar
          search={search}
          setSearch={setSearch}
          filters={[
            { label: 'Access Level', value: accessLevel, onChange: setAccessLevel, options: ['All Access', ...Array.from(new Set(officialRows.map((row) => row.accessLevel)))] },
            { label: 'Login Status', value: status, onChange: setStatus, options: ['All Status', 'Active', 'Pending', 'Warning'] },
          ]}
        />
        <div className="mt-5">
          <DataTable
            headers={['Official ID', 'Name', 'Designation', 'Department', 'Assigned District/Block', 'Access Level', 'Login Status', 'Last Active', 'Actions']}
            rows={filtered.map((row) => [
              row.id,
              <div key={row.id}>
                <p className="font-semibold">{row.name}</p>
                <p className="text-xs text-muted-foreground">{row.email}</p>
              </div>,
              row.designation,
              row.department,
              `${row.district} / ${row.block}`,
              row.accessLevel,
              <StatusBadge key={`${row.id}-status`} value={row.loginStatus.charAt(0).toUpperCase() + row.loginStatus.slice(1)} />,
              row.lastActive,
              <ActionLinks
                key={`${row.id}-actions`}
                links={[
                  { label: 'Generate Official ID and Password' },
                  { label: 'Reset Password' },
                  { label: 'Edit Official Details' },
                  { label: 'Assign Area' },
                  { label: 'Disable Account' },
                ]}
              />,
            ])}
          />
        </div>
      </SectionCard>

      <InlineFormCard
        title="Create official login"
        description="Provision a monitoring account for district or block officials with pre-defined access boundaries."
        fields={[
          'Official Name',
          'Designation',
          'Department',
          'Phone Number',
          'Email',
          'Assigned District',
          'Assigned Block',
          'Access Level',
          'Auto-generate Official ID',
          'Auto-generate Password',
        ]}
      />

      <SectionCard title="Access boundaries" description="Officials can monitor and review, but not administer core system assets unless permissions are expanded.">
        <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
          <BadgeCheck size={18} className="mt-0.5 text-emerald-700" />
          <p className="text-sm text-emerald-800">
            Monitoring accounts support dashboards, center details, nutrition forecasts, learning progress, alerts, and report review. Admin-only actions like core user creation, Poshan upload, or module publishing remain restricted.
          </p>
        </div>
      </SectionCard>
    </div>
  );
}
