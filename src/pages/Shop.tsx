import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Product, getProducts } from "@/lib/products";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Filter, X, Heart, Eye } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useFavoritesStore } from "@/stores/favoritesStore";
import { toast } from "sonner";
import QuickViewModal from "@/components/QuickViewModal";

const PRICE_RANGES = ['All', 'Under $30', '$30–$50', '$50+'];
const DESIGN_TYPES = ['All', 'Solid / Simple', 'French Tip', 'Ombré / Gradient', 'Hand-painted Art', '3D / Embellished'];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc', label: 'Name: A-Z' },
];

const Shop = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPriceRange, setSelectedPriceRange] = useState('All');
  const [selectedDesignType, setSelectedDesignType] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setProducts(getProducts());
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // Filter products by price range and design type
  const filteredProducts = products.filter(product => {
    // Price Range filter
    if (selectedPriceRange !== 'All') {
      if (selectedPriceRange === 'Under $30' && product.price >= 30) return false;
      if (selectedPriceRange === '$30–$50' && (product.price < 30 || product.price > 50)) return false;
      if (selectedPriceRange === '$50+' && product.price <= 50) return false;
    }
    // Design Type filter
    if (selectedDesignType !== 'All') {
      if (product.designType !== selectedDesignType) return false;
    }
    return true;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'name-asc':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  const clearFilters = () => {
    setSelectedPriceRange('All');
    setSelectedDesignType('All');
    setSortBy('newest');
  };

  const hasActiveFilters = selectedPriceRange !== 'All' || selectedDesignType !== 'All';

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-16">
        {/* Editorial Hero Section */}
        <div className="relative overflow-hidden bg-[hsl(30,30%,97%)]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center max-w-4xl mx-auto py-20 md:py-28">
              {/* Editorial tagline */}
              <p className="text-xs font-medium tracking-[0.4em] uppercase text-primary/70 mb-8">
                Curated Collections
              </p>
              
              {/* Main editorial title */}
              <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-medium tracking-tight mb-8 leading-[0.95]">
                <span className="block">Shop All</span>
                <span className="block italic text-primary/90">Sets</span>
              </h1>
              
              {/* Elegant description */}
              <p className="text-muted-foreground text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed">
                Discover our handcrafted press-on nail collections, designed for every moment—from everyday elegance to unforgettable occasions.
              </p>
              
              {/* Decorative divider */}
              <div className="mt-10 hidden md:flex items-center justify-center gap-4">
                <div className="w-12 h-px bg-gradient-to-r from-transparent to-primary/30" />
                <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                <div className="w-12 h-px bg-gradient-to-l from-transparent to-primary/30" />
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Premium Refined Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-12 py-5 border-y border-border/30">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                className="rounded-full hover:bg-accent/50 transition-all duration-300 text-foreground/70 hover:text-foreground"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                <span className="font-medium">Refine</span>
                {hasActiveFilters && (
                  <span className="ml-2 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                    {(selectedPriceRange !== 'All' ? 1 : 0) + (selectedDesignType !== 'All' ? 1 : 0)}
                  </span>
                )}
              </Button>
              
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                >
                  Clear all
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-6">
              <span className="text-sm text-muted-foreground font-light tracking-wide">
                {sortedProducts.length} {sortedProducts.length === 1 ? 'piece' : 'pieces'}
              </span>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-auto border-none bg-transparent shadow-none h-auto py-2 px-0 pr-6 text-sm font-medium text-foreground/70 hover:text-foreground focus:ring-0 focus:ring-offset-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent align="end">
                  {SORT_OPTIONS.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Premium Filters Panel */}
          {showFilters && (
            <div className="mb-12 p-8 bg-gradient-to-br from-card/80 to-accent/10 backdrop-blur-sm border border-border/30 rounded-3xl animate-fade-in shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Price Range Filter */}
                <div className="space-y-5">
                  <label className="text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground">Price Range</label>
                  <div className="flex flex-wrap gap-2">
                    {PRICE_RANGES.map(range => (
                      <button
                        key={range}
                        onClick={() => setSelectedPriceRange(range)}
                        className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                          selectedPriceRange === range
                            ? 'bg-primary text-primary-foreground shadow-md'
                            : 'bg-background/80 text-foreground/60 hover:text-foreground hover:bg-background'
                        }`}
                      >
                        {range}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Design Type Filter */}
                <div className="space-y-5">
                  <label className="text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground">Design Type</label>
                  <div className="flex flex-wrap gap-2">
                    {DESIGN_TYPES.map(type => (
                      <button
                        key={type}
                        onClick={() => setSelectedDesignType(type)}
                        className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                          selectedDesignType === type
                            ? 'bg-primary text-primary-foreground shadow-md'
                            : 'bg-background/80 text-foreground/60 hover:text-foreground hover:bg-background'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Products Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-32">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : sortedProducts.length === 0 ? (
            <div className="text-center py-32">
              <p className="text-muted-foreground text-lg mb-6 font-light">No pieces found in this collection</p>
              <Button 
                variant="outline" 
                className="rounded-full px-8"
                onClick={clearFilters}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-5 lg:gap-6">
              {sortedProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onQuickView={() => setQuickViewProduct(product)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <QuickViewModal 
        product={quickViewProduct} 
        isOpen={!!quickViewProduct} 
        onClose={() => setQuickViewProduct(null)} 
      />

      <Footer />
    </div>
  );
};

const ProductCard = ({ product, onQuickView }: { product: Product; onQuickView: () => void }) => {
  const image = product.images[0];
  const isAvailable = product.variants[0]?.availableForSale;
  const { items, addFavorite, removeFavorite } = useFavoritesStore();
  const isFavorite = items.some(fav => fav.id === product.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFavorite) {
      removeFavorite(product.id);
      toast.success("Removed from favorites");
    } else {
      addFavorite(product);
      toast.success("Added to favorites");
    }
  };

  return (
    <div className="group">
      <div className="relative">
        <Link to={`/product/${product.handle}`}>
          <div className="aspect-square rounded-2xl overflow-hidden bg-muted/10 mb-4 relative shadow-sm group-hover:shadow-xl transition-all duration-500 group-hover:-translate-y-2">
            {image ? (
              <img
                src={image}
                alt={product.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted/20">
                <span className="text-muted-foreground text-sm">No image</span>
              </div>
            )}
            
            {/* Badge */}
            {product.badge && (
              <div className="absolute top-3 left-3 z-10">
                <span className={`
                  px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase
                  ${product.badge === 'New' 
                    ? 'bg-primary text-primary-foreground shadow-md' 
                    : 'bg-foreground/90 text-background shadow-md'
                  }
                `}>
                  {product.badge}
                </span>
              </div>
            )}
            
            {/* Quick View Overlay - appears on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-400 flex items-center justify-center">
              <Button
                variant="secondary"
                size="sm"
                className="rounded-full shadow-xl bg-background hover:bg-background border-0 px-6 py-2.5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0"
                onClick={(e) => {
                  e.preventDefault();
                  onQuickView();
                }}
              >
                <Eye className="h-4 w-4 mr-2" />
                Quick View
              </Button>
            </div>
            
            {/* Sold out overlay */}
            {!isAvailable && (
              <div className="absolute inset-0 bg-background/70 flex items-center justify-center z-10">
                <span className="bg-foreground text-background px-5 py-2 rounded-full text-sm font-medium tracking-wide">
                  Sold Out
                </span>
              </div>
            )}
          </div>
        </Link>
        
        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 p-2.5 rounded-full bg-background/90 backdrop-blur-sm shadow-md hover:bg-background hover:shadow-lg transition-all duration-300 z-20 hover:scale-110"
        >
          <Heart 
            className={`h-4 w-4 transition-all duration-300 ${isFavorite ? 'fill-primary text-primary scale-110' : 'text-foreground/50 hover:text-foreground/70'}`} 
          />
        </button>
      </div>
      
      {/* Product Info */}
      <div className="space-y-2 px-1">
        <Link to={`/product/${product.handle}`}>
          <h3 className="font-display text-lg font-medium group-hover:text-primary transition-colors duration-300 line-clamp-1">
            {product.title}
          </h3>
        </Link>
        <p className="text-primary/90 font-display text-lg tracking-wide">
          ${product.price.toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default Shop;
