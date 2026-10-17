import React from 'react';
import { motion } from 'motion/react';

interface SkeletonProps {
  className?: string;
  variant?: 'rect' | 'circle' | 'text';
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', variant = 'rect' }) => {
  const baseClasses = "bg-gray-200 animate-pulse";
  const variantClasses = {
    rect: "rounded-2xl",
    circle: "rounded-full",
    text: "rounded-lg h-4 w-full"
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`} />
  );
};

export const MathLoader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-4">
      <motion.div
        animate={{ 
          rotate: 360,
          scale: [1, 1.2, 1]
        }}
        transition={{ 
          duration: 2, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-100"
      >
        <span className="text-white text-3xl font-black">+</span>
      </motion.div>
      <p className="text-indigo-400 font-black text-xs uppercase tracking-[0.3em] animate-pulse">Calculating Spark...</p>
    </div>
  );
};
