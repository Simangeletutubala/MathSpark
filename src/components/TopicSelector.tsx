import React from 'react';
import { motion } from 'motion/react';
import { 
  Plus, 
  Minus, 
  X, 
  Divide, 
  Hash, 
  Target, 
  PieChart,
  ChevronLeft,
  Play,
  FileText,
  Layers,
  Square,
  Box,
  BarChart,
  Ruler,
  Clock,
  Maximize,
  HelpCircle,
  ChevronRight,
  School,
  Zap,
  Volume2
} from 'lucide-react';
import { Operation, BuddyProfile, Term } from '../types';
import { MathService } from '../services/MathService';
import { speechService } from '../services/SpeechService';
import { Guide } from './Guide';

interface TopicSelectorProps {
  profile: BuddyProfile;
  onSelect: (topic?: Operation) => void;
  onBack: () => void;
  onMultiplicationTable: () => void;
  onTermChange: (term: Term) => void;
}

const TOPIC_CONFIG: Record<Operation, { icon: any, color: string, label: string, subtitle: string }> = {
  [Operation.ADDITION]: { icon: Plus, color: 'bg-green-500', label: 'Addition', subtitle: 'Plus & Total ➕' },
  [Operation.SUBTRACTION]: { icon: Minus, color: 'bg-blue-500', label: 'Subtraction', subtitle: 'Take Away ➖' },
  [Operation.MULTIPLICATION]: { icon: X, color: 'bg-purple-500', label: 'Multiplication', subtitle: 'Equal Groups ✖️' },
  [Operation.DIVISION]: { icon: Divide, color: 'bg-orange-500', label: 'Division', subtitle: 'Fair Sharing ➗' },
  [Operation.ROUNDING]: { icon: Target, color: 'bg-red-500', label: 'Rounding', subtitle: 'Nearest 10 & 100 🎯' },
  [Operation.PLACE_VALUE]: { icon: Hash, color: 'bg-indigo-500', label: 'Place Value', subtitle: 'Units & Tens 🧩' },
  [Operation.FRACTIONS]: { icon: PieChart, color: 'bg-pink-500', label: 'Fractions', subtitle: 'Pizza & Bars 🍰' },
  [Operation.NUMBER_SENTENCES]: { icon: FileText, color: 'bg-yellow-500', label: 'Number Sentences', subtitle: 'Mystery Box ❓' },
  [Operation.PATTERNS]: { icon: Layers, color: 'bg-teal-500', label: 'Patterns', subtitle: 'Number Steps 🔢' },
  [Operation.SHAPES_2D]: { icon: Square, color: 'bg-orange-600', label: '2D Shapes', subtitle: 'Sides & Corners 🔷' },
  [Operation.OBJECTS_3D]: { icon: Box, color: 'bg-red-600', label: '3D Objects', subtitle: 'Cubes & Balls 📦' },
  [Operation.DATA_HANDLING]: { icon: BarChart, color: 'bg-blue-600', label: 'Data Handling', subtitle: 'Bar Graphs 📊' },
  [Operation.MEASUREMENT]: { icon: Ruler, color: 'bg-green-600', label: 'Measurement', subtitle: 'Metres & cm 📏' },
  [Operation.TIME]: { icon: Clock, color: 'bg-indigo-600', label: 'Time', subtitle: 'Clocks & Hours ⏰' },
  [Operation.PERIMETER_AREA]: { icon: Maximize, color: 'bg-purple-600', label: 'Perimeter & Area', subtitle: 'Around & Inside 📐' },
  [Operation.PROBABILITY]: { icon: HelpCircle, color: 'bg-pink-600', label: 'Probability', subtitle: 'Chance & Dice 🎲' },
  [Operation.MULTIPLICATION_TABLE]: { icon: X, color: 'bg-amber-500', label: 'Multiplication Table', subtitle: '1× to 12× Tables ⭐' },
  [Operation.DIVISION_TABLE]: { icon: Divide, color: 'bg-emerald-500', label: 'Division Table', subtitle: '÷1 to ÷12 Tables 🎈' },
};

