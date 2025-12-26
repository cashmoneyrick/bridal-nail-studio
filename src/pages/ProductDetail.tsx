import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Product, getProductByHandle, getProducts } from "@/lib/products";
import { useCartStore, CartItem } from "@/stores/cartStore";
import { useFavoritesStore } from "@/stores/favoritesStore";
import { useNailProfilesStore } from "@/stores/nailProfilesStore";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, Minus, Plus, Heart, Sparkles, Tag, User, ChevronRight, Package, PlayCircle, ShieldCheck, Truck, ShoppingBag, Droplets, FileText, Clock, Hand, Gift, RotateCcw, Check } from "lucide-react";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { ProductReviews } from "@/components/ProductReviews";

// Shape icons as simple SVG components
const ShapeIcon = ({ shape, selected }: { shape: string; selected: boolean }) => {
  const baseClass = `w-full h-12 transition-colors ${selected ? 'text-primary' : 'text-muted-foreground'}`;
  
  switch (shape.toLowerCase()) {
    case 'almond':
      return (
        <svg viewBox="0 0 24 40" className={baseClass}>
          <path d="M12 2C8 2 4 8 4 20C4 32 8 38 12 38C16 38 20 32 20 20C20 8 16 2 12 2Z" 
            fill={selected ? 'hsl(var(--primary))' : 'hsl(var(--muted))'} 
            stroke={selected ? 'hsl(var(--primary))' : 'hsl(var(--border))'} 
            strokeWidth="1.5"/>
        </svg>
      );
    case 'coffin':
      return (
        <svg viewBox="0 0 24 40" className={baseClass}>
          <path d="M6 38L4 8C4 4 8 2 12 2C16 2 20 4 20 8L18 38H6Z" 
            fill={selected ? 'hsl(var(--primary))' : 'hsl(var(--muted))'} 
            stroke={selected ? 'hsl(var(--primary))' : 'hsl(var(--border))'} 
            strokeWidth="1.5"/>
        </svg>
      );
    case 'stiletto':
      return (
        <svg viewBox="0 0 24 40" className={baseClass}>
          <path d="M12 2L4 38H20L12 2Z" 
            fill={selected ? 'hsl(var(--primary))' : 'hsl(var(--muted))'} 
            stroke={selected ? 'hsl(var(--primary))' : 'hsl(var(--border))'} 
            strokeWidth="1.5"/>
        </svg>
      );
    case 'square':
      return (
        <svg viewBox="0 0 24 40" className={baseClass}>
          <path d="M4 8C4 4 8 2 12 2C16 2 20 4 20 8V38H4V8Z" 
            fill={selected ? 'hsl(var(--primary))' : 'hsl(var(--muted))'} 
            stroke={selected ? 'hsl(var(--primary))' : 'hsl(var(--border))'} 
            strokeWidth="1.5"/>
        </svg>
      );
    case 'oval':
      return (
        <svg viewBox="0 0 24 40" className={baseClass}>
          <ellipse cx="12" cy="20" rx="8" ry="18" 
            fill={selected ? 'hsl(var(--primary))' : 'hsl(var(--muted))'} 
            stroke={selected ? 'hsl(var(--primary))' : 'hsl(var(--border))'} 
            strokeWidth="1.5"/>
        </svg>
      );
    default:
      return null;
  }
};

const NAIL_SHAPES = ['Almond', 'Coffin', 'Stiletto', 'Square', 'Oval'];
const NAIL_LENGTHS = ['Short', 'Medium', 'Long', 'Extra Long'];

