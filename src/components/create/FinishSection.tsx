/**
 * FinishSection — 3×3 grid of finish options.
 * Each card shows a CSS-rendered texture preview circle, name, description, and price.
 * Selected card gets rose border + glow + spring bounce.
 */

import { motion } from 'framer-motion';
import { useCustomStudioStore } from '@/stores/customStudioStore';
import { FinishType, FINISH_LABELS, FINISH_PRICES } from '@/lib/pricing';
import SectionWrapper from './SectionWrapper';

interface FinishOption {
  value: FinishType;
  description: string;
}

const FINISH_VISUALS: Record<FinishType, string> = {
  glossy: 'linear-gradient(135deg, #F5F0EB 0%, #E8DDD5 50%, #F5F0EB 100%)',
  matte: '#B8AFA6',
  'velvet-matte': 'linear-gradient(135deg, #A89F97 0%, #B8AFA6 50%, #A89F97 100%)',
  'chrome-finish': 'linear-gradient(135deg, #C0C0C0 0%, #E8E8E8 30%, #808080 60%, #E8E8E8 100%)',
  holographic: 'linear-gradient(135deg, #FFB3BA 0%, #BAFFC9 25%, #BAE1FF 50%, #E8BAFF 75%, #FFB3BA 100%)',
  'cat-eye': 'linear-gradient(135deg, #2D4A2D 0%, #5A8A5A 40%, #2D4A2D 60%, #1A2E1A 100%)',
  sugar: 'radial-gradient(circle at 30% 30%, #FFF 1px, transparent 1px), radial-gradient(circle at 70% 60%, #FFF 1px, transparent 1px), radial-gradient(circle at 50% 40%, #FFF 0.5px, transparent 0.5px), #D4C4B8',
  'glass-aurora': 'linear-gradient(135deg, #E8F0FF 0%, #FFE8F0 33%, #E8FFE8 66%, #F0E8FF 100%)',
  'glitter-topcoat': 'radial-gradient(circle at 25% 25%, #FFD700 1.5px, transparent 1.5px), radial-gradient(circle at 75% 75%, #FFD700 1px, transparent 1px), radial-gradient(circle at 50% 50%, #FFD700 0.5px, transparent 0.5px), linear-gradient(135deg, #F5F0EB, #E8DDD5)',
};

const FINISH_OPTIONS: FinishOption[] = [
  { value: 'glossy', description: 'Classic high shine' },
  { value: 'matte', description: 'Smooth, no shine' },
  { value: 'velvet-matte', description: 'Soft velvety texture' },
  { value: 'chrome-finish', description: 'Mirror reflective' },
  { value: 'holographic', description: 'Rainbow shift' },
  { value: 'cat-eye', description: 'Magnetic light band' },
  { value: 'sugar', description: 'Sparkly texture' },
  { value: 'glass-aurora', description: 'Iridescent glass' },
  { value: 'glitter-topcoat', description: 'Glitter overlay' },
];

export default function FinishSection() {
  const { defaultNailConfig, setDefaultNailConfig } = useCustomStudioStore();
  const currentFinish = defaultNailConfig.finish;

  return (
    <SectionWrapper title="Select Your Finish">
      <div className="w-full max-w-md mx-auto px-2">
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {FINISH_OPTIONS.map(({ value, description }) => {
            const isSelected = currentFinish === value;
            const price = FINISH_PRICES[value];

            return (
              <motion.button
                key={value}
                onClick={() => setDefaultNailConfig({ finish: value })}
                whileTap={{ scale: 0.95 }}
                whileHover={{ y: -3 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="relative flex flex-col items-center justify-center gap-1.5 py-3 sm:py-4 px-2 rounded-xl text-center"
                style={{
                  background: isSelected ? 'rgba(194,104,113,0.08)' : '#5A524A',
                  border: `2px solid ${isSelected ? '#C26871' : 'rgba(90,82,74,0.6)'}`,
                  boxShadow: isSelected
                    ? '0 0 20px rgba(194,104,113,0.15), inset 0 0 15px rgba(194,104,113,0.05)'
                    : 'none',
                }}
              >
                {/* Texture preview circle */}
                <div
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full"
                  style={{
                    background: FINISH_VISUALS[value],
                    border: '1px solid rgba(255,255,255,0.1)',
                    boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)',
                  }}
                />

                {/* Name */}
                <span
                  className="text-xs sm:text-sm font-medium leading-tight"
                  style={{ color: isSelected ? '#F5F0EB' : '#B8AFA6' }}
                >
                  {FINISH_LABELS[value]}
                </span>

                {/* Description — visible on all sizes */}
                <span
                  className="text-[10px] sm:text-xs leading-tight"
                  style={{ color: '#8A827A' }}
                >
                  {description}
                </span>

                {/* Price */}
                <span
                  className="text-[10px] sm:text-xs font-medium"
                  style={{ color: price > 0 ? '#C26871' : '#8A827A' }}
                >
                  {price > 0 ? `+$${price}` : 'Included'}
                </span>

                {/* Selected check */}
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px]"
                    style={{ background: '#C26871', color: '#fff' }}
                  >
                    ✓
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </SectionWrapper>
  );
}
