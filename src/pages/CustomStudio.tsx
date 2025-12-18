import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { fetchProductByHandle, ShopifyProduct } from "@/lib/shopify";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Upload, Sparkles, ArrowRight, X, ImagePlus } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const NAIL_SHAPES = ['Almond', 'Coffin', 'Stiletto', 'Square', 'Oval'];
const NAIL_LENGTHS = ['Short', 'Medium', 'Long', 'Extra Long'];
const FINISHES = ['Glossy', 'Matte', 'Chrome', 'Glitter', 'French Tip'];

const ShapeIcon = ({ shape, selected }: { shape: string; selected: boolean }) => {
  const baseClass = `w-full h-10 transition-colors ${selected ? 'text-primary' : 'text-muted-foreground'}`;
  
  switch (shape.toLowerCase()) {
    case 'almond':
      return (
        <svg viewBox="0 0 24 40" className={baseClass}>
          <path d="M12 2C8 2 4 8 4 20C4 32 8 38 12 38C16 38 20 32 20 20C20 8 16 2 12 2Z" 
            fill={selected ? 'hsl(var(--primary))' : 'hsl(var(--muted))'} 
            stroke={selected ? 'hsl(var(--primary))' : 'hsl(var(--border))'} 
            strokeWidth="1.5"/>
        </svg>
      );
    case 'coffin':
      return (
        <svg viewBox="0 0 24 40" className={baseClass}>
          <path d="M6 38L4 8C4 4 8 2 12 2C16 2 20 4 20 8L18 38H6Z" 
            fill={selected ? 'hsl(var(--primary))' : 'hsl(var(--muted))'} 
            stroke={selected ? 'hsl(var(--primary))' : 'hsl(var(--border))'} 
            strokeWidth="1.5"/>
        </svg>
      );
    case 'stiletto':
      return (
        <svg viewBox="0 0 24 40" className={baseClass}>
          <path d="M12 2L4 38H20L12 2Z" 
            fill={selected ? 'hsl(var(--primary))' : 'hsl(var(--muted))'} 
            stroke={selected ? 'hsl(var(--primary))' : 'hsl(var(--border))'} 
            strokeWidth="1.5"/>
        </svg>
      );
    case 'square':
      return (
        <svg viewBox="0 0 24 40" className={baseClass}>
          <path d="M4 8C4 4 8 2 12 2C16 2 20 4 20 8V38H4V8Z" 
            fill={selected ? 'hsl(var(--primary))' : 'hsl(var(--muted))'} 
            stroke={selected ? 'hsl(var(--primary))' : 'hsl(var(--border))'} 
            strokeWidth="1.5"/>
        </svg>
      );
    case 'oval':
      return (
        <svg viewBox="0 0 24 40" className={baseClass}>
          <ellipse cx="12" cy="20" rx="8" ry="18" 
            fill={selected ? 'hsl(var(--primary))' : 'hsl(var(--muted))'} 
            stroke={selected ? 'hsl(var(--primary))' : 'hsl(var(--border))'} 
            strokeWidth="1.5"/>
        </svg>
      );
    default:
      return null;
  }
};

