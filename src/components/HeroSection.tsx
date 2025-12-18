import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  const scrollToShop = () => {
    document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image Placeholder */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-gradient-to-br from-secondary/40 via-background to-primary/20" />
        {/* Placeholder for bridal collection image */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1604654894610-df63bc536371?w=1920&q=80')] bg-cover bg-center opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8 animate-fade-in-up">
          {/* Tagline */}
          <p className="text-sm sm:text-base font-medium tracking-[0.3em] uppercase text-foreground/70">
            Handcrafted Luxury Press-Ons
          </p>

          {/* Main Headline */}
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium leading-tight text-balance">
            Nails That Tell
            <span className="block italic text-primary">Your Story</span>
          </h1>

          {/* Subheadline */}
          <p className="text-base sm:text-lg md:text-xl text-foreground/70 max-w-xl mx-auto font-light leading-relaxed">
            Bespoke press-on nails designed for your most memorable moments. 
            From everyday elegance to bridal perfection.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button 
              className="btn-primary text-base min-w-[200px] group"
              size="lg"
              onClick={scrollToShop}
            >
              Shop Collection
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Link to="/custom">
              <Button 
                variant="outline"
                className="btn-secondary text-base min-w-[200px]"
                size="lg"
              >
                Create Custom Set
              </Button>
            </Link>
          </div>

          {/* Trust Badge */}
          <div className="pt-8 sm:pt-12">
            <p className="text-xs sm:text-sm text-foreground/50 tracking-wide">
              ★★★★★ Loved by 2,000+ happy customers
            </p>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-foreground/30 rounded-full flex justify-center pt-2">
          <div className="w-1 h-2 bg-foreground/50 rounded-full" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;