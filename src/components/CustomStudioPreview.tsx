import { useState, useCallback, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const CustomStudioPreview = () => {
  const [position, setPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

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
    <section className="relative w-full py-24 sm:py-32 bg-background">
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden"
        style={{ aspectRatio: isMobile ? "4/5" : "21/9" }}
      >
          {/* Image Layers - Same approach for both desktop and mobile */}
          {/* Bottom layer - Finished image */}
          <div className="absolute inset-0 bg-[#D4A5A5] flex items-center justify-center">
            <span className={`text-white font-display opacity-20 ${isMobile ? 'text-4xl' : 'text-5xl'}`}>
              FINISHED
            </span>
          </div>

          {/* Top layer - Sketch image (clipped) */}
          <div
            className="absolute inset-0 bg-[#F5E6D3] flex items-center justify-center"
            style={{
              clipPath: `inset(0 ${100 - position}% 0 0)`,
            }}
          >
            <span className={`text-foreground/20 font-display opacity-30 ${isMobile ? 'text-4xl' : 'text-5xl'}`}>
              SKETCH
            </span>
          </div>

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

            {/* Circular handle with arrows */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white shadow-lg border border-white/20 flex items-center justify-center gap-0.5">
              <ChevronLeft className="w-4 h-4 text-muted-foreground" />
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>

          {/* Text Overlay */}
          <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
            <div className="text-center max-w-sm mx-auto px-4 pointer-events-auto space-y-4">
              <p className="text-sm font-medium tracking-[0.2em] uppercase text-white [text-shadow:_0_2px_12px_rgb(0_0_0_/_50%)]">
                Custom Studio
              </p>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-medium text-white [text-shadow:_0_2px_12px_rgb(0_0_0_/_50%)]">
                Made Just for You
              </h2>
              <p className="italic text-white/90 text-base [text-shadow:_0_1px_8px_rgb(0_0_0_/_40%)]">
                Upload your inspo. Pick your shape. Add your magic.
              </p>
              <div className="pt-2">
                <Link to="/custom-studio">
                  <Button className="bg-primary/90 text-white hover:bg-primary rounded-full px-8 font-medium">
                    Start Designing
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
    </section>
  );
};

export default CustomStudioPreview;
