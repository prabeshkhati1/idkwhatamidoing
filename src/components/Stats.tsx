import React from 'react';
import { Clock, Target, Flame, TreePine, TrendingUp, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Stats as StatsType, DailyStat, Subject } from '@/types';
import { cn } from '@/lib/utils';

interface StatsProps {
  stats: StatsType;
  todaySessions: number;
  weeklyStats: DailyStat[];
  subjects: Subject[];
}

const Stats: React.FC<StatsProps> = ({ stats, todaySessions, weeklyStats, subjects }) => {
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
  };

  const maxSessions = Math.max(...weeklyStats.map(d => d.sessions), 1);

  const statCards = [
    {
      icon: Target,
      label: "Today's Sessions",
      value: todaySessions.toString(),
      subtext: 'sessions completed',
    },
    {
      icon: Clock,
      label: 'Total Focus Time',
      value: formatTime(stats.totalFocusTime),
      subtext: 'lifetime focus time',
    },
    {
      icon: Flame,
      label: 'Current Streak',
      value: stats.currentStreak.toString(),
      subtext: 'days in a row',
    },
    {
      icon: TreePine,
      label: 'Trees Grown',
      value: stats.treesGrown.toString(),
      subtext: 'complete focus sessions',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }
    },
  };

  return (
    <motion.div 
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Stat Cards Grid */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {statCards.map((card) => (
          <motion.div
            key={card.label}
            variants={cardVariants}
            className={cn(
              'group p-4 sm:p-6 border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 rounded-xl',
              'hover:border-black dark:hover:border-white transition-all duration-500 cursor-default'
            )}
            whileHover={{ scale: 1.02, y: -4 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-start justify-between mb-3 sm:mb-4">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <card.icon className="w-5 h-5 sm:w-6 sm:h-6 text-black dark:text-white" />
              </motion.div>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-black/60 dark:text-white/60 uppercase tracking-wider">
                {card.label}
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-black dark:text-white">
                {card.value}
              </p>
              <p className="text-[10px] sm:text-xs text-black/40 dark:text-white/40">
                {card.subtext}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Weekly Chart */}
      <motion.div
        className="border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 p-4 sm:p-6 rounded-xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <div className="flex items-center gap-2 mb-4 sm:mb-6">
          <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-black/60 dark:text-white/60" />
          <h3 className="text-sm sm:text-base font-bold text-black dark:text-white">Last 7 Days</h3>
        </div>

        <div className="flex items-end justify-between gap-2 h-32 sm:h-40">
          {weeklyStats.map((day, index) => (
            <motion.div
              key={day.date}
              className="flex-1 flex flex-col items-center gap-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              <div className="relative w-full flex-1 flex items-end">
                <motion.div
                  className={cn(
                    'w-full bg-black dark:bg-white transition-all duration-500 rounded-t',
                    day.sessions === 0 && 'bg-black/20 dark:bg-white/20'
                  )}
                  initial={{ height: 0 }}
                  animate={{ height: `${(day.sessions / maxSessions) * 100}%` }}
                  transition={{ delay: 0.6 + index * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                />
                {day.sessions > 0 && (
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    <span className="text-xs bg-black dark:bg-white text-white dark:text-black px-2 py-1 rounded">
                      {day.sessions} sessions
                    </span>
                  </div>
                )}
              </div>
              <span className="text-[10px] sm:text-xs text-black/60 dark:text-white/60">{day.date}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Subject Stats */}
      {subjects.length > 0 && (
        <motion.div
          className="border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 p-4 sm:p-6 rounded-xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <div className="flex items-center gap-2 mb-4 sm:mb-6">
            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-black/60 dark:text-white/60" />
            <h3 className="text-sm sm:text-base font-bold text-black dark:text-white">By Subject</h3>
          </div>

          <div className="space-y-3">
            {subjects
              .sort((a, b) => b.totalFocusTime - a.totalFocusTime)
              .slice(0, 5)
              .map((subject, index) => (
                <motion.div
                  key={subject.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div 
                    className="w-3 h-3 rounded-full shrink-0" 
                    style={{ backgroundColor: subject.color }}
                  />
                  <span className="flex-1 text-sm text-black dark:text-white truncate">{subject.name}</span>
                  <span className="text-xs text-black/50 dark:text-white/50">{formatTime(subject.totalFocusTime / 60)}</span>
                </motion.div>
              ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Stats;
