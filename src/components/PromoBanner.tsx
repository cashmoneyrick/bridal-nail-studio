import { useState, useEffect, useCallback, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";

const messages = [
  "New: Spring Collection — garden-inspired sets, handmade to order",
  "Every order includes a free sizing kit",
  "Custom designs start at $45",
];

const MarqueeSlide = ({
  message,
  isActive,
  onComplete
}: {
  message: string;
  isActive: boolean;
  onComplete: () => void;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const [overflow, setOverflow] = useState(0);

  // Measure overflow on mount and resize
  useEffect(() => {
    const measure = () => {
      if (containerRef.current && textRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const textWidth = textRef.current.scrollWidth;
        setOverflow(Math.max(0, textWidth - containerWidth + 32)); // +32 for padding
      }
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [message]);

  // Handle timing when slide becomes active
  useEffect(() => {
    if (!isActive) return;

    const duration = overflow > 0
      ? 1000 + (overflow / 50) * 1000 + 1000  // 1s pause + scroll + 1s pause
      : 4000;  // No overflow: 4s delay

    const timer = setTimeout(onComplete, duration);
    return () => clearTimeout(timer);
  }, [isActive, overflow, onComplete]);

  const animationDuration = overflow > 0 ? 1 + overflow/50 + 1 : 0;
  const animationStyle = overflow > 0 && isActive ? {
    animation: `marquee ${animationDuration}s linear forwards`,
    ['--scroll-distance' as string]: `-${overflow}px`,
  } : {};

  return (
    <div ref={containerRef} className="flex-none w-full py-3 overflow-hidden">
      <p
        ref={textRef}
        style={animationStyle}
        className="text-sm font-medium tracking-wide leading-relaxed text-center whitespace-nowrap px-4"
      >
        {message}
      </p>
    </div>
  );
};

const PromoBanner = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on('select', onSelect);
    return () => { emblaApi.off('select', onSelect); };
  }, [emblaApi]);

  const handleSlideComplete = useCallback(() => {
    emblaApi?.scrollNext();
  }, [emblaApi]);

  return (
    <div className="bg-gradient-to-r from-primary/85 via-primary to-primary/85 text-primary-foreground shadow-sm overflow-hidden">
      <style>{`
        @keyframes marquee {
          0%, 10% { transform: translateX(0); }
          90%, 100% { transform: translateX(var(--scroll-distance)); }
        }
      `}</style>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {messages.map((message, index) => (
            <MarqueeSlide
              key={index}
              message={message}
              isActive={index === selectedIndex}
              onComplete={handleSlideComplete}
            />
          ))}
        </div>
      </div>
      {/* Dot indicators */}
      <div className="flex items-center justify-center gap-1.5 pb-1.5">
        {messages.map((_, i) => (
          <div key={i} className={`rounded-full transition-all duration-300 ${
            i === selectedIndex
              ? "w-4 h-[3px] bg-primary-foreground"
              : "w-[3px] h-[3px] bg-primary-foreground/35"
          }`} />
        ))}
      </div>
    </div>
  );
};

export default PromoBanner;
