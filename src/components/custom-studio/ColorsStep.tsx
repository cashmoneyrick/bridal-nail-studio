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

export function ColorsStep({ onNext }: ColorsStepProps) {
  const { selectedColors, colorNotes, toggleColor, setColorNotes, canAdvance } =
    useCustomStudioStore();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="font-display text-3xl md:text-4xl text-foreground">
          What colors are you feeling?
        </h1>
        <p className="text-muted-foreground">Select any that speak to you</p>
      </div>

      {/* Swatches */}
      <div className="grid grid-cols-5 sm:grid-cols-5 gap-3 justify-items-center">
        {SWATCH_COLORS.map(({ name, hex }) => {
          const isSelected = selectedColors.includes(hex);
          return (
            <button
              key={hex}
              onClick={() => toggleColor(hex)}
              title={name}
              className={cn(
                'w-12 h-12 rounded-full transition-all duration-200 relative flex items-center justify-center',
                hex === '#FFFFFF' || hex === '#F5F0E8'
                  ? 'border border-border'
                  : 'border border-transparent',
                isSelected
                  ? 'ring-2 ring-primary ring-offset-2 scale-110'
                  : 'hover:scale-105'
              )}
              style={{ backgroundColor: hex }}
            >
              {isSelected && (
                <Check
                  className={cn(
                    'w-4 h-4',
                    hex === '#FFFFFF' || hex === '#F5F0E8' || hex === '#C0C0C0' || hex === '#D4AF37' || hex === '#F4D1D1' || hex === '#E8C4C4' || hex === '#E5D3C8'
                      ? 'text-foreground'
                      : 'text-white'
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
                className="text-xs bg-muted px-2.5 py-1 rounded-full text-muted-foreground"
              >
                {color?.name || hex}
              </span>
            );
          })}
        </div>
      )}

      {/* Notes */}
      <div className="space-y-2">
        <label className="text-sm text-muted-foreground">
          Anything specific?
        </label>
        <Input
          value={colorNotes}
          onChange={(e) => setColorNotes(e.target.value)}
          placeholder="e.g., 'dusty mauve to match my dress'"
          className="rounded-xl"
        />
      </div>

      {/* Continue */}
      <Button
        onClick={onNext}
        disabled={!canAdvance()}
        className="w-full rounded-xl h-12 text-base font-medium"
      >
        Continue
      </Button>
    </div>
  );
}

export default ColorsStep;
