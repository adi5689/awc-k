import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bot, Mic, Send, Sparkles, Wand2, X } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { cn } from '../utils';

const quickPrompts = [
  'Plan My Day for 3-4 year olds',
  'Suggest activity for 4-year-olds',
  'How to teach counting?',
];

function getAssistantReply(prompt: string) {
  const input = prompt.toLowerCase();

  if (input.includes('plan my day')) {
    return 'Today plan: welcome circle, Count & Match, storytelling, jump and balance, healthy meal sorting, and a 2-minute parent recap before dispersal.';
  }

  if (input.includes('count')) {
    return 'Try pebbles, bangles, or bowls from the centre. Start with matching 1 to 5, then ask children to say the number aloud and place the same number of objects.';
  }

  if (input.includes('4-year')) {
    return 'For 4-year-olds, use short mixed activities: one language rhyme, one movement game, one sorting task, one drawing activity, and one food choice conversation.';
  }

  return 'I can help with activity planning, ICDS-aligned routines, age-wise teaching tips, and parent communication. Try a daily plan, a theme request, or a teaching question.';
}

export function AIAssistantWidget() {
  const { userRole } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const assistantPosition = userRole === 'worker' ? 'bottom-24 lg:bottom-6' : 'bottom-6';
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    {
      role: 'ai',
      text: 'Namaste. I can plan your day, suggest NEP 2020 activities, answer worker questions, and support voice-style prompts.',
    },
  ]);

  const submitPrompt = (prompt: string) => {
    if (!prompt.trim()) return;

    setMessages((current) => [...current, { role: 'user', text: prompt }]);
    setQuery('');

    window.setTimeout(() => {
      setMessages((current) => [...current, { role: 'ai', text: getAssistantReply(prompt) }]);
    }, 500);
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.96 }}
        onClick={() => setIsOpen(true)}
        className={cn(
          'fixed right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 via-green-500 to-sky-500 text-white shadow-2xl shadow-emerald-900/30 transition-all',
          assistantPosition,
          isOpen ? 'pointer-events-none opacity-0' : 'opacity-100'
        )}
        aria-label="Open Smart Anganwadi assistant"
      >
        <Bot size={30} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            className={cn(
              'fixed right-6 z-50 flex w-[22rem] max-w-[calc(100vw-1.5rem)] flex-col overflow-hidden rounded-[2rem] border border-border bg-card shadow-2xl shadow-slate-950/20 md:w-[26rem]',
              assistantPosition
            )}
            style={{ maxHeight: 'calc(100vh - 96px)' }}
          >
            <div className="bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.28),_transparent_36%),linear-gradient(135deg,#22c55e_0%,#38bdf8_48%,#f59e0b_100%)] p-4 text-white">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-white/20 p-2.5">
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold">Smart Worker Assistant</h3>
                    <p className="text-xs text-white/85">Plan My Day, activity guidance, and voice-style support</p>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="rounded-xl p-2 hover:bg-white/15 transition-colors">
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="border-b border-border bg-background/70 px-4 py-3">
              <div className="grid grid-cols-1 gap-2">
                {quickPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => submitPrompt(prompt)}
                    className="flex items-center gap-2 rounded-2xl border border-border bg-card px-3 py-2 text-left text-xs font-medium text-foreground transition-colors hover:bg-accent"
                  >
                    <Wand2 size={14} className="text-primary" />
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto bg-muted/30 p-4">
              {messages.map((message, index) => (
                <motion.div
                  key={`${message.role}-${index}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[88%] rounded-[1.4rem] px-4 py-3 text-sm shadow-sm ${
                      message.role === 'user'
                        ? 'rounded-br-md bg-sky-500 text-white'
                        : 'rounded-bl-md border border-border bg-card text-foreground'
                    }`}
                  >
                    {message.text}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="border-t border-border bg-card p-3">
              <div className="relative flex items-center gap-2">
                <button
                  onClick={() => submitPrompt('Suggest activity for 4-year-olds')}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                  title="Voice-style quick query"
                >
                  <Mic size={18} />
                </button>
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  onKeyDown={(event) => event.key === 'Enter' && submitPrompt(query)}
                  placeholder="Ask a worker question..."
                  className="h-11 flex-1 rounded-full border border-border bg-background px-4 pr-12 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
                <button
                  onClick={() => submitPrompt(query)}
                  className="absolute right-1 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
