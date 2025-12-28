import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { PriceBreakdown } from '@/stores/customStudioStore';

interface MobileBottomNavProps {
  priceBreakdown: PriceBreakdown;
  onContinue: () => void;
  canProceed: boolean;
  isLastStep: boolean;
  currentStep: number;
}

const MobileBottomNav = ({
  priceBreakdown,
  onContinue,
  canProceed,
  isLastStep,
  currentStep,
}: MobileBottomNavProps) => {
  // Don't render on last step (Review has its own submit)
  if (isLastStep) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
      {/* Gradient fade effect for content above */}
      <div className="h-4 bg-gradient-to-t from-background to-transparent" />
      
      {/* Main nav bar */}
      <div className="bg-card border-t border-border px-4 py-3 pb-safe flex items-center justify-between gap-4">
        {/* Price section (left) */}
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground">Estimated</span>
          <span className="text-lg font-bold text-foreground">
            ${priceBreakdown.subtotal.toFixed(2)}
            {priceBreakdown.hasQuoteItems && <span className="text-primary">+</span>}
          </span>
        </div>

        {/* Continue button (right) */}
        <Button
          onClick={onContinue}
          disabled={!canProceed}
          className="flex-shrink-0 min-w-[120px]"
          size="lg"
        >
          {currentStep === 0 ? 'Get Started' : 'Continue'}
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
};

export default MobileBottomNav;
