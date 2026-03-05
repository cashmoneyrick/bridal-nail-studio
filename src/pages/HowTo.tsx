import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Ruler, Hand, Wrench, Droplets, Heart, ChevronRight } from "lucide-react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const categories = [
  {
    title: "I Don't Know My Size",
    description: "Find your perfect fit before ordering",
    path: "/how-to/sizing",
    gridArea: "sizing",
    isPrimary: true,
    icon: Ruler,
    iconBg: "from-secondary/50 to-secondary/15",
    accentBorder: "border-t-2 border-secondary/50",
  },
  {
    title: "Applying for the First Time",
    description: "Step-by-step for a flawless, long-lasting manicure",
    path: "/how-to/application",
    gridArea: "applying",
    icon: Hand,
    iconBg: "from-primary/25 to-primary/5",
    accentBorder: "border-t-2 border-primary/30",
  },
  {
    title: "Troubleshooting",
    description: "Quick fixes for the most common problems",
    path: "/how-to/troubleshooting",
    gridArea: "troubleshooting",
    icon: Wrench,
    iconBg: "from-accent/40 to-accent/10",
    accentBorder: "border-t-2 border-accent/40",
  },
  {
    title: "Removing Your Set",
    description: "Remove safely — no damage to your natural nails",
    path: "/how-to/removal",
    gridArea: "removal",
    icon: Droplets,
    iconBg: "from-secondary/40 to-primary/8",
    accentBorder: "border-t-2 border-secondary/40",
  },
  {
    title: "Prepping for My Wedding",
    description: "Wedding-day timeline and emergency checklist",
    path: "/how-to/bridal",
    gridArea: "bridal",
    icon: Heart,
    iconBg: "from-primary/20 to-secondary/15",
    accentBorder: "border-t-2 border-primary/25",
  },
];

const journeySteps = categories.filter(c => c.gridArea !== 'bridal');
const specialCard = categories.find(c => c.gridArea === 'bridal')!;

const faqCategories = [
  {
    label: "Application & Wear",
    items: [
      {
        question: "How long do press-on nails last?",
        answer: "About 1 week with adhesive tabs, or up to 2 weeks with nail glue.",
      },
      {
        question: "How long does it take to apply them?",
        answer: "About 10 minutes for a full set.",
      },
      {
        question: "Will they damage my natural nails?",
        answer: "No — when applied and removed correctly, press-ons are much gentler than acrylics or gel.",
      },
      {
        question: "Can I shower, wash dishes, or swim with them?",
        answer: "Yes! Just avoid soaking your hands in hot water for the first hour after application. Brief water exposure is fine — prolonged soaking can weaken the adhesive.",
      },
      {
        question: "What's the difference between adhesive tabs and nail glue?",
        answer: "Tabs are gentler and easier to remove (last ~1 week). Glue gives a stronger hold (up to 2 weeks) but requires more care during removal.",
      },
    ],
  },
  {
    label: "Sizing & Fit",
    items: [
      {
        question: "How do I find my size?",
        answer: "Order our Perfect Fit sizing kit — your first one is FREE with any nail set purchase. You can also measure your nails at their widest point in millimeters.",
      },
      {
        question: "What if a nail doesn't fit perfectly?",
        answer: "Press-ons can be gently filed on the sides for a custom fit.",
      },
      {
        question: "Do you offer different shapes and lengths?",
        answer: "Yes! We offer multiple shapes and lengths — you choose during checkout.",
      },
    ],
  },
  {
    label: "Custom Orders",
    items: [
      {
        question: "How does a custom order work?",
        answer: "Use our Custom Studio to share your inspiration, pick your preferences, and we'll handcraft your set.",
      },
      {
        question: "How long does a custom set take?",
        answer: "Typically 5–7 business days since every set is handmade.",
      },
      {
        question: "Can I send my own design inspiration?",
        answer: "Absolutely — that's what we're here for. Send us reference photos and we'll bring your vision to life.",
      },
    ],
  },
  {
    label: "Care & Reuse",
    items: [
      {
        question: "Can I reuse my press-on nails?",
        answer: "Yes, if you use adhesive tabs and remove them carefully. Clean off any residue and store them in the original box.",
      },
      {
        question: "How do I remove them safely?",
        answer: "Soak in warm soapy water for 5–10 minutes, then gently lift from the sides. Never peel or force them off.",
      },
    ],
  },
];

