import { useCustomStudioStore } from '@/stores/customStudioStore';
import { 
  CharmTier,
  CHARM_PRICES,
  CHARM_LABELS
} from '@/lib/pricing';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';

const CHARM_OPTIONS: CharmTier[] = ['none', 'single-statement', 'a-few-accents', 'charmed-out'];

const CharmsSection = () => {
  const { charmTier, charmPreferences, setCharmTier, setCharmPreferences } = useCustomStudioStore();

  // Split options: first 3 in a row, last one full width
  const topRowOptions = CHARM_OPTIONS.slice(0, 3);
  const bottomOption = CHARM_OPTIONS[3];

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center gap-2">
        <span className="text-2xl">🎀</span>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Charms</h3>
          <p className="text-sm text-muted-foreground">Add 3D charms</p>
        </div>
      </div>

      {/* Top Row - 3 Options */}
      <div className="grid grid-cols-3 gap-2">
        {topRowOptions.map((tier) => {
          const isSelected = charmTier === tier;
          const price = CHARM_PRICES[tier];
          
          return (
            <button
              key={tier}
              onClick={() => setCharmTier(tier)}
              className={cn(
                "flex flex-col items-center justify-center gap-1.5 min-h-[70px] p-3 rounded-xl border-2 transition-all shadow-sm",
                isSelected
                  ? "border-primary bg-primary/5"
                  : "border-border bg-card hover:border-primary/50"
              )}
            >
              <span className={cn(
                "font-medium text-center text-sm leading-tight",
                isSelected ? "text-foreground" : "text-foreground"
              )}>
                {CHARM_LABELS[tier]}
              </span>
              <span className={cn(
                "text-xs font-semibold",
                isSelected ? "text-primary" : "text-muted-foreground"
              )}>
                {price > 0 ? `+$${price}` : 'Free'}
              </span>
            </button>
          );
        })}
      </div>

      {/* Bottom Row - Full Width Option */}
      <button
        onClick={() => setCharmTier(bottomOption)}
        className={cn(
          "w-full flex flex-col items-center justify-center gap-1.5 min-h-[70px] p-4 rounded-xl border-2 transition-all shadow-sm",
          charmTier === bottomOption
            ? "border-primary bg-primary/5"
            : "border-border bg-card hover:border-primary/50"
        )}
      >
        <span className={cn(
          "font-medium text-center",
          charmTier === bottomOption ? "text-foreground" : "text-foreground"
        )}>
          {CHARM_LABELS[bottomOption]}
        </span>
        <span className={cn(
          "text-sm font-semibold",
          charmTier === bottomOption ? "text-primary" : "text-muted-foreground"
        )}>
          +${CHARM_PRICES[bottomOption]}
        </span>
      </button>

      {/* Charm Preferences Textarea - Only show when charm tier is not 'none' */}
      {charmTier !== 'none' && (
        <div className="space-y-2 pt-2">
          <label className="text-sm font-medium text-foreground">
            Charm Preferences (optional)
          </label>
          <Textarea
            value={charmPreferences}
            onChange={(e) => setCharmPreferences(e.target.value)}
            placeholder="Tell us about your charm preferences... e.g., 'gold butterflies', 'silver hearts', 'cute bows'"
            className="min-h-[80px] resize-none text-base"
          />
        </div>
      )}
    </div>
  );
};

export default CharmsSection;
