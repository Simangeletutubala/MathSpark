import React, { memo } from 'react';
import { motion } from 'motion/react';
import { Star, Flame, Trophy, TrendingUp } from 'lucide-react';

interface ScoreBoardProps {
  stars: number;
  streak: number;
  difficulty: string;
  dailyStreak?: number;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = memo(({ stars, streak, difficulty, dailyStreak }) => {
  return (
    <div className="flex items-center gap-1.5 p-1 bg-white/50 backdrop-blur-xl rounded-[1.5rem] shadow-premium border border-white/40">
      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-2xl shadow-sm border border-slate-100">
        <Star className="w-4 h-4 text-spark-energy fill-spark-energy" />
        <span className="text-sm font-black text-slate-700">{stars}</span>
      </div>
      
      <motion.div 
        animate={streak >= 5 ? { scale: [1, 1.05, 1], rotate: [-1, 1, -1] } : {}}
        transition={{ duration: 1, repeat: Infinity }}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-2xl shadow-sm border border-slate-100"
      >
        <Flame className={`w-4 h-4 ${streak >= 5 ? 'text-orange-500 fill-orange-500' : 'text-rose-500 fill-rose-500'}`} />
        <span className={`text-sm font-black ${streak >= 5 ? 'text-orange-700' : 'text-rose-700'}`}>{streak}</span>
      </motion.div>

      <div className="hidden xs:flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-2xl shadow-sm border border-slate-100">
        <Trophy className="w-4 h-4 text-spark-primary" />
        <span className="text-xs font-black text-slate-700 uppercase tracking-tight">{difficulty}</span>
      </div>
    </div>
  );
});
