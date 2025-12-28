import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import heroMobileImage from "@/assets/hero-mobile.jpeg";
import heroDesktopImage from "@/assets/hero-desktop.jpeg";
const HeroSection = () => {
  const isMobile = useIsMobile();
  const scrollToShop = () => {
    document.getElementById('shop')?.scrollIntoView({
      behavior: 'smooth'
    });
  };
  return <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image Placeholder */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-gradient-to-br from-secondary/40 via-background to-primary/20" />
        {/* Placeholder for bridal collection image */}
        <div className="absolute inset-0 bg-cover bg-center opacity-60" style={{
        backgroundImage: isMobile ? `url(${heroMobileImage})` : `url(${heroDesktopImage})`
      }} />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8 animate-fade-in-up">
          {/* Valentine's Announcement */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 backdrop-blur-sm border border-primary/20 rounded-full animate-fade-in">
            <span className="text-xs sm:text-sm font-medium tracking-wider uppercase text-primary">
              Valentine's Collection 2025
              ❤️ Valentine's Collection 2025
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium leading-tight text-balance">
            Love Letters
            <span className="block italic text-primary">On Your Fingertips</span>
          </h1>

          {/* Subheadline */}
          <p className="text-base sm:text-lg md:text-xl text-foreground/70 max-w-xl mx-auto font-light leading-relaxed">
            Celebrate romance with our handcrafted Valentine's press-on nails. 
            Hearts, roses, and love notes—designed to make every moment magical.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button className="btn-primary text-base min-w-[200px] group" size="lg" onClick={scrollToShop}>
              Shop Valentine's Sets
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Link to="/custom-studio">
              <Button variant="outline" className="btn-secondary text-base min-w-[200px]" size="lg">
                Design Your Love Story
              </Button>
            </Link>
          </div>

          {/* Valentine's Day Badge */}
          <div className="pt-6 animate-fade-in">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 backdrop-blur-sm border border-primary/20 rounded-full text-sm text-foreground/80">
              
              <span>★★★★★ Loved by 2,000+ happy customers      </span>
              
            </span>
          </div>

          {/* Trust Badge */}
          <div className="pt-4 sm:pt-6">
            
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-foreground/30 rounded-full flex justify-center pt-2">
          <div className="w-1 h-2 bg-foreground/50 rounded-full" />
        </div>
      </div>
    </section>;
};
export default HeroSection;