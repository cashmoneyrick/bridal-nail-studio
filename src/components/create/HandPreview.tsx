/**
 * HandPreview — sticky container showing both hands.
 * Desktop: both hands side by side.
 * Mobile: swipeable, one hand at a time (using Embla Carousel)
 *         with text pill-tabs for hand switching.
 */

import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import useEmblaCarousel from 'embla-carousel-react';
import { motion } from 'framer-motion';
import { useCustomStudioStore } from '@/stores/customStudioStore';
import { useIsMobile } from '@/hooks/use-mobile';
import HandSvg, { NAIL_POS, NAIL_SCALE } from './HandSvg';
import NailPositionEditor from './NailPositionEditor';

export default function HandPreview() {
  const isMobile = useIsMobile();
  const { activeHand, setActiveHand } = useCustomStudioStore();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  const [activeIndex, setActiveIndex] = useState(activeHand === 'left' ? 0 : 1);
  const [searchParams] = useSearchParams();
  const isEditingNails = searchParams.get('editNails') === 'true';
  const [nailPositions, setNailPositions] = useState<Record<number, { cx: number; cy: number; rot: number }>>(() =>
    Object.fromEntries(Object.entries(NAIL_POS).map(([k, v]) => [Number(k), { ...v }]))
  );
  const [nailScale, setNailScale] = useState(NAIL_SCALE);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    const idx = emblaApi.selectedScrollSnap();
    setActiveIndex(idx);
    setActiveHand(idx === 0 ? 'left' : 'right');
  }, [emblaApi, setActiveHand]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', onSelect);
    return () => { emblaApi.off('select', onSelect); };
  }, [emblaApi, onSelect]);

  if (isMobile) {
    return (
      <div className="relative" style={{ background: '#E8D0D2' }}>
        {/* Hand switching tabs */}
        <div className="flex justify-center gap-2 pt-3 pb-2">
          {(['Left', 'Right'] as const).map((label, idx) => {
            const isActive = activeIndex === idx;
            return (
              <motion.button
                key={label}
                onClick={() => emblaApi?.scrollTo(idx)}
                animate={{
                  backgroundColor: isActive ? '#6B4C3B' : 'rgba(107,76,59,0.08)',
                  color: isActive ? '#F5EDE8' : '#7A5A48',
                }}
                whileTap={{ scale: 0.96 }}
                transition={{ duration: 0.2 }}
                className="px-4 py-1.5 rounded-full text-xs font-medium tracking-wide"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  letterSpacing: '0.06em',
                }}
                aria-label={`${label} hand`}
              >
                {label}
              </motion.button>
            );
          })}
        </div>

        {/* Swipeable hands — bigger container */}
        <div ref={emblaRef} className="overflow-hidden">
          <div className="flex">
            <div className="flex-[0_0_100%] min-w-0 flex justify-center px-4 pb-3">
              <div className="w-52 h-[290px]">
                <HandSvg
                  hand="left"
                  {...(isEditingNails ? { positionOverrides: nailPositions, scaleOverride: nailScale } : {})}
                />
              </div>
            </div>
            <div className="flex-[0_0_100%] min-w-0 flex justify-center px-4 pb-3">
              <div className="w-52 h-[290px]">
                <HandSvg hand="right" />
              </div>
            </div>
          </div>
        </div>
        {isEditingNails && (
          <NailPositionEditor
            positions={nailPositions}
            scale={nailScale}
            onPositionsChange={setNailPositions}
            onScaleChange={setNailScale}
          />
        )}
      </div>
    );
  }

  // Desktop: both hands side by side with labels and divider
  return (
    <div
      className="w-full py-6 px-4"
      style={{ background: '#E8D0D2' }}
    >
      <div className="flex items-end justify-center gap-0 max-w-md mx-auto">
        {/* Left hand */}
        <div className="flex flex-col items-center flex-1 min-w-0">
          <div className="w-full max-w-[180px] h-[250px]">
            <HandSvg
              hand="left"
              {...(isEditingNails ? { positionOverrides: nailPositions, scaleOverride: nailScale } : {})}
            />
          </div>
          <p
            className="text-[10px] uppercase mt-1"
            style={{ color: '#9A7E6D', letterSpacing: '0.15em' }}
          >
            Left Hand
          </p>
        </div>

        {/* Vertical divider */}
        <div
          className="h-16 w-px mx-3 flex-shrink-0 self-center"
          style={{ background: 'rgba(107,76,59,0.12)' }}
        />

        {/* Right hand */}
        <div className="flex flex-col items-center flex-1 min-w-0">
          <div className="w-full max-w-[180px] h-[250px]">
            <HandSvg hand="right" />
          </div>
          <p
            className="text-[10px] uppercase mt-1"
            style={{ color: '#9A7E6D', letterSpacing: '0.15em' }}
          >
            Right Hand
          </p>
        </div>
      </div>
      {isEditingNails && (
        <NailPositionEditor
          positions={nailPositions}
          scale={nailScale}
          onPositionsChange={setNailPositions}
          onScaleChange={setNailScale}
        />
      )}
    </div>
  );
}
