import { useState, useEffect, useCallback, useRef } from "react";
import { Product, getProducts } from "@/lib/products";
import { useFavoritesStore } from "@/stores/favoritesStore";
import { Button } from "@/components/ui/button";
import { Loader2, ShoppingBag, Heart, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import QuickViewModal from "@/components/QuickViewModal";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";

const ProductGrid = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const { toggleFavorite, isFavorite } = useFavoritesStore();

  // Embla Carousel for mobile with auto-scroll
  const resumeTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      align: "start",
      loop: true,
      dragFree: true,
    },
    [
      AutoScroll({
        direction: "forward",
        speed: 0.8,
        stopOnInteraction: false,
        stopOnMouseEnter: false,
        playOnInit: true,
      }),
    ]
  );

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  // Handle auto-scroll pause/resume on user interaction
  useEffect(() => {
    if (!emblaApi) return;

    const autoScroll = emblaApi.plugins()?.autoScroll;
    if (!autoScroll) return;

    const onPointerDown = () => {
      if (resumeTimerRef.current) {
        clearTimeout(resumeTimerRef.current);
        resumeTimerRef.current = null;
      }
      autoScroll.stop();
    };

    const onPointerUp = () => {
      resumeTimerRef.current = setTimeout(() => {
        autoScroll.play();
      }, 2500);
    };

    emblaApi.on("pointerDown", onPointerDown);
    emblaApi.on("pointerUp", onPointerUp);

    return () => {
      emblaApi.off("pointerDown", onPointerDown);
      emblaApi.off("pointerUp", onPointerUp);
      if (resumeTimerRef.current) {
        clearTimeout(resumeTimerRef.current);
      }
    };
  }, [emblaApi]);

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

  // Duplicate products for seamless infinite loop
  const extendedProducts = [...products, ...products];

  if (loading) {
    return (
      <section className="pt-4 sm:pt-6 pb-16 sm:pb-20 bg-background">
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
      <section className="pt-4 sm:pt-6 pb-16 sm:pb-20 bg-background">
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
    <section className="pt-4 sm:pt-6 pb-16 sm:pb-20 bg-background" id="shop">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <p className="text-sm font-medium tracking-[0.2em] uppercase text-primary mb-3">
            Shop
          </p>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-medium mb-4">
            Shop Our Bestsellers
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
            Handcrafted press-on nail sets designed for every occasion
          </p>
        </div>

        {/* Mobile/Tablet Carousel (< 1024px) */}
        <div className="lg:hidden">
          <div className="relative">
            {/* Left fade gradient */}
            <div className="absolute left-0 top-0 bottom-12 w-8 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />

            {/* Carousel Container */}
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex -ml-4">
                {extendedProducts.map((product, index) => {
                  const image = product.images[0];

                  return (
                    <div
                      key={`${product.id}-${index}`}
                      className="flex-none pl-4"
                      style={{ width: "85%" }}
                    >
                      <Link
                        to={`/product/${product.handle}`}
                        className="group block"
                      >
                        <div className="relative overflow-hidden rounded-2xl bg-muted/30 aspect-square shadow-sm">
                          {image ? (
                            <img
                              src={image}
                              alt={product.title}
                              loading={index < 2 ? "eager" : "lazy"}
                              decoding="async"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-secondary/20">
                              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
                            </div>
                          )}

                          {/* Favorite Button */}
                          <button
                            onClick={(e) => handleToggleFavorite(product, e)}
                            className="absolute top-3 right-3 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center transition-all hover:bg-background z-10"
                          >
                            <Heart
                              className={`h-5 w-5 transition-colors ${
                                isFavorite(product.id)
                                  ? 'fill-primary text-primary'
                                  : 'text-foreground/70'
                              }`}
                            />
                          </button>
                        </div>

                        {/* Compact Product Info */}
                        <div className="flex items-center justify-between mt-3 px-1">
                          <h3 className="font-display text-base font-medium truncate flex-1 mr-3">
                            {product.title}
                          </h3>
                          <p className="text-sm whitespace-nowrap">
                            <span className="text-foreground/40 line-through mr-1.5">Salon: $80+</span>
                            <span className="text-muted-foreground font-medium">${product.price.toFixed(2)}</span>
                          </p>
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right fade gradient */}
            <div className="absolute right-0 top-0 bottom-12 w-8 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

            {/* Arrow Navigation */}
            <button
              onClick={scrollPrev}
              className="absolute left-2 top-[calc(50%-40px)] -translate-y-1/2 w-10 h-10 rounded-full bg-background/90 backdrop-blur-sm shadow-lg flex items-center justify-center transition-all hover:bg-background z-20"
              aria-label="Previous product"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={scrollNext}
              className="absolute right-2 top-[calc(50%-40px)] -translate-y-1/2 w-10 h-10 rounded-full bg-background/90 backdrop-blur-sm shadow-lg flex items-center justify-center transition-all hover:bg-background z-20"
              aria-label="Next product"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Desktop Grid (>= 1024px) */}
        <div className="hidden lg:grid grid-cols-4 gap-8">
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
                  <h3 className="font-display text-lg font-medium group-hover:text-primary transition-colors">
                    {product.title}
                  </h3>
                  <p className="text-sm">
                    <span className="text-foreground/40 line-through mr-1.5">Salon: $80+</span>
                    <span className="text-muted-foreground">${product.price.toFixed(2)}</span>
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
