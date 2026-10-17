import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Trophy, RefreshCw, CheckCircle2, XCircle, Divide, Volume2, Grid, Layers, Sparkles } from 'lucide-react';
import { speechService } from '../services/SpeechService';

interface DivisionTableProps {
  onBack: () => void;
}

export const DivisionTable: React.FC<DivisionTableProps> = ({ onBack }) => {
  const [selectedDivisor, setSelectedDivisor] = useState<number | null>(2);
  const [selectedQuotient, setSelectedQuotient] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'focus' | 'grid'>('focus');
  const [quizMode, setQuizMode] = useState<{ active: boolean; targetDivisor: number | null }>({ active: false, targetDivisor: null });
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizResults, setQuizResults] = useState<Record<number, boolean | null>>({});

  const numbers = Array.from({ length: 12 }, (_, i) => i + 1);

  const startQuiz = (num: number) => {
    setQuizMode({ active: true, targetDivisor: num });
    setQuizAnswers({});
    setQuizResults({});
  };

  const handleAnswerChange = (idx: number, val: string) => {
    const numVal = parseInt(val);
    setQuizAnswers(prev => ({ ...prev, [idx]: isNaN(numVal) ? 0 : numVal }));
  };

  const checkQuiz = () => {
    if (!quizMode.targetDivisor) return;
    const results: Record<number, boolean> = {};
    numbers.forEach(n => {
      results[n] = quizAnswers[n] === n;
    });
    setQuizResults(results);
  };

  const resetQuiz = () => {
    setQuizMode({ active: false, targetDivisor: null });
    setQuizAnswers({});
    setQuizResults({});
  };

  const isCorrect = useMemo(() => {
    return Object.values(quizResults).every(r => r === true) && Object.keys(quizResults).length === 12;
  }, [quizResults]);

  const activeDivisor = selectedDivisor || 2;

  return (
    <div className="space-y-6 max-w-4xl mx-auto px-2 sm:px-0">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <button 
            type="button"
            onClick={() => {
              speechService.speak('Going back');
              onBack();
            }}
            className="p-3 bg-white rounded-2xl shadow-sm border-2 border-indigo-50 hover:bg-indigo-50 transition-all active:scale-90 min-h-[44px] min-w-[44px] flex items-center justify-center"
            title="Go back"
            aria-label="Go back"
          >
            <ChevronLeft className="w-6 h-6 text-indigo-600" />
          </button>
          <div>
            <h2 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tight leading-none">
              Division Tables
            </h2>
            <p className="text-[10px] font-black uppercase text-emerald-600 tracking-widest mt-1">
              Sharing into equal groups
            </p>
          </div>
        </div>

        {!quizMode.active && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setViewMode('focus')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 min-h-[40px] ${
                viewMode === 'focus' 
                  ? 'bg-emerald-600 text-white shadow-md' 
                  : 'bg-white text-slate-600 border border-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Focus Mode
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 min-h-[40px] ${
                viewMode === 'grid' 
                  ? 'bg-emerald-600 text-white shadow-md' 
                  : 'bg-white text-slate-600 border border-slate-200'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              Full Grid
            </button>
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {!quizMode.active ? (
          viewMode === 'focus' ? (
            <motion.div
              key="focus-div"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="bg-white p-4 sm:p-8 rounded-[2.5rem] shadow-xl border-4 border-emerald-50 space-y-6"
            >
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                  Select a Divisor (Divide By):
                </p>
                <div className="flex flex-wrap gap-2">
                  {numbers.slice(0, 10).map(n => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => {
                        setSelectedDivisor(n);
                        speechService.speak(`Divide by ${n} table`);
                      }}
                      className={`w-11 h-11 rounded-2xl font-black text-sm transition-all shadow-sm flex items-center justify-center min-h-[44px] min-w-[44px] ${
                        activeDivisor === n 
                          ? 'bg-emerald-600 text-white scale-110 shadow-emerald-200' 
                          : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                      }`}
                    >
                      ÷{n}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-emerald-500" />
                    Dividing by {activeDivisor}
                  </h3>
                  <button
                    type="button"
                    onClick={() => startQuiz(activeDivisor)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-md transition-all min-h-[40px]"
                  >
                    Quiz Me on ÷{activeDivisor}!
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3">
                  {numbers.map(quotient => {
                    const dividend = activeDivisor * quotient;
                    return (
                      <div
                        key={quotient}
                        className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200/80 flex items-center justify-between shadow-sm"
                      >
                        <span className="text-base sm:text-lg font-black text-slate-800">
                          {dividend} ÷ {activeDivisor} = <strong className="text-emerald-600">{quotient}</strong>
                        </span>
                        <button
                          type="button"
                          onClick={() => speechService.speak(`${dividend} divided by ${activeDivisor} equals ${quotient}`)}
                          className="p-2 text-slate-400 hover:text-emerald-600 rounded-xl hover:bg-white transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
                          title="Listen"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="table-div"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="bg-white p-4 sm:p-8 rounded-[2.5rem] shadow-xl border-4 border-emerald-50 overflow-x-auto"
            >
              <div className="grid grid-cols-[40px_repeat(12,1fr)] gap-1 min-w-[580px]">
                <div className="h-10 flex items-center justify-center font-black text-emerald-500 bg-emerald-50 rounded-xl">÷</div>
                {numbers.map(n => (
                  <button
                    key={`h-${n}`}
                    type="button"
                    onClick={() => {
                      setSelectedQuotient(selectedQuotient === n ? null : n);
                      setSelectedDivisor(null);
                    }}
                    className={`h-10 flex items-center justify-center font-black rounded-xl transition-all ${
                      selectedQuotient === n ? 'bg-emerald-500 text-white shadow-md scale-105' : 'bg-emerald-50/50 text-emerald-600 hover:bg-emerald-100'
                    }`}
                  >
                    {n}
                  </button>
                ))}

                {numbers.map(divisor => (
                  <React.Fragment key={`div-${divisor}`}>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedDivisor(selectedDivisor === divisor ? null : divisor);
                        setSelectedQuotient(null);
                      }}
                      className={`w-10 h-10 flex items-center justify-center font-black rounded-xl transition-all ${
                        selectedDivisor === divisor ? 'bg-emerald-600 text-white shadow-md scale-105' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                      }`}
                    >
                      {divisor}
                    </button>
                    {numbers.map(quotient => {
                      const isHighlighted = selectedDivisor === divisor || selectedQuotient === quotient;
                      const isTarget = selectedDivisor === divisor && selectedQuotient === quotient;
                      const dividend = divisor * quotient;
                      return (
                        <div
                          key={`${divisor}-${quotient}`}
                          className={`h-10 flex items-center justify-center font-bold rounded-xl transition-all text-xs sm:text-sm ${
                            isTarget ? 'bg-emerald-600 text-white scale-105 z-10 shadow-md font-black' :
                            isHighlighted ? 'bg-emerald-100/60 text-emerald-800' :
                            'bg-slate-50 text-slate-700'
                          }`}
                        >
                          {dividend}
                        </div>
                      );
                    })}
                  </React.Fragment>
                ))}
              </div>
            </motion.div>
          )
        ) : (
          <motion.div 
            key="quiz-div"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white p-6 sm:p-8 rounded-[2.5rem] shadow-xl border-4 border-emerald-50 space-y-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100">
                  <Trophy className="text-emerald-600 w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">Dividing by {quizMode.targetDivisor} Quiz</h3>
                  <p className="text-emerald-600 font-bold text-xs">How many in each group?</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={resetQuiz}
                className="p-2.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-2xl transition-all"
                title="Reset Quiz"
              >
                <RefreshCw className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {numbers.map(n => {
                const dividend = (quizMode.targetDivisor || 1) * n;
                return (
                  <div key={`q-${n}`} className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                    <span className="text-sm font-black text-slate-700 w-18 text-right">
                      {dividend} ÷ {quizMode.targetDivisor} =
                    </span>
                    <div className="relative flex-1">
                      <input
                        type="number"
                        inputMode="numeric"
                        value={quizAnswers[n] || ''}
                        onChange={(e) => handleAnswerChange(n, e.target.value)}
                        disabled={quizResults[n] !== undefined}
                        className="w-full bg-white border-2 border-slate-200 rounded-xl px-3 py-2 font-black text-lg text-emerald-700 focus:outline-none focus:border-emerald-400"
                      />
                      {quizResults[n] !== undefined && (
                        <div className="absolute -right-2 -top-2">
                          {quizResults[n] ? (
                            <div className="bg-emerald-100 p-1 rounded-full border border-emerald-200 shadow-sm">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            </div>
                          ) : (
                            <div className="bg-rose-100 p-1 rounded-full border border-rose-200 shadow-sm">
                              <XCircle className="w-4 h-4 text-rose-500" />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-4">
              {Object.keys(quizResults).length === 0 ? (
                <button
                  type="button"
                  onClick={checkQuiz}
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xl rounded-2xl shadow-lg transition-all min-h-[56px]"
                >
                  Check My Answers ✨
                </button>
              ) : (
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <div className={`flex-1 w-full p-4 rounded-2xl font-black text-base border-2 ${
                    isCorrect ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
                  }`}>
                    {isCorrect ? "⭐ Super star! All division facts correct!" : "Good effort! Let's practice again."}
                  </div>
                  <button
                    type="button"
                    onClick={resetQuiz}
                    className="w-full sm:w-auto px-6 py-4 bg-slate-900 text-white font-black text-sm uppercase tracking-wider rounded-2xl shadow-md min-h-[52px]"
                  >
                    Done
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
