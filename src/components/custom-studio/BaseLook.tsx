import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCustomStudioStore } from '@/stores/customStudioStore';
import {
  ShapeType,
  LengthType,
  FinishType,
  FingerIndex,
  SHAPE_PRICES,
  LENGTH_PRICES,
  FINISH_PRICES,
  SHAPE_LABELS,
  LENGTH_LABELS,
  FINISH_LABELS,
  COLOR_PALETTES,
  PresetColorPalette,
} from '@/lib/pricing';

// Shape icons as simple SVG paths
const ShapeIcon = ({ shape, isSelected }: { shape: ShapeType; isSelected: boolean }) => {
  const paths: Record<ShapeType, string> = {
    almond: 'M12 2C8 2 5 6 5 12C5 18 8 22 12 22C16 22 19 18 19 12C19 6 16 2 12 2Z',
    square: 'M6 4H18V20H6V4Z',
    oval: 'M12 2C7 2 4 6 4 12C4 18 7 22 12 22C17 22 20 18 20 12C20 6 17 2 12 2Z',
    coffin: 'M7 2L5 12L8 22H16L19 12L17 2H7Z',
    stiletto: 'M8 2L6 12L12 22L18 12L16 2H8Z',
  };

  return (
    <svg
      viewBox="0 0 24 24"
      className={cn(
        'w-10 h-10 transition-colors',
        isSelected ? 'fill-primary stroke-primary' : 'fill-muted stroke-muted-foreground'
      )}
      strokeWidth="1.5"
    >
      <path d={paths[shape]} />
    </svg>
  );
};

// Price badge component
const PriceBadge = ({ price }: { price: number }) => {
  if (price === 0) return null;
  return (
    <span className="text-xs font-medium text-primary">
      +${price}
    </span>
  );
};

const BaseLook = () => {
  const { shape, length, baseFinish, colorPalette, setShape, setLength, setBaseFinish, setColorPalette, setNailColor } = useCustomStudioStore();

  const handlePaletteSelect = (palette: PresetColorPalette) => {
    setColorPalette({ name: palette.name, colors: palette.colors });
    // Auto-assign colors to all 10 nails
    for (let i = 0; i < 10; i++) {
      const colorIndex = i % palette.colors.length;
      setNailColor(i as FingerIndex, palette.colors[colorIndex]);
    }
  };

  const shapes: ShapeType[] = ['almond', 'square', 'oval', 'coffin', 'stiletto'];
  const lengths: LengthType[] = ['short', 'medium', 'long', 'extra-long'];
  const finishes: FinishType[] = ['glossy', 'matte'];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold">Design Your Base Look</h2>
        <p className="text-muted-foreground">
          Choose the foundation for your custom set
        </p>
      </div>

      {/* Shape Selector */}
      <div className="space-y-3">
        <h3 className="font-medium text-sm uppercase tracking-wide text-muted-foreground">
          Shape
        </h3>
        <div className="grid grid-cols-5 gap-2">
          {shapes.map((s) => {
            const isSelected = shape === s;
            const price = SHAPE_PRICES[s];
            return (
              <button
                key={s}
                onClick={() => setShape(s)}
                className={cn(
                  'relative flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all',
                  isSelected
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50 hover:bg-muted/50'
                )}
              >
                {isSelected && (
                  <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                    <Check className="w-3 h-3 text-primary-foreground" />
                  </div>
                )}
                <ShapeIcon shape={s} isSelected={isSelected} />
                <span className="text-xs font-medium">{SHAPE_LABELS[s]}</span>
                <PriceBadge price={price} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Length Selector */}
      <div className="space-y-3">
        <h3 className="font-medium text-sm uppercase tracking-wide text-muted-foreground">
          Length
        </h3>
        <div className="grid grid-cols-4 gap-2">
          {lengths.map((l) => {
            const isSelected = length === l;
            const price = LENGTH_PRICES[l];
            return (
              <button
                key={l}
                onClick={() => setLength(l)}
                className={cn(
                  'relative flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all',
                  isSelected
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50 hover:bg-muted/50'
                )}
              >
                {isSelected && (
                  <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                    <Check className="w-3 h-3 text-primary-foreground" />
                  </div>
                )}
                {/* Visual length indicator */}
                <div className="flex items-end gap-0.5 h-8">
                  {['short', 'medium', 'long', 'extra-long'].map((size, i) => {
                    const heights = [12, 18, 24, 32];
                    const shouldShow = lengths.indexOf(l) >= i;
                    return (
                      <div
                        key={size}
                        className={cn(
                          'w-1.5 rounded-full transition-colors',
                          shouldShow
                            ? isSelected
                              ? 'bg-primary'
                              : 'bg-muted-foreground'
                            : 'bg-muted'
                        )}
                        style={{ height: heights[i] }}
                      />
                    );
                  })}
                </div>
                <span className="text-xs font-medium">{LENGTH_LABELS[l]}</span>
                <PriceBadge price={price} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Finish Selector */}
      <div className="space-y-3">
        <h3 className="font-medium text-sm uppercase tracking-wide text-muted-foreground">
          Base Finish
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {finishes.map((f) => {
            const isSelected = baseFinish === f;
            const price = FINISH_PRICES[f];
            return (
              <button
                key={f}
                onClick={() => setBaseFinish(f)}
                className={cn(
                  'relative flex items-center gap-4 p-4 rounded-lg border-2 transition-all',
                  isSelected
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50 hover:bg-muted/50'
                )}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                    <Check className="w-3 h-3 text-primary-foreground" />
                  </div>
                )}
                {/* Finish preview */}
                <div
                  className={cn(
                    'w-12 h-12 rounded-full border',
                    f === 'glossy'
                      ? 'bg-gradient-to-br from-white via-gray-100 to-gray-300 border-gray-200'
                      : 'bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500 border-gray-400'
                  )}
                  style={{
                    boxShadow: f === 'glossy' 
                      ? 'inset -4px -4px 8px rgba(0,0,0,0.1), inset 4px 4px 8px rgba(255,255,255,0.8)'
                      : 'none'
                  }}
                />
                <div className="flex flex-col items-start">
                  <span className="font-medium">{FINISH_LABELS[f]}</span>
                  <span className="text-xs text-muted-foreground">
                    {f === 'glossy' ? 'High shine reflective' : 'Soft velvet texture'}
                  </span>
                </div>
                {price > 0 && (
                  <span className="absolute bottom-2 right-2 text-xs font-medium text-primary">
                    +${price}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Color Palette Selector */}
      <div className="space-y-3">
        <h3 className="font-medium text-sm uppercase tracking-wide text-muted-foreground">
          Color Palette
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {COLOR_PALETTES.map((palette) => {
            const isSelected = colorPalette?.name === palette.name;
            return (
              <button
                key={palette.id}
                onClick={() => handlePaletteSelect(palette)}
                className={cn(
                  'relative flex flex-col gap-3 p-4 rounded-lg border-2 transition-all text-left',
                  isSelected
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50 hover:bg-muted/50'
                )}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                    <Check className="w-3 h-3 text-primary-foreground" />
                  </div>
                )}
                {/* Color swatches */}
                <div className="flex gap-2">
                  {palette.colors.map((color, index) => (
                    <div
                      key={index}
                      className="w-8 h-8 rounded-full border border-border shadow-sm"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <div className="space-y-1">
                  <span className="font-medium">{palette.name}</span>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {palette.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BaseLook;
