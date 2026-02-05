import React from 'react';
import { motion } from 'framer-motion';

interface TreeVisualizationProps {
  growth: number;
  isRunning: boolean;
  mode: string;
}

const TreeVisualization: React.FC<TreeVisualizationProps> = ({ growth, isRunning, mode }) => {
  const normalizedGrowth = Math.min(Math.max(growth, 0), 100);
  
  // Calculate growth stages based on percentage
  // 0% = just seed
  // 0-20% = seed growing
  // 20-40% = sprout emerging
  // 40-60% = small trunk with tiny branches
  // 60-80% = growing tree with foliage starting
  // 80-100% = full mature tree
  
  const seedScale = Math.min(1, normalizedGrowth / 20);
  const sproutHeight = Math.max(0, Math.min(1, (normalizedGrowth - 10) / 30));
  const trunkHeight = Math.max(0, Math.min(1, (normalizedGrowth - 20) / 50));
  const branchGrowth = Math.max(0, Math.min(1, (normalizedGrowth - 40) / 40));
  const foliageGrowth = Math.max(0, Math.min(1, (normalizedGrowth - 60) / 40));
  const fullFoliage = Math.max(0, Math.min(1, (normalizedGrowth - 80) / 20));

  return (
    <div className="relative w-full max-w-xs mx-auto aspect-square flex items-end justify-center">
      <motion.svg
        viewBox="0 0 200 240"
        className="w-full h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Ground */}
        <motion.ellipse
          cx="100"
          cy="230"
          rx={45}
          ry={5}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-black/30 dark:text-white/30"
        />
        
        {/* Stage 1: Seed (0-20%) */}
        <motion.g
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: seedScale > 0 ? 1 : 0, 
            scale: 0.5 + (seedScale * 0.5) 
          }}
          transition={{ duration: 0.3 }}
        >
          <ellipse
            cx="100"
            cy="228"
            rx="6"
            ry="4"
            fill="currentColor"
            className="text-black dark:text-white"
          />
          {/* Seed crack detail */}
          <path
            d="M97 228 Q100 226 103 228"
            stroke="white dark:stroke-black"
            strokeWidth="1"
            fill="none"
            opacity="0.5"
          />
        </motion.g>

        {/* Stage 2: Sprout (10-40%) */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: sproutHeight > 0 ? 1 : 0,
          }}
        >
          {/* Sprout stem */}
          <motion.path
            d="M100 228 Q100 228 100 228"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            className="text-black dark:text-white"
            initial={{ pathLength: 0 }}
            animate={{ 
              pathLength: sproutHeight,
              d: `M100 228 Q102 ${228 - (sproutHeight * 25)} 100 ${228 - (sproutHeight * 35)}`
            }}
            transition={{ duration: 0.5 }}
          />
          {/* Sprout leaves */}
          <motion.g
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: sproutHeight,
              opacity: sproutHeight 
            }}
            style={{ originX: '100px', originY: '193px' }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <ellipse cx="95" cy="195" rx="5" ry="3" fill="currentColor" className="text-black dark:text-white" transform="rotate(-30 95 195)" />
            <ellipse cx="105" cy="195" rx="5" ry="3" fill="currentColor" className="text-black dark:text-white" transform="rotate(30 105 195)" />
          </motion.g>
        </motion.g>

        {/* Stage 3: Trunk (20-70%) */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: trunkHeight > 0 ? 1 : 0 }}
        >
          {/* Main trunk - grows from bottom up */}
          <motion.path
            d="M100 228 L100 228"
            stroke="currentColor"
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
            className="text-black dark:text-white"
            initial={{ pathLength: 0 }}
            animate={{ 
              pathLength: trunkHeight,
              d: `M100 228 L100 ${228 - (trunkHeight * 80)}`
            }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
          {/* Trunk thickness variation */}
          <motion.path
            d="M97 228 L97 228"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
            className="text-black dark:text-white"
            initial={{ pathLength: 0 }}
            animate={{ 
              pathLength: trunkHeight,
              d: `M97 228 L98 ${228 - (trunkHeight * 75)}`
            }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
          />
          <motion.path
            d="M103 228 L103 228"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
            className="text-black dark:text-white"
            initial={{ pathLength: 0 }}
            animate={{ 
              pathLength: trunkHeight,
              d: `M103 228 L102 ${228 - (trunkHeight * 75)}`
            }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
          />
        </motion.g>

        {/* Stage 4: Branches (40-80%) */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: branchGrowth > 0 ? 1 : 0 }}
        >
          {/* Left branch */}
          <motion.path
            d={`M98 ${228 - (trunkHeight * 70)} L98 ${228 - (trunkHeight * 70)}`}
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            className="text-black dark:text-white"
            initial={{ pathLength: 0 }}
            animate={{ 
              pathLength: branchGrowth,
              d: `M98 ${228 - (trunkHeight * 70)} L75 ${228 - (trunkHeight * 70) - (branchGrowth * 30)}`
            }}
            transition={{ duration: 0.5 }}
          />
          {/* Right branch */}
          <motion.path
            d={`M102 ${228 - (trunkHeight * 65)} L102 ${228 - (trunkHeight * 65)}`}
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            className="text-black dark:text-white"
            initial={{ pathLength: 0 }}
            animate={{ 
              pathLength: branchGrowth,
              d: `M102 ${228 - (trunkHeight * 65)} L125 ${228 - (trunkHeight * 65) - (branchGrowth * 25)}`
            }}
            transition={{ duration: 0.5, delay: 0.1 }}
          />
          {/* Top branch */}
          <motion.path
            d={`M100 ${228 - (trunkHeight * 80)} L100 ${228 - (trunkHeight * 80)}`}
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            className="text-black dark:text-white"
            initial={{ pathLength: 0 }}
            animate={{ 
              pathLength: branchGrowth,
              d: `M100 ${228 - (trunkHeight * 80)} L100 ${228 - (trunkHeight * 80) - (branchGrowth * 35)}`
            }}
            transition={{ duration: 0.5, delay: 0.2 }}
          />
        </motion.g>

        {/* Stage 5: Foliage (60-100%) */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: foliageGrowth > 0 ? 1 : 0 }}
        >
          {/* Central foliage cluster */}
          <motion.circle
            cx="100"
            cy="130"
            r="0"
            fill="currentColor"
            className="text-black dark:text-white"
            animate={{ r: 20 * foliageGrowth }}
            transition={{ duration: 0.5 }}
          />
          {/* Left foliage */}
          <motion.circle
            cx="75"
            cy="145"
            r="0"
            fill="currentColor"
            className="text-black dark:text-white"
            animate={{ r: 15 * foliageGrowth }}
            transition={{ duration: 0.5, delay: 0.1 }}
          />
          {/* Right foliage */}
          <motion.circle
            cx="125"
            cy="140"
            r="0"
            fill="currentColor"
            className="text-black dark:text-white"
            animate={{ r: 16 * foliageGrowth }}
            transition={{ duration: 0.5, delay: 0.15 }}
          />
          {/* Top foliage */}
          <motion.circle
            cx="100"
            cy="105"
            r="0"
            fill="currentColor"
            className="text-black dark:text-white"
            animate={{ r: 18 * foliageGrowth }}
            transition={{ duration: 0.5, delay: 0.05 }}
          />
        </motion.g>

        {/* Stage 6: Full foliage details (80-100%) */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: fullFoliage > 0 ? 1 : 0 }}
        >
          {/* Additional foliage clusters for fullness */}
          <motion.circle
            cx="85"
            cy="125"
            r="0"
            fill="currentColor"
            className="text-black dark:text-white"
            animate={{ r: 12 * fullFoliage }}
            transition={{ duration: 0.4 }}
          />
          <motion.circle
            cx="115"
            cy="125"
            r="0"
            fill="currentColor"
            className="text-black dark:text-white"
            animate={{ r: 12 * fullFoliage }}
            transition={{ duration: 0.4, delay: 0.05 }}
          />
          <motion.circle
            cx="100"
            cy="150"
            r="0"
            fill="currentColor"
            className="text-black dark:text-white"
            animate={{ r: 14 * fullFoliage }}
            transition={{ duration: 0.4, delay: 0.1 }}
          />
          <motion.circle
            cx="70"
            cy="155"
            r="0"
            fill="currentColor"
            className="text-black dark:text-white"
            animate={{ r: 10 * fullFoliage }}
            transition={{ duration: 0.4, delay: 0.15 }}
          />
          <motion.circle
            cx="130"
            cy="150"
            r="0"
            fill="currentColor"
            className="text-black dark:text-white"
            animate={{ r: 10 * fullFoliage }}
            transition={{ duration: 0.4, delay: 0.2 }}
          />
          
          {/* Leaf details */}
          <motion.g 
            fill="white dark:fill-black" 
            opacity={0.2 * fullFoliage}
          >
            <circle cx="95" cy="125" r="3" />
            <circle cx="105" cy="130" r="4" />
            <circle cx="100" cy="110" r="3" />
            <circle cx="80" cy="145" r="2" />
            <circle cx="120" cy="140" r="3" />
          </motion.g>
        </motion.g>

        {/* Breathing pulse when running and focused */}
        {isRunning && mode === 'work' && normalizedGrowth > 20 && (
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.1, 0.25, 0.1] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <motion.ellipse
              cx="100"
              cy="140"
              rx="50"
              ry="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              className="text-black dark:text-white"
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              style={{ originX: '100px', originY: '140px' }}
            />
          </motion.g>
        )}

        {/* Resting indicator during breaks */}
        {mode !== 'work' && (
          <motion.text
            x="100"
            y="200"
            textAnchor="middle"
            className="text-[10px] fill-current text-black/40 dark:text-white/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Resting...
          </motion.text>
        )}
      </motion.svg>

      {/* Growth percentage badge */}
      <motion.div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="px-3 py-1.5 bg-black dark:bg-white text-white dark:text-black text-xs font-medium rounded-full">
          {Math.round(normalizedGrowth)}%
        </div>
      </motion.div>
    </div>
  );
};

export default TreeVisualization;
