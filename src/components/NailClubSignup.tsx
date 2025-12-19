import { useState, useEffect } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Sparkles, Gift, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const emailSchema = z.string().email("Please enter a valid email address");

type SignupStatus = "idle" | "loading" | "success" | "already_subscribed" | "error";

const NailClubSignup = () => {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<SignupStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [cooldown, setCooldown] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Honeypot check - if filled, fake success (bot detected)
    if (honeypot) {
      setStatus("success");
      setShowConfetti(true);
      return;
    }

    // Client-side cooldown
    if (cooldown) return;

    // Validate email
    const result = emailSchema.safeParse(email.trim());
    if (!result.success) {
      setErrorMessage(result.error.errors[0].message);
      setStatus("error");
      return;
    }

    setStatus("loading");
    setCooldown(true);

    // Start cooldown timer (3 seconds)
    setTimeout(() => setCooldown(false), 3000);

    try {
      const { error } = await supabase
        .from("nail_club_subscribers")
        .insert({
          email: email.trim().toLowerCase(),
          first_name: firstName.trim() || null,
          source: "nail_club_page",
        });

      if (error) {
        // Handle duplicate email (unique constraint violation)
        if (error.code === "23505") {
          setStatus("already_subscribed");
          setShowConfetti(true);
        } else {
          console.error("Signup error:", error);
          setErrorMessage("Something went wrong. Please try again.");
          setStatus("error");
        }
      } else {
        setStatus("success");
        setShowConfetti(true);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setErrorMessage("Something went wrong. Please try again.");
      setStatus("error");
    }
  };

  // Success/Already Subscribed UI
  if (status === "success" || status === "already_subscribed") {
    return (
      <div className="relative w-full max-w-md mx-auto">
        {/* Confetti */}
        {showConfetti && <ConfettiEffect />}
        
        <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 pointer-events-none" />
          
          <div className="relative z-10">
            <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            
            <h3 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-3">
              {status === "already_subscribed" ? "You're already in 💅" : "You're in 💅"}
            </h3>
            
            <p className="text-muted-foreground mb-6">
              {status === "already_subscribed" 
                ? "Looks like you're already part of the Nail Club! Check your inbox for exclusive offers."
                : "Welcome to the Nail Club! You'll receive exclusive drops, early access, and members-only discounts straight to your inbox."}
            </p>

            {/* Discount Info Card */}
            <div className="bg-background/50 border border-border/30 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Gift className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-foreground">Discount codes sent via email:</span>
              </div>
              <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                <div className="flex items-center justify-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full" />
                  <span>$20 off orders $60+</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full" />
                  <span>15% ongoing Nail Club discount</span>
                </div>
              </div>
            </div>

            <Button asChild className="w-full">
              <Link to="/shop">Shop the Collection</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-8">
        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
            <Mail className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-2">
            Join the Nail Club
          </h3>
          <p className="text-muted-foreground text-sm">
            Early access, exclusive designs, and members-only savings.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Honeypot field - hidden from users, visible to bots */}
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

          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground">
              Email <span className="text-destructive">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status === "error") setStatus("idle");
              }}
              required
              className="bg-background/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-foreground">
              First Name <span className="text-muted-foreground text-xs">(optional)</span>
            </Label>
            <Input
              id="firstName"
              type="text"
              placeholder="Jane"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="bg-background/50"
            />
          </div>

          {status === "error" && (
            <p className="text-sm text-destructive">{errorMessage}</p>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={status === "loading" || cooldown}
          >
            {status === "loading" ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Joining...
              </>
            ) : (
              "Join the Nail Club"
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            We'll never spam you. Unsubscribe anytime.
          </p>
        </form>
      </div>
    </div>
  );
};

// CSS-only confetti effect component
const ConfettiEffect = () => {
  const [pieces, setPieces] = useState<Array<{ id: number; left: number; delay: number; color: string }>>([]);

  useEffect(() => {
    const colors = [
      "hsl(var(--primary))",
      "hsl(var(--secondary))",
      "hsl(var(--accent))",
      "#FFD700",
      "#FF69B4",
      "#87CEEB",
    ];
    
    const newPieces = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.5,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
    
    setPieces(newPieces);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-20">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute w-2 h-2 rounded-full animate-confetti-fall"
          style={{
            left: `${piece.left}%`,
            top: "-10px",
            backgroundColor: piece.color,
            animationDelay: `${piece.delay}s`,
          }}
        />
      ))}
    </div>
  );
};

export default NailClubSignup;
