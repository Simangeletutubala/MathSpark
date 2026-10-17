import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Logo } from './ui/Logo';
import { SoundService } from '../services/SoundService';
import { speechService } from '../services/SpeechService';
import { Operation } from '../types';
import { UserProfile } from '../services/ProgressService';
import { 
  Play, 
  Sparkles, 
  Star, 
  Flame, 
  Award, 
  CheckCircle2, 
  Volume2, 
  ChevronRight, 
  UserCheck, 
  ShieldCheck, 
  Zap, 
  Heart, 
  BookOpen, 
  Layers, 
  Clock, 
  PieChart, 
  HelpCircle,
  ArrowRight
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onQuickPlay: () => void;
  onParentPortal?: () => void;
  onOpenTimesTable?: () => void;
  onOpenDivisionTable?: () => void;
  onSelectTopic?: (topic: Operation) => void;
  existingProfile?: UserProfile | null;
}

const BUDDIES = [
  { emoji: '🦁', name: 'Sparky the Lion', specialty: 'Times Tables & Bravery', color: 'from-amber-400 to-orange-500', quote: 'Roar! Math is an awesome adventure!' },
  { emoji: '🐘', name: 'Ellie the Elephant', specialty: 'Big 4-Digit Numbers', color: 'from-blue-400 to-indigo-500', quote: 'Never forget place values!' },
  { emoji: '🦏', name: 'Roly the Rhino', specialty: 'Fractions & Sharing', color: 'from-emerald-400 to-teal-500', quote: 'Crush tough math with steady steps!' },
  { emoji: '🐆', name: 'Spotty the Cheetah', specialty: 'Speed Arithmetic', color: 'from-yellow-400 to-amber-500', quote: 'Fast and sharp mental math!' },
  { emoji: '🐃', name: 'Benny the Buffalo', specialty: 'Word Problems & Money', color: 'from-purple-400 to-violet-500', quote: 'Strong together, solving every riddle!' },
  { emoji: '🦓', name: 'Ziggy the Zebra', specialty: '2D Shapes & Symmetry', color: 'from-rose-400 to-pink-500', quote: 'Spotting patterns across the savanna!' },
];

