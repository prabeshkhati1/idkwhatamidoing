import { useState, useEffect, useCallback } from 'react';
import type { Task, Session, Stats, TimerConfig, AppSettings, DailyStat, Subject, User, SyncData } from '@/types';

const STORAGE_KEYS = {
  tasks: 'focusflow_tasks',
  sessions: 'focusflow_sessions',
  subjects: 'focusflow_subjects',
  stats: 'focusflow_stats',
  currentSubject: 'focusflow_current_subject',
  settings: 'focusflow_settings',
  timerConfig: 'focusflow_timer_config',
  activeSubjectId: 'focusflow_active_subject_id',
};

const DEFAULT_SETTINGS: AppSettings = {
  soundEnabled: true,
  notificationsEnabled: false,
  autoStartBreaks: false,
  autoStartPomodoros: false,
  theme: 'system',
  rainSoundEnabled: false,
  rainVolume: 0.3,
};

const DEFAULT_TIMER_CONFIG: TimerConfig = {
  work: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
};

const SUBJECT_COLORS = [
  '#000000', // Black
  '#374151', // Gray 700
  '#1e3a5f', // Navy
  '#14532d', // Green 900
  '#7c2d12', // Orange 900
  '#581c87', // Purple 900
  '#831843', // Pink 900
  '#164e63', // Cyan 900
];

