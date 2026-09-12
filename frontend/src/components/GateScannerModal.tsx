import React, { useState } from 'react';
import { useBooking } from '../context/BookingContext';
import { X, Scan, CheckCircle2, XCircle } from 'lucide-react';

interface GateScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GateScannerModal: React.FC<GateScannerModalProps> = ({ isOpen, onClose }) => {
  const { validateTicketQR, bookings } = useBooking();
  const [tokenInput, setTokenInput] = useState('');
  const [scanResult, setScanResult] = useState<{ valid: boolean; booking?: any; message: string } | null>(null);

  if (!isOpen) return null;

  const handleScan = async (tokenToScan?: string) => {
    const token = tokenToScan || tokenInput;
    if (!token) return;
    const result = await validateTicketQR(token);
    setScanResult(result);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg">
      <div className="relative w-full max-w-lg glass-modal rounded-3xl p-6 sm:p-8 shadow-2xl border border-willow-gold/40 text-white animate-in zoom-in duration-200">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-willow-gold/20 border border-willow-gold/40 text-willow-gold mx-auto flex items-center justify-center mb-2 shadow-glow-gold">
            <Scan className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black tracking-tight">Stadium Gatekeeper Turnstile</h2>
          <p className="text-xs text-slate-400">
            Real-Time Ticket Validation & Anti-Duplicate Scanner
          </p>
        </div>

        <div className="relative w-full aspect-video rounded-2xl bg-black border-2 border-dashed border-willow-gold/40 flex flex-col items-center justify-center overflow-hidden mb-6">
          
          <div className="absolute inset-x-4 h-0.5 bg-willow-gold shadow-glow-gold animate-bounce"></div>

          <p className="text-xs text-willow-gold font-mono uppercase tracking-widest font-bold">
            SCANNING TURNSTILE CAMERA VIEW
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Point at Fan's Dynamic Rolling Pass</p>

          {bookings.length > 0 && (
            <button
              onClick={() => {
                setTokenInput(bookings[0].qrCodeToken);
                handleScan(bookings[0].qrCodeToken);
              }}
              className="mt-3 px-3 py-1.5 rounded-lg bg-willow-800/90 border border-willow-gold/50 text-[11px] text-white hover:bg-willow-gold hover:text-black font-bold transition-all"
            >
              Test Scan Pass #{bookings[0].qrCodeToken}
            </button>
          )}
        </div>

        <div className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Enter Rolling Pass Hash (e.g. WLW-PASS-99182)"
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl bg-willow-800 border border-slate-700 focus:border-willow-gold focus:outline-none text-xs text-white font-mono placeholder-slate-500"
          />
          <button
            onClick={() => handleScan()}
            className="px-5 py-2.5 rounded-xl bg-willow-gold text-black font-black text-xs shadow-glow-gold hover:brightness-110 transition-all"
          >
            Verify Pass
          </button>
        </div>

        {scanResult && (
          <div className={`p-4 rounded-2xl border text-left transition-all ${
            scanResult.valid 
              ? 'bg-emerald-950/80 border-willow-emerald text-emerald-200' 
              : 'bg-red-950/80 border-red-500 text-red-200'
          }`}>
            <div className="flex items-start gap-3">
              {scanResult.valid ? (
                <CheckCircle2 className="w-6 h-6 text-willow-emerald shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-6 h-6 text-red-400 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <p className="font-bold text-sm">{scanResult.message}</p>
                {scanResult.booking && (
                  <div className="text-xs text-slate-300 font-mono pt-1">
                    <p>• Stand: {scanResult.booking.seats[0]?.standName}</p>
                    <p>• Seats: {scanResult.booking.seats.map((s: any) => `${s.bayNumber} ${s.row}${s.number}`).join(', ')}</p>
                    <p>• Primary Fan: {scanResult.booking.fans[0]?.name}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
