import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchProducts, ShopifyProduct } from "@/lib/shopify";
import { Button } from "@/components/ui/button";
import { Loader2, Filter, X, Grid3X3, LayoutList } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useCartStore, CartItem } from "@/stores/cartStore";
import { toast } from "sonner";

const SHAPES = ['All', 'Almond', 'Coffin', 'Stiletto', 'Square', 'Oval'];
const LENGTHS = ['All', 'Short', 'Medium', 'Long', 'Extra Long'];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc', label: 'Name: A-Z' },
];

const Shop = () => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedShape, setSelectedShape] = useState('All');
  const [selectedLength, setSelectedLength] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const addItem = useCartStore(state => state.addItem);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const data = await fetchProducts(50);
        setProducts(data);
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const handleQuickAdd = (product: ShopifyProduct) => {
    const variant = product.node.variants.edges[0]?.node;
    if (!variant || !variant.availableForSale) return;

    const cartItem: CartItem = {
      product: product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions,
    };

    addItem(cartItem);
    toast.success(`${product.node.title} added to bag`, {
      position: "top-center",
    });
  };

  // Sort products
  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return parseFloat(a.node.priceRange.minVariantPrice.amount) - parseFloat(b.node.priceRange.minVariantPrice.amount);
      case 'price-desc':
        return parseFloat(b.node.priceRange.minVariantPrice.amount) - parseFloat(a.node.priceRange.minVariantPrice.amount);
      case 'name-asc':
        return a.node.title.localeCompare(b.node.title);
      default:
        return 0;
    }
  });

  const clearFilters = () => {
    setSelectedShape('All');
    setSelectedLength('All');
    setSortBy('newest');
  };

  const hasActiveFilters = selectedShape !== 'All' || selectedLength !== 'All';

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-sm font-medium tracking-[0.2em] uppercase text-primary mb-3">
              Our Collection
            </p>
            <h1 className="font-display text-4xl sm:text-5xl font-medium mb-4">
              Shop All Sets
            </h1>
            <p className="text-muted-foreground text-lg">
              Explore our curated collection of handcrafted press-on nails, 
              designed for every occasion and style.
            </p>
          </div>

          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-border">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                className="rounded-full"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {hasActiveFilters && (
                  <span className="ml-2 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                    {(selectedShape !== 'All' ? 1 : 0) + (selectedLength !== 'All' ? 1 : 0)}
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
              <span className="text-sm text-muted-foreground">
                {sortedProducts.length} products
              </span>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-sm bg-transparent border border-border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {SORT_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <div className="hidden sm:flex items-center gap-1 border border-border rounded-full p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-full transition-colors ${viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-full transition-colors ${viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                >
                  <LayoutList className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mb-8 p-6 bg-card border border-border rounded-2xl animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Shape Filter */}
                <div className="space-y-3">
                  <label className="text-sm font-medium">Shape</label>
                  <div className="flex flex-wrap gap-2">
                    {SHAPES.map(shape => (
                      <button
                        key={shape}
                        onClick={() => setSelectedShape(shape)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                          selectedShape === shape
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground hover:bg-muted/80'
                        }`}
                      >
                        {shape}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Length Filter */}
                <div className="space-y-3">
                  <label className="text-sm font-medium">Length</label>
                  <div className="flex flex-wrap gap-2">
                    {LENGTHS.map(length => (
                      <button
                        key={length}
                        onClick={() => setSelectedLength(length)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
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
              <p className="text-muted-foreground text-lg mb-4">No products found</p>
              <Link to="/">
                <Button variant="outline" className="rounded-full">
                  Back to Home
                </Button>
              </Link>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {sortedProducts.map((product) => (
                <ProductCard 
                  key={product.node.id} 
                  product={product} 
                  onQuickAdd={() => handleQuickAdd(product)}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {sortedProducts.map((product) => (
                <ProductListItem 
                  key={product.node.id} 
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

const ProductCard = ({ product, onQuickAdd }: { product: ShopifyProduct; onQuickAdd: () => void }) => {
  const image = product.node.images.edges[0]?.node;
  const price = parseFloat(product.node.priceRange.minVariantPrice.amount);
  const isAvailable = product.node.variants.edges[0]?.node.availableForSale;

  return (
    <div className="group">
      <Link to={`/product/${product.node.handle}`}>
        <div className="aspect-square rounded-2xl overflow-hidden bg-muted/30 mb-4 relative">
          {image ? (
            <img
              src={image.url}
              alt={image.altText || product.node.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-muted-foreground text-sm">No image</span>
            </div>
          )}
          
          {!isAvailable && (
            <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
              <span className="bg-foreground text-background px-3 py-1 rounded-full text-sm font-medium">
                Sold Out
              </span>
            </div>
          )}
        </div>
      </Link>
      
      <div className="space-y-2">
        <Link to={`/product/${product.node.handle}`}>
          <h3 className="font-display text-lg font-medium group-hover:text-primary transition-colors line-clamp-1">
            {product.node.title}
          </h3>
        </Link>
        <p className="text-primary font-display text-lg">${price.toFixed(2)}</p>
        
        <Button
          variant="outline"
          size="sm"
          className="w-full rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.preventDefault();
            onQuickAdd();
          }}
          disabled={!isAvailable}
        >
          Quick Add
        </Button>
      </div>
    </div>
  );
};

const ProductListItem = ({ product, onQuickAdd }: { product: ShopifyProduct; onQuickAdd: () => void }) => {
  const image = product.node.images.edges[0]?.node;
  const price = parseFloat(product.node.priceRange.minVariantPrice.amount);
  const isAvailable = product.node.variants.edges[0]?.node.availableForSale;

  return (
    <div className="flex gap-6 p-4 bg-card border border-border rounded-2xl group hover:shadow-lg transition-shadow">
      <Link to={`/product/${product.node.handle}`} className="flex-shrink-0">
        <div className="w-32 h-32 rounded-xl overflow-hidden bg-muted/30">
          {image ? (
            <img
              src={image.url}
              alt={image.altText || product.node.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-muted-foreground text-xs">No image</span>
            </div>
          )}
        </div>
      </Link>
      
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <Link to={`/product/${product.node.handle}`}>
            <h3 className="font-display text-xl font-medium group-hover:text-primary transition-colors">
              {product.node.title}
            </h3>
          </Link>
          <p className="text-muted-foreground text-sm line-clamp-2 mt-1">
            {product.node.description}
          </p>
        </div>
        
        <div className="flex items-center justify-between mt-4">
          <p className="text-primary font-display text-xl">${price.toFixed(2)}</p>
          <Button
            variant="outline"
            className="rounded-full"
            onClick={onQuickAdd}
            disabled={!isAvailable}
          >
            {isAvailable ? 'Add to Bag' : 'Sold Out'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Shop;
