import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, BookOpen, Trash2, Edit2, Check, X, Clock, Target } from 'lucide-react';
import type { Subject } from '@/types';
import { cn } from '@/lib/utils';

interface SubjectsProps {
  subjects: Subject[];
  activeSubjectId: string | null;
  subjectColors: string[];
  onAddSubject: (name: string, color?: string) => string;
  onUpdateSubject: (id: string, updates: Partial<Subject>) => void;
  onDeleteSubject: (id: string) => void;
  onSetActiveSubject: (id: string | null) => void;
  sessionsCount: (subjectId: string) => number;
}

const Subjects: React.FC<SubjectsProps> = ({
  subjects,
  activeSubjectId,
  subjectColors,
  onAddSubject,
  onUpdateSubject,
  onDeleteSubject,
  onSetActiveSubject,
  sessionsCount,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [selectedColor, setSelectedColor] = useState(subjectColors[0]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const handleAdd = () => {
    if (newSubjectName.trim()) {
      onAddSubject(newSubjectName.trim(), selectedColor);
      setNewSubjectName('');
      setIsAdding(false);
      setSelectedColor(subjectColors[0]);
    }
  };

  const handleEdit = (subject: Subject) => {
    setEditingId(subject.id);
    setEditName(subject.name);
  };

  const handleSaveEdit = () => {
    if (editingId && editName.trim()) {
      onUpdateSubject(editingId, { name: editName.trim() });
      setEditingId(null);
      setEditName('');
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
  };

  return (
    <div className="space-y-4">
      {/* Add Subject Button */}
      {!isAdding && (
        <motion.button
          onClick={() => setIsAdding(true)}
          className="w-full py-4 border-2 border-dashed border-black/20 dark:border-white/20 text-black/60 dark:text-white/60 hover:border-black dark:hover:border-white hover:text-black dark:hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <Plus className="w-5 h-5" />
          Add New Subject
        </motion.button>
      )}

      {/* Add Subject Form */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-black/5 dark:bg-white/5 p-4 space-y-4 overflow-hidden"
          >
            <input
              type="text"
              value={newSubjectName}
              onChange={(e) => setNewSubjectName(e.target.value)}
              placeholder="Subject name..."
              className="w-full px-4 py-3 bg-white dark:bg-zinc-900 border-2 border-black/10 dark:border-white/10 text-black dark:text-white placeholder:text-black/40 dark:placeholder:text-white/40 focus:border-black dark:focus:border-white focus:outline-none"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            />

            {/* Color Picker */}
            <div className="flex gap-2 flex-wrap">
              {subjectColors.map((color) => (
                <motion.button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={cn(
                    'w-8 h-8 rounded-full border-2 transition-all duration-200',
                    selectedColor === color
                      ? 'border-black dark:border-white scale-110'
                      : 'border-transparent hover:scale-105'
                  )}
                  style={{ backgroundColor: color }}
                  whileTap={{ scale: 0.95 }}
                />
              ))}
            </div>

            <div className="flex gap-2">
              <motion.button
                onClick={handleAdd}
                disabled={!newSubjectName.trim()}
                className="flex-1 py-2 bg-black dark:bg-white text-white dark:text-black font-medium disabled:opacity-50"
                whileHover={newSubjectName.trim() ? { scale: 1.02 } : {}}
                whileTap={newSubjectName.trim() ? { scale: 0.98 } : {}}
              >
                Add Subject
              </motion.button>
              <motion.button
                onClick={() => {
                  setIsAdding(false);
                  setNewSubjectName('');
                }}
                className="px-4 py-2 border-2 border-black/20 dark:border-white/20 text-black dark:text-white"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subjects List */}
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {subjects.map((subject, index) => (
            <motion.div
              key={subject.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                'group relative border-2 transition-all duration-300',
                activeSubjectId === subject.id
                  ? 'border-black dark:border-white bg-black dark:bg-white'
                  : 'border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 hover:border-black/30 dark:hover:border-white/30'
              )}
            >
              {editingId === subject.id ? (
                <div className="p-4 flex items-center gap-2">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="flex-1 px-3 py-2 bg-transparent border-2 border-black/20 dark:border-white/20 text-black dark:text-white focus:border-black dark:focus:border-white focus:outline-none"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveEdit();
                      if (e.key === 'Escape') {
                        setEditingId(null);
                        setEditName('');
                      }
                    }}
                  />
                  <motion.button
                    onClick={handleSaveEdit}
                    className="p-2 bg-black dark:bg-white text-white dark:text-black"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Check className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    onClick={() => {
                      setEditingId(null);
                      setEditName('');
                    }}
                    className="p-2 border-2 border-black/20 dark:border-white/20 text-black dark:text-white"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                </div>
              ) : (
                <div className="p-4">
                  <div className="flex items-center gap-3">
                    {/* Color Indicator */}
                    <div
                      className="w-4 h-4 rounded-full shrink-0"
                      style={{ backgroundColor: subject.color }}
                    />

                    {/* Subject Info */}
                    <button
                      onClick={() => onSetActiveSubject(subject.id)}
                      className="flex-1 text-left"
                    >
                      <h3
                        className={cn(
                          'font-medium text-base',
                          activeSubjectId === subject.id
                            ? 'text-white dark:text-black'
                            : 'text-black dark:text-white'
                        )}
                      >
                        {subject.name}
                      </h3>
                      <div
                        className={cn(
                          'flex items-center gap-3 text-xs mt-1',
                          activeSubjectId === subject.id
                            ? 'text-white/70 dark:text-black/70'
                            : 'text-black/50 dark:text-white/50'
                        )}
                      >
                        <span className="flex items-center gap-1">
                          <Target className="w-3 h-3" />
                          {sessionsCount(subject.id)} sessions
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatTime(subject.totalFocusTime)}
                        </span>
                      </div>
                    </button>

                    {/* Actions */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <motion.button
                        onClick={() => handleEdit(subject)}
                        className={cn(
                          'p-2 transition-colors',
                          activeSubjectId === subject.id
                            ? 'text-white/70 dark:text-black/70 hover:text-white dark:hover:text-black'
                            : 'text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white'
                        )}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Edit2 className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        onClick={() => onDeleteSubject(subject.id)}
                        className={cn(
                          'p-2 transition-colors',
                          activeSubjectId === subject.id
                            ? 'text-white/70 dark:text-black/70 hover:text-red-400'
                            : 'text-black/40 dark:text-white/40 hover:text-red-500'
                        )}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>

                  {/* Active Indicator */}
                  {activeSubjectId === subject.id && (
                    <motion.div
                      layoutId="activeSubject"
                      className="absolute left-0 top-0 bottom-0 w-1 bg-white dark:bg-black"
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Empty State */}
        {subjects.length === 0 && !isAdding && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 border border-dashed border-black/20 dark:border-white/20"
          >
            <BookOpen className="w-12 h-12 text-black/20 dark:text-white/20 mx-auto mb-4" />
            <p className="text-black/40 dark:text-white/40 text-sm">
              No subjects yet. Create one to organize your focus sessions.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Subjects;
