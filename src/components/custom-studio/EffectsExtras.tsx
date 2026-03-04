import { Sparkles, Star, CircleDot } from 'lucide-react';
import { useCustomStudioStore } from '@/stores/customStudioStore';
import { EffectType, EFFECTS_PRICES, EFFECT_LABELS } from '@/lib/pricing';
import { cn } from '@/lib/utils';

type EffectScope = 'none' | 'all' | 'accents-only';

const EFFECT_CONFIG: Array<{
  type: EffectType;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}> = [
  { type: 'chrome', icon: Sparkles, description: 'Metallic mirror finish' },
  { type: 'glitter', icon: Star, description: 'Sparkling glitter finish' },
  { type: 'french-tip', icon: CircleDot, description: 'Classic French manicure tip' },
];

export function EffectsExtras() {
  const { effects, accentNails, addEffect, removeEffect } = useCustomStudioStore();

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
      <p className="text-sm text-muted-foreground">
        Add special finishes to some or all of your nails.
      </p>

      {EFFECT_CONFIG.map(({ type, icon: Icon, description }) => {
        const currentScope = getEffectScope(type);
        const pricing = EFFECTS_PRICES[type];
        const accentPrice = pricing.perNail * accentCount;

        return (
          <div
            key={type}
            className={cn(
              'rounded-xl border p-4 transition-colors',
              currentScope !== 'none'
                ? 'border-primary/30 bg-primary/5'
                : 'border-border'
            )}
          >
            <div className="flex items-start gap-3 mb-3">
              <div className={cn(
                'p-1.5 rounded-lg',
                currentScope !== 'none' ? 'bg-primary/10' : 'bg-muted'
              )}>
                <Icon className={cn(
                  'h-4 w-4',
                  currentScope !== 'none' ? 'text-primary' : 'text-muted-foreground'
                )} />
              </div>
              <div>
                <h4 className="font-medium text-foreground text-sm">{EFFECT_LABELS[type]}</h4>
                <p className="text-xs text-muted-foreground">{description}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleScopeChange(type, 'none')}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                  currentScope === 'none'
                    ? 'bg-muted text-foreground'
                    : 'text-muted-foreground hover:bg-muted/50'
                )}
              >
                None
              </button>
              <button
                onClick={() => handleScopeChange(type, 'all')}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border',
                  currentScope === 'all'
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'border-border text-muted-foreground hover:bg-muted/50'
                )}
              >
                All Nails <span className="opacity-80">${pricing.allNails}</span>
              </button>
              <button
                onClick={() => hasAccents && handleScopeChange(type, 'accents-only')}
                disabled={!hasAccents}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border',
                  currentScope === 'accents-only'
                    ? 'bg-primary text-primary-foreground border-primary'
                    : hasAccents
                      ? 'border-border text-muted-foreground hover:bg-muted/50'
                      : 'border-border/50 text-muted-foreground/50 cursor-not-allowed'
                )}
              >
                Accent Only ${pricing.perNail}/nail
                {hasAccents && currentScope === 'accents-only' && (
                  <span className="ml-1">= ${accentPrice}</span>
                )}
              </button>
            </div>
          </div>
        );
      })}

      {!hasAccents && (
        <p className="text-xs text-muted-foreground italic">
          Select accent nails above to enable per-nail pricing.
        </p>
      )}
    </div>
  );
}

export default EffectsExtras;
