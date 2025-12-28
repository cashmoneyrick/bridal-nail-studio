import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, Plus, ShoppingBag } from "lucide-react";
import { useCartStore, CartItem } from "@/stores/cartStore";
import { Product } from "@/lib/products";

interface AddToCartSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  addedItem: {
    product: Product;
    shape: string;
    length: string;
    sizingOption: 'kit' | 'known';
    sizeProfileId?: string;
  } | null;
  relatedProducts: Product[];
}

const AddToCartSuccessModal = ({
  isOpen,
  onClose,
  addedItem,
  relatedProducts,
}: AddToCartSuccessModalProps) => {
  const [addedProductIds, setAddedProductIds] = useState<string[]>([]);
  const [openPopoverId, setOpenPopoverId] = useState<string | null>(null);

  const navigate = useNavigate();
  const addItem = useCartStore(state => state.addItem);
  const openDrawer = useCartStore(state => state.openDrawer);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setAddedProductIds([]);
      setOpenPopoverId(null);
    }
  }, [isOpen]);

  const handleQuickAdd = (product: Product) => {
    if (!addedItem) return;

    const cartItem: CartItem = {
      product: product,
      variantId: `${product.id}-${addedItem.shape.toLowerCase()}-${addedItem.length.toLowerCase()}`,
      variantTitle: `${addedItem.shape} / ${addedItem.length}`,
      price: {
        amount: product.price.toString(),
        currencyCode: product.currencyCode,
      },
      quantity: 1,
      selectedOptions: [
        { name: 'Shape', value: addedItem.shape },
        { name: 'Length', value: addedItem.length },
      ],
      needsSizingKit: false,
      sizeProfileId: addedItem.sizeProfileId,
    };

    addItem(cartItem);
    setAddedProductIds(prev => [...prev, product.id]);
    setOpenPopoverId(null);
  };

  const handleNewConfig = (product: Product) => {
    setOpenPopoverId(null);
    onClose();
    navigate(`/product/${product.handle}`);
  };

  const handleViewBag = () => {
    onClose();
    openDrawer();
  };

  if (!addedItem) return null;

  const displayProducts = relatedProducts.slice(0, 6);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl p-6 rounded-2xl border-0 bg-background/95 backdrop-blur-xl shadow-2xl">
        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
            <Check className="h-7 w-7 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="font-display text-2xl font-medium mb-1">Added to Bag</h2>
          <p className="text-muted-foreground">
            {addedItem.product.title} · {addedItem.shape} · {addedItem.length}
          </p>
        </div>

        {/* Upsell Section */}
        {displayProducts.length > 0 && (
          <div>
            <div className="mb-4">
              <h3 className="font-display text-lg font-medium">Complete Your Look</h3>
              <p className="text-sm text-muted-foreground">
                These sets pair beautifully with your selection
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {displayProducts.map((product) => {
                const isAdded = addedProductIds.includes(product.id);

                return (
                  <div
                    key={product.id}
                    className="group relative rounded-xl overflow-hidden bg-muted/20 hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
                  >
                    <div className="aspect-square">
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-2 space-y-1">
                      <h4 className="text-sm font-medium truncate">{product.title}</h4>
                      <p className="text-sm text-primary">${product.price.toFixed(2)}</p>

                      {isAdded ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled
                          className="w-full text-muted-foreground"
                        >
                          <Check className="h-3 w-3 mr-1" />
                          Added
                        </Button>
                      ) : (
                        <Popover
                          open={openPopoverId === product.id}
                          onOpenChange={(open) => setOpenPopoverId(open ? product.id : null)}
                        >
                          <PopoverTrigger asChild>
                            <Button variant="outline" size="sm" className="w-full">
                              <Plus className="h-3 w-3 mr-1" />
                              Add
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-48 p-2" align="center">
                            <div className="flex flex-col gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="justify-start text-sm"
                                onClick={() => handleQuickAdd(product)}
                              >
                                Same shape & length
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="justify-start text-sm"
                                onClick={() => handleNewConfig(product)}
                              >
                                New configuration
                              </Button>
                            </div>
                          </PopoverContent>
                        </Popover>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer Buttons */}
        <div className="flex gap-3 mt-6">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Continue Shopping
          </Button>
          <Button className="flex-1" onClick={handleViewBag}>
            <ShoppingBag className="h-4 w-4 mr-2" />
            View Bag
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddToCartSuccessModal;
