import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Product } from "@/lib/products";
import { useCartStore, CartItem } from "@/stores/cartStore";
import { useFavoritesStore } from "@/stores/favoritesStore";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Heart,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { toast } from "sonner";

// --- Inline sub-components ---

const NAIL_SHAPES = ['Almond', 'Coffin', 'Stiletto', 'Square', 'Oval'];
const NAIL_LENGTHS = ['Short', 'Medium', 'Long', 'Extra Long'];

const ShapeIcon = ({ shape, selected }: { shape: string; selected: boolean }) => {
  const baseClass = `w-full h-8 transition-colors ${selected ? 'text-primary' : 'text-muted-foreground'}`;

  switch (shape.toLowerCase()) {
    case 'almond':
      return (
        <svg viewBox="0 0 24 40" className={baseClass}>
          <path d="M12 2C8 2 4 8 4 20C4 32 8 38 12 38C16 38 20 32 20 20C20 8 16 2 12 2Z"
            fill={selected ? 'hsl(var(--primary))' : 'hsl(var(--muted))'}
            stroke={selected ? 'hsl(var(--primary))' : 'hsl(var(--border))'}
            strokeWidth="1.5" />
        </svg>
      );
    case 'coffin':
      return (
        <svg viewBox="0 0 24 40" className={baseClass}>
          <path d="M6 38L4 8C4 4 8 2 12 2C16 2 20 4 20 8L18 38H6Z"
            fill={selected ? 'hsl(var(--primary))' : 'hsl(var(--muted))'}
            stroke={selected ? 'hsl(var(--primary))' : 'hsl(var(--border))'}
            strokeWidth="1.5" />
        </svg>
      );
    case 'stiletto':
      return (
        <svg viewBox="0 0 24 40" className={baseClass}>
          <path d="M12 2L4 38H20L12 2Z"
            fill={selected ? 'hsl(var(--primary))' : 'hsl(var(--muted))'}
            stroke={selected ? 'hsl(var(--primary))' : 'hsl(var(--border))'}
            strokeWidth="1.5" />
        </svg>
      );
    case 'square':
      return (
        <svg viewBox="0 0 24 40" className={baseClass}>
          <path d="M4 8C4 4 8 2 12 2C16 2 20 4 20 8V38H4V8Z"
            fill={selected ? 'hsl(var(--primary))' : 'hsl(var(--muted))'}
            stroke={selected ? 'hsl(var(--primary))' : 'hsl(var(--border))'}
            strokeWidth="1.5" />
        </svg>
      );
    case 'oval':
      return (
        <svg viewBox="0 0 24 40" className={baseClass}>
          <ellipse cx="12" cy="20" rx="8" ry="18"
            fill={selected ? 'hsl(var(--primary))' : 'hsl(var(--muted))'}
            stroke={selected ? 'hsl(var(--primary))' : 'hsl(var(--border))'}
            strokeWidth="1.5" />
        </svg>
      );
    default:
      return null;
  }
};

const StarRating = () => (
  <div className="flex items-center gap-1.5">
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg key={star} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
    <span className="text-xs text-muted-foreground">47 reviews</span>
  </div>
);

const BENEFITS = [
  {
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    label: "10-min apply",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
    label: "2 weeks wear",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    label: "Salon-quality",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 19l7-7 3 3-7 7-3-3z" />
        <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
        <path d="M2 2l7.586 7.586" />
        <circle cx="11" cy="11" r="2" />
      </svg>
    ),
    label: "Hand-painted",
  },
  {
    icon: <Truck className="w-4 h-4 shrink-0" />,
    label: "Free Shipping",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12a9 9 0 0 1-9 9m9-9a9 9 0 0 0-9-9m9 9H3m9 9a9 9 0 0 1-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 0 1 9-9" />
      </svg>
    ),
    label: "Reusable",
  },
];

