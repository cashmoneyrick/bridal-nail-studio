import { useMemo, useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useCustomStudioStore } from '@/stores/customStudioStore';
import StepIndicator from '@/components/custom-studio/StepIndicator';
import StartingPoint from '@/components/custom-studio/StartingPoint';
import BaseLook from '@/components/custom-studio/BaseLook';
import AccentNails from '@/components/custom-studio/AccentNails';
import { EffectsAddons } from '@/components/custom-studio/EffectsAddons';
import CustomArtwork from '@/components/custom-studio/CustomArtwork';
import ReviewSubmit from '@/components/custom-studio/ReviewSubmit';
import PriceDisplay from '@/components/custom-studio/PriceDisplay';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';

const CustomStudio = () => {
  const { 
    currentStep, 
    nextStep, 
    prevStep, 
    canProceed, 
    setStep,
    getPriceBreakdown,
    resetStudio,
    shape,
    length,
    baseFinish,
    colorPalette
  } = useCustomStudioStore();

  // Fix 6: Add reset confirmation dialog state
  const [showResetDialog, setShowResetDialog] = useState(false);

  // Compute completed steps based on store state
  const completedSteps = useMemo(() => {
    const completed = new Set<number>();
    
    // Step 0 (Starting Point) is complete once we've moved past it
    if (currentStep > 0) completed.add(0);
    
    // Step 1 (Base Look) is complete when required selections are made
    if (shape && length && baseFinish && colorPalette) {
      completed.add(1);
    }
    
    // Step 2 (Accent Nails) is always completable (optional step)
    if (currentStep > 2) completed.add(2);
    
    // Step 3 (Effects & Add-ons) is always completable (optional step)
    if (currentStep > 3) completed.add(3);
    
    // Step 4 (Custom Artwork) is always completable (optional step)
    if (currentStep > 4) completed.add(4);
    
    return completed;
  }, [currentStep, shape, length, baseFinish, colorPalette]);

  const priceBreakdown = getPriceBreakdown();

  const handleStepClick = (step: number) => {
    // Only allow clicking back to completed steps or current step
    if (step <= currentStep || completedSteps.has(step)) {
      setStep(step);
    }
  };

  // Fix 6: Show confirmation dialog instead of immediate reset
  const handleReset = () => {
    setShowResetDialog(true);
  };

  const confirmReset = () => {
    resetStudio();
    setShowResetDialog(false);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <StartingPoint />;
      case 1:
        return <BaseLook />;
      case 2:
        return <AccentNails />;
      case 3:
        return <EffectsAddons />;
      case 4:
        return <CustomArtwork />;
      case 5:
        return <ReviewSubmit />;
      default:
        return null;
    }
  };

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === 5;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      <main className="flex-1 pt-20">
        {/* Header */}
        <div className="bg-gradient-to-b from-primary/5 to-transparent py-8 md:py-12">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                Design Your Dream Set
              </h1>
              <p className="text-muted-foreground">
                Create your perfect custom press-on nails in just a few steps
              </p>
            </div>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="container mx-auto px-4 py-6">
          <StepIndicator 
            currentStep={currentStep}
            onStepClick={handleStepClick}
            completedSteps={completedSteps}
          />
        </div>

        {/* Main Content Area */}
        <div className="container mx-auto px-4 pb-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Step Content */}
            <div className="lg:col-span-2">
              <div className="bg-card border border-border rounded-xl p-6 md:p-8">
                {renderStepContent()}
              </div>
            </div>

            {/* Sidebar - Price & Navigation */}
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-24 space-y-4">
                {/* Price Display */}
                {currentStep > 0 && (
                  <PriceDisplay 
                    breakdown={priceBreakdown}
                    collapsible={true}
                  />
                )}

                {/* Navigation Buttons */}
                <div className="bg-card border border-border rounded-lg p-4 space-y-3">
                  <div className="flex gap-3">
                    {!isFirstStep && (
                      <Button
                        variant="outline"
                        onClick={prevStep}
                        className="flex-1"
                      >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Back
                      </Button>
                    )}
                    
                    {!isLastStep && (
                      <Button
                        onClick={nextStep}
                        disabled={!canProceed()}
                        className="flex-1"
                      >
                        Continue
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    )}
                  </div>

                  {/* Reset Button */}
                  {currentStep > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleReset}
                      className="w-full text-muted-foreground hover:text-foreground"
                    >
                      <RotateCcw className="w-3 h-3 mr-2" />
                      Start Over
                    </Button>
                  )}
                </div>

                {/* Help Text */}
                {!canProceed() && currentStep === 1 && (
                  <p className="text-xs text-muted-foreground text-center px-2">
                    Complete all required selections to continue
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Fix 6: Reset Confirmation Dialog */}
      <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Start over?</AlertDialogTitle>
            <AlertDialogDescription>
              This will clear all your customization choices and reset the design studio. 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmReset}>
              Yes, start over
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CustomStudio;
