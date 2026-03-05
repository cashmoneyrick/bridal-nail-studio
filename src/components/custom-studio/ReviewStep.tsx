import { useState } from 'react';
import { ShoppingCart, Send, Loader2 } from 'lucide-react';
import {
  useCustomStudioStore,
  EFFECT_TO_TYPE,
  RHINESTONE_TO_TIER,
  CHARM_TO_TIER,
} from '@/stores/customStudioStore';
import { useCartStore } from '@/stores/cartStore';
import { supabase } from '@/integrations/supabase/client';
import { uploadInspirationImages } from '@/lib/uploadCustomArtwork';
import { logError } from '@/lib/logger';
import { toast } from 'sonner';
import {
  SHAPE_LABELS,
  LENGTH_LABELS,
  FINISH_LABELS,
  SHAPE_PRICES,
  LENGTH_PRICES,
  FINISH_PRICES,
  EFFECTS_PRICES,
  RHINESTONE_PRICES,
  CHARM_PRICES,
  BASE_CUSTOM_SET_PRICE,
} from '@/lib/pricing';
import { Product } from '@/lib/products';
import { cn } from '@/lib/utils';

interface PriceLineItem {
  label: string;
  amount: number;
}

export function ReviewStep() {
  const [submitting, setSubmitting] = useState<'cart' | 'quote' | null>(null);

  const store = useCustomStudioStore();
  const addItem = useCartStore((state) => state.addItem);

  const {
    orderPath,
    inspirationImages,
    inspirationText,
    shape,
    length,
    finish,
    selectedColors,
    colorNotes,
    effects,
    rhinestones,
    charms,
    extraNotes,
    getEstimatedPrice,
    setSubmissionType,
    setIsComplete,
    resetStudio,
  } = store;

  const estimatedPrice = getEstimatedPrice();

  // Build itemized breakdown
  const lineItems: PriceLineItem[] = [];
  lineItems.push({ label: 'Custom set base', amount: BASE_CUSTOM_SET_PRICE });
  if (shape && SHAPE_PRICES[shape] > 0) lineItems.push({ label: `${SHAPE_LABELS[shape]} shape`, amount: SHAPE_PRICES[shape] });
  if (length && LENGTH_PRICES[length] > 0) lineItems.push({ label: `${LENGTH_LABELS[length]} length`, amount: LENGTH_PRICES[length] });
  if (finish && FINISH_PRICES[finish] > 0) lineItems.push({ label: `${FINISH_LABELS[finish]} finish`, amount: FINISH_PRICES[finish] });
  for (const e of effects) {
    const effectType = EFFECT_TO_TYPE[e];
    lineItems.push({ label: e.charAt(0).toUpperCase() + e.slice(1), amount: EFFECTS_PRICES[effectType].allNails });
  }
  if (rhinestones !== 'none') {
    const tier = RHINESTONE_TO_TIER[rhinestones];
    lineItems.push({ label: `${rhinestones.charAt(0).toUpperCase() + rhinestones.slice(1)} rhinestones`, amount: RHINESTONE_PRICES[tier] });
  }
  if (charms !== 'none') {
    const tier = CHARM_TO_TIER[charms];
    const label = charms === 'few' ? 'A few charms' : 'Lots of charms';
    lineItems.push({ label, amount: CHARM_PRICES[tier] });
  }

  const buildPayload = (requiresQuote: boolean) => ({
    user_id: null as string | null,
    base_product_handle: 'custom-nail-set',
    shape: shape || '',
    length: length || '',
    finish: finish || '',
    colors: JSON.parse(JSON.stringify({
      palette: { name: 'Custom', colors: selectedColors },
      nailColors: {},
    })),
    accent_nails: [] as unknown[],
    effects: effects.map((e) => ({ effect: EFFECT_TO_TYPE[e], scope: 'all' as const })),
    rhinestones_tier: RHINESTONE_TO_TIER[rhinestones],
    charms_tier: CHARM_TO_TIER[charms],
    charms_preferences: extraNotes || null,
    artwork_type: inspirationImages.length > 0 ? 'custom' : ('none' as const),
    artwork_selections: [] as unknown[],
    custom_artwork_description: inspirationText || null,
    inspiration_images: [] as string[],
    estimated_price: estimatedPrice,
    requires_quote: requiresQuote,
    status: 'pending' as const,
    notes: [colorNotes, extraNotes].filter(Boolean).join(' | ') || null,
  });

  const handleSubmit = async (type: 'cart' | 'quote') => {
    setSubmitting(type);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData.session?.access_token;
      const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

      const payload = buildPayload(type === 'quote');
      const { data, error } = await supabase.functions.invoke('create-custom-order', {
        body: payload,
        headers,
      });

      if (error || !data) {
        logError('Failed to create order:', error);
        toast.error('Failed to create order', { description: 'Please try again.' });
        setSubmitting(null);
        return;
      }

      const order = data as { id: string };

      // Upload inspiration images if any
      if (inspirationImages.length > 0) {
        try {
          const uploadedUrls = await uploadInspirationImages(inspirationImages, order.id);
          await supabase.functions.invoke('update-order-images', {
            body: { orderId: order.id, inspirationImages: uploadedUrls },
            headers,
          });
        } catch (uploadErr) {
          logError('Image upload failed:', uploadErr);
          // Non-blocking — order still created
        }
      }

      if (type === 'cart') {
        // Add to cart
        const uniqueVariantId = `custom-set-${order.id}`;
        const variantTitle = `${shape ? SHAPE_LABELS[shape] : 'Custom'} · ${length ? LENGTH_LABELS[length] : ''} · ${finish ? FINISH_LABELS[finish] : ''}`;

        const selectedOptions = [
          { name: 'Shape', value: shape ? SHAPE_LABELS[shape] : '' },
          { name: 'Length', value: length ? LENGTH_LABELS[length] : '' },
          { name: 'Finish', value: finish ? FINISH_LABELS[finish] : '' },
        ];

        const customProduct: Product = {
          id: uniqueVariantId,
          title: 'Custom Nail Set',
          description: `Custom ${shape ? SHAPE_LABELS[shape] : ''} ${length ? LENGTH_LABELS[length] : ''} nails`,
          handle: 'custom-nail-set',
          price: estimatedPrice,
          currencyCode: 'USD',
          images: ['/placeholder.svg'],
          variants: [{
            id: uniqueVariantId,
            title: variantTitle,
            price: estimatedPrice,
            currencyCode: 'USD',
            availableForSale: true,
            selectedOptions,
          }],
          options: [],
          customizationData: {
            orderId: order.id,
            shape, length, finish, selectedColors, colorNotes,
            effects, rhinestones, charms, extraNotes,
            inspirationText,
          },
          complexityTier: 'custom' as Product['complexityTier'],
          primaryColor: 'custom' as Product['primaryColor'],
        };

        addItem({
          product: customProduct,
          variantId: uniqueVariantId,
          variantTitle,
          price: { amount: estimatedPrice.toFixed(2), currencyCode: 'USD' },
          quantity: 1,
          selectedOptions,
          needsSizingKit: false,
          sizingOption: 'known',
        });

        toast.success('Added to cart!', { description: 'Your custom nail set has been added.' });
      } else {
        toast.success('Quote request submitted!', {
          description: "We'll email you within 24-48 hours with pricing.",
          duration: 6000,
        });
      }

      setSubmissionType(type);
      setIsComplete(true);
    } catch (err) {
      logError('Submission error:', err);
      toast.error('Something went wrong', { description: 'Please try again.' });
    } finally {
      setSubmitting(null);
    }
  };

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="font-studio-display text-4xl md:text-5xl font-light text-foreground">
          Looking good!
        </h1>
        <p className="font-studio-body text-muted-foreground">Here's what you've created</p>
      </div>

      {/* Summary card */}
      <div className="bg-gradient-to-b from-studio-warm-white to-studio-cream-dark rounded-2xl p-6 space-y-4 border border-studio-taupe-light/30">
        {/* Inspiration — polaroid-style images */}
        {inspirationImages.length > 0 && (
          <div className="flex gap-3 overflow-x-auto pb-2">
            {inspirationImages.map((url, i) => (
              <img
                key={url}
                src={url}
                alt="Inspiration"
                className={cn(
                  'w-16 h-16 rounded-lg object-cover flex-shrink-0 border-2 border-white shadow-sm',
                  i % 2 === 0 ? '-rotate-1' : 'rotate-1'
                )}
              />
            ))}
          </div>
        )}
        {inspirationText && (
          <p className="font-studio-body text-sm text-muted-foreground italic leading-relaxed">
            "{inspirationText}"
          </p>
        )}

        {/* Basics */}
        <div className="flex items-center gap-2 font-studio-body text-sm">
          {shape && <span className="font-medium">{SHAPE_LABELS[shape]}</span>}
          <span className="text-studio-taupe-light">·</span>
          {length && <span>{LENGTH_LABELS[length]}</span>}
          <span className="text-studio-taupe-light">·</span>
          {finish && <span>{FINISH_LABELS[finish]}</span>}
        </div>

        {/* Colors — overlapping swatches */}
        <div className="flex items-center">
          {selectedColors.map((color, i) => (
            <div
              key={color}
              className={cn(
                'w-7 h-7 rounded-full shadow-sm border-2 border-white',
                i > 0 ? '-ml-1.5' : ''
              )}
              style={{ backgroundColor: color, zIndex: selectedColors.length - i }}
            />
          ))}
          {colorNotes && (
            <span className="font-studio-body text-xs text-muted-foreground ml-3">{colorNotes}</span>
          )}
        </div>

        {/* Extras */}
        {(effects.length > 0 || rhinestones !== 'none' || charms !== 'none') && (
          <div className="flex flex-wrap gap-1.5">
            {effects.map((e) => (
              <span key={e} className="font-studio-body text-xs bg-primary/10 text-primary px-2.5 py-0.5 rounded-full capitalize">
                {e}
              </span>
            ))}
            {rhinestones !== 'none' && (
              <span className="font-studio-body text-xs bg-primary/10 text-primary px-2.5 py-0.5 rounded-full">
                {rhinestones} rhinestones
              </span>
            )}
            {charms !== 'none' && (
              <span className="font-studio-body text-xs bg-primary/10 text-primary px-2.5 py-0.5 rounded-full">
                {charms === 'few' ? 'a few' : 'lots of'} charms
              </span>
            )}
          </div>
        )}

        {extraNotes && (
          <p className="font-studio-body text-xs text-muted-foreground">{extraNotes}</p>
        )}
      </div>

      {/* Price breakdown — receipt style */}
      <div className="space-y-2.5 px-1">
        {lineItems.map((item, i) => (
          <div key={i} className="flex items-baseline">
            <span className="font-studio-body text-sm text-muted-foreground">{item.label}</span>
            <span className="dotted-leader" />
            <span className="font-studio-body text-sm font-medium text-foreground">${item.amount.toFixed(2)}</span>
          </div>
        ))}
        <div className="flex items-baseline pt-3 mt-1 border-t border-studio-taupe-light/40">
          <span className="font-studio-display text-lg text-foreground">Estimated total</span>
          <span className="dotted-leader" />
          <span className="font-studio-display text-xl font-semibold text-foreground">${estimatedPrice.toFixed(2)}</span>
        </div>
      </div>

      {/* Edit link */}
      <button
        onClick={() => store.setStep(0)}
        className="font-studio-body text-sm text-studio-taupe hover:text-primary transition-colors duration-200 mx-auto block"
      >
        Edit selections &rarr;
      </button>

      {/* Single CTA based on intent chosen in Step 0 */}
      <div className="pt-1">
        {orderPath === 'cart' ? (
          <button
            onClick={() => handleSubmit('cart')}
            disabled={submitting !== null}
            className="w-full p-4 rounded-full bg-gradient-to-r from-studio-rose to-studio-rose-soft text-white font-studio-body font-medium text-base flex items-center justify-center gap-2 shadow-lg shadow-studio-rose/20 hover:shadow-xl hover:shadow-studio-rose/25 transition-all duration-300 disabled:opacity-50"
          >
            {submitting === 'cart' ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Adding to cart...</>
            ) : (
              <><ShoppingCart className="w-4 h-4" /> Add to Cart — ${estimatedPrice.toFixed(2)}</>
            )}
          </button>
        ) : (
          <button
            onClick={() => handleSubmit('quote')}
            disabled={submitting !== null}
            className="w-full p-4 rounded-full bg-gradient-to-r from-studio-rose to-studio-rose-soft text-white font-studio-body font-medium text-base flex items-center justify-center gap-2 shadow-lg shadow-studio-rose/20 hover:shadow-xl hover:shadow-studio-rose/25 transition-all duration-300 disabled:opacity-50"
          >
            {submitting === 'quote' ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</>
            ) : (
              <><Send className="w-4 h-4" /> Submit for Quote</>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

export default ReviewStep;
