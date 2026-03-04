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
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="font-display text-3xl md:text-4xl text-foreground">
          Any extras?
        </h1>
        <p className="text-muted-foreground">
          All optional — skip if you want to keep it simple
        </p>
      </div>

      {/* Effects */}
      <div className="space-y-3">
        <label className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Special Finishes
        </label>
        <div className="space-y-2">
          {EFFECTS.map(({ id, label, price, icon: Icon }) => {
            const isActive = effects.includes(id);
            return (
              <button
                key={id}
                onClick={() => toggleEffect(id)}
                className={cn(
                  'w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 text-left',
                  isActive
                    ? 'border-primary/30 bg-primary/5'
                    : 'border-border hover:border-primary/30'
                )}
              >
                <Icon className={cn('w-5 h-5 flex-shrink-0', isActive ? 'text-primary' : 'text-muted-foreground')} />
                <span className="flex-1 font-medium text-foreground">{label}</span>
                <span className="text-sm text-muted-foreground">+${price}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Rhinestones */}
      <div className="space-y-3">
        <label className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Rhinestones
        </label>
        <div className="grid grid-cols-2 gap-2">
          {RHINESTONE_OPTIONS.map(({ level, label, price }) => (
            <button
              key={level}
              onClick={() => setRhinestones(level)}
              className={cn(
                'flex flex-col items-center gap-1 py-3 px-2 rounded-xl border-2 transition-all duration-200',
                rhinestones === level
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/40'
              )}
            >
              <span className="text-sm font-medium text-foreground">{label}</span>
              {price > 0 && (
                <span className="text-[10px] text-primary font-medium">+${price}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Charms */}
      <div className="space-y-3">
        <label className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Charms
        </label>
        <div className="grid grid-cols-3 gap-2">
          {CHARM_OPTIONS.map(({ level, label, price }) => (
            <button
              key={level}
              onClick={() => setCharms(level)}
              className={cn(
                'flex flex-col items-center gap-1 py-3 px-2 rounded-xl border-2 transition-all duration-200',
                charms === level
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/40'
              )}
            >
              <span className="text-sm font-medium text-foreground">{label}</span>
              {price > 0 && (
                <span className="text-[10px] text-primary font-medium">+${price}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <label className="text-sm text-muted-foreground">
          Anything else we should know?
        </label>
        <Textarea
          value={extraNotes}
          onChange={(e) => setExtraNotes(e.target.value)}
          placeholder="e.g., 'gold butterfly charms', 'rhinestones on ring fingers only'"
          className="min-h-[80px] rounded-xl resize-none"
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={onNext}
          className="flex-1 rounded-xl h-12 text-base"
        >
          Skip
        </Button>
        <Button
          onClick={onNext}
          className="flex-1 rounded-xl h-12 text-base font-medium"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}

export default ExtrasStep;
