import { motion } from 'framer-motion';

interface ProgressDotsProps {
  currentStep: number;
  totalSteps: number;
}

export function ProgressDots({ currentStep, totalSteps }: ProgressDotsProps) {
  return (
    <div className="flex flex-col items-center gap-3 py-6">
      <div className="flex items-center justify-center gap-1.5">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div key={i} className="flex items-center">
            <div className="relative flex items-center justify-center">
              {i === currentStep ? (
                <motion.div
                  layoutId="active-dot"
                  className="w-5 h-1.5 rounded-full bg-primary"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              ) : (
                <div
                  className={`w-1.5 h-1.5 rounded-full transition-colors duration-500 ${
                    i < currentStep ? 'bg-primary/50' : 'bg-studio-taupe-light'
                  }`}
                />
              )}
            </div>
            {/* Connecting line */}
            {i < totalSteps - 1 && (
              <div
                className={`w-3 h-px mx-0.5 transition-colors duration-500 ${
                  i < currentStep ? 'bg-primary/30' : 'bg-studio-taupe-light/50'
                }`}
              />
            )}
          </div>
        ))}
      </div>
      <span className="font-studio-body text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
        Step {currentStep + 1} of {totalSteps}
      </span>
    </div>
  );
}

export default ProgressDots;
