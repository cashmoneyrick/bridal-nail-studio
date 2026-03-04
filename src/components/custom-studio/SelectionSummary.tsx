import { Pencil } from 'lucide-react';
import { useCustomStudioStore } from '@/stores/customStudioStore';
import { SHAPE_LABELS, FINISH_LABELS, LENGTH_LABELS } from '@/lib/pricing';

interface SelectionSummaryProps {
  onEditBasics: () => void;
}

export function SelectionSummary({ onEditBasics }: SelectionSummaryProps) {
  const { shape, length, baseFinish, colorPalette } = useCustomStudioStore();

  return (
    <div className="bg-gradient-to-br from-primary/5 via-secondary/5 to-transparent border border-border rounded-2xl p-5 md:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">
              Your set
            </p>
            <p className="font-semibold text-foreground text-lg">
              {SHAPE_LABELS[shape]} · {LENGTH_LABELS[length]} · {FINISH_LABELS[baseFinish]}
            </p>
          </div>

          {colorPalette && (
            <div className="flex items-center gap-3">
              <div className="flex gap-1">
                {colorPalette.colors.map((color, i) => (
                  <div
                    key={i}
                    className="w-6 h-6 rounded-full border border-border/50 shadow-sm"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">{colorPalette.name}</span>
            </div>
          )}
        </div>

        <button
          onClick={onEditBasics}
          className="flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 transition-colors shrink-0 mt-1"
        >
          <Pencil className="w-3.5 h-3.5" />
          Edit
        </button>
      </div>
    </div>
  );
}

export default SelectionSummary;
