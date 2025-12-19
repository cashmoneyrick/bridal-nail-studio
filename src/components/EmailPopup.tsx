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
    const hasSeenPopup = localStorage.getItem("emailPopupDismissed");
    
    if (!hasSeenPopup) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem("emailPopupDismissed", "true");
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText("WELCOME15");
    setCopied(true);
    toast({
      title: "Code copied!",
      description: "WELCOME15 has been copied to your clipboard.",
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
    localStorage.setItem("emailPopupDismissed", "true");
    
    addCode({
      code: "WELCOME15",
      description: "15% off your first order",
      source: "Welcome popup",
      receivedAt: new Date().toISOString(),
      used: false,
    });
    
    toast({
      title: "Welcome to the family!",
      description: "Check your email for your 15% discount code.",
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
            <div className="grid grid-cols-1 sm:grid-cols-5">
              {/* Left accent bar */}
              <div className="hidden sm:block sm:col-span-2 bg-primary relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)]" />
                <div className="h-full flex flex-col items-center justify-center p-6 text-primary-foreground">
                  <div className="w-16 h-16 rounded-full bg-primary-foreground/20 flex items-center justify-center mb-4 backdrop-blur-sm">
                    <Percent className="h-8 w-8" />
                  </div>
                  <span className="font-display text-6xl font-bold leading-none">15</span>
                  <span className="text-lg font-medium -mt-1">% OFF</span>
                </div>
              </div>
              
              {/* Main content */}
              <div className="sm:col-span-3 bg-background p-6 sm:p-8">
                {/* Mobile header */}
                <div className="sm:hidden text-center mb-6">
                  <div className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium mb-4">
                    <Percent className="h-4 w-4" />
                    <span>15% OFF</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h2 className="font-display text-2xl sm:text-xl font-semibold text-foreground leading-tight">
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
                      {isLoading ? "Joining..." : "Get My 15% Off"}
                    </Button>
                  </form>

                  <p className="text-xs text-muted-foreground text-center">
                    No spam, ever. Unsubscribe anytime.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* Success State */
            <div className="bg-background p-8 text-center relative z-10">
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
                    WELCOME15
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
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmailPopup;
