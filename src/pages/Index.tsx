import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import CategoryGrid from "@/components/CategoryGrid";
import ProductGrid from "@/components/ProductGrid";
import CustomStudioPreview from "@/components/CustomStudioPreview";
import ThreeStepProcess from "@/components/ThreeStepProcess";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="relative z-10">
        <HeroSection />

        {/* Valentine's Urgency Banner */}
        <div className="bg-[#9D4A54] text-[#FDF8F5] shadow-sm">
          <div className="container mx-auto px-4 py-3 flex items-center justify-center">
            <p className="text-sm font-medium tracking-wide leading-relaxed text-center">
              💝 Order by Feb 5th for guaranteed Valentine's delivery
            </p>
          </div>
        </div>

        <CategoryGrid />
        <ProductGrid />
        <CustomStudioPreview />
        <ThreeStepProcess />
      </main>
      <Footer />
    </div>
  );
};

export default Index;