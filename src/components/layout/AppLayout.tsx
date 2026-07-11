// ============================================================
// APP LAYOUT - Shared layout with sidebar & header
// Used by all authenticated views (worker, supervisor, admin)
// ============================================================

import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { AIAssistantWidget } from '../AIAssistantWidget';
import { useAppStore } from '../../store/useAppStore';
import { cn } from '../../utils';
import { Toaster } from 'react-hot-toast';

export function AppLayout() {
  const { isAuthenticated, userRole } = useAppStore();
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Skip to content — accessibility */}
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>

      {/* Toast notification system */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          className: '!bg-card !text-card-foreground !border !border-border !shadow-lg !rounded-xl !text-sm',
          success: { className: '!bg-emerald-50 !dark:bg-emerald-950/50 !text-emerald-800 !dark:text-emerald-200 !border-emerald-200 !shadow-lg !rounded-xl !text-sm' },
          error: { className: '!bg-red-50 !dark:bg-red-950/50 !text-red-800 !dark:text-red-200 !border-red-200 !shadow-lg !rounded-xl !text-sm' },
        }}
      />

      {/* Global AI Assistant */}
      <AIAssistantWidget />

      {/* Sidebar navigation */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex-1 flex h-screen flex-col overflow-hidden transition-all duration-300">
        <Header />
        <main
          id="main-content"
          className="flex-1 overflow-y-auto scrollbar-thin"
          aria-label="Main content"
        >
          <div className={cn(
            'p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto',
            userRole === 'worker' && 'pb-28 md:pb-28 lg:pb-8'
          )}>
            <div className="page-transition">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
