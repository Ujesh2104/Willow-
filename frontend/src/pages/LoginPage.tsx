import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Mail, Lock, CheckCircle2, AlertTriangle, ArrowRight, User, Settings, KeyRound } from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: (role: 'fan' | 'admin') => void;
  onNavigateToRegister: () => void;
  justRegisteredMessage?: string | null;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  onNavigateToRegister,
  justRegisteredMessage
}) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    if (!password) {
      setError('Please enter your account password.');
      return;
    }

    setLoading(true);
    try {
      const res = await login(email, password);
      setLoading(false);

      if (res.success) {
        const isAdmin = res.user?.role === 'admin' || email.trim().toLowerCase() === 'admin@willow.com';
        const role = isAdmin ? 'admin' : 'fan';
        onLoginSuccess(role);
      } else {
        setError(res.message || 'Login failed. Please check your credentials.');
      }
    } catch (err: any) {
      setError(err.message || 'Server error during login.');
      setLoading(false);
    }
  };

  const fillAdminCredentials = () => {
    setEmail('admin@willow.com');
    setPassword('admin123');
    setError('');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8 text-white space-y-6">
      
      <div className="text-center space-y-2">
        <div className="w-16 h-16 rounded-2xl p-0.5 border border-willow-emerald/40 mx-auto flex items-center justify-center shadow-glow-emerald overflow-hidden bg-black">
          <img src="/images/willow_logo.jpg" alt="Willow Logo" className="w-full h-full object-cover rounded-xl" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Sign In to Willow</h2>
        <p className="text-xs text-slate-400">
          Enter your credentials to book match tickets & access stadium passes
        </p>
      </div>

      {justRegisteredMessage && (
        <div className="p-4 rounded-2xl bg-emerald-950/90 border border-willow-emerald text-emerald-200 text-xs flex items-center gap-2.5 shadow-glow-emerald animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-willow-emerald shrink-0" />
          <span>{justRegisteredMessage}</span>
        </div>
      )}

      <div className="glass-modal rounded-3xl p-6 sm:p-8 border border-willow-emerald/30 shadow-2xl space-y-5">
        
        {error && (
          <div className="p-3.5 rounded-xl bg-red-950/80 border border-red-500/50 text-red-300 text-xs flex items-center gap-2 animate-in fade-in">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                placeholder="fan@gmail.com or admin@willow.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-willow-800/90 border border-slate-700 text-xs text-white placeholder-slate-500 focus:border-willow-emerald focus:outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                Password
              </label>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-willow-800/90 border border-slate-700 text-xs text-white placeholder-slate-500 focus:border-willow-emerald focus:outline-none transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-willow-emerald via-emerald-500 to-teal-400 text-black font-black text-sm shadow-glow-emerald hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{loading ? 'Authenticating Session...' : 'Sign In'}</span>
          </button>

        </form>

        <div className="pt-2 flex flex-col gap-2">
          <button
            type="button"
            onClick={fillAdminCredentials}
            className="w-full py-2 px-3 rounded-xl bg-purple-950/60 hover:bg-purple-900/80 border border-purple-500/30 text-purple-300 text-[11px] font-mono flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Fill Admin Credentials (admin@willow.com)</span>
          </button>
        </div>

        <div className="text-center pt-3 text-xs text-slate-400 border-t border-slate-800">
          New fan?{' '}
          <button
            type="button"
            onClick={onNavigateToRegister}
            className="text-willow-neon font-bold hover:underline cursor-pointer"
          >
            Create Account
          </button>
        </div>

      </div>

    </div>
  );
};
