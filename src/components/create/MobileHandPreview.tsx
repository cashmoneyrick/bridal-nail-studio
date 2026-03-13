/**
 * MobileHandPreview — collapsible accordion wrapper for the hand preview on mobile.
 * Starts collapsed to maximize content space. Polished toggle bar with
 * refined typography and smooth expand/collapse animation.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HandPreview from './HandPreview';

export default function MobileHandPreview() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="flex-shrink-0" style={{ background: '#E8D0D2' }}>
      {/* Toggle bar */}
      <button
        onClick={() => setExpanded((prev) => !prev)}
        className="w-full flex items-center justify-center gap-2.5 py-3.5"
        style={{ color: '#6B4C3B' }}
      >
        <span
          className="text-sm tracking-wider"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontStyle: 'italic',
            letterSpacing: '0.05em',
          }}
        >
          {expanded ? 'Hide Preview' : 'Preview Your Design'}
        </span>
        <motion.svg
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
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
                background: 'linear-gradient(90deg, transparent 15%, rgba(107,76,59,0.18) 50%, transparent 85%)',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
