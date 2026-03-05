import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { getProducts, type Product } from "@/lib/products";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const formatCollectionName = (slug: string) =>
  slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

const SearchOverlay = ({ isOpen, onClose }: SearchOverlayProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const navigate = useNavigate();

  const allProducts = getProducts();

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 100);
      return () => clearTimeout(timer);
    } else {
      setQuery("");
      setResults([]);
      setHasSearched(false);
    }
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const handleQueryChange = useCallback((value: string) => {
    setQuery(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (value.trim().length < 2) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    debounceRef.current = setTimeout(() => {
      const products = getProducts();
      const lowerQuery = value.toLowerCase().trim();
      const filtered = products.filter(
        (p) =>
          p.title.toLowerCase().includes(lowerQuery) ||
          (p.collection && p.collection.toLowerCase().includes(lowerQuery)) ||
          p.description.toLowerCase().includes(lowerQuery)
      );
      setResults(filtered.slice(0, 8));
      setHasSearched(true);
    }, 200);
  }, []);

  const handleResultClick = (handle: string) => {
    navigate(`/product/${handle}`);
    onClose();
  };

  const showEmptyState = query.trim().length < 2;
  const showNoResults = hasSearched && results.length === 0 && !showEmptyState;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="fixed left-[50%] top-[8%] sm:top-[12%] translate-x-[-50%] translate-y-0 w-[calc(100%-1.5rem)] max-w-[600px] p-0 border-0 bg-background rounded-2xl shadow-2xl gap-0 data-[state=open]:slide-in-from-top-[2%] data-[state=closed]:slide-out-to-top-[2%] overflow-hidden"
      >
        <DialogTitle className="sr-only">Search products</DialogTitle>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 z-10 h-8 w-8 rounded-full bg-muted/60 backdrop-blur-sm flex items-center justify-center hover:bg-muted transition-colors duration-200"
          aria-label="Close search"
        >
          <X className="h-4 w-4 text-foreground/60" />
        </button>

        {/* Search input */}
        <div className="px-5 pt-5 pb-3 sm:px-6 sm:pt-6">
          <div className="relative">
            <Search className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/30" />
            <input
              ref={inputRef}
              type="text"
              role="searchbox"
              aria-label="Search products"
              placeholder="Search products..."
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              className="w-full h-12 sm:h-14 pl-8 pr-10 text-lg sm:text-xl bg-transparent border-0 border-b border-border/40 focus:border-primary/50 focus:outline-none transition-colors duration-300 font-light placeholder:text-foreground/25 text-foreground"
            />
          </div>
        </div>

        {/* Results / empty state */}
        <div className="max-h-[55vh] overflow-y-auto px-5 pb-5 sm:px-6 sm:pb-6">
          {/* Search results */}
          {!showEmptyState && results.length > 0 && (
            <div className="pt-1" role="listbox" aria-label="Search results">
              {results.map((product) => (
                <button
                  key={product.id}
                  role="option"
                  aria-selected={false}
                  onClick={() => handleResultClick(product.handle)}
                  className="w-full flex items-center gap-3.5 p-3 rounded-xl hover:bg-muted/50 transition-all duration-200 text-left group"
                >
                  <div className="w-11 h-11 rounded-lg overflow-hidden flex-shrink-0 bg-muted/30">
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {product.title}
                    </p>
                    {product.collection && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {formatCollectionName(product.collection)}
                      </p>
                    )}
                  </div>
                  <span className="text-sm font-display text-foreground/60 flex-shrink-0">
                    ${product.price.toFixed(2)}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* No results */}
          {showNoResults && (
            <div className="py-10 text-center">
              <Search className="h-8 w-8 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">
                No products found for "<span className="text-foreground/70">{query}</span>"
              </p>
            </div>
          )}

          {/* Empty state: Popular Sets */}
          {showEmptyState && (
            <div className="pt-2">
              <h3 className="font-display text-base font-medium text-foreground/50 mb-3 tracking-wide">
                Popular Sets
              </h3>
              <div className="grid grid-cols-2 gap-2.5">
                {allProducts.slice(0, 6).map((product) => (
                  <button
                    key={product.id}
                    onClick={() => handleResultClick(product.handle)}
                    className="text-left group rounded-xl overflow-hidden bg-muted/20 hover:bg-muted/40 transition-all duration-200 p-2.5"
                  >
                    <div className="aspect-square rounded-lg overflow-hidden bg-muted/30 mb-2">
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <p className="text-xs font-medium text-foreground truncate">
                      {product.title}
                    </p>
                    <p className="text-xs text-foreground/50 font-display mt-0.5">
                      ${product.price.toFixed(2)}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchOverlay;
