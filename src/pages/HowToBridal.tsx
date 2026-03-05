import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Calendar, Check, Heart, Sparkles, Hand, Ruler, ChevronRight } from "lucide-react";

const timelineSteps = [
  {
    timeframe: "2-3 Weeks Before",
    title: "Do a Trial Run",
    items: [
      "Apply a full set to test your technique",
      "Confirm your sizing is correct",
      "See how long they last with your daily routine",
      "Practice removal so you're confident",
    ],
  },
  {
    timeframe: "1 Week Before",
    title: "Prep Your Nails",
    items: [
      "Remove any existing polish or press-ons",
      "Keep nails clean and moisturized",
      "Avoid acetone — it dries out natural nails and weakens adhesion",
      "Don't cut cuticles — just push back gently",
    ],
  },
  {
    timeframe: "1-2 Days Before",
    title: "Apply Your Wedding Set",
    items: [
      "Gives adhesive time to fully bond",
      "Nails will be secure through ceremony, reception, and photos",
      "Use glue (not tabs) for maximum hold",
    ],
  },
  {
    timeframe: "Day Of",
    title: "Final Check",
    items: [
      "Press down gently on each nail to confirm adhesion",
      "Bring your emergency kit (see below)",
      "Apply cuticle oil for a polished, photo-ready look",
    ],
  },
];

const emergencyKitItems = [
  "Extra adhesive tabs",
  "Nail glue",
  "A few backup nails in your sizes",
  "Small file",
  "Cuticle oil",
];

const HowToBridal = () => {
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
            <span className="text-foreground">Prepping for My Wedding</span>
          </nav>

          <div className="max-w-3xl mx-auto text-center">
            {/* Icon badge with halo ring */}
            <div className="flex justify-center mb-8">
              <div className="w-32 h-32 rounded-full bg-primary/5 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-secondary/15 border border-border/30 flex items-center justify-center shadow-sm">
                  <Heart className="w-12 h-12 text-primary/70" />
                </div>
              </div>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-foreground mb-6">
              Prepping for Your Wedding
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl">
              Your nails will be in every photo. Let's make sure they're perfect.
            </p>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 md:py-24 bg-secondary/5">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl text-foreground mb-4">
              Your Wedding Nail Timeline
            </h2>
            <p className="text-muted-foreground text-lg">
              Start here: When's your big day?
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="relative">
              {/* Timeline Line — desktop only */}
              <div className="absolute left-4 md:left-8 top-0 bottom-0 w-0.5 bg-primary/20 hidden md:block" />

              {/* Timeline Cards */}
              <div className="space-y-6 md:space-y-8">
                {timelineSteps.map((step, index) => (
                  <div key={index} className="relative md:pl-20">
                    {/* Timeline Dot — desktop only */}
                    <div className="absolute left-0 md:left-4 top-0 w-8 h-8 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center hidden md:flex">
                      <Calendar className="w-4 h-4 text-primary" />
                    </div>

                    {/* Card */}
                    <div className="bg-background border border-border/50 rounded-xl p-6 md:p-8 shadow-sm">
                      {/* Timeframe Badge */}
                      <div className="flex items-center gap-3 mb-3">
                        <Calendar className="w-4 h-4 text-primary md:hidden flex-shrink-0" />
                        <span className="inline-block px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                          {step.timeframe}
                        </span>
                      </div>

                      <h3 className="font-display text-xl md:text-2xl text-foreground mb-4">
                        {step.title}
                      </h3>

                      <ul className="space-y-2">
                        {step.items.map((item, itemIndex) => (
                          <li key={itemIndex} className="flex items-start gap-3 text-muted-foreground">
                            <Check className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Kit Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl text-foreground mb-4">
              Pack an Emergency Kit
            </h2>
            <p className="text-muted-foreground text-lg">
              Keep it in your bridal bag — better safe than sorry.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {emergencyKitItems.map((item, index) => (
                <div
                  key={index}
                  className="bg-secondary/10 border border-border/30 rounded-xl p-4 text-center"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <Check className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-sm text-foreground font-medium">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Honeymoon Ready Callout */}
      <section className="py-16 md:py-24 bg-primary/5">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
              <Heart className="w-8 h-8 text-primary" />
            </div>

            <h2 className="font-display text-3xl md:text-4xl text-foreground mb-4">
              Honeymoon Ready
            </h2>

            <p className="text-muted-foreground text-lg leading-relaxed">
              With proper application, your press-ons will last through the ceremony,
              reception, and well into your honeymoon.
            </p>

            <Sparkles className="w-6 h-6 text-primary/40 mx-auto mt-6" />
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
                to="/how-to/sizing"
                className="group flex items-center gap-3 bg-secondary/10 border border-border/30 rounded-xl p-4 hover:border-border hover:bg-secondary/20 transition-all"
              >
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Ruler className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">Find Your Size</p>
                  <p className="text-xs text-muted-foreground">Perfect fit guide</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8 border-t border-border/30">
              <Button variant="outline" size="lg" asChild>
                <Link to="/how-to">All Guides</Link>
              </Button>
              <Button size="lg" asChild>
                <Link to="/shop">Shop Bridal Collection</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HowToBridal;
