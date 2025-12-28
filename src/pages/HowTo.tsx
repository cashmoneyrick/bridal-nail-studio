import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const categories = [
  {
    title: "I Don't Know My Size",
    path: "/how-to/sizing",
  },
  {
    title: "Applying for the First Time",
    path: "/how-to/application",
  },
  {
    title: "Troubleshooting",
    path: "/how-to/troubleshooting",
  },
  {
    title: "Removing Your Set",
    path: "/how-to/removal",
  },
  {
    title: "Prepping for My Wedding",
    path: "/how-to/bridal",
  },
];

const HowTo = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="container mx-auto px-6 text-center">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground mb-6">
            What do you need help with today?
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-xl mx-auto">
            Select a topic and we'll guide you through it.
          </p>
        </div>
      </section>

      {/* Category Cards Grid */}
      <section className="pb-24 md:pb-32">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8">
            {categories.map((category) => (
              <Link
                key={category.path}
                to={category.path}
                className="group block"
              >
                <div className="aspect-[4/3] bg-muted/30 rounded-lg mb-4 overflow-hidden transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1 border border-border/50 group-hover:border-border" />
                <h3 className="font-serif text-base md:text-lg text-foreground group-hover:text-primary transition-colors">
                  {category.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HowTo;
