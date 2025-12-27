import { useState } from "react";
import { X } from "lucide-react";

const ValentineBanner = () => {
  const [isVisible, setIsVisible] = useState(true);
  
  if (!isVisible) return null;
  
  return (
    <div className="bg-primary text-primary-foreground text-center py-2 px-4 text-sm relative">
      <span>💕 Valentine's Day Collection — Order by Feb 10th for guaranteed delivery</span>
      <button 
        onClick={() => setIsVisible(false)}
        className="absolute right-4 top-1/2 -translate-y-1/2 hover:bg-white/20 p-1 rounded-full transition-colors"
        aria-label="Dismiss banner"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default ValentineBanner;