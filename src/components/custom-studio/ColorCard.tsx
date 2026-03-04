import { Check } from 'lucide-react';
import { useCustomStudioStore } from '@/stores/customStudioStore';
import { COLOR_PALETTES, PresetColorPalette, FingerIndex } from '@/lib/pricing';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface ColorCardProps {
  onNext: () => void;
}

export function ColorCard({ onNext }: ColorCardProps) {
  const { colorPalette, setColorPalette, setNailColor, addSelectedColor } = useCustomStudioStore();

  const handlePaletteSelect = (palette: PresetColorPalette) => {
    setColorPalette({ name: palette.name, colors: palette.colors });
    // Auto-assign colors to all 10 nails
    for (let i = 0; i < 10; i++) {
      const colorIndex = i % palette.colors.length;
      setNailColor(i as FingerIndex, palette.colors[colorIndex]);
      addSelectedColor(palette.colors[colorIndex]);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-3">
        <h2 className="font-display text-3xl md:text-4xl text-foreground">
          Select your color palette
        </h2>
        <p className="text-muted-foreground">
          Curated color stories for every mood
        </p>
      </div>

      <div className="space-y-3">
        {COLOR_PALETTES.map((palette) => {
          const isSelected = colorPalette?.name === palette.name;

          return (
            <button
              key={palette.id}
              onClick={() => handlePaletteSelect(palette)}
              className={cn(
                'relative w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-200 text-left',
                isSelected
                  ? 'border-primary bg-primary/5 shadow-sm'
                  : 'border-border hover:border-primary/40 active:scale-[0.99]'
              )}
            >
              {isSelected && (
                <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                  <Check className="w-3 h-3 text-primary-foreground" />
                </div>
              )}
              {/* Color swatches */}
              <div className="flex gap-1.5 shrink-0">
                {palette.colors.map((color, index) => (
                  <div
                    key={index}
                    className="w-9 h-9 rounded-full border border-border/50 shadow-sm"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <div className="min-w-0 pr-6">
                <span className="font-medium text-foreground block">{palette.name}</span>
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {palette.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Continue button - explicit for the last card */}
      <Button
        onClick={onNext}
        disabled={!colorPalette}
        size="lg"
        className="w-full rounded-xl h-12"
      >
        Continue to customize
      </Button>
    </div>
  );
}

export default ColorCard;
