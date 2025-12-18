import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { fetchProductByHandle, fetchProducts, ShopifyProduct } from "@/lib/shopify";
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
  const [product, setProduct] = useState<ShopifyProduct['node'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedShape, setSelectedShape] = useState('Almond');
  const [selectedLength, setSelectedLength] = useState('Medium');
  const [sizingOption, setSizingOption] = useState<'kit' | 'known'>('kit');
  const [relatedProducts, setRelatedProducts] = useState<ShopifyProduct[]>([]);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  
  const addItem = useCartStore(state => state.addItem);
  const { profiles, selectedProfileId, selectProfile, getSelectedProfile } = useNailProfilesStore();
  const { toggleFavorite, isFavorite } = useFavoritesStore();
  const navigate = useNavigate();

  const handleToggleFavorite = () => {
    if (!product) return;
    
    const shopifyProduct: ShopifyProduct = { node: product };
    const wasInFavorites = isFavorite(product.id);
    toggleFavorite(shopifyProduct);
    
    toast.success(wasInFavorites ? 'Removed from favorites' : 'Added to favorites', {
      position: "top-center",
    });
  };

  useEffect(() => {
    const loadProduct = async () => {
      if (!handle) return;
      
      try {
        setLoading(true);
        const data = await fetchProductByHandle(handle);
        setProduct(data);
        
        if (data?.variants.edges.length > 0) {
          const firstVariant = data.variants.edges[0].node;
          setSelectedVariant(firstVariant.id);
          
          const defaultOptions: Record<string, string> = {};
          firstVariant.selectedOptions.forEach(opt => {
            defaultOptions[opt.name] = opt.value;
          });
          setSelectedOptions(defaultOptions);
        }
      } catch (err) {
        console.error('Failed to fetch product:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [handle]);

  useEffect(() => {
    if (!product) return;
    
    const matchingVariant = product.variants.edges.find(v => {
      return v.node.selectedOptions.every(
        opt => selectedOptions[opt.name] === opt.value
      );
    });
    
    if (matchingVariant) {
      setSelectedVariant(matchingVariant.node.id);
    }
  }, [selectedOptions, product]);

  // Fetch related products
  useEffect(() => {
    const loadRelatedProducts = async () => {
      try {
        const products = await fetchProducts(12);
        const filtered = products.filter(p => p.node.handle !== handle);
        setRelatedProducts(filtered.slice(0, 8));
      } catch (err) {
        console.error('Failed to fetch related products:', err);
      }
    };
    loadRelatedProducts();
  }, [handle]);

  const handleAddToCart = () => {
    if (!product || !selectedVariant) return;
    
    const variant = product.variants.edges.find(v => v.node.id === selectedVariant)?.node;
    if (!variant) return;

    const cartItem: CartItem = {
      product: { node: product },
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity,
      selectedOptions: variant.selectedOptions,
    };

    addItem(cartItem);
    toast.success(`${product.title} added to bag`, {
      position: "top-center",
    });
  };

  const currentVariant = product?.variants.edges.find(v => v.node.id === selectedVariant)?.node;
  const price = parseFloat(currentVariant?.price.amount || product?.priceRange.minVariantPrice.amount || '0');

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

  const images = product.images.edges;

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
              <div className="aspect-square rounded-2xl overflow-hidden bg-muted/30 relative">
                {images[selectedImageIndex] ? (
                  <img
                    src={images[selectedImageIndex].node.url}
                    alt={images[selectedImageIndex].node.altText || product.title}
                    className="w-full h-full object-cover"
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
                        className={`w-2 h-2 rounded-full transition-colors ${
                          selectedImageIndex === idx ? 'bg-primary' : 'bg-background/60'
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
                      className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors ${
                        selectedImageIndex === idx ? 'border-primary' : 'border-transparent'
                      }`}
                    >
                      <img
                        src={img.node.url}
                        alt={img.node.altText || `${product.title} ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Title & Wishlist */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="font-display text-3xl sm:text-4xl font-medium mb-2">
                    {product.title}
                  </h1>
                  <p className="text-2xl font-display text-primary">
                    ${price.toFixed(2)}
                  </p>
                </div>
                <button 
                  onClick={handleToggleFavorite}
                  className="p-2 rounded-full hover:bg-muted transition-colors"
                >
                  <Heart 
                    className={`h-6 w-6 transition-colors ${product && isFavorite(product.id) ? 'fill-primary text-primary' : 'text-muted-foreground'}`} 
                  />
                </button>
              </div>

              {/* Description */}
              {product.description && (
                <p className="text-muted-foreground leading-relaxed border-b border-border pb-6">
                  {product.description}
                </p>
              )}

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
                        onValueChange={(value) => selectProfile(value)}
                      >
                        <SelectTrigger className="w-full rounded-xl">
                          <SelectValue placeholder="Select a profile" />
                        </SelectTrigger>
                        <SelectContent>
                          {profiles.map(profile => (
                            <SelectItem key={profile.id} value={profile.id}>
                              <span className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                {profile.name}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {/* Show selected profile sizes */}
                      {getSelectedProfile() && (
                        <div className="bg-muted/50 rounded-xl p-4 space-y-2">
                          <p className="text-sm font-medium text-foreground">
                            {getSelectedProfile()?.name}'s Sizes
                          </p>
                          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-muted-foreground">
                            <div className="space-y-1">
                              <p className="font-medium text-foreground/70">Left Hand</p>
                              <p>Thumb: {getSelectedProfile()?.sizes.leftThumb || '—'}</p>
                              <p>Index: {getSelectedProfile()?.sizes.leftIndex || '—'}</p>
                              <p>Middle: {getSelectedProfile()?.sizes.leftMiddle || '—'}</p>
                              <p>Ring: {getSelectedProfile()?.sizes.leftRing || '—'}</p>
                              <p>Pinky: {getSelectedProfile()?.sizes.leftPinky || '—'}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="font-medium text-foreground/70">Right Hand</p>
                              <p>Thumb: {getSelectedProfile()?.sizes.rightThumb || '—'}</p>
                              <p>Index: {getSelectedProfile()?.sizes.rightIndex || '—'}</p>
                              <p>Middle: {getSelectedProfile()?.sizes.rightMiddle || '—'}</p>
                              <p>Ring: {getSelectedProfile()?.sizes.rightRing || '—'}</p>
                              <p>Pinky: {getSelectedProfile()?.sizes.rightPinky || '—'}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      <Link 
                        to="/account/perfect-fit" 
                        className="inline-flex items-center text-sm text-primary hover:underline"
                      >
                        Manage profiles
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </>
                  ) : (
                    <div className="text-center py-4 space-y-3">
                      <p className="text-sm text-muted-foreground">
                        You haven't saved any size profiles yet.
                      </p>
                      <Link to="/account/perfect-fit">
                        <Button variant="outline" className="rounded-full">
                          Create Your First Profile
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/* Create Custom Version Button */}
              <Button 
                variant="secondary"
                className="w-full py-6 text-base rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80"
                onClick={() => navigate(`/custom-studio?base=${handle}`)}
              >
                <Sparkles className="h-5 w-5 mr-2" />
                Create Custom Version
              </Button>

              {/* Quantity & Add to Cart */}
              <div className="flex items-center gap-4 pt-2">
                <div className="flex items-center gap-3 border border-border rounded-full px-4 py-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-8 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                
                <Button 
                  className="flex-1 btn-primary text-base py-6"
                  onClick={handleAddToCart}
                  disabled={!currentVariant?.availableForSale}
                >
                  {currentVariant?.availableForSale ? (
                    `Add to Cart - $${(price * quantity).toFixed(2)}`
                  ) : (
                    'Sold Out'
                  )}
                </Button>
              </div>

              {/* Product Info Accordion */}
              <div className="border-t border-border pt-6 mt-2">
                <Accordion type="single" collapsible defaultValue="whats-included" className="space-y-3">
                  <AccordionItem value="whats-included" className="border border-border rounded-2xl px-4 overflow-hidden data-[state=open]:bg-muted/30">
                    <AccordionTrigger className="hover:no-underline py-4">
                      <span className="flex items-center gap-3 text-base font-medium">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Package className="h-5 w-5 text-primary" />
                        </div>
                        What's Included
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4">
                      <div className="grid grid-cols-2 gap-3 pt-2">
                        {[
                          { icon: Sparkles, label: "24 Press-on Nails", sub: "Full set" },
                          { icon: Droplets, label: "Nail Glue", sub: "Salon strength" },
                          { icon: FileText, label: "Mini Nail File", sub: "For custom fit" },
                          { icon: Hand, label: "Prep Pad", sub: "Alcohol wipe" },
                          { icon: FileText, label: "Instructions", sub: "Easy to follow" },
                          { icon: Gift, label: "Storage Case", sub: "Reusable" },
                        ].map((item, idx) => (
                          <div key={idx} className="flex items-center gap-3 bg-background rounded-xl p-3 border border-border/50">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <item.icon className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-foreground">{item.label}</p>
                              <p className="text-xs text-muted-foreground">{item.sub}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="how-to-apply" className="border border-border rounded-2xl px-4 overflow-hidden data-[state=open]:bg-muted/30">
                    <AccordionTrigger className="hover:no-underline py-4">
                      <span className="flex items-center gap-3 text-base font-medium">
                        <div className="w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center">
                          <PlayCircle className="h-5 w-5 text-secondary-foreground" />
                        </div>
                        How to Apply
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4">
                      <div className="space-y-3 pt-2">
                        {[
                          { step: "1", title: "Prep", desc: "Clean & buff nails, push back cuticles" },
                          { step: "2", title: "Size", desc: "Match each nail to your nail bed width" },
                          { step: "3", title: "Apply", desc: "Press firmly for 30 seconds each" },
                        ].map((item) => (
                          <div key={item.step} className="flex items-center gap-4 bg-background rounded-xl p-3 border border-border/50">
                            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                              <span className="text-sm font-bold text-primary-foreground">{item.step}</span>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-foreground">{item.title}</p>
                              <p className="text-xs text-muted-foreground">{item.desc}</p>
                            </div>
                          </div>
                        ))}
                        <button 
                          onClick={() => setIsTutorialOpen(true)}
                          className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline mt-2 bg-primary/10 px-4 py-2 rounded-full transition-colors hover:bg-primary/20"
                        >
                          <PlayCircle className="h-4 w-4" />
                          Watch Full Tutorial
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="care" className="border border-border rounded-2xl px-4 overflow-hidden data-[state=open]:bg-muted/30">
                    <AccordionTrigger className="hover:no-underline py-4">
                      <span className="flex items-center gap-3 text-base font-medium">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <ShieldCheck className="h-5 w-5 text-primary" />
                        </div>
                        Care & Maintenance
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4">
                      <div className="grid grid-cols-2 gap-3 pt-2">
                        {[
                          { icon: Droplets, tip: "Limit water", time: "Use gloves" },
                          { icon: Hand, tip: "Be gentle", time: "No prying" },
                          { icon: Heart, tip: "Cuticle oil", time: "Daily" },
                          { icon: Clock, tip: "Lasts", time: "1-2 weeks" },
                        ].map((item, idx) => (
                          <div key={idx} className="bg-background rounded-xl p-3 border border-border/50 text-center">
                            <div className="w-10 h-10 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-2">
                              <item.icon className="h-5 w-5 text-primary" />
                            </div>
                            <p className="text-sm font-medium text-foreground">{item.tip}</p>
                            <p className="text-xs text-muted-foreground">{item.time}</p>
                          </div>
                        ))}
                      </div>
                      <Link 
                        to="/how-to#care" 
                        className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline mt-4"
                      >
                        View Full Care Guide
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="shipping" className="border border-border rounded-2xl px-4 overflow-hidden data-[state=open]:bg-muted/30">
                    <AccordionTrigger className="hover:no-underline py-4">
                      <span className="flex items-center gap-3 text-base font-medium">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Truck className="h-5 w-5 text-primary" />
                        </div>
                        Shipping & Returns
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4">
                      <div className="space-y-4 pt-2">
                        <div className="flex items-center gap-3 bg-primary/10 rounded-xl p-3">
                          <Check className="h-5 w-5 text-primary" />
                          <span className="text-sm font-medium">Free shipping on orders $50+</span>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-background rounded-xl p-4 border border-border/50 text-center">
                            <Truck className="h-6 w-6 mx-auto text-muted-foreground mb-2" />
                            <p className="text-sm font-medium">Standard</p>
                            <p className="text-xs text-muted-foreground">5-7 business days</p>
                          </div>
                          <div className="bg-background rounded-xl p-4 border border-border/50 text-center">
                            <Sparkles className="h-6 w-6 mx-auto text-primary mb-2" />
                            <p className="text-sm font-medium">Express</p>
                            <p className="text-xs text-muted-foreground">2-3 business days</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 bg-background rounded-xl p-3 border border-border/50">
                          <RotateCcw className="h-5 w-5 text-primary mt-0.5" />
                          <div>
                            <p className="text-sm font-medium">30-Day Returns</p>
                            <p className="text-xs text-muted-foreground">Unused items in original packaging</p>
                          </div>
                        </div>
                        <Link 
                          to="/contact" 
                          className="inline-flex items-center text-sm text-primary hover:underline"
                        >
                          Questions? Contact us
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </div>

          {/* Product Recommendations */}
          {relatedProducts.length > 0 && (
            <section className="mt-16 lg:mt-24">
              <h2 className="font-display text-2xl sm:text-3xl font-medium mb-8 text-center">
                You May Also Like
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {relatedProducts.slice(0, 4).map((product) => {
                  const productImage = product.node.images?.edges?.[0]?.node;
                  const productPrice = parseFloat(product.node.priceRange.minVariantPrice.amount);
                  const isProductFavorite = isFavorite(product.node.id);
                  
                  return (
                    <Link 
                      key={product.node.id} 
                      to={`/product/${product.node.handle}`}
                      className="group"
                    >
                      <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted/30 mb-3">
                        {productImage ? (
                          <img
                            src={productImage.url}
                            alt={productImage.altText || product.node.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-muted-foreground text-sm">No image</span>
                          </div>
                        )}
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            toggleFavorite(product);
                            toast.success(isProductFavorite ? 'Removed from favorites' : 'Added to favorites', {
                              position: "top-center",
                            });
                          }}
                          className="absolute top-3 right-3 p-2 rounded-full bg-background/80 hover:bg-background transition-colors"
                        >
                          <Heart className={`h-4 w-4 ${isProductFavorite ? 'fill-primary text-primary' : 'text-muted-foreground'}`} />
                        </button>
                      </div>
                      <h3 className="font-medium text-sm sm:text-base line-clamp-1 group-hover:text-primary transition-colors">
                        {product.node.title}
                      </h3>
                      <p className="text-primary font-display">
                        ${productPrice.toFixed(2)}
                      </p>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          {/* Reviews Section */}
          <ProductReviews productTitle={product.title} />
        </div>
      </main>

      {/* Application Tutorial Modal */}
      <Dialog open={isTutorialOpen} onOpenChange={setIsTutorialOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <PlayCircle className="h-5 w-5 text-primary" />
              </div>
              How to Apply Your Nails
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 pt-4">
            {/* Video Placeholder */}
            <div className="relative aspect-video bg-gradient-to-br from-muted to-muted/50 rounded-2xl overflow-hidden group cursor-pointer">
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-lg">
                  <PlayCircle className="h-8 w-8 text-primary-foreground fill-primary-foreground" />
                </div>
                <p className="text-sm font-medium text-foreground">Video Tutorial Coming Soon</p>
                <p className="text-xs text-muted-foreground mt-1">Follow the steps below for now</p>
              </div>
              {/* Decorative elements */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted-foreground/20">
                <div className="h-full w-1/3 bg-primary/50 rounded-r" />
              </div>
              <div className="absolute bottom-3 right-3 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded">
                2:30
              </div>
            </div>

            {/* Steps */}
            {[
              {
                step: "1",
                title: "Prep Your Nails",
                desc: "Start with clean, dry nails. Gently push back cuticles and lightly buff the nail surface for better adhesion. Wipe with alcohol to remove any oils.",
                icon: Hand,
              },
              {
                step: "2",
                title: "Select Your Size",
                desc: "Match each press-on nail to your natural nail width. The nail should fit from sidewall to sidewall without touching your skin. Use your Perfect Fit Profile for faster sizing.",
                icon: FileText,
              },
              {
                step: "3",
                title: "Apply Adhesive",
                desc: "For adhesive tabs: peel and place on your natural nail. For nail glue: apply a thin layer to both your natural nail and the press-on nail.",
                icon: Droplets,
              },
              {
                step: "4",
                title: "Press & Hold",
                desc: "Starting at the cuticle, press the nail firmly at a slight angle, then press down. Hold for 30-60 seconds with steady pressure to ensure a secure bond.",
                icon: Clock,
              },
              {
                step: "5",
                title: "Final Touches",
                desc: "After all nails are applied, avoid water for at least 1 hour. Gently file any edges if needed. Apply cuticle oil around the edges for a polished look.",
                icon: Sparkles,
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-lg font-bold text-primary-foreground">{item.step}</span>
                  </div>
                </div>
                <div className="flex-1 pt-1">
                  <div className="flex items-center gap-2 mb-1">
                    <item.icon className="h-4 w-4 text-primary" />
                    <h3 className="font-display text-lg font-medium">{item.title}</h3>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}

            {/* Pro Tips */}
            <div className="bg-muted/50 rounded-2xl p-4 mt-6">
              <h4 className="font-medium flex items-center gap-2 mb-3">
                <Sparkles className="h-4 w-4 text-primary" />
                Pro Tips
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  Apply nails at night so glue can set while you sleep
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  If a nail feels too big, file the sides for a custom fit
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  Avoid hot water and steam for the first 2 hours
                </li>
              </ul>
            </div>

            {/* Full Guide Link */}
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <span className="text-sm text-muted-foreground">Need more details?</span>
              <Link 
                to="/how-to#application" 
                onClick={() => setIsTutorialOpen(false)}
                className="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1"
              >
                View Full Guide
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default ProductDetail;
