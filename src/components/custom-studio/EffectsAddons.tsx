import { Sparkles, Star, CircleDot, Gem, Heart } from 'lucide-react';
import { useCustomStudioStore } from '@/stores/customStudioStore';
import { 
  EffectType, 
  RhinestoneTier,
  CharmTier,
  EFFECTS_PRICES, 
  EFFECT_LABELS,
  RHINESTONE_PRICES,
  RHINESTONE_LABELS,
  CHARM_PRICES,
  CHARM_LABELS
} from '@/lib/pricing';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import { useIsMobile } from '@/hooks/use-mobile';
import EffectsAddonsMobile from './mobile/EffectsAddonsMobile';

const EFFECT_CONFIG: Array<{
  type: EffectType;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}> = [
  { type: 'chrome', icon: Sparkles, description: 'Metallic mirror finish' },
  { type: 'glitter', icon: Star, description: 'Sparkling glitter finish' },
  { type: 'french-tip', icon: CircleDot, description: 'Classic French manicure tip' },
];

type EffectScope = 'none' | 'all' | 'accents-only';

const RHINESTONE_OPTIONS: RhinestoneTier[] = ['none', 'just-a-touch', 'a-little-sparkle', 'full-glam'];
const CHARM_OPTIONS: CharmTier[] = ['none', 'single-statement', 'a-few-accents', 'charmed-out'];

