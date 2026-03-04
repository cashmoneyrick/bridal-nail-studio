import { useState, useCallback, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const CustomStudioPreview = () => {
  const sectionRef = useScrollReveal();
  const [position, setPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Pointer event handlers for dragging
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      if (!isDragging || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
      setPosition(percentage);
    },
    [isDragging]
  );

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Attach window listeners when dragging
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

  // Keyboard handler for accessibility
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      setPosition((prev) => Math.max(0, prev - 5));
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      setPosition((prev) => Math.min(100, prev + 5));
    }
  };

  return (
    <section ref={sectionRef} className="relative py-20 sm:py-28 lg:py-32 bg-background reveal-scale">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left: Editorial copy */}
          <div>
            {/* Rule-flanked eyebrow */}
            <div className="flex items-center gap-5 mb-8">
              <div className="flex-1 h-px bg-border/40" />
              <p className="text-[10px] font-semibold tracking-[0.35em] uppercase text-muted-foreground/50 shrink-0">
                Custom Studio
              </p>
              <div className="flex-1 h-px bg-border/40" />
            </div>

            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-medium leading-[1.05] mb-6">
              <span className="italic font-light text-foreground/60">Made Just</span>{" "}
              for You
            </h2>

            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-8 max-w-md">
              Send us your inspiration, choose your shape and length, and we handle the rest.
            </p>

            <Link to="/custom-studio">
              <Button className="rounded-full px-8 font-medium">
                Start Designing
              </Button>
            </Link>
          </div>

          {/* Right: Before/After slider */}
          <div>
            {/* Before / After labels */}
            <div className="flex justify-between text-[10px] font-semibold tracking-[0.25em] uppercase text-muted-foreground/40 mb-3 px-1">
              <span>Before</span>
              <span>After</span>
            </div>

            {/* Slider container */}
            <div
              ref={containerRef}
              className="relative w-full overflow-hidden rounded-2xl"
              style={{ aspectRatio: "4/5" }}
            >
              {/* Bottom layer */}
              <div className="absolute inset-0 bg-accent" />

              {/* Top layer (clipped) */}
              <div
                className="absolute inset-0 bg-secondary"
                style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
              />

              {/* Slider Handle */}
              <div
                className="absolute top-0 bottom-0 z-20 cursor-ew-resize touch-none w-8 -ml-4"
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
                <div className="absolute left-1/2 -translate-x-1/2 inset-y-0 w-0.5 bg-white shadow-lg" />

                {/* Circular handle — vertically centered */}
                <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white shadow-lg border border-white/20 flex items-center justify-center gap-0.5">
                  <ChevronLeft className="w-4 h-4 text-muted-foreground" />
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default CustomStudioPreview;
