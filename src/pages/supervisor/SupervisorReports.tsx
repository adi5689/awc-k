import { useState } from 'react';
import { mockAWCs } from '../../data/mockData';
import { FileText, Download, Building2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { cn } from '../../utils';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { downloadCsv, downloadExcelHtml } from '../../utils/exportFiles';

export function SupervisorReports() {
  const [selectedAWC, setSelectedAWC] = useState<string>('all');
  const [isGenerating, setIsGenerating] = useState(false);

  const filteredAWCs = selectedAWC === 'all' ? mockAWCs : mockAWCs.filter(a => a.id === selectedAWC);

  const buildExportRows = () => filteredAWCs.map((awc) => ({
    awc_id: awc.id,
    centre_name: awc.name,
    worker_name: awc.workerName,
    block_id: awc.blockId,
    total_children: awc.totalChildren,
    present_today: awc.presentToday,
    attendance_rate_percent: awc.attendanceRate,
    normal_nutrition: awc.nutritionBreakdown.normal,
    mam_cases: awc.nutritionBreakdown.mam,
    sam_cases: awc.nutritionBreakdown.sam,
    critical_cases: awc.criticalCases,
    avg_learning_score: awc.avgLearningScore,
    sync_status: awc.syncStatus,
    active_alerts: awc.alerts.join(' | ') || 'None',
  }));

  const exportCsv = () => {
    downloadCsv(`supervisor-awc-report-${selectedAWC === 'all' ? 'block' : selectedAWC}.csv`, buildExportRows());
  };

  const exportExcel = () => {
    downloadExcelHtml(`supervisor-awc-report-${selectedAWC === 'all' ? 'block' : selectedAWC}.xls`, buildExportRows());
  };

  const handleGeneratePDF = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      // Initialize PDF (A4 Portrait)
      const doc = new jsPDF();
      
      // Setup Title
      doc.setFontSize(22);
      doc.setTextColor(30, 41, 59); // slate-800
      doc.text("Anganwadi Center Detailed Report", 14, 22);
      
      doc.setFontSize(12);
      doc.setTextColor(100, 116, 139); // slate-500
      const subtitle = selectedAWC === 'all' ? 'Block-Level Aggregate Report' : `Centre: ${filteredAWCs[0]?.name}`;
      doc.text(subtitle, 14, 32);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 38);

      let currentY = 48;

      if (selectedAWC !== 'all') {
        const awc = filteredAWCs[0];
        
        // Single Center Report
        const seed = awc.name.charCodeAt(0) + awc.name.charCodeAt(awc.name.length-1);
        const thrCoverage = Math.floor((seed % 30) + 70);
        const mddScore = ((seed % 20) / 10 + 3).toFixed(1);
        const immCoverage = Math.floor((seed % 25) + 75);

        // Section: Demographics
        doc.setFontSize(14);
        doc.setTextColor(15, 23, 42);
        doc.text("1. Demographics & Attendance", 14, currentY);
        currentY += 6;
        
        autoTable(doc, {
          startY: currentY,
          head: [['Worker Name', 'Block', 'Total Enrolled', 'Present Today', 'Attendance Rate']],
          body: [[awc.workerName, awc.blockId, awc.totalChildren, awc.presentToday, `${awc.attendanceRate}%`]],
          theme: 'grid',
          headStyles: { fillColor: [16, 185, 129] },
          margin: { top: 10 }
        });
        // @ts-expect-error jspdf-autotable adds lastAutoTable at runtime.
        currentY = doc.lastAutoTable.finalY + 15;

        // Section: Health & Growth
        doc.setFontSize(14);
        doc.setTextColor(15, 23, 42);
        doc.text("2. Child Health & Malnutrition (Growth)", 14, currentY);
        currentY += 6;
        
        autoTable(doc, {
          startY: currentY,
          head: [['Status', 'Normal', 'MAM (Moderate)', 'SAM (Severe)', 'Critical Cases']],
          body: [[awc.status, awc.nutritionBreakdown.normal, awc.nutritionBreakdown.mam, awc.nutritionBreakdown.sam, awc.criticalCases]],
          theme: 'grid',
          headStyles: { fillColor: [56, 189, 248] },
        });
        // @ts-expect-error jspdf-autotable adds lastAutoTable at runtime.
        currentY = doc.lastAutoTable.finalY + 15;

        // Section: Nutrition & Learning
        doc.setFontSize(14);
        doc.setTextColor(15, 23, 42);
        doc.text("3. Nutrition, Health & Learning Metrics", 14, currentY);
        currentY += 6;
        
        autoTable(doc, {
          startY: currentY,
          head: [['Take Home Ration', 'MDD Score (1-5)', 'Immunization Rate', 'Avg Learning Score']],
          body: [[`${thrCoverage}%`, mddScore, `${immCoverage}%`, `${awc.avgLearningScore}%`]],
          theme: 'grid',
          headStyles: { fillColor: [245, 158, 11] },
        });
        // @ts-expect-error jspdf-autotable adds lastAutoTable at runtime.
        currentY = doc.lastAutoTable.finalY + 15;

        // Active Alerts
        if (awc.alerts && awc.alerts.length > 0) {
          doc.setFontSize(14);
          doc.setTextColor(225, 29, 72);
          doc.text("4. Active System Alerts", 14, currentY);
          currentY += 6;
          
          const alertBody = awc.alerts.map(a => [a]);
          autoTable(doc, {
            startY: currentY,
            head: [['Alert Description']],
            body: alertBody,
            theme: 'grid',
            headStyles: { fillColor: [225, 29, 72] },
          });
        }

      } else {
        // Block Level Report
        doc.setFontSize(14);
        doc.setTextColor(15, 23, 42);
        doc.text("Block Centres Overview", 14, currentY);
        currentY += 6;
        
        const tableBody = mockAWCs.map(awc => {
          return [
            awc.name,
            `${awc.presentToday}/${awc.totalChildren}`,
            `${awc.attendanceRate}%`,
            awc.criticalCases.toString(),
            `${awc.avgLearningScore}%`,
            awc.status
          ];
        });

        autoTable(doc, {
          startY: currentY,
          head: [['Centre Name', 'Attendance', 'Rate', 'Critical', 'Learning', 'Status']],
          body: tableBody,
          theme: 'grid',
          headStyles: { fillColor: [15, 23, 42] },
        });
      }

      doc.save(`Supervisor_Report_${selectedAWC === 'all' ? 'Block_Aggregate' : selectedAWC}.pdf`);
      setIsGenerating(false);
    }, 800); // slight timeout for UI effect
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-10 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <FileText className="text-emerald-500" size={28} />
          Report Generator
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">Select an Anganwadi Center or the entire block to generate and download beautifully formatted PDF reports for official records.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Report Configuration */}
        <div className="lg:col-span-1 space-y-6">
          <div className="p-6 rounded-2xl border border-border bg-card shadow-sm">
            <h3 className="text-lg font-bold text-foreground mb-4">Configuration</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Select Target</label>
                <select 
                  className="w-full border border-border bg-muted/50 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
                  value={selectedAWC}
                  onChange={(e) => setSelectedAWC(e.target.value)}
                >
                  <option value="all">Entire Block Aggregate</option>
                  <optgroup label="Individual Centres">
                    {mockAWCs.map(awc => (
                      <option key={awc.id} value={awc.id}>{awc.name}</option>
                    ))}
                  </optgroup>
                </select>
              </div>

              <div className="pt-4 border-t border-border">
                <label className="block text-sm font-semibold text-foreground mb-2">Report Contents</label>
                <ul className="space-y-2.5">
                  <li className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                    <span>Demographics & Attendance Rates</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                    <span>Malnutrition Breakdown (SAM/MAM)</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                    <span>Nutrition (THR) & Immunization</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                    <span>Learning & Cognitive Metrics</span>
                  </li>
                </ul>
              </div>

              <button 
                onClick={handleGeneratePDF}
                disabled={isGenerating}
                className={cn(
                  "w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold text-white shadow-lg transition-all",
                  isGenerating 
                    ? "bg-emerald-500/50 cursor-not-allowed" 
                    : "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 hover:shadow-emerald-500/25 active:scale-[0.98]"
                )}
              >
                {isGenerating ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Download size={20} />
                )}
                {isGenerating ? 'Generating PDF...' : 'Download PDF Report'}
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={exportCsv}
                  className="flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-3 text-xs font-bold text-foreground hover:bg-muted"
                >
                  <Download size={16} />
                  CSV
                </button>
                <button
                  type="button"
                  onClick={exportExcel}
                  className="flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-3 text-xs font-bold text-foreground hover:bg-muted"
                >
                  <FileText size={16} />
                  Excel
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Preview/Synopsis */}
        <div className="lg:col-span-2">
          <div className="p-6 rounded-2xl border border-border bg-card shadow-sm h-full flex flex-col">
            <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <Building2 size={20} className="text-indigo-500" />
              Report Synopsis
            </h3>
            
            {selectedAWC === 'all' ? (
              <div className="bg-muted/30 rounded-xl p-8 flex-1 border border-border/50 flex flex-col items-center justify-center text-center">
                <FileText size={48} className="text-slate-300 dark:text-slate-600 mb-4" />
                <h4 className="text-xl font-bold text-foreground">Block Level Aggregate</h4>
                <p className="text-muted-foreground p-3 max-w-sm mx-auto">This report will compile data for all <b>{mockAWCs.length}</b> supervised Anganwadi Centers into a single comprehensive ledger.</p>
              </div>
            ) : (
              <div className="space-y-4 flex-1">
                {filteredAWCs.map(awc => (
                  <div key={awc.id} className="bg-muted/30 rounded-xl p-5 border border-border/50 animate-fade-in">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-xl font-bold text-foreground">{awc.name}</h4>
                        <p className="text-sm text-muted-foreground">{awc.workerName} • {awc.blockId}</p>
                      </div>
                      <span className={cn(
                        "px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full",
                        awc.status === 'Good' ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400" :
                        awc.status === 'Warning' ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400" :
                        "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400"
                      )}>
                        {awc.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="bg-background rounded-lg p-3 border border-border">
                        <p className="text-xs text-muted-foreground uppercase font-semibold mb-1">Attendance</p>
                        <p className="text-lg font-bold text-foreground">{awc.attendanceRate}%</p>
                      </div>
                      <div className="bg-background rounded-lg p-3 border border-border">
                        <p className="text-xs text-muted-foreground uppercase font-semibold mb-1">Learning</p>
                        <p className="text-lg font-bold text-foreground">{awc.avgLearningScore}%</p>
                      </div>
                      <div className="bg-background rounded-lg p-3 border border-border">
                        <p className="text-xs text-muted-foreground uppercase font-semibold mb-1">Malnourished</p>
                        <p className="text-lg font-bold text-foreground">{awc.nutritionBreakdown.mam + awc.nutritionBreakdown.sam}</p>
                      </div>
                      <div className="bg-background rounded-lg p-3 border border-border">
                        <p className="text-xs text-muted-foreground uppercase font-semibold mb-1">Critical</p>
                        <p className={cn("text-lg font-bold", awc.criticalCases > 0 ? "text-red-500" : "text-emerald-500")}>{awc.criticalCases}</p>
                      </div>
                    </div>

                    {awc.alerts.length > 0 && (
                      <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg p-4">
                        <h5 className="text-sm font-bold text-red-800 dark:text-red-400 mb-2 flex items-center gap-2">
                          <AlertTriangle size={16} /> Urgent Alerts that will be included:
                        </h5>
                        <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                          {awc.alerts.map((a, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-red-400" />
                              {a}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
