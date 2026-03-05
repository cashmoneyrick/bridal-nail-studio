/**
 * NailRenderer — renders a single nail with multiple visual layers for realism.
 *
 * Layers:
 * 1. Base shape (filled with chosen color)
 * 2. Glossy highlight (white gradient for shine)
 * 3. Edge darkening (subtle depth at edges)
 * 4. French tip overlay (if applicable)
 * 5. Finish modifier (matte removes highlight, chrome adds sweep, etc.)
 */

import { motion } from 'framer-motion';
import { FinishType, BaseType } from '@/lib/pricing';

interface NailRendererProps {
  id: string;
  path: string;
  color: string;
  secondaryColor?: string;
  baseType: BaseType;
  finish: FinishType;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
}

export default function NailRenderer({
  id,
  path,
  color,
  secondaryColor,
  baseType,
  finish,
  isSelected,
  onClick,
}: NailRendererProps) {
  const clipId = `nail-clip-${id}`;
  const highlightId = `nail-highlight-${id}`;
  const edgeShadowId = `nail-edge-${id}`;
  const frenchId = `nail-french-${id}`;
  const chromeId = `nail-chrome-${id}`;

  const isMatte = finish === 'matte' || finish === 'velvet-matte';
  const isChrome = finish === 'chrome-finish' || finish === 'holographic';
  const isSugar = finish === 'sugar';
  const isGlassAurora = finish === 'glass-aurora';
  const hasFrenchTip = baseType === 'french-tip-base';

  return (
    <g
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : undefined }}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <defs>
        {/* Clip path matching the nail shape */}
        <clipPath id={clipId}>
          <path d={path} />
        </clipPath>

        {/* Glossy highlight gradient — top-left light reflection */}
        {!isMatte && (
          <linearGradient id={highlightId} x1="0.2" y1="0" x2="0.8" y2="1">
            <stop offset="0%" stopColor="white" stopOpacity={isChrome ? 0.35 : 0.22} />
            <stop offset="40%" stopColor="white" stopOpacity={isChrome ? 0.1 : 0.06} />
            <stop offset="100%" stopColor="white" stopOpacity={0} />
          </linearGradient>
        )}

        {/* Edge shadow gradient — darkens edges for depth */}
        <radialGradient id={edgeShadowId} cx="0.5" cy="0.35" r="0.6">
          <stop offset="0%" stopColor="black" stopOpacity={0} />
          <stop offset="85%" stopColor="black" stopOpacity={0} />
          <stop offset="100%" stopColor="black" stopOpacity={0.12} />
        </radialGradient>

        {/* French tip gradient */}
        {hasFrenchTip && (
          <linearGradient id={frenchId} x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor={color} stopOpacity={1} />
            <stop offset="70%" stopColor={color} stopOpacity={1} />
            <stop offset="78%" stopColor={secondaryColor || '#FFFFFF'} stopOpacity={0.6} />
            <stop offset="85%" stopColor={secondaryColor || '#FFFFFF'} stopOpacity={1} />
            <stop offset="100%" stopColor={secondaryColor || '#FFFFFF'} stopOpacity={1} />
          </linearGradient>
        )}

        {/* Chrome/holographic sweep gradient */}
        {isChrome && (
          <linearGradient id={chromeId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity={0.05} />
            <stop offset="30%" stopColor="#ffffff" stopOpacity={0.3} />
            <stop offset="50%" stopColor="#ffffff" stopOpacity={0.05} />
            <stop offset="70%" stopColor="#ffffff" stopOpacity={0.2} />
            <stop offset="100%" stopColor="#ffffff" stopOpacity={0.05} />
          </linearGradient>
        )}
      </defs>

      {/* Layer 1: Base color fill */}
      <path
        d={path}
        fill={hasFrenchTip ? `url(#${frenchId})` : color}
        style={{ transition: 'fill 0.3s ease-out' }}
      />

      {/* Layer 2: Edge shadow for depth */}
      <path
        d={path}
        fill={`url(#${edgeShadowId})`}
        clipPath={`url(#${clipId})`}
      />

      {/* Layer 3: Glossy highlight (hidden for matte finishes) */}
      {!isMatte && (
        <path
          d={path}
          fill={`url(#${highlightId})`}
        />
      )}

      {/* Layer 4: Chrome light sweep */}
      {isChrome && (
        <motion.path
          d={path}
          fill={`url(#${chromeId})`}
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      {/* Layer 5: Sugar texture (tiny scattered dots) */}
      {isSugar && (
        <g clipPath={`url(#${clipId})`} opacity={0.3}>
          {Array.from({ length: 20 }).map((_, i) => (
            <circle
              key={i}
              cx={(Math.random() - 0.5) * 30}
              cy={-Math.random() * 50}
              r={0.8 + Math.random() * 0.6}
              fill="white"
              opacity={0.3 + Math.random() * 0.5}
            />
          ))}
        </g>
      )}

      {/* Layer 6: Glass aurora shimmer */}
      {isGlassAurora && (
        <motion.path
          d={path}
          fill="none"
          stroke="url(#glass-aurora-gradient)"
          strokeWidth={1}
          opacity={0.4}
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      {/* Selection ring */}
      {isSelected && (
        <motion.path
          d={path}
          fill="none"
          stroke="#C26871"
          strokeWidth={2}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      {/* Subtle nail outline */}
      <path
        d={path}
        fill="none"
        stroke="rgba(0,0,0,0.15)"
        strokeWidth={0.5}
      />
    </g>
  );
}
