import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Product } from "@/lib/products";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArrowRight, ChevronLeft, ChevronRight, X } from "lucide-react";

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const QuickViewModal = ({ product, isOpen, onClose }: QuickViewModalProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Reset to first image when product changes
  useEffect(() => {
    if (product) {
      setCurrentImageIndex(0);
    }
  }, [product]);

  if (!product) return null;

  const images = product.images.length > 0 ? product.images : [];
  const hasMultipleImages = images.length > 1;
  const currentImage = images[currentImageIndex];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl p-0 rounded-3xl overflow-hidden border-0 bg-background/95 backdrop-blur-xl shadow-2xl">
        <DialogTitle className="sr-only">Quick View: {product.title}</DialogTitle>
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background shadow-lg transition-all duration-300 hover:scale-105"
        >
          <X className="h-5 w-5 text-foreground/70" />
        </button>

        <div className="grid md:grid-cols-[1.2fr,1fr]">
          {/* Image Gallery */}
          <div className="relative bg-muted/10">
            {/* Main Image */}
            <div className="aspect-square relative overflow-hidden">
              {currentImage ? (
                <img
                  src={currentImage}
                  alt={`${product.title} - Image ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover transition-opacity duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted/20">
                  <span className="text-muted-foreground">No image available</span>
                </div>
              )}

              {/* Badge */}
              {product.badge && (
                <div className="absolute top-4 left-4">
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

              {/* Navigation Arrows */}
              {hasMultipleImages && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-background/80 backdrop-blur-sm shadow-lg hover:bg-background hover:scale-105 transition-all duration-300"
                  >
                    <ChevronLeft className="h-5 w-5 text-foreground/70" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-background/80 backdrop-blur-sm shadow-lg hover:bg-background hover:scale-105 transition-all duration-300"
                  >
                    <ChevronRight className="h-5 w-5 text-foreground/70" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Navigation */}
            {hasMultipleImages && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 p-2 bg-background/80 backdrop-blur-sm rounded-full">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`
                      w-12 h-12 rounded-lg overflow-hidden border-2 transition-all duration-300
                      ${currentImageIndex === index 
                        ? 'border-primary shadow-md scale-105' 
                        : 'border-transparent opacity-70 hover:opacity-100'
                      }
                    `}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Dot Indicators (for mobile or when thumbnails would be too small) */}
            {hasMultipleImages && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 md:hidden">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`
                      w-2.5 h-2.5 rounded-full transition-all duration-300
                      ${currentImageIndex === index 
                        ? 'bg-primary w-6' 
                        : 'bg-foreground/30 hover:bg-foreground/50'
                      }
                    `}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="p-8 md:p-10 flex flex-col justify-center">
            <div className="space-y-6">
              {/* Product Title */}
              <div>
                <h2 className="font-display text-3xl md:text-4xl font-medium leading-tight mb-3">
                  {product.title}
                </h2>
                <p className="text-primary font-display text-2xl md:text-3xl">
                  ${product.price.toFixed(2)}
                </p>
              </div>

              {/* Description */}
              <p className="text-muted-foreground text-base leading-relaxed font-light">
                {product.description}
              </p>

              {/* Decorative divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent" />
                <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                <div className="flex-1 h-px bg-gradient-to-l from-border to-transparent" />
              </div>

              {/* View Full Details CTA */}
              <Link
                to={`/product/${product.handle}`}
                onClick={onClose}
                className="block"
              >
                <Button
                  className="w-full rounded-full h-14 text-base font-medium group"
                  size="lg"
                >
                  View Full Details
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuickViewModal;
