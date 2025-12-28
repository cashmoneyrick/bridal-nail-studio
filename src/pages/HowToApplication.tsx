import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Lightbulb, Sparkles, FileText, Droplets, Layers, Scissors } from "lucide-react";

const kitItems = [
  { name: "Cuticle Pusher", icon: Scissors },
  { name: "Nail File", icon: FileText },
  { name: "Buffer", icon: Layers },
  { name: "Alcohol Wipes", icon: Droplets },
  { name: "Adhesive Tabs", icon: Layers },
  { name: "Nail Glue", icon: Droplets },
];

const HowToApplication = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground mb-6">
              Applying for the First Time
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl mb-12 max-w-2xl mx-auto">
              Follow these steps for a flawless, long-lasting manicure.
            </p>
            <div className="aspect-[16/9] bg-muted/30 rounded-lg max-w-3xl mx-auto" />
          </div>
        </div>
      </section>

      {/* What's In Your Kit Section */}
      <section className="pb-20 md:pb-24">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">
                What's In Your Kit
              </h2>
              <p className="text-muted-foreground text-lg">
                Lay everything out before you start.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {kitItems.map((item) => (
                <div
                  key={item.name}
                  className="bg-secondary/20 rounded-lg p-6 text-center"
                >
                  <div className="w-12 h-12 mx-auto mb-3 bg-muted/30 rounded-full flex items-center justify-center">
                    <item.icon className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-foreground font-medium">{item.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Step 1: Prep Your Nails */}
      <section className="pb-20 md:pb-24">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
              <div className="aspect-[4/3] bg-muted/30 rounded-lg" />
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                    1
                  </span>
                  <h3 className="font-serif text-2xl md:text-3xl text-foreground">
                    Prep Your Nails
                  </h3>
                </div>
                <ul className="space-y-2 text-muted-foreground mb-6">
                  <li>• Clean, dry nails</li>
                  <li>• Push back cuticles</li>
                  <li>• Lightly buff surface</li>
                  <li>• Wipe with alcohol</li>
                </ul>
                <div className="bg-secondary/30 rounded-lg p-4 flex gap-3">
                  <Lightbulb className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground">
                    <span className="font-medium">Pro tip:</span> No oils, lotions, or water before application
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Step 2: Apply Adhesive */}
      <section className="pb-20 md:pb-24">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
              <div className="order-2 md:order-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                    2
                  </span>
                  <h3 className="font-serif text-2xl md:text-3xl text-foreground">
                    Apply Adhesive
                  </h3>
                </div>
                <ul className="space-y-2 text-muted-foreground mb-6">
                  <li>• Two options: adhesive tabs (~1 week wear) or nail glue (~2 weeks wear)</li>
                  <li>• Tabs: peel and place on natural nail</li>
                  <li>• Glue: thin layer on both natural nail and press-on</li>
                </ul>
                <div className="bg-secondary/30 rounded-lg p-4 flex gap-3">
                  <Lightbulb className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground">
                    <span className="font-medium">Pro tip:</span> Less is more with glue — a thin layer creates the strongest bond
                  </p>
                </div>
              </div>
              <div className="aspect-[4/3] bg-muted/30 rounded-lg order-1 md:order-2" />
            </div>
          </div>
        </div>
      </section>

      {/* Step 3: Press & Hold */}
      <section className="pb-20 md:pb-24">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
              <div className="aspect-[4/3] bg-muted/30 rounded-lg" />
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                    3
                  </span>
                  <h3 className="font-serif text-2xl md:text-3xl text-foreground">
                    Press & Hold
                  </h3>
                </div>
                <ul className="space-y-2 text-muted-foreground mb-6">
                  <li>• Start at cuticle, angle the nail slightly, press toward tip</li>
                  <li>• Hold firmly for 30-60 seconds</li>
                  <li>• Press from center outward to remove air bubbles</li>
                </ul>
                <div className="bg-secondary/30 rounded-lg p-4 flex gap-3">
                  <Lightbulb className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground">
                    <span className="font-medium">Pro tip:</span> Start with your dominant hand for better control on the second hand
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Step 4: Messed Up? Quick Fix - Styled Differently */}
      <section className="pb-20 md:pb-24">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-muted/20 border border-border/50 rounded-xl p-8 md:p-10">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="aspect-[4/3] bg-muted/30 rounded-lg" />
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <Sparkles className="w-6 h-6 text-primary" />
                    <h3 className="font-serif text-2xl md:text-3xl text-foreground">
                      Messed Up? Quick Fix
                    </h3>
                  </div>
                  <ul className="space-y-3 text-muted-foreground">
                    <li>• If crooked, remove immediately and reapply — you have a few seconds before glue sets</li>
                    <li>• Don't try to reposition once it's down — weakens the bond</li>
                    <li>• Practice with adhesive tabs first if you're nervous about placement</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Step 5: Final Touches */}
      <section className="pb-20 md:pb-24">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
              <div className="order-2 md:order-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                    5
                  </span>
                  <h3 className="font-serif text-2xl md:text-3xl text-foreground">
                    Final Touches
                  </h3>
                </div>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Avoid water for at least 1 hour (2 hours for maximum longevity)</li>
                  <li>• File edges if needed</li>
                  <li>• Apply cuticle oil around edges for a polished look</li>
                </ul>
              </div>
              <div className="aspect-[4/3] bg-muted/30 rounded-lg order-1 md:order-2" />
            </div>
          </div>
        </div>
      </section>

      {/* End of Page CTA */}
      <section className="pb-24 md:pb-32">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-8">
              Ready to explore more?
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" size="lg" asChild>
                <Link to="/how-to">Back to How To</Link>
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

export default HowToApplication;
