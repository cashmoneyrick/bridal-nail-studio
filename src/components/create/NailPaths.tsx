/**
 * SVG path data for 7 nail shapes — organic, realistic silhouettes.
 *
 * Every shape uses multi-segment cubic Bézier curves for smooth, natural
 * outlines. Key anatomical features:
 *   – Concave cuticle curve at the base (not a straight line)
 *   – Gently tapered sidewalls with subtle S-curves
 *   – Shape-specific tip geometry with smooth transitions
 *   – No straight lines (L commands) — everything curves
 *
 * Coordinate system: origin at cuticle center (0, 0).
 * Nail extends upward (negative Y). Right hand mirrors via scaleX(-1).
 *
 * Finger indices (left hand): 0=pinky, 1=ring, 2=middle, 3=index, 4=thumb
 */

import { ShapeType } from '@/lib/pricing';

type LeftFingerIndex = 0 | 1 | 2 | 3 | 4;

// Nail dimensions per finger (width, height at medium length)
// Tuned for the traced hand's finger proportions (972×1212 viewBox)
export const NAIL_DIMENSIONS: Record<LeftFingerIndex, { w: number; h: number }> = {
  0: { w: 20, h: 28 },  // pinky — small, matches this hand's narrow pinky
  1: { w: 34, h: 46 },  // ring
  2: { w: 36, h: 50 },  // middle — tallest
  3: { w: 32, h: 44 },  // index — slightly narrower than ring
  4: { w: 36, h: 46 },  // thumb — wide, taller for better coverage
};

// Length scale factors (scaleY applied from cuticle origin)
export const LENGTH_SCALES: Record<string, number> = {
  'extra-short': 0.65,
  short: 0.8,
  medium: 1.0,
  long: 1.2,
  'extra-long': 1.4,
};

/**
 * Generate an organic nail silhouette for any shape + dimensions.
 *
 * Each path traces: left cuticle → left sidewall → tip → right sidewall →
 * cuticle curve back to start. All transitions use cubic Bézier curves
 * for smooth, natural-looking outlines.
 */
