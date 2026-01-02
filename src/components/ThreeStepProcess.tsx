import { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Placeholder SVG illustrations in dusty rose line art style
const BrowseIcon = () => (
  <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* Shopping/browsing nails concept */}
    <rect x="25" y="35" width="70" height="55" rx="4" stroke="currentColor" strokeWidth="2" />
    <path d="M25 50h70" stroke="currentColor" strokeWidth="2" />
    <circle cx="35" cy="42.5" r="3" fill="currentColor" />
    <circle cx="45" cy="42.5" r="3" fill="currentColor" />
    <circle cx="55" cy="42.5" r="3" fill="currentColor" />
    {/* Nail shapes in grid */}
    <path d="M40 62c0-4 2-8 5-8s5 4 5 8v12h-10V62z" stroke="currentColor" strokeWidth="1.5" />
    <path d="M55 62c0-4 2-8 5-8s5 4 5 8v12h-10V62z" stroke="currentColor" strokeWidth="1.5" />
    <path d="M70 62c0-4 2-8 5-8s5 4 5 8v12h-10V62z" stroke="currentColor" strokeWidth="1.5" />
    {/* Cursor/pointer */}
    <path d="M85 75l8 8m0-8l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const KitIcon = () => (
  <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* Mail package */}
    <rect x="20" y="40" width="80" height="50" rx="3" stroke="currentColor" strokeWidth="2" />
    <path d="M20 50l40 25 40-25" stroke="currentColor" strokeWidth="2" />
    {/* Sparkles */}
    <path d="M85 30l2 5 5 2-5 2-2 5-2-5-5-2 5-2 2-5z" fill="currentColor" />
    <path d="M30 25l1.5 3.5 3.5 1.5-3.5 1.5-1.5 3.5-1.5-3.5-3.5-1.5 3.5-1.5 1.5-3.5z" fill="currentColor" />
    <circle cx="95" cy="45" r="2" fill="currentColor" />
    {/* Size indicator */}
    <path d="M50 95h20M55 92v6M65 92v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const ShipIcon = () => (
  <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* Hand outline */}
    <path d="M35 90V60c0-3 2-5 5-5h10c3 0 5 2 5 5v5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M55 65v-10c0-3 2-5 5-5s5 2 5 5v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M65 65v-15c0-3 2-5 5-5s5 2 5 5v15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M75 65v-10c0-3 2-5 5-5s5 2 5 5v25c0 8-5 15-15 15H50c-8 0-15-5-15-15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    {/* Nails on fingers */}
    <ellipse cx="45" cy="55" rx="4" ry="6" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="1" />
    <ellipse cx="60" cy="50" rx="4" ry="6" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="1" />
    <ellipse cx="70" cy="45" rx="4" ry="6" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="1" />
    <ellipse cx="80" cy="50" rx="4" ry="6" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="1" />
    {/* Checkmark */}
    <circle cx="90" cy="30" r="12" stroke="currentColor" strokeWidth="2" />
    <path d="M84 30l4 4 8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const steps = [
  {
    title: "Browse & Order",
    description: "Choose any set you love from our collection",
    icon: <BrowseIcon />,
  },
  {
    title: "Get Your Sizing Kit",
    description: "We send you a free sizing kit in the mail",
    icon: <KitIcon />,
  },
  {
    title: "Submit & Ship",
    description: "Submit your sizes online and we ship your custom-fit set",
    icon: <ShipIcon />,
  },
];

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

      {/* Mobile/Tablet Carousel (< 1024px) */}
      <div className="lg:hidden">
        <div className="relative">
          {/* Carousel Container */}
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className="flex-none pl-6 first:pl-6"
                  style={{ width: "80%" }}
                >
                  <div className="bg-primary/5 rounded-2xl p-8 text-center">
                    {/* Illustration */}
                    <div className="w-28 h-28 mx-auto mb-6 text-primary">
                      {step.icon}
                    </div>
                    {/* Step Number */}
                    <span className="inline-block w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-semibold leading-8 mb-4">
                      {index + 1}
                    </span>
                    {/* Heading */}
                    <h3 className="font-display text-xl font-medium mb-2">
                      {step.title}
                    </h3>
                    {/* Description */}
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Arrow Navigation */}
          <button
            onClick={scrollPrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/90 backdrop-blur-sm shadow-lg flex items-center justify-center transition-all hover:bg-background z-10"
            aria-label="Previous step"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={scrollNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/90 backdrop-blur-sm shadow-lg flex items-center justify-center transition-all hover:bg-background z-10"
            aria-label="Next step"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Dot Indicators */}
        <div className="flex justify-center gap-2 mt-6">
          {steps.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === selectedIndex
                  ? "bg-primary w-6"
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
              aria-label={`Go to step ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Desktop Grid (≥ 1024px) */}
      <div className="hidden lg:block">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 gap-8 lg:gap-16 max-w-5xl mx-auto">
            {steps.map((step, index) => (
              <div key={index} className="text-center group">
                {/* Illustration */}
                <div className="w-32 h-32 mx-auto mb-6 text-primary/70 group-hover:text-primary transition-colors duration-300">
                  {step.icon}
                </div>
                {/* Step Number */}
                <span className="inline-block w-10 h-10 rounded-full bg-primary text-primary-foreground font-semibold leading-10 mb-4 group-hover:scale-110 transition-transform duration-300">
                  {index + 1}
                </span>
                {/* Heading */}
                <h3 className="font-display text-2xl font-medium mb-3">
                  {step.title}
                </h3>
                {/* Description */}
                <p className="text-muted-foreground text-base max-w-xs mx-auto leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ThreeStepProcess;
