import { useState, useEffect, useCallback, useRef } from 'react';
import type { TimerMode, TimerConfig, AppSettings } from '@/types';

interface UseTimerProps {
  config: TimerConfig;
  settings: AppSettings;
  onComplete?: (mode: TimerMode) => void;
}

export function useTimer({ config, settings, onComplete }: UseTimerProps) {
  const [mode, setMode] = useState<TimerMode>('work');
  const [timeLeft, setTimeLeft] = useState(config.work);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(100);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const initialTimeRef = useRef(config.work);
  const hasCompletedRef = useRef(false);

  const clearTimerInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const updateProgress = useCallback((current: number, initial: number) => {
    setProgress((current / initial) * 100);
  }, []);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      hasCompletedRef.current = false;
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1;
          updateProgress(newTime, initialTimeRef.current);
          return newTime;
        });
      }, 1000);
    } else if (timeLeft === 0 && !hasCompletedRef.current) {
      hasCompletedRef.current = true;
      clearTimerInterval();
      setIsRunning(false);
      onComplete?.(mode);

      // Auto-start next session if enabled
      if (mode === 'work' && settings.autoStartBreaks) {
        setTimeout(() => {
          switchMode('shortBreak');
          setIsRunning(true);
        }, 1000);
      } else if (mode !== 'work' && settings.autoStartPomodoros) {
        setTimeout(() => {
          switchMode('work');
          setIsRunning(true);
        }, 1000);
      }
    }

    return () => clearTimerInterval();
  }, [isRunning, timeLeft, mode, settings, clearTimerInterval, updateProgress, onComplete]);

  const switchMode = useCallback((newMode: TimerMode) => {
    clearTimerInterval();
    setMode(newMode);
    const newTime = config[newMode];
    setTimeLeft(newTime);
    initialTimeRef.current = newTime;
    setProgress(100);
    setIsRunning(false);
    hasCompletedRef.current = false;
  }, [config, clearTimerInterval]);

  const start = useCallback(() => {
    setIsRunning(true);
  }, []);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    clearTimerInterval();
    setIsRunning(false);
    const initialTime = config[mode];
    setTimeLeft(initialTime);
    initialTimeRef.current = initialTime;
    setProgress(100);
    hasCompletedRef.current = false;
  }, [mode, config, clearTimerInterval]);

  const skip = useCallback(() => {
    clearTimerInterval();
    setIsRunning(false);
    setTimeLeft(0);
    setProgress(0);
    hasCompletedRef.current = true;
    onComplete?.(mode);
  }, [mode, clearTimerInterval, onComplete]);

  const addTime = useCallback((minutes: number) => {
    setTimeLeft(prev => prev + minutes * 60);
    initialTimeRef.current += minutes * 60;
    updateProgress(timeLeft + minutes * 60, initialTimeRef.current);
  }, [timeLeft, updateProgress]);

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  return {
    mode,
    timeLeft,
    isRunning,
    progress,
    formattedTime: formatTime(timeLeft),
    switchMode,
    start,
    pause,
    reset,
    skip,
    addTime,
  };
}
