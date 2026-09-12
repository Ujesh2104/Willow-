import React, { useState } from 'react';
import { useBooking } from '../context/BookingContext';
import { DynamicTicketPass } from '../components/DynamicTicketPass';
import { Ticket, ArrowLeft, Sparkles } from 'lucide-react';

interface PassVaultPageProps {
  onBackToHome: () => void;
}

export const PassVaultPage: React.FC<PassVaultPageProps> = ({ onBackToHome }) => {
  const { bookings } = useBooking();
  const [selectedBookingId, setSelectedBookingId] = useState<string>(
    bookings[0]?.id || ''
  );

  const activeBooking = bookings.find((b) => b.id === selectedBookingId) || bookings[0];

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8 space-y-6 sm:space-y-8 pb-16 sm:pb-20 text-white">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToHome}
            className="p-2 rounded-xl bg-willow-800/80 border border-slate-700 text-slate-300 hover:text-white transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-xl sm:text-2xl font-black">Digital Match Pass Vault</h2>
            <p className="text-xs text-slate-400">
              Official Rolling QR Code Stadium Passes ({bookings.length} Bookings)
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-willow-emerald/20 text-willow-neon text-xs font-bold border border-willow-emerald/40 font-mono self-start sm:self-auto">
          <Sparkles className="w-3.5 h-3.5" /> Pass Active
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="glass-panel rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-center space-y-4 border border-slate-800">
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-willow-850 border border-slate-700 text-slate-400 mx-auto flex items-center justify-center">
            <Ticket className="w-6 h-6 sm:w-8 sm:h-8" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-white">No Tickets in Vault Yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Book tickets for upcoming matches to view your official stadium passes.
          </p>
          <button
            onClick={onBackToHome}
            className="px-5 py-2.5 rounded-xl bg-willow-emerald text-black font-black text-xs shadow-glow-emerald hover:brightness-110 cursor-pointer"
          >
            Explore Upcoming Matches
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          
          <div className="lg:col-span-5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              Select Match Pass
            </h3>

            {bookings.map((b) => {
              const isSelected = b.id === activeBooking?.id;
              return (
                <div
                  key={b.id}
                  onClick={() => setSelectedBookingId(b.id)}
                  className={`p-3.5 sm:p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-willow-800/90 border-willow-emerald shadow-glow-emerald ring-1 ring-willow-emerald'
                      : 'bg-willow-850/60 border-slate-800 hover:border-slate-600'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-willow-neon font-mono">
                        {b.id}
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold text-white mt-1">{b.matchTitle}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">{b.venue}</p>
                    </div>

                    <span className={`px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold uppercase ${
                      b.status === 'ATTENDED' ? 'bg-blue-500/20 text-blue-300' : 'bg-willow-emerald/20 text-willow-emerald'
                    }`}>
                      {b.status}
                    </span>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex justify-between items-center text-xs">
                    <span className="text-slate-400">{b.seats.length} Seats</span>
                    <span className="font-bold text-willow-neon font-mono">₹{b.totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="lg:col-span-7">
            {activeBooking && <DynamicTicketPass booking={activeBooking} />}
          </div>

        </div>
      )}

    </div>
  );
};
