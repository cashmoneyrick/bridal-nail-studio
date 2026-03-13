/**
 * NailRenderer — realistic multi-layer SVG nail rendering.
 *
 * Visual layers (bottom to top):
 * 1. Nail bed warmth (warm pink undertone, visible on lighter colors)
 * 2. Base color fill (solid, french-tip, ombre, chrome-base, jelly, clear)
 * 3. Curvature — side darkening (3D depth at edges)
 * 4. Curvature — center highlight band (light catching the curve)
 * 5. Specular highlight (concentrated bright spot, glossy/chrome only)
 * 6. Finish effects (chrome sweep, cat-eye band, sugar grain, aurora, glitter)
 * 7. Free edge line + lunula hint
 * 8. Selection ring
 * 9. Rim light + outline
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
  /** Render mode for cutout layering approach:
   *  - 'full' (default): all 9 layers (backward compatible)
   *  - 'fill-only': layers 1–2 only (base color + nail bed warmth)
   *  - 'overlay-only': layers 3–9 only (3D effects, finishes, outline)
   */
  mode?: 'full' | 'fill-only' | 'overlay-only';
}

/** Perceived lightness of a hex color (0 = black, 1 = white) */
function perceivedLightness(hex: string): number {
  try {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    return 0.299 * r + 0.587 * g + 0.114 * b;
  } catch {
    return 0.5;
  }
}

