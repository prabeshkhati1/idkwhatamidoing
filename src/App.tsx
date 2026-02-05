import { useState, useEffect, useCallback } from 'react';
import { 
  Trees, History as HistoryIcon, BarChart3, ListTodo, Settings, 
  Keyboard, LogOut, User, BookOpen, ChevronRight, Info 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTimer } from '@/hooks/useTimer';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { useSound } from '@/hooks/useSound';
import type { TimerMode } from '@/types';
import Timer from '@/components/Timer';
import Tasks from '@/components/Tasks';
import Stats from '@/components/Stats';
import History from '@/components/History';
import SettingsPanel from '@/components/Settings';
import TreeVisualization from '@/components/TreeVisualization';
import Subjects from '@/components/Subjects';
import ThemeToggle from '@/components/ThemeToggle';
import AuthPage from '@/pages/AuthPage';
import AboutPage from '@/pages/AboutPage';
import { cn } from '@/lib/utils';
import './App.css';

type Tab = 'timer' | 'subjects' | 'tasks' | 'stats' | 'history' | 'settings';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('timer');
  const [treeGrowth, setTreeGrowth] = useState(0);
  const [showCompletion, setShowCompletion] = useState(false);
  const [sessionNote, setSessionNote] = useState('');
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  const { theme, setTheme, isDark } = useTheme();
  const auth = useAuth();
  
  const {
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
    addSession,
    saveCurrentSubject,
    saveSettings,
    saveTimerConfig,
    saveActiveSubjectId,
    getTodaySessions,
    getWeeklyStats,
    getSessionsBySubject,
    exportData,
    addSubject,
    updateSubject,
    deleteSubject,
    getActiveSubject,
    subjectColors,
  } = useLocalStorage(auth.user);

  // Sound system
  const { playStart, playComplete, playCancel, setRainVolume } = useSound({
    enabled: settings.soundEnabled,
    rainEnabled: settings.rainSoundEnabled,
  });

  // Update rain volume when settings change
  useEffect(() => {
    setRainVolume(settings.rainVolume);
  }, [settings.rainVolume, setRainVolume]);

  const activeSubject = getActiveSubject();

  const handleTimerComplete = useCallback((completedMode: TimerMode) => {
    setShowCompletion(true);
    
    if (settings.soundEnabled) {
      playComplete();
    }
    
    if (settings.notificationsEnabled && 'Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification(
            completedMode === 'work' ? 'Focus Complete!' : 'Break Over!',
            {
              body: completedMode === 'work' 
                ? `Great job! You focused on ${activeSubject?.name || 'your task'}.`
                : 'Your break is over. Ready to focus again?',
              icon: '/favicon.ico',
            }
          );
        }
      });
    }
    
    const duration = completedMode === 'work' 
      ? timerConfig.work 
      : completedMode === 'shortBreak' 
        ? timerConfig.shortBreak 
        : timerConfig.longBreak;
    
    addSession(
      completedMode, 
      duration, 
      activeSubject?.id || 'general', 
      activeSubject?.name || 'General Focus',
      treeGrowth, 
      sessionNote
    );
    
    setSessionNote('');
    
    setTimeout(() => {
      setShowCompletion(false);
    }, 4000);
  }, [settings, activeSubject, timerConfig, treeGrowth, sessionNote, addSession]);

  const timer = useTimer({
    config: timerConfig,
    settings,
    onComplete: handleTimerComplete,
  });

  useEffect(() => {
    if (timer.mode === 'work') {
      setTreeGrowth(timer.progress);
    }
  }, [timer.progress, timer.mode]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key) {
        case ' ':
          e.preventDefault();
          if (timer.isRunning) timer.pause();
          else timer.start();
          break;
        case 'r':
        case 'R':
          timer.reset();
          break;
        case 's':
        case 'S':
          timer.skip();
          break;
        case '1':
          timer.switchMode('work');
          break;
        case '2':
          timer.switchMode('shortBreak');
          break;
        case '3':
          timer.switchMode('longBreak');
          break;
        case '?':
          setShowShortcuts(true);
          break;
        case 'Escape':
          setShowShortcuts(false);
          setShowCompletion(false);
          setShowUserMenu(false);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [timer]);

  const handleModeChange = useCallback((newMode: TimerMode) => {
    timer.switchMode(newMode);
    setTreeGrowth(newMode === 'work' ? 100 : 0);
  }, [timer]);

  const handleStart = useCallback(() => {
    playStart();
    timer.start();
  }, [playStart, timer]);

  const handlePause = useCallback(() => {
    timer.pause();
  }, [timer]);

  const handleReset = useCallback(() => {
    playCancel();
    timer.reset();
  }, [playCancel, timer]);

  const handleSkip = useCallback(() => {
    playCancel();
    timer.skip();
  }, [playCancel, timer]);

  const handleLogout = () => {
    auth.logout();
    setShowUserMenu(false);
    setActiveTab('timer');
  };

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'timer', label: 'Timer', icon: Trees },
    { id: 'subjects', label: 'Subjects', icon: BookOpen },
    { id: 'tasks', label: 'Tasks', icon: ListTodo },
    { id: 'stats', label: 'Stats', icon: BarChart3 },
    { id: 'history', label: 'History', icon: HistoryIcon },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const shortcuts = [
    { key: 'Space', action: 'Start/Pause timer' },
    { key: 'R', action: 'Reset timer' },
    { key: 'S', action: 'Skip session' },
    { key: '1', action: 'Switch to Focus' },
    { key: '2', action: 'Switch to Short Break' },
    { key: '3', action: 'Switch to Long Break' },
    { key: '?', action: 'Show shortcuts' },
    { key: 'Esc', action: 'Close dialogs' },
  ];

  // Show auth page if not authenticated
  if (!auth.isAuthenticated && !auth.isLoading) {
    return (
      <div className={cn('min-h-screen', isDark ? 'dark bg-zinc-950' : 'bg-white')}>
        <AuthPage
          onLogin={auth.login}
          onSignup={auth.signup}
          onGuestLogin={auth.loginAsGuest}
          error={auth.error}
          onClearError={auth.clearError}
        />
      </div>
    );
  }

  if (auth.isLoading || !isLoaded) {
    return (
      <div className={cn('min-h-screen flex items-center justify-center', isDark ? 'dark bg-zinc-950' : 'bg-white')}>
        <motion.div 
          className="text-black dark:text-white text-xl font-medium"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Loading...
        </motion.div>
      </div>
    );
  }

  return (
    <div className={cn('min-h-screen flex flex-col', isDark ? 'dark bg-zinc-950' : 'bg-white')}>
      {/* Navigation */}
      <motion.nav 
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-black/5 dark:border-white/5"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.div 
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Trees className="w-7 h-7 text-black dark:text-white" />
              </motion.div>
              <div>
                <span className="text-lg font-bold text-black dark:text-white tracking-tight">Focus Flow</span>
                {activeSubject && (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-1 text-xs text-black/50 dark:text-white/50"
                  >
                    <span 
                      className="w-2 h-2 rounded-full" 
                      style={{ backgroundColor: activeSubject.color }}
                    />
                    {activeSubject.name}
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {tabs.map((tab, index) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'relative px-4 py-2 text-sm font-medium transition-all duration-300 flex items-center gap-2 rounded-lg',
                    activeTab === tab.id
                      ? 'text-black dark:text-white'
                      : 'text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                  )}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-black/5 dark:bg-white/10 rounded-lg"
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                  <tab.icon className="w-4 h-4 relative z-10" />
                  <span className="relative z-10">{tab.label}</span>
                </motion.button>
              ))}
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-2">
              {/* Theme Toggle */}
              <div className="hidden sm:block">
                <ThemeToggle theme={theme} onThemeChange={setTheme} />
              </div>

              {/* User Menu */}
              <div className="relative">
                <motion.button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-black dark:bg-white text-white dark:text-black"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <User className="w-5 h-5" />
                </motion.button>

                <AnimatePresence>
                  {showUserMenu && (
                    <>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40"
                        onClick={() => setShowUserMenu(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10 shadow-xl rounded-xl overflow-hidden z-50"
                      >
                        <div className="p-4 border-b border-black/10 dark:border-white/10">
                          <p className="font-medium text-black dark:text-white">{auth.user?.username}</p>
                          <p className="text-xs text-black/50 dark:text-white/50">Logged in</p>
                        </div>
                        <div className="p-2">
                          <div className="sm:hidden p-2">
                            <ThemeToggle theme={theme} onThemeChange={setTheme} />
                          </div>
                          <motion.button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            whileHover={{ x: 2 }}
                          >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                          </motion.button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex justify-between py-2 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex flex-col items-center gap-1 px-3 py-2 min-w-[60px] rounded-lg transition-colors',
                  activeTab === tab.id
                    ? 'text-black dark:text-white bg-black/5 dark:bg-white/10'
                    : 'text-black/50 dark:text-white/50'
                )}
                whileTap={{ scale: 0.95 }}
              >
                <tab.icon className="w-5 h-5" />
                <span className="text-[10px]">{tab.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <main className="flex-1 pt-28 md:pt-24 pb-12 px-4">
        <div className="max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            {activeTab === 'timer' && (
              <motion.div
                key="timer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start"
              >
                <div className="space-y-6 sm:space-y-8">
                  <div className="text-center lg:text-left">
                    <motion.h1 
                      className="text-2xl sm:text-3xl font-bold text-black dark:text-white mb-2"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      Focus Timer
                    </motion.h1>
                    <motion.p 
                      className="text-black/60 dark:text-white/60 text-sm sm:text-base"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      {activeSubject 
                        ? `Focusing on ${activeSubject.name}`
                        : 'Select a subject to track your progress'
                      }
                    </motion.p>
                  </div>
                  
                  <Timer
                    mode={timer.mode}
                    formattedTime={timer.formattedTime}
                    isRunning={timer.isRunning}
                    progress={timer.progress}
                    onModeChange={handleModeChange}
                    onStart={handleStart}
                    onPause={handlePause}
                    onReset={handleReset}
                    onSkip={handleSkip}
                    onAddTime={timer.addTime}
                  />
                </div>

                <motion.div 
                  className="flex flex-col items-center"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="text-center mb-4 sm:mb-6">
                    <motion.h2 
                      className="text-lg sm:text-xl font-bold text-black dark:text-white mb-1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      Your Focus Tree
                    </motion.h2>
                    <motion.p 
                      className="text-xs sm:text-sm text-black/60 dark:text-white/60"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      {timer.mode === 'work' 
                        ? timer.isRunning 
                          ? 'Your tree is growing...'
                          : 'Start timer to grow your tree'
                        : 'Take a break, your tree is resting'
                      }
                    </motion.p>
                  </div>
                  
                  <TreeVisualization 
                    growth={treeGrowth} 
                    isRunning={timer.isRunning && timer.mode === 'work'}
                    mode={timer.mode}
                  />

                  <AnimatePresence>
                    {activeSubject && (
                      <motion.div 
                        className="mt-4 sm:mt-6 text-center"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        <span className="text-xs text-black/40 dark:text-white/40 uppercase tracking-wider">Current Subject</span>
                        <div className="flex items-center justify-center gap-2 mt-1">
                          <span 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: activeSubject.color }}
                          />
                          <p className="text-base sm:text-lg font-medium text-black dark:text-white">{activeSubject.name}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {!activeSubject && (
                    <motion.button
                      onClick={() => setActiveTab('subjects')}
                      className="mt-4 flex items-center gap-2 text-sm text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors"
                      whileHover={{ x: 4 }}
                    >
                      Select a subject
                      <ChevronRight className="w-4 h-4" />
                    </motion.button>
                  )}
                </motion.div>
              </motion.div>
            )}

            {activeTab === 'subjects' && (
              <motion.div
                key="subjects"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="max-w-2xl mx-auto"
              >
                <div className="text-center mb-6 sm:mb-8">
                  <h1 className="text-2xl sm:text-3xl font-bold text-black dark:text-white mb-2">Subjects</h1>
                  <p className="text-black/60 dark:text-white/60 text-sm sm:text-base">
                    Organize your focus sessions by topic
                  </p>
                </div>
                
                <Subjects
                  subjects={subjects}
                  activeSubjectId={activeSubjectId}
                  subjectColors={subjectColors}
                  onAddSubject={addSubject}
                  onUpdateSubject={updateSubject}
                  onDeleteSubject={deleteSubject}
                  onSetActiveSubject={saveActiveSubjectId}
                  sessionsCount={(id) => getSessionsBySubject(id).length}
                />
              </motion.div>
            )}

            {activeTab === 'tasks' && (
              <motion.div
                key="tasks"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="max-w-2xl mx-auto"
              >
                <div className="text-center mb-6 sm:mb-8">
                  <h1 className="text-2xl sm:text-3xl font-bold text-black dark:text-white mb-2">Your Tasks</h1>
                  <p className="text-black/60 dark:text-white/60 text-sm sm:text-base">
                    What will you focus on today?
                  </p>
                </div>
                
                <Tasks
                  tasks={tasks}
                  subjects={subjects}
                  currentSubject={currentSubject}
                  onAddTask={addTask}
                  onToggleTask={toggleTask}
                  onDeleteTask={deleteTask}
                  onSubjectChange={saveCurrentSubject}
                />
              </motion.div>
            )}

            {activeTab === 'stats' && (
              <motion.div
                key="stats"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="max-w-2xl mx-auto"
              >
                <div className="text-center mb-6 sm:mb-8">
                  <h1 className="text-2xl sm:text-3xl font-bold text-black dark:text-white mb-2">Your Stats</h1>
                  <p className="text-black/60 dark:text-white/60 text-sm sm:text-base">
                    Track your focus journey
                  </p>
                </div>
                
                <Stats 
                  stats={stats} 
                  todaySessions={getTodaySessions().length}
                  weeklyStats={getWeeklyStats()}
                  subjects={subjects}
                />
              </motion.div>
            )}

            {activeTab === 'history' && (
              <motion.div
                key="history"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="max-w-2xl mx-auto"
              >
                <div className="text-center mb-6 sm:mb-8">
                  <h1 className="text-2xl sm:text-3xl font-bold text-black dark:text-white mb-2">Session History</h1>
                  <p className="text-black/60 dark:text-white/60 text-sm sm:text-base">
                    Review your past focus sessions
                  </p>
                </div>
                
                <History sessions={sessions} subjects={subjects} />
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="max-w-xl mx-auto"
              >
                <div className="text-center mb-6 sm:mb-8">
                  <h1 className="text-2xl sm:text-3xl font-bold text-black dark:text-white mb-2">Settings</h1>
                  <p className="text-black/60 dark:text-white/60 text-sm sm:text-base">
                    Customize your focus experience
                  </p>
                </div>
                
                <SettingsPanel
                  settings={settings}
                  timerConfig={timerConfig}
                  onSettingsChange={saveSettings}
                  onTimerConfigChange={saveTimerConfig}
                  onExport={exportData}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Keyboard Shortcuts Button */}
      <motion.button
        onClick={() => setShowShortcuts(true)}
        className="fixed bottom-4 right-4 w-12 h-12 bg-black dark:bg-white text-white dark:text-black flex items-center justify-center rounded-full shadow-lg hover:shadow-xl transition-shadow z-40"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        title="Keyboard shortcuts"
      >
        <Keyboard className="w-5 h-5" />
      </motion.button>

      {/* Completion Overlay */}
      <AnimatePresence>
        {showCompletion && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCompletion(false)}
          >
            <motion.div 
              className="bg-white dark:bg-zinc-900 p-6 sm:p-8 text-center max-w-md mx-4 rounded-2xl shadow-2xl"
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              onClick={e => e.stopPropagation()}
            >
              <motion.div 
                className="text-6xl sm:text-7xl mb-4"
                animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 0.5 }}
              >
                {timer.mode === 'work' ? '🌳' : '☕'}
              </motion.div>
              <h2 className="text-xl sm:text-2xl font-bold text-black dark:text-white mb-2">
                {timer.mode === 'work' ? 'Focus Complete!' : 'Break Over!'}
              </h2>
              <p className="text-black/60 dark:text-white/60 mb-4 sm:mb-6 text-sm sm:text-base">
                {timer.mode === 'work' 
                  ? `Great job! You've grown a tree while focusing on ${activeSubject?.name || 'your task'}.`
                  : 'Your break is over. Ready to focus again?'
                }
              </p>
              
              {timer.mode === 'work' && (
                <div className="mb-4">
                  <input
                    type="text"
                    value={sessionNote}
                    onChange={(e) => setSessionNote(e.target.value)}
                    placeholder="Add a note about this session..."
                    className="w-full px-4 py-3 border-2 border-black/10 dark:border-white/10 bg-transparent text-black dark:text-white placeholder:text-black/40 dark:placeholder:text-white/40 focus:border-black dark:focus:border-white outline-none rounded-lg text-sm"
                    autoFocus
                  />
                </div>
              )}
              
              <motion.button
                onClick={() => setShowCompletion(false)}
                className="px-8 py-3 bg-black dark:bg-white text-white dark:text-black font-medium rounded-lg hover:bg-black/80 dark:hover:bg-white/90 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Continue
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Keyboard Shortcuts Overlay */}
      <AnimatePresence>
        {showShortcuts && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowShortcuts(false)}
          >
            <motion.div 
              className="bg-white dark:bg-zinc-900 p-6 sm:p-8 max-w-md mx-4 w-full rounded-2xl shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold text-black dark:text-white mb-4 sm:mb-6">Keyboard Shortcuts</h2>
              <div className="space-y-2 sm:space-y-3">
                {shortcuts.map((shortcut, index) => (
                  <motion.div 
                    key={shortcut.key}
                    className="flex items-center justify-between py-2 border-b border-black/5 dark:border-white/5 last:border-0"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <span className="text-black/60 dark:text-white/60 text-sm">{shortcut.action}</span>
                    <kbd className="px-3 py-1.5 bg-black/5 dark:bg-white/10 text-black dark:text-white text-xs font-mono rounded-md">
                      {shortcut.key}
                    </kbd>
                  </motion.div>
                ))}
              </div>
              <motion.button
                onClick={() => setShowShortcuts(false)}
                className="mt-6 w-full px-4 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-black/80 dark:hover:bg-white/90 transition-colors font-medium"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                Close
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <motion.footer 
        className="border-t border-black/5 dark:border-white/5 py-4 sm:py-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <p className="text-xs sm:text-sm text-black/40 dark:text-white/40">
              Focus Flow — A minimal Pomodoro timer. No subscriptions, just focus.
            </p>
            <motion.button
              onClick={() => setShowAbout(true)}
              className="flex items-center gap-1.5 text-xs sm:text-sm text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Info className="w-4 h-4" />
              About
            </motion.button>
          </div>
        </div>
      </motion.footer>

      {/* About Page */}
      <AnimatePresence>
        {showAbout && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50"
          >
            <AboutPage onBack={() => setShowAbout(false)} isDark={isDark} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
