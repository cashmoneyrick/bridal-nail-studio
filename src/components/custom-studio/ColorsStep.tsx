import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCustomStudioStore } from '@/stores/customStudioStore';
import { cn } from '@/lib/utils';

interface ColorsStepProps {
  onNext: () => void;
}

const SWATCH_COLORS = [
  { name: 'Soft Pink', hex: '#F4D1D1' },
  { name: 'Dusty Rose', hex: '#D4A5A5' },
  { name: 'Blush', hex: '#E8C4C4' },
  { name: 'Nude', hex: '#E5D3C8' },
  { name: 'Cream', hex: '#F5F0E8' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Black', hex: '#1A1A1A' },
  { name: 'Red', hex: '#C41E3A' },
  { name: 'Burgundy', hex: '#722F37' },
  { name: 'Coral', hex: '#E87A6E' },
  { name: 'Lavender', hex: '#C5B4E3' },
  { name: 'Sage', hex: '#9CAF88' },
  { name: 'Navy', hex: '#1E3A5F' },
  { name: 'Gold', hex: '#D4AF37' },
  { name: 'Silver', hex: '#C0C0C0' },
];

// Light colors that need dark check marks
const LIGHT_HEXES = new Set(['#FFFFFF', '#F5F0E8', '#C0C0C0', '#D4AF37', '#F4D1D1', '#E8C4C4', '#E5D3C8']);

export function ColorsStep({ onNext }: ColorsStepProps) {
  const { selectedColors, colorNotes, toggleColor, setColorNotes, canAdvance } =
    useCustomStudioStore();

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="font-studio-display text-4xl md:text-5xl font-light text-foreground">
          What colors are you feeling?
        </h1>
        <p className="font-studio-body text-muted-foreground">Select any that speak to you</p>
      </div>

      {/* Swatches */}
      <div className="grid grid-cols-5 gap-4 justify-items-center">
        {SWATCH_COLORS.map(({ name, hex }) => {
          const isSelected = selectedColors.includes(hex);
          const isLight = hex === '#FFFFFF' || hex === '#F5F0E8';
          return (
            <button
              key={hex}
              onClick={() => toggleColor(hex)}
              title={name}
              className={cn(
                'w-14 h-14 rounded-full transition-all duration-200 relative flex items-center justify-center shadow-inner',
                isLight ? 'border border-studio-taupe-light/50' : '',
                isSelected
                  ? 'ring-2 ring-primary ring-offset-2 ring-offset-background scale-110'
                  : 'hover:scale-110'
              )}
              style={{ backgroundColor: hex }}
            >
              {isSelected && (
                <Check
                  className={cn(
                    'w-4 h-4',
                    LIGHT_HEXES.has(hex) ? 'text-studio-charcoal' : 'text-white'
                  )}
                  strokeWidth={3}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Color names row */}
      {selectedColors.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selectedColors.map((hex) => {
            const color = SWATCH_COLORS.find((c) => c.hex === hex);
            return (
              <span
                key={hex}
                className="font-studio-body text-xs bg-studio-cream-dark border border-studio-taupe-light/40 px-3 py-1 rounded-full text-foreground"
              >
                {color?.name || hex}
              </span>
            );
          })}
        </div>
      )}

      {/* Notes */}
      <div className="space-y-2">
        <label className="font-studio-body text-sm text-muted-foreground">
          Anything specific?
        </label>
        <Input
          value={colorNotes}
          onChange={(e) => setColorNotes(e.target.value)}
          placeholder="e.g., 'dusty mauve to match my dress'"
          className="rounded-2xl bg-studio-cream-dark/30 border-studio-taupe-light/60 focus:border-primary font-studio-body placeholder:text-studio-taupe/60"
        />
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

export default ColorsStep;
