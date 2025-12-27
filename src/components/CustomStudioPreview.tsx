import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, Sparkles } from "lucide-react";

const features = [
  "Upload your inspiration photos",
  "Choose your perfect shape & length",
  "Select finishes & embellishments",
  "Save your designs for later",
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
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Floating Card */}
            <div className="absolute -bottom-4 -right-4 sm:bottom-6 sm:right-6 bg-card p-3 sm:p-4 rounded-xl shadow-md max-w-[160px] sm:max-w-[180px] animate-fade-in">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-primary flex-shrink-0" />
                <div>
                  <p className="font-display font-medium text-xs">Custom Orders</p>
                  <p className="text-[10px] text-muted-foreground">48-72hr turnaround</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content Side */}
          <div className="order-1 lg:order-2 space-y-6 sm:space-y-8">
            <div>
              <div className="w-12 h-0.5 bg-primary mb-4" />
              <p className="text-sm font-medium tracking-[0.2em] uppercase text-primary mb-3">
                Custom Studio
              </p>
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-medium leading-tight mb-4">
                Design Your Dream Set
              </h2>
              <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
                Can't find exactly what you're looking for? Our Custom Studio lets you 
                bring your nail vision to life. Work with our artists to create a 
                one-of-a-kind set that's uniquely yours.
              </p>
            </div>

            {/* Feature List */}
            <ul className="space-y-6">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center space-x-4">
                  <Check className="w-5 h-5 text-primary flex-shrink-0" strokeWidth={2.5} />
                  <span className="text-foreground/80">{feature}</span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <div className="pt-4">
              <Link to="/custom-studio">
                <Button className="btn-primary text-base" size="lg">
                  Start Designing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomStudioPreview;