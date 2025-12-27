import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

const categories = [
  {
    title: "Everyday Elegance",
    description: "Subtle sophistication for daily wear",
    image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=80",
    href: "/shop/everyday",
  },
  {
    title: "Special Occasions",
    description: "Statement sets for your biggest moments",
    image: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=600&q=80",
    href: "/shop/occasions",
  },
  {
    title: "Artistic Designs",
    description: "Bold, creative expressions of nail art",
    image: "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=600&q=80",
    href: "/shop/artistic",
  },
];

// Duplicate for smooth infinite looping
const extendedCategories = [...categories, ...categories];

const CategoryGrid = () => {
  return (
    <section className="section-padding bg-background">
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

        {/* Center-Focused Carousel */}
        <div className="relative px-4 md:px-16">
          <Carousel
            opts={{
              align: "center",
              loop: true,
            }}
            className="w-full"
          >
            {/* Left fade gradient */}
            <div className="absolute left-0 top-0 bottom-0 w-12 md:w-20 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
            
            <CarouselContent className="-ml-4 md:-ml-6">
              {extendedCategories.map((category, index) => (
                <CarouselItem 
                  key={index} 
                  className="pl-4 md:pl-6 basis-4/5 md:basis-[28%]"
                >
                  <a 
                    href={category.href} 
                    className="group block relative overflow-hidden rounded-2xl aspect-[3/4] cursor-pointer"
                  >
                    {/* Image */}
                    <img 
                      src={category.image} 
                      alt={category.title}
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                    
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
                </CarouselItem>
              ))}
            </CarouselContent>
            
            {/* Right fade gradient */}
            <div className="absolute right-0 top-0 bottom-0 w-12 md:w-20 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
            
            {/* Navigation arrows - positioned outside on desktop */}
            <CarouselPrevious 
              className="left-0 md:-left-4 h-10 w-10 border-border/60 bg-background/80 backdrop-blur-sm hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300"
            />
            <CarouselNext 
              className="right-0 md:-right-4 h-10 w-10 border-border/60 bg-background/80 backdrop-blur-sm hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300"
            />
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
