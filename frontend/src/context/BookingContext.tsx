import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Match, Stand, Seat, Booking, QueueState } from '../types';
import { api } from '../services/api';

interface BookingContextType {
  matches: Match[];
  activeMatch: Match | null;
  setActiveMatchById: (id: string) => void;
  selectedStand: Stand | null;
  setSelectedStand: (stand: Stand | null) => void;
  standSeats: Seat[];
  selectedSeats: Seat[];
  toggleSeatSelection: (seat: Seat) => Promise<boolean>;
  clearSelectedSeats: () => void;
  loadingSeats: boolean;
  
  lockTimeRemaining: number;
  isLockActive: boolean;
  startSeatLock: (seatIds: string[]) => Promise<void>;
  releaseSeatLock: () => Promise<void>;
  lockExpiredModal: boolean;
  closeLockExpiredModal: () => void;
  
  queueState: QueueState;
  joinQueue: (matchId: string) => void;
  leaveQueue: () => void;
  
  bookings: Booking[];
  createBooking: (fans: { name: string; age: number; idType: string; idNumber: string }[]) => Promise<Booking>;
  getBookingById: (id: string) => Booking | undefined;
  fetchMatches: () => Promise<void>;
  refreshBookings: () => Promise<void>;
  
  validateTicketQR: (token: string) => Promise<{ valid: boolean; booking?: Booking; message: string }>;
  currentRollingHash: string;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  
  const [matches, setMatches] = useState<Match[]>([]);
  const [activeMatch, setActiveMatch] = useState<Match | null>(null);
  const [selectedStand, setSelectedStand] = useState<Stand | null>(null);
  const [standSeats, setStandSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [loadingSeats, setLoadingSeats] = useState<boolean>(false);

  const [lockTimeRemaining, setLockTimeRemaining] = useState<number>(180);
  const [isLockActive, setIsLockActive] = useState<boolean>(false);
  const [lockExpiredModal, setLockExpiredModal] = useState<boolean>(false);

  const [queueState, setQueueState] = useState<QueueState>({
    isInQueue: false,
    matchId: null,
    position: 0,
    totalInQueue: 0,
    estimatedSeconds: 0,
    isTurnReady: false
  });

  const [currentRollingHash, setCurrentRollingHash] = useState<string>('WLW-' + Math.random().toString(36).substring(2, 9).toUpperCase());

  const [bookings, setBookings] = useState<Booking[]>([]);

  const fetchMatches = useCallback(async () => {
    try {
      const data = await api.getMatches();
      setMatches(data || []);
      if (data && data.length > 0) {
        setActiveMatch(data[0]);
        setSelectedStand(data[0].stands ? data[0].stands[0] : null);
      } else {
        setActiveMatch(null);
        setSelectedStand(null);
      }
    } catch (err) {
      console.error('Failed to fetch matches from backend:', err);
      setMatches([]);
    }
  }, []);

  const refreshBookings = useCallback(async () => {
    try {
      const data = await api.getUserBookings('');
      setBookings(data || []);
    } catch (err) {
      console.error('Failed to fetch bookings from backend:', err);
    }
  }, []);

  useEffect(() => {
    fetchMatches();
    refreshBookings();
  }, [fetchMatches, refreshBookings]);

  useEffect(() => {
    if (!activeMatch || !selectedStand) {
      setStandSeats([]);
      return;
    }
    let isMounted = true;
    const loadSeats = async () => {
      setLoadingSeats(true);
      try {
        const { seats } = await api.getStandSeats(activeMatch.id, selectedStand.id);
        if (isMounted) setStandSeats(seats || []);
      } catch (err) {
        console.error('Failed to fetch stand seats from backend:', err);
      } finally {
        if (isMounted) setLoadingSeats(false);
      }
    };
    loadSeats();
    return () => { isMounted = false; };
  }, [activeMatch, selectedStand]);

  useEffect(() => {
    const qrInterval = setInterval(() => {
      setCurrentRollingHash('WLW-' + Math.random().toString(36).substring(2, 9).toUpperCase() + '-' + Math.floor(Date.now() / 1000));
    }, 30000);
    return () => clearInterval(qrInterval);
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isLockActive && lockTimeRemaining > 0) {
      timer = setInterval(() => {
        setLockTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsLockActive(false);
            setSelectedSeats([]);
            setLockExpiredModal(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isLockActive, lockTimeRemaining]);

  useEffect(() => {
    let queueTimer: NodeJS.Timeout;
    if (queueState.isInQueue && !queueState.isTurnReady) {
      queueTimer = setInterval(() => {
        setQueueState((prev) => {
          if (prev.position <= 1) {
            clearInterval(queueTimer);
            return {
              ...prev,
              position: 1,
              estimatedSeconds: 0,
              isTurnReady: true
            };
          }
          const nextPos = Math.max(1, prev.position - Math.floor(1 + Math.random() * 3));
          return {
            ...prev,
            position: nextPos,
            estimatedSeconds: nextPos * 4
          };
        });
      }, 2500);
    }
    return () => clearInterval(queueTimer);
  }, [queueState.isInQueue, queueState.isTurnReady]);

  const setActiveMatchById = (id: string) => {
    const found = matches.find((m) => m.id === id);
    if (found) {
      setActiveMatch(found);
      setSelectedStand(found.stands ? found.stands[0] : null);
      setSelectedSeats([]);
    }
  };

  const startSeatLock = async (seatIds: string[]) => {
    if (!activeMatch || !selectedStand) return;
    try {
      await api.lockSeats(seatIds, 'fan_user_id', activeMatch.id, selectedStand.id);
      setLockTimeRemaining(180);
      setIsLockActive(true);
    } catch (err) {
      console.error('Backend lock failed:', err);
    }
  };

  const releaseSeatLock = async () => {
    try {
      const ids = selectedSeats.map((s) => s.id);
      if (ids.length > 0) await api.releaseSeats(ids);
      setIsLockActive(false);
      setLockTimeRemaining(180);
      setSelectedSeats([]);
    } catch (err) {
      console.error('Failed to release seats:', err);
    }
  };

  const closeLockExpiredModal = () => {
    setLockExpiredModal(false);
  };

  const toggleSeatSelection = async (seat: Seat): Promise<boolean> => {
    if (seat.status === 'booked' || seat.status === 'locked') {
      return false;
    }

    const isAlreadySelected = selectedSeats.some((s) => s.id === seat.id);

    if (isAlreadySelected) {
      const updated = selectedSeats.filter((s) => s.id !== seat.id);
      setSelectedSeats(updated);
      if (updated.length === 0) {
        await releaseSeatLock();
      }
      return true;
    }

    if (selectedSeats.length >= 4) {
      alert('🛡️ Anti-Scalping Limit: Maximum 4 tickets allowed per verified fan.');
      return false;
    }

    const newSelection = [...selectedSeats, { ...seat, status: 'selected' as const }];
    setSelectedSeats(newSelection);

    await startSeatLock(newSelection.map((s) => s.id));
    return true;
  };

  const clearSelectedSeats = () => {
    setSelectedSeats([]);
  };

  const joinQueue = (matchId: string) => {
    const startPos = Math.floor(8 + Math.random() * 8);
    setQueueState({
      isInQueue: true,
      matchId,
      position: startPos,
      totalInQueue: startPos + 40,
      estimatedSeconds: startPos * 4,
      isTurnReady: false
    });
  };

  const leaveQueue = () => {
    setQueueState({
      isInQueue: false,
      matchId: null,
      position: 0,
      totalInQueue: 0,
      estimatedSeconds: 0,
      isTurnReady: false
    });
  };

  const createBooking = async (
    fans: { name: string; age: number; idType: string; idNumber: string }[]
  ): Promise<Booking> => {
    if (!activeMatch || !selectedStand || selectedSeats.length === 0) {
      throw new Error('No active match or seats selected');
    }

    const response = await api.createBooking({
      matchId: activeMatch.id,
      standId: selectedStand.id,
      seats: selectedSeats,
      fans,
      userEmail: 'fan@gmail.com'
    });

    if (!response.success || !response.booking) {
      throw new Error(response.message || 'Failed to create booking');
    }

    const newBooking = response.booking;
    setBookings((prev) => [newBooking, ...prev]);
    setIsLockActive(false);
    setLockTimeRemaining(180);
    setSelectedSeats([]);

    const { seats } = await api.getStandSeats(activeMatch.id, selectedStand.id);
    setStandSeats(seats);

    return newBooking;
  };

  const getBookingById = (id: string): Booking | undefined => {
    return bookings.find((b) => b.id === id);
  };

  const validateTicketQR = async (token: string) => {
    try {
      const res = await api.validateGatePass(token);
      if (res.valid) {
        await refreshBookings();
      }
      return {
        valid: res.valid,
        booking: res.booking,
        message: res.message
      };
    } catch (err: any) {
      return {
        valid: false,
        message: 'Network error communicating with turnstile validator.'
      };
    }
  };

  return (
    <BookingContext.Provider
      value={{
        matches,
        activeMatch,
        setActiveMatchById,
        selectedStand,
        setSelectedStand,
        standSeats,
        selectedSeats,
        toggleSeatSelection,
        clearSelectedSeats,
        loadingSeats,
        lockTimeRemaining,
        isLockActive,
        startSeatLock,
        releaseSeatLock,
        lockExpiredModal,
        closeLockExpiredModal,
        queueState,
        joinQueue,
        leaveQueue,
        bookings,
        createBooking,
        getBookingById,
        fetchMatches,
        refreshBookings,
        validateTicketQR,
        currentRollingHash
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) throw new Error('useBooking must be used within a BookingProvider');
  return context;
};
