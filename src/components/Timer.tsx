import React from 'react';
import { Play, Pause, RotateCcw, SkipForward, Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { TimerMode } from '@/types';
import { cn } from '@/lib/utils';

interface TimerProps {
  mode: TimerMode;
  formattedTime: string;
  isRunning: boolean;
  progress: number;
  onModeChange: (mode: TimerMode) => void;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onSkip: () => void;
  onAddTime?: (minutes: number) => void;
}

const modes: { id: TimerMode; label: string; duration: string }[] = [
  { id: 'work', label: 'Focus', duration: '25 min' },
  { id: 'shortBreak', label: 'Short Break', duration: '5 min' },
  { id: 'longBreak', label: 'Long Break', duration: '15 min' },
];

const Timer: React.FC<TimerProps> = ({
  mode,
  formattedTime,
  isRunning,
  progress,
  onModeChange,
  onStart,
  onPause,
  onReset,
  onSkip,
  onAddTime,
}) => {
  const circumference = 2 * Math.PI * 120;
  const strokeDashoffset = circumference * (1 - progress / 100);

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }
    },
  };

  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  };

  return (
    <motion.div 
      className="flex flex-col items-center gap-6 sm:gap-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Mode Tabs */}
      <motion.div 
        className="flex gap-1 p-1 bg-black/5 dark:bg-white/5 rounded-xl"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        {modes.map((m, index) => (
          <motion.button
            key={m.id}
            onClick={() => onModeChange(m.id)}
            className={cn(
              'px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-300 rounded-lg',
              mode === m.id
                ? 'bg-black dark:bg-white text-white dark:text-black'
                : 'bg-transparent text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
            )}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="hidden sm:inline">{m.label}</span>
            <span className="sm:hidden">{m.label.split(' ')[0]}</span>
          </motion.button>
        ))}
      </motion.div>

      {/* Timer Circle */}
      <motion.div 
        className="relative"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Outer decorative ring */}
        <motion.div 
          className="absolute inset-0 -m-3 sm:-m-4 border border-black/10 dark:border-white/10 rounded-full"
          animate={isRunning ? { rotate: 360 } : { rotate: 0 }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
        />
        
        {/* Main timer container */}
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 bg-black dark:bg-white flex items-center justify-center rounded-full">
          {/* Progress SVG */}
          <svg
            className="absolute inset-0 w-full h-full -rotate-90"
            viewBox="0 0 256 256"
          >
            {/* Background ring */}
            <circle
              cx="128"
              cy="128"
              r="120"
              fill="none"
              stroke="rgba(255,255,255,0.1) dark:stroke:rgba(0,0,0,0.1)"
              strokeWidth="4"
              className="stroke-white/10 dark:stroke-black/10"
            />
            {/* Progress ring */}
            <motion.circle
              cx="128"
              cy="128"
              r="120"
              fill="none"
              stroke="white dark:stroke:black"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1, ease: 'linear' }}
              className="stroke-white dark:stroke-black"
            />
          </svg>

          {/* Timer display */}
          <div className="text-center z-10">
            <AnimatePresence mode="wait">
              <motion.div 
                key={formattedTime}
                className={cn(
                  'text-5xl sm:text-6xl font-bold tabular-nums tracking-tighter',
                  mode === 'work' 
                    ? 'text-white dark:text-black' 
                    : 'text-red-500 dark:text-red-500'
                )}
                initial={{ opacity: 0.5, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0.5, scale: 1.05 }}
                transition={{ duration: 0.15 }}
              >
                {formattedTime}
              </motion.div>
            </AnimatePresence>
            <motion.div 
              className={cn(
                'text-xs sm:text-sm mt-2 uppercase tracking-widest',
                mode === 'work' 
                  ? 'text-white/50 dark:text-black/50' 
                  : 'text-red-400 dark:text-red-400'
              )}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {mode === 'work' ? 'Focus Time' : mode === 'shortBreak' ? 'Short Break' : 'Long Break'}
            </motion.div>
          </div>
        </div>

        {/* Inner decorative ring */}
        <motion.div 
          className="absolute inset-0 m-6 sm:m-8 border border-white/10 dark:border-black/10 rounded-full"
          animate={isRunning ? { rotate: -360 } : { rotate: 0 }}
          transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
        />

        {/* Quick time adjust buttons */}
        {onAddTime && !isRunning && (
          <div className="absolute -right-12 sm:-right-16 top-1/2 -translate-y-1/2 flex flex-col gap-2">
            <motion.button
              onClick={() => onAddTime(5)}
              className="w-8 h-8 sm:w-10 sm:h-10 bg-black dark:bg-white text-white dark:text-black flex items-center justify-center hover:bg-black/80 dark:hover:bg-white/80 rounded-full shadow-lg"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              title="Add 5 minutes"
            >
              <Plus className="w-4 h-4" />
            </motion.button>
            <motion.button
              onClick={() => onAddTime(-5)}
              className="w-8 h-8 sm:w-10 sm:h-10 bg-black/50 dark:bg-white/50 text-white dark:text-black flex items-center justify-center hover:bg-black/70 dark:hover:bg-white/70 rounded-full shadow-lg"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              title="Remove 5 minutes"
            >
              <Minus className="w-4 h-4" />
            </motion.button>
          </div>
        )}
      </motion.div>

      {/* Controls */}
      <motion.div 
        className="flex gap-3 sm:gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        {/* Start/Pause */}
        <motion.button
          onClick={isRunning ? onPause : onStart}
          className={cn(
            'w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center border-2 border-black dark:border-white transition-all duration-300 rounded-full',
            'hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black'
          )}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <AnimatePresence mode="wait">
            {isRunning ? (
              <motion.div
                key="pause"
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 90 }}
                transition={{ duration: 0.2 }}
              >
                <Pause className="w-5 h-5 sm:w-6 sm:h-6" />
              </motion.div>
            ) : (
              <motion.div
                key="play"
                initial={{ scale: 0, rotate: 90 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: -90 }}
                transition={{ duration: 0.2 }}
              >
                <Play className="w-5 h-5 sm:w-6 sm:h-6 ml-0.5" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Reset */}
        <motion.button
          onClick={onReset}
          className={cn(
            'w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center border-2 border-black dark:border-white transition-all duration-300 rounded-full',
            'hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black'
          )}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6" />
        </motion.button>

        {/* Skip */}
        <motion.button
          onClick={onSkip}
          className={cn(
            'w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center border-2 border-black dark:border-white transition-all duration-300 rounded-full',
            'hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black'
          )}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <SkipForward className="w-5 h-5 sm:w-6 sm:h-6" />
        </motion.button>
      </motion.div>

      {/* Keyboard shortcut hint */}
      <motion.div 
        className="text-xs text-black/30 dark:text-white/30 hidden sm:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        Press <kbd className="px-1.5 py-0.5 bg-black/10 dark:bg-white/10 rounded">Space</kbd> to start/pause
      </motion.div>
    </motion.div>
  );
};

export default Timer;
