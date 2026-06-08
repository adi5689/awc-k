import readXlsxFile from 'read-excel-file/browser';

export type PoshanGender = 'Male' | 'Female' | 'Other';
export type PoshanSeverity = 'normal' | 'moderate' | 'severe';
export type StuntingStatus = 'normal' | 'moderately stunted' | 'severely stunted';
export type WastingStatus = 'normal' | 'MAM' | 'SAM' | 'overweight' | 'obese';
export type UnderweightStatus = 'normal' | 'moderately underweight' | 'severely underweight';

export type PoshanBeneficiary = {
  id: string;
  beneficiary: string;
  caregiver: string;
  awc: string;
  sector: string;
  gender: PoshanGender;
  ageMonths: number;
  weightKg: number;
  heightCm: number;
  muacCm?: number;
  bmi: number;
  stunting: StuntingStatus;
  wasting: WastingStatus;
  underweight: UnderweightStatus;
  severity: PoshanSeverity;
  riskScore: number;
};

export type PoshanDistributionPoint = {
  name: string;
  value: number;
  color: string;
};

export type PoshanAnalysis = {
  fileName: string;
  records: PoshanBeneficiary[];
  summary: {
    total: number;
    fullyNormal: number;
    stunted: number;
    moderateStunted: number;
    severeStunted: number;
    wasted: number;
    mam: number;
    sam: number;
    underweight: number;
    moderateUnderweight: number;
    severeUnderweight: number;
    atRisk: number;
    awcs: number;
    sectors: number;
    riskIndex: number;
    projectedReduction: number;
  };
  distributions: {
    stunting: PoshanDistributionPoint[];
    wasting: PoshanDistributionPoint[];
    underweight: PoshanDistributionPoint[];
    gender: PoshanDistributionPoint[];
  };
  severityComparison: Array<{ band: string; stunting: number; wasting: number; underweight: number }>;
  awcLoad: Array<{ awc: string; stunted: number; wasted: number; underweight: number; affected: number; total: number; riskIndex: number }>;
  sectorSeverity: Array<{ sector: string; normal: number; moderate: number; severe: number }>;
  ageImpact: Array<{ ageBand: string; stunted: number; wasted: number; underweight: number }>;
  bmiScatter: Array<{ ageMonths: number; bmi: number; severity: PoshanSeverity; beneficiary: string }>;
  severityRadar: Array<{ metric: string; value: number }>;
  genderStunting: Array<{ gender: string; normal: number; stunted: number }>;
  recoveryProjection: Array<{ day: string; affected: number; recovered: number }>;
  awcRadar: Array<Record<string, string | number>>;
  awcRadarKeys: string[];
  genderRadar: Array<{ metric: string; Male: number; Female: number }>;
  ageRadar: Array<{ metric: string; stunted: number; wasted: number; underweight: number }>;
  sectorRadar: Array<Record<string, string | number>>;
  sectorRadarKeys: string[];
  insights: Array<{ title: string; metric: string; body: string; tone: 'red' | 'amber' | 'blue' | 'emerald' | 'slate' }>;
  priorityActions: Array<{ priority: 'critical' | 'high' | 'medium' | 'routine'; title: string; count: number; progress: number }>;
};

type RawRow = Record<string, unknown>;
type SheetCell = string | number | boolean | Date | null | undefined;

const colors = {
  normal: '#6edb8f',
  moderate: '#f5c84b',
  severe: '#ef4444',
  blue: '#5b8def',
  violet: '#8b6cf6',
  pink: '#d9579a',
  amber: '#f2ad3d',
};

const aliasMap = {
  beneficiary: ['beneficiaryname', 'beneficiary', 'childname', 'child', 'name'],
  caregiver: ['mothername', 'mother', 'fathername', 'father', 'guardian', 'parentname', 'parent'],
  awc: ['awcname', 'awc', 'anganwadicentre', 'anganwadicenter', 'centre', 'center'],
  sector: ['sectorname', 'sector'],
  gender: ['gender', 'sex'],
  ageMonths: ['ageinmonths', 'agemonths', 'agemo', 'age'],
  weightKg: ['weightkg', 'wtkg', 'weight', 'wt'],
  heightCm: ['heightcm', 'htcm', 'height', 'ht'],
  muacCm: ['muaccm', 'muac'],
  stunting: ['stuntingstatus', 'stuntedstatus', 'stunting', 'stunted'],
  wasting: ['wastingstatus', 'wastedstatus', 'wasting', 'wasted'],
  underweight: ['underweightstatus', 'underweight'],
};

