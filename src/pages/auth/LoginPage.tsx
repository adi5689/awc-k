// ============================================================
// LOGIN SCREEN
// Professional dark-only login screen
// ============================================================

import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import type { UserRole } from '../../types';
import { Users, Shield, Settings, Eye, EyeOff, Activity, ArrowRight, CheckCircle2, LockKeyhole, Mail, Sparkles } from 'lucide-react';
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
      <main className="relative grid min-h-screen w-full overflow-hidden bg-black lg:grid-cols-[0.92fr_1.08fr]">
        <header className="absolute inset-x-0 top-0 z-30 flex h-20 items-center justify-between px-6 sm:px-10">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-black shadow-lg shadow-white/10">
              <Activity className="h-5 w-5" />
            </div>
            <span className="text-base font-black tracking-tight">Smart Anganwadi<span className="text-white">.</span></span>
          </div>
          <nav className="hidden items-center gap-20 text-sm font-bold text-slate-500 md:flex">
            <span className="text-slate-300">Home</span>
            <span>Join</span>
          </nav>
          <div className="hidden w-28 justify-end md:flex">
            <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-bold text-slate-400">Secure</span>
          </div>
        </header>

        <section className="relative min-h-[520px] overflow-hidden border-b border-white/10 bg-black pt-24 lg:min-h-0 lg:border-b-0 lg:border-r lg:border-white/10">
          <div className="absolute inset-0">
            <AnoAI />
            <img
              src="/kid.png"
              alt="Child learning"
              className="absolute bottom-0 right-0 h-[58%] w-[72%] object-cover opacity-70 mix-blend-screen grayscale lg:h-[62%]"
              onError={(e) => {
                e.currentTarget.src = "https://images.unsplash.com/photo-1544716942-8c10faee50b8?q=80&w=1500&auto=format&fit=crop";
              }}
            />
            <div
              className="absolute inset-0 text-white opacity-[0.07]"
              style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1.4px, transparent 0)',
                backgroundSize: '42px 42px',
              }}
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(255,255,255,0.16),transparent_28%),linear-gradient(180deg,rgba(0,0,0,0.20),rgba(0,0,0,0.98)_82%)]" />
            <div className="absolute bottom-0 right-0 h-[62%] w-[74%] bg-[linear-gradient(90deg,rgba(0,0,0,1)_0%,rgba(0,0,0,0.55)_34%,rgba(0,0,0,0.10)_100%)]" />
          </div>

          <div className="relative z-10 flex h-full flex-col justify-between px-8 pb-10 pt-28 sm:px-12 lg:px-16">
            <div className="grid max-w-md grid-cols-2 gap-3">
              <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur-md">
                <p className="text-3xl font-black text-white">1,240</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-widest text-slate-400">child records</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur-md">
                <p className="text-3xl font-black text-white">30d</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-widest text-slate-400">risk forecast</p>
              </div>
            </div>

            <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-slate-300">AI software module</p>
            <h2 className="mt-4 max-w-md text-4xl font-black tracking-tight text-white sm:text-5xl">
              Learning, nutrition and risk intelligence in one place.
            </h2>
            <p className="mt-5 max-w-md text-sm leading-6 text-slate-300">
              Offline-first workflows for AWWs and supervisors, with adaptive learning, child profiling, and predictive follow-up.
            </p>
            <div className="mt-8 grid max-w-md gap-3 sm:grid-cols-3">
              {['Offline first', 'AI assisted', 'Role based'].map((item) => (
                <div key={item} className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.06] px-3 py-2 text-xs font-bold text-white backdrop-blur-md">
                  <CheckCircle2 className="h-4 w-4 text-white" />
                  {item}
                </div>
              ))}
            </div>
            </div>
          </div>
        </section>

        <section className="relative flex items-center justify-center bg-black px-6 py-24 text-white sm:px-10 lg:px-16">
          <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-28 rounded-r-[60%] bg-black lg:block" />
          <div className="pointer-events-none absolute right-10 top-24 h-72 w-72 rounded-full bg-white/[0.035] blur-3xl" />
          <div className="relative z-10 w-full max-w-[560px] rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 shadow-2xl shadow-white/[0.03] backdrop-blur-xl sm:p-8">
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2">
                <Sparkles className="h-4 w-4 text-white" />
                <span className="text-xs font-black uppercase tracking-widest text-slate-300">Workspace login</span>
              </div>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-black">Live demo</span>
            </div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-slate-400">Start securely</p>
            <h1 className="mt-5 text-5xl font-black tracking-tight text-white sm:text-6xl">
              Sign in<span className="text-white">.</span>
            </h1>
            <p className="mt-5 text-base font-medium text-slate-400">
              Select a demo role or enter assigned credentials.
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
                        ? 'bg-white text-black shadow-white/10'
                        : 'border border-white/10 bg-black/40 text-slate-400 hover:bg-white/[0.08] hover:text-white'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {role.title}
                  </button>
                );
              })}
            </div>

            <form onSubmit={handleLogin} className="mt-6 space-y-4">
              <div className="relative rounded-2xl border border-white/10 bg-black/45 px-5 py-3 shadow-sm transition-all focus-within:bg-white/[0.07] focus-within:ring-2 focus-within:ring-white/70">
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

              <div className="relative rounded-2xl border border-white/10 bg-black/45 px-5 py-3 shadow-[0_0_0_2px_rgba(255,255,255,0.78),0_18px_40px_rgba(255,255,255,0.08)] transition-all">
                <label className="block text-xs font-semibold text-white">Password</label>
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
                  className="min-h-14 flex-1 rounded-2xl border border-white/10 bg-black/45 px-5 text-sm font-black text-slate-400 transition-colors hover:bg-white/[0.10] hover:text-white"
                >
                  Use worker demo
                </button>
                <button
                  type="submit"
                  disabled={isLoggingIn || !email || !password}
                  className="flex min-h-14 flex-1 items-center justify-center gap-2 rounded-2xl bg-white px-5 text-sm font-black text-black shadow-2xl shadow-white/10 transition-all hover:bg-slate-200 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-55"
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
      </main>
    </div>
  );
}
