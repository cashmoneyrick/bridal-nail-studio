import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Upload, Shapes, Sparkles, Heart } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import customStudioDesktop from "@/assets/custom-studio-desktop.jpeg";
import customStudioMobile from "@/assets/custom-studio-mobile.jpeg";

const features = [
  { icon: Upload, label: "Upload Inspo" },
  { icon: Shapes, label: "Pick Shape" },
  { icon: Sparkles, label: "Add Effects" },
  { icon: Heart, label: "Save Designs" },
];

const CustomStudioPreview = () => {
  const isMobile = useIsMobile();
  
  return (
    <section className="relative w-full py-24 sm:py-32 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={isMobile ? customStudioMobile : customStudioDesktop}
          alt="Custom nail design process"
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
      </div>

      {/* Centered Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-6 sm:space-y-8">
          {/* Decorative Line */}
          <div className="w-12 h-0.5 bg-primary mx-auto" />

          {/* Label */}
          <p className="text-sm font-medium tracking-[0.2em] uppercase text-primary">
            Custom Studio
          </p>

          {/* Headline */}
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-medium leading-tight text-white">
            Design Your Dream Set
          </h2>

          {/* Description */}
          <p className="text-white/80 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            Can't find exactly what you're looking for? Our Custom Studio lets you 
            bring your nail vision to life. Work with our artists to create a 
            one-of-a-kind set that's uniquely yours.
          </p>

          {/* Feature Pills */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20"
              >
                <feature.icon className="w-4 h-4 text-primary" />
                <span className="text-white text-sm font-medium">{feature.label}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="pt-4">
            <Link to="/custom-studio">
              <Button 
                className="bg-white text-primary hover:bg-white/90 rounded-full px-8 font-medium"
                size="lg"
              >
                Start Designing
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomStudioPreview;
