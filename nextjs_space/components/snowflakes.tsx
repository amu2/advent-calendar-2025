'use client';

import { useEffect, useState } from 'react';

interface Snowflake {
  id: number;
  left: number;
  animationDuration: number;
  size: number;
  delay: number;
}

export function Snowflakes() {
  const [snowflakes, setSnowflakes] = useState<Snowflake[]>([]);

  useEffect(() => {
    const flakes: Snowflake[] = [];
    for (let i = 0; i < 50; i++) {
      flakes.push({
        id: i,
        left: Math.random() * 100,
        animationDuration: 10 + Math.random() * 20,
        size: 0.5 + Math.random() * 1,
        delay: Math.random() * 10,
      });
    }
    setSnowflakes(flakes);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {snowflakes?.map((flake) => (
        <div
          key={flake?.id}
          className="absolute text-white/70"
          style={{
            left: `${flake?.left ?? 0}%`,
            fontSize: `${flake?.size ?? 1}rem`,
            animation: `fall ${flake?.animationDuration ?? 15}s linear infinite`,
            animationDelay: `${flake?.delay ?? 0}s`,
          }}
        >
          ❄
        </div>
      ))}
      <style jsx>{`
        @keyframes fall {
          0% {
            top: -10%;
            opacity: 1;
          }
          100% {
            top: 110%;
            opacity: 0.3;
          }
        }
      `}</style>
    </div>
  );
}
