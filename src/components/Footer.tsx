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

  const footerRef = useScrollReveal<HTMLDivElement>({ threshold: 0.05 });

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

      <div ref={footerRef} className="reveal">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14">

          {/* ─── Newsletter banner ─── */}
          <div className="rounded-2xl bg-primary/[0.12] border border-primary/20 px-6 sm:px-10 py-8 sm:py-10 mb-10 sm:mb-14">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 lg:gap-12">
              <div className="lg:max-w-md">
                <h2 className="font-display text-2xl sm:text-3xl font-light italic leading-tight tracking-tight text-background/90">
                  Be the first to know
                </h2>
                <p className="text-background/45 text-sm mt-2 leading-relaxed">
                  New drops, style inspiration, and exclusive offers — delivered to your inbox.
                </p>
              </div>

              <div className="flex-1 lg:max-w-sm">
                {alreadySubscribed || status === "success" ? (
                  <div className="flex items-center gap-3 text-background/70">
                    <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center">
                      <Check className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-sm">You're on the list. Welcome to the family.</span>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-2">
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
                    <div className="flex flex-col sm:flex-row gap-2.5">
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
                        className="sm:flex-1 h-14 sm:h-11 px-4 rounded-full bg-background/[0.08] border border-background/15 text-background placeholder:text-background/30 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all duration-300"
                      />
                      <button
                        type="submit"
                        disabled={status === "loading"}
                        className="h-14 sm:h-11 px-6 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/80 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 whitespace-nowrap"
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
                    <p className="text-xs text-background/25 pl-1">
                      No spam, ever. Unsubscribe anytime.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* ─── Footer grid: Brand + Links ─── */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-12 gap-8 lg:gap-6 pb-10 sm:pb-12">
            {/* Brand column */}
            <div className="col-span-2 sm:col-span-3 lg:col-span-4">
              <Link to="/" className="inline-block group">
                <h3 className="font-display text-2xl font-semibold tracking-tight group-hover:text-primary transition-colors duration-300">
                  YourPrettySets
                </h3>
              </Link>
              <p className="text-background/45 text-sm mt-2.5 leading-relaxed max-w-xs">
                Handcrafted press-on nails, made to order in small batches.
              </p>
              <div className="flex gap-2.5 mt-5">
                <a
                  href="https://www.instagram.com/yourprettysets"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-9 h-9 rounded-full bg-background/[0.05] border border-background/10 flex items-center justify-center hover:bg-primary hover:border-primary hover:scale-110 transition-all duration-300 group/icon"
                >
                  <Instagram className="w-3.5 h-3.5 text-background/60 group-hover/icon:text-primary-foreground" />
                </a>
                <a
                  href="https://www.facebook.com/yourprettysets"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-9 h-9 rounded-full bg-background/[0.05] border border-background/10 flex items-center justify-center hover:bg-primary hover:border-primary hover:scale-110 transition-all duration-300 group/icon"
                >
                  <Facebook className="w-3.5 h-3.5 text-background/60 group-hover/icon:text-primary-foreground" />
                </a>
                <a
                  href="mailto:hello@yourprettysets.com"
                  aria-label="Email us"
                  className="w-9 h-9 rounded-full bg-background/[0.05] border border-background/10 flex items-center justify-center hover:bg-primary hover:border-primary hover:scale-110 transition-all duration-300 group/icon"
                >
                  <Mail className="w-3.5 h-3.5 text-background/60 group-hover/icon:text-primary-foreground" />
                </a>
              </div>
            </div>

            {/* Explore links */}
            <div className="lg:col-span-2 lg:col-start-6">
              <h4 className="text-xs uppercase tracking-[0.25em] text-background/40 font-medium mb-4">
                Explore
              </h4>
              <ul className="space-y-2.5">
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
              <h4 className="text-xs uppercase tracking-[0.25em] text-background/40 font-medium mb-4">
                Help
              </h4>
              <ul className="space-y-2.5">
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
            <div className="col-span-2 sm:col-span-1 lg:col-span-2">
              <h4 className="text-xs uppercase tracking-[0.25em] text-background/40 font-medium mb-4">
                Get in Touch
              </h4>
              <ul className="space-y-2.5">
                <li>
                  <a href="mailto:hello@yourprettysets.com" className={linkClasses}>
                    hello@yourprettysets.com
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.instagram.com/yourprettysets"
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

          {/* ─── Bottom bar ─── */}
          <div className="border-t border-background/10 py-6">
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
        </div>
      </div>
    </footer>
  );
};

export default Footer;
