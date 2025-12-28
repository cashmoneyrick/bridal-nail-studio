import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useCustomStudioStore } from '@/stores/customStudioStore';
import { Check, Sparkles, X } from 'lucide-react';

interface AccentYesNoProps {
  onNo: () => void;
  onYes: () => void;
}

const AccentYesNo = ({ onNo, onYes }: AccentYesNoProps) => {
  const { hasAccentNails, setHasAccentNails } = useCustomStudioStore();
  const [selected, setSelected] = useState<'yes' | 'no' | null>(
    hasAccentNails === true ? 'yes' : hasAccentNails === false ? 'no' : null
  );

  const handleNo = () => {
    setSelected('no');
    setHasAccentNails(false);
    setTimeout(() => onNo(), 300);
  };

  const handleYes = () => {
    setSelected('yes');
    setHasAccentNails(true);
    setTimeout(() => onYes(), 300);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold text-foreground">
          Add Accent Nails?
        </h2>
        <p className="text-sm text-muted-foreground">
          Accent nails can have different finishes or colors from the rest of your set
        </p>
      </div>

      <div className="space-y-4">
        {/* No Option */}
        <button
          onClick={handleNo}
          className={cn(
            'w-full min-h-[120px] p-6 rounded-xl border-2 transition-all duration-200',
            'flex items-center gap-4 text-left',
            selected === 'no'
              ? 'border-primary bg-primary/5 scale-[1.02]'
              : 'border-border hover:border-primary/50 hover:bg-muted/50'
          )}
        >
          <div className={cn(
            'w-12 h-12 rounded-full flex items-center justify-center shrink-0',
            selected === 'no' ? 'bg-primary text-primary-foreground' : 'bg-muted'
          )}>
            {selected === 'no' ? (
              <Check className="w-6 h-6" />
            ) : (
              <X className="w-6 h-6 text-muted-foreground" />
            )}
          </div>
          <div>
            <span className="font-semibold text-lg block text-foreground">No Thanks</span>
            <span className="text-sm text-muted-foreground">
              Keep all nails matching
            </span>
          </div>
        </button>

        {/* Yes Option */}
        <button
          onClick={handleYes}
          className={cn(
            'w-full min-h-[120px] p-6 rounded-xl border-2 transition-all duration-200',
            'flex items-center gap-4 text-left',
            selected === 'yes'
              ? 'border-primary bg-primary/5 scale-[1.02]'
              : 'border-border hover:border-primary/50 hover:bg-muted/50'
          )}
        >
          <div className={cn(
            'w-12 h-12 rounded-full flex items-center justify-center shrink-0',
            selected === 'yes' ? 'bg-primary text-primary-foreground' : 'bg-muted'
          )}>
            {selected === 'yes' ? (
              <Check className="w-6 h-6" />
            ) : (
              <Sparkles className="w-6 h-6 text-muted-foreground" />
            )}
          </div>
          <div>
            <span className="font-semibold text-lg block text-foreground">Yes, Add Accents</span>
            <span className="text-sm text-muted-foreground">
              Customize specific nails
            </span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default AccentYesNo;
