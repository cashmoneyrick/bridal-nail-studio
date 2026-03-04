import { motion } from 'framer-motion';
import { QUIZ_STEPS } from '@/stores/customStudioStore';

interface QuizProgressProps {
  currentStep: number;
}

export function QuizProgress({ currentStep }: QuizProgressProps) {
  const totalSteps = QUIZ_STEPS.length;
  const progress = Math.min(((currentStep + 1) / totalSteps) * 100, 100);

  return (
    <div className="w-full max-w-xl mx-auto px-4">
      <div className="relative h-1 bg-muted rounded-full overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 bg-primary rounded-full"
          initial={false}
          animate={{ width: `${progress}%` }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      </div>
      <p className="text-xs text-muted-foreground text-center mt-3">
        {currentStep + 1} of {totalSteps}
      </p>
    </div>
  );
}

export default QuizProgress;
