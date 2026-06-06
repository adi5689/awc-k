import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { downloadCsv, downloadExcelHtml } from './exportFiles';
import {
  consolidatedAttendanceHistory,
  dashboardHealthSnapshot,
  healthLogsSeed,
  immunizationByChild,
  managedChildren,
  getVaccineCompletionCount,
} from '../data/childMonitoringData';

export type WorkerReportKind =
  | 'overall'
  | 'immunization'
  | 'health'
  | 'attendance'
  | 'daily';

type ReportMetric = {
  label: string;
  value: string;
};

type ReportDefinition = {
  title: string;
  subtitle: string;
  fileName: string;
  summary: ReportMetric[];
  columns: string[];
  rows: string[][];
};

const vaccineLabels = [
  { key: 'BCG', label: 'BCG' },
  { key: 'OPV', label: 'OPV' },
  { key: 'DPT', label: 'DPT' },
  { key: 'Measles', label: 'Measles' },
  { key: 'vitaminA', label: 'Vitamin A' },
] as const;

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function getLatestAttendanceBlock() {
  return consolidatedAttendanceHistory[consolidatedAttendanceHistory.length - 1];
}

function getHealthAlerts(childId: string) {
  const record = healthLogsSeed.find((item) => item.childId === childId);
  if (!record) return 'None';

  const alerts = [
    record.fever && 'Fever',
    record.diarrhea && 'Diarrhea',
    record.cough && 'Cough',
    record.hospitalVisit && 'Hospital Visit',
  ].filter(Boolean);

  return alerts.length ? alerts.join(', ') : 'None';
}

function getOverallReport(): ReportDefinition {
  const latestAttendance = getLatestAttendanceBlock();
  const rows = managedChildren.map((child) => {
    const immunization = immunizationByChild[child.id];
    const attendance = latestAttendance.stats.find((entry) => entry.childId === child.id);

    return [
      child.name,
      `${child.ageLabel} / ${child.gender}`,
      child.parentName,
      child.phoneNumber,
      `${getVaccineCompletionCount(immunization)}/5`,
      getHealthAlerts(child.id),
      attendance ? `${attendance.percent}%` : '-',
    ];
  });

  return {
    title: 'Overall Centre Report',
    subtitle: 'Comprehensive child-wise status across health, immunization, and attendance.',
    fileName: 'awc-overall-report.pdf',
    summary: [
      { label: 'Centre Strength', value: `${managedChildren.length} children` },
      { label: 'Attendance Rate', value: `${dashboardHealthSnapshot.attendancePercent}%` },
      { label: 'Fully Immunized', value: `${dashboardHealthSnapshot.fullyImmunized}` },
      { label: 'Health Alerts', value: `${healthLogsSeed.filter((item) => item.fever || item.diarrhea || item.cough || item.hospitalVisit).length}` },
    ],
    columns: ['Child', 'Age / Gender', 'Parent', 'Phone', 'Vaccines', 'Health Alerts', 'Attendance'],
    rows,
  };
}

function getImmunizationReport(): ReportDefinition {
  const rows = managedChildren.map((child) => {
    const record = immunizationByChild[child.id];
    const dueVaccines = vaccineLabels.filter((vaccine) => !record[vaccine.key]).map((vaccine) => vaccine.label);

    return [
      child.name,
      `${getVaccineCompletionCount(record)}/5`,
      record.BCG ? 'Done' : 'Pending',
      record.OPV ? 'Done' : 'Pending',
      record.DPT ? 'Done' : 'Pending',
      record.Measles ? 'Done' : 'Pending',
      record.vitaminA ? 'Done' : 'Pending',
      dueVaccines.length ? dueVaccines.join(', ') : 'None',
    ];
  });

  return {
    title: 'Immunization Report',
    subtitle: 'Schedule completion summary and pending vaccine list for all children.',
    fileName: 'awc-immunization-report.pdf',
    summary: [
      { label: 'Children Covered', value: `${managedChildren.length}` },
      { label: 'Fully Immunized', value: `${dashboardHealthSnapshot.fullyImmunized}` },
      { label: 'BCG Coverage', value: `${dashboardHealthSnapshot.immunizationBar.find((item) => item.vaccine === 'BCG')?.coverage ?? 0}%` },
      { label: 'Measles Coverage', value: `${dashboardHealthSnapshot.immunizationBar.find((item) => item.vaccine === 'Measles')?.coverage ?? 0}%` },
    ],
    columns: ['Child', 'Completion', 'BCG', 'OPV', 'DPT', 'Measles', 'Vitamin A', 'Due Vaccines'],
    rows,
  };
}

function getHealthReport(): ReportDefinition {
  const rows = managedChildren.map((child) => {
    const record = healthLogsSeed.find((item) => item.childId === child.id);
    const alertCount = record ? [record.fever, record.diarrhea, record.cough, record.hospitalVisit].filter(Boolean).length : 0;

    return [
      child.name,
      record?.fever ? 'Yes' : 'No',
      record?.diarrhea ? 'Yes' : 'No',
      record?.cough ? 'Yes' : 'No',
      record?.hospitalVisit ? 'Yes' : 'No',
      `${alertCount}`,
      alertCount > 0 ? getHealthAlerts(child.id) : 'No active alerts',
    ];
  });

  return {
    title: 'Health Report',
    subtitle: 'Current symptom alerts and clinical follow-up indicators for every child.',
    fileName: 'awc-health-report.pdf',
    summary: [
      { label: 'Children With Alerts', value: `${healthLogsSeed.filter((item) => item.fever || item.diarrhea || item.cough || item.hospitalVisit).length}` },
      { label: 'Hospital Visits', value: `${healthLogsSeed.filter((item) => item.hospitalVisit).length}` },
      { label: 'Fever Cases', value: `${healthLogsSeed.filter((item) => item.fever).length}` },
      { label: 'Cough Cases', value: `${healthLogsSeed.filter((item) => item.cough).length}` },
    ],
    columns: ['Child', 'Fever', 'Diarrhea', 'Cough', 'Hospital Visit', 'Alert Count', 'Summary'],
    rows,
  };
}

