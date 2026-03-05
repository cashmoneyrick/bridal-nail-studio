/**
 * CreateHeader — fixed top bar with logo and back button.
 * Progress is communicated via the contextual CTA in PriceBar.
 */

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface CreateHeaderProps {
  totalSections: number;
  activeSection: number;
  onBack?: () => void;
}

export default function CreateHeader({ onBack }: CreateHeaderProps) {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: 'linear-gradient(to bottom, #3D352E, rgba(61,53,46,0.85))',
        backdropFilter: 'blur(12px)',
        boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
      }}
    >
      <div className="flex items-center justify-between px-5 py-3 sm:px-8 sm:py-5">
        {/* Left: back arrow + logo */}
        <div className="flex items-center gap-2">
          {onBack && (
            <motion.button
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.05, background: 'rgba(194,104,113,0.15)' }}
              whileTap={{ scale: 0.92 }}
              onClick={onBack}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center -ml-1"
              style={{
                color: '#F5F0EB',
                background: 'rgba(90,82,74,0.5)',
                border: '1px solid rgba(194,104,113,0.25)',
              }}
              aria-label="Go back"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </motion.button>
          )}
          <Link to="/" className="inline-block">
            <h1
              className="text-lg sm:text-xl font-semibold tracking-tight"
              style={{
                color: '#C26871',
                fontFamily: "'Playfair Display', serif",
              }}
            >
              YourPrettySets
            </h1>
          </Link>
        </div>
      </div>
    </header>
  );
}