export const TopicSelector: React.FC<TopicSelectorProps> = ({ profile, onSelect, onBack, onMultiplicationTable, onTermChange }) => {
  const [guideMsg] = React.useState('Pick an adventure to start!');
  const currentTerm = profile.currentTerm || Term.TERM_1;
  const termTopics = MathService.getTopicsForTerm(currentTerm);
  const enabledOps = (profile.enabledOperations || []).filter(op => termTopics.includes(op));

  const terms = [
    { id: Term.TERM_1, label: 'Term 1' },
    { id: Term.TERM_2, label: 'Term 2' },
    { id: Term.TERM_3, label: 'Term 3' },
    { id: Term.TERM_4, label: 'Term 4' },
  ];

  return (
    <div className="relative">
      <Guide message={guideMsg} />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="space-y-8"
      >
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={onBack}
              className="p-3 bg-white rounded-2xl shadow-sm border-2 border-indigo-50 hover:bg-indigo-50 transition-all active:scale-90 min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <ChevronLeft className="w-6 h-6 text-indigo-600" />
            </button>
            <div className="text-right sm:hidden">
              <h2 className="text-2xl font-black text-gray-900 tracking-tight leading-none">Adventure Map</h2>
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-1 p-1 bg-indigo-100/50 backdrop-blur-sm rounded-2xl border-2 border-white/50">
            {terms.map((term) => (
              <button
                key={term.id}
                onClick={() => onTermChange(term.id)}
                className={`py-2.5 rounded-xl text-[10px] font-black transition-all min-h-[44px] flex items-center justify-center ${
                  currentTerm === term.id 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'text-indigo-600 hover:bg-white/50'
                }`}
              >
                {term.id.replace('TERM_', 'T')}
              </button>
            ))}
          </div>
        </div>

        <div className="hidden sm:block">
          <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Adventure Map 🗺️</h2>
          <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">Pick your math quest for {currentTerm.replace('_', ' ')}</p>
        </div>

      <div className="grid gap-8">
        {/* Featured Big Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <motion.button
            whileHover={{ y: -5 }}
            onClick={() => {
              speechService.speak('Mixed Adventure');
              onSelect();
            }}
            className="p-5 sm:p-6 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-[2rem] sm:rounded-[2.5rem] text-white shadow-xl flex flex-row sm:flex-col justify-between items-center sm:items-start gap-3 sm:gap-4 group transition-all min-h-[80px]"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-inner group-hover:rotate-12 transition-transform shrink-0">
              <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-current" />
            </div>
            <div className="text-left">
              <p className="font-black text-xl sm:text-2xl leading-none">Mixed Blast</p>
              <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mt-1">All Topics</p>
            </div>
            <ChevronRight className="w-5 h-5 opacity-40 sm:hidden" />
          </motion.button>

          <motion.button
            whileHover={{ y: -5 }}
            onClick={() => {
              speechService.speak('Multiplication Tables');
              onMultiplicationTable();
            }}
            className="p-5 sm:p-6 bg-gradient-to-br from-amber-400 to-amber-600 rounded-[2rem] sm:rounded-[2.5rem] text-white shadow-xl flex flex-row sm:flex-col justify-between items-center sm:items-start gap-3 sm:gap-4 group transition-all min-h-[80px]"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-inner group-hover:rotate-12 transition-transform shrink-0">
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="text-left">
              <p className="font-black text-xl sm:text-2xl leading-none">X-Tables</p>
              <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mt-1">Master Multi</p>
            </div>
            <ChevronRight className="w-5 h-5 opacity-40 sm:hidden" />
          </motion.button>

          <motion.button
            whileHover={{ y: -5 }}
            onClick={() => {
              speechService.speak('Division Tables');
              onSelect(Operation.DIVISION_TABLE);
            }}
            className="p-5 sm:p-6 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-[2rem] sm:rounded-[2.5rem] text-white shadow-xl flex flex-row sm:flex-col justify-between items-center sm:items-start gap-3 sm:gap-4 group transition-all min-h-[80px]"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-inner group-hover:rotate-12 transition-transform shrink-0">
              <Divide className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="text-left">
              <p className="font-black text-xl sm:text-2xl leading-none">Divide Hero</p>
              <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mt-1">Division Skill</p>
            </div>
            <ChevronRight className="w-5 h-5 opacity-40 sm:hidden" />
          </motion.button>
        </div>

        {/* Regular Topics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {enabledOps.map((op) => {
            const config = TOPIC_CONFIG[op];
            const Icon = config.icon;
            return (
              <motion.button
                key={op}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => {
                  speechService.speak(`${config.label}. ${config.subtitle}`);
                  onSelect(op);
                }}
                className="p-3.5 sm:p-5 bg-white rounded-[1.8rem] border-2 border-slate-100 shadow-md flex flex-col items-center gap-2.5 hover:border-indigo-200 transition-all group relative overflow-hidden min-h-[120px] text-center"
              >
                <div className={`w-12 h-12 sm:w-14 sm:h-14 ${config.color} rounded-2xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform shrink-0`}>
                  <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <div className="flex flex-col items-center">
                  <span className="font-black text-slate-800 text-xs sm:text-sm leading-tight">{config.label}</span>
                  <span className="text-[10px] font-bold text-slate-400 mt-0.5">{config.subtitle}</span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="pt-8 border-t border-slate-100">
        <div className="mb-6">
          <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Target className="w-5 h-5 text-slate-300" />
            Next Level (Premium)
          </h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Expanding the Spark Universe</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'Grade 5 Mastery', icon: School },
            { label: 'Coding Math', icon: Zap },
          ].map((item, i) => (
            <div key={i} className="p-6 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 flex flex-col items-center gap-4 opacity-50 relative group">
              <div className="absolute top-4 right-4 text-[7px] font-black uppercase tracking-[0.2em] px-1.5 py-0.5 bg-slate-200 text-slate-500 rounded-md">Coming Soon</div>
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                <item.icon className="w-6 h-6 text-slate-300" />
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter text-center">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
    </div>
  );
};
