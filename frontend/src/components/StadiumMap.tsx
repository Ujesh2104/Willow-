import React, { useState, useMemo } from 'react';
import { useBooking } from '../context/BookingContext';
import { Stand, Seat } from '../types';
import { ShieldCheck, Info, Sparkles, Check, Flame, ArrowRight } from 'lucide-react';

interface StadiumMapProps {
  onProceedToCheckout: () => void;
}

export const StadiumMap: React.FC<StadiumMapProps> = ({ onProceedToCheckout }) => {
  const {
    activeMatch,
    selectedStand,
    setSelectedStand,
    standSeats,
    selectedSeats,
    toggleSeatSelection,
    loadingSeats
  } = useBooking();

  const [activeBay, setActiveBay] = useState<string>('Bay 1');

  const baySeats = useMemo(() => {
    return standSeats.filter((s) => s.bayNumber === activeBay);
  }, [standSeats, activeBay]);

  if (!activeMatch) return null;

  const totalPrice = selectedSeats.reduce((acc, s) => acc + s.price, 0);

  return (
    <div className="w-full space-y-5">
      
      <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
          <div>
            <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-white">
              🏟️ STEP 1: CHOOSE STADIUM WING
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-400">Select a stand to view seat availability</p>
          </div>
          <span className="text-[10px] sm:text-[11px] text-willow-neon font-mono font-bold">
            Live Concurrency Active
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1">
          {activeMatch.stands.map((stand) => {
            const isSelected = selectedStand?.id === stand.id;
            return (
              <button
                key={stand.id}
                onClick={() => setSelectedStand(stand)}
                className={`p-3 sm:p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-willow-800 border-willow-emerald shadow-glow-emerald ring-2 ring-willow-emerald text-white'
                    : 'bg-willow-900/80 border-slate-800 text-slate-300 hover:border-slate-600'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start">
                    <span className="text-[8px] sm:text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {stand.category}
                    </span>
                    <span className="text-xs sm:text-sm font-black text-willow-neon font-mono">
                      ₹{stand.price.toLocaleString()}
                    </span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-white mt-1.5 leading-snug">{stand.name}</h4>
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-800 flex justify-between items-center text-[10px]">
                  <span className="text-slate-400">Available:</span>
                  <span className="font-bold text-willow-emerald font-mono">{stand.availableSeats} Seats</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {selectedStand && (
        <div className="glass-panel rounded-2xl p-4 sm:p-6 border border-willow-emerald/30 space-y-5">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white">{selectedStand.name}</h3>
                <span className="px-2 py-0.5 rounded-full bg-willow-emerald/20 text-willow-neon text-xs font-bold font-mono">
                  ₹{selectedStand.price.toLocaleString()} / seat
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
                Click any seat square below (Max 4 tickets cap).
              </p>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-[10px] uppercase font-bold text-slate-400 mr-1">Bay:</span>
              {['Bay 1', 'Bay 2'].map((bay) => (
                <button
                  key={bay}
                  onClick={() => setActiveBay(bay)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeBay === bay
                      ? 'bg-willow-emerald text-black shadow-glow-emerald font-black'
                      : 'bg-willow-800 text-slate-300 border border-slate-700'
                  }`}
                >
                  {bay}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 py-2 bg-willow-900/60 rounded-xl border border-slate-800 text-[10px] sm:text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded bg-willow-800 border border-slate-600"></span>
              <span className="text-slate-300">Available</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded bg-willow-emerald border border-white shadow-glow-emerald"></span>
              <span className="text-white font-bold">Selected ({selectedSeats.length}/4)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded bg-amber-500/40 border border-amber-500"></span>
              <span className="text-amber-400">Holding (3-Min)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded bg-slate-950 border border-slate-900 opacity-40"></span>
              <span className="text-slate-500">Booked</span>
            </div>
          </div>

          <div className="w-full text-center">
            <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-willow-emerald/10 border border-willow-emerald/30 text-[10px] sm:text-xs font-bold text-willow-neon">
              <span>⬇️ CRICKET PITCH SIGHTLINE (FRONT ROW) ⬇️</span>
            </div>
          </div>

          {loadingSeats ? (
            <div className="py-10 text-center text-xs text-slate-400 font-mono">
              Loading seat matrix from backend...
            </div>
          ) : (
            <div className="space-y-2.5 overflow-x-auto py-2">
              {['A', 'B', 'C'].map((rowLetter) => {
                const rowSeats = baySeats.filter((s) => s.row === rowLetter);
                return (
                  <div key={rowLetter} className="flex items-center justify-center gap-2 sm:gap-3 min-w-[280px]">
                    <span className="w-5 text-center font-mono font-bold text-[11px] text-slate-400">
                      {rowLetter}
                    </span>
                    
                    <div className="flex items-center gap-2 sm:gap-2.5">
                      {rowSeats.map((seat) => {
                        const isSelected = selectedSeats.some((s) => s.id === seat.id);
                        const isBooked = seat.status === 'booked';
                        const isHolding = seat.status === 'locked';

                        return (
                          <button
                            key={seat.id}
                            disabled={isBooked || isHolding}
                            onClick={() => toggleSeatSelection(seat)}
                            title={`Row ${seat.row}, Seat ${seat.number} - ₹${seat.price}`}
                            className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl text-xs font-mono font-black transition-all flex flex-col items-center justify-center shrink-0 ${
                              isSelected
                                ? 'bg-willow-emerald text-black border-2 border-white shadow-glow-emerald scale-105'
                                : isHolding
                                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50 cursor-not-allowed'
                                : isBooked
                                ? 'bg-slate-950 text-slate-700 border border-slate-900 cursor-not-allowed line-through'
                                : 'bg-willow-800 text-slate-200 border border-slate-700 hover:border-willow-emerald hover:text-white'
                            }`}
                          >
                            {isSelected ? <Check className="w-4 h-4 stroke-[3]" /> : seat.number}
                            <span className="text-[7px] font-mono leading-none mt-0.5 opacity-60">{seat.row}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {selectedSeats.length > 0 && (
            <div className="sticky bottom-3 z-20 p-3.5 sm:p-4 rounded-2xl bg-willow-900/95 border border-willow-emerald shadow-glow-emerald backdrop-blur-2xl flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in">
              <div className="text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    {selectedSeats.length} / 4 Seats Locked
                  </span>
                  <span className="text-[10px] text-willow-emerald font-mono font-bold">
                    (3-Min Lock)
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  Seats: {selectedSeats.map((s) => `${s.row}${s.number}`).join(', ')} ({activeBay})
                </p>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                <div className="text-left sm:text-right">
                  <p className="text-[10px] text-slate-400">Total Price</p>
                  <p className="text-lg sm:text-xl font-black text-willow-neon font-mono">₹{totalPrice.toLocaleString()}</p>
                </div>

                <button
                  onClick={onProceedToCheckout}
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-willow-emerald to-teal-400 text-black font-black text-xs sm:text-sm shadow-glow-emerald hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-1.5"
                >
                  <span>CHECKOUT</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
