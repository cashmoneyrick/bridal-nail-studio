import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import NailClubSignup from "@/components/NailClubSignup";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import {
  Sparkles,
  Gift,
  Heart,
  Package,
  Check,
  Star,
  Mail,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

/* ─── Data ────────────────────────────────────────────────────────── */

const perks = [
  {
    number: "01",
    title: "Early Access",
    description:
      "New collections land in your inbox before anyone else. Shop first, never miss a drop.",
  },
  {
    number: "02",
    title: "Member Pricing",
    description:
      "10–20% off every set, every time. Because loyalty deserves to be rewarded.",
  },
  {
    number: "03",
    title: "Birthday Surprise",
    description:
      "A special gift arrives during your birthday month — our way of celebrating you.",
  },
  {
    number: "04",
    title: "Exclusive Drops",
    description:
      "Members-only designs you won't find anywhere else. Limited runs, made for you.",
  },
];

const journeySteps = [
  {
    step: "01",
    title: "Sign Up Free",
    description:
      "Join the Nail Club with just your email. No credit card, no strings attached.",
    Icon: Mail,
  },
  {
    step: "02",
    title: "Unlock Your Perks",
    description:
      "Start enjoying member pricing, early access, and exclusive drops right away.",
    Icon: Gift,
  },
  {
    step: "03",
    title: "Get the VIP Treatment",
    description:
      "Birthday surprises, first dibs on every collection, and designs made just for you.",
    Icon: Sparkles,
  },
];

const freeTierFeatures = [
  "10% off orders $50+",
  "Early access to new releases",
  "Members-only newsletter",
];

const premiumTierFeatures = [
  "20% off everything",
  "Free shipping on all orders",
  "Monthly nail drop",
  "Birthday surprise",
  "Priority support",
];

const testimonials = [
  {
    quote:
      "The early access drops mean I always get the sets I want before they sell out. It feels like having a personal stylist.",
    name: "Sarah M.",
    detail: "Member since 2025",
  },
  {
    quote:
      "The birthday surprise was such a thoughtful touch — it's the little things that make you feel like a VIP.",
    name: "Jessica L.",
    detail: "Nail Obsessed Waitlist",
  },
  {
    quote:
      "Being in the Nail Club feels exclusive without being elitist. The designs are always exactly my vibe.",
    name: "Aisha K.",
    detail: "Member since 2024",
  },
];

const faqs = [
  {
    question: "What is the Nail Drop Club?",
    answer:
      "The Nail Drop Club is our membership program with two tiers. Nail Lover (free) gives you 10% off orders $50+ and early access to new releases. Nail Obsessed ($19.99/month) adds 20% off everything, free shipping, monthly nail drops, birthday surprises, and priority support.",
  },
  {
    question: "What do I get with the free Nail Lover tier?",
    answer:
      "Nail Lover members enjoy 10% off all orders $50 or more, early access to new releases via email, and our members-only newsletter packed with exclusive tips and sneak peeks.",
  },
  {
    question: "When does Nail Obsessed launch?",
    answer:
      "Nail Obsessed is launching soon! Sign up for the free Nail Lover tier or join our email list to be the first to know when the premium tier goes live.",
  },
  {
    question: "Do my discounts stack with sale prices?",
    answer:
      "Member discounts apply to full-price items. During sales, you'll automatically receive whichever discount is greater — your member discount or the sale price.",
  },
];

/* ─── Component ───────────────────────────────────────────────────── */

const NailClub = () => {
  const perksRef = useScrollReveal();
  const perksListRef = useScrollReveal();
  const journeyRef = useScrollReveal();
  const journeyStepsRef = useScrollReveal();
  const journeyStepsMobileRef = useScrollReveal();
  const pricingRef = useScrollReveal();
  const pricingCardsRef = useScrollReveal();
  const testimonialsRef = useScrollReveal();
  const testimonialsCardsRef = useScrollReveal();
  const faqRef = useScrollReveal();
  const ctaRef = useScrollReveal();

  const scrollToSignup = () => {
    document.getElementById("signup")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* ═══════════════════════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════════════════════ */}
      <section
        id="signup"
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Multi-layer gradient mesh */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-background to-secondary/20" />
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 80% 50% at 20% 80%, hsl(var(--secondary) / 0.25), transparent),
              radial-gradient(ellipse 60% 60% at 80% 20%, hsl(var(--accent) / 0.20), transparent),
              radial-gradient(ellipse 70% 40% at 50% 50%, hsl(var(--primary) / 0.10), transparent)
            `,
          }}
        />

        {/* Floating blur orbs */}
        <div className="absolute top-20 left-[10%] w-72 h-72 rounded-full bg-secondary/10 blur-3xl animate-float" />
        <div
          className="absolute bottom-32 right-[8%] w-96 h-96 rounded-full bg-accent/8 blur-3xl animate-float"
          style={{ animationDelay: "1.5s" }}
        />
        <div
          className="absolute top-1/3 right-[20%] w-48 h-48 rounded-full bg-primary/8 blur-2xl animate-float"
          style={{ animationDelay: "0.8s" }}
        />

        {/* Thin decorative side lines — desktop only */}
        <div className="absolute left-8 top-1/4 bottom-1/4 w-px bg-gradient-to-b from-transparent via-primary/20 to-transparent hidden lg:block" />
        <div className="absolute right-8 top-1/3 bottom-1/3 w-px bg-gradient-to-b from-transparent via-accent/15 to-transparent hidden lg:block" />

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="max-w-4xl mx-auto text-center">
            {/* Eyebrow */}
            <div className="animate-stagger-1">
              <span className="inline-block px-5 py-2 border border-primary/20 rounded-full text-[10px] font-semibold tracking-[0.35em] uppercase text-primary/80">
                Members Only
              </span>
            </div>

            {/* Display heading */}
            <h1 className="animate-stagger-2 font-display mt-8 sm:mt-10">
              <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-medium leading-[0.95] text-foreground">
                The Nail
              </span>
              <span className="block text-6xl sm:text-7xl md:text-8xl lg:text-9xl italic font-light text-primary/70 leading-[0.9] -mt-1 sm:-mt-2">
                Drop Club
              </span>
            </h1>

            {/* Subheadline */}
            <div className="animate-stagger-3 mt-8 sm:mt-10">
              <div className="w-12 h-px bg-primary/30 mx-auto mb-6" />
              <p className="text-base sm:text-lg lg:text-xl text-muted-foreground font-light leading-relaxed max-w-lg mx-auto">
                Early access. Exclusive designs. Member-only pricing.
                <br className="hidden sm:block" />
                Your invitation to something special.
              </p>
            </div>

            {/* Signup form */}
            <div className="animate-stagger-4 mt-10 sm:mt-12 max-w-md mx-auto">
              <NailClubSignup />
              <p className="text-center text-sm text-muted-foreground/60 mt-6 tracking-wide">
                Join 2,000+ nail lovers
              </p>
            </div>
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />

        {/* Scroll indicator */}
        <button
          onClick={() =>
            document
              .getElementById("perks")
              ?.scrollIntoView({ behavior: "smooth" })
          }
          className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce"
          aria-label="Scroll down"
        >
          <div className="w-6 h-10 border-2 border-foreground/15 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-foreground/30 rounded-full" />
          </div>
        </button>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          PERKS — Editorial numbered list
      ═══════════════════════════════════════════════════════════ */}
      <section id="perks" className="py-20 sm:py-28 lg:py-32 bg-background">
        <div
          ref={perksRef}
          className="reveal container mx-auto px-4 sm:px-6 lg:px-8"
        >
          {/* Section header */}
          <div className="mb-16 sm:mb-20">
            <div className="flex items-center gap-5 mb-8">
              <div className="flex-1 h-px bg-border/40" />
              <p className="text-[10px] font-semibold tracking-[0.35em] uppercase text-muted-foreground/50 shrink-0">
                Member Perks
              </p>
              <div className="flex-1 h-px bg-border/40" />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 sm:gap-12">
              <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-medium leading-[1.05] shrink-0">
                <span className="italic font-light text-foreground/60">
                  Why
                </span>{" "}
                Join the Club
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base sm:text-right sm:max-w-[240px] sm:pb-1 leading-relaxed">
                Rewards that make every set feel special
              </p>
            </div>
          </div>

          {/* Perks list */}
          <div
            ref={perksListRef}
            className="reveal-children max-w-3xl mx-auto"
          >
            {perks.map((perk, index) => (
              <div
                key={perk.number}
                className={`flex items-start gap-6 sm:gap-10 ${
                  index < perks.length - 1
                    ? "mb-12 sm:mb-16 pb-12 sm:pb-16 border-b border-border/30"
                    : ""
                }`}
              >
                {/* Large decorative number */}
                <span className="font-display text-5xl sm:text-6xl md:text-7xl font-light text-primary/15 leading-none shrink-0 select-none">
                  {perk.number}
                </span>

                {/* Text content */}
                <div className="pt-1 sm:pt-2">
                  <h3 className="font-display text-xl sm:text-2xl md:text-3xl font-medium text-foreground mb-3 leading-tight">
                    {perk.title}
                  </h3>
                  <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-md">
                    {perk.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          HOW IT WORKS — Journey timeline
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-20 sm:py-28 lg:py-32 bg-muted/20 overflow-hidden">
        <div
          ref={journeyRef}
          className="reveal container mx-auto px-4 sm:px-6 lg:px-8"
        >
          {/* Section header — centered */}
          <div className="text-center mb-16 sm:mb-20">
            <p className="text-[10px] font-semibold tracking-[0.35em] uppercase text-muted-foreground/50 mb-6">
              Your Journey
            </p>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-medium text-foreground leading-tight">
              Three steps to
              <span className="italic font-light text-primary/70">
                {" "}
                beautiful
              </span>
            </h2>
          </div>

          {/* Desktop: Horizontal 3-column with connecting line */}
          <div className="hidden md:block">
            <div className="relative max-w-4xl mx-auto">
              {/* Connecting line */}
              <div className="absolute top-6 left-[16.67%] right-[16.67%] h-px bg-border/40" />

              <div
                ref={journeyStepsRef}
                className="reveal-children grid grid-cols-3 gap-8"
              >
                {journeySteps.map((step) => (
                  <div key={step.step} className="text-center">
                    {/* Circle marker */}
                    <div className="w-12 h-12 rounded-full bg-background border-2 border-primary/30 flex items-center justify-center mx-auto mb-6 relative z-10">
                      <step.Icon className="w-5 h-5 text-primary" />
                    </div>
                    <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-muted-foreground/40 mb-3">
                      Step {step.step}
                    </p>
                    <h3 className="font-display text-xl font-medium text-foreground mb-3">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed max-w-[240px] mx-auto">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile: Vertical timeline */}
          <div className="md:hidden">
            <div className="relative pl-12">
              {/* Vertical connecting line */}
              <div className="absolute left-[15px] top-0 bottom-0 w-px bg-border/40" />

              <div
                ref={journeyStepsMobileRef}
                className="reveal-children space-y-10"
              >
                {journeySteps.map((step) => (
                  <div key={step.step} className="relative">
                    {/* Circle marker on the line */}
                    <div className="absolute -left-12 top-0 w-[30px] h-[30px] rounded-full bg-background border-2 border-primary/30 flex items-center justify-center">
                      <step.Icon className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-muted-foreground/40 mb-2">
                      Step {step.step}
                    </p>
                    <h3 className="font-display text-lg font-medium text-foreground mb-2">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          PRICING TIERS
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-20 sm:py-28 lg:py-32 bg-background">
        <div
          ref={pricingRef}
          className="reveal container mx-auto px-4 sm:px-6 lg:px-8"
        >
          {/* Section header */}
          <div className="mb-16 sm:mb-20">
            <div className="flex items-center gap-5 mb-8">
              <div className="flex-1 h-px bg-border/40" />
              <p className="text-[10px] font-semibold tracking-[0.35em] uppercase text-muted-foreground/50 shrink-0">
                Membership Tiers
              </p>
              <div className="flex-1 h-px bg-border/40" />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 sm:gap-12">
              <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-medium leading-[1.05] shrink-0">
                <span className="italic font-light text-foreground/60">
                  Find
                </span>{" "}
                Your Tier
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base sm:text-right sm:max-w-[240px] sm:pb-1 leading-relaxed">
                Start free, upgrade when you're ready
              </p>
            </div>
          </div>

          {/* Pricing cards */}
          <div
            ref={pricingCardsRef}
            className="reveal-children grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto items-start"
          >
            {/* Free Tier — clean, understated */}
            <div className="bg-card rounded-3xl p-8 sm:p-10 border border-border/50">
              <div className="flex items-center gap-3 mb-6">
                <Heart className="w-5 h-5 text-primary/60" />
                <h3 className="font-display text-xl text-foreground">
                  Nail Lover
                </h3>
              </div>

              <div className="mb-8">
                <span className="font-display text-4xl sm:text-5xl text-foreground">
                  Free
                </span>
                <span className="text-muted-foreground text-sm ml-2">
                  forever
                </span>
              </div>

              <div className="h-px bg-border/40 mb-8" />

              <ul className="space-y-4 mb-10">
                {freeTierFeatures.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-primary/60 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground text-sm">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Link to="/auth">
                <Button
                  className="w-full rounded-full"
                  size="lg"
                  variant="outline"
                >
                  Sign Up Free
                </Button>
              </Link>
            </div>

            {/* Premium Tier — elevated, aspirational */}
            <div className="relative">
              {/* Outer glow */}
              <div className="absolute -inset-1 bg-gradient-to-br from-primary/20 via-secondary/15 to-accent/20 rounded-[2rem] blur-sm animate-glow-pulse" />

              <div className="relative bg-card rounded-3xl p-8 sm:p-10 border border-primary/25 shadow-lg">
                {/* Launching Soon badge */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-5 py-1.5 bg-primary text-primary-foreground text-[10px] font-semibold tracking-[0.15em] uppercase rounded-full inline-flex items-center gap-1.5 whitespace-nowrap">
                    <Star className="w-3 h-3" />
                    Launching Soon
                  </span>
                </div>

                <div className="flex items-center gap-3 mb-6 mt-2">
                  <Package className="w-5 h-5 text-primary" />
                  <h3 className="font-display text-xl text-foreground">
                    Nail Obsessed
                  </h3>
                </div>

                <div className="mb-8">
                  <span className="font-display text-4xl sm:text-5xl text-foreground">
                    $19.99
                  </span>
                  <span className="text-muted-foreground text-sm ml-2">
                    /month
                  </span>
                </div>

                <div className="h-px bg-primary/15 mb-8" />

                <ul className="space-y-4 mb-10">
                  {premiumTierFeatures.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-foreground text-sm">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button
                  className="w-full rounded-full"
                  size="lg"
                  onClick={scrollToSignup}
                >
                  Join Waitlist
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          TESTIMONIALS
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-20 sm:py-28 lg:py-32 bg-muted/20">
        <div
          ref={testimonialsRef}
          className="reveal container mx-auto px-4 sm:px-6 lg:px-8"
        >
          {/* Section header — centered */}
          <div className="text-center mb-16 sm:mb-20">
            <p className="text-[10px] font-semibold tracking-[0.35em] uppercase text-muted-foreground/50 mb-6">
              From Our Members
            </p>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-medium text-foreground">
              In their{" "}
              <span className="italic font-light text-primary/70">words</span>
            </h2>
          </div>

          {/* Testimonials grid */}
          <div
            ref={testimonialsCardsRef}
            className="reveal-children grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto"
          >
            {testimonials.map((t, i) => (
              <div
                key={i}
                className={`relative ${i === 1 ? "md:mt-8" : ""}`}
              >
                {/* Oversized decorative quotation mark */}
                <span className="font-display text-7xl sm:text-8xl text-primary/10 leading-none select-none absolute -top-4 -left-2 pointer-events-none">
                  &ldquo;
                </span>

                <div className="bg-card rounded-2xl p-8 border border-border/40 relative">
                  <p className="font-display text-base sm:text-lg text-foreground/90 italic leading-relaxed mb-6">
                    {t.quote}
                  </p>
                  <div className="h-px bg-border/30 mb-4" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {t.name}
                    </p>
                    <p className="text-xs text-muted-foreground/60">
                      {t.detail}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          FAQ
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-20 sm:py-28 lg:py-32 bg-background">
        <div
          ref={faqRef}
          className="reveal container mx-auto px-4 sm:px-6 lg:px-8"
        >
          {/* Section header */}
          <div className="mb-12 sm:mb-16 max-w-3xl mx-auto">
            <div className="flex items-center gap-5 mb-8">
              <div className="flex-1 h-px bg-border/40" />
              <p className="text-[10px] font-semibold tracking-[0.35em] uppercase text-muted-foreground/50 shrink-0">
                FAQ
              </p>
              <div className="flex-1 h-px bg-border/40" />
            </div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-medium text-foreground text-center">
              Questions{" "}
              <span className="italic font-light text-foreground/60">&</span>{" "}
              Answers
            </h2>
          </div>

          <div className="max-w-2xl mx-auto">
            <Accordion type="single" collapsible className="space-y-3">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="bg-card rounded-2xl px-6 border border-border/40 transition-colors duration-300 data-[state=open]:border-primary/20 data-[state=open]:bg-card/80"
                >
                  <AccordionTrigger className="font-display text-base text-foreground hover:no-underline py-5">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-5 text-sm leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          FINAL CTA — Dark band
      ═══════════════════════════════════════════════════════════ */}
      <section className="relative py-24 sm:py-32 overflow-hidden">
        {/* Dark atmospheric background */}
        <div className="absolute inset-0 bg-foreground" />
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 60% 80% at 30% 50%, hsl(var(--primary) / 0.15), transparent),
              radial-gradient(ellipse 50% 60% at 70% 60%, hsl(var(--secondary) / 0.10), transparent)
            `,
          }}
        />

        {/* Decorative floating blur */}
        <div className="absolute top-10 right-[15%] w-64 h-64 rounded-full bg-primary/8 blur-3xl animate-float" />

        <div
          ref={ctaRef}
          className="reveal relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          <div className="w-8 h-px bg-background/20 mx-auto mb-8" />

          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium text-background leading-tight mb-6">
            Ready to join
            <span className="block italic font-light text-primary/80">
              something beautiful?
            </span>
          </h2>

          <p className="text-background/60 text-base sm:text-lg max-w-md mx-auto mb-10 leading-relaxed">
            Sign up today and start enjoying exclusive perks, early access, and
            designs made just for members.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-10 h-12 text-base font-medium min-w-[200px]"
              size="lg"
              onClick={scrollToSignup}
            >
              Join the Club
            </Button>
            <Link
              to="/shop"
              className="text-background/50 hover:text-background/80 text-sm font-medium transition-colors underline underline-offset-4 decoration-background/20 hover:decoration-background/40"
            >
              or browse the shop
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default NailClub;
