import { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const steps = [
  {
    title: "Pick Your Set",
    description: "Browse collections or start a custom design.",
    bg: "bg-accent/30",
  },
  {
    title: "Get Your Sizing Kit",
    description: "Free with any set — find your perfect fit.",
    bg: "bg-secondary/20",
  },
  {
    title: "Send Your Sizes",
    description: "Match each finger in about 5 minutes.",
    bg: "bg-primary/10",
  },
  {
    title: "We Handcraft It",
    description: "Shaped, painted & finished by hand in 5–7 days.",
    bg: "bg-accent/20",
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
      className="py-12 sm:py-16 lg:py-20 bg-background reveal"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 sm:mb-10">
          <p className="text-[10px] font-semibold tracking-[0.35em] uppercase text-muted-foreground/40 mb-3">
            How It Works
          </p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium leading-[1.1]">
            <span className="italic font-light text-foreground/60">Four</span>{" "}
            Simple Steps
          </h2>
        </div>

        {/* Desktop: 4-column grid */}
        <div className="hidden lg:grid lg:grid-cols-4 lg:gap-6">
          {steps.map((step, i) => (
            <div key={i} className="group">
              <div className={`rounded-2xl aspect-[4/3] mb-3 ${step.bg}`} />
              <h3 className="font-display text-base font-medium leading-snug mb-1">
                {step.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile: carousel */}
      <div className="lg:hidden">
        <div className="overflow-hidden pl-4 sm:pl-6" ref={emblaRef}>
          <div className="flex">
            {steps.map((step, i) => (
              <div
                key={i}
                className="flex-[0_0_75%] min-w-0 mr-3 last:mr-0"
              >
                <div className={`rounded-2xl aspect-[4/3] mb-3 ${step.bg}`} />
                <h3 className="font-display text-lg font-medium leading-snug mb-1">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed pr-4">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Dots */}
        <div className="flex items-center justify-center gap-2 mt-5">
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
      </div>
    </section>
  );
};

export default ThreeStepProcess;
