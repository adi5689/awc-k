import { Camera, Download, FileSpreadsheet, HeartPulse, PlugZap, Video } from 'lucide-react';
import { integrationRows } from '../../data/complianceData';
import { mockAWCs } from '../../data/mockData';
import { downloadCsv, downloadExcelHtml } from '../../utils/exportFiles';
import { useTranslation } from '../../hooks/useTranslation';

const integrationCopy = {
  en: {
    kicker: 'Integrations & Report Outputs',
    title: 'External Handoff Console',
    desc: 'POSHAN export, ICDS/Health referral handoff, MDM evidence, CCTV retention, and supervisor virtual visit readiness.',
    metrics: [
      { label: 'POSHAN mapping', value: 'CSV/API' },
      { label: 'Referral handoff', value: 'Ready' },
      { label: 'CCTV retention', value: '30 days' },
      { label: 'Virtual visits', value: 'Enabled' },
    ],
    registerEyebrow: 'Integration register',
    registerTitle: 'Mapped external systems',
    exportEyebrow: 'ICDS/Health export',
    exportTitle: 'High-risk referral package',
    exportDesc: 'Minimum handoff format for SAM/MAM flags when direct API is not available.',
    exportButton: 'Export Referral Handoff',
    integrations: integrationRows,
  },
  od: {
    kicker: 'ଇଣ୍ଟିଗ୍ରେସନ୍ ଓ ରିପୋର୍ଟ ଆଉଟପୁଟ୍',
    title: 'ବାହ୍ୟ ହସ୍ତାନ୍ତର କନସୋଲ୍',
    desc: 'POSHAN ଏକ୍ସପୋର୍ଟ, ICDS/Health ରିଫରାଲ୍ ହସ୍ତାନ୍ତର, MDM ପ୍ରମାଣ, CCTV ରିଟେନସନ୍ ଓ ସୁପରଭାଇଜର ଭର୍ଚୁଆଲ୍ ଭିଜିଟ୍ ପ୍ରସ୍ତୁତି।',
    metrics: [
      { label: 'POSHAN ମ୍ୟାପିଂ', value: 'CSV/API' },
      { label: 'ରିଫରାଲ୍ ହସ୍ତାନ୍ତର', value: 'ପ୍ରସ୍ତୁତ' },
      { label: 'CCTV ରିଟେନସନ୍', value: '୩୦ ଦିନ' },
      { label: 'ଭର୍ଚୁଆଲ୍ ଭିଜିଟ୍', value: 'ସକ୍ଷମ' },
    ],
    registerEyebrow: 'ଇଣ୍ଟିଗ୍ରେସନ୍ ରେଜିଷ୍ଟର୍',
    registerTitle: 'ମ୍ୟାପ୍ ହୋଇଥିବା ବାହ୍ୟ ସିଷ୍ଟମ୍',
    exportEyebrow: 'ICDS/Health ଏକ୍ସପୋର୍ଟ',
    exportTitle: 'ହାଇ-ରିସ୍କ ରିଫରାଲ୍ ପ୍ୟାକେଜ୍',
    exportDesc: 'ସିଧା API ଉପଲବ୍ଧ ନଥିଲେ SAM/MAM ଫ୍ଲାଗ୍ ପାଇଁ ନ୍ୟୁନତମ ହସ୍ତାନ୍ତର ଫର୍ମାଟ୍।',
    exportButton: 'ରିଫରାଲ୍ ହସ୍ତାନ୍ତର ଏକ୍ସପୋର୍ଟ',
    integrations: [
      { name: 'POSHAN ଅଭିଯାନ ଏକ୍ସପୋର୍ଟ', mode: 'CSV/API ପ୍ରସ୍ତୁତ', frequency: 'ଆବଶ୍ୟକତା ଅନୁଯାୟୀ', status: 'ମ୍ୟାପ୍ ହୋଇଛି' },
      { name: 'ICDS-CAS / Health ରିଫରାଲ୍ ପୁଶ୍', mode: 'ରିଫରାଲ୍ CSV + ଇମେଲ୍ ପ୍ରସ୍ତୁତ ହସ୍ତାନ୍ତର', frequency: 'ହାଇ-ରିସ୍କ ଘଟଣା', status: 'ମ୍ୟାପ୍ ହୋଇଛି' },
      { name: 'MDM ନାମଲେଖା', mode: 'Google/Microsoft MDM ପ୍ରମାଣ ଫିଲ୍ଡ', frequency: 'ଡିଭାଇସ୍ ଲାଇଫସାଇକଲ୍', status: 'ମ୍ୟାପ୍ ହୋଇଛି' },
      { name: 'CCTV କନସୋଲ୍', mode: 'IP କ୍ୟାମେରା ରିଟେନସନ୍ ରେଜିଷ୍ଟର୍', frequency: '୩୦-ଦିନିଆ ରିଟେନସନ୍ ସମୀକ୍ଷା', status: 'ଟ୍ରାକ୍ ହେଉଛି' },
      { name: 'ସୁପରଭାଇଜର ଭର୍ଚୁଆଲ୍ ଭିଜିଟ୍', mode: 'ୱେବ୍ କ୍ୟାମେରା / ଭିଡିଓ କଲ୍ ଲିଙ୍କ୍ ସ୍ଥିତି', frequency: 'ଆବଶ୍ୟକତା ଅନୁଯାୟୀ', status: 'ଟ୍ରାକ୍ ହେଉଛି' },
      { name: 'NITI Aayog ADP ରିପୋର୍ଟ', mode: 'ମାସିକ ଓ ତ୍ରୈମାସିକ ଟେମ୍ପଲେଟ୍', frequency: 'ମାସିକ/ତ୍ରୈମାସିକ', status: 'ମ୍ୟାପ୍ ହୋଇଛି' },
    ],
  },
} as const;

