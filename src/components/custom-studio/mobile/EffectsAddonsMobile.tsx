import EffectsSection from './EffectsSection';
import RhinestonesSection from './RhinestonesSection';
import CharmsSection from './CharmsSection';

interface EffectsAddonsMobileProps {
  microStep?: number;
  setMicroStep?: (step: number) => void;
}

const EffectsAddonsMobile = ({ microStep = 0, setMicroStep }: EffectsAddonsMobileProps) => {
  // If setMicroStep is provided, use micro-step flow (one section at a time)
  // Otherwise, show all sections (backwards compatibility)
  const useMicroSteps = setMicroStep !== undefined;

  if (!useMicroSteps) {
    // Legacy mode: show all sections
    return (
      <div className="space-y-8 pb-8">
        <EffectsSection />
        <RhinestonesSection />
        <CharmsSection />
      </div>
    );
  }

  // Micro-step mode: show one section at a time
  return (
    <div className="space-y-6 pb-8">
      {microStep === 0 && <EffectsSection />}
      {microStep === 1 && <RhinestonesSection />}
      {microStep === 2 && <CharmsSection />}
    </div>
  );
};

export default EffectsAddonsMobile;
