import { useEffect, useMemo, useState } from 'react';
import { WifiOff, Wifi, RefreshCw, CheckCircle2, Clock, AlertTriangle, Database, ShieldCheck } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { useAppStore } from '../../store/useAppStore';
import { cn } from '../../utils';

type LocalSyncItem = {
  id: string;
  module: string;
  child: string;
  savedAt: string;
  status: 'pending' | 'syncing' | 'synced' | 'failed' | 'conflict';
};

const initialQueue: LocalSyncItem[] = [
  { id: 'q1', module: 'Learning assessment', child: 'Ishan Mohanty', savedAt: 'Today, 10:35 AM', status: 'pending' },
  { id: 'q2', module: 'Care follow-up', child: 'Diya Mohanty', savedAt: 'Today, 09:50 AM', status: 'pending' },
  { id: 'q3', module: 'Attendance', child: 'Class roster', savedAt: 'Today, 09:15 AM', status: 'pending' },
  { id: 'q4', module: 'Child profile update', child: 'Ananya Mishra', savedAt: 'Yesterday, 04:20 PM', status: 'conflict' },
  { id: 'q5', module: 'Referral follow-up', child: 'Ishan Mohanty', savedAt: 'Yesterday, 03:10 PM', status: 'failed' },
];

const OFFLINE_QUEUE_KEY = 'awc-offline-sync-queue';
const OFFLINE_LAST_SYNC_KEY = 'awc-offline-last-sync';

const cachePacks = [
  { name: 'Arunima Odia learning pack', size: '184 MB', status: 'Cached', freshness: 'Updated today' },
  { name: 'Kondh/Gondi audio prompts', size: '42 MB', status: 'Cached', freshness: 'Updated 2 days ago' },
  { name: 'Care and referral reference pack', size: '8 MB', status: 'Cached', freshness: 'Version 2026.04' },
  { name: 'Training videos and quiz bank', size: '126 MB', status: 'Partial', freshness: '2 videos pending' },
];

function readJsonCache<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;

  try {
    const cached = localStorage.getItem(key);
    return cached ? JSON.parse(cached) as T : fallback;
  } catch {
    return fallback;
  }
}

function statusClasses(status: LocalSyncItem['status']) {
  if (status === 'synced') return 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-200';
  if (status === 'failed' || status === 'conflict') return 'border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950/30 dark:text-red-200';
  if (status === 'syncing') return 'border-sky-200 bg-sky-50 text-sky-800 dark:border-sky-900 dark:bg-sky-950/30 dark:text-sky-200';
  return 'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200';
}

