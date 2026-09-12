import React, { useState, useEffect } from 'react';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import { QueuePage } from './QueuePage';
import { StadiumPage } from './StadiumPage';
import { CheckoutPage } from './CheckoutPage';
import { PassVaultPage } from './PassVaultPage';
import { ProfilePage } from './ProfilePage';
import { GatekeeperPage } from './GatekeeperPage';
import {
  Ticket,
  Clock,
  MapPin,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  ScanLine,
  ChevronRight,
  Inbox
} from 'lucide-react';

export const FanDashboard: React.FC = () => {
  const { matches, activeMatch, setActiveMatchById, selectedSeats, bookings } = useBooking();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<'matches' | 'queue' | 'stadium' | 'checkout' | 'passes' | 'profile' | 'scanner'>('matches');

  const [countdown, setCountdown] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 1,
    minutes: 38,
    seconds: 44
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 0, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const heroMatch = activeMatch || (matches && matches.length > 0 ? matches[0] : null);

  const handleEnterDrop = (matchId: string) => {
    setActiveMatchById(matchId);
    setActiveTab('queue');
  };

  return (
    <div className="space-y-5 pb-16 sm:pb-20 text-white">
      
      <div className="w-full bg-willow-850/90 rounded-2xl border border-slate-800 p-3 sm:p-4 shadow-xl flex flex-col md:flex-row items-center justify-between gap-3">
        
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto w-full md:w-auto py-1 scrollbar-none">
          {[
            { id: 'matches', step: '1', label: 'Match Fixtures', icon: '🏏' },
            { id: 'queue', step: '2', label: 'Waiting Room', icon: '⏳' },
            { id: 'stadium', step: '3', label: 'Stand & Seats', icon: '🏟️' },
            { id: 'checkout', step: '4', label: 'Checkout & Pay', icon: '💳' },
            { id: 'passes', step: '5', label: 'Pass Vault', icon: '🎟️' }
          ].map((tab, idx, arr) => {
            const isActive = activeTab === tab.id;
            return (
              <React.Fragment key={tab.id}>
                <button
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    isActive
                      ? 'bg-willow-emerald text-black shadow-glow-emerald font-black scale-105'
                      : 'bg-willow-900 text-slate-300 border border-slate-800 hover:border-slate-600 hover:text-white'
                  }`}
                >
                  <span className="text-sm">{tab.icon}</span>
                  <span>{tab.step}. {tab.label}</span>
                </button>
                {idx < arr.length - 1 && <ChevronRight className="w-3 h-3 text-slate-600 shrink-0 hidden sm:inline" />}
              </React.Fragment>
            );
          })}
        </div>

        <div className="flex items-center justify-end gap-2 w-full md:w-auto shrink-0">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
              activeTab === 'profile'
                ? 'bg-willow-emerald/20 border-willow-emerald text-white'
                : 'bg-willow-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 text-willow-emerald" />
            <span>Master Fan List</span>
          </button>

          <button
            onClick={() => setActiveTab('scanner')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
              activeTab === 'scanner'
                ? 'bg-willow-gold/20 border-willow-gold text-white shadow-glow-gold'
                : 'bg-willow-900 border-slate-800 text-slate-400 hover:text-willow-gold'
            }`}
          >
            <ScanLine className="w-3.5 h-3.5 text-willow-gold" />
            <span>Scanner</span>
          </button>
        </div>

      </div>

      {activeTab === 'matches' && (
        <div className="space-y-6">
          
          {!matches || matches.length === 0 ? (
            <div className="glass-panel rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-center space-y-4 border border-slate-800 max-w-lg mx-auto my-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-willow-850 border border-slate-700 text-slate-400 mx-auto flex items-center justify-center">
                <Inbox className="w-6 h-6 sm:w-8 sm:h-8 text-slate-500" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white">No Active Cricket Matches Scheduled Yet</h3>
              <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
                Matches and stadium wing allocations will appear here in real-time as soon as the administrator publishes fixtures from the Admin Panel.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              
              {heroMatch && (
                <div className="glass-panel rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-willow-emerald/30 shadow-2xl relative overflow-hidden">
                  
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                    
                    <div className="lg:col-span-7 space-y-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-willow-emerald/20 text-willow-neon text-[10px] sm:text-xs font-bold border border-willow-emerald/40 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-willow-neon animate-ping"></span>
                          FEATURED MATCH
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-willow-800 text-slate-300 text-[10px] sm:text-xs font-medium border border-slate-700">
                          {heroMatch.tournament}
                        </span>
                      </div>

                      <div>
                        <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight leading-snug">
                          {heroMatch.title}
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-400 mt-1 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-willow-emerald" /> {heroMatch.venue}, {heroMatch.city}
                        </p>
                      </div>

                      <div className="p-3.5 sm:p-4 rounded-2xl bg-willow-850/80 border border-willow-emerald/40 shadow-inner space-y-2.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-300">
                            <Clock className="w-3.5 h-3.5 text-willow-emerald animate-pulse" />
                            <span>Booking Window (9:00 PM Cutoff)</span>
                          </div>
                          <span className="text-[10px] text-willow-emerald font-mono font-bold">Phase 1</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="px-3 py-1.5 rounded-xl bg-black/60 border border-slate-700 text-center min-w-[50px] sm:min-w-[65px]">
                            <span className="text-lg sm:text-2xl font-black text-white font-mono">{String(countdown.hours).padStart(2, '0')}</span>
                            <p className="text-[8px] sm:text-[9px] uppercase tracking-widest text-slate-500 font-bold">Hrs</p>
                          </div>
                          <span className="text-lg sm:text-xl font-black text-willow-emerald">:</span>
                          <div className="px-3 py-1.5 rounded-xl bg-black/60 border border-slate-700 text-center min-w-[50px] sm:min-w-[65px]">
                            <span className="text-lg sm:text-2xl font-black text-white font-mono">{String(countdown.minutes).padStart(2, '0')}</span>
                            <p className="text-[8px] sm:text-[9px] uppercase tracking-widest text-slate-500 font-bold">Min</p>
                          </div>
                          <span className="text-lg sm:text-xl font-black text-willow-emerald">:</span>
                          <div className="px-3 py-1.5 rounded-xl bg-black/60 border border-slate-700 text-center min-w-[50px] sm:min-w-[65px]">
                            <span className="text-lg sm:text-2xl font-black text-willow-neon font-mono">{String(countdown.seconds).padStart(2, '0')}</span>
                            <p className="text-[8px] sm:text-[9px] uppercase tracking-widest text-slate-500 font-bold">Sec</p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2.5 pt-0.5">
                        <div className="p-2.5 rounded-xl bg-willow-800/60 border border-slate-700/60">
                          <div className="flex justify-between items-center text-[11px] mb-1">
                            <span className="text-slate-400 font-medium">Pavilion VIP:</span>
                            <span className="text-willow-emerald font-bold font-mono">Fast Filling</span>
                          </div>
                          <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-willow-emerald h-full w-[35%] rounded-full"></div>
                          </div>
                        </div>

                        <div className="p-2.5 rounded-xl bg-willow-800/60 border border-slate-700/60">
                          <div className="flex justify-between items-center text-[11px] mb-1">
                            <span className="text-slate-400 font-medium">North Stand:</span>
                            <span className="text-amber-400 font-bold font-mono">16 Seats</span>
                          </div>
                          <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-amber-400 h-full w-[75%] rounded-full"></div>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleEnterDrop(heroMatch.id)}
                        className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-willow-emerald via-emerald-500 to-teal-400 text-black font-black text-xs sm:text-sm shadow-glow-emerald hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Ticket className="w-4 h-4" />
                        <span>👉 SELECT SEATS & BOOK TICKETS</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>

                    </div>

                    <div className="lg:col-span-5 space-y-3">
                      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-willow-800 via-willow-850 to-willow-900 border border-willow-emerald/40 shadow-xl space-y-2.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">🎫</span>
                          <h4 className="text-xs sm:text-sm font-black text-white uppercase tracking-wider">Booking Guidelines</h4>
                        </div>
                        <div className="space-y-1.5 text-xs text-slate-300">
                          <p>• Max 4 tickets per user allocation.</p>
                          <p>• 3-Minute checkout reservation window.</p>
                          <p>• 1 Device session per verified account.</p>
                          <p>• Dynamic digital pass generated in Pass Vault.</p>
                        </div>
                      </div>
                    </div>

                  </div>

                </div>
              )}

              {matches.length > 1 && (
                <div className="space-y-3">
                  <h3 className="text-base sm:text-lg font-black text-white">Other Available Matches</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {matches.slice(1).map((m) => (
                      <div key={m.id} className="glass-panel rounded-2xl p-4 sm:p-5 border border-slate-800 hover:border-willow-emerald/40 transition-all flex flex-col justify-between space-y-3">
                        <div>
                          <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-willow-emerald/20 text-willow-neon">
                            Active Fixture
                          </span>
                          <h4 className="text-sm sm:text-base font-bold text-white mt-1">{m.title}</h4>
                          <p className="text-xs text-slate-400">{m.venue}, {m.city}</p>
                        </div>

                        <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
                          <span className="text-xs text-willow-neon font-mono font-bold">{m.remainingInventory} Seats Left</span>
                          <button
                            onClick={() => handleEnterDrop(m.id)}
                            className="px-3.5 py-1.5 rounded-xl bg-willow-emerald text-black text-xs font-black hover:brightness-110 cursor-pointer"
                          >
                            👉 Select Seats
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

        </div>
      )}

      {activeTab === 'queue' && (
        <QueuePage
          onTurnReady={() => setActiveTab('stadium')}
          onCancelQueue={() => setActiveTab('matches')}
        />
      )}

      {activeTab === 'stadium' && (
        <StadiumPage
          onProceedToCheckout={() => setActiveTab('checkout')}
          onBackToHome={() => setActiveTab('matches')}
        />
      )}

      {activeTab === 'checkout' && (
        <CheckoutPage
          onPaymentSuccess={() => setActiveTab('passes')}
          onBackToStadium={() => setActiveTab('stadium')}
        />
      )}

      {activeTab === 'passes' && (
        <PassVaultPage onBackToHome={() => setActiveTab('matches')} />
      )}

      {activeTab === 'profile' && <ProfilePage />}

      {activeTab === 'scanner' && (
        <GatekeeperPage onBackToHome={() => setActiveTab('matches')} />
      )}

    </div>
  );
};
