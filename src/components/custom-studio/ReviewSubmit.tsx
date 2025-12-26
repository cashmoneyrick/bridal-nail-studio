import { useState } from 'react';
import { useCustomStudioStore } from '@/stores/customStudioStore';
import { useCartStore } from '@/stores/cartStore';
import { supabase } from '@/integrations/supabase/client';
import { uploadInspirationImages } from '@/lib/uploadCustomArtwork';
import { PriceDisplay } from './PriceDisplay';
import { Button } from '@/components/ui/button';
import { 
  ShoppingCart, 
  Send, 
  Sparkles, 
  Palette, 
  Hand, 
  Gem, 
  Image, 
  FileText,
  Pencil,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { 
  SHAPE_LABELS, 
  LENGTH_LABELS, 
  FINISH_LABELS,
  EFFECT_LABELS,
  RHINESTONE_LABELS,
  CHARM_LABELS,
  NAIL_ART_LABELS,
  FINGER_NAMES
} from '@/lib/pricing';
import { Product } from '@/lib/products';

export const ReviewSubmit = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { 
    shape, 
    length, 
    baseFinish, 
    colorPalette,
    nailColors,
    hasAccentNails,
    accentNails,
    accentConfigs,
    effects,
    rhinestoneTier,
    charmTier,
    charmPreferences,
    predefinedArtwork,
    customArtwork,
    notes,
    inspirationImages,
    setStep,
    getPriceBreakdown,
    resetStudio
  } = useCustomStudioStore();

  const addItem = useCartStore(state => state.addItem);

  const priceBreakdown = getPriceBreakdown();
  const hasCustomArtwork = customArtwork !== null;
  const selectedAccentNails = Array.from(accentNails);

  // Determine artwork type for database
  const getArtworkType = (): 'none' | 'predefined' | 'custom' | 'both' => {
    const hasPredefined = predefinedArtwork.length > 0;
    const hasCustom = customArtwork !== null;
    
    if (hasPredefined && hasCustom) return 'both';
    if (hasCustom) return 'custom';
    if (hasPredefined) return 'predefined';
    return 'none';
  };

  // Build the order payload for Supabase
  const buildOrderPayload = (imageUrls: string[] = []) => {
    return {
      user_id: null as string | null, // Will be set after async call
      base_product_handle: 'custom-nail-set',
      shape: shape || '',
      length: length || '',
      finish: baseFinish || '',
      colors: JSON.parse(JSON.stringify({
        palette: colorPalette,
        nailColors: nailColors,
      })),
      accent_nails: JSON.parse(JSON.stringify(selectedAccentNails.map(nailIndex => ({
        index: nailIndex,
        config: accentConfigs[nailIndex] || null,
        color: nailColors[nailIndex as keyof typeof nailColors] || null,
      })))),
      effects: JSON.parse(JSON.stringify(effects.map(e => ({
        effect: e.effect,
        scope: e.scope,
      })))),
      rhinestones_tier: rhinestoneTier || 'none',
      charms_tier: charmTier || 'none',
      charms_preferences: charmPreferences || null,
      artwork_type: getArtworkType(),
      artwork_selections: JSON.parse(JSON.stringify(predefinedArtwork.map(a => ({
        type: a.type,
        nails: Array.from(a.nails),
      })))),
      custom_artwork_description: customArtwork?.description || null,
      inspiration_images: imageUrls,
      estimated_price: priceBreakdown.subtotal,
      requires_quote: hasCustomArtwork,
      status: 'pending' as const,
      notes: notes || null,
    };
  };

  // Helper to create order via edge function with server-side validation
  const createOrderViaEdgeFunction = async (requiresQuote: boolean): Promise<{ id: string } | null> => {
    const { data: sessionData } = await supabase.auth.getSession();
    const accessToken = sessionData.session?.access_token;
    
    const orderPayload = buildOrderPayload();
    orderPayload.requires_quote = requiresQuote;
    
    const { data, error } = await supabase.functions.invoke('create-custom-order', {
      body: orderPayload,
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    });
    
    if (error) {
      console.error('Failed to create order via edge function:', error);
      return null;
    }
    
    return data as { id: string };
  };

  const handleAddToCart = async () => {
    setIsSubmitting(true);
    
    try {
      // Create order via edge function with server-side validation
      const order = await createOrderViaEdgeFunction(false);
      
      if (!order) {
        toast.error('Failed to create order', {
          description: 'Please try again or contact support.',
        });
        setIsSubmitting(false);
        return;
      }

      // Generate unique variant ID using the order ID
      const uniqueVariantId = `custom-set-${order.id}`;
      
      // Build selected options array from all customization choices
      const selectedOptions: Array<{ name: string; value: string }> = [
        { name: 'Shape', value: shape ? SHAPE_LABELS[shape] : 'Not selected' },
        { name: 'Length', value: length ? LENGTH_LABELS[length] : 'Not selected' },
        { name: 'Finish', value: baseFinish ? FINISH_LABELS[baseFinish] : 'Not selected' },
        { name: 'Color Palette', value: colorPalette?.name || 'Custom' },
      ];

      if (hasAccentNails && accentNails.size > 0) {
        selectedOptions.push({ name: 'Accent Nails', value: `${accentNails.size} nails` });
      }

      if (effects.length > 0) {
        selectedOptions.push({ 
          name: 'Effects', 
          value: effects.map(e => EFFECT_LABELS[e.effect]).join(', ') 
        });
      }

      if (rhinestoneTier && rhinestoneTier !== 'none') {
        selectedOptions.push({ name: 'Rhinestones', value: RHINESTONE_LABELS[rhinestoneTier] });
      }

      if (charmTier && charmTier !== 'none') {
        selectedOptions.push({ name: 'Charms', value: CHARM_LABELS[charmTier] });
      }

      if (predefinedArtwork.length > 0) {
        selectedOptions.push({ 
          name: 'Nail Art', 
          value: predefinedArtwork.map(a => NAIL_ART_LABELS[a.type]).join(', ') 
        });
      }

      const variantTitle = `${shape ? SHAPE_LABELS[shape] : 'Custom'} • ${length ? LENGTH_LABELS[length] : ''} • ${colorPalette?.name || 'Custom Colors'}`;

      const customizationData: Record<string, unknown> = {
        orderId: order.id,
        shape,
        length,
        baseFinish,
        colorPalette,
        nailColors: { ...nailColors },
        hasAccentNails,
        accentNails: Array.from(accentNails),
        accentConfigs: { ...accentConfigs },
        effects: effects.map(e => ({ effect: e.effect, scope: e.scope })),
        rhinestoneTier,
        charmTier,
        charmPreferences,
        predefinedArtwork: predefinedArtwork.map(a => ({
          type: a.type,
          nails: Array.from(a.nails)
        })),
        notes,
        priceBreakdown: priceBreakdown.items.map(item => ({
          label: item.label,
          amount: item.amount,
          isQuoteRequired: item.isQuoteRequired
        })),
      };

      const customProduct: Product = {
        id: uniqueVariantId,
        title: 'Custom Nail Set',
        description: `Custom ${shape ? SHAPE_LABELS[shape] : ''} ${length ? LENGTH_LABELS[length] : ''} nails with ${baseFinish ? FINISH_LABELS[baseFinish] : ''} finish`,
        handle: 'custom-nail-set',
        price: priceBreakdown.subtotal,
        currencyCode: 'USD',
        images: ['/placeholder.svg'],
        variants: [{
          id: uniqueVariantId,
          title: variantTitle,
          price: priceBreakdown.subtotal,
          currencyCode: 'USD',
          availableForSale: true,
          selectedOptions: selectedOptions,
        }],
        options: [],
        customizationData,
      };

      addItem({
        product: customProduct,
        variantId: uniqueVariantId,
        variantTitle: variantTitle,
        price: {
          amount: priceBreakdown.subtotal.toFixed(2),
          currencyCode: 'USD',
        },
        quantity: 1,
        selectedOptions: selectedOptions,
      });

      toast.success('Added to cart!', {
        description: 'Your custom nail set has been added to your cart.',
      });
      
      // Reset the studio after successful add
      resetStudio();
      
    } catch (err) {
      console.error('Error adding to cart:', err);
      toast.error('Something went wrong', {
        description: 'Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRequestQuote = async () => {
    setIsSubmitting(true);
    
    try {
      // Create order via edge function with server-side validation
      const order = await createOrderViaEdgeFunction(true);
      
      if (!order) {
        toast.error('Failed to submit quote request', {
          description: 'Please try again or contact support.',
        });
        setIsSubmitting(false);
        return;
      }
      
      // Collect all inspiration images (from customArtwork and general inspirationImages)
      const allBlobUrls: string[] = [
        ...inspirationImages,
        ...(customArtwork?.inspirationImages || []),
      ];
      
      // Upload images if any
      let uploadedImageUrls: string[] = [];
      if (allBlobUrls.length > 0) {
        uploadedImageUrls = await uploadInspirationImages(allBlobUrls, order.id);
        
        // Update order with image URLs
        const { error: updateError } = await supabase
          .from('custom_orders')
          .update({ inspiration_images: uploadedImageUrls })
          .eq('id', order.id);
        
        if (updateError) {
          console.error('Failed to update order with images:', updateError);
        }
      }
      
      toast.success('Quote request submitted!', {
        description: "Your custom request has been submitted! We'll email you a quote within 24-48 hours.",
        duration: 6000,
      });
      
      // Reset the studio after successful submission
      resetStudio();
      
    } catch (err) {
      console.error('Error submitting quote request:', err);
      toast.error('Something went wrong', {
        description: 'Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper to get finger names for selected nails
  const getFingerNames = (nailIndices: number[]) => {
    return nailIndices.map(i => FINGER_NAMES[i]).join(', ');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Review Your Design</h2>
        <p className="text-muted-foreground">
          Double-check your selections before {hasCustomArtwork ? 'requesting your quote' : 'placing your order'}
        </p>
      </div>

      {/* Summary Sections */}
      <div className="space-y-4">
        {/* Base Look */}
        <SummarySection 
          icon={<Palette className="w-4 h-4" />}
          title="Base Look"
          onEdit={() => setStep(1)}
        >
          <div className="space-y-3">
            <div className="grid sm:grid-cols-2 gap-2 text-sm">
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
              <div className="flex gap-1.5">
                {colorPalette.colors.map((color, i) => (
                  <div 
                    key={i}
                    className="w-6 h-6 rounded-full border border-border shadow-sm"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            )}
          </div>
        </SummarySection>

        {/* Accent Nails */}
        <SummarySection 
          icon={<Hand className="w-4 h-4" />}
          title="Accent Nails"
          onEdit={() => setStep(2)}
        >
          {hasAccentNails && selectedAccentNails.length > 0 ? (
            <p className="text-sm text-foreground">
              {selectedAccentNails.length} accent nail{selectedAccentNails.length !== 1 ? 's' : ''} selected: {getFingerNames(selectedAccentNails)}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">No accent nails selected</p>
          )}
        </SummarySection>

        {/* Effects & Add-ons */}
        <SummarySection 
          icon={<Gem className="w-4 h-4" />}
          title="Effects & Add-ons"
          onEdit={() => setStep(3)}
        >
          <div className="space-y-2">
            {/* Effects */}
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

            {/* Rhinestones & Charms */}
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
        </SummarySection>

        {/* Custom Artwork */}
        <SummarySection 
          icon={<Image className="w-4 h-4" />}
          title="Custom Artwork"
          onEdit={() => setStep(4)}
        >
          <div className="space-y-2">
            {/* Predefined Artwork */}
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

            {/* Custom Artwork Request */}
            {customArtwork ? (
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-500/10 text-amber-600 rounded-full text-xs font-medium">
                    Custom Request
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {customArtwork.nails.size} nail{customArtwork.nails.size !== 1 ? 's' : ''}
                  </span>
                </div>
                {customArtwork.description && (
                  <p className="text-sm text-muted-foreground italic line-clamp-2">
                    "{customArtwork.description}"
                  </p>
                )}
                {customArtwork.inspirationImages.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    📷 {customArtwork.inspirationImages.length} inspiration image{customArtwork.inspirationImages.length !== 1 ? 's' : ''} uploaded
                  </p>
                )}
              </div>
            ) : null}

            {predefinedArtwork.length === 0 && !customArtwork && (
              <p className="text-sm text-muted-foreground">No artwork selected</p>
            )}
          </div>
        </SummarySection>

        {/* Notes */}
        {notes && (
          <SummarySection 
            icon={<FileText className="w-4 h-4" />}
            title="Additional Notes"
            onEdit={() => setStep(4)}
          >
            <p className="text-sm text-muted-foreground italic">"{notes}"</p>
          </SummarySection>
        )}
      </div>

      {/* Final Price */}
      <PriceDisplay breakdown={priceBreakdown} collapsible={false} />

      {/* Conditional CTA */}
      <div className="pt-4 space-y-3">
        {hasCustomArtwork ? (
          <>
            <Button 
              size="lg" 
              className="w-full"
              onClick={handleRequestQuote}
            >
              <Send className="w-4 h-4 mr-2" />
              Request Custom Quote
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Our artist will review your request and respond within 24-48 hours with final pricing.
            </p>
          </>
        ) : (
          <>
            <Button 
              size="lg" 
              className="w-full"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add to Cart — ${priceBreakdown.subtotal.toFixed(2)}
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Free shipping on orders over $75
            </p>
          </>
        )}
      </div>
    </div>
  );
};

// Reusable Summary Section Component
interface SummarySectionProps {
  icon: React.ReactNode;
  title: string;
  onEdit: () => void;
  children: React.ReactNode;
}

const SummarySection = ({ icon, title, onEdit, children }: SummarySectionProps) => (
  <div className="bg-muted/30 border border-border rounded-lg p-4">
    <div className="flex items-center justify-between mb-3">
      <h3 className="font-semibold text-foreground flex items-center gap-2">
        <span className="text-primary">{icon}</span>
        {title}
      </h3>
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
        onClick={onEdit}
      >
        <Pencil className="w-3 h-3 mr-1" />
        Edit
      </Button>
    </div>
    {children}
  </div>
);

export default ReviewSubmit;
