import { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const steps = [
  {
    number: "01",
    title: "Choose Your Set",
    description:
      "Browse our curated collections or start a custom design in the studio. Pick your shape, length, and style.",
    src: "https://placehold.co/300x400/e8e4df/a0998f?text=Step+1",
    alt: "Step 1: Choose your nail set",
  },
  {
    number: "02",
    title: "Get Your Sizing Kit",
    description:
      "We'll send you a free sizing kit with your first order. Try each size on, find your fit — no guesswork.",
    src: "https://placehold.co/300x400/e8e4df/a0998f?text=Step+2",
    alt: "Step 2: Receive your sizing kit",
  },
  {
    number: "03",
    title: "Find Your Size",
    description:
      "Match each finger to the sizing guide — it takes about 5 minutes. A good fit means they stay on longer and look better.",
    src: "https://placehold.co/300x400/e8e4df/a0998f?text=Step+3",
    alt: "Step 3: Find your perfect size",
  },
  {
    number: "04",
    title: "Submit & We Create",
    description:
      "Send us your sizes and we'll handcraft your set in 5–7 days. Every nail is shaped, painted, and finished by hand.",
    src: "https://placehold.co/300x400/e8e4df/a0998f?text=Step+4",
    alt: "Step 4: Submit your order",
  },
];

const ThreeStepProcess = () => {
  const sectionRef = useScrollReveal();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: "start" });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollTo = useCallback(
    (i: number) => emblaApi?.scrollTo(i),
    [emblaApi]
  );

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  return (
    <section
      ref={sectionRef}
      className="py-20 sm:py-28 lg:py-32 bg-background reveal"
    >
      {/* Header — inside container */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 sm:mb-12">
          {/* Rule-flanked eyebrow */}
          <div className="flex items-center gap-5 mb-8">
            <div className="flex-1 h-px bg-border/40" />
            <p className="text-[10px] font-semibold tracking-[0.35em] uppercase text-muted-foreground/50 shrink-0">
              How It Works
            </p>
            <div className="flex-1 h-px bg-border/40" />
          </div>
          {/* Heading split + right descriptor */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 sm:gap-12">
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-medium leading-[1.05] shrink-0">
              <span className="italic font-light text-foreground/60">Four</span>{" "}
              Simple Steps
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base sm:text-right sm:max-w-[220px] sm:pb-1 leading-relaxed">
              From first look to perfect fit — we guide you every step of the way
            </p>
          </div>
        </div>

        {/* Desktop: 4-column static grid */}
        <div className="hidden lg:grid lg:grid-cols-4 lg:gap-8">
          {steps.map((step) => (
            <div key={step.number} className="group">
              <div className="relative overflow-hidden rounded-2xl aspect-[3/4] mb-4">
                <img
                  src={step.src}
                  alt={step.alt}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
                <div className="absolute top-3 left-3 w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm">
                  <span className="text-[10px] font-semibold tracking-wide text-foreground">
                    {step.number}
                  </span>
                </div>
              </div>
              <h3 className="font-display text-lg font-medium leading-snug mb-1.5">
                {step.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile: swipeable carousel — outside container for peek effect */}
      <div className="lg:hidden">
        <div className="overflow-hidden pl-4 sm:pl-6" ref={emblaRef}>
          <div className="flex">
            {steps.map((step) => (
              <div
                key={step.number}
                className="flex-[0_0_82%] min-w-0 mr-4 last:mr-0"
              >
                <div className="relative overflow-hidden rounded-2xl aspect-[3/4] mb-4">
                  <img
                    src={step.src}
                    alt={step.alt}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm">
                    <span className="text-[10px] font-semibold tracking-wide text-foreground">
                      {step.number}
                    </span>
                  </div>
                </div>
                <h3 className="font-display text-xl font-medium leading-snug mb-2">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed pr-4">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              aria-label={`Go to step ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === selectedIndex
                  ? "w-6 bg-primary"
                  : "w-1.5 bg-muted-foreground/30"
              }`}
            />
          ))}
        </div>

        {/* Swipe hint */}
        <p className="text-center text-[10px] tracking-[0.2em] uppercase text-muted-foreground/40 mt-3">
          Swipe to explore
        </p>
      </div>
    </section>
  );
};

export default ThreeStepProcess;
