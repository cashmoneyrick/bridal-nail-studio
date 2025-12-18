import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchProductByHandle, ShopifyProduct } from "@/lib/shopify";
import { useCartStore, CartItem } from "@/stores/cartStore";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, Minus, Plus, Check } from "lucide-react";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const ProductDetail = () => {
  const { handle } = useParams<{ handle: string }>();
  const [product, setProduct] = useState<ShopifyProduct['node'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  const addItem = useCartStore(state => state.addItem);

  useEffect(() => {
    const loadProduct = async () => {
      if (!handle) return;
      
      try {
        setLoading(true);
        const data = await fetchProductByHandle(handle);
        setProduct(data);
        
        // Set default variant
        if (data?.variants.edges.length > 0) {
          const firstVariant = data.variants.edges[0].node;
          setSelectedVariant(firstVariant.id);
          
          // Set default options
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

  // Update selected variant when options change
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
          {/* Back Link */}
          <Link 
            to="/#shop" 
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Shop
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
            {/* Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="aspect-square rounded-3xl overflow-hidden bg-muted/30">
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
              <div>
                <h1 className="font-display text-3xl sm:text-4xl font-medium mb-2">
                  {product.title}
                </h1>
                <p className="text-2xl font-display text-primary">
                  ${parseFloat(currentVariant?.price.amount || product.priceRange.minVariantPrice.amount).toFixed(2)}
                </p>
              </div>

              {/* Options */}
              {product.options.map(option => (
                option.name !== "Title" && option.values.length > 1 && (
                  <div key={option.name} className="space-y-3">
                    <label className="text-sm font-medium">{option.name}</label>
                    <div className="flex flex-wrap gap-2">
                      {option.values.map(value => (
                        <button
                          key={value}
                          onClick={() => setSelectedOptions(prev => ({ ...prev, [option.name]: value }))}
                          className={`px-4 py-2 rounded-full border text-sm transition-all ${
                            selectedOptions[option.name] === value
                              ? 'border-primary bg-primary text-primary-foreground'
                              : 'border-border hover:border-primary'
                          }`}
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                  </div>
                )
              ))}

              {/* Quantity */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Quantity</label>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="rounded-full"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                    className="rounded-full"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Add to Cart */}
              <Button 
                className="w-full btn-primary text-base py-6"
                onClick={handleAddToCart}
                disabled={!currentVariant?.availableForSale}
              >
                {currentVariant?.availableForSale ? (
                  <>
                    <Check className="h-5 w-5 mr-2" />
                    Add to Bag - ${(parseFloat(currentVariant.price.amount) * quantity).toFixed(2)}
                  </>
                ) : (
                  'Sold Out'
                )}
              </Button>

              {/* Description */}
              {product.description && (
                <div className="pt-6 border-t">
                  <h3 className="font-display text-lg font-medium mb-3">Description</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Features */}
              <div className="pt-6 border-t space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Handcrafted with premium materials</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Reusable up to 3+ times with proper care</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Includes application kit & instructions</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;