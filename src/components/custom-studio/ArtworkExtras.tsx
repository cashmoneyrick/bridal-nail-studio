import { useState, useRef, useEffect } from 'react';
import { useCustomStudioStore } from '@/stores/customStudioStore';
import { NailArtType, FingerIndex, NAIL_ART_PRICES, NAIL_ART_LABELS, FINGER_NAMES, LEFT_HAND, RIGHT_HAND } from '@/lib/pricing';
import { Palette, Upload, PenTool, Flower2, PartyPopper, X, ImageIcon } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

const DESIGN_OPTIONS: { type: NailArtType; icon: React.ElementType; description: string }[] = [
  { type: 'simple-lines', icon: PenTool, description: 'Minimalist geometric patterns' },
  { type: 'florals', icon: Flower2, description: 'Hand-painted flowers & botanicals' },
  { type: 'abstract', icon: Palette, description: 'Modern abstract art' },
  { type: 'themed-set', icon: PartyPopper, description: 'Holiday or event themes (all nails)' },
];

function NailSelector({ selectedNails, onToggleNail }: {
  selectedNails: Set<FingerIndex>;
  onToggleNail: (index: FingerIndex) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <p className="text-[10px] text-muted-foreground font-medium">Left Hand</p>
        <div className="flex gap-1.5">
          {LEFT_HAND.map((fi) => (
            <button
              key={fi}
              onClick={() => onToggleNail(fi as FingerIndex)}
              className={cn(
                'flex-1 h-9 rounded-lg border-2 text-[10px] font-medium transition-all',
                selectedNails.has(fi as FingerIndex)
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border text-muted-foreground hover:border-primary/50'
              )}
            >
              {FINGER_NAMES[fi].slice(0, 1)}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-1.5">
        <p className="text-[10px] text-muted-foreground font-medium">Right Hand</p>
        <div className="flex gap-1.5">
          {RIGHT_HAND.map((fi) => (
            <button
              key={fi}
              onClick={() => onToggleNail(fi as FingerIndex)}
              className={cn(
                'flex-1 h-9 rounded-lg border-2 text-[10px] font-medium transition-all',
                selectedNails.has(fi as FingerIndex)
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border text-muted-foreground hover:border-primary/50'
              )}
            >
              {FINGER_NAMES[fi].slice(0, 1)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function PredefinedDesignCard({ type, icon: Icon, description }: {
  type: NailArtType; icon: React.ElementType; description: string;
}) {
  const { predefinedArtwork, addPredefinedArtwork, removePredefinedArtwork } = useCustomStudioStore();
  const [isExpanded, setIsExpanded] = useState(false);

  const existing = predefinedArtwork.find(a => a.type === type);
  const selectedNails = existing?.nails || new Set<FingerIndex>();
  const isThemedSet = type === 'themed-set';
  const priceInfo = NAIL_ART_PRICES[type];
  const priceLabel = priceInfo.type === 'per-nail' ? `+$${priceInfo.price}/nail` : `+$${priceInfo.price}/set`;

  const handleToggleNail = (index: FingerIndex) => {
    const newNails = new Set(selectedNails);
    if (newNails.has(index)) newNails.delete(index); else newNails.add(index);
    if (newNails.size === 0) removePredefinedArtwork(type);
    else addPredefinedArtwork({ type, nails: newNails });
  };

  const handleThemedSetToggle = () => {
    if (existing) {
      removePredefinedArtwork(type);
    } else {
      const allNails = new Set<FingerIndex>([0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as FingerIndex[]);
      addPredefinedArtwork({ type, nails: allNails });
    }
  };

  return (
    <div className={cn(
      'border rounded-xl transition-all',
      selectedNails.size > 0 || existing
        ? 'border-primary/30 bg-primary/5'
        : 'border-border hover:border-primary/30'
    )}>
      <div
        className="p-3 cursor-pointer"
        onClick={() => isThemedSet ? handleThemedSetToggle() : setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <Icon className={cn(
              'w-4 h-4 shrink-0',
              selectedNails.size > 0 || existing ? 'text-primary' : 'text-muted-foreground'
            )} />
            <div>
              <span className="font-medium text-sm text-foreground">{NAIL_ART_LABELS[type]}</span>
              <span className="text-xs text-primary ml-2">{priceLabel}</span>
            </div>
          </div>
          {isThemedSet ? (
            <Switch checked={!!existing} onCheckedChange={handleThemedSetToggle} onClick={(e) => e.stopPropagation()} />
          ) : (
            <span className="text-xs text-muted-foreground">
              {selectedNails.size > 0 ? `${selectedNails.size} nail${selectedNails.size > 1 ? 's' : ''}` : 'Select'}
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-1 ml-6.5">{description}</p>
      </div>
      {!isThemedSet && isExpanded && (
        <div className="px-3 pb-3 pt-1 border-t border-border/50">
          <NailSelector selectedNails={selectedNails} onToggleNail={handleToggleNail} />
        </div>
      )}
    </div>
  );
}

export function ArtworkExtras() {
  const { customArtwork, setCustomArtwork } = useCustomStudioStore();
  const [customEnabled, setCustomEnabled] = useState(!!customArtwork);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const objectUrlsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    return () => {
      objectUrlsRef.current.forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

  const handleCustomToggle = (enabled: boolean) => {
    setCustomEnabled(enabled);
    if (!enabled) {
      customArtwork?.inspirationImages.forEach(url => {
        if (url.startsWith('blob:')) { URL.revokeObjectURL(url); objectUrlsRef.current.delete(url); }
      });
      setCustomArtwork(null);
    } else if (!customArtwork) {
      setCustomArtwork({ description: '', inspirationImages: [], nails: new Set<FingerIndex>() });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newUrls: string[] = [];
    Array.from(files).forEach(file => {
      const url = URL.createObjectURL(file);
      objectUrlsRef.current.add(url);
      newUrls.push(url);
    });
    setCustomArtwork({
      description: customArtwork?.description || '',
      inspirationImages: [...(customArtwork?.inspirationImages || []), ...newUrls],
      nails: customArtwork?.nails || new Set<FingerIndex>(),
    });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemoveImage = (index: number) => {
    const url = customArtwork?.inspirationImages?.[index];
    if (url?.startsWith('blob:')) { URL.revokeObjectURL(url); objectUrlsRef.current.delete(url); }
    const newImages = [...(customArtwork?.inspirationImages || [])];
    newImages.splice(index, 1);
    setCustomArtwork({
      description: customArtwork?.description || '',
      inspirationImages: newImages,
      nails: customArtwork?.nails || new Set<FingerIndex>(),
    });
  };

  const handleToggleNail = (index: FingerIndex) => {
    const currentNails = customArtwork?.nails || new Set<FingerIndex>();
    const newNails = new Set(currentNails);
    if (newNails.has(index)) newNails.delete(index); else newNails.add(index);
    setCustomArtwork({
      description: customArtwork?.description || '',
      inspirationImages: customArtwork?.inspirationImages || [],
      nails: newNails,
    });
  };

  return (
    <div className="space-y-5">
      {/* Predefined designs */}
      <div className="space-y-3">
        <h4 className="font-medium text-foreground text-sm">Predefined Designs</h4>
        {DESIGN_OPTIONS.map((option) => (
          <PredefinedDesignCard key={option.type} {...option} />
        ))}
      </div>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
        <div className="relative flex justify-center">
          <span className="bg-card px-3 text-xs text-muted-foreground">or</span>
        </div>
      </div>

      {/* Custom artwork */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-foreground text-sm">Custom Artwork Request</h4>
          <Switch checked={customEnabled} onCheckedChange={handleCustomToggle} />
        </div>

        {customEnabled && (
          <div className="space-y-4 pt-1">
            {/* Image upload */}
            <div className="flex flex-wrap gap-2">
              {customArtwork?.inspirationImages?.map((img, index) => (
                <div key={index} className="relative w-16 h-16 rounded-lg overflow-hidden border border-border group">
                  <img src={img} alt={`Inspiration ${index + 1}`} className="w-full h-full object-cover" />
                  <button
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-0.5 right-0.5 p-0.5 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-16 h-16 rounded-lg border-2 border-dashed border-border hover:border-primary/50 flex flex-col items-center justify-center gap-0.5 text-muted-foreground hover:text-primary transition-colors"
              >
                <Upload className="w-4 h-4" />
                <span className="text-[9px]">Upload</span>
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
            </div>

            {/* Description */}
            <Textarea
              value={customArtwork?.description || ''}
              onChange={(e) => setCustomArtwork({
                description: e.target.value,
                inspirationImages: customArtwork?.inspirationImages || [],
                nails: customArtwork?.nails || new Set<FingerIndex>(),
              })}
              placeholder="Describe your custom artwork idea..."
              className="min-h-[80px] resize-none text-sm rounded-xl"
            />

            {/* Nail selector */}
            <NailSelector
              selectedNails={customArtwork?.nails || new Set<FingerIndex>()}
              onToggleNail={handleToggleNail}
            />

            {/* Price TBD */}
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 flex items-start gap-2.5">
              <ImageIcon className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-amber-700 dark:text-amber-400 text-sm">Price TBD</p>
                <p className="text-xs text-amber-600/80 dark:text-amber-400/80">
                  Our artist will quote after reviewing your request.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ArtworkExtras;
