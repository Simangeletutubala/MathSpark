import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Apple, 
  Star, 
  Circle, 
  Box, 
  Layers, 
  RotateCcw, 
  Sparkles,
  Check,
  ChevronRight,
  Eye,
  Grid,
  Maximize2,
  Clock as ClockIcon,
  Ruler as RulerIcon
} from 'lucide-react';
import { Operation } from '../types';
import { SoundService } from '../services/SoundService';

interface VisualAidProps {
  num1: number;
  num2: number;
  operation: Operation;
  category?: 'money' | 'time' | 'sharing' | 'general';
  interactive?: boolean;
  onInteraction?: (value: number) => void;
  iconType?: string;
}

export const VisualAid: React.FC<VisualAidProps> = ({ 
  num1, 
  num2, 
  operation, 
  iconType = 'apple',
  onInteraction 
}) => {
  const [countedSet, setCountedSet] = useState<Set<number>>(new Set());
  const [activeTab, setActiveTab] = useState<'objects' | 'numberLine' | 'array' | 'strip'>('objects');
  const [selectedPlaceColumn, setSelectedPlaceColumn] = useState<number | null>(null);

  const handleTapItem = (id: number) => {
    setCountedSet(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
        SoundService.playTap(next.size);
      }
      return next;
    });
  };

  const handleResetCount = () => {
    setCountedSet(new Set());
  };

  // Render icon based on iconType
  const renderIcon = (index: number, isCrossedOut = false, label?: number, size = 'w-7 h-7 sm:w-8 sm:h-8') => {
    const isCounted = countedSet.has(index);

    let IconComp = Apple;
    let colorClasses = 'text-rose-500 fill-rose-100';

    if (iconType === 'orange') {
      IconComp = Circle;
      colorClasses = 'text-amber-500 fill-amber-200';
    } else if (iconType === 'star') {
      IconComp = Star;
      colorClasses = 'text-amber-400 fill-amber-300';
    } else if (iconType === 'ball') {
      IconComp = Circle;
      colorClasses = 'text-indigo-600 fill-indigo-100 border-2 border-indigo-500';
    } else if (iconType === 'block') {
      IconComp = Box;
      colorClasses = 'text-sky-500 fill-sky-100';
    } else if (iconType === 'counter') {
      IconComp = Circle;
      colorClasses = 'text-emerald-500 fill-emerald-200';
    }

    return (
      <motion.button
        type="button"
        key={index}
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => handleTapItem(index)}
        aria-label={`Count item ${index + 1}`}
        className={`relative p-1.5 sm:p-2 rounded-2xl transition-all flex items-center justify-center cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-spark-primary ${
          isCounted 
            ? 'bg-amber-100 ring-2 ring-amber-400 shadow-md scale-105' 
            : 'bg-white hover:bg-slate-50 shadow-sm border border-slate-100'
        } ${isCrossedOut ? 'opacity-35 grayscale' : ''}`}
      >
        <IconComp className={`${size} ${colorClasses}`} />

        {/* Counter Badge if tapped */}
        {isCounted && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-amber-500 text-white rounded-full text-[10px] font-black flex items-center justify-center shadow-md ring-2 ring-white"
          >
            {label || Array.from(countedSet).indexOf(index) + 1}
          </motion.span>
        )}

        {/* Red X for crossed out items in Subtraction */}
        {isCrossedOut && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-0.5 h-7 bg-rose-500 rotate-45 rounded-full absolute" />
            <div className="w-0.5 h-7 bg-rose-500 -rotate-45 rounded-full absolute" />
          </div>
        )}
      </motion.button>
    );
  };

  // ADDITION
  if (operation === Operation.ADDITION) {
    const isSmallNumbers = num1 <= 15 && num2 <= 15;

    return (
      <div className="w-full bg-slate-50/70 border-2 border-slate-200/60 rounded-[2rem] p-4 sm:p-6 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
            <Eye className="w-4 h-4 text-spark-primary" />
            Visual Model · Tap objects to count
          </span>
          <div className="flex items-center gap-2">
            {countedSet.size > 0 && (
              <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-[10px] font-black rounded-full flex items-center gap-1">
                <Check className="w-3 h-3 text-amber-600" />
                Counted: {countedSet.size}
              </span>
            )}
            {countedSet.size > 0 && (
              <button
                type="button"
                onClick={handleResetCount}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 text-xs"
                title="Reset counter"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {isSmallNumbers ? (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              {/* Group 1 */}
              <div className="flex-1 w-full bg-white p-3 sm:p-4 rounded-2xl border border-indigo-100 shadow-sm flex flex-col items-center">
                <span className="text-xs font-black text-indigo-600 mb-2">Group 1 ({num1})</span>
                <div className="flex flex-wrap justify-center gap-1.5 max-w-[180px]">
                  {Array.from({ length: num1 }).map((_, i) => renderIcon(i))}
                </div>
              </div>

              {/* Plus sign */}
              <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center font-black text-lg shrink-0">
                +
              </div>

              {/* Group 2 */}
              <div className="flex-1 w-full bg-white p-3 sm:p-4 rounded-2xl border border-emerald-100 shadow-sm flex flex-col items-center">
                <span className="text-xs font-black text-emerald-600 mb-2">Group 2 ({num2})</span>
                <div className="flex flex-wrap justify-center gap-1.5 max-w-[180px]">
                  {Array.from({ length: num2 }).map((_, i) => renderIcon(num1 + i))}
                </div>
              </div>
            </div>

            {/* Helper Caption */}
            <p className="text-center text-xs font-bold text-slate-600">
              👉 Tap the objects one by one to count the total ({num1} + {num2} = {num1 + num2})!
            </p>
          </div>
        ) : (
          /* Base-10 Blocks / Expanded Model for Grade 4 Numbers */
          <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3">
            <p className="text-xs font-bold text-slate-600 text-center">
              Break down into Tens and Units (CAPS method):
            </p>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-indigo-50/70 p-3 rounded-xl border border-indigo-100">
                <p className="text-[10px] font-black uppercase text-indigo-500">First Number ({num1})</p>
                <p className="text-base font-black text-indigo-900 mt-1">
                  {Math.floor(num1 / 10) * 10} + {num1 % 10}
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">{Math.floor(num1 / 10)} Tens, {num1 % 10} Units</p>
              </div>
              <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-100">
                <p className="text-[10px] font-black uppercase text-emerald-500">Second Number ({num2})</p>
                <p className="text-base font-black text-emerald-900 mt-1">
                  {Math.floor(num2 / 10) * 10} + {num2 % 10}
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">{Math.floor(num2 / 10)} Tens, {num2 % 10} Units</p>
              </div>
            </div>
            <div className="p-2.5 bg-slate-100 rounded-xl text-center text-xs font-black text-slate-700">
              Add Tens: {Math.floor(num1 / 10) * 10} + {Math.floor(num2 / 10) * 10} = {(Math.floor(num1 / 10) + Math.floor(num2 / 10)) * 10} · Add Units: {(num1 % 10) + (num2 % 10)}
            </div>
          </div>
        )}
      </div>
    );
  }

  // SUBTRACTION
  if (operation === Operation.SUBTRACTION) {
    const isSmall = num1 <= 16;
    const remaining = num1 - num2;

    return (
      <div className="w-full bg-slate-50/70 border-2 border-slate-200/60 rounded-[2rem] p-4 sm:p-6 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
            <Eye className="w-4 h-4 text-rose-500" />
            Visual Take-Away · Crossed out = Taken away
          </span>
          {countedSet.size > 0 && (
            <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-[10px] font-black rounded-full">
              Counted: {countedSet.size}
            </span>
          )}
        </div>

        {isSmall ? (
          <div className="space-y-4">
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center">
              <div className="flex flex-wrap justify-center gap-2 max-w-[280px]">
                {Array.from({ length: num1 }).map((_, i) => {
                  const isCrossed = i >= remaining;
                  return renderIcon(i, isCrossed);
                })}
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 text-center">
              <div className="bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                <span className="text-[10px] font-black uppercase text-emerald-600 block">Remaining</span>
                <span className="text-base font-black text-emerald-800">{remaining}</span>
              </div>
              <div className="text-slate-400 font-black">+</div>
              <div className="bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200">
                <span className="text-[10px] font-black uppercase text-rose-600 block">Taken away</span>
                <span className="text-base font-black text-rose-800">{num2}</span>
              </div>
              <div className="text-slate-400 font-black">=</div>
              <div className="bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
                <span className="text-[10px] font-black uppercase text-slate-600 block">Started with</span>
                <span className="text-base font-black text-slate-800">{num1}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center space-y-2">
            <p className="text-xs font-bold text-slate-600">
              Count backwards on the number line from {num1}:
            </p>
            <div className="flex items-center justify-center gap-2 py-2">
              <span className="px-3 py-1.5 bg-slate-100 rounded-xl font-black text-slate-700">{num1}</span>
              <ChevronRight className="w-4 h-4 text-rose-400" />
              <span className="px-3 py-1.5 bg-rose-50 text-rose-600 rounded-xl font-bold text-xs">- {num2}</span>
              <ChevronRight className="w-4 h-4 text-emerald-400" />
              <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-xl font-black text-base">?</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  // MULTIPLICATION
  if (operation === Operation.MULTIPLICATION || operation === Operation.MULTIPLICATION_TABLE) {
    const groups = num1;
    const perGroup = num2;

    return (
      <div className="w-full bg-slate-50/70 border-2 border-slate-200/60 rounded-[2rem] p-4 sm:p-6 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
            <Eye className="w-4 h-4 text-purple-600" />
            {groups} Equal Groups of {perGroup}
          </span>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => setActiveTab('objects')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-black transition-all ${
                activeTab === 'objects' ? 'bg-purple-600 text-white shadow-sm' : 'bg-white text-slate-600 border'
              }`}
            >
              Groups
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('array')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-black transition-all ${
                activeTab === 'array' ? 'bg-purple-600 text-white shadow-sm' : 'bg-white text-slate-600 border'
              }`}
            >
              Array Grid
            </button>
          </div>
        </div>

        {activeTab === 'objects' ? (
          <div className="space-y-3">
            <div className="flex flex-wrap justify-center gap-3">
              {Array.from({ length: Math.min(groups, 8) }).map((_, gIdx) => (
                <div 
                  key={gIdx}
                  className="bg-white p-2.5 rounded-2xl border-2 border-purple-100 shadow-sm flex flex-col items-center"
                >
                  <span className="text-[9px] font-black uppercase text-purple-500 mb-1">Group {gIdx + 1}</span>
                  <div className="flex flex-wrap justify-center gap-1 max-w-[90px]">
                    {Array.from({ length: perGroup }).map((_, i) => renderIcon(gIdx * perGroup + i, false, undefined, 'w-6 h-6'))}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-center text-xs font-black text-purple-700 bg-purple-50 py-2 rounded-xl border border-purple-100">
              Repeated Addition: {Array(groups).fill(perGroup).join(' + ')} = {groups * perGroup}
            </p>
          </div>
        ) : (
          <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col items-center space-y-2">
            <span className="text-xs font-bold text-slate-500">{groups} rows × {perGroup} columns:</span>
            <div className="flex flex-col gap-1.5">
              {Array.from({ length: groups }).map((_, r) => (
                <div key={r} className="flex gap-1.5 justify-center">
                  {Array.from({ length: perGroup }).map((_, c) => renderIcon(r * perGroup + c, false, undefined, 'w-6 h-6'))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // DIVISION
  if (operation === Operation.DIVISION || operation === Operation.DIVISION_TABLE) {
    const total = num1;
    const shareCount = num2;
    const perFriend = Math.floor(total / shareCount);
    const remainder = total % shareCount;

    return (
      <div className="w-full bg-slate-50/70 border-2 border-slate-200/60 rounded-[2rem] p-4 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
            <Eye className="w-4 h-4 text-emerald-600" />
            Share {total} into {shareCount} equal baskets
          </span>
          <span className="text-xs font-black text-emerald-700 bg-emerald-100/70 px-2.5 py-1 rounded-full">
            {perFriend} each
          </span>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {Array.from({ length: shareCount }).map((_, bIdx) => (
            <div 
              key={bIdx}
              className="bg-white p-3 rounded-2xl border-2 border-emerald-100 shadow-sm flex flex-col items-center min-w-[90px]"
            >
              <span className="text-[10px] font-black text-emerald-600 mb-1.5">Basket {bIdx + 1}</span>
              <div className="flex flex-wrap justify-center gap-1 max-w-[80px]">
                {Array.from({ length: perFriend }).map((_, i) => renderIcon(bIdx * perFriend + i, false, undefined, 'w-6 h-6'))}
              </div>
              <span className="text-[10px] font-bold text-slate-400 mt-2">({perFriend} items)</span>
            </div>
          ))}
        </div>

        {remainder > 0 && (
          <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-center text-xs font-bold text-amber-800">
            Left over (remainder): {remainder} item{remainder > 1 ? 's' : ''}
          </div>
        )}

        <p className="text-center text-xs font-black text-slate-600">
          Check: {shareCount} baskets × {perFriend} = {shareCount * perFriend}
        </p>
      </div>
    );
  }

  // FRACTIONS
  if (operation === Operation.FRACTIONS) {
    const numer = num1;
    const denom = num2;

    return (
      <div className="w-full bg-slate-50/70 border-2 border-slate-200/60 rounded-[2rem] p-4 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
            <Eye className="w-4 h-4 text-pink-500" />
            Equal Parts: {numer} of {denom} shaded
          </span>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => setActiveTab('strip')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-black transition-all ${
                activeTab === 'strip' ? 'bg-pink-600 text-white shadow-sm' : 'bg-white text-slate-600 border'
              }`}
            >
              Strip
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('objects')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-black transition-all ${
                activeTab === 'objects' ? 'bg-pink-600 text-white shadow-sm' : 'bg-white text-slate-600 border'
              }`}
            >
              Pie
            </button>
          </div>
        </div>

        {activeTab === 'strip' ? (
          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
            <div className="w-full h-12 bg-slate-100 rounded-xl border-2 border-slate-300 flex overflow-hidden shadow-inner">
              {Array.from({ length: denom }).map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 border-r border-slate-300 last:border-r-0 flex items-center justify-center font-black text-xs transition-colors ${
                    i < numer 
                      ? 'bg-pink-500 text-white' 
                      : 'bg-white text-slate-400'
                  }`}
                >
                  1/{denom}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between text-xs font-bold text-slate-500 px-1">
              <span className="text-pink-600 font-black">Shaded: {numer}/{denom}</span>
              <span>Total equal parts: {denom}</span>
            </div>
          </div>
        ) : (
          <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col items-center">
            <div className="relative w-32 h-32 rounded-full border-4 border-slate-300 overflow-hidden shadow-sm">
              {Array.from({ length: denom }).map((_, i) => {
                const angle = 360 / denom;
                const startAngle = i * angle;
                return (
                  <div 
                    key={i}
                    className={`absolute inset-0 origin-center ${
                      i < numer ? 'bg-pink-500/80 border-r-2 border-white' : 'bg-slate-50 border-r-2 border-slate-200'
                    }`}
                    style={{ 
                      clipPath: `polygon(50% 50%, ${50 + 50 * Math.cos(2 * Math.PI * i / denom)}% ${50 + 50 * Math.sin(2 * Math.PI * i / denom)}%, ${50 + 50 * Math.cos(2 * Math.PI * (i + 1) / denom)}% ${50 + 50 * Math.sin(2 * Math.PI * (i + 1) / denom)}%)` 
                    }}
                  />
                );
              })}
            </div>
          </div>
        )}

        <div className="flex items-center justify-center gap-2 text-center text-xs font-bold text-slate-600">
          <span>Top (Numerator) = <strong className="text-pink-600">{numer}</strong></span>
          <span>·</span>
          <span>Bottom (Denominator) = <strong className="text-slate-800">{denom}</strong></span>
        </div>
      </div>
    );
  }

  // PLACE VALUE
  if (operation === Operation.PLACE_VALUE) {
    const val = num1;
    const th = Math.floor(val / 1000);
    const h = Math.floor((val % 1000) / 100);
    const t = Math.floor((val % 100) / 10);
    const u = val % 10;

    const columns = [
      { key: 'Th', name: 'Thousands', val: th, multiplier: 1000, color: 'bg-purple-50 text-purple-700 border-purple-200' },
      { key: 'H', name: 'Hundreds', val: h, multiplier: 100, color: 'bg-blue-50 text-blue-700 border-blue-200' },
      { key: 'T', name: 'Tens', val: t, multiplier: 10, color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
      { key: 'U', name: 'Units', val: u, multiplier: 1, color: 'bg-amber-50 text-amber-700 border-amber-200' },
    ];

    return (
      <div className="w-full bg-slate-50/70 border-2 border-slate-200/60 rounded-[2rem] p-4 sm:p-6 space-y-4">
        <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
          <Eye className="w-4 h-4 text-indigo-600" />
          South African Place Value Mat (Th H T U)
        </span>

        <div className="grid grid-cols-4 gap-2 text-center">
          {columns.map((col, idx) => (
            <motion.button
              type="button"
              key={col.key}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedPlaceColumn(selectedPlaceColumn === idx ? null : idx)}
              className={`p-2.5 sm:p-3 rounded-2xl border-2 transition-all cursor-pointer ${col.color} ${
                selectedPlaceColumn === idx ? 'ring-4 ring-indigo-400 shadow-md scale-105' : 'shadow-sm'
              }`}
            >
              <span className="text-xs sm:text-sm font-black block">{col.key}</span>
              <span className="text-[9px] uppercase font-bold text-slate-500 hidden sm:block">{col.name}</span>
              <span className="text-2xl sm:text-3xl font-black block my-1">{col.val}</span>
              <span className="text-[9px] font-bold text-slate-500">={col.val * col.multiplier}</span>
            </motion.button>
          ))}
        </div>

        <div className="p-3 bg-white rounded-xl border border-slate-200 text-center text-xs font-black text-slate-700">
          Expanded: {th > 0 ? `${th * 1000} + ` : ''}{h * 100} + {t * 10} + {u} = {val}
        </div>
      </div>
    );
  }

  // ROUNDING
  if (operation === Operation.ROUNDING) {
    const base = num2 || 10;
    const lower = Math.floor(num1 / base) * base;
    const upper = lower + base;
    const midpoint = lower + base / 2;
    const progress = Math.min(100, Math.max(0, ((num1 - lower) / (upper - lower)) * 100));
    const rollsUp = num1 >= midpoint;

    return (
      <div className="w-full bg-slate-50/70 border-2 border-slate-200/60 rounded-[2rem] p-4 sm:p-6 space-y-4">
        <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
          <Eye className="w-4 h-4 text-amber-500" />
          Rounding Rollercoaster (Nearest {base})
        </span>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
          <div className="relative pt-6 pb-2">
            {/* Number Line Track */}
            <div className="h-3 bg-slate-200 rounded-full w-full relative">
              {/* Midpoint marker */}
              <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-1.5 h-6 bg-slate-400 rounded-full" />
              
              {/* Marker for current number */}
              <motion.div
                initial={{ left: '0%' }}
                animate={{ left: `${progress}%` }}
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
              >
                <div className="flex flex-col items-center -mt-9">
                  <span className="px-2 py-0.5 bg-spark-primary text-white text-xs font-black rounded-lg shadow-md">
                    {num1}
                  </span>
                  <div className="w-3.5 h-3.5 bg-spark-primary rounded-full border-2 border-white shadow-sm mt-0.5" />
                </div>
              </motion.div>
            </div>

            {/* Labels under line */}
            <div className="flex justify-between items-center text-xs font-black text-slate-700 mt-3 px-1">
              <span>{lower} (Down)</span>
              <span className="text-[10px] text-slate-400">Midpoint: {midpoint}</span>
              <span>{upper} (Up)</span>
            </div>
          </div>

          <p className="text-center text-xs font-bold text-slate-600 bg-amber-50/60 p-2.5 rounded-xl border border-amber-100">
            {rollsUp 
              ? `🚀 ${num1} is ${midpoint} or more, so it rolls UP to ${upper}!` 
              : `🧘 ${num1} is less than ${midpoint}, so it rolls DOWN to ${lower}!`}
          </p>
        </div>
      </div>
    );
  }

  // 2D SHAPES
  if (operation === Operation.SHAPES_2D) {
    return (
      <div className="w-full bg-slate-50/70 border-2 border-slate-200/60 rounded-[2rem] p-4 sm:p-6 flex flex-col items-center gap-3">
        <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
          <Eye className="w-4 h-4 text-orange-500" />
          Shape Explorer · Count the straight sides
        </span>
        <div className="w-28 h-28 bg-white rounded-2xl border-2 border-slate-200 flex items-center justify-center p-3 shadow-sm">
          {iconType === 'triangle' && (
            <svg viewBox="0 0 100 100" className="w-full h-full text-amber-500 fill-amber-100 stroke-amber-500 stroke-2">
              <polygon points="50,15 90,85 10,85" />
            </svg>
          )}
          {iconType === 'square' && (
            <div className="w-16 h-16 bg-sky-100 border-4 border-sky-500 rounded-lg" />
          )}
          {iconType === 'rectangle' && (
            <div className="w-20 h-12 bg-sky-100 border-4 border-sky-500 rounded-lg" />
          )}
          {iconType === 'pentagon' && (
            <svg viewBox="0 0 100 100" className="w-full h-full text-purple-500 fill-purple-100 stroke-purple-500 stroke-2">
              <polygon points="50,10 95,42 78,92 22,92 5,42" />
            </svg>
          )}
          {iconType === 'hexagon' && (
            <svg viewBox="0 0 100 100" className="w-full h-full text-indigo-500 fill-indigo-100 stroke-indigo-500 stroke-2">
              <polygon points="50,10 88,32 88,78 50,95 12,78 12,32" />
            </svg>
          )}
          {iconType === 'circle' && (
            <div className="w-16 h-16 rounded-full bg-rose-100 border-4 border-rose-500" />
          )}
        </div>
        <p className="text-xs font-bold text-slate-600">
          {iconType === 'circle' ? 'Round curved line · 0 straight sides' : `${num1} straight edges`}
        </p>
      </div>
    );
  }

  // 3D OBJECTS
  if (operation === Operation.OBJECTS_3D) {
    return (
      <div className="w-full bg-slate-50/70 border-2 border-slate-200/60 rounded-[2rem] p-4 sm:p-6 flex flex-col items-center gap-3">
        <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
          <Eye className="w-4 h-4 text-indigo-600" />
          3D Solid Objects
        </span>
        <div className="w-28 h-28 bg-white rounded-2xl border-2 border-slate-200 flex items-center justify-center p-3 shadow-sm">
          <Box className="w-16 h-16 text-indigo-500 fill-indigo-100" />
        </div>
        <p className="text-xs font-bold text-slate-600">
          Faces are the surfaces you can touch and see!
        </p>
      </div>
    );
  }

  // TIME
  if (operation === Operation.TIME) {
    return (
      <div className="w-full bg-slate-50/70 border-2 border-slate-200/60 rounded-[2rem] p-4 sm:p-6 flex flex-col items-center gap-3">
        <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
          <ClockIcon className="w-4 h-4 text-indigo-600" />
          Clock Face
        </span>
        <div className="relative w-28 h-28 bg-white rounded-full border-4 border-slate-700 flex items-center justify-center shadow-inner">
          <div className="w-2 h-2 bg-slate-800 rounded-full z-10" />
          <div 
            className="absolute w-1 h-8 bg-indigo-600 rounded-full origin-bottom"
            style={{ 
              bottom: '50%',
              transform: `rotate(${(num1 % 12) * 30}deg)`
            }} 
          />
          <div 
            className="absolute w-0.5 h-11 bg-orange-500 rounded-full origin-bottom"
            style={{ bottom: '50%', transform: 'rotate(0deg)' }} 
          />
        </div>
        <p className="text-xs font-bold text-slate-600">
          Short purple hand = Hour ({num1}:00) · Long orange hand = Minutes (00)
        </p>
      </div>
    );
  }

  // Fallback
  return null;
};
