import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

const Favorites = () => {
  // Placeholder for favorites - in the future this would connect to Shopify customer metafields
  const favorites: any[] = [];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Header */}
      <section className="pt-24 sm:pt-32 pb-12 px-4">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-display text-4xl sm:text-5xl text-foreground mb-4">
            My Favorites
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Save your favorite nail sets and come back to them anytime
          </p>
        </div>
      </section>

      {/* Favorites Content */}
      <section className="pb-24 px-4">
        <div className="max-w-6xl mx-auto">
          {favorites.length === 0 ? (
            <div className="text-center py-16 animate-fade-in">
              <div className="bg-muted/30 rounded-3xl p-12 max-w-lg mx-auto">
                <Heart className="w-12 h-12 text-muted-foreground/50 mx-auto mb-6" />
                <h2 className="font-display text-2xl text-foreground mb-3">
                  No favorites yet
                </h2>
                <p className="text-muted-foreground mb-8">
                  Start exploring our collection and tap the heart icon on any set you love to save it here.
                </p>
                <Link to="/shop">
                  <Button size="lg" className="rounded-full px-8">
                    Explore Collections
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {/* Favorites grid would go here */}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Favorites;