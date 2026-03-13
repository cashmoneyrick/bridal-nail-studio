/**
 * LengthSection — visual length selector with custom slider.
 * Shows 5 stops: XS, S, M, L, XL with nail preview silhouettes.
 */

import { motion, AnimatePresence } from 'framer-motion';
import { useCustomStudioStore } from '@/stores/customStudioStore';
import { LengthType, LENGTH_LABELS, LENGTH_PRICES } from '@/lib/pricing';
import { getPreviewNailPath, LENGTH_SCALES } from './NailPaths';
import SectionWrapper from './SectionWrapper';

const LENGTHS: LengthType[] = ['extra-short', 'short', 'medium', 'long', 'extra-long'];
const LENGTH_SHORT_LABELS: Record<LengthType, string> = {
  'extra-short': 'XS',
  short: 'S',
  medium: 'M',
  long: 'L',
  'extra-long': 'XL',
};
const LENGTH_DESCRIPTIONS: Record<LengthType, string> = {
  'extra-short': 'Barely past the fingertip — natural and effortless',
  short: 'A hint of length — practical yet polished',
  medium: 'The sweet spot — versatile for any occasion',
  long: 'Eye-catching length — glamorous and elegant',
  'extra-long': 'Maximum drama — for the bold and fearless',
};

export default function LengthSection() {
  const { shape, length, setLength, defaultNailConfig } = useCustomStudioStore();
  const activeIndex = LENGTHS.indexOf(length);

  return (
    <SectionWrapper title="Pick Your Length">
      {/* Visual nail preview showing relative lengths */}
      <div className="flex items-end justify-center gap-3 sm:gap-5 mb-10 sm:mb-14">
        {LENGTHS.map((l) => {
          const scale = LENGTH_SCALES[l];
          const isActive = l === length;
          const baseH = 50;
          const baseW = 32;
          const previewPath = getPreviewNailPath(shape, baseW, baseH);

          return (
            <motion.button
              key={l}
              onClick={() => setLength(l)}
              whileTap={{ scale: 0.92 }}
              className="flex flex-col items-center gap-2"
            >
              <motion.div
                animate={{
                  opacity: isActive ? 1 : 0.4,
                  scale: isActive ? 1.1 : 1,
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              >
                <svg
                  viewBox={`${-baseW / 2 - 4} ${-baseH * 1.5} ${baseW + 8} ${baseH * 1.5 + 8}`}
                  className="w-10 h-16 sm:w-14 sm:h-22"
                >
                  <g transform={`scale(1, ${scale})`}>
                    <defs>
                      <linearGradient id={`len-grad-${l}`} x1="0.2" y1="0" x2="0.8" y2="1">
                        <stop offset="0%" stopColor={isActive ? defaultNailConfig.color : '#3D2B1F'} stopOpacity={0.9} />
                        <stop offset="100%" stopColor={isActive ? defaultNailConfig.color : '#d4c4b8'} stopOpacity={0.8} />
                      </linearGradient>
                      <linearGradient id={`len-shine-${l}`} x1="0.2" y1="0" x2="0.8" y2="1">
                        <stop offset="0%" stopColor="white" stopOpacity={0.25} />
                        <stop offset="50%" stopColor="white" stopOpacity={0.05} />
                        <stop offset="100%" stopColor="white" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <path d={previewPath} fill={`url(#len-grad-${l})`} />
                    <path d={previewPath} fill={`url(#len-shine-${l})`} />
                    <path d={previewPath} fill="none" stroke="#d4bfb0" strokeWidth={0.5} strokeOpacity={0.3} />
                  </g>
                </svg>
              </motion.div>
            </motion.button>
          );
        })}
      </div>

      {/* Custom slider track */}
      <div className="w-full max-w-sm mx-auto px-4">
        <div className="relative h-12 flex items-center">
          {/* Track background */}
          <div
            className="absolute inset-x-0 h-1.5 rounded-full"
            style={{ background: '#DBBFC2' }}
          />

          {/* Active track fill */}
          <div
            className="absolute left-0 h-1.5 rounded-full transition-all duration-300"
            style={{
              background: 'linear-gradient(90deg, rgba(107,76,59,0.4), #6B4C3B)',
              width: `${(activeIndex / (LENGTHS.length - 1)) * 100}%`,
            }}
          />

          {/* Stop markers */}
          {LENGTHS.map((l, i) => {
            const isActive = l === length;
            const isPast = i <= activeIndex;

            return (
              <button
                key={l}
                onClick={() => setLength(l)}
                className="absolute flex flex-col items-center"
                style={{
                  left: `${(i / (LENGTHS.length - 1)) * 100}%`,
                  transform: 'translateX(-50%)',
                }}
              >
                {/* Marker dot */}
                <motion.div
                  animate={isActive ? {
                    scale: [1.4, 1.5, 1.4],
                    background: '#6B4C3B',
                  } : {
                    scale: 1,
                    background: isPast ? '#6B4C3B' : '#DBBFC2',
                  }}
                  transition={isActive ? {
                    scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
                    background: { type: 'spring', stiffness: 400, damping: 20 },
                  } : {
                    type: 'spring', stiffness: 400, damping: 20,
                  }}
                  className="w-4 h-4 rounded-full border-2"
                  style={{
                    borderColor: isActive ? '#6B4C3B' : 'transparent',
                    boxShadow: isActive ? '0 0 0 6px rgba(107,76,59,0.15)' : 'none',
                  }}
                />

                {/* Label below */}
                <span
                  className="text-xs mt-2 font-medium transition-colors"
                  style={{ color: isActive ? '#3D2B1F' : '#7A5A48' }}
                >
                  {LENGTH_SHORT_LABELS[l]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active length info */}
      <AnimatePresence mode="wait">
        <motion.div
          key={length}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="text-center mt-8"
        >
          <p
            className="text-xl sm:text-2xl font-light tracking-wide"
            style={{
              color: '#3D2B1F',
              fontFamily: "'Playfair Display', serif",
            }}
          >
            {LENGTH_LABELS[length]}
          </p>
          {LENGTH_PRICES[length] > 0 && (
            <p className="text-sm mt-1" style={{ color: '#6B4C3B' }}>
              +${LENGTH_PRICES[length]}
            </p>
          )}
          <p
            className="text-sm mt-2 max-w-[280px] text-center"
            style={{ color: '#9A7E6D' }}
          >
            {LENGTH_DESCRIPTIONS[length]}
          </p>
        </motion.div>
      </AnimatePresence>
    </SectionWrapper>
  );
}