function normalizeKey(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function indexedRow(row: RawRow) {
  const map = new Map<string, unknown>();
  Object.entries(row).forEach(([key, value]) => {
    map.set(normalizeKey(key), value);
  });
  return map;
}

function pickValue(row: RawRow, aliases: string[]) {
  const map = indexedRow(row);
  for (const alias of aliases) {
    const exact = map.get(alias);
    if (exact !== undefined && exact !== null && String(exact).trim() !== '') return exact;
  }

  for (const [key, value] of map.entries()) {
    if (value === undefined || value === null || String(value).trim() === '') continue;
    if (aliases.some((alias) => alias.length > 4 && key.includes(alias))) return value;
  }

  return '';
}

function textValue(value: unknown, fallback = '') {
  if (value === undefined || value === null) return fallback;
  const text = String(value).trim();
  return text || fallback;
}

function numericValue(value: unknown, fallback = 0) {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  const text = String(value ?? '').replace(/,/g, '').trim();
  const match = text.match(/-?\d+(\.\d+)?/);
  if (!match) return fallback;
  const parsed = Number(match[0]);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function parseGender(value: unknown): PoshanGender {
  const text = textValue(value).toLowerCase();
  if (text === 'm' || text.startsWith('male') || text.includes('boy')) return 'Male';
  if (text === 'f' || text.startsWith('female') || text.includes('girl')) return 'Female';
  return 'Other';
}

function calculateBmi(weightKg: number, heightCm: number) {
  const heightM = heightCm / 100;
  if (!heightM || !weightKg) return 0;
  return Number((weightKg / (heightM * heightM)).toFixed(1));
}

function expectedHeight(ageMonths: number, gender: PoshanGender) {
  const sexOffset = gender === 'Male' ? 0.5 : gender === 'Female' ? -0.2 : 0;
  if (ageMonths <= 12) return 49.5 + ageMonths * 2.05 + sexOffset;
  return 74 + (ageMonths - 12) * 0.72 + sexOffset;
}

function expectedWeight(ageMonths: number, gender: PoshanGender) {
  const sexOffset = gender === 'Male' ? 0.15 : gender === 'Female' ? -0.05 : 0;
  if (ageMonths <= 12) return 3.2 + ageMonths * 0.46 + sexOffset;
  return 9.1 + (ageMonths - 12) * 0.18 + sexOffset;
}

function expectedWeightForHeight(heightCm: number, gender: PoshanGender) {
  const sexOffset = gender === 'Male' ? 0.2 : gender === 'Female' ? -0.1 : 0;
  return Math.max(2.5, -8 + heightCm * 0.235 + sexOffset);
}

function normalizeStunting(value: unknown): StuntingStatus | null {
  const text = textValue(value).toLowerCase();
  if (!text) return null;
  if (text.includes('normal') || text === 'no') return 'normal';
  if (text.includes('severe') || text.includes('sev')) return 'severely stunted';
  if (text.includes('moderate') || text.includes('mod') || text.includes('stunt') || text === 'yes') return 'moderately stunted';
  return null;
}

function normalizeWasting(value: unknown): WastingStatus | null {
  const text = textValue(value).toLowerCase();
  if (!text) return null;
  if (text.includes('normal') || text === 'no') return 'normal';
  if (text.includes('obese')) return 'obese';
  if (text.includes('over')) return 'overweight';
  if (text.includes('sam') || text.includes('severe') || text.includes('sev')) return 'SAM';
  if (text.includes('mam') || text.includes('moderate') || text.includes('mod') || text.includes('wast') || text === 'yes') return 'MAM';
  return null;
}

function normalizeUnderweight(value: unknown): UnderweightStatus | null {
  const text = textValue(value).toLowerCase();
  if (!text) return null;
  if (text.includes('normal') || text === 'no') return 'normal';
  if (text.includes('severe') || text.includes('sev')) return 'severely underweight';
  if (text.includes('moderate') || text.includes('mod') || text.includes('under') || text === 'yes') return 'moderately underweight';
  return null;
}

function deriveStunting(ageMonths: number, heightCm: number, gender: PoshanGender): StuntingStatus {
  if (!ageMonths || !heightCm) return 'normal';
  const z = (heightCm - expectedHeight(ageMonths, gender)) / 3.4;
  if (z < -3) return 'severely stunted';
  if (z < -2) return 'moderately stunted';
  return 'normal';
}

function deriveWasting(heightCm: number, weightKg: number, gender: PoshanGender, muacCm?: number): WastingStatus {
  if (muacCm !== undefined && muacCm > 0) {
    if (muacCm < 11.5) return 'SAM';
    if (muacCm < 12.5) return 'MAM';
  }

  if (!heightCm || !weightKg) return 'normal';
  const z = (weightKg - expectedWeightForHeight(heightCm, gender)) / 1.1;
  if (z < -3) return 'SAM';
  if (z < -2) return 'MAM';
  if (z > 3) return 'obese';
  if (z > 2) return 'overweight';
  return 'normal';
}

function deriveUnderweight(ageMonths: number, weightKg: number, gender: PoshanGender): UnderweightStatus {
  if (!ageMonths || !weightKg) return 'normal';
  const z = (weightKg - expectedWeight(ageMonths, gender)) / 1.15;
  if (z < -3) return 'severely underweight';
  if (z < -2) return 'moderately underweight';
  return 'normal';
}

function classifySeverity(stunting: StuntingStatus, wasting: WastingStatus, underweight: UnderweightStatus): PoshanSeverity {
  if (stunting === 'severely stunted' || wasting === 'SAM' || underweight === 'severely underweight') return 'severe';
  if (stunting === 'moderately stunted' || wasting === 'MAM' || underweight === 'moderately underweight') return 'moderate';
  return 'normal';
}

function riskScore(record: Pick<PoshanBeneficiary, 'ageMonths' | 'stunting' | 'wasting' | 'underweight' | 'severity'>) {
  let score = 0;
  if (record.stunting === 'moderately stunted') score += 12;
  if (record.stunting === 'severely stunted') score += 26;
  if (record.wasting === 'MAM') score += 18;
  if (record.wasting === 'SAM') score += 36;
  if (record.underweight === 'moderately underweight') score += 14;
  if (record.underweight === 'severely underweight') score += 28;
  if (record.ageMonths <= 24 && record.severity !== 'normal') score += 8;
  return Math.min(100, score);
}

function percentage(value: number, total: number, decimals = 1) {
  if (!total) return 0;
  return Number(((value / total) * 100).toFixed(decimals));
}

function countBy<T extends string>(values: T[]) {
  return values.reduce<Record<T, number>>((acc, value) => {
    acc[value] = (acc[value] ?? 0) + 1;
    return acc;
  }, {} as Record<T, number>);
}

function isAffected(record: PoshanBeneficiary) {
  return record.stunting !== 'normal' || record.wasting === 'MAM' || record.wasting === 'SAM' || record.underweight !== 'normal';
}

function groupBy<T>(items: T[], keyGetter: (item: T) => string) {
  const groups = new Map<string, T[]>();
  items.forEach((item) => {
    const key = keyGetter(item);
    groups.set(key, [...(groups.get(key) ?? []), item]);
  });
  return groups;
}

function labelAgeBand(ageMonths: number) {
  if (ageMonths <= 6) return '0-6 mo';
  if (ageMonths <= 12) return '7-12 mo';
  if (ageMonths <= 24) return '13-24 mo';
  if (ageMonths <= 36) return '25-36 mo';
  if (ageMonths <= 48) return '37-48 mo';
  if (ageMonths <= 60) return '49-60 mo';
  return '60+ mo';
}

function normalizeRow(row: RawRow, index: number): PoshanBeneficiary | null {
  const beneficiary = textValue(pickValue(row, aliasMap.beneficiary), `Beneficiary ${index + 1}`);
  const caregiver = textValue(pickValue(row, aliasMap.caregiver), 'Caregiver not listed');
  const awc = textValue(pickValue(row, aliasMap.awc), 'Unassigned AWC').toUpperCase();
  const sector = textValue(pickValue(row, aliasMap.sector), 'SECTOR - I').toUpperCase();
  const gender = parseGender(pickValue(row, aliasMap.gender));
  const ageMonths = Math.max(0, Math.round(numericValue(pickValue(row, aliasMap.ageMonths), 0)));
  const weightKg = Number(numericValue(pickValue(row, aliasMap.weightKg), 0).toFixed(2));
  const heightCm = Number(numericValue(pickValue(row, aliasMap.heightCm), 0).toFixed(1));
  const muacRaw = numericValue(pickValue(row, aliasMap.muacCm), 0);
  const muacCm = muacRaw > 0 ? Number(muacRaw.toFixed(1)) : undefined;

  if (!beneficiary || (!ageMonths && !weightKg && !heightCm)) return null;

  const stunting = normalizeStunting(pickValue(row, aliasMap.stunting)) ?? deriveStunting(ageMonths, heightCm, gender);
  const wasting = normalizeWasting(pickValue(row, aliasMap.wasting)) ?? deriveWasting(heightCm, weightKg, gender, muacCm);
  const underweight = normalizeUnderweight(pickValue(row, aliasMap.underweight)) ?? deriveUnderweight(ageMonths, weightKg, gender);
  const severity = classifySeverity(stunting, wasting, underweight);

  const normalized: PoshanBeneficiary = {
    id: `poshan-${index + 1}`,
    beneficiary,
    caregiver,
    awc,
    sector,
    gender,
    ageMonths,
    weightKg,
    heightCm,
    muacCm,
    bmi: calculateBmi(weightKg, heightCm),
    stunting,
    wasting,
    underweight,
    severity,
    riskScore: 0,
  };

  return { ...normalized, riskScore: riskScore(normalized) };
}

export function normalizePoshanRows(rows: RawRow[]) {
  return rows.map((row, index) => normalizeRow(row, index)).filter((record): record is PoshanBeneficiary => Boolean(record));
}

function rowsToObjects(rows: SheetCell[][]): RawRow[] {
  const [headerRow, ...dataRows] = rows;
  if (!headerRow?.length) return [];

  const headers = headerRow.map((header, index) => textValue(header, `Column ${index + 1}`));
  return dataRows
    .filter((row) => row.some((cell) => textValue(cell) !== ''))
    .map((row) => {
      const objectRow: RawRow = {};
      headers.forEach((header, index) => {
        objectRow[header] = row[index] ?? '';
      });
      return objectRow;
    });
}

function parseCsvRows(text: string): string[][] {
  const rows: string[][] = [];
  let current = '';
  let row: string[] = [];
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];

    if (char === '"' && inQuotes && next === '"') {
      current += '"';
      index += 1;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      row.push(current.trim());
      current = '';
    } else if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && next === '\n') index += 1;
      row.push(current.trim());
      if (row.some(Boolean)) rows.push(row);
      row = [];
      current = '';
    } else {
      current += char;
    }
  }

  row.push(current.trim());
  if (row.some(Boolean)) rows.push(row);
  return rows;
}

