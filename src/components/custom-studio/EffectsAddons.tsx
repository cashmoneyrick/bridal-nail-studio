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

export function EffectsAddons() {
  const { effects, accentNails, addEffect, removeEffect } = useCustomStudioStore();

  const getEffectScope = (effectType: EffectType): EffectScope => {
    const effect = effects.find(e => e.effect === effectType);
    if (!effect) return 'none';
    return effect.scope;
  };

  const handleScopeChange = (effectType: EffectType, scope: EffectScope) => {
    if (scope === 'none') {
      removeEffect(effectType);
    } else {
      addEffect({ 
        effect: effectType, 
        scope, 
        nails: scope === 'accents-only' ? new Set(accentNails) : undefined 
      });
    }
  };

  const accentCount = accentNails.size;
  const hasAccents = accentCount > 0;

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div>
        <h3 className="text-lg font-semibold text-foreground">Effects</h3>
        <p className="text-sm text-muted-foreground">Add special finishes to your nails</p>
      </div>

      {/* Effects List */}
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
  );
}
