import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { 
  Sparkles, Tag, Gift, Truck, Cake, Star, Check, ChevronDown,
  Crown, Heart, Package, ArrowRight, Quote, Shield, CreditCard, Clock
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
    price: { monthly: "Free", annual: "Free" },
    period: "to join",
    features: [
      "Early access to new releases",
      "10% member discount",
      "Birthday gift",
      "Members-only newsletter",
    ],
    cta: "Join Free",
    popular: false,
    icon: Heart,
  },
  {
    name: "Nail Obsessed",
    price: { monthly: "$14.99", annual: "$119.99" },
    period: "/month",
    annualPeriod: "/year",
    savings: "Save $60/year",
    features: [
      "Everything in Nail Lover",
      "20% member discount",
      "Free shipping on all orders",
      "Monthly surprise nail set",
      "Early sale access",
    ],
    cta: "Get Started",
    popular: true,
    icon: Package,
  },
  {
    name: "Nail VIP",
    price: { monthly: "$29.99", annual: "$239.99" },
    period: "/month",
    annualPeriod: "/year",
    savings: "Save $120/year",
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
    icon: Crown,
  },
];

const testimonials = [
  {
    name: "Sarah M.",
    tier: "Nail VIP",
    rating: 5,
    quote: "The monthly drops are always so cute! I look forward to the 15th every month. Worth every penny!",
    avatar: "SM",
  },
  {
    name: "Jessica L.",
    tier: "Nail Obsessed",
    rating: 5,
    quote: "The 20% discount pays for itself. I've saved so much money since joining and the quality is amazing.",
    avatar: "JL",
  },
  {
    name: "Emily R.",
    tier: "Nail VIP",
    rating: 5,
    quote: "Got my birthday set last month and it was stunning! The VIP perks are incredible.",
    avatar: "ER",
  },
  {
    name: "Amanda K.",
    tier: "Nail Obsessed",
    rating: 5,
    quote: "Free shipping alone makes it worth it. Plus the early access to new collections is chef's kiss!",
    avatar: "AK",
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
  {
    question: "Can I upgrade or downgrade my membership?",
    answer: "Yes! You can change your membership tier at any time. When you upgrade, you'll get immediate access to your new benefits. Downgrades take effect at the start of your next billing cycle.",
  },
  {
    question: "Do my discounts stack with sale prices?",
    answer: "Member discounts apply to full-price items. During sales, you'll automatically receive whichever discount is greater—your member discount or the sale price.",
  },
];

const monthlyDropItems = [
  { name: "2-3 Exclusive Designs", description: "Curated mini nail sets you won't find anywhere else" },
  { name: "Application Tools", description: "Everything you need for a perfect at-home mani" },
  { name: "Surprise Extras", description: "Bonus items like nail art stickers or cuticle oil" },
];

const NailClub = () => {
  const [isAnnual, setIsAnnual] = useState(false);

  const scrollToPlans = () => {
    document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section - Full Screen with Gradient */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/30 to-accent/20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
        
        {/* Floating decorative elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-40 right-20 w-48 h-48 bg-secondary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/3 right-10 w-24 h-24 bg-accent/15 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }} />
        
        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center pt-24">
          {/* Social proof badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-card/80 backdrop-blur-sm rounded-full shadow-lg mb-8 animate-fade-in">
            <div className="flex -space-x-2">
              {['bg-primary', 'bg-secondary', 'bg-accent'].map((bg, i) => (
                <div key={i} className={`w-8 h-8 ${bg} rounded-full border-2 border-background flex items-center justify-center text-xs font-medium text-primary-foreground`}>
                  {['SM', 'JL', 'ER'][i]}
                </div>
              ))}
            </div>
            <span className="text-sm font-medium text-foreground">
              ★★★★★ <span className="text-muted-foreground">Loved by 5,000+ members</span>
            </span>
          </div>

          <span className="inline-block px-5 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold tracking-wider uppercase mb-6 animate-fade-in" style={{ animationDelay: '100ms' }}>
            Exclusive Membership
          </span>
          
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-foreground mb-6 animate-fade-in" style={{ animationDelay: '200ms' }}>
            Join the{" "}
            <span className="relative">
              <span className="text-primary">Nail Drop</span>
              <Sparkles className="absolute -top-4 -right-8 w-8 h-8 text-primary animate-pulse" />
            </span>
            <br />Club
          </h1>
          
          <p className="text-xl sm:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in" style={{ animationDelay: '300ms' }}>
            Get first access to new designs, exclusive member pricing, and 
            <span className="text-foreground font-medium"> monthly nail surprises </span>
            delivered right to your door.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-in" style={{ animationDelay: '400ms' }}>
            <Button size="lg" className="rounded-full px-10 py-6 text-lg group" onClick={scrollToPlans}>
              Join Now
              <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-10 py-6 text-lg bg-background/50 backdrop-blur-sm">
              See Benefits
            </Button>
          </div>

          {/* Scroll indicator */}
          <div className="animate-bounce">
            <ChevronDown className="w-8 h-8 text-muted-foreground mx-auto" />
          </div>
        </div>
      </section>

      {/* Social Proof Stats Bar */}
      <section className="py-8 bg-card border-y border-border">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "5,000+", label: "Happy Members" },
              { value: "50,000+", label: "Sets Shipped" },
              { value: "4.9★", label: "Average Rating" },
              { value: "24hr", label: "Avg Response Time" },
            ].map((stat, index) => (
              <div 
                key={stat.label} 
                className="text-center animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="font-display text-3xl sm:text-4xl text-primary mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section - Redesigned */}
      <section className="py-20 sm:py-32 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <span className="inline-block px-4 py-1.5 bg-secondary/50 text-foreground rounded-full text-sm font-medium mb-4">
              Why Join?
            </span>
            <h2 className="font-display text-4xl sm:text-5xl text-foreground mb-4">
              Perks That <span className="text-primary">Keep Giving</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              More than just a membership—it's a nail obsession lifestyle
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={benefit.title}
                className="group relative bg-card p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-border/50 hover:border-primary/30 animate-fade-in overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Hover gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="relative z-10">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                    <benefit.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-display text-xl text-foreground mb-3">{benefit.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What's in Your Monthly Drop */}
      <section className="py-20 sm:py-32 px-4 bg-gradient-to-b from-muted/50 to-background">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Visual side */}
            <div className="relative animate-fade-in">
              <div className="aspect-square bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 rounded-3xl flex items-center justify-center relative overflow-hidden">
                {/* Floating boxes representing nail sets */}
                <div className="absolute top-8 left-8 w-24 h-32 bg-card rounded-2xl shadow-xl transform -rotate-6 animate-pulse" />
                <div className="absolute top-12 right-12 w-20 h-28 bg-primary/20 rounded-2xl shadow-lg transform rotate-12" />
                <div className="absolute bottom-16 left-16 w-28 h-20 bg-secondary/30 rounded-2xl shadow-lg transform rotate-3" />
                
                <div className="relative z-10 text-center p-8">
                  <Package className="w-20 h-20 text-primary mx-auto mb-4" />
                  <p className="font-display text-2xl text-foreground">Your Monthly Drop</p>
                </div>
              </div>
              
              {/* Badge */}
              <div className="absolute -bottom-4 -right-4 bg-primary text-primary-foreground px-6 py-3 rounded-full font-semibold shadow-lg">
                Ships on the 15th!
              </div>
            </div>
            
            {/* Content side */}
            <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
              <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
                Monthly Surprise
              </span>
              <h2 className="font-display text-4xl sm:text-5xl text-foreground mb-6">
                What's Inside Your Drop?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Every month, we curate a special selection of nail goodness just for you. 
                It's like a birthday gift that comes 12 times a year!
              </p>
              
              <div className="space-y-6">
                {monthlyDropItems.map((item, index) => (
                  <div key={item.name} className="flex gap-4 items-start">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-display text-lg text-foreground mb-1">{item.name}</h4>
                      <p className="text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Tiers - Premium Redesign */}
      <section id="pricing" className="py-20 sm:py-32 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <span className="inline-block px-4 py-1.5 bg-secondary/50 text-foreground rounded-full text-sm font-medium mb-4">
              Pricing
            </span>
            <h2 className="font-display text-4xl sm:text-5xl text-foreground mb-4">
              Choose Your <span className="text-primary">Perfect Plan</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-8">
              Select the membership that matches your nail obsession level
            </p>
            
            {/* Annual/Monthly Toggle */}
            <div className="inline-flex items-center gap-4 bg-muted/50 rounded-full p-1.5">
              <button
                onClick={() => setIsAnnual(false)}
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                  !isAnnual ? 'bg-card shadow-md text-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setIsAnnual(true)}
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                  isAnnual ? 'bg-card shadow-md text-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Annual
                <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">Save up to 33%</span>
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {tiers.map((tier, index) => (
              <div
                key={tier.name}
                className={`relative group bg-card rounded-3xl p-8 animate-fade-in transition-all duration-300 ${
                  tier.popular 
                    ? "ring-2 ring-primary shadow-2xl shadow-primary/10 scale-[1.02] z-10" 
                    : "shadow-lg hover:shadow-xl border border-border/50 hover:border-primary/30"
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="px-6 py-2 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground text-sm font-semibold rounded-full shadow-lg inline-flex items-center gap-2">
                      <Star className="w-4 h-4 fill-current" />
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    tier.popular ? 'bg-primary text-primary-foreground' : 'bg-primary/10'
                  }`}>
                    <tier.icon className={`w-6 h-6 ${tier.popular ? '' : 'text-primary'}`} />
                  </div>
                  <h3 className="font-display text-2xl text-foreground">{tier.name}</h3>
                </div>
                
                <div className="mb-6">
                  <span className="text-5xl font-display text-foreground">
                    {isAnnual ? tier.price.annual : tier.price.monthly}
                  </span>
                  <span className="text-muted-foreground">
                    {tier.price.monthly === "Free" ? " to join" : (isAnnual ? tier.annualPeriod : tier.period)}
                  </span>
                  {isAnnual && tier.savings && (
                    <div className="mt-2">
                      <span className="text-sm text-primary font-medium">{tier.savings}</span>
                    </div>
                  )}
                </div>
                
                <ul className="space-y-4 mb-8">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-primary" />
                      </div>
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className={`w-full rounded-full py-6 text-base font-semibold transition-all ${
                    tier.popular 
                      ? "bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25" 
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/90"
                  }`}
                  size="lg"
                >
                  {tier.cta}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Member Testimonials */}
      <section className="py-20 sm:py-32 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
              Testimonials
            </span>
            <h2 className="font-display text-4xl sm:text-5xl text-foreground mb-4">
              What Members <span className="text-primary">Are Saying</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Real reviews from real nail obsessed members
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.name}
                className="bg-card p-6 rounded-3xl shadow-sm hover:shadow-lg transition-shadow animate-fade-in border border-border/50"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Quote className="w-8 h-8 text-primary/30 mb-4" />
                
                <p className="text-foreground mb-6 leading-relaxed">"{testimonial.quote}"</p>
                
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/60 rounded-full flex items-center justify-center text-primary-foreground font-semibold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-medium text-foreground">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      {testimonial.tier}
                      <span className="text-primary">{"★".repeat(testimonial.rating)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - Matching Site Style */}
      <section className="py-20 sm:py-32 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <span className="inline-block px-4 py-1.5 bg-secondary/50 text-foreground rounded-full text-sm font-medium mb-4">
              Getting Started
            </span>
            <h2 className="font-display text-4xl sm:text-5xl text-foreground mb-4">
              Three Simple <span className="text-primary">Steps</span>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-24 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20" />
            
            {[
              { step: "01", icon: CreditCard, title: "Choose Your Plan", description: "Pick the membership tier that matches your nail obsession" },
              { step: "02", icon: Shield, title: "Get Instant Access", description: "Enjoy discounts and early access to new releases right away" },
              { step: "03", icon: Gift, title: "Receive Monthly Drops", description: "Get surprise nail sets delivered to your door each month" },
            ].map((item, index) => (
              <div 
                key={item.step} 
                className="text-center animate-fade-in relative"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="relative z-10 w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/25">
                  <item.icon className="w-10 h-10 text-primary-foreground" />
                </div>
                <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-3">
                  Step {item.step}
                </span>
                <h3 className="font-display text-xl text-foreground mb-3">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section - Enhanced */}
      <section className="py-20 sm:py-32 px-4 bg-muted/30">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
              FAQ
            </span>
            <h2 className="font-display text-4xl sm:text-5xl text-foreground mb-4">
              Got <span className="text-primary">Questions?</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Everything you need to know about the Nail Drop Club
            </p>
          </div>
          
          <Accordion type="single" collapsible className="space-y-4 animate-fade-in">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card rounded-2xl px-6 shadow-sm border border-border/50 hover:border-primary/30 transition-colors"
              >
                <AccordionTrigger className="font-display text-lg text-foreground hover:no-underline py-6 hover:text-primary transition-colors">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Final CTA - Impactful Close */}
      <section className="py-20 sm:py-32 px-4 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
        
        <div className="relative z-10 max-w-4xl mx-auto text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
            <Clock className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">500+ members joined this month</span>
          </div>
          
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl text-foreground mb-6">
            Ready to Join the <span className="text-primary">Club?</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Start enjoying exclusive perks, member discounts, and monthly nail surprises today. 
            Your nails will thank you.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="rounded-full px-12 py-6 text-lg group" onClick={scrollToPlans}>
              Join Now
              <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-12 py-6 text-lg bg-background/50 backdrop-blur-sm">
              Gift a Membership
            </Button>
          </div>
          
          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              <span>Cancel anytime</span>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-primary" />
              <span>Secure checkout</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-primary" />
              <span>5,000+ happy members</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default NailClub;