export async function parsePoshanTrackerFile(file: File) {
  const isCsv = file.name.toLowerCase().endsWith('.csv') || file.type.includes('csv');
  const sheetRows = isCsv ? parseCsvRows(await file.text()) : await readXlsxFile(file);
  return normalizePoshanRows(rowsToObjects(sheetRows as SheetCell[][]));
}

function distribution(name: string, value: number, color: string): PoshanDistributionPoint {
  return { name, value, color };
}

function buildInsightCards(records: PoshanBeneficiary[], summary: PoshanAnalysis['summary'], awcLoad: PoshanAnalysis['awcLoad']) {
  const total = summary.total;
  const topHotspot = awcLoad[0];
  const zeroToTwentyFour = records.filter((record) => record.ageMonths <= 24);
  const youngAtRisk = zeroToTwentyFour.filter(isAffected).length;
  const maleRecords = records.filter((record) => record.gender === 'Male');
  const femaleRecords = records.filter((record) => record.gender === 'Female');
  const maleStunted = maleRecords.filter((record) => record.stunting !== 'normal').length;
  const femaleStunted = femaleRecords.filter((record) => record.stunting !== 'normal').length;
  const maleRate = percentage(maleStunted, maleRecords.length);
  const femaleRate = percentage(femaleStunted, femaleRecords.length);
  const gap = Math.abs(maleRate - femaleRate);
  const projected = Math.max(4, Math.round(summary.atRisk * 0.18));

  return [
    {
      title: 'Severe malnutrition load detected',
      metric: `${records.filter((record) => record.severity === 'severe').length} children (${percentage(records.filter((record) => record.severity === 'severe').length, total)}%)`,
      body: `${summary.sam} SAM cases need immediate NRC referral. Prioritize home visits for severe stunting or underweight flags.`,
      tone: 'red' as const,
    },
    {
      title: 'Stunting prevalence',
      metric: `${percentage(summary.stunted, total)}%`,
      body: `${summary.stunted} of ${total} beneficiaries show stunting. Prioritize complementary feeding outreach and monthly height review.`,
      tone: 'amber' as const,
    },
    {
      title: 'Top intervention hotspot',
      metric: topHotspot?.awc ?? 'No hotspot',
      body: topHotspot
        ? `${percentage(topHotspot.affected, topHotspot.total, 0)}% of ${topHotspot.total} children at this AWC are affected. Recommend supervised supplementary nutrition for 90 days.`
        : 'No AWC cluster is available in this upload.',
      tone: 'red' as const,
    },
    {
      title: 'Critical 0-24 month window',
      metric: `${youngAtRisk}/${zeroToTwentyFour.length || 0}`,
      body: 'Children in the first 1000 days need tighter THR follow-up, growth monitoring, and caregiver counselling.',
      tone: 'blue' as const,
    },
    {
      title: 'Gender disparity signal',
      metric: `${gap.toFixed(1)} pp gap`,
      body: maleRate > femaleRate ? 'Male children show higher stunting prevalence.' : 'Female children show higher stunting prevalence.',
      tone: 'blue' as const,
    },
    {
      title: 'Projected 90-day outcome',
      metric: `-${percentage(projected, Math.max(summary.atRisk, 1), 1)}%`,
      body: `If intervention plan is executed, the model projects ${projected} children can move out of moderate risk within one quarter.`,
      tone: 'emerald' as const,
    },
  ];
}