const CustomStudio = () => {
  const [searchParams] = useSearchParams();
  const baseProductHandle = searchParams.get('base');
  
  const [baseProduct, setBaseProduct] = useState<ShopifyProduct['node'] | null>(null);
  const [loadingProduct, setLoadingProduct] = useState(false);
  const [selectedShape, setSelectedShape] = useState('Almond');
  const [selectedLength, setSelectedLength] = useState('Medium');
  const [selectedFinishes, setSelectedFinishes] = useState<string[]>(['Glossy']);
  const [notes, setNotes] = useState('');
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  useEffect(() => {
    const loadBaseProduct = async () => {
      if (!baseProductHandle) return;
      
      setLoadingProduct(true);
      try {
        const data = await fetchProductByHandle(baseProductHandle);
        setBaseProduct(data);
      } catch (err) {
        console.error('Failed to load base product:', err);
      } finally {
        setLoadingProduct(false);
      }
    };

    loadBaseProduct();
  }, [baseProductHandle]);

  const toggleFinish = (finish: string) => {
    setSelectedFinishes(prev => 
      prev.includes(finish) 
        ? prev.filter(f => f !== finish)
        : [...prev, finish]
    );
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setUploadedImages(prev => [...prev, e.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const clearBaseProduct = () => {
    setBaseProduct(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-sm font-medium tracking-[0.2em] uppercase text-primary mb-3">
              Custom Studio
            </p>
            <h1 className="font-display text-4xl sm:text-5xl font-medium mb-4">
              Design Your Dream Set
            </h1>
            <p className="text-muted-foreground text-lg">
              Create a custom nail set tailored to your vision. Upload inspiration, 
              choose your preferences, and our artists will bring it to life.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Left Column - Inspiration & Base */}
            <div className="space-y-8">
              {/* Base Product */}
              {loadingProduct ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : baseProduct ? (
                <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-lg font-medium">Starting From</h3>
                    <button 
                      onClick={clearBaseProduct}
                      className="p-1 hover:bg-muted rounded-full transition-colors"
                    >
                      <X className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </div>
                  <div className="flex gap-4">
                    {baseProduct.images.edges[0] && (
                      <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                        <img 
                          src={baseProduct.images.edges[0].node.url} 
                          alt={baseProduct.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <h4 className="font-display font-medium">{baseProduct.title}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {baseProduct.description}
                      </p>
                      <p className="text-primary font-display mt-1">
                        From ${parseFloat(baseProduct.priceRange.minVariantPrice.amount).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-muted/30 border border-dashed border-border rounded-2xl p-8 text-center">
                  <Sparkles className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-display text-lg font-medium mb-2">No Base Selected</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    You can start from scratch or browse our collection to find a design to customize.
                  </p>
                  <Link to="/#shop">
                    <Button variant="outline" className="rounded-full">
                      Browse Collection
                    </Button>
                  </Link>
                </div>
              )}

              {/* Inspiration Upload */}
              <div className="space-y-4">
                <h3 className="font-display text-lg font-medium">Inspiration Photos</h3>
                <div className="grid grid-cols-3 gap-3">
                  {uploadedImages.map((img, idx) => (
                    <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group">
                      <img src={img} alt={`Inspiration ${idx + 1}`} className="w-full h-full object-cover" />
                      <button
                        onClick={() => removeImage(idx)}
                        className="absolute top-2 right-2 p-1 bg-background/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  <label className="aspect-square rounded-xl border-2 border-dashed border-border hover:border-primary/50 flex flex-col items-center justify-center cursor-pointer transition-colors">
                    <ImagePlus className="h-6 w-6 text-muted-foreground mb-1" />
                    <span className="text-xs text-muted-foreground">Add Photo</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      multiple 
                      className="hidden" 
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-4">
                <h3 className="font-display text-lg font-medium">Design Notes</h3>
                <Textarea 
                  placeholder="Describe your vision... colors, patterns, specific details you want"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="min-h-[120px] rounded-xl resize-none"
                />
              </div>
            </div>

            {/* Right Column - Options */}
            <div className="space-y-8">
              {/* Shape */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-lg font-medium">Shape</h3>
                  <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
                    {selectedShape}
                  </span>
                </div>
                <div className="flex gap-2">
                  {NAIL_SHAPES.map(shape => (
                    <button
                      key={shape}
                      onClick={() => setSelectedShape(shape)}
                      className={`flex-1 flex flex-col items-center gap-1 p-3 rounded-xl border transition-all ${
                        selectedShape === shape 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <ShapeIcon shape={shape} selected={selectedShape === shape} />
                      <span className={`text-xs ${selectedShape === shape ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                        {shape}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Length */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-lg font-medium">Length</h3>
                  <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
                    {selectedLength}
                  </span>
                </div>
                <div className="flex gap-2">
                  {NAIL_LENGTHS.map(length => (
                    <button
                      key={length}
                      onClick={() => setSelectedLength(length)}
                      className={`flex-1 px-4 py-3 rounded-full text-sm font-medium transition-all ${
                        selectedLength === length
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }`}
                    >
                      {length}
                    </button>
                  ))}
                </div>
              </div>

              {/* Finishes */}
              <div className="space-y-4">
                <h3 className="font-display text-lg font-medium">Finishes</h3>
                <p className="text-sm text-muted-foreground">Select one or more finishes</p>
                <div className="flex flex-wrap gap-2">
                  {FINISHES.map(finish => (
                    <button
                      key={finish}
                      onClick={() => toggleFinish(finish)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        selectedFinishes.includes(finish)
                          ? 'bg-secondary text-secondary-foreground'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }`}
                    >
                      {finish}
                    </button>
                  ))}
                </div>
              </div>

              {/* Summary Card */}
              <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
                <h3 className="font-display text-lg font-medium">Your Custom Set</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shape</span>
                    <span className="font-medium">{selectedShape}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Length</span>
                    <span className="font-medium">{selectedLength}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Finishes</span>
                    <span className="font-medium">{selectedFinishes.join(', ')}</span>
                  </div>
                  {baseProduct && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Base Design</span>
                      <span className="font-medium">{baseProduct.title}</span>
                    </div>
                  )}
                </div>
                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-1">Estimated Price</p>
                  <p className="font-display text-2xl text-primary">From $65.00</p>
                </div>
              </div>

              {/* Submit */}
              <Button className="w-full btn-primary text-base py-6">
                <Sparkles className="h-5 w-5 mr-2" />
                Request Custom Quote
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                Our team will review your request and get back to you within 24-48 hours 
                with a custom quote and estimated delivery time.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CustomStudio;
