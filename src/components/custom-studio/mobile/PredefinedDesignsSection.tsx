import { useState } from 'react';
import { useCustomStudioStore } from '@/stores/customStudioStore';
import { NailArtType, FingerIndex, NAIL_ART_PRICES, NAIL_ART_LABELS } from '@/lib/pricing';
import { PenTool, Flower2, Palette, PartyPopper, ChevronDown, ChevronUp } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import ArtworkNailPicker from './ArtworkNailPicker';

const DESIGN_OPTIONS: { type: NailArtType; icon: React.ElementType; description: string }[] = [
  { type: 'simple-lines', icon: PenTool, description: 'Minimalist geometric patterns' },
  { type: 'florals', icon: Flower2, description: 'Hand-painted flowers' },
  { type: 'abstract', icon: Palette, description: 'Modern abstract art' },
  { type: 'themed-set', icon: PartyPopper, description: 'Holiday or event themes' },
];

const DesignCard = ({ 
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
    ? `$${priceInfo.price}/nail` 
    : `$${priceInfo.price}/set`;

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
      const allNails = new Set<FingerIndex>([0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as FingerIndex[]);
      addPredefinedArtwork({ type, nails: allNails });
    }
  };

  const isActive = selectedNails.size > 0 || !!existing;

  return (
    <div className={cn(
      "border rounded-2xl transition-all overflow-hidden",
      isActive
        ? "border-primary bg-primary/5" 
        : "border-border bg-card"
    )}>
      {/* Card Header */}
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className={cn(
            "p-3 rounded-xl shrink-0",
            isActive ? "bg-primary/20" : "bg-muted"
          )}>
            <Icon className={cn(
              "w-6 h-6",
              isActive ? "text-primary" : "text-muted-foreground"
            )} />
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h4 className="font-semibold text-foreground">{NAIL_ART_LABELS[type]}</h4>
              <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full shrink-0">
                {priceLabel}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          </div>
        </div>

        {/* Action Area */}
        <div className="mt-4">
          {isThemedSet ? (
            <div className="flex items-center justify-between bg-muted/50 rounded-xl p-3">
              <span className="text-sm font-medium text-foreground">Apply to all nails</span>
              <Switch 
                checked={!!existing} 
                onCheckedChange={handleThemedSetToggle}
              />
            </div>
          ) : (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className={cn(
                "w-full flex items-center justify-between p-3 rounded-xl transition-colors",
                isExpanded ? "bg-primary/10" : "bg-muted/50 hover:bg-muted"
              )}
            >
              <span className="text-sm font-medium text-foreground">
                {selectedNails.size > 0 
                  ? `${selectedNails.size} nail${selectedNails.size > 1 ? 's' : ''} selected`
                  : 'Select nails'
                }
              </span>
              <div className="flex items-center gap-2">
                {selectedNails.size > 0 && (
                  <span className="text-sm font-semibold text-primary">
                    +${selectedNails.size * priceInfo.price}
                  </span>
                )}
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
            </button>
          )}
        </div>
      </div>

      {/* Expandable Nail Picker */}
      {!isThemedSet && isExpanded && (
        <div className="px-4 pb-4 border-t border-border/50 pt-4">
          <ArtworkNailPicker
            selectedNails={selectedNails}
            onToggleNail={handleToggleNail}
            pricePerNail={priceInfo.price}
          />
        </div>
      )}
    </div>
  );
};

const PredefinedDesignsSection = () => {
  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <span>🎨</span> Predefined Designs
        </h3>
        <p className="text-sm text-muted-foreground">
          Choose from our curated collection
        </p>
      </div>

      {/* Design Cards */}
      <div className="space-y-3">
        {DESIGN_OPTIONS.map((option) => (
          <DesignCard 
            key={option.type} 
            type={option.type} 
            icon={option.icon} 
            description={option.description} 
          />
        ))}
      </div>
    </div>
  );
};

export default PredefinedDesignsSection;
