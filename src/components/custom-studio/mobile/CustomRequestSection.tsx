import { useState, useRef, useEffect } from 'react';
import { useCustomStudioStore } from '@/stores/customStudioStore';
import { FingerIndex } from '@/lib/pricing';
import { Upload, X, ImageIcon, ChevronDown, ChevronUp } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import ArtworkNailPicker from './ArtworkNailPicker';

const CustomRequestSection = () => {
  const { customArtwork, setCustomArtwork } = useCustomStudioStore();
  const [customEnabled, setCustomEnabled] = useState(!!customArtwork);
  const [isNailPickerExpanded, setIsNailPickerExpanded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const objectUrlsRef = useRef<Set<string>>(new Set());

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      objectUrlsRef.current.forEach(url => {
        URL.revokeObjectURL(url);
      });
    };
  }, []);

  const handleCustomToggle = (enabled: boolean) => {
    setCustomEnabled(enabled);
    if (!enabled) {
      customArtwork?.inspirationImages.forEach(url => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
          objectUrlsRef.current.delete(url);
        }
      });
      setCustomArtwork(null);
    } else if (!customArtwork) {
      setCustomArtwork({
        description: '',
        inspirationImages: [],
        nails: new Set<FingerIndex>()
      });
    }
  };

  const handleDescriptionChange = (description: string) => {
    setCustomArtwork({
      description,
      inspirationImages: customArtwork?.inspirationImages || [],
      nails: customArtwork?.nails || new Set<FingerIndex>()
    });
  };

  const handleToggleNail = (index: FingerIndex) => {
    const currentNails = customArtwork?.nails || new Set<FingerIndex>();
    const newNails = new Set(currentNails);
    if (newNails.has(index)) {
      newNails.delete(index);
    } else {
      newNails.add(index);
    }
    setCustomArtwork({
      description: customArtwork?.description || '',
      inspirationImages: customArtwork?.inspirationImages || [],
      nails: newNails
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newUrls: string[] = [];
    Array.from(files).forEach(file => {
      const objectUrl = URL.createObjectURL(file);
      objectUrlsRef.current.add(objectUrl);
      newUrls.push(objectUrl);
    });

    setCustomArtwork({
      description: customArtwork?.description || '',
      inspirationImages: [...(customArtwork?.inspirationImages || []), ...newUrls],
      nails: customArtwork?.nails || new Set<FingerIndex>()
    });
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (index: number) => {
    const imageUrl = customArtwork?.inspirationImages?.[index];
    if (imageUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(imageUrl);
      objectUrlsRef.current.delete(imageUrl);
    }
    
    const newImages = [...(customArtwork?.inspirationImages || [])];
    newImages.splice(index, 1);
    setCustomArtwork({
      description: customArtwork?.description || '',
      inspirationImages: newImages,
      nails: customArtwork?.nails || new Set<FingerIndex>()
    });
  };

  const selectedNailCount = customArtwork?.nails?.size || 0;

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <span>✨</span> Custom Artwork
        </h3>
        <p className="text-sm text-muted-foreground">
          Request a unique design
        </p>
      </div>

      {/* Toggle */}
      <div className="flex items-center justify-between bg-muted/50 rounded-xl p-4">
        <span className="text-sm font-medium text-foreground">Request custom artwork</span>
        <Switch 
          checked={customEnabled} 
          onCheckedChange={handleCustomToggle}
        />
      </div>

      {/* Custom Request Form */}
      {customEnabled && (
        <div className="space-y-5 pt-2">
          {/* Image Upload */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">
              Inspiration Images
            </label>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {/* Upload Button - Large touch target */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="shrink-0 w-16 h-16 rounded-xl border-2 border-dashed border-border hover:border-primary/50 flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-primary transition-colors"
              >
                <Upload className="w-6 h-6" />
                <span className="text-[10px]">Add</span>
              </button>
              
              {/* Image Thumbnails */}
              {customArtwork?.inspirationImages?.map((img, index) => (
                <div key={index} className="relative shrink-0 w-16 h-16 rounded-xl overflow-hidden border border-border">
                  <img src={img} alt={`Inspiration ${index + 1}`} className="w-full h-full object-cover" />
                  <button
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-1 right-1 p-1.5 bg-destructive text-destructive-foreground rounded-full"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">
              Describe Your Design
            </label>
            <Textarea
              value={customArtwork?.description || ''}
              onChange={(e) => handleDescriptionChange(e.target.value)}
              placeholder="Tell us about your idea... Include colors, style, theme, or any specific details."
              className="min-h-[100px] resize-none text-base"
            />
          </div>

          {/* Nail Selector */}
          <div className="space-y-3">
            <button
              onClick={() => setIsNailPickerExpanded(!isNailPickerExpanded)}
              className={cn(
                "w-full flex items-center justify-between p-4 rounded-xl transition-colors",
                isNailPickerExpanded ? "bg-primary/10" : "bg-muted/50"
              )}
            >
              <span className="text-sm font-medium text-foreground">
                {selectedNailCount > 0 
                  ? `${selectedNailCount} nail${selectedNailCount > 1 ? 's' : ''} selected`
                  : 'Select nails for custom art'
                }
              </span>
              {isNailPickerExpanded ? (
                <ChevronUp className="w-5 h-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-5 h-5 text-muted-foreground" />
              )}
            </button>

            {isNailPickerExpanded && (
              <div className="pt-2">
                <ArtworkNailPicker
                  selectedNails={customArtwork?.nails || new Set<FingerIndex>()}
                  onToggleNail={handleToggleNail}
                />
              </div>
            )}
          </div>

          {/* Price TBD Notice */}
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-start gap-3">
            <ImageIcon className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-amber-700 dark:text-amber-400 text-sm">
                Price TBD — Artist will quote
              </p>
              <p className="text-xs text-amber-600/80 dark:text-amber-400/80 mt-1">
                Custom artwork pricing depends on complexity. Our artist will provide a personalized quote.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomRequestSection;
