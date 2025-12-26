import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Sparkles, Package, ArrowRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCustomStudioStore } from '@/stores/customStudioStore';
import { getProductByHandle } from '@/lib/products';

const StartingPoint = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { 
    entryMode, 
    baseProduct, 
    setBaseProduct, 
    setEntryMode, 
    nextStep 
  } = useCustomStudioStore();

  // Check for ?base= query param on mount
  useEffect(() => {
    const baseHandle = searchParams.get('base');
    if (baseHandle && !baseProduct) {
      const product = getProductByHandle(baseHandle);
      if (product) {
        setBaseProduct(product);
      }
    }
  }, [searchParams, baseProduct, setBaseProduct]);

  const handleStartFresh = () => {
    setEntryMode('fresh');
    setBaseProduct(null);
    nextStep();
  };

  const handleBrowseSets = () => {
    navigate('/shop');
  };

  const handleClearProduct = () => {
    setBaseProduct(null);
    setEntryMode('fresh');
    // Clear the query param
    navigate('/custom-studio', { replace: true });
  };

  const handleContinueWithProduct = () => {
    nextStep();
  };

  // If we have a base product, show the "from product" view
  if (baseProduct) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-semibold">Customize This Set</h2>
          <p className="text-muted-foreground">
            Starting with <span className="font-medium text-foreground">{baseProduct.title}</span> as your base
          </p>
        </div>

        <Card className="overflow-hidden">
          <div className="relative">
            {baseProduct.images?.[0] && (
              <img
                src={baseProduct.images[0]}
                alt={baseProduct.title}
                className="w-full h-64 object-cover"
              />
            )}
            <Button
              variant="secondary"
              size="icon"
              className="absolute top-3 right-3 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background"
              onClick={handleClearProduct}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CardContent className="p-4 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-lg">{baseProduct.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {baseProduct.description}
                </p>
              </div>
              <div className="text-lg font-semibold">
                ${baseProduct.price.toFixed(2)}
              </div>
            </div>

            <Button 
              className="w-full" 
              size="lg"
              onClick={handleContinueWithProduct}
            >
              Continue Customizing
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <div className="text-center">
          <button
            onClick={handleClearProduct}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline"
          >
            Or start from scratch instead
          </button>
        </div>
      </div>
    );
  }

  // Fresh start view - no base product
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold">How Would You Like to Start?</h2>
        <p className="text-muted-foreground">
          Design your perfect custom nail set
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Start from Scratch */}
        <Card 
          className="cursor-pointer transition-all hover:shadow-lg hover:border-primary/50 group"
          onClick={handleStartFresh}
        >
          <CardContent className="p-6 text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">Start from Scratch</h3>
              <p className="text-sm text-muted-foreground">
                Build your dream set from the ground up with complete creative freedom
              </p>
            </div>
            <div className="text-sm font-medium text-primary">
              Starting at $35.00
            </div>
          </CardContent>
        </Card>

        {/* Browse Existing Sets */}
        <Card 
          className="cursor-pointer transition-all hover:shadow-lg hover:border-primary/50 group"
          onClick={handleBrowseSets}
        >
          <CardContent className="p-6 text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center group-hover:bg-secondary transition-colors">
              <Package className="h-8 w-8 text-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">Browse Existing Sets</h3>
              <p className="text-sm text-muted-foreground">
                Find a set you love and customize it to make it uniquely yours
              </p>
            </div>
            <div className="text-sm font-medium text-muted-foreground">
              Customize any design
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StartingPoint;
