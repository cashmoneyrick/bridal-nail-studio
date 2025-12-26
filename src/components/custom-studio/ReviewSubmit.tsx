import { useCustomStudioStore } from '@/stores/customStudioStore';
import { PriceDisplay } from './PriceDisplay';
import { Button } from '@/components/ui/button';
import { Check, Send, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export const ReviewSubmit = () => {
  const { 
    shape, 
    length, 
    baseFinish, 
    colorPalette,
    hasAccentNails,
    accentNails,
    effects,
    notes,
    getPriceBreakdown
  } = useCustomStudioStore();

  const priceBreakdown = getPriceBreakdown();

  const handleSubmit = () => {
    toast.success('Quote request submitted!', {
      description: 'We\'ll get back to you within 24-48 hours with your custom quote.',
    });
  };

  const selectedAccentCount = accentNails.size;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Review Your Design</h2>
        <p className="text-muted-foreground">
          Double-check your selections before submitting your custom quote request
        </p>
      </div>

      {/* Summary Sections */}
      <div className="space-y-4">
        {/* Base Look */}
        <div className="bg-muted/30 border border-border rounded-lg p-4">
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <Check className="w-4 h-4 text-primary" />
            Base Look
          </h3>
          <div className="grid sm:grid-cols-2 gap-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shape:</span>
              <span className="text-foreground capitalize">{shape || '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Length:</span>
              <span className="text-foreground capitalize">{length || '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Finish:</span>
              <span className="text-foreground capitalize">{baseFinish || '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Color Palette:</span>
              <span className="text-foreground capitalize">{colorPalette?.name || '—'}</span>
            </div>
          </div>
        </div>

        {/* Accent Nails */}
        <div className="bg-muted/30 border border-border rounded-lg p-4">
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <Check className="w-4 h-4 text-primary" />
            Accent Nails
          </h3>
          {hasAccentNails && selectedAccentCount > 0 ? (
            <p className="text-sm text-foreground">
              {selectedAccentCount} accent nail{selectedAccentCount !== 1 ? 's' : ''} selected
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">No accent nails selected</p>
          )}
        </div>

        {/* Effects */}
        <div className="bg-muted/30 border border-border rounded-lg p-4">
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <Check className="w-4 h-4 text-primary" />
            Effects & Add-ons
          </h3>
          {effects.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {effects.map((effectApp, index) => (
                <span 
                  key={index}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium"
                >
                  <Sparkles className="w-3 h-3" />
                  {effectApp.effect} ({effectApp.scope === 'all' ? 'All Nails' : 'Accents Only'})
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No effects selected</p>
          )}
        </div>

        {/* Notes */}
        {notes && (
          <div className="bg-muted/30 border border-border rounded-lg p-4">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Check className="w-4 h-4 text-primary" />
              Additional Notes
            </h3>
            <p className="text-sm text-muted-foreground italic">"{notes}"</p>
          </div>
        )}
      </div>

      {/* Final Price */}
      <PriceDisplay breakdown={priceBreakdown} collapsible={false} />

      {/* Submit Button */}
      <div className="pt-4">
        <Button 
          size="lg" 
          className="w-full"
          onClick={handleSubmit}
        >
          <Send className="w-4 h-4 mr-2" />
          Submit Custom Quote Request
        </Button>
        <p className="text-xs text-muted-foreground text-center mt-3">
          We'll review your design and send you a detailed quote within 24-48 hours.
        </p>
      </div>
    </div>
  );
};

export default ReviewSubmit;
