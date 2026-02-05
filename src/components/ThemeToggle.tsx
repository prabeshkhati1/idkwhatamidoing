import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Monitor } from 'lucide-react';
import type { Theme } from '@/types';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, onThemeChange }) => {
  const options: { value: Theme; icon: React.ElementType; label: string }[] = [
    { value: 'light', icon: Sun, label: 'Light' },
    { value: 'dark', icon: Moon, label: 'Dark' },
    { value: 'system', icon: Monitor, label: 'Auto' },
  ];

  return (
    <div className="flex gap-1 p-1 bg-black/5 dark:bg-white/5 rounded-lg">
      {options.map((option) => (
        <motion.button
          key={option.value}
          onClick={() => onThemeChange(option.value)}
          className={cn(
            'relative px-3 py-2 rounded-md flex items-center gap-2 text-sm font-medium transition-colors duration-200',
            theme === option.value
              ? 'text-black dark:text-white'
              : 'text-black/50 dark:text-white/50 hover:text-black/70 dark:hover:text-white/70'
          )}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {theme === option.value && (
            <motion.div
              layoutId="themeIndicator"
              className="absolute inset-0 bg-white dark:bg-zinc-800 shadow-sm rounded-md"
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          )}
          <span className="relative z-10 flex items-center gap-2">
            <option.icon className="w-4 h-4" />
            <span className="hidden sm:inline">{option.label}</span>
          </span>
        </motion.button>
      ))}
    </div>
  );
};

export default ThemeToggle;
