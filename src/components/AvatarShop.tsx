import React from 'react';
import { motion } from 'motion/react';
import { Star } from 'lucide-react';
import { ProgressService } from '../services/ProgressService';

interface AvatarShopProps {
  currentStars: number;
  unlockedAvatars: string[];
  onPurchase: (avatar: string) => void;
  onSelect: (avatar: string) => void;
  currentAvatar: string;
}

const AVATARS = [
  { emoji: '🦁', cost: 0 },
  { emoji: '🐘', cost: 0 },
  { emoji: '🦏', cost: 0 },
  { emoji: '🐆', cost: 0 },
  { emoji: '🐃', cost: 0 },
  { emoji: '🦓', cost: 0 },
  { emoji: '🦒', cost: 50 },
  { emoji: '🐧', cost: 50 },
  { emoji: '🐵', cost: 100 },
  { emoji: '🦜', cost: 100 },
  { emoji: '🐢', cost: 200 },
  { emoji: '🐳', cost: 500 },
];

export const AvatarShop: React.FC<AvatarShopProps> = ({ 
  currentStars, 
  unlockedAvatars, 
  onPurchase, 
  onSelect,
  currentAvatar 
}) => {
  return (
    <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 gap-4">
      {AVATARS.map((item, i) => {
        const isUnlocked = (unlockedAvatars || []).includes(item.emoji);
        const isSelected = currentAvatar === item.emoji;
        const canAfford = currentStars >= item.cost;
        
        return (
          <motion.button
            key={item.emoji}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ scale: 1.05, translateY: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => isUnlocked ? onSelect(item.emoji) : onPurchase(item.emoji)}
            className={`relative p-6 rounded-[2.5rem] border-2 transition-all flex flex-col items-center gap-3 shadow-sm aspect-square justify-center overflow-hidden group ${
              isSelected 
                ? 'border-spark-primary bg-indigo-50/50 shadow-premium' 
                : isUnlocked 
                  ? 'border-slate-50 bg-white hover:border-spark-primary/20 hover:shadow-xl' 
                  : 'border-slate-50 bg-slate-50/50 grayscale-[0.8] opacity-60'
            }`}
          >
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-spark-primary/0 via-spark-primary/10 to-spark-primary/0 opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <span className={`text-5xl sm:text-6xl drop-shadow-lg transition-transform duration-500 ${isSelected ? 'scale-110' : 'group-hover:scale-110 group-hover:rotate-3'}`}>
              {item.emoji}
            </span>

            {isSelected && (
              <div className="absolute top-4 right-4 bg-spark-primary text-white text-[8px] font-black px-2 py-1 rounded-lg shadow-lg z-10 animate-pulse">
                ACTIVE
              </div>
            )}

            {!isUnlocked && (
              <div className={`flex items-center gap-1 text-[10px] font-black px-3 py-1.5 rounded-full border shadow-sm ${canAfford ? 'text-amber-600 bg-amber-50 border-amber-100' : 'text-slate-400 bg-slate-100 border-slate-200'}`}>
                <Star className={`w-3 h-3 ${canAfford ? 'fill-current' : ''}`} />
                {item.cost}
              </div>
            )}
            
            {isUnlocked && !isSelected && (
              <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest mt-1">OWNED</p>
            )}
          </motion.button>
        );
      })}
    </div>
  );
};