export function EffectsAddons() {
  const isMobile = useIsMobile();
  const { 
    effects, 
    accentNails, 
    addEffect, 
    removeEffect,
    rhinestoneTier,
    charmTier,
    charmPreferences,
    setRhinestoneTier,
    setCharmTier,
    setCharmPreferences
  } = useCustomStudioStore();

  // Use mobile flow on mobile devices
  if (isMobile) {
    return <EffectsAddonsMobile />;
  }

  const getEffectScope = (effectType: EffectType): EffectScope => {
    const effect = effects.find(e => e.effect === effectType);
    if (!effect) return 'none';
    return effect.scope;
  };

  const handleScopeChange = (effectType: EffectType, scope: EffectScope) => {
    if (scope === 'none') {
      removeEffect(effectType);
    } else {
      // Fix 3: Don't include nails property - use current accentNails.size in pricing
      addEffect({ effect: effectType, scope });
    }
  };

  const accentCount = accentNails.size;
  const hasAccents = accentCount > 0;

  return (
    <div className="space-y-8">
      {/* Effects Section */}
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Effects</h3>
          <p className="text-sm text-muted-foreground">Add special finishes to your nails</p>
        </div>

        <div className="space-y-4">
          {EFFECT_CONFIG.map(({ type, icon: Icon, description }) => {
            const currentScope = getEffectScope(type);
            const pricing = EFFECTS_PRICES[type];
            const accentPrice = pricing.perNail * accentCount;

            return (
              <div 
                key={type}
                className={cn(
                  "rounded-lg border p-4 transition-colors",
                  currentScope !== 'none' 
                    ? "border-primary bg-primary/5" 
                    : "border-border bg-card"
                )}
              >
                {/* Effect Header */}
                <div className="flex items-start gap-3 mb-3">
                  <div className={cn(
                    "p-2 rounded-lg",
                    currentScope !== 'none' ? "bg-primary/10" : "bg-muted"
                  )}>
                    <Icon className={cn(
                      "h-5 w-5",
                      currentScope !== 'none' ? "text-primary" : "text-muted-foreground"
                    )} />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">{EFFECT_LABELS[type]}</h4>
                    <p className="text-sm text-muted-foreground">{description}</p>
                  </div>
                </div>

                {/* Scope Options */}
                <div className="flex flex-wrap gap-2">
                  {/* None Option */}
                  <button
                    onClick={() => handleScopeChange(type, 'none')}
                    className={cn(
                      "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                      currentScope === 'none'
                        ? "bg-muted text-foreground"
                        : "bg-transparent text-muted-foreground hover:bg-muted/50"
                    )}
                  >
                    None
                  </button>

                  {/* All Nails Option */}
                  <button
                    onClick={() => handleScopeChange(type, 'all')}
                    className={cn(
                      "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                      currentScope === 'all'
                        ? "bg-primary text-primary-foreground"
                        : "bg-transparent text-muted-foreground hover:bg-muted/50 border border-border"
                    )}
                  >
                    All Nails <span className="ml-1 opacity-80">${pricing.allNails}</span>
                  </button>

                  {/* Accent Only Option */}
                  <button
                    onClick={() => hasAccents && handleScopeChange(type, 'accents-only')}
                    disabled={!hasAccents}
                    className={cn(
                      "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                      currentScope === 'accents-only'
                        ? "bg-primary text-primary-foreground"
                        : hasAccents
                          ? "bg-transparent text-muted-foreground hover:bg-muted/50 border border-border"
                          : "bg-transparent text-muted-foreground/50 border border-border/50 cursor-not-allowed"
                    )}
                    title={!hasAccents ? "Select accent nails first" : undefined}
                  >
                    Accent Only{' '}
                    <span className="ml-1 opacity-80">
                      ${pricing.perNail}/nail
                      {hasAccents && currentScope === 'accents-only' && (
                        <span className="ml-1">= ${accentPrice}</span>
                      )}
                    </span>
                  </button>
                </div>

                {/* Accent count indicator */}
                {currentScope === 'accents-only' && hasAccents && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Applied to {accentCount} accent nail{accentCount !== 1 ? 's' : ''}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* No accents warning */}
        {!hasAccents && (
          <p className="text-sm text-muted-foreground italic">
            Select accent nails in the previous step to enable per-nail effect pricing.
          </p>
        )}
      </div>

      {/* Rhinestones Section - Fix 2 */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Gem className="w-5 h-5 text-primary" />
          <div>
            <h3 className="text-lg font-semibold text-foreground">Rhinestones</h3>
            <p className="text-sm text-muted-foreground">Add sparkle with rhinestone embellishments</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {RHINESTONE_OPTIONS.map((tier) => {
            const isSelected = rhinestoneTier === tier;
            const price = RHINESTONE_PRICES[tier];
            
            return (
              <button
                key={tier}
                onClick={() => setRhinestoneTier(tier)}
                className={cn(
                  "flex flex-col items-center gap-1.5 p-4 rounded-lg border-2 transition-all",
                  isSelected
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                )}
              >
                <span className="font-medium text-foreground">{RHINESTONE_LABELS[tier]}</span>
                <span className={cn(
                  "text-sm",
                  isSelected ? "text-primary font-semibold" : "text-muted-foreground"
                )}>
                  {price > 0 ? `+$${price}` : 'Free'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Charms Section - Fix 2 */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-primary" />
          <div>
            <h3 className="text-lg font-semibold text-foreground">Charms</h3>
            <p className="text-sm text-muted-foreground">Add 3D charms to your nails</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {CHARM_OPTIONS.map((tier) => {
            const isSelected = charmTier === tier;
            const price = CHARM_PRICES[tier];
            
            return (
              <button
                key={tier}
                onClick={() => setCharmTier(tier)}
                className={cn(
                  "flex flex-col items-center gap-1.5 p-4 rounded-lg border-2 transition-all",
                  isSelected
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                )}
              >
                <span className="font-medium text-foreground">{CHARM_LABELS[tier]}</span>
                <span className={cn(
                  "text-sm",
                  isSelected ? "text-primary font-semibold" : "text-muted-foreground"
                )}>
                  {price > 0 ? `+$${price}` : 'Free'}
                </span>
              </button>
            );
          })}
        </div>

        {/* Charm Preferences Textarea - Only show when charm tier is not 'none' */}
        {charmTier !== 'none' && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Charm Preferences (optional)
            </label>
            <Textarea
              value={charmPreferences}
              onChange={(e) => setCharmPreferences(e.target.value)}
              placeholder="Tell us about your charm preferences... e.g., 'gold butterflies', 'silver hearts', 'cute bows'"
              className="min-h-[80px] resize-none"
            />
          </div>
        )}
      </div>
    </div>
  );
}
