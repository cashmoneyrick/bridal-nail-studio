import { useState } from "react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Ruler, Hand, Wrench, Droplets, Heart, ArrowRight, Sparkles, PaintBucket, Scissors, RotateCcw } from "lucide-react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useScrollReveal } from "@/hooks/useScrollReveal";

import cherryBlossom from "@/assets/cherry-blossom.jpeg";
import roseQuartzDreams from "@/assets/rose-quartz-dreams.jpeg";
import midnightLuxe from "@/assets/midnight-luxe.jpeg";
import frenchElegance from "@/assets/french-elegance.jpeg";
import heroDesktop from "@/assets/hero-desktop.jpeg";

const guides = [
  {
    title: "I Don't Know My Size",
    preview: "Our free sizing kit takes the guesswork out of ordering. Measure once, get a perfect fit every time — no salon visit needed.",
    path: "/how-to/sizing",
    icon: Ruler,
    image: cherryBlossom,
  },
  {
    title: "Applying for the First Time",
    preview: "Ten minutes to a flawless manicure. We walk you through prep, placement, and pressing — step by step with pro tips along the way.",
    path: "/how-to/application",
    icon: Hand,
    image: roseQuartzDreams,
  },
  {
    title: "Troubleshooting",
    preview: "Lifting edges, bubbles, or a nail that popped off? Quick fixes for the five most common issues — no need to start over.",
    path: "/how-to/troubleshooting",
    icon: Wrench,
    image: midnightLuxe,
  },
  {
    title: "Removing Your Set",
    preview: "Three gentle removal methods that protect your natural nails. Oil, water, or acetone — pick the one that works for your routine.",
    path: "/how-to/removal",
    icon: Droplets,
    image: frenchElegance,
  },
  {
    title: "Prepping for My Wedding",
    preview: "A complete wedding-day nail timeline — from your trial set 3 months out to your emergency touch-up kit on the big day.",
    path: "/how-to/bridal",
    icon: Heart,
    image: heroDesktop,
    isBridal: true,
  },
];

