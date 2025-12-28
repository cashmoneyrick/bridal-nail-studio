import { Check } from 'lucide-react';
import { useCustomStudioStore } from '@/stores/customStudioStore';
import { LENGTH_PRICES, LENGTH_LABELS, LengthType } from '@/lib/pricing';
import { cn } from '@/lib/utils';

interface LengthSelectorProps {
  onSelect: () => void;
}

const lengths: LengthType[] = ['short', 'medium', 'long', 'extra-long'];

const LengthVisual = ({ length, isSelected }: { length: LengthType; isSelected: boolean }) => {
  const heights: Record<LengthType, number> = {
    short: 40,
    medium: 55,
    long: 70,
    'extra-long': 85,
  };

  return (
    <div className="flex items-end justify-center h-24">
      <div
        className={cn(
          'w-8 rounded-t-full transition-all duration-200',
          isSelected ? 'bg-primary' : 'bg-muted'
        )}
        style={{ height: `${heights[length]}px` }}
      />
    </div>
  );
};

const LengthSelector = ({ onSelect }: LengthSelectorProps) => {
  const { length: selectedLength, setLength } = useCustomStudioStore();

  const handleSelect = (length: LengthType) => {
    setLength(length);
    onSelect();
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground">Choose Your Length</h2>
        <p className="text-sm text-muted-foreground mt-1">Step 2 of 4</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {lengths.map((length) => {
          const isSelected = selectedLength === length;
          const price = LENGTH_PRICES[length];
          
          return (
            <button
              key={length}
              onClick={() => handleSelect(length)}
              className={cn(
                'relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all min-h-[140px]',
                isSelected
                  ? 'border-primary bg-primary/10 scale-[1.02]'
                  : 'border-border hover:border-primary/50 active:scale-[0.98]'
              )}
            >
              {isSelected && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                  <Check className="w-3 h-3 text-primary-foreground" />
                </div>
              )}
              <LengthVisual length={length} isSelected={isSelected} />
              <span className="font-medium text-foreground">{LENGTH_LABELS[length]}</span>
              {price > 0 && (
                <span className="text-xs text-primary font-medium">+${price}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default LengthSelector;