function getAttendanceReport(): ReportDefinition {
  const latestAttendance = getLatestAttendanceBlock();
  const rows = latestAttendance.stats.map((entry) => [
    entry.childName,
    `${latestAttendance.workingDays}`,
    `${entry.present}`,
    `${entry.absent}`,
    `${entry.percent}%`,
    entry.percent >= 85 ? 'Regular' : entry.percent >= 70 ? 'Monitor' : 'At Risk',
  ]);

  return {
    title: 'Attendance Report',
    subtitle: `Monthly attendance review for ${latestAttendance.monthKey} across all students.`,
    fileName: 'awc-attendance-report.pdf',
    summary: [
      { label: 'Report Month', value: latestAttendance.monthKey },
      { label: 'Working Days', value: `${latestAttendance.workingDays}` },
      { label: 'Centre Attendance', value: `${latestAttendance.overallPercent}%` },
      { label: 'Children Below 75%', value: `${latestAttendance.stats.filter((entry) => entry.percent < 75).length}` },
    ],
    columns: ['Child', 'Working Days', 'Present', 'Absent', 'Attendance %', 'Flag'],
    rows,
  };
}

function getDailySummaryReport(): ReportDefinition {
  const latestAttendance = getLatestAttendanceBlock();
  const rows = managedChildren.map((child) => {
    const todayPresent = latestAttendance.dates.at(-1)?.childStatus[child.id] ?? false;
    const immunization = immunizationByChild[child.id];

    return [
      child.name,
      todayPresent ? 'Present' : 'Absent',
      `${getVaccineCompletionCount(immunization)}/5`,
      getHealthAlerts(child.id),
      todayPresent ? 'Routine monitoring' : 'Home follow-up if absence continues',
    ];
  });

  return {
    title: 'Daily AWC Summary Report',
    subtitle: 'One-day operational summary for attendance, immunization, health alerts, and follow-up actions.',
    fileName: 'awc-daily-summary-report.pdf',
    summary: [
      { label: 'Students', value: `${managedChildren.length}` },
      { label: 'Present Today', value: `${rows.filter((row) => row[1] === 'Present').length}` },
      { label: 'Fully Immunized', value: `${dashboardHealthSnapshot.fullyImmunized}` },
      { label: 'Health Alerts', value: `${healthLogsSeed.filter((item) => item.fever || item.diarrhea || item.cough || item.hospitalVisit).length}` },
    ],
    columns: ['Child', 'Attendance', 'Vaccines', 'Health Alerts', 'Next Action'],
    rows,
  };
}

function getReportDefinition(kind: WorkerReportKind): ReportDefinition {
  switch (kind) {
    case 'immunization':
      return getImmunizationReport();
    case 'health':
      return getHealthReport();
    case 'attendance':
      return getAttendanceReport();
    case 'daily':
      return getDailySummaryReport();
    case 'overall':
    default:
      return getOverallReport();
  }
}

function reportRowsAsRecords(report: ReportDefinition) {
  return report.rows.map((row) =>
    report.columns.reduce<Record<string, string>>((record, column, index) => ({
      ...record,
      [column.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')]: row[index] ?? '',
    }), {})
  );
}

function drawHeader(doc: jsPDF, title: string, subtitle: string) {
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, 210, 28, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text(title, 14, 14);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(subtitle, 14, 21);
  doc.text(`Generated on ${formatDate(new Date().toISOString())}`, 145, 14);
  doc.text('Smart Anganwadi Centre Monitoring', 145, 21);
}

function drawSummary(doc: jsPDF, metrics: ReportMetric[]) {
  let x = 14;
  const y = 36;
  const width = 44;

  metrics.forEach((metric) => {
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(x, y, width, 22, 2, 2, 'FD');
    doc.setTextColor(100, 116, 139);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(metric.label.toUpperCase(), x + 3, y + 7);
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text(metric.value, x + 3, y + 16);
    x += width + 4;
  });
}

export function downloadWorkerReport(kind: WorkerReportKind) {
  const report = getReportDefinition(kind);
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  drawHeader(doc, report.title, report.subtitle);
  drawSummary(doc, report.summary);

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Student Detail Table', 14, 68);

  autoTable(doc, {
    startY: 72,
    head: [report.columns],
    body: report.rows,
    theme: 'grid',
    styles: {
      font: 'helvetica',
      fontSize: 8,
      cellPadding: 2.5,
      textColor: [30, 41, 59],
      lineColor: [226, 232, 240],
      lineWidth: 0.1,
    },
    headStyles: {
      fillColor: [15, 23, 42],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    margin: { left: 14, right: 14, bottom: 18 },
    didDrawPage: (data) => {
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text(
        `Page ${data.pageNumber}`,
        doc.internal.pageSize.getWidth() - 24,
        doc.internal.pageSize.getHeight() - 8
      );
    },
  });

  doc.save(report.fileName);
}

export function downloadWorkerReportCsv(kind: WorkerReportKind) {
  const report = getReportDefinition(kind);
  downloadCsv(report.fileName.replace('.pdf', '.csv'), reportRowsAsRecords(report));
}

export function downloadWorkerReportExcel(kind: WorkerReportKind) {
  const report = getReportDefinition(kind);
  downloadExcelHtml(report.fileName.replace('.pdf', '.xls'), reportRowsAsRecords(report));
}
