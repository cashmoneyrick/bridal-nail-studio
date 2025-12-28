import { Accordion } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles, ShoppingCart, Send } from 'lucide-react';
import { ReviewSection } from './ReviewSection';
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
  const {
    shape,
    length,
    baseFinish,
    colorPalette,
    hasAccentNails,
    accentNails,
    effects,
    rhinestoneTier,
    charmTier,
    predefinedArtwork,
    customArtwork,
    notes,
    setStep,
  } = useCustomStudioStore();

  const selectedAccentNails = Array.from(accentNails);

  // Summary generators
  const getBaseLookSummary = () => {
    const parts = [
      shape ? SHAPE_LABELS[shape] : null,
      length ? LENGTH_LABELS[length] : null,
      baseFinish ? FINISH_LABELS[baseFinish] : null,
    ].filter(Boolean);
    return parts.join(' • ') || 'Not configured';
  };

  const getAccentsSummary = () => {
    if (!hasAccentNails || selectedAccentNails.length === 0) {
      return 'No accents';
    }
    return `${selectedAccentNails.length} accent nail${selectedAccentNails.length !== 1 ? 's' : ''}`;
  };

  const getEffectsSummary = () => {
    const parts: string[] = [];
    
    if (effects.length > 0) {
      parts.push(...effects.map(e => EFFECT_LABELS[e.effect]));
    }
    
    if (rhinestoneTier && rhinestoneTier !== 'none') {
      parts.push(RHINESTONE_LABELS[rhinestoneTier]);
    }
    
    if (charmTier && charmTier !== 'none') {
      parts.push(CHARM_LABELS[charmTier]);
    }
    
    return parts.length > 0 ? parts.join(', ') : 'None';
  };

  const getArtworkSummary = () => {
    const parts: string[] = [];
    
    if (predefinedArtwork.length > 0) {
      predefinedArtwork.forEach(art => {
        parts.push(`${NAIL_ART_LABELS[art.type]} (${art.nails.size})`);
      });
    }
    
    if (customArtwork) {
      parts.push('Custom request');
    }
    
    return parts.length > 0 ? parts.join(', ') : 'None';
  };

  const getFingerNames = (nailIndices: number[]) => {
    return nailIndices.map(i => FINGER_NAMES[i]).join(', ');
  };

  return (
    <div className="pb-32">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-foreground mb-1">Review Your Design</h2>
        <p className="text-sm text-muted-foreground">
          Make sure everything looks perfect
        </p>
      </div>

      {/* Accordion Sections */}
      <Accordion type="single" collapsible defaultValue="base" className="space-y-3">
        {/* Base Look */}
        <ReviewSection
          value="base"
          icon="🎨"
          title="Base Look"
          summary={getBaseLookSummary()}
          onEdit={() => setStep(1)}
        >
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shape:</span>
                <span className="text-foreground">{shape ? SHAPE_LABELS[shape] : '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Length:</span>
                <span className="text-foreground">{length ? LENGTH_LABELS[length] : '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Finish:</span>
                <span className="text-foreground">{baseFinish ? FINISH_LABELS[baseFinish] : '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Palette:</span>
                <span className="text-foreground">{colorPalette?.name || '—'}</span>
              </div>
            </div>
            {colorPalette && (
              <div className="flex gap-2">
                {colorPalette.colors.map((color, i) => (
                  <div
                    key={i}
                    className="w-7 h-7 rounded-full border border-border shadow-sm"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            )}
          </div>
        </ReviewSection>

        {/* Accent Nails */}
        <ReviewSection
          value="accents"
          icon="✋"
          title="Accents"
          summary={getAccentsSummary()}
          onEdit={() => setStep(2)}
        >
          {hasAccentNails && selectedAccentNails.length > 0 ? (
            <p className="text-sm text-foreground">
              Selected: {getFingerNames(selectedAccentNails)}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">No accent nails selected</p>
          )}
        </ReviewSection>

        {/* Effects & Add-ons */}
        <ReviewSection
          value="effects"
          icon="✨"
          title="Effects & Add-ons"
          summary={getEffectsSummary()}
          onEdit={() => setStep(3)}
        >
          <div className="space-y-2">
            {effects.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {effects.map((effectApp, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium"
                  >
                    <Sparkles className="w-3 h-3" />
                    {EFFECT_LABELS[effectApp.effect]} ({effectApp.scope === 'all' ? 'All' : 'Accents'})
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No effects selected</p>
            )}

            <div className="flex flex-wrap gap-2 text-sm">
              {rhinestoneTier && rhinestoneTier !== 'none' && (
                <span className="text-foreground">
                  Rhinestones: {RHINESTONE_LABELS[rhinestoneTier]}
                </span>
              )}
              {charmTier && charmTier !== 'none' && (
                <span className="text-foreground">
                  Charms: {CHARM_LABELS[charmTier]}
                </span>
              )}
            </div>
          </div>
        </ReviewSection>

        {/* Artwork */}
        <ReviewSection
          value="artwork"
          icon="🖼️"
          title="Artwork"
          summary={getArtworkSummary()}
          onEdit={() => setStep(4)}
        >
          <div className="space-y-2">
            {predefinedArtwork.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {predefinedArtwork.map((art, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-secondary text-secondary-foreground rounded-full text-xs font-medium"
                  >
                    {NAIL_ART_LABELS[art.type]} ({art.nails.size} nail{art.nails.size !== 1 ? 's' : ''})
                  </span>
                ))}
              </div>
            ) : null}

            {customArtwork ? (
              <div className="space-y-1">
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-500/10 text-amber-600 rounded-full text-xs font-medium">
                  Custom Request
                </span>
                {customArtwork.description && (
                  <p className="text-sm text-muted-foreground italic line-clamp-2">
                    "{customArtwork.description}"
                  </p>
                )}
                {customArtwork.inspirationImages.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    📷 {customArtwork.inspirationImages.length} inspiration image{customArtwork.inspirationImages.length !== 1 ? 's' : ''}
                  </p>
                )}
              </div>
            ) : null}

            {predefinedArtwork.length === 0 && !customArtwork && (
              <p className="text-sm text-muted-foreground">No artwork selected</p>
            )}
          </div>
        </ReviewSection>

        {/* Notes (if any) */}
        {notes && (
          <ReviewSection
            value="notes"
            icon="📝"
            title="Notes"
            summary={notes.length > 30 ? notes.substring(0, 30) + '...' : notes}
            onEdit={() => setStep(4)}
          >
            <p className="text-sm text-muted-foreground italic">"{notes}"</p>
          </ReviewSection>
        )}
      </Accordion>

      {/* Price Breakdown */}
      <div className="mt-6 bg-muted/30 border border-border rounded-lg p-4">
        <h3 className="font-semibold text-foreground mb-3">Price Breakdown</h3>
        <div className="space-y-2 text-sm">
          {priceBreakdown.items.map((item, index) => (
            <div key={index} className="flex justify-between">
              <span className="text-muted-foreground">{item.label}</span>
              <span className="text-foreground">
                {item.isQuoteRequired ? 'Quote' : `$${item.amount.toFixed(2)}`}
              </span>
            </div>
          ))}
          <div className="border-t border-border pt-2 mt-2 flex justify-between font-semibold">
            <span>Total</span>
            <span className="text-lg">
              ${priceBreakdown.subtotal.toFixed(2)}
              {priceBreakdown.hasQuoteItems && <span className="text-primary text-sm ml-1">+</span>}
            </span>
          </div>
        </div>
      </div>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
        <div className="h-4 bg-gradient-to-t from-background to-transparent pointer-events-none" />
        <div className="bg-card border-t border-border px-4 py-3 pb-6 flex items-center justify-between gap-4 safe-area-bottom">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Total</span>
            <span className="text-lg font-bold text-foreground">
              ${priceBreakdown.subtotal.toFixed(2)}
              {priceBreakdown.hasQuoteItems && <span className="text-primary ml-0.5">+</span>}
            </span>
          </div>
          
          <Button
            size="lg"
            onClick={hasCustomArtwork ? onRequestQuote : onAddToCart}
            disabled={isSubmitting}
            className="flex-1 max-w-[200px] min-h-[48px] text-base font-semibold"
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : hasCustomArtwork ? (
              <>
                <Send className="w-4 h-4 mr-2" />
                Request Quote
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Cart
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReviewSubmitMobile;
