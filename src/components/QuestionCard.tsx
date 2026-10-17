import React, { useState, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Question } from '../types';
import { 
  CheckCircle2, 
  HelpCircle, 
  Sparkles, 
  Zap, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  ArrowRight,
  Eye,
  EyeOff
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { speechService } from '../services/SpeechService';
import { VisualAid } from './VisualAid';
import { Guide } from './Guide';
import { SoundService } from '../services/SoundService';

interface QuestionCardProps {
  question: Question;
  onAnswer: (correct: boolean, userAnswer?: string) => void;
}

const SUCCESS_MESSAGES = [
  "Brilliant! Well done! 🎉",
  "Awesome! You're a math star! ⭐",
  "Spot on! Nailed it! 🚀",
  "Super thinking! You got it! 🧠",
  "Great job! Proud of you! 🇿🇦",
  "High five! You got it right! ✋",
];

const ENCOURAGING_MESSAGES = [
  "Great try! Let's check the picture together 💪",
  "Almost there! Look at the visual model below ✨",
  "No stress! Math is all about practicing 🌟",
  "Let's look at it another way! You can do it 🤔",
];

export const QuestionCard: React.FC<QuestionCardProps> = memo(({ question, onAnswer }) => {
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [showVisualModel, setShowVisualModel] = useState(true);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [guideMsg, setGuideMsg] = useState('You can do it!');
  const [guideExpression, setGuideExpression] = useState<'happy' | 'thinking' | 'celebrating' | 'supportive' | 'neutral'>('happy');

  // Track speech status for audio feedback
  useEffect(() => {
    return speechService.subscribeSpeaking(setIsSpeaking);
  }, []);

  // When question changes, reset local state
  useEffect(() => {
    setUserAnswer('');
    setFeedback(null);
    setShowHint(false);
    setShowExplanation(false);

    const startMessages = [
      "Let's solve this together!",
      "You've got this, champion!",
      "Ready? Check the visual picture!",
      "Look at the numbers carefully!"
    ];
    setGuideMsg(startMessages[Math.floor(Math.random() * startMessages.length)]);
    setGuideExpression('happy');

    // Auto-read question text with brief pause for comfortable flow
    const textToSpeak = `${question.headline || ''}. ${question.mathExpression || ''}. ${question.text}`;
    const timer = setTimeout(() => {
      speechService.speak(textToSpeak);
    }, 600);

    return () => {
      clearTimeout(timer);
      speechService.stop();
    };
  }, [question.id]);

  const handleReadQuestion = () => {
    const textToSpeak = `${question.headline || ''}. ${question.mathExpression || ''}. ${question.text}`;
    speechService.toggle(textToSpeak);
  };

  const handleSelectOption = (option: string | number) => {
    if (feedback === 'correct') return;

    const chosenStr = option.toString();
    setUserAnswer(chosenStr);

    let isCorrect = false;
    if (typeof question.answer === 'number') {
      isCorrect = Number(chosenStr) === question.answer;
    } else {
      isCorrect = chosenStr.trim().toLowerCase() === question.answer.toString().trim().toLowerCase();
    }

    if (isCorrect) {
      setFeedback('correct');
      const msg = SUCCESS_MESSAGES[Math.floor(Math.random() * SUCCESS_MESSAGES.length)];
      setGuideMsg(msg);
      setGuideExpression('celebrating');
      SoundService.playCorrect();

      // Confetti celebration
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.65 },
        colors: ['#10B981', '#6366F1', '#F59E0B', '#EC4899']
      });

      // Auto advance on correct answer after pleasant celebration delay
      setTimeout(() => {
        onAnswer(true, chosenStr);
      }, 1600);
    } else {
      setFeedback('incorrect');
      const msg = ENCOURAGING_MESSAGES[Math.floor(Math.random() * ENCOURAGING_MESSAGES.length)];
      setGuideMsg(msg);
      setGuideExpression('supportive');
      SoundService.playIncorrect();
      // Keep visual model open so they can inspect it
      setShowVisualModel(true);
    }
  };

  const handleTryAgain = () => {
    setFeedback(null);
    setUserAnswer('');
    setShowHint(true);
    setGuideMsg("Let's look at the clue! You've got this.");
    setGuideExpression('thinking');
  };

  const handleSkipOrProceed = () => {
    onAnswer(feedback === 'correct', userAnswer);
  };

  return (
    <div className="relative w-full max-w-xl mx-auto px-2 sm:px-0">
      <Guide message={guideMsg} expression={guideExpression} />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full bg-white rounded-[2.5rem] p-5 sm:p-8 shadow-xl border-2 border-slate-100 relative overflow-hidden"
      >
        {/* Top Decorative accent */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-spark-primary via-spark-secondary to-spark-accent" />

        {/* Action Header Banner */}
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          {question.headline && (
            <span className="px-3 py-1 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              {question.headline}
            </span>
          )}

          {/* Audio Read-Aloud Button */}
          <button
            type="button"
            onClick={handleReadQuestion}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black transition-all min-h-[44px] min-w-[44px] ${
              isSpeaking 
                ? 'bg-amber-400 text-slate-900 shadow-md ring-4 ring-amber-100 animate-pulse' 
                : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
            }`}
            title="Listen to question"
            aria-label="Read question out loud"
          >
            {isSpeaking ? (
              <>
                <VolumeX className="w-4 h-4 text-slate-900" />
                <span>Pause Voice</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-slate-700" />
                <span>Read to Me</span>
              </>
            )}
          </button>
        </div>

        {/* Mathematical Expression (Large & Prominent) */}
        {question.mathExpression && (
          <div className="text-center py-2 sm:py-3 mb-2">
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-none">
              {question.mathExpression}
            </h1>
          </div>
        )}

        {/* Short Question Sentence */}
        <p className="text-center text-base sm:text-lg font-bold text-slate-600 mb-6 leading-snug px-2">
          {question.text}
        </p>

        {/* Visual Model Section (Show Me) */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">
              Visual Helper
            </span>
            <button
              type="button"
              onClick={() => setShowVisualModel(!showVisualModel)}
              className="text-xs font-black text-indigo-600 hover:text-indigo-800 flex items-center gap-1 min-h-[36px]"
            >
              {showVisualModel ? (
                <>
                  <EyeOff className="w-3.5 h-3.5" /> Hide Model
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5" /> Show Model
                </>
              )}
            </button>
          </div>

          <AnimatePresence>
            {showVisualModel && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <VisualAid 
                  num1={question.num1}
                  num2={question.num2}
                  operation={question.operation}
                  iconType={question.iconType}
                  interactive={true}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Guided Hint (Let's Try Together) */}
        {question.hint && (
          <div className="mb-6">
            {!showHint && (
              <button
                type="button"
                onClick={() => {
                  setShowHint(true);
                  speechService.speak(`Here is a clue: ${question.hint}`);
                }}
                className="w-full py-2.5 px-4 bg-amber-50 hover:bg-amber-100/70 border border-amber-200 text-amber-800 rounded-2xl text-xs font-black flex items-center justify-center gap-2 transition-all min-h-[44px]"
              >
                <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                Need a clue? Let's check together
              </button>
            )}

            <AnimatePresence>
              {showHint && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  className="p-4 bg-amber-50/90 border-2 border-amber-200 rounded-2xl text-amber-900 text-xs sm:text-sm font-bold flex items-start gap-3 relative shadow-inner"
                >
                  <span className="text-xl shrink-0">💡</span>
                  <div className="flex-1">
                    <p className="leading-relaxed">{question.hint}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => speechService.speak(question.hint || '')}
                    className="p-1 text-amber-700 hover:text-amber-900 shrink-0"
                    title="Read hint aloud"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Answer Options (My Turn - Large, Easy-to-tap) */}
        <div className="space-y-3 mb-6">
          <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 text-center">
            Tap your answer:
          </p>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {question.options?.map((option, idx) => {
              const optStr = option.toString();
              const isSelected = userAnswer === optStr;
              const isCorrectFeedback = feedback === 'correct' && optStr === question.answer.toString();
              const isWrongFeedback = feedback === 'incorrect' && isSelected;

              return (
                <motion.button
                  key={idx}
                  type="button"
                  whileHover={!feedback ? { scale: 1.02 } : {}}
                  whileTap={!feedback ? { scale: 0.96 } : {}}
                  onClick={() => handleSelectOption(option)}
                  disabled={feedback === 'correct'}
                  className={`p-4 sm:p-6 rounded-2xl sm:rounded-3xl text-2xl sm:text-3xl font-black shadow-md border-3 sm:border-4 transition-all flex items-center justify-center relative min-h-[64px] ${
                    isCorrectFeedback 
                      ? 'bg-emerald-500 border-emerald-400 text-white shadow-emerald-200 ring-4 ring-emerald-100' 
                      : isWrongFeedback
                      ? 'bg-rose-50 border-rose-300 text-rose-700'
                      : isSelected
                      ? 'bg-indigo-600 border-indigo-700 text-white'
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                >
                  <span>{option}</span>

                  {isCorrectFeedback && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute right-3">
                      <CheckCircle2 className="w-6 h-6 text-white" />
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Feedback / Retry Controls (Let's Check / Try Again) */}
        <AnimatePresence>
          {feedback === 'incorrect' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-rose-50/80 border-2 border-rose-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left"
            >
              <div>
                <p className="font-black text-rose-900 text-sm">Great effort! Let's check again.</p>
                <p className="text-xs text-rose-700">You can try again right now or see the solution!</p>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleTryAgain}
                  className="flex-1 sm:flex-initial px-4 py-2.5 bg-rose-600 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md hover:bg-rose-700 transition-all flex items-center justify-center gap-1.5 min-h-[44px]"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Try Again
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowExplanation(true);
                    speechService.speak(question.explanation.join('. '));
                  }}
                  className="flex-1 sm:flex-initial px-3 py-2.5 bg-white border border-rose-200 text-rose-700 font-black text-xs uppercase tracking-wider rounded-xl hover:bg-rose-50 transition-all min-h-[44px]"
                >
                  Show Me
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step-by-Step Explanation Modal / Drawer */}
        <AnimatePresence>
          {showExplanation && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-5 bg-indigo-50/80 border-2 border-indigo-100 rounded-3xl space-y-3"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-black text-indigo-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  How to solve it:
                </h2>
                <button
                  type="button"
                  onClick={() => speechService.speak(question.explanation.join('. '))}
                  className="p-1.5 text-indigo-600 hover:bg-indigo-100 rounded-lg"
                  title="Read explanation aloud"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2">
                {question.explanation.map((step, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm font-bold text-slate-700">
                    <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <p className="flex-1 leading-snug">{step}</p>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleSkipOrProceed}
                  className="px-4 py-2 bg-indigo-600 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-md hover:bg-indigo-700 transition-all flex items-center gap-1.5 min-h-[44px]"
                >
                  <span>Next Question</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
});