function buildPriorityActions(records: PoshanBeneficiary[], summary: PoshanAnalysis['summary']) {
  const supplementary = records.filter((record) => record.wasting === 'MAM' || record.underweight !== 'normal').length;
  const growthMonitoring = records.filter((record) => record.stunting !== 'normal').length;
  const counseling = records.filter((record) => record.ageMonths <= 24 && isAffected(record)).length;
  const micronutrients = records.filter((record) => record.underweight !== 'normal').length;
  const routine = records.filter((record) => record.severity === 'normal').length;
  const max = Math.max(summary.total, 1);

  return [
    { priority: 'critical' as const, title: 'NRC referral (SAM)', count: summary.sam, progress: percentage(summary.sam, max, 0) },
    { priority: 'high' as const, title: 'Supplementary nutrition', count: supplementary, progress: percentage(supplementary, max, 0) },
    { priority: 'high' as const, title: 'Growth monitoring', count: growthMonitoring, progress: percentage(growthMonitoring, max, 0) },
    { priority: 'medium' as const, title: 'Caregiver counseling', count: counseling, progress: percentage(counseling, max, 0) },
    { priority: 'medium' as const, title: 'Micronutrient supplementation', count: micronutrients, progress: percentage(micronutrients, max, 0) },
    { priority: 'routine' as const, title: 'Routine follow-up', count: routine, progress: percentage(routine, max, 0) },
  ];
}

function buildRadarData(keys: string[], metrics: Array<{ label: string; getter: (items: PoshanBeneficiary[]) => number }>, groups: Map<string, PoshanBeneficiary[]>) {
  return metrics.map((metric) => {
    const point: Record<string, string | number> = { metric: metric.label };
    keys.forEach((key) => {
      point[key] = metric.getter(groups.get(key) ?? []);
    });
    return point;
  });
}

