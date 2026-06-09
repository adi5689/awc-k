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
  LayoutDashboard, Users, Activity, Brain, BookOpen, BrainCircuit,
  Map, Settings, ChevronLeft, ChevronRight, ChevronDown,
  LogOut, Sparkles, ClipboardList, HeartPulse, Syringe, CalendarDays,
  FileBarChart2, WifiOff, Route, GraduationCap, ShieldCheck,
  PlugZap, MoreHorizontal, UploadCloud, ClipboardCheck,
} from 'lucide-react';

const workerNavGroups = [
  {
    label: 'nav.group.dashboard',
    collapsible: false,
    items: [{ name: 'nav.dashboard', icon: LayoutDashboard, path: '/worker' }],
  },
  {
    label: 'nav.group.learning',
    collapsible: false,
    items: [{ name: 'nav.student_observations', icon: ClipboardCheck, path: '/worker/student-observations' }],
  },
  {
    label: 'nav.group.children',
    collapsible: true,
    items: [
      { name: 'nav.all_children', icon: Users, path: '/worker/children' },
      { name: 'nav.progress_tracking', icon: Activity, path: '/worker/progress-tracking' },
    ],
  },
  {
    label: 'nav.group.attendance',
    collapsible: false,
    items: [{ name: 'nav.daily_attendance', icon: CalendarDays, path: '/worker/attendance' }],
  },
  {
    label: 'nav.group.nutrition_health',
    collapsible: false,
    items: [{ name: 'nav.nutrition_forecast', icon: HeartPulse, path: '/worker/nutrition-forecast' }],
  },
  {
    label: 'nav.group.reports',
    collapsible: true,
    items: [
      { name: 'nav.reports', icon: FileBarChart2, path: '/worker/reports' },
      { name: 'nav.training', icon: GraduationCap, path: '/worker/training' },
    ],
  },
  {
    label: 'nav.group.offline_sync',
    collapsible: false,
    items: [{ name: 'nav.offline_sync', icon: WifiOff, path: '/worker/offline-sync' }],
  },
];

const workerDockItems = workerNavGroups.flatMap((group) => group.items);
const visibleWorkerDockItems = workerDockItems.slice(0, 3);
const visibleWorkerDockPaths = new Set(visibleWorkerDockItems.map((item) => item.path));
const overflowWorkerDockGroups = workerNavGroups
  .map((group) => ({
    ...group,
    items: group.items.filter((item) => !visibleWorkerDockPaths.has(item.path)),
  }))
  .filter((group) => group.items.length > 0);

const supervisorNavGroups = [
  {
    label: 'nav.group.overview',
    collapsible: false,
    items: [
      { name: 'nav.dashboard', icon: LayoutDashboard, path: '/supervisor' },
      { name: 'nav.centres_directory', icon: ClipboardList, path: '/supervisor/awc-list' },
    ],
  },
  {
    label: 'nav.group.monitoring',
    collapsible: true,
    items: [
      { name: 'nav.attendance_trends', icon: CalendarDays, path: '/supervisor/attendance' },
      { name: 'nav.educational_progress', icon: BookOpen, path: '/supervisor/learning' },
      { name: 'nav.ai_dashboard', icon: BrainCircuit, path: '/supervisor/ai-dashboard' },
    ],
  },
  {
    label: 'nav.group.health_stats',
    collapsible: true,
    items: [
      { name: 'nav.nutrition_tracking', icon: HeartPulse, path: '/supervisor/nutrition' },
      { name: 'nav.poshan_upload', icon: UploadCloud, path: '/supervisor/poshan-upload' },
      { name: 'nav.predictive_risk', icon: Route, path: '/supervisor/predictive-risk' },
      { name: 'nav.immunization_coverage', icon: Syringe, path: '/supervisor/immunization' },
    ],
  },
  {
    label: 'nav.group.analytics_reports',
    collapsible: true,
    items: [
      { name: 'nav.generate_reports', icon: FileBarChart2, path: '/supervisor/reports' },
      { name: 'nav.training_progress', icon: GraduationCap, path: '/supervisor/training' }
    ],
  },
];

const adminNav = [
  { name: 'nav.district', icon: LayoutDashboard, path: '/admin' },
  { name: 'nav.heatmap', icon: Map, path: '/admin/heatmap' },
  { name: 'nav.insights', icon: Brain, path: '/admin/insights' },
  { name: 'nav.poshan_upload', icon: UploadCloud, path: '/admin/poshan-upload' },
  { name: 'nav.reports', icon: Activity, path: '/admin/reports' },
  { name: 'nav.training', icon: GraduationCap, path: '/admin/training' },
  { name: 'nav.system_monitoring', icon: ShieldCheck, path: '/admin/system-monitoring' },
  { name: 'nav.integrations', icon: PlugZap, path: '/admin/integrations' },
];

