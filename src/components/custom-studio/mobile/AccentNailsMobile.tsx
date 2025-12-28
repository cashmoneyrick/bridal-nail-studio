import AccentYesNo from './AccentYesNo';
import AccentNailSelector from './AccentNailSelector';
import AccentConfig from './AccentConfig';

interface AccentNailsMobileProps {
  microStep: number;
  setMicroStep: (step: number) => void;
  onSkipToNext: () => void;
}

const AccentNailsMobile = ({ microStep, setMicroStep, onSkipToNext }: AccentNailsMobileProps) => {
  const handleNo = () => {
    setTimeout(() => onSkipToNext(), 300);
  };

  const handleYes = () => {
    setTimeout(() => setMicroStep(1), 300);
  };

  return (
    <div className="min-h-[400px]">
      {microStep === 0 && (
        <AccentYesNo onNo={handleNo} onYes={handleYes} />
      )}
      {microStep === 1 && (
        <AccentNailSelector onContinue={() => setMicroStep(2)} />
      )}
      {microStep === 2 && (
        <AccentConfig />
      )}
    </div>
  );
};

export default AccentNailsMobile;
