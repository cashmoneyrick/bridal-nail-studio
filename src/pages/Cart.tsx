import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Minus, Plus, Trash2, Tag, X, Check, Package, ChevronDown, ChevronUp } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { useDiscountCodesStore } from "@/stores/discountCodesStore";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
// Discount calculation functions (same as CartDrawer)
const getMemberDiscount = (subtotal: number, isAuthenticated: boolean): number => {
  if (!isAuthenticated) return 0;
  if (subtotal >= 50) return subtotal * 0.10;
  return 0;
};

const getDiscountAmount = (code: string, subtotal: number): number => {
  const upperCode = code.toUpperCase();
  if (upperCode === 'WELCOME15') return subtotal * 0.15;
  if (upperCode === 'NAILCLUB10') return subtotal * 0.10;
  if (upperCode === 'BIRTHDAY20') return subtotal * 0.20;
  if (upperCode === 'FREESHIP') return 0;
  return 0;
};

const getDiscountLabel = (code: string): string => {
  const upperCode = code.toUpperCase();
  if (upperCode === 'WELCOME15') return '15% Welcome Discount';
  if (upperCode === 'NAILCLUB10') return '10% Nail Club Discount';
  if (upperCode === 'BIRTHDAY20') return '20% Birthday Discount';
  if (upperCode === 'FREESHIP') return 'Free Shipping';
  return `Code: ${code}`;
};

