import React from 'react';
import { Ticket, Users, CreditCard, ScanLine, UserCheck, Flame, ChevronRight, Settings } from 'lucide-react';

interface FlowStepBarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  hasSelectedSeats: boolean;
  hasBookings: boolean;
}

export const FlowStepBar: React.FC<FlowStepBarProps> = ({
  currentView,
  setCurrentView,
  hasSelectedSeats,
  hasBookings
}) => {
  const steps = [
    { id: 'home', stepNum: '1', label: 'Match Drops', icon: '🏏' },
    { id: 'queue', stepNum: '2', label: 'Waiting Room', icon: '⏳' },
    { id: 'stadium', stepNum: '3', label: 'Stand & Seats', icon: '🏟️' },
    { id: 'checkout', stepNum: '4', label: 'Checkout & Pay', icon: '💳' },
    { id: 'passes', stepNum: '5', label: 'Pass Vault', icon: '🎟️' }
  ];

  return (
    <div className="w-full bg-willow-850/90 border-b border-slate-800 px-4 py-3 shadow-inner">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto w-full md:w-auto py-1 scrollbar-none">
          <span className="text-[10px] uppercase font-mono font-bold text-slate-500 mr-1 hidden lg:inline">
            Flow:
          </span>

          {steps.map((step, idx) => {
            const isActive = currentView === step.id;
            return (
              <React.Fragment key={step.id}>
                <button
                  onClick={() => setCurrentView(step.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    isActive
                      ? 'bg-willow-emerald text-black shadow-glow-emerald font-black scale-105'
                      : 'bg-willow-900 text-slate-300 border border-slate-800 hover:border-slate-600 hover:text-white'
                  }`}
                >
                  <span className="text-sm">{step.icon}</span>
                  <span>{step.stepNum}. {step.label}</span>
                </button>

                {idx < steps.length - 1 && (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0 hidden sm:inline" />
                )}
              </React.Fragment>
            );
          })}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setCurrentView('profile')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
              currentView === 'profile'
                ? 'bg-willow-emerald/20 border-willow-emerald text-white'
                : 'bg-willow-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 text-willow-emerald" />
            <span>Master Fan List</span>
          </button>

          <button
            onClick={() => setCurrentView('gatekeeper')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
              currentView === 'gatekeeper'
                ? 'bg-willow-gold/20 border-willow-gold text-white shadow-glow-gold'
                : 'bg-willow-900 border-slate-800 text-slate-400 hover:text-willow-gold'
            }`}
          >
            <ScanLine className="w-3.5 h-3.5 text-willow-gold" />
            <span>Turnstile Scanner</span>
          </button>

          <button
            onClick={() => setCurrentView('admin')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
              currentView === 'admin'
                ? 'bg-purple-500/30 border-purple-400 text-purple-200 shadow-glow-emerald'
                : 'bg-willow-900 border-purple-900/60 text-purple-300 hover:border-purple-500 hover:text-white'
            }`}
          >
            <Settings className="w-3.5 h-3.5 text-purple-400" />
            <span>⚙️ Admin Panel</span>
          </button>
        </div>

      </div>
    </div>
  );
};
