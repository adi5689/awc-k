import { useState } from 'react';
import { CalendarDays, Download, FileBarChart2, HeartPulse, ShieldCheck, Sparkles, Users } from 'lucide-react';
import { Alert } from '../../components/ui/alert';
import { Button } from '../../components/ui/button';
import { managedChildren } from '../../data/childMonitoringData';
import { downloadWorkerReport, downloadWorkerReportCsv, downloadWorkerReportExcel, type WorkerReportKind } from '../../utils/reportPdf';
import { cn } from '../../utils';

type ReportCard = {
  id: WorkerReportKind;
  title: string;
  description: string;
  icon: typeof FileBarChart2;
  tone: 'slate' | 'sky' | 'emerald' | 'amber' | 'rose' | 'violet';
  bullets: string[];
};

const reportCards: ReportCard[] = [
  {
    id: 'daily',
    title: 'Daily Summary Report',
    description: 'One-day attendance, health alert, immunization, and next-action summary for the centre.',
    icon: CalendarDays,
    tone: 'emerald',
    bullets: ['Today attendance', 'Immunization status', 'Health follow-up list'],
  },
  {
    id: 'overall',
    title: 'Overall Detail Report',
    description: 'A complete centre snapshot with child profile, immunization, health, and attendance in one PDF.',
    icon: Sparkles,
    tone: 'slate',
    bullets: ['All students included', 'Centre overview', 'Cross-domain child summary'],
  },
  {
    id: 'immunization',
    title: 'Immunization Report',
    description: 'Lists vaccine completion status and pending vaccines for each child in a clean schedule summary.',
    icon: ShieldCheck,
    tone: 'amber',
    bullets: ['Vaccine-wise status', 'Completion count', 'Due vaccine list'],
  },
  {
    id: 'health',
    title: 'Health Report',
    description: 'Exports current symptom alerts and hospital follow-up indicators for every student in the centre.',
    icon: HeartPulse,
    tone: 'rose',
    bullets: ['Current symptom summary', 'Hospital visit flag', 'Alert count by child'],
  },
  {
    id: 'attendance',
    title: 'Attendance Report',
    description: 'Monthly attendance report with present, absent, percentage, and risk flag for all students.',
    icon: Users,
    tone: 'violet',
    bullets: ['Latest month coverage', 'Attendance percentage', 'Regular / monitor / at-risk flag'],
  },
];

function toneClasses(tone: ReportCard['tone']) {
  if (tone === 'sky') return 'bg-sky-100 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300';
  if (tone === 'emerald') return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300';
  if (tone === 'amber') return 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300';
  if (tone === 'rose') return 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300';
  if (tone === 'violet') return 'bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300';
  return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
}

export function Reports() {
  const [message, setMessage] = useState('Choose a report to generate a downloadable file.');

  const handleDownload = (report: ReportCard, format: 'pdf' | 'csv' | 'excel') => {
    if (format === 'csv') {
      downloadWorkerReportCsv(report.id);
    } else if (format === 'excel') {
      downloadWorkerReportExcel(report.id);
    } else {
      downloadWorkerReport(report.id);
    }
    setMessage(`${report.title} generated as ${format.toUpperCase()} for ${managedChildren.length} students.`);
  };

  return (
    <div className="space-y-8 pb-10 animate-fade-in">
      <section className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm">
        <div className="bg-[linear-gradient(135deg,rgba(15,23,42,1),rgba(30,41,59,0.96),rgba(14,116,144,0.88))] px-6 py-7">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-300">Centre Reporting Hub</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-white">Professional PDF Reports</h2>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Download polished centre reports covering overall detail, immunization, health, and attendance for all students.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {[
                { label: 'Students', value: `${managedChildren.length}` },
                { label: 'Report Types', value: `${reportCards.length}` },
                { label: 'Formats', value: 'PDF/CSV/XLS' },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-sm">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-300">{item.label}</p>
                  <p className="mt-2 text-xl font-bold text-white">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {reportCards.map((report) => (
          <article
            key={report.id}
            className="rounded-[1.75rem] border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
          >
            <div className={cn('flex h-12 w-12 items-center justify-center rounded-2xl', toneClasses(report.tone))}>
              <report.icon size={22} />
            </div>
            <h3 className="mt-4 text-xl font-semibold text-foreground">{report.title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{report.description}</p>

            <div className="mt-5 space-y-2">
              {report.bullets.map((bullet) => (
                <div key={bullet} className="rounded-xl border border-border bg-background/70 px-3 py-2 text-sm text-foreground">
                  {bullet}
                </div>
              ))}
            </div>

            <div className="mt-6 grid gap-2">
              <span className="text-xs font-medium text-muted-foreground">Includes details of all students</span>
              <div className="grid grid-cols-3 gap-2">
                <Button className="rounded-xl gap-2" onClick={() => handleDownload(report, 'pdf')}>
                  <Download size={14} />
                  PDF
                </Button>
                <Button variant="outline" className="rounded-xl" onClick={() => handleDownload(report, 'csv')}>
                  CSV
                </Button>
                <Button variant="outline" className="rounded-xl" onClick={() => handleDownload(report, 'excel')}>
                  Excel
                </Button>
              </div>
            </div>
          </article>
        ))}
      </section>

      <Alert tone="info" title="Download Status" description={message} />
    </div>
  );
}
