import { Check, Sparkles } from 'lucide-react';
import { useCustomStudioStore } from '@/stores/customStudioStore';
import { FINISH_PRICES, FINISH_LABELS, FinishType } from '@/lib/pricing';
import { cn } from '@/lib/utils';

interface FinishSelectorProps {
  onSelect: () => void;
}

const finishes: FinishType[] = ['glossy', 'matte'];

const FinishSelector = ({ onSelect }: FinishSelectorProps) => {
  const { baseFinish: selectedFinish, setBaseFinish } = useCustomStudioStore();

  const handleSelect = (finish: FinishType) => {
    setBaseFinish(finish);
    onSelect();
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground">Choose Your Finish</h2>
        <p className="text-sm text-muted-foreground mt-1">Step 3 of 4</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {finishes.map((finish) => {
          const isSelected = selectedFinish === finish;
          const price = FINISH_PRICES[finish];
          
          return (
            <button
              key={finish}
              onClick={() => handleSelect(finish)}
              className={cn(
                'relative flex flex-col items-center gap-3 p-5 rounded-xl border-2 transition-all min-h-[160px]',
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
              
              {/* Finish preview */}
              <div
                className={cn(
                  'w-16 h-16 rounded-full flex items-center justify-center',
                  finish === 'glossy'
                    ? 'bg-gradient-to-br from-white via-primary/30 to-primary/60 shadow-lg'
                    : 'bg-muted'
                )}
              >
                {finish === 'glossy' && (
                  <Sparkles className="w-6 h-6 text-primary" />
                )}
              </div>
              
              <div className="text-center">
                <span className="font-semibold text-foreground block">{FINISH_LABELS[finish]}</span>
                <span className="text-xs text-muted-foreground">
                  {finish === 'glossy' ? 'High shine finish' : 'Soft, velvety look'}
                </span>
              </div>
              
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

export default FinishSelector;
