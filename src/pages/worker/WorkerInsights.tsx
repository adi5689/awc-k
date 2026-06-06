// ============================================================
// WORKER AI INSIGHTS PAGE
// Shows AI-generated alerts and recommendations for AWW
// ============================================================

import { useState, useEffect } from 'react';
import { mockChildren } from '../../data/mockData';
import { cn, simulateAPI } from '../../utils';
import { useTranslation } from '../../hooks/useTranslation';
import { DashboardSkeleton } from '../../components/ui/loading-skeleton';
import {
  Brain, AlertTriangle, AlertCircle, CheckCircle2,
  ArrowRight, Lightbulb, TrendingDown,
} from 'lucide-react';

export function WorkerInsights() {
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    simulateAPI(null, 800).then(() => setLoading(false));
  }, []);

  if (loading) return <DashboardSkeleton />;

  // Build worker-specific insights from children data
  const atRiskChildren = mockChildren.filter(c => c.riskFlags.combinedRisk !== 'Low');
  const highPriorityChildren = mockChildren.filter(c => c.riskFlags.combinedRisk === 'High');
  const lowAttendance = mockChildren.filter(c => c.attendanceRate < 75);
  const lowLearning = mockChildren.filter(c => c.learningScore < 40);

  const workerInsights = [
    ...(highPriorityChildren.length > 0 ? [{
      id: 'wi1', type: 'critical' as const, icon: AlertCircle,
      title: `${highPriorityChildren.length} high-priority ${highPriorityChildren.length === 1 ? 'child needs' : 'children need'} review`,
      message: `${highPriorityChildren.map(c => c.name).join(', ')} should be reviewed today based on combined risk signals.`,
      action: 'Open child profile',
    }] : []),
    ...(lowAttendance.length > 0 ? [{
      id: 'wi2', type: 'warning' as const, icon: AlertTriangle,
      title: t('insights.attendance_warning', { count: lowAttendance.length }),
      message: t('insights.attendance_message', { 
        names: lowAttendance.map(c => c.name).join(', '), 
        rates: lowAttendance.map(c => c.attendanceRate).join(', ') 
      }),
      action: t('insights.action.visits'),
    }] : []),
    ...(lowLearning.length > 0 ? [{
      id: 'wi3', type: 'warning' as const, icon: TrendingDown,
      title: t('insights.learning_warning', { count: lowLearning.length }),
      message: t('insights.learning_message', { 
        names: lowLearning.map(c => c.name).join(', ') 
      }),
      action: t('insights.action.easy'),
    }] : []),
    {
      id: 'wi4', type: 'info' as const, icon: Lightbulb,
      title: t('insights.assessment_reminder'),
      message: t('insights.assessment_desc'),
      action: t('insights.action.assessment'),
    },
    {
      id: 'wi5', type: 'success' as const, icon: CheckCircle2,
      title: t('insights.progress_success', { name: 'Kabir Das' }),
      message: t('insights.progress_message'),
      action: t('insights.action.profile'),
    },
  ];

  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'critical': return 'border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-950/20';
      case 'warning': return 'border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20';
      case 'success': return 'border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20';
      default: return 'border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20';
    }
  };

  const getIconStyles = (type: string) => {
    switch (type) {
      case 'critical': return 'text-red-600 dark:text-red-400';
      case 'warning': return 'text-amber-600 dark:text-amber-400';
      case 'success': return 'text-emerald-600 dark:text-emerald-400';
      default: return 'text-blue-600 dark:text-blue-400';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Brain className="text-blue-600 dark:text-blue-400" size={24} />
          {t('insights.ai_title')}
        </h2>
        <p className="text-sm text-muted-foreground mt-1">{t('insights.ai_subtitle')}</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-border bg-card text-center">
          <p className="text-2xl font-bold text-red-600">{atRiskChildren.length}</p>
          <p className="text-xs text-muted-foreground mt-1">{t('insights.at_risk')}</p>
        </div>
        <div className="p-4 rounded-xl border border-border bg-card text-center">
          <p className="text-2xl font-bold text-amber-600">{lowAttendance.length}</p>
          <p className="text-xs text-muted-foreground mt-1">Attendance follow-ups</p>
        </div>
        <div className="p-4 rounded-xl border border-border bg-card text-center">
          <p className="text-2xl font-bold text-blue-600">{lowLearning.length}</p>
          <p className="text-xs text-muted-foreground mt-1">{t('insights.learning_help')}</p>
        </div>
        <div className="p-4 rounded-xl border border-border bg-card text-center">
          <p className="text-2xl font-bold text-emerald-600">{mockChildren.filter(c => c.learningScore >= 70).length}</p>
          <p className="text-xs text-muted-foreground mt-1">{t('insights.on_track')}</p>
        </div>
      </div>

      {/* Insights List */}
      <div className="space-y-4">
        {workerInsights.map((insight, i) => {
          const Icon = insight.icon;
          return (
            <div
              key={insight.id}
              className={cn(
                'p-5 rounded-xl border transition-all duration-200 hover:shadow-md animate-fade-in-up opacity-0',
                getTypeStyles(insight.type)
              )}
              style={{ animationDelay: `${i * 0.08}s`, animationFillMode: 'forwards' }}
            >
              <div className="flex items-start gap-4">
                <div className={cn('mt-0.5', getIconStyles(insight.type))}>
                  <Icon size={22} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground text-sm">{insight.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{insight.message}</p>
                  <button className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                    {insight.action} <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
