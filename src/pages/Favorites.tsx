import { useState, useRef } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Heart, Eye, X, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { useFavoritesStore } from "@/stores/favoritesStore";
import { toast } from "sonner";
import { getProducts, type Product } from "@/lib/products";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import QuickViewModal from "@/components/QuickViewModal";

const SORT_OPTIONS = [
  { value: "recent", label: "Recently Added" },
  { value: "price-asc", label: "Price: Low → High" },
  { value: "price-desc", label: "Price: High → Low" },
  { value: "name-asc", label: "Name: A → Z" },
];

const Favorites = () => {
  const { items: favorites, addFavorite, removeFavorite, clearFavorites } = useFavoritesStore();
  const [sortBy, setSortBy] = useState("recent");
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const removingProductRef = useRef<Product | null>(null);

  // Sort favorites
  const sortedFavorites = [...favorites].sort((a, b) => {
    switch (sortBy) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "name-asc":
        return a.title.localeCompare(b.title);
      case "recent":
      default:
        return 0; // preserve store order (newest appended last → reversed below)
    }
  });
  // "Recently Added" shows newest first
  if (sortBy === "recent") sortedFavorites.reverse();

  // Suggested products for empty state
  const suggestedProducts = (() => {
    const all = getProducts();
    const badged = all.filter(p => p.badge === "Bestseller" || p.badge === "New");
    if (badged.length >= 4) return badged.slice(0, 4);
    const rest = all.filter(p => !badged.some(b => b.id === p.id));
    return [...badged, ...rest].slice(0, 4);
  })();

  const handleRemove = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    removingProductRef.current = product;
    setRemovingId(product.id);
    setTimeout(() => {
      removeFavorite(product.id);
      setRemovingId(null);
      toast.success(`Removed from favorites`, {
        position: "top-center",
        action: {
          label: "Undo",
          onClick: () => {
            if (removingProductRef.current) {
              addFavorite(removingProductRef.current);
            }
          },
        },
      });
    }, 300);
  };

  const handleClearAll = () => {
    clearFavorites();
    setShowClearDialog(false);
    toast.success("All favorites cleared", { position: "top-center" });
  };

  const handleQuickView = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickViewProduct(product);
  };

  // Shared card used for both favorites grid and empty-state suggestions
  const FavoriteCard = ({ product, isFavorited = true }: { product: Product; isFavorited?: boolean }) => {
    const image = product.images?.[0];
    const isRemoving = removingId === product.id;

    const handleHeartClick = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (isFavorited) {
        handleRemove(product, e);
      } else {
        addFavorite(product);
        toast.success("Added to favorites", { position: "top-center" });
      }
    };

    return (
      <div
        className={`group transition-all duration-300 ${isRemoving ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}
      >
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
                  <ShoppingBag className="h-10 w-10 text-muted-foreground/40" />
                </div>
              )}

              {/* Badge */}
              {product.badge && (
                <div className="absolute top-3 left-3 z-10">
                  <span
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase ${
                      product.badge === "New"
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "bg-foreground/90 text-background shadow-md"
                    }`}
                  >
                    {product.badge}
                  </span>
                </div>
              )}

              {/* Quick View overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-400 flex items-center justify-center">
                <Button
                  variant="secondary"
                  size="sm"
                  className="rounded-full shadow-xl bg-background hover:bg-background border-0 px-6 py-2.5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0"
                  onClick={(e) => handleQuickView(product, e)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Quick View
                </Button>
              </div>
            </div>
          </Link>

          {/* Heart button */}
          <button
            onClick={handleHeartClick}
            className="absolute top-3 right-3 p-2.5 rounded-full bg-background/90 backdrop-blur-sm shadow-md hover:bg-background hover:shadow-lg transition-all duration-300 z-20 hover:scale-110"
          >
            <Heart
              className={`h-4 w-4 transition-all duration-300 ${
                isFavorited
                  ? "fill-primary text-primary scale-110"
                  : "text-foreground/50 hover:text-foreground/70"
              }`}
            />
          </button>
        </div>

        {/* Product info */}
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

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 sm:pt-28">
        {/* ─── Compact Header / Toolbar ─── */}
        <div className="animate-fade-in">
          {/* Mobile: stacked */}
          <div className="sm:hidden pb-5 border-b border-border/30">
            <h1 className="font-display text-2xl text-foreground">
              My Favorites
              {favorites.length > 0 && (
                <span className="text-base font-light text-muted-foreground ml-2">
                  ({favorites.length})
                </span>
              )}
            </h1>
            {favorites.length > 0 && (
              <div className="flex items-center gap-3 mt-3">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="h-9 w-auto min-w-[160px] rounded-full border-border/40 text-sm bg-transparent">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SORT_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <button
                  onClick={() => setShowClearDialog(true)}
                  className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors ml-auto"
                >
                  <X className="h-3.5 w-3.5" />
                  Clear all
                </button>
              </div>
            )}
          </div>

          {/* Desktop: single row */}
          <div className="hidden sm:flex items-center justify-between pb-5 border-b border-border/30">
            <h1 className="font-display text-2xl sm:text-3xl text-foreground">
              My Favorites
            </h1>
            {favorites.length > 0 && (
              <div className="flex items-center gap-5">
                <span className="text-sm text-muted-foreground font-light tracking-wide">
                  {favorites.length} saved {favorites.length === 1 ? "set" : "sets"}
                </span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="h-9 w-auto min-w-[180px] rounded-full border-border/40 text-sm bg-transparent">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SORT_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <button
                  onClick={() => setShowClearDialog(true)}
                  className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                  Clear all
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ─── Content ─── */}
        {favorites.length === 0 ? (
          /* ═══ EMPTY STATE ═══ */
          <div className="animate-fade-in">
            {/* Part A: Inspirational message */}
            <div className="text-center pt-16 pb-10">
              <Heart className="w-10 h-10 text-primary/30 mx-auto mb-4" strokeWidth={1.5} />
              <h2 className="font-display text-xl sm:text-2xl text-foreground mb-2">
                Your collection starts here
              </h2>
              <p className="text-muted-foreground text-sm max-w-md mx-auto mb-6">
                Tap the heart on any set you love and it'll appear right here.
              </p>
              <Link to="/shop">
                <Button variant="outline" className="rounded-full px-8 border-border/50 hover:border-primary/40 hover:text-primary transition-all duration-300">
                  Browse All Sets
                </Button>
              </Link>
            </div>

            {/* Part B: Popular right now */}
            {suggestedProducts.length > 0 && (
              <div className="pb-24">
                <div className="flex items-center gap-4 mb-8">
                  <div className="flex-1 h-px bg-border/30" />
                  <span className="text-[10px] sm:text-xs tracking-[0.2em] uppercase text-muted-foreground/60 font-medium whitespace-nowrap">
                    Popular Right Now
                  </span>
                  <div className="flex-1 h-px bg-border/30" />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                  {suggestedProducts.map((product) => {
                    const isFav = favorites.some(f => f.id === product.id);
                    return (
                      <FavoriteCard
                        key={product.id}
                        product={product}
                        isFavorited={isFav}
                      />
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* ═══ FAVORITES GRID ═══ */
          <div className="pt-8 pb-24 animate-fade-in">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {sortedFavorites.map((product) => (
                <FavoriteCard key={product.id} product={product} isFavorited />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Clear All Confirmation Dialog */}
      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear all favorites?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove {favorites.length > 1 ? `all ${favorites.length} saved sets` : "your saved set"} from
              your favorites. This can't be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full">Keep them</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleClearAll}
              className="rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Clear all
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
};

export default Favorites;
