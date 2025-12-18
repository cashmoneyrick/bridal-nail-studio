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
import { Loader2, Minus, Plus, Heart, Sparkles, Tag, User, ChevronRight, Package, PlayCircle, ShieldCheck, Truck, ShoppingBag } from "lucide-react";
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
                <Accordion type="single" collapsible defaultValue="whats-included" className="space-y-2">
                  <AccordionItem value="whats-included" className="border-none">
                    <AccordionTrigger className="hover:no-underline py-3">
                      <span className="flex items-center gap-3 text-base font-medium">
                        <Package className="h-5 w-5 text-primary" />
                        What's Included
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pl-8">
                      <ul className="space-y-2 text-sm">
                        <li>• 24 press-on nails (full set)</li>
                        <li>• Nail glue tube</li>
                        <li>• Mini nail file</li>
                        <li>• Prep pad</li>
                        <li>• Application instructions card</li>
                        <li>• Reusable storage case</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="how-to-apply" className="border-none">
                    <AccordionTrigger className="hover:no-underline py-3">
                      <span className="flex items-center gap-3 text-base font-medium">
                        <PlayCircle className="h-5 w-5 text-primary" />
                        How to Apply
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pl-8">
                      <div className="space-y-3 text-sm">
                        <p><strong>1.</strong> Clean and prep your nails</p>
                        <p><strong>2.</strong> Select the right size for each finger</p>
                        <p><strong>3.</strong> Apply adhesive and press firmly for 30 seconds</p>
                        <Link 
                          to="/how-to#application" 
                          className="inline-flex items-center text-primary hover:underline mt-2"
                        >
                          View Full Tutorial
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="care" className="border-none">
                    <AccordionTrigger className="hover:no-underline py-3">
                      <span className="flex items-center gap-3 text-base font-medium">
                        <ShieldCheck className="h-5 w-5 text-primary" />
                        Care & Maintenance
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pl-8">
                      <div className="space-y-2 text-sm">
                        <p>• Avoid prolonged water exposure</p>
                        <p>• Be gentle—don't use nails as tools</p>
                        <p>• Apply cuticle oil daily for best results</p>
                        <p>• With proper care, nails last 1-2 weeks</p>
                        <Link 
                          to="/how-to#care" 
                          className="inline-flex items-center text-primary hover:underline mt-2"
                        >
                          View Care Guide
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="shipping" className="border-none">
                    <AccordionTrigger className="hover:no-underline py-3">
                      <span className="flex items-center gap-3 text-base font-medium">
                        <Truck className="h-5 w-5 text-primary" />
                        Shipping & Returns
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pl-8">
                      <div className="space-y-3 text-sm">
                        <div>
                          <p className="font-medium text-foreground mb-1">Shipping</p>
                          <p>• Free shipping on orders $50+</p>
                          <p>• Standard: 5-7 business days</p>
                          <p>• Express: 2-3 business days</p>
                        </div>
                        <div>
                          <p className="font-medium text-foreground mb-1">Returns</p>
                          <p>• 30-day return policy</p>
                          <p>• Unused items in original packaging</p>
                          <Link 
                            to="/contact" 
                            className="inline-flex items-center text-primary hover:underline mt-1"
                          >
                            Contact us with questions
                            <ChevronRight className="h-4 w-4" />
                          </Link>
                        </div>
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

      <Footer />
    </div>
  );
};

export default ProductDetail;
