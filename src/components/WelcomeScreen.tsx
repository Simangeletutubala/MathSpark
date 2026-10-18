import React from 'react';
import { motion } from 'motion/react';
import { ChevronRight, Lock } from 'lucide-react';
import starMascotImg from '../assets/images/mathspark_star_mascot_1792262025789.jpg';
import { SoundService } from '../services/SoundService';
import { PWAInstallButton } from './PWAInstallPrompt';

interface WelcomeScreenProps {
  onSelectBuddy: () => void;
  onSelectParent: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onSelectBuddy,
  onSelectParent,
}) => {
  return (
    <div className="min-h-[100dvh] w-full bg-[#F8F9FE] text-slate-900 flex flex-col justify-between items-center relative overflow-x-hidden overflow-y-auto px-4 py-5 sm:py-8 md:py-10 select-none">
      {/* South African Flag Geometric Corner Accent - Top Right */}
      <div className="absolute top-0 right-0 w-24 h-24 sm:w-36 sm:h-36 md:w-44 md:h-44 pointer-events-none z-10">
        <svg viewBox="0 0 160 160" className="w-full h-full" fill="none">
          <polygon points="160,0 70,0 160,90" fill="#001489" />
          <polygon points="160,15 100,0 160,60" fill="#E03C31" />
          <polygon points="120,0 80,0 160,80" fill="#FFB81C" />
          <polygon points="160,60 115,15 160,105" fill="#007749" />
          <polygon points="140,0 160,0 160,20" fill="#FFB81C" />
          <polygon points="160,95 130,65 160,125" fill="#E03C31" />
          <line
            x1="50"
            y1="0"
            x2="160"
            y2="110"
            stroke="#1E1B4B"
            strokeWidth="3.5"
            strokeDasharray="4 6"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* South African Flag Geometric Corner Accent - Bottom Left */}
      <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-36 sm:h-36 md:w-44 md:h-44 pointer-events-none z-10">
        <svg viewBox="0 0 160 160" className="w-full h-full" fill="none">
          <polygon points="0,160 0,70 90,160" fill="#007749" />
          <polygon points="0,145 0,100 60,160" fill="#E03C31" />
          <polygon points="0,120 0,80 80,160" fill="#FFB81C" />
          <polygon points="60,160 15,115 105,160" fill="#001489" />
          <polygon points="0,160 20,160 0,140" fill="#FFB81C" />
          <polygon points="95,160 65,130 125,160" fill="#E03C31" />
          <line
            x1="0"
            y1="50"
            x2="110"
            y2="160"
            stroke="#1E1B4B"
            strokeWidth="3.5"
            strokeDasharray="4 6"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Background Floating Math Doodles & Watermarks (hidden on tiny screens to avoid distraction) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30 hidden sm:block">
        <span className="absolute top-10 left-6 text-xl sm:text-2xl font-black text-indigo-400 rotate-[-18deg] tracking-wider">
          1 + 2 = 3
        </span>

        <svg
          className="absolute top-28 left-8 w-8 h-8 text-indigo-300 stroke-current fill-none stroke-[2.5]"
          viewBox="0 0 24 24"
        >
          <polygon points="12,3 22,20 2,20" />
        </svg>

        <svg
          className="absolute top-64 left-4 w-12 h-6 text-indigo-300 stroke-current fill-none stroke-[2.5]"
          viewBox="0 0 40 20"
        >
          <path d="M 0,10 Q 10,0 20,10 T 40,10" />
        </svg>

        <span className="absolute top-16 right-36 text-3xl font-black text-indigo-300">
          +
        </span>

        <svg
          className="absolute top-36 right-6 w-12 h-6 text-indigo-300 stroke-current fill-none stroke-[2.5]"
          viewBox="0 0 40 20"
        >
          <path d="M 0,10 Q 10,0 20,10 T 40,10" />
        </svg>

        <span className="absolute top-52 right-10 text-2xl font-black text-indigo-300">
          ÷
        </span>

        <svg
          className="absolute top-64 right-5 w-12 h-12 text-indigo-300 stroke-current fill-none stroke-[2]"
          viewBox="0 0 24 24"
        >
          <polygon points="4,4 4,20 20,20" />
          <line x1="4" y1="8" x2="8" y2="8" />
          <line x1="4" y1="12" x2="10" y2="12" />
          <line x1="4" y1="16" x2="12" y2="16" />
        </svg>

        <span className="absolute bottom-28 left-36 text-2xl font-black text-indigo-300">
          ×
        </span>

        <svg
          className="absolute bottom-24 right-14 w-12 h-6 text-indigo-300 stroke-current fill-none stroke-[2.5]"
          viewBox="0 0 40 20"
        >
          <path d="M 0,10 Q 10,0 20,10 T 40,10" />
        </svg>
      </div>

      {/* Background Star Mascot - Integrated seamlessly into the backdrop with radial vignette and ambient glow */}
      <div className="absolute top-2 sm:top-5 md:top-8 left-1/2 -translate-x-1/2 pointer-events-none z-0 flex flex-col items-center">
        {/* Soft radial backdrop halo */}
        <div className="absolute inset-0 w-44 h-44 sm:w-64 sm:h-64 -translate-x-4 -translate-y-4 bg-gradient-to-b from-amber-200/35 via-purple-200/20 to-transparent rounded-full blur-2xl -z-10" />
        
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="relative"
        >
          <img
            src={starMascotImg}
            alt="MathSpark Star Mascot Background"
            style={{
              maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 80%)',
              WebkitMaskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 80%)',
            }}
            className="w-36 h-36 xs:w-44 xs:h-44 sm:w-52 sm:h-52 md:w-60 md:h-60 object-contain filter drop-shadow-sm mix-blend-multiply select-none opacity-90"
          />
        </motion.div>
      </div>

      {/* Main Screen Content Card */}
      <div className="w-full max-w-sm sm:max-w-md mx-auto flex flex-col items-center relative z-20 space-y-3 sm:space-y-4 md:space-y-5 my-auto pt-32 xs:pt-38 sm:pt-48 md:pt-54 pb-2">
        
        {/* MathSpark Title with Golden Spark Rays */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="flex flex-col items-center text-center mt-1 sm:mt-2"
        >

          {/* MathSpark Title with Golden Spark Rays */}
          <div className="flex items-center justify-center gap-2 sm:gap-3">
            {/* Left Spark Rays */}
            <div className="flex gap-1 items-center rotate-[-20deg]">
              <span className="w-1 h-3 sm:h-3.5 bg-amber-400 rounded-full" />
              <span className="w-1.5 h-4 sm:h-5 bg-amber-400 rounded-full" />
              <span className="w-1 h-3 sm:h-3.5 bg-amber-400 rounded-full" />
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-none">
              <span className="text-[#1A1D54]">Math</span>
              <span className="text-[#6D28D9]">Spark</span>
            </h1>

            {/* Right Spark Rays */}
            <div className="flex gap-1 items-center rotate-[20deg]">
              <span className="w-1 h-3 sm:h-3.5 bg-amber-400 rounded-full" />
              <span className="w-1.5 h-4 sm:h-5 bg-amber-400 rounded-full" />
              <span className="w-1 h-3 sm:h-3.5 bg-amber-400 rounded-full" />
            </div>
          </div>

          {/* Tagline with Yellow Swoosh Underline */}
          <div className="mt-1 relative inline-block">
            <p className="text-[#1A1D54] font-bold text-xs sm:text-sm md:text-base italic tracking-tight">
              Your fun math learning companion!
            </p>
            {/* Curved yellow swoosh underline */}
            <svg
              className="w-full h-2.5 sm:h-3.5 -mt-0.5 text-amber-400 fill-none"
              viewBox="0 0 240 12"
              preserveAspectRatio="none"
            >
              <path
                d="M 5,6 Q 120,13 235,5"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </motion.div>

        {/* Section Prompt: WHO'S LEARNING TODAY? */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25 }}
          className="w-full flex items-center justify-center gap-2 pt-1 sm:pt-3"
        >
          {/* Left energetic spark dashes */}
          <div className="flex gap-1 items-center">
            <span className="w-2 h-1 bg-amber-400 rounded-full rotate-[-20deg]" />
            <span className="w-3 h-1 bg-teal-400 rounded-full" />
            <span className="w-2 h-1 bg-amber-400 rounded-full rotate-[20deg]" />
          </div>

          <h2 className="text-[#1A1D54] text-[11px] sm:text-xs md:text-sm font-black uppercase tracking-[0.2em] px-1">
            Who's Learning Today?
          </h2>

          {/* Right energetic spark dashes */}
          <div className="flex gap-1 items-center">
            <span className="w-2 h-1 bg-amber-400 rounded-full rotate-[20deg]" />
            <span className="w-3 h-1 bg-teal-400 rounded-full" />
            <span className="w-2 h-1 bg-amber-400 rounded-full rotate-[-20deg]" />
          </div>
        </motion.div>

        {/* Selection Cards (Buddy & Parent) */}
        <div className="w-full space-y-3 sm:space-y-4 pt-1">
          {/* 1. BUDDY CARD (PLAY & LEARN) */}
          <motion.button
            whileHover={{ scale: 1.02, translateY: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              SoundService.playTap(2);
              onSelectBuddy();
            }}
            className="w-full p-3.5 sm:p-5 bg-gradient-to-r from-[#2072ED] via-[#4F46E5] to-[#7C3AED] rounded-2xl sm:rounded-3xl shadow-xl shadow-indigo-500/25 text-white flex items-center justify-between transition-all group relative overflow-hidden border border-white/20 text-left cursor-pointer min-h-[68px] sm:min-h-[84px]"
          >
            {/* Background subtle glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

            <div className="flex items-center gap-3 sm:gap-4 relative z-10">
              {/* Rocket in glowing circle */}
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-white/15 backdrop-blur-sm border border-white/25 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                <svg
                  className="w-8 h-8 sm:w-10 sm:h-10 text-white fill-white"
                  viewBox="0 0 64 64"
                >
                  <path
                    d="M 44,8 C 44,8 30,12 24,24 C 18,36 18,44 18,44 L 20,46 C 20,46 28,46 40,40 C 52,34 56,20 56,20 C 56,20 48,16 44,8 Z"
                    fill="#FFFFFF"
                  />
                  <path
                    d="M 46,14 C 44,14 41,17 41,20 C 41,23 44,26 47,26 C 50,26 53,23 53,20 C 53,17 49,14 46,14 Z"
                    fill="#2563EB"
                  />
                  <polygon points="18,44 10,48 14,38" fill="#60A5FA" />
                  <polygon points="44,18 48,10 38,14" fill="#60A5FA" />
                  <polygon points="18,46 14,54 22,50" fill="#FBBF24" />
                  <polygon points="16,48 12,56 18,52" fill="#EF4444" />
                  <path
                    d="M 12,52 C 8,56 12,60 22,56"
                    stroke="#FDE047"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
              </div>

              {/* Title & Subtitle */}
              <div className="text-left">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-white leading-tight">
                  Buddy
                </h3>
                <p className="text-[10px] sm:text-xs font-black tracking-widest text-cyan-200 uppercase mt-0.5">
                  Play & Learn
                </p>
              </div>
            </div>

            {/* Stars & Arrow on Right */}
            <div className="flex items-center gap-2 sm:gap-3 relative z-10">
              <div className="flex items-center gap-0.5 text-amber-300">
                <span className="text-xs sm:text-base">★</span>
                <span className="text-xs sm:text-base">★</span>
                <span className="text-xs sm:text-base">★</span>
              </div>
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white group-hover:translate-x-1 transition-transform">
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 stroke-[3]" />
              </div>
            </div>
          </motion.button>

          {/* 2. PARENT CARD (PORTAL & PROGRESS) */}
          <motion.button
            whileHover={{ scale: 1.02, translateY: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              SoundService.playTap(0);
              onSelectParent();
            }}
            className="w-full p-3.5 sm:p-5 bg-white rounded-2xl sm:rounded-3xl shadow-lg shadow-indigo-100/70 border-2 border-indigo-100/90 text-slate-800 flex items-center justify-between transition-all group relative overflow-hidden text-left cursor-pointer min-h-[68px] sm:min-h-[84px]"
          >
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Purple lock in rounded square */}
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform relative">
                <Lock className="w-6 h-6 sm:w-8 sm:h-8 text-[#6D28D9] stroke-[2.2]" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-purple-400 rounded-full blur-[1px]" />
                <span className="absolute -bottom-1 -left-1 w-2 h-2 bg-indigo-400 rounded-full blur-[1px]" />
              </div>

              {/* Title & Subtitle */}
              <div className="text-left">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-[#1A1D54] leading-tight">
                  Parent
                </h3>
                <p className="text-[10px] sm:text-xs font-black tracking-widest text-[#6D28D9] uppercase mt-0.5">
                  Portal & Progress
                </p>
              </div>
            </div>

            {/* Right Purple Arrow */}
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[#6D28D9] group-hover:translate-x-1 transition-transform">
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 stroke-[3]" />
            </div>
          </motion.button>
        </div>
      </div>

      {/* South African Grade 4 CAPS badge & Install App option */}
      <div className="mt-3 sm:mt-4 text-center z-20 pb-1 flex flex-col items-center gap-2">
        <PWAInstallButton variant="minimal" />
        <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center justify-center gap-1.5">
          <span>🇿🇦</span> 100% South African CAPS Grade 4 Mathematics • Web & App
        </p>
      </div>
    </div>
  );
};
