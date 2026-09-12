import React, { useEffect } from 'react';
import { useBooking } from '../context/BookingContext';
import { ShieldCheck, Users, Clock, Sparkles, ArrowRight } from 'lucide-react';

interface QueuePageProps {
  onTurnReady: () => void;
  onCancelQueue: () => void;
}

export const QueuePage: React.FC<QueuePageProps> = ({ onTurnReady, onCancelQueue }) => {
  const { queueState, activeMatch } = useBooking();

  useEffect(() => {
    if (queueState.isTurnReady) {
      onTurnReady();
    }
  }, [queueState.isTurnReady, onTurnReady]);

  if (!activeMatch) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 text-center text-white space-y-8">
      
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-willow-emerald/20 text-willow-neon text-xs font-bold border border-willow-emerald/40 shadow-glow-emerald">
          <Sparkles className="w-3.5 h-3.5" /> High-Concurrency Virtual Waiting Room
        </div>
        <h2 className="text-3xl font-black tracking-tight">{activeMatch.title}</h2>
        <p className="text-xs text-slate-400">
          Controlled Ingestion: Fans are admitted in fair sequential batches to prevent server overload.
        </p>
      </div>

      <div className="glass-panel rounded-3xl p-8 border border-willow-emerald/40 shadow-2xl space-y-6 relative overflow-hidden">
        
        <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-willow-emerald/20 animate-ping"></div>
          <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-willow-emerald to-emerald-400 p-1 shadow-glow-emerald flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-willow-900 flex flex-col items-center justify-center">
              <span className="text-3xl">🏏</span>
              <p className="text-[10px] font-mono uppercase text-willow-emerald font-bold mt-1">IN LINE</p>
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-xs text-slate-400 uppercase font-bold tracking-widest">Your Position In Queue</p>
          <div className="text-5xl font-black text-willow-neon font-mono">
            #{queueState.position}
          </div>
          <p className="text-xs text-slate-400">
            {queueState.position === 1 ? '🎉 You are next! Entering stadium...' : `Ahead of you: ${queueState.position - 1} fans`}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-800 text-left">
          <div className="p-3 rounded-xl bg-willow-850/80 border border-slate-700/60">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
              <Clock className="w-3.5 h-3.5 text-willow-emerald" />
              <span>Est. Wait Time:</span>
            </div>
            <p className="text-base font-black text-white font-mono">
              ~{queueState.estimatedSeconds} Seconds
            </p>
          </div>

          <div className="p-3 rounded-xl bg-willow-850/80 border border-slate-700/60">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
              <Users className="w-3.5 h-3.5 text-willow-emerald" />
              <span>Batch Ingestion:</span>
            </div>
            <p className="text-base font-black text-willow-emerald font-mono">
              50 Fans / Batch
            </p>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-willow-900/90 border border-slate-800 text-left text-[11px] text-slate-400 space-y-1">
          <p className="text-white font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-willow-emerald" /> Fair Queue Protection
          </p>
          <p>• Do not refresh or open multiple tabs; your place is securely preserved.</p>
          <p>• Once admitted, your 3-minute seat selection timer will start immediately.</p>
        </div>

        <div className="pt-2 flex justify-between items-center text-xs">
          <button
            onClick={onCancelQueue}
            className="text-slate-500 hover:text-slate-300 transition-colors"
          >
            Leave Queue
          </button>

          <button
            onClick={onTurnReady}
            className="px-3 py-1.5 rounded-lg bg-willow-emerald/20 text-willow-neon hover:bg-willow-emerald hover:text-black font-bold border border-willow-emerald/40 transition-all flex items-center gap-1"
          >
            <span>Skip Wait (Demo Mode)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

    </div>
  );
};
