'use client';

import { motion } from 'framer-motion';
import { Lock, Star } from 'lucide-react';
import { useState } from 'react';
import type { AdventDay } from '@/lib/types';

interface AdventDoorProps {
  day: AdventDay;
  isUnlocked: boolean;
  onClick: () => void;
}

export function AdventDoor({ day, isUnlocked, onClick }: AdventDoorProps) {
  const [isHovered, setIsHovered] = useState(false);

  const isSpecialDay = day?.special?.includes('Advent') || day?.type?.includes('Adventssonntag');
  
  // Determine number of stars based on day number
  const getStarCount = (dayNum: number): number => {
    if (dayNum === 7) return 2;
    if (dayNum === 14) return 3;
    if (dayNum === 21) return 4;
    return 1; // Default for other special days
  };
  
  const starCount = isSpecialDay ? getStarCount(day?.day ?? 0) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: (day?.day ?? 0) * 0.03 }}
      whileHover={{ scale: isUnlocked ? 1.05 : 1.02 }}
      className="relative"
    >
      <button
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        disabled={!isUnlocked}
        className={`
          relative w-full aspect-square rounded-lg overflow-hidden
          transition-all duration-300 ease-out
          ${isUnlocked ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'}
          ${isHovered && isUnlocked ? 'shadow-2xl' : 'shadow-lg'}
        `}
        style={{
          background: isSpecialDay
            ? 'linear-gradient(135deg, #B59410 0%, #D4AF37 100%)'
            : isUnlocked
            ? 'linear-gradient(135deg, #B3001B 0%, #8B0000 100%)'
            : 'linear-gradient(135deg, #4A5568 0%, #2D3748 100%)',
          transform: isHovered && isUnlocked ? 'translateY(-4px)' : 'translateY(0)',
        }}
      >
        {/* Door content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-white">
          {/* Day number */}
          <div className="text-4xl md:text-5xl font-bold mb-2">
            {day?.day ?? 0}
          </div>

          {/* Special indicator - multiple stars */}
          {isSpecialDay && starCount > 0 && (
            <div className="flex gap-0.5">
              {Array.from({ length: starCount }).map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-current" />
              ))}
            </div>
          )}

          {/* Lock icon for locked days */}
          {!isUnlocked && (
            <div className="mt-2">
              <Lock className="w-6 h-6" />
            </div>
          )}
        </div>

        {/* Door frame effect */}
        <div className="absolute inset-0 border-2 border-white/20 rounded-lg" />
        
        {/* Opening effect */}
        {isHovered && isUnlocked && (
          <motion.div
            className="absolute inset-0 bg-white/10"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.3 }}
            style={{ transformOrigin: 'left' }}
          />
        )}
      </button>

      {/* Glow effect for special days */}
      {isSpecialDay && isUnlocked && (
        <div
          className="absolute inset-0 -z-10 blur-xl opacity-50"
          style={{
            background: 'radial-gradient(circle, #B59410 0%, transparent 70%)',
          }}
        />
      )}
    </motion.div>
  );
}
