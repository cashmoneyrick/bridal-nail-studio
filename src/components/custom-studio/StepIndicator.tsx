import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { STEP_NAMES } from '@/stores/customStudioStore';

interface StepIndicatorProps {
  currentStep: number;
  onStepClick?: (step: number) => void;
  completedSteps?: Set<number>;
}

export const StepIndicator = ({ 
  currentStep, 
  onStepClick,
  completedSteps = new Set() 
}: StepIndicatorProps) => {
  return (
    <div className="w-full py-4">
      {/* Desktop view */}
      <div className="hidden md:flex items-center justify-between">
        {STEP_NAMES.map((name, index) => {
          const isCompleted = completedSteps.has(index) || index < currentStep;
          const isCurrent = index === currentStep;
          const isClickable = onStepClick && (isCompleted || index <= currentStep);
          
          return (
            <div key={name} className="flex items-center flex-1 last:flex-none">
              <button
                onClick={() => isClickable && onStepClick?.(index)}
                disabled={!isClickable}
                className={cn(
                  "flex flex-col items-center gap-2 transition-all",
                  isClickable && "cursor-pointer hover:opacity-80",
                  !isClickable && "cursor-default"
                )}
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all border-2",
                    isCompleted && !isCurrent && "bg-primary border-primary text-primary-foreground",
                    isCurrent && "bg-background border-primary text-primary ring-4 ring-primary/20",
                    !isCompleted && !isCurrent && "bg-muted border-muted-foreground/30 text-muted-foreground"
                  )}
                >
                  {isCompleted && !isCurrent ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    index + 1
                  )}
                </div>
                <span
                  className={cn(
                    "text-xs font-medium text-center max-w-[80px] leading-tight",
                    isCurrent && "text-primary",
                    isCompleted && !isCurrent && "text-foreground",
                    !isCompleted && !isCurrent && "text-muted-foreground"
                  )}
                >
                  {name}
                </span>
              </button>
              
              {/* Connector line */}
              {index < STEP_NAMES.length - 1 && (
                <div className="flex-1 mx-3 h-0.5 mt-[-20px]">
                  <div
                    className={cn(
                      "h-full transition-all",
                      index < currentStep ? "bg-primary" : "bg-muted-foreground/30"
                    )}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Mobile view - compact */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">
            Step {currentStep + 1} of {STEP_NAMES.length}
          </span>
          <span className="text-sm text-primary font-semibold">
            {STEP_NAMES[currentStep]}
          </span>
        </div>
        
        {/* Progress bar */}
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300 ease-out"
            style={{ width: `${((currentStep + 1) / STEP_NAMES.length) * 100}%` }}
          />
        </div>
        
        {/* Step dots */}
        <div className="flex justify-between mt-2">
          {STEP_NAMES.map((_, index) => {
            const isCompleted = completedSteps.has(index) || index < currentStep;
            const isCurrent = index === currentStep;
            
            return (
              <button
                key={index}
                onClick={() => onStepClick?.(index)}
                disabled={!onStepClick || (!isCompleted && index > currentStep)}
                className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium transition-all",
                  isCompleted && !isCurrent && "bg-primary text-primary-foreground",
                  isCurrent && "bg-primary text-primary-foreground ring-2 ring-primary/30",
                  !isCompleted && !isCurrent && "bg-muted text-muted-foreground"
                )}
              >
                {isCompleted && !isCurrent ? (
                  <Check className="w-3 h-3" />
                ) : (
                  index + 1
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StepIndicator;
