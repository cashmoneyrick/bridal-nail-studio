import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { 
  Droplets, 
  Hand, 
  Clock, 
  Sparkles, 
  Shield, 
  Package,
  ChevronDown,
  Heart,
  AlertCircle,
  Scissors,
  FileText,
  RefreshCw
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const applicationSteps = [
  {
    number: "01",
    icon: Hand,
    title: "Prep Your Nails",
    description: "Start with clean, dry nails. Gently push back cuticles and lightly buff the nail surface for better adhesion. Wipe with alcohol to remove any oils.",
  },
  {
    number: "02",
    icon: FileText,
    title: "Select Your Size",
    description: "Match each press-on nail to your natural nail width. The nail should fit from sidewall to sidewall without touching your skin. Use your Perfect Fit Profile for faster sizing.",
  },
  {
    number: "03",
    icon: Droplets,
    title: "Apply Adhesive",
    description: "For adhesive tabs: peel and place on your natural nail. For nail glue: apply a thin layer to both your natural nail and the press-on nail.",
  },
  {
    number: "04",
    icon: Clock,
    title: "Press & Hold",
    description: "Starting at the cuticle, press the nail firmly at a slight angle, then press down. Hold for 30-60 seconds with steady pressure to ensure a secure bond.",
  },
  {
    number: "05",
    icon: Sparkles,
    title: "Final Touches",
    description: "After all nails are applied, avoid water for at least 1 hour. Gently file any edges if needed. Apply cuticle oil around the edges for a polished look.",
  },
];

const removalMethods = [
  {
    title: "Oil Soak Method (Gentlest)",
    steps: [
      "Fill a small bowl with warm water and add cuticle oil or olive oil",
      "Soak your nails for 10-15 minutes",
      "Gently wiggle the nails from side to side—never pull or force",
      "Once loose, slowly peel off starting from the sides",
      "Buff away any remaining adhesive and apply nail oil"
    ]
  },
  {
    title: "Warm Water Method",
    steps: [
      "Soak your hands in warm soapy water for 15-20 minutes",
      "The adhesive will soften as it absorbs moisture",
      "Gently lift edges with a cuticle stick",
      "Continue soaking if nails don't lift easily",
      "Moisturize your nails after removal"
    ]
  },
  {
    title: "Acetone Method (For Glue Application)",
    steps: [
      "Use only if you applied nails with glue, not adhesive tabs",
      "Soak cotton balls in acetone and place on each nail",
      "Wrap fingertips in foil and wait 10-15 minutes",
      "Gently slide off the press-ons",
      "Wash hands thoroughly and apply cuticle oil"
    ]
  }
];

const careTips = [
  {
    icon: Droplets,
    title: "Limit Water Exposure",
    description: "Wear gloves when doing dishes or cleaning. Prolonged water exposure can weaken adhesion."
  },
  {
    icon: Heart,
    title: "Be Gentle",
    description: "Avoid using your nails as tools. Open cans and packages with proper tools to prevent lifting."
  },
  {
    icon: Shield,
    title: "Check Adhesion Daily",
    description: "Press down on each nail gently each morning. If any feel loose, reapply adhesive before it lifts completely."
  },
  {
    icon: RefreshCw,
    title: "Moisturize Around Edges",
    description: "Apply cuticle oil daily around the edges to keep the skin healthy and nails looking fresh."
  }
];

const storageTips = [
  {
    title: "Storing Unused Sets",
    description: "Keep press-on nails in their original packaging or a clean, dry container. Store away from direct sunlight and heat to prevent warping or discoloration."
  },
  {
    title: "Reusing Your Nails",
    description: "After gentle removal, clean any adhesive residue with alcohol. Let nails dry completely, then store flat in a labeled container for future use."
  },
  {
    title: "Adhesive Tab Storage",
    description: "Keep adhesive tabs in a cool, dry place. Avoid touching the sticky side before use. Tabs work best when fresh, so use older packs first."
  }
];

const faqItems = [
  {
    question: "My nails keep popping off—what am I doing wrong?",
    answer: "This usually means oil is preventing proper adhesion. Make sure to thoroughly clean your natural nails with alcohol before application. Also ensure you're pressing firmly for at least 30 seconds per nail, and avoid water for the first hour after application."
  },
  {
    question: "How long should press-on nails last?",
    answer: "With proper application and care, press-ons with adhesive tabs typically last 5-7 days, while those applied with nail glue can last up to 2 weeks. Daily activities and water exposure affect longevity."
  },
  {
    question: "The nails are too wide for my nail beds. What should I do?",
    answer: "You can gently file the sides of the press-on nail to create a custom fit. File in one direction only, checking the fit frequently. This won't affect the design as you're only removing material from the edges."
  },
  {
    question: "Can I shower with press-on nails?",
    answer: "Yes! Just avoid soaking your hands and be gentle. Pat your nails dry after showering and try to keep the shower under 10 minutes. The longer water exposure, the more the adhesive weakens."
  },
  {
    question: "How do I fix a nail that's starting to lift?",
    answer: "Don't wait until it falls off! Gently lift the edge, clean underneath with alcohol, let dry, then apply a fresh adhesive tab or small drop of nail glue. Press firmly for 60 seconds."
  },
  {
    question: "Are press-ons safe for my natural nails?",
    answer: "Absolutely! When applied and removed correctly, press-ons are one of the gentlest nail enhancement options. Never force or rip off nails—always use the soak-off method to prevent damage."
  },
  {
    question: "Can I apply nail polish over press-ons?",
    answer: "Yes, you can apply regular nail polish over press-ons. Use non-acetone remover if you want to change colors. This can extend the life of a set by refreshing the look."
  },
  {
    question: "My nail sizes change—is that normal?",
    answer: "Yes! Nail sizes can vary due to temperature, hydration, and hormonal changes. That's why we recommend checking your Perfect Fit Profile periodically and keeping a range of sizes on hand."
  }
];

const HowTo = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-28 pb-16 sm:pt-32 sm:pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <p className="text-sm font-medium tracking-[0.2em] uppercase text-primary mb-4">
              Tutorials & Tips
            </p>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-medium mb-6">
              How To
            </h1>
            <p className="text-muted-foreground text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto">
              Master the art of press-on nails with our step-by-step guides. From application to removal, we've got everything you need for a flawless manicure.
            </p>
          </div>
        </div>
      </section>

      {/* Application Guide */}
      <section id="application" className="section-padding bg-muted/30 scroll-mt-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <p className="text-sm font-medium tracking-[0.2em] uppercase text-primary mb-3">
              Step by Step
            </p>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-medium">
              Application Guide
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-6">
            {applicationSteps.map((step, index) => (
              <div key={step.number} className="relative text-center group">
                {/* Connector Line (desktop only) */}
                {index < applicationSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-16 left-[60%] w-[80%] h-px bg-border" />
                )}

                <div className="relative">
                  {/* Number Badge */}
                  <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 rounded-full bg-background flex items-center justify-center group-hover:bg-primary/10 transition-colors duration-300 shadow-sm">
                    <step.icon className="w-8 h-8 sm:w-10 sm:h-10 text-foreground/70 group-hover:text-primary transition-colors duration-300" strokeWidth={1.5} />
                  </div>

                  {/* Text */}
                  <h3 className="font-display text-lg sm:text-xl font-medium mb-3">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Removal Guide */}
      <section className="section-padding">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-sm font-medium tracking-[0.2em] uppercase text-primary mb-3">
                Safe & Gentle
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-medium mb-4">
                Removal Guide
              </h2>
              <p className="text-muted-foreground">
                Never pull or force off your press-on nails. Follow these gentle methods to protect your natural nails.
              </p>
            </div>

            <Accordion type="single" collapsible className="space-y-4">
              {removalMethods.map((method, index) => (
                <AccordionItem 
                  key={index} 
                  value={`removal-${index}`}
                  className="bg-muted/30 rounded-2xl border-none px-6"
                >
                  <AccordionTrigger className="text-left font-display text-lg hover:no-underline py-6">
                    {method.title}
                  </AccordionTrigger>
                  <AccordionContent className="pb-6">
                    <ol className="space-y-3">
                      {method.steps.map((step, stepIndex) => (
                        <li key={stepIndex} className="flex gap-3 text-muted-foreground">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-sm flex items-center justify-center">
                            {stepIndex + 1}
                          </span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Care & Maintenance */}
      <section id="care" className="section-padding bg-muted/30 scroll-mt-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-sm font-medium tracking-[0.2em] uppercase text-primary mb-3">
              Daily Care
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-medium">
              Care & Maintenance
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {careTips.map((tip, index) => (
              <div 
                key={index}
                className="bg-background rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <tip.icon className="w-6 h-6 text-primary" strokeWidth={1.5} />
                </div>
                <h3 className="font-display text-lg font-medium mb-2">
                  {tip.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {tip.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Storage Tips */}
      <section className="section-padding">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-sm font-medium tracking-[0.2em] uppercase text-primary mb-3">
                Keep Them Fresh
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-medium">
                Storage Tips
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {storageTips.map((tip, index) => (
                <div 
                  key={index}
                  className="bg-muted/30 rounded-2xl p-6"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Package className="w-5 h-5 text-primary" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-display text-lg font-medium mb-3">
                    {tip.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {tip.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-sm font-medium tracking-[0.2em] uppercase text-primary mb-3">
                Common Questions
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-medium mb-4">
                Troubleshooting FAQ
              </h2>
              <p className="text-muted-foreground">
                Got questions? We've got answers to the most common press-on nail concerns.
              </p>
            </div>

            <Accordion type="single" collapsible className="space-y-4">
              {faqItems.map((item, index) => (
                <AccordionItem 
                  key={index} 
                  value={`faq-${index}`}
                  className="bg-background rounded-2xl border-none px-6 shadow-sm"
                >
                  <AccordionTrigger className="text-left font-display text-base sm:text-lg hover:no-underline py-6">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="pb-6 text-muted-foreground leading-relaxed">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-display text-2xl sm:text-3xl font-medium mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-muted-foreground mb-8">
              Find your perfect size with our fit guide, then browse our collection for your next set.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/account/perfect-fit" 
                className="btn-primary inline-flex items-center justify-center"
              >
                Find Your Fit
              </a>
              <a 
                href="/shop" 
                className="btn-secondary inline-flex items-center justify-center"
              >
                Shop Now
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HowTo;
