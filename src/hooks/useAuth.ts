import { useState, useEffect, useCallback } from 'react';
import type { User, SyncData } from '@/types';

const STORAGE_KEY = 'focusflow_auth';
const USERS_KEY = 'focusflow_users';

interface StoredUser {
  id: string;
  username: string;
  password: string;
  createdAt: number;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setUser(parsed);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const getUsers = (): StoredUser[] => {
    const saved = localStorage.getItem(USERS_KEY);
    return saved ? JSON.parse(saved) : [];
  };

  const saveUsers = (users: StoredUser[]) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  };

  const signup = useCallback(async (username: string, password: string): Promise<boolean> => {
    setError(null);
    
    const users = getUsers();
    
    // Check if username exists
    if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
      setError('Username already exists');
      return false;
    }

    // Validate
    if (username.length < 3) {
      setError('Username must be at least 3 characters');
      return false;
    }
    if (password.length < 4) {
      setError('Password must be at least 4 characters');
      return false;
    }

    // Create user
    const newUser: StoredUser = {
      id: crypto.randomUUID(),
      username: username.trim(),
      password, // In a real app, this would be hashed
      createdAt: Date.now(),
    };

    users.push(newUser);
    saveUsers(users);

    // Auto-login
    const sessionUser: User = {
      id: newUser.id,
      username: newUser.username,
      createdAt: newUser.createdAt,
    };

    setUser(sessionUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionUser));
    
    // Initialize empty sync data for new user
    const syncData: SyncData = {
      user: sessionUser,
      tasks: [],
      sessions: [],
      subjects: [],
      stats: {
        totalSessions: 0,
        totalFocusTime: 0,
        currentStreak: 0,
        tasksCompleted: 0,
        treesGrown: 0,
      },
      settings: {
        soundEnabled: true,
        notificationsEnabled: false,
        autoStartBreaks: false,
        autoStartPomodoros: false,
        theme: 'system',
        rainSoundEnabled: false,
        rainVolume: 0.3,
      },
      timerConfig: {
        work: 25 * 60,
        shortBreak: 5 * 60,
        longBreak: 15 * 60,
      },
      lastUpdated: Date.now(),
    };
    
    localStorage.setItem(`focusflow_sync_${sessionUser.id}`, JSON.stringify(syncData));

    return true;
  }, []);

  const login = useCallback(async (username: string, password: string): Promise<boolean> => {
    setError(null);
    
    const users = getUsers();
    const storedUser = users.find(
      u => u.username.toLowerCase() === username.toLowerCase() && u.password === password
    );

    if (!storedUser) {
      setError('Invalid username or password');
      return false;
    }

    const sessionUser: User = {
      id: storedUser.id,
      username: storedUser.username,
      createdAt: storedUser.createdAt,
    };

    setUser(sessionUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionUser));

    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    setError(null);
  }, []);

  const loginAsGuest = useCallback(async (): Promise<boolean> => {
    setError(null);
    
    // Create a guest user
    const guestUser: User = {
      id: `guest_${Date.now()}`,
      username: 'Guest',
      createdAt: Date.now(),
    };

    setUser(guestUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(guestUser));

    // Initialize empty sync data for guest
    const syncData: SyncData = {
      user: guestUser,
      tasks: [],
      sessions: [],
      subjects: [],
      stats: {
        totalSessions: 0,
        totalFocusTime: 0,
        currentStreak: 0,
        tasksCompleted: 0,
        treesGrown: 0,
      },
      settings: {
        soundEnabled: true,
        notificationsEnabled: false,
        autoStartBreaks: false,
        autoStartPomodoros: false,
        theme: 'system',
        rainSoundEnabled: false,
        rainVolume: 0.3,
      },
      timerConfig: {
        work: 25 * 60,
        shortBreak: 5 * 60,
        longBreak: 15 * 60,
      },
      lastUpdated: Date.now(),
    };
    
    localStorage.setItem(`focusflow_sync_${guestUser.id}`, JSON.stringify(syncData));

    return true;
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Sync functionality
  const syncData = useCallback((): SyncData | null => {
    if (!user) return null;

    const syncKey = `focusflow_sync_${user.id}`;
    const saved = localStorage.getItem(syncKey);
    
    if (saved) {
      return JSON.parse(saved);
    }
    return null;
  }, [user]);

  const saveSyncData = useCallback((data: Partial<SyncData>) => {
    if (!user) return;

    const syncKey = `focusflow_sync_${user.id}`;
    const existing = syncData() || {
      user,
      tasks: [],
      sessions: [],
      subjects: [],
      stats: {
        totalSessions: 0,
        totalFocusTime: 0,
        currentStreak: 0,
        tasksCompleted: 0,
        treesGrown: 0,
      },
      settings: {
        soundEnabled: true,
        notificationsEnabled: false,
        autoStartBreaks: false,
        autoStartPomodoros: false,
        theme: 'system',
        rainSoundEnabled: false,
        rainVolume: 0.3,
      },
      timerConfig: {
        work: 25 * 60,
        shortBreak: 5 * 60,
        longBreak: 15 * 60,
      },
      lastUpdated: Date.now(),
    };

    const updated: SyncData = {
      ...existing,
      ...data,
      user,
      lastUpdated: Date.now(),
    };

    localStorage.setItem(syncKey, JSON.stringify(updated));
  }, [user, syncData]);

  return {
    user,
    isLoading,
    error,
    isAuthenticated: !!user,
    signup,
    login,
    logout,
    loginAsGuest,
    clearError,
    syncData,
    saveSyncData,
  };
}
