import React from 'react';
import { motion } from 'motion/react';
import { Trophy, Star, TrendingUp, Home, ArrowRight, Sparkles, Flame, Volume2 } from 'lucide-react';
import { Buddy } from './Buddy';
import { speechService } from '../services/SpeechService';
import { useEffect } from 'react';

interface SessionSummaryProps {
  stats: {
    correct: number;
    total: number;
    starsEarned: number;
    streak: number;
  };
  avatar: string;
  onFinish: () => void;
  onRestart: () => void;
}

export const SessionSummary: React.FC<SessionSummaryProps> = ({ stats, avatar, onFinish, onRestart }) => {
  const accuracy = Math.round((stats.correct / stats.total) * 100);

  useEffect(() => {
    const message = `Quest Complete! Great job! You answered ${stats.correct} out of ${stats.total} questions correctly and earned ${stats.starsEarned} stars!`;
    speechService.speak(message);
    return () => speechService.stop();
  }, []);
  
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="w-full max-w-lg bg-white rounded-[3rem] sm:rounded-[4rem] shadow-premium p-8 sm:p-12 border border-slate-100 relative overflow-hidden text-center"
    >
      <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-spark-primary via-spark-secondary to-spark-accent" />
      
      <div className="mb-8 sm:mb-12 flex flex-col items-center">
        <div className="relative">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 bg-spark-primary/5 rounded-full blur-2xl scale-150"
          />
          <Buddy avatar={avatar} mood={accuracy >= 80 ? 'excited' : 'happy'} />
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-slate-900 mt-6 sm:mt-10 tracking-tighter leading-none flex items-center justify-center gap-3">
          <span>Quest Complete!</span>
          <button 
            onClick={() => speechService.speak(`Quest Complete! You got ${accuracy} percent accuracy.`)}
            className="p-2 bg-slate-50 rounded-xl text-slate-300 hover:text-spark-primary transition-colors"
          >
            <Volume2 className="w-5 h-5" />
          </button>
        </h2>
        <div className="flex items-center gap-2 mt-3">
          <Sparkles className="w-4 h-4 text-spark-accent" />
          <p className="text-slate-400 font-black uppercase text-[10px] sm:text-xs tracking-[0.3em] leading-none">Victory Achieved! 🇿🇦</p>
          <Sparkles className="w-4 h-4 text-spark-accent" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-10 sm:mb-14">
        {[
          { icon: Star, value: `+${stats.starsEarned}`, label: 'Stars Earned', color: 'text-spark-energy', bg: 'bg-amber-50', border: 'border-amber-100', fill: true },
          { icon: Trophy, value: `${accuracy}%`, label: 'Accuracy', color: 'text-spark-secondary', bg: 'bg-indigo-50', border: 'border-indigo-100' },
          { icon: Flame, value: stats.streak, label: 'Streak', color: 'text-rose-500', bg: 'bg-rose-50', border: 'border-rose-100', fill: true },
          { icon: TrendingUp, value: `${stats.correct}/${stats.total}`, label: 'Final Score', color: 'text-spark-accent', bg: 'bg-emerald-50', border: 'border-emerald-100' },
        ].map((item, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.1 }}
            className={`${item.bg} p-6 rounded-[2rem] border ${item.border} shadow-sm group hover:scale-[1.02] transition-transform`}
          >
            <div className={`flex justify-center mb-2 ${item.color}`}>
              <item.icon className={`w-8 h-8 ${item.fill ? 'fill-current' : ''} group-hover:scale-110 transition-transform`} />
            </div>
            <p className={`text-2xl sm:text-3xl font-black ${item.color.replace('text-', 'text-opacity-90 text-')}`}>{item.value}</p>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mt-1">{item.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        <motion.button
          whileHover={{ scale: 1.02, translateY: -2 }}
          whileTap={{ scale: 0.98, translateY: 0 }}
          onClick={onRestart}
          className="w-full py-6 bg-slate-900 text-white text-xl sm:text-2xl font-black rounded-3xl shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-3 border-b-6 border-slate-700 active:border-b-0 active:translate-y-1.5"
        >
          <ArrowRight className="w-6 h-6" />
          Play Again!
        </motion.button>
        <button
          onClick={onFinish}
          className="w-full py-5 bg-white border-2 border-slate-100 text-slate-400 text-lg font-black rounded-3xl shadow-sm hover:text-slate-600 hover:border-slate-200 transition-all flex items-center justify-center gap-2"
        >
          <Home className="w-5 h-5" />
          <span>Back to Lobby</span>
        </button>
      </div>
    </motion.div>
  );
};
