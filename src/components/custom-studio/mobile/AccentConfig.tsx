import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useCustomStudioStore } from '@/stores/customStudioStore';
import { Check, ChevronDown, ChevronRight } from 'lucide-react';
import {
  FingerIndex,
  FINGER_NAMES,
  FINISH_LABELS,
  ACCENT_FINISH_CHANGE_PRICE,
  FinishType,
} from '@/lib/pricing';

const DEFAULT_NUDE = '#F5E6E0';

const AccentConfig = () => {
  const {
    accentNails,
    accentConfigs,
    nailColors,
    baseFinish,
    selectedColors,
    setAccentConfig,
    setNailColor,
  } = useCustomStudioStore();

  const sortedAccents = Array.from(accentNails).sort((a, b) => a - b);
  const [expandedNail, setExpandedNail] = useState<FingerIndex | null>(
    sortedAccents.length > 0 ? (sortedAccents[0] as FingerIndex) : null
  );

  if (sortedAccents.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No accent nails selected. Go back to select some.
      </div>
    );
  }

  const renderNailConfig = (fingerIndex: FingerIndex) => {
    const isExpanded = expandedNail === fingerIndex;
    const config = accentConfigs[fingerIndex];
    const currentFinish = config?.finish || null;
    const currentColor = nailColors[fingerIndex] || DEFAULT_NUDE;

    return (
      <div
        key={fingerIndex}
        className={cn(
          'rounded-xl border-2 transition-all duration-200 overflow-hidden',
          isExpanded ? 'border-primary bg-card' : 'border-border'
        )}
      >
        {/* Header */}
        <button
          onClick={() => setExpandedNail(isExpanded ? null : fingerIndex)}
          className="w-full flex items-center justify-between p-4 text-left"
        >
          <div className="flex items-center gap-3">
            <div
              className="w-6 h-6 rounded-full border-2 border-border shrink-0"
              style={{ backgroundColor: currentColor }}
            />
            <span className="font-medium text-foreground">{FINGER_NAMES[fingerIndex]}</span>
          </div>
          {isExpanded ? (
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          ) : (
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          )}
        </button>

        {/* Content */}
        {isExpanded && (
          <div className="px-4 pb-4 space-y-4 animate-fade-in">
            {/* Finish Options */}
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                Finish
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setAccentConfig(fingerIndex, { ...config, finish: undefined })}
                  className={cn(
                    'px-4 py-2.5 text-sm rounded-lg border-2 transition-all min-h-[44px]',
                    currentFinish === null || currentFinish === undefined
                      ? 'border-primary bg-primary/5 text-foreground font-medium'
                      : 'border-border hover:border-primary/50 text-muted-foreground'
                  )}
                >
                  Same as base ({FINISH_LABELS[baseFinish]})
                </button>
                {(['glossy', 'matte'] as FinishType[]).map((finish) => {
                  const isSelected = currentFinish === finish;
                  const isDifferentFromBase = finish !== baseFinish;
                  return (
                    <button
                      key={finish}
                      onClick={() => setAccentConfig(fingerIndex, { ...config, finish })}
                      className={cn(
                        'px-4 py-2.5 text-sm rounded-lg border-2 transition-all min-h-[44px]',
                        isSelected
                          ? 'border-primary bg-primary/5 text-foreground font-medium'
                          : 'border-border hover:border-primary/50 text-muted-foreground'
                      )}
                    >
                      {FINISH_LABELS[finish]}
                      {isDifferentFromBase && (
                        <span className="ml-1.5 text-xs text-primary font-semibold">
                          +${ACCENT_FINISH_CHANGE_PRICE}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Color Options */}
            {selectedColors.length > 0 ? (
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                  Color
                </label>
                <div className="flex flex-wrap gap-2">
                  {selectedColors.map((color, idx) => {
                    const isSelected = currentColor === color;
                    return (
                      <button
                        key={idx}
                        onClick={() => setNailColor(fingerIndex, color)}
                        className={cn(
                          'w-10 h-10 rounded-full border-2 transition-all',
                          isSelected
                            ? 'border-primary ring-2 ring-primary/30 scale-110'
                            : 'border-border hover:border-primary/50 hover:scale-105'
                        )}
                        style={{ backgroundColor: color }}
                      >
                        {isSelected && (
                          <Check className="w-4 h-4 mx-auto text-primary-foreground drop-shadow-md" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">
                Select colors in Base Look to customize accent colors.
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold text-foreground">
          Configure Your Accents
        </h2>
        <p className="text-sm text-muted-foreground">
          Customize finish and color for each accent nail
        </p>
      </div>

      <div className="space-y-3">
        {sortedAccents.map((fingerIndex) => 
          renderNailConfig(fingerIndex as FingerIndex)
        )}
      </div>
    </div>
  );
};

export default AccentConfig;
