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
import PriceBar from '@/components/create/PriceBar';

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

  const ActiveSection = SECTIONS[activeSection];

  return (
    <div className="h-screen flex flex-col" style={{ background: '#3D352E' }}>
      {/* Fixed header */}
      <CreateHeader
        totalSections={TOTAL_SECTIONS}
        activeSection={activeSection}
        onBack={activeSection > 0 ? handleBack : undefined}
      />

      {/* Main content — below header, above price bar */}
      <div className="flex-1 min-h-0 pt-14 sm:pt-16 pb-20 sm:pb-24">
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
              </motion.div>
            </div>
          </div>
        ) : (
          /* Desktop: two columns */
          <div className="h-full flex">
            {/* Left — sticky hand preview + design summary */}
            <div
              className="w-[40%] flex flex-col items-center justify-center relative"
              style={{ background: '#2E2620' }}
            >
              {/* Radial rose glow behind hands */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'radial-gradient(ellipse at center, rgba(194,104,113,0.05) 0%, transparent 70%)',
                }}
              />

              {/* "Your Design" label */}
              <p
                className="relative text-xs uppercase mb-4"
                style={{
                  color: '#8A827A',
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
                  style={{ color: '#8A827A', letterSpacing: '0.05em' }}
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
              </motion.div>
            </div>
          </div>
        )}
      </div>

      {/* Fixed price bar */}
      <PriceBar
        onContinue={handleContinue}
        activeSection={activeSection}
        totalSections={TOTAL_SECTIONS}
      />
    </div>
  );
};

export default Create;
