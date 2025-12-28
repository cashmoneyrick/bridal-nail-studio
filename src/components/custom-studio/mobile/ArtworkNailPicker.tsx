import { Check } from 'lucide-react';
import { useCustomStudioStore } from '@/stores/customStudioStore';
import { FingerIndex, LEFT_HAND, RIGHT_HAND, FINGER_NAMES } from '@/lib/pricing';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface ArtworkNailPickerProps {
  selectedNails: Set<FingerIndex>;
  onToggleNail: (index: FingerIndex) => void;
  pricePerNail?: number;
  onDone?: () => void;
  title?: string;
}

const ArtworkNailPicker = ({ 
  selectedNails, 
  onToggleNail, 
  pricePerNail,
  onDone,
  title
}: ArtworkNailPickerProps) => {
  const { nailColors } = useCustomStudioStore();
  
  const DEFAULT_NUDE = '#F5D0C5';

  const getNailColor = (fingerIndex: FingerIndex): string => {
    return nailColors[fingerIndex] || DEFAULT_NUDE;
  };

  const renderNail = (fingerIndex: FingerIndex) => {
    const isSelected = selectedNails.has(fingerIndex);
    const color = getNailColor(fingerIndex);
    const label = FINGER_NAMES[fingerIndex].split(' ')[1]?.[0] || FINGER_NAMES[fingerIndex][0];

    return (
      <button
        key={fingerIndex}
        onClick={() => onToggleNail(fingerIndex)}
        className={cn(
          "relative flex flex-col items-center justify-center w-12 h-16 rounded-xl border-2 transition-all",
          isSelected
            ? "border-primary bg-primary/10 shadow-md"
            : "border-border bg-card hover:border-primary/50"
        )}
      >
        {/* Nail color indicator */}
        <div 
          className="w-6 h-8 rounded-t-full border border-border/50 mb-1"
          style={{ backgroundColor: color }}
        />
        
        {/* Finger label */}
        <span className="text-[10px] font-medium text-muted-foreground">
          {label}
        </span>
        
        {/* Selection checkmark */}
        {isSelected && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
            <Check className="w-3 h-3 text-primary-foreground" />
          </div>
        )}
      </button>
    );
  };

  const totalPrice = pricePerNail ? selectedNails.size * pricePerNail : 0;

  return (
    <div className="space-y-4">
      {title && (
        <p className="text-sm font-medium text-foreground text-center">{title}</p>
      )}
      
      {/* Left Hand */}
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground font-medium text-center">Left Hand</p>
        <div className="flex justify-center gap-2">
          {LEFT_HAND.map(renderNail)}
        </div>
      </div>
      
      {/* Right Hand */}
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground font-medium text-center">Right Hand</p>
        <div className="flex justify-center gap-2">
          {RIGHT_HAND.map(renderNail)}
        </div>
      </div>

      {/* Price summary */}
      {pricePerNail !== undefined && (
        <div className="text-center py-2">
          <p className="text-sm font-medium text-foreground">
            Selected: {selectedNails.size} nail{selectedNails.size !== 1 ? 's' : ''}
            {totalPrice > 0 && (
              <span className="text-primary ml-1">= +${totalPrice}</span>
            )}
          </p>
        </div>
      )}

      {/* Done button for modal mode */}
      {onDone && (
        <Button onClick={onDone} className="w-full">
          Done
        </Button>
      )}
    </div>
  );
};

export default ArtworkNailPicker;
