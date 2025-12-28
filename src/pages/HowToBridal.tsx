import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const HowToBridal = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <section className="pt-32 pb-24 md:pt-40 md:pb-32">
        <div className="container mx-auto px-6 text-center">
          <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-6">
            Prepping for My Wedding
          </h1>
          <p className="text-muted-foreground text-lg">Coming soon</p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HowToBridal;
