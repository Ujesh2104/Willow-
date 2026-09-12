import React, { useState, useEffect } from 'react';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Ticket, Users, Sparkles, MapPin, ArrowRight, Flame, Clock, Loader2 } from 'lucide-react';

interface HomePageProps {
  onEnterDrop: (matchId: string) => void;
  openAuthModal: () => void;
  onViewStands: (matchId: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onEnterDrop, openAuthModal, onViewStands }) => {
  const { matches, activeMatch, setActiveMatchById } = useBooking();
  const { isAuthenticated } = useAuth();

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

  const handleHeroDropClick = () => {
    if (!heroMatch) return;
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }
    onEnterDrop(heroMatch.id);
  };

  if (!heroMatch) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 text-center">
        <Loader2 className="w-10 h-10 text-willow-emerald animate-spin" />
        <p className="text-sm font-mono text-slate-400">Loading Live Cricket Match Drops from Backend...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20">
      
      <div className="relative pt-4 pb-2 text-center max-w-4xl mx-auto px-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-willow-800/80 border border-willow-emerald/30 text-xs font-bold text-willow-neon shadow-glow-emerald mb-3">
          <Sparkles className="w-3.5 h-3.5" /> Official Cricket Stadium Ticket Portal
        </div>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
          From the <span className="bg-gradient-to-r from-willow-emerald via-emerald-400 to-willow-neon bg-clip-text text-transparent">Willow</span> to the Stadium Gate.
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl mx-auto font-medium">
          Every Ball. Every Boundary. Live from the Stands. Book your verified stadium seats and experience the matchday passion.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-willow-emerald/30 shadow-2xl relative overflow-hidden">
          
          <div className="absolute top-0 right-0 w-96 h-96 bg-willow-emerald/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-willow-gold/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            <div className="lg:col-span-7 space-y-5">
              
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="px-3 py-1 rounded-full bg-willow-emerald/20 text-willow-neon text-xs font-bold border border-willow-emerald/40 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-willow-neon animate-ping"></span>
                  HIGH-STAKES BLOCKBUSTER
                </span>
                <span className="px-3 py-1 rounded-full bg-willow-800 text-slate-300 text-xs font-medium border border-slate-700">
                  {heroMatch.tournament}
                </span>
              </div>

              <div>
                <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-snug">
                  {heroMatch.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1.5 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-willow-emerald" /> {heroMatch.venue}, {heroMatch.city}
                </p>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-willow-850/80 border border-willow-emerald/40 shadow-inner space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300">
                    <Clock className="w-4 h-4 text-willow-emerald animate-pulse" />
                    <span>Drop Window Closes (9:00 PM Sharp)</span>
                  </div>
                  <span className="text-[11px] text-willow-emerald font-mono font-bold">Phase 1 Active</span>
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="px-3 sm:px-4 py-2 rounded-xl bg-black/60 border border-slate-700 text-center min-w-[60px] sm:min-w-[70px]">
                    <span className="text-xl sm:text-3xl font-black text-white font-mono">{String(countdown.hours).padStart(2, '0')}</span>
                    <p className="text-[9px] uppercase tracking-widest text-slate-500 font-bold">Hours</p>
                  </div>
                  <span className="text-xl sm:text-2xl font-black text-willow-emerald">:</span>
                  <div className="px-3 sm:px-4 py-2 rounded-xl bg-black/60 border border-slate-700 text-center min-w-[60px] sm:min-w-[70px]">
                    <span className="text-xl sm:text-3xl font-black text-white font-mono">{String(countdown.minutes).padStart(2, '0')}</span>
                    <p className="text-[9px] uppercase tracking-widest text-slate-500 font-bold">Mins</p>
                  </div>
                  <span className="text-xl sm:text-2xl font-black text-willow-emerald">:</span>
                  <div className="px-3 sm:px-4 py-2 rounded-xl bg-black/60 border border-slate-700 text-center min-w-[60px] sm:min-w-[70px]">
                    <span className="text-xl sm:text-3xl font-black text-willow-neon font-mono">{String(countdown.seconds).padStart(2, '0')}</span>
                    <p className="text-[9px] uppercase tracking-widest text-slate-500 font-bold">Secs</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="p-3 rounded-xl bg-willow-800/60 border border-slate-700/60">
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="text-slate-400 font-medium">North Stand:</span>
                    <span className="text-willow-emerald font-bold font-mono">16 Left</span>
                  </div>
                  <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                    <div className="bg-willow-emerald h-full w-[40%] rounded-full"></div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-willow-800/60 border border-slate-700/60">
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="text-slate-400 font-medium">Pavilion VIP:</span>
                    <span className="text-amber-400 font-bold font-mono">Fast Filling</span>
                  </div>
                  <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-400 h-full w-[85%] rounded-full"></div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                <button
                  onClick={handleHeroDropClick}
                  className="flex-1 py-4 px-6 rounded-2xl bg-gradient-to-r from-willow-emerald via-emerald-500 to-teal-400 text-black font-black text-sm sm:text-base shadow-glow-emerald hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                  <Ticket className="w-5 h-5" />
                  <span>👉 1. ENTER TICKET DROP QUEUE</span>
                  <ArrowRight className="w-5 h-5" />
                </button>

                <button
                  onClick={() => onViewStands(heroMatch.id)}
                  className="py-4 px-6 rounded-2xl bg-willow-800/90 border border-slate-700 hover:border-willow-emerald text-white font-bold text-xs sm:text-sm transition-all"
                >
                  Explore Stands
                </button>
              </div>

            </div>

            <div className="lg:col-span-5 space-y-4">
              
              <div className="p-6 rounded-2xl bg-gradient-to-br from-willow-800 via-willow-850 to-willow-900 border border-willow-emerald/40 shadow-xl space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-willow-emerald/20 text-willow-neon flex items-center justify-center font-bold">
                    🛡️
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white uppercase tracking-wider">Willow Anti-Scalp Protocol</h4>
                    <p className="text-[11px] text-slate-400">Enforced on all matches</p>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-willow-emerald"></span>
                    <span><strong>1 User = Max 4 Tickets</strong> (Household Cap)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-willow-emerald"></span>
                    <span><strong>3-Minute Hard Lock</strong> on selected seats</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-willow-emerald"></span>
                    <span><strong>Single Active Session</strong> (Duplicate login revoked)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-willow-emerald"></span>
                    <span><strong>Rolling 30s QR Pass</strong> (Activates 1-Hour before match)</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-black/50 border border-slate-800 flex items-center justify-between text-center">
                <div className="flex-1">
                  <span className="text-3xl">{heroMatch.teams?.teamA?.flag || '🇮🇳'}</span>
                  <p className="text-xs font-black text-white mt-1">{heroMatch.teams?.teamA?.short || 'IND'}</p>
                </div>
                <div className="px-3 py-1 rounded-full bg-willow-800 text-willow-gold font-black font-mono text-xs border border-slate-700">
                  VS
                </div>
                <div className="flex-1">
                  <span className="text-3xl">{heroMatch.teams?.teamB?.flag || '🇦🇺'}</span>
                  <p className="text-xs font-black text-white mt-1">{heroMatch.teams?.teamB?.short || 'AUS'}</p>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>

      {matches.length > 1 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-black text-white">Upcoming Stadium Drops</h3>
              <p className="text-xs text-slate-400">All drops close strictly at 9:00 PM IST</p>
            </div>
            <span className="text-xs text-willow-emerald font-mono font-bold">
              {matches.length} Stadium Events Live
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {matches.slice(1).map((match) => (
              <div
                key={match.id}
                className="glass-panel rounded-2xl p-6 border border-slate-800 hover:border-willow-emerald/40 transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      match.isFlashPortal
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                        : 'bg-willow-emerald/20 text-willow-neon border border-willow-emerald/40'
                    }`}>
                      {match.isFlashPortal ? '⚡ Phase 2: Leftover Flash Portal' : '🟢 Live Drop (Closes 9:00 PM)'}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">{match.city}</span>
                  </div>

                  <h4 className="text-lg font-black text-white">{match.title}</h4>
                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-willow-emerald" /> {match.venue}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-bold">Seats Available</p>
                    <p className="text-sm font-black text-white font-mono">{match.remainingInventory} Seats</p>
                  </div>

                  <button
                    onClick={() => {
                      setActiveMatchById(match.id);
                      if (!isAuthenticated) openAuthModal();
                      else onEnterDrop(match.id);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-willow-800 hover:bg-willow-emerald hover:text-black text-slate-200 font-bold text-xs border border-slate-700 hover:border-willow-emerald transition-all"
                  >
                    {match.isFlashPortal ? 'Enter Flash Portal' : '👉 Join Drop Queue'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
