import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Mail,
  Send,
  Instagram,
  Paintbrush,
  MessageCircle,
  BookOpen,
  ArrowRight,
  ChevronDown,
  Camera,
  X,
  Ruler,
  Hand,
  RotateCcw,
  Clock,
  Sparkles,
  Package,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
import { useMenuStore } from "@/stores/menuStore";
import Navigation from "@/components/Navigation";

/* ─── Schema ─── */

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
  orderNumber: z.string().trim().max(50).optional(),
  issueType: z.string().optional(),
  companyName: z.string().trim().max(200).optional(),
});

type ContactFormData = z.infer<typeof contactSchema>;

/* ─── Constants ─── */

const INQUIRY_TYPES = [
  { value: "custom", label: "Custom Order Request" },
  { value: "general", label: "General Question" },
  { value: "order-help", label: "Help with My Order" },
  { value: "collaboration", label: "Collaboration Proposal" },
];

const ORDER_ISSUE_TYPES = [
  { value: "sizing", label: "Sizing doesn't fit" },
  { value: "damaged", label: "Damaged in shipping" },
  { value: "wrong-order", label: "Wrong order received" },
  { value: "application", label: "Application help" },
  { value: "other", label: "Other" },
];

const QUICK_ACTIONS = [
  {
    id: "design",
    icon: Paintbrush,
    title: "Design a Custom Set",
    description: "Build your dream nails step by step",
    tint: "bg-secondary/15 text-secondary-foreground",
  },
  {
    id: "chat",
    icon: MessageCircle,
    title: "Chat with Us",
    description: "Get instant answers from our AI assistant",
    tint: "bg-primary/15 text-primary",
  },
  {
    id: "faq",
    icon: BookOpen,
    title: "Browse Our FAQ",
    description: "Sizing, application, care & more",
    tint: "bg-accent/15 text-accent-foreground",
  },
  {
    id: "message",
    icon: Mail,
    title: "Send Us a Message",
    description: "We reply within 24 hours",
    tint: "bg-primary/10 text-primary",
  },
];

const FAQ_SUGGESTIONS = [
  {
    question: "How do I find my nail size?",
    icon: Ruler,
    href: "/how-to/sizing",
  },
  {
    question: "How do I apply press-on nails?",
    icon: Hand,
    href: "/how-to/application",
  },
  {
    question: "What's your return policy?",
    icon: RotateCcw,
    answer: "We accept returns within 14 days of delivery for unused, unopened sets. Custom orders are final sale.",
  },
  {
    question: "How long do sets last?",
    icon: Clock,
    answer: "About 1 week with adhesive tabs, or up to 2 weeks with nail glue. Proper application helps them last longer.",
  },
];

/* ─── Instagram Data (preserved) ─── */

const instagramPostsRow1 = [
  {
    image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=500&h=500&fit=crop",
    alt: "Elegant nail set with pearls",
  },
  {
    image: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=500&h=500&fit=crop",
    alt: "Custom French tip press-on nails",
  },
  {
    image: "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=500&h=500&fit=crop",
    alt: "Manicure closeup",
  },
  {
    image: "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=500&h=500&fit=crop",
    alt: "Luxury nail art design",
  },
];

const instagramPostsRow2 = [
  {
    image: "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=500&h=625&fit=crop",
    alt: "Luxury nail art design",
  },
  {
    image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=500&h=625&fit=crop",
    alt: "Elegant nail set",
  },
  {
    image: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=500&h=625&fit=crop",
    alt: "Custom French tip nails",
  },
  {
    image: "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=500&h=625&fit=crop",
    alt: "Manicure closeup",
  },
];

/* ─── Sub-components ─── */

