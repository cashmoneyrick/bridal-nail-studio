/**
 * NailPositionEditor — dev-only tool for visually positioning nails.
 *
 * Activate by visiting /create?editNails=true
 * Drag nails on the left hand, use sliders for rotation/position/scale,
 * then copy the final values to paste into HandSvg.tsx.
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

const FINGER_NAMES = ['Pinky', 'Ring', 'Middle', 'Index', 'Thumb'];

interface NailPos {
  cx: number;
  cy: number;
  rot: number;
}

interface NailPositionEditorProps {
  positions: Record<number, NailPos>;
  scale: number;
  onPositionsChange: (pos: Record<number, NailPos>) => void;
  onScaleChange: (s: number) => void;
}

export default function NailPositionEditor({
  positions,
  scale,
  onPositionsChange,
  onScaleChange,
}: NailPositionEditorProps) {
  const isMobile = useIsMobile();
  const [dragging, setDragging] = useState<number | null>(null);
  const [selected, setSelected] = useState<number>(0);
  const [copied, setCopied] = useState(false);
  const svgRef = useRef<SVGSVGElement | null>(null);

  /* ── Find the left-hand SVG element ── */
  useEffect(() => {
    const findSvg = () => {
      const svg = document.querySelector('svg[data-hand="left"]') as SVGSVGElement | null;
      if (svg) {
        svgRef.current = svg;
      } else {
        setTimeout(findSvg, 200);
      }
    };
    findSvg();
  }, []);

  /* ── Convert screen coords → SVG viewBox coords ── */
  const screenToSvg = useCallback((clientX: number, clientY: number) => {
    const svg = svgRef.current;
    if (!svg) return null;
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) return null;
    return pt.matrixTransform(ctm.inverse());
  }, []);

  /* ── Start drag (shared by mouse + touch) ── */
  const startDrag = useCallback((target: Element, e: Event) => {
    const nailGroup = target.closest('[data-nail-index]');
    if (!nailGroup) return;
    const index = parseInt(nailGroup.getAttribute('data-nail-index')!, 10);
    if (isNaN(index)) return;
    e.preventDefault();
    e.stopPropagation();
    setDragging(index);
    setSelected(index);
  }, []);

  /* ── Mousedown + touchstart on SVG nail groups ── */
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const handleMouseDown = (e: MouseEvent) => startDrag(e.target as Element, e);
    const handleTouchStart = (e: TouchEvent) => startDrag(e.target as Element, e);

    svg.addEventListener('mousedown', handleMouseDown);
    svg.addEventListener('touchstart', handleTouchStart, { passive: false });
    return () => {
      svg.removeEventListener('mousedown', handleMouseDown);
      svg.removeEventListener('touchstart', handleTouchStart);
    };
  }, [startDrag]);

  /* ── Move + end for dragging (mouse + touch) ── */
  useEffect(() => {
    if (dragging === null) return;

    const move = (clientX: number, clientY: number) => {
      const svgPoint = screenToSvg(clientX, clientY);
      if (!svgPoint) return;
      onPositionsChange({
        ...positions,
        [dragging]: {
          ...positions[dragging],
          cx: Math.round(svgPoint.x),
          cy: Math.round(svgPoint.y),
        },
      });
    };

    const handleMouseMove = (e: MouseEvent) => move(e.clientX, e.clientY);
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      move(e.touches[0].clientX, e.touches[0].clientY);
    };
    const handleEnd = () => setDragging(null);

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleEnd);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleEnd);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleEnd);
    };
  }, [dragging, positions, onPositionsChange, screenToSvg]);

  /* ── Arrow-key nudging for selected nail ── */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const step = e.shiftKey ? 10 : 1;
      let dx = 0, dy = 0;
      switch (e.key) {
        case 'ArrowUp': dy = -step; break;
        case 'ArrowDown': dy = step; break;
        case 'ArrowLeft': dx = -step; break;
        case 'ArrowRight': dx = step; break;
        default: return;
      }
      e.preventDefault();
      onPositionsChange({
        ...positions,
        [selected]: {
          ...positions[selected],
          cx: positions[selected].cx + dx,
          cy: positions[selected].cy + dy,
        },
      });
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selected, positions, onPositionsChange]);

  /* ── Update helpers ── */
  const updateField = (finger: number, field: keyof NailPos, value: number) => {
    onPositionsChange({
      ...positions,
      [finger]: { ...positions[finger], [field]: value },
    });
  };

  /* ── Copy code to clipboard ── */
  const copyToClipboard = () => {
    const lines = Object.entries(positions)
      .sort(([a], [b]) => Number(a) - Number(b))
      .map(([k, v]) =>
        `  ${k}: { cx: ${v.cx}, cy: ${v.cy}, rot: ${v.rot} },   // ${FINGER_NAMES[Number(k)]}`
      );
    const code = `const NAIL_SCALE = ${scale};\n\nconst NAIL_POS: Record<number, { cx: number; cy: number; rot: number }> = {\n${lines.join('\n')}\n};`;

    const onSuccess = () => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(code).then(onSuccess).catch(() => {
        fallbackCopy(code, onSuccess);
      });
    } else {
      fallbackCopy(code, onSuccess);
    }
  };

  const fallbackCopy = (text: string, onSuccess: () => void) => {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    onSuccess();
  };

  const pos = positions[selected];

  return (
    <div
      style={{
        position: 'fixed',
        ...(isMobile
          ? { bottom: 0, left: 0, right: 0, borderRadius: '16px 16px 0 0' }
          : { top: '80px', right: '20px', width: '300px', borderRadius: '12px' }),
        background: 'rgba(30, 20, 15, 0.95)',
        color: '#F5EDE8',
        padding: '14px 16px',
        zIndex: 9999,
        fontSize: '12px',
        fontFamily: 'ui-monospace, "SF Mono", Monaco, monospace',
        maxHeight: isMobile ? '55vh' : 'calc(100vh - 100px)',
        overflowY: 'auto',
        boxShadow: '0 -4px 32px rgba(0,0,0,0.4)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <h3 style={{ margin: 0, fontSize: '13px', fontWeight: 700 }}>
          Nail Position Editor
        </h3>
        <span style={{ fontSize: '10px', opacity: 0.4 }}>DEV TOOL</span>
      </div>

      {/* Finger selector tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '12px' }}>
        {[0, 1, 2, 3, 4].map((finger) => (
          <button
            key={finger}
            onClick={() => setSelected(finger)}
            style={{
              flex: 1,
              padding: '6px 2px',
              background: selected === finger
                ? 'rgba(196, 155, 122, 0.25)'
                : 'rgba(255,255,255,0.06)',
              border: selected === finger
                ? '1px solid rgba(196, 155, 122, 0.5)'
                : '1px solid rgba(255,255,255,0.1)',
              borderRadius: '6px',
              color: selected === finger ? '#F5EDE8' : 'rgba(245,237,232,0.6)',
              cursor: 'pointer',
              fontSize: '10px',
              fontWeight: selected === finger ? 700 : 500,
              fontFamily: 'inherit',
              transition: 'all 0.15s',
            }}
          >
            {FINGER_NAMES[finger]}
          </button>
        ))}
      </div>

      {/* Selected finger sliders */}
      <div style={{ padding: '10px', background: 'rgba(255,255,255,0.04)', borderRadius: '8px', marginBottom: '10px' }}>
        <div style={{ fontWeight: 600, fontSize: '11px', marginBottom: '8px' }}>
          {FINGER_NAMES[selected]}
          <span style={{ opacity: 0.4, fontWeight: 400, marginLeft: '8px' }}>
            x:{pos.cx} y:{pos.cy} rot:{pos.rot}°
          </span>
        </div>

        {/* X position slider */}
        <SliderRow
          label="X Position"
          value={pos.cx}
          min={0}
          max={972}
          onChange={(v) => updateField(selected, 'cx', v)}
        />

        {/* Y position slider */}
        <SliderRow
          label="Y Position"
          value={pos.cy}
          min={0}
          max={1212}
          onChange={(v) => updateField(selected, 'cy', v)}
        />

        {/* Rotation slider */}
        <SliderRow
          label="Rotation"
          value={pos.rot}
          min={-180}
          max={180}
          onChange={(v) => updateField(selected, 'rot', v)}
          suffix="°"
        />
      </div>

      {/* Scale slider */}
      <div style={{ padding: '10px', background: 'rgba(255,255,255,0.04)', borderRadius: '8px', marginBottom: '8px' }}>
        <SliderRow
          label="Nail Scale"
          value={scale}
          min={1.5}
          max={4.0}
          step={0.1}
          onChange={onScaleChange}
          format={(v) => v.toFixed(1)}
        />
      </div>

      {/* Instructions */}
      <p style={{ margin: '0 0 10px', opacity: 0.3, fontSize: '10px', lineHeight: 1.4 }}>
        Drag nails on the hand or use sliders. Arrow keys nudge 1px (Shift = 10px).
      </p>

      {/* Copy button — full width at bottom */}
      <button
        onClick={copyToClipboard}
        style={{
          width: '100%',
          padding: '12px',
          background: copied ? '#4a7c59' : '#6B4C3B',
          color: '#F5EDE8',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: 700,
          fontSize: '13px',
          fontFamily: 'inherit',
          transition: 'background 0.2s',
          letterSpacing: '0.02em',
        }}
      >
        {copied ? '\u2713 Copied!' : 'Copy Values'}
      </button>
    </div>
  );
}

/* ── Reusable slider row ── */
function SliderRow({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  suffix = '',
  format,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  suffix?: string;
  format?: (v: number) => string;
}) {
  const display = format ? format(value) : String(value);
  return (
    <div style={{ marginBottom: '6px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px', fontSize: '10px' }}>
        <span style={{ opacity: 0.6 }}>{label}</span>
        <span style={{ opacity: 0.8 }}>{display}{suffix}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(step < 1 ? parseFloat(e.target.value) : parseInt(e.target.value, 10))}
        style={{ width: '100%', accentColor: '#C49B7A', height: '18px' }}
      />
    </div>
  );
}
