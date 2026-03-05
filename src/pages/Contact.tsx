import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Mail,
  Send,
  Instagram,
  Star,
  Clock,
  Quote,
  ExternalLink,
  Heart,
  MessageCircle,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import Navigation from "@/components/Navigation";

const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address")
    .max(255, "Email must be less than 255 characters"),
  inquiryType: z.string().min(1, "Please select an inquiry type"),
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message must be less than 1000 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

const inquiryTypes = [
  { value: "bridal", label: "Bridal Set Inquiry" },
  { value: "custom", label: "Custom Order Request" },
  { value: "collaboration", label: "Collaboration Proposal" },
  { value: "general", label: "General Question" },
];

const testimonial = {
  quote:
    "My bridal nails were absolutely perfect. Everyone at my wedding asked where I got them! The attention to detail was incredible.",
  author: "Jessica T.",
  event: "October 2024 Bride",
  rating: 5,
};

const instagramPostsRow1 = [
  {
    image:
      "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=500&h=500&fit=crop",
    alt: "Elegant bridal nail set with pearls",
  },
  {
    image:
      "https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=500&h=500&fit=crop",
    alt: "Custom French tip press-on nails",
  },
  {
    image:
      "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=500&h=500&fit=crop",
    alt: "Wedding day manicure closeup",
  },
  {
    image:
      "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=500&h=500&fit=crop",
    alt: "Luxury nail art design",
  },
];

const instagramPostsRow2 = [
  {
    image:
      "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=500&h=625&fit=crop",
    alt: "Luxury nail art design",
  },
  {
    image:
      "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=500&h=625&fit=crop",
    alt: "Elegant bridal nail set",
  },
  {
    image:
      "https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=500&h=625&fit=crop",
    alt: "Custom French tip nails",
  },
  {
    image:
      "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=500&h=625&fit=crop",
    alt: "Wedding day manicure",
  },
];

