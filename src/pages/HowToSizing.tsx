import { useState } from "react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";
import { Gift, Lightbulb, ArrowRight, Check, Ruler, HelpCircle, Sparkles } from "lucide-react";

const shapes = [
  { id: "square", name: "Square" },
  { id: "oval", name: "Oval" },
  { id: "almond", name: "Almond" },
  { id: "coffin", name: "Coffin" },
  { id: "stiletto", name: "Stiletto" },
];

const sizingTips = [
  "When in doubt, size up — you can always file down, but you can't add width",
  "Measure at the widest part of your natural nail",
  "If you're between sizes, choose the larger one for comfort",
  "Your dominant hand may have slightly different sizes",
];

const sizingSteps = [
  {
    step: 1,
    title: "Lay Out Your Sizing Nails",
    description: "Your kit includes numbered nails from 0 (largest) to 9 (smallest). Lay them out in order for easy reference.",
  },
  {
    step: 2,
    title: "Try Each Size",
    description: "Press each sizing nail onto your natural nail. It should fit from sidewall to sidewall without pressing into your skin or leaving gaps.",
  },
  {
    step: 3,
    title: "Record Your Sizes",
    description: "Write down the number that fits each finger — thumb through pinky, both hands. Each finger may be a different size!",
  },
  {
    step: 4,
    title: "Save to Your Account",
    description: "Once you know your sizes, save them to your Perfect Fit Profile for faster ordering.",
    hasAction: true,
  },
];

