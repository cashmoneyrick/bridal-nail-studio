/**
 * HandSvg — nails-first hand preview.
 * No full hand outline. Nails arranged in a natural arc that implies the hand.
 * Each nail sits on a barely-visible finger stub with a soft cuticle curve.
 * The nails are the hero — prominent, well-positioned, and beautiful.
 *
 * Right hand is rendered by wrapping in scaleX(-1).
 */

import { useCustomStudioStore } from '@/stores/customStudioStore';
import { NAIL_PATHS, NAIL_POSITIONS, NAIL_DIMENSIONS, LENGTH_SCALES } from './NailPaths';
import NailRenderer from './NailRenderer';
import type { FingerIndex } from '@/lib/pricing';

interface HandSvgProps {
  hand: 'left' | 'right';
  className?: string;
}

export default function HandSvg({ hand, className }: HandSvgProps) {
  const {
    shape, length,
    defaultNailConfig, nailOverrides,
    editMode, selectedNailIndex,
    selectNail, getNailConfig,
  } = useCustomStudioStore();

  const lengthScale = LENGTH_SCALES[length] || 1;
  const isRight = hand === 'right';
  const fingerOffset = isRight ? 5 : 0;

  return (
    <svg
      viewBox="0 0 220 160"
      className={className}
      style={{
        transform: isRight ? 'scaleX(-1)' : undefined,
        width: '100%',
        height: '100%',
      }}
    >
      {/* Render 5 nails in a natural hand-arc */}
      {([0, 1, 2, 3, 4] as const).map((localFinger) => {
        const globalFinger = (localFinger + fingerOffset) as FingerIndex;
        const pos = NAIL_POSITIONS[localFinger];
        const dim = NAIL_DIMENSIONS[localFinger];
        const nailConfig = getNailConfig(globalFinger);
        const shapePaths = NAIL_PATHS[shape];
        const nailPath = shapePaths[localFinger];
        const isThisSelected = editMode === 'per-nail' && selectedNailIndex === globalFinger;

        return (
          <g
            key={localFinger}
            transform={`translate(${pos.x}, ${pos.y}) rotate(${pos.rotation})`}
          >
            {/* Subtle finger stub — extends below the nail, barely visible */}
            <rect
              x={-dim.w / 2 - 2}
              y={-2}
              width={dim.w + 4}
              height={dim.h * 0.7}
              rx={dim.w / 2 + 2}
              fill="#c8b3a2"
              opacity={0.06}
            />

            {/* Soft cuticle curve — thin arc at nail base */}
            <ellipse
              cx={0}
              cy={2}
              rx={dim.w / 2 + 1}
              ry={3}
              fill="#b49e8e"
              opacity={0.1}
            />

            {/* The nail — the hero element */}
            <g transform={`scale(1, ${lengthScale})`}>
              <NailRenderer
                id={`${hand}-${localFinger}`}
                path={nailPath}
                color={nailConfig.color}
                secondaryColor={nailConfig.secondaryColor}
                baseType={nailConfig.baseType}
                finish={nailConfig.finish}
                isSelected={isThisSelected}
                onClick={editMode === 'per-nail' ? () => selectNail(globalFinger) : undefined}
              />
            </g>
          </g>
        );
      })}
    </svg>
  );
}
