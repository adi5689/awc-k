// ============================================================
// ADMIN HEATMAP - Block-wise visual performance map
// ============================================================

import { useState, useEffect } from 'react';
import { mockBlocks } from '../../data/mockData';
import { cn, simulateAPI, formatIndianNumber } from '../../utils';
import { DashboardSkeleton } from '../../components/ui/loading-skeleton';
import { Target } from 'lucide-react';

type Metric = 'learning' | 'nutrition' | 'overall';

export function AdminHeatmap() {
  const [loading, setLoading] = useState(true);
  const [metric, setMetric] = useState<Metric>('overall');

  useEffect(() => {
    simulateAPI(null, 800).then(() => setLoading(false));
  }, []);

  if (loading) return <DashboardSkeleton />;

  const getBlockColor = (block: typeof mockBlocks[0]) => {
    let value: number;
    switch (metric) {
      case 'learning': value = block.avgLearningScore; break;
      case 'nutrition': value = 100 - block.nutritionRiskPercent; break;
      default: value = (block.avgLearningScore + (100 - block.nutritionRiskPercent)) / 2;
    }
    if (value >= 75) return { bg: 'bg-emerald-500', text: 'text-white', border: 'border-emerald-600' };
    if (value >= 60) return { bg: 'bg-emerald-300 dark:bg-emerald-700', text: 'text-emerald-900 dark:text-white', border: 'border-emerald-400' };
    if (value >= 50) return { bg: 'bg-amber-300 dark:bg-amber-700', text: 'text-amber-900 dark:text-white', border: 'border-amber-400' };
    if (value >= 40) return { bg: 'bg-orange-400 dark:bg-orange-700', text: 'text-white', border: 'border-orange-500' };
    return { bg: 'bg-red-500', text: 'text-white', border: 'border-red-600' };
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Target size={24} className="text-purple-600" />
            Performance Heatmap
          </h2>
          <p className="text-sm text-muted-foreground mt-1">Kalahandi District - Block-wise visualization</p>
        </div>
        <div className="flex gap-2">
          {[
            { id: 'overall', label: 'Overall' },
            { id: 'learning', label: 'Learning' },
            { id: 'nutrition', label: 'Nutrition' },
          ].map(m => (
            <button
              key={m.id}
              onClick={() => setMetric(m.id as Metric)}
              className={cn(
                'px-4 py-2 rounded-lg text-xs font-semibold border transition-all',
                metric === m.id
                  ? 'bg-purple-600 text-white border-purple-600'
                  : 'bg-card border-border text-muted-foreground hover:bg-accent'
              )}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {mockBlocks.map((block, i) => {
          const colors = getBlockColor(block);
          let displayValue: number;
          switch (metric) {
            case 'learning': displayValue = block.avgLearningScore; break;
            case 'nutrition': displayValue = 100 - block.nutritionRiskPercent; break;
            default: displayValue = Math.round((block.avgLearningScore + (100 - block.nutritionRiskPercent)) / 2);
          }

          return (
            <div
              key={block.id}
              className={cn(
                'p-5 rounded-xl border-2 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] cursor-pointer animate-fade-in-up opacity-0',
                colors.bg, colors.border
              )}
              style={{ animationDelay: `${i * 0.06}s`, animationFillMode: 'forwards' }}
            >
              <h4 className={cn('font-bold text-base mb-3', colors.text)}>{block.name}</h4>
              <div className={cn('text-4xl font-black mb-1', colors.text)}>{displayValue}%</div>
              <div className={cn('space-y-1 text-xs mt-3 opacity-90', colors.text)}>
                <div className="flex justify-between">
                  <span>AWCs: {block.totalAWCs}</span>
                  <span>Children: {formatIndianNumber(block.totalChildren)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Learning: {block.avgLearningScore}%</span>
                  <span>Risk: {block.nutritionRiskPercent}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="p-4 rounded-xl border border-border bg-card flex items-center gap-6 flex-wrap">
        <span className="text-xs font-semibold text-muted-foreground">Score Legend:</span>
        <span className="flex items-center gap-1.5 text-xs"><span className="w-4 h-4 rounded bg-emerald-500" /> 75%+ (Excellent)</span>
        <span className="flex items-center gap-1.5 text-xs"><span className="w-4 h-4 rounded bg-emerald-300" /> 60-74% (Good)</span>
        <span className="flex items-center gap-1.5 text-xs"><span className="w-4 h-4 rounded bg-amber-300" /> 50-59% (Average)</span>
        <span className="flex items-center gap-1.5 text-xs"><span className="w-4 h-4 rounded bg-orange-400" /> 40-49% (Below Avg)</span>
        <span className="flex items-center gap-1.5 text-xs"><span className="w-4 h-4 rounded bg-red-500" /> &lt;40% (Critical)</span>
      </div>
    </div>
  );
}