const QuickActionCard = ({
  icon: Icon,
  title,
  description,
  tint,
  onClick,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  tint: string;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className="group text-left p-5 sm:p-6 rounded-2xl border border-border/30 hover:border-primary/25 bg-gradient-to-br from-card via-card to-secondary/5 transition-all duration-500 hover:shadow-[0_8px_30px_-12px_rgba(107,76,59,0.12)] hover:-translate-y-0.5 relative overflow-hidden"
  >
    {/* Subtle top accent */}
    <div className="absolute top-0 left-5 right-5 sm:left-6 sm:right-6 h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent group-hover:via-primary/25 transition-all duration-500" />

    {/* Icon + Title row */}
    <div className="flex items-center gap-3 mb-3">
      <div className={`w-10 h-10 rounded-xl ${tint} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-500`}>
        <Icon className="h-[18px] w-[18px]" />
      </div>
      <h3 className="font-display text-base sm:text-lg font-medium text-foreground group-hover:text-primary transition-colors tracking-[-0.01em]">
        {title}
      </h3>
    </div>

    {/* Description + Arrow row */}
    <div className="flex items-end justify-between gap-3">
      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{description}</p>
      <ArrowRight className="h-4 w-4 shrink-0 text-primary/0 group-hover:text-primary/50 transition-all duration-500 translate-x-0 group-hover:translate-x-0.5" />
    </div>
  </button>
);

const ImageUploadField = ({
  images,
  previews,
  onAdd,
  onRemove,
}: {
  images: File[];
  previews: string[];
  onAdd: (files: FileList) => void;
  onRemove: (index: number) => void;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isFull = images.length >= 3;

  return (
    <div className="space-y-3">
      <p className="text-xs font-medium tracking-wider uppercase text-muted-foreground">
        Inspiration Images
      </p>

      {/* Upload area */}
      <button
        type="button"
        onClick={() => !isFull && fileInputRef.current?.click()}
        className={`w-full py-8 rounded-2xl border-2 border-dashed transition-all duration-300 flex flex-col items-center gap-2 ${
          isFull
            ? "border-border/20 bg-muted/10 cursor-not-allowed opacity-50"
            : "border-border/40 hover:border-primary/40 hover:bg-primary/5 cursor-pointer"
        }`}
      >
        <Camera className="h-6 w-6 text-muted-foreground/50" />
        <span className="text-sm text-muted-foreground">
          {isFull ? "Maximum 3 images reached" : `Add inspiration images (${images.length}/3)`}
        </span>
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => e.target.files && onAdd(e.target.files)}
      />

      {/* Thumbnails */}
      <AnimatePresence>
        {previews.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap gap-3"
          >
            {previews.map((src, i) => (
              <motion.div
                key={src}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative w-20 h-20 rounded-xl overflow-hidden border border-border/30"
              >
                <img src={src} alt={`Inspiration ${i + 1}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => onRemove(i)}
                  className="absolute top-1 right-1 p-1 rounded-full bg-background/90 backdrop-blur-sm hover:bg-background transition-colors"
                >
                  <X className="h-3 w-3 text-foreground/60" />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FaqSuggestionCards = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.3 }}
      className="mt-8"
    >
      <p className="text-sm font-medium text-muted-foreground mb-4 flex items-center gap-2">
        <Sparkles className="h-3.5 w-3.5 text-primary/60" />
        These might help right away
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {FAQ_SUGGESTIONS.map((faq, i) => {
          const Icon = faq.icon;
          const isExpanded = expandedIndex === i;

          if (faq.href) {
            return (
              <Link
                key={i}
                to={faq.href}
                className="group flex items-center gap-3 p-4 rounded-xl border border-border/30 hover:border-primary/30 hover:bg-primary/5 transition-all duration-300"
              >
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon className="h-4 w-4 text-primary/70" />
                </div>
                <span className="text-sm text-foreground flex-1">{faq.question}</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-primary/60 transition-colors shrink-0" />
              </Link>
            );
          }

          return (
            <button
              key={i}
              onClick={() => setExpandedIndex(isExpanded ? null : i)}
              className="text-left p-4 rounded-xl border border-border/30 hover:border-primary/30 hover:bg-primary/5 transition-all duration-300"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon className="h-4 w-4 text-primary/70" />
                </div>
                <span className="text-sm text-foreground flex-1">{faq.question}</span>
                <ChevronDown
                  className={`h-4 w-4 text-muted-foreground/40 shrink-0 transition-transform duration-300 ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                />
              </div>
              <AnimatePresence>
                {isExpanded && faq.answer && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-xs text-muted-foreground leading-relaxed mt-3 ml-12"
                  >
                    {faq.answer}
                  </motion.p>
                )}
              </AnimatePresence>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
};

/* ─── Main Component ─── */

const Contact = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const setChatOpen = useMenuStore((state) => state.setChatOpen);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      inquiryType: "",
      message: "",
      orderNumber: "",
      issueType: "",
      companyName: "",
    },
  });

  const watchedInquiryType = form.watch("inquiryType");

  // Clear conditional fields when inquiry type changes
  useEffect(() => {
    form.setValue("orderNumber", "");
    form.setValue("issueType", "");
    form.setValue("companyName", "");
    setSelectedImages([]);
    setImagePreviews((prev) => {
      prev.forEach((url) => URL.revokeObjectURL(url));
      return [];
    });
  }, [watchedInquiryType, form]);

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Scroll reveal refs
  const actionCardsRef = useScrollReveal();
  const formSectionRef = useScrollReveal();
  const instaSectionRef = useScrollReveal();
  const instaMarqueeRef = useScrollReveal();

  const handleImageAdd = (files: FileList) => {
    const remaining = 3 - selectedImages.length;
    const newFiles: File[] = [];
    const newPreviews: string[] = [];

    for (let i = 0; i < Math.min(files.length, remaining); i++) {
      const file = files[i];
      if (!file.type.startsWith("image/")) continue;
      if (file.size > 5 * 1024 * 1024) {
        toast({ title: "File too large", description: `${file.name} exceeds 5MB limit.` });
        continue;
      }
      newFiles.push(file);
      newPreviews.push(URL.createObjectURL(file));
    }

    setSelectedImages((prev) => [...prev, ...newFiles]);
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const handleImageRemove = (index: number) => {
    URL.revokeObjectURL(imagePreviews[index]);
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleQuickAction = (id: string) => {
    switch (id) {
      case "design":
        navigate("/create");
        break;
      case "chat":
        setChatOpen(true);
        break;
      case "faq":
        navigate("/how-to");
        break;
      case "message":
        document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth" });
        break;
    }
  };

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);

    toast({
      title: "Message Sent",
      description: "Thank you for reaching out! We'll get back to you within 24 hours.",
    });

    form.reset();
    setSelectedImages([]);
    setImagePreviews((prev) => {
      prev.forEach((url) => URL.revokeObjectURL(url));
      return [];
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* ─── Hero ─── */}
      <section className="relative pt-32 pb-8 sm:pt-40 sm:pb-12 overflow-hidden">
        {/* Ambient background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-[15%] w-72 h-72 bg-primary/8 rounded-full blur-[100px]" />
          <div className="absolute bottom-10 left-[10%] w-60 h-60 bg-secondary/10 rounded-full blur-[80px]" />
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-stagger-1">
            <span className="inline-block px-5 py-2 border border-primary/20 rounded-full text-[10px] font-semibold tracking-[0.35em] uppercase text-primary/80">
              Get in Touch
            </span>
          </div>
          <h1 className="animate-stagger-2 font-display mt-8">
            <span className="block text-4xl sm:text-5xl md:text-6xl font-medium leading-[0.95] text-foreground">
              How Can We
            </span>
            <span className="block text-4xl sm:text-5xl md:text-6xl italic font-light text-primary/70 leading-[0.95] -mt-1">
              Help You?
            </span>
          </h1>
          <div className="animate-stagger-3 mt-6">
            <p className="text-base sm:text-lg text-muted-foreground font-light max-w-lg mx-auto">
              Custom sets, questions, collaborations — we'd love to hear from you.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Quick Action Cards ─── */}
      <section className="relative py-6 sm:py-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div
            ref={actionCardsRef}
            className="reveal-children grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto"
          >
            {QUICK_ACTIONS.map((action) => (
              <QuickActionCard
                key={action.id}
                icon={action.icon}
                title={action.title}
                description={action.description}
                tint={action.tint}
                onClick={() => handleQuickAction(action.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ─── Smart Contact Form ─── */}
      <section id="contact-form" className="relative py-16 sm:py-24 overflow-hidden">
        {/* Subtle background */}
        <div className="absolute inset-0 bg-primary/[0.04]" />

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div ref={formSectionRef} className="reveal text-center mb-10 sm:mb-14">
            <div className="flex items-center gap-5 mb-6 max-w-2xl mx-auto">
              <div className="flex-1 h-px bg-border/40" />
              <p className="text-[10px] font-semibold tracking-[0.35em] uppercase text-muted-foreground/50 shrink-0">
                Send a Message
              </p>
              <div className="flex-1 h-px bg-border/40" />
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-medium text-foreground">
              Tell Us What You{" "}
              <span className="italic font-light text-primary/70">Need</span>
            </h2>
          </div>

          {/* Form card */}
          <div className="max-w-2xl mx-auto">
            <div className="p-6 sm:p-8 lg:p-10 rounded-3xl bg-white border border-border/50 shadow-lg shadow-black/[0.04]">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  {/* Name + Email row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-medium tracking-wider uppercase text-muted-foreground">
                            Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Your name"
                              className="h-12 rounded-xl border-border/40 bg-background focus:border-primary/50"
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
                          <FormLabel className="text-xs font-medium tracking-wider uppercase text-muted-foreground">
                            Email
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="your@email.com"
                              className="h-12 rounded-xl border-border/40 bg-background focus:border-primary/50"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Inquiry Type */}
                  <FormField
                    control={form.control}
                    name="inquiryType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium tracking-wider uppercase text-muted-foreground">
                          What can we help with?
                        </FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12 rounded-xl border-border/40 bg-background">
                              <SelectValue placeholder="Choose an inquiry type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {INQUIRY_TYPES.map((type) => (
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

                  {/* ── Conditional Fields ── */}

                  {/* Custom Order: Image upload + Custom Studio link */}
                  {watchedInquiryType === "custom" && (
                    <div className="space-y-4 animate-in fade-in-0 slide-in-from-top-2 duration-200">
                      <ImageUploadField
                        images={selectedImages}
                        previews={imagePreviews}
                        onAdd={handleImageAdd}
                        onRemove={handleImageRemove}
                      />
                      <Link
                        to="/create"
                        className="flex items-center gap-2 text-sm text-primary/70 hover:text-primary transition-colors"
                      >
                        <Sparkles className="h-3.5 w-3.5" />
                        Already started a design? Finish it in our Custom Studio
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  )}

                  {/* Order Help: Order number + Issue type */}
                  {watchedInquiryType === "order-help" && (
                    <div className="space-y-5 animate-in fade-in-0 slide-in-from-top-2 duration-200">
                      <FormField
                        control={form.control}
                        name="orderNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-medium tracking-wider uppercase text-muted-foreground">
                              Order Number <span className="normal-case tracking-normal font-normal">(optional)</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g. YPS-1234"
                                className="h-12 rounded-xl border-border/40 bg-background focus:border-primary/50"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="issueType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-medium tracking-wider uppercase text-muted-foreground">
                              What's the issue?
                            </FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-12 rounded-xl border-border/40 bg-background">
                                  <SelectValue placeholder="Select an issue type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {ORDER_ISSUE_TYPES.map((type) => (
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
                    </div>
                  )}

                  {/* Collaboration: Company name */}
                  {watchedInquiryType === "collaboration" && (
                    <div className="animate-in fade-in-0 slide-in-from-top-2 duration-200">
                      <FormField
                        control={form.control}
                        name="companyName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-medium tracking-wider uppercase text-muted-foreground">
                              Company / Brand Name
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Your company or brand"
                                className="h-12 rounded-xl border-border/40 bg-background focus:border-primary/50"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {/* Message */}
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium tracking-wider uppercase text-muted-foreground">
                          Message
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder={
                              watchedInquiryType === "custom"
                                ? "Tell us about your dream nail design..."
                                : watchedInquiryType === "order-help"
                                  ? "Describe the issue with your order..."
                                  : watchedInquiryType === "collaboration"
                                    ? "Tell us about your collaboration idea..."
                                    : "How can we help?"
                            }
                            className="min-h-[120px] rounded-xl border-border/40 bg-background resize-none focus:border-primary/50"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Submit */}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 rounded-full text-sm font-medium tracking-wide shadow-md shadow-primary/20 gap-2"
                    size="lg"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </div>

            {/* FAQ Suggestions (below form card, when General is selected) */}
            <AnimatePresence>
              {watchedInquiryType === "general" && <FaqSuggestionCards />}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ─── Instagram Feed (preserved) ─── */}
      <section className="relative py-20 sm:py-28 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-muted/20" />

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <div ref={instaSectionRef} className="reveal text-center mb-12 sm:mb-16">
            <p className="text-[10px] font-semibold tracking-[0.35em] uppercase text-muted-foreground/50 mb-6">
              @yourprettysets
            </p>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-medium text-foreground leading-tight mb-4">
              Follow the
              <span className="italic font-light text-primary/70"> journey</span>
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base max-w-md mx-auto">
              Real nails, real moments. Get inspired by our latest creations.
            </p>
          </div>
        </div>

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
    </div>
  );
};

export default Contact;
