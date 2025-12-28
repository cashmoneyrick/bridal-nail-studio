import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ShoppingBag, Minus, Plus, Trash2, Loader2, Tag, X, Check } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { useDiscountCodesStore } from "@/stores/discountCodesStore";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "sonner";

// Member discount: 10% off orders $50+ for Nail Lover tier
const getMemberDiscount = (subtotal: number, isAuthenticated: boolean): number => {
  if (!isAuthenticated) return 0;
  if (subtotal >= 50) return subtotal * 0.10;
  return 0;
};

// Discount calculations based on code
const getDiscountAmount = (code: string, subtotal: number): number => {
  switch (code) {
    case "WELCOME15":
      return subtotal * 0.15;
    case "NAILCLUB20":
      return subtotal >= 60 ? 20 : 0;
    default:
      // Default 10% for other codes
      return subtotal * 0.10;
  }
};

const getDiscountLabel = (code: string): string => {
  switch (code) {
    case "WELCOME15":
      return "15% off";
    case "NAILCLUB20":
      return "$20 off orders $60+";
    default:
      return "10% off";
  }
};

export const CartDrawer = () => {
  const { 
    items, 
    isLoading, 
    updateQuantity, 
    removeItem, 
    clearCart,
    getTotalItems,
    getTotalPrice,
    isDrawerOpen,
    openDrawer,
    closeDrawer,
  } = useCartStore();
  
  const { appliedCode, clearAppliedCode } = useDiscountCodesStore();
  const { user } = useAuthStore();
  
  const totalItems = getTotalItems();
  const subtotal = getTotalPrice();
  
  // Calculate best discount (member discount vs applied code)
  const { discountAmount, discountLabel, discountSource } = useMemo(() => {
    const memberDiscount = getMemberDiscount(subtotal, !!user);
    const codeDiscount = appliedCode ? getDiscountAmount(appliedCode, subtotal) : 0;
    
    if (memberDiscount > 0 && memberDiscount >= codeDiscount) {
      return {
        discountAmount: memberDiscount,
        discountLabel: "Member: 10% off",
        discountSource: "member" as const,
      };
    } else if (codeDiscount > 0) {
      return {
        discountAmount: codeDiscount,
        discountLabel: `${appliedCode}: ${getDiscountLabel(appliedCode)}`,
        discountSource: "code" as const,
      };
    }
    return { discountAmount: 0, discountLabel: "", discountSource: null };
  }, [subtotal, user, appliedCode]);
  
  const totalPrice = subtotal - discountAmount;

  const handleCheckout = () => {
    toast.success("Checkout functionality coming soon!", {
      position: "top-center",
    });
    closeDrawer();
  };

  return (
    <Sheet open={isDrawerOpen} onOpenChange={(open) => open ? openDrawer() : closeDrawer()}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative hover:bg-primary/10">
          <ShoppingBag className="h-5 w-5" />
          {totalItems > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-primary text-primary-foreground">
              {totalItems}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent className="w-full sm:max-w-lg flex flex-col h-full">
        <SheetHeader className="flex-shrink-0">
          <SheetTitle className="font-display text-xl">Shopping Bag</SheetTitle>
          <SheetDescription>
            {totalItems === 0 ? "Your bag is empty" : `${totalItems} item${totalItems !== 1 ? 's' : ''} in your bag`}
          </SheetDescription>
        </SheetHeader>
        
        <div className="flex flex-col flex-1 pt-6 min-h-0">
          {items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Your bag is empty</p>
                <p className="text-sm text-muted-foreground mt-1">Add some beautiful nail sets!</p>
              </div>
            </div>
          ) : (
            <>
              {/* Scrollable items area */}
              <div className="flex-1 overflow-y-auto pr-2 min-h-0">
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.variantId} className="flex gap-4 p-3 bg-muted/30 rounded-xl">
                      <div className="w-20 h-20 bg-secondary/20 rounded-lg overflow-hidden flex-shrink-0">
                        {item.product.images?.[0] && (
                          <img
                            src={item.product.images[0]}
                            alt={item.product.title}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-display font-medium truncate">{item.product.title}</h4>
                        {item.variantTitle !== "Default" && (
                          <p className="text-sm text-muted-foreground">
                            {item.selectedOptions.map(option => option.value).join(' / ')}
                          </p>
                        )}
                        <p className="font-semibold mt-1">
                          ${parseFloat(item.price.amount).toFixed(2)}
                        </p>
                      </div>
                      
                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-destructive"
                          onClick={() => removeItem(item.variantId)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Fixed checkout section */}
              <div className="flex-shrink-0 space-y-3 pt-6 border-t mt-4 bg-background">
                {/* Subtotal */}
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                
                {/* Applied discount */}
                {discountAmount > 0 && (
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                      <Tag className="h-3.5 w-3.5 text-primary" />
                      <span className="text-primary font-medium">{discountLabel}</span>
                      {discountSource === "code" && (
                        <button
                          onClick={clearAppliedCode}
                          className="p-0.5 rounded-full hover:bg-muted transition-colors"
                        >
                          <X className="h-3 w-3 text-muted-foreground" />
                        </button>
                      )}
                    </div>
                    <span className="text-primary font-medium">-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                
                {/* Auto-apply helper text */}
                {discountAmount > 0 && (
                  <div className="flex items-center gap-1.5 text-xs text-primary/80">
                    <Check className="h-3 w-3" />
                    <span>Best discount applied automatically</span>
                  </div>
                )}
                
                {/* Total */}
                <div className="flex justify-between items-center pt-2 border-t border-border/50">
                  <span className="text-lg font-medium">Total</span>
                  <div className="text-right">
                    <span className="text-xl font-display font-semibold">
                      ${totalPrice.toFixed(2)}
                    </span>
                    {discountAmount > 0 && (
                      <p className="text-xs text-primary">You save ${discountAmount.toFixed(2)}</p>
                    )}
                  </div>
                </div>
                
                <Link to="/cart" onClick={closeDrawer} className="block">
                  <Button variant="outline" className="w-full" size="lg">
                    View Full Cart
                  </Button>
                </Link>
                
                <Button 
                  onClick={handleCheckout}
                  className="w-full btn-primary" 
                  size="lg"
                  disabled={items.length === 0 || isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Checkout'
                  )}
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  Secure checkout
                </p>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
