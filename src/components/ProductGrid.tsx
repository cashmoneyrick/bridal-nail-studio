import { useState, useEffect } from "react";
import { Product, getProducts } from "@/lib/products";
import { useFavoritesStore } from "@/stores/favoritesStore";
import { Button } from "@/components/ui/button";
import { Loader2, ShoppingBag, Heart, Eye } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import QuickViewModal from "@/components/QuickViewModal";

const ProductGrid = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const { toggleFavorite, isFavorite } = useFavoritesStore();

  useEffect(() => {
    // Simulate loading for smooth UX
    const timer = setTimeout(() => {
      setProducts(getProducts());
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

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
                <div className="relative overflow-hidden rounded-2xl bg-muted/30 aspect-square mb-4 shadow-sm group-hover:shadow-xl transition-all duration-500 group-hover:-translate-y-2">
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
                    className="absolute top-3 right-3 w-9 h-9 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center transition-all hover:bg-background hover:scale-110 z-10"
                  >
                    <Heart 
                      className={`h-5 w-5 transition-colors ${
                        isFavorite(product.id) 
                          ? 'fill-primary text-primary' 
                          : 'text-foreground/70'
                      }`} 
                    />
                  </button>
                  
                  {/* Quick View Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-400 flex items-center justify-center">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="rounded-full shadow-xl bg-background hover:bg-background border-0 px-6 py-2.5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setQuickViewProduct(product);
                      }}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Quick View
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

      {/* Quick View Modal */}
      <QuickViewModal 
        product={quickViewProduct} 
        isOpen={!!quickViewProduct} 
        onClose={() => setQuickViewProduct(null)} 
      />
    </section>
  );
};

export default ProductGrid;
