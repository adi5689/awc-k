import { Activity, AlertTriangle, Download, HardDrive, KeyRound, RotateCcw, ShieldCheck, Smartphone, Wifi } from 'lucide-react';
import { adminEvidenceItems, smartPanelReadiness, systemMonitoringRows } from '../../data/complianceData';
import { downloadCsv, downloadExcelHtml } from '../../utils/exportFiles';
import { cn, formatRelativeTime } from '../../utils';
import { useTranslation } from '../../hooks/useTranslation';

const systemCopy = {
  en: {
    kicker: 'System Administration & Connectivity',
    title: 'Vendor Performance Monitoring',
    desc: 'Device health, MDM enrollment, SIM uptime, cache readiness, OTA status, audit evidence, and sync queue visibility across all 20 AWCs.',
    metrics: {
      mdm: 'MDM enrolled',
      lowUptime: 'Below 95% uptime',
      pending: 'Pending sync records',
      ota: 'OTA staged',
    },
    slaEyebrow: 'Per-AWC SLA dashboard',
    slaTitle: 'SIM connectivity, sync, and device health',
    tableHeaders: ['AWC', 'Device', 'SIM', 'MDM/Kiosk', 'Uptime', 'Last sync', 'Queue', 'Cache', 'OTA'],
    uptimeAlertTitle: 'Uptime alert below 95% monthly SLA',
    uptimeAlertSuffix: 'require vendor follow-up and district visibility.',
    evidence: [
      {
        title: 'Security, audit, and support evidence',
        subtitle: 'Frontend evidence checklist for contractual and non-functional review.',
      },
      {
        title: 'Smart panel, offline cache, and VR readiness',
        subtitle: 'Mirroring and cache surfaces needed for group learning and offline operation.',
      },
    ],
    statusMap: {
      Enrolled: 'Enrolled',
      Enabled: 'Enabled',
      'Needs refresh': 'Needs refresh',
      Ready: 'Ready',
      'Staged rollback available': 'Staged rollback available',
      'v1.4.2 active': 'v1.4.2 active',
      Attention: 'Attention',
      Healthy: 'Healthy',
    },
    evidenceRows: adminEvidenceItems,
    readinessRows: smartPanelReadiness.map((item) => ({ area: item.item, evidence: item.method, status: item.status })),
  },
  od: {
    kicker: 'ସିଷ୍ଟମ୍ ପ୍ରଶାସନ ଓ କନେକ୍ଟିଭିଟି',
    title: 'ଭେଣ୍ଡର୍ କାର୍ଯ୍ୟଦକ୍ଷତା ନିରୀକ୍ଷଣ',
    desc: 'ସମସ୍ତ ୨୦ AWC ପାଇଁ ଡିଭାଇସ୍ ସ୍ୱାସ୍ଥ୍ୟ, MDM ନାମଲେଖା, SIM ଅପଟାଇମ୍, କ୍ୟାଶ୍ ପ୍ରସ୍ତୁତି, OTA ସ୍ଥିତି, ଅଡିଟ୍ ପ୍ରମାଣ ଓ ସିଙ୍କ୍ କ୍ୟୁ ଦୃଶ୍ୟତା।',
    metrics: {
      mdm: 'MDM ନାମଲେଖା',
      lowUptime: '୯୫% ରୁ କମ୍ ଅପଟାଇମ୍',
      pending: 'ଅପେକ୍ଷାରତ ସିଙ୍କ୍ ରେକର୍ଡ',
      ota: 'OTA ଷ୍ଟେଜ୍',
    },
    slaEyebrow: 'ପ୍ରତି-AWC SLA ଡ୍ୟାଶବୋର୍ଡ',
    slaTitle: 'SIM କନେକ୍ଟିଭିଟି, ସିଙ୍କ୍ ଓ ଡିଭାଇସ୍ ସ୍ୱାସ୍ଥ୍ୟ',
    tableHeaders: ['AWC', 'ଡିଭାଇସ୍', 'SIM', 'MDM/Kiosk', 'ଅପଟାଇମ୍', 'ଶେଷ ସିଙ୍କ୍', 'କ୍ୟୁ', 'କ୍ୟାଶ୍', 'OTA'],
    uptimeAlertTitle: 'ମାସିକ SLA ୯୫% ରୁ କମ୍ ଅପଟାଇମ୍ ସତର୍କତା',
    uptimeAlertSuffix: 'ପାଇଁ ଭେଣ୍ଡର୍ ଫଲୋ-ଅପ୍ ଓ ଜିଲ୍ଲା ଦୃଶ୍ୟତା ଆବଶ୍ୟକ।',
    evidence: [
      {
        title: 'ସୁରକ୍ଷା, ଅଡିଟ୍ ଓ ସହାୟତା ପ୍ରମାଣ',
        subtitle: 'ଚୁକ୍ତିଗତ ଓ ନନ୍-ଫଙ୍କସନାଲ୍ ସମୀକ୍ଷା ପାଇଁ ଫ୍ରଣ୍ଟେଣ୍ଡ ପ୍ରମାଣ ଚେକଲିଷ୍ଟ।',
      },
      {
        title: 'ସ୍ମାର୍ଟ ପ୍ୟାନେଲ୍, ଅଫଲାଇନ୍ କ୍ୟାଶ୍ ଓ VR ପ୍ରସ୍ତୁତି',
        subtitle: 'ଗୋଷ୍ଠୀ ଶିକ୍ଷା ଓ ଅଫଲାଇନ୍ ଚାଳନା ପାଇଁ ମିରରିଂ ଓ କ୍ୟାଶ୍ ସରଫେସ୍।',
      },
    ],
    statusMap: {
      Enrolled: 'ନାମଲେଖା ହୋଇଛି',
      Enabled: 'ସକ୍ଷମ',
      'Needs refresh': 'ରିଫ୍ରେସ୍ ଆବଶ୍ୟକ',
      Ready: 'ପ୍ରସ୍ତୁତ',
      'Staged rollback available': 'ରୋଲବ୍ୟାକ୍ ଷ୍ଟେଜ୍ ଉପଲବ୍ଧ',
      'v1.4.2 active': 'v1.4.2 ସକ୍ରିୟ',
      Attention: 'ଧ୍ୟାନ ଆବଶ୍ୟକ',
      Healthy: 'ସୁସ୍ଥ',
    },
    evidenceRows: [
      { area: 'ସ୍ଥାନୀୟ ଡାଟା ସୁରକ୍ଷା', evidence: 'ପ୍ରତି ଡିଭାଇସ୍ ପାଇଁ AES-256 ନୀତି ବ୍ୟାନର୍ ଓ ଏନ୍କ୍ରିପ୍ଟେଡ୍ ଲୋକାଲ୍-ଷ୍ଟୋର୍ ଚିହ୍ନ ଦର୍ଶାଯାଇଛି', status: 'ଫ୍ରଣ୍ଟେଣ୍ଡ ପ୍ରମାଣ ପ୍ରସ୍ତୁତ' },
      { area: 'ଡାଟା ପ୍ରେଷଣ ସୁରକ୍ଷା', evidence: 'ଡିପ୍ଲୟମେଣ୍ଟ ସମୀକ୍ଷା ପାଇଁ TLS 1.2+ API ଚୁକ୍ତି ଚେକଲିଷ୍ଟ ଦର୍ଶାଯାଇଛି', status: 'ଫ୍ରଣ୍ଟେଣ୍ଡ ପ୍ରମାଣ ପ୍ରସ୍ତୁତ' },
      { area: 'ଅପରିବର୍ତ୍ତନୀୟ ଅଡିଟ୍ ଲଗ୍', evidence: 'ଡାଟା ପରିବର୍ତ୍ତନ, ସିଙ୍କ୍ ପୁନଃଚେଷ୍ଟା, OTA ଷ୍ଟେଜିଂ ଓ ଏକ୍ସପୋର୍ଟ କାର୍ଯ୍ୟ ପାଇଁ ଆପେଣ୍ଡ-ଅନ୍ଲି UI ଟାଇମଲାଇନ୍', status: 'ଫ୍ରଣ୍ଟେଣ୍ଡ ପ୍ରମାଣ ପ୍ରସ୍ତୁତ' },
      { area: 'OTA ଅପଡେଟ୍', evidence: 'ପ୍ରତି AWC ଡିଭାଇସ୍ ପାଇଁ ଷ୍ଟେଜ୍ ଭର୍ସନ୍, ସକ୍ରିୟ ଭର୍ସନ୍, ରୋଲବ୍ୟାକ୍ କାର୍ଯ୍ୟ ଓ ରିଲିଜ୍ ନୋଟ୍ ଦୃଶ୍ୟମାନ', status: 'ଫ୍ରଣ୍ଟେଣ୍ଡ ପ୍ରମାଣ ପ୍ରସ୍ତୁତ' },
      { area: 'ସହାୟତା SLA', evidence: 'କଳାହାଣ୍ଡି HQ ଅନ-ସାଇଟ୍ ସହାୟତା ଓ ୨-ବର୍ଷୀୟ ପ୍ୟାଚ୍ SLA ଆଡମିନ୍ କନସୋଲରେ ଟ୍ରାକ୍', status: 'ଫ୍ରଣ୍ଟେଣ୍ଡ ପ୍ରମାଣ ପ୍ରସ୍ତୁତ' },
    ],
    readinessRows: [
      { area: '୫୫-୫୬ ଇଞ୍ଚ ସ୍ମାର୍ଟ ପ୍ୟାନେଲ୍ ମିରରିଂ', evidence: 'HDMI/USB ଓ ୱାୟରଲେସ୍ ମିରର୍ ନିର୍ଦ୍ଦେଶ କାର୍ଡ', status: 'ପ୍ରସ୍ତୁତ' },
      { area: 'ଅଲଗା ଆପ୍ ଇନ୍ସ୍ଟଲ୍ ନାହିଁ', evidence: 'ଟ୍ୟାବଲେଟ୍ ବ୍ରାଉଜର୍ ଫୁଲ୍-ସ୍କ୍ରିନ୍ ଲଞ୍ଚ ପଥ', status: 'ପ୍ରସ୍ତୁତ' },
      { area: 'ଅଫଲାଇନ୍ ବିଷୟବସ୍ତୁ କ୍ୟାଶ୍ ଆକାର', evidence: '୬୪GB ଟ୍ୟାବଲେଟ୍ ସ୍ପେକ୍ ଭିତରେ ଶିକ୍ଷା ପ୍ୟାକ୍ ଆକାର ସାରାଂଶ', status: 'ପ୍ରସ୍ତୁତ' },
      { area: 'ଶିଶୁ-ସୁରକ୍ଷିତ VR ଲଞ୍ଚର୍', evidence: 'ଟ୍ୟାବଲେଟ୍ ସେସନ୍ ଆରମ୍ଭ କରେ ଓ time-on-task ରେକର୍ଡ କରେ', status: 'ପ୍ରସ୍ତୁତ' },
    ],
  },
} as const;

