import ShapeSelector from './ShapeSelector';
import LengthSelector from './LengthSelector';
import FinishSelector from './FinishSelector';
import ColorPaletteSelector from './ColorPaletteSelector';

interface BaseLookMobileProps {
  microStep: number;
  setMicroStep: (step: number) => void;
}

const BaseLookMobile = ({ microStep, setMicroStep }: BaseLookMobileProps) => {
  // Handle auto-advance after selection with 300ms delay
  const handleSelection = (nextMicroStep: number) => {
    setTimeout(() => {
      if (nextMicroStep <= 3) {
        setMicroStep(nextMicroStep);
      }
    }, 300);
  };

  return (
    <div className="animate-fade-in">
      {microStep === 0 && (
        <ShapeSelector onSelect={() => handleSelection(1)} />
      )}
      {microStep === 1 && (
        <LengthSelector onSelect={() => handleSelection(2)} />
      )}
      {microStep === 2 && (
        <FinishSelector onSelect={() => handleSelection(3)} />
      )}
      {microStep === 3 && (
        <ColorPaletteSelector onSelect={() => {}} />
      )}
    </div>
  );
};

export default BaseLookMobile;
