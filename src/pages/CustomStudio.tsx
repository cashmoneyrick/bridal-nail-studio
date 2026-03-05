import { useCustomStudioStore } from '@/stores/customStudioStore';
import Navigation from '@/components/Navigation';
import ProgressDots from '@/components/custom-studio/ProgressDots';
import { StepWrapper } from '@/components/custom-studio/StepWrapper';
import IntentStep from '@/components/custom-studio/IntentStep';
import InspirationStep from '@/components/custom-studio/InspirationStep';
import BasicsStep from '@/components/custom-studio/BasicsStep';
import ColorsStep from '@/components/custom-studio/ColorsStep';
import ExtrasStep from '@/components/custom-studio/ExtrasStep';
import ReviewStep from '@/components/custom-studio/ReviewStep';
import ConfirmationScreen from '@/components/custom-studio/ConfirmationScreen';

const TOTAL_STEPS = 6;

const CustomStudio = () => {
  const {
    currentStep,
    isComplete,
    submissionType,
    nextStep,
    prevStep,
    resetStudio,
  } = useCustomStudioStore();

  const handleStartOver = () => {
    resetStudio();
  };

  return (
    <div className="custom-studio min-h-screen bg-background flex flex-col font-studio-body relative">
      {/* Paper grain texture */}
      <div className="grain-overlay" />

      <Navigation />
      <main className="flex-1 pt-20 relative z-10">
        {isComplete ? (
          <ConfirmationScreen
            type={submissionType!}
            onStartOver={handleStartOver}
          />
        ) : (
          <>
            <div className="pt-6 pb-2">
              <ProgressDots currentStep={currentStep} totalSteps={TOTAL_STEPS} />
            </div>
            <div className="flex-1 flex items-start justify-center">
              {/* key forces remount → CSS animation restarts on step change */}
              <div key={currentStep} className="w-full animate-fade-in-up">
                <StepWrapper onBack={currentStep > 0 ? prevStep : undefined}>
                  {currentStep === 0 && <IntentStep onNext={nextStep} />}
                  {currentStep === 1 && <InspirationStep onNext={nextStep} />}
                  {currentStep === 2 && <BasicsStep onNext={nextStep} />}
                  {currentStep === 3 && <ColorsStep onNext={nextStep} />}
                  {currentStep === 4 && <ExtrasStep onNext={nextStep} />}
                  {currentStep === 5 && <ReviewStep />}
                </StepWrapper>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default CustomStudio;