const quickLinks = [
  { label: "How do I find my size?", href: "/how-to/sizing" },
  { label: "How to apply press-ons", href: "/how-to/application" },
  { label: "Bridal set timeline", href: "/how-to/bridal" },
  { label: "Removal tips", href: "/how-to/removal" },
];

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      inquiryType: "",
      message: "",
    },
  });

  // Scroll reveal refs
  const sectionHeaderRef = useScrollReveal();
  const leftColRef = useScrollReveal();
  const contactCardsRef = useScrollReveal();
  const formRef = useScrollReveal();
  const instaSectionRef = useScrollReveal();
  const instaMarqueeRef = useScrollReveal();
  const faqRef = useScrollReveal();
  const faqContentRef = useScrollReveal();

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);

    toast({
      title: "Message Sent",
      description:
        "Thank you for reaching out! We'll get back to you within 24 hours.",
    });

    form.reset();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* ─── Hero Section ─── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Multi-layer atmospheric background */}
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/15 via-background to-primary/10" />
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 70% 50% at 20% 80%, hsl(var(--secondary) / 0.20), transparent),
              radial-gradient(ellipse 50% 60% at 80% 30%, hsl(var(--accent) / 0.15), transparent)
            `,
          }}
        />

        {/* Floating blur orbs */}
        <div className="absolute top-20 right-[15%] w-72 h-72 rounded-full bg-secondary/10 blur-3xl animate-float" />
        <div
          className="absolute bottom-32 left-[10%] w-96 h-96 rounded-full bg-primary/[0.08] blur-3xl animate-float"
          style={{ animationDelay: "1.5s" }}
        />

        {/* Decorative thin side line — desktop only */}
        <div className="absolute left-8 top-1/4 bottom-1/4 w-px bg-gradient-to-b from-transparent via-primary/15 to-transparent hidden lg:block" />

        {/* Content grid */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-32 lg:py-0">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-0 items-center lg:min-h-screen">
            {/* Left column: Typography */}
            <div className="lg:col-span-7 lg:pr-16">
              {/* Eyebrow pill */}
              <div className="animate-stagger-1">
                <span className="inline-block px-5 py-2 border border-primary/20 rounded-full text-[10px] font-semibold tracking-[0.35em] uppercase text-primary/80">
                  Get in Touch
                </span>
              </div>

              {/* Oversized display heading */}
              <h1 className="animate-stagger-2 font-display mt-8 sm:mt-10">
                <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-medium leading-[0.95] text-foreground">
                  Let's Create
                </span>
                <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl italic font-light text-primary/70 leading-[0.95] -mt-1">
                  Something Beautiful
                </span>
              </h1>

              {/* Subheadline with decorative rule */}
              <div className="animate-stagger-3 mt-8 sm:mt-10">
                <div className="w-12 h-px bg-primary/30 mb-6" />
                <p className="text-base sm:text-lg lg:text-xl text-muted-foreground font-light leading-relaxed max-w-md">
                  Whether you're dreaming up a custom set or planning your
                  bridal nails, we'd love to hear your vision.
                </p>
              </div>

              {/* Scroll indicator — desktop only */}
              <div className="animate-stagger-4 mt-10 hidden lg:flex items-center gap-3 text-muted-foreground/50 text-sm">
                <div className="w-6 h-10 border-2 border-foreground/15 rounded-full flex justify-center pt-2">
                  <div className="w-1 h-2 bg-foreground/30 rounded-full animate-bounce" />
                </div>
                <span className="text-[10px] tracking-[0.2em] uppercase">
                  Scroll to connect
                </span>
              </div>
            </div>

            {/* Right column: Statement image */}
            <div className="lg:col-span-5 animate-stagger-4">
              <div className="relative aspect-[3/4] lg:aspect-auto lg:h-[85vh] rounded-2xl lg:rounded-none lg:rounded-l-3xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&h=1200&fit=crop"
                  alt="Elegant press-on nail artistry"
                  className="w-full h-full object-cover"
                />
                {/* Soft overlay for brand consistency */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-primary/10" />
                <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-transparent lg:from-background/30" />

                {/* Floating response-time badge */}
                <div className="absolute bottom-8 left-8 bg-background/80 backdrop-blur-sm rounded-full px-5 py-2.5 border border-border/50 animate-float">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">
                      Replies within{" "}
                      <span className="text-primary">24 hours</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Form + Context Section ─── */}
      <section className="relative py-20 sm:py-28 lg:py-32 overflow-hidden">
        {/* Subtle background shift */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />

        {/* Large decorative ampersand — desktop only */}
        <div className="absolute top-1/2 -translate-y-1/2 -right-20 text-[20rem] font-display font-light text-primary/[0.03] leading-none select-none pointer-events-none hidden lg:block">
          &
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Editorial section header */}
          <div ref={sectionHeaderRef} className="reveal mb-16 sm:mb-20">
            <div className="flex items-center gap-5 mb-8">
              <div className="flex-1 h-px bg-border/40" />
              <p className="text-[10px] font-semibold tracking-[0.35em] uppercase text-muted-foreground/50 shrink-0">
                Start a Conversation
              </p>
              <div className="flex-1 h-px bg-border/40" />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 sm:gap-12">
              <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-medium leading-[1.05] shrink-0">
                <span className="italic font-light text-foreground/60">
                  Tell Us
                </span>{" "}
                Your Vision
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base sm:text-right sm:max-w-[220px] sm:pb-1 leading-relaxed">
                Every great set starts with a conversation
              </p>
            </div>
          </div>

          {/* Two-column grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 max-w-6xl mx-auto items-start">
            {/* Left Column: Testimonial + Contact Info */}
            <div
              ref={leftColRef}
              className="reveal lg:col-span-5 space-y-8 lg:sticky lg:top-32"
            >
              {/* Testimonial card */}
              <div className="relative p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-secondary/30 via-secondary/10 to-transparent border border-border/30">
                <Quote className="absolute top-8 right-8 h-12 w-12 text-primary/10" />
                <div className="relative z-10">
                  <div className="flex gap-1 mb-5">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-primary/70 text-primary/70"
                      />
                    ))}
                  </div>
                  <blockquote className="font-display text-xl sm:text-2xl text-foreground italic leading-relaxed mb-8">
                    "{testimonial.quote}"
                  </blockquote>
                  <div className="h-px bg-border/30 mb-6" />
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-full bg-primary/15 flex items-center justify-center">
                      <span className="font-display text-primary text-base font-medium">
                        {testimonial.author.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm">
                        {testimonial.author}
                      </p>
                      <p className="text-xs text-muted-foreground tracking-wide">
                        {testimonial.event}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact channel cards */}
              <div
                ref={contactCardsRef}
                className="reveal-children space-y-4"
              >
                <a
                  href="mailto:hello@yourprettysets.com"
                  className="group flex items-center gap-4 p-5 rounded-2xl border border-border/30 hover:border-primary/30 bg-card/50 hover:bg-card transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/15 transition-colors">
                    <Mail className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      hello@yourprettysets.com
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Email us anytime
                    </p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground/40 group-hover:text-primary/60 transition-colors shrink-0" />
                </a>

                <a
                  href="https://instagram.com/yourprettysets"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 p-5 rounded-2xl border border-border/30 hover:border-primary/30 bg-card/50 hover:bg-card transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/15 transition-colors">
                    <Instagram className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      @yourprettysets
                    </p>
                    <p className="text-xs text-muted-foreground">
                      DM us on Instagram
                    </p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground/40 group-hover:text-primary/60 transition-colors shrink-0" />
                </a>
              </div>
            </div>

            {/* Right Column: The Form */}
            <div ref={formRef} className="reveal-scale lg:col-span-7">
              <div className="p-8 sm:p-10 lg:p-12 rounded-3xl bg-card border border-border/30 shadow-sm">
                {/* Form header */}
                <div className="mb-10">
                  <h3 className="font-display text-2xl sm:text-3xl text-foreground mb-2">
                    Send a Message
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Tell us about your dream set and we'll make it happen.
                  </p>
                </div>

                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    {/* Name & Email side-by-side on sm+ */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground text-sm font-medium tracking-wide">
                              Name
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Your name"
                                className="bg-background/50 border-border/40 focus:border-primary focus:ring-primary/20 transition-all duration-300 h-12 rounded-xl"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground text-sm font-medium tracking-wide">
                              Email
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="your@email.com"
                                className="bg-background/50 border-border/40 focus:border-primary focus:ring-primary/20 transition-all duration-300 h-12 rounded-xl"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="inquiryType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground text-sm font-medium tracking-wide">
                            Inquiry Type
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="bg-background/50 border-border/40 focus:border-primary focus:ring-primary/20 transition-all duration-300 h-12 rounded-xl">
                                <SelectValue placeholder="Select inquiry type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {inquiryTypes.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground text-sm font-medium tracking-wide">
                            Message
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tell us about your vision..."
                              rows={5}
                              className="bg-background/50 border-border/40 focus:border-primary focus:ring-primary/20 transition-all duration-300 resize-none rounded-xl"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="pt-2 space-y-4">
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-6 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 group"
                      >
                        {isSubmitting ? (
                          "Sending..."
                        ) : (
                          <span className="flex items-center justify-center gap-2">
                            Send Message
                            <Send className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                          </span>
                        )}
                      </Button>

                      <p className="text-center text-xs text-muted-foreground/60 tracking-wide">
                        We typically respond within 24 hours
                      </p>
                    </div>
                  </form>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Instagram / Social Proof ─── */}
      <section className="relative py-20 sm:py-28 lg:py-32 overflow-hidden">
        {/* Background tint */}
        <div className="absolute inset-0 bg-muted/20" />

        {/* Section header */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <div ref={instaSectionRef} className="reveal text-center mb-12 sm:mb-16">
            <p className="text-[10px] font-semibold tracking-[0.35em] uppercase text-muted-foreground/50 mb-6">
              @yourprettysets
            </p>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-medium text-foreground leading-tight mb-4">
              Follow the
              <span className="italic font-light text-primary/70">
                {" "}
                journey
              </span>
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base max-w-md mx-auto">
              Real nails, real moments. Get inspired by our latest creations.
            </p>
          </div>
        </div>

        {/* Full-bleed marquee rows */}
        <div ref={instaMarqueeRef} className="reveal-scale relative z-10 space-y-4">
          {/* Row 1: scrolls left */}
          <div className="animate-marquee-left">
            <div className="flex">
              {[...instagramPostsRow1, ...instagramPostsRow1, ...instagramPostsRow1, ...instagramPostsRow1].map(
                (post, i) => (
                  <a
                    key={i}
                    href="https://instagram.com/yourprettysets"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex-none mx-2"
                  >
                    <div className="relative w-48 sm:w-56 lg:w-64 aspect-square rounded-2xl overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.alt}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/30 transition-colors duration-300 flex items-center justify-center">
                        <Instagram className="h-6 w-6 text-background opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    </div>
                  </a>
                )
              )}
            </div>
          </div>

          {/* Row 2: scrolls right */}
          <div className="animate-marquee-right">
            <div className="flex">
              {[...instagramPostsRow2, ...instagramPostsRow2, ...instagramPostsRow2, ...instagramPostsRow2].map(
                (post, i) => (
                  <a
                    key={i}
                    href="https://instagram.com/yourprettysets"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex-none mx-2"
                  >
                    <div className="relative w-44 sm:w-52 lg:w-60 aspect-[4/5] rounded-2xl overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.alt}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/30 transition-colors duration-300 flex items-center justify-center">
                        <Instagram className="h-6 w-6 text-background opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    </div>
                  </a>
                )
              )}
            </div>
          </div>
        </div>

        {/* Follow CTA */}
        <div className="relative z-10 text-center mt-10 sm:mt-14">
          <a
            href="https://instagram.com/yourprettysets"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2.5 px-6 py-3 rounded-full border border-primary/30 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
          >
            <Instagram className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-foreground">
              Follow @yourprettysets
            </span>
          </a>
        </div>
      </section>

      {/* ─── FAQ & Trust Section ─── */}
      <section className="relative py-20 sm:py-28 lg:py-32 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div ref={faqRef} className="reveal">
            {/* Section header */}
            <div className="mb-16 sm:mb-20">
              <div className="flex items-center gap-5 mb-8">
                <div className="flex-1 h-px bg-border/40" />
                <p className="text-[10px] font-semibold tracking-[0.35em] uppercase text-muted-foreground/50 shrink-0">
                  Before You Go
                </p>
                <div className="flex-1 h-px bg-border/40" />
              </div>
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 sm:gap-12">
                <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-medium leading-[1.05] shrink-0">
                  <span className="italic font-light text-foreground/60">
                    Quick
                  </span>{" "}
                  Answers
                </h2>
                <p className="text-muted-foreground text-sm sm:text-base sm:text-right sm:max-w-[220px] sm:pb-1 leading-relaxed">
                  Everything you need to know, all in one place
                </p>
              </div>
            </div>

            {/* Three-column content */}
            <div
              ref={faqContentRef}
              className="reveal-children grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 max-w-5xl mx-auto"
            >
              {/* Trust signals */}
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Clock className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-display text-lg text-foreground mb-1">
                      24-Hour Reply
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Every message gets a thoughtful response within one
                      business day.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Heart className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-display text-lg text-foreground mb-1">
                      Handmade with Care
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Every set is crafted by hand, just for you. No mass
                      production, ever.
                    </p>
                  </div>
                </div>
              </div>

              {/* Central CTA card */}
              <div className="relative">
                <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-secondary/30 via-secondary/15 to-accent/10 border border-border/30 text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center mx-auto mb-6">
                    <MessageCircle className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-display text-xl sm:text-2xl text-foreground mb-3">
                    Need Quick Answers?
                  </h3>
                  <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
                    Our FAQ covers sizing, shipping, custom orders, and more.
                  </p>
                  <Link to="/how-to">
                    <Button className="rounded-full px-8 font-medium">
                      Visit Our FAQ
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Quick links */}
              <div>
                <p className="text-[10px] font-semibold tracking-[0.35em] uppercase text-muted-foreground/50 mb-6">
                  Popular Topics
                </p>
                <div className="space-y-1">
                  {quickLinks.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      className="group flex items-center justify-between py-3.5 border-b border-border/30 hover:border-primary/30 transition-colors"
                    >
                      <span className="text-sm text-foreground group-hover:text-primary transition-colors">
                        {link.label}
                      </span>
                      <ArrowRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Contact;
