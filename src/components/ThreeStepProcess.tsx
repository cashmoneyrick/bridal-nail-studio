import { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// 3 slides for the carousel
const slides = [1, 2, 3];

const ThreeStepProcess = () => {
  // Embla carousel for mobile
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: true,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <section className="py-16 sm:py-20 bg-background">
      {/* Section Header */}
      <div className="text-center mb-12 sm:mb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-medium tracking-[0.2em] uppercase text-primary mb-3">
            How It Works
          </p>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-medium">
            Three Simple Steps
          </h2>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative">
          {/* Carousel Container */}
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {slides.map((_, index) => (
                <div
                  key={index}
                  className="flex-none pl-6 first:pl-6"
                  style={{ width: "100%" }}
                >
                  {/* Image placeholder */}
                  <div className="w-full aspect-[16/9] md:aspect-[21/9] bg-muted rounded-2xl flex items-center justify-center border-2 border-dashed border-border">
                    <span className="text-muted-foreground text-sm">Add Image</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Arrow Navigation */}
          <button
            onClick={scrollPrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/90 backdrop-blur-sm shadow-lg flex items-center justify-center transition-all hover:bg-background z-10"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={scrollNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/90 backdrop-blur-sm shadow-lg flex items-center justify-center transition-all hover:bg-background z-10"
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Dot Indicators */}
        <div className="flex justify-center gap-2 mt-6">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === selectedIndex
                  ? "bg-primary w-6"
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ThreeStepProcess;
