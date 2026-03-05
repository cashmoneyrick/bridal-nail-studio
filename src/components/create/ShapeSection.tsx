/**
 * ShapeSection — horizontal showcase carousel for 8 nail shapes.
 * Active shape is enlarged in the center, neighbors are smaller.
 * Uses Embla Carousel for swipe behavior.
 */

import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCustomStudioStore } from '@/stores/customStudioStore';
import { ShapeType, SHAPE_LABELS, SHAPE_PRICES } from '@/lib/pricing';
import { getPreviewNailPath } from './NailPaths';
import SectionWrapper from './SectionWrapper';

const SHAPES: ShapeType[] = ['almond', 'oval', 'round', 'square', 'squoval', 'coffin', 'stiletto', 'lipstick'];

const SHAPE_DESCRIPTIONS: Record<ShapeType, string> = {
  almond: 'Tapered with a soft, rounded peak — universally flattering',
  oval: 'Rounded tip that elongates fingers — classic and elegant',
  round: 'Natural curve following the fingertip — low-maintenance beauty',
  square: 'Flat edge with sharp corners — bold and modern',
  squoval: 'Square with rounded corners — the best of both worlds',
  coffin: 'Tapered to a flat tip — dramatic and runway-ready',
  stiletto: 'Sharp pointed tip — fierce and statement-making',
  lipstick: 'Asymmetric diagonal tip — edgy and unique',
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
          whileHover={{ scale: 1.1, background: '#6B635B' }}
          whileTap={{ scale: 0.95 }}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center"
          style={{ background: '#5A524A', color: '#F5F0EB' }}
          aria-label="Previous shape"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </motion.button>
        <motion.button
          onClick={scrollNext}
          whileHover={{ scale: 1.1, background: '#6B635B' }}
          whileTap={{ scale: 0.95 }}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center"
          style={{ background: '#5A524A', color: '#F5F0EB' }}
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
              const previewPath = getPreviewNailPath(s, 36, 54);

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
                      background: isActive ? 'rgba(90,82,74,0.7)' : 'rgba(90,82,74,0.25)',
                      border: isActive ? '2px solid #C26871' : '2px solid transparent',
                      boxShadow: isActive ? 'inset 0 0 20px rgba(194,104,113,0.08)' : 'none',
                    }}
                  >
                    {/* Nail silhouette preview */}
                    <svg
                      viewBox="-24 -62 48 68"
                      className={`${isActive ? 'w-16 h-20 sm:w-20 sm:h-24' : 'w-12 h-16 sm:w-14 sm:h-18'} transition-all`}
                    >
                      <defs>
                        <linearGradient id={`preview-grad-${s}`} x1="0.2" y1="0" x2="0.8" y2="1">
                          <stop offset="0%" stopColor="#F5F0EB" stopOpacity={0.9} />
                          <stop offset="100%" stopColor="#d4c4b8" stopOpacity={0.9} />
                        </linearGradient>
                        <linearGradient id={`preview-shine-${s}`} x1="0.2" y1="0" x2="0.8" y2="1">
                          <stop offset="0%" stopColor="white" stopOpacity={0.3} />
                          <stop offset="50%" stopColor="white" stopOpacity={0.05} />
                          <stop offset="100%" stopColor="white" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <path d={previewPath} fill={`url(#preview-grad-${s})`} />
                      <path d={previewPath} fill={`url(#preview-shine-${s})`} />
                      <path d={previewPath} fill="none" stroke="#d4bfb0" strokeWidth={0.5} strokeOpacity={0.4} />
                    </svg>

                    {/* Label + price */}
                    <div className="text-center">
                      <p
                        className="text-sm sm:text-base font-medium"
                        style={{ color: isActive ? '#F5F0EB' : '#B8AFA6' }}
                      >
                        {SHAPE_LABELS[s]}
                      </p>
                      {price > 0 && (
                        <p className="text-xs mt-0.5" style={{ color: '#C26871' }}>
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
              background: i === selectedIndex ? '#C26871' : '#5A524A',
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
              color: '#F5F0EB',
              fontFamily: "'Playfair Display', serif",
            }}
          >
            {SHAPE_LABELS[shape]}
            {SHAPE_PRICES[shape] > 0 && (
              <span className="text-sm ml-2" style={{ color: '#C26871' }}>
                +${SHAPE_PRICES[shape]}
              </span>
            )}
          </p>
          <p
            className="text-sm text-center mt-1.5 max-w-[280px]"
            style={{ color: '#8A827A' }}
          >
            {SHAPE_DESCRIPTIONS[shape]}
          </p>
        </motion.div>
      </AnimatePresence>
    </SectionWrapper>
  );
}
