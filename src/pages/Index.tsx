import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import CategoryGrid from "@/components/CategoryGrid";
import ProductGrid from "@/components/ProductGrid";
import CustomStudioPreview from "@/components/CustomStudioPreview";
import ThreeStepProcess from "@/components/ThreeStepProcess";
import Footer from "@/components/Footer";
import ValentineBanner from "@/components/ValentineBanner";

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative">
      {/* Valentine's Day Banner */}
      <ValentineBanner />
      
      {/* Floating Decorative Hearts - Very Subtle */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Top left heart */}
        <svg 
          className="absolute top-24 left-8 w-16 h-16 text-primary/10" 
          viewBox="0 0 24 24" 
          fill="currentColor"
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
        
        {/* Bottom right heart */}
        <svg 
          className="absolute bottom-32 right-12 w-20 h-20 text-primary/15" 
          viewBox="0 0 24 24" 
          fill="currentColor"
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
        
        {/* Top right heart - smaller */}
        <svg 
          className="absolute top-1/3 right-6 w-12 h-12 text-secondary/15" 
          viewBox="0 0 24 24" 
          fill="currentColor"
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </div>
      
      <Navigation />
      <main className="relative z-10">
        <HeroSection />
        <ProductGrid />
        <CategoryGrid />
        <CustomStudioPreview />
        <ThreeStepProcess />
      </main>
      <Footer />
    </div>
  );
};

export default Index;