const HowToSizing = () => {
  const [selectedShape, setSelectedShape] = useState<string | null>(null);
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    if (!selectedShape) return;

    const shapeName = shapes.find((s) => s.id === selectedShape)?.name || selectedShape;

    const sizingKitProduct = {
      id: `sizing-kit-${selectedShape}`,
      handle: `sizing-kit-${selectedShape}`,
      title: `Sizing Kit - ${shapeName}`,
      description: "Find your perfect nail size with our sizing kit.",
      price: 5.00,
      currencyCode: "USD",
      images: [],
      variants: [
        {
          id: `sizing-kit-variant-${selectedShape}`,
          title: shapeName,
          price: 5.00,
          currencyCode: "USD",
          availableForSale: true,
          selectedOptions: [{ name: "Shape", value: shapeName }],
        },
      ],
      options: [{ name: "Shape", values: [shapeName] }],
    };

    addItem({
      product: sizingKitProduct,
      variantId: `sizing-kit-variant-${selectedShape}`,
      variantTitle: shapeName,
      price: { amount: "5.00", currencyCode: "USD" },
      quantity: 1,
      selectedOptions: [{ name: "Shape", value: shapeName }],
    });

    toast.success(`Sizing Kit (${shapeName}) added to cart!`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground mb-6">
              Find Your Perfect Fit
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl mb-10">
              The right size makes all the difference. Here's how to find yours.
            </p>
            
            {/* Hero Image Placeholder */}
            <div className="aspect-[16/9] bg-muted/30 rounded-lg mx-auto max-w-2xl" />
          </div>
        </div>
      </section>

      {/* Info Callouts */}
      <section className="pb-8">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="bg-primary/5 rounded-xl p-6 md:p-8 flex gap-4 items-start">
              <Gift className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-foreground">
                <span className="font-medium">Good news!</span> Your first set includes a free sizing kit in the shape you order.
              </p>
            </div>
            
            <div className="bg-muted/20 border border-border/50 rounded-xl p-6 md:p-8 flex gap-4 items-start">
              <Lightbulb className="w-6 h-6 text-muted-foreground flex-shrink-0 mt-0.5" />
              <p className="text-muted-foreground">
                Ordering a new shape you haven't tried before? You may want to grab a sizing kit for that shape to ensure the perfect fit.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sizing Kit Purchase Section */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">
                Need a Sizing Kit?
              </h2>
              <p className="text-muted-foreground text-lg">
                Select your shape and add to cart — $5
              </p>
            </div>

            {/* Shape Selector */}
            <div className="flex gap-4 overflow-x-auto pb-4 md:pb-0 md:grid md:grid-cols-5 md:gap-6 mb-8 scrollbar-hide">
              {shapes.map((shape) => (
                <button
                  key={shape.id}
                  onClick={() => setSelectedShape(shape.id)}
                  className={`flex-shrink-0 w-28 md:w-auto group transition-all duration-200 ${
                    selectedShape === shape.id
                      ? "scale-[1.02]"
                      : "hover:scale-[1.01]"
                  }`}
                >
                  <div
                    className={`aspect-square rounded-lg mb-3 transition-all duration-200 ${
                      selectedShape === shape.id
                        ? "bg-primary/10 border-2 border-primary"
                        : "bg-muted/30 border-2 border-transparent group-hover:border-border"
                    }`}
                  />
                  <p
                    className={`text-sm text-center transition-colors ${
                      selectedShape === shape.id
                        ? "text-foreground font-medium"
                        : "text-muted-foreground"
                    }`}
                  >
                    {shape.name}
                  </p>
                </button>
              ))}
            </div>

            {/* Add to Cart Button */}
            <div className="text-center">
              <Button
                size="lg"
                onClick={handleAddToCart}
                disabled={!selectedShape}
                className="px-8"
              >
                Add Sizing Kit — $5
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How to Use Your Kit Section */}
      <section className="py-24 md:py-32 bg-secondary/10">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">
                How to Use Your Sizing Kit
              </h2>
              <p className="text-muted-foreground text-lg">
                Once your kit arrives, follow these steps:
              </p>
            </div>

            <div className="space-y-16 md:space-y-20">
              {sizingSteps.map((item, index) => (
                <div 
                  key={item.step} 
                  className="grid md:grid-cols-2 gap-8 items-center"
                >
                  <div 
                    className={`aspect-[4/3] bg-muted/30 rounded-lg ${
                      index % 2 === 0 ? "order-1" : "order-1 md:order-2"
                    }`} 
                  />
                  <div className={index % 2 === 0 ? "order-2" : "order-2 md:order-1"}>
                    <span className="text-sm text-muted-foreground uppercase tracking-wider mb-2 block">
                      Step {item.step}
                    </span>
                    <h3 className="font-serif text-2xl text-foreground mb-4">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      {item.description}
                    </p>
                    {item.hasAction && (
                      <Button asChild variant="outline" className="group">
                        <Link to="/account/perfect-fit">
                          Save My Sizes
                          <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pro Tips Section */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 mb-4">
                <Ruler className="w-5 h-5 text-primary" />
                <span className="text-sm uppercase tracking-wider text-muted-foreground">Pro Tips</span>
              </div>
              <h2 className="font-serif text-3xl md:text-4xl text-foreground">
                Sizing Tips to Remember
              </h2>
            </div>

            <div className="grid gap-4">
              {sizingTips.map((tip, index) => (
                <div 
                  key={index}
                  className="flex items-start gap-4 bg-secondary/10 rounded-lg p-5"
                >
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-primary" />
                  </div>
                  <p className="text-foreground">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Still Unsure Callout */}
      <section className="pb-20 md:pb-28">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <div className="bg-primary/5 rounded-2xl p-8 md:p-12 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-6">
                <HelpCircle className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-serif text-2xl md:text-3xl text-foreground mb-4">
                Still Unsure?
              </h3>
              <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                If you're between sizes or have any questions about fit, our team is here to help. 
                We'll make sure you get the perfect match.
              </p>
              <Button asChild variant="outline">
                <Link to="/contact">
                  Contact Us
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Perfect Fit Promise */}
      <section className="pb-20 md:pb-28">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <div className="bg-secondary/20 rounded-2xl p-8 md:p-12 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-6">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-serif text-2xl md:text-3xl text-foreground mb-4">
                Our Perfect Fit Promise
              </h3>
              <p className="text-muted-foreground max-w-lg mx-auto">
                Once you save your sizes to your account, we'll automatically customize every set you order. 
                No more guessing — just perfect nails, every time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* End of Page CTA */}
      <section className="pb-24 md:pb-32">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-8">
              Ready to shop?
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="outline" size="lg">
                <Link to="/how-to">Back to How To</Link>
              </Button>
              <Button asChild size="lg">
                <Link to="/shop">Browse All Sets</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HowToSizing;
