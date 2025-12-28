import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Droplets, Bath, FlaskConical, Sparkles, RotateCcw } from "lucide-react";

const removalMethods = [
  {
    title: "Oil Soak",
    badge: "Gentlest",
    badgeColor: "bg-green-100 text-green-800",
    icon: Droplets,
    bestFor: "Adhesive tabs or light glue",
    steps: [
      "Fill a small bowl with warm water + cuticle oil (or olive oil)",
      "Soak fingertips for 10-15 minutes",
      "Gently wiggle nails side to side — never pull",
      "Once loose, slowly peel from the sides",
      "Buff away any remaining adhesive, apply nail oil"
    ]
  },
  {
    title: "Warm Water Soak",
    badge: "Most Popular",
    badgeColor: "bg-primary/10 text-primary",
    icon: Bath,
    bestFor: "Adhesive tabs",
    steps: [
      "Soak hands in warm soapy water for 15-20 minutes",
      "Adhesive will soften as it absorbs moisture",
      "Gently lift edges with cuticle stick",
      "Keep soaking if nails don't lift easily",
      "Moisturize nails after removal"
    ]
  },
  {
    title: "Acetone Soak",
    badge: "For Glue Only",
    badgeColor: "bg-amber-100 text-amber-800",
    icon: FlaskConical,
    bestFor: "Strong nail glue application",
    steps: [
      "Only use if you applied with glue, not tabs",
      "Soak cotton balls in acetone, place on each nail",
      "Wrap fingertips in foil, wait 10-15 minutes",
      "Gently slide off press-ons",
      "Wash hands thoroughly, apply cuticle oil"
    ],
    note: "Acetone is harsh — moisturize after. Press-ons likely can't be reused after this method."
  }
];

const afterRemovalTips = [
  "Buff away any adhesive residue gently",
  "Apply cuticle oil or nail strengthener",
  "Give your nails a break for a day or two before reapplying"
];

const reuseTips = [
  "Clean adhesive residue off press-ons with alcohol",
  "Let dry completely",
  "Store flat in original packaging or a container",
  "Apply fresh adhesive tabs or glue when reapplying"
];

const HowToRemoval = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground mb-6">
              Removing Your Set
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
              Never pull or force. Here's how to remove safely.
            </p>
          </div>

          {/* Placeholder Image */}
          <div className="max-w-4xl mx-auto">
            <div className="aspect-[16/9] bg-muted/30 rounded-lg flex items-center justify-center">
              <span className="text-muted-foreground text-sm">Hero Image</span>
            </div>
          </div>
        </div>
      </section>

      {/* Warning Callout */}
      <section className="py-8">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 md:p-8 flex gap-4 items-start">
              <AlertTriangle className="w-6 h-6 text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-foreground leading-relaxed">
                <strong>Never rip, pull, or bite off your press-ons.</strong> This can damage your natural nails. 
                Take your time — gentle removal keeps your nails healthy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Removal Methods Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">
              Choose Your Method
            </h2>
          </div>

          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {removalMethods.map((method, index) => {
              const Icon = method.icon;
              return (
                <div
                  key={index}
                  className="bg-secondary/10 border border-border/50 rounded-lg p-6 md:p-8 relative"
                >
                  {/* Badge */}
                  <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium ${method.badgeColor}`}>
                    {method.badge}
                  </span>

                  {/* Icon & Title */}
                  <div className="flex items-center gap-3 mb-4 pr-20">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-serif text-xl text-foreground">
                      {method.title}
                    </h3>
                  </div>

                  {/* Best For */}
                  <p className="text-muted-foreground text-sm mb-6">
                    <span className="font-medium">Best for:</span> {method.bestFor}
                  </p>

                  {/* Steps */}
                  <ol className="space-y-3">
                    {method.steps.map((step, stepIndex) => (
                      <li key={stepIndex} className="flex gap-3 text-sm text-foreground">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-medium flex items-center justify-center">
                          {stepIndex + 1}
                        </span>
                        <span className="leading-relaxed">{step}</span>
                      </li>
                    ))}
                  </ol>

                  {/* Note (for acetone method) */}
                  {method.note && (
                    <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                      <p className="text-amber-800 text-sm leading-relaxed">
                        {method.note}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* After Removal Section */}
      <section className="py-16 md:py-20 bg-secondary/5">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-8">
              After Removal: Nail Care
            </h2>
            <ul className="space-y-4 text-left max-w-md mx-auto">
              {afterRemovalTips.map((tip, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-2" />
                  <span className="text-foreground">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Want to Reuse Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <RotateCcw className="w-6 h-6 text-primary" />
            </div>
            <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-8">
              Want to Reuse Your Set?
            </h2>
            <ul className="space-y-4 text-left max-w-md mx-auto">
              {reuseTips.map((tip, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-2" />
                  <span className="text-foreground">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* End of Page CTA */}
      <section className="py-16 md:py-24 border-t border-border/50">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-8">
              Ready for your next set?
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" asChild>
                <Link to="/how-to">Back to How To</Link>
              </Button>
              <Button asChild>
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

export default HowToRemoval;
