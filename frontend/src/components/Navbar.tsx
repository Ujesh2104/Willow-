import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import { ShieldCheck, Ticket, ScanLine, User as UserIcon, LogOut, Settings, Menu, X } from 'lucide-react';

interface NavbarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  onNavigateToLogin: () => void;
  onNavigateToRegister: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  onNavigateToLogin,
  onNavigateToRegister
}) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { bookings } = useBooking();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAdmin = user?.email?.toLowerCase().includes('admin');

  const handleLogoClick = () => {
    setCurrentView(isAuthenticated ? (isAdmin ? 'admin' : 'dashboard') : 'home');
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-willow-emerald/20 bg-willow-900/95 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        
        <div 
          onClick={handleLogoClick} 
          className="flex items-center gap-2.5 sm:gap-3.5 cursor-pointer group"
        >
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-willow-emerald to-emerald-800 p-0.5 shadow-glow-emerald flex items-center justify-center transition-transform group-hover:scale-105 shrink-0">
            <div className="w-full h-full bg-willow-900 rounded-[10px] flex items-center justify-center">
              <span className="text-xl sm:text-2xl">🏏</span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-white font-sans bg-gradient-to-r from-white via-slate-100 to-willow-emerald bg-clip-text text-transparent">
                Willow
              </span>
            </div>
            <p className="text-[10px] sm:text-xs text-slate-400 font-medium hidden sm:block">
              From the Willow to the Stadium Gate
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-3">
          {!isAuthenticated ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={onNavigateToLogin}
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white border border-slate-700 hover:border-slate-500 bg-willow-850 transition-all"
              >
                Sign In
              </button>

              <button
                onClick={onNavigateToRegister}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-willow-emerald to-teal-400 text-black shadow-glow-emerald hover:brightness-110 active:scale-95 transition-all"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>Register</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              {isAdmin ? (
                <span className="px-3 py-1.5 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-bold font-mono flex items-center gap-1.5">
                  <Settings className="w-3.5 h-3.5" /> Admin Mode
                </span>
              ) : (
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold bg-willow-800/80 border border-slate-700 text-slate-200 hover:border-willow-emerald"
                >
                  <Ticket className="w-3.5 h-3.5 text-willow-emerald" />
                  <span>Fan Dashboard</span>
                  {bookings.length > 0 && (
                    <span className="w-4 h-4 rounded-full bg-willow-emerald text-black text-[9px] font-bold flex items-center justify-center">
                      {bookings.length}
                    </span>
                  )}
                </button>
              )}

              <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-willow-800/60 border border-slate-700 text-slate-200">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-willow-emerald to-teal-400 flex items-center justify-center text-black font-black text-xs">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <span className="text-xs font-bold hidden md:inline">{user?.name?.split(' ')[0]}</span>
                </div>

                <button
                  onClick={logout}
                  title="Sign Out Session"
                  className="p-2 rounded-xl bg-willow-800/80 border border-slate-700 text-slate-400 hover:text-red-400 hover:border-red-500/40 transition-all"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="sm:hidden flex items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-willow-800 border border-slate-700 text-slate-300"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {mobileMenuOpen && (
        <div className="sm:hidden bg-willow-900 border-b border-slate-800 px-4 py-4 space-y-3 animate-in slide-in-from-top-2">
          {!isAuthenticated ? (
            <div className="flex flex-col gap-2">
              <button
                onClick={() => { onNavigateToLogin(); setMobileMenuOpen(false); }}
                className="w-full py-2.5 rounded-xl bg-willow-850 border border-slate-700 text-xs font-bold text-slate-200 text-center"
              >
                Sign In
              </button>
              <button
                onClick={() => { onNavigateToRegister(); setMobileMenuOpen(false); }}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-willow-emerald to-teal-400 text-black font-black text-xs text-center"
              >
                Register Verified Account
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 rounded-xl bg-willow-800/60 border border-slate-700">
                <span className="text-xs font-bold text-white">{user?.name}</span>
                <span className="text-[10px] text-willow-emerald font-mono">1 Session Active</span>
              </div>
              <button
                onClick={() => { setCurrentView(isAdmin ? 'admin' : 'dashboard'); setMobileMenuOpen(false); }}
                className="w-full py-2.5 rounded-xl bg-willow-800 border border-slate-700 text-xs font-bold text-white text-center"
              >
                Go to {isAdmin ? 'Admin Dashboard' : 'Fan Dashboard'}
              </button>
              <button
                onClick={() => { logout(); setMobileMenuOpen(false); }}
                className="w-full py-2 rounded-xl bg-red-950/80 border border-red-500/40 text-xs font-bold text-red-300 text-center"
              >
                Log Out
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
