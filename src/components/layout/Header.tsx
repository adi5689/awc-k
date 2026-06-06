// ============================================================
// HEADER - Top bar with theme toggle, online/offline, notifications
// ============================================================

import { useState, useRef, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { cn, formatRelativeTime } from '../../utils';
import { useTranslation } from '../../hooks/useTranslation';
import {
  Bell, Sun, Moon, Wifi, WifiOff, RefreshCcw,
  CheckCheck, X, AlertTriangle, AlertCircle, Info, CheckCircle2,
} from 'lucide-react';

export function Header() {
  const {
    theme, toggleTheme,
    language, setLanguage,
    isOnline, setOnlineStatus, lastSyncTime,
    notifications, unreadCount, markNotificationRead, markAllNotificationsRead,
    syncQueue, processSyncQueue,
    currentUser,
  } = useAppStore();

  const { t } = useTranslation();

  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const pendingSync = syncQueue.filter(i => i.status === 'pending' || i.status === 'syncing').length;

  const getSeverityIcon = (severity?: string) => {
    switch (severity) {
      case 'critical': return <AlertCircle size={14} className="text-red-500" />;
      case 'warning': return <AlertTriangle size={14} className="text-amber-500" />;
      case 'success': return <CheckCircle2 size={14} className="text-emerald-500" />;
      default: return <Info size={14} className="text-blue-500" />;
    }
  };

  return (
    <header className="h-16 px-4 md:px-6 bg-background/80 backdrop-blur-xl border-b border-border/80 flex items-center justify-between sticky top-0 z-10">
      {/* Left: Page title area */}
      <div className="flex items-center gap-3">
        <div>
        <h1 className="text-base md:text-lg font-semibold text-foreground tracking-tight">
          {currentUser?.district && (
            <span className="text-muted-foreground font-normal text-sm mr-2 hidden md:inline">
              {currentUser.district} {t('common.district_suffix')} -
            </span>
          )}
          {t('header.title')}
        </h1>
        <p className="hidden md:block text-xs text-muted-foreground">{t('header.subtitle')}</p>
        </div>
      </div>

      {/* Right: Controls */}
      <div className="flex items-center gap-2 md:gap-3">
        <div className="hidden sm:flex items-center rounded-xl border border-border bg-card p-1 shadow-sm">
          <button
            onClick={() => setLanguage('en')}
            className={cn(
              'rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors',
              language === 'en' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {t('language.english')}
          </button>
          <button
            onClick={() => setLanguage('od')}
            className={cn(
              'rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors',
              language === 'od' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {t('language.odia')}
          </button>
        </div>

        {/* Online/Offline Toggle */}
        <button
          onClick={() => setOnlineStatus(!isOnline)}
          className={cn(
            'flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 border shadow-sm',
            isOnline
              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
              : 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800'
          )}
        >
          {isOnline ? <Wifi size={14} /> : <WifiOff size={14} />}
          <span className="hidden sm:inline">{isOnline ? t('header.online') : t('header.offline')}</span>
        </button>

        {/* Sync Status */}
        {pendingSync > 0 && (
          <button
            onClick={() => {
              if (isOnline) processSyncQueue();
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 transition-colors hover:bg-amber-100 dark:hover:bg-amber-950/60 shadow-sm"
          >
            <RefreshCcw size={14} className="animate-spin" />
            {pendingSync} {t('header.pending')}
          </button>
        )}

        {lastSyncTime && pendingSync === 0 && (
          <span className="text-xs text-muted-foreground hidden md:inline">
            {t('header.synced')} {formatRelativeTime(lastSyncTime, t)}
          </span>
        )}

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
          title={theme === 'light' ? t('header.theme_dark') : t('header.theme_light')}
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse-glow">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 md:w-96 bg-card border border-border rounded-xl shadow-2xl overflow-hidden animate-scale-in z-50">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <h3 className="font-semibold text-sm text-foreground">{t('header.notifications')}</h3>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                    >
                      <CheckCheck size={12} /> {t('header.mark_all_read')}
                    </button>
                  )}
                  <button onClick={() => setShowNotifications(false)} className="text-muted-foreground hover:text-foreground">
                    <X size={16} />
                  </button>
                </div>
              </div>

              <div className="max-h-80 overflow-y-auto scrollbar-thin">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-muted-foreground text-sm">{t('header.no_notifications')}</div>
                ) : (
                  notifications.map((notif) => (
                    <button
                      key={notif.id}
                      onClick={() => markNotificationRead(notif.id)}
                      className={cn(
                        'w-full text-left px-4 py-3 border-b border-border/50 hover:bg-accent/50 transition-colors',
                        !notif.read && 'bg-blue-50/50 dark:bg-blue-950/20'
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">{getSeverityIcon(notif.severity)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-foreground">{notif.title}</span>
                            {!notif.read && <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />}
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

        {/* User Avatar */}
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sky-400 via-emerald-500 to-amber-400 flex items-center justify-center text-white text-xs font-bold shadow-md">
          {currentUser?.name?.charAt(0) || 'U'}
        </div>
      </div>
    </header>
  );
}
