import React from 'react';
import { motion } from 'framer-motion';
import { Trees, Sparkles, Zap, Heart, ArrowLeft, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AboutPageProps {
  onBack: () => void;
  isDark: boolean;
}

const AboutPage: React.FC<AboutPageProps> = ({ onBack, isDark }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
  };

  return (
    <div className={cn('min-h-screen', isDark ? 'dark bg-zinc-950' : 'bg-white')}>
      {/* Header */}
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-black/5 dark:border-white/5"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center">
          <motion.button
            onClick={onBack}
            className="flex items-center gap-2 text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors"
            whileHover={{ x: -4 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back</span>
          </motion.button>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="pt-24 pb-16 px-4">
        <motion.div
          className="max-w-2xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Profile Section */}
          <motion.div variants={itemVariants} className="text-center mb-10">
            <motion.div
              className="inline-flex items-center justify-center w-20 h-20 bg-black dark:bg-white rounded-full mb-5"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Trees className="w-10 h-10 text-white dark:text-black" />
            </motion.div>
            <h1 className="text-3xl font-bold text-black dark:text-white mb-1">
              Prabesh Khati
            </h1>
            <p className="text-base text-black/60 dark:text-white/60">
              Software Engineering Student
            </p>
          </motion.div>

          {/* About Card */}
          <motion.div
            variants={itemVariants}
            className="bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10 rounded-2xl p-6 sm:p-8 mb-8 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-5">
              <Sparkles className="w-5 h-5 text-black/60 dark:text-white/60" />
              <h2 className="text-lg font-semibold text-black dark:text-white">About Me</h2>
            </div>
            
            <p className="text-black/70 dark:text-white/70 leading-relaxed">
              Hi, I'm Prabesh Khati — a software engineering student who enjoys experimenting with AI systems, 
              UI design, and building practical tools that people actually use. I like turning ideas into minimal, 
              functional products — and then over‑engineering them for fun. If it involves AI, clean UI, automation, 
              or performance tweaks — I'm probably already testing it.
            </p>
          </motion.div>

          {/* Social Links */}
          <motion.div variants={itemVariants} className="text-center mb-8">
            <p className="text-sm text-black/50 dark:text-white/50 mb-4">
              Connect with me
            </p>
            <div className="flex justify-center gap-3">
              {/* LinkedIn */}
              <motion.a
                href="https://www.linkedin.com/in/prabesh-khati-564627373?utm_source=share_via&utm_content=profile&utm_medium=member_ios"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-5 py-3 bg-[#0A66C2] text-white rounded-xl font-medium transition-shadow hover:shadow-lg"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                <span>LinkedIn</span>
                <ExternalLink className="w-4 h-4 opacity-70" />
              </motion.a>

              {/* GitHub */}
              <motion.a
                href="https://github.com/prabeshkhati1"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-5 py-3 bg-zinc-800 dark:bg-zinc-700 text-white rounded-xl font-medium transition-shadow hover:shadow-lg"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                <span>GitHub</span>
                <ExternalLink className="w-4 h-4 opacity-70" />
              </motion.a>
            </div>
          </motion.div>

          {/* Footer Quote */}
          <motion.div
            variants={itemVariants}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 text-black/40 dark:text-white/40 text-sm">
              <Zap className="w-4 h-4" />
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500 fill-red-500" />
              <span>and lots of coffee</span>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default AboutPage;
