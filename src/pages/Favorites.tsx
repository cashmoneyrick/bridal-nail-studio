import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useFavoritesStore } from "@/stores/favoritesStore";
import { toast } from "sonner";

const Favorites = () => {
  const { items: favorites, removeFavorite } = useFavoritesStore();

  const handleRemoveFavorite = (productId: string, productTitle: string, e: React.MouseEvent) => {
    e.preventDefault();
    removeFavorite(productId);
    toast.success(`${productTitle} removed from favorites`, {
      position: "top-center",
    });
  };

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
            {favorites.length > 0 
              ? `You have ${favorites.length} saved item${favorites.length !== 1 ? 's' : ''}`
              : 'Save your favorite nail sets and come back to them anytime'
            }
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
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 animate-fade-in">
              {favorites.map((product) => {
                const image = product.images?.[0];
                const price = product.price ?? 0;
                const currencyCode = product.currencyCode ?? 'USD';
                
                return (
                  <Link
                    key={product.id}
                    to={`/product/${product.handle}`}
                    className="group"
                  >
                    <div className="relative overflow-hidden rounded-2xl bg-muted/30 aspect-square mb-4">
                      {image ? (
                        <img
                          src={image}
                          alt={product.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-secondary/20">
                          <ShoppingBag className="h-12 w-12 text-muted-foreground" />
                        </div>
                      )}
                      
                      {/* Remove from favorites button */}
                      <button
                        onClick={(e) => handleRemoveFavorite(product.id, product.title, e)}
                        className="absolute top-3 right-3 w-9 h-9 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center transition-all hover:bg-destructive hover:text-destructive-foreground"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      
                      {/* Quick Add Button */}
                      <div className="absolute inset-x-0 bottom-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Button className="w-full btn-primary text-sm">
                          Select Options
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <h3 className="font-display text-base sm:text-lg font-medium group-hover:text-primary transition-colors">
                        {product.title}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        ${price.toFixed(2)} {currencyCode}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Favorites;