export function analyzePoshanRecords(records: PoshanBeneficiary[], fileName: string): PoshanAnalysis {
  const total = records.length;
  const stuntingCounts = countBy(records.map((record) => record.stunting));
  const wastingCounts = countBy(records.map((record) => record.wasting));
  const underweightCounts = countBy(records.map((record) => record.underweight));
  const genderCounts = countBy(records.map((record) => record.gender));
  const atRisk = records.filter(isAffected).length;
  const severeCount = records.filter((record) => record.severity === 'severe').length;
  const riskIndex = Math.min(100, Math.round(percentage(atRisk, total, 0) * 0.45 + percentage(severeCount, total, 0) * 0.35 + percentage(wastingCounts.SAM ?? 0, total, 0) * 0.2));

  const summary = {
    total,
    fullyNormal: records.filter((record) => record.severity === 'normal').length,
    stunted: (stuntingCounts['moderately stunted'] ?? 0) + (stuntingCounts['severely stunted'] ?? 0),
    moderateStunted: stuntingCounts['moderately stunted'] ?? 0,
    severeStunted: stuntingCounts['severely stunted'] ?? 0,
    wasted: (wastingCounts.MAM ?? 0) + (wastingCounts.SAM ?? 0),
    mam: wastingCounts.MAM ?? 0,
    sam: wastingCounts.SAM ?? 0,
    underweight: (underweightCounts['moderately underweight'] ?? 0) + (underweightCounts['severely underweight'] ?? 0),
    moderateUnderweight: underweightCounts['moderately underweight'] ?? 0,
    severeUnderweight: underweightCounts['severely underweight'] ?? 0,
    atRisk,
    awcs: new Set(records.map((record) => record.awc)).size,
    sectors: new Set(records.map((record) => record.sector)).size,
    riskIndex,
    projectedReduction: Math.max(1, Math.round(atRisk * 0.19)),
  };

  const awcGroups = groupBy(records, (record) => record.awc);
  const awcLoad = Array.from(awcGroups.entries())
    .map(([awc, items]) => {
      const stunted = items.filter((record) => record.stunting !== 'normal').length;
      const wasted = items.filter((record) => record.wasting === 'MAM' || record.wasting === 'SAM').length;
      const underweight = items.filter((record) => record.underweight !== 'normal').length;
      const affected = items.filter(isAffected).length;
      return {
        awc,
        stunted,
        wasted,
        underweight,
        affected,
        total: items.length,
        riskIndex: Math.round(items.reduce((sum, record) => sum + record.riskScore, 0) / Math.max(items.length, 1)),
      };
    })
    .sort((a, b) => b.affected - a.affected || b.riskIndex - a.riskIndex)
    .slice(0, 10);

  const sectorGroups = groupBy(records, (record) => record.sector);
  const sectorSeverity = Array.from(sectorGroups.entries()).map(([sector, items]) => ({
    sector,
    normal: items.filter((record) => record.severity === 'normal').length,
    moderate: items.filter((record) => record.severity === 'moderate').length,
    severe: items.filter((record) => record.severity === 'severe').length,
  }));

  const ageBands = ['0-6 mo', '7-12 mo', '13-24 mo', '25-36 mo', '37-48 mo', '49-60 mo', '60+ mo'];
  const ageGroups = groupBy(records, (record) => labelAgeBand(record.ageMonths));
  const ageImpact = ageBands.map((ageBand) => {
    const items = ageGroups.get(ageBand) ?? [];
    return {
      ageBand,
      stunted: items.filter((record) => record.stunting !== 'normal').length,
      wasted: items.filter((record) => record.wasting === 'MAM' || record.wasting === 'SAM').length,
      underweight: items.filter((record) => record.underweight !== 'normal').length,
    };
  });

  const recoveryProjection = [0, 30, 60, 90, 120, 150, 180].map((day) => ({
    day: day === 0 ? 'Now' : `+${day}d`,
    affected: Math.max(0, Math.round(atRisk - (atRisk * 0.72 * day) / 180)),
    recovered: Math.round((atRisk * 0.58 * day) / 180),
  }));

  const topAwcKeys = awcLoad.slice(0, 6).map((item) => item.awc);
  const awcRadar = buildRadarData(
    topAwcKeys,
    [
      { label: 'Stunted %', getter: (items) => percentage(items.filter((record) => record.stunting !== 'normal').length, items.length, 0) },
      { label: 'Wasted %', getter: (items) => percentage(items.filter((record) => record.wasting === 'MAM' || record.wasting === 'SAM').length, items.length, 0) },
      { label: 'Underweight %', getter: (items) => percentage(items.filter((record) => record.underweight !== 'normal').length, items.length, 0) },
      { label: 'Severe %', getter: (items) => percentage(items.filter((record) => record.severity === 'severe').length, items.length, 0) },
      { label: 'Risk idx', getter: (items) => Math.round(items.reduce((sum, record) => sum + record.riskScore, 0) / Math.max(items.length, 1)) },
    ],
    awcGroups
  );

  const topSectorKeys = sectorSeverity
    .sort((a, b) => b.moderate + b.severe - (a.moderate + a.severe))
    .slice(0, 6)
    .map((item) => item.sector);
  const sectorRadar = buildRadarData(
    topSectorKeys,
    [
      { label: 'Stunted %', getter: (items) => percentage(items.filter((record) => record.stunting !== 'normal').length, items.length, 0) },
      { label: 'Wasted %', getter: (items) => percentage(items.filter((record) => record.wasting === 'MAM' || record.wasting === 'SAM').length, items.length, 0) },
      { label: 'Underweight %', getter: (items) => percentage(items.filter((record) => record.underweight !== 'normal').length, items.length, 0) },
      { label: 'Severe %', getter: (items) => percentage(items.filter((record) => record.severity === 'severe').length, items.length, 0) },
    ],
    sectorGroups
  );

  const genderGroups = groupBy(records, (record) => record.gender);

  return {
    fileName,
    records,
    summary,
    distributions: {
      stunting: [
        distribution('normal', stuntingCounts.normal ?? 0, colors.normal),
        distribution('Mod.Stunted', stuntingCounts['moderately stunted'] ?? 0, colors.amber),
        distribution('Sev.Stunted', stuntingCounts['severely stunted'] ?? 0, colors.severe),
      ],
      wasting: [
        distribution('normal', wastingCounts.normal ?? 0, colors.normal),
        distribution('MAM', wastingCounts.MAM ?? 0, colors.amber),
        distribution('SAM', wastingCounts.SAM ?? 0, colors.severe),
        distribution('Overweight', wastingCounts.overweight ?? 0, colors.violet),
        distribution('Obese', wastingCounts.obese ?? 0, colors.pink),
      ].filter((item) => item.value > 0 || item.name === 'normal'),
      underweight: [
        distribution('normal', underweightCounts.normal ?? 0, colors.normal),
        distribution('Mod.UW', underweightCounts['moderately underweight'] ?? 0, colors.violet),
        distribution('Sev.UW', underweightCounts['severely underweight'] ?? 0, '#6d28d9'),
      ],
      gender: [
        distribution('Male', genderCounts.Male ?? 0, colors.blue),
        distribution('Female', genderCounts.Female ?? 0, colors.pink),
        distribution('Other', genderCounts.Other ?? 0, '#94a3b8'),
      ].filter((item) => item.value > 0),
    },
    severityComparison: [
      {
        band: 'Normal',
        stunting: stuntingCounts.normal ?? 0,
        wasting: wastingCounts.normal ?? 0,
        underweight: underweightCounts.normal ?? 0,
      },
      {
        band: 'Moderate',
        stunting: stuntingCounts['moderately stunted'] ?? 0,
        wasting: wastingCounts.MAM ?? 0,
        underweight: underweightCounts['moderately underweight'] ?? 0,
      },
      {
        band: 'Severe/SAM',
        stunting: stuntingCounts['severely stunted'] ?? 0,
        wasting: wastingCounts.SAM ?? 0,
        underweight: underweightCounts['severely underweight'] ?? 0,
      },
    ],
    awcLoad,
    sectorSeverity,
    ageImpact,
    bmiScatter: records.map((record) => ({
      ageMonths: record.ageMonths,
      bmi: record.bmi,
      severity: record.severity,
      beneficiary: record.beneficiary,
    })),
    severityRadar: [
      { metric: 'Sev.Stunted', value: stuntingCounts['severely stunted'] ?? 0 },
      { metric: 'Mod.Stunted', value: stuntingCounts['moderately stunted'] ?? 0 },
      { metric: 'SAM', value: wastingCounts.SAM ?? 0 },
      { metric: 'MAM', value: wastingCounts.MAM ?? 0 },
      { metric: 'Mod.UW', value: underweightCounts['moderately underweight'] ?? 0 },
      { metric: 'Sev.UW', value: underweightCounts['severely underweight'] ?? 0 },
    ],
    genderStunting: ['Male', 'Female', 'Other'].map((gender) => {
      const items = genderGroups.get(gender) ?? [];
      return {
        gender,
        normal: items.filter((record) => record.stunting === 'normal').length,
        stunted: items.filter((record) => record.stunting !== 'normal').length,
      };
    }).filter((item) => item.normal + item.stunted > 0),
    recoveryProjection,
    awcRadar,
    awcRadarKeys: topAwcKeys,
    genderRadar: ['Stunted', 'Wasted', 'Underweight', 'Moderate', 'Severe'].map((metric) => {
      const male = genderGroups.get('Male') ?? [];
      const female = genderGroups.get('Female') ?? [];
      const getValue = (items: PoshanBeneficiary[]) => {
        if (metric === 'Stunted') return percentage(items.filter((record) => record.stunting !== 'normal').length, items.length, 0);
        if (metric === 'Wasted') return percentage(items.filter((record) => record.wasting === 'MAM' || record.wasting === 'SAM').length, items.length, 0);
        if (metric === 'Underweight') return percentage(items.filter((record) => record.underweight !== 'normal').length, items.length, 0);
        if (metric === 'Moderate') return percentage(items.filter((record) => record.severity === 'moderate').length, items.length, 0);
        return percentage(items.filter((record) => record.severity === 'severe').length, items.length, 0);
      };
      return { metric, Male: getValue(male), Female: getValue(female) };
    }),
    ageRadar: ageImpact.map((item) => ({
      metric: item.ageBand,
      stunted: item.stunted,
      wasted: item.wasted,
      underweight: item.underweight,
    })),
    sectorRadar,
    sectorRadarKeys: topSectorKeys,
    insights: buildInsightCards(records, summary, awcLoad),
    priorityActions: buildPriorityActions(records, summary),
  };
}

