import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trees, Eye, EyeOff, AlertTriangle, ArrowRight, UserPlus, LogIn } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AuthPageProps {
  onLogin: (username: string, password: string) => Promise<boolean>;
  onSignup: (username: string, password: string) => Promise<boolean>;
  onGuestLogin: () => Promise<boolean>;
  error: string | null;
  onClearError: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin, onSignup, onGuestLogin, error, onClearError }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onClearError();
    setLocalError(null);

    // Validation
    if (!username.trim()) {
      setLocalError('Please enter a username');
      return;
    }
    if (!password) {
      setLocalError('Please enter a password');
      return;
    }

    setIsLoading(true);

    try {
      const success = isLogin 
        ? await onLogin(username.trim(), password)
        : await onSignup(username.trim(), password);

      if (!success) {
        // Error is handled by parent
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    onClearError();
    setLocalError(null);
    setUsername('');
    setPassword('');
  };

  const displayError = error || localError;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <motion.div 
          className="flex flex-col items-center mb-10"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <motion.div
            animate={{ 
              rotate: [0, 5, -5, 0],
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          >
            <Trees className="w-16 h-16 text-black dark:text-white mb-4" />
          </motion.div>
          <h1 className="text-3xl font-bold text-black dark:text-white tracking-tight">
            Focus Flow
          </h1>
          <p className="text-black/60 dark:text-white/60 mt-2 text-center">
            Your personal focus companion
          </p>
        </motion.div>

        {/* Form Card */}
        <motion.div
          className="bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10 p-8 shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {/* Tabs */}
          <div className="flex mb-8 border-b border-black/10 dark:border-white/10">
            <button
              onClick={() => !isLogin && toggleMode()}
              className={cn(
                'flex-1 pb-3 text-sm font-medium transition-all duration-300 relative',
                isLogin 
                  ? 'text-black dark:text-white' 
                  : 'text-black/40 dark:text-white/40 hover:text-black/60 dark:hover:text-white/60'
              )}
            >
              <span className="flex items-center justify-center gap-2">
                <LogIn className="w-4 h-4" />
                Sign In
              </span>
              {isLogin && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-black dark:bg-white"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </button>
            <button
              onClick={() => isLogin && toggleMode()}
              className={cn(
                'flex-1 pb-3 text-sm font-medium transition-all duration-300 relative',
                !isLogin 
                  ? 'text-black dark:text-white' 
                  : 'text-black/40 dark:text-white/40 hover:text-black/60 dark:hover:text-white/60'
              )}
            >
              <span className="flex items-center justify-center gap-2">
                <UserPlus className="w-4 h-4" />
                Create Account
              </span>
              {!isLogin && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-black dark:bg-white"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {displayError && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 text-sm flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  {displayError}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full px-4 py-3 border-2 border-black/10 dark:border-white/10 bg-transparent text-black dark:text-white placeholder:text-black/30 dark:placeholder:text-white/30 focus:border-black dark:focus:border-white focus:outline-none transition-colors"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 pr-12 border-2 border-black/10 dark:border-white/10 bg-transparent text-black dark:text-white placeholder:text-black/30 dark:placeholder:text-white/30 focus:border-black dark:focus:border-white focus:outline-none transition-colors"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Warning for signup */}
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 px-4 py-3 text-xs flex items-start gap-2"
              >
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <strong>Important:</strong> Your password is stored locally and{' '}
                  <strong>cannot be recovered</strong> if forgotten. Please remember it or keep it safe.
                </div>
              </motion.div>
            )}

            <motion.button
              type="submit"
              disabled={isLoading}
              className={cn(
                'w-full py-3 px-4 bg-black dark:bg-white text-white dark:text-black font-medium flex items-center justify-center gap-2 transition-all duration-300',
                isLoading 
                  ? 'opacity-70 cursor-not-allowed' 
                  : 'hover:bg-black/80 dark:hover:bg-white/90'
              )}
              whileHover={!isLoading ? { scale: 1.01 } : {}}
              whileTap={!isLoading ? { scale: 0.99 } : {}}
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-white dark:border-black border-t-transparent rounded-full"
                />
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-black/10 dark:bg-white/10" />
            <span className="text-xs text-black/40 dark:text-white/40 uppercase tracking-wider">or</span>
            <div className="flex-1 h-px bg-black/10 dark:bg-white/10" />
          </div>

          {/* Continue as Guest */}
          <motion.button
            onClick={onGuestLogin}
            className="w-full py-3 px-4 border-2 border-black/10 dark:border-white/10 text-black dark:text-white font-medium hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-300"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            Continue as Guest
          </motion.button>
        </motion.div>

        {/* Footer */}
        <motion.p
          className="text-center text-sm text-black/40 dark:text-white/40 mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          No cloud sync. Your data stays on your device.
        </motion.p>
      </motion.div>
    </div>
  );
};

export default AuthPage;
