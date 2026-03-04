import { motion } from 'framer-motion';

interface ProgressDotsProps {
  currentStep: number;
  totalSteps: number;
}

export function ProgressDots({ currentStep, totalSteps }: ProgressDotsProps) {
  return (
    <div className="flex items-center justify-center gap-2 py-6">
      {Array.from({ length: totalSteps }).map((_, i) => (
        <div key={i} className="relative flex items-center justify-center">
          {i === currentStep ? (
            <motion.div
              layoutId="active-dot"
              className="w-6 h-2 rounded-full bg-primary"
              transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            />
          ) : (
            <div
              className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                i < currentStep ? 'bg-primary' : 'bg-muted-foreground/20'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default ProgressDots;
