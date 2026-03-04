import { useRef, useCallback } from 'react';
import { ImagePlus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useCustomStudioStore } from '@/stores/customStudioStore';

interface InspirationStepProps {
  onNext: () => void;
}

export function InspirationStep({ onNext }: InspirationStepProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    inspirationImages,
    inspirationText,
    addInspirationImage,
    removeInspirationImage,
    setInspirationText,
    canAdvance,
  } = useCustomStudioStore();

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return;
      const remaining = 5 - inspirationImages.length;
      const toAdd = Array.from(files).slice(0, remaining);
      for (const file of toAdd) {
        const url = URL.createObjectURL(file);
        addInspirationImage(url);
      }
    },
    [inspirationImages.length, addInspirationImage]
  );

  const handleRemove = useCallback(
    (url: string) => {
      URL.revokeObjectURL(url);
      removeInspirationImage(url);
    },
    [removeInspirationImage]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="font-display text-3xl md:text-4xl text-foreground">
          Show us your vision
        </h1>
        <p className="text-muted-foreground">
          Upload inspiration photos or describe what you're dreaming of
        </p>
      </div>

      {/* Upload zone */}
      {inspirationImages.length < 5 && (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="w-full border-2 border-dashed border-border rounded-2xl p-8 flex flex-col items-center gap-3 hover:border-primary/40 transition-colors duration-200 cursor-pointer"
        >
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
            <ImagePlus className="w-5 h-5 text-muted-foreground" />
          </div>
          <span className="text-sm text-muted-foreground">
            Drop images here or tap to upload
          </span>
          <span className="text-xs text-muted-foreground/60">
            Up to {5 - inspirationImages.length} more
          </span>
        </button>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {/* Thumbnails */}
      {inspirationImages.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {inspirationImages.map((url) => (
            <div key={url} className="relative aspect-square rounded-xl overflow-hidden group">
              <img
                src={url}
                alt="Inspiration"
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => handleRemove(url)}
                className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              >
                <X className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Divider */}
      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-border" />
        <span className="text-sm text-muted-foreground">or</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Text area */}
      <Textarea
        value={inspirationText}
        onChange={(e) => setInspirationText(e.target.value)}
        placeholder="Describe your dream nails... colors, vibes, inspiration"
        className="min-h-[100px] rounded-xl resize-none"
      />

      {/* Continue */}
      <Button
        onClick={onNext}
        disabled={!canAdvance()}
        className="w-full rounded-xl h-12 text-base font-medium"
      >
        Continue
      </Button>
    </div>
  );
}

export default InspirationStep;
