import { Award, BookOpenCheck, CalendarDays, Download, GraduationCap, HelpCircle, Languages, MapPin } from 'lucide-react';
import {
  initialTrainingCurriculum,
  odiaHelpFaq,
  refresherEvents,
  trainingProgress,
  tribalAudioMaterials,
} from '../../data/complianceData';
import { downloadCsv, downloadExcelHtml } from '../../utils/exportFiles';
import { useAppStore } from '../../store/useAppStore';
import { cn } from '../../utils';
import { useTranslation } from '../../hooks/useTranslation';

const trainingCopy = {
  en: {
    kicker: 'Training & Knowledge Base',
    title: '30-Day AWW Training Flow',
    desc: 'Offline manuals, Odia help, tribal audio materials, quarterly refreshers, completion tracking, quiz scores, and certificates.',
    metrics: {
      offlineCurriculum: 'Offline curriculum',
      blocks: 'blocks',
      refreshers: 'Refreshers',
      events: 'events',
      completion: 'AWW completion >=90%',
      audioPacks: 'Tribal audio packs',
    },
    initialEyebrow: 'Initial training',
    initialTitle: '30-day hands-on curriculum',
    quiz: 'Quiz',
    offlineReady: 'Offline ready',
    days: 'Days',
    refresherEyebrow: 'Quarterly refresher',
    refresherTitle: '2-year schedule',
    evidenceEyebrow: 'Supervisor and admin evidence',
    evidenceTitle: 'Per-AWW completion, quizzes, certificates',
    headers: ['Worker', 'AWC', 'Completion', 'Quiz', 'Certificate'],
    certificate: { Issued: 'Issued', Pending: 'Pending' },
    helpEyebrow: 'Offline Odia help',
    helpTitle: 'FAQ and visual aid module',
    tribalEyebrow: 'Tribal-majority AWCs',
    tribalTitle: 'Audio material tracker',
    offline: 'Offline',
    curriculum: [
      { title: 'Tablet basics and Odia AWW dashboard use', quiz: 'Device readiness' },
      { title: 'Attendance, child registration, and absence follow-up', quiz: 'Daily service flow' },
      { title: 'POSHAN growth entry, WHO z-score review, and referral flags', quiz: 'Nutrition risk handling' },
      { title: 'Adaptive learning sessions, Arunima modules, and VR safety', quiz: 'Learning facilitation' },
      { title: 'Offline sync, conflict review, and help-desk escalation', quiz: 'Connectivity and sync' },
      { title: 'Reports, parent communication, and supervisor review prep', quiz: 'Reporting readiness' },
    ],
    refresherTopics: [
      'POSHAN and referral refresher',
      'Adaptive learning quality review',
      'Offline data quality and conflict review',
      'District reporting and ADP evidence',
      'VR safety and classroom facilitation',
      'Security, privacy, and audit discipline',
      'Nutrition-learning combined risk actions',
      'Final handover and support continuity',
    ],
    audioModules: [
      'Daily attendance instruction',
      'Handwashing and meal instruction',
      'VR safety introduction',
      'Parent counselling prompt',
    ],
  },
  od: {
    kicker: 'ପ୍ରଶିକ୍ଷଣ ଓ ଜ୍ଞାନ ଭଣ୍ଡାର',
    title: '୩୦-ଦିନିଆ AWW ପ୍ରଶିକ୍ଷଣ ପ୍ରବାହ',
    desc: 'ଅଫଲାଇନ୍ ମାନୁଆଲ୍, ଓଡ଼ିଆ ସହାୟତା, ଜନଜାତି ଅଡିଓ ସାମଗ୍ରୀ, ତ୍ରୈମାସିକ ରିଫ୍ରେସର୍, ପ୍ରଗତି ଟ୍ରାକିଂ, କ୍ୱିଜ୍ ସ୍କୋର ଓ ସର୍ଟିଫିକେଟ୍।',
    metrics: {
      offlineCurriculum: 'ଅଫଲାଇନ୍ ପାଠ୍ୟକ୍ରମ',
      blocks: 'ବ୍ଲକ୍',
      refreshers: 'ରିଫ୍ରେସର୍',
      events: 'ଇଭେଣ୍ଟ',
      completion: 'AWW ସମ୍ପୂର୍ଣ୍ଣତା >=90%',
      audioPacks: 'ଜନଜାତି ଅଡିଓ ପ୍ୟାକ୍',
    },
    initialEyebrow: 'ପ୍ରାରମ୍ଭିକ ପ୍ରଶିକ୍ଷଣ',
    initialTitle: '୩୦-ଦିନିଆ ହାତେକଳମେ ପାଠ୍ୟକ୍ରମ',
    quiz: 'କ୍ୱିଜ୍',
    offlineReady: 'ଅଫଲାଇନ୍ ପ୍ରସ୍ତୁତ',
    days: 'ଦିନ',
    refresherEyebrow: 'ତ୍ରୈମାସିକ ରିଫ୍ରେସର୍',
    refresherTitle: '୨-ବର୍ଷୀୟ ସୂଚୀ',
    evidenceEyebrow: 'ସୁପରଭାଇଜର ଓ ଆଡମିନ୍ ପ୍ରମାଣ',
    evidenceTitle: 'ପ୍ରତି AWW ସମ୍ପୂର୍ଣ୍ଣତା, କ୍ୱିଜ୍, ସର୍ଟିଫିକେଟ୍',
    headers: ['କର୍ମୀ', 'AWC', 'ସମ୍ପୂର୍ଣ୍ଣତା', 'କ୍ୱିଜ୍', 'ସର୍ଟିଫିକେଟ୍'],
    certificate: { Issued: 'ଜାରି ହୋଇଛି', Pending: 'ଅପେକ୍ଷାରତ' },
    helpEyebrow: 'ଅଫଲାଇନ୍ ଓଡ଼ିଆ ସହାୟତା',
    helpTitle: 'FAQ ଓ ଭିଜୁଆଲ୍ ସହାୟତା ମଡ୍ୟୁଲ୍',
    tribalEyebrow: 'ଜନଜାତି-ପ୍ରଧାନ AWC',
    tribalTitle: 'ଅଡିଓ ସାମଗ୍ରୀ ଟ୍ରାକର୍',
    offline: 'ଅଫଲାଇନ୍',
    curriculum: [
      { title: 'ଟ୍ୟାବଲେଟ୍ ମୂଳଭିତ୍ତି ଓ ଓଡ଼ିଆ AWW ଡ୍ୟାଶବୋର୍ଡ ବ୍ୟବହାର', quiz: 'ଡିଭାଇସ୍ ପ୍ରସ୍ତୁତି' },
      { title: 'ଉପସ୍ଥିତି, ଶିଶୁ ପଞ୍ଜିକରଣ ଓ ଅନୁପସ୍ଥିତି ଫଲୋ-ଅପ୍', quiz: 'ଦୈନିକ ସେବା ପ୍ରବାହ' },
      { title: 'POSHAN ବୃଦ୍ଧି ଏଣ୍ଟ୍ରି, WHO z-score ସମୀକ୍ଷା ଓ ରିଫରାଲ୍ ଫ୍ଲାଗ୍', quiz: 'ପୋଷଣ ବିପଦ ପରିଚାଳନା' },
      { title: 'ଅନୁକୂଳିତ ଶିକ୍ଷା ସେସନ୍, ଅରୁଣିମା ମଡ୍ୟୁଲ୍ ଓ VR ସୁରକ୍ଷା', quiz: 'ଶିକ୍ଷା ସୁବିଧାକରଣ' },
      { title: 'ଅଫଲାଇନ୍ ସିଙ୍କ୍, ବିରୋଧ ସମୀକ୍ଷା ଓ ହେଲ୍ପଡେସ୍କ ଏସ୍କାଲେସନ୍', quiz: 'କନେକ୍ଟିଭିଟି ଓ ସିଙ୍କ୍' },
      { title: 'ରିପୋର୍ଟ, ଅଭିଭାବକ ଯୋଗାଯୋଗ ଓ ସୁପରଭାଇଜର ସମୀକ୍ଷା ପ୍ରସ୍ତୁତି', quiz: 'ରିପୋର୍ଟିଂ ପ୍ରସ୍ତୁତି' },
    ],
    refresherTopics: [
      'POSHAN ଓ ରିଫରାଲ୍ ରିଫ୍ରେସର୍',
      'ଅନୁକୂଳିତ ଶିକ୍ଷା ଗୁଣବତ୍ତା ସମୀକ୍ଷା',
      'ଅଫଲାଇନ୍ ଡାଟା ଗୁଣବତ୍ତା ଓ ବିରୋଧ ସମୀକ୍ଷା',
      'ଜିଲ୍ଲା ରିପୋର୍ଟିଂ ଓ ADP ପ୍ରମାଣ',
      'VR ସୁରକ୍ଷା ଓ ଶ୍ରେଣୀକକ୍ଷ ସୁବିଧାକରଣ',
      'ସୁରକ୍ଷା, ଗୋପନୀୟତା ଓ ଅଡିଟ୍ ଶୃଙ୍ଖଳା',
      'ପୋଷଣ-ଶିକ୍ଷା ଯୁକ୍ତ ବିପଦ କାର୍ଯ୍ୟ',
      'ଅନ୍ତିମ ହସ୍ତାନ୍ତର ଓ ସହାୟତା ନିରନ୍ତରତା',
    ],
    audioModules: [
      'ଦୈନିକ ଉପସ୍ଥିତି ନିର୍ଦ୍ଦେଶ',
      'ହାତ ଧୋଇବା ଓ ଭୋଜନ ନିର୍ଦ୍ଦେଶ',
      'VR ସୁରକ୍ଷା ପରିଚୟ',
      'ଅଭିଭାବକ ପରାମର୍ଶ ପ୍ରମ୍ପ୍ଟ',
    ],
  },
} as const;

