import Navigation from "@/components/Navigation";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Lightbulb, Sparkles, FileText, Droplets, Layers, Scissors,
  Hand, RotateCcw, ChevronRight, Wrench,
} from "lucide-react";

const kitItems = [
  { name: "Cuticle Pusher", icon: Scissors },
  { name: "Nail File", icon: FileText },
  { name: "Buffer", icon: Layers },
  { name: "Alcohol Wipes", icon: Droplets },
  { name: "Adhesive Tabs", icon: Layers },
  { name: "Nail Glue", icon: Droplets },
];

// Helper: styled icon panel replacing image placeholders
const StepPanel = ({ icon: Icon, label, stepNumber }: { icon: React.ElementType; label: string; stepNumber: string }) => (
  <div className="hidden md:flex aspect-[4/3] bg-gradient-to-br from-secondary/25 to-primary/8 rounded-xl border border-border/20 flex-col items-center justify-center gap-4 relative overflow-hidden">
    <span className="absolute text-[120px] font-display font-bold text-primary/5 leading-none select-none pointer-events-none -translate-y-2">
      {stepNumber}
    </span>
    <Icon className="w-14 h-14 text-primary/40 relative z-10" />
    <span className="text-xs uppercase tracking-widest text-muted-foreground/60 font-medium relative z-10">{label}</span>
  </div>
);

const HowToApplication = () => {
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
            <span className="text-foreground">Applying for the First Time</span>
          </nav>

          <div className="max-w-4xl mx-auto text-center">
            {/* Icon badge with halo ring */}
            <div className="flex justify-center mb-8">
              <div className="w-32 h-32 rounded-full bg-primary/5 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border border-border/30 flex items-center justify-center shadow-sm">
                  <Hand className="w-12 h-12 text-primary/70" />
                </div>
              </div>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-foreground mb-6">
              Applying for the First Time
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
              Follow these steps for a flawless, long-lasting manicure.
            </p>
          </div>
        </div>
      </section>

      {/* Table of Contents */}
      <section className="pb-12">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap gap-2">
              {[
                { href: "#kit", label: "What's In Your Kit" },
                { href: "#step-1", label: "1. Prep" },
                { href: "#step-2", label: "2. Apply Adhesive" },
                { href: "#step-3", label: "3. Press & Hold" },
                { href: "#step-4", label: "4. Quick Fix" },
                { href: "#step-5", label: "5. Final Touches" },
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

      {/* What's In Your Kit */}
      <section id="kit" className="pb-20 md:pb-24">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl md:text-4xl text-foreground mb-4">
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
                  className="bg-secondary/20 rounded-lg p-5 text-center"
                >
                  <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-primary/15 to-primary/5 rounded-full flex items-center justify-center">
                    <item.icon className="w-6 h-6 text-primary/70" />
                  </div>
                  <p className="text-sm text-foreground font-medium">{item.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Step 1: Prep Your Nails */}
      <section id="step-1" className="pb-16 md:pb-20">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
              <StepPanel icon={Droplets} label="Step 1" stepNumber="01" />
              <div className="order-1 md:order-2">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold flex-shrink-0">
                    1
                  </span>
                  <h3 className="font-display text-2xl md:text-3xl text-foreground">
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
      <section id="step-2" className="pb-16 md:pb-20">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold flex-shrink-0">
                    2
                  </span>
                  <h3 className="font-display text-2xl md:text-3xl text-foreground">
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
              <StepPanel icon={Layers} label="Step 2" stepNumber="02" />
            </div>
          </div>
        </div>
      </section>

      {/* Step 3: Press & Hold */}
      <section id="step-3" className="pb-16 md:pb-20">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
              <StepPanel icon={Hand} label="Step 3" stepNumber="03" />
              <div className="order-1 md:order-2">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold flex-shrink-0">
                    3
                  </span>
                  <h3 className="font-display text-2xl md:text-3xl text-foreground">
                    Press & Hold
                  </h3>
                </div>
                <ul className="space-y-2 text-muted-foreground mb-6">
                  <li>• Start at cuticle, angle the nail slightly, press toward tip</li>
                  <li>• Hold firmly for 30–60 seconds</li>
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

      {/* Step 4: Quick Fix */}
      <section id="step-4" className="pb-16 md:pb-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-muted/20 border border-border/50 rounded-xl p-8 md:p-10">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="hidden md:flex aspect-[4/3] bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl border border-border/20 flex-col items-center justify-center gap-4 relative overflow-hidden">
                  <span className="absolute text-[120px] font-display font-bold text-primary/5 leading-none select-none pointer-events-none -translate-y-2">
                    04
                  </span>
                  <RotateCcw className="w-14 h-14 text-primary/40 relative z-10" />
                  <span className="text-xs uppercase tracking-widest text-muted-foreground/60 font-medium relative z-10">Step 4</span>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold flex-shrink-0">
                      4
                    </span>
                    <h3 className="font-display text-2xl md:text-3xl text-foreground">
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
      <section id="step-5" className="pb-20 md:pb-24">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold flex-shrink-0">
                    5
                  </span>
                  <h3 className="font-display text-2xl md:text-3xl text-foreground">
                    Final Touches
                  </h3>
                </div>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Avoid water for at least 1 hour (2 hours for maximum longevity)</li>
                  <li>• File edges if needed</li>
                  <li>• Apply cuticle oil around edges for a polished look</li>
                </ul>
              </div>
              <StepPanel icon={Sparkles} label="Step 5" stepNumber="05" />
            </div>
          </div>
        </div>
      </section>

      {/* Related Guides + CTA */}
      <section className="pb-24 md:pb-32">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto">
            <p className="text-xs uppercase tracking-widest text-muted-foreground text-center mb-4">Continue learning</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
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
              <Link
                to="/how-to/removal"
                className="group flex items-center gap-3 bg-secondary/10 border border-border/30 rounded-xl p-4 hover:border-border hover:bg-secondary/20 transition-all"
              >
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Droplets className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">Removing Your Set</p>
                  <p className="text-xs text-muted-foreground">Remove safely</p>
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

    </div>
  );
};

export default HowToApplication;
