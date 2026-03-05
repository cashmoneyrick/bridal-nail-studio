/**
 * HandPreview — sticky container showing both hands.
 * Desktop: both hands side by side.
 * Mobile: swipeable, one hand at a time (using Embla Carousel).
 */

import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { useCustomStudioStore } from '@/stores/customStudioStore';
import { useIsMobile } from '@/hooks/use-mobile';
import HandSvg from './HandSvg';

export default function HandPreview() {
  const isMobile = useIsMobile();
  const { activeHand, setActiveHand } = useCustomStudioStore();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  const [activeIndex, setActiveIndex] = useState(activeHand === 'left' ? 0 : 1);

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
      <div className="relative" style={{ background: '#2E2620' }}>
        {/* Hand indicator dots */}
        <div className="flex justify-center gap-2 pt-3 pb-1">
          <button
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              activeIndex === 0 ? 'bg-[#C26871] w-6' : 'bg-[#5A524A]'
            }`}
            onClick={() => emblaApi?.scrollTo(0)}
            aria-label="Left hand"
          />
          <button
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              activeIndex === 1 ? 'bg-[#C26871] w-6' : 'bg-[#5A524A]'
            }`}
            onClick={() => emblaApi?.scrollTo(1)}
            aria-label="Right hand"
          />
        </div>

        {/* Swipeable hands */}
        <div ref={emblaRef} className="overflow-hidden">
          <div className="flex">
            <div className="flex-[0_0_100%] min-w-0 flex justify-center px-8 pb-4">
              <div className="w-56 h-40">
                <HandSvg hand="left" />
              </div>
            </div>
            <div className="flex-[0_0_100%] min-w-0 flex justify-center px-8 pb-4">
              <div className="w-56 h-40">
                <HandSvg hand="right" />
              </div>
            </div>
          </div>
        </div>

        {/* Hand label */}
        <p className="text-center text-xs pb-3" style={{ color: '#B8AFA6' }}>
          {activeIndex === 0 ? 'Left Hand' : 'Right Hand'}
        </p>
      </div>
    );
  }

  // Desktop: both hands side by side with labels and divider
  return (
    <div
      className="w-full py-6 px-4"
      style={{ background: '#2E2620' }}
    >
      <div className="flex items-end justify-center gap-0 max-w-md mx-auto">
        {/* Left hand */}
        <div className="flex flex-col items-center flex-1 min-w-0">
          <div className="w-full max-w-[200px] h-36">
            <HandSvg hand="left" />
          </div>
          <p
            className="text-[10px] uppercase mt-2"
            style={{ color: '#8A827A', letterSpacing: '0.15em' }}
          >
            Left Hand
          </p>
        </div>

        {/* Vertical divider */}
        <div
          className="h-16 w-px mx-3 flex-shrink-0 self-center"
          style={{ background: 'rgba(194,104,113,0.12)' }}
        />

        {/* Right hand */}
        <div className="flex flex-col items-center flex-1 min-w-0">
          <div className="w-full max-w-[200px] h-36">
            <HandSvg hand="right" />
          </div>
          <p
            className="text-[10px] uppercase mt-2"
            style={{ color: '#8A827A', letterSpacing: '0.15em' }}
          >
            Right Hand
          </p>
        </div>
      </div>
    </div>
  );
}