// --- Main component ---

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const QuickViewModal = ({ product, isOpen, onClose }: QuickViewModalProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedShape, setSelectedShape] = useState('Almond');
  const [selectedLength, setSelectedLength] = useState('Medium');

  const { addItem, hasSizingKitInCart } = useCartStore();
  const { toggleFavorite, isFavorite } = useFavoritesStore();

  // Reset state when product changes
  useEffect(() => {
    if (product) {
      setCurrentImageIndex(0);
      setSelectedShape('Almond');
      setSelectedLength('Medium');
    }
  }, [product]);

  if (!product) return null;

  const images = product.images.length > 0 ? product.images : [];
  const hasMultipleImages = images.length > 1;
  const currentImage = images[currentImageIndex];
  const favorited = isFavorite(product.id);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleAddToCart = () => {
    const variant = product.variants[0];
    if (!variant) return;

    const needsSizingKit = !hasSizingKitInCart();
    const variantId = `${product.id}-${selectedShape.toLowerCase()}-${selectedLength.toLowerCase()}-kit`;

    const cartItem: CartItem = {
      product,
      variantId,
      variantTitle: `${selectedShape} / ${selectedLength}`,
      price: {
        amount: variant.price.toString(),
        currencyCode: variant.currencyCode,
      },
      quantity: 1,
      selectedOptions: [
        { name: 'Shape', value: selectedShape },
        { name: 'Length', value: selectedLength },
      ],
      needsSizingKit,
      sizingOption: 'kit',
    };

    addItem(cartItem);
    toast.success(`${product.title} added to bag`, { position: "top-center" });
    onClose();
  };

  const handleToggleFavorite = () => {
    toggleFavorite(product);
    toast.success(
      favorited ? 'Removed from favorites' : 'Added to favorites',
      { position: "top-center" }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-5xl p-0 rounded-2xl overflow-y-auto overflow-x-hidden max-h-[90vh] border border-border/20 bg-background shadow-2xl">
        <DialogTitle className="sr-only">Quick View: {product.title}</DialogTitle>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-50 p-2.5 rounded-full bg-background/90 backdrop-blur-sm border border-border/30 hover:bg-muted transition-all duration-200"
        >
          <X className="h-4 w-4 text-foreground/60 hover:text-foreground transition-colors" />
        </button>

        <div className="grid md:grid-cols-[1.15fr,1fr]">
          {/* ──────────── LEFT: Image Gallery ──────────── */}
          <div className="relative bg-muted/30">
            <div className="aspect-[4/5] md:aspect-square relative overflow-hidden">
              {currentImage ? (
                <img
                  src={currentImage}
                  alt={`${product.title} - Image ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted/20">
                  <span className="text-muted-foreground text-sm">No image</span>
                </div>
              )}

              {/* Badge */}
              {product.badge && (
                <span className={`
                  absolute top-4 left-4 px-3 py-1.5 rounded-full text-[10px] font-semibold tracking-widest uppercase
                  ${product.badge === 'New'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-foreground/90 text-background'
                  }
                `}>
                  {product.badge}
                </span>
              )}

              {/* Navigation arrows */}
              {hasMultipleImages && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 backdrop-blur-sm border border-border/20 shadow-sm hover:bg-background hover:scale-105 transition-all duration-200"
                  >
                    <ChevronLeft className="h-4 w-4 text-foreground/60" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 backdrop-blur-sm border border-border/20 shadow-sm hover:bg-background hover:scale-105 transition-all duration-200"
                  >
                    <ChevronRight className="h-4 w-4 text-foreground/60" />
                  </button>
                </>
              )}
            </div>

            {/* Desktop thumbnails */}
            {hasMultipleImages && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 hidden md:flex gap-1.5 p-1.5 bg-background/80 backdrop-blur-sm rounded-full border border-border/20">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-10 h-10 rounded-md overflow-hidden border-2 transition-all duration-200 ${
                      currentImageIndex === index
                        ? 'border-primary shadow-sm scale-105'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Mobile dots */}
            {hasMultipleImages && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 md:hidden">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`h-2 rounded-full transition-all duration-200 ${
                      currentImageIndex === index
                        ? 'bg-primary w-5'
                        : 'bg-foreground/20 w-2'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* ──────────── RIGHT: Product Info ──────────── */}
          <div className="p-5 md:p-7 flex flex-col gap-4 overflow-y-auto max-h-[70vh] md:max-h-[85vh]">
            {/* Title row + heart */}
            <div>
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-display text-2xl md:text-3xl font-medium tracking-tight leading-tight text-foreground">
                  {product.title}
                </h2>
                <button
                  onClick={handleToggleFavorite}
                  className="shrink-0 mt-1 p-2 rounded-full hover:bg-muted/50 transition-colors"
                  aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <Heart
                    className={`h-5 w-5 transition-colors duration-200 ${
                      favorited ? 'fill-primary text-primary' : 'text-foreground/30 hover:text-foreground/50'
                    }`}
                  />
                </button>
              </div>

              {/* Price */}
              <p className="font-display text-xl text-primary/80 mt-1">
                ${product.price.toFixed(2)}
              </p>

              {/* Stars */}
              <div className="mt-2">
                <StarRating />
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
              {product.description}
            </p>

            {/* Benefits strip */}
            <div className="bg-muted/30 rounded-xl p-3">
              <div className="grid grid-cols-3 gap-x-4 gap-y-2.5">
                {BENEFITS.map((benefit, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-muted-foreground">
                    {benefit.icon}
                    <span className="text-[11px] leading-tight">{benefit.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Shape selector */}
            <div>
              <p className="text-xs font-medium tracking-wider uppercase text-muted-foreground mb-2">
                Shape <span className="normal-case tracking-normal font-normal ml-1">{selectedShape}</span>
              </p>
              <div className="flex gap-1.5">
                {NAIL_SHAPES.map((shape) => {
                  const isSelected = selectedShape === shape;
                  return (
                    <button
                      key={shape}
                      onClick={() => setSelectedShape(shape)}
                      className={`flex flex-col items-center gap-0.5 p-2 rounded-lg border-2 transition-all duration-200 flex-1 ${
                        isSelected
                          ? 'border-primary bg-primary/5 shadow-sm'
                          : 'border-border/40 hover:border-primary/30'
                      }`}
                    >
                      <ShapeIcon shape={shape} selected={isSelected} />
                      <span className={`text-[10px] leading-none ${
                        isSelected ? 'text-primary font-medium' : 'text-muted-foreground'
                      }`}>
                        {shape}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Length selector */}
            <div>
              <p className="text-xs font-medium tracking-wider uppercase text-muted-foreground mb-2">
                Length <span className="normal-case tracking-normal font-normal ml-1">{selectedLength}</span>
              </p>
              <div className="flex bg-muted/30 rounded-lg p-1">
                {NAIL_LENGTHS.map((length) => {
                  const isSelected = selectedLength === length;
                  return (
                    <button
                      key={length}
                      onClick={() => setSelectedLength(length)}
                      className={`flex-1 px-2 py-2 rounded-md text-xs font-medium transition-all duration-200 ${
                        isSelected
                          ? 'bg-background text-foreground shadow-sm'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {length}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Add to Bag CTA */}
            <div className="pt-1">
              <Button
                onClick={handleAddToCart}
                className="w-full rounded-full h-12 text-[15px] font-medium tracking-wide shadow-md shadow-primary/20 gap-2"
                size="lg"
              >
                <ShoppingBag className="h-4 w-4" />
                Add to Bag — ${product.price.toFixed(2)}
              </Button>
            </div>

            {/* View Full Details link */}
            <div className="text-center">
              <Link
                to={`/product/${product.handle}`}
                onClick={onClose}
                className="text-xs text-muted-foreground underline underline-offset-4 decoration-border hover:text-foreground hover:decoration-foreground/40 transition-colors"
              >
                View Full Details
              </Link>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuickViewModal;