function generatePath(shape: ShapeType, w: number, h: number): string {
  const hw = w / 2;
  const cd = h * 0.04; // cuticle depth — how much the base curves inward

  switch (shape) {
    case 'almond': {
      // Organic almond: wide base, gradual taper, soft rounded point
      // 4 cubic curves for sides + quadratic for cuticle
      return [
        `M ${-hw},${cd}`,
        // Left sidewall: base → mid (slight inward taper)
        `C ${-hw},${-h * 0.18} ${-hw * 0.97},${-h * 0.42} ${-hw * 0.88},${-h * 0.6}`,
        // Left upper → tip (gradual taper to point)
        `C ${-hw * 0.72},${-h * 0.78} ${-hw * 0.42},${-h * 0.93} 0,${-h}`,
        // Tip → right upper
        `C ${hw * 0.42},${-h * 0.93} ${hw * 0.72},${-h * 0.78} ${hw * 0.88},${-h * 0.6}`,
        // Right sidewall: mid → base
        `C ${hw * 0.97},${-h * 0.42} ${hw},${-h * 0.18} ${hw},${cd}`,
        // Cuticle curve (concave — dips slightly inward)
        `Q 0,${-cd * 1.2} ${-hw},${cd}`,
        'Z',
      ].join(' ');
    }

    case 'oval': {
      // Smooth continuous oval — wider than almond, uniformly rounded tip
      return [
        `M ${-hw},${cd}`,
        `C ${-hw},${-h * 0.2} ${-hw * 0.98},${-h * 0.48} ${-hw * 0.92},${-h * 0.66}`,
        `C ${-hw * 0.82},${-h * 0.83} ${-hw * 0.56},${-h * 0.97} 0,${-h}`,
        `C ${hw * 0.56},${-h * 0.97} ${hw * 0.82},${-h * 0.83} ${hw * 0.92},${-h * 0.66}`,
        `C ${hw * 0.98},${-h * 0.48} ${hw},${-h * 0.2} ${hw},${cd}`,
        `Q 0,${-cd * 1.2} ${-hw},${cd}`,
        'Z',
      ].join(' ');
    }

    case 'round': {
      // Natural round — most circular tip, widest shape, low-maintenance look
      return [
        `M ${-hw},${cd}`,
        `C ${-hw},${-h * 0.15} ${-hw},${-h * 0.42} ${-hw * 0.92},${-h * 0.62}`,
        `C ${-hw * 0.78},${-h * 0.82} ${-hw * 0.48},${-h * 0.97} 0,${-h}`,
        `C ${hw * 0.48},${-h * 0.97} ${hw * 0.78},${-h * 0.82} ${hw * 0.92},${-h * 0.62}`,
        `C ${hw},${-h * 0.42} ${hw},${-h * 0.15} ${hw},${cd}`,
        `Q 0,${-cd * 1.2} ${-hw},${cd}`,
        'Z',
      ].join(' ');
    }

    case 'square': {
      // Real square — slight side taper, flat top with small rounded corners
      // No straight lines — sides use subtle curves
      const cr = hw * 0.1; // corner radius
      return [
        `M ${-hw},${cd}`,
        // Left sidewall (very subtle inward curve)
        `C ${-hw},${-h * 0.12} ${-hw * 0.99},${-h * 0.4} ${-hw * 0.97},${-h * 0.65}`,
        `C ${-hw * 0.96},${-h * 0.82} ${-hw * 0.96},${-h * 0.9} ${-hw * 0.95},${-h + cr}`,
        // Top-left rounded corner
        `Q ${-hw * 0.95},${-h} ${-hw * 0.95 + cr},${-h}`,
        // Flat top (very slight curve for organic feel)
        `C ${-hw * 0.3},${-h * 1.005} ${hw * 0.3},${-h * 1.005} ${hw * 0.95 - cr},${-h}`,
        // Top-right rounded corner
        `Q ${hw * 0.95},${-h} ${hw * 0.95},${-h + cr}`,
        // Right sidewall
        `C ${hw * 0.96},${-h * 0.9} ${hw * 0.96},${-h * 0.82} ${hw * 0.97},${-h * 0.65}`,
        `C ${hw * 0.99},${-h * 0.4} ${hw},${-h * 0.12} ${hw},${cd}`,
        // Cuticle
        `Q 0,${-cd * 1.2} ${-hw},${cd}`,
        'Z',
      ].join(' ');
    }

    case 'squoval': {
      // Square with generously rounded corners — the best of both worlds
      const cr = hw * 0.24;
      return [
        `M ${-hw},${cd}`,
        // Left sidewall
        `C ${-hw},${-h * 0.12} ${-hw * 0.99},${-h * 0.4} ${-hw * 0.96},${-h * 0.62}`,
        `C ${-hw * 0.95},${-h * 0.8} ${-hw * 0.95},${-h * 0.88} ${-hw * 0.94},${-h + cr}`,
        // Top-left rounded corner
        `Q ${-hw * 0.94},${-h} ${-hw * 0.94 + cr},${-h}`,
        // Slightly curved top
        `C ${-hw * 0.25},${-h * 1.004} ${hw * 0.25},${-h * 1.004} ${hw * 0.94 - cr},${-h}`,
        // Top-right rounded corner
        `Q ${hw * 0.94},${-h} ${hw * 0.94},${-h + cr}`,
        // Right sidewall
        `C ${hw * 0.95},${-h * 0.88} ${hw * 0.95},${-h * 0.8} ${hw * 0.96},${-h * 0.62}`,
        `C ${hw * 0.99},${-h * 0.4} ${hw},${-h * 0.12} ${hw},${cd}`,
        // Cuticle
        `Q 0,${-cd * 1.2} ${-hw},${cd}`,
        'Z',
      ].join(' ');
    }

    case 'coffin': {
      // Coffin/Ballerina — nearly straight sides, then a clear taper to a flat tip
      // Key: sides stay parallel longer, taper starts ~45%, wider flat tip
      const tipHw = hw * 0.52;  // tip is 52% of base width (wider than before)
      const cr = tipHw * 0.2;   // corner radius at tip
      return [
        `M ${-hw},${cd}`,
        // Left sidewall — nearly straight/parallel for first ~45%
        `C ${-hw},${-h * 0.1} ${-hw * 0.99},${-h * 0.25} ${-hw * 0.98},${-h * 0.42}`,
        // Taper zone — smooth inward curve from ~45% to ~85%
        `C ${-hw * 0.96},${-h * 0.56} ${-hw * 0.84},${-h * 0.7} ${-hw * 0.68},${-h * 0.8}`,
        // Final approach to tip corner
        `C ${-hw * 0.58},${-h * 0.87} ${-tipHw * 1.05},${-h * 0.92} ${-tipHw},${-h + cr}`,
        // Top-left rounded corner
        `Q ${-tipHw},${-h} ${-tipHw + cr},${-h}`,
        // Flat tip (very slight curve for organic feel)
        `C ${-tipHw * 0.25},${-h * 1.002} ${tipHw * 0.25},${-h * 1.002} ${tipHw - cr},${-h}`,
        // Top-right rounded corner
        `Q ${tipHw},${-h} ${tipHw},${-h + cr}`,
        // Right side — mirror of left
        `C ${tipHw * 1.05},${-h * 0.92} ${hw * 0.58},${-h * 0.87} ${hw * 0.68},${-h * 0.8}`,
        `C ${hw * 0.84},${-h * 0.7} ${hw * 0.96},${-h * 0.56} ${hw * 0.98},${-h * 0.42}`,
        // Right sidewall — nearly straight
        `C ${hw * 0.99},${-h * 0.25} ${hw},${-h * 0.1} ${hw},${cd}`,
        // Cuticle
        `Q 0,${-cd * 1.2} ${-hw},${cd}`,
        'Z',
      ].join(' ');
    }

    case 'stiletto': {
      // Dramatic stiletto — elegant long taper to a sharp point
      // More curved than almond, with tighter taper near the tip
      return [
        `M ${-hw},${cd}`,
        `C ${-hw},${-h * 0.16} ${-hw * 0.96},${-h * 0.38} ${-hw * 0.84},${-h * 0.54}`,
        `C ${-hw * 0.64},${-h * 0.72} ${-hw * 0.34},${-h * 0.9} 0,${-h}`,
        `C ${hw * 0.34},${-h * 0.9} ${hw * 0.64},${-h * 0.72} ${hw * 0.84},${-h * 0.54}`,
        `C ${hw * 0.96},${-h * 0.38} ${hw},${-h * 0.16} ${hw},${cd}`,
        `Q 0,${-cd * 1.2} ${-hw},${cd}`,
        'Z',
      ].join(' ');
    }

    default:
      return generatePath('almond', w, h);
  }
}

