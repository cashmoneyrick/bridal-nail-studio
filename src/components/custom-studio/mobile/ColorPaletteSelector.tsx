import { useState } from 'react';
import ColorWheelPicker from './ColorWheelPicker';
import NailPainter from './NailPainter';

interface ColorPaletteSelectorProps {
  onSelect: () => void;
}

const ColorPaletteSelector = ({ onSelect }: ColorPaletteSelectorProps) => {
  const [screen, setScreen] = useState<'picker' | 'painter'>('picker');
  
  if (screen === 'picker') {
    return <ColorWheelPicker onNext={() => setScreen('painter')} />;
  }
  
  return <NailPainter onBack={() => setScreen('picker')} />;
};

export default ColorPaletteSelector;
