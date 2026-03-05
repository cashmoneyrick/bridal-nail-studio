import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCustomStudioStore } from '@/stores/customStudioStore';
import {
  ShapeType,
  LengthType,
  FinishType,
  SHAPE_PRICES,
  SHAPE_LABELS,
  LENGTH_PRICES,
  LENGTH_LABELS,
  FINISH_PRICES,
  FINISH_LABELS,
} from '@/lib/pricing';
import { cn } from '@/lib/utils';

interface BasicsStepProps {
  onNext: () => void;
}

const shapes: ShapeType[] = ['almond', 'square', 'oval', 'coffin', 'stiletto'];
const lengths: LengthType[] = ['short', 'medium', 'long', 'extra-long'];
const finishes: FinishType[] = ['glossy', 'matte'];

const shapePaths: Record<ShapeType, string> = {
  almond: 'M20 45 Q20 10 50 5 Q80 10 80 45 Q80 70 50 85 Q20 70 20 45',
  square: 'M15 50 L15 15 Q15 10 20 10 L80 10 Q85 10 85 15 L85 50 Q85 80 50 90 Q15 80 15 50',
  oval: 'M20 50 Q20 15 50 10 Q80 15 80 50 Q80 85 50 90 Q20 85 20 50',
  coffin: 'M20 50 L25 15 Q25 10 30 10 L70 10 Q75 10 75 15 L80 50 Q75 85 50 90 Q25 85 20 50',
  stiletto: 'M25 45 Q25 15 50 5 Q75 15 75 45 Q70 75 50 95 Q30 75 25 45',
};

const finishDescriptions: Record<FinishType, string> = {
  glossy: 'High shine',
  matte: 'Velvet soft',
};

export function BasicsStep({ onNext }: BasicsStepProps) {
  const { shape, length, finish, setShape, setLength, setFinish, canAdvance } =
    useCustomStudioStore();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="font-studio-display text-4xl md:text-5xl font-light text-foreground">
          Your nail basics
        </h1>
        <p className="font-studio-body text-muted-foreground">The foundation of your set</p>
      </div>

      {/* Shape */}
      <div className="space-y-3">
        <label className="font-studio-body text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
          Shape
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
          {shapes.map((s) => {
            const isSelected = shape === s;
            const price = SHAPE_PRICES[s];
            return (
              <button
                key={s}
                onClick={() => setShape(s)}
                className={cn(
                  'relative flex flex-col items-center gap-2 p-3 transition-all duration-250 card-soft',
                  isSelected
                    ? 'card-soft-selected scale-[1.02]'
                    : 'hover:-translate-y-0.5 active:scale-[0.98]'
                )}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 text-primary-foreground" />
                  </div>
                )}
                <svg viewBox="0 0 100 100" className="w-10 h-14">
                  <path
                    d={shapePaths[s]}
                    fill={isSelected ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground) / 0.12)'}
                    stroke={isSelected ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground) / 0.25)'}
                    strokeWidth="1.5"
                    className="transition-colors duration-250"
                  />
                </svg>
                <span className="font-studio-body text-xs font-medium text-foreground">
                  {SHAPE_LABELS[s]}
                </span>
                {price > 0 && (
                  <span className="font-studio-body text-[10px] text-primary font-medium">+${price}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Length — pill buttons */}
      <div className="space-y-3">
        <label className="font-studio-body text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
          Length
        </label>
        <div className="flex flex-wrap gap-2">
          {lengths.map((l) => {
            const isSelected = length === l;
            const price = LENGTH_PRICES[l];
            return (
              <button
                key={l}
                onClick={() => setLength(l)}
                className={cn(
                  'flex items-center gap-2 py-2.5 px-5 rounded-full transition-all duration-200 font-studio-body text-sm',
                  isSelected
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'bg-studio-cream-dark text-foreground hover:bg-studio-taupe-light/40'
                )}
              >
                <span className="font-medium">{LENGTH_LABELS[l]}</span>
                {price > 0 && (
                  <span className={cn('text-[10px]', isSelected ? 'text-primary-foreground/80' : 'text-primary')}>
                    +${price}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Finish */}
      <div className="space-y-3">
        <label className="font-studio-body text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
          Finish
        </label>
        <div className="grid grid-cols-2 gap-3">
          {finishes.map((f) => {
            const isSelected = finish === f;
            const price = FINISH_PRICES[f];
            return (
              <button
                key={f}
                onClick={() => setFinish(f)}
                className={cn(
                  'flex flex-col items-center gap-3 p-5 transition-all duration-250 card-soft',
                  isSelected
                    ? 'card-soft-selected'
                    : 'hover:-translate-y-0.5'
                )}
              >
                <div
                  className={cn(
                    'w-14 h-14 rounded-full',
                    f === 'glossy'
                      ? 'bg-gradient-to-br from-white via-gray-50 to-gray-200 shadow-[inset_0_-3px_6px_rgba(0,0,0,0.08),0_2px_8px_rgba(0,0,0,0.06)]'
                      : 'bg-gradient-to-br from-stone-200 via-stone-300 to-stone-400 shadow-[inset_0_1px_3px_rgba(255,255,255,0.3)]'
                  )}
                />
                <span className="font-studio-body text-sm font-medium text-foreground">
                  {FINISH_LABELS[f]}
                </span>
                <span className="font-studio-body text-xs text-muted-foreground">
                  {finishDescriptions[f]}
                </span>
                {price > 0 && (
                  <span className="font-studio-body text-[10px] text-primary font-medium">+${price}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Continue */}
      <Button
        onClick={onNext}
        disabled={!canAdvance()}
        className="w-full rounded-full h-12 text-base font-studio-body font-medium"
      >
        Continue
      </Button>
    </div>
  );
}

export default BasicsStep;