const Cart = () => {
  const { items, updateQuantity, removeItem, getTotalPrice } = useCartStore();
  const { appliedCode, clearAppliedCode } = useDiscountCodesStore();
  const { user } = useAuthStore();
  
  const isAuthenticated = !!user;
  const subtotal = getTotalPrice();
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (variantId: string) => {
    setExpandedItems(prev => 
      prev.includes(variantId) 
        ? prev.filter(id => id !== variantId)
        : [...prev, variantId]
    );
  };

  // Calculate best discount
  const discountInfo = useMemo(() => {
    const memberDiscount = getMemberDiscount(subtotal, isAuthenticated);
    const codeDiscount = appliedCode ? getDiscountAmount(appliedCode, subtotal) : 0;
    
    if (memberDiscount >= codeDiscount && memberDiscount > 0) {
      return {
        amount: memberDiscount,
        label: '10% Member Discount',
        source: 'member' as const,
        canRemove: false
      };
    } else if (codeDiscount > 0) {
      return {
        amount: codeDiscount,
        label: getDiscountLabel(appliedCode!),
        source: 'code' as const,
        canRemove: true
      };
    }
    return null;
  }, [subtotal, isAuthenticated, appliedCode]);

  const total = subtotal - (discountInfo?.amount || 0);

  const handleCheckout = () => {
    toast.info("Checkout functionality coming soon!");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      <main className="flex-1 container mx-auto px-4 py-8 pt-24">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            Shopping Bag
          </h1>
          <p className="text-muted-foreground mt-2">
            {totalItems} {totalItems === 1 ? 'item' : 'items'} in your bag
          </p>
        </div>

        {items.length === 0 ? (
          /* Empty Cart State */
          <div className="flex flex-col items-center justify-center py-20">
            <ShoppingBag className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Your bag is empty</h2>
            <p className="text-muted-foreground mb-6">Discover our beautiful press-on nail sets</p>
            <Button asChild>
              <Link to="/shop">Continue Shopping</Link>
            </Button>
          </div>
        ) : (
          /* Cart Content - Two Column Layout */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div 
                  key={item.variantId} 
                  className="bg-muted/30 rounded-xl p-4 flex gap-4"
                >
                  {/* Product Image */}
                  <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                    {item.product.images[0] && (
                      <img 
                        src={item.product.images[0]} 
                        alt={item.product.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <h3 className="font-medium text-foreground truncate">
                          {item.product.title}
                        </h3>
                        {item.selectedOptions.length > 0 && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {item.selectedOptions.map(opt => opt.value).join(' · ')}
                          </p>
                        )}
                        {/* Sizing badges */}
                        {(item.needsSizingKit || item.sizeProfileId) && (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {item.needsSizingKit && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                                <Package className="h-3 w-3" />
                                Includes sizing kit
                              </span>
                            )}
                            {item.sizeProfileId && !item.needsSizingKit && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium">
                                <Check className="h-3 w-3" />
                                Using saved sizes
                              </span>
                            )}
                          </div>
                        )}

                        {/* Expandable details */}
                        <Collapsible
                          open={expandedItems.includes(item.variantId)}
                          onOpenChange={() => toggleExpanded(item.variantId)}
                          className="mt-3"
                        >
                          <CollapsibleTrigger className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                            {expandedItems.includes(item.variantId) ? (
                              <ChevronUp className="h-3 w-3" />
                            ) : (
                              <ChevronDown className="h-3 w-3" />
                            )}
                            View details
                          </CollapsibleTrigger>
                          <CollapsibleContent className="mt-2">
                            <div className="bg-muted/50 rounded-lg p-3 text-xs space-y-2">
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <span className="text-muted-foreground">Shape:</span>{' '}
                                  <span className="font-medium">{item.selectedOptions.find(o => o.name === 'Shape')?.value || 'N/A'}</span>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Length:</span>{' '}
                                  <span className="font-medium">{item.selectedOptions.find(o => o.name === 'Length')?.value || 'N/A'}</span>
                                </div>
                                <div className="col-span-2">
                                  <span className="text-muted-foreground">Sizing:</span>{' '}
                                  <span className="font-medium">
                                    {item.needsSizingKit ? 'Sizing kit included' : item.sizeProfileId ? 'Using saved sizes' : 'Not specified'}
                                  </span>
                                </div>
                              </div>

                              {/* Size profile snapshot - for seller fulfillment */}
                              {item.sizeProfileSnapshot && (
                                <div className="border-t border-border pt-2 mt-2">
                                  <p className="text-muted-foreground mb-2">
                                    Saved sizes ({item.sizeProfileSnapshot.name}):
                                  </p>
                                  <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                                    <div className="font-medium">Left Hand:</div>
                                    <div className="font-medium">Right Hand:</div>
                                    <div>Thumb: {item.sizeProfileSnapshot.sizes.leftThumb}</div>
                                    <div>Thumb: {item.sizeProfileSnapshot.sizes.rightThumb}</div>
                                    <div>Index: {item.sizeProfileSnapshot.sizes.leftIndex}</div>
                                    <div>Index: {item.sizeProfileSnapshot.sizes.rightIndex}</div>
                                    <div>Middle: {item.sizeProfileSnapshot.sizes.leftMiddle}</div>
                                    <div>Middle: {item.sizeProfileSnapshot.sizes.rightMiddle}</div>
                                    <div>Ring: {item.sizeProfileSnapshot.sizes.leftRing}</div>
                                    <div>Ring: {item.sizeProfileSnapshot.sizes.rightRing}</div>
                                    <div>Pinky: {item.sizeProfileSnapshot.sizes.leftPinky}</div>
                                    <div>Pinky: {item.sizeProfileSnapshot.sizes.rightPinky}</div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      </div>
                      <p className="font-medium text-foreground whitespace-nowrap">
                        ${(parseFloat(item.price.amount) * item.quantity).toFixed(2)}
                      </p>
                    </div>

                    {/* Quantity Controls & Remove */}
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => removeItem(item.variantId)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-muted/30 rounded-xl p-6 sticky top-24">
                <h2 className="font-semibold text-lg text-foreground mb-4">Order Summary</h2>
                
                {/* Subtotal */}
                <div className="flex justify-between text-sm mb-3">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">${subtotal.toFixed(2)}</span>
                </div>

                {/* Discount */}
                {discountInfo && (
                  <div className="flex justify-between items-center text-sm mb-3">
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-primary" />
                      <span className="text-primary">{discountInfo.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-primary">-${discountInfo.amount.toFixed(2)}</span>
                      {discountInfo.canRemove && (
                        <button 
                          onClick={clearAppliedCode}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {discountInfo && (
                  <p className="text-xs text-muted-foreground mb-4 flex items-center gap-1">
                    <Check className="h-3 w-3 text-primary" />
                    Best discount applied automatically
                  </p>
                )}

                {/* Divider */}
                <div className="border-t border-border my-4" />

                {/* Total */}
                <div className="flex justify-between items-baseline mb-2">
                  <span className="font-semibold text-foreground">Total</span>
                  <span className="text-xl font-bold text-foreground">${total.toFixed(2)}</span>
                </div>

                {discountInfo && discountInfo.amount > 0 && (
                  <p className="text-sm text-primary mb-4">
                    You save ${discountInfo.amount.toFixed(2)}
                  </p>
                )}

                {/* Checkout Button */}
                <Button 
                  className="w-full mt-4" 
                  size="lg"
                  onClick={handleCheckout}
                >
                  Checkout
                </Button>

                {/* Continue Shopping Link */}
                <Link 
                  to="/shop" 
                  className="block text-center text-sm text-muted-foreground hover:text-foreground mt-4 transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Cart;
