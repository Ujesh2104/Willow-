import { DB } from '../data/dbStore.js';

export const createMatch = (req, res) => {
  const { title, tournament, venue, city, matchDateTime, dropDeadlineTime, stands } = req.body;

  if (!title || !venue || !stands || stands.length === 0) {
    return res.status(400).json({ success: false, message: 'Title, venue, and stands are required' });
  }

  const newMatchId = 'match-' + Date.now().toString(36);
  const totalSeats = stands.reduce((acc, s) => acc + (Number(s.totalSeats) || 30), 0);

  const newMatch = {
    id: newMatchId,
    title,
    tournament: tournament || 'ICC World Stadium Cup 2026',
    teams: {
      teamA: { name: 'India', short: 'IND', flag: '🇮🇳' },
      teamB: { name: 'Australia', short: 'AUS', flag: '🇦🇺' }
    },
    venue,
    city: city || 'Mumbai',
    matchDateTime: matchDateTime || 'Tonight, 07:30 PM IST',
    dropDeadlineTime: dropDeadlineTime || '9:00 PM IST',
    isDropLive: true,
    isFlashPortal: false,
    totalInventory: totalSeats,
    remainingInventory: totalSeats,
    stands: stands.map((s, idx) => ({
      id: `stand-${newMatchId}-${idx}`,
      name: s.name || `Wing ${idx + 1}`,
      category: s.category || 'Pavilion',
      price: Number(s.price) || 2500,
      totalSeats: Number(s.totalSeats) || 30,
      availableSeats: Number(s.totalSeats) || 30,
      color: s.color || '#10b981',
      description: s.description || 'Premium stadium view stand'
    }))
  };

  DB.matches.unshift(newMatch);

  res.status(201).json({
    success: true,
    message: 'New Match Drop posted successfully',
    match: newMatch
  });
};

export const deleteMatch = (req, res) => {
  const { id } = req.params;
  const initialLength = DB.matches.length;
  DB.matches = DB.matches.filter((m) => m.id !== id);

  if (DB.matches.length === initialLength) {
    return res.status(404).json({ success: false, message: 'Match not found' });
  }

  res.json({
    success: true,
    message: 'Match booking closed and removed from active portal'
  });
};

export const updateMatchStands = (req, res) => {
  const { id } = req.params;
  const { venue, city, stands } = req.body;

  const match = DB.matches.find((m) => m.id === id);
  if (!match) {
    return res.status(404).json({ success: false, message: 'Match not found' });
  }

  if (venue) match.venue = venue;
  if (city) match.city = city;
  if (stands && Array.isArray(stands)) {
    match.stands = stands;
  }

  res.json({
    success: true,
    message: 'Match venue and wing prices updated successfully',
    match
  });
};

export const getAllUsers = (req, res) => {
  res.json({
    success: true,
    count: DB.users.length,
    users: DB.users
  });
};

export const sendTicketEmail = (req, res) => {
  const { bookingId, recipientEmail } = req.body;

  const booking = DB.bookings.find((b) => b.id === bookingId);
  if (!booking) {
    return res.status(404).json({ success: false, message: 'Booking not found' });
  }

  const targetEmail = recipientEmail || booking.userEmail;

  res.json({
    success: true,
    message: `✉️ Digital Match Pass #${booking.id} dispatched to ${targetEmail} with Dynamic Rolling QR Pass.`,
    dispatchedTo: targetEmail,
    timestamp: new Date().toISOString()
  });
};

export const getAdminStats = (req, res) => {
  const totalRevenue = DB.bookings.reduce((acc, b) => acc + b.totalAmount, 0);
  const totalTicketsSold = DB.bookings.reduce((acc, b) => acc + b.seats.length, 0);
  const activeLockCount = Object.keys(DB.activeLocks).length;

  res.json({
    success: true,
    stats: {
      totalMatches: DB.matches.length,
      totalUsers: DB.users.length,
      totalBookings: DB.bookings.length,
      totalTicketsSold,
      totalRevenue,
      activeLocks: activeLockCount
    }
  });
};
