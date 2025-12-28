import { cn } from '@/lib/utils';
import { useCustomStudioStore } from '@/stores/customStudioStore';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  FingerIndex,
  FINGER_NAMES,
  LEFT_HAND,
  RIGHT_HAND,
} from '@/lib/pricing';

const FINGER_SHORT_LABELS: Record<FingerIndex, string> = {
  0: 'P',
  1: 'R',
  2: 'M',
  3: 'I',
  4: 'T',
  5: 'T',
  6: 'I',
  7: 'M',
  8: 'R',
  9: 'P',
};

const DEFAULT_NUDE = '#F5E6E0';

interface AccentNailSelectorProps {
  onContinue: () => void;
}

const AccentNailSelector = ({ onContinue }: AccentNailSelectorProps) => {
  const { accentNails, nailColors, shape, toggleAccentNail } = useCustomStudioStore();

  const getNailPath = (shapeType: string) => {
    switch (shapeType) {
      case 'almond':
        return 'M 10 50 Q 10 25 25 10 Q 50 0 75 10 Q 90 25 90 50 L 90 100 L 10 100 Z';
      case 'coffin':
        return 'M 15 50 L 20 10 L 80 10 L 85 50 L 85 100 L 15 100 Z';
      case 'stiletto':
        return 'M 10 60 Q 10 30 50 0 Q 90 30 90 60 L 90 100 L 10 100 Z';
      case 'square':
        return 'M 10 20 L 10 100 L 90 100 L 90 20 Q 90 10 80 10 L 20 10 Q 10 10 10 20 Z';
      case 'round':
        return 'M 10 40 Q 10 10 50 10 Q 90 10 90 40 L 90 100 L 10 100 Z';
      case 'oval':
      default:
        return 'M 10 35 Q 10 10 50 10 Q 90 10 90 35 L 90 100 L 10 100 Z';
    }
  };

  const renderNail = (fingerIndex: FingerIndex) => {
    const isAccent = accentNails.has(fingerIndex);
    const color = nailColors[fingerIndex] || DEFAULT_NUDE;

    return (
      <button
        key={fingerIndex}
        onClick={() => toggleAccentNail(fingerIndex)}
        className="flex flex-col items-center gap-1.5 group"
      >
        <div
          className={cn(
            'relative transition-all duration-200',
            isAccent ? 'scale-110' : 'hover:scale-105'
          )}
        >
          <svg
            width="52"
            height="70"
            viewBox="0 0 100 110"
            className={cn(
              'transition-all duration-200',
              isAccent
                ? 'drop-shadow-lg'
                : 'drop-shadow-sm'
            )}
          >
            <path
              d={getNailPath(shape || 'oval')}
              fill={color}
              stroke={isAccent ? 'hsl(var(--primary))' : 'hsl(var(--border))'}
              strokeWidth={isAccent ? 4 : 2}
              className="transition-all duration-200"
            />
          </svg>
          {isAccent && (
            <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center shadow-md">
              <Check className="w-3 h-3 text-primary-foreground" />
            </div>
          )}
        </div>
        <span className={cn(
          'text-xs font-medium transition-colors',
          isAccent ? 'text-primary' : 'text-muted-foreground'
        )}>
          {FINGER_SHORT_LABELS[fingerIndex]}
        </span>
      </button>
    );
  };

  const selectedFingerNames = Array.from(accentNails)
    .sort((a, b) => a - b)
    .map(i => FINGER_NAMES[i]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold text-foreground">
          Select Accent Nails
        </h2>
        <p className="text-sm text-muted-foreground">
          Tap the nails you want to customize
        </p>
      </div>

      {/* Left Hand */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-center text-muted-foreground uppercase tracking-wide">
          Left Hand
        </h3>
        <div className="flex justify-center gap-2">
          {LEFT_HAND.map((fingerIndex) => renderNail(fingerIndex as FingerIndex))}
        </div>
      </div>

      {/* Right Hand */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-center text-muted-foreground uppercase tracking-wide">
          Right Hand
        </h3>
        <div className="flex justify-center gap-2">
          {RIGHT_HAND.map((fingerIndex) => renderNail(fingerIndex as FingerIndex))}
        </div>
      </div>

      {/* Selection Counter */}
      <div className="text-center space-y-1">
        <p className={cn(
          'text-sm font-medium',
          accentNails.size > 0 ? 'text-primary' : 'text-muted-foreground'
        )}>
          {accentNails.size} nail{accentNails.size !== 1 ? 's' : ''} selected
        </p>
        {accentNails.size > 0 && (
          <p className="text-xs text-muted-foreground">
            {selectedFingerNames.join(', ')}
          </p>
        )}
      </div>

      {/* Continue Button */}
      <Button
        onClick={onContinue}
        disabled={accentNails.size === 0}
        className="w-full"
        size="lg"
      >
        Continue to Configure
      </Button>
    </div>
  );
};

export default AccentNailSelector;
