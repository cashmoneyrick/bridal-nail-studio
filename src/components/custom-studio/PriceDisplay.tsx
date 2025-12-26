import { cn } from '@/lib/utils';
import { PriceBreakdown } from '@/stores/customStudioStore';
import { ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { useState } from 'react';

interface PriceDisplayProps {
  breakdown: PriceBreakdown;
  className?: string;
  collapsible?: boolean;
}

export const PriceDisplay = ({ 
  breakdown, 
  className,
  collapsible = true 
}: PriceDisplayProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const regularItems = breakdown.items.filter(item => !item.isQuoteRequired);
  const quoteItems = breakdown.items.filter(item => item.isQuoteRequired);
  
  return (
    <div className={cn("bg-card border border-border rounded-lg overflow-hidden", className)}>
      {/* Header - always visible */}
      <button
        onClick={() => collapsible && setIsExpanded(!isExpanded)}
        disabled={!collapsible}
        className={cn(
          "w-full p-4 flex items-center justify-between",
          collapsible && "hover:bg-muted/50 transition-colors cursor-pointer",
          !collapsible && "cursor-default"
        )}
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">Estimated Total</span>
          {breakdown.hasQuoteItems && (
            <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 bg-amber-500/10 text-amber-600 rounded-full">
              <AlertCircle className="w-3 h-3" />
              Quote Required
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-foreground">
            ${breakdown.subtotal.toFixed(2)}
            {breakdown.hasQuoteItems && '+'}
          </span>
          {collapsible && (
            isExpanded ? (
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            )
          )}
        </div>
      </button>
      
      {/* Expanded breakdown */}
      {(isExpanded || !collapsible) && (
        <div className="border-t border-border p-4 space-y-3 bg-muted/30">
          {/* Regular priced items */}
          {regularItems.length > 0 && (
            <div className="space-y-2">
              {regularItems.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-muted-foreground capitalize">
                    {item.label.replace(/-/g, ' ')}
                  </span>
                  <span className="text-foreground font-medium">
                    {item.amount > 0 ? `+$${item.amount.toFixed(2)}` : 'Included'}
                  </span>
                </div>
              ))}
            </div>
          )}
          
          {/* Quote required items */}
          {quoteItems.length > 0 && (
            <>
              <div className="border-t border-border pt-3">
                <p className="text-xs text-amber-600 font-medium mb-2">
                  Requires Custom Quote:
                </p>
                {quoteItems.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-muted-foreground capitalize">
                      {item.label.replace(/-/g, ' ')}
                    </span>
                    <span className="text-amber-600 font-medium text-xs">
                      Price TBD
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
          
          {/* Subtotal */}
          <div className="border-t border-border pt-3 flex justify-between">
            <span className="font-semibold text-foreground">Subtotal</span>
            <span className="font-bold text-foreground">
              ${breakdown.subtotal.toFixed(2)}
              {breakdown.hasQuoteItems && '+'}
            </span>
          </div>
          
          {breakdown.hasQuoteItems && (
            <p className="text-xs text-muted-foreground">
              Final price will be provided after reviewing your custom artwork request.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default PriceDisplay;
