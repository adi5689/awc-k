import { useEffect, useState } from 'react';
import {
  AlertTriangle,
  Apple,
  BarChart3,
  CalendarDays,
  CheckCircle,
  ClipboardList,
  Download,
  FileSpreadsheet,
  HeartPulse,
  Home,
  Plus,
  Ruler,
  Save,
  Scale,
  ShieldCheck,
  Soup,
  Stethoscope,
  Utensils,
} from 'lucide-react';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import {
  managedChildren,
  monthlyIntakeByChild,
  nutritionTrackingByChild,
  type ChildNutritionBand,
  type ManagedChild,
  type MonthlyIntake,
} from '../../data/childMonitoringData';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Progress } from '../../components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { SideDrawer } from '../../components/ui/side-drawer';
import { ToggleSwitch } from '../../components/ui/toggle-switch';
import { useAppStore } from '../../store/useAppStore';
import { cn } from '../../utils';
import { downloadCsv, downloadExcelHtml } from '../../utils/exportFiles';
import { calculateWhoZScores } from '../../utils/whoGrowth';

type NutritionRecord = {
  weight: number;
  height: number;
  muac: number;
  breastfeedingStatus: string;
  mealsPerDay: number;
  diversityScore: number;
  foodGroups: string[];
  thrReceived: boolean;
  thrConsumed: boolean;
  appetite: string;
  illness: string;
  edema: boolean;
  homeVisitNeeded: boolean;
};

type NutritionEntryForm = NutritionRecord & {
  entryDate: string;
  assignedWorker: string;
  followUpAction: string;
  notes: string;
};

const defaultNutritionRecord: NutritionRecord = {
  weight: 0,
  height: 0,
  muac: 0,
  breastfeedingStatus: 'Not recorded',
  mealsPerDay: 0,
  diversityScore: 0,
  foodGroups: [],
  thrReceived: false,
  thrConsumed: false,
  appetite: 'Normal',
  illness: 'None',
  edema: false,
  homeVisitNeeded: false,
};

const foodGroupOptions = ['Grains', 'Pulses', 'Milk', 'Egg/Fish/Meat', 'Vegetables', 'Fruits', 'Fats'];
const NUTRITION_CACHE_KEY = 'awc-nutrition-records';
const NUTRITION_HISTORY_CACHE_KEY = 'awc-nutrition-history';

function readJsonCache<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;

  try {
    const cached = localStorage.getItem(key);
    return cached ? JSON.parse(cached) as T : fallback;
  } catch {
    return fallback;
  }
}

function getTodayIso() {
  return new Date().toISOString().slice(0, 10);
}

function getNutritionBand(record: NutritionRecord, child?: ManagedChild): ChildNutritionBand {
  if (child && record.weight > 0 && record.height > 0) {
    return calculateWhoZScores(child, record).band;
  }

  if (record.edema || (record.muac > 0 && record.muac < 11.5)) {
    return 'Severe';
  }

  if (record.muac >= 11.5 && record.muac < 12.5) {
    return 'Moderate';
  }

  if (record.diversityScore >= 75 && record.mealsPerDay >= 4 && record.thrReceived && record.thrConsumed) {
    return 'Normal';
  }

  if (record.diversityScore >= 50 && record.mealsPerDay >= 3) {
    return 'Moderate';
  }

  return 'Severe';
}

function createEntryDraft(record: Partial<NutritionRecord>): NutritionEntryForm {
  return {
    ...defaultNutritionRecord,
    ...record,
    foodGroups: record.foodGroups ?? [],
    entryDate: getTodayIso(),
    assignedWorker: 'AWC Worker',
    followUpAction: record.homeVisitNeeded ? 'Schedule home visit' : 'Routine monitoring',
    notes: '',
  };
}

function formatMonthLabel(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });
}