export function OfflineSync() {
  const { isOnline, setOnlineStatus, syncQueue, processSyncQueue, lastSyncTime, setLastSyncTime } = useAppStore();
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState(() => new Date(localStorage.getItem(OFFLINE_LAST_SYNC_KEY) ?? lastSyncTime ?? new Date().toISOString()));
  const [queue, setQueue] = useState<LocalSyncItem[]>(() => readJsonCache(OFFLINE_QUEUE_KEY, initialQueue));

  const pendingChanges = useMemo(
    () => queue.filter((item) => item.status !== 'synced').length + syncQueue.filter((item) => item.status !== 'synced').length,
    [queue, syncQueue]
  );
  const failedOrConflict = queue.filter((item) => item.status === 'failed' || item.status === 'conflict').length;

  useEffect(() => {
    localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
  }, [queue]);

  useEffect(() => {
    localStorage.setItem(OFFLINE_LAST_SYNC_KEY, lastSync.toISOString());
  }, [lastSync]);

  const handleSync = () => {
    if (!isOnline) return;
    setIsSyncing(true);
    setQueue((items) => items.map((item) => item.status === 'pending' ? { ...item, status: 'syncing' } : item));
    void processSyncQueue();
    setTimeout(() => {
      setIsSyncing(false);
      const syncedAt = new Date();
      setLastSync(syncedAt);
      setLastSyncTime(syncedAt.toISOString());
      setQueue((items) => items.map((item) => item.status === 'syncing' ? { ...item, status: 'synced' } : item));
    }, 2000);
  };

  const retryItem = (id: string) => {
    setQueue((items) => items.map((item) => item.id === id ? { ...item, status: 'pending' } : item));
  };

  return (
    <div className="space-y-8 pb-10 animate-fade-in">
      <section className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="rounded-[1.1rem] bg-indigo-100 p-3 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300">
                <WifiOff size={22} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">E. Offline-First Architecture</p>
                <h2 className="mt-1 text-3xl font-bold tracking-tight text-foreground">Offline Sync</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Core learning and data capture can work offline, then synchronize periodically when connectivity is available.
                </p>
              </div>
            </div>
          </div>
          <Button
            className="rounded-2xl px-5 py-3 text-sm font-semibold"
            onClick={handleSync}
            disabled={!isOnline || isSyncing || pendingChanges === 0}
          >
            <RefreshCw size={16} className={cn("mr-2", isSyncing && "animate-spin")} />
            {isSyncing ? 'Syncing...' : isOnline ? 'Sync Now' : 'Offline'}
          </Button>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        {/* Status Card */}
        <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
           <h3 className="text-lg font-semibold text-foreground mb-4">Sync Status</h3>
           <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-background/50">
                  <div className="flex items-center gap-3">
                     <Clock className="text-muted-foreground" size={20} />
                     <div>
                        <p className="text-sm font-medium text-foreground">Last Synced</p>
                        <p className="text-xs text-muted-foreground">{lastSync.toLocaleString()}</p>
                     </div>
                  </div>
              </div>
               <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-background/50">
                  <div className="flex items-center gap-3">
                     <RefreshCw className="text-muted-foreground" size={20} />
                     <div>
                       <p className="text-sm font-medium text-foreground">Pending Changes</p>
                        <p className="text-xs text-muted-foreground">{pendingChanges} updates waiting across local and app queues</p>
                     </div>
                  </div>
                   {pendingChanges > 0 ? (
                       <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">
                           {pendingChanges}
                       </span>
                   ) : (
                       <CheckCircle2 className="text-emerald-500" size={20} />
                   )}
              </div>
           </div>
        </div>

        {/* Network Info Card */}
        <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
           <h3 className="text-lg font-semibold text-foreground mb-4">Connection Info</h3>
           <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className={cn('mb-4 rounded-full p-4', isOnline ? 'bg-emerald-100 dark:bg-emerald-950/40' : 'bg-amber-100 dark:bg-amber-950/40')}>
                  {isOnline ? (
                    <Wifi className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <WifiOff className="h-8 w-8 text-amber-600 dark:text-amber-400" />
                  )}
              </div>
              <h4 className="text-lg font-medium text-foreground">{isOnline ? 'Connected to Network' : 'Offline Mode Active'}</h4>
              <p className="mt-2 text-sm text-muted-foreground max-w-[250px]">
                 {isOnline ? 'Any pending changes can be synced to the server now.' : 'Data entry, learning content, and cached references remain available locally.'}
              </p>
              <Button
                variant="outline"
                className="mt-5 rounded-xl"
                onClick={() => setOnlineStatus(!isOnline)}
              >
                Toggle {isOnline ? 'Offline' : 'Online'} Demo
              </Button>
           </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
        <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <Database className="text-indigo-600 dark:text-indigo-300" size={22} />
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Cached content packs</p>
              <h3 className="text-xl font-bold text-foreground">Offline-ready learning and reference assets</h3>
            </div>
          </div>
          <div className="mt-5 grid gap-3">
            {cachePacks.map((pack) => (
              <div key={pack.name} className="grid gap-3 rounded-2xl border border-border bg-background/70 p-4 sm:grid-cols-[1fr_90px_100px] sm:items-center">
                <div>
                  <p className="font-bold text-foreground">{pack.name}</p>
                  <p className="text-xs text-muted-foreground">{pack.freshness}</p>
                </div>
                <p className="text-sm font-semibold text-muted-foreground">{pack.size}</p>
                <span className={cn(
                  'rounded-full border px-3 py-1 text-center text-xs font-bold',
                  pack.status === 'Cached'
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-200'
                    : 'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200'
                )}>
                  {pack.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <ShieldCheck className="text-emerald-600 dark:text-emerald-300" size={22} />
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Sync policy</p>
              <h3 className="text-xl font-bold text-foreground">Conflict review and retry rules</h3>
            </div>
          </div>
          <div className="mt-5 space-y-3 text-sm text-muted-foreground">
            <p className="rounded-2xl border border-border bg-background/70 p-4">Writes are saved locally first and queued with timestamps for later server merge.</p>
            <p className="rounded-2xl border border-border bg-background/70 p-4">{failedOrConflict} failed/conflict item{failedOrConflict === 1 ? '' : 's'} require worker retry or supervisor review.</p>
            <p className="rounded-2xl border border-border bg-background/70 p-4">Attendance, learning, profile, and referral records share the same offline-first flow.</p>
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Local sync queue</p>
            <h3 className="mt-1 text-xl font-bold text-foreground">Pending, failed, and conflict records</h3>
          </div>
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
            {pendingChanges} item{pendingChanges === 1 ? '' : 's'} need sync or review
          </div>
        </div>

        <div className="mt-5 overflow-hidden rounded-2xl border border-border">
          <div className="grid grid-cols-[1fr_0.8fr_0.8fr_0.7fr_90px] gap-3 border-b border-border bg-muted/50 px-4 py-3 text-xs font-black uppercase tracking-widest text-muted-foreground">
            <span>Item</span>
            <span>Child/Scope</span>
            <span>Saved</span>
            <span>Status</span>
            <span>Action</span>
          </div>
          {queue.map((item) => (
            <div key={item.id} className="grid grid-cols-[1fr_0.8fr_0.8fr_0.7fr_90px] gap-3 border-b border-border px-4 py-4 last:border-b-0">
              <p className="font-bold text-foreground">{item.module}</p>
              <p className="text-sm text-muted-foreground">{item.child}</p>
              <p className="text-sm text-muted-foreground">{item.savedAt}</p>
              <span className={cn('h-fit rounded-full border px-3 py-1 text-center text-xs font-bold capitalize', statusClasses(item.status))}>{item.status}</span>
              {item.status === 'failed' || item.status === 'conflict' ? (
                <button onClick={() => retryItem(item.id)} className="text-sm font-bold text-blue-600 hover:underline dark:text-blue-300">
                  Retry
                </button>
              ) : item.status === 'synced' ? (
                <CheckCircle2 size={18} className="text-emerald-500" />
              ) : (
                <Clock size={18} className="text-muted-foreground" />
              )}
            </div>
          ))}
        </div>

        {syncQueue.length > 0 && (
          <div className="mt-5 rounded-2xl border border-border bg-background/60 p-4">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">App queue captured from active forms</p>
            <div className="mt-3 grid gap-2">
              {syncQueue.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-xl border border-border bg-card px-3 py-2 text-sm">
                  <span className="font-semibold capitalize text-foreground">{item.type.replaceAll('_', ' ')}</span>
                  <span className="rounded-full bg-muted px-2 py-1 text-xs font-bold text-muted-foreground">{item.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-5 flex gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-900 dark:bg-red-950/30 dark:text-red-200">
          <AlertTriangle size={20} className="mt-0.5" />
          <p className="text-sm leading-6">
            Conflict rows are intentional frontend placeholders so backend APIs can later define merge rules for records edited offline on multiple devices.
          </p>
        </div>
      </section>
    </div>
  );
}