export function SystemMonitoring() {
  const { t, language } = useTranslation();
  const copy = language === 'od' ? systemCopy.od : systemCopy.en;
  const rows = systemMonitoringRows.map((row) => ({
    awc_id: row.awcId,
    awc_name: row.awcName,
    device_id: row.deviceId,
    sim_number: row.simNumber,
    mdm_status: row.mdmStatus,
    kiosk_mode: row.kioskMode,
    uptime_percent: row.uptime,
    sync_status: row.syncStatus,
    pending_records: row.pendingRecords,
    cache_pack: row.cachePack,
    ota_version: row.otaVersion,
    device_health: row.deviceHealth,
  }));
  const lowUptime = systemMonitoringRows.filter((row) => row.uptime < 95);
  const pendingRecords = systemMonitoringRows.reduce((sum, row) => sum + row.pendingRecords, 0);
  const statusText = (value: string) => (copy.statusMap as Record<string, string>)[value] ?? value;

  return (
    <div className="space-y-8 pb-10 animate-fade-in">
      <section className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200">
              <ShieldCheck size={24} />
            </div>
            <p className="mt-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">{copy.kicker}</p>
            <h2 className="mt-1 text-3xl font-bold tracking-tight text-foreground">{copy.title}</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
              {copy.desc}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => downloadCsv('system-monitoring.csv', rows)}
              className="inline-flex items-center gap-2 rounded-2xl border border-border bg-background px-4 py-3 text-sm font-bold text-foreground hover:bg-accent"
            >
              <Download size={16} />
              CSV
            </button>
            <button
              onClick={() => downloadExcelHtml('system-monitoring.xls', rows)}
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-bold text-white hover:bg-slate-800"
            >
              <Download size={16} />
              Excel
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        <Metric icon={Smartphone} label={copy.metrics.mdm} value={`${systemMonitoringRows.length}/20`} tone="emerald" />
        <Metric icon={Wifi} label={copy.metrics.lowUptime} value={lowUptime.length} tone={lowUptime.length ? 'red' : 'emerald'} />
        <Metric icon={Activity} label={copy.metrics.pending} value={pendingRecords} tone="amber" />
        <Metric icon={RotateCcw} label={copy.metrics.ota} value={systemMonitoringRows.filter((row) => row.otaVersion.includes('rollback')).length} tone="sky" />
      </section>

      <section className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <Wifi className="text-sky-600" size={22} />
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{copy.slaEyebrow}</p>
            <h3 className="text-xl font-bold text-foreground">{copy.slaTitle}</h3>
          </div>
        </div>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[1040px] text-left text-sm">
            <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
              <tr>
                {copy.tableHeaders.map((header, index) => (
                  <th key={header} className={cn('px-4 py-3', index === 0 && 'rounded-l-xl', index === copy.tableHeaders.length - 1 && 'rounded-r-xl')}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {systemMonitoringRows.map((row) => (
                <tr key={row.awcId} className="border-b border-border/50 last:border-0">
                  <td className="px-4 py-3 font-semibold text-foreground">{row.awcName}</td>
                  <td className="px-4 py-3 text-muted-foreground">{row.deviceId}</td>
                  <td className="px-4 py-3 text-muted-foreground">{row.simNumber}</td>
                  <td className="px-4 py-3 text-muted-foreground">{statusText(row.mdmStatus)} / {statusText(row.kioskMode)}</td>
                  <td className="px-4 py-3">
                    <span className={cn('font-bold', row.uptime >= 95 ? 'text-emerald-600' : 'text-red-600')}>{row.uptime}%</span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{formatRelativeTime(row.lastSyncTime, t)}</td>
                  <td className="px-4 py-3">
                    <span className={cn('rounded-full px-2.5 py-1 text-xs font-bold', row.pendingRecords === 0 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300')}>
                      {row.pendingRecords}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{statusText(row.cachePack)}</td>
                  <td className="px-4 py-3 text-muted-foreground">{statusText(row.otaVersion)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {lowUptime.length > 0 && (
        <section className="rounded-[2rem] border border-red-200 bg-red-50 p-5 text-red-800 shadow-sm dark:border-red-900 dark:bg-red-950/30 dark:text-red-200">
          <div className="flex gap-3">
            <AlertTriangle size={22} className="mt-0.5" />
            <div>
              <p className="font-bold">{copy.uptimeAlertTitle}</p>
              <p className="mt-1 text-sm leading-6">
                {lowUptime.map((row) => row.awcName).join(', ')} {copy.uptimeAlertSuffix}
              </p>
            </div>
          </div>
        </section>
      )}

      <section className="grid gap-6 xl:grid-cols-2">
        <EvidencePanel
          icon={KeyRound}
          title={copy.evidence[0].title}
          subtitle={copy.evidence[0].subtitle}
          rows={copy.evidenceRows}
        />
        <EvidencePanel
          icon={HardDrive}
          title={copy.evidence[1].title}
          subtitle={copy.evidence[1].subtitle}
          rows={copy.readinessRows}
        />
      </section>
    </div>
  );
}

function Metric({ icon: Icon, label, value, tone }: { icon: typeof Smartphone; label: string; value: string | number; tone: 'emerald' | 'amber' | 'red' | 'sky' }) {
  return (
    <div className="rounded-[1.5rem] border border-border bg-card p-5 shadow-sm">
      <div className={cn(
        'flex h-11 w-11 items-center justify-center rounded-2xl',
        tone === 'emerald' && 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
        tone === 'amber' && 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
        tone === 'red' && 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300',
        tone === 'sky' && 'bg-sky-100 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300',
      )}>
        <Icon size={21} />
      </div>
      <p className="mt-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-black text-foreground">{value}</p>
    </div>
  );
}

function EvidencePanel({
  icon: Icon,
  title,
  subtitle,
  rows,
}: {
  icon: typeof KeyRound;
  title: string;
  subtitle: string;
  rows: ReadonlyArray<{ area: string; evidence: string; status: string }>;
}) {
  return (
    <section className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <Icon className="text-primary" size={22} />
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{subtitle}</p>
          <h3 className="text-xl font-bold text-foreground">{title}</h3>
        </div>
      </div>
      <div className="mt-5 space-y-3">
        {rows.map((item) => (
          <div key={item.area} className="rounded-2xl border border-border bg-background/60 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="font-bold text-foreground">{item.area}</p>
              <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">{item.status}</span>
            </div>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.evidence}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
