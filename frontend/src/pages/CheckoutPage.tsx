import React, { useState, useEffect } from 'react';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import { LockTimerBanner } from '../components/LockTimerBanner';
import { ShieldCheck, User, CreditCard, Sparkles, Check, ArrowLeft, AlertTriangle } from 'lucide-react';

interface CheckoutPageProps {
  onPaymentSuccess: (bookingId: string) => void;
  onBackToStadium: () => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onPaymentSuccess, onBackToStadium }) => {
  const { selectedSeats, selectedStand, activeMatch, createBooking } = useBooking();
  const { user } = useAuth();

  const [fans, setFans] = useState<Array<{ name: string; age: number; idType: string; idNumber: string }>>([]);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const initialFans = selectedSeats.map((_, i) => {
      if (user?.savedFans && user.savedFans[i]) {
        return {
          name: user.savedFans[i].name,
          age: user.savedFans[i].age,
          idType: user.savedFans[i].idType,
          idNumber: user.savedFans[i].idNumber
        };
      }
      return {
        name: i === 0 && user?.name ? user.name : `Fan ${i + 1}`,
        age: 25,
        idType: 'Aadhaar',
        idNumber: `•••• •••• ${Math.floor(1000 + Math.random() * 9000)}`
      };
    });
    setFans(initialFans);
  }, [selectedSeats, user]);

  if (!activeMatch || selectedSeats.length === 0) return null;

  const totalPrice = selectedSeats.reduce((acc, s) => acc + s.price, 0);
  const convenienceFee = Math.round(totalPrice * 0.03);
  const grandTotal = totalPrice + convenienceFee;

  const handleFanChange = (index: number, field: string, value: any) => {
    const updated = [...fans];
    updated[index] = { ...updated[index], [field]: value };
    setFans(updated);
  };

  const handleAutoFillFromProfile = () => {
    if (!user?.savedFans || user.savedFans.length === 0) {
      alert('No pre-saved fans found in your profile. Go to Master Fan List to save family members.');
      return;
    }
    const populated = selectedSeats.map((_, i) => {
      const saved = user.savedFans[i % user.savedFans.length];
      return {
        name: saved.name,
        age: saved.age,
        idType: saved.idType,
        idNumber: saved.idNumber
      };
    });
    setFans(populated);
  };

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setProcessing(true);

    try {
      await new Promise((res) => setTimeout(res, 1000));
      const booking = await createBooking(fans);
      setProcessing(false);
      onPaymentSuccess(booking.id);
    } catch (err: any) {
      setError(err.message || 'Payment processing failed');
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-5 pb-16 sm:pb-20 text-white">
      <LockTimerBanner />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
        
        <div className="flex items-center justify-between pt-1">
          <button
            onClick={onBackToStadium}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Seats
          </button>
          <span className="text-xs text-willow-neon font-mono font-bold">
            180s Lock Active
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          <div className="lg:col-span-7 space-y-5">
            
            <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-sm sm:text-base font-black text-white">Ticket Bearers</h3>
                  <p className="text-[11px] sm:text-xs text-slate-400">Names will be printed on the stadium pass</p>
                </div>

                {user?.savedFans && user.savedFans.length > 0 && (
                  <button
                    type="button"
                    onClick={handleAutoFillFromProfile}
                    className="px-3 py-1.5 rounded-xl bg-willow-emerald/20 text-willow-neon text-xs font-bold border border-willow-emerald/40 hover:bg-willow-emerald hover:text-black transition-all flex items-center gap-1.5 shadow-glow-emerald self-start sm:self-auto"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Auto-Fill from Profile ({user.savedFans.length} Saved)</span>
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {fans.map((fan, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-willow-850/80 border border-slate-700/60 space-y-2.5">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-willow-emerald uppercase tracking-wider text-[11px]">
                        Seat {selectedSeats[idx]?.row}{selectedSeats[idx]?.number} ({selectedSeats[idx]?.bayNumber})
                      </span>
                      <span className="text-slate-400 font-mono">₹{selectedSeats[idx]?.price.toLocaleString()}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[9px] uppercase font-bold text-slate-400 mb-1">
                          Full Legal Name
                        </label>
                        <input
                          type="text"
                          value={fan.name}
                          onChange={(e) => handleFanChange(idx, 'name', e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg bg-willow-900 border border-slate-700 text-xs text-white focus:border-willow-emerald focus:outline-none"
                          placeholder="Legal Name"
                        />
                      </div>

                      <div>
                        <label className="block text-[9px] uppercase font-bold text-slate-400 mb-1">
                          Age
                        </label>
                        <input
                          type="number"
                          value={fan.age}
                          onChange={(e) => handleFanChange(idx, 'age', Number(e.target.value))}
                          className="w-full px-3 py-1.5 rounded-lg bg-willow-900 border border-slate-700 text-xs text-white focus:border-willow-emerald focus:outline-none"
                          min="3"
                          max="99"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-3">
              <h3 className="text-sm font-black text-white">Payment Method</h3>
              
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { id: 'upi', label: 'UPI / QR', icon: '⚡' },
                  { id: 'card', label: 'Card', icon: '💳' },
                  { id: 'netbanking', label: 'Net Banking', icon: '🏦' }
                ].map((pm) => (
                  <button
                    key={pm.id}
                    type="button"
                    onClick={() => setPaymentMethod(pm.id as any)}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      paymentMethod === pm.id
                        ? 'bg-willow-emerald/20 border-willow-emerald text-white shadow-glow-emerald font-bold'
                        : 'bg-willow-850/60 border-slate-800 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    <span className="text-lg block mb-0.5">{pm.icon}</span>
                    <span className="text-[11px]">{pm.label}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>

          <div className="lg:col-span-5 space-y-4">
            
            <div className="glass-panel rounded-2xl p-5 border border-willow-emerald/30 shadow-xl space-y-3.5">
              <h3 className="text-sm sm:text-base font-black text-white border-b border-slate-800 pb-2.5">
                Order Summary
              </h3>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Match:</span>
                  <span className="font-bold text-white text-right max-w-[160px] truncate">{activeMatch.title}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Stand:</span>
                  <span className="font-bold text-willow-emerald">{selectedStand?.name}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Total Seats:</span>
                  <span className="font-bold text-white font-mono">{selectedSeats.length} Tickets</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Base Fare:</span>
                  <span className="font-mono text-white">₹{totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Booking & Convenience Fee:</span>
                  <span className="font-mono text-slate-400">₹{convenienceFee.toLocaleString()}</span>
                </div>
              </div>

              <div className="pt-2.5 border-t border-slate-800 flex justify-between items-center">
                <span className="text-xs sm:text-sm font-bold text-white">Grand Total:</span>
                <span className="text-xl sm:text-2xl font-black text-willow-neon font-mono">₹{grandTotal.toLocaleString()}</span>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-950/80 border border-red-500 text-red-300 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                onClick={handlePay}
                disabled={processing}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-willow-emerald via-emerald-500 to-teal-400 text-black font-black text-xs sm:text-sm shadow-glow-emerald hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{processing ? 'Processing...' : `Pay ₹${grandTotal.toLocaleString()} & Issue Pass`}</span>
              </button>

              <p className="text-[10px] text-slate-500 text-center">
                🔒 256-Bit SSL Encrypted Payment
              </p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
