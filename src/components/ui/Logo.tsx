import React from 'react';
import { motion } from 'motion/react';
import { Lightbulb, Sparkles } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', className = '', showText = true }) => {
  const sizes = {
    sm: { icon: 'w-5 h-5', text: 'text-xl', container: 'p-1.5' },
    md: { icon: 'w-8 h-8', text: 'text-2xl', container: 'p-2.5' },
    lg: { icon: 'w-12 h-12', text: 'text-4xl', container: 'p-4' },
    xl: { icon: 'w-16 h-16', text: 'text-6xl', container: 'p-6' },
  };

  const currentSize = sizes[size];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <motion.div
        whileHover={{ scale: 1.05, rotate: 2 }}
        whileTap={{ scale: 0.95 }}
        className={`${currentSize.container} bg-gradient-to-tr from-spark-primary to-spark-secondary rounded-[1.25rem] shadow-premium relative`}
      >
        <div className="relative z-10 flex items-center justify-center">
          <Lightbulb className={`${currentSize.icon} text-white fill-white/10`} />
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.6, 1, 0.6]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-1 -right-1"
          >
            <Sparkles className="w-4 h-4 text-spark-energy fill-spark-energy" />
          </motion.div>
        </div>
      </motion.div>
      
      {showText && (
        <div className="flex flex-col leading-none">
          <h1 className={`${currentSize.text} font-black tracking-tight text-slate-900`}>
            Math<span className="text-spark-primary">Spark</span>
          </h1>
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">
            Academy 🇿🇦
          </p>
        </div>
      )}
    </div>
  );
};
