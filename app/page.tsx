'use client';

import { useEffect, useState, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Star, Calendar as CalendarIcon, Volume2, VolumeX, Menu, Sparkles, Snowflake } from 'lucide-react';
import type { AdventData, AdventDay } from '@/lib/types';
import { isDayUnlocked } from '@/lib/date-utils';
import { getAssetPath } from '@/lib/paths';
import { Snowflakes } from '@/components/snowflakes';
import { AdventDoor } from '@/components/advent-door';
import { ContentModal } from '@/components/content-modal';
import { LockedMessage } from '@/components/locked-message';
import { HowToSection } from '@/components/how-to-section';
import { useSound } from '@/hooks/use-sound';

// Helper function to determine header decoration based on date
function getHeaderDecoration(currentDate: Date = new Date()) {
  const month = currentDate.getMonth(); // 0-indexed
  const day = currentDate.getDate();
  
  // After December 31: Snowman
  if (month > 11 || (month === 0 && day > 0)) {
    return { type: 'snowman', count: 1 };
  }
  
  // December 31: Fireworks
  if (month === 11 && day === 31) {
    return { type: 'fireworks', count: 1 };
  }
  
  // December: Stars based on Advent Sundays
  // 1st Advent: Nov 30, so after that until Dec 6: 1 star
  // 2nd Advent: Dec 7, so after that until Dec 13: 2 stars
  // 3rd Advent: Dec 14, so after that until Dec 20: 3 stars
  // 4th Advent: Dec 21, so after that until Dec 30: 4 stars
  if (month === 11) {
    if (day >= 1 && day <= 6) return { type: 'stars', count: 1 };
    if (day >= 7 && day <= 13) return { type: 'stars', count: 2 };
    if (day >= 14 && day <= 20) return { type: 'stars', count: 3 };
    if (day >= 21 && day <= 30) return { type: 'stars', count: 4 };
  }
  
  // November (after First Advent on Nov 30): 1 star
  if (month === 10 && day === 30) {
    return { type: 'stars', count: 1 };
  }
  
  // Default: 1 star
  return { type: 'stars', count: 1 };
}

