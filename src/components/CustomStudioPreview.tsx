import { Button } from "@/components/ui/button";
import { Check, Palette, Upload, Sparkles, Heart } from "lucide-react";

const features = [
  { icon: Upload, text: "Upload your inspiration photos" },
  { icon: Palette, text: "Choose your perfect shape & length" },
  { icon: Sparkles, text: "Select finishes & embellishments" },
  { icon: Heart, text: "Save your designs for later" },
];

const CustomStudioPreview = () => {
  return (
    <section className="section-padding bg-muted/50">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image Side */}
          <div className="relative order-2 lg:order-1">
            <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&q=80"
                alt="Custom nail design process"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Floating Card */}
            <div className="absolute -bottom-6 -right-6 sm:bottom-8 sm:right-8 bg-card p-4 sm:p-6 rounded-2xl shadow-xl max-w-[200px] sm:max-w-[240px] animate-fade-in">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-display font-medium text-sm">Custom Orders</p>
                  <p className="text-xs text-muted-foreground">48-72hr turnaround</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content Side */}
          <div className="order-1 lg:order-2 space-y-6 sm:space-y-8">
            <div>
              <p className="text-sm font-medium tracking-[0.2em] uppercase text-primary mb-3">
                Custom Studio
              </p>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-medium leading-tight mb-4">
                Design Your Dream Set
              </h2>
              <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
                Can't find exactly what you're looking for? Our Custom Studio lets you 
                bring your nail vision to life. Work with our artists to create a 
                one-of-a-kind set that's uniquely yours.
              </p>
            </div>

            {/* Feature List */}
            <ul className="space-y-4">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-foreground/80">{feature.text}</span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <div className="pt-4">
              <Button className="btn-primary text-base" size="lg">
                Start Designing
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomStudioPreview;