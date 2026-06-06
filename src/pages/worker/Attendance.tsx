import { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Phone,
  Search,
  UserCheck,
  Users,
  XCircle,
} from 'lucide-react';
import {
  dailyAttendanceSeed,
  managedChildren,
  type AttendanceEntry,
} from '../../data/childMonitoringData';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { useAppStore } from '../../store/useAppStore';
import { cn } from '../../utils';

type WorkerAttendanceStatus = 'pending' | 'present' | 'absent';

const ATTENDANCE_CACHE_KEY = 'awc-daily-attendance';
const ABSENCE_REASON_CACHE_KEY = 'awc-absence-reasons';
const absenceReasonOptions = ['Illness', 'Family travel', 'Caregiver unavailable', 'Weather/transport', 'Unknown'];

function readJsonCache<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;

  try {
    const cached = localStorage.getItem(key);
    return cached ? JSON.parse(cached) as T : fallback;
  } catch {
    return fallback;
  }
}

function getTodayLabel() {
  return new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function getTodayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

export function Attendance() {
  const { addToSyncQueue } = useAppStore();
  const [workerStatus, setWorkerStatus] = useState<WorkerAttendanceStatus>('pending');
  const [attendance, setAttendance] = useState<AttendanceEntry[]>(() => readJsonCache(ATTENDANCE_CACHE_KEY, dailyAttendanceSeed));
  const [absenceReasons, setAbsenceReasons] = useState<Record<string, string>>(() => readJsonCache(ABSENCE_REASON_CACHE_KEY, {}));
  const [studentSearch, setStudentSearch] = useState('');
  const [savedAt, setSavedAt] = useState<string | null>(null);

  const childById = useMemo(
    () => new Map(managedChildren.map((child) => [child.id, child])),
    []
  );

  const presentStudents = attendance.filter((child) => child.present).length;
  const absentStudents = attendance.length - presentStudents;
  const attendancePercentage = attendance.length ? Math.round((presentStudents / attendance.length) * 100) : 0;
  const absentEntries = attendance.filter((entry) => !entry.present);

  const filteredAttendance = useMemo(() => {
    const query = studentSearch.trim().toLowerCase();
    if (!query) return attendance;

    return attendance.filter((entry) => {
      const child = childById.get(entry.id);
      return (
        entry.name.toLowerCase().includes(query) ||
        child?.parentName.toLowerCase().includes(query) ||
        child?.phoneNumber.includes(query)
      );
    });
  }, [attendance, childById, studentSearch]);

  useEffect(() => {
    localStorage.setItem(ATTENDANCE_CACHE_KEY, JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem(ABSENCE_REASON_CACHE_KEY, JSON.stringify(absenceReasons));
  }, [absenceReasons]);

  const markWorkerPresent = () => {
    setWorkerStatus('present');
  };

  const markWorkerAbsent = () => {
    setWorkerStatus('absent');
  };

  const markAllPresent = () => {
    setAttendance((current) => current.map((entry) => ({ ...entry, present: true })));
    setAbsenceReasons({});
    setSavedAt(null);
  };

  const markAllAbsent = () => {
    setAttendance((current) => current.map((entry) => ({ ...entry, present: false })));
    setAbsenceReasons((current) =>
      attendance.reduce<Record<string, string>>((next, entry) => ({
        ...next,
        [entry.id]: current[entry.id] ?? 'Unknown',
      }), {})
    );
    setSavedAt(null);
  };

  const toggleStudentAttendance = (childId: string) => {
    const currentEntry = attendance.find((entry) => entry.id === childId);
    if (!currentEntry) return;

    const nextPresent = !currentEntry.present;

    setAttendance((current) =>
      current.map((entry) =>
        entry.id === childId ? { ...entry, present: nextPresent } : entry
      )
    );

    setAbsenceReasons((current) => {
      if (!nextPresent) {
        return { ...current, [childId]: current[childId] ?? 'Illness' };
      }

      const next = { ...current };
      delete next[childId];
      return next;
    });

    setSavedAt(null);
  };

  const updateAbsenceReason = (childId: string, reason: string) => {
    setAbsenceReasons((current) => ({ ...current, [childId]: reason }));
    setSavedAt(null);
  };

  const saveAttendanceSnapshot = () => {
    addToSyncQueue({
      type: 'attendance',
      data: {
        date: getTodayIsoDate(),
        workerStatus,
        attendance,
        absenceReasons,
        source: 'worker-attendance-frontend',
      },
    });
    setSavedAt(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }));
  };

  const childControlsDisabled = workerStatus !== 'present';

  return (
    <div className="mx-auto max-w-5xl space-y-5 pb-10 animate-fade-in">
      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              <CalendarDays size={14} />
              {getTodayLabel()}
            </div>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground">Daily Attendance</h2>
            <p className="mt-1 text-sm text-muted-foreground">Check in, mark children, and sync today's record.</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              onClick={markWorkerPresent}
              className={cn(
                'rounded-xl',
                workerStatus === 'present' && 'bg-emerald-600 hover:bg-emerald-700'
              )}
              variant={workerStatus === 'present' ? 'default' : 'outline'}
            >
              <UserCheck size={16} />
              I am present
            </Button>
            <Button
              type="button"
              variant={workerStatus === 'absent' ? 'destructive' : 'outline'}
              className="rounded-xl"
              onClick={markWorkerAbsent}
            >
              <XCircle size={16} />
              Mark absent
            </Button>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {[
            { label: 'Present', value: presentStudents, tone: 'emerald' },
            { label: 'Absent', value: absentStudents, tone: 'red' },
            { label: 'Rate', value: `${attendancePercentage}%`, tone: 'sky' },
          ].map((item) => (
            <div
              key={item.label}
              className={cn(
                'rounded-xl border p-4',
                item.tone === 'emerald' && 'border-emerald-200 bg-emerald-50/70 dark:border-emerald-900/50 dark:bg-emerald-950/20',
                item.tone === 'red' && 'border-red-200 bg-red-50/70 dark:border-red-900/50 dark:bg-red-950/20',
                item.tone === 'sky' && 'border-sky-200 bg-sky-50/70 dark:border-sky-900/50 dark:bg-sky-950/20'
              )}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{item.label}</p>
              <p className="mt-1 text-2xl font-bold text-foreground">{item.value}</p>
            </div>
          ))}
        </div>
      </section>

      {workerStatus === 'pending' && (
        <section className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/20 dark:text-amber-200">
          <AlertTriangle size={20} className="mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-bold">Mark your attendance first</p>
            <p className="mt-1 text-sm text-amber-800/80 dark:text-amber-200/80">
              Child attendance controls are available after worker check-in.
            </p>
          </div>
        </section>
      )}

      {workerStatus === 'absent' && (
        <section className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-900 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-200">
          <XCircle size={20} className="mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-bold">Worker marked absent</p>
            <p className="mt-1 text-sm text-red-800/80 dark:text-red-200/80">
              Switch to present when you are ready to record child attendance.
            </p>
          </div>
        </section>
      )}

      <section className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="border-b border-border p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                <Users size={18} />
                Children
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">Tap a child to switch between present and absent.</p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Button type="button" variant="outline" className="rounded-xl" onClick={markAllPresent} disabled={childControlsDisabled}>
                <CheckCircle2 size={16} />
                All present
              </Button>
              <Button type="button" variant="outline" className="rounded-xl" onClick={markAllAbsent} disabled={childControlsDisabled}>
                <XCircle size={16} />
                All absent
              </Button>
              <Button type="button" className="rounded-xl" onClick={saveAttendanceSnapshot} disabled={childControlsDisabled}>
                <ClipboardCheck size={16} />
                Save
              </Button>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-sm">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={studentSearch}
                onChange={(event) => setStudentSearch(event.target.value)}
                placeholder="Search child, parent, or phone"
                className="pl-9"
              />
            </div>
            {savedAt && (
              <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300">
                <CheckCircle2 size={14} />
                Saved at {savedAt}
              </div>
            )}
          </div>
        </div>

        <div className="divide-y divide-border">
          {filteredAttendance.map((entry) => {
            const child = childById.get(entry.id);
            const isPresent = entry.present;

            return (
              <div key={entry.id} className="grid gap-3 p-4 md:grid-cols-[1fr_auto] md:items-center">
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className={cn(
                      'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold',
                      isPresent
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                        : 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300'
                    )}
                  >
                    {entry.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-foreground">{entry.name}</p>
                    </div>
                    {child && (
                      <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                        <span>{child.ageLabel} / {child.gender}</span>
                        <span>{child.parentName}</span>
                        <span className="flex items-center gap-1">
                          <Phone size={12} />
                          {child.phoneNumber}
                        </span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid gap-2 sm:grid-cols-[140px_1fr] md:min-w-[340px]">
                  <button
                    type="button"
                    onClick={() => toggleStudentAttendance(entry.id)}
                    disabled={childControlsDisabled}
                    className={cn(
                      'flex h-10 items-center justify-center gap-2 rounded-xl border px-3 text-sm font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-50',
                      isPresent
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300'
                        : 'border-red-200 bg-red-50 text-red-700 hover:bg-red-100 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300'
                    )}
                  >
                    {isPresent ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                    {isPresent ? 'Present' : 'Absent'}
                  </button>

                  {!isPresent ? (
                    <select
                      value={absenceReasons[entry.id] ?? 'Illness'}
                      onChange={(event) => updateAbsenceReason(entry.id, event.target.value)}
                      disabled={childControlsDisabled}
                      className="h-10 rounded-xl border border-input bg-background px-3 text-sm font-medium text-foreground shadow-sm outline-none transition-colors focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {absenceReasonOptions.map((reason) => (
                        <option key={reason} value={reason}>{reason}</option>
                      ))}
                    </select>
                  ) : (
                    <div className="hidden h-10 items-center rounded-xl border border-border bg-muted/30 px-3 text-sm text-muted-foreground sm:flex">
                      No follow-up needed
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {filteredAttendance.length === 0 && (
            <div className="p-10 text-center">
              <Search size={28} className="mx-auto text-muted-foreground/50" />
              <p className="mt-3 text-sm font-medium text-foreground">No children found</p>
              <p className="mt-1 text-sm text-muted-foreground">Try another search term.</p>
            </div>
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-base font-semibold text-foreground">Follow-up list</h3>
            <p className="mt-1 text-sm text-muted-foreground">Absent children appear here for parent contact.</p>
          </div>
          <span className="w-max rounded-full border border-border px-3 py-1 text-sm font-medium text-foreground">
            {absentEntries.length} absent
          </span>
        </div>

        {absentEntries.length > 0 ? (
          <div className="mt-4 grid gap-2 md:grid-cols-2">
            {absentEntries.map((entry) => {
              const child = childById.get(entry.id);
              return (
                <div key={entry.id} className="rounded-xl border border-red-100 bg-red-50/50 p-3 dark:border-red-900/40 dark:bg-red-950/10">
                  <p className="text-sm font-semibold text-foreground">{entry.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {absenceReasons[entry.id] ?? 'Illness'}{child ? ` / ${child.parentName} / ${child.phoneNumber}` : ''}
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50/60 p-4 text-sm text-emerald-800 dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:text-emerald-200">
            Everyone is marked present.
          </div>
        )}
      </section>
    </div>
  );
}