const ProductDetail = () => {
  const { handle } = useParams<{ handle: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedShape, setSelectedShape] = useState('Almond');
  const [selectedLength, setSelectedLength] = useState('Medium');
  const [sizingOption, setSizingOption] = useState<'kit' | 'known'>('kit');
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  
  const addItem = useCartStore(state => state.addItem);
  const { profiles, selectedProfileId, selectProfile, getSelectedProfile } = useNailProfilesStore();
  const { toggleFavorite, isFavorite } = useFavoritesStore();
  const navigate = useNavigate();

  const handleToggleFavorite = () => {
    if (!product) return;
    
    const wasInFavorites = isFavorite(product.id);
    toggleFavorite(product);
    
    toast.success(wasInFavorites ? 'Removed from favorites' : 'Added to favorites', {
      position: "top-center",
    });
  };

  useEffect(() => {
    if (!handle) return;
    
    setLoading(true);
    // Simulate loading for smooth UX
    const timer = setTimeout(() => {
      const foundProduct = getProductByHandle(handle);
      setProduct(foundProduct || null);
      
      if (foundProduct?.variants.length > 0) {
        setSelectedVariant(foundProduct.variants[0].id);
      }
      setLoading(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [handle]);

  // Fetch related products
  useEffect(() => {
    const allProducts = getProducts();
    const filtered = allProducts.filter(p => p.handle !== handle);
    setRelatedProducts(filtered.slice(0, 4));
  }, [handle]);

  const handleAddToCart = () => {
    if (!product || !selectedVariant) return;
    
    const variant = product.variants.find(v => v.id === selectedVariant);
    if (!variant) return;

    const cartItem: CartItem = {
      product: product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: {
        amount: variant.price.toString(),
        currencyCode: variant.currencyCode,
      },
      quantity,
      selectedOptions: variant.selectedOptions,
    };

    addItem(cartItem);
    toast.success(`${product.title} added to bag`, {
      position: "top-center",
    });
  };

  const currentVariant = product?.variants.find(v => v.id === selectedVariant);
  const price = currentVariant?.price || product?.price || 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex justify-center items-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-32 text-center">
          <h1 className="font-display text-2xl mb-4">Product not found</h1>
          <Link to="/" className="text-primary hover:underline">
            Return to homepage
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const images = product.images;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <span>/</span>
            <Link to="/#shop" className="hover:text-foreground transition-colors">Shop</Link>
            <span>/</span>
            <span className="text-foreground">{product.title}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
            {/* Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50 relative shadow-sm border border-border/30">
                {images[selectedImageIndex] ? (
                  <img
                    src={images[selectedImageIndex]}
                    alt={product.title}
                    className="w-full h-full object-cover animate-fade-in"
                    key={selectedImageIndex}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-muted-foreground">No image</span>
                  </div>
                )}
                
                {/* Image pagination dots */}
                {images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {images.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImageIndex(idx)}
                        className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                          selectedImageIndex === idx 
                            ? 'bg-primary scale-110' 
                            : 'bg-background/70 hover:bg-background'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
              
              {/* Thumbnail Gallery */}
              {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden transition-all duration-200 ${
                        selectedImageIndex === idx 
                          ? 'border-2 border-primary shadow-md ring-2 ring-primary/20' 
                          : 'border border-border/40 hover:border-primary/60 hover:shadow-sm'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product.title} ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-8">
              {/* Title & Wishlist */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="font-display text-3xl sm:text-4xl font-medium mb-2 tracking-tight">
                    {product.title}
                  </h1>
                  <p className="text-2xl font-display text-primary mb-3">
                    ${price.toFixed(2)}
                  </p>
                  {/* Star Rating - clicks to scroll to reviews */}
                  <button 
                    onClick={() => document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                    className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors group"
                  >
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className="w-4 h-4 text-amber-400 fill-amber-400"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="group-hover:underline">47 reviews</span>
                  </button>
                </div>
                <button 
                  onClick={handleToggleFavorite}
                  className="p-2.5 rounded-full hover:bg-muted transition-colors"
                >
                  <Heart 
                    className={`h-6 w-6 transition-colors ${product && isFavorite(product.id) ? 'fill-primary text-primary' : 'text-muted-foreground'}`} 
                  />
                </button>
              </div>

              {/* Key Features */}
              <div className="grid grid-cols-3 md:grid-cols-6 gap-4 py-6 border-y border-border/50">
                {[
                  { icon: (
                    <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 19l7-7 3 3-7 7-3-3z" />
                      <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
                      <path d="M2 2l7.586 7.586" />
                      <circle cx="11" cy="11" r="2" />
                    </svg>
                  ), label: "Hand-painted" },
                  { icon: (
                    <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 12a9 9 0 0 1-9 9m9-9a9 9 0 0 0-9-9m9 9H3m9 9a9 9 0 0 1-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 0 1 9-9" />
                    </svg>
                  ), label: "Reusable" },
                  { icon: (
                    <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ), label: "Salon-quality" },
                  { icon: (
                    <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                      <line x1="12" y1="22.08" x2="12" y2="12" />
                    </svg>
                  ), label: "Full kit" },
                  { icon: (
                    <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                      <path d="M8 14h.01" />
                      <path d="M12 14h.01" />
                      <path d="M16 14h.01" />
                      <path d="M8 18h.01" />
                      <path d="M12 18h.01" />
                    </svg>
                  ), label: "2 weeks wear" },
                  { icon: (
                    <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  ), label: "10-min apply" },
                ].map((feature, idx) => (
                  <div key={idx} className="flex flex-col items-center text-center group cursor-default">
                    <div className="text-primary mb-2 group-hover:scale-110 transition-transform duration-200">
                      {feature.icon}
                    </div>
                    <span className="text-xs text-muted-foreground leading-tight">{feature.label}</span>
                  </div>
                ))}
              </div>

              {/* Shape Selector */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Shape</label>
                  <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
                    {selectedShape}
                  </span>
                </div>
                <div className="flex gap-2">
                  {NAIL_SHAPES.map(shape => (
                    <button
                      key={shape}
                      onClick={() => setSelectedShape(shape)}
                      className={`flex-1 flex flex-col items-center gap-1 p-3 rounded-xl border transition-all ${
                        selectedShape === shape 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <ShapeIcon shape={shape} selected={selectedShape === shape} />
                      <span className={`text-xs ${selectedShape === shape ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                        {shape}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Length Selector */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Length</label>
                  <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
                    {selectedLength}
                  </span>
                </div>
                <div className="flex gap-2">
                  {NAIL_LENGTHS.map(length => (
                    <button
                      key={length}
                      onClick={() => setSelectedLength(length)}
                      className={`flex-1 px-4 py-3 rounded-full text-sm font-medium transition-all ${
                        selectedLength === length
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }`}
                    >
                      {length}
                    </button>
                  ))}
                </div>
              </div>

              {/* Nail Sizes */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Nail Sizes</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSizingOption('kit')}
                    className={`px-4 py-3 rounded-full text-sm font-medium transition-all ${
                      sizingOption === 'kit'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    I need a sizing kit
                  </button>
                  <button
                    onClick={() => setSizingOption('known')}
                    className={`px-4 py-3 rounded-full text-sm font-medium transition-all ${
                      sizingOption === 'known'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    I know my sizes
                  </button>
                </div>
              </div>

              {/* Sizing Kit Info Card */}
              {sizingOption === 'kit' && (
                <div className="bg-card border border-border rounded-2xl p-6 text-center space-y-3">
                  <div className="w-12 h-12 mx-auto rounded-full bg-muted flex items-center justify-center">
                    <Tag className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <h3 className="font-display text-lg font-medium">Get the Perfect Fit</h3>
                  <p className="text-sm text-muted-foreground">
                    We'll send you a sizing kit first to ensure your nails fit perfectly. 
                    Once you know your sizes, you can email us or update your order.
                  </p>
                  <span className="inline-block text-xs text-muted-foreground border border-border rounded-full px-3 py-1">
                    Sizing Kit will be added to order
                  </span>
                </div>
              )}

              {/* Profile Selector - when "I know my sizes" is selected */}
              {sizingOption === 'known' && (
                <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-display text-lg font-medium">Select Size Profile</h3>
                      <p className="text-sm text-muted-foreground">
                        Choose whose sizes to use for this order
                      </p>
                    </div>
                  </div>

                  {profiles.length > 0 ? (
                    <>
                      <Select 
                        value={selectedProfileId || undefined} 
                        onValueChange={selectProfile}
                      >
                        <SelectTrigger className="rounded-xl">
                          <SelectValue placeholder="Select a profile" />
                        </SelectTrigger>
                        <SelectContent>
                          {profiles.map(profile => (
                            <SelectItem key={profile.id} value={profile.id}>
                              <span>{profile.name}</span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {getSelectedProfile() && (
                        <div className="bg-muted/50 rounded-xl p-3">
                          <p className="text-xs text-muted-foreground mb-2">Selected sizes:</p>
                          <div className="flex flex-wrap gap-1">
                            {Object.entries(getSelectedProfile()?.sizes || {}).map(([key, size], idx) => (
                              <span 
                                key={key}
                                className="px-2 py-1 bg-background rounded text-xs font-medium"
                              >
                                {idx + 1}: {size}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-2">
                      <p className="text-sm text-muted-foreground mb-3">
                        No size profiles saved yet
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="rounded-full"
                        onClick={() => navigate('/account/perfect-fit')}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Create Profile
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* Quantity & Add to Cart */}
              <div className="space-y-4 pt-4 border-t border-border">
                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium">Quantity</label>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center font-medium">{quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <Button 
                  className="w-full btn-primary text-base py-6"
                  onClick={handleAddToCart}
                  disabled={!currentVariant?.availableForSale}
                >
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  {currentVariant?.availableForSale ? 'Add to Bag' : 'Sold Out'} — ${(price * quantity).toFixed(2)}
                </Button>

                <Button 
                  variant="outline" 
                  className="w-full rounded-full"
                  onClick={() => navigate(`/custom-studio?base=${product.handle}`)}
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Customize This Design
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 py-4">
                <div className="text-center">
                  <Truck className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">Free Shipping $50+</p>
                </div>
                <div className="text-center">
                  <Gift className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">Gift Wrapping</p>
                </div>
                <div className="text-center">
                  <RotateCcw className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">Easy Returns</p>
                </div>
              </div>

              {/* Accordion Info */}
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="whats-included">
                  <AccordionTrigger className="text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      What's Included
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        10 press-on nails (full set)
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        Nail prep kit & application tools
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        Nail glue & adhesive tabs
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        Mini nail file & buffer
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        Cuticle pusher
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="how-to-apply">
                  <AccordionTrigger className="text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <Hand className="h-4 w-4" />
                      How to Apply
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                      <li>Clean and prep your natural nails</li>
                      <li>Push back cuticles gently</li>
                      <li>Buff the surface of your nails</li>
                      <li>Apply glue or adhesive tab</li>
                      <li>Press and hold for 30 seconds</li>
                    </ol>
                    <Button 
                      variant="link" 
                      className="p-0 h-auto mt-2 text-primary"
                      onClick={() => setIsTutorialOpen(true)}
                    >
                      <PlayCircle className="h-4 w-4 mr-1" />
                      Watch Tutorial
                    </Button>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="care">
                  <AccordionTrigger className="text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <Droplets className="h-4 w-4" />
                      Care & Maintenance
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Avoid prolonged water exposure</li>
                      <li>• Wear gloves when cleaning</li>
                      <li>• Apply cuticle oil daily for longer wear</li>
                      <li>• Gently file any rough edges</li>
                      <li>• Store unused nails in a cool, dry place</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="shipping">
                  <AccordionTrigger className="text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4" />
                      Shipping & Returns
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3 text-sm text-muted-foreground">
                      <p><strong className="text-foreground">Shipping:</strong> Free standard shipping on orders over $50. Orders ship within 1-3 business days.</p>
                      <p><strong className="text-foreground">Returns:</strong> We accept returns within 14 days of delivery for unused items in original packaging.</p>
                      <p><strong className="text-foreground">Custom Orders:</strong> Custom nail sets are final sale and cannot be returned.</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section className="mt-24">
              <h2 className="font-display text-2xl font-medium mb-8">You May Also Like</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <Link
                    key={relatedProduct.id}
                    to={`/product/${relatedProduct.handle}`}
                    className="group"
                  >
                    <div className="aspect-square rounded-2xl overflow-hidden bg-muted/30 mb-3">
                      {relatedProduct.images[0] ? (
                        <img
                          src={relatedProduct.images[0]}
                          alt={relatedProduct.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <h3 className="font-display font-medium group-hover:text-primary transition-colors">
                      {relatedProduct.title}
                    </h3>
                    <p className="text-primary">${relatedProduct.price.toFixed(2)}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Reviews */}
          <section id="reviews">
            <ProductReviews productTitle={product.title} />
          </section>
        </div>
      </main>

      {/* Tutorial Dialog */}
      <Dialog open={isTutorialOpen} onOpenChange={setIsTutorialOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>How to Apply Your Nails</DialogTitle>
          </DialogHeader>
          <div className="aspect-video bg-muted rounded-xl flex items-center justify-center">
            <div className="text-center">
              <PlayCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Tutorial video coming soon!</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default ProductDetail;
