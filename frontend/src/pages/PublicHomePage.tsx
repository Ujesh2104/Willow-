import React, { useState, useEffect } from 'react';
import { useBooking } from '../context/BookingContext';
import { Ticket, MapPin, Sparkles, Inbox, ArrowRight } from 'lucide-react';

interface PublicHomePageProps {
  onNavigateToRegister: () => void;
  onNavigateToLogin: () => void;
}

const BG_IMAGES = [
  '/images/stadium_night.jpg',
  '/images/batsman_action.jpg',
  '/images/stadium_sunset.jpg',
  '/images/stadium_pitch.jpg'
];

export const PublicHomePage: React.FC<PublicHomePageProps> = ({
  onNavigateToRegister,
  onNavigateToLogin
}) => {
  const { matches } = useBooking();
  const [currentBg, setCurrentBg] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % BG_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full overflow-hidden pb-16 sm:pb-20 text-white min-h-[80vh] flex flex-col justify-center">
      
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-black">
        {BG_IMAGES.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-center bg-cover bg-no-repeat transition-opacity duration-1000 ease-in-out ${
              index === currentBg ? 'opacity-85 scale-100' : 'opacity-0 scale-105'
            }`}
            style={{
              backgroundImage: `url(${img})`,
              transitionProperty: 'opacity, transform',
              transitionDuration: '1200ms'
            }}
          />
        ))}

        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/75"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 space-y-8 text-center">
        
        <div className="space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-willow-850/90 border border-willow-emerald/40 text-[11px] sm:text-xs font-bold text-willow-neon shadow-glow-emerald backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-willow-emerald" /> 
            <span>Official Cricket Stadium Ticket Portal</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight drop-shadow-lg">
            From the <span className="bg-gradient-to-r from-willow-emerald via-emerald-400 to-willow-neon bg-clip-text text-transparent">Willow</span> to the Stadium Gate.
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-slate-300 max-w-xl mx-auto font-medium leading-relaxed drop-shadow">
            Every Ball. Every Boundary. Live from the Stands. Book your verified stadium seats and experience the matchday passion.
          </p>

          <div className="flex items-center justify-center gap-1.5 pt-2">
            {BG_IMAGES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentBg(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 pointer-events-auto ${
                  idx === currentBg ? 'w-6 bg-willow-emerald' : 'w-1.5 bg-slate-600/60 hover:bg-slate-500'
                }`}
                title={`Image ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="max-w-3xl mx-auto">
          
          {!matches || matches.length === 0 ? (
            <div className="glass-panel rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-center space-y-4 border border-willow-emerald/20 shadow-2xl relative overflow-hidden backdrop-blur-xl bg-willow-850/80">
              
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-willow-emerald to-transparent"></div>

              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-willow-850/90 border border-slate-700 text-slate-400 mx-auto flex items-center justify-center shadow-inner">
                <Inbox className="w-7 h-7 sm:w-8 sm:h-8 text-slate-500" />
              </div>
              
              <div className="space-y-1.5">
                <h3 className="text-xl sm:text-2xl font-black text-white">No Match Found Yet To Be Posted</h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                  There are currently no active cricket matches scheduled. Fixtures and stadium wing allocations will appear here in real-time as soon as published by the stadium administrator.
                </p>
              </div>

              <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={onNavigateToRegister}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-willow-emerald via-emerald-500 to-teal-400 text-black font-black text-xs shadow-glow-emerald hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Create Verified Fan Account</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={onNavigateToLogin}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-willow-800/90 text-white font-bold text-xs border border-slate-700 hover:border-willow-emerald transition-all cursor-pointer"
                >
                  Sign In (Fan / Admin)
                </button>
              </div>
            </div>
          ) : (
            
            <div className="space-y-4 text-left">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <h3 className="text-base sm:text-lg font-black text-white">Live Match Fixtures</h3>
                <span className="text-xs text-willow-emerald font-mono font-bold">{matches.length} Match(es) Available</span>
              </div>

              <div className="grid grid-cols-1 gap-3.5">
                {matches.map((m) => (
                  <div
                    key={m.id}
                    className="glass-panel rounded-2xl p-5 sm:p-6 border border-willow-emerald/40 hover:border-willow-emerald transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 backdrop-blur-xl bg-willow-850/80"
                  >
                    <div className="space-y-1">
                      <span className="px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-wider bg-willow-emerald/20 text-willow-neon border border-willow-emerald/40">
                        {m.tournament}
                      </span>
                      <h4 className="text-lg sm:text-xl font-black text-white">{m.title}</h4>
                      <p className="text-xs text-slate-400 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-willow-emerald" /> {m.venue}, {m.city}
                      </p>
                      <p className="text-[11px] sm:text-xs text-willow-emerald font-mono pt-0.5">
                        Wings: {m.stands ? m.stands.map((s) => `${s.name.split(' ')[0]} (₹${s.price})`).join(' • ') : 'Available'}
                      </p>
                    </div>

                    <button
                      onClick={onNavigateToLogin}
                      className="w-full sm:w-auto px-5 py-3 rounded-xl bg-gradient-to-r from-willow-emerald to-teal-400 text-black font-black text-xs shadow-glow-emerald hover:brightness-110 transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
                    >
                      <Ticket className="w-4 h-4" />
                      <span>Sign In to Book Seats</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
