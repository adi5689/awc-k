import { useMemo, useState } from 'react';
import { Brain, Clock, Glasses, Languages, ListChecks, MonitorUp, Puzzle, Users, Volume2, WifiOff } from 'lucide-react';
import { mockChildren, quizQuestions } from '../../data/mockData';
import type { LearningDomain } from '../../types';
import { cn } from '../../utils';
import { useTranslation } from '../../hooks/useTranslation';

const domains: { id: LearningDomain; label: string; icon: typeof Languages }[] = [
  { id: 'language', label: 'Language', icon: Languages },
  { id: 'numeracy', label: 'Numeracy', icon: ListChecks },
  { id: 'cognitive', label: 'Cognitive', icon: Puzzle },
  { id: 'socio_emotional', label: 'Socio-emotional', icon: Users },
];

const childPool = mockChildren.filter((child) => child.awcId === 'awc1').slice(0, 6);

const odiaDomainLabels: Record<LearningDomain, string> = {
  language: 'ଭାଷା',
  numeracy: 'ସଂଖ୍ୟା ଜ୍ଞାନ',
  cognitive: 'ଚିନ୍ତନ କୌଶଳ',
  socio_emotional: 'ସାମାଜିକ-ଭାବନାତ୍ମକ',
};

const localizedQuestions: Record<string, { question: string; options: string[] }> = {
  q1: { question: 'କଦଳୀର ରଙ୍ଗ କଣ?', options: ['ଲାଲ', 'ହଳଦିଆ', 'ନୀଳ', 'ସବୁଜ'] },
  q2: { question: 'ବିଲେଇର କେତେଟି ପାଦ ଅଛି?', options: ['2', '4', '6', '8'] },
  q3: { question: 'କେଉଁ ପଶୁ "ହମ୍ବା" କହେ?', options: ['କୁକୁର', 'ବିଲେଇ', 'ଗାଈ', 'ପକ୍ଷୀ'] },
  q4: { question: 'ବୃତ୍ତଟି ଦେଖାଅ', options: ['ଚତୁର୍ଭୁଜ', 'ତ୍ରିଭୁଜ', 'ତାରା', 'ବୃତ୍ତ'] },
  q5: { question: '2 ପରେ କଣ ଆସେ?', options: ['1', '3', '4', '5'] },
  q6: { question: 'କେଉଁଟି ବଡ଼: ହାତୀ କି ପିପିଳିକା?', options: ['ପିପିଳିକା', 'ହାତୀ', 'ସମାନ', 'କହିପାରିବି ନାହିଁ'] },
  q7: { question: '5 + 3 = ?', options: ['6', '7', '8', '9'] },
  q8: { question: 'ପୂରଣ କର: ସୂର୍ଯ୍ୟ ___ ଦିଗରୁ ଉଠେ', options: ['ପଶ୍ଚିମ', 'ଉତ୍ତର', 'ପୂର୍ବ', 'ଦକ୍ଷିଣ'] },
  q9: { question: 'ଏକ ସପ୍ତାହରେ କେତେ ଦିନ?', options: ['5', '6', '7', '8'] },
  q10: { question: 'ଗ୍ରୀଷ୍ମ ପରେ କେଉଁ ଋତୁ ଆସେ?', options: ['ଶୀତ', 'ବର୍ଷା', 'ବସନ୍ତ', 'ଶରତ'] },
  q11: { question: '12 - 7 = ?', options: ['4', '5', '6', '3'] },
  q12: { question: '"cat" ସହ କେଉଁ ଶବ୍ଦର ଲୟ ମିଳେ?', options: ['Dog', 'Bat', 'Cup', 'Red'] },
  q13: { question: 'ଲାଲ ଓ ହଳଦିଆ ମିଶିଲେ କେଉଁ ରଙ୍ଗ ହୁଏ?', options: ['ସବୁଜ', 'ବାଇଗଣୀ', 'କମଳା', 'ନୀଳ'] },
  q14: { question: 'କ୍ରମରେ ଲଗାଅ: 9, 3, 7, 1', options: ['1,3,7,9', '9,7,3,1', '3,1,9,7', '7,9,1,3'] },
  q15: { question: 'ପ୍ୟାଟର୍ଣ୍ଣ ପୂରଣ କର: AB, CD, EF, __', options: ['GH', 'FG', 'HI', 'EF'] },
};

