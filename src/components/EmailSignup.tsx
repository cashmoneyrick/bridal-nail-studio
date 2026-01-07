import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const EmailSignup = () => {
  // Countdown state
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isExpired, setIsExpired] = useState(false);

  // Form state
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({ firstName: "", email: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitState, setSubmitState] = useState<'idle' | 'success' | 'error'>('idle');

  // Countdown logic
  useEffect(() => {
    const targetDate = new Date('2026-02-05T23:59:00-05:00').getTime(); // EST

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        setIsExpired(true);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  // Validation
  const validateForm = () => {
    const newErrors = { firstName: "", email: "" };
    let isValid = true;

    if (!firstName.trim()) {
      newErrors.firstName = "This field is required";
      isValid = false;
    }

    if (!email.trim()) {
      newErrors.email = "This field is required";
      isValid = false;
    } else if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email)) {
      newErrors.email = "Please enter a valid email";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({ firstName: "", email: "" });

    try {
      const { data, error } = await supabase.functions.invoke('subscribe-newsletter', {
        body: {
          email: email.trim().toLowerCase(),
          first_name: firstName.trim(),
          source: 'homepage_valentine',
        },
      });

      if (error) throw error;

      if (data?.already_subscribed) {
        setErrors({ firstName: "", email: "You're already on the list! Check your inbox for your code." });
        setIsSubmitting(false);
        return;
      }

      // Success!
      setSubmitState('success');
    } catch (error) {
      console.error('Subscription error:', error);
      toast.error("Something went wrong. Please try again.");
      setSubmitState('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Copy code to clipboard
  const copyCode = () => {
    navigator.clipboard.writeText('PRETTY17');
    toast.success("Code copied to clipboard!", { position: "top-center" });
  };

  if (submitState === 'success') {
    return (
      <section className="py-16 sm:py-20 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <div className="animate-fade-in">
            <h2 className="font-display text-2xl sm:text-3xl font-medium mb-3">
              ✨ You're on the list! ✨
            </h2>
            <p className="text-muted-foreground text-base mb-6">
              Check your inbox for your 17% off code
            </p>

            <button
              onClick={copyCode}
              className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full font-mono font-semibold tracking-wider text-sm sm:text-base mb-6 hover:bg-primary/20 transition-colors cursor-pointer"
            >
              PRETTY17
              <span className="text-xs">📋 Click to copy</span>
            </button>

            <div>
              <Button
                asChild
                className="btn-primary inline-flex items-center gap-2"
              >
                <a href="#products">
                  SHOP BEST SELLERS →
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 sm:py-20 bg-gradient-to-b from-primary/5 to-background">
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .shimmer-button {
          position: relative;
          overflow: hidden;
        }

        .shimmer-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          transform: translateX(-100%);
        }

        /* Mobile: always animate (loop) */
        @media (hover: none) {
          .shimmer-button::before {
            animation: shimmer 2.5s infinite;
          }
        }

        /* Desktop: animate on hover only */
        @media (hover: hover) {
          .shimmer-button:hover::before {
            animation: shimmer 1.5s;
          }
        }
      `}</style>

      <div className="container mx-auto px-4 text-center max-w-2xl">
        <h2 className="font-display text-3xl sm:text-4xl font-medium mb-3">
          Get 17% Off Your First Set
        </h2>
        <p className="text-muted-foreground text-lg italic mb-8">
          Join for early access, exclusive drops & nail inspo ✨
        </p>

        {/* Countdown Timer */}
        {!isExpired ? (
          <div className="flex items-start justify-center gap-2 mb-8 font-mono text-xl sm:text-2xl tracking-wider">
            <div className="flex flex-col items-center">
              <div className="bg-white/50 rounded-lg px-3 py-2">
                {String(timeLeft.days).padStart(2, '0')}
              </div>
              <span className="text-xs uppercase tracking-wide text-muted-foreground mt-1">days</span>
            </div>
            <span className="text-primary font-light text-xl mt-2">:</span>
            <div className="flex flex-col items-center">
              <div className="bg-white/50 rounded-lg px-3 py-2">
                {String(timeLeft.hours).padStart(2, '0')}
              </div>
              <span className="text-xs uppercase tracking-wide text-muted-foreground mt-1">hrs</span>
            </div>
            <span className="text-primary font-light text-xl mt-2">:</span>
            <div className="flex flex-col items-center">
              <div className="bg-white/50 rounded-lg px-3 py-2">
                {String(timeLeft.minutes).padStart(2, '0')}
              </div>
              <span className="text-xs uppercase tracking-wide text-muted-foreground mt-1">mins</span>
            </div>
            <span className="text-primary font-light text-xl mt-2">:</span>
            <div className="flex flex-col items-center">
              <div className="bg-white/50 rounded-lg px-3 py-2">
                {String(timeLeft.seconds).padStart(2, '0')}
              </div>
              <span className="text-xs uppercase tracking-wide text-muted-foreground mt-1">secs</span>
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground italic mb-8">
            Valentine's ordering is closed — join for future drops!
          </p>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-start sm:items-center justify-center gap-3 sm:gap-4 max-w-xl mx-auto">
          {/* First Name Input with Floating Label */}
          <div className="relative w-full sm:w-48">
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="peer w-full rounded-xl px-4 py-3 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder-transparent"
              placeholder="First name"
            />
            <label
              htmlFor="firstName"
              className="absolute left-3 -top-2.5 bg-white px-1 text-xs text-primary transition-all duration-200
                         peer-placeholder-shown:top-3 peer-placeholder-shown:left-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-muted-foreground peer-placeholder-shown:bg-transparent
                         peer-focus:-top-2.5 peer-focus:left-3 peer-focus:text-xs peer-focus:text-primary peer-focus:bg-white"
            >
              First name
            </label>
            {errors.firstName && (
              <p className="text-sm text-destructive mt-1 text-left">{errors.firstName}</p>
            )}
          </div>

          {/* Email Input with Floating Label */}
          <div className="relative w-full sm:w-48">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="peer w-full rounded-xl px-4 py-3 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder-transparent"
              placeholder="Email"
            />
            <label
              htmlFor="email"
              className="absolute left-3 -top-2.5 bg-white px-1 text-xs text-primary transition-all duration-200
                         peer-placeholder-shown:top-3 peer-placeholder-shown:left-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-muted-foreground peer-placeholder-shown:bg-transparent
                         peer-focus:-top-2.5 peer-focus:left-3 peer-focus:text-xs peer-focus:text-primary peer-focus:bg-white"
            >
              Email
            </label>
            {errors.email && (
              <p className="text-sm text-destructive mt-1 text-left">{errors.email}</p>
            )}
          </div>

          {/* Shimmer Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="shimmer-button bg-foreground text-white rounded-xl px-6 py-3 font-medium hover:scale-[1.02] transition-transform w-full sm:w-auto"
          >
            {isSubmitting ? "..." : "I'M IN 💅"}
          </Button>
        </form>

        {/* Social Proof */}
        <p className="text-sm text-muted-foreground text-center mt-6">
          Join 2,000+ nail lovers 💅
        </p>
      </div>
    </section>
  );
};

export default EmailSignup;
