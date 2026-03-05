/**
 * SVG path data for 8 nail shapes × 5 fingers (left hand).
 * Right hand mirrors via scaleX(-1).
 *
 * Each path is drawn relative to a nail "slot" with origin at the cuticle center.
 * Paths are designed for a viewBox where each nail is roughly 30-50px wide
 * and 50-80px tall depending on the finger.
 *
 * Finger indices (left hand): 0=pinky, 1=ring, 2=middle, 3=index, 4=thumb
 */

import { ShapeType } from '@/lib/pricing';

type LeftFingerIndex = 0 | 1 | 2 | 3 | 4;

// Nail dimensions per finger (width, height at medium length)
export const NAIL_DIMENSIONS: Record<LeftFingerIndex, { w: number; h: number }> = {
  0: { w: 28, h: 38 },  // pinky — narrowest
  1: { w: 34, h: 46 },  // ring
  2: { w: 36, h: 50 },  // middle — tallest
  3: { w: 34, h: 46 },  // index
  4: { w: 38, h: 40 },  // thumb — widest, shorter
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
 * Generate a nail path for any shape + finger combination.
 * All paths start at the cuticle (bottom) and trace clockwise.
 * The path is centered at (0, 0) with cuticle at the bottom.
 */
function nailPath(shape: ShapeType, finger: LeftFingerIndex): string {
  const { w, h } = NAIL_DIMENSIONS[finger];
  const hw = w / 2; // half width

  switch (shape) {
    case 'almond':
      // Rounded sides tapering to a soft point
      return `M ${-hw},0 C ${-hw},${-h * 0.5} ${-hw * 0.6},${-h * 0.85} 0,${-h} C ${hw * 0.6},${-h * 0.85} ${hw},${-h * 0.5} ${hw},0 Z`;

    case 'oval':
      // Continuously rounded, wider curve
      return `M ${-hw},0 C ${-hw},${-h * 0.55} ${-hw * 0.75},${-h * 0.95} 0,${-h} C ${hw * 0.75},${-h * 0.95} ${hw},${-h * 0.55} ${hw},0 Z`;

    case 'round':
      // Like oval but with a more uniform semicircle top
      return `M ${-hw},0 C ${-hw},${-h * 0.4} ${-hw},${-h * 0.7} 0,${-h} C ${hw},${-h * 0.7} ${hw},${-h * 0.4} ${hw},0 Z`;

    case 'square':
      // Straight sides, flat top, sharp corners
      return `M ${-hw},0 L ${-hw},${-h * 0.92} Q ${-hw},${-h} ${-hw + 2},${-h} L ${hw - 2},${-h} Q ${hw},${-h} ${hw},${-h * 0.92} L ${hw},0 Z`;

    case 'squoval':
      // Square sides with rounded top corners
      return `M ${-hw},0 L ${-hw},${-h * 0.75} Q ${-hw},${-h} ${-hw * 0.5},${-h} L ${hw * 0.5},${-h} Q ${hw},${-h} ${hw},${-h * 0.75} L ${hw},0 Z`;

    case 'coffin':
      // Tapered sides with flat squared-off tip
      return `M ${-hw},0 L ${-hw * 0.95},${-h * 0.4} L ${-hw * 0.55},${-h * 0.9} Q ${-hw * 0.5},${-h} ${-hw * 0.4},${-h} L ${hw * 0.4},${-h} Q ${hw * 0.5},${-h} ${hw * 0.55},${-h * 0.9} L ${hw * 0.95},${-h * 0.4} L ${hw},0 Z`;

    case 'stiletto':
      // Dramatic taper to a sharp point
      return `M ${-hw},0 C ${-hw},${-h * 0.3} ${-hw * 0.5},${-h * 0.7} 0,${-h} C ${hw * 0.5},${-h * 0.7} ${hw},${-h * 0.3} ${hw},0 Z`;

    case 'lipstick':
      // Angled tip (diagonal cut)
      return `M ${-hw},0 L ${-hw},${-h * 0.65} L ${-hw * 0.3},${-h} L ${hw * 0.6},${-h * 0.7} Q ${hw},${-h * 0.6} ${hw},${-h * 0.5} L ${hw},0 Z`;

    default:
      return nailPath('almond', finger);
  }
}

// Pre-compute all paths
const ALL_SHAPES: ShapeType[] = ['almond', 'square', 'oval', 'coffin', 'stiletto', 'squoval', 'round', 'lipstick'];
const ALL_FINGERS: LeftFingerIndex[] = [0, 1, 2, 3, 4];

export const NAIL_PATHS: Record<ShapeType, Record<LeftFingerIndex, string>> = {} as any;

for (const shape of ALL_SHAPES) {
  NAIL_PATHS[shape] = {} as Record<LeftFingerIndex, string>;
  for (const finger of ALL_FINGERS) {
    NAIL_PATHS[shape][finger] = nailPath(shape, finger);
  }
}

// Position offsets for each nail on the hand SVG (left hand, top-down view)
// Compact viewBox (0 0 220 160) — nails arranged in a natural hand-arc
// No full hand outline; the arc itself implies the hand shape
export const NAIL_POSITIONS: Record<LeftFingerIndex, { x: number; y: number; rotation: number }> = {
  0: { x: 35,  y: 100, rotation: 10 },   // pinky — leftmost, lowest
  1: { x: 68,  y: 74,  rotation: 4 },    // ring
  2: { x: 105, y: 68,  rotation: 0 },    // middle — highest (longest finger)
  3: { x: 142, y: 74,  rotation: -4 },   // index
  4: { x: 182, y: 108, rotation: -22 },  // thumb — rightmost, angled out
};

// Single nail silhouette path for shape previews (not on a hand)
export function getPreviewNailPath(shape: ShapeType, width = 40, height = 60): string {
  const hw = width / 2;
  const h = height;

  switch (shape) {
    case 'almond':
      return `M ${-hw},0 C ${-hw},${-h * 0.5} ${-hw * 0.6},${-h * 0.85} 0,${-h} C ${hw * 0.6},${-h * 0.85} ${hw},${-h * 0.5} ${hw},0 Z`;
    case 'oval':
      return `M ${-hw},0 C ${-hw},${-h * 0.55} ${-hw * 0.75},${-h * 0.95} 0,${-h} C ${hw * 0.75},${-h * 0.95} ${hw},${-h * 0.55} ${hw},0 Z`;
    case 'round':
      return `M ${-hw},0 C ${-hw},${-h * 0.4} ${-hw},${-h * 0.7} 0,${-h} C ${hw},${-h * 0.7} ${hw},${-h * 0.4} ${hw},0 Z`;
    case 'square':
      return `M ${-hw},0 L ${-hw},${-h * 0.92} Q ${-hw},${-h} ${-hw + 2},${-h} L ${hw - 2},${-h} Q ${hw},${-h} ${hw},${-h * 0.92} L ${hw},0 Z`;
    case 'squoval':
      return `M ${-hw},0 L ${-hw},${-h * 0.75} Q ${-hw},${-h} ${-hw * 0.5},${-h} L ${hw * 0.5},${-h} Q ${hw},${-h} ${hw},${-h * 0.75} L ${hw},0 Z`;
    case 'coffin':
      return `M ${-hw},0 L ${-hw * 0.95},${-h * 0.4} L ${-hw * 0.55},${-h * 0.9} Q ${-hw * 0.5},${-h} ${-hw * 0.4},${-h} L ${hw * 0.4},${-h} Q ${hw * 0.5},${-h} ${hw * 0.55},${-h * 0.9} L ${hw * 0.95},${-h * 0.4} L ${hw},0 Z`;
    case 'stiletto':
      return `M ${-hw},0 C ${-hw},${-h * 0.3} ${-hw * 0.5},${-h * 0.7} 0,${-h} C ${hw * 0.5},${-h * 0.7} ${hw},${-h * 0.3} ${hw},0 Z`;
    case 'lipstick':
      return `M ${-hw},0 L ${-hw},${-h * 0.65} L ${-hw * 0.3},${-h} L ${hw * 0.6},${-h * 0.7} Q ${hw},${-h * 0.6} ${hw},${-h * 0.5} L ${hw},0 Z`;
    default:
      return getPreviewNailPath('almond', width, height);
  }
}