const vrModules = [
  { id: 'vr-arunima-family', title: 'Arunima VR: ମୋ ପରିବାର', chapter: 'Chapter 1', durationMin: 8, language: 'Odia', tribalAudio: 'Kondh prompt ready' },
  { id: 'vr-arunima-numbers', title: 'Arunima VR: ସଂଖ୍ୟା ଖେଳ', chapter: 'Chapter 2', durationMin: 10, language: 'Odia', tribalAudio: 'Gondi prompt ready' },
  { id: 'vr-arunima-food', title: 'Arunima VR: ପୋଷଣ ଚୟନ', chapter: 'Chapter 3', durationMin: 7, language: 'Odia', tribalAudio: 'Kondh/Gondi prompt ready' },
];

type VrLog = {
  moduleId: string;
  title: string;
  startedAt: string;
  timeOnTaskMin: number;
  responsesCaptured: number;
};

function getScoreTone(score: number) {
  if (score >= 75) return 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:text-emerald-300 dark:bg-emerald-950/30 dark:border-emerald-900';
  if (score >= 45) return 'text-amber-700 bg-amber-50 border-amber-200 dark:text-amber-300 dark:bg-amber-950/30 dark:border-amber-900';
  return 'text-red-700 bg-red-50 border-red-200 dark:text-red-300 dark:bg-red-950/30 dark:border-red-900';
}

function getNextDifficulty(score: number, current: number) {
  if (score >= 80) return Math.min(5, current + 1);
  if (score < 50) return Math.max(1, current - 1);
  return current;
}

