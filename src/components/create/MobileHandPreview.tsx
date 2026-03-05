/**
 * MobileHandPreview — collapsible accordion wrapper for the hand preview on mobile.
 * Starts collapsed to maximize content space.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HandPreview from './HandPreview';

export default function MobileHandPreview() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="flex-shrink-0" style={{ background: '#2E2620' }}>
      {/* Toggle bar */}
      <button
        onClick={() => setExpanded((prev) => !prev)}
        className="w-full flex items-center justify-center gap-2 py-1.5"
        style={{ color: '#B8AFA6' }}
      >
        <span
          className="text-xs"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontStyle: 'italic',
            letterSpacing: '0.03em',
          }}
        >
          {expanded ? 'Hide Preview' : 'Preview Your Design'}
        </span>
        <motion.svg
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polyline points="6 9 12 15 18 9" />
        </motion.svg>
      </button>

      {/* Collapsible hand preview */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <HandPreview />
            {/* Decorative bottom edge */}
            <div
              className="h-px"
              style={{
                background: 'linear-gradient(90deg, transparent 15%, rgba(194,104,113,0.2) 50%, transparent 85%)',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
