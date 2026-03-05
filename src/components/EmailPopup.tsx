import { useState, useEffect } from "react";
import { X, Check, Copy, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import ConfettiEffect from "./ConfettiEffect";
import { useDiscountCodesStore } from "@/stores/discountCodesStore";

const GRAIN_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`;

const EmailPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [copied, setCopied] = useState(false);
  const addCode = useDiscountCodesStore(state => state.addCode);

  const prefersReducedMotion = typeof window !== "undefined"
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

  useEffect(() => {
    if (localStorage.getItem("emailSignupCompleted")) return;
    if (sessionStorage.getItem("popupShownThisSession")) return;

    const handleScroll = () => {
      const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      if (scrollPercent >= 25) {
        setIsOpen(true);
        sessionStorage.setItem("popupShownThisSession", "true");
        window.removeEventListener("scroll", handleScroll);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClose = () => setIsOpen(false);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText("WELCOME17");
    } catch {
      // Fallback for non-secure contexts
      try {
        const textarea = document.createElement('textarea');
        textarea.value = 'WELCOME17';
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      } catch {
        toast({
          title: "Couldn't copy",
          description: "Your code is WELCOME17",
        });
        return;
      }
    }
    setCopied(true);
    toast({
      title: "Code copied!",
      description: "WELCOME17 has been copied to your clipboard.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsLoading(false);
    setIsSubmitted(true);
    setShowConfetti(true);
    localStorage.setItem("emailSignupCompleted", "true");

    addCode({
      code: "WELCOME17",
      description: "17% off your first order",
      source: "Welcome popup",
      receivedAt: new Date().toISOString(),
      used: false,
    });

    toast({
      title: "You're in!",
      description: "Check your email for your 17% discount code.",
    });
  };

  const stagger = (delayMs: number) =>
    prefersReducedMotion
      ? undefined
      : { animation: `fade-in-up 0.6s ease-out ${delayMs}ms both` };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[520px] p-0 overflow-hidden border-0 bg-transparent shadow-2xl gap-0">
        <DialogTitle className="sr-only">Get 17% Off Your First Order</DialogTitle>

        <div className="relative overflow-hidden rounded-3xl bg-background">
          {/* Inline keyframes */}
          <style>{`
            @keyframes fade-in-up {
              from { opacity: 0; transform: translateY(16px); }
              to { opacity: 1; transform: translateY(0); }
            }
            @keyframes editorial-drift {
              0%, 100% { transform: translateY(-50%) translateX(0); }
              50% { transform: translateY(-50%) translateX(-6px); }
            }
            @keyframes shimmer-sweep {
              from { transform: translateX(-100%); }
              to { transform: translateX(100%); }
            }
          `}</style>

          {/* Confetti layer */}
          {showConfetti && <ConfettiEffect count={40} />}

          {/* Paper grain texture */}
          <div
            className="absolute inset-0 z-[1] pointer-events-none opacity-[0.03]"
            style={{ backgroundImage: GRAIN_SVG, backgroundRepeat: "repeat" }}
          />

          {/* Gradient orb — sage green */}
          <div className="absolute -top-20 -right-20 w-[300px] h-[300px] rounded-full bg-primary/[0.08] blur-[80px] pointer-events-none z-0" />

          {/* Secondary orb — dusty blue (mobile only) */}
          <div className="sm:hidden absolute -bottom-16 -left-16 w-[200px] h-[200px] rounded-full bg-secondary/[0.06] blur-[60px] pointer-events-none z-0" />

          {/* Ghosted editorial "17%" */}
          <span
            className="absolute right-[-20px] sm:right-[-30px] top-[50%] font-display text-[160px] sm:text-[220px] font-bold italic text-foreground/[0.04] leading-none select-none pointer-events-none z-0"
            style={
              prefersReducedMotion
                ? { transform: "translateY(-50%)" }
                : { animation: "editorial-drift 8s ease-in-out infinite" }
            }
          >
            17%
          </span>

          {/* Close button */}
          <button
            onClick={handleClose}
            aria-label="Close"
            className="absolute top-4 right-4 sm:top-5 sm:right-5 z-20 w-8 h-8 rounded-full flex items-center justify-center bg-foreground/[0.05] hover:bg-foreground/[0.1] backdrop-blur-sm transition-all duration-300 group/close"
          >
            <X className="h-3.5 w-3.5 text-foreground/40 group-hover/close:text-foreground/60 group-hover/close:rotate-90 transition-all duration-300" />
          </button>

          {/* ─── Content ─── */}
          <div className="relative z-10 px-7 pt-12 pb-8 sm:px-10 sm:pt-14 sm:pb-10">
            {!isSubmitted ? (
              /* ═══ FORM STATE ═══ */
              <>
                <p
                  className="text-[10px] sm:text-[11px] font-medium tracking-[0.3em] uppercase text-foreground/40"
                  style={stagger(100)}
                >
                  Exclusive Offer
                </p>

                <h2 className="mt-3">
                  <span
                    className="block font-display text-2xl sm:text-3xl font-light text-foreground/90 leading-none"
                    style={stagger(200)}
                  >
                    Unlock
                  </span>
                  <span
                    className="block font-display text-5xl sm:text-6xl font-bold italic text-foreground leading-none mt-1"
                    style={stagger(300)}
                  >
                    17% Off
                  </span>
                  <span
                    className="block font-display text-lg sm:text-xl italic font-light text-primary/80 leading-snug mt-1"
                    style={stagger(400)}
                  >
                    your first order
                  </span>
                </h2>

                <p
                  className="text-sm text-muted-foreground/80 leading-relaxed mt-5 max-w-[300px]"
                  style={stagger(500)}
                >
                  Join our list and receive your welcome discount — handcrafted just like our nails.
                </p>

                <form
                  onSubmit={handleSubmit}
                  className="mt-6 flex flex-col sm:flex-row sm:items-end gap-3 sm:gap-4"
                  style={stagger(600)}
                >
                  <div className="flex-1">
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full h-12 bg-transparent border-0 border-b border-foreground/15 px-0 text-sm text-foreground placeholder:text-foreground/25 focus:outline-none focus:border-foreground/40 transition-colors duration-300 font-light tracking-wide"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="relative w-full sm:w-auto sm:px-8 h-12 rounded-full bg-primary text-primary-foreground font-medium text-sm tracking-wide overflow-hidden hover:bg-primary/90 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {/* Shimmer sweep on hover */}
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full pointer-events-none" />
                    <span className="relative">
                      {isLoading ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Joining...
                        </span>
                      ) : (
                        "Unlock My 17% Off"
                      )}
                    </span>
                  </button>
                </form>

                <p
                  className="text-[11px] text-muted-foreground/40 mt-5"
                  style={stagger(700)}
                >
                  No spam · Unsubscribe anytime
                </p>
              </>
            ) : (
              /* ═══ SUCCESS STATE ═══ */
              <>
                <p
                  className="text-[10px] sm:text-[11px] font-medium tracking-[0.3em] uppercase text-foreground/40"
                  style={stagger(100)}
                >
                  Thank You
                </p>

                <h3 className="mt-3">
                  <span
                    className="block font-display text-4xl sm:text-5xl font-bold italic text-foreground leading-none"
                    style={stagger(200)}
                  >
                    You're In
                  </span>
                  <span
                    className="block font-display text-lg italic font-light text-primary/80 leading-snug mt-1"
                    style={stagger(300)}
                  >
                    your code is ready
                  </span>
                </h3>

                {/* Discount code pill */}
                <div
                  className="mt-6 inline-flex items-center gap-3 bg-foreground/[0.04] rounded-full px-6 py-3 border border-foreground/[0.06]"
                  style={stagger(400)}
                >
                  <span className="font-mono text-lg sm:text-xl font-bold tracking-[0.2em] text-foreground">
                    WELCOME17
                  </span>
                  <button
                    onClick={handleCopyCode}
                    className="p-1.5 rounded-full hover:bg-foreground/[0.06] transition-all duration-200"
                    aria-label="Copy code"
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-primary" />
                    ) : (
                      <Copy className="h-4 w-4 text-foreground/30 hover:text-foreground/50 transition-colors" />
                    )}
                  </button>
                </div>

                <div style={stagger(500)} className="mt-6">
                  <a
                    href="/shop"
                    onClick={handleClose}
                    className="inline-flex items-center justify-center w-full sm:w-auto px-8 h-12 rounded-full bg-primary text-primary-foreground font-medium text-sm tracking-wide hover:bg-primary/90 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                  >
                    Start Shopping
                  </a>
                </div>

                <p
                  className="text-[11px] text-muted-foreground/40 mt-5"
                  style={stagger(600)}
                >
                  Code saved to your account
                </p>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmailPopup;
