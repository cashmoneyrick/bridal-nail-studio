import { PriceBreakdown } from '@/stores/customStudioStore';
import { Button } from '@/components/ui/button';

interface MobileOrderBarProps {
  breakdown: PriceBreakdown;
  onReview: () => void;
}

export function MobileOrderBar({ breakdown, onReview }: MobileOrderBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
      <div className="bg-gradient-to-t from-background via-background to-transparent h-4" />
      <div className="bg-background border-t border-border px-4 py-3 pb-safe">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Estimated</p>
            <p className="text-lg font-bold text-foreground">
              ${breakdown.subtotal.toFixed(2)}
              {breakdown.hasQuoteItems && <span className="text-xs font-normal text-amber-600 ml-1">+</span>}
            </p>
          </div>
          <Button
            onClick={onReview}
            className="min-w-[140px] rounded-xl"
          >
            Review Order
          </Button>
        </div>
      </div>
    </div>
  );
}

export default MobileOrderBar;
