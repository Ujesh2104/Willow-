import React, { useState, useEffect } from 'react';
import { Booking } from '../types';
import { useBooking } from '../context/BookingContext';
import { ShieldCheck, QrCode, Lock, Clock, MapPin, Sparkles, CheckCircle2 } from 'lucide-react';

interface DynamicTicketPassProps {
  booking: Booking;
}

export const DynamicTicketPass: React.FC<DynamicTicketPassProps> = ({ booking }) => {
  const { currentRollingHash } = useBooking();
  const [secondsRemaining, setSecondsRemaining] = useState<number>(30);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => (prev <= 1 ? 30 : prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-md mx-auto glass-modal rounded-3xl overflow-hidden border border-willow-emerald/40 shadow-glow-emerald text-white">
      
      <div className="bg-gradient-to-r from-willow-850 via-willow-800 to-willow-850 p-6 border-b border-willow-emerald/20 text-center relative">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-willow-emerald/10 border border-willow-emerald/30 text-willow-emerald text-[11px] font-bold uppercase tracking-wider mb-2">
          <ShieldCheck className="w-3.5 h-3.5" /> Official Willow Match Pass
        </div>
        <h3 className="text-lg font-black tracking-tight">{booking.matchTitle}</h3>
        <p className="text-xs text-slate-400 mt-1 flex items-center justify-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-willow-emerald" /> {booking.venue}
        </p>
      </div>

      <div className="p-6 space-y-6">
        
        <div className="grid grid-cols-3 gap-2 text-center bg-willow-900/90 rounded-2xl p-3 border border-slate-800">
          <div className="border-r border-slate-800 pr-2">
            <p className="text-[10px] uppercase font-bold text-slate-400">Entry Gate</p>
            <p className="text-xs font-black text-willow-gold font-mono truncate">{booking.gateDetails.gateNumber.split(' ')[0]} {booking.gateDetails.gateNumber.split(' ')[1]}</p>
          </div>
          <div className="border-r border-slate-800 px-2">
            <p className="text-[10px] uppercase font-bold text-slate-400">Turnstile</p>
            <p className="text-xs font-black text-white font-mono">{booking.gateDetails.turnstile}</p>
          </div>
          <div className="pl-2">
            <p className="text-[10px] uppercase font-bold text-slate-400">Time</p>
            <p className="text-xs font-black text-willow-emerald font-mono">05:30 PM</p>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Assigned Seats ({booking.seats.length} Tickets)
          </p>
          <div className="grid grid-cols-2 gap-2">
            {booking.seats.map((seat, idx) => (
              <div key={idx} className="p-2.5 rounded-xl bg-willow-800/60 border border-slate-700/60 text-xs">
                <p className="font-bold text-white">{seat.standName}</p>
                <p className="text-willow-neon font-mono text-[11px] mt-0.5">
                  {seat.bayNumber} • Row {seat.row} • Seat #{seat.number}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-black/60 border border-willow-emerald/30 text-center relative overflow-hidden">
          
          {booking.isPassUnlocked ? (
            <div className="space-y-4">
              
              <div className="relative w-48 h-48 mx-auto bg-white p-3 rounded-2xl shadow-glow-neon flex items-center justify-center">
                
                <div className="w-full h-full bg-slate-950 rounded-xl p-3 flex flex-col items-center justify-between">
                  <div className="w-full flex justify-between">
                    <div className="w-8 h-8 bg-black border-4 border-willow-emerald rounded-md"></div>
                    <div className="w-8 h-8 bg-black border-4 border-willow-emerald rounded-md"></div>
                  </div>
                  <div className="my-auto text-center">
                    <span className="text-3xl">🏏</span>
                    <p className="text-[8px] font-mono text-willow-neon tracking-widest mt-1">ROLLING-PASS</p>
                  </div>
                  <div className="w-full flex justify-between">
                    <div className="w-8 h-8 bg-black border-4 border-willow-emerald rounded-md"></div>
                    <div className="w-4 h-4 bg-willow-gold rounded-sm"></div>
                  </div>
                </div>

                <div className="absolute inset-x-2 h-1 bg-gradient-to-r from-transparent via-willow-neon to-transparent animate-pulse-fast shadow-glow-neon"></div>
              </div>

              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-willow-emerald/20 text-willow-neon font-mono text-xs font-bold border border-willow-emerald/40">
                  <Clock className="w-3.5 h-3.5 animate-spin-slow" />
                  <span>Rolling Token: {currentRollingHash}</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1.5">
                  Regenerates every 30s ({secondsRemaining}s left) • Screenshots will be rejected at the turnstile.
                </p>
              </div>

            </div>
          ) : (
            <div className="py-6 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 mx-auto flex items-center justify-center">
                <Lock className="w-7 h-7" />
              </div>
              <h4 className="text-sm font-bold text-white">Dynamic QR Pass Locked</h4>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                To prevent black-market ticket hoarding & static image reselling, your scannable rolling QR will automatically unlock exactly <span className="text-white font-bold">1 hour before the match gate opens</span>.
              </p>
            </div>
          )}

        </div>

        <div className="border-t border-slate-800 pt-4 text-xs text-slate-400">
          <p className="font-bold text-slate-300 uppercase text-[10px] tracking-wider mb-1.5">Ticket Bearers:</p>
          <div className="space-y-1">
            {booking.fans.map((fan, i) => (
              <div key={i} className="flex justify-between items-center text-[11px]">
                <span className="text-slate-300 font-medium">Fan {i + 1}: {fan.name}</span>
                <span className="text-slate-500 font-mono">{fan.idType} ({fan.idNumber})</span>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center pt-2">
          <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${
            booking.status === 'ATTENDED'
              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
              : 'bg-willow-emerald/20 text-willow-neon border border-willow-emerald/40'
          }`}>
            <CheckCircle2 className="w-4 h-4" /> Status: {booking.status}
          </span>
        </div>

      </div>

    </div>
  );
};
