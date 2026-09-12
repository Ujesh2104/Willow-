import { DB, getOrGenerateSeats } from '../data/dbStore.js';

export const getAllMatches = (req, res) => {
  res.json({
    success: true,
    count: DB.matches.length,
    matches: DB.matches
  });
};

export const getMatchById = (req, res) => {
  const match = DB.matches.find((m) => m.id === req.params.id);
  if (!match) {
    return res.status(404).json({ success: false, message: 'Match not found' });
  }
  res.json({ success: true, match });
};

export const getStandSeats = (req, res) => {
  const { matchId, standId } = req.params;
  const match = DB.matches.find((m) => m.id === matchId);
  if (!match) {
    return res.status(404).json({ success: false, message: 'Match not found' });
  }

  const stand = match.stands.find((s) => s.id === standId);
  if (!stand) {
    return res.status(404).json({ success: false, message: 'Stand not found' });
  }

  const seats = getOrGenerateSeats(matchId, standId, stand.price);
  res.json({
    success: true,
    stand,
    seats
  });
};
