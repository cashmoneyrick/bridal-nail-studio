/**
 * ColorSection — color picker with base type tabs, preset swatches, and palettes.
 * HSV-based picker with CSS gradients for the saturation-value area.
 */

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCustomStudioStore } from '@/stores/customStudioStore';
import { BaseType, BASE_TYPE_LABELS, PRESET_COLORS, COLOR_PALETTES } from '@/lib/pricing';
import SectionWrapper from './SectionWrapper';

// ── Color conversion utilities ──────────────────────────────────────────

function hsvToRgb(h: number, s: number, v: number): [number, number, number] {
  h = h / 360;
  let r = 0, g = 0, b = 0;
  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  switch (i % 6) {
    case 0: r = v; g = t; b = p; break;
    case 1: r = q; g = v; b = p; break;
    case 2: r = p; g = v; b = t; break;
    case 3: r = p; g = q; b = v; break;
    case 4: r = t; g = p; b = v; break;
    case 5: r = v; g = p; b = q; break;
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('').toUpperCase();
}

function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
    : [248, 232, 224];
}

function rgbToHsv(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  const s = max === 0 ? 0 : d / max;
  const v = max;
  if (d !== 0) {
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return [h * 360, s, v];
}

function hexToHsv(hex: string): [number, number, number] {
  return rgbToHsv(...hexToRgb(hex));
}

function hsvToHex(h: number, s: number, v: number): string {
  const [r, g, b] = hsvToRgb(h, s, v);
  return rgbToHex(r, g, b);
}

// ── Base types ──────────────────────────────────────────────────────────

const BASE_TYPES: BaseType[] = ['solid', 'french-tip-base', 'ombre', 'chrome-base', 'jelly', 'clear'];

// Visual indicator CSS for each base type
const BASE_TYPE_VISUALS: Record<BaseType, { background: string; border?: string; opacity?: number }> = {
  solid: { background: 'currentColor' },
  'french-tip-base': { background: 'linear-gradient(to right, #F8E8E0 50%, #FFF 50%)' },
  ombre: { background: 'linear-gradient(to right, #F8E8E0, #C9A0A0)' },
  'chrome-base': { background: 'linear-gradient(135deg, #C0C0C0, #E8E8E8, #808080)' },
  jelly: { background: '#F8C8D4', opacity: 0.5 },
  clear: { background: 'transparent', border: '1px solid rgba(107,76,59,0.2)' },
};

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-px" style={{ background: 'rgba(107,76,59,0.15)' }} />
      <span
        className="text-xs"
        style={{
          color: '#9A7E6D',
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

// ── Main component ──────────────────────────────────────────────────────

export default function ColorSection() {
  const { defaultNailConfig, setDefaultNailConfig } = useCustomStudioStore();
  const { color, baseType, secondaryColor } = defaultNailConfig;

  const [hsv, setHsv] = useState<[number, number, number]>(() => hexToHsv(color));
  const [secondaryHsv, setSecondaryHsv] = useState<[number, number, number]>(
    () => hexToHsv(secondaryColor || '#FFFFFF')
  );
  const [editingSecondary, setEditingSecondary] = useState(false);

  // Reset secondary editing when base type doesn't support it
  const showSecondary = baseType === 'french-tip-base' || baseType === 'ombre';
  useEffect(() => {
    if (!showSecondary) setEditingSecondary(false);
  }, [showSecondary]);

  const updateColor = useCallback(
    (h: number, s: number, v: number) => {
      const hex = hsvToHex(h, s, v);
      if (editingSecondary) {
        setSecondaryHsv([h, s, v]);
        setDefaultNailConfig({ secondaryColor: hex });
      } else {
        setHsv([h, s, v]);
        setDefaultNailConfig({ color: hex });
      }
    },
    [editingSecondary, setDefaultNailConfig],
  );

  const selectPresetColor = useCallback(
    (hex: string) => {
      const newHsv = hexToHsv(hex);
      if (editingSecondary) {
        setSecondaryHsv(newHsv);
        setDefaultNailConfig({ secondaryColor: hex });
      } else {
        setHsv(newHsv);
        setDefaultNailConfig({ color: hex });
      }
    },
    [editingSecondary, setDefaultNailConfig],
  );

  const selectPalette = useCallback(
    (colors: string[]) => {
      const [primary, , , last] = colors;
      const secondary = last || colors[1] || primary;
      setHsv(hexToHsv(primary));
      setDefaultNailConfig({ color: primary, secondaryColor: secondary });
      setSecondaryHsv(hexToHsv(secondary));
    },
    [setDefaultNailConfig],
  );

  const activeHsv = editingSecondary ? secondaryHsv : hsv;
  const activeHex = hsvToHex(...activeHsv);

  return (
    <SectionWrapper title="Choose Your Color" scrollable>
      <div className="w-full max-w-lg mx-auto flex flex-col gap-4 px-2">
        {/* Base type pills */}
        <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
          {BASE_TYPES.map((type) => {
            const visual = BASE_TYPE_VISUALS[type];
            const isActive = baseType === type;
            return (
              <motion.button
                key={type}
                onClick={() => setDefaultNailConfig({ baseType: type })}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium"
                style={{
                  background: isActive ? '#6B4C3B' : '#DBBFC2',
                  color: isActive ? '#FFF' : '#7A5A48',
                }}
              >
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{
                    background: visual.background,
                    border: visual.border || '1px solid rgba(107,76,59,0.12)',
                    opacity: visual.opacity ?? 1,
                  }}
                />
                {BASE_TYPE_LABELS[type]}
              </motion.button>
            );
          })}
        </div>

        {/* Secondary color toggle (French / Ombré) */}
        {showSecondary && (
          <div className="flex justify-center gap-3">
            {[false, true].map((isSecondary) => (
              <button
                key={String(isSecondary)}
                onClick={() => setEditingSecondary(isSecondary)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-colors"
                style={{
                  background: editingSecondary === isSecondary ? '#DBBFC2' : 'transparent',
                  color: '#3D2B1F',
                  border: '1px solid #DBBFC2',
                }}
              >
                <div
                  className="w-4 h-4 rounded-full border border-white/20"
                  style={{ background: isSecondary ? (secondaryColor || '#FFF') : color }}
                />
                {baseType === 'french-tip-base'
                  ? (isSecondary ? 'Tip' : 'Base')
                  : (isSecondary ? 'Color 2' : 'Color 1')}
              </button>
            ))}
          </div>
        )}

        {/* Color picker divider */}
        <SectionDivider label="Custom Color" />

        {/* HSV color picker */}
        <SvPicker hsv={activeHsv} onChange={updateColor} />

        {/* Hex input + swatch */}
        <div className="flex items-center justify-center gap-2">
          <div
            className="w-8 h-8 rounded-lg shadow-inner"
            style={{ background: activeHex, border: '1px solid rgba(107,76,59,0.12)' }}
          />
          <HexInput value={activeHex} onChange={(hex) => updateColor(...hexToHsv(hex))} />
        </div>

        {/* Preset swatches */}
        <SectionDivider label="Presets" />
        <div className="flex flex-wrap justify-center gap-2">
          {PRESET_COLORS.map(({ name, hex }) => (
            <motion.button
              key={hex}
              title={name}
              whileTap={{ scale: 0.85 }}
              onClick={() => selectPresetColor(hex)}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full transition-shadow"
              style={{
                background: hex,
                border:
                  activeHex === hex
                    ? '2px solid #6B4C3B'
                    : '2px solid transparent',
                boxShadow:
                  activeHex === hex
                    ? '0 0 0 2px rgba(107,76,59,0.4)'
                    : 'inset 0 1px 3px rgba(0,0,0,0.25)',
              }}
            />
          ))}
        </div>

        {/* Palettes */}
        <SectionDivider label="Palettes" />
        <div className="flex flex-col gap-2 w-full">
          {COLOR_PALETTES.map((palette) => (
            <motion.button
              key={palette.id}
              whileTap={{ scale: 0.98 }}
              whileHover={{ y: -1 }}
              onClick={() => selectPalette(palette.colors)}
              className="flex flex-col overflow-hidden rounded-lg"
              style={{ background: '#DBBFC2' }}
              title={palette.description}
            >
              {/* Gradient band preview */}
              <div
                className="h-2 w-full"
                style={{
                  background: `linear-gradient(90deg, ${palette.colors.join(', ')})`,
                }}
              />
              <div className="flex items-center gap-2 px-3 py-2">
                {palette.colors.map((c, i) => (
                  <div
                    key={i}
                    className="w-5 h-5 rounded-full flex-shrink-0"
                    style={{ background: c, border: '1px solid rgba(107,76,59,0.12)' }}
                  />
                ))}
                <span
                  className="text-xs ml-1"
                  style={{ color: '#3D2B1F' }}
                >
                  {palette.name}
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}

// ── SV + Hue picker ─────────────────────────────────────────────────────

interface SvPickerProps {
  hsv: [number, number, number];
  onChange: (h: number, s: number, v: number) => void;
}

function SvPicker({ hsv, onChange }: SvPickerProps) {
  const [h, s, v] = hsv;
  const svRef = useRef<HTMLDivElement>(null);
  const hueRef = useRef<HTMLDivElement>(null);
  const dragging = useRef<'sv' | 'hue' | null>(null);

  const pickSv = useCallback(
    (cx: number, cy: number) => {
      if (!svRef.current) return;
      const rect = svRef.current.getBoundingClientRect();
      const ns = Math.max(0, Math.min(1, (cx - rect.left) / rect.width));
      const nv = Math.max(0, Math.min(1, 1 - (cy - rect.top) / rect.height));
      onChange(h, ns, nv);
    },
    [h, onChange],
  );

  const pickHue = useCallback(
    (cx: number) => {
      if (!hueRef.current) return;
      const rect = hueRef.current.getBoundingClientRect();
      const nh = Math.max(0, Math.min(1, (cx - rect.left) / rect.width));
      onChange(nh * 360, s, v);
    },
    [s, v, onChange],
  );

  useEffect(() => {
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!dragging.current) return;
      e.preventDefault();
      const cx = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const cy = 'touches' in e ? e.touches[0].clientY : e.clientY;
      dragging.current === 'sv' ? pickSv(cx, cy) : pickHue(cx);
    };
    const onUp = () => {
      dragging.current = null;
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
    };
  }, [pickSv, pickHue]);

  const pureHue = hsvToHex(h, 1, 1);

  return (
    <div className="flex flex-col gap-3">
      {/* Saturation-Value area */}
      <div
        ref={svRef}
        className="relative w-full rounded-lg cursor-crosshair overflow-hidden select-none"
        style={{
          height: 130,
          background: `linear-gradient(to bottom, rgba(0,0,0,0), #000), linear-gradient(to right, #fff, ${pureHue})`,
        }}
        onMouseDown={(e) => {
          dragging.current = 'sv';
          pickSv(e.clientX, e.clientY);
        }}
        onTouchStart={(e) => {
          dragging.current = 'sv';
          pickSv(e.touches[0].clientX, e.touches[0].clientY);
        }}
      >
        <div
          className="absolute w-4 h-4 rounded-full border-2 border-white pointer-events-none"
          style={{
            left: `${s * 100}%`,
            top: `${(1 - v) * 100}%`,
            transform: 'translate(-50%, -50%)',
            boxShadow: '0 0 0 1px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.4)',
          }}
        />
      </div>

      {/* Hue bar */}
      <div
        ref={hueRef}
        className="relative w-full h-4 rounded-full cursor-pointer overflow-hidden select-none"
        style={{
          background:
            'linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)',
        }}
        onMouseDown={(e) => {
          dragging.current = 'hue';
          pickHue(e.clientX);
        }}
        onTouchStart={(e) => {
          dragging.current = 'hue';
          pickHue(e.touches[0].clientX);
        }}
      >
        <div
          className="absolute top-1/2 w-4 h-4 rounded-full border-2 border-white pointer-events-none"
          style={{
            left: `${(h / 360) * 100}%`,
            transform: 'translate(-50%, -50%)',
            boxShadow: '0 0 0 1px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.4)',
          }}
        />
      </div>
    </div>
  );
}

// ── Hex input ───────────────────────────────────────────────────────────

function HexInput({ value, onChange }: { value: string; onChange: (hex: string) => void }) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(value);

  useEffect(() => {
    if (!editing) setText(value);
  }, [value, editing]);

  return (
    <input
      className="w-24 text-center text-sm font-mono py-1 px-2 rounded-md outline-none transition-colors"
      style={{
        background: '#FDF2F3',
        color: '#3D2B1F',
        border: '1px solid #DBBFC2',
      }}
      value={editing ? text : value}
      onChange={(e) => {
        let val = e.target.value;
        if (!val.startsWith('#')) val = '#' + val;
        setText(val);
        if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
          onChange(val.toUpperCase());
        }
      }}
      onFocus={() => setEditing(true)}
      onBlur={() => {
        setEditing(false);
        if (/^#[0-9A-Fa-f]{6}$/.test(text)) onChange(text.toUpperCase());
      }}
      maxLength={7}
    />
  );
}
