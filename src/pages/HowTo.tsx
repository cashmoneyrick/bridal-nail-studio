import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Ruler, Sparkles, Heart, AlertCircle, Trash2 } from "lucide-react";

const categories = [
  {
    title: "I Don't Know My Size",
    path: "/how-to/sizing",
    gridArea: "sizing",
    icon: Ruler,
    isPrimary: true,
  },
  {
    title: "Applying for the First Time",
    path: "/how-to/application",
    gridArea: "applying",
    icon: Sparkles,
  },
  {
    title: "Troubleshooting",
    path: "/how-to/troubleshooting",
    gridArea: "trouble",
    icon: AlertCircle,
  },
  {
    title: "Removing Your Set",
    path: "/how-to/removal",
    gridArea: "removal",
    icon: Trash2,
  },
  {
    title: "Prepping for My Wedding",
    path: "/how-to/bridal",
    gridArea: "bridal",
    icon: Heart,
    isSpecial: true,
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
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Link
                  key={category.path}
                  to={category.path}
                  className="group block"
                >
                  <div
                    className={`
                      bg-secondary/20 border border-border/50 rounded-2xl p-6 
                      transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-border
                      ${category.isPrimary || category.isSpecial ? 'min-h-[180px]' : 'min-h-[140px]'}
                      ${category.isSpecial ? 'bg-primary/5' : ''}
                    `}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`
                        p-3 rounded-xl 
                        ${category.isPrimary ? 'bg-primary/10' : category.isSpecial ? 'bg-rose/10' : 'bg-muted/50'}
                      `}>
                        <Icon className={`
                          w-6 h-6 
                          ${category.isPrimary ? 'text-primary' : category.isSpecial ? 'text-rose' : 'text-muted-foreground'}
                        `} />
                      </div>
                      <h3 className={`
                        font-serif text-foreground group-hover:text-primary transition-colors
                        ${category.isPrimary ? 'text-xl' : category.isSpecial ? 'text-xl' : 'text-lg'}
                      `}>
                        {category.title}
                      </h3>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Desktop: Bento Grid */}
          <div 
            className="hidden md:grid gap-4 lg:gap-6"
            style={{
              gridTemplateColumns: 'repeat(3, 1fr)',
              gridTemplateRows: 'repeat(3, minmax(140px, auto))',
              gridTemplateAreas: `
                "sizing applying applying"
                "sizing trouble trouble"
                "removal bridal bridal"
              `,
            }}
          >
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Link
                  key={category.path}
                  to={category.path}
                  className="group block"
                  style={{ gridArea: category.gridArea }}
                >
                  <div
                    className={`
                      h-full bg-secondary/20 border border-border/50 rounded-2xl 
                      transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-border
                      flex flex-col justify-between
                      ${category.isPrimary ? 'p-8 lg:p-10' : category.isSpecial ? 'p-6 lg:p-8' : 'p-5 lg:p-6'}
                      ${category.isSpecial ? 'bg-primary/5' : ''}
                    `}
                  >
                    <div className={`
                      p-3 rounded-xl w-fit
                      ${category.isPrimary ? 'bg-primary/10 p-4' : category.isSpecial ? 'bg-rose/10' : 'bg-muted/50'}
                    `}>
                      <Icon className={`
                        ${category.isPrimary ? 'w-8 h-8' : 'w-6 h-6'}
                        ${category.isPrimary ? 'text-primary' : category.isSpecial ? 'text-rose' : 'text-muted-foreground'}
                      `} />
                    </div>
                    <h3 className={`
                      font-serif text-foreground group-hover:text-primary transition-colors mt-4
                      ${category.isPrimary ? 'text-2xl lg:text-3xl' : category.isSpecial ? 'text-xl lg:text-2xl' : 'text-lg lg:text-xl'}
                    `}>
                      {category.title}
                    </h3>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HowTo;
