import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CartItem, useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";

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

interface CartItemEditModalProps {
  item: CartItem | null;
  isOpen: boolean;
  onClose: () => void;
}

const CartItemEditModal = ({ item, isOpen, onClose }: CartItemEditModalProps) => {
  const { updateItem } = useCartStore();
  const [selectedShape, setSelectedShape] = useState('');
  const [selectedLength, setSelectedLength] = useState('');

  // Initialize from item's current selections when opened
  useEffect(() => {
    if (item) {
      const shapeOpt = item.selectedOptions.find(o => o.name === 'Shape');
      const lengthOpt = item.selectedOptions.find(o => o.name === 'Length');
      setSelectedShape(shapeOpt?.value || 'Almond');
      setSelectedLength(lengthOpt?.value || 'Short');
    }
  }, [item]);

  if (!item) return null;

  const currentShape = item.selectedOptions.find(o => o.name === 'Shape')?.value;
  const currentLength = item.selectedOptions.find(o => o.name === 'Length')?.value;
  const hasChanges = selectedShape !== currentShape || selectedLength !== currentLength;

  const handleSave = () => {
    // Build new variantId — keep the sizing suffix from the original
    const parts = item.variantId.split('-');
    // Format: {productId}-{shape}-{length}-{sizingSuffix...}
    // Find where shape starts by matching the current shape in the ID
    const sizingSuffix = item.needsSizingKit ? 'kit' :
      item.sizeProfileId ? `known-${item.sizeProfileId}` : 'kit';

    const newVariantId = `${item.product.id}-${selectedShape.toLowerCase()}-${selectedLength.toLowerCase().replace(' ', '-')}-${sizingSuffix}`;
    const newVariantTitle = `${selectedShape} / ${selectedLength}`;
    const newSelectedOptions = item.selectedOptions.map(opt => {
      if (opt.name === 'Shape') return { ...opt, value: selectedShape };
      if (opt.name === 'Length') return { ...opt, value: selectedLength };
      return opt;
    });

    updateItem(item.variantId, {
      variantId: newVariantId,
      variantTitle: newVariantTitle,
      selectedOptions: newSelectedOptions,
    });

    toast.success(`Updated to ${selectedShape} / ${selectedLength}`);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-lg">Edit Selection</DialogTitle>
        </DialogHeader>

        {/* Product context */}
        <div className="flex items-center gap-3 pb-4 border-b border-border/50">
          <div className="w-14 h-14 rounded-lg overflow-hidden bg-muted flex-shrink-0">
            {item.product.images[0] && (
              <img
                src={item.product.images[0]}
                alt={item.product.title}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div>
            <p className="font-medium text-sm text-foreground">{item.product.title}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Currently: {currentShape} · {currentLength}
            </p>
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

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button
            variant="outline"
            className="flex-1 rounded-full"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            className="flex-1 rounded-full"
            onClick={handleSave}
            disabled={!hasChanges}
          >
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CartItemEditModal;
