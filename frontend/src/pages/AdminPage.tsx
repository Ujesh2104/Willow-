import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useBooking } from '../context/BookingContext';
import { Match, Stand, User, Booking } from '../types';
import {
  ShieldCheck,
  PlusCircle,
  Edit3,
  Mail,
  Send,
  Users,
  DollarSign,
  Ticket,
  MapPin,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Trash2,
  Clock
} from 'lucide-react';

interface AdminPageProps {
  onBackToHome?: () => void;
}

export const AdminPage: React.FC<AdminPageProps> = () => {
  const { matches, fetchMatches } = useBooking() as any;
  const [activeTab, setActiveTab] = useState<'matches' | 'pricing' | 'users' | 'email-dispatch'>('matches');

  const [stats, setStats] = useState<any>({
    totalMatches: 0,
    totalUsers: 0,
    totalBookings: 0,
    totalTicketsSold: 0,
    totalRevenue: 0,
    activeLocks: 0
  });

  const [usersList, setUsersList] = useState<User[]>([]);
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [matchTitle, setMatchTitle] = useState('');
  const [tournament, setTournament] = useState('ICC Champions Trophy 2026');
  const [venue, setVenue] = useState('Eden Gardens Stadium');
  const [city, setCity] = useState('Kolkata');
  const [matchDateTime, setMatchDateTime] = useState('20 Sep, 07:30 PM IST');
  const [dropDeadlineTime, setDropDeadlineTime] = useState('9:00 PM IST');

  const [standsConfig, setStandsConfig] = useState<Array<{ name: string; category: any; price: number; totalSeats: number }>>([
    { name: 'Club House VIP Pavilion', category: 'VIP Hospitality', price: 14000, totalSeats: 30 },
    { name: 'B-Block North Stand (Tier 1)', category: 'Pavilion', price: 4800, totalSeats: 30 },
    { name: 'C-Block East Terrace', category: 'Premium Tier', price: 2900, totalSeats: 30 },
    { name: 'D-Block Boundary Stand', category: 'Boundary Terrace', price: 1900, totalSeats: 30 }
  ]);

  const [selectedMatchForPricing, setSelectedMatchForPricing] = useState<Match | null>(null);
  const [emailSendingId, setEmailSendingId] = useState<string | null>(null);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [statsData, usersData, bookingsData] = await Promise.all([
        api.getAdminStats(),
        api.getAllUsers(),
        api.getUserBookings('')
      ]);
      if (statsData) setStats(statsData);
      if (usersData) setUsersList(usersData);
      if (bookingsData) setAllBookings(bookingsData);
      if (matches && matches.length > 0 && !selectedMatchForPricing) {
        setSelectedMatchForPricing(matches[0]);
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  useEffect(() => {
    if (matches && matches.length > 0 && !selectedMatchForPricing) {
      setSelectedMatchForPricing(matches[0]);
    }
  }, [matches]);

  const handleCreateMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!matchTitle || !venue) {
      setMessage({ type: 'error', text: 'Match Title and Venue are required.' });
      return;
    }

    try {
      const payload = {
        title: matchTitle,
        tournament,
        venue,
        city,
        matchDateTime,
        dropDeadlineTime,
        stands: standsConfig
      };

      const res = await api.createMatch(payload);
      if (res.success) {
        setMessage({ type: 'success', text: `🎉 Match "${matchTitle}" published live to Fan Portal!` });
        setMatchTitle('');
        await loadAdminData();
        if (fetchMatches) await fetchMatches();
      } else {
        setMessage({ type: 'error', text: res.message || 'Failed to create match.' });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Server error creating match.' });
    }
  };

  const handleDeleteMatch = async (matchId: string) => {
    if (!window.confirm('Are you sure you want to finish and close bookings for this match?')) return;
    try {
      const res = await api.deleteMatch(matchId);
      if (res.success) {
        setMessage({ type: 'success', text: 'Match bookings closed and removed from active portal.' });
        await loadAdminData();
        if (fetchMatches) await fetchMatches();
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to close match.' });
    }
  };

  const handleUpdateWingPrices = async () => {
    if (!selectedMatchForPricing) return;

    try {
      const res = await api.updateMatchStands(selectedMatchForPricing.id, {
        venue: selectedMatchForPricing.venue,
        city: selectedMatchForPricing.city,
        stands: selectedMatchForPricing.stands
      });

      if (res.success) {
        setMessage({ type: 'success', text: `✅ Updated wing prices & venue for ${selectedMatchForPricing.title}` });
        await loadAdminData();
        if (fetchMatches) await fetchMatches();
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: 'Failed to update prices.' });
    }
  };

  const handleSendEmail = async (bookingId: string, userEmail: string) => {
    setEmailSendingId(bookingId);
    try {
      const res = await api.sendTicketEmail(bookingId, userEmail);
      if (res.success) {
        setMessage({ type: 'success', text: res.message });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to dispatch email' });
    } finally {
      setEmailSendingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-8 pb-20 text-white">
      
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-purple-500/40 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold font-mono border border-purple-500/40 mb-2">
            <ShieldCheck className="w-3.5 h-3.5" /> STADIUM COMMAND CENTER
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Willow Admin Dashboard</h2>
          <p className="text-xs text-slate-400 mt-1">
            Post Matches • Set Wing Prices • Close Finished Drops • User Registry & Email Tickets
          </p>
        </div>

        <button
          onClick={loadAdminData}
          className="px-4 py-2.5 rounded-xl bg-willow-800 hover:bg-purple-600 hover:text-white text-xs font-bold border border-slate-700 transition-all flex items-center gap-2"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Sync Real-Time Data</span>
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-1">
          <div className="flex justify-between items-center text-slate-400 text-xs font-bold uppercase">
            <span>Total Revenue</span>
            <DollarSign className="w-4 h-4 text-willow-emerald" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-willow-neon font-mono">
            ₹{stats.totalRevenue ? stats.totalRevenue.toLocaleString() : '0'}
          </p>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-1">
          <div className="flex justify-between items-center text-slate-400 text-xs font-bold uppercase">
            <span>Tickets Sold</span>
            <Ticket className="w-4 h-4 text-willow-gold" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-white font-mono">
            {stats.totalTicketsSold || 0} Pass(es)
          </p>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-1">
          <div className="flex justify-between items-center text-slate-400 text-xs font-bold uppercase">
            <span>Verified Fans</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-white font-mono">
            {usersList.length || stats.totalUsers || 0} Users
          </p>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-1">
          <div className="flex justify-between items-center text-slate-400 text-xs font-bold uppercase">
            <span>Active Matches</span>
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-white font-mono">
            {matches?.length || 0} Drops
          </p>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-2xl border flex items-center justify-between gap-3 text-xs font-bold ${
          message.type === 'success'
            ? 'bg-emerald-950/90 border-willow-emerald text-emerald-200'
            : 'bg-red-950/90 border-red-500 text-red-200'
        }`}>
          <div className="flex items-center gap-2">
            {message.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-willow-emerald" /> : <AlertTriangle className="w-4 h-4 text-red-400" />}
            <span>{message.text}</span>
          </div>
          <button onClick={() => setMessage(null)} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
        {[
          { id: 'matches', label: '➕ Post New Match Drop', icon: PlusCircle },
          { id: 'pricing', label: '🏟️ Set Wing Prices & Manage Matches', icon: Edit3 },
          { id: 'users', label: '👥 User & Fan Registry', icon: Users },
          { id: 'email-dispatch', label: '✉️ Email Ticket Dispatcher', icon: Mail }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                isActive
                  ? 'bg-purple-600 text-white shadow-glow-emerald font-black scale-105'
                  : 'bg-willow-850 text-slate-300 border border-slate-800 hover:border-slate-600'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {activeTab === 'matches' && (
        <form onSubmit={handleCreateMatch} className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-willow-emerald" /> Post New Cricket Match Drop
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Add a new fixture with stadium wings, pricing tiers, and 9:00 PM drop window.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Match Title & Teams
              </label>
              <input
                type="text"
                placeholder="e.g. India vs South Africa — T20 Super Series"
                value={matchTitle}
                onChange={(e) => setMatchTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-willow-900 border border-slate-700 text-xs text-white focus:border-willow-emerald focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Tournament / League
              </label>
              <input
                type="text"
                value={tournament}
                onChange={(e) => setTournament(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-willow-900 border border-slate-700 text-xs text-white focus:border-willow-emerald focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Stadium Venue
              </label>
              <input
                type="text"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-willow-900 border border-slate-700 text-xs text-white focus:border-willow-emerald focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Host City
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-willow-900 border border-slate-700 text-xs text-white focus:border-willow-emerald focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Drop Deadline Cutoff Time
              </label>
              <input
                type="text"
                value={dropDeadlineTime}
                onChange={(e) => setDropDeadlineTime(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-willow-900 border border-slate-700 text-xs text-white focus:border-willow-emerald focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-willow-neon">
              Configure 4 Stadium Wing Prices
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {standsConfig.map((stand, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-willow-850 border border-slate-700/80 space-y-2">
                  <span className="text-[10px] font-bold text-willow-emerald uppercase">Wing {idx + 1}</span>
                  <input
                    type="text"
                    value={stand.name}
                    onChange={(e) => {
                      const updated = [...standsConfig];
                      updated[idx].name = e.target.value;
                      setStandsConfig(updated);
                    }}
                    className="w-full px-3 py-1.5 rounded-lg bg-willow-900 border border-slate-700 text-xs text-white font-bold"
                  />
                  <div>
                    <label className="text-[9px] uppercase font-bold text-slate-400">Price (₹)</label>
                    <input
                      type="number"
                      value={stand.price}
                      onChange={(e) => {
                        const updated = [...standsConfig];
                        updated[idx].price = Number(e.target.value);
                        setStandsConfig(updated);
                      }}
                      className="w-full px-3 py-1.5 rounded-lg bg-willow-900 border border-slate-700 text-xs font-mono font-bold text-willow-neon"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-willow-emerald via-emerald-500 to-teal-400 text-black font-black text-sm shadow-glow-emerald hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Publish Match Drop to Live Fan Portal</span>
          </button>
        </form>
      )}

      {activeTab === 'pricing' && (
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-willow-gold" /> Manage Active Match Drops & Wing Prices
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Update seat prices per wing or close completed match drops so they are removed from user portal.
            </p>
          </div>

          <div className="space-y-4">
            {matches && matches.map((m: any) => (
              <div key={m.id} className="p-5 rounded-2xl bg-willow-850 border border-slate-700 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="text-base font-black text-white">{m.title}</h4>
                  <p className="text-xs text-slate-400">{m.venue}, {m.city} • {m.remainingInventory} Seats Left</p>
                  <p className="text-[11px] text-willow-emerald font-mono font-bold">
                    Wings: {m.stands.map((s: any) => `${s.name.split(' ')[0]} (₹${s.price})`).join(' | ')}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedMatchForPricing(m)}
                    className="px-4 py-2 rounded-xl bg-willow-800 text-white text-xs font-bold border border-slate-700 hover:border-willow-emerald"
                  >
                    Edit Wing Prices
                  </button>
                  <button
                    onClick={() => handleDeleteMatch(m.id)}
                    className="px-4 py-2 rounded-xl bg-red-950/80 hover:bg-red-600 text-red-300 hover:text-white text-xs font-bold border border-red-500/40 transition-all flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Close Match Drop</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {selectedMatchForPricing && (
            <div className="p-6 rounded-2xl bg-willow-900 border border-willow-gold/40 space-y-4">
              <h4 className="text-sm font-black text-willow-gold">
                Editing Wing Prices for: {selectedMatchForPricing.title}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {selectedMatchForPricing.stands.map((stand, i) => (
                  <div key={stand.id} className="p-3.5 rounded-xl bg-willow-850 border border-slate-700 space-y-2">
                    <p className="text-xs font-bold text-white">{stand.name}</p>
                    <div className="flex items-center gap-2">
                      <label className="text-[10px] text-slate-400 uppercase">Price (₹):</label>
                      <input
                        type="number"
                        value={stand.price}
                        onChange={(e) => {
                          const updated = [...selectedMatchForPricing.stands];
                          updated[i].price = Number(e.target.value);
                          setSelectedMatchForPricing({ ...selectedMatchForPricing, stands: updated });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg bg-willow-900 border border-slate-700 text-xs font-mono font-bold text-willow-neon"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={handleUpdateWingPrices}
                className="px-6 py-2.5 rounded-xl bg-willow-gold text-black font-black text-xs shadow-glow-gold hover:brightness-110 transition-all"
              >
                Apply New Wing Prices
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'users' && (
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-cyan-400" /> Verified Fan Registry & Single Session Monitor
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              List of all registered fan accounts, sanitized emails, and active device sessions.
            </p>
          </div>

          <div className="space-y-4">
            {usersList.map((usr) => (
              <div key={usr.id} className="p-5 rounded-2xl bg-willow-850 border border-slate-700/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-black text-white">{usr.name}</h4>
                    <span className="px-2 py-0.5 rounded-full bg-willow-emerald/20 text-willow-neon text-[10px] font-bold">
                      1 Active Session
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-mono">
                    Email: <span className="text-slate-200 font-bold">{usr.email}</span> • Phone: {usr.phone}
                  </p>
                  <p className="text-[11px] text-slate-500 font-mono">
                    Session Token: {usr.currentSessionId}
                  </p>
                </div>

                <div className="text-left md:text-right">
                  <p className="text-[11px] font-bold text-slate-400 uppercase">Pre-Saved Family List:</p>
                  <p className="text-xs text-willow-emerald font-mono font-bold">
                    {usr.savedFans ? usr.savedFans.length : 0} / 4 Members Pre-Saved
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'email-dispatch' && (
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Mail className="w-5 h-5 text-willow-emerald" /> Digital Pass Email Dispatcher
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Dispatch dynamic rolling QR passes directly to verified fan email inboxes with 1 click.
            </p>
          </div>

          <div className="space-y-4">
            {allBookings.map((b) => (
              <div key={b.id} className="p-5 rounded-2xl bg-willow-850 border border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-willow-neon">{b.id}</span>
                    <span className="px-2 py-0.5 rounded-full bg-willow-emerald/20 text-willow-emerald text-[10px] font-bold">
                      {b.status}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white">{b.matchTitle}</h4>
                  <p className="text-xs text-slate-400 font-mono">
                    Recipient: <span className="text-slate-200 font-bold">{b.userEmail}</span> ({b.seats.length} Seats)
                  </p>
                </div>

                <button
                  onClick={() => handleSendEmail(b.id, b.userEmail)}
                  disabled={emailSendingId === b.id}
                  className="px-5 py-2.5 rounded-xl bg-willow-emerald text-black font-black text-xs shadow-glow-emerald hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{emailSendingId === b.id ? 'Dispatching...' : 'Send Pass via Email'}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
