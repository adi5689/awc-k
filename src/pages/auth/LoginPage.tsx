// ============================================================
// LOGIN SCREEN
// Split login screen with shader-backed form panel
// ============================================================

import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import type { UserRole } from '../../types';
import { Users, Shield, Settings, Eye, EyeOff, Activity, ArrowRight, LockKeyhole, Mail, Sparkles } from 'lucide-react';
import AnoAI from '@/components/ui/animated-shader-background';

// Role configuration with dummy credentials
const roles = [
  { id: 'worker' as UserRole, title: 'Worker', email: 'worker@neev.ai', password: 'password123', icon: Users },
  { id: 'supervisor' as UserRole, title: 'Supervisor', email: 'supervisor@neev.ai', password: 'password123', icon: Shield },
  { id: 'admin' as UserRole, title: 'Admin', email: 'admin@neev.ai', password: 'password123', icon: Settings },
];

export function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const navigate = useNavigate();
  const { login, isAuthenticated, userRole } = useAppStore();

  const handleQuickFill = (roleId: UserRole) => {
    const role = roles.find(r => r.id === roleId);
    if (role) {
      setSelectedRole(role.id);
      setEmail(role.email);
      setPassword(role.password);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    const finalRole = roles.find(r => r.email === email)?.id || selectedRole || 'worker';
    
    setIsLoggingIn(true);
    await new Promise(r => setTimeout(r, 1200));
    login(finalRole);

    switch (finalRole) {
      case 'worker': navigate('/worker', { replace: true }); break;
      case 'supervisor': navigate('/supervisor', { replace: true }); break;
      case 'admin': navigate('/admin', { replace: true }); break;
    }
  };

  if (isAuthenticated && userRole) {
    const targetPath = userRole === 'worker' ? '/worker' : userRole === 'supervisor' ? '/supervisor' : '/admin';
    return <Navigate to={targetPath} replace />;
  }

  return (
    <div className="min-h-screen bg-black font-sans text-white">
      <main className="relative grid min-h-screen w-full overflow-hidden bg-black lg:grid-cols-2">
        <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_16%_18%,rgba(14,165,233,0.18),transparent_28%),radial-gradient(circle_at_46%_76%,rgba(34,197,94,0.10),transparent_26%),linear-gradient(135deg,#020617_0%,#000_52%,#050505_100%)]" />
        <div className="pointer-events-none absolute inset-0 z-0">
          <AnoAI />
        </div>
        <div className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.82)_0%,rgba(0,0,0,0.58)_38%,rgba(0,0,0,0.32)_52%,rgba(0,0,0,0.08)_68%,rgba(0,0,0,0.12)_100%)]" />

        <section className="relative z-20 flex min-h-screen items-center px-6 py-10 text-white sm:px-10 lg:px-16">
          <div className="relative z-40 mx-auto w-full max-w-[560px]">
            <header className="mb-12 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black shadow-lg shadow-white/10">
                  <Activity className="h-5 w-5" />
                </div>
                <span className="text-base font-black tracking-tight">Smart Anganwadi<span className="text-sky-400">.</span></span>
              </div>
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-bold text-slate-300 backdrop-blur">Secure</span>
            </header>

            <div className="mb-7 flex w-fit items-center gap-3 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 backdrop-blur">
              <Sparkles className="h-4 w-4 text-sky-300" />
              <span className="text-xs font-black uppercase tracking-widest text-slate-300">Workspace login</span>
            </div>
            <p className="text-sm font-black uppercase tracking-[0.22em] text-slate-400">Start securely</p>
            <h1 className="mt-4 text-5xl font-black tracking-tight text-white sm:text-6xl">
              Sign in<span className="text-sky-400">.</span>
            </h1>
            <p className="mt-4 text-base font-medium text-slate-400">
              Select a role or enter your assigned credentials.
            </p>

            <div className="mt-8 grid grid-cols-3 gap-3">
              {roles.map((role) => {
                const Icon = role.icon;
                const active = selectedRole === role.id;
                return (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => handleQuickFill(role.id)}
                    className={`flex min-h-20 flex-col items-center justify-center gap-2 rounded-2xl px-3 py-3 text-xs font-black shadow-sm transition-all ${
                      active
                        ? 'bg-sky-400 text-black shadow-lg shadow-sky-400/20'
                        : 'border border-white/10 bg-white/[0.05] text-slate-400 backdrop-blur hover:bg-white/[0.09] hover:text-white'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {role.title}
                  </button>
                );
              })}
            </div>

            <form onSubmit={handleLogin} className="mt-6 space-y-4">
              <div className="relative rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-3 shadow-sm backdrop-blur transition-all focus-within:border-sky-300/60 focus-within:bg-white/[0.09] focus-within:ring-2 focus-within:ring-sky-400/70">
                <label className="block text-xs font-semibold text-slate-400">Email</label>
                <Mail className="absolute right-5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full bg-transparent pr-8 text-sm font-bold text-white outline-none placeholder:text-slate-500"
                  placeholder="worker@neev.ai"
                  required
                />
              </div>

              <div className="relative rounded-2xl border border-sky-300/70 bg-white/[0.06] px-5 py-3 shadow-[0_0_0_2px_rgba(56,189,248,0.32),0_18px_40px_rgba(14,165,233,0.10)] backdrop-blur transition-all focus-within:bg-white/[0.09]">
                <label className="block text-xs font-semibold text-sky-300">Password</label>
                <LockKeyhole className="absolute right-12 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 w-full bg-transparent pr-16 text-sm font-bold text-white outline-none placeholder:text-slate-500"
                  placeholder="password123"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-white"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
              </div>

              <div className="flex flex-col gap-3 pt-5 sm:flex-row">
                <button
                  type="button"
                  onClick={() => handleQuickFill('worker')}
                  className="min-h-14 flex-1 rounded-2xl border border-white/10 bg-white/[0.05] px-5 text-sm font-black text-slate-400 backdrop-blur transition-colors hover:bg-white/[0.10] hover:text-white"
                >
                  Use worker demo
                </button>
                <button
                  type="submit"
                  disabled={isLoggingIn || !email || !password}
                  className="flex min-h-14 flex-1 items-center justify-center gap-2 rounded-2xl bg-sky-400 px-5 text-sm font-black text-black shadow-2xl shadow-sky-400/20 transition-all hover:bg-sky-300 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-55"
                >
                  {isLoggingIn ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-black/20 border-t-black" />
                  ) : (
                    <>
                      Sign in
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </form>

            <p className="mt-6 text-sm font-medium text-slate-500">
              Demo password: <span className="font-black text-slate-300">password123</span>
            </p>
          </div>
        </section>

        <section className="relative z-10 hidden min-h-screen overflow-hidden lg:block">
          <svg
            className="absolute inset-0 z-10 h-full w-full"
            viewBox="0 0 720 900"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <clipPath id="login-image-visible-mask" clipPathUnits="userSpaceOnUse">
                <path d="M116 -40C42 28 48 116 126 188C214 270 204 354 106 430C10 504 30 608 132 682C210 738 160 842 42 940H720V-40Z" />
              </clipPath>
              <linearGradient id="login-image-shadow" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor="rgba(0,0,0,0.34)" />
                <stop offset="24%" stopColor="rgba(0,0,0,0.06)" />
                <stop offset="72%" stopColor="rgba(0,0,0,0)" />
                <stop offset="100%" stopColor="rgba(0,0,0,0.16)" />
              </linearGradient>
            </defs>
            <image
              href="/kid.png"
              width="720"
              height="900"
              preserveAspectRatio="xMidYMid slice"
              clipPath="url(#login-image-visible-mask)"
            />
            <path
              d="M116 -40C42 28 48 116 126 188C214 270 204 354 106 430C10 504 30 608 132 682C210 738 160 842 42 940H720V-40Z"
              clipPath="url(#login-image-visible-mask)"
              fill="url(#login-image-shadow)"
            />
            <path
              d="M66 -28C-8 40 -2 112 70 184C156 270 146 352 50 428C-46 505 -26 608 76 680C154 736 104 840 -14 928"
              fill="none"
              stroke="rgba(255,255,255,0.22)"
              strokeDasharray="8 14"
              strokeLinecap="round"
              strokeWidth="1.5"
            />
          </svg>
        </section>
      </main>
    </div>
  );
}
