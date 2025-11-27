'use client';

import { useEffect, useState } from 'react';

export function Snowflakes() {
  const [snowflakes, setSnowflakes] = useState<Array<{
    id: number;
    left: number;
    animationDuration: number;
    size: number;
    delay: number;
  }>>([]);

  useEffect(() => {
    const flakes = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      animationDuration: 10 + Math.random() * 20,
      size: 16 + Math.random() * 24, // Viel größer: 16-40px
      delay: Math.random() * 10,
    }));
    setSnowflakes(flakes);
  }, []);

  return (
    <>
      <style jsx global>{`
        @keyframes snowfall {
          0% {
            transform: translateY(-10vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(110vh) rotate(360deg);
            opacity: 0.8;
          }
        }
      `}</style>
      <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
        {snowflakes.map((flake) => (
          <div
            key={flake.id}
            className="absolute text-white font-bold" 
            style={{
              left: `${flake.left}%`,
              fontSize: `${flake.size}px`,
              animation: `snowfall ${flake.animationDuration}s linear infinite`,
              animationDelay: `${flake.delay}s`,
              textShadow: '0 0 5px rgba(0,0,0,0.5), 0 0 10px rgba(0,0,0,0.3)',
              opacity: 0.9,
            }}
          >
            ❄
          </div>
        ))}
      </div>
    </>
  );
}