export type TimerMode = 'work' | 'shortBreak' | 'longBreak';
export type Theme = 'light' | 'dark' | 'system';

export interface TimerConfig {
  work: number;
  shortBreak: number;
  longBreak: number;
}

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
  subjectId?: string;
}

export interface Session {
  id: string;
  mode: TimerMode;
  duration: number;
  subjectId: string;
  subjectName: string;
  note?: string;
  completedAt: number;
  treeGrowth: number;
}

export interface Subject {
  id: string;
  name: string;
  color: string;
  icon: string;
  createdAt: number;
  totalSessions: number;
  totalFocusTime: number;
}

export interface Stats {
  totalSessions: number;
  totalFocusTime: number;
  currentStreak: number;
  tasksCompleted: number;
  treesGrown: number;
}

export interface AppSettings {
  soundEnabled: boolean;
  notificationsEnabled: boolean;
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
  theme: Theme;
  rainSoundEnabled: boolean;
  rainVolume: number;
}

export interface DailyStat {
  date: string;
  sessions: number;
  focusTime: number;
}

export interface User {
  id: string;
  username: string;
  createdAt: number;
  lastSyncAt?: number;
}

export interface SyncData {
  user: User;
  tasks: Task[];
  sessions: Session[];
  subjects: Subject[];
  stats: Stats;
  settings: AppSettings;
  timerConfig: TimerConfig;
  lastUpdated: number;
}
