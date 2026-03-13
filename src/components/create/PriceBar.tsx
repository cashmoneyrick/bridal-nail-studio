/**
 * PriceBar — fixed bottom checkout bar.
 * Layout: [step of total] | [price] | [contextual CTA]
 * CTA shows the NEXT step name so the user always knows where they're headed.
 */

import { motion, AnimatePresence } from 'framer-motion';
import { useCustomStudioStore } from '@/stores/customStudioStore';

interface PriceBarProps {
  onContinue: () => void;
  activeSection: number;
  totalSections: number;
}

const NEXT_STEP_LABELS = ['Length', 'Color', 'Finish', 'Extras', 'Review'];

export default function PriceBar({ onContinue, activeSection, totalSections }: PriceBarProps) {
  const estimatedPrice = useCustomStudioStore((s) => s.estimatedPrice());
  const isLastSection = activeSection >= totalSections - 1;
  const isReviewStep = activeSection === totalSections - 2; // "Extras" → next is "Review"

  // CTA label
  const ctaLabel = isLastSection
    ? 'Add to Cart'
    : isReviewStep
      ? 'Review Design'
      : `Next: ${NEXT_STEP_LABELS[activeSection]}`;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      {/* Fade gradient above bar */}
      <div
        className="h-5 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, rgba(232,208,210,0.95), transparent)',
        }}
      />

      {/* Main bar */}
      <div
        className="relative"
        style={{
          background: 'rgba(232,208,210,0.97)',
          backdropFilter: 'blur(20px) saturate(1.3)',
          borderTop: '1px solid rgba(107,76,59,0.08)',
        }}
      >
        <div className="flex items-center gap-3 px-4 py-3 sm:px-8 sm:py-4">
          {/* Left: Step fraction */}
          <div className="flex-shrink-0">
            <span
              className="text-xs tabular-nums"
              style={{ color: '#9A7E6D' }}
            >
              {activeSection + 1} of {totalSections}
            </span>
          </div>

          {/* Center: Price */}
          <div className="flex-1 flex justify-center">
            <AnimatePresence mode="wait">
              <motion.span
                key={estimatedPrice}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
                className="text-2xl sm:text-3xl font-semibold tabular-nums tracking-tight"
                style={{ color: '#3D2B1F' }}
              >
                ${estimatedPrice}
              </motion.span>
            </AnimatePresence>
          </div>

          {/* Right: Contextual CTA */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={onContinue}
            className="flex-shrink-0 flex items-center gap-2 rounded-full text-sm font-semibold"
            style={{
              padding: isLastSection ? '12px 24px' : '12px 20px',
              background: '#6B4C3B',
              color: '#FFF',
              boxShadow: '0 2px 12px rgba(107,76,59,0.25)',
            }}
          >
            {isLastSection && (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
            )}
            {ctaLabel}
            {!isLastSection && (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
