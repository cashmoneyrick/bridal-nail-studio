import { Link } from "react-router-dom";
import { AlertCircle, Wrench, ShieldCheck } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const issues = [
  {
    title: "Nails Keep Popping Off",
    cause: "Oil or moisture on natural nail before application",
    fix: "Clean nails thoroughly with alcohol, make sure completely dry before applying",
    prevention: "No lotions, oils, or water for at least 1 hour before application",
  },
  {
    title: "Edges Are Lifting",
    cause: "Not enough adhesive at edges, or water exposure",
    fix: "Clean under lifted edge with alcohol, let dry, apply small drop of glue, press 30-60 seconds",
    prevention: "Press firmly from center outward during application, avoid prolonged water exposure",
  },
  {
    title: "Nails Feel Tight or Painful",
    cause: "Press-on is too small",
    fix: "Remove and try the next size up",
    prevention: "When sizing, the nail should fit sidewall to sidewall without pressing into skin",
  },
  {
    title: "Air Bubbles Under Nail",
    cause: "Applied nail flat instead of at an angle",
    fix: "If just applied, remove and reapply at 45° angle from cuticle to tip",
    prevention: "Always angle from cuticle and press toward tip",
  },
  {
    title: "Glue Residue on Skin",
    cause: "Too much glue or glue spread outside nail",
    fix: "Use acetone-free remover on a cotton swab around edges",
    prevention: "Use thin layer of glue, keep it centered on nail",
  },
];

const HowToTroubleshooting = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground mb-6">
              Troubleshooting
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl">
              Something not right? We've got fixes.
            </p>
          </div>
          
          {/* Hero Image Placeholder */}
          <div className="max-w-4xl mx-auto">
            <div className="aspect-[16/9] bg-muted/30 rounded-lg flex items-center justify-center">
              <span className="text-muted-foreground text-sm">Hero Image</span>
            </div>
          </div>
        </div>
      </section>

      {/* Issues Section */}
      <section className="pb-20 md:pb-28">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {issues.map((issue, index) => (
                <div
                  key={index}
                  className="bg-secondary/10 border border-border/30 rounded-xl p-6 md:p-8"
                >
                  <h3 className="font-serif text-xl md:text-2xl text-foreground mb-6">
                    {issue.title}
                  </h3>
                  
                  <div className="space-y-5">
                    {/* Cause */}
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center">
                        <AlertCircle className="w-4 h-4 text-destructive" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground mb-1">Cause</p>
                        <p className="text-muted-foreground text-sm">{issue.cause}</p>
                      </div>
                    </div>
                    
                    {/* Fix */}
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Wrench className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground mb-1">Fix</p>
                        <p className="text-muted-foreground text-sm">{issue.fix}</p>
                      </div>
                    </div>
                    
                    {/* Prevention */}
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
                        <ShieldCheck className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground mb-1">Prevention</p>
                        <p className="text-muted-foreground text-sm">{issue.prevention}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Still Having Issues Section */}
      <section className="pb-20 md:pb-28">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center bg-secondary/20 rounded-2xl p-10 md:p-14">
            <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-4">
              Still Having Issues?
            </h2>
            <p className="text-muted-foreground mb-8">
              We're here to help.
            </p>
            <Button asChild size="lg">
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* End of Page CTA */}
      <section className="pb-24 md:pb-32">
        <div className="container mx-auto px-6">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-8">
              Ready to explore more?
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="outline" size="lg">
                <Link to="/how-to">Back to How To</Link>
              </Button>
              <Button asChild size="lg">
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

export default HowToTroubleshooting;
