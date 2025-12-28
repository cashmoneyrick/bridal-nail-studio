import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Upload, Shapes, Sparkles, Heart } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import customStudioDesktop from "@/assets/custom-studio-desktop.jpeg";
import customStudioMobile from "@/assets/custom-studio-mobile.jpeg";

const features = [
  { icon: Upload, label: "Upload\nInspo" },
  { icon: Shapes, label: "Pick\nShape" },
  { icon: Sparkles, label: "Add\nEffects" },
  { icon: Heart, label: "Save\nDesigns" },
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

          {/* Timeline Steps */}
          <div className="relative flex items-start justify-center gap-6 sm:gap-10 md:gap-14 pt-6">
            {/* Connecting Line - positioned behind circles */}
            <div 
              className="absolute top-[52px] left-1/2 -translate-x-1/2 h-0.5 bg-[hsl(30,40%,85%)]"
              style={{ width: 'calc(100% - 80px)', maxWidth: '400px' }}
            />
            
            {features.map((feature, index) => (
              <div key={index} className="relative flex flex-col items-center gap-3 z-10">
                {/* Number Badge */}
                <div className="w-7 h-7 rounded-full bg-[hsl(0,45%,75%)] flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">{index + 1}</span>
                </div>
                
                {/* Icon Circle */}
                <div className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-full bg-[hsl(30,50%,92%)] border-2 border-[hsl(40,50%,70%)] flex items-center justify-center shadow-sm">
                  <feature.icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-[hsl(0,45%,70%)]" />
                </div>
                
                {/* Label */}
                <span className="text-white text-xs sm:text-sm font-medium text-center whitespace-pre-line leading-tight">
                  {feature.label}
                </span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="pt-4">
            <Link to="/custom-studio">
              <Button 
                className="bg-[hsl(30,30%,95%)] text-[hsl(0,45%,60%)] hover:bg-[hsl(30,30%,90%)] rounded-full px-8 font-medium border border-[hsl(30,20%,85%)]"
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
