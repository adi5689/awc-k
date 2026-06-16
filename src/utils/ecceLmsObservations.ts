import {
  managedChildren,
  monthlyIntakeByChild,
} from '../data/childMonitoringData';
import type { ManagedChild } from '../data/childMonitoringData';
import {
  ageBands,
  ecceActivityRepository,
  evidenceTypes,
  lmsDomains,
  rubricLevels,
  standardObservationMarks,
  standardObservationMetrics,
} from '../data/ecceLms';
import type {
  AgeBand,
  EcceLmsActivity,
  EcceLmsDomain,
  EcceLmsModule,
  EvidenceType,
  RubricLevel,
  StandardObservationMark,
  StandardObservationMetricId,
} from '../data/ecceLms';

export type ObservationRating = 'Low' | 'Medium' | 'High';

export type StudentObservationRecord = {
  childId: string;
  date: string;
  ageBand: AgeBand;
  activityId: string;
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

export type StudentDailyView = {
  child: ManagedChild;
  record: StudentObservationRecord;
  readiness: number;
  level: RubricLevel;
  score: number;
};

export type ScoreSummary = {
  label: string;
  score: number;
  count: number;
};

export type ModuleScoreSummary = ScoreSummary & {
  domain: string;
  competency: string;
};

export type MetricScoreSummary = ScoreSummary & {
  id: StandardObservationMetricId;
  shortLabel: string;
  weight: number;
  averageMark: number;
  levelLabel: string;
};

export type DailyActivityReport = {
  activityId: string;
  activityTitle: string;
  domain: string;
  module: string;
  competency: string;
  score: number;
  level: RubricLevel;
  quickNote: string;
  remediation: string;
  parentConnect: boolean;
};

export type DailyLmsReport = {
  date: string;
  score: number;
  recordCount: number;
  observedActivities: number;
  domains: string[];
  modules: string[];
  followUpCount: number;
  levelCounts: Record<RubricLevel, number>;
  metricScores: MetricScoreSummary[];
  activities: DailyActivityReport[];
};

export type ChildPerformance = {
  child: ManagedChild;
  selectedModule: ScoreSummary;
  selectedDomain: ScoreSummary;
  weakestDomain: ScoreSummary;
  domainScores: ScoreSummary[];
  moduleScores: ScoreSummary[];
};

export type ChildLmsSummary = {
  childId: string;
  hasSavedRecords: boolean;
  overallScore: number;
  coveragePercent: number;
  recordCount: number;
  observedActivities: number;
  totalActivities: number;
  observedModules: number;
  totalModules: number;
  developingPlusCount: number;
  followUpCount: number;
  latestRecord: StudentObservationRecord | null;
  levelCounts: Record<RubricLevel, number>;
  metricScores: MetricScoreSummary[];
  domainScores: ScoreSummary[];
  moduleScores: ModuleScoreSummary[];
  strongestDomain: ScoreSummary;
  weakestDomain: ScoreSummary;
  dailyReports: DailyLmsReport[];
  latestDailyReport: DailyLmsReport | null;
  recentRecords: StudentObservationRecord[];
};

export const STORAGE_KEY = 'awc-ecce-lms-observations-v3';
export const LEGACY_STORAGE_KEY = 'awc-ecce-lms-observations-v2';

const ratingOptions: ObservationRating[] = ['Low', 'Medium', 'High'];

const rubricMark: Record<RubricLevel, StandardObservationMark> = {
  'Not Yet Observed': 0,
  Emerging: 1,
  Developing: 2,
  Achieved: 3,
};

export const activityContextById = new Map<string, { domain: EcceLmsDomain; module: EcceLmsModule; activity: EcceLmsActivity }>(
  lmsDomains.flatMap((domain) =>
    domain.modules.flatMap((module) =>
      module.activities.map((activity) => [activity.id, { domain, module, activity }] as const)
    )
  )
);

export function todayIso() {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

export function getRecordKey(date: string, ageBand: AgeBand, activityId: string, childId: string) {
  return `${date}::${ageBand}::${activityId}::${childId}`;
}

export function loadRecords() {
  if (typeof window === 'undefined') return {};
  try {
    const current = window.localStorage.getItem(STORAGE_KEY);
    const legacy = window.localStorage.getItem(LEGACY_STORAGE_KEY);
    return JSON.parse(current ?? legacy ?? '{}') as Record<string, Partial<StudentObservationRecord>>;
  } catch {
    return {};
  }
}

export function getReadiness(child: ManagedChild) {
  const latest = monthlyIntakeByChild[child.id]?.at(-1);
  if (!latest) return 60;
  return Math.round(latest.learningScore);
}

function ratingFromReadiness(readiness: number): ObservationRating {
  if (readiness >= 78) return 'High';
  if (readiness >= 52) return 'Medium';
  return 'Low';
}

export function observationIndicators(activity: EcceLmsActivity) {
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

export function metricLabel(mark: StandardObservationMark) {
  return standardObservationMarks.find((item) => item.score === mark)?.label ?? 'Not Yet';
}

export function metricMarksForAll(mark: StandardObservationMark) {
  return standardObservationMetrics.reduce((marks, metric) => {
    marks[metric.id] = mark;
    return marks;
  }, {} as Record<StandardObservationMetricId, StandardObservationMark>);
}

export function ratingFromMark(mark: StandardObservationMark): ObservationRating {
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

export function levelFromScore(score: number): RubricLevel {
  if (score <= 10) return 'Not Yet Observed';
  if (score < 55) return 'Emerging';
  if (score < 80) return 'Developing';
  return 'Achieved';
}

export function scoreObservation(record: StudentObservationRecord) {
  const totalWeight = standardObservationMetrics.reduce((sum, metric) => sum + metric.weight, 0);
  const weighted = standardObservationMetrics.reduce((sum, metric) => {
    const mark = record.metricMarks[metric.id] ?? 0;
    return sum + (mark / 3) * 100 * metric.weight;
  }, 0);
  return Math.round(weighted / totalWeight);
}

export function autoLevel(record: StudentObservationRecord) {
  return levelFromScore(scoreObservation(record));
}

export function remediationFor(level: RubricLevel, activity: EcceLmsActivity) {
  if (level === 'Achieved') return `Invite child to demonstrate ${activity.title} with a peer.`;
  if (level === 'Developing') return 'Repeat once with a new local material.';
  if (level === 'Emerging') return activity.remediationSuggestions[0];
  return 'Observe again in a smaller group with peer support.';
}

export function buildDefaultRecord(child: ManagedChild, date: string, ageBand: AgeBand, activity: EcceLmsActivity): StudentObservationRecord {
  const readiness = getReadiness(child);
  const initialLevel = levelFromScore(readiness);
  const rating = ratingFromReadiness(readiness);

  return {
    childId: child.id,
    date,
    ageBand,
    activityId: activity.id,
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

export function mergeRecord(base: StudentObservationRecord, saved?: Partial<StudentObservationRecord>): StudentObservationRecord {
  if (!saved) return base;
  const fallbackRating = base.participation;
  const savedWithoutAttendance = { ...saved } as Partial<StudentObservationRecord> & { attendance?: unknown };
  delete savedWithoutAttendance.attendance;
  const activity = activityContextById.get(base.activityId)?.activity ?? ecceActivityRepository[0];
  const savedLegacyRubric = (saved as Partial<StudentObservationRecord> & { rubric?: RubricLevel }).rubric;
  const legacyLevel = rubricLevels.includes(savedLegacyRubric as RubricLevel)
    ? (savedLegacyRubric as RubricLevel)
    : autoLevel(base);
  const participation = normalizeRating(saved.participation, fallbackRating);
  const confidence = normalizeRating(saved.confidence, fallbackRating);
  const communication = normalizeRating(saved.communication, fallbackRating);
  const fallbackMetricMarks = metricDefaults(legacyLevel, participation, confidence, communication);
  const savedMetricMarks = (saved.metricMarks ?? {}) as Partial<Record<StandardObservationMetricId, StandardObservationMark>>;

  return {
    ...base,
    ...savedWithoutAttendance,
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
    quickNote: saved.quickNote ?? (saved as Partial<StudentObservationRecord> & { observationNote?: string }).observationNote ?? base.quickNote,
  };
}

export function savedRecordFromEntry(key: string, saved: Partial<StudentObservationRecord>) {
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

export function getSavedObservationRecords(savedRecords = loadRecords()) {
  const normalizedRecords = new Map<string, StudentObservationRecord>();

  Object.entries(savedRecords).forEach(([key, saved]) => {
    const record = savedRecordFromEntry(key, saved);
    if (record) {
      normalizedRecords.set(getRecordKey(record.date, record.ageBand, record.activityId, record.childId), record);
    }
  });

  return Array.from(normalizedRecords.values()).sort((a, b) => a.date.localeCompare(b.date));
}

export function averageScore(records: StudentObservationRecord[]) {
  if (!records.length) return 0;
  const total = records.reduce((sum, record) => {
    return sum + scoreObservation(record);
  }, 0);
  return Math.round(total / records.length);
}

export function moduleScore(records: StudentObservationRecord[], module: EcceLmsModule): ScoreSummary {
  const activityIds = new Set(module.activities.map((activity) => activity.id));
  const matching = records.filter((record) => activityIds.has(record.activityId));
  return { label: module.title, score: averageScore(matching), count: matching.length };
}

export function domainScore(records: StudentObservationRecord[], domain: EcceLmsDomain): ScoreSummary {
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

export function metricScore(records: StudentObservationRecord[], metric: (typeof standardObservationMetrics)[number]): MetricScoreSummary {
  const marks = records
    .map((record) => record.metricMarks[metric.id])
    .filter((mark): mark is StandardObservationMark => typeof mark === 'number');

  if (!marks.length) {
    return {
      id: metric.id,
      label: metric.label,
      shortLabel: metric.shortLabel,
      weight: metric.weight,
      score: 0,
      count: 0,
      averageMark: 0,
      levelLabel: 'Not Yet',
    };
  }

  const averageMark = marks.reduce<number>((sum, mark) => sum + mark, 0) / marks.length;
  const roundedMark = Math.round(averageMark) as StandardObservationMark;

  return {
    id: metric.id,
    label: metric.label,
    shortLabel: metric.shortLabel,
    weight: metric.weight,
    score: Math.round((averageMark / 3) * 100),
    count: marks.length,
    averageMark,
    levelLabel: metricLabel(roundedMark),
  };
}

function buildLevelCounts(records: StudentObservationRecord[]) {
  const levelCounts = rubricLevels.reduce((counts, level) => {
    counts[level] = 0;
    return counts;
  }, {} as Record<RubricLevel, number>);

  records.forEach((record) => {
    levelCounts[autoLevel(record)] += 1;
  });

  return levelCounts;
}

function uniqueValues(values: string[]) {
  return Array.from(new Set(values));
}

export function buildDailyLmsReport(date: string, records: StudentObservationRecord[]): DailyLmsReport {
  const activities = records.map((record) => {
    const context = activityContextById.get(record.activityId);
    const activity = context?.activity ?? ecceActivityRepository[0];
    const module = context?.module;
    const domain = context?.domain;
    const score = scoreObservation(record);
    const level = levelFromScore(score);

    return {
      activityId: record.activityId,
      activityTitle: activity.title,
      domain: domain?.shortName ?? activity.domain,
      module: module?.title ?? activity.competency,
      competency: module?.competency ?? activity.competency,
      score,
      level,
      quickNote: record.quickNote,
      remediation: record.remediation,
      parentConnect: record.parentConnect,
    };
  });

  const observedActivityIds = new Set(records.map((record) => record.activityId));

  return {
    date,
    score: averageScore(records),
    recordCount: records.length,
    observedActivities: observedActivityIds.size,
    domains: uniqueValues(activities.map((activity) => activity.domain)),
    modules: uniqueValues(activities.map((activity) => activity.module)),
    followUpCount: activities.filter((activity) => activity.parentConnect || activity.level === 'Emerging' || activity.level === 'Not Yet Observed').length,
    levelCounts: buildLevelCounts(records),
    metricScores: standardObservationMetrics.map((metric) => metricScore(records, metric)),
    activities,
  };
}

export function buildDailyLmsReports(records: StudentObservationRecord[]) {
  const recordsByDate = records.reduce((groups, record) => {
    groups[record.date] = [...(groups[record.date] ?? []), record];
    return groups;
  }, {} as Record<string, StudentObservationRecord[]>);

  return Object.entries(recordsByDate)
    .map(([date, dateRecords]) => buildDailyLmsReport(date, dateRecords))
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function buildChildPerformance(
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

export function nextActivity(module: EcceLmsModule, activity: EcceLmsActivity) {
  const index = module.activities.findIndex((item) => item.id === activity.id);
  return module.activities[index + 1] ?? module.activities[0] ?? activity;
}

export function buildChildLmsSummary(childId: string, records = getSavedObservationRecords()): ChildLmsSummary {
  const childRecords = records.filter((record) => record.childId === childId);
  const domainScores = lmsDomains.map((domain) => domainScore(childRecords, domain));
  const metricScores = standardObservationMetrics.map((metric) => metricScore(childRecords, metric));
  const observedDomains = domainScores.filter((summary) => summary.count > 0);
  const moduleScores: ModuleScoreSummary[] = lmsDomains.flatMap((domain) =>
    domain.modules.map((module) => ({
      ...moduleScore(childRecords, module),
      domain: domain.shortName,
      competency: module.competency,
    }))
  );
  const observedModuleScores = moduleScores.filter((summary) => summary.count > 0);
  const observedActivityIds = new Set(childRecords.map((record) => record.activityId));
  const levelCounts = buildLevelCounts(childRecords);
  const dailyReports = buildDailyLmsReports(childRecords);

  const weakestDomain = observedDomains.length
    ? observedDomains.reduce((weakest, summary) => summary.score < weakest.score ? summary : weakest)
    : { label: 'No domain yet', score: 0, count: 0 };
  const strongestDomain = observedDomains.length
    ? observedDomains.reduce((strongest, summary) => summary.score > strongest.score ? summary : strongest)
    : { label: 'No domain yet', score: 0, count: 0 };
  const sortedRecords = [...childRecords].sort((a, b) => b.date.localeCompare(a.date));
  const totalModules = lmsDomains.reduce((sum, domain) => sum + domain.modules.length, 0);
  const totalActivities = ecceActivityRepository.length;

  return {
    childId,
    hasSavedRecords: childRecords.length > 0,
    overallScore: averageScore(childRecords),
    coveragePercent: totalActivities > 0 ? Math.round((observedActivityIds.size / totalActivities) * 100) : 0,
    recordCount: childRecords.length,
    observedActivities: observedActivityIds.size,
    totalActivities,
    observedModules: observedModuleScores.length,
    totalModules,
    developingPlusCount: levelCounts.Developing + levelCounts.Achieved,
    followUpCount: childRecords.filter((record) => {
      const level = autoLevel(record);
      return record.parentConnect || level === 'Emerging' || level === 'Not Yet Observed';
    }).length,
    latestRecord: sortedRecords[0] ?? null,
    levelCounts,
    metricScores,
    domainScores,
    moduleScores,
    strongestDomain,
    weakestDomain,
    dailyReports,
    latestDailyReport: dailyReports[0] ?? null,
    recentRecords: sortedRecords.slice(0, 5),
  };
}
