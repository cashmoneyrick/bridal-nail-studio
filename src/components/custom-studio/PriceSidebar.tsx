import { useState } from 'react';
import { ChevronDown, RotateCcw } from 'lucide-react';
import { useCustomStudioStore, PriceBreakdown } from '@/stores/customStudioStore';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface PriceSidebarProps {
  breakdown: PriceBreakdown;
  onAddToCart: () => void;
  onRequestQuote: () => void;
  isSubmitting: boolean;
  hasCustomArtwork: boolean;
}

export function PriceSidebar({ breakdown, onAddToCart, onRequestQuote, isSubmitting, hasCustomArtwork }: PriceSidebarProps) {
  const [expanded, setExpanded] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const resetStudio = useCustomStudioStore(s => s.resetStudio);

  return (
    <>
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        {/* Price header */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between p-5"
        >
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Estimated Total
            </p>
            <p className="text-2xl font-bold text-foreground mt-0.5">
              ${breakdown.subtotal.toFixed(2)}
              {breakdown.hasQuoteItems && <span className="text-sm font-normal text-amber-600 ml-1.5">+ quote</span>}
            </p>
          </div>
          <ChevronDown className={cn(
            'w-5 h-5 text-muted-foreground transition-transform',
            expanded && 'rotate-180'
          )} />
        </button>

        {/* Breakdown */}
        {expanded && (
          <div className="px-5 pb-4 border-t border-border pt-3 space-y-2">
            {breakdown.items.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className={cn(
                  'text-muted-foreground',
                  item.isQuoteRequired && 'text-amber-600'
                )}>
                  {item.label}
                </span>
                <span className={cn(
                  'font-medium',
                  item.isQuoteRequired ? 'text-amber-600' : 'text-foreground'
                )}>
                  {item.isQuoteRequired ? 'TBD' : `$${item.amount.toFixed(2)}`}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="p-5 pt-0 space-y-3">
          {hasCustomArtwork ? (
            <Button
              size="lg"
              className="w-full rounded-xl"
              onClick={onRequestQuote}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Request Custom Quote'}
            </Button>
          ) : (
            <Button
              size="lg"
              className="w-full rounded-xl"
              onClick={onAddToCart}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Adding...' : `Add to Cart — $${breakdown.subtotal.toFixed(2)}`}
            </Button>
          )}

          <button
            onClick={() => setShowResetDialog(true)}
            className="w-full flex items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors py-1"
          >
            <RotateCcw className="w-3 h-3" />
            Start over
          </button>
        </div>
      </div>

      <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Start over?</AlertDialogTitle>
            <AlertDialogDescription>
              This will clear all your customization choices. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => { resetStudio(); setShowResetDialog(false); }}>
              Yes, start over
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default PriceSidebar;
