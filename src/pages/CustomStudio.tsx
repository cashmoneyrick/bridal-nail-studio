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
import MobileBottomNav from '@/components/custom-studio/MobileBottomNav';
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
  
  // Mobile BaseLook micro-step state (0 = Shape, 1 = Length, 2 = Finish, 3 = Color)
  const [baseLookMicroStep, setBaseLookMicroStep] = useState(0);
  
  // Mobile AccentNails micro-step state (0 = Yes/No, 1 = Select nails, 2 = Configure)
  const [accentMicroStep, setAccentMicroStep] = useState(0);

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
      // Reset micro-step when navigating away from BaseLook
      if (step !== 1) {
        setBaseLookMicroStep(0);
      }
    }
  };

  // Fix 6: Show confirmation dialog instead of immediate reset
  const handleReset = () => {
    setShowResetDialog(true);
  };

  const confirmReset = () => {
    resetStudio();
    setBaseLookMicroStep(0);
    setAccentMicroStep(0);
    setShowResetDialog(false);
  };
  
  // Handle skip-to-next when user selects "No accents"
  const handleAccentSkip = () => {
    nextStep();
    setAccentMicroStep(0);
  };

  // Handle mobile back button (aware of BaseLook and AccentNails micro-steps)
  const handleMobileBack = () => {
    // Handle AccentNails micro-steps (step 2)
    if (currentStep === 2 && accentMicroStep > 0) {
      setAccentMicroStep(accentMicroStep - 1);
      return;
    }
    
    // Handle BaseLook micro-steps (step 1)
    if (currentStep === 1 && baseLookMicroStep > 0) {
      setBaseLookMicroStep(baseLookMicroStep - 1);
      return;
    }
    
    // Otherwise go to previous main step
    prevStep();
    // Reset micro-steps when leaving a step
    if (currentStep === 1) setBaseLookMicroStep(0);
    if (currentStep === 2) setAccentMicroStep(0);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <StartingPoint />;
      case 1:
        return (
          <BaseLook 
            microStep={baseLookMicroStep} 
            setMicroStep={setBaseLookMicroStep} 
          />
        );
      case 2:
        return (
          <AccentNails
            microStep={accentMicroStep}
            setMicroStep={setAccentMicroStep}
            onSkipToNext={handleAccentSkip}
          />
        );
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
  
  // Show back button on mobile if not first step OR if in any step with micro-step > 0
  const showMobileBack = currentStep > 0 || baseLookMicroStep > 0 || accentMicroStep > 0;

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-x-hidden w-full max-w-full">
      <Navigation />
      
      <main className="flex-1 pt-20">
        {/* Header */}
        <div className="bg-gradient-to-b from-primary/5 to-transparent py-8 md:py-12 w-full max-w-full overflow-hidden">
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
        <div className="container mx-auto px-4 pb-24 lg:pb-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Step Content */}
            <div className="lg:col-span-2">
              <div className="bg-card border border-border rounded-xl p-6 md:p-8">
                {/* Mobile back button */}
                {showMobileBack && (
                  <button
                    onClick={handleMobileBack}
                    className="lg:hidden flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4 -mt-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Back
                  </button>
                )}
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
                <div className="hidden lg:block bg-card border border-border rounded-lg p-4 space-y-3">
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

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav
        priceBreakdown={priceBreakdown}
        onContinue={nextStep}
        canProceed={canProceed()}
        isLastStep={isLastStep}
        currentStep={currentStep}
      />

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
