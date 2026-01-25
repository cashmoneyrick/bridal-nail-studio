import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import NailClubSignup from "@/components/NailClubSignup";
import { Sparkles, Tag, Gift, Cake, Heart, Package, Check, Star } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const benefits = [
  { icon: Sparkles, title: "Early Access", description: "Be first to shop new collections before anyone else" },
  { icon: Tag, title: "Member Pricing", description: "Enjoy 10-20% off all your favorite nail sets" },
  { icon: Cake, title: "Birthday Surprise", description: "Get a special gift during your birthday month" },
  { icon: Gift, title: "Exclusive Drops", description: "Members-only designs you won't find anywhere else" },
];

const tiers = [
  {
    name: "Nail Lover",
    price: "Free",
    period: "forever",
    features: [
      "10% off orders $50+",
      "Early access to new releases",
      "Members-only newsletter",
    ],
    cta: "Sign Up Free",
    ctaLink: "/auth",
    icon: Heart,
    launching: false,
  },
  {
    name: "Nail Obsessed",
    price: "$19.99",
    period: "/month",
    features: [
      "20% off everything",
      "Free shipping on all orders",
      "Monthly nail drop",
      "Birthday surprise",
      "Priority support",
    ],
    cta: "Join Waitlist",
    ctaLink: null,
    icon: Package,
    launching: true,
  },
];

const faqs = [
  {
    question: "What is the Nail Drop Club?",
    answer: "The Nail Drop Club is our membership program with two tiers: Nail Lover (free with any account) gives you 10% off orders $50+ and early access to new releases. Nail Obsessed ($19.99/month) adds 20% off everything, free shipping, monthly nail drops, and more!",
  },
  {
    question: "What do I get with the free Nail Lover tier?",
    answer: "Nail Lover members get 10% off all orders $50 or more, early access to new releases via email, and our members-only newsletter with exclusive tips and previews.",
  },
  {
    question: "When does Nail Obsessed launch?",
    answer: "Nail Obsessed is launching soon! Sign up for the free Nail Lover tier or join our email list to be the first to know when the premium tier goes live.",
  },
  {
    question: "Do my discounts stack with sale prices?",
    answer: "Member discounts apply to full-price items. During sales, you'll automatically receive whichever discount is greater—your member discount or the sale price.",
  },
];

const NailClub = () => {
  const scrollToSignup = () => {
    document.getElementById('signup')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section
        id="signup"
        className="relative min-h-[85vh] flex items-center justify-center py-24 px-4"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/30 to-accent/20" />

        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium tracking-wide uppercase mb-6">
            Exclusive Membership
          </span>

          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-foreground mb-4">
            The Nail Drop Club
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-lg mx-auto mb-10">
            Get early access to new designs, exclusive member pricing, and special perks reserved just for you.
          </p>

          <NailClubSignup />

          <p className="text-sm text-muted-foreground mt-6">
            Join 2,000+ nail lovers
          </p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 sm:py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl text-foreground mb-3">
              Member Perks
            </h2>
            <p className="text-muted-foreground">
              Rewards that make every set feel special
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="bg-card p-6 rounded-3xl border border-border/50"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <benefit.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display text-lg text-foreground mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="py-20 sm:py-24 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl text-foreground mb-3">
              Choose Your Plan
            </h2>
            <p className="text-muted-foreground">
              Start free, upgrade when you're ready
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`relative bg-card rounded-3xl p-8 border ${
                  tier.launching
                    ? "border-primary/30"
                    : "border-border/50"
                }`}
              >
                {tier.launching && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1.5 bg-primary text-primary-foreground text-xs font-semibold rounded-full inline-flex items-center gap-1.5">
                      <Star className="w-3 h-3" />
                      Launching Soon
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    tier.launching ? 'bg-primary/10' : 'bg-secondary/50'
                  }`}>
                    <tier.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-display text-xl text-foreground">{tier.name}</h3>
                </div>

                <div className="mb-6">
                  <span className="text-4xl font-display text-foreground">{tier.price}</span>
                  <span className="text-muted-foreground text-sm ml-1">{tier.period}</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {tier.ctaLink ? (
                  <Link to={tier.ctaLink}>
                    <Button className="w-full rounded-full" size="lg">
                      {tier.cta}
                    </Button>
                  </Link>
                ) : (
                  <Button
                    className="w-full rounded-full"
                    size="lg"
                    variant="outline"
                    onClick={scrollToSignup}
                  >
                    {tier.cta}
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 sm:py-24 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl text-foreground mb-3">
              Questions?
            </h2>
            <p className="text-muted-foreground">
              Everything you need to know about the club
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card rounded-2xl px-6 border border-border/50"
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
      </section>

      <Footer />
    </div>
  );
};

export default NailClub;
