import { useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";

const categories = [
  {
    title: "French Modern",
    description: "Contemporary takes on the classic French tip",
    image: "",
    href: "/shop?collection=french-modern",
    isLimited: false,
  },
  {
    title: "Golden Hour",
    description: "Warm, sun-kissed tones for a radiant glow",
    image: "",
    href: "/shop?collection=golden-hour",
    isLimited: false,
  },
  {
    title: "The Gallery",
    description: "Artistic statement pieces for the bold",
    image: "",
    href: "/shop?collection=the-gallery",
    isLimited: false,
  },
  {
    title: "Dark Romance",
    description: "Moody, sultry shades with an edge",
    image: "",
    href: "/shop?collection=dark-romance",
    isLimited: false,
  },
  {
    title: "Liquid Chrome",
    description: "Metallic mirror finishes that captivate",
    image: "",
    href: "/shop?collection=liquid-chrome",
    isLimited: false,
  },
  {
    title: "In Bloom",
    description: "Delicate florals and garden-inspired art",
    image: "",
    href: "/shop?collection=in-bloom",
    isLimited: false,
  },
  {
    title: "The Basics",
    description: "Timeless essentials for everyday elegance",
    image: "",
    href: "/shop?collection=the-basics",
    isLimited: false,
  },
  {
    title: "All The Extras",
    description: "Charms, gems, and embellishments galore",
    image: "",
    href: "/shop?collection=all-the-extras",
    isLimited: false,
  },
  {
    title: "Pop Of Color",
    description: "Bold, vibrant hues that make a statement",
    image: "",
    href: "/shop?collection=pop-of-color",
    isLimited: false,
  },
  {
    title: "Valentines Collection",
    description: "Limited edition - Love-inspired designs",
    image: "",
    href: "/shop?collection=valentines",
    isLimited: true,
  },
];

// Duplicate for smooth infinite looping
const extendedCategories = [...categories, ...categories];

const CategoryGrid = () => {
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
    <section className="pt-16 sm:pt-20 pb-4 sm:pb-6 bg-background">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-medium mb-4">
            Explore Our Collections
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
            From minimalist chic to daring artistry, find nails that match your unique style
          </p>
        </div>

        {/* Auto-scrolling Carousel */}
        <div className="relative px-4 md:px-16">
          {/* Left fade gradient */}
          <div className="absolute left-0 top-0 bottom-0 w-12 md:w-20 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />

          <div className="overflow-hidden" ref={emblaRef}>
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
                    {/* Image or Placeholder */}
                    {category.image ? (
                      <img
                        src={category.image}
                        alt={category.title}
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-muted via-muted/80 to-muted/60 flex items-center justify-center">
                        <div className="absolute inset-4 border-2 border-dashed border-border/40 rounded-xl flex items-center justify-center">
                          <span className="text-muted-foreground/60 text-sm font-medium">Add Image</span>
                        </div>
                      </div>
                    )}

                    {/* Limited Badge */}
                    {category.isLimited && (
                      <div className="absolute top-4 right-4 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full z-20">
                        Limited
                      </div>
                    )}

                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent" />

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

          {/* Right fade gradient */}
          <div className="absolute right-0 top-0 bottom-0 w-12 md:w-20 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

          {/* Navigation arrows */}
          <button
            onClick={scrollPrev}
            className="absolute left-0 md:-left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full border border-border/60 bg-background/80 backdrop-blur-sm hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 flex items-center justify-center z-20"
            aria-label="Previous collection"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={scrollNext}
            className="absolute right-0 md:-right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full border border-border/60 bg-background/80 backdrop-blur-sm hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 flex items-center justify-center z-20"
            aria-label="Next collection"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
