import React, { useState, useEffect, useMemo } from 'react';
import { Booking } from '../types';
import { useBooking } from '../context/BookingContext';
import { ShieldCheck, Lock, Clock, MapPin, CheckCircle2, Barcode, QrCode } from 'lucide-react';

interface DynamicTicketPassProps {
  booking: Booking;
}

const BarcodeDisplay: React.FC<{ token: string }> = ({ token }) => {
  const bars = useMemo(() => {
    const list: { width: number; isSpace: boolean }[] = [];
    list.push({ width: 3, isSpace: false }, { width: 1, isSpace: true }, { width: 2, isSpace: false }, { width: 2, isSpace: true });
    
    for (let i = 0; i < token.length; i++) {
      const code = token.charCodeAt(i);
      const b1 = (code % 3) + 1;
      const b2 = ((code >> 1) % 3) + 1;
      const b3 = ((code >> 2) % 3) + 1;
      const b4 = ((code >> 3) % 2) + 1;
      list.push({ width: b1, isSpace: false });
      list.push({ width: b2, isSpace: true });
      list.push({ width: b3, isSpace: false });
      list.push({ width: b4, isSpace: true });
    }
    
    list.push({ width: 2, isSpace: false }, { width: 2, isSpace: true }, { width: 3, isSpace: false });
    return list;
  }, [token]);

  return (
    <div className="bg-white p-4 rounded-2xl shadow-glow-emerald relative overflow-hidden flex flex-col items-center justify-center space-y-2">
      <div className="w-full flex items-center justify-center overflow-hidden py-1">
        <svg className="w-full h-20 max-h-24" viewBox="0 0 340 70" preserveAspectRatio="none">
          {(() => {
            let posX = 12;
            return bars.map((bar, index) => {
              const currentX = posX;
              posX += bar.width * 2.1;
              if (bar.isSpace) return null;
              return <rect key={index} x={currentX} y="4" width={bar.width * 1.8} height="62" fill="#030706" rx="0.5" />;
            });
          })()}
        </svg>
      </div>
      
      <div className="font-mono text-xs sm:text-sm font-black tracking-widest text-slate-900 border-t border-slate-200 pt-1 w-full text-center">
        ||| {token} |||
      </div>

      <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent animate-pulse shadow-glow-emerald top-1/2 -translate-y-1/2"></div>
    </div>
  );
};

const QRCodeDisplay: React.FC<{ token: string }> = ({ token }) => {
  const grid = useMemo(() => {
    const size = 15;
    const matrix: boolean[][] = Array(size).fill(false).map(() => Array(size).fill(false));
    
    const setCorner = (r: number, c: number) => {
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          if (i === 0 || i === 3 || j === 0 || j === 3) {
            matrix[r + i][c + j] = true;
          } else if (i === 1 && j === 1) {
            matrix[r + i][c + j] = false;
          } else {
            matrix[r + i][c + j] = true;
          }
        }
      }
    };

    setCorner(0, 0);
    setCorner(0, size - 4);
    setCorner(size - 4, 0);

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if ((r < 4 && c < 4) || (r < 4 && c >= size - 4) || (r >= size - 4 && c < 4)) continue;
        const hash = (token.charCodeAt((r * size + c) % token.length) + r * 7 + c * 11) % 5;
        matrix[r][c] = hash <= 2;
      }
    }
    return matrix;
  }, [token]);

  return (
    <div className="bg-white p-4 rounded-2xl shadow-glow-emerald relative overflow-hidden flex flex-col items-center justify-center space-y-2">
      <div className="p-2 bg-white rounded-xl">
        <div className="grid grid-cols-15 gap-0.5 w-40 h-40">
          {grid.map((row, r) =>
            row.map((cell, c) => (
              <div
                key={`${r}-${c}`}
                className={`${cell ? 'bg-slate-950' : 'bg-transparent'} rounded-[1px]`}
              />
            ))
          )}
        </div>
      </div>

      <div className="font-mono text-[11px] font-bold text-slate-800 tracking-wider">
        {token}
      </div>

      <div className="absolute inset-x-2 h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent animate-pulse shadow-glow-emerald top-1/2 -translate-y-1/2"></div>
    </div>
  );
};

export const DynamicTicketPass: React.FC<DynamicTicketPassProps> = ({ booking }) => {
  const { currentRollingHash } = useBooking();
  const [secondsRemaining, setSecondsRemaining] = useState<number>(30);
  const [passViewMode, setPassViewMode] = useState<'barcode' | 'qr'>('barcode');

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
              
              <div className="flex items-center justify-center gap-2 p-1 rounded-xl bg-willow-850 max-w-[220px] mx-auto border border-slate-700">
                <button
                  onClick={() => setPassViewMode('barcode')}
                  className={`flex-1 py-1 px-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    passViewMode === 'barcode'
                      ? 'bg-willow-emerald text-black shadow-glow-emerald font-black'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Barcode className="w-3.5 h-3.5" />
                  <span>Bar Code</span>
                </button>
                <button
                  onClick={() => setPassViewMode('qr')}
                  className={`flex-1 py-1 px-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    passViewMode === 'qr'
                      ? 'bg-willow-emerald text-black shadow-glow-emerald font-black'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>QR Code</span>
                </button>
              </div>

              {passViewMode === 'barcode' ? (
                <BarcodeDisplay token={tokenToDisplay} />
              ) : (
                <QRCodeDisplay token={tokenToDisplay} />
              )}

              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-willow-emerald/20 text-willow-neon font-mono text-xs font-bold border border-willow-emerald/40">
                  <Clock className="w-3.5 h-3.5 animate-spin-slow" />
                  <span>Rolling Token: {tokenToDisplay}</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1.5">
                  Regenerates every 30s ({secondsRemaining}s left) • Official turnstile gate verification.
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

