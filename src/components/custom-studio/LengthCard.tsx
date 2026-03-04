import { Check } from 'lucide-react';
import { useCustomStudioStore } from '@/stores/customStudioStore';
import { LENGTH_PRICES, LENGTH_LABELS, LengthType } from '@/lib/pricing';
import { cn } from '@/lib/utils';

interface LengthCardProps {
  onNext: () => void;
}

const lengths: LengthType[] = ['short', 'medium', 'long', 'extra-long'];

export function LengthCard({ onNext }: LengthCardProps) {
  const { length: selectedLength, setLength } = useCustomStudioStore();

  const handleSelect = (length: LengthType) => {
    setLength(length);
    setTimeout(onNext, 400);
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-3">
        <h2 className="font-display text-3xl md:text-4xl text-foreground">
          Pick your length
        </h2>
        <p className="text-muted-foreground">
          From subtle to statement
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {lengths.map((length) => {
          const isSelected = selectedLength === length;
          const price = LENGTH_PRICES[length];
          const heightMap: Record<LengthType, number> = {
            short: 28,
            medium: 40,
            long: 52,
            'extra-long': 64,
          };

          return (
            <button
              key={length}
              onClick={() => handleSelect(length)}
              className={cn(
                'relative flex flex-col items-center gap-4 p-6 rounded-2xl border-2 transition-all duration-200',
                isSelected
                  ? 'border-primary bg-primary/5 scale-[1.02] shadow-sm'
                  : 'border-border hover:border-primary/40 active:scale-[0.98]'
              )}
            >
              {isSelected && (
                <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                  <Check className="w-3 h-3 text-primary-foreground" />
                </div>
              )}
              {/* Visual length indicator */}
              <div className="flex items-end justify-center h-16">
                <div
                  className={cn(
                    'w-5 rounded-t-full transition-colors duration-200',
                    isSelected ? 'bg-primary' : 'bg-muted-foreground/30'
                  )}
                  style={{ height: heightMap[length] }}
                />
              </div>
              <div className="text-center">
                <span className="font-medium text-foreground block">{LENGTH_LABELS[length]}</span>
                {price > 0 ? (
                  <span className="text-xs text-primary font-medium">+${price}</span>
                ) : (
                  <span className="text-xs text-muted-foreground">Included</span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default LengthCard;
