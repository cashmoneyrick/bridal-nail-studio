import { Check } from 'lucide-react';
import { useCustomStudioStore } from '@/stores/customStudioStore';
import { SHAPE_PRICES, SHAPE_LABELS, ShapeType } from '@/lib/pricing';
import { cn } from '@/lib/utils';

interface ShapeCardProps {
  onNext: () => void;
}

const shapes: ShapeType[] = ['almond', 'square', 'oval', 'coffin', 'stiletto'];

const ShapeIcon = ({ shape, isSelected }: { shape: ShapeType; isSelected: boolean }) => {
  const paths: Record<ShapeType, string> = {
    almond: 'M20 45 Q20 10 50 5 Q80 10 80 45 Q80 70 50 85 Q20 70 20 45',
    square: 'M15 50 L15 15 Q15 10 20 10 L80 10 Q85 10 85 15 L85 50 Q85 80 50 90 Q15 80 15 50',
    oval: 'M20 50 Q20 15 50 10 Q80 15 80 50 Q80 85 50 90 Q20 85 20 50',
    coffin: 'M20 50 L25 15 Q25 10 30 10 L70 10 Q75 10 75 15 L80 50 Q75 85 50 90 Q25 85 20 50',
    stiletto: 'M25 45 Q25 15 50 5 Q75 15 75 45 Q70 75 50 95 Q30 75 25 45',
  };

  return (
    <svg viewBox="0 0 100 100" className="w-14 h-18 md:w-16 md:h-20">
      <path
        d={paths[shape]}
        fill={isSelected ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground) / 0.15)'}
        stroke={isSelected ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground) / 0.35)'}
        strokeWidth="2"
        className="transition-colors duration-200"
      />
    </svg>
  );
};

export function ShapeCard({ onNext }: ShapeCardProps) {
  const { shape: selectedShape, setShape } = useCustomStudioStore();

  const handleSelect = (shape: ShapeType) => {
    setShape(shape);
    setTimeout(onNext, 400);
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-3">
        <h2 className="font-display text-3xl md:text-4xl text-foreground">
          What shape speaks to you?
        </h2>
        <p className="text-muted-foreground">
          The foundation of your perfect set
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {shapes.slice(0, 4).map((shape) => {
          const isSelected = selectedShape === shape;
          const price = SHAPE_PRICES[shape];

          return (
            <button
              key={shape}
              onClick={() => handleSelect(shape)}
              className={cn(
                'relative flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all duration-200',
                isSelected
                  ? 'border-primary bg-primary/5 scale-[1.02] shadow-sm'
                  : 'border-border hover:border-primary/40 active:scale-[0.98]'
              )}
            >
              {isSelected && (
                <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                  <Check className="w-3 h-3 text-primary-foreground" />
                </div>
              )}
              <ShapeIcon shape={shape} isSelected={isSelected} />
              <span className="font-medium text-foreground">{SHAPE_LABELS[shape]}</span>
              {price > 0 && (
                <span className="text-xs text-primary font-medium">+${price}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* 5th shape centered */}
      <div className="flex justify-center">
        {(() => {
          const shape = shapes[4];
          const isSelected = selectedShape === shape;
          const price = SHAPE_PRICES[shape];

          return (
            <button
              onClick={() => handleSelect(shape)}
              className={cn(
                'relative flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all duration-200 w-[calc(50%-6px)]',
                isSelected
                  ? 'border-primary bg-primary/5 scale-[1.02] shadow-sm'
                  : 'border-border hover:border-primary/40 active:scale-[0.98]'
              )}
            >
              {isSelected && (
                <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                  <Check className="w-3 h-3 text-primary-foreground" />
                </div>
              )}
              <ShapeIcon shape={shape} isSelected={isSelected} />
              <span className="font-medium text-foreground">{SHAPE_LABELS[shape]}</span>
              {price > 0 && (
                <span className="text-xs text-primary font-medium">+${price}</span>
              )}
            </button>
          );
        })()}
      </div>
    </div>
  );
}

export default ShapeCard;
