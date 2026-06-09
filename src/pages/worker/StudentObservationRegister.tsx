import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import {
  ArrowLeft,
  BookOpenCheck,
  Camera,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Download,
  FileSpreadsheet,
  Layers3,
  ListChecks,
  Mic,
  NotebookText,
  PlayCircle,
  Search,
  Target,
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import {
  ageBands,
  ecceActivityRepository,
  evidenceTypes,
  lmsDomains,
  rubricLevels,
  standardObservationMarks,
  standardObservationMetrics,
} from '../../data/ecceLms';
import type {
  AgeBand,
  DomainTone,
  EcceLmsActivity,
  EcceLmsDomain,
  EcceLmsModule,
  EvidenceType,
  RubricLevel,
  StandardObservationMark,
  StandardObservationMetricId,
} from '../../data/ecceLms';
import {
  dailyAttendanceSeed,
  managedChildren,
  monthlyIntakeByChild,
} from '../../data/childMonitoringData';
import type { ManagedChild } from '../../data/childMonitoringData';
import { downloadCsv, downloadExcelHtml } from '../../utils/exportFiles';
import { cn } from '../../utils';

type WorkflowStep = 'domain' | 'module' | 'activity' | 'details';
type AttendanceMark = 'Present' | 'Absent';
type ObservationRating = 'Low' | 'Medium' | 'High';

type StudentObservationRecord = {
  childId: string;
  date: string;
  ageBand: AgeBand;
  activityId: string;
  attendance: AttendanceMark;
  participation: ObservationRating;
  confidence: ObservationRating;
  communication: ObservationRating;
  metricMarks: Record<StandardObservationMetricId, StandardObservationMark>;
  indicatorRatings: Record<string, boolean>;
  evidence: EvidenceType;
  evidenceNote: string;
  quickNote: string;
  remediation: string;
  parentConnect: boolean;
};

type StudentDailyView = {
  child: ManagedChild;
  record: StudentObservationRecord;
  readiness: number;
  level: RubricLevel;
  score: number;
};

type ScoreSummary = {
  label: string;
  score: number;
  count: number;
};

type ChildPerformance = {
  child: ManagedChild;
  selectedModule: ScoreSummary;
  selectedDomain: ScoreSummary;
  weakestDomain: ScoreSummary;
  domainScores: ScoreSummary[];
  moduleScores: ScoreSummary[];
};

const STORAGE_KEY = 'awc-ecce-lms-observations-v3';
const LEGACY_STORAGE_KEY = 'awc-ecce-lms-observations-v2';
const SESSION_DURATION_MINUTES = 20;
const DUMMY_ACTIVITY_VIDEO = '/videos/ecce/dummy-activity.webm';

const ratingOptions: ObservationRating[] = ['Low', 'Medium', 'High'];

const rubricMark: Record<RubricLevel, StandardObservationMark> = {
  'Not Yet Observed': 0,
  Emerging: 1,
  Developing: 2,
  Achieved: 3,
};

const evidenceIcon: Record<EvidenceType, typeof NotebookText> = {
  'Observation Note': NotebookText,
  Photo: Camera,
  Video: Camera,
  'Voice Note': Mic,
};

const activityContextById = new Map<string, { domain: EcceLmsDomain; module: EcceLmsModule; activity: EcceLmsActivity }>(
  lmsDomains.flatMap((domain) =>
    domain.modules.flatMap((module) =>
      module.activities.map((activity) => [activity.id, { domain, module, activity }] as const)
    )
  )
);

function todayIso() {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

function getRecordKey(date: string, ageBand: AgeBand, activityId: string, childId: string) {
  return `${date}::${ageBand}::${activityId}::${childId}`;
}

function loadRecords() {
  if (typeof window === 'undefined') return {};
  try {
    const current = window.localStorage.getItem(STORAGE_KEY);
    const legacy = window.localStorage.getItem(LEGACY_STORAGE_KEY);
    return JSON.parse(current ?? legacy ?? '{}') as Record<string, Partial<StudentObservationRecord>>;
  } catch {
    return {};
  }
}

function getReadiness(child: ManagedChild) {
  const latest = monthlyIntakeByChild[child.id]?.at(-1);
  if (!latest) return 60;
  return Math.round(latest.learningScore * 0.7 + latest.attendanceRate * 0.3);
}

function getAttendance(child: ManagedChild): AttendanceMark {
  const attendance = dailyAttendanceSeed.find((entry) => entry.id === child.id);
  return attendance?.present === false ? 'Absent' : 'Present';
}

function ratingFromReadiness(readiness: number): ObservationRating {
  if (readiness >= 78) return 'High';
  if (readiness >= 52) return 'Medium';
  return 'Low';
}

function observationIndicators(activity: EcceLmsActivity) {
  return activity.observationChecklist.slice(0, 5);
}

function indicatorDefaults(level: RubricLevel, activity: EcceLmsActivity) {
  const indicators = observationIndicators(activity);
  const countByLevel: Record<RubricLevel, number> = {
    'Not Yet Observed': 0,
    Emerging: 1,
    Developing: Math.min(3, indicators.length),
    Achieved: indicators.length,
  };

  return indicators.reduce((ratings, indicator, index) => {
    ratings[indicator] = index < countByLevel[level];
    return ratings;
  }, {} as Record<string, boolean>);
}

function markFromRating(rating: ObservationRating): StandardObservationMark {
  if (rating === 'High') return 3;
  if (rating === 'Medium') return 2;
  return 1;
}

function normalizeMetricMark(value: unknown, fallback: StandardObservationMark): StandardObservationMark {
  return standardObservationMarks.some((mark) => mark.score === value) ? (value as StandardObservationMark) : fallback;
}

function metricDefaults(level: RubricLevel, participation: ObservationRating, confidence: ObservationRating, communication: ObservationRating) {
  const skillMark = rubricMark[level];
  const engagementMark = markFromRating(participation);
  const independenceMark = markFromRating(confidence);
  const expressionMark = markFromRating(communication);

  return {
    engagement: engagementMark,
    competencySkill: skillMark,
    communication: expressionMark,
    independence: independenceMark,
    peerInteraction: engagementMark,
  } satisfies Record<StandardObservationMetricId, StandardObservationMark>;
}

function metricLabel(mark: StandardObservationMark) {
  return standardObservationMarks.find((item) => item.score === mark)?.label ?? 'Not Yet';
}

function metricMarksForAll(mark: StandardObservationMark) {
  return standardObservationMetrics.reduce((marks, metric) => {
    marks[metric.id] = mark;
    return marks;
  }, {} as Record<StandardObservationMetricId, StandardObservationMark>);
}

function ratingFromMark(mark: StandardObservationMark): ObservationRating {
  if (mark === 3) return 'High';
  if (mark === 2) return 'Medium';
  return 'Low';
}

function normalizeRating(value: unknown, fallback: ObservationRating): ObservationRating {
  return ratingOptions.includes(value as ObservationRating) ? (value as ObservationRating) : fallback;
}

function normalizeEvidence(value: unknown): EvidenceType {
  return evidenceTypes.includes(value as EvidenceType) ? (value as EvidenceType) : 'Observation Note';
}

function levelFromScore(score: number, attendance: AttendanceMark): RubricLevel {
  if (attendance === 'Absent' || score <= 10) return 'Not Yet Observed';
  if (score < 55) return 'Emerging';
  if (score < 80) return 'Developing';
  return 'Achieved';
}

function scoreObservation(record: StudentObservationRecord, _activity: EcceLmsActivity) {
  if (record.attendance === 'Absent') return 0;
  const totalWeight = standardObservationMetrics.reduce((sum, metric) => sum + metric.weight, 0);
  const weighted = standardObservationMetrics.reduce((sum, metric) => {
    const mark = record.metricMarks[metric.id] ?? 0;
    return sum + (mark / 3) * 100 * metric.weight;
  }, 0);
  return Math.round(weighted / totalWeight);
}

function autoLevel(record: StudentObservationRecord, activity: EcceLmsActivity) {
  return levelFromScore(scoreObservation(record, activity), record.attendance);
}

function remediationFor(level: RubricLevel, activity: EcceLmsActivity) {
  if (level === 'Achieved') return `Invite child to demonstrate ${activity.title} with a peer.`;
  if (level === 'Developing') return 'Repeat once with a new local material.';
  if (level === 'Emerging') return activity.remediationSuggestions[0];
  return 'Observe again in a smaller group with peer support.';
}

function buildDefaultRecord(child: ManagedChild, date: string, ageBand: AgeBand, activity: EcceLmsActivity): StudentObservationRecord {
  const readiness = getReadiness(child);
  const attendance = getAttendance(child);
  const initialLevel = levelFromScore(readiness, attendance);
  const rating = attendance === 'Absent' ? 'Low' : ratingFromReadiness(readiness);

  return {
    childId: child.id,
    date,
    ageBand,
    activityId: activity.id,
    attendance,
    participation: rating,
    confidence: rating,
    communication: rating,
    metricMarks: metricDefaults(initialLevel, rating, rating, rating),
    indicatorRatings: indicatorDefaults(initialLevel, activity),
    evidence: 'Observation Note',
    evidenceNote: '',
    quickNote: '',
    remediation: remediationFor(initialLevel, activity),
    parentConnect: child.nutritionStatus !== 'Normal' || initialLevel === 'Not Yet Observed' || initialLevel === 'Emerging',
  };
}

function mergeRecord(base: StudentObservationRecord, saved?: Partial<StudentObservationRecord>): StudentObservationRecord {
  if (!saved) return base;
  const fallbackRating = base.attendance === 'Absent' ? 'Low' : base.participation;
  const activity = activityContextById.get(base.activityId)?.activity ?? ecceActivityRepository[0];
  const savedLegacyRubric = (saved as Partial<StudentObservationRecord> & { rubric?: RubricLevel }).rubric;
  const legacyLevel = rubricLevels.includes(savedLegacyRubric as RubricLevel)
    ? (savedLegacyRubric as RubricLevel)
    : autoLevel(base, activity);
  const participation = normalizeRating(saved.participation, fallbackRating);
  const confidence = normalizeRating(saved.confidence, fallbackRating);
  const communication = normalizeRating(saved.communication, fallbackRating);
  const fallbackMetricMarks = metricDefaults(legacyLevel, participation, confidence, communication);
  const savedMetricMarks = (saved.metricMarks ?? {}) as Partial<Record<StandardObservationMetricId, StandardObservationMark>>;

  return {
    ...base,
    ...saved,
    participation,
    confidence,
    communication,
    metricMarks: standardObservationMetrics.reduce((marks, metric) => {
      marks[metric.id] = normalizeMetricMark(savedMetricMarks[metric.id], fallbackMetricMarks[metric.id]);
      return marks;
    }, {} as Record<StandardObservationMetricId, StandardObservationMark>),
    indicatorRatings: {
      ...base.indicatorRatings,
      ...indicatorDefaults(legacyLevel, activity),
      ...(saved.indicatorRatings ?? {}),
    },
    evidence: normalizeEvidence(saved.evidence ?? base.evidence),
    attendance: saved.attendance === 'Absent' ? 'Absent' : saved.attendance === 'Present' ? 'Present' : base.attendance,
    quickNote: saved.quickNote ?? (saved as Partial<StudentObservationRecord> & { observationNote?: string }).observationNote ?? base.quickNote,
  };
}

function savedRecordFromEntry(key: string, saved: Partial<StudentObservationRecord>) {
  const [dateFromKey, ageBandFromKey, activityIdFromKey, childIdFromKey] = key.split('::');
  const activityId = saved.activityId ?? activityIdFromKey;
  const childId = saved.childId ?? childIdFromKey;
  const context = activityContextById.get(activityId);
  const child = managedChildren.find((item) => item.id === childId);

  if (!context || !child) return null;

  const ageBand = ageBands.includes(saved.ageBand as AgeBand) ? (saved.ageBand as AgeBand) : (ageBandFromKey as AgeBand);
  const base = buildDefaultRecord(child, saved.date ?? dateFromKey, ageBand, context.activity);
  return mergeRecord(base, saved);
}

function averageScore(records: StudentObservationRecord[]) {
  if (!records.length) return 0;
  const total = records.reduce((sum, record) => {
    const activity = activityContextById.get(record.activityId)?.activity ?? ecceActivityRepository[0];
    return sum + scoreObservation(record, activity);
  }, 0);
  return Math.round(total / records.length);
}

function moduleScore(records: StudentObservationRecord[], module: EcceLmsModule): ScoreSummary {
  const activityIds = new Set(module.activities.map((activity) => activity.id));
  const matching = records.filter((record) => activityIds.has(record.activityId));
  return { label: module.title, score: averageScore(matching), count: matching.length };
}

function domainScore(records: StudentObservationRecord[], domain: EcceLmsDomain): ScoreSummary {
  const moduleScores = domain.modules.map((module) => moduleScore(records, module));
  const observedModules = moduleScores.filter((summary) => summary.count > 0);

  return {
    label: domain.shortName,
    score: observedModules.length
      ? Math.round(observedModules.reduce((sum, summary) => sum + summary.score, 0) / observedModules.length)
      : 0,
    count: observedModules.reduce((sum, summary) => sum + summary.count, 0),
  };
}

function buildChildPerformance(
  child: ManagedChild,
  records: StudentObservationRecord[],
  selectedDomain: EcceLmsDomain,
  selectedModule: EcceLmsModule
): ChildPerformance {
  const domainScores = lmsDomains.map((domain) => domainScore(records, domain));
  const observedDomains = domainScores.filter((summary) => summary.count > 0);
  const weakestDomain = observedDomains.length
    ? observedDomains.reduce((weakest, summary) => summary.score < weakest.score ? summary : weakest)
    : { label: 'No domain yet', score: 0, count: 0 };

  return {
    child,
    selectedModule: moduleScore(records, selectedModule),
    selectedDomain: domainScore(records, selectedDomain),
    weakestDomain,
    domainScores,
    moduleScores: selectedDomain.modules.map((module) => moduleScore(records, module)),
  };
}

function nextActivity(module: EcceLmsModule, activity: EcceLmsActivity) {
  const index = module.activities.findIndex((item) => item.id === activity.id);
  return module.activities[index + 1] ?? module.activities[0] ?? activity;
}

function rowsForExport(activity: EcceLmsActivity, module: EcceLmsModule, performanceRows: ChildPerformance[], rows: StudentDailyView[]) {
  return rows.map((row, index) => {
    const performance = performanceRows.find((item) => item.child.id === row.child.id);

    return {
      'Sl. No.': index + 1,
      Date: row.record.date,
      'Age Group': row.record.ageBand,
      Domain: activity.domain,
      Module: module.title,
      Activity: activity.title,
      'Student ID': row.child.id,
      'Student Name': row.child.name,
      Attendance: row.record.attendance,
      ...standardObservationMetrics.reduce((columns, metric) => {
        columns[`Metric - ${metric.label}`] = metricLabel(row.record.metricMarks[metric.id]);
        columns[`Score - ${metric.label}`] = row.record.metricMarks[metric.id];
        return columns;
      }, {} as Record<string, string | number>),
      'Auto Competency Level': row.level,
      'Activity Score': `${row.score}%`,
      'Module Score': performance?.selectedModule.count ? `${performance.selectedModule.score}%` : 'NA',
      'Domain Score': performance?.selectedDomain.count ? `${performance.selectedDomain.score}%` : 'NA',
      'Lagging Domain': performance?.weakestDomain.count ? performance.weakestDomain.label : 'NA',
      Evidence: row.record.evidence,
      'Evidence Note': row.record.evidenceNote,
      'Quick Note': row.record.quickNote,
      Remediation: row.record.remediation,
      'Parent Connect': row.record.parentConnect ? 'Yes' : 'No',
    };
  });
}

function toneClasses(tone: DomainTone) {
  const classes: Record<DomainTone, {
    soft: string;
    solid: string;
    border: string;
    text: string;
    bar: string;
    wash: string;
    glow: string;
  }> = {
    sky: {
      soft: 'bg-sky-50 text-sky-700 dark:bg-sky-950/30 dark:text-sky-300',
      solid: 'bg-sky-600 text-white',
      border: 'border-sky-200 dark:border-sky-900',
      text: 'text-sky-700 dark:text-sky-300',
      bar: 'bg-sky-500',
      wash: 'bg-sky-50/80 dark:bg-sky-950/20',
      glow: 'shadow-sky-100 dark:shadow-sky-950/20',
    },
    emerald: {
      soft: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300',
      solid: 'bg-emerald-600 text-white',
      border: 'border-emerald-200 dark:border-emerald-900',
      text: 'text-emerald-700 dark:text-emerald-300',
      bar: 'bg-emerald-500',
      wash: 'bg-emerald-50/80 dark:bg-emerald-950/20',
      glow: 'shadow-emerald-100 dark:shadow-emerald-950/20',
    },
    violet: {
      soft: 'bg-violet-50 text-violet-700 dark:bg-violet-950/30 dark:text-violet-300',
      solid: 'bg-violet-600 text-white',
      border: 'border-violet-200 dark:border-violet-900',
      text: 'text-violet-700 dark:text-violet-300',
      bar: 'bg-violet-500',
      wash: 'bg-violet-50/80 dark:bg-violet-950/20',
      glow: 'shadow-violet-100 dark:shadow-violet-950/20',
    },
    amber: {
      soft: 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300',
      solid: 'bg-amber-600 text-white',
      border: 'border-amber-200 dark:border-amber-900',
      text: 'text-amber-700 dark:text-amber-300',
      bar: 'bg-amber-500',
      wash: 'bg-amber-50/80 dark:bg-amber-950/20',
      glow: 'shadow-amber-100 dark:shadow-amber-950/20',
    },
    rose: {
      soft: 'bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-300',
      solid: 'bg-rose-600 text-white',
      border: 'border-rose-200 dark:border-rose-900',
      text: 'text-rose-700 dark:text-rose-300',
      bar: 'bg-rose-500',
      wash: 'bg-rose-50/80 dark:bg-rose-950/20',
      glow: 'shadow-rose-100 dark:shadow-rose-950/20',
    },
    cyan: {
      soft: 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950/30 dark:text-cyan-300',
      solid: 'bg-cyan-600 text-white',
      border: 'border-cyan-200 dark:border-cyan-900',
      text: 'text-cyan-700 dark:text-cyan-300',
      bar: 'bg-cyan-500',
      wash: 'bg-cyan-50/80 dark:bg-cyan-950/20',
      glow: 'shadow-cyan-100 dark:shadow-cyan-950/20',
    },
  };

  return classes[tone];
}

function levelClasses(level: RubricLevel) {
  if (level === 'Achieved') return 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300';
  if (level === 'Developing') return 'border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900 dark:bg-sky-950/30 dark:text-sky-300';
  if (level === 'Emerging') return 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300';
  return 'border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-300';
}

function scoreTone(score: number, count: number) {
  if (count === 0) return 'text-muted-foreground';
  if (score >= 75) return 'text-emerald-600 dark:text-emerald-300';
  if (score >= 45) return 'text-amber-600 dark:text-amber-300';
  return 'text-red-600 dark:text-red-300';
}

function shortIndicator(indicator: string) {
  return indicator
    .replace('Ability to ', '')
    .replace('Accuracy of ', '')
    .replace(' and interaction', '')
    .replace(' level', '');
}

function compactText(value: string, limit = 112) {
  if (value.length <= limit) return value;
  const trimmed = value.slice(0, limit).replace(/\s+\S*$/, '');
  return `${trimmed}...`;
}

function firstActivityId(module: EcceLmsModule) {
  return module.activities[0]?.id ?? '';
}

function createVideoPoster(activity: EcceLmsActivity, domain: EcceLmsDomain) {
  const palette: Record<DomainTone, { bg: string; fg: string; accent: string }> = {
    sky: { bg: '#e0f2fe', fg: '#075985', accent: '#0284c7' },
    emerald: { bg: '#dcfce7', fg: '#065f46', accent: '#059669' },
    violet: { bg: '#ede9fe', fg: '#5b21b6', accent: '#7c3aed' },
    amber: { bg: '#fef3c7', fg: '#92400e', accent: '#d97706' },
    rose: { bg: '#ffe4e6', fg: '#9f1239', accent: '#e11d48' },
    cyan: { bg: '#cffafe', fg: '#155e75', accent: '#0891b2' },
  };
  const colors = palette[domain.tone];
  const safeTitle = activity.title.replace(/[<>&"]/g, '');
  const safeDomain = domain.shortName.replace(/[<>&"]/g, '');
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720">
      <rect width="1280" height="720" fill="${colors.bg}"/>
      <circle cx="1080" cy="140" r="180" fill="${colors.accent}" opacity="0.14"/>
      <circle cx="160" cy="610" r="220" fill="${colors.accent}" opacity="0.12"/>
      <rect x="82" y="78" width="1116" height="564" rx="42" fill="#ffffff" opacity="0.84"/>
      <circle cx="640" cy="328" r="82" fill="${colors.accent}"/>
      <polygon points="618,285 618,371 690,328" fill="#ffffff"/>
      <text x="640" y="468" text-anchor="middle" font-size="48" font-family="Arial, sans-serif" font-weight="700" fill="${colors.fg}">${safeTitle}</text>
      <text x="640" y="526" text-anchor="middle" font-size="28" font-family="Arial, sans-serif" font-weight="700" fill="${colors.accent}">${safeDomain} activity demonstration</text>
    </svg>
  `;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

export function StudentObservationRegister() {
  const [records, setRecords] = useState<Record<string, Partial<StudentObservationRecord>>>(() => loadRecords());
  const [date, setDate] = useState(todayIso());
  const [ageBand, setAgeBand] = useState<AgeBand>('4-5 years');
  const [domainId, setDomainId] = useState(() => lmsDomains[0].id);
  const [moduleId, setModuleId] = useState(() => lmsDomains[0].modules[0].id);
  const [activityId, setActivityId] = useState(() => firstActivityId(lmsDomains[0].modules[0]));
  const [workflowStep, setWorkflowStep] = useState<WorkflowStep>('domain');
  const [search, setSearch] = useState('');
  const [activitySearch, setActivitySearch] = useState('');
  const [savedAt, setSavedAt] = useState('');

  const selectedDomain = useMemo(() => lmsDomains.find((domain) => domain.id === domainId) ?? lmsDomains[0], [domainId]);
  const selectedModule = useMemo(
    () => selectedDomain.modules.find((module) => module.id === moduleId) ?? selectedDomain.modules[0],
    [moduleId, selectedDomain]
  );
  const selectedActivity = useMemo(
    () => selectedModule.activities.find((activity) => activity.id === activityId) ?? selectedModule.activities[0],
    [activityId, selectedModule]
  );
  const nextRecommendedActivity = nextActivity(selectedModule, selectedActivity);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    }
  }, [records]);

  const studentRows = useMemo<StudentDailyView[]>(() => {
    const query = search.trim().toLowerCase();

    return managedChildren
      .filter((child) => !query || [child.name, child.parentName, child.ageLabel, child.id].some((value) => value.toLowerCase().includes(query)))
      .map((child) => {
        const key = getRecordKey(date, ageBand, selectedActivity.id, child.id);
        const base = buildDefaultRecord(child, date, ageBand, selectedActivity);
        const record = mergeRecord(base, records[key]);
        const score = scoreObservation(record, selectedActivity);
        const level = levelFromScore(score, record.attendance);

        return {
          child,
          record,
          readiness: getReadiness(child),
          score,
          level,
        };
      });
  }, [ageBand, date, records, search, selectedActivity]);

  const classStats = useMemo(() => {
    const total = studentRows.length || 1;
    const observed = studentRows.filter((row) => row.level !== 'Not Yet Observed').length;
    const developing = studentRows.filter((row) => row.level === 'Developing' || row.level === 'Achieved').length;
    const followUp = studentRows.filter((row) => row.record.parentConnect || row.level === 'Emerging' || row.level === 'Not Yet Observed').length;

    return {
      total: studentRows.length,
      observed,
      developing,
      followUp,
      observedRate: Math.round((observed / total) * 100),
    };
  }, [studentRows]);

  const performanceRows = useMemo(() => {
    const normalizedRecords = new Map<string, StudentObservationRecord>();

    Object.entries(records).forEach(([key, saved]) => {
      const record = savedRecordFromEntry(key, saved);
      if (record) {
        normalizedRecords.set(getRecordKey(record.date, record.ageBand, record.activityId, record.childId), record);
      }
    });

    studentRows.forEach((row) => {
      normalizedRecords.set(
        getRecordKey(row.record.date, row.record.ageBand, row.record.activityId, row.record.childId),
        row.record
      );
    });

    return studentRows.map((row) => {
      const childRecords = Array.from(normalizedRecords.values()).filter((record) => record.childId === row.child.id);
      return buildChildPerformance(row.child, childRecords, selectedDomain, selectedModule);
    });
  }, [records, selectedDomain, selectedModule, studentRows]);

  const supportRows = studentRows.filter((row) => row.level === 'Not Yet Observed' || row.level === 'Emerging');

  const chooseDomain = (domain: EcceLmsDomain) => {
    const firstModule = domain.modules[0];
    setDomainId(domain.id);
    setModuleId(firstModule.id);
    setActivityId(firstActivityId(firstModule));
    setActivitySearch('');
    setWorkflowStep('module');
  };

  const chooseModule = (module: EcceLmsModule) => {
    setModuleId(module.id);
    setActivityId(firstActivityId(module));
    setActivitySearch('');
    setWorkflowStep('activity');
  };

  const chooseActivity = (activity: EcceLmsActivity) => {
    setActivityId(activity.id);
    setWorkflowStep('details');
  };

  const updateRecord = (child: ManagedChild, patch: Partial<StudentObservationRecord>) => {
    const key = getRecordKey(date, ageBand, selectedActivity.id, child.id);
    const base = buildDefaultRecord(child, date, ageBand, selectedActivity);

    setRecords((current) => {
      const existing = mergeRecord(base, current[key]);
      const next = {
        ...existing,
        ...patch,
        indicatorRatings: patch.indicatorRatings ?? existing.indicatorRatings,
        metricMarks: patch.metricMarks ?? existing.metricMarks,
      };
      const nextLevel = autoLevel(next, selectedActivity);

      return {
        ...current,
        [key]: {
          ...next,
          remediation: patch.remediation ?? remediationFor(nextLevel, selectedActivity),
          parentConnect: patch.parentConnect ?? next.parentConnect,
        },
      };
    });
  };

  const saveSnapshot = () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    setSavedAt(new Date().toLocaleString());
  };

  const exportRows = rowsForExport(selectedActivity, selectedModule, performanceRows, studentRows);

  return (
    <div className="space-y-4 pb-10 animate-fade-in">
      <section className="rounded-[1.25rem] border border-border bg-card p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="flex items-start gap-3">
            <div className={cn('flex h-12 w-12 shrink-0 items-center justify-center rounded-xl', toneClasses(selectedDomain.tone).soft)}>
              <BookOpenCheck size={22} />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-muted-foreground">Worker ECCE LMS</p>
              <h2 className="mt-1 text-2xl font-black tracking-tight text-foreground">Learning and Observation Workflow</h2>
              {workflowStep !== 'details' && (
                <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-muted-foreground">
                  Select a domain, choose a module, pick the activity, then observe each child from the activity detail page.
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" className="min-h-11 rounded-xl" onClick={() => downloadCsv('ecce-module-observations.csv', exportRows)}>
              <Download size={16} />
              CSV
            </Button>
            <Button type="button" variant="outline" className="min-h-11 rounded-xl" onClick={() => downloadExcelHtml('ecce-module-observations.xls', exportRows)}>
              <FileSpreadsheet size={16} />
              Excel
            </Button>
            <Button type="button" className="min-h-11 rounded-xl" onClick={saveSnapshot}>
              <ClipboardCheck size={16} />
              Save Offline
            </Button>
          </div>
        </div>

        {workflowStep !== 'details' && (
          <div className="mt-4 grid gap-2 sm:grid-cols-4">
            <SessionStat label="Domains" value={lmsDomains.length} />
            <SessionStat label="Modules" value={selectedDomain.modules.length} />
            <SessionStat label="Activities" value={selectedModule.activities.length} />
            <SessionStat label="Observed" value={`${classStats.observed}/${classStats.total}`} />
          </div>
        )}

        {savedAt && (
          <p className="mt-3 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300">
            <CheckCircle2 size={14} />
            Saved offline {savedAt}
          </p>
        )}
      </section>

      <WorkflowStepper
        step={workflowStep}
        selectedDomain={selectedDomain}
        selectedModule={selectedModule}
        selectedActivity={selectedActivity}
        onStepChange={setWorkflowStep}
      />

      {workflowStep === 'domain' && (
        <DomainSelection selectedDomainId={selectedDomain.id} onSelect={chooseDomain} />
      )}

      {workflowStep === 'module' && (
        <ModuleSelection
          domain={selectedDomain}
          selectedModuleId={selectedModule.id}
          onBack={() => setWorkflowStep('domain')}
          onSelect={chooseModule}
        />
      )}

      {workflowStep === 'activity' && (
        <ActivitySelection
          domain={selectedDomain}
          module={selectedModule}
          selectedActivityId={selectedActivity.id}
          search={activitySearch}
          onSearchChange={setActivitySearch}
          onBack={() => setWorkflowStep('module')}
          onSelect={chooseActivity}
        />
      )}

      {workflowStep === 'details' && (
        <ActivityDetails
          date={date}
          ageBand={ageBand}
          search={search}
          domain={selectedDomain}
          module={selectedModule}
          activity={selectedActivity}
          nextActivity={nextRecommendedActivity}
          rows={studentRows}
          supportRows={supportRows}
          performanceRows={performanceRows}
          classStats={classStats}
          onDateChange={setDate}
          onAgeBandChange={setAgeBand}
          onSearchChange={setSearch}
          onBackToActivities={() => setWorkflowStep('activity')}
          onUpdateRecord={updateRecord}
        />
      )}
    </div>
  );
}

function WorkflowStepper({
  step,
  selectedDomain,
  selectedModule,
  selectedActivity,
  onStepChange,
}: {
  step: WorkflowStep;
  selectedDomain: EcceLmsDomain;
  selectedModule: EcceLmsModule;
  selectedActivity: EcceLmsActivity;
  onStepChange: (step: WorkflowStep) => void;
}) {
  const steps: Array<{ id: WorkflowStep; title: string; caption: string }> = [
    { id: 'domain', title: 'Domain', caption: selectedDomain.shortName },
    { id: 'module', title: 'Module', caption: selectedModule.competency },
    { id: 'activity', title: 'Activity', caption: selectedActivity.title },
    { id: 'details', title: 'Observe', caption: 'Student intake' },
  ];

  return (
    <nav className="rounded-[1.25rem] border border-border bg-card p-2 shadow-sm" aria-label="Observation workflow">
      <div className="grid gap-2 md:grid-cols-4">
        {steps.map((item, index) => {
          const active = step === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onStepChange(item.id)}
              className={cn(
                'flex min-h-16 items-center gap-3 rounded-2xl border px-3 text-left transition-colors',
                active ? 'border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300' : 'border-transparent bg-background/60 text-muted-foreground hover:text-foreground'
              )}
            >
              <span className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-black', active ? 'bg-emerald-600 text-white' : 'bg-muted text-muted-foreground')}>
                {index + 1}
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-black">{item.title}</span>
                <span className="block truncate text-xs font-semibold">{item.caption}</span>
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

function DomainSelection({ selectedDomainId, onSelect }: { selectedDomainId: string; onSelect: (domain: EcceLmsDomain) => void }) {
  return (
    <section className="rounded-[1.25rem] border border-border bg-card p-4 shadow-sm sm:p-5">
      <SectionTitle eyebrow="Step 1" title="Select Domain" description="Start with the developmental domain. Each card is color coded for quick recognition." />
      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {lmsDomains.map((domain) => {
          const tone = toneClasses(domain.tone);
          const selected = selectedDomainId === domain.id;
          return (
            <button
              key={domain.id}
              type="button"
              onClick={() => onSelect(domain)}
              className={cn(
                'group overflow-hidden rounded-2xl border bg-background text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md',
                selected ? cn(tone.border, 'ring-2 ring-emerald-500/30') : 'border-border'
              )}
            >
              <div className={cn('h-2 w-full', tone.bar)} />
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className={cn('flex h-12 w-12 items-center justify-center rounded-xl', tone.soft)}>
                    <Target size={22} />
                  </div>
                  <span className={cn('rounded-full border px-3 py-1 text-xs font-black', tone.soft, tone.border)}>
                    {domain.modules.length} modules
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-black text-foreground">{domain.name}</h3>
                <p className="mt-2 min-h-12 text-sm font-semibold leading-6 text-muted-foreground">{domain.learningOutcome}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {domain.competencyStrands.slice(0, 3).map((strand) => (
                    <span key={strand} className="rounded-full border border-border bg-card px-3 py-1 text-xs font-bold text-muted-foreground">
                      {strand}
                    </span>
                  ))}
                </div>
                <div className={cn('mt-4 flex items-center justify-between rounded-xl px-3 py-2', tone.wash)}>
                  <span className={cn('text-sm font-black', tone.text)}>{domain.activities.length} activities</span>
                  <ChevronRight className={cn('h-5 w-5 transition-transform group-hover:translate-x-1', tone.text)} />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function ModuleSelection({
  domain,
  selectedModuleId,
  onBack,
  onSelect,
}: {
  domain: EcceLmsDomain;
  selectedModuleId: string;
  onBack: () => void;
  onSelect: (module: EcceLmsModule) => void;
}) {
  const tone = toneClasses(domain.tone);

  return (
    <section className="rounded-[1.25rem] border border-border bg-card p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SectionTitle eyebrow="Step 2" title="Select Module" description={`Showing modules under ${domain.name}.`} />
        <Button type="button" variant="outline" className="min-h-11 rounded-xl" onClick={onBack}>
          <ArrowLeft size={16} />
          Domains
        </Button>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {domain.modules.map((module, index) => {
          const selected = selectedModuleId === module.id;
          return (
            <button
              key={module.id}
              type="button"
              onClick={() => onSelect(module)}
              className={cn(
                'rounded-2xl border bg-background p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md',
                selected ? cn(tone.border, 'ring-2 ring-emerald-500/30') : 'border-border'
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className={cn('flex h-11 w-11 items-center justify-center rounded-xl text-sm font-black', tone.soft)}>
                  {index + 1}
                </div>
                <span className="rounded-full border border-border bg-card px-3 py-1 text-xs font-black text-muted-foreground">
                  {module.activities.length} activities
                </span>
              </div>
              <h3 className="mt-4 text-base font-black text-foreground">{module.title}</h3>
              <p className={cn('mt-1 text-sm font-black', tone.text)}>{module.competency}</p>
              <p className="mt-3 min-h-20 text-sm font-semibold leading-6 text-muted-foreground">{module.learningOutcome}</p>
              <div className="mt-4 flex items-center gap-2 text-sm font-black text-foreground">
                <Layers3 size={16} className={tone.text} />
                View activities
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function ActivitySelection({
  domain,
  module,
  selectedActivityId,
  search,
  onSearchChange,
  onBack,
  onSelect,
}: {
  domain: EcceLmsDomain;
  module: EcceLmsModule;
  selectedActivityId: string;
  search: string;
  onSearchChange: (search: string) => void;
  onBack: () => void;
  onSelect: (activity: EcceLmsActivity) => void;
}) {
  const tone = toneClasses(domain.tone);
  const query = search.trim().toLowerCase();
  const activities = module.activities.filter((activity) =>
    !query || [activity.title, activity.objective, activity.learningOutcome, activity.competency].some((value) => value.toLowerCase().includes(query))
  );

  return (
    <section className="rounded-[1.25rem] border border-border bg-card p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <SectionTitle eyebrow="Step 3" title="Select Activity" description={`${module.title} activities for observation.`} />
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative sm:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Find activity"
              className="h-11 rounded-xl pl-10"
            />
          </div>
          <Button type="button" variant="outline" className="min-h-11 rounded-xl" onClick={onBack}>
            <ArrowLeft size={16} />
            Modules
          </Button>
        </div>
      </div>

      {activities.length ? (
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {activities.map((activity) => {
            const selected = selectedActivityId === activity.id;
            return (
              <button
                key={activity.id}
                type="button"
                onClick={() => onSelect(activity)}
                className={cn(
                  'group rounded-2xl border bg-background p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md',
                  selected ? cn(tone.border, 'ring-2 ring-emerald-500/30') : 'border-border'
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className={cn('flex h-11 w-11 items-center justify-center rounded-xl', tone.soft)}>
                    <ListChecks size={20} />
                  </div>
                  <span className={cn('rounded-full border px-3 py-1 text-xs font-black', tone.soft, tone.border)}>
                    {activity.ageGroups.join(', ')}
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-black text-foreground">{activity.title}</h3>
                <p className="mt-2 min-h-16 text-sm font-semibold leading-6 text-muted-foreground">{activity.objective}</p>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <MiniMetric label="Materials" value={activity.materials.length} />
                  <MiniMetric label="Indicators" value={observationIndicators(activity).length} />
                </div>
                <div className={cn('mt-4 flex items-center justify-between rounded-xl px-3 py-2', tone.wash)}>
                  <span className={cn('text-sm font-black', tone.text)}>Open details</span>
                  <ChevronRight className={cn('h-5 w-5 transition-transform group-hover:translate-x-1', tone.text)} />
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <EmptyState title="No activities found" description="Clear the activity search to see all activities in this module." />
      )}
    </section>
  );
}

function ActivityDetails({
  date,
  ageBand,
  search,
  domain,
  module,
  activity,
  nextActivity,
  rows,
  supportRows,
  performanceRows,
  classStats,
  onDateChange,
  onAgeBandChange,
  onSearchChange,
  onBackToActivities,
  onUpdateRecord,
}: {
  date: string;
  ageBand: AgeBand;
  search: string;
  domain: EcceLmsDomain;
  module: EcceLmsModule;
  activity: EcceLmsActivity;
  nextActivity: EcceLmsActivity;
  rows: StudentDailyView[];
  supportRows: StudentDailyView[];
  performanceRows: ChildPerformance[];
  classStats: { total: number; observed: number; developing: number; followUp: number; observedRate: number };
  onDateChange: (date: string) => void;
  onAgeBandChange: (ageBand: AgeBand) => void;
  onSearchChange: (search: string) => void;
  onBackToActivities: () => void;
  onUpdateRecord: (child: ManagedChild, patch: Partial<StudentObservationRecord>) => void;
}) {
  const tone = toneClasses(domain.tone);
  const [activeChildId, setActiveChildId] = useState(() => rows[0]?.child.id ?? '');
  const activeRow = rows.find((row) => row.child.id === activeChildId) ?? rows[0];

  useEffect(() => {
    if (rows.length && !rows.some((row) => row.child.id === activeChildId)) {
      setActiveChildId(rows[0].child.id);
    }
  }, [activeChildId, rows]);

  return (
    <div className="space-y-4">
      <section className={cn('overflow-hidden rounded-[1.25rem] border shadow-sm', tone.border)}>
        <div className={cn('grid gap-4 p-4 sm:p-5 xl:grid-cols-[minmax(0,1fr)_180px]', tone.wash)}>
          <div>
            <button
              type="button"
              onClick={onBackToActivities}
              className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-border bg-card px-3 text-sm font-black text-foreground transition-colors hover:bg-accent"
            >
              <ArrowLeft size={16} />
              Activities
            </button>
            <p className="mt-4 text-xs font-black uppercase tracking-[0.16em] text-muted-foreground">Step 4 / Activity Studio</p>
            <h3 className="mt-1 text-3xl font-black tracking-tight text-foreground">{activity.title}</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              <HeroChip label={domain.shortName} tone={domain.tone} />
              <HeroChip label={module.competency} tone={domain.tone} />
              <HeroChip label={`${SESSION_DURATION_MINUTES} min`} tone={domain.tone} />
              <HeroChip label={activity.ageGroups.join(', ')} tone={domain.tone} />
            </div>
          </div>

          <div className="hidden overflow-hidden rounded-2xl border border-border bg-card shadow-sm xl:block">
            <img src="/kid.png" alt="" className="h-full min-h-36 w-full object-cover" />
          </div>
        </div>
      </section>

      <section className="grid items-start gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(360px,0.72fr)]">
        <ActivityVideoPanel domain={domain} activity={activity} />
        <ActivityGuidePanel domain={domain} module={module} activity={activity} />
      </section>

      <section className="rounded-[1.25rem] border border-border bg-card p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <SectionTitle
            eyebrow="Observation Intake"
            title="Student Review"
          />
          <div className="grid gap-2 sm:grid-cols-4 xl:w-[560px]">
            <SessionStat label="Observed" value={`${classStats.observed}/${classStats.total}`} />
            <SessionStat label="Mapped" value={`${classStats.observedRate}%`} />
            <SessionStat label="Developing" value={classStats.developing} />
            <SessionStat label="Follow-up" value={classStats.followUp} />
          </div>
        </div>

        <StandardRubricStrip />

        <div className="mt-4 grid gap-3 lg:grid-cols-[170px_minmax(360px,0.8fr)_280px]">
          <Field label="Date">
            <Input type="date" value={date} onChange={(event) => onDateChange(event.target.value)} className="h-11 rounded-xl" />
          </Field>

          <Field label="Age Group">
            <div className="grid grid-cols-3 gap-1 rounded-xl bg-muted/50 p-1">
              {ageBands.map((band) => (
                <button
                  key={band}
                  type="button"
                  onClick={() => onAgeBandChange(band)}
                  className={cn(
                    'min-h-10 rounded-lg px-2 text-xs font-black transition-colors',
                    ageBand === band ? 'bg-emerald-600 text-white' : 'text-muted-foreground hover:bg-card hover:text-foreground'
                  )}
                >
                  {band}
                </button>
              ))}
            </div>
          </Field>

          <Field label="Find Child">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder="Name, parent, age"
                className="h-11 rounded-xl pl-10"
              />
            </div>
          </Field>
        </div>

        {rows.length && activeRow ? (
          <div className="mt-4 grid items-start gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
            <StudentReviewRoster
              rows={rows}
              activeChildId={activeRow.child.id}
              performanceRows={performanceRows}
              onSelect={setActiveChildId}
            />
            <StudentObservationCard
              row={activeRow}
              domain={domain}
              performance={performanceRows.find((performance) => performance.child.id === activeRow.child.id)}
              onUpdate={(patch) => onUpdateRecord(activeRow.child, patch)}
            />
          </div>
        ) : (
          <EmptyState title="No children found" description="Clear the search or sync the centre child list." />
        )}
      </section>

      <SessionOutcomePanel
        rows={rows}
        supportRows={supportRows}
        activity={activity}
        nextActivity={nextActivity}
      />
    </div>
  );
}

function ActivityGuidePanel({ domain, module, activity }: { domain: EcceLmsDomain; module: EcceLmsModule; activity: EcceLmsActivity }) {
  const tone = toneClasses(domain.tone);
  const guidePanels = [
    { id: 'steps', title: 'Steps', eyebrow: 'Facilitate', items: activity.facilitationSteps },
    { id: 'prompts', title: 'Prompts', eyebrow: 'Ask', items: activity.teacherPrompts },
    { id: 'indicators', title: 'Indicators', eyebrow: 'Observe', items: observationIndicators(activity) },
  ] as const;
  const [activeGuideId, setActiveGuideId] = useState<typeof guidePanels[number]['id']>('steps');
  const activeGuide = guidePanels.find((panel) => panel.id === activeGuideId) ?? guidePanels[0];

  return (
    <section className="self-start rounded-[1.25rem] border border-border bg-card p-4 shadow-sm sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <SectionTitle eyebrow="Quick Brief" title="Use this while observing" />
        <span className={cn('w-fit rounded-full border px-3 py-1 text-xs font-black', tone.soft, tone.border)}>
          {module.competency}
        </span>
      </div>

      <div className={cn('mt-4 rounded-2xl border p-4', tone.border, tone.wash)}>
        <p className="text-xs font-black uppercase tracking-[0.14em] text-muted-foreground">Story Hook</p>
        <p className="mt-2 text-base font-black leading-6 text-foreground">{compactText(activity.storyHook, 118)}</p>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
        <ActionCue
          icon={<Target size={18} />}
          title="Outcome"
          value={compactText(activity.learningOutcome, 92)}
          tone={domain.tone}
        />
      </div>

      <div className="mt-4 rounded-2xl border border-border bg-background/70 p-2">
        <div className="grid grid-cols-3 gap-1">
          {guidePanels.map((panel) => (
            <button
              key={panel.id}
              type="button"
              onClick={() => setActiveGuideId(panel.id)}
              className={cn(
                'min-h-11 rounded-xl px-2 text-xs font-black transition-colors',
                activeGuideId === panel.id
                  ? cn(tone.solid, 'shadow-sm')
                  : 'text-muted-foreground hover:bg-card hover:text-foreground'
              )}
            >
              {panel.title}
            </button>
          ))}
        </div>

        <div className="mt-2 h-56 overflow-y-auto rounded-xl border border-border bg-card p-3">
          <p className="text-[11px] font-black uppercase tracking-[0.14em] text-muted-foreground">{activeGuide.eyebrow}</p>
          <ol className="mt-3 space-y-2">
            {activeGuide.items.map((item, index) => (
              <li key={`${activeGuide.id}-${item}`} className="flex gap-2 text-sm font-semibold leading-6 text-foreground">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-black text-muted-foreground">
                  {index + 1}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function ActivityVideoPanel({ domain, activity }: { domain: EcceLmsDomain; activity: EcceLmsActivity }) {
  const tone = toneClasses(domain.tone);

  return (
    <aside className="self-start overflow-hidden rounded-[1.25rem] border border-border bg-card shadow-sm">
      <div className={cn('flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5', tone.wash)}>
        <div className="flex items-center gap-3">
          <div className={cn('flex h-12 w-12 items-center justify-center rounded-xl shadow-sm', tone.soft)}>
            <PlayCircle size={24} />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-muted-foreground">Activity Video</p>
            <h4 className="text-xl font-black text-foreground">Watch and facilitate</h4>
          </div>
        </div>
        <span className={cn('w-fit rounded-full border px-3 py-1 text-xs font-black', tone.soft, tone.border)}>
          Dummy video
        </span>
      </div>

      <div className="p-3 sm:p-5">
        <div className="overflow-hidden rounded-[1.25rem] border border-slate-800 bg-slate-950 p-2 shadow-2xl">
        <video
          className="aspect-video w-full rounded-xl bg-slate-900 object-cover"
          controls
          playsInline
          preload="metadata"
          poster={createVideoPoster(activity, domain)}
          aria-label={`${activity.title} demonstration video`}
        >
          <source src={DUMMY_ACTIVITY_VIDEO} type="video/webm" />
          <source src={`/videos/ecce/${activity.id}.mp4`} type="video/mp4" />
          Activity demonstration video is not available on this device.
        </video>
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          <VideoNote label="Prepare" value="Keep material ready" />
          <VideoNote label="Play" value="Model once" />
          <VideoNote label="Observe" value="Tap indicators" />
        </div>
      </div>
    </aside>
  );
}

function StudentObservationCard({
  row,
  domain,
  performance,
  onUpdate,
}: {
  row: StudentDailyView;
  domain: EcceLmsDomain;
  performance?: ChildPerformance;
  onUpdate: (patch: Partial<StudentObservationRecord>) => void;
}) {
  const { child, record, level, score } = row;
  const domainTone = toneClasses(domain.tone);

  return (
    <article className="rounded-2xl border border-border bg-background/60 p-3 sm:p-4">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <div className={cn('flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-base font-black', domainTone.solid)}>
            {child.name.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="font-black text-foreground">{child.name}</p>
            <p className="text-xs font-semibold text-muted-foreground">{child.ageLabel} / Parent: {child.parentName}</p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className={cn('rounded-full border px-3 py-1 text-xs font-black', levelClasses(level))}>{level}</span>
              <span className="rounded-full border border-border bg-card px-3 py-1 text-xs font-black text-muted-foreground">
                Activity {score}%
              </span>
              <ScoreInline label="Module" summary={performance?.selectedModule} />
              <ScoreInline label="Domain" summary={performance?.selectedDomain} />
            </div>
          </div>
        </div>

        <div className="xl:w-52">
          <SegmentedControl
            options={['Present', 'Absent'] as const}
            value={record.attendance}
            onChange={(attendance) => onUpdate({ attendance })}
          />
        </div>
      </div>

      <div className="mt-4">
        <StandardMetricReview
          record={record}
          domain={domain}
          onUpdate={onUpdate}
        />
      </div>

      <details className="group mt-3 rounded-xl border border-border bg-card">
        <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-4 text-sm font-black text-foreground">
          Notes and evidence
          <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-90" />
        </summary>
        <div className="grid gap-4 border-t border-border p-4 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="grid gap-4 md:grid-cols-2">
            <ControlGroup title="Quick Note">
              <Input
                value={record.quickNote}
                onChange={(event) => onUpdate({ quickNote: event.target.value })}
                placeholder="Short observation note"
                className="h-11 rounded-xl"
              />
            </ControlGroup>
            <ControlGroup title="Evidence Detail">
              <Input
                value={record.evidenceNote}
                onChange={(event) => onUpdate({ evidenceNote: event.target.value })}
                placeholder="Photo/audio/note reference"
                className="h-11 rounded-xl"
              />
            </ControlGroup>
          </div>

          <ControlGroup title="Evidence Capture">
            <div className="grid grid-cols-2 gap-1 rounded-xl bg-muted/50 p-1">
              {evidenceTypes.map((type) => {
                const Icon = evidenceIcon[type];
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => onUpdate({ evidence: type })}
                    className={cn(
                      'flex min-h-10 items-center justify-center gap-2 rounded-lg px-2 text-xs font-black transition-colors',
                      record.evidence === type ? 'bg-emerald-600 text-white' : 'text-muted-foreground hover:bg-card hover:text-foreground'
                    )}
                  >
                    <Icon size={14} />
                    {type === 'Observation Note' ? 'Note' : type === 'Voice Note' ? 'Audio' : type}
                  </button>
                );
              })}
            </div>
          </ControlGroup>
        </div>
      </details>
    </article>
  );
}

function StudentReviewRoster({
  rows,
  activeChildId,
  performanceRows,
  onSelect,
}: {
  rows: StudentDailyView[];
  activeChildId: string;
  performanceRows: ChildPerformance[];
  onSelect: (childId: string) => void;
}) {
  return (
    <aside className="self-start rounded-2xl border border-border bg-background/60 p-3">
      <div className="flex items-center justify-between gap-3 px-1 pb-3">
        <div>
          <p className="text-sm font-black text-foreground">Children</p>
          <p className="text-xs font-semibold text-muted-foreground">Select one to review</p>
        </div>
        <span className="rounded-full border border-border bg-card px-3 py-1 text-xs font-black text-muted-foreground">
          {rows.length}
        </span>
      </div>

      <div className="max-h-[560px] space-y-2 overflow-y-auto pr-1">
        {rows.map((row) => {
          const active = row.child.id === activeChildId;
          const performance = performanceRows.find((item) => item.child.id === row.child.id);

          return (
            <button
              key={row.child.id}
              type="button"
              onClick={() => onSelect(row.child.id)}
              className={cn(
                'w-full rounded-xl border px-3 py-2.5 text-left transition-colors',
                active ? 'border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-200' : 'border-border bg-card hover:bg-accent'
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-black">{row.child.name}</p>
                  <p className="text-xs font-semibold opacity-75">{row.child.ageLabel}</p>
                </div>
                <span className={cn('rounded-full border px-2 py-1 text-[11px] font-black', levelClasses(row.level))}>
                  {row.score}%
                </span>
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                <span className="rounded-full bg-background/70 px-2 py-0.5 text-[10px] font-black">
                  M {performance?.selectedModule.count ? `${performance.selectedModule.score}%` : 'NA'}
                </span>
                <span className="rounded-full bg-background/70 px-2 py-0.5 text-[10px] font-black">
                  D {performance?.selectedDomain.count ? `${performance.selectedDomain.score}%` : 'NA'}
                </span>
                <span className="rounded-full bg-background/70 px-2 py-0.5 text-[10px] font-black">
                  {row.record.attendance}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}

function StandardMetricReview({
  record,
  domain,
  onUpdate,
}: {
  record: StudentObservationRecord;
  domain: EcceLmsDomain;
  onUpdate: (patch: Partial<StudentObservationRecord>) => void;
}) {
  const tone = toneClasses(domain.tone);

  const updateMarks = (metricMarks: Record<StandardObservationMetricId, StandardObservationMark>) => {
    onUpdate({
      metricMarks,
      participation: ratingFromMark(metricMarks.engagement),
      confidence: ratingFromMark(metricMarks.independence),
      communication: ratingFromMark(metricMarks.communication),
    });
  };

  const updateMetric = (metricId: StandardObservationMetricId, mark: StandardObservationMark) => {
    updateMarks({
      ...record.metricMarks,
      [metricId]: mark,
    });
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="flex flex-col gap-3 border-b border-border p-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-black text-foreground">Activity marks</p>
          <p className="mt-1 text-xs font-semibold text-muted-foreground">Tap one score per row, or set all.</p>
        </div>
        <div className="grid grid-cols-4 gap-1 lg:w-64">
          {standardObservationMarks.map((mark) => (
            <button
              key={`all-${mark.score}`}
              type="button"
              onClick={() => updateMarks(metricMarksForAll(mark.score))}
              className="min-h-9 rounded-lg border border-border bg-background/70 px-2 text-xs font-black text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              All {mark.score}
            </button>
          ))}
        </div>
      </div>

      <div className="p-3">
        <div className="mx-auto grid max-w-[880px] grid-cols-[92px_repeat(4,minmax(48px,1fr))] gap-1.5 text-center sm:grid-cols-[132px_repeat(4,minmax(58px,1fr))]">
          <div />
          {standardObservationMarks.map((mark) => (
            <div key={`head-${mark.score}`} className="rounded-xl bg-muted/50 px-1 py-2">
              <span className="block text-sm font-black text-foreground">{mark.score}</span>
              <span className="hidden text-[10px] font-bold leading-3 text-muted-foreground sm:block">{mark.label}</span>
            </div>
          ))}

          {standardObservationMetrics.map((metric) => {
            const value = record.metricMarks[metric.id];
            return (
              <div key={metric.id} className="contents">
                <div className="flex min-h-10 items-center rounded-xl bg-background/70 px-2 text-left text-xs font-black text-foreground sm:text-sm">
                  {metric.shortLabel}
                </div>
                {standardObservationMarks.map((mark) => (
                  <button
                    key={`${metric.id}-${mark.score}`}
                    type="button"
                    aria-label={`${metric.label}: ${mark.label}`}
                    onClick={() => updateMetric(metric.id, mark.score)}
                    className={cn(
                      'min-h-10 rounded-xl border text-sm font-black transition-colors',
                      value === mark.score
                        ? cn(tone.solid, 'border-transparent shadow-sm')
                        : 'border-border bg-background/70 text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {mark.score}
                  </button>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function SessionOutcomePanel({
  rows,
  supportRows,
  activity,
  nextActivity,
}: {
  rows: StudentDailyView[];
  supportRows: StudentDailyView[];
  activity: EcceLmsActivity;
  nextActivity: EcceLmsActivity;
}) {
  const levelCounts = rubricLevels.map((level) => ({
    level,
    count: rows.filter((row) => row.level === level).length,
  }));
  const achieved = rows.filter((row) => row.level === 'Achieved').length;
  const observed = rows.filter((row) => row.level !== 'Not Yet Observed').length;
  const topSupportRows = supportRows.slice(0, 3);

  return (
    <section className="rounded-[1.25rem] border border-border bg-card p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <SectionTitle eyebrow="After Observation" title="Session Outcome" />
        <div className="grid gap-2 sm:grid-cols-4 xl:w-[620px]">
          <OutcomeStat label="Observed" value={`${observed}/${rows.length}`} />
          <OutcomeStat label="Need Support" value={supportRows.length} tone={supportRows.length ? 'warn' : 'good'} />
          <OutcomeStat label="Achieved" value={achieved} tone="good" />
          <OutcomeStat label="Next" value={nextActivity.title} />
        </div>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="rounded-2xl border border-border bg-background/60 p-3">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-muted-foreground">Class level spread</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-4">
            {levelCounts.map((item) => (
              <div key={item.level} className={cn('rounded-xl border px-3 py-2', levelClasses(item.level))}>
                <p className="truncate text-xs font-black">{item.level}</p>
                <p className="mt-1 text-lg font-black">{item.count}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-background/60 p-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-muted-foreground">Follow-up children</p>
            <span className="rounded-full border border-border bg-card px-3 py-1 text-xs font-black text-muted-foreground">
              {supportRows.length}
            </span>
          </div>

          {topSupportRows.length ? (
            <div className="mt-3 space-y-2">
              {topSupportRows.map((row) => (
                <div key={row.child.id} className="rounded-xl border border-border bg-card p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-black text-foreground">{row.child.name}</p>
                      <p className="text-xs font-semibold text-muted-foreground">{activity.competency}</p>
                    </div>
                    <span className={cn('shrink-0 rounded-full border px-2 py-1 text-[11px] font-black', levelClasses(row.level))}>
                      {row.level}
                    </span>
                  </div>
                  <p className="mt-2 text-xs font-semibold leading-5 text-muted-foreground">
                    {remediationFor(row.level, activity)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-3 text-sm font-black text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300">
              No learning support needed for this activity.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block space-y-1">
      <span className="text-xs font-black uppercase tracking-[0.14em] text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

function StandardRubricStrip() {
  return (
    <div className="mt-4 flex flex-wrap gap-2 rounded-2xl border border-border bg-background/60 p-3">
      <span className="flex min-h-9 items-center px-1 text-xs font-black uppercase tracking-[0.14em] text-muted-foreground">
        Score
      </span>
      {standardObservationMarks.map((mark) => (
        <span key={mark.score} className="inline-flex min-h-9 items-center rounded-full border border-border bg-card px-3 text-xs font-black text-foreground">
          {mark.score} = {mark.label}
        </span>
      ))}
    </div>
  );
}

function HeroChip({ label, tone }: { label: string; tone: DomainTone }) {
  const classes = toneClasses(tone);

  return (
    <span className={cn('inline-flex min-h-9 items-center rounded-full border px-3 text-xs font-black', classes.soft, classes.border)}>
      {label}
    </span>
  );
}

function ActionCue({ icon, title, value, tone }: { icon: ReactNode; title: string; value: string; tone: DomainTone }) {
  const classes = toneClasses(tone);

  return (
    <div className="rounded-2xl border border-border bg-background/70 p-4">
      <div className="flex items-center gap-2">
        <span className={cn('flex h-9 w-9 items-center justify-center rounded-xl', classes.soft)}>{icon}</span>
        <p className="text-xs font-black uppercase tracking-[0.14em] text-muted-foreground">{title}</p>
      </div>
      <p className="mt-3 text-sm font-black leading-6 text-foreground">{value}</p>
    </div>
  );
}

function SectionTitle({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) {
  return (
    <div>
      <p className="text-xs font-black uppercase tracking-[0.16em] text-muted-foreground">{eyebrow}</p>
      <h3 className="mt-1 text-xl font-black text-foreground">{title}</h3>
      {description && <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-muted-foreground">{description}</p>}
    </div>
  );
}

function BriefBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-background/60 p-4">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-muted-foreground">{title}</p>
      <p className="mt-2 text-sm font-semibold leading-6 text-foreground">{children}</p>
    </div>
  );
}

function SimpleList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-2xl border border-border bg-background/60 p-4">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-muted-foreground">{title}</p>
      <ol className="mt-2 space-y-2">
        {items.map((item, index) => (
          <li key={`${title}-${item}`} className="flex gap-2 text-sm font-semibold leading-6 text-foreground">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted text-[11px] font-black text-muted-foreground">
              {index + 1}
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function ControlGroup({ title, children, className }: { title: string; children: ReactNode; className?: string }) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <p className="text-xs font-black uppercase tracking-[0.12em] text-muted-foreground">{title}</p>
      {children}
    </div>
  );
}

function SegmentedControl<T extends string>({ options, value, onChange }: { options: readonly T[]; value: T; onChange: (value: T) => void }) {
  return (
    <div className={cn('grid gap-1 rounded-xl bg-muted/50 p-1', options.length === 2 ? 'grid-cols-2' : 'grid-cols-3')}>
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={cn(
            'min-h-11 rounded-lg px-2 text-xs font-black transition-colors',
            value === option ? 'bg-emerald-600 text-white' : 'text-muted-foreground hover:bg-card hover:text-foreground'
          )}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

function SessionStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="min-h-12 rounded-xl border border-border bg-background/70 px-3 py-2">
      <p className="text-[10px] font-black uppercase tracking-[0.12em] text-muted-foreground">{label}</p>
      <p className="mt-0.5 truncate text-sm font-black text-foreground">{value}</p>
    </div>
  );
}

function OutcomeStat({ label, value, tone }: { label: string; value: string | number; tone?: 'good' | 'warn' }) {
  return (
    <div
      className={cn(
        'min-h-14 rounded-xl border px-3 py-2',
        tone === 'good'
          ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300'
          : tone === 'warn'
            ? 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300'
            : 'border-border bg-background/70 text-foreground'
      )}
    >
      <p className="text-[10px] font-black uppercase tracking-[0.12em] opacity-70">{label}</p>
      <p className="mt-1 truncate text-sm font-black">{value}</p>
    </div>
  );
}

function MiniMetric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-border bg-card px-3 py-2">
      <p className="text-[10px] font-black uppercase tracking-[0.12em] text-muted-foreground">{label}</p>
      <p className="mt-1 text-base font-black text-foreground">{value}</p>
    </div>
  );
}

function ScoreInline({ label, summary }: { label: string; summary?: ScoreSummary }) {
  const score = summary?.score ?? 0;
  const count = summary?.count ?? 0;

  return (
    <span className="rounded-full border border-border bg-card px-3 py-1 text-xs font-black text-muted-foreground">
      {label} <span className={cn(scoreTone(score, count))}>{count ? `${score}%` : 'NA'}</span>
    </span>
  );
}

function VideoNote({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-background/60 px-3 py-2">
      <p className="text-[10px] font-black uppercase tracking-[0.12em] text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-semibold leading-5 text-foreground">{value}</p>
    </div>
  );
}

function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-background/60 p-6 text-center">
      <p className="font-black text-foreground">{title}</p>
      <p className="mt-2 text-sm font-semibold text-muted-foreground">{description}</p>
    </div>
  );
}
