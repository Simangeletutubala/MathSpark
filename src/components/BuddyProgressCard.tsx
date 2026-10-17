import React, { memo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Difficulty, StruggledQuestion, Term, Operation } from '../types';
import { UserProfile } from '../services/ProgressService';
import { ProgressBar } from './ProgressBar';
import { 
  Star, 
  Zap, 
  BarChart3, 
  Calendar, 
  TrendingDown, 
  CheckCircle, 
  Info, 
  History, 
  ChevronUp, 
  ChevronDown,
  AlertTriangle,
  XCircle as XIcon,
  Share2
} from 'lucide-react';

interface BuddyProgressCardProps {
  buddy: UserProfile;
  isExpanded: boolean;
  isLoadingWeakAreas: boolean;
  struggledQuestions: StruggledQuestion[];
  onToggleWeakAreas: (uid: string) => void;
  onTermChange: (uid: string, term: Term) => void;
  onGoalChange: (uid: string, goal: number) => void;
  onUpgrade?: (uid: string, name: string) => void;
  onShare?: (name: string, stars: number) => void;
}

export const BuddyProgressCard: React.FC<BuddyProgressCardProps> = memo(({ 
  buddy, 
  isExpanded, 
  isLoadingWeakAreas, 
  struggledQuestions, 
  onToggleWeakAreas, 
  onTermChange,
  onGoalChange,
  onUpgrade,
  onShare
}) => {
  const profile = buddy.buddyData!;
  const accuracy = profile.totalQuestions > 0 
    ? Math.round((profile.correctAnswers / profile.totalQuestions) * 100) 
    : 0;

  return (
    <div className="bg-white p-6 sm:p-8 rounded-[3rem] border border-slate-100 shadow-sm space-y-8 relative overflow-hidden group/card">
      <div className="flex items-start justify-between relative z-10">
        <div className="flex items-center gap-5 shrink overflow-hidden">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center text-3xl sm:text-4xl shadow-inner border border-slate-100 shrink-0 group-hover/card:scale-105 transition-transform duration-500">
            {profile.avatar}
          </div>
          <div className="min-w-0">
            <h4 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight truncate">{profile.name}</h4>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
                Level {profile.difficulty === Difficulty.EASY ? '1' : profile.difficulty === Difficulty.MEDIUM ? '2' : '3'} student
              </p>
              <div className="w-1.5 h-1.5 bg-slate-200 rounded-full" />
              <div className="flex items-center gap-1.5 text-slate-500 font-bold text-xs">
                <Star className="w-3.5 h-3.5 text-spark-energy fill-spark-energy" />
                <span>{profile.stars} Total Stars</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="shrink-0 flex flex-col items-end gap-2">
          {profile.isPro ? (
            <div className="px-4 py-1.5 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg ring-4 ring-slate-50">
              <Zap className="w-3 h-3 text-spark-energy fill-spark-energy" />
              Pro Member
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onUpgrade?.(buddy.uid, profile.name)}
              className="px-4 py-1.5 bg-spark-primary text-white rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-spark-primary/20 hover:bg-spark-secondary transition-all"
            >
              Upgrade Quest
            </motion.button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Avg. Accuracy', value: `${accuracy}%`, color: 'slate' },
          { label: 'Quests Done', value: profile.totalQuestions, color: 'slate' },
          { label: 'Best Streak', value: profile.streak, color: 'slate' },
          { label: 'Active Term', value: profile.currentTerm?.replace('_', ' '), color: 'slate' },
        ].map((stat, i) => (
          <div key={i} className="bg-slate-50 p-4 rounded-3xl border border-slate-100/50">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-xl font-black text-slate-900 truncate">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-end">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-slate-400" />
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Learning Milestones</p>
          </div>
          <span className="text-xs font-black text-slate-900">{profile.correctAnswers} / {profile.totalQuestions} Solved</span>
        </div>
        <div className="h-4 bg-slate-100 rounded-full overflow-hidden border-2 border-white shadow-inner p-0.5">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${accuracy}%` }}
            className="h-full premium-gradient rounded-full shadow-lg"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-slate-400" />
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Topic Mastery</p>
          </div>
          <div className="space-y-4 bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100/50">
            {Object.entries(profile.topicPerformance || {}).length > 0 ? (
              Object.entries(profile.topicPerformance || {}).slice(0, 4).map(([op, stats]: [any, any]) => {
                const pct = Math.round((stats.correct / stats.total) * 100);
                return (
                  <div key={op} className="space-y-1.5">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-500 tracking-tight">
                      <span>{op.replace(/_/g, ' ')}</span>
                      <span className={`px-2 py-0.5 rounded-full ${pct < 50 ? 'bg-rose-50 text-rose-500' : pct < 80 ? 'bg-amber-50 text-amber-500' : 'bg-emerald-50 text-emerald-500'}`}>{pct}%</span>
                    </div>
                    <div className="h-2 bg-slate-100/50 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        className={`h-full ${pct < 50 ? 'bg-rose-400' : pct < 80 ? 'bg-amber-400' : 'bg-emerald-400'}`}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-xs font-bold text-slate-400 italic text-center py-4">Not enough topic data available yet.</p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Last 7 Days</p>
          </div>
          <div className="bg-slate-900 p-6 rounded-[2rem] flex items-end justify-between gap-1 h-44 relative overflow-hidden group/chart">
            <div className="absolute inset-0 bg-spark-primary opacity-5" />
            {(buddy.dailyStats && buddy.dailyStats.length > 0) ? (
              [...buddy.dailyStats].reverse().slice(0, 7).map((stat, i) => {
                const maxQ = Math.max(...(buddy.dailyStats?.map(s => s.total) || [10]));
                const height = Math.max(10, (stat.total / maxQ) * 100);
                const dayAccuracy = stat.correct / stat.total;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 group/bar relative">
                    <div className="absolute -top-10 scale-0 group-hover/bar:scale-100 transition-transform bg-white text-slate-900 text-[8px] font-black px-2 py-1 rounded-lg border border-slate-100 shadow-xl z-20 whitespace-nowrap">
                       {stat.correct} / {stat.total} Correct
                    </div>
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      className={`w-full max-w-[12px] rounded-t-xl transition-all duration-500 ${
                        dayAccuracy > 0.8 ? 'bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.3)]' : 
                        dayAccuracy > 0.5 ? 'bg-spark-primary shadow-[0_0_15px_rgba(79,70,229,0.3)]' : 
                        'bg-rose-400 shadow-[0_0_15px_rgba(251,113,133,0.3)]'
                      }`}
                    />
                    <span className="text-[8px] font-black text-slate-500 uppercase tracking-tighter w-full text-center">
                      {new Date(stat.date).toLocaleDateString('en-ZA', { weekday: 'short' })}
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="flex-1 flex items-center justify-center h-full">
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">No activity log</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row gap-6 items-center justify-between">
        <div className="flex gap-4">
          <button 
            onClick={() => onToggleWeakAreas(buddy.uid)}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl transition-all font-black text-sm uppercase tracking-widest ${isExpanded ? 'bg-slate-900 text-white shadow-lg' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
          >
            <History className="w-4 h-4" />
            <span>Problem Areas</span>
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-8">
          <div className="text-right">
             <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Daily Quest Goal</p>
             <div className="flex gap-1.5">
               {[5, 10, 20, 50].map((g) => (
                 <button
                   key={g}
                   onClick={() => onGoalChange(buddy.uid, g)}
                   className={`w-10 h-8 rounded-lg text-[10px] font-black transition-all border ${
                     profile.dailyGoal === g 
                       ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm' 
                       : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'
                   }`}
                 >
                   {g} Qs
                 </button>
               ))}
             </div>
          </div>

          <div className="text-right">
             <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Set Focus Term</p>
             <div className="flex gap-1.5">
               {[Term.TERM_1, Term.TERM_2, Term.TERM_3, Term.TERM_4].map((t) => (
                 <button
                   key={t}
                   onClick={() => onTermChange(buddy.uid, t)}
                   className={`w-8 h-8 rounded-lg text-[10px] font-black transition-all border ${
                     profile.currentTerm === t 
                       ? 'bg-spark-primary text-white border-spark-primary shadow-sm' 
                       : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'
                   }`}
                   title={t.replace('_', ' ')}
                 >
                   {t.split('_')[1]}
                 </button>
               ))}
             </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-8 space-y-4">
              {isLoadingWeakAreas ? (
                <div className="text-center py-12 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
                  <div className="animate-spin w-8 h-8 border-3 border-spark-primary border-t-transparent rounded-full mx-auto mb-3" />
                  <p className="text-xs text-slate-400 font-black uppercase tracking-[0.2em]">Syncing Insights...</p>
                </div>
              ) : !struggledQuestions || struggledQuestions.length === 0 ? (
                <div className="p-10 bg-emerald-50 rounded-[2.5rem] text-center border-2 border-dashed border-emerald-100">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <CheckCircle className="text-emerald-500 w-8 h-8" />
                  </div>
                  <h5 className="text-xl font-black text-emerald-900 mb-1">Perfect Score!</h5>
                  <p className="text-emerald-600 font-bold text-sm">{profile.name} is handling every challenge like a pro. 🇿🇦</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 p-5 bg-amber-50 rounded-3xl border border-amber-100">
                    <AlertTriangle className="text-amber-500 w-5 h-5 shrink-0" />
                    <p className="text-xs text-amber-900 font-bold leading-relaxed">
                      Hey! {profile.name} could use a little boost in these areas. Practicing these together will make them a math wizard!
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar p-2">
                    {struggledQuestions.map((q) => (
                      <div key={q.id} className="p-6 bg-white rounded-[2rem] border border-slate-100 shadow-sm space-y-4 hover:border-spark-primary/20 transition-all">
                        <div className="flex justify-between items-center">
                          <span className="px-3 py-1 bg-slate-900 text-white text-[9px] font-black rounded-lg uppercase tracking-widest">
                            {q.operation}
                          </span>
                          <span className="text-[9px] text-slate-400 font-black uppercase tracking-tight">
                            {new Date(q.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-xl font-black text-slate-900 tracking-tight leading-tight">{q.questionText}</p>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-3 bg-rose-50/50 rounded-2xl border border-rose-100/50">
                            <p className="text-[9px] font-black text-rose-400 uppercase tracking-widest mb-1.5">Their Try</p>
                            <div className="flex items-center gap-2 text-rose-600 font-black text-lg underline decoration-rose-200 decoration-2 underline-offset-4">
                              <XIcon className="w-4 h-4" />
                              {q.userAnswer}
                            </div>
                          </div>
                          <div className="p-3 bg-emerald-50/50 rounded-2xl border border-emerald-100/50">
                            <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest mb-1.5">Correct</p>
                            <div className="flex items-center gap-2 text-emerald-600 font-black text-lg">
                              <CheckCircle className="w-4 h-4" />
                              {q.correctAnswer}
                            </div>
                          </div>
                        </div>

                        {q.explanation && q.explanation.length > 0 && (
                          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="flex items-center gap-2 mb-3 text-slate-400 font-black text-[10px] uppercase tracking-widest">
                               <Info className="w-3.5 h-3.5" />
                               <span>Tutorial Steps:</span>
                            </div>
                            <ul className="text-xs text-slate-600 space-y-2">
                              {q.explanation.map((step, i) => (
                                <li key={i} className="flex gap-3">
                                  <span className="font-black text-spark-primary">{i + 1}.</span>
                                  <span className="font-medium">{step}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});
