import { ArrowRight } from "lucide-react";

const categories = [
  {
    title: "Everyday Elegance",
    description: "Subtle sophistication for daily wear",
    image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=80",
    href: "/shop/everyday",
  },
  {
    title: "Special Occasions",
    description: "Statement sets for your biggest moments",
    image: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=600&q=80",
    href: "/shop/occasions",
  },
  {
    title: "Artistic Designs",
    description: "Bold, creative expressions of nail art",
    image: "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=600&q=80",
    href: "/shop/artistic",
  },
];

const CategoryGrid = () => {
  return (
    <section className="section-padding bg-background">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-medium mb-4">
            Discover Your Perfect Set
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
            From minimalist chic to daring artistry, find nails that match your unique style
          </p>
        </div>

        {/* Category Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {categories.map((category, index) => (
            <a
              key={category.title}
              href={category.href}
              className="group relative overflow-hidden rounded-2xl sm:rounded-3xl aspect-[3/4] cursor-pointer"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Image */}
              <div className="absolute inset-0">
                <img
                  src={category.image}
                  alt={category.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent" />
              </div>

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8">
                <div className="transform transition-transform duration-500 group-hover:-translate-y-2">
                  <h3 className="font-display text-xl sm:text-2xl font-medium text-white mb-2">
                    {category.title}
                  </h3>
                  <p className="text-white/70 text-sm sm:text-base mb-4">
                    {category.description}
                  </p>
                  <div className="flex items-center text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Shop Now
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>

              {/* Hover Border Effect */}
              <div className="absolute inset-0 border-2 border-white/0 group-hover:border-white/20 rounded-2xl sm:rounded-3xl transition-colors duration-300" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;