export function AdminIntegrations() {
  const { language } = useTranslation();
  const copy = language === 'od' ? integrationCopy.od : integrationCopy.en;
  const rows = integrationRows.map((row) => ({
    integration: row.name,
    mode: row.mode,
    frequency: row.frequency,
    status: row.status,
  }));
  const referralRows = mockAWCs.flatMap((awc) => [
    {
      awc_id: awc.id,
      awc_name: awc.name,
      referral_type: 'SAM/MAM high-risk flag',
      risk_count: awc.nutritionBreakdown.sam + awc.nutritionBreakdown.mam,
      health_push_status: awc.nutritionBreakdown.sam > 0 ? 'Ready for ICDS/Health handoff' : 'No high-risk push needed',
    },
  ]);

  return (
    <div className="space-y-8 pb-10 animate-fade-in">
      <section className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300">
              <PlugZap size={24} />
            </div>
            <p className="mt-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">{copy.kicker}</p>
            <h2 className="mt-1 text-3xl font-bold tracking-tight text-foreground">{copy.title}</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
              {copy.desc}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => downloadCsv('integration-status.csv', rows)}
              className="inline-flex items-center gap-2 rounded-2xl border border-border bg-background px-4 py-3 text-sm font-bold text-foreground hover:bg-accent"
            >
              <Download size={16} />
              CSV
            </button>
            <button
              onClick={() => downloadExcelHtml('integration-status.xls', rows)}
              className="inline-flex items-center gap-2 rounded-2xl bg-sky-600 px-4 py-3 text-sm font-bold text-white hover:bg-sky-700"
            >
              <Download size={16} />
              Excel
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        <Metric icon={FileSpreadsheet} label={copy.metrics[0].label} value={copy.metrics[0].value} />
        <Metric icon={HeartPulse} label={copy.metrics[1].label} value={copy.metrics[1].value} />
        <Metric icon={Camera} label={copy.metrics[2].label} value={copy.metrics[2].value} />
        <Metric icon={Video} label={copy.metrics[3].label} value={copy.metrics[3].value} />
      </section>

      <section className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <PlugZap className="text-sky-600" size={22} />
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{copy.registerEyebrow}</p>
            <h3 className="text-xl font-bold text-foreground">{copy.registerTitle}</h3>
          </div>
        </div>
        <div className="mt-5 grid gap-3 lg:grid-cols-2">
          {integrationRows.map((row, index) => {
            const translated = copy.integrations[index] ?? row;
            return (
            <div key={row.name} className="rounded-2xl border border-border bg-background/60 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="font-bold text-foreground">{translated.name}</p>
                <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">{translated.status}</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{translated.mode}</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">{translated.frequency}</p>
            </div>
          );
          })}
        </div>
      </section>

      <section className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{copy.exportEyebrow}</p>
            <h3 className="text-xl font-bold text-foreground">{copy.exportTitle}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{copy.exportDesc}</p>
          </div>
          <button
            onClick={() => downloadCsv('icds-health-referral-handoff.csv', referralRows)}
            className="inline-flex items-center gap-2 rounded-2xl bg-rose-600 px-4 py-3 text-sm font-bold text-white hover:bg-rose-700"
          >
            <Download size={16} />
            {copy.exportButton}
          </button>
        </div>
      </section>
    </div>
  );
}

function Metric({ icon: Icon, label, value }: { icon: typeof PlugZap; label: string; value: string }) {
  return (
    <div className="rounded-[1.5rem] border border-border bg-card p-5 shadow-sm">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-100 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300">
        <Icon size={21} />
      </div>
      <p className="mt-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-black text-foreground">{value}</p>
    </div>
  );
}
