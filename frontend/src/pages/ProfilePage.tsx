import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Trash2, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, saveFan, removeFan } = useAuth();

  const [name, setName] = useState('');
  const [age, setAge] = useState<number>(25);
  const [gender, setGender] = useState<'M' | 'F' | 'Other'>('M');
  const [idType, setIdType] = useState<'Aadhaar' | 'Passport' | 'Driving License'>('Aadhaar');
  const [idNumber, setIdNumber] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  if (!user) return null;

  const handleAddFan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !idNumber) {
      alert('Please provide name and ID number');
      return;
    }
    const success = await saveFan({
      name,
      age,
      gender,
      idType,
      idNumber: idNumber.length > 4 ? `•••• •••• ${idNumber.slice(-4)}` : idNumber
    });

    if (success) {
      setName('');
      setIdNumber('');
      setShowAddForm(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 pb-20 text-white">
      
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-willow-emerald/30 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-willow-emerald to-teal-400 p-0.5 shadow-glow-emerald flex items-center justify-center shrink-0">
            <div className="w-full h-full bg-willow-900 rounded-[14px] flex items-center justify-center text-2xl font-black text-white">
              {user.name.charAt(0)}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black">{user.name.replace('(Demo Fan)', '').trim()}</h2>
              <span className="px-2 py-0.5 rounded-full bg-willow-emerald/20 text-willow-neon text-[10px] font-bold border border-willow-emerald/40">
                Verified Fan
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">{user.email}</p>
            <p className="text-xs text-slate-500 font-mono">{user.phone}</p>
          </div>
        </div>

        <div className="p-3.5 px-4 rounded-2xl bg-willow-850/80 border border-slate-700/60 text-right space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-willow-emerald font-bold justify-end">
            <ShieldCheck className="w-4 h-4 text-willow-emerald" />
            <span>Account Status: Active & Verified</span>
          </div>
          <p className="text-[11px] text-slate-400">1 Device Session Active</p>
        </div>
      </div>

      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-white">Pre-Saved Fan Master List</h3>
              <span className="px-2.5 py-0.5 rounded-full bg-willow-emerald/20 text-willow-neon text-xs font-bold font-mono">
                {user.savedFans.length} / 4 Saved
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Pre-save up to 4 family members or friends. During match checkout, 1-click auto-fills all attendee details instantly!
            </p>
          </div>

          {user.savedFans.length < 4 && !showAddForm && (
            <button
              onClick={() => setShowAddForm(true)}
              className="px-4 py-2 rounded-xl bg-willow-emerald text-black font-black text-xs shadow-glow-emerald hover:brightness-110 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add Fan to Master List</span>
            </button>
          )}
        </div>

        {showAddForm && (
          <form onSubmit={handleAddFan} className="p-5 rounded-2xl bg-willow-850/90 border border-willow-emerald/40 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-willow-neon">
              Add New Family / Friend (Max 4 Total)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Legal Name</label>
                <input
                  type="text"
                  placeholder="e.g. Ananya Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-willow-900 border border-slate-700 text-xs text-white focus:border-willow-emerald focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Age</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-willow-900 border border-slate-700 text-xs text-white focus:border-willow-emerald focus:outline-none"
                  min="3"
                  max="99"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">ID Type</label>
                <select
                  value={idType}
                  onChange={(e) => setIdType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-willow-900 border border-slate-700 text-xs text-white focus:border-willow-emerald focus:outline-none"
                >
                  <option value="Aadhaar">Aadhaar Card</option>
                  <option value="Passport">Passport</option>
                  <option value="Driving License">Driving License</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">ID Number (Last 4 Digits)</label>
                <input
                  type="text"
                  placeholder="e.g. 7721"
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-willow-900 border border-slate-700 text-xs text-white focus:border-willow-emerald focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-willow-emerald text-black text-xs font-black shadow-glow-emerald hover:brightness-110 cursor-pointer"
              >
                Save Fan to Profile
              </button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {user.savedFans.map((fan) => (
            <div key={fan.id} className="p-4 rounded-2xl bg-willow-850/60 border border-slate-700/60 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-willow-emerald" /> {fan.name}
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Age: {fan.age} • {fan.gender}
                </p>
                <p className="text-[11px] text-willow-emerald font-mono mt-1">
                  {fan.idType}: {fan.idNumber}
                </p>
              </div>

              <button
                onClick={() => removeFan(fan.id)}
                title="Remove fan"
                className="p-2 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
};