export const LandingPage: React.FC<LandingPageProps> = ({ 
  onGetStarted, 
  onQuickPlay,
  onParentPortal,
  onOpenTimesTable,
  onOpenDivisionTable,
  onSelectTopic,
  existingProfile
}) => {
  const [selectedBuddyIndex, setSelectedBuddyIndex] = useState(0);
  const [solvedSample, setSolvedSample] = useState(false);
  const [sampleSelectedOption, setSampleSelectedOption] = useState<number | null>(null);
  const [sampleError, setSampleError] = useState(false);

  const currentBuddy = BUDDIES[selectedBuddyIndex];

  const handleBuddyClick = (index: number) => {
    setSelectedBuddyIndex(index);
    SoundService.playTap(index);
    speechService.speak(BUDDIES[index].quote);
  };

  const handleSampleAnswer = (option: number) => {
    setSampleSelectedOption(option);
    if (option === 40) {
      setSolvedSample(true);
      setSampleError(false);
      SoundService.playCorrect();
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
      speechService.speak('Lekker! Correct! 4 times 15 is 60, and 100 minus 60 is 40 Rands change!');
    } else {
      setSampleError(true);
      SoundService.playIncorrect();
      speechService.speak('Almost! Think: 4 packets at 15 Rands is 60 Rands. How much change from 100?');
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFF] text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Top Banner: South Africa CAPS Badge */}
      <div className="bg-slate-900 text-white py-2.5 px-4 text-center border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-xs font-black uppercase tracking-wider">
          <span className="text-base">🇿🇦</span>
          <span>100% South African CAPS Grade 4 Mathematics Curriculum</span>
          <span className="hidden sm:inline text-amber-400">• Free & Instant Access</span>
        </div>
      </div>

      {/* Main Sticky Navigation */}
      <nav className="sticky top-0 left-0 w-full z-50 bg-white/90 backdrop-blur-xl border-b border-slate-100 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between">
          <Logo size="md" />

          {/* Center Links */}
          <div className="hidden lg:flex items-center gap-8 text-xs font-black uppercase tracking-wider text-slate-500">
            <a href="#buddies" className="hover:text-indigo-600 transition-colors">🦁 Safari Buddies</a>
            <a href="#curriculum" className="hover:text-indigo-600 transition-colors">📚 CAPS Topics</a>
            <a href="#tables" className="hover:text-indigo-600 transition-colors">✖️ Tables</a>
            <a href="#features" className="hover:text-indigo-600 transition-colors">✨ Features</a>
            <a href="#parents" className="hover:text-indigo-600 transition-colors">👨‍👩‍👧 Parents</a>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {onParentPortal && (
              <button
                onClick={onParentPortal}
                className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-2xl hover:bg-slate-200 transition-all font-black text-xs uppercase tracking-wider"
              >
                <UserCheck className="w-4 h-4 text-indigo-600" />
                <span>Parent Portal</span>
              </button>
            )}

            <button
              onClick={onQuickPlay}
              className="px-5 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider shadow-md hover:brightness-105 active:scale-95 transition-all flex items-center gap-2 border-b-4 border-emerald-700"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>{existingProfile?.buddyData ? 'Resume Game' : 'Play Now'}</span>
            </button>

            <button
              onClick={onGetStarted}
              className="px-4 sm:px-5 py-2.5 sm:py-3 bg-slate-900 text-white rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider hover:bg-slate-800 active:scale-95 transition-all shadow-sm"
            >
              Sign In
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 sm:pt-16 sm:pb-28 px-4 sm:px-8 overflow-hidden">
        {/* Soft colorful background glow */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-tr from-indigo-500/10 via-purple-500/10 to-amber-500/10 rounded-full blur-[100px] -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline and Call-to-actions */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-black uppercase tracking-wider shadow-xs">
              <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
              <span>South Africa's Fun Math Companion</span>
            </div>

            <h1 className="text-4xl sm:text-6xl xl:text-7xl font-black tracking-tight text-slate-900 leading-[1.05]">
              Turn Grade 4 Math <br />
              Into An <span className="bg-gradient-to-r from-spark-primary via-spark-secondary to-spark-accent bg-clip-text text-transparent">Epic Adventure! 🇿🇦</span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Step into the African savanna with your Big Five Safari Buddy. Master times tables, fractions, 4-digit column addition, and biltong word problems with zero math anxiety!
            </p>

            {/* Quick Resume banner if guest profile exists */}
            {existingProfile?.buddyData && (
              <div className="p-4 bg-emerald-50 border-2 border-emerald-200 rounded-2xl flex items-center justify-between max-w-lg mx-auto lg:mx-0 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="text-3xl p-1 bg-white rounded-xl shadow-xs border border-emerald-100">
                    {existingProfile.buddyData.avatar}
                  </div>
                  <div className="text-left">
                    <p className="font-black text-emerald-900 text-sm">Welcome back, {existingProfile.buddyData.name}!</p>
                    <p className="text-emerald-700 text-xs font-bold flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                      {existingProfile.buddyData.stars} stars • {existingProfile.buddyData.dailyLearningStreak || 1} day streak
                    </p>
                  </div>
                </div>
                <button
                  onClick={onQuickPlay}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-black text-xs uppercase tracking-wider hover:bg-emerald-700 transition-all flex items-center gap-1.5"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Main Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <motion.button
                whileHover={{ scale: 1.02, translateY: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  SoundService.playTap(0);
                  onQuickPlay();
                }}
                className="w-full sm:w-auto px-8 sm:px-10 py-5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-[2rem] font-black text-lg sm:text-xl shadow-xl shadow-emerald-500/20 hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-3 border-b-6 border-emerald-700"
              >
                <Play className="w-6 h-6 fill-white" />
                <span>Start Learning (Instant Play)</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02, translateY: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  SoundService.playTap(1);
                  if (onOpenTimesTable) onOpenTimesTable();
                  else onQuickPlay();
                }}
                className="w-full sm:w-auto px-8 py-5 bg-white text-slate-800 border-2 border-slate-200 rounded-[2rem] font-black text-lg shadow-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-2 border-b-4 border-slate-300"
              >
                <span>✖️ Times Tables</span>
              </motion.button>
            </div>

            {/* Quick trust metrics */}
            <div className="grid grid-cols-3 gap-4 pt-4 max-w-lg mx-auto lg:mx-0 border-t border-slate-100">
              <div className="text-center lg:text-left">
                <p className="text-2xl font-black text-slate-900">100%</p>
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-wider">CAPS 2026</p>
              </div>
              <div className="text-center lg:text-left">
                <p className="text-2xl font-black text-emerald-600">Free</p>
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-wider">No Paywalls</p>
              </div>
              <div className="text-center lg:text-left">
                <p className="text-2xl font-black text-indigo-600">Grade 4</p>
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-wider">Ages 9 - 10</p>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Live Math Challenge Card */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-[3rem] p-6 sm:p-8 shadow-2xl border-4 border-indigo-100 relative">
              
              {/* Safari Buddy Header on Card */}
              <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <motion.div 
                    key={currentBuddy.emoji}
                    animate={{ rotate: [0, 8, -8, 0], scale: [1, 1.1, 1] }}
                    transition={{ duration: 0.5 }}
                    className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center text-4xl shadow-sm border border-amber-200/60"
                  >
                    {currentBuddy.emoji}
                  </motion.div>
                  <div>
                    <h3 className="font-black text-slate-900 text-lg leading-tight">{currentBuddy.name}</h3>
                    <p className="text-xs font-bold text-amber-600">{currentBuddy.specialty}</p>
                  </div>
                </div>

                <button
                  onClick={() => speechService.speak(currentBuddy.quote)}
                  className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl hover:bg-indigo-100 transition-colors"
                  title="Listen to buddy"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>

              {/* Buddy Switcher Pills */}
              <div className="py-4">
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-wider mb-2">
                  Tap to choose your Safari Buddy:
                </p>
                <div className="flex justify-between gap-1.5">
                  {BUDDIES.map((b, idx) => (
                    <button
                      key={b.name}
                      onClick={() => handleBuddyClick(idx)}
                      className={`text-2xl p-2.5 rounded-2xl border-2 transition-all ${
                        selectedBuddyIndex === idx 
                          ? 'border-indigo-600 bg-indigo-50 scale-110 shadow-sm' 
                          : 'border-slate-100 bg-slate-50 hover:bg-white'
                      }`}
                      title={b.name}
                    >
                      {b.emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Interactive Sample Question */}
              <div className="bg-indigo-50/70 p-5 rounded-2xl border-2 border-indigo-100 my-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-1 bg-indigo-600 text-white rounded-full text-[10px] font-black uppercase tracking-wider">
                    Safari Quest
                  </span>
                  <span className="text-xs font-black text-indigo-700 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                    +10 Stars
                  </span>
                </div>

                <p className="text-slate-800 font-bold text-sm sm:text-base leading-snug">
                  "Sipho buys <strong>4 packets of biltong</strong> for <strong>R15 each</strong>. He pays with a <strong>R100 note</strong>. How much change does he get?"
                </p>
              </div>

              {/* Options */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                {[
                  { val: 60, label: 'R60' },
                  { val: 40, label: 'R40 (Correct)' },
                  { val: 45, label: 'R45' },
                  { val: 25, label: 'R25' }
                ].map((opt) => {
                  const isChosen = sampleSelectedOption === opt.val;
                  const isCorrect = opt.val === 40;
                  return (
                    <motion.button
                      key={opt.val}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSampleAnswer(opt.val)}
                      className={`p-4 rounded-2xl font-black text-lg transition-all border-2 text-center shadow-xs ${
                        isChosen && isCorrect
                          ? 'bg-emerald-500 text-white border-emerald-600 shadow-emerald-200'
                          : isChosen && !isCorrect
                          ? 'bg-rose-100 text-rose-700 border-rose-300'
                          : 'bg-white text-slate-800 border-slate-200 hover:border-indigo-400'
                      }`}
                    >
                      {opt.val === 40 ? 'R40' : opt.label}
                    </motion.button>
                  );
                })}
              </div>

              {/* Feedback banner */}
              {solvedSample && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <p className="text-xs font-black text-emerald-900">Brilliant! 4 × R15 = R60, R100 - R60 = R40</p>
                  </div>
                  <button
                    onClick={onQuickPlay}
                    className="px-3 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-black uppercase tracking-wider hover:bg-emerald-700 transition-colors shrink-0"
                  >
                    Play Quests 🚀
                  </button>
                </motion.div>
              )}

              {sampleError && (
                <p className="text-xs font-bold text-rose-500 mt-2 text-center">
                  💡 Hint: 4 packets × R15 = R60 total spent. Subtract R60 from R100!
                </p>
              )}

            </div>
          </div>

        </div>
      </section>

      {/* Meet The Big Five Safari Buddies Section */}
      <section id="buddies" className="py-20 bg-slate-50/60 border-y border-slate-100 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-black uppercase tracking-wider">
              <span>🦁 Friendly Learning Companions</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
              Meet Your Big Five Math Buddies
            </h2>
            <p className="text-base sm:text-lg text-slate-600 font-medium">
              Every learner chooses a buddy that cheers for them, celebrates streaks, and gives gentle hints when questions get tricky.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {BUDDIES.map((buddy, i) => (
              <motion.div
                key={buddy.name}
                whileHover={{ translateY: -4 }}
                className="bg-white p-6 rounded-3xl border-2 border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-5xl p-3 bg-slate-50 rounded-2xl group-hover:scale-110 transition-transform">
                      {buddy.emoji}
                    </div>
                    <button
                      onClick={() => {
                        SoundService.playTap(i);
                        speechService.speak(buddy.quote);
                      }}
                      className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
                      title="Speak"
                    >
                      <Volume2 className="w-5 h-5" />
                    </button>
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-1">{buddy.name}</h3>
                  <p className="text-xs font-black uppercase tracking-wider text-indigo-600 mb-3">{buddy.specialty}</p>
                  <p className="text-sm text-slate-600 font-medium italic">"{buddy.quote}"</p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">Safari Grade 4</span>
                  <button
                    onClick={() => {
                      setSelectedBuddyIndex(i);
                      onQuickPlay();
                    }}
                    className="text-xs font-black text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                  >
                    <span>Play With {buddy.name.split(' ')[0]}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CAPS Curriculum Topics Section */}
      <section id="curriculum" className="py-20 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-black uppercase tracking-wider">
              <span>📚 2026 CAPS Aligned</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
              Grade 4 Math Topics Built Step-by-Step
            </h2>
            <p className="text-base sm:text-lg text-slate-600 font-medium">
              From Term 1 to Term 4, every topic follows the South African Annual Teaching Plan with localized examples.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: '➕ Addition & Subtraction',
                desc: 'Up to 4-digit numbers with carrying and borrowing, breaking down numbers, and quick mental math.',
                topic: Operation.ADDITION,
                color: 'bg-emerald-50 text-emerald-700 border-emerald-200'
              },
              {
                title: '✖️ Times Tables (1-12×)',
                desc: 'Master the 2× to 12× times tables with visual arrays, speed rounds, and memory strategies.',
                topic: Operation.MULTIPLICATION_TABLE,
                color: 'bg-purple-50 text-purple-700 border-purple-200'
              },
              {
                title: '➗ Division & Sharing',
                desc: 'Equal sharing baskets, remainders, and long division steps with real-life biltong and sweets.',
                topic: Operation.DIVISION,
                color: 'bg-orange-50 text-orange-700 border-orange-200'
              },
              {
                title: '🍕 Fractions & Pizzas',
                desc: 'Halves, thirds, quarters, and eighths with visual shaded shapes and comparing fractions.',
                topic: Operation.FRACTIONS,
                color: 'bg-pink-50 text-pink-700 border-pink-200'
              },
              {
                title: '💵 Money & Change',
                desc: 'South African Rands (R) and cents (c), shopping bills, calculating change, and savings.',
                topic: Operation.NUMBER_SENTENCES,
                color: 'bg-amber-50 text-amber-700 border-amber-200'
              },
              {
                title: '⏰ Time & Clocks',
                desc: 'Analog clocks, digital 24-hour time, hours, minutes, seconds, and reading timetables.',
                topic: Operation.TIME,
                color: 'bg-indigo-50 text-indigo-700 border-indigo-200'
              },
              {
                title: '📐 Shapes & Space',
                desc: '2D shapes, 3D geometric objects, sides, vertices, perimeter, and area grid counting.',
                topic: Operation.SHAPES_2D,
                color: 'bg-teal-50 text-teal-700 border-teal-200'
              },
              {
                title: '📊 Data & Patterns',
                desc: 'Bar graphs, tally charts, number patterns, repeating sequences, and finding the rule.',
                topic: Operation.PATTERNS,
                color: 'bg-blue-50 text-blue-700 border-blue-200'
              }
            ].map((card) => (
              <div 
                key={card.title}
                className="bg-white p-6 rounded-3xl border-2 border-slate-100 shadow-sm flex flex-col justify-between hover:border-indigo-300 transition-all group"
              >
                <div>
                  <h3 className="text-lg font-black text-slate-900 mb-2">{card.title}</h3>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">{card.desc}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => {
                      if (onSelectTopic) onSelectTopic(card.topic);
                      else onQuickPlay();
                    }}
                    className="w-full py-2.5 bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 rounded-xl text-xs font-black uppercase tracking-wider transition-colors flex items-center justify-center gap-1"
                  >
                    <span>Practice Topic</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Times & Division Table Quick Launch Highlight */}
      <section id="tables" className="py-16 bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-950 text-white px-4 sm:px-8">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-black uppercase tracking-wider text-amber-300 mb-4">
              <Zap className="w-4 h-4 fill-current" />
              <span>Times Tables Superpower</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-4">
              Master 1× to 12× Tables with Instant Feedback
            </h2>
            <p className="text-indigo-200 font-medium text-base mb-8 leading-relaxed">
              Grade 4 learners who know their times tables unlock speed in division, fractions, and word problems. Use our interactive grids to practice row by row.
            </p>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => {
                  if (onOpenTimesTable) onOpenTimesTable();
                  else onQuickPlay();
                }}
                className="px-6 py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-2xl text-sm uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg"
              >
                <span>✖️ Open Times Tables Grid</span>
              </button>
              <button
                onClick={() => {
                  if (onOpenDivisionTable) onOpenDivisionTable();
                  else onQuickPlay();
                }}
                className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-black rounded-2xl text-sm uppercase tracking-wider transition-all flex items-center gap-2 border border-white/20"
              >
                <span>➗ Open Division Tables</span>
              </button>
            </div>
          </div>

          {/* Mini Interactive Times Table Preview */}
          <div className="bg-white/10 backdrop-blur-md p-6 sm:p-8 rounded-[2.5rem] border border-white/15">
            <h4 className="text-lg font-black text-amber-300 mb-4 flex items-center gap-2">
              <span>⚡ Rapid Table Quick Tap: 7× Table</span>
            </h4>
            <div className="grid grid-cols-4 gap-2.5">
              {[
                { q: '7 × 2', a: 14 },
                { q: '7 × 3', a: 21 },
                { q: '7 × 5', a: 35 },
                { q: '7 × 6', a: 42 },
                { q: '7 × 7', a: 49 },
                { q: '7 × 8', a: 56 },
                { q: '7 × 9', a: 63 },
                { q: '7 × 12', a: 84 },
              ].map((item, idx) => (
                <button
                  key={item.q}
                  onClick={() => {
                    SoundService.playTap(idx);
                    speechService.speak(`${item.q} equals ${item.a}`);
                  }}
                  className="p-3 bg-white/10 hover:bg-amber-400 hover:text-slate-900 rounded-xl text-center transition-colors group"
                >
                  <p className="text-xs font-bold text-indigo-200 group-hover:text-slate-900">{item.q}</p>
                  <p className="text-base font-black text-white group-hover:text-slate-900">{item.a}</p>
                </button>
              ))}
            </div>
            <p className="text-xs text-indigo-300 mt-4 text-center font-medium">
              Tap any card to hear the times table aloud with speech synthesis!
            </p>
          </div>
        </div>
      </section>

      {/* Features: Built for Real South African Kids */}
      <section id="features" className="py-20 px-4 sm:px-8 bg-slate-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-black uppercase tracking-wider">
              <span>💡 Thoughtful Learning Design</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
              Why MathSpark Makes Math Click
            </h2>
            <p className="text-base sm:text-lg text-slate-600 font-medium">
              We took everything kids find frustrating about worksheets and replaced it with encouragement, concrete visuals, and South African stories.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl border-2 border-slate-100 shadow-sm space-y-4">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center text-2xl font-black">
                🇿🇦
              </div>
              <h3 className="text-xl font-black text-slate-900">Proudly South African Context</h3>
              <p className="text-sm text-slate-600 font-medium leading-relaxed">
                Word problems about Rands, 50c coins, biltong packets, rugby matches, and Kruger park game drives. No alien currency or confusing foreign terms!
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border-2 border-slate-100 shadow-sm space-y-4">
              <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center text-2xl">
                🎨
              </div>
              <h3 className="text-xl font-black text-slate-900">Interactive Visual Aids</h3>
              <p className="text-sm text-slate-600 font-medium leading-relaxed">
                Tap-to-count apples and blocks, shaded fraction circles, number lines, and place value cubes make abstract numbers visual and tangible.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border-2 border-slate-100 shadow-sm space-y-4">
              <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center text-2xl">
                🔊
              </div>
              <h3 className="text-xl font-black text-slate-900">Audio Speech & Gentle Hints</h3>
              <p className="text-sm text-slate-600 font-medium leading-relaxed">
                Learners can tap to hear any question or explanation read aloud. If they get stuck, their buddy steps in with friendly step-by-step guidance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Parent & Teacher Portal Section */}
      <section id="parents" className="py-20 px-4 sm:px-8 border-t border-slate-100">
        <div className="max-w-7xl mx-auto bg-gradient-to-tr from-slate-900 to-indigo-950 text-white rounded-[3rem] p-8 sm:p-14 overflow-hidden relative">
          <div className="max-w-2xl space-y-6 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-black uppercase tracking-wider text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Parent & Teacher Intelligence</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              See Exactly Where Your Child Shines & Where They Need Support
            </h2>

            <p className="text-slate-300 font-medium text-base sm:text-lg leading-relaxed">
              MathSpark includes a dedicated portal for parents and teachers. Monitor CAPS mastery, review questions attempted, track daily 5-minute streaks, and print progress summaries.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-sm font-bold text-slate-200">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Zero guesswork: breakdown by addition, times tables, division, and fractions</span>
              </div>
              <div className="flex items-center gap-3 text-sm font-bold text-slate-200">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Private & safe: guest profiles stored locally with optional cloud sync</span>
              </div>
              <div className="flex items-center gap-3 text-sm font-bold text-slate-200">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>100% Free: built for South African families and schools</span>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap gap-4">
              <button
                onClick={onParentPortal || onQuickPlay}
                className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-2xl text-base uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg"
              >
                <UserCheck className="w-5 h-5" />
                <span>Open Parent Portal</span>
              </button>
              <button
                onClick={onGetStarted}
                className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-black rounded-2xl text-base uppercase tracking-wider transition-all border border-white/20"
              >
                Sign In With Email
              </button>
            </div>
          </div>

          {/* Decorative stats card in portal preview */}
          <div className="hidden lg:block absolute -right-10 top-1/2 -translate-y-1/2 w-[420px] bg-white/10 backdrop-blur-xl p-8 rounded-3xl border border-white/20 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-white/15">
              <span className="font-black text-sm uppercase tracking-wider text-amber-300">Grade 4 Learner Report</span>
              <span className="text-xs bg-emerald-500 text-slate-950 font-black px-2.5 py-1 rounded-full">ACTIVE</span>
            </div>
            <div>
              <p className="text-xs text-slate-300 font-bold uppercase">Multiplication Mastery</p>
              <div className="w-full bg-white/20 h-3 rounded-full mt-1.5 overflow-hidden">
                <div className="bg-emerald-400 h-full rounded-full w-[85%]" />
              </div>
              <p className="text-right text-xs font-black text-emerald-300 mt-1">85% Mastery</p>
            </div>
            <div>
              <p className="text-xs text-slate-300 font-bold uppercase">Fractions Practice</p>
              <div className="w-full bg-white/20 h-3 rounded-full mt-1.5 overflow-hidden">
                <div className="bg-amber-400 h-full rounded-full w-[70%]" />
              </div>
              <p className="text-right text-xs font-black text-amber-300 mt-1">70% Mastery</p>
            </div>
            <div className="p-3 bg-white/10 rounded-2xl text-xs text-slate-200">
              🦁 Sparky says: "Great progress on the 7× table this week!"
            </div>
          </div>
        </div>
      </section>

      {/* Ready to Spark: Final CTA */}
      <section className="py-24 text-center px-4 sm:px-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="text-6xl animate-bounce">🦁</div>
          <h2 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight">
            Ready to Spark Your Child's Math Power?
          </h2>
          <p className="text-lg sm:text-xl text-slate-600 font-medium">
            Jump in right now without creating an account, or sign in to save stars and streaks across devices.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => {
                SoundService.playTap(2);
                onQuickPlay();
              }}
              className="w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-[2rem] font-black text-xl shadow-xl shadow-emerald-500/25 hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-3 border-b-6 border-emerald-700"
            >
              <Play className="w-6 h-6 fill-white" />
              <span>Start Learning Now (Free)</span>
            </button>
            <button
              onClick={onGetStarted}
              className="w-full sm:w-auto px-8 py-5 bg-slate-900 text-white rounded-[2rem] font-black text-xl hover:bg-slate-800 transition-all shadow-md"
            >
              Sign In / Register
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-white border-t border-slate-100 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <Logo size="sm" />
          <p className="text-xs text-slate-500 font-bold text-center">
            Made with ❤️ for Grade 4 learners across South Africa 🇿🇦 • Aligned with CAPS 2026 Mathematics Curriculum
          </p>
          <div className="flex items-center gap-4 text-xs font-black uppercase tracking-wider text-slate-400">
            <span>© 2026 MathSpark</span>
          </div>
        </div>
      </footer>

    </div>
  );
};
