import { useState, useCallback, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import customStudioDesktop from "@/assets/custom-studio-desktop.jpeg";
import customStudioMobile from "@/assets/custom-studio-mobile.jpeg";

const CustomStudioPreview = () => {
  const sectionRef = useScrollReveal();
  const [position, setPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    setHasInteracted(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      if (!isDragging || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = Math.max(2, Math.min(98, (x / rect.width) * 100));
      setPosition(percentage);
    },
    [isDragging]
  );

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", handlePointerUp);
    }
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [isDragging, handlePointerMove, handlePointerUp]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      setPosition((prev) => Math.max(2, prev - 5));
      setHasInteracted(true);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      setPosition((prev) => Math.min(98, prev + 5));
      setHasInteracted(true);
    }
  };

  return (
    <section ref={sectionRef} className="relative py-14 sm:py-16 lg:py-20 bg-background reveal-scale">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center">

          {/* Left: Copy */}
          <div>
            <p className="text-[10px] font-semibold tracking-[0.35em] uppercase text-muted-foreground/40 mb-4">
              Custom Studio
            </p>

            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium leading-[1.1] mb-4">
              <span className="italic font-light text-foreground/60">Made Just</span>{" "}
              for You
            </h2>

            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-6 max-w-sm">
              Share your vision — pick your shape, colors, and extras — and we'll handcraft a set that's entirely yours.
            </p>

            <Link to="/create">
              <Button className="rounded-full px-7 py-2.5 font-medium text-sm tracking-wide group">
                Start Designing
                <ArrowRight className="w-3.5 h-3.5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </Link>
          </div>

          {/* Right: Before/After slider with real images */}
          <div>
            {/* Labels */}
            <div className="flex justify-between text-[10px] font-semibold tracking-[0.25em] uppercase text-muted-foreground/40 mb-2.5 px-1">
              <span>Before</span>
              <span>After</span>
            </div>

            <div
              ref={containerRef}
              className="relative w-full overflow-hidden rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] select-none"
              style={{ aspectRatio: "4/5" }}
            >
              {/* Bottom layer: "After" — full color image */}
              <picture className="absolute inset-0">
                <source media="(min-width: 640px)" srcSet={customStudioDesktop} />
                <img
                  src={customStudioMobile}
                  alt="Custom nail set — after"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
              </picture>

              {/* Top layer: "Before" — desaturated + muted image, clipped */}
              <div
                className="absolute inset-0"
                style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
              >
                <picture>
                  <source media="(min-width: 640px)" srcSet={customStudioDesktop} />
                  <img
                    src={customStudioMobile}
                    alt="Plain nails — before"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                    style={{ filter: "grayscale(100%) brightness(1.05) contrast(0.85)" }}
                  />
                </picture>
                {/* Subtle warm overlay on the "before" side */}
                <div className="absolute inset-0 bg-background/20" />
              </div>

              {/* Slider handle */}
              <div
                className="absolute top-0 bottom-0 z-20 cursor-ew-resize touch-none w-10 -ml-5"
                style={{ left: `${position}%` }}
                onPointerDown={handlePointerDown}
                onKeyDown={handleKeyDown}
                tabIndex={0}
                role="slider"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(position)}
                aria-label="Before and after comparison slider"
              >
                {/* Vertical line */}
                <div className="absolute left-1/2 -translate-x-1/2 inset-y-0 w-[1.5px] bg-white/80 shadow-[0_0_8px_rgba(0,0,0,0.15)]" />

                {/* Handle pill */}
                <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-white/95 backdrop-blur-sm shadow-[0_2px_12px_rgba(0,0,0,0.15)] border border-white/50 flex items-center justify-center gap-0">
                  <ChevronLeft className="w-3.5 h-3.5 text-foreground/50 -mr-0.5" />
                  <ChevronRight className="w-3.5 h-3.5 text-foreground/50 -ml-0.5" />
                </div>
              </div>

              {/* Drag hint — fades out after first interaction */}
              {!hasInteracted && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 pointer-events-none animate-pulse">
                  <div className="bg-foreground/70 backdrop-blur-sm text-background text-[10px] font-medium tracking-wider uppercase px-3 py-1.5 rounded-full">
                    Drag to reveal
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default CustomStudioPreview;
