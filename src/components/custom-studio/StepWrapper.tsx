import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';

interface StepWrapperProps {
  children: React.ReactNode;
  onBack?: () => void;
  stepKey: number;
}

export function StepWrapper({ children, onBack, stepKey }: StepWrapperProps) {
  return (
    <motion.div
      key={stepKey}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="w-full max-w-xl mx-auto px-4 py-8"
    >
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 mb-8"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>
      )}
      {children}
    </motion.div>
  );
}

export default StepWrapper;
