import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { 
  Droplets, 
  Hand, 
  Clock, 
  Sparkles, 
  Shield, 
  Package,
  Heart,
  RefreshCw,
  Play,
  CheckCircle,
  ArrowRight,
  Star,
  Zap,
  Scissors,
  FileText,
  ChevronDown
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Link } from "react-router-dom";

const applicationSteps = [
  {
    number: "01",
    icon: Hand,
    title: "Prep Your Nails",
    description: "Start with clean, dry nails. Gently push back cuticles and lightly buff the nail surface for better adhesion. Wipe with alcohol to remove any oils.",
    tip: "Your kit includes: cuticle stick, adhesive tabs, nail glue, file, buffer & alcohol wipes",
  },
  {
    number: "02",
    icon: FileText,
    title: "Select Your Size",
    description: "Match each press-on nail to your natural nail width. The nail should fit from sidewall to sidewall without touching your skin.",
    tip: "Use your Perfect Fit Profile for faster sizing",
  },
  {
    number: "03",
    icon: Droplets,
    title: "Apply Adhesive",
    description: "For adhesive tabs: peel and place on your natural nail. For nail glue: apply a thin layer to both your natural nail and the press-on nail.",
    tip: "Less is more with glue—a thin layer creates the strongest bond",
  },
  {
    number: "04",
    icon: Clock,
    title: "Press & Hold",
    description: "Starting at the cuticle, press the nail firmly at a slight angle, then press down. Hold for 30-60 seconds with steady pressure.",
    tip: "Apply pressure from center outward to remove air bubbles",
  },
  {
    number: "05",
    icon: Sparkles,
    title: "Final Touches",
    description: "After all nails are applied, avoid water for at least 1 hour. Gently file any edges if needed. Apply cuticle oil for a polished look.",
    tip: "Wait 2 hours before showering for maximum longevity",
  },
];

