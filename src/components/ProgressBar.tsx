import React, { memo } from 'react';
import { motion } from 'motion/react';

interface ProgressBarProps {
  current: number;
  total: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = memo(({ current, total }) => {
  const percentage = total === 0 ? 0 : (current / total) * 100;

  return (
    <div className="w-full max-w-md bg-indigo-50 rounded-full h-5 overflow-hidden shadow-inner border-2 border-indigo-100 relative">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 shadow-[0_0_10px_rgba(16,185,129,0.3)] relative"
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {percentage > 0 && (
          <motion.div 
            animate={{ x: [0, 10, 0], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute right-0 top-0 bottom-0 w-4 bg-white/30 skew-x-12"
          />
        )}
      </motion.div>
    </div>
  );
});
