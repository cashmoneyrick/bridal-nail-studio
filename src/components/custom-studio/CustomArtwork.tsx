import { useCustomStudioStore } from '@/stores/customStudioStore';
import { Palette, Upload, Sparkles } from 'lucide-react';

export const CustomArtwork = () => {
  const { notes, setNotes, inspirationImages, addInspirationImage } = useCustomStudioStore();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Custom Artwork</h2>
        <p className="text-muted-foreground">
          Add your personal touch with custom nail art designs
        </p>
      </div>

      {/* Coming Soon Notice */}
      <div className="bg-primary/5 border border-primary/20 rounded-xl p-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
          <Sparkles className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Custom Artwork Options Coming Soon
        </h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          We're working on an amazing selection of custom artwork options including 
          hand-painted designs, decals, and 3D embellishments.
        </p>
      </div>

      {/* Preview of Future Features */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-muted/30 border border-border rounded-lg p-4 text-center opacity-60">
          <Palette className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm font-medium text-muted-foreground">Hand-Painted Art</p>
        </div>
        <div className="bg-muted/30 border border-border rounded-lg p-4 text-center opacity-60">
          <Upload className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm font-medium text-muted-foreground">Upload Your Design</p>
        </div>
        <div className="bg-muted/30 border border-border rounded-lg p-4 text-center opacity-60">
          <Sparkles className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm font-medium text-muted-foreground">3D Embellishments</p>
        </div>
      </div>

      {/* Notes Section - Functional */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">
          Additional Notes or Requests
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Describe any custom artwork ideas, color preferences, or special requests..."
          className="w-full h-32 px-4 py-3 bg-background border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground"
        />
        <p className="text-xs text-muted-foreground">
          Our artists will review your notes when preparing your quote.
        </p>
      </div>
    </div>
  );
};

export default CustomArtwork;