function sample(
  beneficiary: string,
  caregiver: string,
  awc: string,
  sector: string,
  gender: 'M' | 'F',
  ageMonths: number,
  weightKg: number,
  heightCm: number,
  stunting: StuntingStatus,
  wasting: WastingStatus,
  underweight: UnderweightStatus
) {
  return {
    Beneficiary: beneficiary,
    Mother: caregiver,
    AWC: awc,
    Sector: sector,
    Gender: gender,
    'Age (mo)': ageMonths,
    'Wt (kg)': weightKg,
    'Ht (cm)': heightCm,
    Stunted: stunting,
    Wasted: wasting,
    Underweight: underweight,
  };
}

const sampleRows: RawRow[] = [
  sample('Babu Gahir', 'Manisha Gahir', 'AMBAGACHHAPADA', 'SECTOR - I', 'M', 1, 3, 50, 'normal', 'normal', 'normal'),
  sample('New Chandan', 'Manisha Chandan', 'AMBAGACHHAPADA', 'SECTOR - I', 'F', 5, 7, 63, 'moderately stunted', 'normal', 'normal'),
  sample('New pradhan', 'Jamuna Pradhan', 'AMBAGACHHAPADA', 'SECTOR - I', 'F', 3, 4.8, 54.5, 'moderately stunted', 'normal', 'normal'),
  sample('Adyansha Dash', 'Shaisudha Dash', 'AMBAGACHHAPADA', 'SECTOR - I', 'F', 58, 15, 99.5, 'normal', 'normal', 'normal'),
  sample('Anirban Bhakta', 'Munmun Bhakta', 'AMBAGACHHAPADA', 'SECTOR - I', 'M', 43, 15, 100, 'normal', 'normal', 'normal'),
  sample('Anshuman Bhati', 'Anupama Raut', 'AMBAGACHHAPADA', 'SECTOR - I', 'M', 39, 14.2, 99.5, 'normal', 'normal', 'normal'),
  sample('Aparna Majhi', 'Reena Majhi', 'AMBAGACHHAPADA', 'SECTOR - I', 'F', 51, 15.3, 99.5, 'normal', 'normal', 'normal'),
  sample('Baisali Naik', 'Sindukta Naik', 'AMBAGACHHAPADA', 'SECTOR - I', 'F', 41, 15.6, 91.5, 'moderately stunted', 'normal', 'normal'),
  sample('Baishnabi Rour', 'Priyadarshini Rout', 'AMBAGACHHAPADA', 'SECTOR - I', 'F', 49, 13.2, 97, 'normal', 'normal', 'normal'),
  sample('Baishnabi Das', 'Jhili Das', 'AMBAGACHHAPADA', 'SECTOR - I', 'F', 57, 14.8, 100, 'normal', 'normal', 'normal'),
  sample('Banya Bag', 'Kumudini Bag', 'AMBAGACHHAPADA', 'SECTOR - I', 'F', 42, 14, 99, 'normal', 'normal', 'normal'),
  sample('Raju Sahu', 'Suman Sahu', 'HILL TOWN', 'SECTOR - II', 'M', 36, 11, 89, 'severely stunted', 'MAM', 'severely underweight'),
  sample('Pinky Devi', 'Anita Devi', 'HILL TOWN', 'SECTOR - II', 'F', 28, 9.5, 82, 'severely stunted', 'normal', 'moderately underweight'),
  sample('Arjun Patel', 'Geeta Patel', 'HILL TOWN', 'SECTOR - II', 'M', 48, 13.5, 95, 'moderately stunted', 'normal', 'moderately underweight'),
  sample('Kavita Naik', 'Basanti Naik', 'HILL TOWN', 'SECTOR - II', 'F', 20, 7.8, 74, 'severely stunted', 'MAM', 'severely underweight'),
  sample('Manas Behera', 'Rashmi Behera', 'HILL TOWN', 'SECTOR - II', 'M', 18, 8.5, 76, 'moderately stunted', 'normal', 'moderately underweight'),
  sample('Lata Rana', 'Kamala Rana', 'HILL TOWN', 'SECTOR - II', 'F', 22, 8.1, 75, 'severely stunted', 'normal', 'severely underweight'),
  sample('Suman Nayak', 'Jharana Nayak', 'KALIMANDIR - I', 'SECTOR - III', 'M', 30, 10.4, 86, 'moderately stunted', 'MAM', 'moderately underweight'),
  sample('Gita Dora', 'Mamata Dora', 'KALIMANDIR - I', 'SECTOR - III', 'F', 31, 10.2, 85, 'moderately stunted', 'normal', 'moderately underweight'),
  sample('Deepak Majhi', 'Pratima Majhi', 'KALIMANDIR - I', 'SECTOR - III', 'M', 33, 10, 84, 'severely stunted', 'MAM', 'severely underweight'),
  sample('Mina Jena', 'Rukmani Jena', 'KALIMANDIR - I', 'SECTOR - III', 'F', 26, 9.8, 84, 'moderately stunted', 'MAM', 'moderately underweight'),
  sample('Rohit Barik', 'Sabitri Barik', 'KALIMANDIR - I', 'SECTOR - III', 'M', 44, 12.9, 94, 'moderately stunted', 'normal', 'normal'),
  sample('Sabita Das', 'Nirmala Das', 'KALIMANDIR - I', 'SECTOR - III', 'F', 37, 11.8, 90, 'moderately stunted', 'normal', 'moderately underweight'),
  sample('Pihu Malik', 'Laxmi Malik', 'NAKTIGUDA - I', 'SECTOR - IV', 'F', 25, 9.7, 83, 'moderately stunted', 'normal', 'moderately underweight'),
  sample('Gopal Rana', 'Hema Rana', 'NAKTIGUDA - I', 'SECTOR - IV', 'M', 35, 11.2, 88, 'moderately stunted', 'MAM', 'moderately underweight'),
  sample('Rina Padhan', 'Sujata Padhan', 'NAKTIGUDA - I', 'SECTOR - IV', 'F', 29, 9.3, 82, 'severely stunted', 'normal', 'severely underweight'),
  sample('Ajay Gouda', 'Bimala Gouda', 'NAKTIGUDA - I', 'SECTOR - IV', 'M', 52, 15.2, 101, 'normal', 'normal', 'normal'),
  sample('Sakshi Sethy', 'Jaya Sethy', 'NAKTIGUDA - I', 'SECTOR - IV', 'F', 34, 10.5, 87, 'moderately stunted', 'MAM', 'moderately underweight'),
  sample('Nisha Rout', 'Mitali Rout', 'ARKABAHALI- II', 'SECTOR - V', 'F', 38, 11.3, 90, 'moderately stunted', 'normal', 'moderately underweight'),
  sample('Kiran Soren', 'Asha Soren', 'ARKABAHALI- II', 'SECTOR - V', 'M', 40, 14.1, 96, 'normal', 'normal', 'normal'),
  sample('Lalita Tandi', 'Sunita Tandi', 'ARKABAHALI- II', 'SECTOR - V', 'F', 32, 10.9, 88, 'moderately stunted', 'MAM', 'normal'),
  sample('Tapan Kalia', 'Sarita Kalia', 'ARKABAHALI- II', 'SECTOR - V', 'M', 45, 12.4, 93, 'moderately stunted', 'normal', 'moderately underweight'),
  sample('Meena Harijan', 'Puspa Harijan', 'HARIJAN PADA', 'SECTOR - VI', 'F', 24, 8.8, 80, 'moderately stunted', 'normal', 'moderately underweight'),
  sample('Prakash Naik', 'Binodini Naik', 'HARIJAN PADA', 'SECTOR - VI', 'M', 55, 15.8, 102, 'normal', 'normal', 'normal'),
  sample('Rekha Kumbhar', 'Janaki Kumbhar', 'HARIJAN PADA', 'SECTOR - VI', 'F', 27, 9, 81, 'severely stunted', 'MAM', 'severely underweight'),
  sample('Hari Samal', 'Bharati Samal', 'GOUDBANGTIPADA', 'SECTOR - VII', 'M', 46, 14.5, 98, 'normal', 'normal', 'normal'),
  sample('Chitra Mallick', 'Dipa Mallick', 'GOUDBANGTIPADA', 'SECTOR - VII', 'F', 21, 8.7, 78, 'moderately stunted', 'normal', 'moderately underweight'),
  sample('Mahesh Roul', 'Basanti Roul', 'KALIMANDIR - II', 'SECTOR - III', 'M', 49, 13.4, 95, 'moderately stunted', 'normal', 'normal'),
  sample('Sita Behera', 'Latika Behera', 'KALIMANDIR - II', 'SECTOR - III', 'F', 41, 13.2, 96, 'normal', 'normal', 'normal'),
  sample('Rahul Pangi', 'Damayanti Pangi', 'ARKABAHALI- I', 'SECTOR - V', 'M', 53, 15.4, 101, 'normal', 'normal', 'normal'),
  sample('Anita Sabar', 'Kamini Sabar', 'ARKABAHALI- I', 'SECTOR - V', 'F', 36, 11.4, 89, 'moderately stunted', 'normal', 'moderately underweight'),
  sample('Omkar Das', 'Purnima Das', 'BALGOPALMANDIR', 'SECTOR - II', 'M', 50, 15.1, 100, 'normal', 'normal', 'normal'),
  sample('Jyoti Kullu', 'Pabitra Kullu', 'BALGOPALMANDIR', 'SECTOR - II', 'F', 39, 12.1, 91, 'moderately stunted', 'normal', 'moderately underweight'),
];

export function getSamplePoshanRecords() {
  return normalizePoshanRows(sampleRows);
}
