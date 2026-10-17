import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Trophy, RefreshCw, CheckCircle2, XCircle, Volume2, Grid, Sparkles, Layers } from 'lucide-react';
import { speechService } from '../services/SpeechService';

interface MultiplicationTableProps {
  onBack: () => void;
}

export const MultiplicationTable: React.FC<MultiplicationTableProps> = ({ onBack }) => {
  const [selectedRow, setSelectedRow] = useState<number | null>(3);
  const [selectedCol, setSelectedCol] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'focus' | 'grid'>('focus');
  const [quizMode, setQuizMode] = useState<{ active: boolean; targetNum: number | null }>({ active: false, targetNum: null });
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizResults, setQuizResults] = useState<Record<number, boolean | null>>({});

  const numbers = Array.from({ length: 12 }, (_, i) => i + 1);

  const startQuiz = (num: number) => {
    setQuizMode({ active: true, targetNum: num });
    setQuizAnswers({});
    setQuizResults({});
  };

  const handleAnswerChange = (idx: number, val: string) => {
    const numVal = parseInt(val);
    setQuizAnswers(prev => ({ ...prev, [idx]: isNaN(numVal) ? 0 : numVal }));
  };

  const checkQuiz = () => {
    if (!quizMode.targetNum) return;
    const results: Record<number, boolean> = {};
    numbers.forEach(n => {
      results[n] = quizAnswers[n] === quizMode.targetNum! * n;
    });
    setQuizResults(results);
  };

  const resetQuiz = () => {
    setQuizMode({ active: false, targetNum: null });
    setQuizAnswers({});
    setQuizResults({});
  };

  const isCorrect = useMemo(() => {
    return Object.values(quizResults).every(r => r === true) && Object.keys(quizResults).length === 12;
  }, [quizResults]);

  const activeFocusNum = selectedRow || 3;

  return (
    <div className="space-y-6 max-w-4xl mx-auto px-2 sm:px-0">
      {/* Top Header */}
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
              Times Tables
            </h2>
            <p className="text-[10px] font-black uppercase text-indigo-500 tracking-widest mt-1">
              Visual Multiples & Quizzes
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
                  ? 'bg-indigo-600 text-white shadow-md' 
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
                  ? 'bg-indigo-600 text-white shadow-md' 
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
            /* Focus Mode: Mobile-Friendly Card Deck for chosen table */
            <motion.div
              key="focus-mode"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="bg-white p-4 sm:p-8 rounded-[2.5rem] shadow-xl border-4 border-indigo-50 space-y-6"
            >
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                  Select a Times Table:
                </p>
                <div className="flex flex-wrap gap-2">
                  {numbers.map(n => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => {
                        setSelectedRow(n);
                        speechService.speak(`${n} times table`);
                      }}
                      className={`w-11 h-11 rounded-2xl font-black text-sm transition-all shadow-sm flex items-center justify-center min-h-[44px] min-w-[44px] ${
                        activeFocusNum === n 
                          ? 'bg-indigo-600 text-white scale-110 shadow-indigo-200' 
                          : 'bg-indigo-50/70 text-indigo-700 hover:bg-indigo-100'
                      }`}
                    >
                      {n}×
                    </button>
                  ))}
                </div>
              </div>

              {/* Multiples Card List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                    The {activeFocusNum}× Table
                  </h3>
                  <button
                    type="button"
                    onClick={() => startQuiz(activeFocusNum)}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-md transition-all min-h-[40px]"
                  >
                    Quiz Me on {activeFocusNum}×!
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3">
                  {numbers.map(multiplier => {
                    const result = activeFocusNum * multiplier;
                    return (
                      <div
                        key={multiplier}
                        className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200/80 flex items-center justify-between shadow-sm"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-base sm:text-lg font-black text-slate-800">
                            {activeFocusNum} × {multiplier} = <strong className="text-indigo-600">{result}</strong>
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => speechService.speak(`${activeFocusNum} times ${multiplier} equals ${result}`)}
                          className="p-2 text-slate-400 hover:text-indigo-600 rounded-xl hover:bg-white transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
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
            /* Full Grid Table */
            <motion.div 
              key="table"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="bg-white p-4 sm:p-8 rounded-[2.5rem] shadow-xl border-4 border-indigo-50 overflow-x-auto"
            >
              <div className="grid grid-cols-[40px_repeat(12,1fr)] gap-1 min-w-[580px]">
                <div className="h-10 flex items-center justify-center font-black text-indigo-500 bg-indigo-50 rounded-xl">×</div>
                {numbers.map(n => (
                  <button
                    key={`h-${n}`}
                    type="button"
                    onClick={() => {
                      setSelectedCol(selectedCol === n ? null : n);
                      setSelectedRow(null);
                    }}
                    className={`h-10 flex items-center justify-center font-black rounded-xl transition-all ${
                      selectedCol === n ? 'bg-indigo-500 text-white shadow-md scale-105' : 'bg-indigo-50/50 text-indigo-400 hover:bg-indigo-100'
                    }`}
                  >
                    {n}
                  </button>
                ))}

                {numbers.map(row => (
                  <React.Fragment key={`row-${row}`}>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedRow(selectedRow === row ? null : row);
                        setSelectedCol(null);
                      }}
                      className={`w-10 h-10 flex items-center justify-center font-black rounded-xl transition-all ${
                        selectedRow === row ? 'bg-indigo-500 text-white shadow-md scale-105' : 'bg-indigo-50/50 text-indigo-400 hover:bg-indigo-100'
                      }`}
                    >
                      {row}
                    </button>
                    
                    {numbers.map(col => {
                      const isHighlighted = selectedRow === row || selectedCol === col;
                      const isTarget = selectedRow === row && selectedCol === col;
                      return (
                        <div
                          key={`${row}-${col}`}
                          className={`h-10 flex items-center justify-center font-bold rounded-xl transition-all text-xs sm:text-sm ${
                            isTarget ? 'bg-indigo-600 text-white scale-105 z-10 shadow-md font-black' :
                            isHighlighted ? 'bg-indigo-100/60 text-indigo-800' :
                            'bg-slate-50 text-slate-700'
                          }`}
                        >
                          {row * col}
                        </div>
                      );
                    })}
                  </React.Fragment>
                ))}
              </div>
            </motion.div>
          )
        ) : (
          /* Quiz Mode */
          <motion.div 
            key="quiz"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white p-6 sm:p-8 rounded-[2.5rem] shadow-xl border-4 border-indigo-50 space-y-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-amber-50 rounded-2xl border border-amber-100">
                  <Trophy className="text-amber-500 w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">The {quizMode.targetNum}× Table Quiz</h3>
                  <p className="text-indigo-500 font-bold text-xs">Fill in your answers below!</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={resetQuiz}
                className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all"
                title="Reset Quiz"
              >
                <RefreshCw className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {numbers.map(n => (
                <div key={`q-${n}`} className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-sm font-black text-slate-700 w-16 text-right">
                    {quizMode.targetNum} × {n} =
                  </span>
                  <div className="relative flex-1">
                    <input
                      type="number"
                      inputMode="numeric"
                      value={quizAnswers[n] || ''}
                      onChange={(e) => handleAnswerChange(n, e.target.value)}
                      disabled={quizResults[n] !== undefined}
                      className="w-full bg-white border-2 border-slate-200 rounded-xl px-3 py-2 font-black text-lg text-indigo-700 focus:outline-none focus:border-indigo-400"
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
              ))}
            </div>

            <div className="pt-4">
              {Object.keys(quizResults).length === 0 ? (
                <button
                  type="button"
                  onClick={checkQuiz}
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xl rounded-2xl shadow-lg transition-all min-h-[56px]"
                >
                  Check My Answers ✨
                </button>
              ) : (
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <div className={`flex-1 w-full p-4 rounded-2xl font-black text-base border-2 ${
                    isCorrect ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
                  }`}>
                    {isCorrect ? "⭐ Brilliant! 12 out of 12 correct!" : "Good try! Look at the red items and try again."}
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
