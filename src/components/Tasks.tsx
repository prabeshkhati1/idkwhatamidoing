import React, { useState } from 'react';
import { Plus, Check, Trash2, BookOpen, X, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Task, Subject } from '@/types';
import { cn } from '@/lib/utils';

interface TasksProps {
  tasks: Task[];
  subjects: Subject[];
  currentSubject: string;
  onAddTask: (text: string, subjectId?: string) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onSubjectChange: (subject: string) => void;
}

const Tasks: React.FC<TasksProps> = ({
  tasks,
  subjects,
  currentSubject,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onSubjectChange,
}) => {
  const [newTask, setNewTask] = useState('');
  const [isEditingSubject, setIsEditingSubject] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | undefined>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.trim()) {
      onAddTask(newTask.trim(), selectedSubjectId);
      setNewTask('');
    }
  };

  const getSubjectById = (id?: string) => subjects.find(s => s.id === id);

  const incompleteTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  const taskVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, x: -100, scale: 0.9 },
  };

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Subject/Focus Input */}
      <motion.div 
        className="bg-black dark:bg-white p-4 sm:p-6 rounded-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center gap-3 mb-3">
          <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-white/60 dark:text-black/60" />
          <span className="text-white/60 dark:text-black/60 text-xs sm:text-sm uppercase tracking-widest">Current Focus</span>
        </div>
        <AnimatePresence mode="wait">
          {isEditingSubject ? (
            <motion.div
              key="input"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={currentSubject}
                onChange={(e) => onSubjectChange(e.target.value)}
                onBlur={() => setIsEditingSubject(false)}
                onKeyDown={(e) => e.key === 'Enter' && setIsEditingSubject(false)}
                placeholder="What are you studying?"
                className="flex-1 bg-transparent text-white dark:text-black text-lg sm:text-xl font-medium border-b border-white/30 dark:border-black/30 focus:border-white dark:focus:border-black outline-none pb-2 placeholder:text-white/30 dark:placeholder:text-black/30"
                autoFocus
              />
              <button
                onClick={() => setIsEditingSubject(false)}
                className="text-white/60 dark:text-black/60 hover:text-white dark:hover:text-black transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          ) : (
            <motion.button
              key="display"
              onClick={() => setIsEditingSubject(true)}
              className="w-full text-left"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <span className={cn(
                'text-lg sm:text-xl font-medium',
                currentSubject ? 'text-white dark:text-black' : 'text-white/30 dark:text-black/30'
              )}>
                {currentSubject || 'Click to set your focus...'}
              </span>
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Add Task */}
      <motion.form 
        onSubmit={handleSubmit} 
        className="space-y-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex gap-2">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add a task..."
            className="flex-1 px-4 py-3 border-2 border-black/10 dark:border-white/10 bg-transparent text-black dark:text-white placeholder:text-black/40 dark:placeholder:text-white/40 focus:outline-none focus:border-black dark:focus:border-white transition-colors text-sm sm:text-base rounded-lg"
          />
          <motion.button
            type="submit"
            disabled={!newTask.trim()}
            className={cn(
              'px-4 py-3 rounded-lg transition-all duration-300',
              newTask.trim()
                ? 'bg-black dark:bg-white text-white dark:text-black hover:bg-black/80 dark:hover:bg-white/80'
                : 'bg-transparent text-black/30 dark:text-white/30 border-2 border-black/10 dark:border-white/10 cursor-not-allowed'
            )}
            whileHover={newTask.trim() ? { scale: 1.05 } : {}}
            whileTap={newTask.trim() ? { scale: 0.95 } : {}}
          >
            <Plus className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Subject Selector */}
        {subjects.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <Tag className="w-4 h-4 text-black/40 dark:text-white/40" />
            <button
              type="button"
              onClick={() => setSelectedSubjectId(undefined)}
              className={cn(
                'px-3 py-1.5 text-xs rounded-full transition-colors',
                !selectedSubjectId
                  ? 'bg-black dark:bg-white text-white dark:text-black'
                  : 'bg-black/5 dark:bg-white/5 text-black/60 dark:text-white/60 hover:bg-black/10 dark:hover:bg-white/10'
              )}
            >
              No subject
            </button>
            {subjects.map(subject => (
              <button
                key={subject.id}
                type="button"
                onClick={() => setSelectedSubjectId(subject.id)}
                className={cn(
                  'px-3 py-1.5 text-xs rounded-full transition-colors flex items-center gap-1.5',
                  selectedSubjectId === subject.id
                    ? 'text-white'
                    : 'bg-black/5 dark:bg-white/5 text-black/60 dark:text-white/60 hover:bg-black/10 dark:hover:bg-white/10'
                )}
                style={selectedSubjectId === subject.id ? { backgroundColor: subject.color } : undefined}
              >
                <span 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: subject.color }}
                />
                {subject.name}
              </button>
            ))}
          </div>
        )}
      </motion.form>

      {/* Task Lists */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {/* Incomplete Tasks */}
          {incompleteTasks.map((task, index) => {
            const subject = getSubjectById(task.subjectId);
            return (
              <motion.div
                key={task.id}
                layout
                variants={taskVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ delay: index * 0.05, duration: 0.3 }}
                className="group flex items-center gap-3 p-3 sm:p-4 border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 hover:border-black/30 dark:hover:border-white/30 transition-all duration-300 rounded-lg"
              >
                <motion.button
                  onClick={() => onToggleTask(task.id)}
                  className={cn(
                    'w-5 h-5 sm:w-6 sm:h-6 border-2 border-black dark:border-white flex items-center justify-center transition-all duration-300 rounded',
                    'hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black'
                  )}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Check className="w-3 h-3 sm:w-4 sm:h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.button>
                <div className="flex-1 min-w-0">
                  <span className="text-black dark:text-white text-sm sm:text-base block truncate">{task.text}</span>
                  {subject && (
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span 
                        className="w-2 h-2 rounded-full" 
                        style={{ backgroundColor: subject.color }}
                      />
                      <span className="text-xs text-black/50 dark:text-white/50">{subject.name}</span>
                    </div>
                  )}
                </div>
                <motion.button
                  onClick={() => onDeleteTask(task.id)}
                  className="opacity-0 group-hover:opacity-100 text-black/40 dark:text-white/40 hover:text-red-500 dark:hover:text-red-400 transition-all duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Trash2 className="w-4 h-4" />
                </motion.button>
              </motion.div>
            );
          })}

          {/* Completed Tasks */}
          {completedTasks.map((task) => {
            const subject = getSubjectById(task.subjectId);
            return (
              <motion.div
                key={task.id}
                layout
                variants={taskVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="group flex items-center gap-3 p-3 sm:p-4 border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 rounded-lg"
              >
                <motion.button
                  onClick={() => onToggleTask(task.id)}
                  className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-black dark:border-white bg-black dark:bg-white flex items-center justify-center rounded"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Check className="w-3 h-3 sm:w-4 sm:h-4 text-white dark:text-black" />
                </motion.button>
                <div className="flex-1 min-w-0">
                  <span className="text-black/40 dark:text-white/40 line-through text-sm sm:text-base block truncate">{task.text}</span>
                  {subject && (
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span 
                        className="w-2 h-2 rounded-full opacity-50" 
                        style={{ backgroundColor: subject.color }}
                      />
                      <span className="text-xs text-black/30 dark:text-white/30">{subject.name}</span>
                    </div>
                  )}
                </div>
                <motion.button
                  onClick={() => onDeleteTask(task.id)}
                  className="opacity-0 group-hover:opacity-100 text-black/40 dark:text-white/40 hover:text-red-500 dark:hover:text-red-400 transition-all duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Trash2 className="w-4 h-4" />
                </motion.button>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Empty State */}
        {tasks.length === 0 && (
          <motion.div 
            className="text-center py-12 border border-dashed border-black/20 dark:border-white/20 rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-black/40 dark:text-white/40">No tasks yet. Add one above!</p>
          </motion.div>
        )}
      </div>

      {/* Task Stats */}
      {tasks.length > 0 && (
        <motion.div 
          className="flex gap-4 text-xs sm:text-sm text-black/60 dark:text-white/60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <span>{incompleteTasks.length} remaining</span>
          <span>•</span>
          <span>{completedTasks.length} completed</span>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Tasks;
