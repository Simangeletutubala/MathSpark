import React from 'react';
import { motion } from 'motion/react';
import { Target, Flame, Trophy, Sparkles } from 'lucide-react';

interface DailyGoalBannerProps {
  questionsToday: number;
  dailyGoal: number;
  streak: number;
  onStartPractice: () => void;
}

export const DailyGoalBanner: React.FC<DailyGoalBannerProps> = ({ 
  questionsToday, 
  dailyGoal, 
  streak,
  onStartPractice 
}) => {
  const progress = Math.min(100, (questionsToday / dailyGoal) * 100);
  const isGoalMet = questionsToday >= dailyGoal;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[2.5rem] p-6 shadow-premium border-2 border-slate-50 relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <Target className="w-24 h-24 text-spark-primary" />
      </div>

      <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6">
        <div className="flex-1 w-full space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl ${isGoalMet ? 'bg-emerald-50 text-emerald-500' : 'bg-spark-primary/10 text-spark-primary'}`}>
                {isGoalMet ? <Trophy className="w-5 h-5" /> : <Target className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 tracking-tight">
                  {isGoalMet ? 'Daily Goal Smashed! 🎉' : 'Daily Spark Goal'}
                </h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {isGoalMet ? 'You are getting smarter every day!' : `Only ${dailyGoal - questionsToday} more to hit your target`}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full">
              <Flame className="w-4 h-4 text-spark-energy fill-spark-energy" />
              <span className="text-sm font-black text-slate-700">{streak} Day Streak</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-[11px] font-black text-slate-600 uppercase tracking-tighter">
              <span>{questionsToday} / {dailyGoal} Questions Today</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-3 bg-slate-50 rounded-full overflow-hidden shadow-inner border border-slate-100">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className={`h-full rounded-full ${isGoalMet ? 'bg-emerald-500' : 'bg-spark-primary'} shadow-lg`}
              />
            </div>
          </div>
        </div>

        {!isGoalMet && (
          <button
            onClick={onStartPractice}
            className="w-full sm:w-auto px-8 py-4 bg-slate-900 text-white text-sm font-black rounded-2xl shadow-xl hover:bg-spark-primary transition-all active:scale-95 flex items-center justify-center gap-2 group"
          >
            <Sparkles className="w-4 h-4 text-spark-accent group-hover:animate-spin" />
            <span>Fuel Your Spark</span>
          </button>
        )}
      </div>
    </motion.div>
  );
};
