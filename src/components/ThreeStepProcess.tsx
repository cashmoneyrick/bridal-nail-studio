import { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  { src: "/images/how-it-works/step-1-order.jpg", alt: "Step 1: Order" },
  { src: "/images/how-it-works/step-2-sizing-kit.jpg", alt: "Step 2: Sizing Kit" },
  { src: "/images/how-it-works/step-3-find-size.jpg", alt: "Step 3: Find Size" },
  { src: "/images/how-it-works/step-4-submit.jpg", alt: "Step 4: Submit" },
];

const ThreeStepProcess = () => {
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
    <>
      {/* Section 1: Banner Header */}
      <section className="py-12 sm:py-16 bg-background">
        <div className="text-center">
          <p className="text-sm font-medium tracking-[0.2em] uppercase text-primary mb-3">
            How It Works
          </p>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-medium">
            Four Simple Steps
          </h2>
        </div>
      </section>

      {/* Section 2: Full-Bleed Image Carousel */}
      <section className="pb-16 sm:pb-20 bg-background">
        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {slides.map((slide, index) => (
                <div
                  key={index}
                  className="flex-none w-[85%] md:w-[60%] lg:w-[45%] pl-4 first:pl-4"
                >
                  <img
                    src={slide.src}
                    alt={slide.alt}
                    className="w-full h-auto rounded-xl object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Arrow Navigation */}
          <button
            onClick={scrollPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/90 backdrop-blur-sm shadow-lg flex items-center justify-center transition-all hover:bg-background z-10"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={scrollNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/90 backdrop-blur-sm shadow-lg flex items-center justify-center transition-all hover:bg-background z-10"
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
      </section>
    </>
  );
};

export default ThreeStepProcess;