/** Deterministic pseudo-random from seed (avoids re-render jitter) */
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
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
  mode = 'full',
}: NailRendererProps) {
  // Unique gradient/filter IDs per nail instance
  const clip = `nc-${id}`;
  const warmth = `nw-${id}`;
  const french = `nf-${id}`;
  const ombre = `no-${id}`;
  const sideL = `nsl-${id}`;
  const sideR = `nsr-${id}`;
  const centerH = `nch-${id}`;
  const spec = `ns-${id}`;
  const specAmb = `nsa-${id}`;
  const chrome = `ncr-${id}`;
  const matteFilt = `nmf-${id}`;

  // Finish flags
  const isMatte = finish === 'matte' || finish === 'velvet-matte';
  const isVelvet = finish === 'velvet-matte';
  const isChrome = finish === 'chrome-finish' || finish === 'holographic';
  const isHolo = finish === 'holographic';
  const isSugar = finish === 'sugar';
  const isGlassAurora = finish === 'glass-aurora';
  const isCatEye = finish === 'cat-eye';
  const isGlitter = finish === 'glitter-topcoat';

  // Base type flags
  const hasFrench = baseType === 'french-tip-base';
  const hasOmbre = baseType === 'ombre';
  const hasChromeBase = baseType === 'chrome-base';
  const isJelly = baseType === 'jelly';
  const isClear = baseType === 'clear';

  const lightness = perceivedLightness(color);

  // Mode flags — which layers to render
  const showFill = mode !== 'overlay-only';
  const showOverlay = mode !== 'fill-only';

  // Nail bed warmth: more visible on lighter/translucent nails
  const bedOpacity = isClear
    ? 0.40
    : isJelly
      ? 0.30
      : Math.max(0, Math.min(0.35, (lightness - 0.15) * 0.55));

  // Base fill opacity
  const baseOpacity = isClear ? 0.15 : isJelly ? 0.6 : 1;

  return (
    <g
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : undefined }}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <defs>
        <clipPath id={clip}>
          <path d={path} />
        </clipPath>

        {/* Nail bed warmth — warm pink/peach undertone */}
        {bedOpacity > 0.01 && (
          <linearGradient id={warmth} x1="0.5" y1="1" x2="0.5" y2="0">
            <stop offset="0%" stopColor="#E8B4B8" stopOpacity={bedOpacity} />
            <stop offset="45%" stopColor="#DAAAB0" stopOpacity={bedOpacity * 0.5} />
            <stop offset="100%" stopColor="#E8B4B8" stopOpacity={0} />
          </linearGradient>
        )}

        {/* French tip gradient */}
        {hasFrench && (
          <linearGradient id={french} x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor={color} />
            <stop offset="62%" stopColor={color} />
            <stop offset="74%" stopColor={secondaryColor || '#FFFFFF'} stopOpacity={0.5} />
            <stop offset="80%" stopColor={secondaryColor || '#FFFFFF'} />
            <stop offset="100%" stopColor={secondaryColor || '#FFFFFF'} />
          </linearGradient>
        )}

        {/* Ombré gradient */}
        {hasOmbre && (
          <linearGradient id={ombre} x1="0.5" y1="1" x2="0.5" y2="0">
            <stop offset="0%" stopColor={color} />
            <stop offset="100%" stopColor={secondaryColor || '#FFFFFF'} />
          </linearGradient>
        )}

        {/* Curvature — left side shadow (stronger for visible 3D depth) */}
        <linearGradient id={sideL} x1="0" y1="0.5" x2="0.55" y2="0.5">
          <stop offset="0%" stopColor="black" stopOpacity={0.24} />
          <stop offset="40%" stopColor="black" stopOpacity={0.08} />
          <stop offset="100%" stopColor="black" stopOpacity={0} />
        </linearGradient>

        {/* Curvature — right side shadow */}
        <linearGradient id={sideR} x1="1" y1="0.5" x2="0.45" y2="0.5">
          <stop offset="0%" stopColor="black" stopOpacity={0.20} />
          <stop offset="40%" stopColor="black" stopOpacity={0.06} />
          <stop offset="100%" stopColor="black" stopOpacity={0} />
        </linearGradient>

        {/* Curvature — center vertical highlight band (boosted for visible 3D) */}
        <linearGradient id={centerH} x1="0.25" y1="0" x2="0.75" y2="0">
          <stop offset="0%" stopColor="white" stopOpacity={0} />
          <stop offset="25%" stopColor="white" stopOpacity={isMatte ? 0.03 : 0.10} />
          <stop offset="45%" stopColor="white" stopOpacity={isMatte ? 0.05 : 0.16} />
          <stop offset="55%" stopColor="white" stopOpacity={isMatte ? 0.05 : 0.16} />
          <stop offset="75%" stopColor="white" stopOpacity={isMatte ? 0.03 : 0.10} />
          <stop offset="100%" stopColor="white" stopOpacity={0} />
        </linearGradient>

        {/* Specular highlight — sharp concentrated bright spot */}
        {!isMatte && (
          <radialGradient id={spec} cx="0.36" cy="0.2" r="0.22" fx="0.36" fy="0.2">
            <stop offset="0%" stopColor="white" stopOpacity={isChrome ? 0.6 : 0.45} />
            <stop offset="35%" stopColor="white" stopOpacity={isChrome ? 0.2 : 0.12} />
            <stop offset="100%" stopColor="white" stopOpacity={0} />
          </radialGradient>
        )}

        {/* Specular ambient — softer wider glow */}
        {!isMatte && (
          <radialGradient id={specAmb} cx="0.4" cy="0.28" r="0.5">
            <stop offset="0%" stopColor="white" stopOpacity={0.1} />
            <stop offset="45%" stopColor="white" stopOpacity={0.03} />
            <stop offset="100%" stopColor="white" stopOpacity={0} />
          </radialGradient>
        )}

        {/* Chrome — multi-band reflection stripes */}
        {isChrome && !isHolo && (
          <linearGradient id={chrome} x1="0" y1="0" x2="0.7" y2="1">
            <stop offset="0%" stopColor="#fff" stopOpacity={0.02} />
            <stop offset="18%" stopColor="#fff" stopOpacity={0.28} />
            <stop offset="28%" stopColor="#fff" stopOpacity={0.04} />
            <stop offset="48%" stopColor="#fff" stopOpacity={0.32} />
            <stop offset="58%" stopColor="#fff" stopOpacity={0.04} />
            <stop offset="78%" stopColor="#fff" stopOpacity={0.18} />
            <stop offset="100%" stopColor="#fff" stopOpacity={0.02} />
          </linearGradient>
        )}

        {/* Holographic — rainbow color shift */}
        {isHolo && (
          <linearGradient id={chrome} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ff6b9d" stopOpacity={0.18} />
            <stop offset="18%" stopColor="#ffd93d" stopOpacity={0.14} />
            <stop offset="36%" stopColor="#6bcb77" stopOpacity={0.18} />
            <stop offset="54%" stopColor="#4d96ff" stopOpacity={0.14} />
            <stop offset="72%" stopColor="#9b59b6" stopOpacity={0.18} />
            <stop offset="100%" stopColor="#ff6b9d" stopOpacity={0.14} />
          </linearGradient>
        )}

        {/* Matte surface grain filter */}
        {isMatte && (
          <filter id={matteFilt} x="0" y="0" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency={isVelvet ? '1.4' : '0.85'}
              numOctaves={isVelvet ? 4 : 3}
              result="grain"
            />
            <feComposite in="SourceGraphic" in2="grain" operator="in" result="clipped" />
            <feBlend in="SourceGraphic" in2="clipped" mode="soft-light" />
          </filter>
        )}
      </defs>

      {/* ─── Layer 1: Nail bed warmth ─── */}
      {showFill && bedOpacity > 0.01 && (
        <path d={path} fill={`url(#${warmth})`} />
      )}

      {/* ─── Layer 2: Base color fill ─── */}
      {showFill && (
        <path
          d={path}
          fill={
            hasFrench ? `url(#${french})`
            : hasOmbre ? `url(#${ombre})`
            : color
          }
          opacity={baseOpacity}
          style={{ transition: 'fill 0.3s ease-out, opacity 0.3s ease-out' }}
        />
      )}

      {/* Chrome-base extra metallic sheen */}
      {showFill && hasChromeBase && (
        <path d={path} fill="white" opacity={0.08} clipPath={`url(#${clip})`} />
      )}

      {/* ─── Layer 3: Curvature side shadows (3D depth) ─── */}
      {showOverlay && (
        <>
          <path d={path} fill={`url(#${sideL})`} clipPath={`url(#${clip})`} />
          <path d={path} fill={`url(#${sideR})`} clipPath={`url(#${clip})`} />
        </>
      )}

      {/* ─── Layer 4: Center highlight band ─── */}
      {showOverlay && (
        <path d={path} fill={`url(#${centerH})`} clipPath={`url(#${clip})`} />
      )}

      {/* ─── Layer 5: Specular highlights (glossy/chrome only) ─── */}
      {showOverlay && !isMatte && (
        <>
          <path d={path} fill={`url(#${specAmb})`} />
          <path d={path} fill={`url(#${spec})`} />
        </>
      )}

      {/* ─── Layer 6: Finish-specific effects ─── */}

      {/* Chrome mirror sweep */}
      {showOverlay && isChrome && (
        <motion.path
          d={path}
          fill={`url(#${chrome})`}
          animate={{ opacity: [0.5, 0.85, 0.5] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      {/* Cat eye — narrow magnetic light band */}
      {showOverlay && isCatEye && (
        <g clipPath={`url(#${clip})`}>
          <motion.ellipse
            cx="0"
            cy="-22"
            rx="2.5"
            ry="28"
            fill="white"
            transform="rotate(-12)"
            animate={{ opacity: [0.12, 0.28, 0.12] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />
          {/* Secondary softer glow around the band */}
          <ellipse
            cx="0"
            cy="-22"
            rx="6"
            ry="28"
            fill="white"
            opacity={0.06}
            transform="rotate(-12)"
          />
        </g>
      )}

      {/* Sugar texture — deterministic sparkle dots */}
      {showOverlay && isSugar && (
        <g clipPath={`url(#${clip})`}>
          {Array.from({ length: 28 }).map((_, i) => {
            const x = (seededRandom(i * 7 + 1) - 0.5) * 32;
            const y = -(seededRandom(i * 7 + 2)) * 52;
            const r = 0.5 + seededRandom(i * 7 + 3) * 0.6;
            const o = 0.15 + seededRandom(i * 7 + 4) * 0.4;
            return (
              <circle key={i} cx={x} cy={y} r={r} fill="white" opacity={o} />
            );
          })}
        </g>
      )}

      {/* Glass aurora — iridescent color-shifting shimmer */}
      {showOverlay && isGlassAurora && (
        <g clipPath={`url(#${clip})`}>
          <motion.path
            d={path}
            fill="none"
            stroke="url(#glass-aurora-gradient)"
            strokeWidth={1.5}
            animate={{ opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />
          {/* Inner iridescent glow */}
          <motion.path
            d={path}
            fill="url(#glass-aurora-gradient)"
            opacity={0.06}
            animate={{ opacity: [0.03, 0.08, 0.03] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </g>
      )}

      {/* Glitter topcoat — twinkling sparkle particles */}
      {showOverlay && isGlitter && (
        <g clipPath={`url(#${clip})`}>
          {Array.from({ length: 20 }).map((_, i) => {
            const x = (seededRandom(i * 11 + 1) - 0.5) * 30;
            const y = -(seededRandom(i * 11 + 2)) * 50;
            const r = 0.3 + seededRandom(i * 11 + 3) * 0.5;
            return (
              <motion.circle
                key={i}
                cx={x}
                cy={y}
                r={r}
                fill="white"
                animate={{ opacity: [0.05, 0.6, 0.05] }}
                transition={{
                  duration: 1.2 + seededRandom(i * 11 + 4) * 1.2,
                  repeat: Infinity,
                  delay: seededRandom(i * 11 + 5) * 2,
                  ease: 'easeInOut',
                }}
              />
            );
          })}
        </g>
      )}

      {/* Matte grain overlay */}
      {showOverlay && isMatte && (
        <path
          d={path}
          fill="rgba(128,120,112,0.04)"
          filter={`url(#${matteFilt})`}
          clipPath={`url(#${clip})`}
        />
      )}

      {/* ─── Layer 7: Anatomical details ─── */}

      {/* Free edge line (where nail separates from nail bed) */}
      {showOverlay && lightness > 0.3 && !hasFrench && (
        <line
          x1="-18" y1="-15"
          x2="18" y2="-15"
          stroke="#c8b3a2"
          strokeWidth={0.4}
          strokeOpacity={0.07}
          clipPath={`url(#${clip})`}
        />
      )}

      {/* Lunula — faint half-moon near cuticle */}
      {showOverlay && (
        <ellipse
          cx="0"
          cy="-2"
          rx="7"
          ry="4.5"
          fill="white"
          opacity={lightness > 0.4 ? 0.045 : 0.02}
          clipPath={`url(#${clip})`}
        />
      )}

      {/* ─── Layer 8: Selection ring ─── */}
      {showOverlay && isSelected && (
        <motion.path
          d={path}
          fill="none"
          stroke="#6B4C3B"
          strokeWidth={2}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      {/* ─── Layer 9: Outline + rim light ─── */}

      {/* Rim light — thin bright edge catch on one side */}
      {showOverlay && !isMatte && (
        <path
          d={path}
          fill="none"
          stroke="rgba(107,76,59,0.12)"
          strokeWidth={0.4}
          strokeDasharray="0 12 25 100"
          clipPath={`url(#${clip})`}
        />
      )}

      {/* Subtle nail outline — softer for natural look */}
      {showOverlay && (
        <path
          d={path}
          fill="none"
          stroke="rgba(90,65,50,0.18)"
          strokeWidth={0.35}
          strokeLinejoin="round"
        />
      )}
    </g>
  );
}
