import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import heroMobileImage from "@/assets/hero-mobile.jpeg";
import heroDesktopImage from "@/assets/hero-desktop.jpeg";
const HeroSection = () => {
  const isMobile = useIsMobile();
  const scrollToShop = () => {
    document.getElementById('collections')?.scrollIntoView({
      behavior: 'smooth'
    });
  };
  return <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with botanical color wash + parallax */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-gradient-to-br from-secondary/30 via-background to-primary/20" />
        <div
          className="absolute inset-0 bg-cover bg-center opacity-100"
          style={{
            backgroundImage: isMobile ? `url(${heroMobileImage})` : `url(${heroDesktopImage})`,
            backgroundAttachment: isMobile ? 'scroll' : 'fixed',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background/30 to-secondary/10" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8 relative">
          {/* Heart-shaped gradient glow for text readability */}
          <svg
            className="absolute pointer-events-none"
            style={{
              left: isMobile ? '-45%' : '-35%',
              top: isMobile ? '-15%' : '-25%',
              width: isMobile ? '190%' : '170%',
              height: isMobile ? '140%' : '170%',
              zIndex: -1,
            }}
            viewBox="0 0 400 400"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <radialGradient id="heartRadial" cx="50%" cy="42%" r="52%">
                <stop offset="0%"  stopColor="#D4A0B0" stopOpacity="0.95" />
                <stop offset="40%" stopColor="#D4A0B0" stopOpacity="0.8" />
                <stop offset="75%" stopColor="#D4A0B0" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#D4A0B0" stopOpacity="0" />
              </radialGradient>
              <filter id="heartBlur" x="-10%" y="-10%" width="120%" height="120%">
                <feGaussianBlur stdDeviation="3" />
              </filter>
            </defs>
            <path
              d="M200,340 C200,340 30,220 30,110 C30,55 75,15 130,40 C158,53 180,72 200,92 C220,72 242,53 270,40 C325,15 370,55 370,110 C370,220 200,340 200,340 Z"
              fill="url(#heartRadial)"
              filter="url(#heartBlur)"
            />
          </svg>

          {/* Spring Announcement — stagger 1 */}
          <div className="animate-stagger-1 relative inline-flex items-center px-5 py-2 rounded-full overflow-hidden">
            <div className="absolute inset-0 bg-primary/10 backdrop-blur-sm" />
            <div className="absolute inset-0 border border-primary/20 rounded-full" />
            <span className="relative text-sm font-semibold tracking-widest uppercase text-primary/90">
              Spring Collection 2026
            </span>
          </div>

          {/* Main Headline — stagger 2 */}
          <h1 className="animate-stagger-2 font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium leading-tight text-balance">
            Fresh Blooms
            <span className="block italic text-primary">At Your Fingertips</span>
          </h1>

          {/* Subheadline — stagger 3 */}
          <div className="animate-stagger-3 max-w-2xl mx-auto">
            <p className="text-base sm:text-lg lg:text-xl text-foreground/85 font-light leading-relaxed">
              Welcome the season with our{" "}
              <span className="font-medium text-foreground/95">handcrafted</span> spring press-on nails.
              Florals, pastels, and botanical details—designed to make every moment{" "}
              <span className="italic text-primary/80 font-medium">bloom</span>.
            </p>
          </div>

          {/* CTA — stagger 4 */}
          <div className="animate-stagger-4 flex flex-col items-center gap-4 pt-4">
            <Button
              className="relative bg-primary text-primary-foreground hover:bg-primary/95 h-12 px-10 text-base font-semibold tracking-wide rounded-full min-w-[200px] sm:min-w-[240px] group overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95"
              size="lg"
              onClick={scrollToShop}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-secondary/0 via-secondary/20 to-secondary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="relative flex items-center justify-center gap-3">
                Shop Spring Sets
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </Button>
            <Link
              to="/custom-studio"
              className="group text-sm font-medium text-foreground/50 hover:text-foreground/80 transition-colors duration-300"
            >
              <span className="relative">
                or design your own
                <span className="absolute bottom-0 left-0 w-0 h-px bg-foreground/40 group-hover:w-full transition-all duration-300" />
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <button
        onClick={scrollToShop}
        className="absolute bottom-8 sm:bottom-10 left-1/2 -translate-x-1/2 animate-bounce cursor-pointer hover:opacity-80 transition-opacity"
        aria-label="Scroll to next section"
        type="button"
      >
        <div className="w-6 h-10 border-2 border-foreground/20 rounded-full flex justify-center pt-2">
          <div className="w-1 h-2 bg-foreground/40 rounded-full" />
        </div>
      </button>
    </section>;
};
export default HeroSection;
