import { useState, useEffect } from "react";
import { Product, getProducts } from "@/lib/products";
import { useCartStore, CartItem } from "@/stores/cartStore";
import { useFavoritesStore } from "@/stores/favoritesStore";
import { Button } from "@/components/ui/button";
import { Loader2, ShoppingBag, Heart } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const ProductGrid = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore(state => state.addItem);
  const { toggleFavorite, isFavorite } = useFavoritesStore();

  useEffect(() => {
    // Simulate loading for smooth UX
    const timer = setTimeout(() => {
      setProducts(getProducts());
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const firstVariant = product.variants[0];
    if (!firstVariant) return;

    const cartItem: CartItem = {
      product,
      variantId: firstVariant.id,
      variantTitle: firstVariant.title,
      price: {
        amount: firstVariant.price.toString(),
        currencyCode: firstVariant.currencyCode,
      },
      quantity: 1,
      selectedOptions: firstVariant.selectedOptions || [],
    };

    addItem(cartItem);
    toast.success(`${product.title} added to bag`, {
      position: "top-center",
    });
  };

  const handleToggleFavorite = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const wasInFavorites = isFavorite(product.id);
    toggleFavorite(product);
    
    toast.success(wasInFavorites ? `Removed from favorites` : `Added to favorites`, {
      position: "top-center",
    });
  };

  if (loading) {
    return (
      <section className="section-padding bg-background">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-medium mb-4">
              Our Collection
            </h2>
          </div>
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className="section-padding bg-background">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-medium mb-4">
              Our Collection
            </h2>
          </div>
          <div className="text-center py-20">
            <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">No products found</p>
            <p className="text-sm text-muted-foreground mt-2">
              Products will appear here once added.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding bg-background" id="shop">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <p className="text-sm font-medium tracking-[0.2em] uppercase text-primary mb-3">
            Shop
          </p>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-medium mb-4">
            Our Collection
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
            Handcrafted press-on nail sets designed for every occasion
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {products.map((product) => {
            const image = product.images[0];
            
            return (
              <Link
                key={product.id}
                to={`/product/${product.handle}`}
                className="group"
              >
                <div className="relative overflow-hidden rounded-2xl bg-muted/30 aspect-square mb-4">
                  {image ? (
                    <img
                      src={image}
                      alt={product.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-secondary/20">
                      <ShoppingBag className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                  
                  {/* Favorite Button */}
                  <button
                    onClick={(e) => handleToggleFavorite(product, e)}
                    className="absolute top-3 right-3 w-9 h-9 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center transition-all hover:bg-background hover:scale-110"
                  >
                    <Heart 
                      className={`h-5 w-5 transition-colors ${
                        isFavorite(product.id) 
                          ? 'fill-primary text-primary' 
                          : 'text-foreground/70'
                      }`} 
                    />
                  </button>
                  
                  {/* Quick Add Button */}
                  <div className="absolute inset-x-0 bottom-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button 
                      className="w-full btn-primary text-sm"
                      onClick={(e) => handleAddToCart(product, e)}
                    >
                      Add to Bag
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <h3 className="font-display text-base sm:text-lg font-medium group-hover:text-primary transition-colors">
                    {product.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    ${product.price.toFixed(2)} {product.currencyCode}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
