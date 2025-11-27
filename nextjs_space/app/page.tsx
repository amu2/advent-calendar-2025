'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Calendar as CalendarIcon } from 'lucide-react';
import type { AdventData, AdventDay } from '@/lib/types';
import { isDayUnlocked } from '@/lib/date-utils';
import { Snowflakes } from '@/components/snowflakes';
import { AdventDoor } from '@/components/advent-door';
import { ContentModal } from '@/components/content-modal';
import { LockedMessage } from '@/components/locked-message';
import { useSound } from '@/hooks/use-sound';

export default function HomePage() {
  const [adventData, setAdventData] = useState<AdventData | null>(null);
  const [selectedDay, setSelectedDay] = useState<AdventDay | null>(null);
  const [showLockedMessage, setShowLockedMessage] = useState<string | null>(null);
  const [unlockedDays, setUnlockedDays] = useState<number[]>([]);
  const { play: playSound } = useSound();

  useEffect(() => {
    fetch('/advent_data.json')
      .then((res) => res.json())
      .then((data: AdventData) => {
        setAdventData(data);
        
        // Calculate unlocked days
        const unlocked = data?.days
          ?.filter((day) => isDayUnlocked(day?.date ?? ''))
          ?.map((day) => day?.day ?? 0) ?? [];
        setUnlockedDays(unlocked);
      })
      .catch((error) => {
        console.error('Failed to load advent data:', error);
      });
  }, []);

  const handleDoorClick = (day: AdventDay) => {
    const isUnlocked = isDayUnlocked(day?.date ?? '');
    
    if (isUnlocked) {
      playSound();
      setSelectedDay(day);
    } else {
      setShowLockedMessage(day?.date ?? '');
    }
  };

  const handlePrevious = () => {
    if (!selectedDay || !adventData?.days) return;
    
    const currentIndex = adventData.days.findIndex(
      (d) => d?.day === selectedDay?.day
    );
    
    if (currentIndex > 0) {
      const prevDay = adventData.days[currentIndex - 1];
      if (prevDay && isDayUnlocked(prevDay.date ?? '')) {
        playSound();
        setSelectedDay(prevDay);
      }
    }
  };

  const handleNext = () => {
    if (!selectedDay || !adventData?.days) return;
    
    const currentIndex = adventData.days.findIndex(
      (d) => d?.day === selectedDay?.day
    );
    
    if (currentIndex < adventData.days.length - 1) {
      const nextDay = adventData.days[currentIndex + 1];
      if (nextDay && isDayUnlocked(nextDay.date ?? '')) {
        playSound();
        setSelectedDay(nextDay);
      }
    }
  };

  const hasPrevious = () => {
    if (!selectedDay || !adventData?.days) return false;
    const currentIndex = adventData.days.findIndex(
      (d) => d?.day === selectedDay?.day
    );
    if (currentIndex <= 0) return false;
    const prevDay = adventData.days[currentIndex - 1];
    return !!prevDay && isDayUnlocked(prevDay.date ?? '');
  };

  const hasNext = () => {
    if (!selectedDay || !adventData?.days) return false;
    const currentIndex = adventData.days.findIndex(
      (d) => d?.day === selectedDay?.day
    );
    if (currentIndex >= adventData.days.length - 1) return false;
    const nextDay = adventData.days[currentIndex + 1];
    return !!nextDay && isDayUnlocked(nextDay.date ?? '');
  };

  if (!adventData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-600">Lade Adventskalender...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: '#FEFEFE' }}>
      <Snowflakes />

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="inline-block mb-4"
          >
            <Star className="w-16 h-16 fill-current" style={{ color: '#B59410' }} />
          </motion.div>
          
          <h1
            className="text-4xl md:text-6xl font-bold mb-4"
            style={{ color: '#B3001B' }}
          >
            Adventskalender {adventData?.metadata?.year ?? 2025}
          </h1>
          
          <p
            className="text-xl md:text-2xl mb-2"
            style={{ color: '#003366' }}
          >
            {adventData?.metadata?.theme ?? ''}
          </p>
          
          <p
            className="text-lg opacity-80"
            style={{ color: '#006633' }}
          >
            {adventData?.metadata?.subtitle ?? ''}
          </p>

          {/* Progress indicator */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 inline-flex items-center gap-3 px-6 py-3 bg-white rounded-full shadow-lg"
          >
            <CalendarIcon className="w-5 h-5" style={{ color: '#B3001B' }} />
            <span className="font-semibold">
              {unlockedDays?.length ?? 0} von {adventData?.days?.length ?? 0} Türchen geöffnet
            </span>
          </motion.div>
        </motion.header>

        {/* Calendar Grid */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 md:gap-6">
            {adventData?.days?.map((day) => (
              <AdventDoor
                key={day?.day ?? 0}
                day={day}
                isUnlocked={isDayUnlocked(day?.date ?? '')}
                onClick={() => handleDoorClick(day)}
              />
            ))}
          </div>
        </div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-16 text-center text-sm text-gray-600"
        >
          <p className="mb-2">
            {adventData?.metadata?.author ?? ''}
          </p>
          <p className="opacity-70">
            {adventData?.metadata?.description ?? ''}
          </p>
        </motion.footer>
      </div>

      {/* Modals */}
      <ContentModal
        day={selectedDay}
        onClose={() => setSelectedDay(null)}
        onPrevious={handlePrevious}
        onNext={handleNext}
        hasPrevious={hasPrevious()}
        hasNext={hasNext()}
      />

      {showLockedMessage && (
        <LockedMessage
          date={showLockedMessage}
          onClose={() => setShowLockedMessage(null)}
        />
      )}
    </div>
  );
}
