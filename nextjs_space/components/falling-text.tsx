'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface FallingTextProps {
  children: ReactNode;
  delay?: number;
}

export function FallingText({ children, delay = 0 }: FallingTextProps) {
  if (typeof children !== 'string') {
    return <div>{children}</div>;
  }

  const letters = children.split('');

  return (
    <span className="inline-block">
      {letters.map((letter, index) => (
        <motion.span
          key={`${index}-${letter}`}
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            duration: 0.3,
            delay: delay + index * 0.02,
            ease: 'easeOut',
          }}
          className="inline-block"
          style={{
            whiteSpace: letter === ' ' ? 'pre' : 'normal',
          }}
        >
          {letter === ' ' ? '\u00A0' : letter}
        </motion.span>
      ))}
    </span>
  );
}
