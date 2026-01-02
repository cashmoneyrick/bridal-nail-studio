import { useState, useEffect } from "react";
import { X, Check, Copy, Percent } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import ConfettiEffect from "./ConfettiEffect";
import { useDiscountCodesStore } from "@/stores/discountCodesStore";

const EmailPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [copied, setCopied] = useState(false);
  const addCode = useDiscountCodesStore(state => state.addCode);

  useEffect(() => {
    // Never show if user already submitted email
    if (localStorage.getItem("emailSignupCompleted")) return;
    // Don't show again this session
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

  const handleClose = () => {
    setIsOpen(false);
    // No need to set localStorage here - only on submit
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText("WELCOME17");
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
      title: "Welcome to the family!",
      description: "Check your email for your 17% discount code.",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[420px] p-0 overflow-hidden border-0 bg-transparent shadow-2xl gap-0">
        <div className="relative overflow-hidden rounded-2xl">
          {/* Confetti */}
          {showConfetti && <ConfettiEffect count={40} />}
          
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 z-20 p-2 rounded-full bg-foreground/10 hover:bg-foreground/20 backdrop-blur-sm transition-colors"
          >
            <X className="h-4 w-4 text-foreground" />
          </button>

          {!isSubmitted ? (
            <>
              {/* Mobile layout - Centered Elegance */}
              <div className="sm:hidden bg-background p-8 text-center space-y-6">
                <div className="space-y-4">
                  <h2 className="font-display text-2xl font-bold text-foreground">
                    17% OFF YOUR FIRST ORDER
                  </h2>
                  <div className="w-16 h-0.5 bg-primary mx-auto" />
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Join 10,000+ nail lovers and get your exclusive discount
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 rounded-xl bg-muted/50 border-border focus:border-primary text-center"
                  />
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 rounded-xl font-medium bg-primary hover:bg-primary/90"
                  >
                    {isLoading ? "Joining..." : "Unlock Discount"}
                  </Button>
                </form>

                <p className="text-xs text-muted-foreground">
                  No spam, unsubscribe anytime
                </p>
              </div>

              {/* Desktop layout - Keep as-is */}
              <div className="hidden sm:grid grid-cols-5">
                {/* Left accent bar */}
                <div className="col-span-2 bg-primary relative overflow-hidden">
                  <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)]" />
                  <div className="h-full flex flex-col items-center justify-center p-6 text-primary-foreground">
                    <div className="w-16 h-16 rounded-full bg-primary-foreground/20 flex items-center justify-center mb-4 backdrop-blur-sm">
                      <Percent className="h-8 w-8" />
                    </div>
                    <span className="font-display text-6xl font-bold leading-none">17</span>
                    <span className="text-lg font-medium -mt-1">% OFF</span>
                  </div>
                </div>

                {/* Main content */}
                <div className="col-span-3 bg-background p-8">
                  <div className="space-y-4">
                    <div>
                      <h2 className="font-display text-xl font-semibold text-foreground leading-tight">
                        Unlock Your Exclusive Discount
                      </h2>
                      <p className="text-muted-foreground text-sm mt-2">
                        Join 10,000+ nail lovers and get your first order discount.
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-3">
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-11 rounded-lg bg-muted/50 border-border focus:border-primary"
                      />
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-11 rounded-lg font-medium"
                      >
                        {isLoading ? "Joining..." : "Unlock Discount"}
                      </Button>
                    </form>

                    <p className="text-xs text-muted-foreground text-center">
                      No spam, ever. Unsubscribe anytime.
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* Success State */
            <>
              {/* Mobile success - Centered Elegance */}
              <div className="sm:hidden bg-background p-8 text-center relative z-10 space-y-6">
                <div className="space-y-4">
                  <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                    <Check className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-foreground">
                    You're In!
                  </h3>
                  <div className="w-16 h-0.5 bg-primary mx-auto" />
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Your exclusive discount is ready to use
                  </p>
                </div>

                <div className="bg-muted/50 rounded-xl p-4 border border-border/50">
                  <div className="flex items-center justify-center gap-2">
                    <span className="font-mono text-2xl font-bold text-primary tracking-widest">
                      WELCOME17
                    </span>
                    <button
                      onClick={handleCopyCode}
                      className="p-2 rounded-md hover:bg-muted transition-colors"
                    >
                      {copied ? (
                        <Check className="h-4 w-4 text-primary" />
                      ) : (
                        <Copy className="h-4 w-4 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                </div>

                <Button onClick={handleClose} className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90">
                  Start Shopping
                </Button>

                <p className="text-xs text-muted-foreground">
                  Code saved to your account
                </p>
              </div>

              {/* Desktop success - Keep as-is */}
              <div className="hidden sm:block bg-background p-8 text-center relative z-10">
                <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Check className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                  You're In!
                </h3>
                <p className="text-muted-foreground text-sm mb-5">
                  Your exclusive discount is ready to use.
                </p>

                <div className="bg-muted/50 rounded-lg p-4 mb-5 border border-border/50">
                  <p className="text-xs text-muted-foreground mb-1.5">Your code:</p>
                  <div className="flex items-center justify-center gap-2">
                    <span className="font-mono text-2xl font-bold text-primary tracking-widest">
                      WELCOME17
                    </span>
                    <button
                      onClick={handleCopyCode}
                      className="p-2 rounded-md hover:bg-muted transition-colors"
                    >
                      {copied ? (
                        <Check className="h-4 w-4 text-primary" />
                      ) : (
                        <Copy className="h-4 w-4 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                </div>

                <Button onClick={handleClose} className="w-full h-11 rounded-lg">
                  Start Shopping
                </Button>

                <p className="text-xs text-muted-foreground mt-3">
                  Code saved to your account.
                </p>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmailPopup;
