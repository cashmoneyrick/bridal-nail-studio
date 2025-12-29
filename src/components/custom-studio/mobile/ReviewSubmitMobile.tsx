import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, ShoppingCart, Send, Check, Circle, ChevronRight, ChevronDown } from 'lucide-react';
import { useCustomStudioStore } from '@/stores/customStudioStore';
import { PriceBreakdown } from '@/stores/customStudioStore';
import {
  SHAPE_LABELS,
  LENGTH_LABELS,
  FINISH_LABELS,
  EFFECT_LABELS,
  RHINESTONE_LABELS,
  CHARM_LABELS,
  NAIL_ART_LABELS,
  FINGER_NAMES,
} from '@/lib/pricing';
import { cn } from '@/lib/utils';

interface ReviewSubmitMobileProps {
  priceBreakdown: PriceBreakdown;
  hasCustomArtwork: boolean;
  isSubmitting: boolean;
  onAddToCart: () => void;
  onRequestQuote: () => void;
}

export const ReviewSubmitMobile = ({
  priceBreakdown,
  hasCustomArtwork,
  isSubmitting,
  onAddToCart,
  onRequestQuote,
}: ReviewSubmitMobileProps) => {
  const [showBreakdown, setShowBreakdown] = useState(false);
  
  const {
    shape,
    length,
    baseFinish,
    hasAccentNails,
    accentNails,
    effects,
    rhinestoneTier,
    charmTier,
    predefinedArtwork,
    customArtwork,
    setStep,
  } = useCustomStudioStore();

  // Summary generators
  const getBaseSummary = (): string | null => {
    if (!shape || !length || !baseFinish) return null;
    return `${SHAPE_LABELS[shape]} · ${LENGTH_LABELS[length]} · ${FINISH_LABELS[baseFinish]}`;
  };

  const getAccentsSummary = (): string | null => {
    if (!hasAccentNails || accentNails.size === 0) return null;
    if (accentNails.size <= 3) {
      return Array.from(accentNails).map(i => FINGER_NAMES[i]).join(', ');
    }
    return `${accentNails.size} accent nails`;
  };

  const getEffectsSummary = (): string | null => {
    if (effects.length === 0) return null;
    return effects.map(e => EFFECT_LABELS[e.effect]).join(', ');
  };

  const getArtworkSummary = (): string | null => {
    const parts: string[] = [];
    predefinedArtwork.forEach(art => {
      parts.push(`${NAIL_ART_LABELS[art.type]} (${art.nails.size})`);
    });
    if (customArtwork) parts.push('Custom request');
    return parts.length > 0 ? parts.join(' · ') : null;
  };

  const getAddonsSummary = (): string | null => {
    const parts: string[] = [];
    if (rhinestoneTier && rhinestoneTier !== 'none') {
      parts.push(RHINESTONE_LABELS[rhinestoneTier]);
    }
    if (charmTier && charmTier !== 'none') {
      parts.push(CHARM_LABELS[charmTier]);
    }
    return parts.length > 0 ? parts.join(' · ') : null;
  };

  // Checklist row component
  const ChecklistRow = ({
    summary,
    emptyText,
    onClick,
  }: {
    summary: string | null;
    emptyText: string;
    onClick: () => void;
  }) => {
    const hasContent = summary !== null;
    
    return (
      <button
        onClick={onClick}
        className={cn(
          "w-full flex items-center gap-3 py-4 border-b border-border text-left group overflow-hidden",
          !hasContent && "opacity-50"
        )}
      >
        <div className={cn(
          "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0",
          hasContent ? "bg-primary/10" : "bg-muted"
        )}>
          {hasContent ? (
            <Check className="w-4 h-4 text-primary" />
          ) : (
            <Circle className="w-4 h-4 text-muted-foreground" />
          )}
        </div>
        <span className={cn(
          "flex-1 text-base min-w-0 truncate",
          hasContent ? "text-foreground" : "text-muted-foreground"
        )}>
          {hasContent ? summary : emptyText}
        </span>
        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0" />
      </button>
    );
  };

  return (
    <div className="w-full overflow-hidden pb-36">
      <div className="w-full pt-2 overflow-hidden">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-display font-semibold text-foreground mb-1">
            Your Custom Set
          </h1>
          <p className="text-muted-foreground text-sm">
            Tap any section to edit
          </p>
        </div>

        {/* Checklist Rows */}
        <div className="mb-8 overflow-hidden">
          <ChecklistRow
            summary={getBaseSummary()}
            emptyText="Base look not configured"
            onClick={() => setStep(1)}
          />
          <ChecklistRow
            summary={getAccentsSummary()}
            emptyText="No accents"
            onClick={() => setStep(2)}
          />
          <ChecklistRow
            summary={getEffectsSummary()}
            emptyText="No effects"
            onClick={() => setStep(3)}
          />
          <ChecklistRow
            summary={getArtworkSummary()}
            emptyText="No artwork"
            onClick={() => setStep(4)}
          />
          <ChecklistRow
            summary={getAddonsSummary()}
            emptyText="No add-ons"
            onClick={() => setStep(3)}
          />
        </div>

        {/* Price Display Card */}
        <button
          onClick={() => setShowBreakdown(!showBreakdown)}
          className="w-full bg-card border border-border rounded-2xl p-6 text-center"
        >
          <p className="text-3xl font-display font-semibold text-foreground mb-1">
            ${priceBreakdown.subtotal.toFixed(2)}
            {priceBreakdown.hasQuoteItems && <span className="text-primary">+</span>}
          </p>
          <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
            {showBreakdown ? 'Hide' : 'Tap for'} breakdown
            <ChevronDown className={cn("w-4 h-4 transition-transform", showBreakdown && "rotate-180")} />
          </p>
          
          {showBreakdown && (
            <div className="mt-4 pt-4 border-t border-border text-left space-y-2">
              {priceBreakdown.items.map((item, index) => (
                <div key={index} className="flex justify-between text-sm gap-2">
                  <span className="text-muted-foreground min-w-0 flex-1 truncate">{item.label}</span>
                  <span className="text-foreground flex-shrink-0">
                    {item.isQuoteRequired ? 'Quote' : `$${item.amount.toFixed(2)}`}
                  </span>
                </div>
              ))}
            </div>
          )}
        </button>
      </div>

      {/* Sticky CTA Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
        <div className="bg-gradient-to-t from-background via-background to-transparent h-6 pointer-events-none" />
        <div className="bg-background px-5 pb-8 pt-4">
          <Button
            onClick={hasCustomArtwork ? onRequestQuote : onAddToCart}
            disabled={isSubmitting}
            className="w-full h-14 text-lg font-semibold rounded-full shadow-lg"
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : hasCustomArtwork ? (
              <>
                <Send className="w-5 h-5 mr-2" />
                Request Quote · ${priceBreakdown.subtotal.toFixed(2)}
              </>
            ) : (
              <>
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart · ${priceBreakdown.subtotal.toFixed(2)}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReviewSubmitMobile;
