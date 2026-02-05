import React, { useState } from 'react';
import { Clock, Calendar, TreePine, ChevronDown, ChevronUp, StickyNote } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Session, Subject } from '@/types';
import { cn } from '@/lib/utils';

interface HistoryProps {
  sessions: Session[];
  subjects: Subject[];
}

const History: React.FC<HistoryProps> = ({ sessions, subjects }) => {
  const [expandedSession, setExpandedSession] = useState<string | null>(null);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const isYesterday = new Date(now.setDate(now.getDate() - 1)).toDateString() === date.toDateString();
    
    if (isToday) return 'Today';
    if (isYesterday) return 'Yesterday';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    return `${mins} min`;
  };

  const getModeLabel = (mode: string) => {
    switch (mode) {
      case 'work': return 'Focus';
      case 'shortBreak': return 'Short Break';
      case 'longBreak': return 'Long Break';
      default: return 'Session';
    }
  };

  const getModeStyle = (mode: string) => {
    switch (mode) {
      case 'work': return 'bg-black dark:bg-white text-white dark:text-black';
      case 'shortBreak': return 'bg-black/70 dark:bg-white/70 text-white dark:text-black';
      case 'longBreak': return 'bg-black/50 dark:bg-white/50 text-white dark:text-black';
      default: return 'bg-black dark:bg-white text-white dark:text-black';
    }
  };

  const getSubjectColor = (subjectId: string) => {
    const subject = subjects.find(s => s.id === subjectId);
    return subject?.color || '#000000';
  };

  const getSubjectName = (subjectId: string, fallback: string) => {
    const subject = subjects.find(s => s.id === subjectId);
    return subject?.name || fallback;
  };

  // Group sessions by date
  const groupedSessions = sessions.slice(0, 30).reduce((groups, session) => {
    const date = new Date(session.completedAt).toDateString();
    if (!groups[date]) groups[date] = [];
    groups[date].push(session);
    return groups;
  }, {} as Record<string, Session[]>);

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="flex items-center gap-2"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-black/60 dark:text-white/60" />
        <h3 className="text-base sm:text-lg font-bold text-black dark:text-white">Recent Sessions</h3>
      </motion.div>

      {sessions.length === 0 ? (
        <motion.div 
          className="text-center py-12 border border-dashed border-black/20 dark:border-white/20 rounded-xl"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <TreePine className="w-10 h-10 sm:w-12 sm:h-12 text-black/20 dark:text-white/20 mx-auto mb-4" />
          </motion.div>
          <p className="text-black/40 dark:text-white/40 text-sm sm:text-base">
            No sessions yet. Start your first focus session!
          </p>
        </motion.div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedSessions).map(([date, daySessions], groupIndex) => (
            <motion.div 
              key={date} 
              className="space-y-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: groupIndex * 0.1 }}
            >
              <div className="flex items-center gap-2 text-xs sm:text-sm text-black/60 dark:text-white/60">
                <span className="font-medium">{formatDate(daySessions[0].completedAt)}</span>
                <span className="text-black/30 dark:text-white/30">•</span>
                <span>{daySessions.length} sessions</span>
              </div>
              
              <div className="space-y-2">
                <AnimatePresence>
                  {daySessions.map((session, index) => (
                    <motion.div
                      key={session.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05 }}
                      className={cn(
                        'border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 rounded-xl overflow-hidden',
                        'hover:border-black/30 dark:hover:border-white/30 transition-all duration-300'
                      )}
                    >
                      <button
                        onClick={() => setExpandedSession(
                          expandedSession === session.id ? null : session.id
                        )}
                        className="w-full"
                      >
                        <div className="flex items-center gap-2 sm:gap-4 p-3 sm:p-4">
                          {/* Mode indicator */}
                          <div className={cn(
                            'px-2 sm:px-3 py-1 text-[10px] sm:text-xs font-medium uppercase tracking-wider shrink-0 rounded',
                            getModeStyle(session.mode)
                          )}>
                            {getModeLabel(session.mode)}
                          </div>

                          {/* Subject indicator */}
                          {session.mode === 'work' && (
                            <div 
                              className="w-3 h-3 rounded-full shrink-0"
                              style={{ backgroundColor: getSubjectColor(session.subjectId) }}
                            />
                          )}

                          {/* Subject */}
                          <div className="flex-1 min-w-0 text-left">
                            <p className="font-medium text-black dark:text-white text-sm sm:text-base truncate">
                              {getSubjectName(session.subjectId, session.subjectName)}
                            </p>
                            <p className="text-[10px] sm:text-xs text-black/40 dark:text-white/40">
                              {formatTime(session.completedAt)}
                            </p>
                          </div>

                          {/* Duration */}
                          <div className="flex items-center gap-1 text-xs sm:text-sm text-black/60 dark:text-white/60 shrink-0">
                            <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span>{formatDuration(session.duration)}</span>
                          </div>

                          {/* Tree indicator */}
                          {session.mode === 'work' && (
                            <div className="shrink-0">
                              <TreePine 
                                className={cn(
                                  'w-4 h-4 sm:w-5 sm:h-5',
                                  session.treeGrowth >= 100 
                                    ? 'text-black dark:text-white' 
                                    : 'text-black/20 dark:text-white/20'
                                )} 
                              />
                            </div>
                          )}

                          {/* Expand icon */}
                          <div className="shrink-0 text-black/40 dark:text-white/40">
                            {expandedSession === session.id ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </div>
                        </div>
                      </button>

                      {/* Expanded details */}
                      <AnimatePresence>
                        {expandedSession === session.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="border-t border-black/10 dark:border-white/10"
                          >
                            <div className="p-3 sm:p-4 space-y-3">
                              {session.note && (
                                <div className="flex items-start gap-2">
                                  <StickyNote className="w-4 h-4 text-black/40 dark:text-white/40 mt-0.5 shrink-0" />
                                  <p className="text-sm text-black/70 dark:text-white/70">{session.note}</p>
                                </div>
                              )}
                              <div className="flex items-center gap-2 text-xs text-black/50 dark:text-white/50">
                                <span>Tree growth: {Math.round(session.treeGrowth)}%</span>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default History;
