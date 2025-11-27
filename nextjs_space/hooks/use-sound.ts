import { useEffect, useState } from 'react';

export function useSound() {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    const sound = new Audio('/sounds/door-open.mp3');
    sound.preload = 'auto';
    setAudio(sound);
  }, []);

  const play = () => {
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(err => {
        console.log('Audio playback failed:', err);
      });
    }
  };

  return { play };
}
