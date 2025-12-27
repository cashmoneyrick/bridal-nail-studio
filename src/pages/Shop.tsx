import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Product, getProducts } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { Loader2, Filter, X, Grid3X3, LayoutList, Heart, ShoppingBag, ChevronDown } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useCartStore, CartItem } from "@/stores/cartStore";
import { useFavoritesStore } from "@/stores/favoritesStore";
import { toast } from "sonner";

const SHAPES = ['All', 'Almond', 'Coffin', 'Stiletto', 'Square', 'Oval'];
const LENGTHS = ['All', 'Short', 'Medium', 'Long', 'Extra Long'];
const COLLECTIONS = ['All', 'Bridal', 'Everyday', 'French & Classic', 'Bold & Artistic'];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc', label: 'Name: A-Z' },
];

const TAGLINES = [
  "Handcrafted with love",
  "For every occasion",
  "Your perfect set awaits",
  "Luxury at your fingertips"
];

const Shop = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedShape, setSelectedShape] = useState('All');
  const [selectedLength, setSelectedLength] = useState('All');
  const [selectedCollection, setSelectedCollection] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [taglineIndex, setTaglineIndex] = useState(0);
  
  const addItem = useCartStore(state => state.addItem);

  useEffect(() => {
    const timer = setTimeout(() => {
      setProducts(getProducts());
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // Rotate taglines
  useEffect(() => {
    const interval = setInterval(() => {
      setTaglineIndex((prev) => (prev + 1) % TAGLINES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleQuickAdd = (product: Product) => {
    const variant = product.variants[0];
    if (!variant || !variant.availableForSale) return;

    const cartItem: CartItem = {
      product: product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: {
        amount: variant.price.toString(),
        currencyCode: variant.currencyCode,
      },
      quantity: 1,
      selectedOptions: variant.selectedOptions,
    };

    addItem(cartItem);
    toast.success(`${product.title} added to bag`, {
      position: "top-center",
    });
  };

  // Filter by collection
  const filteredProducts = products.filter(product => {
    if (selectedCollection === 'All') return true;
    return product.collection === selectedCollection;
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
    setSelectedShape('All');
    setSelectedLength('All');
    setSelectedCollection('All');
    setSortBy('newest');
  };

  const hasActiveFilters = selectedShape !== 'All' || selectedLength !== 'All' || selectedCollection !== 'All';

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-16">
        {/* Editorial Hero Section */}
        <div className="relative overflow-hidden">
          <div 
            className="absolute inset-0 opacity-40"
            style={{
              background: 'radial-gradient(ellipse at center top, hsl(var(--dusty-rose) / 0.3) 0%, hsl(var(--blush-cream) / 0.2) 50%, transparent 70%)'
            }}
          />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center max-w-3xl mx-auto py-16 md:py-20">
              <p className="text-xs font-medium tracking-[0.3em] uppercase text-primary/80 mb-6">
                The Collection
              </p>
              <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-medium tracking-tight mb-6">
                Shop All Sets
              </h1>
              <div className="h-8 overflow-hidden">
                <p 
                  key={taglineIndex}
                  className="text-muted-foreground text-lg md:text-xl font-light italic animate-fade-in"
                >
                  {TAGLINES[taglineIndex]}
                </p>
              </div>
              <div className="mt-8 w-16 h-px bg-primary/30 mx-auto" />
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Collection Filter Pills */}
          <div className="flex justify-center mb-10">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {COLLECTIONS.map((collection) => (
                <button
                  key={collection}
                  onClick={() => setSelectedCollection(collection)}
                  className={`
                    px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap
                    transition-all duration-300 border
                    ${selectedCollection === collection
                      ? 'bg-primary text-primary-foreground border-primary shadow-md'
                      : 'bg-background text-foreground/70 border-border hover:border-primary/50 hover:text-foreground hover:shadow-sm'
                    }
                  `}
                >
                  {collection}
                </button>
              ))}
            </div>
          </div>

          {/* Premium Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-10 py-4 border-y border-border/50">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="rounded-full border-border/70 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                <span className="font-medium">Refine</span>
                {hasActiveFilters && (
                  <span className="ml-2 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                    {(selectedShape !== 'All' ? 1 : 0) + (selectedLength !== 'All' ? 1 : 0) + (selectedCollection !== 'All' ? 1 : 0)}
                  </span>
                )}
              </Button>
              
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Clear all
                  <X className="h-4 w-4 ml-1" />
                </Button>
              )}
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground font-light">
                {sortedProducts.length} {sortedProducts.length === 1 ? 'piece' : 'pieces'}
              </span>
              
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none text-sm bg-background border border-border/70 rounded-full pl-4 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all cursor-pointer"
                >
                  {SORT_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>

              <div className="hidden sm:flex items-center gap-1 border border-border/70 rounded-full p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-full transition-all duration-300 ${viewMode === 'grid' ? 'bg-primary text-primary-foreground shadow-sm' : 'hover:bg-muted'}`}
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-full transition-all duration-300 ${viewMode === 'list' ? 'bg-primary text-primary-foreground shadow-sm' : 'hover:bg-muted'}`}
                >
                  <LayoutList className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Premium Filters Panel */}
          {showFilters && (
            <div className="mb-10 p-8 bg-card/50 backdrop-blur-sm border border-border/50 rounded-3xl animate-fade-in shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Shape Filter */}
                <div className="space-y-4">
                  <label className="text-sm font-medium tracking-wide uppercase text-muted-foreground">Shape</label>
                  <div className="flex flex-wrap gap-2">
                    {SHAPES.map(shape => (
                      <button
                        key={shape}
                        onClick={() => setSelectedShape(shape)}
                        className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border ${
                          selectedShape === shape
                            ? 'bg-primary text-primary-foreground border-primary shadow-md'
                            : 'bg-background border-border/70 text-foreground/70 hover:border-primary/50 hover:text-foreground'
                        }`}
                      >
                        {shape}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Length Filter */}
                <div className="space-y-4">
                  <label className="text-sm font-medium tracking-wide uppercase text-muted-foreground">Length</label>
                  <div className="flex flex-wrap gap-2">
                    {LENGTHS.map(length => (
                      <button
                        key={length}
                        onClick={() => setSelectedLength(length)}
                        className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border ${
                          selectedLength === length
                            ? 'bg-primary text-primary-foreground border-primary shadow-md'
                            : 'bg-background border-border/70 text-foreground/70 hover:border-primary/50 hover:text-foreground'
                        }`}
                      >
                        {length}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Products */}
          {loading ? (
            <div className="flex justify-center items-center py-24">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : sortedProducts.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-muted-foreground text-lg mb-4 font-light">No pieces found in this collection</p>
              <Button 
                variant="outline" 
                className="rounded-full"
                onClick={() => setSelectedCollection('All')}
              >
                View All Sets
              </Button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
              {sortedProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onQuickAdd={() => handleQuickAdd(product)}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {sortedProducts.map((product) => (
                <ProductListItem 
                  key={product.id} 
                  product={product} 
                  onQuickAdd={() => handleQuickAdd(product)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

const ProductCard = ({ product, onQuickAdd }: { product: Product; onQuickAdd: () => void }) => {
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
          <div className="aspect-square rounded-2xl overflow-hidden bg-muted/20 mb-4 relative shadow-sm group-hover:shadow-xl transition-all duration-500 group-hover:-translate-y-1">
            {image ? (
              <img
                src={image}
                alt={product.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-muted-foreground text-sm">No image</span>
              </div>
            )}
            
            {/* Badge */}
            {product.badge && (
              <div className="absolute top-3 left-3">
                <span className={`
                  px-3 py-1 rounded-full text-xs font-medium
                  ${product.badge === 'New' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-foreground text-background'
                  }
                `}>
                  {product.badge}
                </span>
              </div>
            )}
            
            {/* Quick Add Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
              <Button
                variant="secondary"
                size="sm"
                className="rounded-full shadow-lg bg-background/90 backdrop-blur-sm hover:bg-background border border-border/50"
                onClick={(e) => {
                  e.preventDefault();
                  onQuickAdd();
                }}
                disabled={!isAvailable}
              >
                <ShoppingBag className="h-4 w-4 mr-2" />
                {isAvailable ? 'Quick Add' : 'Sold Out'}
              </Button>
            </div>
            
            {!isAvailable && (
              <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                <span className="bg-foreground text-background px-4 py-1.5 rounded-full text-sm font-medium">
                  Sold Out
                </span>
              </div>
            )}
          </div>
        </Link>
        
        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 p-2.5 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 shadow-sm hover:bg-background hover:shadow-md transition-all duration-300 z-10"
        >
          <Heart 
            className={`h-4 w-4 transition-colors ${isFavorite ? 'fill-primary text-primary' : 'text-foreground/60'}`} 
          />
        </button>
      </div>
      
      <div className="space-y-1.5 px-1">
        <Link to={`/product/${product.handle}`}>
          <h3 className="font-display text-lg font-medium group-hover:text-primary transition-colors line-clamp-1">
            {product.title}
          </h3>
        </Link>
        <p className="text-primary font-display text-lg">${product.price.toFixed(2)}</p>
      </div>
    </div>
  );
};

const ProductListItem = ({ product, onQuickAdd }: { product: Product; onQuickAdd: () => void }) => {
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
    <div className="flex gap-6 p-5 bg-card/50 border border-border/50 rounded-2xl group hover:shadow-xl hover:-translate-y-0.5 transition-all duration-500">
      <Link to={`/product/${product.handle}`} className="flex-shrink-0 relative">
        <div className="w-36 h-36 rounded-xl overflow-hidden bg-muted/20 shadow-sm">
          {image ? (
            <img
              src={image}
              alt={product.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-muted-foreground text-xs">No image</span>
            </div>
          )}
        </div>
        {/* Badge */}
        {product.badge && (
          <div className="absolute top-2 left-2">
            <span className={`
              px-2 py-0.5 rounded-full text-xs font-medium
              ${product.badge === 'New' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-foreground text-background'
              }
            `}>
              {product.badge}
            </span>
          </div>
        )}
      </Link>
      
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-4">
            <Link to={`/product/${product.handle}`}>
              <h3 className="font-display text-xl font-medium group-hover:text-primary transition-colors">
                {product.title}
              </h3>
            </Link>
            <button
              onClick={handleFavoriteClick}
              className="p-2 rounded-full hover:bg-muted transition-colors"
            >
              <Heart 
                className={`h-5 w-5 transition-colors ${isFavorite ? 'fill-primary text-primary' : 'text-muted-foreground'}`} 
              />
            </button>
          </div>
          <p className="text-muted-foreground text-sm line-clamp-2 mt-1.5 font-light">
            {product.description}
          </p>
        </div>
        
        <div className="flex items-center justify-between mt-4">
          <p className="text-primary font-display text-xl">${product.price.toFixed(2)}</p>
          <Button
            variant="outline"
            className="rounded-full border-border/70 hover:border-primary/50 hover:bg-primary/5"
            onClick={onQuickAdd}
            disabled={!isAvailable}
          >
            <ShoppingBag className="h-4 w-4 mr-2" />
            {isAvailable ? 'Add to Bag' : 'Sold Out'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Shop;