const removalMethods = [
  {
    title: "Oil Soak Method",
    badge: "Gentlest",
    icon: Droplets,
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
    badge: "Most Popular",
    icon: Heart,
    steps: [
      "Soak your hands in warm soapy water for 15-20 minutes",
      "The adhesive will soften as it absorbs moisture",
      "Gently lift edges with a cuticle stick",
      "Continue soaking if nails don't lift easily",
      "Moisturize your nails after removal"
    ]
  },
  {
    title: "Acetone Method",
    badge: "For Glue Only",
    icon: Scissors,
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

const bridalTips = [
  {
    icon: Clock,
    title: "Trial Run",
    description: "Do a full application 2-3 weeks before the big day. This helps you perfect your technique and ensures the sizing is right."
  },
  {
    icon: Sparkles,
    title: "Apply 1-2 Days Before",
    description: "For maximum longevity, apply your wedding set 1-2 days before the ceremony. This gives the adhesive time to fully bond."
  },
  {
    icon: Package,
    title: "Pack an Emergency Kit",
    description: "Bring extra adhesive tabs, nail glue, and a few backup nails in your bridal bag. Better safe than sorry!"
  },
  {
    icon: Shield,
    title: "Skip the Acetone",
    description: "Avoid acetone-based products before application—they can dry out your natural nails and weaken adhesion."
  },
  {
    icon: Heart,
    title: "Honeymoon Ready",
    description: "With proper application, your press-ons will last through the ceremony, reception, and well into your honeymoon."
  }
];

const storageTips = [
  {
    icon: Package,
    title: "Storing Unused Sets",
    description: "Keep press-on nails in their original packaging or a clean, dry container. Store away from direct sunlight and heat to prevent warping or discoloration."
  },
  {
    icon: RefreshCw,
    title: "Reusing Your Nails",
    description: "After gentle removal, clean any adhesive residue with alcohol. Let nails dry completely, then store flat in a labeled container for future use."
  },
  {
    icon: Sparkles,
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
    answer: "With proper application and care, press-ons with adhesive tabs typically last about 1 week, while those applied with nail glue can last up to 2 weeks. Daily activities and water exposure affect longevity—treat them well and they'll treat you well."
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

const quickStats = [
  { value: "1 week", label: "With adhesive tabs" },
  { value: "2 weeks", label: "With nail glue" },
  { value: "10 min", label: "Application time" },
  { value: "∞", label: "Reusable with care" },
];

const HowTo = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative min-h-[60vh] sm:min-h-[70vh] flex items-center justify-center overflow-hidden pt-20 sm:pt-0">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/10" />
        
        {/* Decorative elements - hidden on mobile for performance */}
        <div className="hidden sm:block absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="hidden sm:block absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 mb-6 sm:mb-8 animate-fade-in">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
              <span className="text-xs sm:text-sm font-medium text-primary">Complete Guide</span>
            </div>
            
            <h1 className="font-display text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-medium mb-4 sm:mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              Master the Art of
              <span className="block text-primary">Perfect Press-Ons</span>
            </h1>
            
            <p className="text-muted-foreground text-base sm:text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-8 sm:mb-10 px-2 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              From application to removal, learn everything you need to know for a flawless, long-lasting manicure.
            </p>
            
            {/* Quick nav buttons - 2x2 grid on mobile */}
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap justify-center gap-2 sm:gap-3 animate-fade-in px-2 sm:px-0" style={{ animationDelay: "0.3s" }}>
              <a href="#application" className="group inline-flex items-center justify-center gap-1 sm:gap-2 bg-primary text-primary-foreground px-4 sm:px-6 py-2.5 sm:py-3 rounded-full text-sm sm:text-base font-medium hover:bg-primary/90 transition-all duration-300">
                Application
                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <a href="#bridal" className="inline-flex items-center justify-center gap-1 sm:gap-2 bg-background border border-border px-4 sm:px-6 py-2.5 sm:py-3 rounded-full text-sm sm:text-base font-medium hover:bg-muted transition-all duration-300">
                Bridal Tips
              </a>
              <a href="#removal" className="inline-flex items-center justify-center gap-1 sm:gap-2 bg-background border border-border px-4 sm:px-6 py-2.5 sm:py-3 rounded-full text-sm sm:text-base font-medium hover:bg-muted transition-all duration-300">
                Removal
              </a>
              <a href="#faq" className="inline-flex items-center justify-center gap-1 sm:gap-2 bg-background border border-border px-4 sm:px-6 py-2.5 sm:py-3 rounded-full text-sm sm:text-base font-medium hover:bg-muted transition-all duration-300">
                FAQ
              </a>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center">
          <ChevronDown className="w-5 h-5 text-muted-foreground animate-[bounce_2s_ease-in-out_infinite]" />
        </div>
      </section>

      {/* Quick Stats Bar */}
      <section className="border-y border-border bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-0 sm:divide-x sm:divide-border">
            {quickStats.map((stat, index) => (
              <div key={index} className="py-5 sm:py-8 text-center">
                <div className="font-display text-2xl sm:text-3xl md:text-4xl font-medium text-primary mb-0.5 sm:mb-1">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Guide */}
      <section id="application" className="py-12 sm:py-20 md:py-28 scroll-mt-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 sm:mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 mb-4 sm:mb-6">
              <Hand className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
              <span className="text-xs sm:text-sm font-medium text-primary">Step by Step</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-medium mb-3 sm:mb-4">
              Application Guide
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto px-2">
              Follow these 5 simple steps for a salon-quality application
            </p>
          </div>

          <div className="max-w-5xl mx-auto space-y-4 sm:space-y-6">
            {applicationSteps.map((step, index) => (
              <div 
                key={step.number} 
                className="group relative bg-gradient-to-r from-muted/50 to-transparent rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 hover:from-primary/5 transition-all duration-500"
              >
                <div className="flex gap-4 sm:gap-6 items-start">
                  {/* Number & Icon */}
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-xl sm:rounded-2xl bg-background border border-border flex items-center justify-center group-hover:border-primary/50 group-hover:bg-primary/5 transition-all duration-300 shadow-sm">
                        <step.icon className="w-5 h-5 sm:w-7 sm:h-7 md:w-8 md:h-8 text-foreground/70 group-hover:text-primary transition-colors duration-300" strokeWidth={1.5} />
                      </div>
                      <div className="absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-primary text-primary-foreground text-xs sm:text-sm font-medium flex items-center justify-center">
                        {index + 1}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-lg sm:text-xl md:text-2xl font-medium mb-2 sm:mb-3 group-hover:text-primary transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-3 sm:mb-4">
                      {step.description}
                    </p>
                    <div className="inline-flex items-start sm:items-center gap-2 bg-accent/50 text-accent-foreground px-3 sm:px-4 py-2 rounded-xl sm:rounded-full text-xs sm:text-sm">
                      <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-primary flex-shrink-0 mt-0.5 sm:mt-0" />
                      <span className="leading-relaxed">{step.tip}</span>
                    </div>
                  </div>
                </div>

                {/* Connector line - hidden on mobile */}
                {index < applicationSteps.length - 1 && (
                  <div className="hidden md:block absolute left-[3.25rem] top-full w-px h-4 sm:h-6 bg-gradient-to-b from-border to-transparent" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bridal Tips Section */}
      <section id="bridal" className="py-12 sm:py-20 md:py-28 bg-muted/30 scroll-mt-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 sm:mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 mb-4 sm:mb-6">
              <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
              <span className="text-xs sm:text-sm font-medium text-primary">Say "I Do" in Style</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-medium mb-3 sm:mb-4">
              Bridal Tips
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto px-2">
              Planning your wedding nails? Here's how to ensure flawless press-ons for your special day.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-6 max-w-6xl mx-auto">
            {bridalTips.map((tip, index) => (
              <div 
                key={index}
                className="group relative bg-background rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-center hover:shadow-lg transition-all duration-500 border border-transparent hover:border-primary/20"
              >
                <div className="w-10 h-10 sm:w-14 sm:h-14 mx-auto mb-3 sm:mb-4 rounded-xl sm:rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <tip.icon className="w-4 h-4 sm:w-6 sm:h-6 text-primary" strokeWidth={1.5} />
                </div>
                <h3 className="font-display text-sm sm:text-base font-medium mb-1 sm:mb-2 group-hover:text-primary transition-colors">
                  {tip.title}
                </h3>
                <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                  {tip.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Removal Guide */}
      <section id="removal" className="py-12 sm:py-20 md:py-28 scroll-mt-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 sm:mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 mb-4 sm:mb-6">
              <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
              <span className="text-xs sm:text-sm font-medium text-primary">Safe & Gentle</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-medium mb-3 sm:mb-4">
              Removal Guide
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto px-2">
              Never pull or force off your press-on nails. Choose the method that works best for you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto">
            {removalMethods.map((method, index) => (
              <div 
                key={index}
                className="group bg-background rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-500 border border-transparent hover:border-primary/20"
              >
                <div className="flex items-start justify-between mb-4 sm:mb-6">
                  <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <method.icon className="w-5 h-5 sm:w-7 sm:h-7 text-primary" strokeWidth={1.5} />
                  </div>
                  <span className="text-xs font-medium bg-accent/50 text-accent-foreground px-2.5 py-1 rounded-full">
                    {method.badge}
                  </span>
                </div>
                
                <h3 className="font-display text-lg sm:text-xl font-medium mb-4 sm:mb-6 group-hover:text-primary transition-colors">
                  {method.title}
                </h3>
                
                <ol className="space-y-3 sm:space-y-4">
                  {method.steps.map((step, stepIndex) => (
                    <li key={stepIndex} className="flex gap-2.5 sm:gap-3 text-xs sm:text-sm">
                      <span className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-muted flex items-center justify-center text-[10px] sm:text-xs font-medium text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                        {stepIndex + 1}
                      </span>
                      <span className="text-muted-foreground leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Care & Maintenance */}
      <section id="care" className="py-12 sm:py-20 md:py-28 scroll-mt-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 sm:mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 mb-4 sm:mb-6">
              <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
              <span className="text-xs sm:text-sm font-medium text-primary">Daily Care</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-medium mb-3 sm:mb-4">
              Care & Maintenance
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto px-2">
              Keep your press-ons looking fresh with these simple daily habits
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 max-w-6xl mx-auto">
            {careTips.map((tip, index) => (
              <div 
                key={index}
                className="group relative bg-gradient-to-b from-muted/50 to-background rounded-2xl sm:rounded-3xl p-4 sm:p-8 text-center hover:from-primary/5 transition-all duration-500 border border-transparent hover:border-primary/20"
              >
                <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-6 rounded-xl sm:rounded-2xl bg-background border border-border flex items-center justify-center group-hover:border-primary/50 group-hover:bg-primary/5 transition-all duration-300 shadow-sm">
                  <tip.icon className="w-5 h-5 sm:w-7 sm:h-7 text-foreground/70 group-hover:text-primary transition-colors duration-300" strokeWidth={1.5} />
                </div>
                <h3 className="font-display text-sm sm:text-lg font-medium mb-2 sm:mb-3 group-hover:text-primary transition-colors">
                  {tip.title}
                </h3>
                <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                  {tip.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Storage Tips */}
      <section className="py-12 sm:py-20 md:py-28 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 mb-4 sm:mb-6">
                  <Package className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                  <span className="text-xs sm:text-sm font-medium text-primary">Keep Them Fresh</span>
                </div>
                <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-medium mb-4 sm:mb-6">
                  Storage Tips
                </h2>
                <p className="text-muted-foreground text-base sm:text-lg mb-6 sm:mb-8">
                  Proper storage ensures your press-ons stay in perfect condition for future use.
                </p>
                
                <div className="space-y-4 sm:space-y-6">
                  {storageTips.map((tip, index) => (
                    <div key={index} className="flex gap-3 sm:gap-4">
                      <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-background border border-border flex items-center justify-center shadow-sm">
                        <tip.icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" strokeWidth={1.5} />
                      </div>
                      <div>
                        <h3 className="font-display text-base sm:text-lg font-medium mb-0.5 sm:mb-1">
                          {tip.title}
                        </h3>
                        <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                          {tip.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="relative hidden sm:block">
                <div className="aspect-square rounded-3xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 rounded-full bg-background/80 backdrop-blur-sm border border-border flex items-center justify-center">
                      <Package className="w-10 h-10 sm:w-12 sm:h-12 text-primary" strokeWidth={1} />
                    </div>
                    <p className="font-display text-xl sm:text-2xl font-medium mb-2">Reuse</p>
                    <p className="font-display text-3xl sm:text-5xl font-medium text-primary mb-2">Multiple Times</p>
                    <p className="text-muted-foreground text-sm">with proper care & storage</p>
                  </div>
                </div>
                
                {/* Floating decorative elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-accent/10 rounded-full blur-2xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-12 sm:py-20 md:py-28 scroll-mt-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10 sm:mb-16">
              <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 mb-4 sm:mb-6">
                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                <span className="text-xs sm:text-sm font-medium text-primary">Common Questions</span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-medium mb-3 sm:mb-4">
                Troubleshooting FAQ
              </h2>
              <p className="text-muted-foreground text-base sm:text-lg px-2">
                Got questions? We've got answers to the most common press-on nail concerns.
              </p>
            </div>

            <Accordion type="single" collapsible className="space-y-3 sm:space-y-4">
              {faqItems.map((item, index) => (
                <AccordionItem 
                  key={index} 
                  value={`faq-${index}`}
                  className="group bg-muted/30 rounded-xl sm:rounded-2xl border-none px-4 sm:px-6 hover:bg-muted/50 transition-colors data-[state=open]:bg-muted/50"
                >
                  <AccordionTrigger className="text-left font-display text-sm sm:text-base md:text-lg hover:no-underline py-4 sm:py-6 group-hover:text-primary transition-colors">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="pb-4 sm:pb-6 text-muted-foreground text-sm sm:text-base leading-relaxed">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-20 md:py-28 bg-gradient-to-br from-primary/5 via-background to-accent/5 relative overflow-hidden">
        {/* Decorative elements - hidden on mobile */}
        <div className="hidden sm:block absolute top-0 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="hidden sm:block absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="bg-background/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 border border-border shadow-xl">
              <div className="text-center">
                <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 mb-4 sm:mb-6">
                  <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                  <span className="text-xs sm:text-sm font-medium text-primary">Ready to Start?</span>
                </div>
                
                <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium mb-3 sm:mb-4">
                  Get Your Perfect Fit
                </h2>
                <p className="text-muted-foreground text-sm sm:text-base md:text-lg mb-6 sm:mb-8 max-w-xl mx-auto">
                  Find your perfect size with our fit guide, then browse our collection for your next stunning set.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                  <Link 
                    to="/account/perfect-fit" 
                    className="group inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 sm:px-8 py-3 sm:py-4 rounded-full text-sm sm:text-base font-medium hover:bg-primary/90 transition-all duration-300"
                  >
                    Find Your Fit
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link 
                    to="/shop" 
                    className="inline-flex items-center justify-center gap-2 bg-background border-2 border-border px-6 sm:px-8 py-3 sm:py-4 rounded-full text-sm sm:text-base font-medium hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
                  >
                    Shop Collection
                  </Link>
                </div>
                
                {/* Trust badges */}
                <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-6 mt-6 sm:mt-10 pt-6 sm:pt-8 border-t border-border">
                  <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-muted-foreground">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                    Free shipping over $50
                  </div>
                  <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-muted-foreground">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                    Satisfaction guaranteed
                  </div>
                  <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-muted-foreground">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                    24/7 support
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HowTo;
