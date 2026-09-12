import React, { useState } from 'react';
import { useAuth, normalizeEmail } from '../context/AuthContext';
import { X, ShieldCheck, Mail, Lock, User, Phone, CheckCircle, AlertTriangle } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const normalized = normalizeEmail(email);
  const hasAlias = email && normalized !== email.toLowerCase();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        if (!name || !email || !phone) {
          setError('Please fill all required fields');
          setLoading(false);
          return;
        }
        await register(name, email, phone, password);
      } else {
        if (!email) {
          setError('Please enter your registered email');
          setLoading(false);
          return;
        }
        await login(email, password);
      }

      setLoading(false);
      onClose();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md glass-modal rounded-2xl p-6 sm:p-8 shadow-glow-emerald border border-willow-emerald/30 text-white animate-in fade-in zoom-in duration-200">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-willow-emerald/20 border border-willow-emerald/40 text-willow-neon mx-auto flex items-center justify-center text-2xl mb-3 shadow-glow-emerald">
            🛡️
          </div>
          <h2 className="text-2xl font-black tracking-tight">
            {isRegister ? 'Create Fan Identity' : 'Willow Fan Login'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Single Active Session • Anti-Scalp Verified Account
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/80 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {isRegister && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Full Legal Name (For Gate Pass)
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="e.g. Rohit Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-willow-800/80 border border-slate-700 focus:border-willow-emerald focus:outline-none text-sm text-white placeholder-slate-500 transition-all"
                />
              </div>
            </div>
          )}

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Email Address
              </label>
              <span className="text-[10px] text-willow-emerald font-mono">Anti-Alias Protected</span>
            </div>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                placeholder="fan@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-willow-800/80 border border-slate-700 focus:border-willow-emerald focus:outline-none text-sm text-white placeholder-slate-500 transition-all"
              />
            </div>

            {hasAlias && (
              <div className="mt-2 p-2.5 rounded-xl bg-willow-emerald/10 border border-willow-emerald/30 text-[11px] text-willow-neon flex items-start gap-2">
                <CheckCircle className="w-4 h-4 shrink-0 mt-0.5 text-willow-emerald" />
                <div>
                  <p className="font-bold">Sanitized Identity Enforced:</p>
                  <p className="text-slate-300 font-mono text-[10px]">
                    {email} &rarr; <span className="text-white font-bold">{normalized}</span>
                  </p>
                  <p className="text-[9px] text-slate-400 mt-0.5">
                    Dots & '+' aliases are stripped to prevent duplicate multi-account bot hoarding.
                  </p>
                </div>
              </div>
            )}
          </div>

          {isRegister && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Phone Number (For Gate Entry OTP)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-willow-800/80 border border-slate-700 focus:border-willow-emerald focus:outline-none text-sm text-white placeholder-slate-500 transition-all"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-willow-800/80 border border-slate-700 focus:border-willow-emerald focus:outline-none text-sm text-white placeholder-slate-500 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-willow-emerald via-emerald-500 to-teal-400 text-black font-extrabold text-sm shadow-glow-emerald hover:brightness-110 active:scale-95 transition-all mt-2 flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{loading ? 'Verifying Identity...' : isRegister ? 'Register & Verify Account' : 'Authenticate Single Session'}</span>
          </button>

        </form>

        <div className="mt-5 text-center text-xs text-slate-400">
          {isRegister ? (
            <p>
              Already have a verified fan ID?{' '}
              <button
                type="button"
                onClick={() => { setIsRegister(false); setError(''); }}
                className="text-willow-neon font-bold hover:underline"
              >
                Sign In
              </button>
            </p>
          ) : (
            <p>
              New fan?{' '}
              <button
                type="button"
                onClick={() => { setIsRegister(true); setError(''); }}
                className="text-willow-neon font-bold hover:underline"
              >
                Create Verified Account
              </button>
            </p>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800 text-center">
          <p className="text-[10px] text-slate-500 flex items-center justify-center gap-1.5">
            <span>🔒 256-Bit Encrypted Pass</span> • <span>1 Device Session</span> • <span>Max 4 Tickets</span>
          </p>
        </div>

      </div>
    </div>
  );
};
