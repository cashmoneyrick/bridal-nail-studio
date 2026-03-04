import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface ConfirmationScreenProps {
  type: 'cart' | 'quote';
  onStartOver: () => void;
}

export function ConfirmationScreen({ type, onStartOver }: ConfirmationScreenProps) {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-10rem)] px-4">
      <div className="text-center max-w-md mx-auto">
        {/* Animated check */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}
          className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6"
        >
          <Check className="w-8 h-8 text-primary" />
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="font-display text-3xl text-foreground mb-2"
        >
          {type === 'cart' ? "You're all set!" : 'Request submitted!'}
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-muted-foreground mb-8 max-w-sm mx-auto"
        >
          {type === 'cart'
            ? 'Your custom nail set has been added to your cart.'
            : "We'll review your request and email you within 24-48 hours with pricing."}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          {type === 'cart' && (
            <Button asChild className="rounded-xl">
              <Link to="/cart">View Cart</Link>
            </Button>
          )}
          <Button variant="outline" asChild className="rounded-xl">
            <Link to="/shop">Keep Shopping</Link>
          </Button>
          <Button
            variant="ghost"
            onClick={onStartOver}
            className="rounded-xl text-muted-foreground"
          >
            Design another set
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

export default ConfirmationScreen;
