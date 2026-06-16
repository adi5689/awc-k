import { uploadRows, poshanPreviewRows } from '../../data/adminOfficialsData';
import { ActionLinks, DataTable, OpsPageIntro, SectionCard, StatusBadge, UploadWorkspace } from '../../components/operations/OperationsUI';
import { Button } from '../../components/ui/button';

export function AdminPoshanUploads() {
  return (
    <div className="space-y-6">
      <OpsPageIntro
        eyebrow="Data Intake"
        title="Poshan tracker uploads"
        description="Stage monthly Poshan Tracker data for validation, preview, error resolution, and AI model processing. Only validated and complete uploads are passed to the prediction model."
      />

      <UploadWorkspace />

      <SectionCard title="Data preview — June 2026 upload" description="First 5 rows from the staged upload file. Review for completeness before final submission to the AI model.">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr className="border-b border-border">
                {['Center Code', 'Beneficiary', 'MUAC', 'Weight', 'Height', 'Status'].map((h) => (
                  <th key={h} className="px-4 py-3 text-xs font-black uppercase tracking-[0.16em] text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {poshanPreviewRows.map((row, i) => (
                <tr key={i} className="border-b border-border/60 last:border-b-0 align-middle">
                  <td className="px-4 py-3 text-sm font-mono text-foreground">{row.center}</td>
                  <td className="px-4 py-3 text-sm text-foreground">{row.beneficiary}</td>
                  <td className="px-4 py-3 text-sm text-foreground">{row.muac}</td>
                  <td className="px-4 py-3 text-sm text-foreground">{row.weight}</td>
                  <td className="px-4 py-3 text-sm text-foreground">{row.height}</td>
                  <td className="px-4 py-3">
                    <StatusBadge value={row.status === 'Normal' ? 'Low' : row.status === 'SAM' ? 'Critical' : 'Medium'} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Showing 5 of 5,482 staged records · 2 SAM · 1 MAM · 0 blocking errors</p>
          <Button size="sm">Submit to AI Model</Button>
        </div>
      </SectionCard>

      <SectionCard title="Previous upload history" description="Track file lineage, processing status, and prediction readiness across upload cycles.">
        <DataTable
          headers={['Upload ID', 'File Name', 'Uploaded By', 'Upload Date', 'Month/Year', 'Number of Records', 'Processing Status', 'Prediction Status', 'Actions']}
          rows={uploadRows.map((row) => [
            row.id,
            <div key={row.id}>
              <p className="font-semibold font-mono text-sm">{row.fileName}</p>
            </div>,
            row.uploadedBy,
            row.uploadDate,
            row.monthYear,
            row.records.toLocaleString(),
            <StatusBadge key={`${row.id}-processing`} value={row.processingStatus} />,
            <StatusBadge key={`${row.id}-prediction`} value={row.predictionStatus} />,
            <ActionLinks
              key={`${row.id}-actions`}
              links={[
                { label: 'View Upload Details' },
                { label: 'Download Original File' },
                { label: 'View Processed Data' },
                { label: 'Re-run Prediction' },
                { label: 'Delete Upload' },
              ]}
            />,
          ])}
        />
      </SectionCard>
    </div>
  );
}
