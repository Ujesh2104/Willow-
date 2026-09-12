import React from 'react';
import { useBooking } from '../context/BookingContext';
import { StadiumMap } from '../components/StadiumMap';
import { LockTimerBanner } from '../components/LockTimerBanner';
import { MapPin, ArrowLeft, ShieldAlert } from 'lucide-react';

interface StadiumPageProps {
  onProceedToCheckout: () => void;
  onBackToHome: () => void;
}

export const StadiumPage: React.FC<StadiumPageProps> = ({ onProceedToCheckout, onBackToHome }) => {
  const { activeMatch, isLockActive } = useBooking();

  if (!activeMatch) return null;

  return (
    <div className="space-y-6 pb-20">
      
      <LockTimerBanner />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToHome}
              className="p-2 rounded-xl bg-willow-800/80 border border-slate-700 text-slate-300 hover:text-white hover:border-willow-emerald transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white">{activeMatch.title}</h2>
              <p className="text-xs text-slate-400 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-willow-emerald" /> {activeMatch.venue}, {activeMatch.city}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-willow-emerald/20 text-willow-neon text-xs font-bold border border-willow-emerald/40 font-mono">
              🛡️ Max 4 Seats / Account
            </span>
          </div>
        </div>

        <StadiumMap onProceedToCheckout={onProceedToCheckout} />

      </div>

    </div>
  );
};
