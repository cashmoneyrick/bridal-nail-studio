import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuizCardProps {
  children: React.ReactNode;
  onBack?: () => void;
  className?: string;
}

export function QuizCard({ children, onBack, className }: QuizCardProps) {
  return (
    <div className={cn(
      'flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] px-4 py-8',
      className
    )}>
      <div className="w-full max-w-xl mx-auto">
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 group"
          >
            <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            Back
          </button>
        )}
        {children}
      </div>
    </div>
  );
}

// Animated wrapper for card transitions
export function QuizCardAnimated({
  children,
  onBack,
  className,
}: QuizCardProps & { direction?: number; stepKey?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="w-full"
    >
      <QuizCard onBack={onBack} className={className}>
        {children}
      </QuizCard>
    </motion.div>
  );
}

export default QuizCard;