const HowTo = () => {
  const faqHeaderRef = useScrollReveal();
  const faqContentRef = useScrollReveal();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-12 md:pt-40 md:pb-16">
        <div className="container mx-auto px-6 text-center">
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-foreground mb-5">
            What do you need help with today?
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-xl mx-auto">
            Select a topic and we'll guide you through it.
          </p>
        </div>
      </section>

      {/* Category Grid */}
      <section className="pb-24 md:pb-32">
        <div className="container mx-auto px-6">

          {/* Mobile: Journey framing */}
          <div className="lg:hidden">
            {/* Numbered journey steps */}
            {journeySteps.map((category, index) => {
              const Icon = category.icon;
              const isLast = index === journeySteps.length - 1;
              return (
                <div key={category.path}>
                  <Link to={category.path} className="group block">
                    <div className="bg-secondary/10 border border-border/50 rounded-2xl p-5 flex items-center gap-4 transition-all duration-300 hover:shadow-md hover:border-border">
                      {/* Step number + icon stacked */}
                      <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
                        <span className="text-[11px] font-medium text-muted-foreground/70 uppercase tracking-widest leading-none">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${category.iconBg} flex items-center justify-center border border-border/20`}>
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                      </div>
                      {/* Text */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-display text-base text-foreground group-hover:text-primary transition-colors leading-snug mb-1">
                          {category.title}
                        </h3>
                        <p className="text-xs text-muted-foreground leading-snug">{category.description}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground/40 flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </Link>
                  {!isLast && (
                    <div className="flex justify-start pl-[30px] py-0.5">
                      <div className="border-l-2 border-dashed border-border/40 h-4" />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Special occasion divider */}
            <div className="flex items-center gap-3 py-1">
              <div className="h-px flex-1 bg-border/40" />
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Special occasion</span>
              <div className="h-px flex-1 bg-border/40" />
            </div>

            {/* Bridal special card */}
            {(() => {
              const Icon = specialCard.icon;
              return (
                <Link to={specialCard.path} className="group block">
                  <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 flex items-center gap-4 transition-all duration-300 hover:shadow-md hover:border-primary/40">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${specialCard.iconBg} flex items-center justify-center flex-shrink-0 border border-primary/15`}>
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display text-base text-foreground group-hover:text-primary transition-colors leading-snug mb-1">
                        {specialCard.title}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-snug">{specialCard.description}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground/40 flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              );
            })()}
          </div>

          {/* Desktop: Bento Grid */}
          <div
            className="hidden lg:grid gap-5"
            style={{
              gridTemplateColumns: '1fr 1fr',
              gridTemplateRows: 'auto auto auto',
              gridTemplateAreas: `
                "sizing applying"
                "sizing troubleshooting"
                "removal bridal"
              `,
            }}
          >
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Link
                  key={category.path}
                  to={category.path}
                  className="group block"
                  style={{ gridArea: category.gridArea }}
                >
                  <div className={`h-full bg-secondary/10 border border-border/50 ${category.accentBorder} rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-border flex flex-col`}>
                    {/* Icon Area */}
                    <div
                      className={`flex-1 bg-gradient-to-br ${category.iconBg} flex items-center justify-center ${category.isPrimary ? 'min-h-[260px]' : 'min-h-[130px]'}`}
                    >
                      <Icon
                        className={`text-primary/60 transition-transform duration-300 group-hover:scale-110 ${category.isPrimary ? 'w-20 h-20' : 'w-14 h-14'}`}
                      />
                    </div>
                    {/* Text Area */}
                    <div className={`${category.isPrimary ? 'p-7' : 'p-5'} flex items-start justify-between gap-3`}>
                      <div>
                        <h3 className={`font-display text-foreground group-hover:text-primary transition-colors mb-1.5 ${category.isPrimary ? 'text-2xl' : 'text-lg'}`}>
                          {category.title}
                        </h3>
                        <p className={`text-muted-foreground leading-relaxed ${category.isPrimary ? 'text-sm' : 'text-xs'}`}>
                          {category.description}
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground/40 flex-shrink-0 mt-1 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 sm:py-28 lg:py-32 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">

          {/* Editorial section header */}
          <div ref={faqHeaderRef} className="reveal mb-12 sm:mb-16 max-w-3xl mx-auto">
            <div className="flex items-center gap-5 mb-8">
              <div className="flex-1 h-px bg-border/40" />
              <p className="text-[10px] font-semibold tracking-[0.35em] uppercase text-muted-foreground/50 shrink-0">
                FAQ
              </p>
              <div className="flex-1 h-px bg-border/40" />
            </div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-medium text-foreground text-center">
              <span className="italic font-light text-foreground/60">Your</span>{" "}
              Questions, Answered
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base text-center mt-4 max-w-md mx-auto">
              Everything you need to know about your press-on nails
            </p>
          </div>

          {/* Accordion content */}
          <div ref={faqContentRef} className="reveal max-w-2xl mx-auto">
            {faqCategories.map((category, catIndex) => (
              <div key={category.label} className={catIndex > 0 ? "mt-10" : ""}>
                <div className="flex items-center gap-4 mb-4">
                  <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-muted-foreground/50 shrink-0">
                    {category.label}
                  </p>
                  <div className="flex-1 h-px bg-border/30" />
                </div>
                <Accordion type="single" collapsible className="space-y-2.5">
                  {category.items.map((faq, index) => (
                    <AccordionItem
                      key={`${category.label}-${index}`}
                      value={`${category.label}-${index}`}
                      className="bg-card rounded-2xl px-6 border border-border/40 transition-all duration-300 data-[state=open]:border-primary/20 data-[state=open]:bg-card/80 data-[state=open]:shadow-sm"
                    >
                      <AccordionTrigger className="font-display text-base text-foreground hover:no-underline py-5 text-left">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground pb-5 text-sm leading-relaxed">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>

        </div>
      </section>

    </div>
  );
};

export default HowTo;
