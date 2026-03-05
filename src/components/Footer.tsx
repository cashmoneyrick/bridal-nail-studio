import { useState } from "react";
import { Link } from "react-router-dom";
import { Instagram, Facebook, Mail, ArrowUp, Loader2, Check } from "lucide-react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { logError } from "@/lib/logger";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const emailSchema = z.string().email("Please enter a valid email").max(255);

const footerLinks = {
  explore: [
    { name: "Shop All", to: "/shop" },
    { name: "Custom Studio", to: "/create" },
    { name: "Nail Club", to: "/club" },
    { name: "Favorites", to: "/favorites" },
  ],
  help: [
    { name: "How-To Guides", to: "/how-to" },
    { name: "Sizing Guide", to: "/how-to/sizing" },
    { name: "Application Tips", to: "/how-to/application" },
    { name: "Troubleshooting", to: "/how-to/troubleshooting" },
    { name: "Contact Us", to: "/contact" },
  ],
};

const Footer = () => {
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const newsletterRef = useScrollReveal<HTMLDivElement>({ threshold: 0.05 });
  const linksRef = useScrollReveal<HTMLDivElement>({ threshold: 0.05 });

  const alreadySubscribed = typeof window !== "undefined" && localStorage.getItem("emailSignupCompleted") === "true";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) { setStatus("success"); return; }

    const result = emailSchema.safeParse(email.trim());
    if (!result.success) {
      setErrorMsg(result.error.errors[0].message);
      setStatus("error");
      return;
    }

    setStatus("loading");
    try {
      const { data, error } = await supabase.functions.invoke("subscribe-newsletter", {
        body: { email: email.trim().toLowerCase(), source: "footer" },
      });
      if (error) throw error;
      if (data?.success) {
        setStatus("success");
        localStorage.setItem("emailSignupCompleted", "true");
      } else {
        setErrorMsg(data?.error || "Something went wrong.");
        setStatus("error");
      }
    } catch (err) {
      logError("Footer newsletter error:", err);
      setErrorMsg("Something went wrong. Please try again.");
      setStatus("error");
    }
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const linkClasses =
    "text-background/60 hover:text-background text-sm transition-colors duration-300 relative after:absolute after:bottom-[-2px] after:left-0 after:w-full after:h-px after:bg-primary after:scale-x-0 hover:after:scale-x-100 after:origin-left after:transition-transform after:duration-300 inline-block";

  return (
    <footer className="bg-foreground text-background w-full max-w-full overflow-hidden relative">
      {/* Decorative gradient orbs */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full bg-primary/[0.06] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] rounded-full bg-secondary/[0.04] blur-[100px] pointer-events-none" />

      {/* ─── Section A: Newsletter / Brand Statement ─── */}
      <div ref={newsletterRef} className="reveal border-b border-background/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Brand statement */}
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-background/40 font-medium mb-4">
                Stay Connected
              </p>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-light italic leading-[1.1] tracking-tight text-background/90">
                Be the first to know
              </h2>
              <p className="text-background/50 text-base sm:text-lg mt-5 leading-relaxed max-w-md">
                New drops, style inspiration, and exclusive offers — delivered to your inbox.
              </p>
            </div>

            {/* Newsletter form */}
            <div className="lg:flex lg:justify-end">
              {alreadySubscribed || status === "success" ? (
                <div className="flex items-center gap-3 text-background/70">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <Check className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-sm">You're on the list. Welcome to the family.</span>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="w-full max-w-md space-y-3">
                  {/* Honeypot */}
                  <input
                    type="text"
                    name="website"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    className="absolute -left-[9999px] opacity-0 pointer-events-none"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                  />
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (status === "error") setStatus("idle");
                      }}
                      required
                      maxLength={255}
                      className="flex-1 h-12 px-5 rounded-full bg-background/[0.06] border border-background/15 text-background placeholder:text-background/30 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all duration-300"
                    />
                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className="h-12 px-8 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 whitespace-nowrap"
                    >
                      {status === "loading" ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        "Subscribe"
                      )}
                    </button>
                  </div>
                  {status === "error" && (
                    <p className="text-sm text-red-400 pl-1">{errorMsg}</p>
                  )}
                  <p className="text-xs text-background/30 pl-1">
                    No spam, ever. Unsubscribe anytime.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ─── Section B: Navigation Links ─── */}
      <div ref={linksRef} className="reveal-children border-b border-background/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-12 gap-10 lg:gap-8">
            {/* Brand column */}
            <div className="col-span-2 sm:col-span-3 lg:col-span-5">
              <Link to="/" className="inline-block group">
                <h3 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight group-hover:text-primary transition-colors duration-300">
                  YourPrettySets
                </h3>
              </Link>
              <p className="text-background/50 text-sm mt-3 leading-relaxed max-w-xs">
                Handcrafted press-on nails, made to order in small batches. Designed for your prettiest moments.
              </p>

              {/* Social icons */}
              <div className="flex gap-3 mt-6">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-10 h-10 rounded-full bg-background/[0.05] border border-background/10 flex items-center justify-center hover:bg-primary hover:border-primary hover:scale-110 transition-all duration-300 group/icon"
                >
                  <Instagram className="w-4 h-4 text-background/60 group-hover/icon:text-primary-foreground" />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-10 h-10 rounded-full bg-background/[0.05] border border-background/10 flex items-center justify-center hover:bg-primary hover:border-primary hover:scale-110 transition-all duration-300 group/icon"
                >
                  <Facebook className="w-4 h-4 text-background/60 group-hover/icon:text-primary-foreground" />
                </a>
                <a
                  href="mailto:hello@yourprettysets.com"
                  aria-label="Email us"
                  className="w-10 h-10 rounded-full bg-background/[0.05] border border-background/10 flex items-center justify-center hover:bg-primary hover:border-primary hover:scale-110 transition-all duration-300 group/icon"
                >
                  <Mail className="w-4 h-4 text-background/60 group-hover/icon:text-primary-foreground" />
                </a>
              </div>
            </div>

            {/* Explore links */}
            <div className="lg:col-span-2">
              <h4 className="text-xs uppercase tracking-[0.25em] text-background/40 font-medium mb-5">
                Explore
              </h4>
              <ul className="space-y-3">
                {footerLinks.explore.map((link) => (
                  <li key={link.name}>
                    <Link to={link.to} className={linkClasses}>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Help links */}
            <div className="lg:col-span-2">
              <h4 className="text-xs uppercase tracking-[0.25em] text-background/40 font-medium mb-5">
                Help
              </h4>
              <ul className="space-y-3">
                {footerLinks.help.map((link) => (
                  <li key={link.name}>
                    <Link to={link.to} className={linkClasses}>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Connect column */}
            <div className="col-span-2 sm:col-span-1 lg:col-span-3">
              <h4 className="text-xs uppercase tracking-[0.25em] text-background/40 font-medium mb-5">
                Get in Touch
              </h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="mailto:hello@yourprettysets.com"
                    className={linkClasses}
                  >
                    hello@yourprettysets.com
                  </a>
                </li>
                <li>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkClasses}
                  >
                    Follow on Instagram
                  </a>
                </li>
                <li>
                  <Link to="/create" className={linkClasses}>
                    Start a Custom Order
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Section C: Bottom Bar ─── */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-background/30 text-xs tracking-wide">
            &copy; {new Date().getFullYear()} YourPrettySets. All rights reserved.
          </p>
          <button
            onClick={scrollToTop}
            aria-label="Back to top"
            className="group flex items-center gap-2 text-xs text-background/30 hover:text-background/70 transition-colors duration-300"
          >
            <span className="tracking-wide">Back to top</span>
            <span className="w-8 h-8 rounded-full border border-background/15 flex items-center justify-center group-hover:border-background/30 group-hover:-translate-y-0.5 transition-all duration-300">
              <ArrowUp className="w-3.5 h-3.5" />
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
