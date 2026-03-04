import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCustomStudioStore } from '@/stores/customStudioStore';
import {
  FingerIndex,
  FINGER_NAMES,
  LEFT_HAND,
  RIGHT_HAND,
  FINISH_LABELS,
  ACCENT_FINISH_CHANGE_PRICE,
  FinishType,
} from '@/lib/pricing';

const FINGER_SHORT_LABELS: Record<FingerIndex, string> = {
  0: 'Pinky', 1: 'Ring', 2: 'Middle', 3: 'Index', 4: 'Thumb',
  5: 'Thumb', 6: 'Index', 7: 'Middle', 8: 'Ring', 9: 'Pinky',
};

export function AccentExtras() {
  const {
    accentNails,
    nailColors,
    baseFinish,
    colorPalette,
    accentConfigs,
    toggleAccentNail,
    setAccentConfig,
    setNailColor,
  } = useCustomStudioStore();

  const renderNail = (fingerIndex: FingerIndex) => {
    const isAccent = accentNails.has(fingerIndex);
    const color = nailColors[fingerIndex] || '#E8D4C4';

    return (
      <button
        key={fingerIndex}
        onClick={() => toggleAccentNail(fingerIndex)}
        className="flex flex-col items-center gap-1.5 group"
      >
        <div
          className={cn(
            'relative w-9 h-12 md:w-10 md:h-14 rounded-t-full border-2 transition-all shadow-sm',
            isAccent
              ? 'border-primary ring-2 ring-primary/30 scale-110'
              : 'border-border hover:border-primary/50 hover:scale-105'
          )}
          style={{ backgroundColor: color }}
        >
          {isAccent && (
            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
              <Check className="w-2.5 h-2.5 text-primary-foreground" />
            </div>
          )}
        </div>
        <span className={cn(
          'text-[10px] md:text-xs transition-colors',
          isAccent ? 'text-primary font-medium' : 'text-muted-foreground'
        )}>
          {FINGER_SHORT_LABELS[fingerIndex]}
        </span>
      </button>
    );
  };

  return (
    <div className="space-y-5">
      <p className="text-sm text-muted-foreground">
        Tap the nails you want to make stand out with different finishes or colors.
      </p>

      {/* Hand selector */}
      <div className="flex flex-col sm:flex-row gap-6 justify-center">
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground text-center">Left Hand</p>
          <div className="flex gap-2.5 justify-center">
            {LEFT_HAND.map((fi) => renderNail(fi as FingerIndex))}
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground text-center">Right Hand</p>
          <div className="flex gap-2.5 justify-center">
            {RIGHT_HAND.map((fi) => renderNail(fi as FingerIndex))}
          </div>
        </div>
      </div>

      {accentNails.size > 0 && (
        <p className="text-xs text-center text-muted-foreground">
          {accentNails.size} accent{accentNails.size !== 1 ? 's' : ''} selected: {Array.from(accentNails).map(i => FINGER_NAMES[i]).join(', ')}
        </p>
      )}

      {/* Per-nail config */}
      {accentNails.size > 0 && (
        <div className="space-y-3 border-t border-border pt-4">
          <p className="text-sm font-medium text-foreground">Configure accents</p>
          {Array.from(accentNails).sort((a, b) => a - b).map((fingerIndex) => {
            const config = accentConfigs[fingerIndex as FingerIndex];
            const currentFinish = config?.finish || null;
            const currentColor = nailColors[fingerIndex as FingerIndex] || '#E8D4C4';
            const paletteColors = colorPalette?.colors || [];

            return (
              <div key={fingerIndex} className="p-3 rounded-xl border bg-muted/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">{FINGER_NAMES[fingerIndex]}</span>
                  <div
                    className="w-5 h-5 rounded-full border border-border"
                    style={{ backgroundColor: currentColor }}
                  />
                </div>

                {/* Finish */}
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => setAccentConfig(fingerIndex as FingerIndex, { ...config, finish: undefined })}
                    className={cn(
                      'px-2.5 py-1 text-xs rounded-lg border transition-all',
                      !currentFinish
                        ? 'border-primary bg-primary/5 text-foreground'
                        : 'border-border text-muted-foreground hover:border-primary/50'
                    )}
                  >
                    Same as base
                  </button>
                  {(['glossy', 'matte'] as FinishType[]).map((finish) => (
                    <button
                      key={finish}
                      onClick={() => setAccentConfig(fingerIndex as FingerIndex, { ...config, finish })}
                      className={cn(
                        'px-2.5 py-1 text-xs rounded-lg border transition-all',
                        currentFinish === finish
                          ? 'border-primary bg-primary/5 text-foreground'
                          : 'border-border text-muted-foreground hover:border-primary/50'
                      )}
                    >
                      {FINISH_LABELS[finish]}
                      {finish !== baseFinish && (
                        <span className="ml-1 text-primary">+${ACCENT_FINISH_CHANGE_PRICE}</span>
                      )}
                    </button>
                  ))}
                </div>

                {/* Color */}
                {paletteColors.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {paletteColors.map((color, idx) => {
                      const isSelected = currentColor === color;
                      return (
                        <button
                          key={idx}
                          onClick={() => setNailColor(fingerIndex as FingerIndex, color)}
                          className={cn(
                            'w-7 h-7 rounded-full border-2 transition-all',
                            isSelected
                              ? 'border-primary ring-2 ring-primary/20 scale-110'
                              : 'border-border hover:border-primary/50 hover:scale-105'
                          )}
                          style={{ backgroundColor: color }}
                        >
                          {isSelected && (
                            <Check className="w-3 h-3 mx-auto text-primary-foreground drop-shadow-md" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default AccentExtras;
