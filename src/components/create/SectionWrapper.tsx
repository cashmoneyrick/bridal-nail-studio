/**
 * SectionWrapper — wraps section content with consistent styling.
 * Parent in Create.tsx handles scrolling context.
 * Features grain texture overlay, decorative ornament, and luxury typography.
 */

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface SectionWrapperProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  /** Tighter padding for content-heavy sections */
  scrollable?: boolean;
}

// Inline SVG noise for grain texture — no external assets
const GRAIN_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

export default function SectionWrapper({ title, subtitle, children, className, scrollable }: SectionWrapperProps) {
  return (
    <section
      className={`relative flex flex-col items-center px-6 ${scrollable ? 'py-3' : 'py-6'} sm:px-10 sm:py-8 ${scrollable ? '' : 'flex-1'} ${className || ''}`}
      style={{
        background: '#4D453E',
        borderTop: '1px solid rgba(194,104,113,0.08)',
      }}
    >
      {/* Grain texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: GRAIN_SVG,
          backgroundRepeat: 'repeat',
          backgroundSize: '128px 128px',
          opacity: 0.03,
          mixBlendMode: 'overlay',
        }}
      />

      {/* Vertically center content when section is taller than content */}
      <div className={`relative w-full max-w-3xl flex flex-col items-center ${scrollable ? '' : 'my-auto'}`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={`text-center flex-shrink-0 ${scrollable ? 'mb-2 sm:mb-6' : 'mb-4 sm:mb-6'}`}
        >
          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-light"
            style={{
              color: '#F5F0EB',
              fontFamily: "'Playfair Display', serif",
              fontStyle: 'italic',
              letterSpacing: '0.02em',
              textShadow: '0 1px 8px rgba(194,104,113,0.15)',
            }}
          >
            {title}
          </h2>
          {subtitle ? (
            <p className="mt-2 text-sm sm:text-base" style={{ color: '#B8AFA6' }}>
              {subtitle}
            </p>
          ) : (
            /* Decorative ornament — thin lines flanking a diamond */
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
              className="flex items-center justify-center gap-2 mt-3"
            >
              <div className="w-10 sm:w-14 h-px" style={{ background: 'rgba(194,104,113,0.3)' }} />
              <span className="text-[8px]" style={{ color: 'rgba(194,104,113,0.5)' }}>◇</span>
              <div className="w-10 sm:w-14 h-px" style={{ background: 'rgba(194,104,113,0.3)' }} />
            </motion.div>
          )}
        </motion.div>

        <div className="w-full flex flex-col items-center">
          {children}
        </div>
      </div>
    </section>
  );
}
