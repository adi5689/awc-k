import { NavLink } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { cn } from '../utils';

export type ScopeFlowItem = {
  letter: string;
  title: string;
  description: string;
  path: string;
};

export function FunctionalScopeFlow({ title, subtitle, items }: { title: string; subtitle: string; items: ScopeFlowItem[] }) {
  return (
    <section className="rounded-[2rem] border border-border bg-card p-5 shadow-sm">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Mandatory functional scope</p>
          <h3 className="mt-1 text-xl font-bold text-foreground">{title}</h3>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">{subtitle}</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Frontend flow
          <ArrowRight size={14} />
          Backend API map
        </div>
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-5">
        {items.map((item, index) => (
          <NavLink
            key={item.letter}
            to={item.path}
            className={({ isActive }) => cn(
              'group relative rounded-2xl border border-border bg-background/60 p-4 transition-all hover:-translate-y-0.5 hover:bg-accent hover:shadow-sm',
              isActive && 'border-primary/40 bg-primary/5'
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-sm font-black text-primary-foreground">
                {item.letter}
              </span>
            </div>
            <h4 className="mt-4 text-sm font-black text-foreground">{item.title}</h4>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">{item.description}</p>
            {index < items.length - 1 && (
              <ArrowRight className="absolute -right-3 top-1/2 hidden -translate-y-1/2 text-muted-foreground lg:block" size={18} />
            )}
          </NavLink>
        ))}
      </div>
    </section>
  );
}
