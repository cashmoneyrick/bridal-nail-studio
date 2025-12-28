import { Check } from 'lucide-react';
import { useCustomStudioStore, ColorPalette } from '@/stores/customStudioStore';
import { COLOR_PALETTES, FingerIndex } from '@/lib/pricing';
import { cn } from '@/lib/utils';

interface ColorPaletteSelectorProps {
  onSelect: () => void;
}

const ColorPaletteSelector = ({ onSelect }: ColorPaletteSelectorProps) => {
  const { colorPalette: selectedPalette, setColorPalette, setNailColor } = useCustomStudioStore();

  const handleSelect = (palette: typeof COLOR_PALETTES[number]) => {
    const paletteData: ColorPalette = { name: palette.name, colors: palette.colors };
    setColorPalette(paletteData);
    // Auto-assign colors to all nails
    for (let i = 0; i < 10; i++) {
      const colorIndex = i % palette.colors.length;
      setNailColor(i as FingerIndex, palette.colors[colorIndex]);
    }
    onSelect();
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground">Choose Your Palette</h2>
        <p className="text-sm text-muted-foreground mt-1">Step 4 of 4</p>
      </div>

      <div className="space-y-3">
        {COLOR_PALETTES.map((palette) => {
          const isSelected = selectedPalette?.name === palette.name;
          
          return (
            <button
              key={palette.id}
              onClick={() => handleSelect(palette)}
              className={cn(
                'relative w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left',
                isSelected
                  ? 'border-primary bg-primary/10 scale-[1.01]'
                  : 'border-border hover:border-primary/50 active:scale-[0.99]'
              )}
            >
              {isSelected && (
                <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                  <Check className="w-3 h-3 text-primary-foreground" />
                </div>
              )}
              
              {/* Color swatches */}
              <div className="flex -space-x-1">
                {palette.colors.slice(0, 5).map((color, idx) => (
                  <div
                    key={idx}
                    className="w-8 h-8 rounded-full border-2 border-background shadow-sm"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              
              <div className="flex-1 min-w-0">
                <span className="font-semibold text-foreground block">{palette.name}</span>
                <span className="text-xs text-muted-foreground line-clamp-1">
                  {palette.description}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ColorPaletteSelector;
