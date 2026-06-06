// ============================================================
// ADMIN REPORTS - Summary reports page
// ============================================================

import { useState, useEffect } from 'react';
import { mockBlocks, districtKPIs } from '../../data/mockData';
import { cn, simulateAPI, formatIndianNumber } from '../../utils';
import { DashboardSkeleton } from '../../components/ui/loading-skeleton';
import { FileText, Download, Printer, Calendar, FileSpreadsheet } from 'lucide-react';
import { downloadCsv, downloadExcelHtml } from '../../utils/exportFiles';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export function AdminReports() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    simulateAPI(null, 800).then(() => setLoading(false));
  }, []);

  if (loading) return <DashboardSkeleton />;

  const reportRows = mockBlocks.map((block) => ({
    block_name: block.name,
    awcs: block.totalAWCs,
    children: block.totalChildren,
    avg_learning_percent: block.avgLearningScore,
    nutrition_risk_percent: block.nutritionRiskPercent,
    performance: block.performance,
    reporting_period: 'January-June 2026',
    district: 'Kalahandi',
  }));

  const exportCsv = () => downloadCsv('kalahandi-icds-performance-janjun-2026.csv', reportRows);
  const exportExcel = () => downloadExcelHtml('kalahandi-icds-performance-janjun-2026.xls', reportRows);
  const exportPdf = () => {
    const doc = new jsPDF({ orientation: 'landscape' });
    doc.setFontSize(18);
    doc.text('Kalahandi District - ICDS Performance Summary', 14, 18);
    doc.setFontSize(10);
    doc.text('Report period: January-June 2026 | Monthly and quarterly NITI ADP-ready extract', 14, 26);
    autoTable(doc, {
      startY: 34,
      head: [['Block Name', 'AWCs', 'Children', 'Avg Learning', 'Nutrition Risk', 'Performance']],
      body: reportRows.map((row) => [
        row.block_name,
        String(row.awcs),
        String(row.children),
        `${row.avg_learning_percent}%`,
        `${row.nutrition_risk_percent}%`,
        row.performance,
      ]),
      theme: 'grid',
      headStyles: { fillColor: [88, 28, 135] },
    });
    doc.save('kalahandi-icds-performance-janjun-2026.pdf');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <FileText size={24} className="text-purple-600" />
            Reports
          </h2>
          <p className="text-sm text-muted-foreground mt-1">District-level performance reports</p>
        </div>
        <div className="flex gap-2">
          <button onClick={exportCsv} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-card text-sm font-medium hover:bg-accent transition-colors">
            <Download size={14} /> Export CSV
          </button>
          <button onClick={exportExcel} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-card text-sm font-medium hover:bg-accent transition-colors">
            <FileSpreadsheet size={14} /> Excel
          </button>
          <button onClick={exportPdf} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-card text-sm font-medium hover:bg-accent transition-colors">
            <FileText size={14} /> PDF
          </button>
          <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-card text-sm font-medium hover:bg-accent transition-colors">
            <Printer size={14} /> Print
          </button>
        </div>
      </div>

      {/* District Summary */}
      <div className="p-6 rounded-xl border border-border bg-card">
        <div className="flex items-center gap-2 mb-4">
          <Calendar size={16} className="text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Report Period: January-June 2026</span>
        </div>
        <h3 className="text-lg font-bold text-foreground mb-4">Kalahandi District - ICDS Performance Summary</h3>
        <div className="mb-4 flex flex-wrap gap-2">
          {['Monthly ICDS', 'Quarterly NITI ADP', 'POSHAN nutrition', 'Supervisor follow-up'].map((label) => (
            <span key={label} className="rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-xs font-bold text-purple-800 dark:border-purple-900 dark:bg-purple-950/30 dark:text-purple-200">
              {label}
            </span>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-border">
                <th className="text-left py-3 px-4 text-xs font-bold text-muted-foreground uppercase">Block Name</th>
                <th className="text-center py-3 px-4 text-xs font-bold text-muted-foreground uppercase">AWCs</th>
                <th className="text-center py-3 px-4 text-xs font-bold text-muted-foreground uppercase">Children</th>
                <th className="text-center py-3 px-4 text-xs font-bold text-muted-foreground uppercase">Avg Learning</th>
                <th className="text-center py-3 px-4 text-xs font-bold text-muted-foreground uppercase">Nutrition Risk</th>
                <th className="text-center py-3 px-4 text-xs font-bold text-muted-foreground uppercase">Performance</th>
              </tr>
            </thead>
            <tbody>
              {mockBlocks.map((block, i) => (
                <tr key={block.id} className="border-b border-border/50 hover:bg-accent/50 transition-colors animate-fade-in opacity-0" style={{ animationDelay: `${i * 0.05}s`, animationFillMode: 'forwards' }}>
                  <td className="py-3 px-4 font-medium text-foreground">{block.name}</td>
                  <td className="py-3 px-4 text-center text-foreground">{block.totalAWCs}</td>
                  <td className="py-3 px-4 text-center text-foreground">{formatIndianNumber(block.totalChildren)}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={cn('font-semibold', block.avgLearningScore >= 65 ? 'text-emerald-600' : block.avgLearningScore >= 50 ? 'text-amber-600' : 'text-red-600')}>
                      {block.avgLearningScore}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={cn('font-semibold', block.nutritionRiskPercent <= 15 ? 'text-emerald-600' : block.nutritionRiskPercent <= 25 ? 'text-amber-600' : 'text-red-600')}>
                      {block.nutritionRiskPercent}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={cn(
                      'px-2.5 py-1 rounded-full text-xs font-semibold',
                      block.performance === 'Good' ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400' :
                      block.performance === 'Average' ? 'bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400' :
                      'bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-400'
                    )}>{block.performance}</span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-border bg-accent/30">
                <td className="py-3 px-4 font-bold text-foreground">District Total</td>
                <td className="py-3 px-4 text-center font-bold text-foreground">{districtKPIs.totalAWCs}</td>
                <td className="py-3 px-4 text-center font-bold text-foreground">{formatIndianNumber(districtKPIs.totalChildren)}</td>
                <td className="py-3 px-4 text-center font-bold text-blue-600">
                  {Math.round(mockBlocks.reduce((a, b) => a + b.avgLearningScore, 0) / mockBlocks.length)}%
                </td>
                <td className="py-3 px-4 text-center font-bold text-amber-600">
                  {Math.round(mockBlocks.reduce((a, b) => a + b.nutritionRiskPercent, 0) / mockBlocks.length)}%
                </td>
                <td className="py-3 px-4 text-center font-bold text-foreground">—</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
