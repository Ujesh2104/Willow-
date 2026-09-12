import { Match, Stand, Seat, Booking, User, SavedFan } from '../types';

const DEFAULT_REMOTE_API = 'https://willow-wfjv.onrender.com/api';
const DEFAULT_LOCAL_API = 'http://localhost:5000/api';

const getBaseUrl = (): string => {
  if (import.meta.env.VITE_API_URL) {
    return (import.meta.env.VITE_API_URL as string).replace(/\/+$/, '');
  }
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return DEFAULT_LOCAL_API;
    }
  }
  return DEFAULT_REMOTE_API;
};

const API_BASE_URL = getBaseUrl();

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const primaryUrl = `${API_BASE_URL}${path}`;
  try {
    const res = await fetch(primaryUrl, options);
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const data = await res.json();
      return data;
    }
    const text = await res.text();
    return { success: res.ok, message: text || `HTTP ${res.status}` } as any;
  } catch (primaryErr: any) {
    // If primary failed (e.g., localhost is unreachable), try the live Render backend
    if (API_BASE_URL !== DEFAULT_REMOTE_API) {
      try {
        const fallbackUrl = `${DEFAULT_REMOTE_API}${path}`;
        const res = await fetch(fallbackUrl, options);
        const contentType = res.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const data = await res.json();
          return data;
        }
        const text = await res.text();
        return { success: res.ok, message: text || `HTTP ${res.status}` } as any;
      } catch (fallbackErr: any) {
        throw new Error(fallbackErr?.message || 'Unable to reach Willow Ticket API');
      }
    }
    throw new Error(primaryErr?.message || 'Network error connecting to Willow API');
  }
}

export const api = {
  
  async getMatches(): Promise<Match[]> {
    try {
      const data = await request<{ success: boolean; matches: Match[] }>('/matches');
      return data.matches || [];
    } catch (err) {
      console.error('API getMatches error:', err);
      return [];
    }
  },

  async getMatch(id: string): Promise<Match | null> {
    try {
      const data = await request<{ success: boolean; match: Match }>(`/matches/${id}`);
      return data.match || null;
    } catch (err) {
      return null;
    }
  },

  async getStandSeats(matchId: string, standId: string): Promise<{ stand: Stand; seats: Seat[] }> {
    try {
      const data = await request<{ stand: Stand; seats: Seat[] }>(`/matches/${matchId}/stands/${standId}/seats`);
      return { stand: data.stand, seats: data.seats || [] };
    } catch (err) {
      return { stand: null as any, seats: [] };
    }
  },

  async login(email: string): Promise<{ success: boolean; user: User; message?: string }> {
    return request<{ success: boolean; user: User; message?: string }>('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
  },

  async register(name: string, email: string, phone: string): Promise<{ success: boolean; user?: User; message?: string }> {
    return request<{ success: boolean; user?: User; message?: string }>('/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone })
    });
  },

  async updateSavedFans(email: string, fans: SavedFan[]): Promise<{ success: boolean; savedFans: SavedFan[] }> {
    return request<{ success: boolean; savedFans: SavedFan[] }>('/auth/fans', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, fans })
    });
  },

  async lockSeats(seatIds: string[], userId: string, matchId: string, standId: string): Promise<{ success: boolean; expiresAt: number; ttlSeconds: number; message?: string }> {
    return request<{ success: boolean; expiresAt: number; ttlSeconds: number; message?: string }>('/bookings/lock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ seatIds, userId, matchId, standId })
    });
  },

  async releaseSeats(seatIds: string[]): Promise<{ success: boolean }> {
    return request<{ success: boolean }>('/bookings/release', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ seatIds })
    });
  },

  async createBooking(bookingData: {
    matchId: string;
    standId: string;
    seats: Seat[];
    fans: Array<{ name: string; age: number; idType: string; idNumber: string }>;
    userEmail: string;
  }): Promise<{ success: boolean; booking: Booking; message?: string }> {
    return request<{ success: boolean; booking: Booking; message?: string }>('/bookings/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData)
    });
  },

  async getUserBookings(email: string): Promise<Booking[]> {
    try {
      const data = await request<{ success: boolean; bookings: Booking[] }>(`/bookings/user/${email}`);
      return data.bookings || [];
    } catch (err) {
      return [];
    }
  },

  async validateGatePass(qrToken: string): Promise<{ success: boolean; valid: boolean; booking?: Booking; message: string }> {
    return request<{ success: boolean; valid: boolean; booking?: Booking; message: string }>('/bookings/validate-gate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ qrToken })
    });
  },

  async getAdminStats(): Promise<any> {
    const data = await request<{ success: boolean; stats: any }>('/admin/stats');
    return data.stats;
  },

  async getAllUsers(): Promise<User[]> {
    const data = await request<{ success: boolean; users: User[] }>('/admin/users');
    return data.users || [];
  },

  async createMatch(matchData: any): Promise<{ success: boolean; match: Match; message?: string }> {
    return request<{ success: boolean; match: Match; message?: string }>('/admin/matches', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(matchData)
    });
  },

  async deleteMatch(matchId: string): Promise<{ success: boolean; message?: string }> {
    return request<{ success: boolean; message?: string }>(`/admin/matches/${matchId}`, {
      method: 'DELETE'
    });
  },

  async updateMatchStands(matchId: string, payload: { venue?: string; city?: string; stands?: Stand[] }): Promise<{ success: boolean; match: Match; message?: string }> {
    return request<{ success: boolean; match: Match; message?: string }>(`/admin/matches/${matchId}/stands`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  },

  async sendTicketEmail(payload: { bookingId?: string; recipientEmail?: string; subject?: string; message?: string } | string, recipientEmail?: string): Promise<{ success: boolean; message: string }> {
    const body = typeof payload === 'string' 
      ? { bookingId: payload, recipientEmail } 
      : payload;

    return request<{ success: boolean; message: string }>('/admin/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
  }
};
