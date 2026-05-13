import { useMemo, useState } from 'react';
import { Brain, Languages, ListChecks, Puzzle, Users } from 'lucide-react';
import { mockChildren, quizQuestions } from '../../data/mockData';
import type { LearningDomain } from '../../types';
import { cn } from '../../utils';

const domains: { id: LearningDomain; label: string; icon: typeof Languages }[] = [
  { id: 'language', label: 'Language', icon: Languages },
  { id: 'numeracy', label: 'Numeracy', icon: ListChecks },
  { id: 'cognitive', label: 'Cognitive', icon: Puzzle },
  { id: 'socio_emotional', label: 'Socio-emotional', icon: Users },
];

const childPool = mockChildren.filter((child) => child.awcId === 'awc1').slice(0, 6);

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
  const [selectedChildId, setSelectedChildId] = useState(childPool[0]?.id ?? '');
  const [selectedDomain, setSelectedDomain] = useState<LearningDomain>('language');
  const [responses, setResponses] = useState<Record<string, number | null>>({});

  const selectedChild = childPool.find((child) => child.id === selectedChildId) ?? childPool[0];
  const questions = useMemo(
    () => quizQuestions.filter((question) => question.domain === selectedDomain).slice(0, 4),
    [selectedDomain]
  );

  const answered = questions.filter((question) => responses[question.id] !== undefined && responses[question.id] !== null);
  const correct = answered.filter((question) => responses[question.id] === question.correctAnswer).length;
  const score = answered.length ? Math.round((correct / answered.length) * 100) : 0;
  const currentDifficulty = selectedChild?.currentDifficulty[selectedDomain] ?? 1;
  const nextDifficulty = getNextDifficulty(score, currentDifficulty);
  const weakestDomain = selectedChild
    ? Object.entries(selectedChild.domainScores).sort((a, b) => a[1] - b[1])[0]
    : ['language', 0];

  return (
    <div className="space-y-6">
      <section className="rounded-[1.75rem] border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300">
              <Brain size={24} />
            </div>
            <p className="mt-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">A. Adaptive Learning Engine</p>
            <h2 className="mt-1 text-3xl font-bold tracking-tight text-foreground">Real-time Learning Session</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
              Capture child responses, score them immediately, adjust difficulty, and show the next individualized activity path.
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
                <option key={domain.id} value={domain.id}>{domain.label}</option>
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
              <p className="mt-3 text-sm font-bold text-foreground">{domain.label}</p>
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
              <h3 className="mt-1 text-xl font-bold text-foreground">Post-content assessment</h3>
            </div>
            <span className={cn('rounded-full border px-3 py-1 text-xs font-bold', getScoreTone(score))}>{score}% live score</span>
          </div>

          <div className="mt-5 space-y-4">
            {questions.map((question, index) => (
              <div key={question.id} className="rounded-2xl border border-border bg-background/60 p-4">
                <p className="text-sm font-bold text-foreground">{index + 1}. {question.question}</p>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {question.options.map((option, optionIndex) => {
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
                        {option}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
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
        </aside>
      </section>
    </div>
  );
}