export function TrainingKnowledgeBase() {
  const { userRole } = useAppStore();
  const { language } = useTranslation();
  const copy = language === 'od' ? trainingCopy.od : trainingCopy.en;
  const completionRate = Math.round(trainingProgress.filter((item) => item.completion >= 90).length / trainingProgress.length * 100);
  const canSeeAllWorkers = userRole !== 'worker';
  const visibleCurriculum = initialTrainingCurriculum
    .map((item, index) => ({ item, index }))
    .filter(({ index }) => canSeeAllWorkers || index !== 2);
  const visibleRefreshers = refresherEvents
    .map((event, index) => ({ event, index }))
    .filter(({ index }) => canSeeAllWorkers || (index !== 0 && index !== 6));
  const visibleFaq = odiaHelpFaq
    .map((item, index) => ({ item, index }))
    .filter(({ index }) => canSeeAllWorkers || index !== 1);
  const visibleAudioMaterials = tribalAudioMaterials
    .map((item, index) => ({ item, index }))
    .filter(({ index }) => canSeeAllWorkers || index !== 1);

  const exportRows = trainingProgress.map((item) => ({
    worker_name: item.workerName,
    awc_name: item.awcName,
    completion_percent: item.completion,
    quiz_score: item.quizScore,
    certificate_status: item.certificate,
  }));

  return (
    <div className="space-y-8 pb-10 animate-fade-in">
      <section className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
              <GraduationCap size={24} />
            </div>
            <p className="mt-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">{copy.kicker}</p>
            <h2 className="mt-1 text-3xl font-bold tracking-tight text-foreground">{copy.title}</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
              {copy.desc}
            </p>
          </div>
          {canSeeAllWorkers && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => downloadCsv('aww-training-progress.csv', exportRows)}
                className="inline-flex items-center gap-2 rounded-2xl border border-border bg-background px-4 py-3 text-sm font-bold text-foreground hover:bg-accent"
              >
                <Download size={16} />
                CSV
              </button>
              <button
                onClick={() => downloadExcelHtml('aww-training-progress.xls', exportRows)}
                className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-700"
              >
                <Download size={16} />
                Excel
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        <Metric icon={BookOpenCheck} label={copy.metrics.offlineCurriculum} value={`${visibleCurriculum.length} ${copy.metrics.blocks}`} tone="emerald" />
        <Metric icon={CalendarDays} label={copy.metrics.refreshers} value={`${visibleRefreshers.length} ${copy.metrics.events}`} tone="sky" />
        <Metric icon={Award} label={copy.metrics.completion} value={`${completionRate}%`} tone={completionRate >= 90 ? 'emerald' : 'amber'} />
        <Metric icon={Languages} label={copy.metrics.audioPacks} value={visibleAudioMaterials.length} tone="violet" />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <BookOpenCheck className="text-emerald-600" size={22} />
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{copy.initialEyebrow}</p>
              <h3 className="text-xl font-bold text-foreground">{copy.initialTitle}</h3>
            </div>
          </div>
          <div className="mt-5 space-y-3">
            {visibleCurriculum.map(({ item, index }) => (
              <div key={item.dayRange} className="rounded-2xl border border-border bg-background/60 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-emerald-600">{item.dayRange.replace('Days', copy.days)}</p>
                    <p className="mt-1 font-bold text-foreground">{copy.curriculum[index]?.title ?? item.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{copy.quiz}: {copy.curriculum[index]?.quiz ?? item.quiz}</p>
                  </div>
                  <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300">
                    {copy.offlineReady}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <CalendarDays className="text-sky-600" size={22} />
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{copy.refresherEyebrow}</p>
                <h3 className="text-xl font-bold text-foreground">{copy.refresherTitle}</h3>
              </div>
            </div>
            <div className="mt-5 max-h-[420px] space-y-2 overflow-auto pr-1">
              {visibleRefreshers.map(({ event, index }) => (
                <div key={event.quarter} className="rounded-2xl border border-border bg-background/60 px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-bold text-foreground">{event.quarter}</p>
                    <span className="text-xs font-semibold text-muted-foreground">{event.date}</span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{copy.refresherTopics[index] ?? event.topic}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {canSeeAllWorkers && (
        <section className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <Award className="text-amber-600" size={22} />
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{copy.evidenceEyebrow}</p>
              <h3 className="text-xl font-bold text-foreground">{copy.evidenceTitle}</h3>
            </div>
          </div>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
                <tr>
                  {copy.headers.map((header, index) => (
                    <th key={header} className={cn('px-4 py-3', index === 0 && 'rounded-l-xl', index === copy.headers.length - 1 && 'rounded-r-xl')}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {trainingProgress.map((item) => (
                  <tr key={`${item.workerName}-${item.awcName}`} className="border-b border-border/50 last:border-0">
                    <td className="px-4 py-3 font-semibold text-foreground">{item.workerName}</td>
                    <td className="px-4 py-3 text-muted-foreground">{item.awcName}</td>
                    <td className="px-4 py-3">
                      <span className={cn('font-bold', item.completion >= 90 ? 'text-emerald-600' : item.completion >= 75 ? 'text-amber-600' : 'text-red-600')}>{item.completion}%</span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{item.quizScore}%</td>
                    <td className="px-4 py-3">
                      <span className={cn('rounded-full px-2.5 py-1 text-xs font-bold', item.certificate === 'Issued' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300')}>
                        {copy.certificate[item.certificate]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center gap-3">
            <HelpCircle className="text-violet-600" size={22} />
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{copy.helpEyebrow}</p>
              <h3 className="text-xl font-bold text-foreground">{copy.helpTitle}</h3>
            </div>
          </div>
          <div className="mt-5 grid gap-3">
            {visibleFaq.map(({ item }) => (
              <div key={item.q} className="rounded-2xl border border-border bg-background/60 p-4">
                <p className="font-bold text-foreground">{item.q}</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.a}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <MapPin className="text-rose-600" size={22} />
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{copy.tribalEyebrow}</p>
              <h3 className="text-xl font-bold text-foreground">{copy.tribalTitle}</h3>
            </div>
          </div>
          <div className="mt-5 space-y-3">
            {visibleAudioMaterials.map(({ item, index }) => (
              <div key={`${item.language}-${item.module}`} className="rounded-2xl border border-border bg-background/60 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-bold text-foreground">{item.language}</p>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">{copy.offline}</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{copy.audioModules[index] ?? item.module}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function Metric({ icon: Icon, label, value, tone }: { icon: typeof GraduationCap; label: string; value: string | number; tone: 'emerald' | 'sky' | 'amber' | 'violet' }) {
  return (
    <div className="rounded-[1.5rem] border border-border bg-card p-5 shadow-sm">
      <div className={cn(
        'flex h-11 w-11 items-center justify-center rounded-2xl',
        tone === 'emerald' && 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
        tone === 'sky' && 'bg-sky-100 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300',
        tone === 'amber' && 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
        tone === 'violet' && 'bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300',
      )}>
        <Icon size={21} />
      </div>
      <p className="mt-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-black text-foreground">{value}</p>
    </div>
  );
}
