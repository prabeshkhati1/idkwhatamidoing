import React, { useState } from 'react';
import { Volume2, VolumeX, Bell, BellOff, Play, Download, Settings2, Clock, RotateCcw, CloudRain, Volume1 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { AppSettings, TimerConfig } from '@/types';
import { cn } from '@/lib/utils';

interface SettingsProps {
  settings: AppSettings;
  timerConfig: TimerConfig;
  onSettingsChange: (settings: AppSettings) => void;
  onTimerConfigChange: (config: TimerConfig) => void;
  onExport: () => void;
}

const SettingsPanel: React.FC<SettingsProps> = ({
  settings,
  timerConfig,
  onSettingsChange,
  onTimerConfigChange,
  onExport,
}) => {
  const [activeTab, setActiveTab] = useState<'general' | 'timer'>('general');

  const toggleSetting = (key: keyof AppSettings) => {
    onSettingsChange({ ...settings, [key]: !settings[key] });
  };

  const updateTimerDuration = (key: keyof TimerConfig, minutes: number) => {
    onTimerConfigChange({ ...timerConfig, [key]: Math.max(1, minutes) * 60 });
  };

  const resetToDefaults = () => {
    onTimerConfigChange({
      work: 25 * 60,
      shortBreak: 5 * 60,
      longBreak: 15 * 60,
    });
  };

  const settingItems = [
    {
      key: 'soundEnabled' as const,
      label: 'Sound',
      description: 'Play sound when timer completes',
      icon: settings.soundEnabled ? Volume2 : VolumeX,
    },
    {
      key: 'notificationsEnabled' as const,
      label: 'Notifications',
      description: 'Show browser notifications',
      icon: settings.notificationsEnabled ? Bell : BellOff,
    },
    {
      key: 'autoStartBreaks' as const,
      label: 'Auto-start Breaks',
      description: 'Automatically start break after focus',
      icon: Play,
    },
    {
      key: 'autoStartPomodoros' as const,
      label: 'Auto-start Pomodoros',
      description: 'Automatically start focus after break',
      icon: Play,
    },
  ];

  const timerPresets = [
    { name: 'Classic', work: 25, shortBreak: 5, longBreak: 15 },
    { name: 'Long Focus', work: 50, shortBreak: 10, longBreak: 30 },
    { name: 'Short Focus', work: 15, shortBreak: 3, longBreak: 10 },
  ];

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Tabs */}
      <motion.div 
        className="flex gap-1 p-1 bg-black/5 dark:bg-white/5 rounded-xl"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <button
          onClick={() => setActiveTab('general')}
          className={cn(
            'flex-1 px-4 py-2 text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 rounded-lg',
            activeTab === 'general'
              ? 'bg-black dark:bg-white text-white dark:text-black'
              : 'text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
          )}
        >
          <Settings2 className="w-4 h-4" />
          General
        </button>
        <button
          onClick={() => setActiveTab('timer')}
          className={cn(
            'flex-1 px-4 py-2 text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 rounded-lg',
            activeTab === 'timer'
              ? 'bg-black dark:bg-white text-white dark:text-black'
              : 'text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
          )}
        >
          <Clock className="w-4 h-4" />
          Timer
        </button>
      </motion.div>

      <AnimatePresence mode="wait">
        {activeTab === 'general' ? (
          <motion.div
            key="general"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-4"
          >
            {/* Settings List */}
            <div className="space-y-3">
              {settingItems.map((item, index) => (
                <motion.div
                  key={item.key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 rounded-xl hover:border-black/20 dark:hover:border-white/20 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5 text-black/60 dark:text-white/60" />
                    <div>
                      <p className="font-medium text-black dark:text-white text-sm">{item.label}</p>
                      <p className="text-xs text-black/50 dark:text-white/50">{item.description}</p>
                    </div>
                  </div>
                  <motion.button
                    onClick={() => toggleSetting(item.key)}
                    className={cn(
                      'w-12 h-6 rounded-full transition-colors duration-300 relative',
                      settings[item.key] ? 'bg-black dark:bg-white' : 'bg-black/20 dark:bg-white/20'
                    )}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.div
                      className="w-5 h-5 bg-white dark:bg-black rounded-full absolute top-0.5"
                      animate={{ 
                        left: settings[item.key] ? 'calc(100% - 22px)' : '2px' 
                      }}
                      transition={{ duration: 0.2 }}
                    />
                  </motion.button>
                </motion.div>
              ))}

              {/* Rain Sound Toggle */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="p-4 border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 rounded-xl hover:border-black/20 dark:hover:border-white/20 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <CloudRain className="w-5 h-5 text-black/60 dark:text-white/60" />
                    <div>
                      <p className="font-medium text-black dark:text-white text-sm">Rain Sound</p>
                      <p className="text-xs text-black/50 dark:text-white/50">Ambient rain while focusing</p>
                    </div>
                  </div>
                  <motion.button
                    onClick={() => toggleSetting('rainSoundEnabled')}
                    className={cn(
                      'w-12 h-6 rounded-full transition-colors duration-300 relative',
                      settings.rainSoundEnabled ? 'bg-black dark:bg-white' : 'bg-black/20 dark:bg-white/20'
                    )}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.div
                      className="w-5 h-5 bg-white dark:bg-black rounded-full absolute top-0.5"
                      animate={{ 
                        left: settings.rainSoundEnabled ? 'calc(100% - 22px)' : '2px' 
                      }}
                      transition={{ duration: 0.2 }}
                    />
                  </motion.button>
                </div>
                
                {/* Rain Volume Slider */}
                <AnimatePresence>
                  {settings.rainSoundEnabled && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="pt-3 border-t border-black/10 dark:border-white/10"
                    >
                      <div className="flex items-center gap-3">
                        <Volume1 className="w-4 h-4 text-black/40 dark:text-white/40" />
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={settings.rainVolume * 100}
                          onChange={(e) => onSettingsChange({ 
                            ...settings, 
                            rainVolume: parseInt(e.target.value) / 100 
                          })}
                          className="flex-1 h-2 bg-black/10 dark:bg-white/10 rounded-full appearance-none cursor-pointer accent-black dark:accent-white"
                        />
                        <span className="text-xs text-black/50 dark:text-white/50 w-10 text-right">
                          {Math.round(settings.rainVolume * 100)}%
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>

            {/* Data Management */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="pt-4 border-t border-black/10 dark:border-white/10 space-y-3"
            >
              <p className="text-sm font-medium text-black/60 dark:text-white/60 uppercase tracking-wider">Data</p>
              
              <div className="flex gap-2">
                <motion.button
                  onClick={onExport}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-black dark:border-white text-black dark:text-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all duration-300 rounded-xl"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <Download className="w-4 h-4" />
                  Export
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="timer"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {/* Presets */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-black/60 dark:text-white/60 uppercase tracking-wider">Presets</p>
              <div className="flex gap-2">
                {timerPresets.map((preset) => (
                  <motion.button
                    key={preset.name}
                    onClick={() => onTimerConfigChange({
                      work: preset.work * 60,
                      shortBreak: preset.shortBreak * 60,
                      longBreak: preset.longBreak * 60,
                    })}
                    className="flex-1 px-3 py-2 border border-black/10 dark:border-white/10 text-xs sm:text-sm text-black dark:text-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all duration-300 rounded-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {preset.name}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Custom Durations */}
            <div className="space-y-4">
              <p className="text-sm font-medium text-black/60 dark:text-white/60 uppercase tracking-wider">Custom Durations</p>
              
              {[
                { key: 'work' as const, label: 'Focus Duration', value: timerConfig.work / 60 },
                { key: 'shortBreak' as const, label: 'Short Break', value: timerConfig.shortBreak / 60 },
                { key: 'longBreak' as const, label: 'Long Break', value: timerConfig.longBreak / 60 },
              ].map((item, index) => (
                <motion.div
                  key={item.key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 rounded-xl"
                >
                  <span className="text-sm text-black dark:text-white">{item.label}</span>
                  <div className="flex items-center gap-3">
                    <motion.button
                      onClick={() => updateTimerDuration(item.key, item.value - 1)}
                      className="w-8 h-8 flex items-center justify-center border border-black/20 dark:border-white/20 text-black dark:text-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-colors rounded"
                      whileTap={{ scale: 0.9 }}
                    >
                      -
                    </motion.button>
                    <span className="w-12 text-center font-medium text-black dark:text-white">{item.value}</span>
                    <motion.button
                      onClick={() => updateTimerDuration(item.key, item.value + 1)}
                      className="w-8 h-8 flex items-center justify-center border border-black/20 dark:border-white/20 text-black dark:text-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-colors rounded"
                      whileTap={{ scale: 0.9 }}
                    >
                      +
                    </motion.button>
                    <span className="text-sm text-black/50 dark:text-white/50">min</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Reset */}
            <motion.button
              onClick={resetToDefaults}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-black/20 dark:border-white/20 text-black/60 dark:text-white/60 hover:border-black dark:hover:border-white hover:text-black dark:hover:text-white transition-all duration-300 rounded-xl"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <RotateCcw className="w-4 h-4" />
              Reset to Defaults
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SettingsPanel;
