import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ShoppingBag, Minus, Plus, Trash2, Tag, X, Check, Package, ChevronDown, ChevronUp, Truck, ShieldCheck, RefreshCcw, Sparkles, ArrowRight } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { useDiscountCodesStore } from "@/stores/discountCodesStore";
import { useAuthStore } from "@/stores/authStore";
import { sampleProducts } from "@/lib/products";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const FREE_SHIPPING_THRESHOLD = 50;

// Discount calculation functions
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

  // Free shipping progress
  const shippingProgress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const amountToFreeShipping = Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0);
  const hasFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;

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

  // "Complete Your Look" — products not already in the cart
  const recommendations = useMemo(() => {
    const cartProductIds = new Set(items.map(item => item.product.id));
    return sampleProducts.filter(p => !cartProductIds.has(p.id)).slice(0, 4);
  }, [items]);

  const handleCheckout = () => {
    toast.info("Checkout functionality coming soon!");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />

      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24 sm:pt-28">
        {/* Page Header */}
        <div className="mb-6 sm:mb-10">
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground tracking-tight">
            Shopping Bag
          </h1>
          {totalItems > 0 && (
            <p className="text-muted-foreground mt-1.5 text-sm sm:text-base">
              {totalItems} {totalItems === 1 ? 'item' : 'items'}
            </p>
          )}
        </div>

        {/* Free Shipping Progress Bar */}
        {items.length > 0 && (
          <div className="mb-8 sm:mb-10">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2 text-sm">
                <Truck className={`h-4 w-4 ${hasFreeShipping ? 'text-primary' : 'text-muted-foreground'}`} />
                {hasFreeShipping ? (
                  <span className="text-primary font-medium">You've unlocked free shipping!</span>
                ) : (
                  <span className="text-muted-foreground">
                    <span className="font-medium text-foreground">${amountToFreeShipping.toFixed(2)}</span> away from free shipping
                  </span>
                )}
              </div>
            </div>
            <Progress
              value={shippingProgress}
              className="h-1.5 bg-muted/50"
            />
          </div>
        )}

        {items.length === 0 ? (
          /* Empty Cart State */
          <div className="flex flex-col items-center justify-center py-24 sm:py-32">
            <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mb-6">
              <ShoppingBag className="h-9 w-9 text-muted-foreground/60" />
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-foreground mb-2 tracking-tight">
              Your collection awaits
            </h2>
            <p className="text-muted-foreground mb-8 text-center max-w-sm">
              Discover handcrafted press-on nail sets made just for you
            </p>
            <Button asChild size="lg" className="rounded-full px-8">
              <Link to="/shop">
                Shop Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        ) : (
          /* Cart Content */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
            {/* Left Column - Cart Items */}
            <div className="lg:col-span-2 space-y-3">
              {items.map((item) => (
                <div
                  key={item.variantId}
                  className="bg-muted/30 rounded-xl p-4 sm:p-5 flex gap-4"
                >
                  {/* Product Image */}
                  <Link
                    to={`/product/${item.product.handle}`}
                    className="w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 rounded-lg overflow-hidden bg-muted hover:opacity-90 transition-opacity"
                  >
                    {item.product.images[0] && (
                      <img
                        src={item.product.images[0]}
                        alt={item.product.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </Link>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <Link
                          to={`/product/${item.product.handle}`}
                          className="font-medium text-foreground hover:text-primary transition-colors truncate block"
                        >
                          {item.product.title}
                        </Link>
                        {item.selectedOptions.length > 0 && (
                          <p className="text-sm text-muted-foreground mt-0.5">
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
                                    {item.needsSizingKit
                                      ? 'Sizing kit included with this set'
                                      : item.sizingOption === 'kit'
                                        ? 'Sizing kit included in order'
                                        : item.sizeProfileId
                                          ? 'Using saved sizes'
                                          : 'Not specified'}
                                  </span>
                                </div>
                              </div>

                              {/* Size profile snapshot */}
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
                          className="h-8 w-8 rounded-full"
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
                          className="h-8 w-8 rounded-full"
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
                <h2 className="font-display text-lg font-semibold text-foreground mb-1">
                  Order Summary
                </h2>
                <p className="text-xs text-muted-foreground mb-5">
                  {totalItems} {totalItems === 1 ? 'item' : 'items'}
                </p>

                {/* Subtotal */}
                <div className="flex justify-between text-sm mb-3">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">${subtotal.toFixed(2)}</span>
                </div>

                {/* Shipping */}
                <div className="flex justify-between text-sm mb-3">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className={hasFreeShipping ? "text-primary font-medium" : "text-muted-foreground"}>
                    {hasFreeShipping ? 'Free' : 'Calculated at checkout'}
                  </span>
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
                <div className="border-t border-border/50 my-4" />

                {/* Total */}
                <div className="flex justify-between items-baseline mb-1">
                  <span className="font-display text-base font-semibold text-foreground">Estimated Total</span>
                  <span className="font-display text-xl font-bold text-foreground">${total.toFixed(2)}</span>
                </div>

                {discountInfo && discountInfo.amount > 0 && (
                  <p className="text-sm text-primary mb-4 text-right">
                    You save ${discountInfo.amount.toFixed(2)}
                  </p>
                )}

                {/* Checkout Button */}
                <Button
                  className="w-full mt-4 rounded-full h-12 text-base font-medium"
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

                {/* Trust Signals */}
                <div className="border-t border-border/50 mt-6 pt-5">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
                      <RefreshCcw className="h-3.5 w-3.5 flex-shrink-0" />
                      <span>Free returns within 14 days</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
                      <Sparkles className="h-3.5 w-3.5 flex-shrink-0" />
                      <span>Handcrafted with care</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
                      <ShieldCheck className="h-3.5 w-3.5 flex-shrink-0" />
                      <span>Secure checkout</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Complete Your Look — Recommendations */}
        {items.length > 0 && recommendations.length > 0 && (
          <section className="mt-14 sm:mt-20 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl sm:text-2xl font-semibold text-foreground tracking-tight">
                Complete Your Look
              </h2>
              <Link
                to="/shop"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
              >
                View all
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {recommendations.map((product) => (
                <Link
                  key={product.id}
                  to={`/product/${product.handle}`}
                  className="group"
                >
                  <div className="aspect-square rounded-xl overflow-hidden bg-muted mb-3">
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <h3 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">
                    {product.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    ${product.price.toFixed(2)}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default Cart;
