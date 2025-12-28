import { useState } from 'react';
import { ChevronLeft, Sparkles, Check } from 'lucide-react';
import { useCustomStudioStore } from '@/stores/customStudioStore';
import { FingerIndex } from '@/lib/pricing';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface NailPainterProps {
  onBack: () => void;
}

const FINGER_NAMES = ['Pinky', 'Ring', 'Middle', 'Index', 'Thumb'];
const DEFAULT_NUDE = '#F5E6E0';

const NailPainter = ({ onBack }: NailPainterProps) => {
  const { selectedColors, nailColors, setNailColor, shape } = useCustomStudioStore();
  const [selectedNail, setSelectedNail] = useState<FingerIndex | null>(null);

  const handleNailTap = (finger: FingerIndex) => {
    setSelectedNail(finger);
  };

  const handleColorTap = (color: string) => {
    if (selectedNail !== null) {
      setNailColor(selectedNail, color);
      // Auto-advance to next unpainted nail
      const unpainted = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].find(
        (i) => i !== selectedNail && !nailColors[i as FingerIndex]
      );
      setSelectedNail(unpainted !== undefined ? (unpainted as FingerIndex) : null);
    }
  };

  const handleAutoFill = () => {
    if (selectedColors.length === 0) return;
    
    for (let i = 0; i < 10; i++) {
      const colorIndex = i % selectedColors.length;
      setNailColor(i as FingerIndex, selectedColors[colorIndex]);
    }
    setSelectedNail(null);
  };

  const getNailColor = (finger: FingerIndex) => {
    return nailColors[finger] || DEFAULT_NUDE;
  };

  // Get shape-specific nail path
  const getNailPath = () => {
    switch (shape) {
      case 'almond':
        return 'M10,45 L10,20 Q10,5 25,2 Q40,5 40,20 L40,45 Z';
      case 'square':
        return 'M8,45 L8,10 L42,10 L42,45 Z';
      case 'oval':
        return 'M10,45 L10,18 Q10,2 25,2 Q40,2 40,18 L40,45 Z';
      case 'coffin':
        return 'M8,45 L12,8 L38,8 L42,45 Z';
      case 'stiletto':
        return 'M10,45 L10,20 Q15,5 25,0 Q35,5 40,20 L40,45 Z';
      default:
        return 'M10,45 L10,20 Q10,5 25,2 Q40,5 40,20 L40,45 Z';
    }
  };

  const renderNail = (finger: FingerIndex, label: string) => {
    const isSelected = selectedNail === finger;
    const color = getNailColor(finger);
    const isPainted = nailColors[finger] && nailColors[finger].length > 0;

    return (
      <button
        key={finger}
        onClick={() => handleNailTap(finger)}
        className={cn(
          'flex flex-col items-center gap-1 transition-all',
          isSelected && 'scale-110'
        )}
      >
        <div
          className={cn(
            'relative w-12 h-14 transition-all',
            isSelected && 'ring-2 ring-primary ring-offset-2 ring-offset-background rounded-lg'
          )}
        >
          <svg viewBox="0 0 50 50" className="w-full h-full">
            <path
              d={getNailPath()}
              fill={color}
              stroke={isSelected ? 'hsl(var(--primary))' : 'hsl(var(--border))'}
              strokeWidth={isSelected ? 2 : 1}
            />
          </svg>
          {isPainted && (
            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
              <Check className="w-2.5 h-2.5 text-primary-foreground" />
            </div>
          )}
        </div>
        <span className="text-[10px] text-muted-foreground">{label}</span>
      </button>
    );
  };

  const paintedCount = Object.values(nailColors).filter(c => c && c.length > 0).length;

  return (
    <div className="space-y-5 pb-4">
      {/* Header with back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Add More Colors
      </button>

      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground">Paint Your Nails</h2>
        <p className="text-sm text-muted-foreground mt-1">
          {selectedNail !== null 
            ? 'Now tap a color below' 
            : 'Tap a nail to select it'}
        </p>
      </div>

      {/* Left Hand */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide text-center">
          Left Hand
        </p>
        <div className="flex justify-center gap-2">
          {[0, 1, 2, 3, 4].map((i) => 
            renderNail(i as FingerIndex, FINGER_NAMES[i])
          )}
        </div>
      </div>

      {/* Right Hand */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide text-center">
          Right Hand
        </p>
        <div className="flex justify-center gap-2">
          {[9, 8, 7, 6, 5].map((i) => 
            renderNail(i as FingerIndex, FINGER_NAMES[9 - i])
          )}
        </div>
      </div>

      {/* Color Palette */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Your Colors
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          {selectedColors.map((color) => (
            <button
              key={color}
              onClick={() => handleColorTap(color)}
              disabled={selectedNail === null}
              className={cn(
                'w-12 h-12 rounded-full border-2 transition-all',
                selectedNail !== null
                  ? 'border-primary hover:scale-110 active:scale-95'
                  : 'border-border opacity-50 cursor-not-allowed'
              )}
              style={{ backgroundColor: color }}
              aria-label={`Apply ${color}`}
            />
          ))}
        </div>
      </div>

      {/* Auto-fill Button */}
      <Button
        onClick={handleAutoFill}
        variant="outline"
        className="w-full"
      >
        <Sparkles className="w-4 h-4 mr-2" />
        Auto-fill All Nails
      </Button>

      {/* Progress indicator */}
      <div className="text-center text-sm text-muted-foreground">
        {paintedCount}/10 nails painted
      </div>
    </div>
  );
};

export default NailPainter;
