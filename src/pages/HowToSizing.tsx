import { useState } from "react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";
import {
  Gift, Lightbulb, ArrowRight, Ruler, Package,
  ClipboardList, UserCheck, Hand, Wrench, ChevronRight,
} from "lucide-react";

const shapes = [
  { id: "square", name: "Square" },
  { id: "oval", name: "Oval" },
  { id: "almond", name: "Almond" },
  { id: "coffin", name: "Coffin" },
  { id: "stiletto", name: "Stiletto" },
];

// Styled icon panel for steps (hidden on mobile)
const StepPanel = ({ icon: Icon, label, stepNumber }: { icon: React.ElementType; label: string; stepNumber: string }) => (
  <div className="hidden md:flex aspect-[4/3] bg-gradient-to-br from-secondary/25 to-primary/8 rounded-xl border border-border/20 flex-col items-center justify-center gap-4 relative overflow-hidden">
    <span className="absolute text-[120px] font-serif font-bold text-primary/5 leading-none select-none pointer-events-none -translate-y-2">
      {stepNumber}
    </span>
    <Icon className="w-14 h-14 text-primary/40 relative z-10" />
    <span className="text-xs uppercase tracking-widest text-muted-foreground/60 font-medium relative z-10">{label}</span>
  </div>
);

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
      needsSizingKit: false,
      sizingOption: 'kit',
    });

    console.log(`Added sizing kit to cart: ${shapeName}`);
    toast.success(`Sizing Kit (${shapeName}) added to cart!`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-10 md:pt-40 md:pb-12">
        <div className="container mx-auto px-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-10">
            <Link to="/how-to" className="hover:text-foreground transition-colors">How To</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-foreground">Find Your Size</span>
          </nav>

          <div className="max-w-3xl mx-auto text-center">
            {/* Icon badge with halo ring */}
            <div className="flex justify-center mb-8">
              <div className="w-32 h-32 rounded-full bg-primary/5 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-secondary/50 to-secondary/15 border border-border/30 flex items-center justify-center shadow-sm">
                  <Ruler className="w-12 h-12 text-primary/70" />
                </div>
              </div>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground mb-6">
              I Don't Know My Size
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl">
              Finding your perfect fit is easy.
            </p>
          </div>
        </div>
      </section>

      {/* Table of Contents */}
      <section className="pb-10">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto">
            <div className="flex flex-wrap gap-2">
              {[
                { href: "#kit-purchase", label: "Get a Sizing Kit" },
                { href: "#step-1", label: "1. Lay Out Nails" },
                { href: "#step-2", label: "2. Try Each Size" },
                { href: "#step-3", label: "3. Record Sizes" },
                { href: "#step-4", label: "4. Save Profile" },
              ].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-sm px-4 py-1.5 rounded-full border border-border/50 bg-transparent text-muted-foreground hover:border-border hover:text-foreground hover:bg-secondary/10 transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Info Callout */}
      <section className="pb-6">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto">
            <div className="bg-secondary/30 rounded-xl p-6 md:p-8 flex gap-4 items-start">
              <Gift className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-foreground">
                <span className="font-medium">Good news!</span> Your first set includes a free sizing kit in the shape you order.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Alert Callout */}
      <section className="pb-14 md:pb-16">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto">
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
      <section id="kit-purchase" className="pb-20 md:pb-28">
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
                    selectedShape === shape.id ? "scale-[1.02]" : "hover:scale-[1.01]"
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
                      selectedShape === shape.id ? "text-foreground font-medium" : "text-muted-foreground"
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

      {/* How to Use Your Kit */}
      <section className="pb-24 md:pb-32 bg-secondary/10">
        <div className="container mx-auto px-6 py-16 md:py-24">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">
                How to Use Your Sizing Kit
              </h2>
              <p className="text-muted-foreground text-lg">
                Once your kit arrives, follow these steps:
              </p>
            </div>

            <div className="space-y-14 md:space-y-16">
              {/* Step 1 */}
              <div id="step-1" className="grid md:grid-cols-2 gap-8 items-center">
                <StepPanel icon={Package} label="Step 1" stepNumber="01" />
                <div>
                  <span className="text-sm text-muted-foreground uppercase tracking-wider mb-2 block">Step 1</span>
                  <h3 className="font-serif text-2xl text-foreground mb-4">
                    Lay Out Your Sizing Nails
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Your kit includes numbered nails from 0 (largest) to 9 (smallest).
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div id="step-2" className="grid md:grid-cols-2 gap-8 items-center">
                <div className="md:order-1">
                  <span className="text-sm text-muted-foreground uppercase tracking-wider mb-2 block">Step 2</span>
                  <h3 className="font-serif text-2xl text-foreground mb-4">
                    Try Each Size
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Press each sizing nail onto your natural nail. It should fit from sidewall to sidewall without pressing into your skin or leaving gaps.
                  </p>
                </div>
                <div className="md:order-2">
                  <StepPanel icon={Ruler} label="Step 2" stepNumber="02" />
                </div>
              </div>

              {/* Step 3 */}
              <div id="step-3" className="grid md:grid-cols-2 gap-8 items-center">
                <StepPanel icon={ClipboardList} label="Step 3" stepNumber="03" />
                <div>
                  <span className="text-sm text-muted-foreground uppercase tracking-wider mb-2 block">Step 3</span>
                  <h3 className="font-serif text-2xl text-foreground mb-4">
                    Record Your Sizes
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Write down the number that fits each finger — thumb through pinky, both hands.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div id="step-4" className="grid md:grid-cols-2 gap-8 items-center">
                <div className="md:order-1">
                  <span className="text-sm text-muted-foreground uppercase tracking-wider mb-2 block">Step 4</span>
                  <h3 className="font-serif text-2xl text-foreground mb-4">
                    Save to Your Account
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    Once you know your sizes, save them to your Perfect Fit Profile for faster ordering.
                  </p>
                  <Button asChild variant="outline" className="group">
                    <Link to="/account/perfect-fit">
                      Save My Sizes
                      <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </div>
                <div className="md:order-2">
                  <StepPanel icon={UserCheck} label="Step 4" stepNumber="04" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Guides + CTA */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto">
            <p className="text-xs uppercase tracking-widest text-muted-foreground text-center mb-4">Continue learning</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
              <Link
                to="/how-to/application"
                className="group flex items-center gap-3 bg-secondary/10 border border-border/30 rounded-xl p-4 hover:border-border hover:bg-secondary/20 transition-all"
              >
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Hand className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">Applying for the First Time</p>
                  <p className="text-xs text-muted-foreground">Step-by-step guide</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                to="/how-to/troubleshooting"
                className="group flex items-center gap-3 bg-secondary/10 border border-border/30 rounded-xl p-4 hover:border-border hover:bg-secondary/20 transition-all"
              >
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Wrench className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">Troubleshooting</p>
                  <p className="text-xs text-muted-foreground">Common fixes</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8 border-t border-border/30">
              <Button variant="outline" size="lg" asChild>
                <Link to="/how-to">All Guides</Link>
              </Button>
              <Button size="lg" asChild>
                <Link to="/shop">Shop Collection</Link>
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
