// ============================================================
// HEADER - Top bar with theme toggle, online/offline, notifications
// ============================================================

import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { cn, formatRelativeTime } from '../../utils';
import { useTranslation } from '../../hooks/useTranslation';
import {
  Bell, Sun, Moon, Wifi, WifiOff, RefreshCcw,
  CheckCheck, X, AlertTriangle, AlertCircle, Info, CheckCircle2,
  Search, ChevronDown, LogOut,
} from 'lucide-react';

export function Header() {
  const {
    theme, toggleTheme,
    language, setLanguage,
    isOnline, setOnlineStatus, lastSyncTime,
    notifications, unreadCount, markNotificationRead, markAllNotificationsRead,
    syncQueue, processSyncQueue,
    currentUser,
    userRole,
    logout,
  } = useAppStore();

  const { t } = useTranslation();
  const navigate = useNavigate();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const pendingSync = syncQueue.filter(i => i.status === 'pending' || i.status === 'syncing').length;
  const roleLabel = userRole === 'worker' ? 'Worker' : userRole === 'supervisor' ? 'Supervisor' : userRole === 'official' ? 'Official' : 'Admin';
  const rolePath = userRole === 'official' ? '/officials/profile' : userRole === 'admin' ? '/admin/settings' : userRole === 'supervisor' ? '/supervisor/reports' : '/worker/children';

  const getSeverityIcon = (severity?: string) => {
    switch (severity) {
      case 'critical': return <AlertCircle size={14} className="text-red-500" />;
      case 'warning': return <AlertTriangle size={14} className="text-amber-500" />;
      case 'success': return <CheckCircle2 size={14} className="text-emerald-500" />;
      default: return <Info size={14} className="text-blue-500" />;
    }
  };

  return (
    <header className="h-14 px-4 md:px-6 bg-background/80 backdrop-blur-xl border-b border-border flex items-center justify-between sticky top-0 z-10">
      {/* Left: Workspace Context (Simplified & Integrated) */}
      <div className="flex items-center gap-2.5">
        <span className="text-sm font-semibold text-foreground tracking-tight">{t('header.title')}</span>
        <span className="h-3.5 w-px bg-border hidden sm:block" />
        <span className="text-[11px] text-muted-foreground/90 hidden sm:inline-flex items-center gap-1.5 bg-muted/40 px-2 py-0.5 rounded-md border border-border/40">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          {currentUser?.district ?? 'Kalahandi'} · {roleLabel}
        </span>
      </div>

      {/* Right: Clean, grouped controls */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="hidden lg:flex items-center rounded-lg bg-muted/45 px-2.5 py-1.5 transition-all focus-within:bg-muted/70 focus-within:ring-1 focus-within:ring-ring/40 w-44 focus-within:w-56">
          <Search size={14} className="text-muted-foreground/80 shrink-0" />
          <input
            type="text"
            placeholder="Search..."
            className="ml-1.5 bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground/80 w-full"
          />
        </div>

        {/* Language switcher (Segmented control) */}
        <div className="hidden sm:flex items-center rounded-lg bg-muted/50 p-0.5 text-xs">
          <button
            onClick={() => setLanguage('en')}
            className={cn(
              'rounded-md px-2 py-0.5 text-[11px] font-semibold transition-all',
              language === 'en' ? 'bg-card text-foreground shadow-xs' : 'text-muted-foreground/80 hover:text-foreground'
            )}
          >
            EN
          </button>
          <button
            onClick={() => setLanguage('od')}
            className={cn(
              'rounded-md px-2 py-0.5 text-[11px] font-semibold transition-all',
              language === 'od' ? 'bg-card text-foreground shadow-xs' : 'text-muted-foreground/80 hover:text-foreground'
            )}
          >
            ଓଡ଼ି
          </button>
        </div>

        {/* Online/Offline Toggle (Compact Pill) */}
        <button
          onClick={() => setOnlineStatus(!isOnline)}
          className={cn(
            'flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border shadow-xs transition-all hover:bg-muted/20 shrink-0',
            isOnline
              ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20'
              : 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20'
          )}
          title={isOnline ? "Online (Click to go offline)" : "Offline (Click to go online)"}
        >
          <span className={cn('h-1.5 w-1.5 rounded-full', isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-red-500')} />
          <span className="text-[11px] font-semibold hidden md:inline">{isOnline ? 'Online' : 'Offline'}</span>
        </button>

        {/* Sync Status / Pending */}
        {pendingSync > 0 && (
          <button
            onClick={() => {
              if (isOnline) processSyncQueue();
            }}
            className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 transition-colors hover:bg-amber-500/25 shrink-0"
          >
            <RefreshCcw size={12} className="animate-spin" />
            <span>{pendingSync} pending</span>
          </button>
        )}

        {lastSyncTime && pendingSync === 0 && (
          <span className="text-[10px] text-muted-foreground/75 hidden md:inline-flex items-center gap-1 shrink-0">
            <span className="w-1 h-1 rounded-full bg-slate-400" />
            {formatRelativeTime(lastSyncTime, t)}
          </span>
        )}

        <div className="flex items-center gap-0.5">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-lg hover:bg-accent/60 transition-colors text-muted-foreground/80 hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring shrink-0"
            title={theme === 'light' ? t('header.theme_dark') : t('header.theme_light')}
            aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          </button>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-1.5 rounded-lg hover:bg-accent/60 transition-colors text-muted-foreground/80 hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring shrink-0"
              aria-haspopup="true"
              aria-expanded={showNotifications}
              aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
            >
              <Bell size={16} />
              {unreadCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center" role="status">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-80 md:w-96 bg-card border border-border rounded-xl shadow-xl overflow-hidden animate-scale-in z-50">
                <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                  <h3 className="font-semibold text-sm text-foreground">{t('header.notifications')}</h3>
                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllNotificationsRead}
                        className="text-xs text-primary hover:underline flex items-center gap-1 font-medium"
                      >
                        <CheckCheck size={12} /> {t('header.mark_all_read')}
                      </button>
                    )}
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-muted-foreground hover:text-foreground rounded-md p-1 hover:bg-accent transition-colors"
                      aria-label="Close notifications"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>

                <div className="max-h-80 overflow-y-auto scrollbar-thin">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground text-sm">{t('header.no_notifications')}</div>
                  ) : (
                    notifications.map((notif) => (
                      <button
                        key={notif.id}
                        onClick={() => markNotificationRead(notif.id)}
                        className={cn(
                          'w-full text-left px-4 py-3 border-b border-border/50 hover:bg-accent/50 transition-colors',
                          !notif.read && 'bg-primary/5'
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 shrink-0">{getSeverityIcon(notif.severity)}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-semibold text-foreground">{notif.title}</span>
                              {!notif.read && <span className="w-2 h-2 bg-primary rounded-full shrink-0" />}
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{notif.message}</p>
                            <span className="text-[10px] text-muted-foreground mt-1 block">{formatRelativeTime(notif.timestamp ?? '', t)}</span>
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <span className="h-4 w-px bg-border shrink-0" />

        {/* User Profile Avatar Dropdown */}
        <div className="relative shrink-0" ref={profileRef}>
          <button
            onClick={() => setShowProfileMenu((open) => !open)}
            className="flex items-center gap-1.5 rounded-full transition-colors hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring p-0.5 pr-1.5"
            aria-haspopup="true"
            aria-expanded={showProfileMenu}
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary/80 to-info/80 flex items-center justify-center text-white text-xs font-bold shadow-sm shrink-0">
              {currentUser?.name?.charAt(0) || 'U'}
            </div>
            <span className="text-xs font-semibold text-foreground hidden md:block select-none truncate max-w-[100px]">
              {currentUser?.name?.split(' ')[0] || 'User'}
            </span>
            <ChevronDown size={12} className="text-muted-foreground/75 hidden md:block shrink-0" />
          </button>
          
          {showProfileMenu && (
            <div className="absolute right-0 top-full mt-2 w-52 rounded-xl border border-border bg-card p-1.5 shadow-xl animate-scale-in z-50">
              <div className="px-2.5 py-1.5 border-b border-border/60 mb-1">
                <p className="text-xs font-semibold text-foreground truncate">{currentUser?.name}</p>
                <p className="text-[10px] text-muted-foreground truncate mt-0.5">{roleLabel}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowProfileMenu(false);
                  navigate(rolePath);
                }}
                className="flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-xs font-medium text-foreground transition-colors hover:bg-accent"
              >
                Open profile
                <ChevronDown size={12} className="-rotate-90 text-muted-foreground/70" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowProfileMenu(false);
                  logout();
                  navigate('/login', { replace: true });
                }}
                className="mt-0.5 flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-semibold text-red-600 dark:text-red-400 transition-colors hover:bg-red-50 dark:hover:bg-red-950/30"
              >
                <LogOut size={12} />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