function HomePageContent() {
  const searchParams = useSearchParams();
  const forceUnlock = searchParams.get('unlock') === 'all';
  
  const [adventData, setAdventData] = useState<AdventData | null>(null);
  const [selectedDay, setSelectedDay] = useState<AdventDay | null>(null);
  const [showLockedMessage, setShowLockedMessage] = useState<string | null>(null);
  const [unlockedDays, setUnlockedDays] = useState<number[]>([]);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const { play: playSound } = useSound();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Get current decoration
  const decoration = getHeaderDecoration(new Date());

  useEffect(() => {
    // Load metadata and all day files
    const loadData = async () => {
      try {
        // Load metadata
        const metadataRes = await fetch(getAssetPath('/data/metadata.json'));
        const metadata = await metadataRes.json();
        
        // Load all day files (day30, day01-25, day31)
        const dayNumbers = [30, ...Array.from({ length: 25 }, (_, i) => i + 1), 31];
        const dayPromises = dayNumbers.map(async (num) => {
          try {
            const res = await fetch(getAssetPath(`/data/days/day${num.toString().padStart(2, '0')}.json`));
            return await res.json();
          } catch (error) {
            console.error(`Failed to load day ${num}:`, error);
            return null;
          }
        });
        
        const days = (await Promise.all(dayPromises)).filter(Boolean);
        
        // Combine metadata and days
        const combinedData: AdventData = {
          ...metadata,
          days
        };
        
        setAdventData(combinedData);
        
        // Calculate unlocked days
        const unlocked = days
          .filter((day) => isDayUnlocked(day?.date ?? '', forceUnlock))
          .map((day) => day?.day ?? 0);
        setUnlockedDays(unlocked);
      } catch (error) {
        console.error('Failed to load advent data:', error);
      }
    };
    
    loadData();
  }, []);

  // Initialize background music
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio(getAssetPath('/sounds/background-music.mp3'));
      audioRef.current.loop = false; // Play only once
      audioRef.current.volume = 0.3;
      
      // Auto-stop music when it ends
      audioRef.current.addEventListener('ended', () => {
        setIsMusicPlaying(false);
      });
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isMusicPlaying) {
        audioRef.current.pause();
        setIsMusicPlaying(false);
      } else {
        audioRef.current.play().catch((error) => {
          console.error('Failed to play music:', error);
        });
        setIsMusicPlaying(true);
      }
    }
  };

  // Fade out background music
  const fadeOutMusic = (): Promise<void> => {
    return new Promise((resolve) => {
      if (!audioRef.current || !isMusicPlaying) {
        resolve();
        return;
      }

      const audio = audioRef.current;
      const fadeOutDuration = 500; // 500ms fade out
      const fadeOutSteps = 20;
      const volumeStep = audio.volume / fadeOutSteps;
      const stepDuration = fadeOutDuration / fadeOutSteps;

      const fadeInterval = setInterval(() => {
        if (audio.volume > volumeStep) {
          audio.volume = Math.max(0, audio.volume - volumeStep);
        } else {
          audio.volume = 0;
          audio.pause();
          setIsMusicPlaying(false);
          clearInterval(fadeInterval);
          resolve();
        }
      }, stepDuration);
    });
  };

  const handleDoorClick = async (day: AdventDay) => {
    const isUnlocked = isDayUnlocked(day?.date ?? '', forceUnlock);
    
    if (isUnlocked) {
      // Fade out background music first
      await fadeOutMusic();
      // Door sound is now played inside the modal after it opens
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
      if (prevDay && isDayUnlocked(prevDay.date ?? '', forceUnlock)) {
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
      if (nextDay && isDayUnlocked(nextDay.date ?? '', forceUnlock)) {
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
    return !!prevDay && isDayUnlocked(prevDay.date ?? '', forceUnlock);
  };

  const hasNext = () => {
    if (!selectedDay || !adventData?.days) return false;
    const currentIndex = adventData.days.findIndex(
      (d) => d?.day === selectedDay?.day
    );
    if (currentIndex >= adventData.days.length - 1) return false;
    const nextDay = adventData.days[currentIndex + 1];
    return !!nextDay && isDayUnlocked(nextDay.date ?? '', forceUnlock);
  };

  if (!adventData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-600">Loading Advent Calendar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: '#FEFEFE' }}>
      <Snowflakes />

      {/* Music Toggle Button */}
      <button
        onClick={toggleMusic}
        className="fixed top-6 right-6 z-50 p-3 rounded-full shadow-lg hover:scale-110 transition-transform"
        style={{ backgroundColor: '#B3001B' }}
        aria-label={isMusicPlaying ? 'Pause music' : 'Play music'}
      >
        {isMusicPlaying ? (
          <Volume2 className="w-6 h-6 text-white" />
        ) : (
          <VolumeX className="w-6 h-6 text-white" />
        )}
      </button>

      <div className="relative z-10 container mx-auto px-4 py-8">

        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          {/* Dynamic Header Decoration */}
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="inline-flex gap-4 mb-4"
          >
            {decoration.type === 'stars' && Array.from({ length: decoration.count }).map((_, i) => (
              <Star key={i} className="w-16 h-16 fill-current" style={{ color: '#B59410' }} />
            ))}
            {decoration.type === 'fireworks' && (
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [1, 0.8, 1]
                }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <Sparkles className="w-20 h-20" style={{ color: '#FFD700' }} />
              </motion.div>
            )}
            {decoration.type === 'snowman' && (
              <motion.div
                animate={{ 
                  y: [0, -5, 0]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Snowflake className="w-16 h-16" style={{ color: '#E0F7FA' }} />
              </motion.div>
            )}
          </motion.div>
          
          <h1
            className="text-4xl md:text-6xl font-bold mb-4"
            style={{ color: '#B3001B' }}
          >
            Advent Calendar {adventData?.metadata?.year ?? 2025}
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
              {unlockedDays?.length ?? 0} of {adventData?.days?.length ?? 0} doors opened
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
                isUnlocked={isDayUnlocked(day?.date ?? '', forceUnlock)}
                onClick={() => handleDoorClick(day)}
              />
            ))}
          </div>
        </div>

        {/* How-to Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="max-w-7xl mx-auto mt-12"
        >
          <HowToSection />
        </motion.div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-16 text-center text-sm text-gray-600"
        >
          <p className="mb-2">
            <a 
              href="mailto:andreas.mueller@hs-kempten.de" 
              className="hover:text-blue-600 transition-colors"
            >
              {adventData?.metadata?.author ?? ''}
            </a>
          </p>
          <p className="opacity-70 mb-6">
            {adventData?.metadata?.description ?? ''}
          </p>
          
          {/* Impressum Button */}
          <Link
            href="/impressum"
            className="inline-block px-6 py-3 rounded-lg transition-all hover:scale-105"
            style={{ 
              backgroundColor: '#FFFFFF', 
              color: '#006633',
              border: '2px solid #006633'
            }}
          >
            Impressum
          </Link>
        </motion.footer>
      </div>

      {/* Modals */}
      <ContentModal
        key={selectedDay?.day ?? 0}
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


export default function HomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-b from-red-900 via-red-800 to-green-900 flex items-center justify-center"><div className="text-white text-xl">Loading...</div></div>}>
      <HomePageContent />
    </Suspense>
  );
}
