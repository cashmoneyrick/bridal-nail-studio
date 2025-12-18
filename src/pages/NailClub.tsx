import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Sparkles, Tag, Gift, Truck, Cake, Star, Check } from "lucide-react";

const benefits = [
  { icon: Sparkles, title: "Early Access", description: "Be first to shop new collections before anyone else" },
  { icon: Tag, title: "Member Pricing", description: "Enjoy 15-20% off every single order" },
  { icon: Gift, title: "Monthly Nail Drops", description: "Surprise mini sets delivered to your door monthly" },
  { icon: Truck, title: "Free Shipping", description: "On all orders, no minimum required" },
  { icon: Cake, title: "Birthday Gift", description: "Free full-size set on your special day" },
  { icon: Star, title: "VIP Support", description: "Priority customer service whenever you need it" },
];

const tiers = [
  {
    name: "Nail Lover",
    price: "Free",
    period: "to join",
    features: [
      "Early access to new releases",
      "10% member discount",
      "Birthday gift",
      "Members-only newsletter",
    ],
    cta: "Join Free",
    popular: false,
  },
  {
    name: "Nail Obsessed",
    price: "$14.99",
    period: "/month",
    features: [
      "Everything in Nail Lover",
      "20% member discount",
      "Free shipping on all orders",
      "Monthly surprise nail set",
      "Early sale access",
    ],
    cta: "Get Started",
    popular: true,
  },
  {
    name: "Nail VIP",
    price: "$29.99",
    period: "/month",
    features: [
      "Everything in Nail Obsessed",
      "25% member discount",
      "Priority VIP support",
      "Exclusive limited editions",
      "Free custom design consultation",
      "Quarterly luxury gift box",
    ],
    cta: "Go VIP",
    popular: false,
  },
];

const faqs = [
  {
    question: "What is the Nail Drop Club?",
    answer: "The Nail Drop Club is our exclusive membership program offering early access to new designs, member-only discounts, monthly nail surprises, and special perks like free shipping and birthday gifts.",
  },
  {
    question: "Can I cancel anytime?",
    answer: "Absolutely! You can cancel your membership at any time with no fees or penalties. Your benefits will continue until the end of your current billing period.",
  },
  {
    question: "When do I get my monthly nail drop?",
    answer: "Monthly nail drops ship on the 15th of each month. You'll receive a surprise mini set of our latest or exclusive designs right to your doorstep.",
  },
  {
    question: "How does the birthday gift work?",
    answer: "Simply add your birthday to your profile and we'll send you a free full-size nail set during your birthday month. It's our way of celebrating you!",
  },
];

const NailClub = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 sm:pt-32 pb-16 sm:pb-24 px-4">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <span className="inline-block px-4 py-1.5 bg-secondary/30 text-foreground/80 rounded-full text-sm font-medium tracking-wide mb-6">
            Exclusive Membership
          </span>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-foreground mb-6">
            Join the <span className="text-primary">Nail Drop Club</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
            Get first access to new designs, member-only pricing, and monthly nail surprises delivered to your door.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="rounded-full px-8 text-base">
              Join Now
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-8 text-base">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-16 sm:py-24 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="font-display text-3xl sm:text-4xl text-foreground mb-4">
              Member Benefits
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Exclusive perks designed for nail enthusiasts like you
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <div
                key={benefit.title}
                className="bg-card p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <benefit.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display text-xl text-foreground mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="py-16 sm:py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="font-display text-3xl sm:text-4xl text-foreground mb-4">
              Choose Your Membership
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Select the perfect plan for your nail journey
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {tiers.map((tier, index) => (
              <div
                key={tier.name}
                className={`relative bg-card rounded-2xl p-6 sm:p-8 animate-fade-in ${
                  tier.popular 
                    ? "ring-2 ring-primary shadow-lg scale-[1.02]" 
                    : "shadow-sm hover:shadow-md"
                } transition-all`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {tier.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-sm font-medium rounded-full">
                    Most Popular
                  </span>
                )}
                <h3 className="font-display text-2xl text-foreground mb-2">{tier.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-display text-foreground">{tier.price}</span>
                  <span className="text-muted-foreground">{tier.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className={`w-full rounded-full ${tier.popular ? "" : "bg-secondary text-secondary-foreground hover:bg-secondary/90"}`}
                  size="lg"
                >
                  {tier.cta}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 sm:py-24 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="font-display text-3xl sm:text-4xl text-foreground mb-4">
              How It Works
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Choose Your Plan", description: "Pick the membership tier that fits your nail needs" },
              { step: "02", title: "Get Instant Perks", description: "Enjoy discounts and early access right away" },
              { step: "03", title: "Receive Monthly Drops", description: "Get surprise nail sets delivered each month" },
            ].map((item, index) => (
              <div 
                key={item.step} 
                className="text-center animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="font-display text-2xl text-primary">{item.step}</span>
                </div>
                <h3 className="font-display text-xl text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 sm:py-24 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="font-display text-3xl sm:text-4xl text-foreground mb-4">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={faq.question}
                className="bg-card rounded-2xl p-6 shadow-sm animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <h3 className="font-display text-lg text-foreground mb-2">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 sm:py-24 px-4 bg-primary/10">
        <div className="max-w-3xl mx-auto text-center animate-fade-in">
          <h2 className="font-display text-3xl sm:text-4xl text-foreground mb-4">
            Ready to Join the Club?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
            Start enjoying exclusive perks, member discounts, and monthly nail surprises today.
          </p>
          <Button size="lg" className="rounded-full px-10 text-base">
            Join the Nail Drop Club
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default NailClub;
