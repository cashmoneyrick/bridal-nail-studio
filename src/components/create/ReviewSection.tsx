/**
 * ReviewSection — luxury receipt-style order summary with dual checkout paths.
 * Features gradient top border, order summary header with ornament,
 * color swatch in line items, rose-tinted total row, and upgraded CTAs.
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useCustomStudioStore } from '@/stores/customStudioStore';
import {
  SHAPE_LABELS, SHAPE_PRICES,
  LENGTH_LABELS, LENGTH_PRICES,
  FINISH_LABELS, FINISH_PRICES,
  BASE_TYPE_LABELS,
  EFFECT_LABELS, EFFECTS_PRICES,
  RHINESTONE_LABELS, RHINESTONE_PRICES,
  CHARM_LABELS, CHARM_PRICES,
  BASE_CUSTOM_SET_PRICE,
} from '@/lib/pricing';
import SectionWrapper from './SectionWrapper';

interface LineItemProps {
  label: string;
  value: string;
  price: number;
  swatch?: string;
}

function LineItem({ label, value, price, swatch }: LineItemProps) {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-2">
        {swatch && (
          <div
            className="w-4 h-4 rounded-full flex-shrink-0"
            style={{ background: swatch, border: '1px solid rgba(255,255,255,0.1)' }}
          />
        )}
        <div>
          <span className="text-xs" style={{ color: '#8A827A' }}>
            {label}
          </span>
          {value && (
            <span className="text-sm ml-2" style={{ color: '#F5F0EB' }}>
              {value}
            </span>
          )}
        </div>
      </div>
      <span
        className="text-xs font-medium"
        style={{ color: price > 0 ? '#C26871' : '#8A827A' }}
      >
        {price > 0 ? `+$${price}` : 'Included'}
      </span>
    </div>
  );
}

export default function ReviewSection() {
  const store = useCustomStudioStore();
  const {
    shape, length,
    defaultNailConfig,
    effects,
    rhinestoneTier, charmTier,
    specialInstructions, setSpecialInstructions,
  } = store;

  const total = store.estimatedPrice();
  const [submitted, setSubmitted] = useState(false);

  const handleAddToCart = () => {
    setSubmitted(true);
    // TODO: integrate with cartStore
  };

  const handleRequestQuote = () => {
    setSubmitted(true);
    // TODO: integrate with Supabase custom_orders
  };

  if (submitted) {
    return (
      <SectionWrapper title="Thank You!">
        <div className="flex flex-col items-center gap-4 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            className="w-16 h-16 rounded-full flex items-center justify-center text-2xl"
            style={{ background: 'rgba(194,104,113,0.15)', color: '#C26871' }}
          >
            ✓
          </motion.div>
          <p className="text-sm" style={{ color: '#B8AFA6' }}>
            Your custom set has been saved. We'll be in touch!
          </p>
          <button
            onClick={() => {
              store.reset();
              setSubmitted(false);
            }}
            className="px-6 py-2 rounded-full text-sm"
            style={{ background: '#5A524A', color: '#F5F0EB' }}
          >
            Design Another Set
          </button>
        </div>
      </SectionWrapper>
    );
  }

  return (
    <SectionWrapper title="Review Your Design" scrollable>
      <div className="w-full max-w-md mx-auto flex flex-col gap-4 px-2">
        {/* Receipt card */}
        <div
          className="rounded-xl overflow-hidden"
          style={{
            background: 'rgba(74,66,59,0.6)',
            borderTop: '2px solid transparent',
            borderImage: 'linear-gradient(90deg, transparent 10%, #C26871 50%, transparent 90%) 1',
          }}
        >
          {/* Card header */}
          <div className="flex flex-col items-center pt-4 pb-2">
            <p
              className="text-sm"
              style={{
                color: '#B8AFA6',
                fontFamily: "'Playfair Display', serif",
                fontStyle: 'italic',
                letterSpacing: '0.05em',
              }}
            >
              Order Summary
            </p>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-8 h-px" style={{ background: 'rgba(194,104,113,0.25)' }} />
              <span className="text-[7px]" style={{ color: 'rgba(194,104,113,0.4)' }}>◇</span>
              <div className="w-8 h-px" style={{ background: 'rgba(194,104,113,0.25)' }} />
            </div>
          </div>

          {/* Line items */}
          <div className="px-4 pb-2 divide-y" style={{ borderColor: 'rgba(90,82,74,0.4)' }}>
            <LineItem label="Base Set" value="" price={BASE_CUSTOM_SET_PRICE} />
            <LineItem label="Shape" value={SHAPE_LABELS[shape]} price={SHAPE_PRICES[shape]} />
            <LineItem label="Length" value={LENGTH_LABELS[length]} price={LENGTH_PRICES[length]} />
            <LineItem
              label="Base Type"
              value={BASE_TYPE_LABELS[defaultNailConfig.baseType]}
              price={0}
              swatch={defaultNailConfig.color}
            />
            <LineItem
              label="Finish"
              value={FINISH_LABELS[defaultNailConfig.finish]}
              price={FINISH_PRICES[defaultNailConfig.finish]}
            />

            {effects.map((effect) => (
              <LineItem
                key={effect}
                label="Effect"
                value={EFFECT_LABELS[effect]}
                price={EFFECTS_PRICES[effect].allNails}
              />
            ))}

            {rhinestoneTier !== 'none' && (
              <LineItem
                label="Rhinestones"
                value={RHINESTONE_LABELS[rhinestoneTier]}
                price={RHINESTONE_PRICES[rhinestoneTier]}
              />
            )}

            {charmTier !== 'none' && (
              <LineItem
                label="Charms"
                value={CHARM_LABELS[charmTier]}
                price={CHARM_PRICES[charmTier]}
              />
            )}
          </div>

          {/* Total row */}
          <div
            className="flex items-center justify-between px-4 py-3 mx-3 mb-3 rounded-lg"
            style={{ background: 'rgba(194,104,113,0.08)' }}
          >
            <span className="text-sm font-medium" style={{ color: '#F5F0EB' }}>
              Estimated Total
            </span>
            <span
              className="text-xl font-semibold"
              style={{
                color: '#C26871',
                fontFamily: "'Playfair Display', serif",
              }}
            >
              ${total}
            </span>
          </div>
        </div>

        {/* Special instructions */}
        <div>
          <label
            className="text-xs block mb-1.5"
            style={{
              color: '#B8AFA6',
              fontFamily: "'Playfair Display', serif",
              fontStyle: 'italic',
            }}
          >
            Special Instructions (optional)
          </label>
          <textarea
            value={specialInstructions}
            onChange={(e) => setSpecialInstructions(e.target.value)}
            placeholder="Any specific requests for your nail artist..."
            rows={2}
            className="w-full rounded-lg px-3 py-2 text-sm resize-none outline-none placeholder:opacity-40 transition-colors focus:border-[rgba(194,104,113,0.5)]"
            style={{
              background: '#5A524A',
              color: '#F5F0EB',
              border: '1px solid #4A423B',
            }}
          />
        </div>

        {/* Dual CTAs */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <motion.button
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.02, boxShadow: '0 6px 28px rgba(194,104,113,0.4)' }}
            onClick={handleAddToCart}
            className="flex-1 py-3 rounded-full text-sm font-medium"
            style={{
              background: 'linear-gradient(135deg, #C26871, #b55a63)',
              color: '#FFF',
              boxShadow: '0 4px 20px rgba(194,104,113,0.3)',
            }}
          >
            Add to Cart — ${total}
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.02 }}
            onClick={handleRequestQuote}
            className="flex-1 py-3 rounded-full text-sm font-medium"
            style={{
              background: 'transparent',
              color: '#C26871',
              border: '1px solid rgba(194,104,113,0.4)',
            }}
          >
            Request Custom Quote
          </motion.button>
        </div>
      </div>
    </SectionWrapper>
  );
}
