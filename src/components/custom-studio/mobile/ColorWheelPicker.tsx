import { useState, useRef, useCallback } from 'react';
import { Plus, X, ChevronRight } from 'lucide-react';
import { useCustomStudioStore } from '@/stores/customStudioStore';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface ColorWheelPickerProps {
  onNext: () => void;
}

const QUICK_COLORS = [
  '#FFFFFF', '#000000', '#F5E6E0', '#E8B4B8',
  '#DC143C', '#8B0000', '#FFB6C1', '#FF69B4',
  '#C0C0C0', '#FFD700', '#000080', '#F5F5DC',
];

function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
}

const ColorWheelPicker = ({ onNext }: ColorWheelPickerProps) => {
  const { selectedColors, addSelectedColor, removeSelectedColor } = useCustomStudioStore();
  
  const [hue, setHue] = useState(0);
  const [saturation, setSaturation] = useState(100);
  const [lightness, setLightness] = useState(50);
  
  const wheelRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  
  const currentColor = hslToHex(hue, saturation, lightness);
  
  const updateHueFromPosition = useCallback((clientX: number, clientY: number) => {
    if (!wheelRef.current) return;
    
    const rect = wheelRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const angle = Math.atan2(clientY - centerY, clientX - centerX);
    let degrees = (angle * 180) / Math.PI + 90;
    if (degrees < 0) degrees += 360;
    
    setHue(Math.round(degrees) % 360);
  }, []);
  
  const handleWheelStart = (e: React.TouchEvent | React.MouseEvent) => {
    isDragging.current = true;
    const pos = 'touches' in e ? e.touches[0] : e;
    updateHueFromPosition(pos.clientX, pos.clientY);
  };
  
  const handleWheelMove = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging.current) return;
    const pos = 'touches' in e ? e.touches[0] : e;
    updateHueFromPosition(pos.clientX, pos.clientY);
  }, [updateHueFromPosition]);
  
  const handleWheelEnd = () => {
    isDragging.current = false;
  };
  
  const handleAddColor = () => {
    addSelectedColor(currentColor);
  };
  
  const handleQuickColor = (color: string) => {
    addSelectedColor(color);
  };
  
  // Calculate indicator position on wheel
  const indicatorAngle = hue - 90;
  const indicatorRadius = 85; // Adjust based on wheel size
  const indicatorX = Math.cos((indicatorAngle * Math.PI) / 180) * indicatorRadius;
  const indicatorY = Math.sin((indicatorAngle * Math.PI) / 180) * indicatorRadius;

  return (
    <div className="space-y-5 pb-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground">Pick Your Colors</h2>
        <p className="text-sm text-muted-foreground mt-1">Build your custom palette</p>
      </div>

      {/* Quick Colors */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Quick Colors</p>
        <div className="flex flex-wrap gap-2 justify-center">
          {QUICK_COLORS.map((color) => (
            <button
              key={color}
              onClick={() => handleQuickColor(color)}
              className={cn(
                'w-8 h-8 rounded-full border-2 transition-all active:scale-95',
                selectedColors.includes(color)
                  ? 'border-primary ring-2 ring-primary/30'
                  : 'border-border hover:border-primary/50'
              )}
              style={{ backgroundColor: color }}
              aria-label={`Add ${color} to palette`}
            />
          ))}
        </div>
      </div>

      {/* Color Wheel */}
      <div className="flex flex-col items-center gap-4">
        <div
          ref={wheelRef}
          className="relative w-[200px] h-[200px] rounded-full cursor-crosshair touch-none"
          style={{
            background: `conic-gradient(
              hsl(0, ${saturation}%, ${lightness}%),
              hsl(60, ${saturation}%, ${lightness}%),
              hsl(120, ${saturation}%, ${lightness}%),
              hsl(180, ${saturation}%, ${lightness}%),
              hsl(240, ${saturation}%, ${lightness}%),
              hsl(300, ${saturation}%, ${lightness}%),
              hsl(360, ${saturation}%, ${lightness}%)
            )`,
          }}
          onMouseDown={handleWheelStart}
          onMouseMove={handleWheelMove}
          onMouseUp={handleWheelEnd}
          onMouseLeave={handleWheelEnd}
          onTouchStart={handleWheelStart}
          onTouchMove={handleWheelMove}
          onTouchEnd={handleWheelEnd}
        >
          {/* White center overlay */}
          <div className="absolute inset-8 rounded-full bg-background border border-border" />
          
          {/* Hue indicator */}
          <div
            className="absolute w-5 h-5 rounded-full border-2 border-white shadow-lg pointer-events-none"
            style={{
              backgroundColor: currentColor,
              left: `calc(50% + ${indicatorX}px - 10px)`,
              top: `calc(50% + ${indicatorY}px - 10px)`,
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
            }}
          />
        </div>

        {/* Sliders */}
        <div className="w-full space-y-3 px-2">
          {/* Lightness slider */}
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Lightness</label>
            <input
              type="range"
              min="10"
              max="90"
              value={lightness}
              onChange={(e) => setLightness(Number(e.target.value))}
              className="w-full h-8 appearance-none rounded-full cursor-pointer"
              style={{
                background: `linear-gradient(to right, 
                  hsl(${hue}, ${saturation}%, 10%), 
                  hsl(${hue}, ${saturation}%, 50%), 
                  hsl(${hue}, ${saturation}%, 90%))`,
              }}
            />
          </div>
          
          {/* Saturation slider */}
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Saturation</label>
            <input
              type="range"
              min="0"
              max="100"
              value={saturation}
              onChange={(e) => setSaturation(Number(e.target.value))}
              className="w-full h-8 appearance-none rounded-full cursor-pointer"
              style={{
                background: `linear-gradient(to right, 
                  hsl(${hue}, 0%, ${lightness}%), 
                  hsl(${hue}, 100%, ${lightness}%))`,
              }}
            />
          </div>
        </div>

        {/* Preview + Add Button */}
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center gap-1">
            <div
              className="w-16 h-16 rounded-xl border-2 border-border shadow-md"
              style={{ backgroundColor: currentColor }}
            />
            <span className="text-xs font-mono text-muted-foreground">{currentColor}</span>
          </div>
          
          <Button
            onClick={handleAddColor}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add to Palette
          </Button>
        </div>
      </div>

      {/* Your Palette */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Your Palette ({selectedColors.length} color{selectedColors.length !== 1 ? 's' : ''})
        </p>
        
        {selectedColors.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            Add colors to build your palette
          </p>
        ) : (
          <div className="flex flex-wrap gap-2 justify-center">
            {selectedColors.map((color) => (
              <button
                key={color}
                onClick={() => removeSelectedColor(color)}
                className="relative w-10 h-10 rounded-full border-2 border-border group transition-all hover:scale-105"
                style={{ backgroundColor: color }}
                aria-label={`Remove ${color} from palette`}
              >
                <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <X className="w-4 h-4 text-white" />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Next Button */}
      <Button
        onClick={onNext}
        disabled={selectedColors.length === 0}
        className="w-full"
        size="lg"
      >
        Next: Paint Your Nails
        <ChevronRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  );
};

export default ColorWheelPicker;
