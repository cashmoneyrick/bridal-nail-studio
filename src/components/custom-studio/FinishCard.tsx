import { Check } from 'lucide-react';
import { useCustomStudioStore } from '@/stores/customStudioStore';
import { FINISH_PRICES, FINISH_LABELS, FinishType } from '@/lib/pricing';
import { cn } from '@/lib/utils';

interface FinishCardProps {
  onNext: () => void;
}

const finishes: FinishType[] = ['glossy', 'matte'];

export function FinishCard({ onNext }: FinishCardProps) {
  const { baseFinish, setBaseFinish } = useCustomStudioStore();

  const handleSelect = (finish: FinishType) => {
    setBaseFinish(finish);
    setTimeout(onNext, 400);
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-3">
        <h2 className="font-display text-3xl md:text-4xl text-foreground">
          Choose your finish
        </h2>
        <p className="text-muted-foreground">
          The final touch that defines the look
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {finishes.map((finish) => {
          const isSelected = baseFinish === finish;
          const price = FINISH_PRICES[finish];

          return (
            <button
              key={finish}
              onClick={() => handleSelect(finish)}
              className={cn(
                'relative flex flex-col items-center gap-5 p-8 rounded-2xl border-2 transition-all duration-200',
                isSelected
                  ? 'border-primary bg-primary/5 scale-[1.02] shadow-sm'
                  : 'border-border hover:border-primary/40 active:scale-[0.98]'
              )}
            >
              {isSelected && (
                <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                  <Check className="w-3 h-3 text-primary-foreground" />
                </div>
              )}
              {/* Finish preview orb */}
              <div
                className={cn(
                  'w-20 h-20 rounded-full border transition-all duration-200',
                  finish === 'glossy'
                    ? 'bg-gradient-to-br from-white via-gray-50 to-gray-200 border-gray-200'
                    : 'bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500 border-gray-400'
                )}
                style={{
                  boxShadow: finish === 'glossy'
                    ? 'inset -6px -6px 12px rgba(0,0,0,0.08), inset 6px 6px 12px rgba(255,255,255,0.9), 0 4px 12px rgba(0,0,0,0.06)'
                    : '0 2px 8px rgba(0,0,0,0.08)'
                }}
              />
              <div className="text-center space-y-1">
                <span className="font-medium text-foreground text-lg block">{FINISH_LABELS[finish]}</span>
                <span className="text-sm text-muted-foreground block">
                  {finish === 'glossy' ? 'High shine reflective' : 'Soft velvet texture'}
                </span>
                {price > 0 && (
                  <span className="text-xs text-primary font-medium block mt-1">+${price}</span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default FinishCard;
