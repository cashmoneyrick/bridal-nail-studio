import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin, Clock, Instagram, Send } from "lucide-react";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().trim().email("Please enter a valid email").max(255, "Email must be less than 255 characters"),
  subject: z.string().min(1, "Please select a subject"),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(1000, "Message must be less than 1000 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

const subjects = [
  "Order Inquiry",
  "Custom Design Request",
  "Sizing Help",
  "Returns & Exchanges",
  "Wholesale Inquiry",
  "Collaboration",
  "Other",
];

const contactInfo = [
  {
    icon: Mail,
    title: "Email Us",
    details: "hello@yourprettysets.com",
    subtext: "We reply within 24 hours",
  },
  {
    icon: Phone,
    title: "Call Us",
    details: "(555) 123-4567",
    subtext: "Mon-Fri, 9am-5pm EST",
  },
  {
    icon: MapPin,
    title: "Visit Us",
    details: "123 Beauty Lane",
    subtext: "Atlanta, GA 30301",
  },
  {
    icon: Clock,
    title: "Business Hours",
    details: "Mon - Fri: 9am - 5pm",
    subtext: "Sat: 10am - 2pm EST",
  },
];

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    toast({
      title: "Message Sent!",
      description: "We'll get back to you within 24 hours.",
    });
    
    reset();
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-28 pb-16 sm:pt-32 sm:pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <p className="text-sm font-medium tracking-[0.2em] uppercase text-primary mb-4">
              Get In Touch
            </p>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-medium mb-6">
              Contact Us
            </h1>
            <p className="text-muted-foreground text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto">
              Have a question about your order, need sizing help, or want to collaborate? 
              We'd love to hear from you.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="section-padding bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
              {/* Contact Form */}
              <div className="lg:col-span-3">
                <div className="bg-background rounded-2xl p-6 sm:p-8 shadow-sm">
                  <h2 className="font-display text-2xl font-medium mb-6">
                    Send Us a Message
                  </h2>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          placeholder="Your name"
                          {...register("name")}
                          className={errors.name ? "border-destructive" : ""}
                        />
                        {errors.name && (
                          <p className="text-sm text-destructive">{errors.name.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="your@email.com"
                          {...register("email")}
                          className={errors.email ? "border-destructive" : ""}
                        />
                        {errors.email && (
                          <p className="text-sm text-destructive">{errors.email.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Select onValueChange={(value) => setValue("subject", value)}>
                        <SelectTrigger className={errors.subject ? "border-destructive" : ""}>
                          <SelectValue placeholder="Select a subject" />
                        </SelectTrigger>
                        <SelectContent>
                          {subjects.map((subject) => (
                            <SelectItem key={subject} value={subject}>
                              {subject}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.subject && (
                        <p className="text-sm text-destructive">{errors.subject.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        placeholder="Tell us how we can help..."
                        rows={5}
                        {...register("message")}
                        className={errors.message ? "border-destructive" : ""}
                      />
                      {errors.message && (
                        <p className="text-sm text-destructive">{errors.message.message}</p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto btn-primary"
                    >
                      {isSubmitting ? (
                        "Sending..."
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </div>
              </div>

              {/* Contact Info */}
              <div className="lg:col-span-2 space-y-6">
                <h2 className="font-display text-2xl font-medium mb-6">
                  Contact Information
                </h2>

                <div className="space-y-4">
                  {contactInfo.map((info, index) => (
                    <div
                      key={index}
                      className="flex gap-4 p-4 bg-background rounded-xl shadow-sm"
                    >
                      <div className="w-12 h-12 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                        <info.icon className="w-5 h-5 text-primary" strokeWidth={1.5} />
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground">{info.title}</h3>
                        <p className="text-foreground/80">{info.details}</p>
                        <p className="text-sm text-muted-foreground">{info.subtext}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Social Links */}
                <div className="pt-6">
                  <h3 className="font-display text-lg font-medium mb-4">
                    Follow Us
                  </h3>
                  <div className="flex gap-3">
                    <a
                      href="https://instagram.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 rounded-full bg-background shadow-sm flex items-center justify-center hover:bg-primary/10 transition-colors"
                      aria-label="Instagram"
                    >
                      <Instagram className="w-5 h-5 text-foreground/70" strokeWidth={1.5} />
                    </a>
                    <a
                      href="mailto:hello@yourprettysets.com"
                      className="w-12 h-12 rounded-full bg-background shadow-sm flex items-center justify-center hover:bg-primary/10 transition-colors"
                      aria-label="Email"
                    >
                      <Mail className="w-5 h-5 text-foreground/70" strokeWidth={1.5} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Teaser */}
      <section className="section-padding">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-display text-2xl sm:text-3xl font-medium mb-4">
              Need Quick Answers?
            </h2>
            <p className="text-muted-foreground mb-8">
              Check out our How To page for tutorials, care instructions, and answers to frequently asked questions.
            </p>
            <a href="/how-to" className="btn-secondary inline-flex items-center justify-center">
              Visit How To Page
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
