export interface SavedFan {
  id: string;
  name: string;
  age: number;
  gender: 'M' | 'F' | 'Other';
  idType: 'Aadhaar' | 'Passport' | 'Driving License';
  idNumber: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role?: 'admin' | 'fan';
  token?: string;
  tokenExpiresAt?: number;
  password?: string;
  govIdHash?: string;
  currentSessionId: string;
  savedFans: SavedFan[];
}

export type SeatStatus = 'available' | 'locked' | 'booked' | 'selected';

export interface Seat {
  id: string;
  standId: string;
  bayNumber: string;
  row: string;
  number: number;
  price: number;
  status: SeatStatus;
  lockedBy?: string;
  lockExpiresAt?: number;
}

export interface Stand {
  id: string;
  name: string;
  category: 'VIP Hospitality' | 'Pavilion' | 'Premium Tier' | 'Boundary Terrace';
  price: number;
  totalSeats: number;
  availableSeats: number;
  color: string;
  description: string;
}

export interface Match {
  id: string;
  title: string;
  teams: {
    teamA: { name: string; short: string; flag: string; color: string };
    teamB: { name: string; short: string; flag: string; color: string };
  };
  tournament: string;
  venue: string;
  city: string;
  matchDateTime: string;
  dropDeadlineTime: string; 
  isDropLive: boolean;
  isFlashPortal: boolean;
  totalInventory: number;
  remainingInventory: number;
  stands: Stand[];
}

export interface Booking {
  id: string;
  matchId: string;
  matchTitle: string;
  venue: string;
  matchDateTime: string;
  seats: {
    standName: string;
    bayNumber: string;
    row: string;
    number: number;
    price: number;
  }[];
  fans: {
    name: string;
    age: number;
    idType: string;
    idNumber: string;
  }[];
  totalAmount: number;
  userEmail: string;
  qrCodeToken: string;
  status: 'CONFIRMED' | 'ATTENDED' | 'CANCELLED';
  gateDetails: {
    gateNumber: string;
    turnstile: string;
    entryTime: string;
  };
  createdAt: string;
  isPassUnlocked: boolean; 
}

export interface QueueState {
  isInQueue: boolean;
  matchId: string | null;
  position: number;
  totalInQueue: number;
  estimatedSeconds: number;
  isTurnReady: boolean;
}
