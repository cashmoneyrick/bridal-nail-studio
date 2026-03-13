import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import NailClubSignup from "@/components/NailClubSignup";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Button } from "@/components/ui/button";
import { Sparkles, Gift, Tag, Palette, ArrowRight } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { sampleProducts } from "@/lib/products";

/* ─── Data ────────────────────────────────────────────────────────── */

const benefitBadges = [
  "Early Access",
  "10% Off",
  "Birthday Gift",
  "Exclusive Drops",
];

const perks = [
  {
    title: "Early Access",
    description:
      "New collections land in your inbox before anyone else. Shop first, never miss a drop.",
    icon: Sparkles,
    accent: "bg-primary/10",
  },
  {
    title: "Member Pricing",
    description:
      "10–20% off every set, every time. Because loyalty deserves to be rewarded.",
    icon: Tag,
    accent: "bg-secondary/15",
  },
  {
    title: "Birthday Surprise",
    description:
      "A special gift arrives during your birthday month — our way of celebrating you.",
    icon: Gift,
    accent: "bg-accent/15",
  },
  {
    title: "Exclusive Drops",
    description:
      "Members-only designs you won't find anywhere else. Limited runs, made for you.",
    icon: Palette,
    accent: "bg-primary/8",
  },
];

const memberQuotes = [
  {
    quote: "I always get the new drops before they sell out.",
    name: "Taylor R.",
  },
  {
    quote: "The birthday surprise was the sweetest touch.",
    name: "Priya K.",
  },
  {
    quote: "My friends always ask where I get my nails.",
    name: "Maya S.",
  },
];

const faqs = [
  {
    question: "What is the Nail Drop Club?",
    answer:
      "The Nail Drop Club is our free membership program. Members enjoy 10% off orders $50+, early access to new releases, and our members-only newsletter packed with exclusive tips and sneak peeks.",
  },
  {
    question: "What do I get as a member?",
    answer:
      "Early access to new collections, 10% off all orders $50 or more, birthday month surprises, and exclusive members-only designs you won't find anywhere else.",
  },
  {
    question: "Do my discounts stack with sale prices?",
    answer:
      "Member discounts apply to full-price items. During sales, you'll automatically receive whichever discount is greater — your member discount or the sale price.",
  },
];

/* ─── Component ───────────────────────────────────────────────────── */

