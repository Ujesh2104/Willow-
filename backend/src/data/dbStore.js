export const DB = {
  users: [
    {
      id: 'admin_master_01',
      name: 'Stadium Administrator',
      email: 'admin@willow.com',
      password: 'admin123',
      role: 'admin',
      phone: '+91 99999 00000',
      currentSessionId: 'sess_admin_root',
      savedFans: []
    },
    {
      id: 'fan_demo_01',
      name: 'Virat Sharma (Demo Fan)',
      email: 'fan@willow.com',
      password: 'fan123',
      role: 'fan',
      phone: '+91 98200 88412',
      currentSessionId: 'sess_fan_demo',
      savedFans: [
        {
          id: 'fan_01',
          name: 'Virat Sharma',
          age: 28,
          gender: 'M',
          idType: 'Aadhaar',
          idNumber: '•••• •••• 4421'
        },
        {
          id: 'fan_02',
          name: 'Priya Sharma',
          age: 26,
          gender: 'F',
          idType: 'Passport',
          idNumber: '•••• •••• 8812'
        },
        {
          id: 'fan_03',
          name: 'Aarav Sharma',
          age: 8,
          gender: 'M',
          idType: 'Aadhaar',
          idNumber: '•••• •••• 1920'
        }
      ]
    }
  ],

  matches: [
    {
      id: 'match-icc-final-2026',
      title: 'India vs Australia — T20 Super Series Final',
      tournament: 'ICC Champions Trophy 2026',
      teams: {
        teamA: { name: 'India', short: 'IND', flag: '🇮🇳', color: '#1d4ed8' },
        teamB: { name: 'Australia', short: 'AUS', flag: '🇦🇺', color: '#eab308' }
      },
      venue: 'Eden Gardens Stadium',
      city: 'Kolkata',
      matchDateTime: '20 Sep, 07:30 PM IST',
      dropDeadlineTime: '9:00 PM IST',
      isDropLive: true,
      isFlashPortal: false,
      totalInventory: 120,
      remainingInventory: 114,
      stands: [
        { id: 'stand_1', name: 'Club House VIP Pavilion', category: 'VIP Hospitality', price: 14000, totalSeats: 30, availableSeats: 28, color: '#f59e0b', description: 'Center pavilion with luxury hospitality lounge and priority fast-track turnstile.' },
        { id: 'stand_2', name: 'B-Block North Stand (Tier 1)', category: 'Pavilion', price: 4800, totalSeats: 30, availableSeats: 29, color: '#10b981', description: 'Direct behind bowler arm view with sheltered tier seating.' },
        { id: 'stand_3', name: 'C-Block East Terrace', category: 'Premium Tier', price: 2900, totalSeats: 30, availableSeats: 27, color: '#06b6d4', description: 'Elevated panoramic stadium sightlines across long-on boundary.' },
        { id: 'stand_4', name: 'D-Block Boundary Stand', category: 'Boundary Terrace', price: 1900, totalSeats: 30, availableSeats: 30, color: '#8b5cf6', description: 'Electric matchday fan gallery directly alongside boundary rope.' }
      ]
    }
  ],

  seatMatrix: {},

  activeLocks: {},

  bookings: []
};

export const getOrGenerateSeats = (matchId, standId, basePrice) => {
  const key = `${matchId}_${standId}`;
  if (!DB.seatMatrix[key]) {
    const seats = [];
    const rows = ['A', 'B', 'C'];
    const bays = ['Bay 1', 'Bay 2'];

    bays.forEach((bay) => {
      rows.forEach((row) => {
        for (let num = 1; num <= 5; num++) {
          const seatId = `${standId}-${bay.replace(' ', '')}-${row}${num}`;
          seats.push({
            id: seatId,
            standId,
            bayNumber: bay,
            row,
            number: num,
            price: basePrice,
            status: 'available'
          });
        }
      });
    });
    DB.seatMatrix[key] = seats;
  }

  const now = Date.now();
  const seats = DB.seatMatrix[key];
  return seats.map((seat) => {
    if (seat.status === 'booked') return seat;

    const lock = DB.activeLocks[seat.id];
    if (lock) {
      if (now > lock.expiresAt) {
        delete DB.activeLocks[seat.id];
        return { ...seat, status: 'available' };
      }
      return { ...seat, status: 'locked', lockedBy: lock.userId, lockExpiresAt: lock.expiresAt };
    }
    return { ...seat, status: 'available' };
  });
};
