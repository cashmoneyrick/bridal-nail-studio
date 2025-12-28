import { useCustomStudioStore } from '@/stores/customStudioStore';
import { 
  RhinestoneTier,
  RHINESTONE_PRICES,
  RHINESTONE_LABELS
} from '@/lib/pricing';
import { cn } from '@/lib/utils';

const RHINESTONE_OPTIONS: RhinestoneTier[] = ['none', 'just-a-touch', 'a-little-sparkle', 'full-glam'];

const RhinestonesSection = () => {
  const { rhinestoneTier, setRhinestoneTier } = useCustomStudioStore();

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center gap-2">
        <span className="text-2xl">💎</span>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Rhinestones</h3>
          <p className="text-sm text-muted-foreground">Add sparkle</p>
        </div>
      </div>

      {/* 2x2 Grid of Options */}
      <div className="grid grid-cols-2 gap-3">
        {RHINESTONE_OPTIONS.map((tier) => {
          const isSelected = rhinestoneTier === tier;
          const price = RHINESTONE_PRICES[tier];
          
          return (
            <button
              key={tier}
              onClick={() => setRhinestoneTier(tier)}
              className={cn(
                "flex flex-col items-center justify-center gap-2 min-h-[80px] p-4 rounded-xl border-2 transition-all shadow-sm",
                isSelected
                  ? "border-primary bg-primary/5"
                  : "border-border bg-card hover:border-primary/50"
              )}
            >
              <span className={cn(
                "font-medium text-center leading-tight",
                isSelected ? "text-foreground" : "text-foreground"
              )}>
                {RHINESTONE_LABELS[tier]}
              </span>
              <span className={cn(
                "text-sm font-semibold",
                isSelected ? "text-primary" : "text-muted-foreground"
              )}>
                {price > 0 ? `+$${price}` : 'Free'}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default RhinestonesSection;
