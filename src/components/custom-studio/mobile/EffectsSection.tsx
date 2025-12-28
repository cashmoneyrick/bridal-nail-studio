import { Sparkles, Star, CircleDot } from 'lucide-react';
import { useCustomStudioStore } from '@/stores/customStudioStore';
import { 
  EffectType, 
  EFFECTS_PRICES, 
  EFFECT_LABELS 
} from '@/lib/pricing';
import { cn } from '@/lib/utils';

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

const EffectsSection = () => {
  const { 
    effects, 
    accentNails, 
    addEffect, 
    removeEffect 
  } = useCustomStudioStore();

  const accentCount = accentNails.size;
  const hasAccents = accentCount > 0;

  const getEffectScope = (effectType: EffectType): EffectScope => {
    const effect = effects.find(e => e.effect === effectType);
    if (!effect) return 'none';
    return effect.scope;
  };

  const handleScopeChange = (effectType: EffectType, scope: EffectScope) => {
    if (scope === 'none') {
      removeEffect(effectType);
    } else {
      addEffect({ effect: effectType, scope });
    }
  };

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center gap-2">
        <span className="text-2xl">✨</span>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Effects</h3>
          <p className="text-sm text-muted-foreground">Add special finishes</p>
        </div>
      </div>

      {/* Effect Cards */}
      <div className="space-y-4">
        {EFFECT_CONFIG.map(({ type, icon: Icon, description }) => {
          const currentScope = getEffectScope(type);
          const pricing = EFFECTS_PRICES[type];
          const accentPrice = pricing.perNail * accentCount;

          return (
            <div 
              key={type}
              className={cn(
                "rounded-xl border-2 p-4 transition-all shadow-sm",
                currentScope !== 'none' 
                  ? "border-primary bg-primary/5" 
                  : "border-border bg-card"
              )}
            >
              {/* Effect Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className={cn(
                  "p-2.5 rounded-lg",
                  currentScope !== 'none' ? "bg-primary/10" : "bg-muted"
                )}>
                  <Icon className={cn(
                    "h-5 w-5",
                    currentScope !== 'none' ? "text-primary" : "text-muted-foreground"
                  )} />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">{EFFECT_LABELS[type]}</h4>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </div>
              </div>

              {/* Scope Options - Large Pill Buttons */}
              <div className="flex flex-col gap-2">
                {/* None Option */}
                <button
                  onClick={() => handleScopeChange(type, 'none')}
                  className={cn(
                    "w-full min-h-[48px] px-4 py-3 rounded-lg text-sm font-medium transition-all flex items-center justify-between",
                    currentScope === 'none'
                      ? "bg-muted text-foreground ring-2 ring-primary"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted"
                  )}
                >
                  <span>None</span>
                  <span className="text-muted-foreground">Free</span>
                </button>

                {/* All Nails Option */}
                <button
                  onClick={() => handleScopeChange(type, 'all')}
                  className={cn(
                    "w-full min-h-[48px] px-4 py-3 rounded-lg text-sm font-medium transition-all flex items-center justify-between",
                    currentScope === 'all'
                      ? "bg-primary text-primary-foreground"
                      : "bg-card text-foreground border border-border hover:border-primary/50"
                  )}
                >
                  <span>All Nails</span>
                  <span className={cn(
                    "font-semibold",
                    currentScope === 'all' ? "text-primary-foreground" : "text-primary"
                  )}>
                    +${pricing.allNails}
                  </span>
                </button>

                {/* Accents Only Option */}
                <button
                  onClick={() => hasAccents && handleScopeChange(type, 'accents-only')}
                  disabled={!hasAccents}
                  className={cn(
                    "w-full min-h-[48px] px-4 py-3 rounded-lg text-sm font-medium transition-all flex items-center justify-between",
                    currentScope === 'accents-only'
                      ? "bg-primary text-primary-foreground"
                      : hasAccents
                        ? "bg-card text-foreground border border-border hover:border-primary/50"
                        : "bg-muted/30 text-muted-foreground/50 border border-border/50 cursor-not-allowed"
                  )}
                >
                  <div className="flex flex-col items-start">
                    <span>Accents Only</span>
                    {!hasAccents && (
                      <span className="text-xs text-muted-foreground/50">Select accent nails first</span>
                    )}
                  </div>
                  <div className="text-right">
                    <span className={cn(
                      "font-semibold",
                      currentScope === 'accents-only' ? "text-primary-foreground" : hasAccents ? "text-primary" : "text-muted-foreground/50"
                    )}>
                      ${pricing.perNail}/nail
                    </span>
                    {hasAccents && (
                      <span className={cn(
                        "text-xs block",
                        currentScope === 'accents-only' ? "text-primary-foreground/80" : "text-muted-foreground"
                      )}>
                        = ${accentPrice} for {accentCount} nail{accentCount !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EffectsSection;
