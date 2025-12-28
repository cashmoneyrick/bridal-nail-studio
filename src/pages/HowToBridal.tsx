import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Calendar, Check, Heart, Sparkles } from "lucide-react";

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
      <section className="pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground mb-6">
              Prepping for Your Wedding
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl">
              Your nails will be in every photo. Let's make sure they're perfect.
            </p>
          </div>

          {/* Placeholder Image */}
          <div className="max-w-4xl mx-auto">
            <div className="aspect-[16/9] bg-muted/30 rounded-lg flex items-center justify-center">
              <span className="text-muted-foreground">Wedding Image</span>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 md:py-24 bg-secondary/5">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">
              Your Wedding Nail Timeline
            </h2>
            <p className="text-muted-foreground text-lg">
              Start here: When's your big day?
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-4 md:left-8 top-0 bottom-0 w-0.5 bg-primary/20" />

              {/* Timeline Cards */}
              <div className="space-y-8">
                {timelineSteps.map((step, index) => (
                  <div key={index} className="relative pl-12 md:pl-20">
                    {/* Timeline Dot */}
                    <div className="absolute left-0 md:left-4 top-0 w-8 h-8 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-primary" />
                    </div>

                    {/* Card */}
                    <div className="bg-background border border-border/50 rounded-xl p-6 md:p-8 shadow-sm">
                      {/* Timeframe Badge */}
                      <span className="inline-block px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full mb-3">
                        {step.timeframe}
                      </span>

                      <h3 className="font-serif text-xl md:text-2xl text-foreground mb-4">
                        {step.title}
                      </h3>

                      <ul className="space-y-2">
                        {step.items.map((item, itemIndex) => (
                          <li
                            key={itemIndex}
                            className="flex items-start gap-3 text-muted-foreground"
                          >
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
            <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">
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

            <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">
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

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-8">
              Ready to find your bridal set?
            </h2>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" size="lg" asChild>
                <Link to="/how-to">Back to How To</Link>
              </Button>
              <Button size="lg" asChild>
                <Link to="/shop">Shop Bridal Collection</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HowToBridal;
