import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const categories = [
  {
    title: "I Don't Know My Size",
    path: "/how-to/sizing",
    gridArea: "sizing",
    isPrimary: true,
  },
  {
    title: "Applying for the First Time",
    path: "/how-to/application",
    gridArea: "applying",
  },
  {
    title: "Troubleshooting",
    path: "/how-to/troubleshooting",
    gridArea: "troubleshooting",
  },
  {
    title: "Removing Your Set",
    path: "/how-to/removal",
    gridArea: "removal",
  },
  {
    title: "Prepping for My Wedding",
    path: "/how-to/bridal",
    gridArea: "bridal",
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

      {/* Bento Grid */}
      <section className="pb-24 md:pb-32">
        <div className="container mx-auto px-6">
          {/* Mobile: Single column stack */}
          <div className="grid grid-cols-1 gap-4 lg:hidden">
            {categories.map((category) => (
              <Link
                key={category.path}
                to={category.path}
                className="group block"
              >
                <div
                  className={`
                    bg-secondary/20 border border-border/50 rounded-2xl overflow-hidden
                    transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-border
                  `}
                >
                  {/* Placeholder Image */}
                  <div className={`bg-muted/30 ${category.isPrimary ? 'aspect-[16/10]' : 'aspect-[16/9]'}`} />
                  {/* Title */}
                  <div className="p-4">
                    <h3 className={`
                      font-serif text-foreground group-hover:text-primary transition-colors
                      ${category.isPrimary ? 'text-xl' : 'text-lg'}
                    `}>
                      {category.title}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Desktop: Bento Grid */}
          <div 
            className="hidden lg:grid gap-6"
            style={{
              gridTemplateColumns: '1fr 1fr',
              gridTemplateRows: 'auto auto auto',
              gridTemplateAreas: `
                "sizing applying"
                "sizing troubleshooting"
                "removal bridal"
              `,
            }}
          >
            {categories.map((category) => (
              <Link
                key={category.path}
                to={category.path}
                className="group block"
                style={{ gridArea: category.gridArea }}
              >
                <div
                  className={`
                    h-full bg-secondary/20 border border-border/50 rounded-2xl overflow-hidden
                    transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-border
                    flex flex-col
                  `}
                >
                  {/* Placeholder Image */}
                  <div className={`bg-muted/30 flex-1 ${category.isPrimary ? 'min-h-[300px]' : 'min-h-[120px]'}`} />
                  {/* Title */}
                  <div className={category.isPrimary ? 'p-6 lg:p-8' : 'p-4 lg:p-5'}>
                    <h3 className={`
                      font-serif text-foreground group-hover:text-primary transition-colors
                      ${category.isPrimary ? 'text-2xl lg:text-3xl' : 'text-lg lg:text-xl'}
                    `}>
                      {category.title}
                    </h3>
                  </div>
                </div>
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
