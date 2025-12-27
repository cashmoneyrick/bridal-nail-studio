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