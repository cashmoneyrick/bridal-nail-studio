import { useCustomStudioStore } from '@/stores/customStudioStore';
import {
  RhinestoneTier,
  CharmTier,
  RHINESTONE_PRICES,
  RHINESTONE_LABELS,
  CHARM_PRICES,
  CHARM_LABELS,
} from '@/lib/pricing';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';

const RHINESTONE_OPTIONS: RhinestoneTier[] = ['none', 'just-a-touch', 'a-little-sparkle', 'full-glam'];
const CHARM_OPTIONS: CharmTier[] = ['none', 'single-statement', 'a-few-accents', 'charmed-out'];

export function SparkleExtras() {
  const {
    rhinestoneTier,
    charmTier,
    charmPreferences,
    setRhinestoneTier,
    setCharmTier,
    setCharmPreferences,
  } = useCustomStudioStore();

  return (
    <div className="space-y-6">
      {/* Rhinestones */}
      <div className="space-y-3">
        <h4 className="font-medium text-foreground text-sm">Rhinestones</h4>
        <div className="grid grid-cols-2 gap-2">
          {RHINESTONE_OPTIONS.map((tier) => {
            const isSelected = rhinestoneTier === tier;
            const price = RHINESTONE_PRICES[tier];

            return (
              <button
                key={tier}
                onClick={() => setRhinestoneTier(tier)}
                className={cn(
                  'flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all text-center',
                  isSelected
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/40'
                )}
              >
                <span className="font-medium text-foreground text-sm">{RHINESTONE_LABELS[tier]}</span>
                <span className={cn(
                  'text-xs',
                  isSelected ? 'text-primary font-semibold' : 'text-muted-foreground'
                )}>
                  {price > 0 ? `+$${price}` : 'Free'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Charms */}
      <div className="space-y-3">
        <h4 className="font-medium text-foreground text-sm">Charms</h4>
        <div className="grid grid-cols-2 gap-2">
          {CHARM_OPTIONS.map((tier) => {
            const isSelected = charmTier === tier;
            const price = CHARM_PRICES[tier];

            return (
              <button
                key={tier}
                onClick={() => setCharmTier(tier)}
                className={cn(
                  'flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all text-center',
                  isSelected
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/40'
                )}
              >
                <span className="font-medium text-foreground text-sm">{CHARM_LABELS[tier]}</span>
                <span className={cn(
                  'text-xs',
                  isSelected ? 'text-primary font-semibold' : 'text-muted-foreground'
                )}>
                  {price > 0 ? `+$${price}` : 'Free'}
                </span>
              </button>
            );
          })}
        </div>

        {charmTier !== 'none' && (
          <div className="space-y-2">
            <label className="text-xs font-medium text-foreground">
              Charm preferences (optional)
            </label>
            <Textarea
              value={charmPreferences}
              onChange={(e) => setCharmPreferences(e.target.value)}
              placeholder="e.g., 'gold butterflies', 'silver hearts', 'cute bows'"
              className="min-h-[72px] resize-none text-sm rounded-xl"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default SparkleExtras;
