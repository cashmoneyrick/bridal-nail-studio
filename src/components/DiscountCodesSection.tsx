import { useState } from "react";
import { Tag, Copy, Check, ShoppingBag, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useDiscountCodesStore } from "@/stores/discountCodesStore";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const DiscountCodesSection = () => {
  const { codes, appliedCode, applyCode, clearAppliedCode } = useDiscountCodesStore();
  const cartItems = useCartStore(state => state.items);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`${code} copied to clipboard!`, { position: "top-center" });
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleApplyToCart = (code: string) => {
    if (cartItems.length === 0) {
      toast.error("Add items to your cart first!", { position: "top-center" });
      return;
    }
    
    if (appliedCode === code) {
      clearAppliedCode();
      toast.info("Discount code removed", { position: "top-center" });
    } else {
      applyCode(code);
      toast.success(`${code} applied to your cart!`, { position: "top-center" });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (codes.length === 0) {
    return (
      <Card className="border-dashed border-2 border-border/50">
        <CardContent className="py-8">
          <div className="text-center space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-muted flex items-center justify-center">
              <Ticket className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-medium text-foreground">No discount codes yet</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Sign up for our newsletter or join the Nail Club to receive exclusive discounts!
              </p>
            </div>
            <Link to="/nail-club">
              <Button variant="outline" size="sm" className="mt-2">
                Join Nail Club
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-full bg-primary/10">
            <Tag className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-base font-medium">My Discount Codes</CardTitle>
            <CardDescription className="text-sm">
              {codes.length} code{codes.length !== 1 ? 's' : ''} available
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {codes.map((discountCode) => (
          <div
            key={discountCode.code}
            className={`relative p-4 rounded-xl border transition-all ${
              appliedCode === discountCode.code
                ? "border-primary bg-primary/5"
                : "border-border/50 bg-muted/30 hover:border-primary/30"
            }`}
          >
            {appliedCode === discountCode.code && (
              <Badge className="absolute -top-2 right-3 bg-primary text-primary-foreground text-xs">
                Applied
              </Badge>
            )}
            
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono font-bold text-lg text-foreground tracking-wider">
                    {discountCode.code}
                  </span>
                  {discountCode.used && (
                    <Badge variant="secondary" className="text-xs">Used</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground truncate">
                  {discountCode.description}
                </p>
                <p className="text-xs text-muted-foreground/70 mt-1">
                  From {discountCode.source} • {formatDate(discountCode.receivedAt)}
                </p>
              </div>
              
              <div className="flex items-center gap-2 flex-shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => handleCopyCode(discountCode.code)}
                >
                  {copiedCode === discountCode.code ? (
                    <Check className="h-4 w-4 text-primary" />
                  ) : (
                    <Copy className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
                <Button
                  variant={appliedCode === discountCode.code ? "default" : "outline"}
                  size="sm"
                  className="gap-1.5"
                  onClick={() => handleApplyToCart(discountCode.code)}
                >
                  <ShoppingBag className="h-3.5 w-3.5" />
                  {appliedCode === discountCode.code ? "Remove" : "Apply"}
                </Button>
              </div>
            </div>
          </div>
        ))}
        
        {cartItems.length === 0 && (
          <p className="text-xs text-muted-foreground text-center pt-2">
            Add items to your cart to apply a discount code
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default DiscountCodesSection;
