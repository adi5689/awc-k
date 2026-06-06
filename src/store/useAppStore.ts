// ============================================================
// SMART ANGANWADI - GLOBAL STATE STORE (Zustand)
// Manages auth, theme, sync, notifications, and app state
// ============================================================

import { create } from 'zustand';
import type { UserRole, ThemeMode, Notification, SyncQueueItem, User, Language } from '../types';
import { mockUsers, mockNotifications } from '../data/mockData';

interface AppState {
  // ---- Authentication ----
  isAuthenticated: boolean;
  currentUser: User | null;
  userRole: UserRole | null;

  // ---- Language ----
  language: Language;

  // ---- Theme ----
  theme: ThemeMode;

  // ---- Sidebar ----
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;

  // ---- Online/Offline ----
  isOnline: boolean;
  lastSyncTime: string | null;

  // ---- Notifications ----
  notifications: Notification[];
  unreadCount: number;

  // ---- Sync Queue ----
  syncQueue: SyncQueueItem[];

  // ---- Loading States ----
  isLoading: boolean;

  // ---- Actions ----
  login: (role: UserRole) => void;
  logout: () => void;
  toggleLanguage: () => void;
  setLanguage: (language: Language) => void;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
  toggleSidebar: () => void;
  collapseSidebar: (collapsed: boolean) => void;
  setOnlineStatus: (status: boolean) => void;
  setLastSyncTime: (time: string | null) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addToSyncQueue: (item: Omit<SyncQueueItem, 'id' | 'timestamp' | 'status' | 'retryCount'>) => void;
  processSyncQueue: () => Promise<void>;
  setLoading: (loading: boolean) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // ---- Initial State ----
  isAuthenticated: false,
  currentUser: null,
  userRole: null,
  language: (typeof window !== 'undefined' && (localStorage.getItem('awc-language') as Language | null)) || 'od',
  theme: 'light',
  sidebarOpen: true,
  sidebarCollapsed: false,
  isOnline: true, // Start as online for demo
  lastSyncTime: new Date().toISOString(),
  notifications: mockNotifications,
  unreadCount: mockNotifications.filter(n => !n.read).length,
  syncQueue: [],
  isLoading: false,

  // ---- Auth Actions ----
  login: (role: UserRole) => {
    const user = mockUsers[role];
    set({
      isAuthenticated: true,
      currentUser: user,
      userRole: role,
    });
    // Apply saved theme
    const savedTheme = localStorage.getItem('awc-theme') as ThemeMode;
    if (savedTheme) {
      set({ theme: savedTheme });
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    }
    const savedLanguage = localStorage.getItem('awc-language') as Language | null;
    if (savedLanguage) {
      set({ language: savedLanguage });
    }
  },

  logout: () => {
    set({
      isAuthenticated: false,
      currentUser: null,
      userRole: null,
    });
  },

  // ---- Language Actions ----
  toggleLanguage: () => {
    const current = get().language;
    const next = current === 'od' ? 'en' : 'od';
    set({ language: next });
    localStorage.setItem('awc-language', next);
  },

  setLanguage: (language: Language) => {
    set({ language });
    localStorage.setItem('awc-language', language);
  },

  // ---- Theme Actions ----
  toggleTheme: () => {
    const newTheme = get().theme === 'light' ? 'dark' : 'light';
    set({ theme: newTheme });
    localStorage.setItem('awc-theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  },

  setTheme: (theme: ThemeMode) => {
    set({ theme });
    localStorage.setItem('awc-theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  },

  // ---- Sidebar Actions ----
  toggleSidebar: () => set(s => ({ sidebarOpen: !s.sidebarOpen })),
  collapseSidebar: (collapsed: boolean) => set({ sidebarCollapsed: collapsed }),

  // ---- Online/Offline Actions ----
  setOnlineStatus: (status: boolean) => set({ isOnline: status }),
  setLastSyncTime: (time: string | null) => set({ lastSyncTime: time }),

  // ---- Notification Actions ----
  addNotification: (notification) => {
    const newNotif: Notification = {
      ...notification,
      id: `n_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      read: false,
    };
    set(s => ({
      notifications: [newNotif, ...s.notifications],
      unreadCount: s.unreadCount + 1,
    }));
  },

  markNotificationRead: (id: string) => {
    set(s => ({
      notifications: s.notifications.map(n => n.id === id ? { ...n, read: true } : n),
      unreadCount: Math.max(0, s.unreadCount - 1),
    }));
  },

  markAllNotificationsRead: () => {
    set(s => ({
      notifications: s.notifications.map(n => ({ ...n, read: true })),
      unreadCount: 0,
    }));
  },

  // ---- Sync Queue Actions ----
  addToSyncQueue: (item) => {
    const newItem: SyncQueueItem = {
      ...item,
      id: `sq_${Date.now()}`,
      timestamp: new Date().toISOString(),
      status: 'pending',
      retryCount: 0,
    };
    set(s => ({ syncQueue: [...s.syncQueue, newItem] }));
  },

  processSyncQueue: async () => {
    const { syncQueue } = get();
    if (syncQueue.filter(i => i.status === 'pending').length === 0) return;

    // Mark as syncing
    set(s => ({
      syncQueue: s.syncQueue.map(i => i.status === 'pending' ? { ...i, status: 'syncing' as const } : i),
    }));

    // Simulate network delay
    await new Promise(r => setTimeout(r, 2000));

    // Mark as synced
    set(s => ({
      syncQueue: s.syncQueue.map(i => i.status === 'syncing' ? { ...i, status: 'synced' as const } : i),
      lastSyncTime: new Date().toISOString(),
    }));

    // Remove synced items after delay
    setTimeout(() => {
      set(s => ({ syncQueue: s.syncQueue.filter(i => i.status !== 'synced') }));
    }, 1500);
  },

  // ---- Loading State ----
  setLoading: (loading: boolean) => set({ isLoading: loading }),
}));
