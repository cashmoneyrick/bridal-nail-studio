import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import CategoryGrid from "@/components/CategoryGrid";
import ProductGrid from "@/components/ProductGrid";
import CustomStudioPreview from "@/components/CustomStudioPreview";
import ThreeStepProcess from "@/components/ThreeStepProcess";
import EmailSignup from "@/components/EmailSignup";
import Footer from "@/components/Footer";
import PromoBanner from "@/components/PromoBanner";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="relative z-10">
        <HeroSection />
        <PromoBanner />
        <CategoryGrid />
        <ProductGrid />
        <CustomStudioPreview />
        <ThreeStepProcess />
        <EmailSignup />
      </main>
      <Footer />
    </div>
  );
};

export default Index;