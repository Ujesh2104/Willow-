import { Match, Stand, Seat, Booking, User, SavedFan } from '../types';

const API_BASE_URL = 'http://localhost:5000/api';

export const api = {
  
  async getMatches(): Promise<Match[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/matches`);
      const data = await res.json();
      return data.matches || [];
    } catch (err) {
      console.error('API getMatches error:', err);
      return [];
    }
  },

  async getMatch(id: string): Promise<Match | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/matches/${id}`);
      const data = await res.json();
      return data.match || null;
    } catch (err) {
      return null;
    }
  },

  async getStandSeats(matchId: string, standId: string): Promise<{ stand: Stand; seats: Seat[] }> {
    try {
      const res = await fetch(`${API_BASE_URL}/matches/${matchId}/stands/${standId}/seats`);
      const data = await res.json();
      return { stand: data.stand, seats: data.seats || [] };
    } catch (err) {
      return { stand: null as any, seats: [] };
    }
  },

  async login(email: string): Promise<{ success: boolean; user: User; message?: string }> {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    return res.json();
  },

  async register(name: string, email: string, phone: string): Promise<{ success: boolean; user: User; message?: string }> {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone })
    });
    return res.json();
  },

  async updateSavedFans(email: string, fans: SavedFan[]): Promise<{ success: boolean; savedFans: SavedFan[] }> {
    const res = await fetch(`${API_BASE_URL}/auth/fans`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, fans })
    });
    return res.json();
  },

  async lockSeats(seatIds: string[], userId: string, matchId: string, standId: string): Promise<{ success: boolean; expiresAt: number; ttlSeconds: number; message?: string }> {
    const res = await fetch(`${API_BASE_URL}/bookings/lock`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ seatIds, userId, matchId, standId })
    });
    return res.json();
  },

  async releaseSeats(seatIds: string[]): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE_URL}/bookings/release`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ seatIds })
    });
    return res.json();
  },

  async createBooking(bookingData: {
    matchId: string;
    standId: string;
    seats: Seat[];
    fans: Array<{ name: string; age: number; idType: string; idNumber: string }>;
    userEmail: string;
  }): Promise<{ success: boolean; booking: Booking; message?: string }> {
    const res = await fetch(`${API_BASE_URL}/bookings/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData)
    });
    return res.json();
  },

  async getUserBookings(email: string): Promise<Booking[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/bookings/user/${email}`);
      const data = await res.json();
      return data.bookings || [];
    } catch (err) {
      return [];
    }
  },

  async validateGatePass(qrToken: string): Promise<{ success: boolean; valid: boolean; booking?: Booking; message: string }> {
    const res = await fetch(`${API_BASE_URL}/bookings/validate-gate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ qrToken })
    });
    return res.json();
  },

  async getAdminStats(): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/admin/stats`);
    const data = await res.json();
    return data.stats;
  },

  async getAllUsers(): Promise<User[]> {
    const res = await fetch(`${API_BASE_URL}/admin/users`);
    const data = await res.json();
    return data.users || [];
  },

  async createMatch(matchData: any): Promise<{ success: boolean; match: Match; message?: string }> {
    const res = await fetch(`${API_BASE_URL}/admin/matches`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(matchData)
    });
    return res.json();
  },

  async deleteMatch(matchId: string): Promise<{ success: boolean; message?: string }> {
    const res = await fetch(`${API_BASE_URL}/admin/matches/${matchId}`, {
      method: 'DELETE'
    });
    return res.json();
  },

  async updateMatchStands(matchId: string, payload: { venue?: string; city?: string; stands?: Stand[] }): Promise<{ success: boolean; match: Match; message?: string }> {
    const res = await fetch(`${API_BASE_URL}/admin/matches/${matchId}/stands`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  async sendTicketEmail(bookingId: string, recipientEmail?: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${API_BASE_URL}/admin/send-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookingId, recipientEmail })
    });
    return res.json();
  }
};
