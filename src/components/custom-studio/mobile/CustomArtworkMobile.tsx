import PredefinedDesignsSection from './PredefinedDesignsSection';
import CustomRequestSection from './CustomRequestSection';

const CustomArtworkMobile = () => {
  return (
    <div className="space-y-6 pb-8">
      {/* Predefined Designs */}
      <PredefinedDesignsSection />

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-background px-4 text-sm text-muted-foreground">or</span>
        </div>
      </div>

      {/* Custom Request */}
      <CustomRequestSection />
    </div>
  );
};

export default CustomArtworkMobile;
