import { motion } from 'framer-motion';
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
        {/* Animated check — SVG stroke-draw */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}
          className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/10 to-studio-gold/10 flex items-center justify-center mx-auto mb-8"
        >
          <svg
            width="36"
            height="36"
            viewBox="0 0 36 36"
            fill="none"
            className="text-primary"
          >
            <polyline
              points="8,18 15,26 28,10"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="40"
              strokeDashoffset="40"
              className="animate-stroke-draw"
            />
          </svg>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="font-studio-display text-4xl text-foreground mb-3"
        >
          {type === 'cart' ? "You're all set!" : 'Request submitted!'}
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="font-studio-body text-muted-foreground mb-10 max-w-sm mx-auto leading-relaxed"
        >
          {type === 'cart'
            ? 'Your custom nail set has been added to your cart.'
            : "We'll review your vision and email you within 24-48 hours with pricing."}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          {type === 'cart' && (
            <Button asChild className="rounded-full font-studio-body bg-gradient-to-r from-studio-rose to-studio-rose-soft text-white border-0 shadow-lg shadow-studio-rose/20 hover:shadow-xl hover:shadow-studio-rose/25">
              <Link to="/cart">View Cart</Link>
            </Button>
          )}
          <Button variant="outline" asChild className="rounded-full font-studio-body border-studio-taupe-light text-foreground hover:bg-studio-cream-dark">
            <Link to="/shop">Keep Shopping</Link>
          </Button>
          <Button
            variant="ghost"
            onClick={onStartOver}
            className="rounded-full font-studio-body text-studio-taupe hover:text-foreground hover:bg-transparent"
          >
            Design another set
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

export default ConfirmationScreen;