export function useLocalStorage(user: User | null) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalSessions: 0,
    totalFocusTime: 0,
    currentStreak: 0,
    tasksCompleted: 0,
    treesGrown: 0,
  });
  const [currentSubject, setCurrentSubject] = useState('');
  const [activeSubjectId, setActiveSubjectId] = useState<string | null>(null);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [timerConfig, setTimerConfig] = useState<TimerConfig>(DEFAULT_TIMER_CONFIG);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from sync data if user is logged in, otherwise from local
  useEffect(() => {
    const loadData = () => {
      if (user) {
        // Try to load from user's sync data first
        const syncKey = `focusflow_sync_${user.id}`;
        const syncData = localStorage.getItem(syncKey);
        
        if (syncData) {
          const parsed: SyncData = JSON.parse(syncData);
          setTasks(parsed.tasks || []);
          setSessions(parsed.sessions || []);
          setSubjects(parsed.subjects || []);
          setStats(parsed.stats || {
            totalSessions: 0,
            totalFocusTime: 0,
            currentStreak: 0,
            tasksCompleted: 0,
            treesGrown: 0,
          });
          setSettings({ ...DEFAULT_SETTINGS, ...parsed.settings });
          setTimerConfig({ ...DEFAULT_TIMER_CONFIG, ...parsed.timerConfig });
          setIsLoaded(true);
          return;
        }
      }

      // Fall back to local storage
      const loadedTasks = localStorage.getItem(STORAGE_KEYS.tasks);
      const loadedSessions = localStorage.getItem(STORAGE_KEYS.sessions);
      const loadedSubjects = localStorage.getItem(STORAGE_KEYS.subjects);
      const loadedStats = localStorage.getItem(STORAGE_KEYS.stats);
      const loadedSubject = localStorage.getItem(STORAGE_KEYS.currentSubject);
      const loadedActiveSubjectId = localStorage.getItem(STORAGE_KEYS.activeSubjectId);
      const loadedSettings = localStorage.getItem(STORAGE_KEYS.settings);
      const loadedTimerConfig = localStorage.getItem(STORAGE_KEYS.timerConfig);

      if (loadedTasks) setTasks(JSON.parse(loadedTasks));
      if (loadedSessions) setSessions(JSON.parse(loadedSessions));
      if (loadedSubjects) setSubjects(JSON.parse(loadedSubjects));
      if (loadedStats) setStats(JSON.parse(loadedStats));
      if (loadedSubject) setCurrentSubject(loadedSubject);
      if (loadedActiveSubjectId) setActiveSubjectId(loadedActiveSubjectId);
      if (loadedSettings) setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(loadedSettings) });
      if (loadedTimerConfig) setTimerConfig({ ...DEFAULT_TIMER_CONFIG, ...JSON.parse(loadedTimerConfig) });

      setIsLoaded(true);
    };

    loadData();
  }, [user]);

  // Save to sync data if user is logged in
  const saveToSync = useCallback(() => {
    if (!user) return;

    const syncKey = `focusflow_sync_${user.id}`;
    const syncData: SyncData = {
      user,
      tasks,
      sessions,
      subjects,
      stats,
      settings,
      timerConfig,
      lastUpdated: Date.now(),
    };

    localStorage.setItem(syncKey, JSON.stringify(syncData));
    
    // Update user's last sync time
    const authData = localStorage.getItem('focusflow_auth');
    if (authData) {
      const parsed = JSON.parse(authData);
      parsed.lastSyncAt = Date.now();
      localStorage.setItem('focusflow_auth', JSON.stringify(parsed));
    }
  }, [user, tasks, sessions, subjects, stats, settings, timerConfig]);

  // Auto-save to sync when data changes
  useEffect(() => {
    if (user && isLoaded) {
      saveToSync();
    }
  }, [user, tasks, sessions, subjects, stats, settings, timerConfig, isLoaded, saveToSync]);

  const saveTasks = useCallback((newTasks: Task[]) => {
    setTasks(newTasks);
    if (!user) {
      localStorage.setItem(STORAGE_KEYS.tasks, JSON.stringify(newTasks));
    }
  }, [user]);

  const saveSessions = useCallback((newSessions: Session[]) => {
    setSessions(newSessions);
    if (!user) {
      localStorage.setItem(STORAGE_KEYS.sessions, JSON.stringify(newSessions));
    }
  }, [user]);

  const saveSubjects = useCallback((newSubjects: Subject[]) => {
    setSubjects(newSubjects);
    if (!user) {
      localStorage.setItem(STORAGE_KEYS.subjects, JSON.stringify(newSubjects));
    }
  }, [user]);

  const saveStats = useCallback((newStats: Stats) => {
    setStats(newStats);
    if (!user) {
      localStorage.setItem(STORAGE_KEYS.stats, JSON.stringify(newStats));
    }
  }, [user]);

  const saveCurrentSubject = useCallback((subject: string) => {
    setCurrentSubject(subject);
    if (!user) {
      localStorage.setItem(STORAGE_KEYS.currentSubject, subject);
    }
  }, [user]);

  const saveActiveSubjectId = useCallback((id: string | null) => {
    setActiveSubjectId(id);
    if (!user) {
      if (id) {
        localStorage.setItem(STORAGE_KEYS.activeSubjectId, id);
      } else {
        localStorage.removeItem(STORAGE_KEYS.activeSubjectId);
      }
    }
  }, [user]);

  const saveSettings = useCallback((newSettings: AppSettings) => {
    setSettings(newSettings);
    if (!user) {
      localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(newSettings));
    }
  }, [user]);

  const saveTimerConfig = useCallback((newConfig: TimerConfig) => {
    setTimerConfig(newConfig);
    if (!user) {
      localStorage.setItem(STORAGE_KEYS.timerConfig, JSON.stringify(newConfig));
    }
  }, [user]);

  // Subject management
  const addSubject = useCallback((name: string, color?: string) => {
    const newSubject: Subject = {
      id: crypto.randomUUID(),
      name: name.trim(),
      color: color || SUBJECT_COLORS[subjects.length % SUBJECT_COLORS.length],
      icon: 'book',
      createdAt: Date.now(),
      totalSessions: 0,
      totalFocusTime: 0,
    };
    const updatedSubjects = [...subjects, newSubject];
    saveSubjects(updatedSubjects);
    return newSubject.id;
  }, [subjects, saveSubjects]);

  const updateSubject = useCallback((id: string, updates: Partial<Subject>) => {
    const updatedSubjects = subjects.map(s =>
      s.id === id ? { ...s, ...updates } : s
    );
    saveSubjects(updatedSubjects);
  }, [subjects, saveSubjects]);

  const deleteSubject = useCallback((id: string) => {
    const updatedSubjects = subjects.filter(s => s.id !== id);
    saveSubjects(updatedSubjects);
    if (activeSubjectId === id) {
      saveActiveSubjectId(null);
    }
  }, [subjects, activeSubjectId, saveSubjects, saveActiveSubjectId]);

  const getActiveSubject = useCallback(() => {
    return subjects.find(s => s.id === activeSubjectId) || null;
  }, [subjects, activeSubjectId]);

  // Task management
  const addTask = useCallback((text: string, subjectId?: string) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      text: text.trim(),
      completed: false,
      createdAt: Date.now(),
      subjectId: subjectId || activeSubjectId || undefined,
    };
    const updatedTasks = [...tasks, newTask];
    saveTasks(updatedTasks);
  }, [tasks, activeSubjectId, saveTasks]);

  const toggleTask = useCallback((id: string) => {
    const updatedTasks = tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    saveTasks(updatedTasks);
    
    const completedCount = updatedTasks.filter(t => t.completed).length;
    saveStats({ ...stats, tasksCompleted: completedCount });
  }, [tasks, stats, saveTasks, saveStats]);

  const deleteTask = useCallback((id: string) => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    saveTasks(updatedTasks);
  }, [tasks, saveTasks]);

  const getTasksBySubject = useCallback((subjectId: string) => {
    return tasks.filter(t => t.subjectId === subjectId);
  }, [tasks]);

  // Session management
  const addSession = useCallback((mode: string, duration: number, subjectId: string, subjectName: string, treeGrowth: number, note?: string) => {
    const newSession: Session = {
      id: crypto.randomUUID(),
      mode: mode as any,
      duration,
      subjectId: subjectId || 'general',
      subjectName: subjectName || 'General Focus',
      note,
      completedAt: Date.now(),
      treeGrowth,
    };
    const updatedSessions = [newSession, ...sessions].slice(0, 100);
    saveSessions(updatedSessions);

    const isWorkSession = mode === 'work';
    const newStats = {
      ...stats,
      totalSessions: stats.totalSessions + 1,
      totalFocusTime: stats.totalFocusTime + (isWorkSession ? duration : 0),
      treesGrown: stats.treesGrown + (isWorkSession && treeGrowth >= 100 ? 1 : 0),
    };
    saveStats(newStats);

    // Update subject stats
    if (subjectId && subjectId !== 'general') {
      const subject = subjects.find(s => s.id === subjectId);
      if (subject && isWorkSession) {
        updateSubject(subjectId, {
          totalSessions: subject.totalSessions + 1,
          totalFocusTime: subject.totalFocusTime + duration,
        });
      }
    }
  }, [sessions, stats, subjects, saveSessions, saveStats, updateSubject]);

  const getTodaySessions = useCallback(() => {
    const today = new Date().toDateString();
    return sessions.filter(s => new Date(s.completedAt).toDateString() === today);
  }, [sessions]);

  const getWeeklyStats = useCallback((): DailyStat[] => {
    const days: DailyStat[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toDateString();
      const daySessions = sessions.filter(s => 
        new Date(s.completedAt).toDateString() === dateStr && s.mode === 'work'
      );
      days.push({
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        sessions: daySessions.length,
        focusTime: daySessions.reduce((sum, s) => sum + s.duration, 0) / 60,
      });
    }
    return days;
  }, [sessions]);

  const getSessionsBySubject = useCallback((subjectId: string) => {
    return sessions.filter(s => s.subjectId === subjectId);
  }, [sessions]);

  const exportData = useCallback(() => {
    const data = {
      user: user || { id: 'local', username: 'local', createdAt: Date.now() },
      tasks,
      sessions,
      subjects,
      stats,
      settings,
      timerConfig,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `focusflow-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [user, tasks, sessions, subjects, stats, settings, timerConfig]);

  const importData = useCallback((data: Partial<SyncData>) => {
    if (data.tasks) saveTasks(data.tasks);
    if (data.sessions) saveSessions(data.sessions);
    if (data.subjects) saveSubjects(data.subjects);
    if (data.stats) saveStats(data.stats);
    if (data.settings) saveSettings({ ...DEFAULT_SETTINGS, ...data.settings });
    if (data.timerConfig) saveTimerConfig({ ...DEFAULT_TIMER_CONFIG, ...data.timerConfig });
  }, [saveTasks, saveSessions, saveSubjects, saveStats, saveSettings, saveTimerConfig]);

  return {
    tasks,
    sessions,
    subjects,
    stats,
    currentSubject,
    activeSubjectId,
    settings,
    timerConfig,
    isLoaded,
    addTask,
    toggleTask,
    deleteTask,
    getTasksBySubject,
    addSession,
    getSessionsBySubject,
    saveCurrentSubject,
    saveSettings,
    saveTimerConfig,
    getTodaySessions,
    getWeeklyStats,
    exportData,
    importData,
    // Subject management
    addSubject,
    updateSubject,
    deleteSubject,
    getActiveSubject,
    saveActiveSubjectId,
    subjectColors: SUBJECT_COLORS,
  };
}
