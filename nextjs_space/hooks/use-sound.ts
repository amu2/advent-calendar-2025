import { useEffect, useRef, useState } from 'react';

export function useSound(soundUrl: string) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio(soundUrl);
      audioRef.current.volume = 0.5;
      audioRef.current.addEventListener('canplaythrough', () => {
        setIsReady(true);
      });
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [soundUrl]);

  const play = () => {
    if (audioRef.current && isReady) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch((error) => {
        console.log('Audio play failed:', error);
      });
    }
  };

  return { play, isReady };
}