export function LearningSession() {
  const { language } = useTranslation();
  const [selectedChildId, setSelectedChildId] = useState(childPool[0]?.id ?? '');
  const [selectedDomain, setSelectedDomain] = useState<LearningDomain>('language');
  const [responses, setResponses] = useState<Record<string, number | null>>({});
  const [vrLogs, setVrLogs] = useState<VrLog[]>([]);

  const selectedChild = childPool.find((child) => child.id === selectedChildId) ?? childPool[0];
  const baseQuestions = useMemo(
    () => quizQuestions.filter((question) => question.domain === selectedDomain),
    [selectedDomain]
  );

  const answered = baseQuestions.filter((question) => responses[question.id] !== undefined && responses[question.id] !== null);
  const correct = answered.filter((question) => responses[question.id] === question.correctAnswer).length;
  const score = answered.length ? Math.round((correct / answered.length) * 100) : 0;
  const currentDifficulty = selectedChild?.currentDifficulty[selectedDomain] ?? 1;
  const nextDifficulty = getNextDifficulty(score, currentDifficulty);
  const questions = [...baseQuestions]
    .sort((a, b) => Math.abs(a.difficulty - nextDifficulty) - Math.abs(b.difficulty - nextDifficulty) || a.difficulty - b.difficulty)
    .slice(0, 4);
  const weakestDomain = selectedChild
    ? Object.entries(selectedChild.domainScores).sort((a, b) => a[1] - b[1])[0]
    : ['language', 0];
  const childModeTitle = language === 'od' ? 'ଶିଶୁ ଶିକ୍ଷା ସେସନ୍' : 'Child Learning Session';
  const childModeSubtitle = language === 'od'
    ? 'ଉତ୍ତର ଦିଅ, ତୁରନ୍ତ ଅଗ୍ରଗତି ଦେଖ, ଏବଂ ପରବର୍ତ୍ତୀ କାର୍ଯ୍ୟକଳାପ ପାଅ.'
    : 'Answer, see progress instantly, and receive the next activity.';

  const launchVrSession = (module: (typeof vrModules)[number]) => {
    setVrLogs((current) => [{
      moduleId: module.id,
      title: module.title,
      startedAt: new Date().toISOString(),
      timeOnTaskMin: module.durationMin,
      responsesCaptured: Math.max(1, answered.length),
    }, ...current]);
  };

  return (
    <div className="space-y-6">
      <section className="rounded-[1.75rem] border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300">
              <Brain size={24} />
            </div>
            <p className="mt-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">A. Adaptive Learning Engine</p>
            <h2 className="mt-1 text-3xl font-bold tracking-tight text-foreground">{childModeTitle}</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
              {childModeSubtitle}
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <select
              value={selectedChildId}
              onChange={(event) => {
                setSelectedChildId(event.target.value);
                setResponses({});
              }}
              className="rounded-xl border border-border bg-background px-4 py-3 text-sm font-semibold text-foreground"
            >
              {childPool.map((child) => (
                <option key={child.id} value={child.id}>{child.name}</option>
              ))}
            </select>
            <select
              value={selectedDomain}
              onChange={(event) => {
                setSelectedDomain(event.target.value as LearningDomain);
                setResponses({});
              }}
              className="rounded-xl border border-border bg-background px-4 py-3 text-sm font-semibold text-foreground"
            >
              {domains.map((domain) => (
                <option key={domain.id} value={domain.id}>{language === 'od' ? odiaDomainLabels[domain.id] : domain.label}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        {domains.map((domain) => {
          const Icon = domain.icon;
          const value = selectedChild?.domainScores[domain.id] ?? 0;
          return (
            <button
              key={domain.id}
              onClick={() => {
                setSelectedDomain(domain.id);
                setResponses({});
              }}
              className={cn(
                'rounded-2xl border p-4 text-left transition-all',
                selectedDomain === domain.id ? 'border-violet-300 bg-violet-50 dark:border-violet-800 dark:bg-violet-950/20' : 'border-border bg-card hover:bg-accent'
              )}
            >
              <Icon size={18} className="text-violet-600 dark:text-violet-300" />
              <p className="mt-3 text-sm font-bold text-foreground">{language === 'od' ? odiaDomainLabels[domain.id] : domain.label}</p>
              <p className="mt-1 text-2xl font-black text-foreground">{value}%</p>
            </button>
          );
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <div className="rounded-[1.75rem] border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Response capture</p>
              <h3 className="mt-1 text-xl font-bold text-foreground">{language === 'od' ? 'ତୁରନ୍ତ ମୂଲ୍ୟାଙ୍କନ' : 'Post-content assessment'}</h3>
            </div>
            <span className={cn('rounded-full border px-3 py-1 text-xs font-bold', getScoreTone(score))}>{score}% live score</span>
          </div>

          <div className="mt-5 space-y-4">
            {questions.map((question, index) => {
              const localized = language === 'od' ? localizedQuestions[question.id] : null;
              return (
              <div key={question.id} className="rounded-2xl border border-border bg-background/60 p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <p className="text-sm font-bold text-foreground">{index + 1}. {localized?.question ?? question.question}</p>
                  <span className="rounded-full bg-violet-100 px-2.5 py-1 text-[10px] font-black uppercase text-violet-700 dark:bg-violet-950/40 dark:text-violet-300">Level {question.difficulty}</span>
                </div>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {question.options.map((option, optionIndex) => {
                    const label = localized?.options[optionIndex] ?? option;
                    const selected = responses[question.id] === optionIndex;
                    const answeredQuestion = responses[question.id] !== undefined && responses[question.id] !== null;
                    const correctChoice = answeredQuestion && optionIndex === question.correctAnswer;
                    return (
                      <button
                        key={option}
                        onClick={() => setResponses((prev) => ({ ...prev, [question.id]: optionIndex }))}
                        className={cn(
                          'rounded-xl border px-3 py-2 text-left text-sm font-semibold transition-colors',
                          selected ? 'border-violet-400 bg-violet-50 text-violet-800 dark:bg-violet-950/30 dark:text-violet-200' : 'border-border bg-card text-foreground hover:bg-accent',
                          correctChoice && 'border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-200'
                        )}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
              );
            })}
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-[1.75rem] border border-border bg-card p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Automatic adjustment</p>
            <h3 className="mt-1 text-xl font-bold text-foreground">Next pathway</h3>
            <div className="mt-5 space-y-3">
              <div className="rounded-2xl bg-background/70 p-4">
                <p className="text-xs text-muted-foreground">Current difficulty</p>
                <p className="mt-1 text-2xl font-black text-foreground">Level {currentDifficulty}</p>
              </div>
              <div className="rounded-2xl bg-background/70 p-4">
                <p className="text-xs text-muted-foreground">Recommended next difficulty</p>
                <p className="mt-1 text-2xl font-black text-foreground">Level {nextDifficulty}</p>
              </div>
              <div className="rounded-2xl border border-violet-200 bg-violet-50 p-4 dark:border-violet-900 dark:bg-violet-950/20">
                <p className="text-sm font-bold text-violet-900 dark:text-violet-200">Why this path?</p>
                <p className="mt-2 text-sm leading-6 text-violet-800 dark:text-violet-200/80">
                  Weakest area is {String(weakestDomain[0]).replace('_', '-')} at {weakestDomain[1]}%. The next session prioritizes guided practice and adjusts difficulty from the live score.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <Glasses className="text-sky-600 dark:text-sky-300" size={22} />
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">VR content launcher</p>
                <h3 className="mt-1 text-xl font-bold text-foreground">Arunima Odia VR modules</h3>
              </div>
            </div>
            <div className="mt-5 space-y-3">
              {vrModules.map((module) => (
                <div key={module.id} className="rounded-2xl border border-border bg-background/70 p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-bold text-foreground">{module.title}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{module.chapter} · {module.durationMin} min · {module.tribalAudio}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => launchVrSession(module)}
                      className="rounded-xl bg-sky-600 px-4 py-2 text-xs font-bold text-white hover:bg-sky-700"
                    >
                      Launch VR
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {[
          { icon: WifiOff, label: 'Offline learning', value: 'Cached and operable without internet' },
          { icon: MonitorUp, label: 'Smart panel mirror', value: 'Fullscreen tablet flow for HDMI/USB or wireless display' },
          { icon: Volume2, label: 'Tribal audio', value: 'Kondh/Gondi prompts attached to key instructions' },
        ].map((item) => (
          <div key={item.label} className="rounded-[1.5rem] border border-border bg-card p-5 shadow-sm">
            <item.icon className="text-emerald-600 dark:text-emerald-300" size={22} />
            <p className="mt-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">{item.label}</p>
            <p className="mt-1 text-sm font-semibold text-foreground">{item.value}</p>
          </div>
        ))}
      </section>

      <section className="rounded-[1.75rem] border border-border bg-card p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <Clock className="text-violet-600 dark:text-violet-300" size={22} />
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Session log</p>
            <h3 className="text-xl font-bold text-foreground">VR time-on-task and response capture</h3>
          </div>
        </div>
        <div className="mt-5 space-y-3">
          {vrLogs.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-border bg-background/60 p-6 text-center text-sm text-muted-foreground">
              Launch a VR module to create a frontend session log.
            </p>
          ) : (
            vrLogs.map((log) => (
              <div key={`${log.moduleId}-${log.startedAt}`} className="grid gap-3 rounded-2xl border border-border bg-background/70 p-4 md:grid-cols-[1fr_140px_140px] md:items-center">
                <div>
                  <p className="font-bold text-foreground">{log.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{new Date(log.startedAt).toLocaleString('en-IN')}</p>
                </div>
                <p className="text-sm font-bold text-foreground">{log.timeOnTaskMin} min</p>
                <p className="text-sm font-bold text-foreground">{log.responsesCaptured} response(s)</p>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
