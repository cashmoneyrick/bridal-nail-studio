import { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const steps = [
  {
    number: "01",
    title: "Choose Your Look",
    description:
      "Browse our curated collections or bring your vision to life in the Custom Studio.",
    image: "/images/how-it-works/step-1-order.jpg",
  },
  {
    number: "02",
    title: "Your Sizing Kit Arrives",
    description:
      "A complimentary fit kit ships to your door — no guesswork, just precision.",
    image: "/images/how-it-works/step-2-sizing-kit.jpg",
  },
  {
    number: "03",
    title: "Find Your Perfect Fit",
    description:
      "Five minutes, ten fingers. Match each nail and send us your sizes.",
    image: "/images/how-it-works/step-3-find-size.jpg",
  },
  {
    number: "04",
    title: "Handcrafted for You",
    description:
      "Your set is shaped, painted, and finished entirely by hand — ready in 5–7 days.",
    image: "/images/how-it-works/step-4-submit.jpg",
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
        <div className="mb-10 sm:mb-14">
          <p className="text-[10px] font-semibold tracking-[0.35em] uppercase text-muted-foreground/40 mb-3">
            How It Works
          </p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium leading-[1.1]">
            <span className="italic font-light text-foreground/60">Four</span>{" "}
            Simple Steps
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mt-3 max-w-md">
            From first click to your doorstep — here's how we bring your
            perfect set to life.
          </p>
        </div>

        {/* Desktop: 4-column grid */}
        <div className="hidden lg:grid lg:grid-cols-4 lg:gap-5">
          {steps.map((step, i) => (
            <div
              key={i}
              className="group relative overflow-hidden rounded-2xl aspect-[3/5]"
            >
              <img
                src={step.image}
                alt={step.title}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute top-5 left-5 z-10">
                <span className="text-white/50 text-xs font-semibold tracking-[0.2em] uppercase">
                  Step {step.number}
                </span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 z-10 transition-transform duration-500 group-hover:-translate-y-1">
                <h3 className="font-display text-xl font-medium text-white leading-snug mb-1.5">
                  {step.title}
                </h3>
                <p className="text-white/70 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
              <div className="absolute inset-0 rounded-2xl border-2 border-white/0 group-hover:border-white/10 transition-colors duration-500" />
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
                className="flex-[0_0_78%] sm:flex-[0_0_60%] min-w-0 mr-3 last:mr-0"
              >
                <div className="relative overflow-hidden rounded-2xl aspect-[3/4]">
                  <img
                    src={step.image}
                    alt={step.title}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
                  <div className="absolute top-4 left-4 z-10">
                    <span className="text-white/50 text-xs font-semibold tracking-[0.2em] uppercase">
                      Step {step.number}
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
                    <h3 className="font-display text-lg font-medium text-white leading-snug mb-1">
                      {step.title}
                    </h3>
                    <p className="text-white/70 text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
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
