/**
 * EffectsSection — toggleable effects + rhinestone/charm tier selectors.
 * Features decorative section dividers, active glow states, extras subtotal,
 * and staggered entrance animations.
 */

import { motion, AnimatePresence } from 'framer-motion';
import { useCustomStudioStore } from '@/stores/customStudioStore';
import {
  EffectType, EFFECT_LABELS, EFFECTS_PRICES,
  RhinestoneTier, RHINESTONE_LABELS, RHINESTONE_PRICES,
  CharmTier, CHARM_LABELS, CHARM_PRICES,
} from '@/lib/pricing';
import SectionWrapper from './SectionWrapper';

// ── Decorative section divider ─────────────────────────────────────────

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-px" style={{ background: 'rgba(107,76,59,0.15)' }} />
      <span
        className="text-xs"
        style={{
          color: '#7A5A48',
          fontFamily: "'Playfair Display', serif",
          fontStyle: 'italic',
          letterSpacing: '0.05em',
        }}
      >
        {label}
      </span>
      <div className="flex-1 h-px" style={{ background: 'rgba(107,76,59,0.15)' }} />
    </div>
  );
}

// ── Effects ─────────────────────────────────────────────────────────────

const EFFECTS: EffectType[] = ['chrome', 'glitter', 'french-tip'];

function EffectToggles() {
  const { effects, toggleEffect } = useCustomStudioStore();

  return (
    <div>
      <SectionDivider label="Effects" />
      <p className="text-[10px] text-center mt-1.5 mb-3" style={{ color: '#9A7E6D' }}>
        Select multiple
      </p>
      <div className="flex flex-wrap gap-2 justify-center">
        {EFFECTS.map((effect) => {
          const isActive = effects.includes(effect);
          const price = EFFECTS_PRICES[effect].allNails;

          return (
            <motion.button
              key={effect}
              onClick={() => toggleEffect(effect)}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm"
              style={{
                background: isActive ? 'rgba(107,76,59,0.12)' : '#DBBFC2',
                border: `2px solid ${isActive ? '#6B4C3B' : 'transparent'}`,
                color: isActive ? '#3D2B1F' : '#7A5A48',
                boxShadow: isActive ? '0 0 12px rgba(107,76,59,0.2)' : 'none',
              }}
            >
              <span>{EFFECT_LABELS[effect]}</span>
              <span
                className="text-xs"
                style={{ color: isActive ? '#6B4C3B' : '#9A7E6D' }}
              >
                +${price}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// ── Tier selector ───────────────────────────────────────────────────────

interface TierSelectorProps<T extends string> {
  label: string;
  tiers: T[];
  current: T;
  labels: Record<T, string>;
  prices: Record<T, number>;
  onChange: (tier: T) => void;
}

function TierSelector<T extends string>({
  label,
  tiers,
  current,
  labels,
  prices,
  onChange,
}: TierSelectorProps<T>) {
  return (
    <div>
      <SectionDivider label={label} />
      <div className="grid grid-cols-2 gap-2 mt-3">
        {tiers.map((tier) => {
          const isActive = current === tier;
          const price = prices[tier];

          return (
            <motion.button
              key={tier}
              onClick={() => onChange(tier)}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center gap-0.5 py-2.5 px-2 rounded-xl text-center"
              style={{
                background: isActive ? 'rgba(107,76,59,0.08)' : '#DBBFC2',
                border: `2px solid ${isActive ? '#6B4C3B' : 'transparent'}`,
                boxShadow: isActive ? '0 0 12px rgba(107,76,59,0.2)' : 'none',
              }}
            >
              <span
                className="text-xs sm:text-sm font-medium"
                style={{ color: isActive ? '#3D2B1F' : '#7A5A48' }}
              >
                {labels[tier]}
              </span>
              <span
                className="text-[10px] sm:text-xs"
                style={{ color: price > 0 ? '#6B4C3B' : '#9A7E6D' }}
              >
                {price > 0 ? `+$${price}` : 'Free'}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// ── Main component ──────────────────────────────────────────────────────

const RHINESTONE_TIERS: RhinestoneTier[] = ['none', 'just-a-touch', 'a-little-sparkle', 'full-glam'];
const CHARM_TIERS: CharmTier[] = ['none', 'single-statement', 'a-few-accents', 'charmed-out'];

export default function EffectsSection() {
  const { effects, rhinestoneTier, charmTier, setRhinestoneTier, setCharmTier } =
    useCustomStudioStore();

  // Calculate extras subtotal
  const extrasTotal =
    effects.reduce((sum, e) => sum + EFFECTS_PRICES[e].allNails, 0) +
    RHINESTONE_PRICES[rhinestoneTier] +
    CHARM_PRICES[charmTier];

  return (
    <SectionWrapper title="Effects & Extras" scrollable>
      <div className="w-full max-w-md mx-auto flex flex-col gap-5 px-2">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0 }}
        >
          <EffectToggles />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <TierSelector
            label="Rhinestones"
            tiers={RHINESTONE_TIERS}
            current={rhinestoneTier}
            labels={RHINESTONE_LABELS}
            prices={RHINESTONE_PRICES}
            onChange={setRhinestoneTier}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <TierSelector
            label="Charms"
            tiers={CHARM_TIERS}
            current={charmTier}
            labels={CHARM_LABELS}
            prices={CHARM_PRICES}
            onChange={setCharmTier}
          />
        </motion.div>

        {/* Extras subtotal */}
        <div className="flex items-center justify-center pt-2">
          <AnimatePresence mode="wait">
            <motion.p
              key={extrasTotal}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="text-sm font-medium"
              style={{ color: extrasTotal > 0 ? '#6B4C3B' : '#9A7E6D' }}
            >
              {extrasTotal > 0 ? `Extras: +$${extrasTotal}` : 'No extras selected'}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </SectionWrapper>
  );
}
