'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Calendar, Download } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import type { AdventDay } from '@/lib/types';
import { getAssetPath } from '@/lib/paths';
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
  const [isAnimating, setIsAnimating] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ANIMATION_DURATION = 3500; // 3.5 seconds for the full opening animation

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (day) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
      
      // Start door opening music
      setIsAnimating(true);
      if (typeof window !== 'undefined') {
        // Stop any existing audio first
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
          audioRef.current = null;
        }
        
        audioRef.current = new Audio(getAssetPath('/sounds/door-open.mp3'));
        audioRef.current.volume = 0.5;
        audioRef.current.play().catch((error) => {
          console.error('Failed to play door sound:', error);
        });
        
        // Animation completes after music
        const timer = setTimeout(() => {
          setIsAnimating(false);
        }, ANIMATION_DURATION);
        
        return () => {
          clearTimeout(timer);
          document.removeEventListener('keydown', handleEscape);
          document.body.style.overflow = '';
          if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            audioRef.current = null;
          }
        };
      }
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current = null;
      }
    };
  }, [day, onClose]);

  return (
    <AnimatePresence>
      {day && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0, rotateY: -15 }}
            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ 
              type: 'spring',
              stiffness: 60,
              damping: 15,
              duration: 1.5
            }}
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
                  // Map day 30 to advent00.pdf, all others to adventXX.pdf
                  const dayNumber = day?.day === 30 ? 0 : (day?.day ?? 0);
                  const pdfPath = getAssetPath(`/pdfs/advent${String(dayNumber).padStart(2, '0')}.pdf`);
                  
                  // Download with obfuscated filename via fetch + blob
                  fetch(pdfPath)
                    .then(response => {
                      if (!response.ok) throw new Error('PDF not found');
                      return response.blob();
                    })
                    .then(blob => {
                      const url = window.URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      // Obfuscated filename: document_[timestamp].pdf
                      a.download = `document_${Date.now()}.pdf`;
                      document.body.appendChild(a);
                      a.click();
                      window.URL.revokeObjectURL(url);
                      document.body.removeChild(a);
                    })
                    .catch(error => {
                      console.error('Download failed:', error);
                      // Fallback: direct link (will open in browser)
                      window.open(pdfPath, '_blank');
                    });
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
                  initial={{ y: -100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.2, duration: 0.8, type: 'spring', stiffness: 80 }}
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
                  initial={{ y: -120, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.4, duration: 0.9, type: 'spring', stiffness: 80 }}
                  className="text-4xl font-bold mb-3 leading-tight"
                  style={{ 
                    color: '#003366',
                    fontFamily: '"Times New Roman", Times, serif',
                  }}
                >
                  {day?.title ?? ''}
                </motion.h2>
                
                {day?.subtitle && (
                  <motion.div
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1.6, duration: 0.8, type: 'spring', stiffness: 80 }}
                    className="text-xl font-semibold"
                    style={{ 
                      color: '#000',
                      fontFamily: '"Times New Roman", Times, serif',
                    }}
                  >
                    <MathRenderer content={day.subtitle} />
                  </motion.div>
                )}
              </div>
            </div>

            {/* Scrollable Content Area - includes key insight, intro, stars, content, closing */}
            <div className="overflow-y-auto px-8 pb-8" style={{ maxHeight: 'calc(90vh - 250px)' }}>
              {/* AdventKeyInsight */}
              {day?.keyInsight && (
                <motion.div
                  initial={{ y: -80, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.8, duration: 0.8, type: 'spring', stiffness: 80 }}
                  className="p-4 rounded text-base mb-6"
                  style={{ 
                    backgroundColor: 'rgba(179, 0, 27, 0.08)',
                    fontFamily: '"Times New Roman", Times, serif',
                  }}
                >
                  <span className="font-bold" style={{ color: '#B3001B' }}>
                    Key Insight.{' '}
                  </span>
                  <MathRenderer content={day.keyInsight} />
                </motion.div>
              )}

              {/* First Star Rule (before intro) */}
              {day?.intro && (
                <motion.div 
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: 1 }}
                  transition={{ delay: 2.0, duration: 0.6 }}
                  className="flex items-center justify-center py-4"
                >
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
                </motion.div>
              )}

              {/* Intro section (single column) */}
              {day?.intro && (
                <div className="pb-4">
                  <motion.div
                    initial={{ y: -60, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 2.2, duration: 1.0, type: 'spring', stiffness: 70 }}
                    className="prose prose-base max-w-none"
                    style={{
                      fontSize: '1rem',
                      lineHeight: '1.65',
                    }}
                  >
                    <MathRenderer content={day.intro} />
                  </motion.div>
                </div>
              )}

              {/* Second Star Rule (after intro, before main content) */}
              {day?.intro && (
                <motion.div 
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: 1 }}
                  transition={{ delay: 2.4, duration: 0.6 }}
                  className="flex items-center justify-center py-4"
                >
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
                </motion.div>
              )}

              {/* Default star rule if no intro */}
              {!day?.intro && (
                <motion.div 
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: 1 }}
                  transition={{ delay: 2.0, duration: 0.6 }}
                  className="flex items-center justify-center py-4"
                >
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
                </motion.div>
              )}

              {/* Content - Two Column Layout with References */}
              <div>
              <motion.div
                initial={{ y: -60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 2.2, duration: 1.0, type: 'spring', stiffness: 70 }}
                className="prose prose-base max-w-none advent-content"
                style={{
                  columnCount: 2,
                  columnGap: '2rem',
                  fontSize: '1rem',
                  lineHeight: '1.65',
                }}
              >
                <MathRenderer content={day?.content ?? ''} />
                
                {/* References integrated into content */}
                {day?.references && day.references.length > 0 && (
                  <div
                    className="mt-8 pt-6"
                    style={{ 
                      borderTop: '1px solid rgba(0, 102, 51, 0.2)',
                      columnSpan: 'all'
                    }}
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
                  </div>
                )}
              </motion.div>

              {/* Star separator before closing */}
              {day?.closing && (
                <motion.div 
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: 1 }}
                  transition={{ delay: 2.6, duration: 0.6 }}
                  className="flex items-center justify-center py-6 mt-6"
                >
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
                </motion.div>
              )}

              {/* AdventClosing - after star separator */}
              {day?.closing && (
                <motion.div
                  initial={{ y: -40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 2.8, duration: 0.8, type: 'spring', stiffness: 80 }}
                  className="text-center italic text-lg px-4"
                  style={{ 
                    color: '#006633',
                  }}
                >
                  <MathRenderer content={day.closing} />
                </motion.div>
              )}
              </div>
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
