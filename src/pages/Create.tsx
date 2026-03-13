/**
 * Create page — the Custom Nail Designer.
 * Desktop: two-column layout (sticky hand preview left, step content right).
 * Mobile: collapsible hand preview + full-width step content.
 */

import { useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCustomStudioStore } from '@/stores/customStudioStore';
import { useIsMobile } from '@/hooks/use-mobile';
import { SHAPE_LABELS, LENGTH_LABELS, FINISH_LABELS } from '@/lib/pricing';
import CreateHeader from '@/components/create/CreateHeader';
import HandPreview from '@/components/create/HandPreview';
import MobileHandPreview from '@/components/create/MobileHandPreview';
import ShapeSection from '@/components/create/ShapeSection';
import LengthSection from '@/components/create/LengthSection';
import ColorSection from '@/components/create/ColorSection';
import FinishSection from '@/components/create/FinishSection';
import EffectsSection from '@/components/create/EffectsSection';
import ReviewSection from '@/components/create/ReviewSection';

const TOTAL_SECTIONS = 6;

const SECTIONS = [
  ShapeSection,
  LengthSection,
  ColorSection,
  FinishSection,
  EffectsSection,
  ReviewSection,
];

const Create = () => {
  const { activeSection, setActiveSection, shape, length, defaultNailConfig } = useCustomStudioStore();
  const isMobile = useIsMobile();
  const contentRef = useRef<HTMLDivElement>(null);

  const handleContinue = useCallback(() => {
    if (activeSection + 1 < TOTAL_SECTIONS) {
      setActiveSection(activeSection + 1);
    }
  }, [activeSection, setActiveSection]);

  const handleBack = useCallback(() => {
    if (activeSection > 0) {
      setActiveSection(activeSection - 1);
    }
  }, [activeSection, setActiveSection]);

  // Scroll content to top when step changes
  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0 });
  }, [activeSection]);

  // ── Auto-advance for discrete selection steps ──────────────────────────
  // Snapshot values when arriving at a section so we only advance on *changes*
  const arrivedValues = useRef({
    shape, length, finish: defaultNailConfig.finish,
  });

  useEffect(() => {
    arrivedValues.current = {
      shape, length, finish: defaultNailConfig.finish,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSection]);

  // Auto-advance: Shape (0), Length (1), Finish (3)
  useEffect(() => {
    const autoSections = [0, 1, 3] as const;
    if (!autoSections.includes(activeSection as 0 | 1 | 3)) return;

    const currentValues = { 0: shape, 1: length, 3: defaultNailConfig.finish } as Record<number, string>;
    const arrivedVals = { 0: arrivedValues.current.shape, 1: arrivedValues.current.length, 3: arrivedValues.current.finish } as Record<number, string>;

    if (currentValues[activeSection] === arrivedVals[activeSection]) return;

    const timer = setTimeout(handleContinue, 600);
    return () => clearTimeout(timer);
  }, [activeSection, shape, length, defaultNailConfig.finish, handleContinue]);

  const ActiveSection = SECTIONS[activeSection];
  const isLastSection = activeSection >= TOTAL_SECTIONS - 1;

  // Show manual continue button only for Color (2), Effects (4), Review (5)
  const showContinueButton = activeSection === 2 || activeSection >= 4;
  const ctaLabel = isLastSection
    ? 'Add to Cart'
    : activeSection === TOTAL_SECTIONS - 2
      ? 'Review Design'
      : 'Next';

  const ContinueButton = () =>
    showContinueButton ? (
      <div className="flex justify-center py-6 pb-10">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleContinue}
          className="flex items-center gap-2 rounded-full text-sm font-semibold"
          style={{
            padding: '14px 28px',
            background: '#6B4C3B',
            color: '#FFF',
            boxShadow: '0 2px 12px rgba(107,76,59,0.25)',
          }}
        >
          {isLastSection && (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
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
    ) : null;

  return (
    <div className="h-screen flex flex-col" style={{ background: '#FDF2F3' }}>
      {/* Fixed header */}
      <CreateHeader
        totalSections={TOTAL_SECTIONS}
        activeSection={activeSection}
        onBack={activeSection > 0 ? handleBack : undefined}
      />

      {/* Main content — below header */}
      <div className="flex-1 min-h-0 pt-14 sm:pt-16">
        {isMobile ? (
          /* Mobile: single column */
          <div className="h-full flex flex-col">
            <MobileHandPreview />
            <div ref={contentRef} className="flex-1 min-h-0 overflow-y-auto flex flex-col">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="flex-1 flex flex-col"
              >
                <ActiveSection />
                <ContinueButton />
              </motion.div>
            </div>
          </div>
        ) : (
          /* Desktop: two columns */
          <div className="h-full flex">
            {/* Left — sticky hand preview + design summary */}
            <div
              className="w-[40%] flex flex-col items-center justify-center relative"
              style={{ background: '#E8D0D2' }}
            >
              {/* Radial rose glow behind hands */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'radial-gradient(ellipse at center, rgba(107,76,59,0.05) 0%, transparent 70%)',
                }}
              />

              {/* "Your Design" label */}
              <p
                className="relative text-xs uppercase mb-4"
                style={{
                  color: '#9A7E6D',
                  fontFamily: "'Playfair Display', serif",
                  fontStyle: 'italic',
                  letterSpacing: '0.25em',
                }}
              >
                Your Design
              </p>

              <div className="relative">
                <HandPreview />
              </div>

              {/* Mini selection summary */}
              <AnimatePresence mode="wait">
                <motion.p
                  key={`${shape}-${length}-${defaultNailConfig.finish}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.3 }}
                  className="relative text-xs mt-4"
                  style={{ color: '#9A7E6D', letterSpacing: '0.05em' }}
                >
                  {SHAPE_LABELS[shape]} · {LENGTH_LABELS[length]} · {FINISH_LABELS[defaultNailConfig.finish]}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Right — step content */}
            <div ref={contentRef} className="w-[60%] overflow-y-auto flex flex-col">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="flex-1 flex flex-col"
              >
                <ActiveSection />
                <ContinueButton />
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Create;