export function Sidebar() {
  const { userRole, sidebarCollapsed, collapseSidebar, currentUser, logout } = useAppStore();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const isWorker = userRole === 'worker';
  const [dockMoreOpen, setDockMoreOpen] = useState(false);

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

  const handleDockLogout = () => {
    setDockMoreOpen(false);
    handleLogout();
  };

  const hasActiveDockOverflow = overflowWorkerDockGroups.some((group) =>
    group.items.some((item) => location.pathname === item.path || location.pathname.startsWith(item.path + '/'))
  );

  const sidebar = (
    <aside
      className={cn(
        'flex flex-col h-screen bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_30%),linear-gradient(180deg,#0b1220_0%,#111827_42%,#0f172a_100%)] dark:bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.14),_transparent_30%),linear-gradient(180deg,#020617_0%,#0f172a_42%,#020617_100%)] text-white transition-all duration-300 relative z-20 border-r border-white/5',
        isWorker ? 'hidden lg:flex' : 'flex',
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
                      <span>{t(group.label)}</span>
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
                      {t(group.label)}
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

  if (!isWorker) return sidebar;

  return (
    <>
      {sidebar}
      <aside className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-slate-950/95 px-2 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] pt-2 text-white shadow-2xl shadow-slate-950/30 backdrop-blur-xl lg:hidden">
        {dockMoreOpen && (
          <div className="absolute inset-x-2 bottom-[calc(100%+0.5rem)] max-h-[48vh] overflow-y-auto rounded-2xl border border-white/10 bg-slate-950/95 p-2 shadow-2xl shadow-slate-950/40 backdrop-blur-xl">
            <div className="grid gap-3 sm:grid-cols-2">
              {overflowWorkerDockGroups.map((group) => {
                const isOpen = openGroups.has(group.label);
                const hasActiveChild = group.items.some(
                  (item) => location.pathname === item.path || location.pathname.startsWith(item.path + '/')
                );

                return (
                  <div key={group.label} className="space-y-1">
                    {group.collapsible ? (
                      <button
                        onClick={() => toggleGroup(group.label)}
                        className={cn(
                          'flex w-full items-center justify-between rounded-lg px-3 pb-1.5 pt-2 text-left text-[10px] font-black uppercase tracking-[0.22em] transition-colors',
                          hasActiveChild ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-300'
                        )}
                      >
                        <span>{t(group.label)}</span>
                        <ChevronDown
                          size={12}
                          className={cn(
                            'transition-transform duration-200',
                            isOpen ? 'rotate-180' : 'rotate-0'
                          )}
                        />
                      </button>
                    ) : (
                      <p className="px-3 pb-1 pt-2 text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">
                        {t(group.label)}
                      </p>
                    )}

                    {(isOpen || !group.collapsible) && (
                      <div className={cn(
                        'space-y-1 overflow-hidden transition-all duration-200',
                        group.collapsible ? 'ml-1 border-l border-slate-800/60 pl-2' : ''
                      )}>
                        {group.items.map((item) => (
                          <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === '/worker'}
                            onClick={() => setDockMoreOpen(false)}
                            className={({ isActive }) => cn(
                              'flex items-center gap-3 rounded-xl px-3 py-3 text-left transition-all duration-200',
                              isActive
                                ? 'bg-gradient-to-r from-emerald-500 via-green-500 to-sky-500 text-white shadow-lg shadow-emerald-900/25'
                                : 'text-slate-300/80 hover:bg-white/10 hover:text-white'
                            )}
                          >
                            <item.icon size={20} className="flex-shrink-0" />
                            <span className="min-w-0 truncate text-sm font-medium">{t(item.name) || item.name}</span>
                          </NavLink>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
              <button
                onClick={handleDockLogout}
                className="flex items-center gap-3 rounded-xl px-3 py-3 text-left text-slate-300/80 transition-all duration-200 hover:bg-red-900/30 hover:text-red-300"
              >
                <LogOut size={20} className="flex-shrink-0" />
                <span className="min-w-0 truncate text-sm font-medium">{t('nav.logout')}</span>
              </button>
            </div>
          </div>
        )}
        <nav className="grid grid-cols-4 gap-2" aria-label={t('nav.group.dashboard')}>
          {visibleWorkerDockItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/worker'}
              onClick={() => setDockMoreOpen(false)}
              className={({ isActive }) => cn(
                'flex h-16 min-w-0 flex-col items-center justify-center gap-1 rounded-xl px-2 text-center transition-all duration-200',
                isActive
                  ? 'bg-gradient-to-r from-emerald-500 via-green-500 to-sky-500 text-white shadow-lg shadow-emerald-900/25'
                  : 'text-slate-300/80 hover:bg-white/10 hover:text-white'
              )}
            >
              <item.icon size={20} className="flex-shrink-0" />
              <span className="w-full truncate text-[10px] font-medium leading-tight">{t(item.name) || item.name}</span>
            </NavLink>
          ))}
          <button
            onClick={() => setDockMoreOpen((open) => !open)}
            className={cn(
              'flex h-16 min-w-0 flex-col items-center justify-center gap-1 rounded-xl px-2 text-center transition-all duration-200',
              dockMoreOpen || hasActiveDockOverflow
                ? 'bg-gradient-to-r from-emerald-500 via-green-500 to-sky-500 text-white shadow-lg shadow-emerald-900/25'
                : 'text-slate-300/80 hover:bg-white/10 hover:text-white'
            )}
            aria-expanded={dockMoreOpen}
            aria-label="More"
          >
            <MoreHorizontal size={20} />
            <span className="w-full truncate text-[10px] font-medium leading-tight">More</span>
          </button>
        </nav>
      </aside>
    </>
  );
}
