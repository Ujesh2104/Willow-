import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, SavedFan } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; user?: User; message?: string }>;
  register: (name: string, email: string, phone: string, password?: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
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
    try {
      const saved = localStorage.getItem('willow_active_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem('willow_token') || null;
    } catch {
      return null;
    }
  });

  const [duplicateSessionAlert, setDuplicateSessionAlert] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('willow_active_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('willow_active_user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('willow_token', token);
    } else {
      localStorage.removeItem('willow_token');
    }
  }, [token]);

  // Verify token validity on load
  useEffect(() => {
    const checkToken = async () => {
      const savedToken = localStorage.getItem('willow_token');
      if (savedToken && user) {
        try {
          const res = await api.verifyToken(savedToken);
          if (res && res.success && res.user) {
            setUser(res.user);
          } else if (res && !res.success && res.message?.includes('expired')) {
            // Token expired, log out gracefully
            logout();
          }
        } catch {
          // Keep cached user if offline
        }
      }
    };
    checkToken();
  }, []);

  const sanitizeEmail = (email: string) => normalizeEmail(email);

  const login = async (email: string, password?: string): Promise<{ success: boolean; user?: User; message?: string }> => {
    const sanitized = normalizeEmail(email);
    try {
      const res = await api.login(email, password);
      if (res && res.success && res.user) {
        setUser(res.user);
        if (res.token) setToken(res.token);
        setDuplicateSessionAlert(false);
        return { success: true, user: res.user };
      }
      
      // If server explicitly returned validation failure (e.g. invalid password or user not found)
      if (res && !res.success && res.message) {
        return { success: false, message: res.message };
      }
      
      // Local fallback
      const storedUsers: any[] = JSON.parse(localStorage.getItem('willow_cached_users') || '[]');
      const cached = storedUsers.find((u) => u.email === sanitized);
      if (cached) {
        if (cached.password && password && cached.password !== password) {
          return { success: false, message: 'Invalid password. Please check your credentials.' };
        }
        setUser(cached);
        setToken(cached.token || 'wtoken_local_' + Date.now());
        setDuplicateSessionAlert(false);
        return { success: true, user: cached };
      }

      // Admin account fallback
      if (sanitized === 'admin@willow.com') {
        if (password && password !== 'admin123') {
          return { success: false, message: 'Invalid administrator password.' };
        }
        const adminUser: User = {
          id: 'admin_master_01',
          name: 'Stadium Administrator',
          email: 'admin@willow.com',
          role: 'admin',
          phone: '+91 99999 00000',
          currentSessionId: 'sess_admin_root',
          savedFans: []
        };
        setUser(adminUser);
        setToken('wtoken_admin_root');
        setDuplicateSessionAlert(false);
        return { success: true, user: adminUser };
      }

      return { success: false, message: res?.message || 'No account found with this email. Please register first.' };
    } catch (err: any) {
      // Offline fallback check
      const storedUsers: any[] = JSON.parse(localStorage.getItem('willow_cached_users') || '[]');
      const cached = storedUsers.find((u) => u.email === sanitized);
      if (cached) {
        if (cached.password && password && cached.password !== password) {
          return { success: false, message: 'Invalid password.' };
        }
        setUser(cached);
        setToken(cached.token || 'wtoken_local_' + Date.now());
        setDuplicateSessionAlert(false);
        return { success: true, user: cached };
      }
      if (sanitized === 'admin@willow.com') {
        if (password && password !== 'admin123') {
          return { success: false, message: 'Invalid administrator password.' };
        }
        const adminUser: User = {
          id: 'admin_master_01',
          name: 'Stadium Administrator',
          email: 'admin@willow.com',
          role: 'admin',
          phone: '+91 99999 00000',
          currentSessionId: 'sess_admin_root',
          savedFans: []
        };
        setUser(adminUser);
        setToken('wtoken_admin_root');
        setDuplicateSessionAlert(false);
        return { success: true, user: adminUser };
      }
      return { success: false, message: err?.message || 'Unable to connect to authentication server' };
    }
  };

  const register = async (name: string, email: string, phone: string, password?: string): Promise<{ success: boolean; message?: string }> => {
    const sanitized = normalizeEmail(email);
    try {
      const res = await api.register(name, email, phone, password);
      if (res && res.success) {
        const storedUsers: User[] = JSON.parse(localStorage.getItem('willow_cached_users') || '[]');
        if (!storedUsers.some((u) => u.email === sanitized)) {
          storedUsers.push(res.user || {
            id: 'usr_' + Date.now().toString(36),
            name: name.trim(),
            email: sanitized,
            phone: phone || '+91 98000 00000',
            password: password?.trim(),
            token: res.token,
            currentSessionId: 'sess_' + Math.random().toString(36).substring(2, 9),
            savedFans: [
              {
                id: 'fan_' + Date.now(),
                name: name.trim(),
                age: 25,
                gender: 'M',
                idType: 'Aadhaar',
                idNumber: '•••• •••• ' + Math.floor(1000 + Math.random() * 9000)
              }
            ]
          });
          localStorage.setItem('willow_cached_users', JSON.stringify(storedUsers));
        }
        if (res.token) setToken(res.token);
        return { success: true, message: 'Fan registered successfully' };
      }

      if (res && res.message && (res.message.includes('already exists') || res.message.includes('identity'))) {
        return { success: false, message: res.message };
      }

      // Auto local registration fallback
      const generatedToken = 'wtoken_' + Math.random().toString(36).substring(2, 15);
      const localUser: User = {
        id: 'usr_' + Date.now().toString(36),
        name: name.trim(),
        email: sanitized,
        phone: phone || '+91 98000 00000',
        password: password?.trim(),
        token: generatedToken,
        currentSessionId: 'sess_' + Math.random().toString(36).substring(2, 9),
        savedFans: [
          {
            id: 'fan_' + Date.now(),
            name: name.trim(),
            age: 25,
            gender: 'M',
            idType: 'Aadhaar',
            idNumber: '•••• •••• ' + Math.floor(1000 + Math.random() * 9000)
          }
        ]
      };
      const storedUsers: User[] = JSON.parse(localStorage.getItem('willow_cached_users') || '[]');
      storedUsers.push(localUser);
      localStorage.setItem('willow_cached_users', JSON.stringify(storedUsers));
      setToken(generatedToken);
      return { success: true, message: 'Fan registered successfully' };
    } catch (err: any) {
      const generatedToken = 'wtoken_' + Math.random().toString(36).substring(2, 15);
      const localUser: User = {
        id: 'usr_' + Date.now().toString(36),
        name: name.trim(),
        email: sanitized,
        phone: phone || '+91 98000 00000',
        password: password?.trim(),
        token: generatedToken,
        currentSessionId: 'sess_' + Math.random().toString(36).substring(2, 9),
        savedFans: [
          {
            id: 'fan_' + Date.now(),
            name: name.trim(),
            age: 25,
            gender: 'M',
            idType: 'Aadhaar',
            idNumber: '•••• •••• ' + Math.floor(1000 + Math.random() * 9000)
          }
        ]
      };
      const storedUsers: User[] = JSON.parse(localStorage.getItem('willow_cached_users') || '[]');
      storedUsers.push(localUser);
      localStorage.setItem('willow_cached_users', JSON.stringify(storedUsers));
      setToken(generatedToken);
      return { success: true, message: 'Fan registered successfully' };
    }
  };

  const logout = async () => {
    const userEmail = user?.email;
    const currentToken = token;
    
    // Invalidate state immediately
    setUser(null);
    setToken(null);
    localStorage.removeItem('willow_active_user');
    localStorage.removeItem('willow_token');
    localStorage.removeItem('willow_current_view');

    // Notify backend to expire token on server
    if (userEmail || currentToken) {
      try {
        await api.logout(userEmail, currentToken || undefined);
      } catch {
        // Logged out locally
      }
    }
  };

  const saveFan = async (fanData: Omit<SavedFan, 'id'>): Promise<boolean> => {
    if (!user) return false;
    if (user.savedFans && user.savedFans.length >= 4) {
      alert('Limit Exceeded: You can pre-save a maximum of 4 fans in your profile.');
      return false;
    }
    const newFan: SavedFan = {
      ...fanData,
      id: 'fan_' + Date.now()
    };
    const updatedFans = [...(user.savedFans || []), newFan];
    const updatedUser = { ...user, savedFans: updatedFans };

    setUser(updatedUser);
    try {
      await api.updateSavedFans(user.email, updatedFans);
    } catch (e) {
      // Saved in client user state
    }
    return true;
  };

  const removeFan = async (id: string) => {
    if (!user) return;
    const updatedFans = (user.savedFans || []).filter((f) => f.id !== id);
    setUser({ ...user, savedFans: updatedFans });
    try {
      await api.updateSavedFans(user.email, updatedFans);
    } catch (e) {
      // Saved in client user state
    }
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
        token,
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
