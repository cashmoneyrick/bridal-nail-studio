import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingBag, ArrowRight, Sparkles } from "lucide-react";
import { sampleProducts } from "@/lib/products";

const EmptyCartState = () => {
  const trendingProducts = sampleProducts.slice(0, 4);

  return (
    <div className="space-y-12 sm:space-y-16">
      {/* Hero / Heading */}
      <div className="flex flex-col items-center justify-center py-12 sm:py-16">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
          <ShoppingBag className="h-9 w-9 text-primary/60" />
        </div>
        <h2 className="font-display text-2xl sm:text-3xl font-semibold text-foreground mb-2 tracking-tight">
          Your collection awaits
        </h2>
        <p className="text-muted-foreground mb-8 text-center max-w-sm">
          Discover handcrafted press-on nail sets made just for you
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button asChild size="lg" className="rounded-full px-8">
            <Link to="/shop">
              Shop Collection
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-full px-8">
            <Link to="/create">
              Design Your Own
              <Sparkles className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Trending Products */}
      {trendingProducts.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display text-xl sm:text-2xl font-semibold text-foreground tracking-tight">
              Trending Now
            </h3>
            <Link
              to="/shop"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              View all
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {trendingProducts.map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.handle}`}
                className="group"
              >
                <div className="aspect-square rounded-xl overflow-hidden bg-muted mb-3">
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h4 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">
                  {product.title}
                </h4>
                <p className="text-sm text-muted-foreground mt-0.5">
                  ${product.price.toFixed(2)}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Custom Studio CTA */}
      <section className="flex justify-center pb-8">
        <div className="bg-secondary/20 border border-secondary/30 rounded-2xl p-8 sm:p-12 text-center max-w-lg w-full">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <h3 className="font-display text-lg sm:text-xl font-semibold text-foreground mb-2">
            Can't find what you're looking for?
          </h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
            Design your dream set in our Custom Studio — choose your shape, length, color, and finish
          </p>
          <Button asChild variant="outline" className="rounded-full px-8">
            <Link to="/create">
              Start Designing
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default EmptyCartState;