const NailClub = () => {
  const heroRef = useRef<HTMLElement>(null);
  const [showFloatingBtn, setShowFloatingBtn] = useState(false);
  const socialProofRef = useScrollReveal();
  const perksRef = useScrollReveal();
  const perksCardsRef = useScrollReveal();
  const showcaseRef = useScrollReveal();
  const showcaseGridRef = useScrollReveal();
  const faqRef = useScrollReveal();

  // Floating button visibility — show when hero is out of view
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowFloatingBtn(!entry.isIntersecting);
      },
      { threshold: 0 }
    );

    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* ═══════════════════════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
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

              {/* Benefit badges */}
              <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
                {benefitBadges.map((badge) => (
                  <span
                    key={badge}
                    className="border border-primary/20 rounded-full text-xs text-muted-foreground/70 px-3 py-1"
                  >
                    {badge}
                  </span>
                ))}
              </div>

              <p className="text-center text-sm text-muted-foreground/60 mt-4 tracking-wide">
                Join 2,000+ nail lovers
              </p>
            </div>
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SOCIAL PROOF — Editorial Quote Strip
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-20 bg-background relative overflow-hidden">
        {/* Subtle accent line top */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-12 bg-gradient-to-b from-transparent via-primary/20 to-transparent" />

        <div
          ref={socialProofRef}
          className="reveal container mx-auto px-4 sm:px-6 lg:px-8"
        >
          {/* Flanked eyebrow */}
          <div className="flex items-center justify-center gap-5 mb-10 sm:mb-12">
            <div className="w-12 h-px bg-border/40" />
            <p className="text-[10px] font-semibold tracking-[0.35em] uppercase text-muted-foreground/50">
              From Our Members
            </p>
            <div className="w-12 h-px bg-border/40" />
          </div>

          {/* Quotes */}
          <div className="flex flex-col md:flex-row items-stretch justify-center gap-10 md:gap-0 max-w-4xl mx-auto">
            {memberQuotes.map((item, index) => (
              <div key={index} className="flex items-center">
                {/* Vertical divider (desktop) */}
                {index > 0 && (
                  <div className="hidden md:block w-px self-stretch mx-10 bg-gradient-to-b from-transparent via-border/40 to-transparent" />
                )}
                {/* Horizontal divider (mobile) */}
                {index > 0 && (
                  <div className="md:hidden w-16 h-px bg-border/30 absolute left-1/2 -translate-x-1/2 -mt-5" />
                )}
                <div className="text-center md:text-left max-w-[260px] mx-auto md:mx-0">
                  {/* Decorative open quote */}
                  <span
                    className="block font-display text-3xl leading-none text-primary/20 mb-2 select-none"
                    aria-hidden="true"
                  >
                    &ldquo;
                  </span>
                  <p className="font-display italic text-base sm:text-lg text-foreground/80 leading-relaxed mb-3">
                    {item.quote}
                  </p>
                  <p className="text-xs font-medium tracking-wider uppercase text-muted-foreground/40">
                    {item.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          PERKS — Icon-forward 2×2 card grid
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-20 bg-background">
        <div
          ref={perksRef}
          className="reveal container mx-auto px-4 sm:px-6 lg:px-8"
        >
          {/* Section header */}
          <div className="mb-12 sm:mb-16">
            <div className="flex items-center gap-5 mb-8">
              <div className="flex-1 h-px bg-border/40" />
              <p className="text-[10px] font-semibold tracking-[0.35em] uppercase text-muted-foreground/50 shrink-0">
                Member Perks
              </p>
              <div className="flex-1 h-px bg-border/40" />
            </div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-medium text-foreground text-center">
              <span className="italic font-light text-foreground/60">Why</span>{" "}
              Join the Club
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base text-center mt-4 max-w-md mx-auto">
              Rewards that make every set feel special
            </p>
          </div>

          {/* 2×2 card grid */}
          <div
            ref={perksCardsRef}
            className="reveal-children grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 max-w-3xl mx-auto"
          >
            {perks.map((perk, index) => {
              const Icon = perk.icon;
              return (
                <div
                  key={perk.title}
                  className="group relative rounded-2xl p-6 sm:p-7 transition-all duration-500 hover:-translate-y-0.5 border border-border/30 hover:border-primary/25 bg-gradient-to-br from-card via-card to-secondary/5 hover:shadow-[0_8px_30px_-12px_rgba(107,76,59,0.12)]"
                >
                  {/* Subtle top accent line */}
                  <div className="absolute top-0 left-6 right-6 sm:left-7 sm:right-7 h-px bg-gradient-to-r from-transparent via-primary/15 to-transparent group-hover:via-primary/30 transition-all duration-500" />

                  {/* Number + Icon row */}
                  <div className="flex items-center justify-between mb-5">
                    <span className="font-display text-2xl sm:text-3xl font-light text-primary/15 leading-none select-none">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-primary/[0.06] group-hover:bg-primary/[0.10] flex items-center justify-center transition-colors duration-500">
                      <Icon className="w-[18px] h-[18px] text-primary/50 group-hover:text-primary/70 transition-colors duration-500" />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="font-display text-lg sm:text-xl font-medium text-foreground mb-2.5 tracking-[-0.01em]">
                    {perk.title}
                  </h3>

                  {/* Description */}
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {perk.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Premium tier teaser */}
          <div className="mt-10 sm:mt-12 max-w-3xl mx-auto">
            <div className="relative rounded-2xl border border-dashed border-primary/20 bg-gradient-to-r from-primary/[0.03] via-transparent to-primary/[0.03] px-6 sm:px-8 py-5 sm:py-6 flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
              {/* Left: "Coming Soon" badge */}
              <span className="shrink-0 inline-block px-3 py-1 rounded-full border border-primary/20 text-[10px] font-semibold tracking-[0.25em] uppercase text-primary/60">
                Coming Soon
              </span>

              {/* Center: Tier name + perks */}
              <div className="text-center sm:text-left flex-1 min-w-0">
                <p className="font-display text-lg sm:text-xl font-medium text-foreground/80 tracking-[-0.01em]">
                  Nail Obsessed
                </p>
                <p className="text-sm text-muted-foreground/50 mt-0.5">
                  20% off · Free shipping · Monthly drops
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          MEMBER FAVORITES SHOWCASE
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-20 bg-background">
        <div
          ref={showcaseRef}
          className="reveal container mx-auto px-4 sm:px-6 lg:px-8"
        >
          {/* Section header */}
          <div className="mb-12 sm:mb-16">
            <div className="flex items-center gap-5 mb-8">
              <div className="flex-1 h-px bg-border/40" />
              <p className="text-[10px] font-semibold tracking-[0.35em] uppercase text-muted-foreground/50 shrink-0">
                Members First
              </p>
              <div className="flex-1 h-px bg-border/40" />
            </div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-medium text-foreground text-center">
              <span className="italic font-light text-foreground/60">What</span>{" "}
              You Get First
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base text-center mt-4 max-w-md mx-auto">
              These sets dropped to members before anyone else
            </p>
          </div>

          {/* Product grid — desktop: 4-col, tablet: 2x2, mobile: horizontal scroll */}
          <div
            ref={showcaseGridRef}
            className="reveal-children flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:overflow-visible sm:snap-none sm:pb-0 max-w-5xl mx-auto -mx-4 px-4 sm:mx-auto sm:px-0"
          >
            {sampleProducts.map((product) => (
              <Link
                key={product.id}
                to={`/shop/${product.handle}`}
                className="group flex-shrink-0 w-[220px] sm:w-auto snap-start"
              >
                {/* Image container */}
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-muted mb-3">
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Early Access badge */}
                  <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full">
                    Early Access
                  </span>
                </div>
                {/* Text */}
                <h3 className="font-display text-base font-medium text-foreground group-hover:text-primary transition-colors">
                  {product.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  ${product.price.toFixed(2)}
                </p>
              </Link>
            ))}
          </div>

          {/* Browse CTA */}
          <div className="text-center mt-8">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:gap-3 transition-all"
            >
              Browse the full collection
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          FAQ
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-20 bg-background">
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
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          FLOATING "JOIN FREE" BUTTON
      ═══════════════════════════════════════════════════════════ */}
      <Button
        onClick={() =>
          document.getElementById("signup")?.scrollIntoView({ behavior: "smooth" })
        }
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-40 rounded-full shadow-lg transition-opacity duration-300 ${
          showFloatingBtn ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        size="lg"
      >
        Join Free
      </Button>

    </div>
  );
};

export default NailClub;
