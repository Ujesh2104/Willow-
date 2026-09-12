import { Match } from '../types';

export const MOCK_MATCHES: Match[] = [
  {
    id: 'match-ind-aus-final',
    title: 'India vs Australia — World Stadium Cup Grand Final',
    tournament: 'ICC World Stadium Cup 2026',
    teams: {
      teamA: { name: 'India', short: 'IND', flag: '🇮🇳', color: '#1d4ed8' },
      teamB: { name: 'Australia', short: 'AUS', flag: '🇦🇺', color: '#eab308' }
    },
    venue: 'Wankhede Cricket Stadium',
    city: 'Mumbai',
    matchDateTime: 'Tonight, 07:30 PM IST',
    dropDeadlineTime: '9:00 PM IST',
    isDropLive: true,
    isFlashPortal: false,
    totalInventory: 32000,
    remainingInventory: 142,
    stands: [
      {
        id: 'stand-pavilion',
        name: 'Sachin Tendulkar Grand Pavilion',
        category: 'VIP Hospitality',
        price: 12500,
        totalSeats: 250,
        availableSeats: 12,
        color: '#f59e0b',
        description: 'Direct pitch-facing luxury cushioned lounge with corporate hospitality dining.'
      },
      {
        id: 'stand-north',
        name: 'Sunil Gavaskar North Stand (Tier 1)',
        category: 'Pavilion',
        price: 4500,
        totalSeats: 600,
        availableSeats: 38,
        color: '#10b981',
        description: 'Behind the bowler arm view with electric crowd chanting & stadium atmosphere.'
      },
      {
        id: 'stand-east',
        name: 'Garware East Terrace (Tier 2)',
        category: 'Premium Tier',
        price: 2800,
        totalSeats: 800,
        availableSeats: 64,
        color: '#06b6d4',
        description: 'Elevated panoramic boundary line sight with rapid gate 4 turnstile access.'
      },
      {
        id: 'stand-west',
        name: 'Vijay Merchant West Wing',
        category: 'Boundary Terrace',
        price: 1800,
        totalSeats: 900,
        availableSeats: 28,
        color: '#8b5cf6',
        description: 'Vibrant fan stand with prime straight boundary catch zone.'
      }
    ]
  },
  {
    id: 'match-csk-mi-clasico',
    title: 'Chennai Super Kings vs Mumbai Indians',
    tournament: 'Indian Premier League — Rivalry Week',
    teams: {
      teamA: { name: 'Chennai Super Kings', short: 'CSK', flag: '🦁', color: '#facc15' },
      teamB: { name: 'Mumbai Indians', short: 'MI', flag: '🔷', color: '#0284c7' }
    },
    venue: 'MA Chidambaram Stadium (Chepauk)',
    city: 'Chennai',
    matchDateTime: 'Tomorrow, 07:30 PM IST',
    dropDeadlineTime: '9:00 PM IST',
    isDropLive: true,
    isFlashPortal: false,
    totalInventory: 38000,
    remainingInventory: 260,
    stands: [
      {
        id: 'stand-csk-anna',
        name: 'Anna Pavilion VIP Lounge',
        category: 'VIP Hospitality',
        price: 9500,
        totalSeats: 300,
        availableSeats: 24,
        color: '#f59e0b',
        description: 'Chepauk historic players pavilion viewing gallery.'
      },
      {
        id: 'stand-csk-c-lower',
        name: 'C-Lower Whistle Podu Stand',
        category: 'Pavilion',
        price: 3500,
        totalSeats: 750,
        availableSeats: 92,
        color: '#10b981',
        description: 'The loudest yellow sea stand with drums and live band.'
      },
      {
        id: 'stand-csk-d-upper',
        name: 'D-Upper Sea Breeze Terrace',
        category: 'Premium Tier',
        price: 2200,
        totalSeats: 850,
        availableSeats: 144,
        color: '#06b6d4',
        description: 'Bay of Bengal sea breeze vantage with clear square boundary sight.'
      }
    ]
  },
  {
    id: 'match-rcb-kkr-flash',
    title: 'Royal Challengers Bengaluru vs Kolkata Knight Riders',
    tournament: 'Indian Premier League — High-Octane Clash',
    teams: {
      teamA: { name: 'Royal Challengers Bengaluru', short: 'RCB', flag: '🔴', color: '#dc2626' },
      teamB: { name: 'Kolkata Knight Riders', short: 'KKR', flag: '🟣', color: '#7e22ce' }
    },
    venue: 'M. Chinnaswamy Stadium',
    city: 'Bengaluru',
    matchDateTime: '14 Sep, 07:30 PM IST',
    dropDeadlineTime: '9:00 PM IST',
    isDropLive: false,
    isFlashPortal: true, 
    totalInventory: 35000,
    remainingInventory: 48,
    stands: [
      {
        id: 'stand-rcb-corporate',
        name: 'P-Corporate Hospitality Stand',
        category: 'VIP Hospitality',
        price: 8500,
        totalSeats: 200,
        availableSeats: 8,
        color: '#f59e0b',
        description: 'Sixer landing zone with unlimited hospitality passes.'
      },
      {
        id: 'stand-rcb-b-stand',
        name: 'B-Stand 12th Man Army',
        category: 'Pavilion',
        price: 3200,
        totalSeats: 600,
        availableSeats: 40,
        color: '#10b981',
        description: 'Heart of the Bengaluru crowd behind the long-on boundary.'
      }
    ]
  }
];
