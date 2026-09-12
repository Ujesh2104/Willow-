import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, SavedFan } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; message?: string }>;
  register: (name: string, email: string, phone: string, password?: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  saveFan: (fan: Omit<SavedFan, 'id'>) => Promise<boolean>;
  removeFan: (id: string) => Promise<void>;
  sanitizeEmail: (email: string) => string;
  duplicateSessionAlert: boolean;
  clearDuplicateAlert: () => void;
  simulateDuplicateLogin: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const normalizeEmail = (rawEmail: string): string => {
  const trimmed = (rawEmail || '').trim().toLowerCase();
  const [localPart, domain] = trimmed.split('@');
  if (!localPart || !domain) return trimmed;

  if (domain === 'gmail.com' || domain === 'googlemail.com') {
    const cleanLocal = localPart.replace(/\./g, '').split('+')[0];
    return `${cleanLocal}@gmail.com`;
  }
  return trimmed;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('willow_active_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [duplicateSessionAlert, setDuplicateSessionAlert] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('willow_active_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('willow_active_user');
    }
  }, [user]);

  const sanitizeEmail = (email: string) => normalizeEmail(email);

  const login = async (email: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const res = await api.login(email);
      if (res.success && res.user) {
        setUser(res.user);
        setDuplicateSessionAlert(false);
        return { success: true };
      }
      return { success: false, message: res.message || 'Login failed' };
    } catch (err: any) {
      return { success: false, message: 'Cannot connect to backend server' };
    }
  };

  const register = async (name: string, email: string, phone: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const res = await api.register(name, email, phone);
      if (res.success) {
        return { success: true };
      }
      return { success: false, message: res.message || 'Registration failed' };
    } catch (err: any) {
      return { success: false, message: 'Server error during registration' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('willow_active_user');
    localStorage.removeItem('willow_bookings');
  };

  const saveFan = async (fanData: Omit<SavedFan, 'id'>): Promise<boolean> => {
    if (!user) return false;
    if (user.savedFans && user.savedFans.length >= 4) {
      alert('IRCTC-Style Rule: You can pre-save a maximum of 4 fans in your profile.');
      return false;
    }
    const newFan: SavedFan = {
      ...fanData,
      id: 'fan_' + Date.now()
    };
    const updatedFans = [...(user.savedFans || []), newFan];
    const updatedUser = { ...user, savedFans: updatedFans };

    setUser(updatedUser);
    await api.updateSavedFans(user.email, updatedFans);
    return true;
  };

  const removeFan = async (id: string) => {
    if (!user) return;
    const updatedFans = (user.savedFans || []).filter((f) => f.id !== id);
    setUser({ ...user, savedFans: updatedFans });
    await api.updateSavedFans(user.email, updatedFans);
  };

  const simulateDuplicateLogin = () => {
    setDuplicateSessionAlert(true);
    logout();
  };

  const clearDuplicateAlert = () => setDuplicateSessionAlert(false);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        saveFan,
        removeFan,
        sanitizeEmail,
        duplicateSessionAlert,
        clearDuplicateAlert,
        simulateDuplicateLogin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
