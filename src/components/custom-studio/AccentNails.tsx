import { cn } from '@/lib/utils';
import { useCustomStudioStore } from '@/stores/customStudioStore';
import { Check } from 'lucide-react';
import {
  FingerIndex,
  FINGER_NAMES,
  LEFT_HAND,
  RIGHT_HAND,
} from '@/lib/pricing';

// Short labels for fingers
const FINGER_SHORT_LABELS: Record<FingerIndex, string> = {
  0: 'Pinky',
  1: 'Ring',
  2: 'Middle',
  3: 'Index',
  4: 'Thumb',
  5: 'Thumb',
  6: 'Index',
  7: 'Middle',
  8: 'Ring',
  9: 'Pinky',
};

const AccentNails = () => {
  const {
    hasAccentNails,
    accentNails,
    nailColors,
    setHasAccentNails,
    toggleAccentNail,
  } = useCustomStudioStore();

  const renderNail = (fingerIndex: FingerIndex) => {
    const isAccent = accentNails.has(fingerIndex);
    const color = nailColors[fingerIndex] || '#E8D4C4';

    return (
      <button
        key={fingerIndex}
        onClick={() => toggleAccentNail(fingerIndex)}
        className="flex flex-col items-center gap-2 group"
      >
        {/* Nail shape */}
        <div
          className={cn(
            'relative w-10 h-14 rounded-t-full border-2 transition-all shadow-sm',
            isAccent
              ? 'border-primary ring-2 ring-primary/30 scale-110'
              : 'border-border hover:border-primary/50 hover:scale-105'
          )}
          style={{ backgroundColor: color }}
        >
          {isAccent && (
            <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
              <Check className="w-3 h-3 text-primary-foreground" />
            </div>
          )}
        </div>
        {/* Finger label */}
        <span className={cn(
          'text-xs transition-colors',
          isAccent ? 'text-primary font-medium' : 'text-muted-foreground'
        )}>
          {FINGER_SHORT_LABELS[fingerIndex]}
        </span>
      </button>
    );
  };

  return (
    <div className="space-y-6">
      {/* Yes/No Toggle */}
      <div className="space-y-3">
        <h3 className="font-medium text-sm uppercase tracking-wide text-muted-foreground">
          Would you like any accent nails?
        </h3>
        <p className="text-sm text-muted-foreground">
          Accent nails can have different finishes, colors, or effects from the rest of your set.
        </p>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setHasAccentNails(false)}
            className={cn(
              'relative flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all',
              !hasAccentNails
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50'
            )}
          >
            {!hasAccentNails && (
              <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                <Check className="w-3 h-3 text-primary-foreground" />
              </div>
            )}
            <span className="font-medium">No, keep them uniform</span>
            <span className="text-xs text-muted-foreground">All nails match</span>
          </button>
          <button
            onClick={() => setHasAccentNails(true)}
            className={cn(
              'relative flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all',
              hasAccentNails
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50'
            )}
          >
            {hasAccentNails && (
              <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                <Check className="w-3 h-3 text-primary-foreground" />
              </div>
            )}
            <span className="font-medium">Yes, add accent nails</span>
            <span className="text-xs text-muted-foreground">Customize specific nails</span>
          </button>
        </div>
      </div>

      {/* Hand Selector - Only visible when hasAccentNails is true */}
      {hasAccentNails && (
        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-medium text-sm uppercase tracking-wide text-muted-foreground">
              Select accent nails
            </h3>
            <p className="text-sm text-muted-foreground">
              Tap the nails you want to customize as accents. Selected: {accentNails.size} nail{accentNails.size !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-8 justify-center">
            {/* Left Hand */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-center text-muted-foreground">Left Hand</h4>
              <div className="flex gap-3 justify-center">
                {LEFT_HAND.map((fingerIndex) => renderNail(fingerIndex as FingerIndex))}
              </div>
            </div>

            {/* Right Hand */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-center text-muted-foreground">Right Hand</h4>
              <div className="flex gap-3 justify-center">
                {RIGHT_HAND.map((fingerIndex) => renderNail(fingerIndex as FingerIndex))}
              </div>
            </div>
          </div>

          {accentNails.size > 0 && (
            <p className="text-sm text-center text-muted-foreground mt-4">
              Selected accents: {Array.from(accentNails).map(i => FINGER_NAMES[i]).join(', ')}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default AccentNails;
