import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Product } from "@/lib/products";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Minus, Plus, ShoppingBag, ExternalLink } from "lucide-react";
import { useCartStore, CartItem } from "@/stores/cartStore";
import { toast } from "sonner";

const NAIL_SHAPES = ['Almond', 'Coffin', 'Stiletto', 'Square', 'Oval'];
const NAIL_LENGTHS = ['Short', 'Medium', 'Long', 'Extra Long'];

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const ShapeIcon = ({ shape, isSelected }: { shape: string; isSelected: boolean }) => {
  const baseClass = `w-8 h-12 transition-colors duration-200 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`;
  
  switch (shape) {
    case 'Almond':
      return (
        <svg viewBox="0 0 24 36" className={baseClass} fill="currentColor">
          <path d="M12 2 C6 8, 4 16, 4 24 C4 30, 7 34, 12 34 C17 34, 20 30, 20 24 C20 16, 18 8, 12 2Z" />
        </svg>
      );
    case 'Coffin':
      return (
        <svg viewBox="0 0 24 36" className={baseClass} fill="currentColor">
          <path d="M5 2 L5 26 C5 30, 8 34, 12 34 C16 34, 19 30, 19 26 L19 2 L15 2 L14 8 L10 8 L9 2 Z" />
        </svg>
      );
    case 'Stiletto':
      return (
        <svg viewBox="0 0 24 36" className={baseClass} fill="currentColor">
          <path d="M12 34 C8 34, 5 30, 5 24 L5 2 L19 2 L19 24 C19 30, 16 34, 12 34 L12 2" />
        </svg>
      );
    case 'Square':
      return (
        <svg viewBox="0 0 24 36" className={baseClass} fill="currentColor">
          <path d="M4 2 L4 28 C4 31, 6 34, 12 34 C18 34, 20 31, 20 28 L20 2 Z" />
        </svg>
      );
    case 'Oval':
      return (
        <svg viewBox="0 0 24 36" className={baseClass} fill="currentColor">
          <ellipse cx="12" cy="18" rx="8" ry="16" />
        </svg>
      );
    default:
      return null;
  }
};

const QuickViewModal = ({ product, isOpen, onClose }: QuickViewModalProps) => {
  const [selectedShape, setSelectedShape] = useState('Almond');
  const [selectedLength, setSelectedLength] = useState('Medium');
  const [quantity, setQuantity] = useState(1);
  
  const addItem = useCartStore(state => state.addItem);

  // Reset state when product changes
  useEffect(() => {
    if (product) {
      setSelectedShape('Almond');
      setSelectedLength('Medium');
      setQuantity(1);
    }
  }, [product]);

  if (!product) return null;

  const image = product.images[0];
  const isAvailable = product.variants[0]?.availableForSale;

  const handleAddToBag = () => {
    if (!product || !isAvailable) return;

    const variantId = `${product.id}-${selectedShape.toLowerCase()}-${selectedLength.toLowerCase()}`;

    const cartItem: CartItem = {
      product,
      variantId,
      variantTitle: `${selectedShape} / ${selectedLength}`,
      price: {
        amount: product.price.toString(),
        currencyCode: product.currencyCode,
      },
      quantity,
      selectedOptions: [
        { name: 'Shape', value: selectedShape },
        { name: 'Length', value: selectedLength },
      ],
    };

    addItem(cartItem);
    toast.success(`${product.title} added to bag`, {
      position: "top-center",
    });
    onClose();
  };

  const incrementQuantity = () => setQuantity(q => Math.min(q + 1, 10));
  const decrementQuantity = () => setQuantity(q => Math.max(q - 1, 1));

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl p-0 rounded-2xl overflow-hidden border-border/50 bg-background">
        <DialogTitle className="sr-only">Quick View: {product.title}</DialogTitle>
        <div className="grid md:grid-cols-2">
          {/* Product Image */}
          <div className="aspect-square bg-muted/20 relative">
            {image ? (
              <img
                src={image}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-muted-foreground">No image</span>
              </div>
            )}
            {/* Badge */}
            {product.badge && (
              <div className="absolute top-4 left-4">
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
          </div>

          {/* Product Details */}
          <div className="p-6 md:p-8 flex flex-col">
            <div className="flex-1">
              <h2 className="font-display text-2xl md:text-3xl font-medium mb-2">
                {product.title}
              </h2>
              <p className="text-primary font-display text-2xl mb-6">
                ${product.price.toFixed(2)}
              </p>

              {/* Shape Selector */}
              <div className="mb-6">
                <label className="text-sm font-medium tracking-wide uppercase text-muted-foreground block mb-3">
                  Shape
                </label>
                <div className="flex gap-2 flex-wrap">
                  {NAIL_SHAPES.map((shape) => (
                    <button
                      key={shape}
                      onClick={() => setSelectedShape(shape)}
                      className={`
                        flex flex-col items-center gap-1 p-2 rounded-xl border transition-all duration-300
                        ${selectedShape === shape
                          ? 'border-primary bg-primary/5 shadow-sm'
                          : 'border-border/70 hover:border-primary/50'
                        }
                      `}
                    >
                      <ShapeIcon shape={shape} isSelected={selectedShape === shape} />
                      <span className={`text-xs font-medium ${selectedShape === shape ? 'text-primary' : 'text-muted-foreground'}`}>
                        {shape}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Length Selector */}
              <div className="mb-6">
                <label className="text-sm font-medium tracking-wide uppercase text-muted-foreground block mb-3">
                  Length
                </label>
                <div className="flex gap-2 flex-wrap">
                  {NAIL_LENGTHS.map((length) => (
                    <button
                      key={length}
                      onClick={() => setSelectedLength(length)}
                      className={`
                        px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border
                        ${selectedLength === length
                          ? 'bg-primary text-primary-foreground border-primary shadow-md'
                          : 'bg-background border-border/70 text-foreground/70 hover:border-primary/50 hover:text-foreground'
                        }
                      `}
                    >
                      {length}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Picker */}
              <div className="mb-6">
                <label className="text-sm font-medium tracking-wide uppercase text-muted-foreground block mb-3">
                  Quantity
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                    className="w-10 h-10 rounded-full border border-border/70 flex items-center justify-center hover:border-primary/50 hover:bg-primary/5 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="font-medium text-lg w-8 text-center">{quantity}</span>
                  <button
                    onClick={incrementQuantity}
                    disabled={quantity >= 10}
                    className="w-10 h-10 rounded-full border border-border/70 flex items-center justify-center hover:border-primary/50 hover:bg-primary/5 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-4 border-t border-border/50">
              <Button
                onClick={handleAddToBag}
                disabled={!isAvailable}
                className="w-full rounded-full h-12 text-base font-medium"
              >
                <ShoppingBag className="h-5 w-5 mr-2" />
                {isAvailable ? 'Add to Bag' : 'Sold Out'}
              </Button>
              <Link
                to={`/product/${product.handle}`}
                onClick={onClose}
                className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
              >
                View Full Details
                <ExternalLink className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuickViewModal;
