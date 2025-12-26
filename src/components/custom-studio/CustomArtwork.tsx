import { useState, useRef } from 'react';
import { useCustomStudioStore } from '@/stores/customStudioStore';
import { NailArtType, FingerIndex, NAIL_ART_PRICES, NAIL_ART_LABELS, FINGER_NAMES, LEFT_HAND, RIGHT_HAND } from '@/lib/pricing';
import { Palette, Upload, Sparkles, Flower2, PenTool, PartyPopper, X, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

const DESIGN_OPTIONS: { type: NailArtType; icon: React.ElementType; description: string }[] = [
  { type: 'simple-lines', icon: PenTool, description: 'Minimalist geometric patterns, dots, and clean lines' },
  { type: 'florals', icon: Flower2, description: 'Delicate hand-painted flowers and botanical designs' },
  { type: 'abstract', icon: Palette, description: 'Modern abstract art with unique color combinations' },
  { type: 'themed-set', icon: PartyPopper, description: 'Holiday, seasonal, or event themes applied to all nails' },
];

const NailSelector = ({ 
  selectedNails, 
  onToggleNail,
  disabled = false 
}: { 
  selectedNails: Set<FingerIndex>; 
  onToggleNail: (index: FingerIndex) => void;
  disabled?: boolean;
}) => {
  return (
    <div className="space-y-4">
      {/* Left Hand */}
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground font-medium">Left Hand</p>
        <div className="flex gap-2">
          {LEFT_HAND.map((fingerIndex) => (
            <button
              key={fingerIndex}
              onClick={() => !disabled && onToggleNail(fingerIndex)}
              disabled={disabled}
              className={cn(
                "flex-1 h-12 rounded-lg border-2 transition-all text-xs font-medium",
                selectedNails.has(fingerIndex)
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-background hover:border-primary/50 text-muted-foreground",
                disabled && "opacity-50 cursor-not-allowed"
              )}
            >
              {FINGER_NAMES[fingerIndex].slice(0, 1)}
            </button>
          ))}
        </div>
      </div>
      
      {/* Right Hand */}
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground font-medium">Right Hand</p>
        <div className="flex gap-2">
          {RIGHT_HAND.map((fingerIndex) => (
            <button
              key={fingerIndex}
              onClick={() => !disabled && onToggleNail(fingerIndex)}
              disabled={disabled}
              className={cn(
                "flex-1 h-12 rounded-lg border-2 transition-all text-xs font-medium",
                selectedNails.has(fingerIndex)
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-background hover:border-primary/50 text-muted-foreground",
                disabled && "opacity-50 cursor-not-allowed"
              )}
            >
              {FINGER_NAMES[fingerIndex].slice(0, 1)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const PredefinedDesignCard = ({ 
  type, 
  icon: Icon, 
  description 
}: { 
  type: NailArtType; 
  icon: React.ElementType; 
  description: string;
}) => {
  const { predefinedArtwork, addPredefinedArtwork, removePredefinedArtwork } = useCustomStudioStore();
  const [isExpanded, setIsExpanded] = useState(false);
  
  const existing = predefinedArtwork.find(a => a.type === type);
  const selectedNails = existing?.nails || new Set<FingerIndex>();
  const isThemedSet = type === 'themed-set';
  const priceInfo = NAIL_ART_PRICES[type];
  
  const priceLabel = priceInfo.type === 'per-nail'
    ? `+$${priceInfo.price}/nail` 
    : `+$${priceInfo.price}/set`;
  
  const calculatedPrice = isThemedSet 
    ? (existing ? priceInfo.price : 0)
    : selectedNails.size * priceInfo.price;

  const handleToggleNail = (index: FingerIndex) => {
    const newNails = new Set(selectedNails);
    if (newNails.has(index)) {
      newNails.delete(index);
    } else {
      newNails.add(index);
    }
    
    if (newNails.size === 0) {
      removePredefinedArtwork(type);
    } else {
      addPredefinedArtwork({ type, nails: newNails });
    }
  };

  const handleThemedSetToggle = () => {
    if (existing) {
      removePredefinedArtwork(type);
    } else {
      // Apply to all 10 nails
      const allNails = new Set<FingerIndex>([0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as FingerIndex[]);
      addPredefinedArtwork({ type, nails: allNails });
    }
  };

  return (
    <div className={cn(
      "border rounded-xl transition-all",
      selectedNails.size > 0 || existing 
        ? "border-primary bg-primary/5" 
        : "border-border bg-card hover:border-primary/50"
    )}>
      <div 
        className="p-4 cursor-pointer"
        onClick={() => isThemedSet ? handleThemedSetToggle() : setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className={cn(
              "p-2 rounded-lg",
              selectedNails.size > 0 || existing ? "bg-primary/20" : "bg-muted"
            )}>
              <Icon className={cn(
                "w-5 h-5",
                selectedNails.size > 0 || existing ? "text-primary" : "text-muted-foreground"
              )} />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-foreground">{NAIL_ART_LABELS[type]}</h4>
                <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  {priceLabel}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          </div>
          
          {isThemedSet ? (
            <Switch 
              checked={!!existing} 
              onCheckedChange={handleThemedSetToggle}
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <div className="text-right">
              {selectedNails.size > 0 && (
                <p className="text-sm font-semibold text-primary">+${calculatedPrice}</p>
              )}
              <p className="text-xs text-muted-foreground">
                {selectedNails.size > 0 ? `${selectedNails.size} nail${selectedNails.size > 1 ? 's' : ''}` : 'Select nails'}
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Nail Selector (not for themed sets) */}
      {!isThemedSet && isExpanded && (
        <div className="px-4 pb-4 pt-2 border-t border-border/50">
          <NailSelector 
            selectedNails={selectedNails} 
            onToggleNail={handleToggleNail} 
          />
        </div>
      )}
    </div>
  );
};

export const CustomArtwork = () => {
  const { customArtwork, setCustomArtwork } = useCustomStudioStore();
  const [customEnabled, setCustomEnabled] = useState(!!customArtwork);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCustomToggle = (enabled: boolean) => {
    setCustomEnabled(enabled);
    if (!enabled) {
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

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        setCustomArtwork({
          description: customArtwork?.description || '',
          inspirationImages: [...(customArtwork?.inspirationImages || []), imageUrl],
          nails: customArtwork?.nails || new Set<FingerIndex>()
        });
      };
      reader.readAsDataURL(file);
    });
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...(customArtwork?.inspirationImages || [])];
    newImages.splice(index, 1);
    setCustomArtwork({
      description: customArtwork?.description || '',
      inspirationImages: newImages,
      nails: customArtwork?.nails || new Set<FingerIndex>()
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Custom Artwork</h2>
        <p className="text-muted-foreground">
          Add nail art designs from our gallery or request custom artwork
        </p>
      </div>

      {/* Section 1: Predefined Designs */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Predefined Designs</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Choose from our curated design collection. Select which nails get each design.
        </p>
        
        <div className="space-y-3">
          {DESIGN_OPTIONS.map((option) => (
            <PredefinedDesignCard 
              key={option.type} 
              type={option.type} 
              icon={option.icon} 
              description={option.description} 
            />
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-background px-4 text-sm text-muted-foreground">or</span>
        </div>
      </div>

      {/* Section 2: Custom Artwork Request */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Custom Artwork Request</h3>
          </div>
          <Switch 
            checked={customEnabled} 
            onCheckedChange={handleCustomToggle}
          />
        </div>
        <p className="text-sm text-muted-foreground">
          Have a unique design in mind? Upload inspiration and describe your vision.
        </p>

        {customEnabled && (
          <div className="space-y-6 pt-2">
            {/* Image Upload */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">
                Inspiration Images
              </label>
              <div className="flex flex-wrap gap-3">
                {customArtwork?.inspirationImages?.map((img, index) => (
                  <div key={index} className="relative w-20 h-20 rounded-lg overflow-hidden border border-border group">
                    <img src={img} alt={`Inspiration ${index + 1}`} className="w-full h-full object-cover" />
                    <button
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1 right-1 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-20 h-20 rounded-lg border-2 border-dashed border-border hover:border-primary/50 flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-primary transition-colors"
                >
                  <Upload className="w-5 h-5" />
                  <span className="text-[10px]">Upload</span>
                </button>
                
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
                placeholder="Describe your custom artwork idea... Include colors, style, theme, or any specific details you'd like."
                className="min-h-[100px] resize-none"
              />
            </div>

            {/* Nail Selector */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">
                Select Nails for Custom Art
              </label>
              <NailSelector 
                selectedNails={customArtwork?.nails || new Set<FingerIndex>()} 
                onToggleNail={handleToggleNail}
              />
            </div>

            {/* Price TBD Notice */}
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-start gap-3">
              <ImageIcon className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-amber-700 dark:text-amber-400">
                  Price TBD — Artist will quote
                </p>
                <p className="text-sm text-amber-600/80 dark:text-amber-400/80 mt-1">
                  Custom artwork pricing depends on design complexity. Our artist will provide a personalized quote after reviewing your request.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomArtwork;
