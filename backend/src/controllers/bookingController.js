import { DB } from '../data/dbStore.js';

export const lockSeats = (req, res) => {
  const { seatIds, userId, matchId, standId } = req.body;

  if (!seatIds || !Array.isArray(seatIds) || seatIds.length === 0) {
    return res.status(400).json({ success: false, message: 'No seats provided' });
  }

  if (seatIds.length > 4) {
    return res.status(400).json({
      success: false,
      message: '🛡️ Anti-Scalping Limit: Maximum 4 tickets allowed per verified fan.'
    });
  }

  const now = Date.now();
  const ttlMs = 180 * 1000; 
  const expiresAt = now + ttlMs;

  for (const sId of seatIds) {
    const existingLock = DB.activeLocks[sId];
    if (existingLock && now < existingLock.expiresAt && existingLock.userId !== userId) {
      return res.status(409).json({
        success: false,
        message: `Seat ${sId} is currently held by another fan in checkout.`
      });
    }
  }

  seatIds.forEach((sId) => {
    DB.activeLocks[sId] = {
      userId: userId || 'anonymous_fan',
      lockedAt: now,
      expiresAt
    };
  });

  res.json({
    success: true,
    message: `${seatIds.length} seat(s) locked for 3 minutes`,
    lockedSeats: seatIds,
    expiresAt,
    ttlSeconds: 180
  });
};

export const releaseSeats = (req, res) => {
  const { seatIds } = req.body;
  if (seatIds && Array.isArray(seatIds)) {
    seatIds.forEach((sId) => delete DB.activeLocks[sId]);
  }
  res.json({ success: true, message: 'Seat locks released' });
};

export const createBooking = (req, res) => {
  const { matchId, standId, seats, fans, userEmail } = req.body;

  if (!matchId || !seats || seats.length === 0) {
    return res.status(400).json({ success: false, message: 'Invalid booking data' });
  }

  if (seats.length > 4) {
    return res.status(400).json({
      success: false,
      message: '🛡️ Anti-Scalp Violation: Cannot book more than 4 tickets.'
    });
  }

  const match = DB.matches.find((m) => m.id === matchId);
  if (!match) {
    return res.status(404).json({ success: false, message: 'Match not found' });
  }

  const stand = match.stands.find((s) => s.id === standId) || match.stands[0];
  const totalAmount = seats.reduce((acc, s) => acc + (s.price || stand.price), 0);

  const bookingId = 'pass_wlw_' + Math.floor(10000 + Math.random() * 90000);
  const qrToken = 'WLW-PASS-' + Math.floor(10000 + Math.random() * 90000);

  const key = `${matchId}_${stand.id}`;
  if (DB.seatMatrix[key]) {
    DB.seatMatrix[key] = DB.seatMatrix[key].map((seat) => {
      const isThisBooked = seats.some((s) => s.id === seat.id || (s.row === seat.row && s.number === seat.number));
      return isThisBooked ? { ...seat, status: 'booked' } : seat;
    });
  }

  seats.forEach((s) => delete DB.activeLocks[s.id]);

  const newBooking = {
    id: bookingId,
    matchId,
    matchTitle: match.title,
    venue: `${match.venue}, ${match.city}`,
    matchDateTime: match.matchDateTime,
    seats: seats.map((s) => ({
      standName: stand.name,
      bayNumber: s.bayNumber || 'Bay 1',
      row: s.row,
      number: s.number,
      price: s.price || stand.price
    })),
    fans: fans && fans.length > 0 ? fans : [
      { name: 'Primary Fan', age: 25, idType: 'Aadhaar', idNumber: '•••• •••• 9988' }
    ],
    totalAmount,
    userEmail: userEmail || 'rohit.fan@gmail.com',
    qrCodeToken: qrToken,
    status: 'CONFIRMED',
    gateDetails: {
      gateNumber: `Gate ${Math.floor(1 + Math.random() * 6)} (${stand.name.split(' ')[0]} Entry)`,
      turnstile: `T-${Math.floor(1 + Math.random() * 8)}`,
      entryTime: '05:00 PM Onwards'
    },
    createdAt: new Date().toISOString(),
    isPassUnlocked: true
  };

  DB.bookings.unshift(newBooking);

  if (match.remainingInventory >= seats.length) {
    match.remainingInventory -= seats.length;
  }

  res.status(201).json({
    success: true,
    message: 'Booking confirmed and locked in vault',
    booking: newBooking
  });
};

export const getUserBookings = (req, res) => {
  const { email } = req.params;
  const userBookings = DB.bookings.filter((b) => !email || b.userEmail === email);
  res.json({
    success: true,
    count: userBookings.length,
    bookings: userBookings.length > 0 ? userBookings : DB.bookings
  });
};

export const validateGatePass = (req, res) => {
  const { qrToken } = req.body;
  if (!qrToken) {
    return res.status(400).json({ success: false, message: 'QR Token is required' });
  }

  const token = qrToken.trim();
  const booking = DB.bookings.find((b) => b.qrCodeToken === token || b.id === token);

  if (!booking) {
    return res.status(404).json({
      success: false,
      valid: false,
      message: '❌ FORGED / INVALID PASS. Pass token not found in the match register.'
    });
  }

  if (booking.status === 'ATTENDED') {
    return res.status(409).json({
      success: false,
      valid: false,
      booking,
      message: '⚠️ DUPLICATE ENTRY ALERT! This ticket has already passed turnstile.'
    });
  }

  booking.status = 'ATTENDED';

  res.json({
    success: true,
    valid: true,
    booking,
    message: `✅ ACCESS GRANTED. Gate: ${booking.gateDetails.gateNumber} | ${booking.seats.length} Fan(s)`
  });
};
