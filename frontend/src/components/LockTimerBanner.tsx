import React from 'react';
import { useBooking } from '../context/BookingContext';
import { Timer, ShieldAlert, Sparkles } from 'lucide-react';

export const LockTimerBanner: React.FC = () => {
  const { lockTimeRemaining, isLockActive, selectedSeats } = useBooking();

  if (!isLockActive || selectedSeats.length === 0) return null;

  const minutes = Math.floor(lockTimeRemaining / 60);
  const seconds = lockTimeRemaining % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  
  const percent = (lockTimeRemaining / 180) * 100;
  const isUrgent = lockTimeRemaining < 45;

  return (
    <div className="sticky top-20 z-30 w-full bg-willow-900/95 border-b border-willow-emerald/30 shadow-2xl backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 py-2.5 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl border flex items-center justify-center ${
              isUrgent 
                ? 'bg-red-500/20 border-red-500/50 text-red-400 animate-pulse-fast' 
                : 'bg-willow-emerald/20 border-willow-emerald/50 text-willow-emerald'
            }`}>
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-white">
                  3-Minute Distributed Seat Lock Active
                </span>
                <span className="px-2 py-0.5 rounded-full bg-willow-emerald/20 text-willow-neon text-[10px] font-bold border border-willow-emerald/40 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> {selectedSeats.length} / 4 Seats Locked
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Seats are held in high-concurrency memory pool. Checkout before time expires to prevent release.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 px-4 py-1.5 rounded-xl border font-mono font-black text-lg sm:text-xl shadow-lg transition-all ${
              isUrgent
                ? 'bg-red-950/80 border-red-500 text-red-400 shadow-red-500/30 animate-pulse'
                : 'bg-willow-800/90 border-willow-emerald text-willow-neon shadow-glow-emerald'
            }`}>
              <Timer className="w-5 h-5 animate-spin-slow" />
              <span>{formattedTime}</span>
            </div>
          </div>

        </div>

        <div className="w-full bg-slate-800/60 h-1.5 rounded-full mt-2.5 overflow-hidden">
          <div 
            className={`h-full transition-all duration-1000 ease-linear rounded-full ${
              isUrgent ? 'bg-gradient-to-r from-red-600 to-amber-500' : 'bg-gradient-to-r from-willow-emerald to-willow-neon'
            }`}
            style={{ width: `${percent}%` }}
          />
        </div>

      </div>
    </div>
  );
};