export function Nutrition() {
  const { addToSyncQueue } = useAppStore();
  const [selectedChildId, setSelectedChildId] = useState(managedChildren[0].id);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [nutritionByChild, setNutritionByChild] = useState<Record<string, Partial<NutritionRecord>>>(() =>
    readJsonCache(NUTRITION_CACHE_KEY, nutritionTrackingByChild as Record<string, Partial<NutritionRecord>>)
  );
  const [historyByChild, setHistoryByChild] = useState<Record<string, MonthlyIntake[]>>(() =>
    readJsonCache(NUTRITION_HISTORY_CACHE_KEY, monthlyIntakeByChild)
  );
  const [entryForm, setEntryForm] = useState<NutritionEntryForm>(() =>
    createEntryDraft((nutritionTrackingByChild as Record<string, Partial<NutritionRecord>>)[managedChildren[0].id] ?? defaultNutritionRecord)
  );

  const getRecordForChild = (childId: string): NutritionRecord => {
    const history = historyByChild[childId] ?? [];
    const latest = history.at(-1);
    const saved = nutritionByChild[childId] ?? {};

    return {
      ...defaultNutritionRecord,
      ...saved,
      weight: saved.weight ?? latest?.weight ?? 0,
      height: saved.height ?? latest?.height ?? 0,
      muac: saved.muac ?? latest?.muac ?? 0,
    };
  };

  const selectedChild = managedChildren.find((child) => child.id === selectedChildId);
  const intakeHistory = historyByChild[selectedChildId] ?? [];
  const latestIntake = intakeHistory.at(-1);
  const currentRecord = getRecordForChild(selectedChildId);
  const nutritionTrendData = intakeHistory.map((entry) => ({
    ...entry,
    shortMonth: entry.month.split(' ')[0],
  }));
  const previousIntake = intakeHistory.at(-2);
  const weightDelta = latestIntake && previousIntake ? Number((latestIntake.weight - previousIntake.weight).toFixed(1)) : 0;
  const muacDelta = latestIntake && previousIntake ? Number((latestIntake.muac - previousIntake.muac).toFixed(1)) : 0;
  const heightDelta = latestIntake && previousIntake ? Number((latestIntake.height - previousIntake.height).toFixed(1)) : 0;
  const nutritionRoster = managedChildren.map((child) => {
    const history = historyByChild[child.id] ?? [];
    const latest = history.at(-1);
    const saved = nutritionByChild[child.id] ?? {};
    const record = {
      ...defaultNutritionRecord,
      ...saved,
      weight: saved.weight ?? latest?.weight ?? 0,
      height: saved.height ?? latest?.height ?? 0,
      muac: saved.muac ?? latest?.muac ?? 0,
    };
    const zScore = calculateWhoZScores(child, record);

    return {
      child,
      latest,
      record,
      zScore,
      status: zScore.band,
    };
  });
  const nutritionStats = {
    atRisk: nutritionRoster.filter((item) => item.status !== 'Normal').length,
    severe: nutritionRoster.filter((item) => item.status === 'Severe').length,
    thrPending: nutritionRoster.filter((item) => !item.record.thrConsumed).length,
    avgDiversity: Math.round(nutritionRoster.reduce((sum, item) => sum + item.record.diversityScore, 0) / Math.max(1, nutritionRoster.length)),
  };

  useEffect(() => {
    localStorage.setItem(NUTRITION_CACHE_KEY, JSON.stringify(nutritionByChild));
  }, [nutritionByChild]);

  useEffect(() => {
    localStorage.setItem(NUTRITION_HISTORY_CACHE_KEY, JSON.stringify(historyByChild));
  }, [historyByChild]);

  const selectChild = (childId: string) => {
    setSelectedChildId(childId);
    setEntryForm(createEntryDraft(getRecordForChild(childId)));
  };

  const currentZScore = selectedChild ? calculateWhoZScores(selectedChild, currentRecord) : null;
  const draftZScore = selectedChild ? calculateWhoZScores(selectedChild, entryForm) : null;
  const currentStatus = currentZScore?.band ?? 'Normal';
  const isNutritionOnTrack = currentStatus === 'Normal';

  const thrCoverageLabel = currentRecord.thrReceived
    ? currentRecord.thrConsumed
      ? 'Received and consumed'
      : 'Received, consumption pending'
    : 'Distribution pending';

  const buildPoshanRows = () => nutritionRoster.map((item) => ({
    poshan_child_id: `POSHAN-${item.child.id.toUpperCase()}`,
    awc_code: 'AWC-PADMAPUR-001',
    child_id: item.child.id,
    child_name: item.child.name,
    dob: item.child.dob,
    gender: item.child.gender,
    entry_date: item.latest?.date ?? getTodayIso(),
    weight_kg: item.record.weight,
    height_cm: item.record.height,
    muac_cm: item.record.muac,
    waz: item.zScore.waz,
    haz: item.zScore.haz,
    whz: item.zScore.whz,
    nutrition_status: item.status,
    zscore_reason: item.zScore.reason,
    thr_received: item.record.thrReceived ? 'Yes' : 'No',
    thr_consumed: item.record.thrConsumed ? 'Yes' : 'No',
    meals_per_day: item.record.mealsPerDay,
    diversity_score: item.record.diversityScore,
    home_visit_needed: item.record.homeVisitNeeded || item.status !== 'Normal' ? 'Yes' : 'No',
  }));

  const exportPoshanCsv = () => {
    downloadCsv(`poshan-nutrition-${getTodayIso()}.csv`, buildPoshanRows());
  };

  const exportPoshanExcel = () => {
    downloadExcelHtml(`poshan-nutrition-${getTodayIso()}.xls`, buildPoshanRows());
  };

  const saveNutritionEntry = () => {
    const normalizedRecord: NutritionRecord = {
      weight: Math.max(0, Number(entryForm.weight) || 0),
      height: Math.max(0, Number(entryForm.height) || 0),
      muac: Math.max(0, Number(entryForm.muac) || 0),
      breastfeedingStatus: entryForm.breastfeedingStatus.trim() || 'Not recorded',
      mealsPerDay: Math.max(0, Number(entryForm.mealsPerDay) || 0),
      diversityScore: Math.min(100, Math.max(0, Number(entryForm.diversityScore) || 0)),
      foodGroups: entryForm.foodGroups,
      thrReceived: entryForm.thrReceived,
      thrConsumed: entryForm.thrConsumed,
      appetite: entryForm.appetite,
      illness: entryForm.illness,
      edema: entryForm.edema,
      homeVisitNeeded: entryForm.homeVisitNeeded,
    };

    const nutritionStatus = selectedChild ? getNutritionBand(normalizedRecord, selectedChild) : getNutritionBand(normalizedRecord);
    const zScore = selectedChild ? calculateWhoZScores(selectedChild, normalizedRecord) : null;
    const previousEntry = intakeHistory.at(-1);
    const noteParts = [entryForm.followUpAction.trim(), entryForm.notes.trim()].filter(Boolean);

    const nextHistoryEntry: MonthlyIntake = {
      month: formatMonthLabel(entryForm.entryDate),
      date: entryForm.entryDate,
      weight: normalizedRecord.weight || previousEntry?.weight || 0,
      height: normalizedRecord.height || previousEntry?.height || 0,
      muac: normalizedRecord.muac || previousEntry?.muac || 0,
      bmi: normalizedRecord.height > 0 ? Number((normalizedRecord.weight / ((normalizedRecord.height / 100) ** 2)).toFixed(1)) : previousEntry?.bmi ?? 0,
      learningScore: previousEntry?.learningScore ?? 0,
      attendanceRate: previousEntry?.attendanceRate ?? 0,
      nutritionStatus,
      notes: noteParts.join(' | ') || 'Nutrition entry recorded.',
    };

    setNutritionByChild((current) => ({
      ...current,
      [selectedChildId]: normalizedRecord,
    }));

    setHistoryByChild((current) => ({
      ...current,
      [selectedChildId]: [...(current[selectedChildId] ?? []), nextHistoryEntry],
    }));

    addToSyncQueue({
      type: 'nutrition',
      data: {
        childId: selectedChildId,
        entry: nextHistoryEntry,
        record: normalizedRecord,
        zScore,
        poshanPayloadReady: true,
      },
    });

    setIsDrawerOpen(false);
  };

  return (
    <div className="space-y-8 pb-10 animate-fade-in">
      <SideDrawer
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        title="Nutrition Entry Form"
        description={`Capture a structured nutrition update for ${selectedChild?.name ?? 'the selected child'} in a project-style workflow.`}
        footer={
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-xs text-muted-foreground">
              Entry ID: NUT-{selectedChildId.toUpperCase()}-{entryForm.entryDate.replaceAll('-', '')}
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="rounded-xl" onClick={() => setIsDrawerOpen(false)}>
                Cancel
              </Button>
              <Button className="rounded-xl gap-2" onClick={saveNutritionEntry}>
                <Save size={16} />
                Save Entry
              </Button>
            </div>
          </div>
        }
      >
        <div className="space-y-6">
          <section className="rounded-[1.5rem] border border-sky-200 bg-sky-50/80 p-5 dark:border-sky-900/50 dark:bg-sky-950/20">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-700 dark:text-sky-300">
                  Zoho-style intake sheet
                </p>
                <h3 className="mt-2 text-lg font-semibold text-foreground">{selectedChild?.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {selectedChild?.ageLabel} • {selectedChild?.parentName} • Nutrition owner {entryForm.assignedWorker}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm sm:min-w-[18rem]">
                <div className="rounded-2xl border border-border bg-background/90 p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Entry Date</p>
                  <p className="mt-2 font-semibold text-foreground">{entryForm.entryDate}</p>
                </div>
                <div className="rounded-2xl border border-border bg-background/90 p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Current Status</p>
                  <p className={cn(
                    'mt-2 font-semibold',
                    currentStatus === 'Normal' && 'text-emerald-600 dark:text-emerald-400',
                    currentStatus === 'Moderate' && 'text-amber-600 dark:text-amber-400',
                    currentStatus === 'Severe' && 'text-red-600 dark:text-red-400'
                  )}>
                    {currentStatus}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[1.5rem] border border-border bg-card">
            <div className="border-b border-border px-5 py-4">
              <div className="flex items-center gap-2">
                <ClipboardList size={18} className="text-sky-500" />
                <div>
                  <h4 className="font-semibold text-foreground">Record Details</h4>
                  <p className="text-xs text-muted-foreground">Set ownership, verification date, and next follow-up.</p>
                </div>
              </div>
            </div>
            <div className="grid gap-4 p-5 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Assigned Worker</label>
                <Input
                  value={entryForm.assignedWorker}
                  onChange={(event) => setEntryForm((current) => ({ ...current, assignedWorker: event.target.value }))}
                  className="h-11 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Verification Date</label>
                <Input
                  type="date"
                  value={entryForm.entryDate}
                  onChange={(event) => setEntryForm((current) => ({ ...current, entryDate: event.target.value }))}
                  className="h-11 rounded-xl"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-foreground">Follow-up Action</label>
                <Input
                  value={entryForm.followUpAction}
                  onChange={(event) => setEntryForm((current) => ({ ...current, followUpAction: event.target.value }))}
                  className="h-11 rounded-xl"
                  placeholder="Example: home visit, counselling, THR refill"
                />
              </div>
            </div>
          </section>

          <section className="rounded-[1.5rem] border border-border bg-card">
            <div className="border-b border-border px-5 py-4">
              <div className="flex items-center gap-2">
                <Scale size={18} className="text-emerald-500" />
                <div>
                  <h4 className="font-semibold text-foreground">Growth Measurements</h4>
                  <p className="text-xs text-muted-foreground">Record weight, height, and MUAC for the nutrition band calculation.</p>
                </div>
              </div>
            </div>
            <div className="grid gap-4 p-5 md:grid-cols-3">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Weight (kg)</label>
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  value={entryForm.weight}
                  onChange={(event) => setEntryForm((current) => ({ ...current, weight: Number(event.target.value) }))}
                  className="h-11 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Height (cm)</label>
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  value={entryForm.height}
                  onChange={(event) => setEntryForm((current) => ({ ...current, height: Number(event.target.value) }))}
                  className="h-11 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">MUAC (cm)</label>
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  value={entryForm.muac}
                  onChange={(event) => setEntryForm((current) => ({ ...current, muac: Number(event.target.value) }))}
                  className="h-11 rounded-xl"
                />
              </div>
            </div>
            {draftZScore && (
              <div className="border-t border-border px-5 py-4">
                <div className="grid gap-3 md:grid-cols-4">
                  {[
                    { label: 'WAZ', value: draftZScore.waz },
                    { label: 'HAZ', value: draftZScore.haz },
                    { label: 'WHZ', value: draftZScore.whz },
                    { label: 'WHO Band', value: draftZScore.band },
                  ].map((item) => (
                    <div key={item.label} className="rounded-2xl border border-border bg-background/70 p-3">
                      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">{item.label}</p>
                      <p className="mt-2 text-lg font-black text-foreground">{item.value}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  Frontend WHO-style reference calculator updates as the worker edits measurements.
                </p>
              </div>
            )}
          </section>

          <section className="rounded-[1.5rem] border border-border bg-card">
            <div className="border-b border-border px-5 py-4">
              <div className="flex items-center gap-2">
                <Apple size={18} className="text-emerald-500" />
                <div>
                  <h4 className="font-semibold text-foreground">Feeding Details</h4>
                  <p className="text-xs text-muted-foreground">Capture breastfeeding, meal frequency, and diversity score.</p>
                </div>
              </div>
            </div>
            <div className="grid gap-4 p-5 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Breastfeeding Status</label>
                <Select
                  value={entryForm.breastfeedingStatus}
                  onValueChange={(value) => setEntryForm((current) => ({ ...current, breastfeedingStatus: value }))}
                >
                  <SelectTrigger className="h-11 rounded-xl">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Exclusive">Exclusive</SelectItem>
                    <SelectItem value="Partial">Partial</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Not recorded">Not recorded</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Meals per Day</label>
                <Input
                  type="number"
                  min="0"
                  value={entryForm.mealsPerDay}
                  onChange={(event) => setEntryForm((current) => ({ ...current, mealsPerDay: Number(event.target.value) }))}
                  className="h-11 rounded-xl"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <div className="flex items-center justify-between gap-3">
                  <label className="text-sm font-medium text-foreground">Dietary Diversity Score</label>
                  <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                    {entryForm.diversityScore}%
                  </span>
                </div>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={entryForm.diversityScore}
                  onChange={(event) => setEntryForm((current) => ({ ...current, diversityScore: Number(event.target.value) }))}
                  className="h-11 rounded-xl"
                />
                <Progress value={entryForm.diversityScore} className="h-3 bg-emerald-100 dark:bg-emerald-950/40" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-foreground">Food Groups Consumed</label>
                <div className="grid gap-2 sm:grid-cols-2">
                  {foodGroupOptions.map((group) => {
                    const checked = entryForm.foodGroups.includes(group);
                    return (
                      <button
                        key={group}
                        type="button"
                        onClick={() => setEntryForm((current) => ({
                          ...current,
                          foodGroups: checked
                            ? current.foodGroups.filter((item) => item !== group)
                            : [...current.foodGroups, group],
                          diversityScore: Math.round(((checked ? entryForm.foodGroups.length - 1 : entryForm.foodGroups.length + 1) / foodGroupOptions.length) * 100),
                        }))}
                        className={cn(
                          'rounded-xl border px-3 py-2 text-left text-sm font-medium transition-colors',
                          checked
                            ? 'border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300'
                            : 'border-border bg-background/70 text-muted-foreground hover:text-foreground'
                        )}
                      >
                        {group}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[1.5rem] border border-border bg-card">
            <div className="border-b border-border px-5 py-4">
              <div className="flex items-center gap-2">
                <Stethoscope size={18} className="text-red-500" />
                <div>
                  <h4 className="font-semibold text-foreground">Care Signals</h4>
                  <p className="text-xs text-muted-foreground">Capture symptoms that can change nutrition risk and follow-up priority.</p>
                </div>
              </div>
            </div>
            <div className="grid gap-4 p-5 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Appetite</label>
                <Select
                  value={entryForm.appetite}
                  onValueChange={(value) => setEntryForm((current) => ({ ...current, appetite: value }))}
                >
                  <SelectTrigger className="h-11 rounded-xl">
                    <SelectValue placeholder="Select appetite" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Normal">Normal</SelectItem>
                    <SelectItem value="Reduced">Reduced</SelectItem>
                    <SelectItem value="Poor">Poor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Recent Illness</label>
                <Select
                  value={entryForm.illness}
                  onValueChange={(value) => setEntryForm((current) => ({ ...current, illness: value }))}
                >
                  <SelectTrigger className="h-11 rounded-xl">
                    <SelectValue placeholder="Select illness" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="None">None</SelectItem>
                    <SelectItem value="Fever">Fever</SelectItem>
                    <SelectItem value="Diarrhea">Diarrhea</SelectItem>
                    <SelectItem value="Cough">Cough</SelectItem>
                    <SelectItem value="Multiple symptoms">Multiple symptoms</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="rounded-2xl border border-border bg-background/70 p-4">
                <ToggleSwitch
                  checked={entryForm.edema}
                  onCheckedChange={(checked) => setEntryForm((current) => ({ ...current, edema: checked }))}
                  label="Bilateral edema observed"
                />
              </div>
              <div className="rounded-2xl border border-border bg-background/70 p-4">
                <ToggleSwitch
                  checked={entryForm.homeVisitNeeded}
                  onCheckedChange={(checked) => setEntryForm((current) => ({ ...current, homeVisitNeeded: checked }))}
                  label="Home visit needed"
                />
              </div>
            </div>
          </section>

          <section className="rounded-[1.5rem] border border-border bg-card">
            <div className="border-b border-border px-5 py-4">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-amber-500" />
                <div>
                  <h4 className="font-semibold text-foreground">THR Compliance</h4>
                  <p className="text-xs text-muted-foreground">Track whether supplementary nutrition reached and was consumed by the child.</p>
                </div>
              </div>
            </div>
            <div className="grid gap-4 p-5 md:grid-cols-2">
              <div className="rounded-2xl border border-border bg-background/70 p-4">
                <ToggleSwitch
                  checked={entryForm.thrReceived}
                  onCheckedChange={(checked) => setEntryForm((current) => ({ ...current, thrReceived: checked }))}
                  label="THR Received"
                />
              </div>
              <div className="rounded-2xl border border-border bg-background/70 p-4">
                <ToggleSwitch
                  checked={entryForm.thrConsumed}
                  onCheckedChange={(checked) => setEntryForm((current) => ({ ...current, thrConsumed: checked }))}
                  label="THR Consumed"
                />
              </div>
            </div>
          </section>

          <section className="rounded-[1.5rem] border border-border bg-card">
            <div className="border-b border-border px-5 py-4">
              <h4 className="font-semibold text-foreground">Notes</h4>
              <p className="text-xs text-muted-foreground">Document counselling, appetite issues, or home follow-up context.</p>
            </div>
            <div className="p-5">
              <textarea
                value={entryForm.notes}
                onChange={(event) => setEntryForm((current) => ({ ...current, notes: event.target.value }))}
                placeholder="Add detailed notes for this nutrition check..."
                className="min-h-28 w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20"
              />
            </div>
          </section>
        </div>
      </SideDrawer>

      <section className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Nutrition</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Capture feeding practices, dietary diversity, and THR utilization in a structured entry workflow.
            </p>
            {latestIntake && selectedChild && (
              <div
                className={cn(
                  'mt-4 flex items-center gap-2 rounded-xl border px-4 py-2 shadow-sm',
                  isNutritionOnTrack
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300'
                    : 'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300'
                )}
              >
                {isNutritionOnTrack ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
                <span className="text-sm">
                  <span className="font-semibold">{selectedChild.name}&apos;s</span> nutrition status is{' '}
                  <span className="font-semibold">{isNutritionOnTrack ? 'on track' : 'flagged for attention'}</span>.
                </span>
                <span className="ml-1 hidden text-xs opacity-75 sm:inline-block">
                  ({isNutritionOnTrack ? 'Diet diversity and THR adherence are stable' : 'Entry review and dietary follow-up recommended'})
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3 w-full lg:w-auto">
            <div className="w-full lg:w-64 max-w-xs">
              <Select value={selectedChildId} onValueChange={selectChild}>
                <SelectTrigger className="h-12 rounded-2xl">
                  <SelectValue placeholder="Select child" />
                </SelectTrigger>
                <SelectContent>
                  {managedChildren.map((child) => (
                    <SelectItem key={child.id} value={child.id}>
                      {child.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" onClick={exportPoshanCsv} className="h-12 rounded-2xl gap-2 px-4">
              <Download size={16} />
              POSHAN CSV
            </Button>
            <Button variant="outline" onClick={exportPoshanExcel} className="hidden h-12 rounded-2xl gap-2 px-4 sm:inline-flex">
              <FileSpreadsheet size={16} />
              Excel
            </Button>
            <Button
              onClick={() => {
                setEntryForm(createEntryDraft(currentRecord));
                setIsDrawerOpen(true);
              }}
              className="h-12 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white gap-2 px-6"
            >
              <Plus size={18} />
              Add Entry
            </Button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Children at risk', value: nutritionStats.atRisk, detail: `${nutritionStats.severe} severe priority`, icon: AlertTriangle, tone: 'red' },
          { label: 'Avg diversity', value: `${nutritionStats.avgDiversity}%`, detail: 'Food group coverage', icon: Utensils, tone: 'emerald' },
          { label: 'THR pending', value: nutritionStats.thrPending, detail: 'Received or consumed gap', icon: Soup, tone: 'amber' },
          { label: 'Selected MUAC', value: `${currentRecord.muac || '-'} cm`, detail: `${muacDelta >= 0 ? '+' : ''}${muacDelta} cm since last record`, icon: Ruler, tone: currentStatus === 'Normal' ? 'sky' : 'amber' },
        ].map((metric) => (
          <div key={metric.label} className="rounded-[1.75rem] border border-border bg-card p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-muted-foreground">{metric.label}</p>
                <p className="mt-2 text-2xl font-bold text-foreground">{metric.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{metric.detail}</p>
              </div>
              <div className={cn(
                'flex h-10 w-10 items-center justify-center rounded-2xl',
                metric.tone === 'emerald' && 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
                metric.tone === 'amber' && 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
                metric.tone === 'red' && 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300',
                metric.tone === 'sky' && 'bg-sky-100 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300',
              )}>
                <metric.icon size={18} />
              </div>
            </div>
          </div>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">Growth signal</p>
                <h3 className="mt-2 text-lg font-semibold text-foreground">Weight, MUAC, Height, and Nutrition Status</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Latest movement: {weightDelta >= 0 ? '+' : ''}{weightDelta} kg, {muacDelta >= 0 ? '+' : ''}{muacDelta} cm MUAC, and {heightDelta >= 0 ? '+' : ''}{heightDelta} cm height.
                </p>
              </div>
              <BadgeLikeStatus status={currentStatus} />
            </div>
            <div className="mt-5 h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={nutritionTrendData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="shortMonth" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                  <YAxis yAxisId="growth" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} domain={['dataMin - 1', 'dataMax + 2']} />
                  <YAxis yAxisId="height" orientation="right" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} domain={['dataMin - 2', 'dataMax + 2']} />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '0.9rem', border: '1px solid hsl(var(--border))', fontSize: '12px' }} />
                  <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 600 }} />
                  <Line yAxisId="growth" type="monotone" dataKey="weight" name="Weight (kg)" stroke="#10b981" strokeWidth={2.5} dot={{ r: 3, fill: '#10b981' }} />
                  <Line yAxisId="growth" type="monotone" dataKey="muac" name="MUAC (cm)" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 3, fill: '#f59e0b' }} />
                  <Line yAxisId="height" type="monotone" dataKey="height" name="Height (cm)" stroke="#0ea5e9" strokeWidth={2.5} dot={{ r: 3, fill: '#0ea5e9' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-5 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
              {nutritionTrendData.slice(-6).map((entry) => (
                <div key={`${entry.date}-${entry.nutritionStatus}`} className="rounded-2xl border border-border bg-background/70 px-3 py-2.5">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-bold text-foreground">{entry.month}</p>
                    <BadgeLikeStatus status={entry.nutritionStatus} />
                  </div>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    {entry.weight} kg • {entry.height} cm • MUAC {entry.muac} cm
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">Entry summary</p>
                <h3 className="mt-2 text-lg font-semibold text-foreground">Dietary Diversity Score (MDD)</h3>
                <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                  Tracks the variety of food groups consumed daily. This summary card now reflects the latest saved nutrition entry for the selected child.
                </p>
              </div>
              <BarChart3 className="shrink-0 text-emerald-500" size={24} />
            </div>
            <div className="mt-6">
              <Progress value={currentRecord.diversityScore} className="h-4 bg-emerald-100 dark:bg-emerald-950/40" />
              <div className="mt-3 flex items-center justify-between">
                <p className="text-sm font-medium text-foreground">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{currentRecord.diversityScore}%</span> of optimal diversity target
                </p>
                <p className="text-xs text-muted-foreground">Target: 100% (All 7 Food Groups)</p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-[1.75rem] border border-emerald-200 bg-emerald-50/80 p-5 shadow-sm dark:border-emerald-900 dark:bg-emerald-950/20">
              <div className="flex items-center gap-3">
                <Apple className="text-emerald-600 dark:text-emerald-300" size={24} />
                <div>
                  <p className="text-sm font-semibold text-foreground">Meals per Day</p>
                  <p className="text-2xl font-bold text-foreground">{currentRecord.mealsPerDay}</p>
                </div>
              </div>
            </div>
            <div className="rounded-[1.75rem] border border-amber-200 bg-amber-50/80 p-5 shadow-sm dark:border-amber-900 dark:bg-amber-950/20">
              <div className="flex items-center gap-3">
                <HeartPulse className="text-amber-600 dark:text-amber-300" size={24} />
                <div>
                  <p className="text-sm font-semibold text-foreground">THR Status</p>
                  <p className="text-sm font-medium text-foreground">{thrCoverageLabel}</p>
                </div>
              </div>
            </div>
            <div className="rounded-[1.75rem] border border-sky-200 bg-sky-50/80 p-5 shadow-sm dark:border-sky-900 dark:bg-sky-950/20">
              <div className="flex items-center gap-3">
                <ClipboardList className="text-sky-600 dark:text-sky-300" size={24} />
                <div>
                  <p className="text-sm font-semibold text-foreground">Breastfeeding</p>
                  <p className="text-sm font-medium text-foreground">{currentRecord.breastfeedingStatus}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
          <div className="mb-6 rounded-[1.5rem] border border-border bg-background/70 p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                <ClipboardList size={18} />
              </div>
              <div>
                <h3 className="text-base font-semibold text-foreground">What to Monitor</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Anganwadi nutrition status should combine growth, feeding, service delivery, illness, and follow-up data.
                </p>
              </div>
            </div>
            <div className="mt-4 grid gap-2">
              {[
                { icon: Scale, label: 'Anthropometry', value: 'weight, height, BMI, MUAC, edema' },
                { icon: Utensils, label: 'Diet quality', value: 'meals/day and food groups consumed' },
                { icon: Soup, label: 'Supplementary nutrition', value: 'THR received, consumed, and gaps' },
                { icon: Stethoscope, label: 'Health signals', value: 'appetite, fever, diarrhea, cough' },
                { icon: Home, label: 'Action tracking', value: 'home visit, referral, counselling notes' },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-3 rounded-2xl border border-border bg-card px-3 py-2.5">
                  <item.icon size={16} className="mt-0.5 shrink-0 text-primary" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">Project tracker</p>
              <h3 className="mt-2 text-lg font-semibold text-foreground">Entry Workflow</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                A compact progress view for the latest nutrition review.
              </p>
            </div>
            <CalendarDays size={20} className="text-sky-500" />
          </div>

          <div className="mt-5 space-y-3">
            {[
              { label: 'Child selected', value: selectedChild?.name ?? 'Not selected' },
              { label: 'Last verified', value: latestIntake ? latestIntake.date : 'No entry yet' },
              { label: 'Nutrition band', value: currentStatus },
              { label: 'Next action', value: latestIntake?.notes ?? 'Create a nutrition entry' },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-border bg-background/70 px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">{item.label}</p>
                <p className="mt-2 text-sm font-semibold text-foreground">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-[1.5rem] border border-border bg-background/50 overflow-hidden flex flex-col">
        <div className="border-b border-border bg-muted/30 px-5 py-4">
          <h4 className="flex items-center gap-2 font-semibold text-foreground">
            <CalendarDays size={18} className="text-sky-500" />
            Nutrition History
          </h4>
        </div>
        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-left text-sm">
            <thead className="sticky top-0 z-10 bg-muted/50 text-xs uppercase text-muted-foreground backdrop-blur">
              <tr>
                <th className="px-5 py-3 font-medium">Month</th>
                <th className="px-5 py-3 font-medium">Date Verified</th>
                <th className="px-5 py-3 font-medium">Weight</th>
                <th className="px-5 py-3 font-medium">MUAC</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium text-right">Notes & Actions</th>
              </tr>
            </thead>
            <tbody>
              {intakeHistory.slice().reverse().map((record, idx) => (
                <tr key={`${record.date}-${idx}`} className="border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="whitespace-nowrap px-5 py-3 font-medium text-foreground">{record.month}</td>
                  <td className="whitespace-nowrap px-5 py-3 text-muted-foreground">
                    {new Date(record.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="whitespace-nowrap px-5 py-3 text-muted-foreground">{record.weight} kg</td>
                  <td className="whitespace-nowrap px-5 py-3 text-muted-foreground">{record.muac} cm</td>
                  <td className="px-5 py-3">
                    <span
                      className={cn(
                        'rounded-md px-2 py-1 text-xs font-medium',
                        record.nutritionStatus === 'Normal' && 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
                        record.nutritionStatus === 'Moderate' && 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
                        record.nutritionStatus === 'Severe' && 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300'
                      )}
                    >
                      {record.nutritionStatus}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right text-muted-foreground">{record.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function BadgeLikeStatus({ status }: { status: ChildNutritionBand }) {
  return (
    <span
      className={cn(
        'w-fit rounded-full px-3 py-1 text-xs font-bold uppercase',
        status === 'Normal' && 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
        status === 'Moderate' && 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
        status === 'Severe' && 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300'
      )}
    >
      {status}
    </span>
  );
}
