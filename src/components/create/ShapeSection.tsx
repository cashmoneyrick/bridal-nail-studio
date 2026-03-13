/**
 * ShapeSection — horizontal showcase carousel for 7 nail shapes.
 * Active shape is enlarged in the center, neighbors are smaller.
 * Uses Embla Carousel for swipe behavior.
 */

import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCustomStudioStore } from '@/stores/customStudioStore';
import { ShapeType, SHAPE_LABELS, SHAPE_PRICES } from '@/lib/pricing';
import SectionWrapper from './SectionWrapper';

const SHAPES: ShapeType[] = ['almond', 'oval', 'round', 'square', 'squoval', 'coffin', 'stiletto'];

const SHAPE_DESCRIPTIONS: Record<ShapeType, string> = {
  almond: 'Tapered with a soft, rounded peak — universally flattering',
  oval: 'Rounded tip that elongates fingers — classic and elegant',
  round: 'Natural curve following the fingertip — low-maintenance beauty',
  square: 'Flat edge with sharp corners — bold and modern',
  squoval: 'Square with rounded corners — the best of both worlds',
  coffin: 'Tapered to a flat tip — dramatic and runway-ready',
  stiletto: 'Sharp pointed tip — fierce and statement-making',
};

export default function ShapeSection() {
  const { shape, setShape } = useCustomStudioStore();
  const activeIndex = SHAPES.indexOf(shape);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'center',
    startIndex: activeIndex,
    dragFree: false,
  });

  const [selectedIndex, setSelectedIndex] = useState(activeIndex);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    const idx = emblaApi.selectedScrollSnap();
    setSelectedIndex(idx);
    setShape(SHAPES[idx]);
  }, [emblaApi, setShape]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', onSelect);
    return () => { emblaApi.off('select', onSelect); };
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <SectionWrapper title="Choose Your Shape">
      {/* Carousel */}
      <div className="w-full relative">
        {/* Arrow buttons */}
        <motion.button
          onClick={scrollPrev}
          whileHover={{ scale: 1.1, background: '#D4B0B3' }}
          whileTap={{ scale: 0.95 }}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center"
          style={{ background: '#DBBFC2', color: '#3D2B1F' }}
          aria-label="Previous shape"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </motion.button>
        <motion.button
          onClick={scrollNext}
          whileHover={{ scale: 1.1, background: '#D4B0B3' }}
          whileTap={{ scale: 0.95 }}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center"
          style={{ background: '#DBBFC2', color: '#3D2B1F' }}
          aria-label="Next shape"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </motion.button>

        <div ref={emblaRef} className="overflow-hidden px-12">
          <div className="flex items-center" style={{ gap: '8px' }}>
            {SHAPES.map((s, index) => {
              const isActive = index === selectedIndex;
              const price = SHAPE_PRICES[s];

              return (
                <div
                  key={s}
                  className="flex-[0_0_36%] sm:flex-[0_0_26%] md:flex-[0_0_20%] lg:flex-[0_0_16%] min-w-0 flex justify-center"
                >
                  <motion.button
                    onClick={() => emblaApi?.scrollTo(index)}
                    animate={{
                      scale: isActive ? 1 : 0.75,
                      opacity: isActive ? 1 : 0.5,
                    }}
                    whileTap={{ scale: isActive ? 0.95 : 0.7 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    className="flex flex-col items-center gap-3 py-4 px-3 rounded-2xl"
                    style={{
                      background: isActive ? 'rgba(219,191,194,0.7)' : 'rgba(219,191,194,0.25)',
                      border: isActive ? '2px solid #6B4C3B' : '2px solid transparent',
                      boxShadow: isActive ? 'inset 0 0 20px rgba(107,76,59,0.08)' : 'none',
                    }}
                  >
                    <img
                      src={`/shapes/${s}.svg`}
                      alt={SHAPE_LABELS[s]}
                      className={`${isActive ? 'w-20 h-28 sm:w-24 sm:h-32' : 'w-14 h-20 sm:w-16 sm:h-24'} transition-all object-contain`}
                      draggable={false}
                    />

                    {/* Label + price */}
                    <div className="text-center">
                      <p
                        className="text-sm sm:text-base font-medium"
                        style={{ color: isActive ? '#3D2B1F' : '#7A5A48' }}
                      >
                        {SHAPE_LABELS[s]}
                      </p>
                      {price > 0 && (
                        <p className="text-xs mt-0.5" style={{ color: '#6B4C3B' }}>
                          +${price}
                        </p>
                      )}
                    </div>
                  </motion.button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Dots indicator */}
      <div className="flex justify-center gap-1.5 mt-5">
        {SHAPES.map((s, i) => (
          <button
            key={s}
            onClick={() => emblaApi?.scrollTo(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === selectedIndex ? 'w-6' : 'w-1.5'
            }`}
            style={{
              background: i === selectedIndex ? '#6B4C3B' : '#DBBFC2',
            }}
            aria-label={`Select ${SHAPE_LABELS[s]}`}
          />
        ))}
      </div>

      {/* Active shape name + description */}
      <AnimatePresence mode="wait">
        <motion.div
          key={shape}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="flex flex-col items-center mt-3"
        >
          <p
            className="text-xl sm:text-2xl font-light tracking-wide"
            style={{
              color: '#3D2B1F',
              fontFamily: "'Playfair Display', serif",
            }}
          >
            {SHAPE_LABELS[shape]}
            {SHAPE_PRICES[shape] > 0 && (
              <span className="text-sm ml-2" style={{ color: '#6B4C3B' }}>
                +${SHAPE_PRICES[shape]}
              </span>
            )}
          </p>
          <p
            className="text-sm text-center mt-1.5 max-w-[280px]"
            style={{ color: '#9A7E6D' }}
          >
            {SHAPE_DESCRIPTIONS[shape]}
          </p>
        </motion.div>
      </AnimatePresence>
    </SectionWrapper>
  );
}
