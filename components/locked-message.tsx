'use client';

import { motion } from 'framer-motion';
import { Lock, Clock } from 'lucide-react';
import { formatDate } from '@/lib/date-utils';

interface LockedMessageProps {
  date: string;
  onClose: () => void;
}

export function LockedMessage({ date, onClose }: LockedMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="relative bg-white rounded-xl shadow-2xl p-8 max-w-md text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <motion.div
          animate={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{ duration: 0.5, repeat: 2 }}
          className="inline-block mb-4"
        >
          <Lock className="w-16 h-16 text-red-600" />
        </motion.div>

        <h2 className="text-2xl font-bold mb-4" style={{ color: '#B3001B' }}>
          Komm später wieder!
        </h2>

        <p className="text-gray-600 mb-4">
          Dieses Türchen öffnet sich am:
        </p>

        <div className="flex items-center justify-center gap-2 text-lg font-semibold mb-6">
          <Clock className="w-5 h-5" style={{ color: '#B3001B' }} />
          <span>{formatDate(date)}</span>
        </div>

        <p className="text-sm text-gray-500 mb-6">
          Sei geduldig – die besten Dinge sind das Warten wert! ✨
        </p>

        <button
          onClick={onClose}
          className="px-6 py-2 rounded-lg font-medium text-white transition-colors hover:opacity-90"
          style={{ backgroundColor: '#B3001B' }}
        >
          Understood
        </button>
      </motion.div>
    </motion.div>
  );
}
