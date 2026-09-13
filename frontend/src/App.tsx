import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { BookingProvider, useBooking } from './context/BookingContext';
import { Navbar } from './components/Navbar';
import { PublicHomePage } from './pages/PublicHomePage';
import { RegisterPage } from './pages/RegisterPage';
import { LoginPage } from './pages/LoginPage';
import { FanDashboard } from './pages/FanDashboard';
import { AdminPage } from './pages/AdminPage';
import { Clock, Smartphone } from 'lucide-react';

const MainApp: React.FC = () => {
  const { isAuthenticated, user, duplicateSessionAlert, clearDuplicateAlert } = useAuth();
  const { lockExpiredModal, closeLockExpiredModal } = useBooking();

  const [currentView, setCurrentViewState] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('willow_current_view');
      const userRaw = localStorage.getItem('willow_active_user');
      if (userRaw) {
        const u = JSON.parse(userRaw);
        if (saved && saved !== 'login' && saved !== 'register') {
          return saved;
        }
        return (u.role === 'admin' || u.email === 'admin@willow.com') ? 'admin' : 'dashboard';
      }
      if (saved && (saved === 'login' || saved === 'register' || saved === 'home')) {
        return saved;
      }
    } catch {}
    return 'home';
  });

  const [justRegisteredMsg, setJustRegisteredMsg] = useState<string | null>(null);

  const setCurrentView = (view: string) => {
    setCurrentViewState(view);
    try {
      localStorage.setItem('willow_current_view', view);
    } catch {}
  };

  // Synchronize view when authentication status changes
  useEffect(() => {
    if (!isAuthenticated) {
      if (currentView === 'dashboard' || currentView === 'admin') {
        setCurrentViewState('home');
        try { localStorage.setItem('willow_current_view', 'home'); } catch {}
      }
    } else {
      // If logged in and on an unauthenticated view like home, auto-navigate to the right dashboard
      if (currentView === 'home' || currentView === 'login' || currentView === 'register') {
        const defaultView = (user?.role === 'admin' || user?.email === 'admin@willow.com') ? 'admin' : 'dashboard';
        const saved = localStorage.getItem('willow_current_view');
        const target = (saved && saved !== 'home' && saved !== 'login' && saved !== 'register') ? saved : defaultView;
        setCurrentViewState(target);
        try { localStorage.setItem('willow_current_view', target); } catch {}
      }
    }
  }, [isAuthenticated, user?.role, user?.email]);

  const handleRegisterSuccess = () => {
    setJustRegisteredMsg('🎉 Fan Account verified successfully! Please log in to access the stadium drop portal.');
    setCurrentView('login');
  };

  const handleLoginSuccess = (role: 'fan' | 'admin') => {
    setJustRegisteredMsg(null);
    if (role === 'admin') {
      setCurrentView('admin');
    } else {
      setCurrentView('dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-willow-900 text-slate-100 flex flex-col justify-between selection:bg-willow-emerald selection:text-black font-sans">
      
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        onNavigateToLogin={() => {
          setJustRegisteredMsg(null);
          setCurrentView('login');
        }}
        onNavigateToRegister={() => setCurrentView('register')}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {currentView === 'home' && (
          <PublicHomePage
            onNavigateToRegister={() => setCurrentView('register')}
            onNavigateToLogin={() => {
              setJustRegisteredMsg(null);
              setCurrentView('login');
            }}
          />
        )}

        {currentView === 'register' && (
          <RegisterPage
            onRegisterSuccess={handleRegisterSuccess}
            onNavigateToLogin={() => {
              setJustRegisteredMsg(null);
              setCurrentView('login');
            }}
          />
        )}

        {currentView === 'login' && (
          <LoginPage
            onLoginSuccess={handleLoginSuccess}
            onNavigateToRegister={() => setCurrentView('register')}
            justRegisteredMessage={justRegisteredMsg}
          />
        )}

        {currentView === 'dashboard' && <FanDashboard />}

        {currentView === 'admin' && <AdminPage />}
      </main>

      <footer className="w-full border-t border-slate-800/80 bg-willow-900/95 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-base">🏏</span>
            <span className="font-bold text-slate-300">Willow</span>
            <span>— From the Willow to the Stadium Gate.</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>1 User = 4 Tickets Cap</span>
            <span>•</span>
            <span>3-Min Concurrency Lock</span>
            <span>•</span>
            <span>Rolling Dynamic Barcode Pass</span>
          </div>
        </div>
      </footer>

      {lockExpiredModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-md glass-modal rounded-3xl p-6 sm:p-8 border border-red-500/50 shadow-2xl text-center space-y-4 animate-in zoom-in">
            <div className="w-14 h-14 rounded-2xl bg-red-500/20 border border-red-500/40 text-red-400 mx-auto flex items-center justify-center text-2xl shadow-glow-gold">
              <Clock className="w-7 h-7 animate-pulse" />
            </div>
            <h3 className="text-xl font-black text-white">3-Minute Seat Lock Expired</h3>
            <p className="text-xs text-slate-300">
              To prevent hoarding, your held seats have been automatically returned to the public stadium pool for other waiting fans.
            </p>
            <button
              onClick={() => {
                closeLockExpiredModal();
                setCurrentView('dashboard');
              }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-willow-emerald to-teal-400 text-black font-black text-xs shadow-glow-emerald hover:brightness-110"
            >
              Return to Match Fixtures
            </button>
          </div>
        </div>
      )}

      {duplicateSessionAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-md glass-modal rounded-3xl p-6 sm:p-8 border border-amber-500/50 shadow-2xl text-center space-y-4 animate-in zoom-in">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 mx-auto flex items-center justify-center text-2xl">
              <Smartphone className="w-7 h-7 animate-bounce" />
            </div>
            <h3 className="text-xl font-black text-white">Session Active on Another Device</h3>
            <p className="text-xs text-slate-300">
              Security Notice: Willow strictly permits <strong>1 active device session per fan identity</strong>. Your account was signed in from another device or browser.
            </p>
            <button
              onClick={() => {
                clearDuplicateAlert();
                setCurrentView('login');
              }}
              className="w-full py-3 rounded-xl bg-willow-emerald text-black font-black text-xs shadow-glow-emerald cursor-pointer"
            >
              Acknowledge & Sign In Again
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <BookingProvider>
        <MainApp />
      </BookingProvider>
    </AuthProvider>
  );
}

export default App;
