import { useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const categories = [
  {
    title: "French Modern",
    description: "Contemporary takes on the classic French tip",
    image: "",
    href: "/shop?collection=french-modern",
    isLimited: false,
    gradient: "from-[hsl(30,6%,92%)] via-[hsl(30,4%,88%)] to-[hsl(207,53%,79%)]",
  },
  {
    title: "Golden Hour",
    description: "Warm amber and honey tones",
    image: "",
    href: "/shop?collection=golden-hour",
    isLimited: false,
    gradient: "from-[hsl(40,50%,85%)] via-[hsl(35,40%,80%)] to-[hsl(30,6%,92%)]",
  },
  {
    title: "The Gallery",
    description: "Artistic statement pieces for the bold",
    image: "",
    href: "/shop?collection=the-gallery",
    isLimited: false,
    gradient: "from-[hsl(225,36%,72%)] via-[hsl(225,30%,82%)] to-[hsl(207,53%,79%)]",
  },
  {
    title: "Dark Romance",
    description: "Deep tones, matte finishes, dark florals",
    image: "",
    href: "/shop?collection=dark-romance",
    isLimited: false,
    gradient: "from-[hsl(130,15%,20%)] via-[hsl(130,10%,30%)] to-[hsl(125,12%,42%)]",
  },
  {
    title: "Liquid Chrome",
    description: "Mirror-finish chromes and metallic foils",
    image: "",
    href: "/shop?collection=liquid-chrome",
    isLimited: false,
    gradient: "from-[hsl(207,40%,60%)] via-[hsl(225,36%,72%)] to-[hsl(207,53%,85%)]",
  },
  {
    title: "In Bloom",
    description: "Hand-painted florals and botanical details",
    image: "",
    href: "/shop?collection=in-bloom",
    isLimited: false,
    gradient: "from-[hsl(125,9%,56%)] via-[hsl(130,12%,65%)] to-[hsl(30,6%,92%)]",
  },
  {
    title: "The Basics",
    description: "Clean solids and neutrals for every day",
    image: "",
    href: "/shop?collection=the-basics",
    isLimited: false,
    gradient: "from-[hsl(30,6%,94%)] via-[hsl(30,4%,90%)] to-[hsl(30,6%,86%)]",
  },
  {
    title: "All The Extras",
    description: "3D charms, gems, and custom embellishments",
    image: "",
    href: "/shop?collection=all-the-extras",
    isLimited: false,
    gradient: "from-[hsl(225,36%,72%)] via-[hsl(340,40%,80%)] to-[hsl(40,50%,85%)]",
  },
  {
    title: "Pop Of Color",
    description: "Saturated brights and color-block designs",
    image: "",
    href: "/shop?collection=pop-of-color",
    isLimited: false,
    gradient: "from-[hsl(340,50%,75%)] via-[hsl(225,36%,72%)] to-[hsl(125,9%,56%)]",
  },
  {
    title: "Spring Collection",
    description: "Pastels, soft florals, and garden greens",
    image: "",
    href: "/shop?collection=spring",
    isLimited: true,
    gradient: "from-[hsl(125,9%,56%)] via-[hsl(207,53%,79%)] to-[hsl(225,36%,80%)]",
  },
];

// Duplicate for smooth infinite looping
const extendedCategories = [...categories, ...categories];

const CategoryGrid = () => {
  const sectionRef = useScrollReveal();
  const resumeTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      align: "start",
      loop: true,
      dragFree: true,
    },
    [
      AutoScroll({
        direction: "backward",
        speed: 0.8,
        stopOnInteraction: false,
        stopOnMouseEnter: false,
        playOnInit: true,
      }),
    ]
  );

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    const autoScroll = emblaApi.plugins()?.autoScroll;
    if (!autoScroll) return;

    const onPointerDown = () => {
      if (resumeTimerRef.current) {
        clearTimeout(resumeTimerRef.current);
        resumeTimerRef.current = null;
      }
      autoScroll.stop();
    };

    const onPointerUp = () => {
      resumeTimerRef.current = setTimeout(() => {
        autoScroll.play();
      }, 2500);
    };

    emblaApi.on("pointerDown", onPointerDown);
    emblaApi.on("pointerUp", onPointerUp);

    return () => {
      emblaApi.off("pointerDown", onPointerDown);
      emblaApi.off("pointerUp", onPointerUp);
      if (resumeTimerRef.current) {
        clearTimeout(resumeTimerRef.current);
      }
    };
  }, [emblaApi]);

  return (
    <section ref={sectionRef} id="collections" className="relative py-20 sm:py-28 lg:py-32 bg-background reveal">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="mb-12 sm:mb-16 px-4 sm:px-0">
          {/* Rule-flanked eyebrow */}
          <div className="flex items-center gap-5 mb-8">
            <div className="flex-1 h-px bg-border/40" />
            <p className="text-[10px] font-semibold tracking-[0.35em] uppercase text-muted-foreground/50 shrink-0">
              Collections
            </p>
            <div className="flex-1 h-px bg-border/40" />
          </div>

          {/* Heading + descriptor — editorial split on desktop */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 sm:gap-12">
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-medium leading-[1.05] shrink-0">
              <span className="italic font-light text-foreground/60">Explore</span>{" "}
              Our Collections
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base sm:text-right sm:max-w-[220px] sm:pb-1 leading-relaxed">
              Curated collections for every style and occasion
            </p>
          </div>
        </div>
      </div>

      {/* Auto-scrolling Carousel — full viewport width */}
      <div className="relative">
        {/* Left fade gradient — scoped to carousel only */}
        <div className="absolute left-0 top-0 bottom-0 w-28 md:w-52 bg-gradient-to-r from-background via-background/80 to-transparent z-10 pointer-events-none" />
        {/* Right fade gradient */}
        <div className="absolute right-0 top-0 bottom-0 w-28 md:w-52 bg-gradient-to-l from-background via-background/80 to-transparent z-10 pointer-events-none" />

        <div className="overflow-hidden pl-4 md:pl-6" ref={emblaRef}>
            <div className="flex -ml-4 md:-ml-6">
              {extendedCategories.map((category, index) => (
                <div
                  key={index}
                  className="flex-none pl-4 md:pl-6"
                  style={{ width: "80%", maxWidth: "320px" }}
                >
                  <a
                    href={category.href}
                    className="group block relative overflow-hidden rounded-2xl aspect-[3/4] cursor-pointer"
                  >
                    {/* Image or Gradient Background */}
                    {category.image ? (
                      <img
                        src={category.image}
                        alt={category.title}
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} transition-transform duration-700 group-hover:scale-110`}>
                        {/* Subtle texture overlay */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.15),transparent_50%)]" />
                      </div>
                    )}

                    {/* Limited Badge */}
                    {category.isLimited && (
                      <div className="absolute top-4 right-4 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full z-20">
                        Limited
                      </div>
                    )}

                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />

                    {/* Content */}
                    <div className="absolute inset-0 flex flex-col justify-end p-6">
                      <h3 className="font-display text-xl md:text-2xl font-medium text-white mb-4">
                        {category.title}
                      </h3>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="w-fit bg-white/90 text-foreground hover:bg-white border-0"
                      >
                        Shop Collection
                      </Button>
                    </div>

                    {/* Hover border */}
                    <div className="absolute inset-0 border-2 border-white/0 group-hover:border-white/20 rounded-2xl transition-colors duration-300" />
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation arrows */}
          <button
            onClick={scrollPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full border border-border/60 bg-background/80 backdrop-blur-sm hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 flex items-center justify-center z-20"
            aria-label="Previous collection"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={scrollNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full border border-border/60 bg-background/80 backdrop-blur-sm hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 flex items-center justify-center z-20"
            aria-label="Next collection"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
    </section>
  );
};

export default CategoryGrid;
