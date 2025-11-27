'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { useEffect } from 'react';
import type { AdventDay } from '@/lib/types';
import { MathRenderer } from './math-renderer';
import { formatDate } from '@/lib/date-utils';

interface ContentModalProps {
  day: AdventDay | null;
  onClose: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
  hasPrevious: boolean;
  hasNext: boolean;
}

export function ContentModal({
  day,
  onClose,
  onPrevious,
  onNext,
  hasPrevious,
  hasNext,
}: ContentModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (day) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [day, onClose]);

  return (
    <AnimatePresence>
      {day && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              className="sticky top-0 z-10 p-6 text-white"
              style={{
                background: day?.special?.includes('Advent')
                  ? 'linear-gradient(135deg, #B59410 0%, #D4AF37 100%)'
                  : 'linear-gradient(135deg, #B3001B 0%, #8B0000 100%)',
              }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-5xl font-bold">{day?.day ?? 0}</div>
                    <div className="flex items-center gap-2 text-sm opacity-90">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(day?.date ?? '')}</span>
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold mb-1">{day?.title ?? ''}</h2>
                  {day?.subtitle && (
                    <p className="text-sm opacity-90">{day.subtitle}</p>
                  )}
                  {day?.special && (
                    <div className="mt-2 inline-block px-3 py-1 bg-white/20 rounded-full text-sm">
                      {day.special}
                    </div>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  aria-label="Schließen"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-180px)] p-6">
              {day?.keyInsight && (
                <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-600 rounded">
                  <h3 className="font-semibold text-blue-900 mb-2">Kernaussage:</h3>
                  <p className="text-blue-800">{day.keyInsight}</p>
                </div>
              )}

              {day?.centralFormula && (
                <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-600 rounded">
                  <h3 className="font-semibold text-yellow-900 mb-2">Zentrale Formel:</h3>
                  <p className="text-yellow-800 font-mono">{day.centralFormula}</p>
                </div>
              )}

              <MathRenderer content={day?.content ?? ''} />

              {day?.closing && (
                <div className="mt-6 p-4 bg-green-50 border-l-4 border-green-600 rounded">
                  <p className="text-green-800 italic">{day.closing}</p>
                </div>
              )}

              {day?.references && day.references.length > 0 && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold mb-4">Literatur</h3>
                  <ul className="space-y-2 text-sm">
                    {day.references.map((ref, idx) => (
                      <li
                        key={ref?.key ?? idx}
                        className="text-gray-700"
                        dangerouslySetInnerHTML={{ __html: ref?.text ?? '' }}
                      />
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Footer Navigation */}
            <div className="sticky bottom-0 flex items-center justify-between p-4 bg-gray-50 border-t border-gray-200">
              <button
                onClick={onPrevious}
                disabled={!hasPrevious}
                className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-200"
                style={{
                  color: hasPrevious ? '#B3001B' : '#999',
                }}
              >
                <ChevronLeft className="w-5 h-5" />
                <span>Vorheriger Tag</span>
              </button>

              <button
                onClick={onClose}
                className="px-6 py-2 rounded-lg font-medium transition-colors hover:bg-gray-200"
                style={{ color: '#B3001B' }}
              >
                Zurück zum Kalender
              </button>

              <button
                onClick={onNext}
                disabled={!hasNext}
                className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-200"
                style={{
                  color: hasNext ? '#B3001B' : '#999',
                }}
              >
                <span>Nächster Tag</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