// --- Finger-specific paths ---

function nailPath(shape: ShapeType, finger: LeftFingerIndex, lengthScale = 1.0): string {
  const { w, h } = NAIL_DIMENSIONS[finger];
  // Generate path with correct height for this length — no scaleY distortion
  return generatePath(shape, w, h * lengthScale);
}

// Pre-compute all paths (7 shapes × 5 fingers × 5 lengths = 175 paths)
// Generating per-length paths avoids CSS scaleY which distorts Bézier curves.
const ALL_SHAPES: ShapeType[] = ['almond', 'square', 'oval', 'coffin', 'stiletto', 'squoval', 'round'];
const ALL_FINGERS: LeftFingerIndex[] = [0, 1, 2, 3, 4];
const ALL_LENGTHS = Object.keys(LENGTH_SCALES);

// Legacy lookup (medium length only) — kept for compatibility
export const NAIL_PATHS: Record<ShapeType, Record<LeftFingerIndex, string>> = {} as any;

for (const shape of ALL_SHAPES) {
  NAIL_PATHS[shape] = {} as Record<LeftFingerIndex, string>;
  for (const finger of ALL_FINGERS) {
    NAIL_PATHS[shape][finger] = nailPath(shape, finger);
  }
}

// Length-aware lookup: NAIL_PATHS_BY_LENGTH[shape][length][finger]
export const NAIL_PATHS_BY_LENGTH: Record<ShapeType, Record<string, Record<LeftFingerIndex, string>>> = {} as any;

for (const shape of ALL_SHAPES) {
  NAIL_PATHS_BY_LENGTH[shape] = {} as Record<string, Record<LeftFingerIndex, string>>;
  for (const len of ALL_LENGTHS) {
    NAIL_PATHS_BY_LENGTH[shape][len] = {} as Record<LeftFingerIndex, string>;
    for (const finger of ALL_FINGERS) {
      NAIL_PATHS_BY_LENGTH[shape][len][finger] = nailPath(shape, finger, LENGTH_SCALES[len]);
    }
  }
}

// Position offsets for each nail on the hand SVG (left hand, top-down view)
// Compact viewBox (0 0 220 160) — nails arranged in a natural hand-arc
export const NAIL_POSITIONS: Record<LeftFingerIndex, { x: number; y: number; rotation: number }> = {
  0: { x: 35,  y: 100, rotation: 10 },   // pinky — leftmost, lowest
  1: { x: 68,  y: 74,  rotation: 4 },    // ring
  2: { x: 105, y: 68,  rotation: 0 },    // middle — highest (longest finger)
  3: { x: 142, y: 74,  rotation: -4 },   // index
  4: { x: 182, y: 108, rotation: -22 },  // thumb — rightmost, angled out
};

// Single nail silhouette for shape previews (carousel, length picker)
export function getPreviewNailPath(shape: ShapeType, width = 40, height = 60): string {
  return generatePath(shape, width, height);
}
