import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Send, Loader2 } from 'lucide-react';
import { useCustomStudioStore, PriceBreakdown } from '@/stores/customStudioStore';
import { useCartStore } from '@/stores/cartStore';
import { supabase } from '@/integrations/supabase/client';
import { uploadInspirationImages } from '@/lib/uploadCustomArtwork';
import { logError } from '@/lib/logger';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
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
import { Product } from '@/lib/products';
import { cn } from '@/lib/utils';

interface ReviewSheetProps {
  isOpen: boolean;
  onClose: () => void;
  breakdown: PriceBreakdown;
}

export function ReviewSheet({ isOpen, onClose, breakdown }: ReviewSheetProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    shape, length, baseFinish, colorPalette, nailColors,
    hasAccentNails, accentNails, accentConfigs,
    effects, rhinestoneTier, charmTier, charmPreferences,
    predefinedArtwork, customArtwork, notes, inspirationImages,
    resetStudio, getPriceBreakdown,
  } = useCustomStudioStore();

  const addItem = useCartStore(state => state.addItem);
  const hasCustomArt = customArtwork !== null;
  const selectedAccentNails = Array.from(accentNails);

  const getArtworkType = (): 'none' | 'predefined' | 'custom' | 'both' => {
    const hasPredefined = predefinedArtwork.length > 0;
    const hasCustom = customArtwork !== null;
    if (hasPredefined && hasCustom) return 'both';
    if (hasCustom) return 'custom';
    if (hasPredefined) return 'predefined';
    return 'none';
  };

  const createOrderViaEdgeFunction = async (requiresQuote: boolean) => {
    const { data: sessionData } = await supabase.auth.getSession();
    const accessToken = sessionData.session?.access_token;

    const orderPayload = {
      user_id: null as string | null,
      base_product_handle: 'custom-nail-set',
      shape: shape || '',
      length: length || '',
      finish: baseFinish || '',
      colors: JSON.parse(JSON.stringify({ palette: colorPalette, nailColors })),
      accent_nails: JSON.parse(JSON.stringify(selectedAccentNails.map(i => ({
        index: i, config: accentConfigs[i as keyof typeof accentConfigs] || null,
        color: nailColors[i as keyof typeof nailColors] || null,
      })))),
      effects: JSON.parse(JSON.stringify(effects.map(e => ({ effect: e.effect, scope: e.scope })))),
      rhinestones_tier: rhinestoneTier || 'none',
      charms_tier: charmTier || 'none',
      charms_preferences: charmPreferences || null,
      artwork_type: getArtworkType(),
      artwork_selections: JSON.parse(JSON.stringify(predefinedArtwork.map(a => ({ type: a.type, nails: Array.from(a.nails) })))),
      custom_artwork_description: customArtwork?.description || null,
      inspiration_images: [] as string[],
      estimated_price: breakdown.subtotal,
      requires_quote: requiresQuote,
      status: 'pending' as const,
      notes: notes || null,
    };

    const { data, error } = await supabase.functions.invoke('create-custom-order', {
      body: orderPayload,
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    });

    if (error) { logError('Failed to create order:', error); return null; }
    return data as { id: string };
  };

  const handleAddToCart = async () => {
    setIsSubmitting(true);
    try {
      const order = await createOrderViaEdgeFunction(false);
      if (!order) {
        toast.error('Failed to create order', { description: 'Please try again.' });
        setIsSubmitting(false);
        return;
      }

      const uniqueVariantId = `custom-set-${order.id}`;
      const priceBreakdown = getPriceBreakdown();
      const selectedOptions: Array<{ name: string; value: string }> = [
        { name: 'Shape', value: shape ? SHAPE_LABELS[shape] : 'Not selected' },
        { name: 'Length', value: length ? LENGTH_LABELS[length] : 'Not selected' },
        { name: 'Finish', value: baseFinish ? FINISH_LABELS[baseFinish] : 'Not selected' },
        { name: 'Color Palette', value: colorPalette?.name || 'Custom' },
      ];
      if (hasAccentNails && accentNails.size > 0) selectedOptions.push({ name: 'Accent Nails', value: `${accentNails.size} nails` });
      if (effects.length > 0) selectedOptions.push({ name: 'Effects', value: effects.map(e => EFFECT_LABELS[e.effect]).join(', ') });
      if (rhinestoneTier && rhinestoneTier !== 'none') selectedOptions.push({ name: 'Rhinestones', value: RHINESTONE_LABELS[rhinestoneTier] });
      if (charmTier && charmTier !== 'none') selectedOptions.push({ name: 'Charms', value: CHARM_LABELS[charmTier] });
      if (predefinedArtwork.length > 0) selectedOptions.push({ name: 'Nail Art', value: predefinedArtwork.map(a => NAIL_ART_LABELS[a.type]).join(', ') });

      const variantTitle = `${shape ? SHAPE_LABELS[shape] : 'Custom'} \u00b7 ${length ? LENGTH_LABELS[length] : ''} \u00b7 ${colorPalette?.name || 'Custom Colors'}`;

      const customProduct: Product = {
        id: uniqueVariantId,
        title: 'Custom Nail Set',
        description: `Custom ${shape ? SHAPE_LABELS[shape] : ''} ${length ? LENGTH_LABELS[length] : ''} nails with ${baseFinish ? FINISH_LABELS[baseFinish] : ''} finish`,
        handle: 'custom-nail-set',
        price: priceBreakdown.subtotal,
        currencyCode: 'USD',
        images: ['/placeholder.svg'],
        variants: [{
          id: uniqueVariantId, title: variantTitle, price: priceBreakdown.subtotal,
          currencyCode: 'USD', availableForSale: true, selectedOptions,
        }],
        options: [],
        customizationData: {
          orderId: order.id, shape, length, baseFinish, colorPalette,
          nailColors: { ...nailColors }, hasAccentNails,
          accentNails: Array.from(accentNails), accentConfigs: { ...accentConfigs },
          effects: effects.map(e => ({ effect: e.effect, scope: e.scope })),
          rhinestoneTier, charmTier, charmPreferences,
          predefinedArtwork: predefinedArtwork.map(a => ({ type: a.type, nails: Array.from(a.nails) })),
          notes,
          priceBreakdown: priceBreakdown.items.map(item => ({
            label: item.label, amount: item.amount, isQuoteRequired: item.isQuoteRequired,
          })),
        },
      };

      addItem({
        product: customProduct, variantId: uniqueVariantId, variantTitle,
        price: { amount: priceBreakdown.subtotal.toFixed(2), currencyCode: 'USD' },
        quantity: 1, selectedOptions, needsSizingKit: false, sizingOption: 'known',
      });

      toast.success('Added to cart!', { description: 'Your custom nail set has been added.' });
      resetStudio();
      onClose();
    } catch (err) {
      logError('Error adding to cart:', err);
      toast.error('Something went wrong', { description: 'Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRequestQuote = async () => {
    setIsSubmitting(true);
    try {
      const order = await createOrderViaEdgeFunction(true);
      if (!order) {
        toast.error('Failed to submit quote request', { description: 'Please try again.' });
        setIsSubmitting(false);
        return;
      }

      const allBlobUrls = [...inspirationImages, ...(customArtwork?.inspirationImages || [])];
      if (allBlobUrls.length > 0) {
        const uploadedUrls = await uploadInspirationImages(allBlobUrls, order.id);
        const { data: sessionData } = await supabase.auth.getSession();
        const accessToken = sessionData.session?.access_token;
        await supabase.functions.invoke('update-order-images', {
          body: { orderId: order.id, inspirationImages: uploadedUrls },
          headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
        });
      }

      toast.success('Quote request submitted!', {
        description: "We'll email you a quote within 24-48 hours.", duration: 6000,
      });
      resetStudio();
      onClose();
    } catch (err) {
      logError('Error submitting quote:', err);
      toast.error('Something went wrong', { description: 'Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50 lg:hidden"
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 z-50 bg-background rounded-t-3xl max-h-[90vh] overflow-y-auto lg:hidden"
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 rounded-full bg-muted-foreground/20" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 pb-4">
              <h2 className="text-xl font-bold text-foreground">Review Your Design</h2>
              <button onClick={onClose} className="p-1.5 rounded-full hover:bg-muted transition-colors">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <div className="px-5 pb-8 space-y-4">
              {/* Summary */}
              <SummaryBlock label="Base Look">
                <p className="text-sm">{SHAPE_LABELS[shape]} · {LENGTH_LABELS[length]} · {FINISH_LABELS[baseFinish]}</p>
                {colorPalette && (
                  <div className="flex items-center gap-2 mt-1.5">
                    <div className="flex gap-1">
                      {colorPalette.colors.map((c, i) => (
                        <div key={i} className="w-5 h-5 rounded-full border border-border/50" style={{ backgroundColor: c }} />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">{colorPalette.name}</span>
                  </div>
                )}
              </SummaryBlock>

              {hasAccentNails && accentNails.size > 0 && (
                <SummaryBlock label="Accent Nails">
                  <p className="text-sm">{selectedAccentNails.map(i => FINGER_NAMES[i]).join(', ')}</p>
                </SummaryBlock>
              )}

              {effects.length > 0 && (
                <SummaryBlock label="Effects">
                  <div className="flex flex-wrap gap-1.5">
                    {effects.map((e, i) => (
                      <span key={i} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                        {EFFECT_LABELS[e.effect]} ({e.scope === 'all' ? 'All' : 'Accents'})
                      </span>
                    ))}
                  </div>
                </SummaryBlock>
              )}

              {(rhinestoneTier !== 'none' || charmTier !== 'none') && (
                <SummaryBlock label="Sparkle & Charms">
                  <div className="flex flex-wrap gap-2 text-sm">
                    {rhinestoneTier !== 'none' && <span>Rhinestones: {RHINESTONE_LABELS[rhinestoneTier]}</span>}
                    {charmTier !== 'none' && <span>Charms: {CHARM_LABELS[charmTier]}</span>}
                  </div>
                </SummaryBlock>
              )}

              {(predefinedArtwork.length > 0 || customArtwork) && (
                <SummaryBlock label="Nail Art">
                  {predefinedArtwork.map((a, i) => (
                    <span key={i} className="text-sm">{NAIL_ART_LABELS[a.type]} ({a.nails.size} nails)</span>
                  ))}
                  {customArtwork && <span className="text-sm text-amber-600">+ Custom artwork (quote)</span>}
                </SummaryBlock>
              )}

              {notes && (
                <SummaryBlock label="Notes">
                  <p className="text-sm text-muted-foreground italic">"{notes}"</p>
                </SummaryBlock>
              )}

              {/* Price breakdown */}
              <div className="border-t border-border pt-4 space-y-2">
                {breakdown.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className={cn('text-muted-foreground', item.isQuoteRequired && 'text-amber-600')}>
                      {item.label}
                    </span>
                    <span className={cn('font-medium', item.isQuoteRequired ? 'text-amber-600' : 'text-foreground')}>
                      {item.isQuoteRequired ? 'TBD' : `$${item.amount.toFixed(2)}`}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between text-base font-bold pt-2 border-t border-border">
                  <span>Total</span>
                  <span>
                    ${breakdown.subtotal.toFixed(2)}
                    {breakdown.hasQuoteItems && <span className="text-sm font-normal text-amber-600 ml-1">+ quote</span>}
                  </span>
                </div>
              </div>

              {/* CTA */}
              {hasCustomArt ? (
                <Button size="lg" className="w-full rounded-xl" onClick={handleRequestQuote} disabled={isSubmitting}>
                  {isSubmitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Submitting...</> : <><Send className="w-4 h-4 mr-2" />Request Custom Quote</>}
                </Button>
              ) : (
                <Button size="lg" className="w-full rounded-xl" onClick={handleAddToCart} disabled={isSubmitting}>
                  {isSubmitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Adding...</> : <><ShoppingCart className="w-4 h-4 mr-2" />Add to Cart — ${breakdown.subtotal.toFixed(2)}</>}
                </Button>
              )}

              {hasCustomArt && (
                <p className="text-xs text-muted-foreground text-center">
                  Our artist will respond within 24-48 hours with final pricing.
                </p>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function SummaryBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="bg-muted/30 rounded-xl p-3.5">
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1.5">{label}</p>
      {children}
    </div>
  );
}

export default ReviewSheet;
