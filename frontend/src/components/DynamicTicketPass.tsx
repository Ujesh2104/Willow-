import React, { useState, useEffect, useMemo } from 'react';
import { Booking } from '../types';
import { useBooking } from '../context/BookingContext';
import { ShieldCheck, Lock, Clock, MapPin, CheckCircle2, Barcode } from 'lucide-react';

interface DynamicTicketPassProps {
  booking: Booking;
}

const BarcodeDisplay: React.FC<{ token: string }> = ({ token }) => {
  const bars = useMemo(() => {
    const list: { width: number; isBlack: boolean }[] = [];
    
    // Start Guard Bars
    list.push({ width: 3, isBlack: true }, { width: 2, isBlack: false }, { width: 2, isBlack: true }, { width: 2, isBlack: false });
    
    for (let i = 0; i < token.length; i++) {
      const code = token.charCodeAt(i);
      const b1 = (code % 3) + 1;
      const b2 = ((code >> 1) % 2) + 1;
      const b3 = ((code >> 2) % 3) + 1;
      const b4 = ((code >> 3) % 2) + 1;
      list.push({ width: b1, isBlack: true });
      list.push({ width: b2, isBlack: false });
      list.push({ width: b3, isBlack: true });
      list.push({ width: b4, isBlack: false });
    }
    
    // End Guard Bars
    list.push({ width: 2, isBlack: true }, { width: 2, isBlack: false }, { width: 3, isBlack: true }, { width: 2, isBlack: false }, { width: 2, isBlack: true });
    return list;
  }, [token]);

  return (
    <div className="bg-white p-5 rounded-2xl shadow-glow-emerald flex flex-col items-center justify-center space-y-3 relative overflow-hidden w-full border-2 border-slate-900">
      
      {/* Laser Scanning Beam Animation */}
      <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent animate-pulse shadow-glow-emerald top-1/2 -translate-y-1/2 pointer-events-none z-10"></div>

      {/* Solid Black Barcode Stripes */}
      <div className="flex items-stretch justify-center h-24 sm:h-28 w-full max-w-[340px] px-2 bg-white overflow-hidden">
        {bars.map((bar, idx) => (
          <div
            key={idx}
            style={{
              width: `${bar.width * 2.5}px`,
              backgroundColor: bar.isBlack ? '#000000' : '#FFFFFF',
              height: '100%'
            }}
            className="shrink-0"
          />
        ))}
      </div>

      {/* Human Readable Token Text */}
      <div className="font-mono text-xs sm:text-sm font-black tracking-widest text-black border-t-2 border-slate-900 pt-2 w-full text-center">
        * {token} *
      </div>
    </div>
  );
};

export const DynamicTicketPass: React.FC<DynamicTicketPassProps> = ({ booking }) => {
  const { currentRollingHash } = useBooking();
  const [secondsRemaining, setSecondsRemaining] = useState<number>(30);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => (prev <= 1 ? 30 : prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const tokenToDisplay = currentRollingHash || `WLW-${booking.id.slice(-6).toUpperCase()}-${Date.now().toString().slice(-6)}`;

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
            <p className="text-xs font-black text-willow-gold font-mono truncate">
              {booking.gateDetails?.gateNumber ? `${booking.gateDetails.gateNumber.split(' ')[0]} ${booking.gateDetails.gateNumber.split(' ')[1] || ''}` : 'Gate 04'}
            </p>
          </div>
          <div className="border-r border-slate-800 px-2">
            <p className="text-[10px] uppercase font-bold text-slate-400">Turnstile</p>
            <p className="text-xs font-black text-white font-mono">{booking.gateDetails?.turnstile || 'Turnstile #04'}</p>
          </div>
          <div className="pl-2">
            <p className="text-[10px] uppercase font-bold text-slate-400">Time</p>
            <p className="text-xs font-black text-willow-emerald font-mono">07:00 PM</p>
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

        <div className="p-5 sm:p-6 rounded-2xl bg-black/70 border border-willow-emerald/30 text-center relative overflow-hidden space-y-4">
          
          {booking.isPassUnlocked ? (
            <div className="space-y-4">
              
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-willow-800 text-xs font-bold text-slate-200 border border-slate-700">
                <Barcode className="w-4 h-4 text-willow-emerald" />
                <span>Official Scannable Barcode</span>
              </div>

              <BarcodeDisplay token={tokenToDisplay} />

              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-willow-emerald/20 text-willow-neon font-mono text-xs font-bold border border-willow-emerald/40">
                  <Clock className="w-3.5 h-3.5 animate-spin-slow" />
                  <span>Rolling Token: {tokenToDisplay}</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1.5">
                  Regenerates every 30s ({secondsRemaining}s left) • Official turnstile gate barcode verification.
                </p>
              </div>

            </div>
          ) : (
            <div className="py-6 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 mx-auto flex items-center justify-center">
                <Lock className="w-7 h-7" />
              </div>
              <h4 className="text-sm font-bold text-white">Dynamic Barcode Locked</h4>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Your scannable rolling barcode will automatically unlock <span className="text-white font-bold">1 hour before match gate opening</span>.
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