const faqCategories = [
  {
    id: "application",
    label: "Application & Wear",
    icon: Hand,
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
    id: "sizing",
    label: "Sizing & Fit",
    icon: Ruler,
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
    id: "custom",
    label: "Custom Orders",
    icon: PaintBucket,
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
    id: "care",
    label: "Care & Reuse",
    icon: RotateCcw,
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
  const faqRef = useScrollReveal();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* ─── Hero Section ─── */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-20 overflow-hidden">
        {/* Ambient blur blooms */}
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-secondary/20 blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full bg-primary/[0.12] blur-[80px] pointer-events-none" />

        <div className="container mx-auto px-6 text-center relative z-10">
          {/* Rule-flanked eyebrow */}
          <div className="animate-stagger-1 flex items-center justify-center gap-5 mb-8">
            <div className="w-12 h-px bg-border/60" />
            <p className="text-[10px] font-semibold tracking-[0.35em] uppercase text-muted-foreground/50">
              How To Guides
            </p>
            <div className="w-12 h-px bg-border/60" />
          </div>

          {/* Editorial heading */}
          <h1 className="animate-stagger-2 font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-foreground mb-5">
            <span className="italic font-light text-foreground/60">Your</span>{" "}
            Guide to Perfect Nails
          </h1>

          {/* Accent line */}
          <div className="animate-stagger-3 flex justify-center mb-6">
            <div className="w-12 h-px bg-primary/40" />
          </div>

          {/* Subtitle */}
          <p className="animate-stagger-3 text-muted-foreground text-lg md:text-xl max-w-xl mx-auto mb-8">
            Select a topic and we'll guide you through it
          </p>

          {/* Editorial badge */}
          <div className="animate-stagger-4 flex items-center justify-center gap-3">
            <div className="w-8 h-px bg-border/40" />
            <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-muted-foreground/40">
              Step-by-Step — Beginner Friendly
            </p>
            <div className="w-8 h-px bg-border/40" />
          </div>
        </div>
      </section>

      {/* ─── Editorial Scroll Guide Sections ─── */}
      <section className="pt-12 md:pt-16 pb-24 md:pb-32">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto space-y-16 md:space-y-24">
            {guides.map((guide, index) => {
              const Icon = guide.icon;
              const isReversed = index % 2 === 1;

              return (
                <GuideSection
                  key={guide.path}
                  guide={guide}
                  Icon={Icon}
                  isReversed={isReversed}
                  index={index}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── FAQ Section — Tabbed ─── */}
      <section className="py-20 sm:py-28 lg:py-32 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">

          {/* Editorial section header */}
          <div ref={faqRef} className="reveal mb-12 sm:mb-16 max-w-3xl mx-auto">
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

          {/* Tabbed FAQ */}
          <div className="max-w-2xl mx-auto">
            <Tabs defaultValue="application">
              <TabsList className="w-full h-auto flex flex-wrap gap-1 bg-muted/30 rounded-xl p-1.5 mb-8">
                {faqCategories.map((cat) => {
                  const CatIcon = cat.icon;
                  return (
                    <TabsTrigger
                      key={cat.id}
                      value={cat.id}
                      className="flex-1 min-w-[120px] flex items-center justify-center gap-1.5 rounded-lg px-3 py-2.5 text-xs font-medium transition-all data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-primary/60 whitespace-nowrap"
                    >
                      <CatIcon className="w-3.5 h-3.5 shrink-0" />
                      <span className="hidden sm:inline">{cat.label}</span>
                      <span className="sm:hidden">{cat.label.split(' ')[0]}</span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              {faqCategories.map((cat) => (
                <TabsContent key={cat.id} value={cat.id}>
                  <Accordion type="single" collapsible className="space-y-2.5">
                    {cat.items.map((faq, faqIndex) => (
                      <AccordionItem
                        key={`${cat.id}-${faqIndex}`}
                        value={`${cat.id}-${faqIndex}`}
                        className="bg-card rounded-2xl px-6 border border-border/40 transition-all duration-300 data-[state=open]:border-l-primary/40 data-[state=open]:border-l-2 data-[state=open]:bg-card/80 data-[state=open]:shadow-sm"
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
                </TabsContent>
              ))}
            </Tabs>
          </div>

        </div>
      </section>

    </div>
  );
};

/* ─── Guide Section Component ─── */

interface GuideSectionProps {
  guide: typeof guides[number];
  Icon: React.ElementType;
  isReversed: boolean;
  index: number;
}

const GuideSection = ({ guide, Icon, isReversed, index }: GuideSectionProps) => {
  const sectionRef = useScrollReveal();

  return (
    <div ref={sectionRef} className="reveal">
      {/* Bridal gets a subtle "Special Occasion" divider */}
      {guide.isBridal && (
        <div className="flex items-center gap-3 mb-8">
          <div className="h-px flex-1 bg-border/40" />
          <span className="text-[10px] text-muted-foreground/60 uppercase tracking-widest font-medium">
            Special Occasion
          </span>
          <div className="h-px flex-1 bg-border/40" />
        </div>
      )}

      <Link to={guide.path} className="group block">
        <div
          className={`flex flex-col lg:flex-row gap-8 lg:gap-12 items-center ${
            isReversed ? 'lg:flex-row-reverse' : ''
          } ${guide.isBridal ? 'bg-primary/[0.03] border border-primary/10 rounded-2xl p-6 lg:p-8' : ''}`}
        >
          {/* Image */}
          <div className="w-full lg:w-1/2 flex-shrink-0">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-muted">
              <img
                src={guide.image}
                alt={guide.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>

          {/* Text */}
          <div className="w-full lg:w-1/2">
            {/* Icon + step label */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Icon className="w-5 h-5 text-primary/70" />
              </div>
              {guide.isBridal ? (
                <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-primary/50">
                  Wedding Day
                </span>
              ) : (
                <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-muted-foreground/50">
                  Guide {String(index + 1).padStart(2, '0')}
                </span>
              )}
            </div>

            {/* Title */}
            <h3 className="font-display text-2xl sm:text-3xl text-foreground group-hover:text-primary transition-colors mb-3">
              {guide.title}
            </h3>

            {/* Preview */}
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-6">
              {guide.preview}
            </p>

            {/* CTA */}
            <span className="inline-flex items-center gap-2 text-sm font-medium text-primary group-hover:gap-3 transition-all">
              Read Guide
              <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default HowTo;
