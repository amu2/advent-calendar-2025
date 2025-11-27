'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Calendar, Download } from 'lucide-react';
import { useEffect } from 'react';
import type { AdventDay } from '@/lib/types';
import { MathRenderer } from './math-renderer';
import { FallingText } from './falling-text';
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
            className="relative w-full max-w-5xl max-h-[90vh] bg-white shadow-2xl overflow-hidden"
            style={{
              borderRadius: '12px',
              border: '3px solid rgba(0, 102, 51, 0.8)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Action Buttons */}
            <div className="absolute top-4 right-4 z-20 flex gap-2">
              {/* PDF Download Button */}
              <button
                onClick={() => {
                  const pdfPath = `/pdfs/advent${String(day?.day ?? 0).padStart(2, '0')}.pdf`;
                  const link = document.createElement('a');
                  link.href = pdfPath;
                  link.download = `advent_day_${day?.day ?? 0}.pdf`;
                  link.target = '_blank';
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                style={{ color: '#006633' }}
                aria-label="Download PDF"
                title="Download as PDF"
              >
                <Download className="w-6 h-6" />
              </button>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                style={{ color: '#B3001B' }}
                aria-label="Close"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* AdventFrameTop - Header Section */}
            <div
              className="p-8 rounded-t-xl"
              style={{ backgroundColor: 'rgba(0, 102, 51, 0.02)' }}
            >
              {/* AdventTitleBlock */}
              <div className="text-center mb-4">
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-2xl font-bold mb-2"
                  style={{ 
                    color: '#B3001B',
                    fontFamily: '"Times New Roman", Times, serif',
                  }}
                >
                  {formatDate(day?.date ?? '')}
                  {day?.special && <span className="ml-2">• {day.special}</span>}
                </motion.div>
                
                <motion.h2
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-4xl font-bold mb-3 leading-tight"
                  style={{ 
                    color: '#003366',
                    fontFamily: '"Times New Roman", Times, serif',
                  }}
                >
                  {day?.title ?? ''}
                </motion.h2>
                
                {day?.subtitle && (
                  <motion.p
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-xl font-semibold"
                    style={{ 
                      color: '#000',
                      fontFamily: '"Times New Roman", Times, serif',
                    }}
                  >
                    {day.subtitle}
                  </motion.p>
                )}
              </div>

              {/* AdventKeyInsight */}
              {day?.keyInsight && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="p-4 rounded text-base"
                  style={{ 
                    backgroundColor: 'rgba(179, 0, 27, 0.08)',
                    fontFamily: '"Times New Roman", Times, serif',
                  }}
                >
                  <span className="font-bold" style={{ color: '#B3001B' }}>
                    Key Insight.{' '}
                  </span>
                  <span style={{ color: '#000' }}>{day.keyInsight}</span>
                </motion.div>
              )}
            </div>

            {/* AdventStarRule */}
            <div className="flex items-center justify-center py-4">
              <div
                className="h-[1px] w-1/4"
                style={{ backgroundColor: '#B59410' }}
              />
              <div className="px-3" style={{ color: '#B59410' }}>
                ★ ★ ★
              </div>
              <div
                className="h-[1px] w-1/4"
                style={{ backgroundColor: '#B59410' }}
              />
            </div>

            {/* Content - Two Column Layout */}
            <div className="overflow-y-auto max-h-[calc(90vh-180px)] px-8 pb-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="prose prose-base max-w-none advent-content"
                style={{
                  columnCount: 2,
                  columnGap: '2rem',
                  fontSize: '1rem',
                  lineHeight: '1.65',
                }}
              >
                <MathRenderer content={day?.content ?? ''} />
              </motion.div>

              {/* AdventClosing - outside columns */}
              {day?.closing && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="mt-8 text-center italic text-lg break-before-column"
                  style={{ 
                    color: '#006633',
                    columnSpan: 'all',
                  }}
                >
                  {day.closing}
                </motion.div>
              )}

              {day?.references && day.references.length > 0 && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.9 }}
                  className="mt-8 pt-6"
                  style={{ borderTop: '1px solid rgba(0, 102, 51, 0.2)' }}
                >
                  <h3 
                    className="text-lg font-semibold mb-4"
                    style={{ color: '#003366' }}
                  >
                    References
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    {day.references.map((ref, idx) => (
                      <li
                        key={ref?.key ?? idx}
                        dangerouslySetInnerHTML={{ __html: ref?.text ?? '' }}
                      />
                    ))}
                  </ul>
                </motion.div>
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
                <span>Previous</span>
              </button>

              <button
                onClick={onClose}
                className="px-6 py-2 rounded-lg font-medium transition-colors hover:bg-gray-200"
                style={{ color: '#B3001B' }}
              >
                Back to Calendar
              </button>

              <button
                onClick={onNext}
                disabled={!hasNext}
                className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-200"
                style={{
                  color: hasNext ? '#B3001B' : '#999',
                }}
              >
                <span>Next</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
