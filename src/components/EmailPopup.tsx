import { useState, useEffect } from "react";
import { X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

const EmailPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if user has already seen/dismissed the popup
    const hasSeenPopup = localStorage.getItem("emailPopupDismissed");
    
    if (!hasSeenPopup) {
      // Show popup after 3 seconds
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
    
    // Simulate API call - replace with actual newsletter signup
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    setIsLoading(false);
    setIsSubmitted(true);
    localStorage.setItem("emailPopupDismissed", "true");
    
    toast({
      title: "Welcome to the family!",
      description: "Check your email for your 15% discount code.",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden border-0 bg-transparent shadow-none">
        <div className="relative bg-gradient-to-br from-secondary/30 via-background to-primary/20 rounded-2xl border border-border/50 overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-secondary/20 rounded-full blur-2xl" />
          
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-10 p-1.5 rounded-full bg-background/80 hover:bg-background transition-colors"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>

          <div className="relative p-6 sm:p-8">
            {!isSubmitted ? (
              <>
                {/* Header */}
                <DialogHeader className="text-center space-y-3 mb-6">
                  <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                    <Sparkles className="h-7 w-7 text-primary" />
                  </div>
                  <DialogTitle className="font-display text-2xl sm:text-3xl text-foreground">
                    Get 15% Off
                  </DialogTitle>
                  <p className="text-muted-foreground text-sm sm:text-base">
                    Join our community and receive your exclusive discount on your first order.
                  </p>
                </DialogHeader>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 rounded-xl bg-background/80 border-border/50 text-center placeholder:text-muted-foreground/60"
                  />
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                  >
                    {isLoading ? "Joining..." : "Claim My 15% Off"}
                  </Button>
                </form>

                <p className="text-xs text-muted-foreground text-center mt-4">
                  No spam, unsubscribe anytime.
                </p>
              </>
            ) : (
              /* Success State */
              <div className="text-center py-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-display text-2xl text-foreground mb-2">
                  You're In!
                </h3>
                <p className="text-muted-foreground mb-4">
                  Check your inbox for your exclusive 15% discount code.
                </p>
                <div className="bg-primary/10 rounded-xl p-4 mb-4">
                  <p className="text-xs text-muted-foreground mb-1">Your code:</p>
                  <p className="font-mono text-xl font-bold text-primary tracking-wider">
                    WELCOME15
                  </p>
                </div>
                <Button
                  onClick={handleClose}
                  variant="outline"
                  className="rounded-xl"
                >
                  Start Shopping
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmailPopup;
