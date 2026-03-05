import { Sparkles, Gem, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useCustomStudioStore, EffectOption, RhinestoneLevel, CharmLevel } from '@/stores/customStudioStore';
import { cn } from '@/lib/utils';

interface ExtrasStepProps {
  onNext: () => void;
}

const EFFECTS: { id: EffectOption; label: string; price: number; icon: typeof Sparkles }[] = [
  { id: 'chrome', label: 'Chrome', price: 15, icon: Sparkles },
  { id: 'glitter', label: 'Glitter', price: 12, icon: Star },
  { id: 'french', label: 'French Tips', price: 10, icon: Gem },
];

const RHINESTONE_OPTIONS: { level: RhinestoneLevel; label: string; price: number }[] = [
  { level: 'none', label: 'None', price: 0 },
  { level: 'subtle', label: 'Subtle', price: 3 },
  { level: 'medium', label: 'Medium', price: 8 },
  { level: 'heavy', label: 'Heavy', price: 18 },
];

const CHARM_OPTIONS: { level: CharmLevel; label: string; price: number }[] = [
  { level: 'none', label: 'None', price: 0 },
  { level: 'few', label: 'A Few', price: 5 },
  { level: 'lots', label: 'Lots', price: 20 },
];

export function ExtrasStep({ onNext }: ExtrasStepProps) {
  const {
    effects,
    rhinestones,
    charms,
    extraNotes,
    toggleEffect,
    setRhinestones,
    setCharms,
    setExtraNotes,
  } = useCustomStudioStore();

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="font-studio-display text-4xl md:text-5xl font-light text-foreground">
          Any extras?
        </h1>
        <p className="font-studio-body text-muted-foreground">
          All optional — skip if you want to keep it simple
        </p>
      </div>

      {/* Effects — horizontal cards */}
      <div className="space-y-3">
        <label className="font-studio-body text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
          Special Finishes
        </label>
        <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
          {EFFECTS.map(({ id, label, price, icon: Icon }) => {
            const isActive = effects.includes(id);
            return (
              <button
                key={id}
                onClick={() => toggleEffect(id)}
                className={cn(
                  'min-w-[110px] flex flex-col items-center gap-2.5 p-4 transition-all duration-250 card-soft',
                  isActive
                    ? 'card-soft-selected'
                    : 'hover:-translate-y-0.5'
                )}
              >
                <Icon className={cn('w-5 h-5', isActive ? 'text-primary' : 'text-muted-foreground')} />
                <span className="font-studio-body text-sm font-medium text-foreground">{label}</span>
                <span className="font-studio-body text-xs text-muted-foreground">+${price}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Rhinestones — pill buttons */}
      <div className="space-y-3">
        <label className="font-studio-body text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
          Rhinestones
        </label>
        <div className="flex flex-wrap gap-2">
          {RHINESTONE_OPTIONS.map(({ level, label, price }) => (
            <button
              key={level}
              onClick={() => setRhinestones(level)}
              className={cn(
                'flex items-center gap-1.5 py-2.5 px-5 rounded-full transition-all duration-200 font-studio-body text-sm',
                rhinestones === level
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-studio-cream-dark text-foreground hover:bg-studio-taupe-light/40'
              )}
            >
              <span className="font-medium">{label}</span>
              {price > 0 && (
                <span className={cn('text-[10px]', rhinestones === level ? 'text-primary-foreground/80' : 'text-primary')}>
                  +${price}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Charms — pill buttons */}
      <div className="space-y-3">
        <label className="font-studio-body text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
          Charms
        </label>
        <div className="flex flex-wrap gap-2">
          {CHARM_OPTIONS.map(({ level, label, price }) => (
            <button
              key={level}
              onClick={() => setCharms(level)}
              className={cn(
                'flex items-center gap-1.5 py-2.5 px-5 rounded-full transition-all duration-200 font-studio-body text-sm',
                charms === level
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-studio-cream-dark text-foreground hover:bg-studio-taupe-light/40'
              )}
            >
              <span className="font-medium">{label}</span>
              {price > 0 && (
                <span className={cn('text-[10px]', charms === level ? 'text-primary-foreground/80' : 'text-primary')}>
                  +${price}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <label className="font-studio-body text-sm text-muted-foreground">
          Anything else we should know?
        </label>
        <Textarea
          value={extraNotes}
          onChange={(e) => setExtraNotes(e.target.value)}
          placeholder="e.g., 'gold butterfly charms', 'rhinestones on ring fingers only'"
          className="min-h-[80px] rounded-2xl resize-none bg-studio-cream-dark/30 border-studio-taupe-light/60 focus:border-primary font-studio-body placeholder:text-studio-taupe/60"
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          onClick={onNext}
          className="flex-1 rounded-full h-12 text-base font-studio-body text-studio-taupe hover:text-foreground transition-colors duration-200"
        >
          Skip this step
        </button>
        <Button
          onClick={onNext}
          className="flex-1 rounded-full h-12 text-base font-studio-body font-medium"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}

export default ExtrasStep;
