// ============================================================
// SIDEBAR - Role-aware navigation with collapsible groups
// Shows different nav items based on user role
// ============================================================

import { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { cn } from '../../utils';
import { useTranslation } from '../../hooks/useTranslation';
import {
  LayoutDashboard, Users, Brain, BookOpen, Activity,
  Map, Settings, ChevronLeft, ChevronRight, ChevronDown,
  LogOut, Sparkles, ClipboardList, PenTool, HeartPulse, Syringe, CalendarDays, FileBarChart2, AlertCircle, WifiOff, Lightbulb, BrainCircuit, Route
} from 'lucide-react';

const workerNavGroups = [
  {
    label: 'Dashboard',
    collapsible: false,
    items: [{ name: 'Dashboard', icon: LayoutDashboard, path: '/worker' }],
  },
  {
    label: 'Children',
    collapsible: true,
    items: [
      { name: 'All Children', icon: Users, path: '/worker/children' },
      { name: 'Progress Tracking', icon: Activity, path: '/worker/progress-tracking' },
    ],
  },
  {
    label: 'Learning',
    collapsible: true,
    items: [
      { name: 'Learning Progress', icon: BookOpen, path: '/worker/learning' },
      { name: 'Learning Session', icon: BrainCircuit, path: '/worker/learning-session' },
      { name: 'Adaptive Learning', icon: Brain, path: '/worker/adaptive-learning' },
      { name: 'Whiteboard', icon: PenTool, path: '/worker/board' },
    ],
  },
  {
    label: 'Nutrition & Health',
    collapsible: true,
    items: [
      { name: 'Nutrition Status', icon: HeartPulse, path: '/worker/nutrition' },
      { name: 'Predictive Risk', icon: Route, path: '/worker/predictive-risk' },
      { name: 'Immunization', icon: Syringe, path: '/worker/immunization' },
    ],
  },
  {
    label: 'Attendance',
    collapsible: false,
    items: [{ name: 'Daily Attendance', icon: CalendarDays, path: '/worker/attendance' }],
  },
  {
    label: 'Interventions',
    collapsible: true,
    items: [
      { name: 'Critical Alerts', icon: AlertCircle, path: '/worker/alerts' },
      { name: 'AI Dashboard', icon: BrainCircuit, path: '/worker/ai-dashboard' },
      { name: 'Suggested Actions', icon: Lightbulb, path: '/worker/insights' },
    ],
  },
  {
    label: 'Reports',
    collapsible: false,
    items: [{ name: 'Reports', icon: FileBarChart2, path: '/worker/reports' }],
  },
  {
    label: 'Offline Sync',
    collapsible: false,
    items: [{ name: 'Offline Sync', icon: WifiOff, path: '/worker/offline-sync' }],
  },
];

const supervisorNavGroups = [
  {
    label: 'Overview',
    collapsible: false,
    items: [
      { name: 'Dashboard', icon: LayoutDashboard, path: '/supervisor' },
      { name: 'Centres Directory', icon: ClipboardList, path: '/supervisor/awc-list' },
    ],
  },
  {
    label: 'Monitoring',
    collapsible: true,
    items: [
      { name: 'Attendance Trends', icon: CalendarDays, path: '/supervisor/attendance' },
      { name: 'Educational Progress', icon: BookOpen, path: '/supervisor/learning' },
      { name: 'AI Dashboard', icon: BrainCircuit, path: '/supervisor/ai-dashboard' },
    ],
  },
  {
    label: 'Health & Stats',
    collapsible: true,
    items: [
      { name: 'Nutrition Tracking', icon: HeartPulse, path: '/supervisor/nutrition' },
      { name: 'Predictive Risk', icon: Route, path: '/supervisor/predictive-risk' },
      { name: 'Immunization Coverage', icon: Syringe, path: '/supervisor/immunization' },
    ],
  },
  {
    label: 'Analytics & Reports',
    collapsible: true,
    items: [
      { name: 'Generate Reports', icon: FileBarChart2, path: '/supervisor/reports' }
    ],
  },
];

const adminNav = [
  { name: 'nav.district', icon: LayoutDashboard, path: '/admin' },
  { name: 'nav.heatmap', icon: Map, path: '/admin/heatmap' },
  { name: 'nav.insights', icon: Brain, path: '/admin/insights' },
  { name: 'nav.reports', icon: Activity, path: '/admin/reports' },
];

export function Sidebar() {
  const { userRole, sidebarCollapsed, collapseSidebar, currentUser, logout } = useAppStore();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  // Initialize open groups based on which group has the active route
  const getInitialOpenGroups = () => {
    const open = new Set<string>();
    
    // For Worker
    if (userRole === 'worker') {
      for (const group of workerNavGroups) {
        if (!group.collapsible) {
          open.add(group.label);
        } else if (group.items.some((item) => location.pathname === item.path || location.pathname.startsWith(item.path + '/'))) {
          open.add(group.label);
        }
      }
    }
    
    // For Supervisor
    if (userRole === 'supervisor') {
      for (const group of supervisorNavGroups) {
        if (!group.collapsible) {
          open.add(group.label);
        } else if (group.items.some((item) => location.pathname === item.path || location.pathname.startsWith(item.path + '/'))) {
          open.add(group.label);
        }
      }
    }
    
    return open;
  };

  const [openGroups, setOpenGroups] = useState<Set<string>>(getInitialOpenGroups);

  const toggleGroup = (label: string) => {
    setOpenGroups((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <aside
      className={cn(
        'flex flex-col h-screen bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_30%),linear-gradient(180deg,#0b1220_0%,#111827_42%,#0f172a_100%)] dark:bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.14),_transparent_30%),linear-gradient(180deg,#020617_0%,#0f172a_42%,#020617_100%)] text-white transition-all duration-300 relative z-20 border-r border-white/5',
        sidebarCollapsed ? 'w-[72px]' : 'w-64'
      )}
    >
      {/* Brand header */}
      <div className="flex items-center gap-3 h-16 px-4 border-b border-slate-800">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-400 via-emerald-500 to-amber-400 flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-900/20">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        {!sidebarCollapsed && (
          <div className="overflow-hidden">
            <h2 className="text-sm font-bold text-white tracking-tight truncate">{t('common.app_name')}</h2>
            <p className="text-[10px] text-slate-400 truncate">{t('common.app_subtitle')}</p>
          </div>
        )}
        <button
          onClick={() => collapseSidebar(!sidebarCollapsed)}
          className="ml-auto p-1.5 rounded-md hover:bg-slate-800 transition-colors text-slate-400 hover:text-white"
        >
          {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Role badge */}
      {!sidebarCollapsed && (
        <div className="px-4 py-3">
          <div className="px-3 py-2 rounded-2xl bg-white/5 backdrop-blur border border-white/10">
            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">{t('role.logged_in_as')}</p>
            <p className="text-xs text-slate-300 font-medium truncate mt-0.5">{currentUser?.name}</p>
            <span className={cn(
              'inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full',
              userRole === 'worker' ? 'bg-emerald-900/50 text-emerald-400' :
              userRole === 'supervisor' ? 'bg-blue-900/50 text-blue-400' :
              'bg-purple-900/50 text-purple-400'
            )}>
              {userRole === 'worker' ? t('role.worker') : userRole === 'supervisor' ? t('role.supervisor') : t('role.admin')}
            </span>
          </div>
        </div>
      )}

      {/* Navigation items */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto scrollbar-thin">
        {userRole === 'worker' || userRole === 'supervisor' ? (
          (userRole === 'worker' ? workerNavGroups : supervisorNavGroups).map((group) => {
            const isOpen = openGroups.has(group.label);
            const hasActiveChild = group.items.some(
              (item) => location.pathname === item.path || (item.path !== '/worker' && item.path !== '/supervisor' && location.pathname.startsWith(item.path + '/'))
            );

            return (
              <div key={group.label} className="space-y-0.5">
                {/* Group header — collapsible toggle */}
                {!sidebarCollapsed && (
                  group.collapsible ? (
                    <button
                      onClick={() => toggleGroup(group.label)}
                      className={cn(
                        'flex w-full items-center justify-between px-3 pt-4 pb-1.5 text-[10px] font-black uppercase tracking-[0.24em] transition-colors rounded-lg',
                        hasActiveChild ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-300'
                      )}
                    >
                      <span>{group.label}</span>
                      <ChevronDown
                        size={12}
                        className={cn(
                          'transition-transform duration-200',
                          isOpen ? 'rotate-180' : 'rotate-0'
                        )}
                      />
                    </button>
                  ) : (
                    <p className="px-3 pt-4 pb-1 text-[10px] font-black uppercase tracking-[0.24em] text-slate-500">
                      {group.label}
                    </p>
                  )
                )}

                {/* Group items — shown if open, non-collapsible, or sidebar collapsed */}
                {(isOpen || !group.collapsible || sidebarCollapsed) && (
                  <div className={cn(
                    'space-y-0.5 overflow-hidden transition-all duration-200',
                    group.collapsible && !sidebarCollapsed ? 'ml-1 border-l border-slate-800/60 pl-2' : ''
                  )}>
                    {group.items.map((item) => (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === '/worker' || item.path === '/supervisor'}
                        className={({ isActive }) => cn(
                          'flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all duration-200 group',
                          isActive
                            ? 'bg-gradient-to-r from-emerald-500 via-green-500 to-sky-500 text-white shadow-lg shadow-emerald-900/25 font-medium'
                            : 'text-slate-300/80 hover:bg-white/10 hover:text-white'
                        )}
                        title={sidebarCollapsed ? (t(item.name) || item.name) : undefined}
                      >
                        <item.icon size={20} className="flex-shrink-0" />
                        {!sidebarCollapsed && (
                          <span className="text-sm truncate">{t(item.name) || item.name}</span>
                        )}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          adminNav.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin'}
              className={({ isActive }) => cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all duration-200 group',
                isActive
                  ? 'bg-gradient-to-r from-emerald-500 via-green-500 to-sky-500 text-white shadow-lg shadow-emerald-900/25 font-medium'
                  : 'text-slate-300/80 hover:bg-white/10 hover:text-white'
              )}
              title={sidebarCollapsed ? t(item.name) : undefined}
            >
              <item.icon size={20} className="flex-shrink-0" />
              {!sidebarCollapsed && (
                <span className="text-sm truncate">{t(item.name)}</span>
              )}
            </NavLink>
          ))
        )}
      </nav>

      {/* Bottom section */}
      <div className="px-3 py-3 border-t border-slate-800 space-y-1">
        {!sidebarCollapsed && (
          <button className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors text-sm">
            <Settings size={20} />
            {t('nav.settings')}
          </button>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-slate-400 hover:bg-red-900/30 hover:text-red-400 transition-colors text-sm"
          title={sidebarCollapsed ? t('nav.logout') : undefined}
        >
          <LogOut size={20} />
          {!sidebarCollapsed && t('nav.logout')}
        </button>
      </div>
    </aside>
  );
}
