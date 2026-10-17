import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Volume2 } from 'lucide-react';
import { speechService } from '../services/SpeechService';

interface GuideProps {
  message?: string;
  expression?: 'happy' | 'thinking' | 'celebrating' | 'supportive' | 'neutral';
  autoSpeak?: boolean;
}

export const Guide: React.FC<GuideProps> = ({ 
  message, 
  expression = 'happy',
  autoSpeak = true 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      if (autoSpeak) {
        speechService.speak(message);
      }
      const timer = setTimeout(() => setIsVisible(false), 6000);
      return () => clearTimeout(timer);
    }
  }, [message, autoSpeak]);

  const getEmoji = () => {
    switch (expression) {
      case 'celebrating': return '🥳';
      case 'thinking': return '🧐';
      case 'supportive': return '💪';
      default: return '✨';
    }
  };

  return (
    <div className="fixed bottom-20 sm:bottom-28 right-3 sm:right-6 z-40 pointer-events-none">
      <AnimatePresence>
        {isVisible && message && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8, x: 20 }}
            animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: 20 }}
            className="absolute bottom-full right-0 mb-6 w-48 sm:w-64"
          >
            <div className="bg-slate-900/90 backdrop-blur-md text-white p-5 rounded-[2.5rem] rounded-br-[0.5rem] shadow-2xl relative border-2 border-white/20 ring-4 ring-slate-900/10">
              <p className="text-[11px] sm:text-xs font-black leading-relaxed tracking-tight uppercase">{message}</p>
              <div className="absolute top-3 right-3">
                <Volume2 className="w-3 h-3 text-white/20" />
              </div>
              <div className="absolute -bottom-2 right-4 w-4 h-4 bg-slate-900 rotate-45 border-r border-b border-white/10" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        animate={
          expression === 'celebrating' ? { 
            rotate: [0, 15, -15, 15, -15, 0], 
            scale: [1, 1.2, 1, 1.2, 1] 
          } :
          expression === 'happy' ? { 
            y: [0, -15, 0],
            rotate: [0, 5, -5, 0]
          } :
          { 
            y: [0, -8, 0],
            scale: [1, 1.05, 1]
          }
        }
        transition={{ 
          repeat: Infinity, 
          duration: expression === 'celebrating' ? 1 : 2.5,
          ease: "easeInOut"
        }}
        className="pointer-events-auto cursor-pointer"
        onClick={() => message && speechService.speak(message)}
      >
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[2rem] flex items-center justify-center shadow-2xl border-4 border-white relative overflow-hidden group">
          <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="absolute -top-1 -right-1 w-7 h-7 bg-amber-400 rounded-full flex items-center justify-center border-2 border-white shadow-lg">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <motion.div 
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            className="text-3xl sm:text-4xl"
          >
            {getEmoji()}
          </motion.div>
          <div className="absolute inset-0 border-4 border-white/30 rounded-[1.8rem] pointer-events-none" />
        </div>
      </motion.div>
    </div>
  );
};
