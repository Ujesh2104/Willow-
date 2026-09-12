import React, { useState } from 'react';
import { useBooking } from '../context/BookingContext';
import { Scan, CheckCircle2, XCircle, ArrowLeft } from 'lucide-react';

interface GatekeeperPageProps {
  onBackToHome: () => void;
}

export const GatekeeperPage: React.FC<GatekeeperPageProps> = ({ onBackToHome }) => {
  const { validateTicketQR, bookings } = useBooking();
  const [tokenInput, setTokenInput] = useState('');
  const [lastScanResult, setLastScanResult] = useState<{ valid: boolean; booking?: any; message: string } | null>(null);
  const [totalScannedCount, setTotalScannedCount] = useState<number>(1);
  const [duplicateAttempts, setDuplicateAttempts] = useState<number>(0);

  const handleScan = async (tokenToScan?: string) => {
    const token = tokenToScan || tokenInput;
    if (!token) return;

    const result = await validateTicketQR(token);
    setLastScanResult(result);

    if (result.valid) {
      setTotalScannedCount((prev) => prev + 1);
    } else if (result.message && result.message.includes('DUPLICATE')) {
      setDuplicateAttempts((prev) => prev + 1);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 pb-20 text-white">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToHome}
            className="p-2 rounded-xl bg-willow-800/80 border border-slate-700 text-slate-300 hover:text-white transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-2xl font-black">Gatekeeper Turnstile Terminal</h2>
            <p className="text-xs text-slate-400">
              Official Stadium Turnstile Scanner & Anti-Black-Market Verification
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-willow-gold/20 text-willow-gold text-xs font-bold border border-willow-gold/40 font-mono">
          <Scan className="w-3.5 h-3.5 animate-pulse" /> TURNSTILE #04 ONLINE
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl glass-panel border border-slate-800">
          <p className="text-xs text-slate-400 font-bold uppercase">Admitted Fans</p>
          <p className="text-3xl font-black text-willow-neon font-mono mt-1">{totalScannedCount}</p>
        </div>
        <div className="p-5 rounded-2xl glass-panel border border-slate-800">
          <p className="text-xs text-slate-400 font-bold uppercase">Duplicate / Blocked Entries</p>
          <p className="text-3xl font-black text-red-400 font-mono mt-1">{duplicateAttempts}</p>
        </div>
        <div className="p-5 rounded-2xl glass-panel border border-slate-800">
          <p className="text-xs text-slate-400 font-bold uppercase">Turnstile Status</p>
          <p className="text-3xl font-black text-willow-gold font-mono mt-1">100% READY</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <div className="lg:col-span-7 glass-panel rounded-3xl p-6 border border-willow-gold/40 space-y-4">
          <div className="relative w-full aspect-video rounded-2xl bg-black border-2 border-dashed border-willow-gold/40 flex flex-col items-center justify-center overflow-hidden">
            <div className="absolute inset-x-8 h-1 bg-willow-gold shadow-glow-gold animate-bounce"></div>
            <p className="text-sm font-black text-willow-gold font-mono uppercase tracking-widest">
              OPTICAL PASS SCANNER
            </p>
            <p className="text-xs text-slate-400 mt-1">Scan rolling QR code from fan's mobile app</p>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Paste / Scan Token (e.g. WLW-PASS-99182)"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl bg-willow-900 border border-slate-700 text-xs font-mono text-white focus:border-willow-gold focus:outline-none"
            />
            <button
              onClick={() => handleScan()}
              className="px-6 py-3 rounded-xl bg-willow-gold text-black font-black text-xs shadow-glow-gold hover:brightness-110 transition-all flex items-center gap-1.5"
            >
              <Scan className="w-4 h-4" />
              <span>Verify</span>
            </button>
          </div>

          <div className="pt-2 border-t border-slate-800">
            <p className="text-[11px] text-slate-400 mb-2 font-bold uppercase">Recent Turnstile Passes:</p>
            <div className="flex flex-wrap gap-2">
              {bookings.map((b) => (
                <button
                  key={b.id}
                  onClick={() => {
                    setTokenInput(b.qrCodeToken);
                    handleScan(b.qrCodeToken);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-willow-850 hover:bg-willow-gold hover:text-black border border-slate-700 text-[11px] font-mono text-slate-300 transition-all"
                >
                  Pass #{b.qrCodeToken}
                </button>
              ))}

              <button
                onClick={() => {
                  const fakeToken = 'WLW-FAKED-SCALPER';
                  setTokenInput(fakeToken);
                  handleScan(fakeToken);
                }}
                className="px-3 py-1.5 rounded-lg bg-red-950/80 hover:bg-red-600 hover:text-white border border-red-500/40 text-[11px] font-mono text-red-300 transition-all"
              >
                Test Fake Token ⚠️
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Turnstile Verdict
          </h3>

          {lastScanResult ? (
            <div className={`p-6 rounded-3xl border shadow-2xl space-y-4 ${
              lastScanResult.valid
                ? 'bg-emerald-950/80 border-willow-emerald text-white shadow-glow-emerald'
                : 'bg-red-950/80 border-red-500 text-white shadow-red-500/20'
            }`}>
              <div className="flex items-center gap-3">
                {lastScanResult.valid ? (
                  <div className="w-12 h-12 rounded-2xl bg-willow-emerald/20 text-willow-neon flex items-center justify-center">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center">
                    <XCircle className="w-7 h-7" />
                  </div>
                )}
                <div>
                  <h4 className="text-lg font-black">{lastScanResult.valid ? 'ACCESS GRANTED' : 'ENTRY REJECTED'}</h4>
                  <p className="text-xs text-slate-300">{lastScanResult.message}</p>
                </div>
              </div>

              {lastScanResult.booking && (
                <div className="space-y-2 pt-3 border-t border-slate-700/60 text-xs font-mono">
                  <div className="flex justify-between text-slate-300">
                    <span>Match:</span>
                    <span className="font-bold text-white text-right max-w-[160px] truncate">{lastScanResult.booking.matchTitle}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Gate Number:</span>
                    <span className="font-bold text-willow-neon">{lastScanResult.booking.gateDetails.gateNumber}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Seats ({lastScanResult.booking.seats.length}):</span>
                    <span className="font-bold text-white">
                      {lastScanResult.booking.seats.map((s: any) => `${s.row}${s.number}`).join(', ')}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="glass-panel rounded-3xl p-8 text-center text-slate-500 space-y-2 border border-slate-800">
              <Scan className="w-8 h-8 mx-auto text-slate-600" />
              <p className="text-xs">Scan a ticket to view validation verdict.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
