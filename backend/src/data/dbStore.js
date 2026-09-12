
export const DB = {
  
  users: [
    {
      id: 'admin_master_01',
      name: 'Stadium Administrator',
      email: 'admin@willow.com',
      phone: '+91 99999 00000',
      currentSessionId: 'sess_admin_root',
      savedFans: []
    }
  ],

  matches: [],

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
