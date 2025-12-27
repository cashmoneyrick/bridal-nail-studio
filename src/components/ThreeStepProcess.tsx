const steps = [
  {
    number: "01",
    title: "Find Your Fit",
    description: "Use our sizing guide or save your measurements to your profile for perfectly fitted nails every time.",
    image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&auto=format&fit=crop&q=80",
  },
  {
    number: "02",
    title: "Choose Your Set",
    description: "Browse our curated collections or design your own custom set in our studio.",
    image: "https://images.unsplash.com/photo-1604654894613-08e17c1f3c4e?w=800&auto=format&fit=crop&q=80",
  },
  {
    number: "03",
    title: "Apply & Shine",
    description: "Follow our easy application guide for a flawless, long-lasting manicure at home.",
    image: "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=800&auto=format&fit=crop&q=80",
  },
];

const bgClasses = ["bg-background", "bg-muted/30", "bg-background"];

const ThreeStepProcess = () => {
  return (
    <section className="relative">
      {/* Section Header */}
      <div className="text-center py-16 sm:py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="w-12 h-0.5 bg-primary mx-auto mb-4" />
          <p className="text-sm font-medium tracking-[0.2em] uppercase text-primary mb-3">
            How It Works
          </p>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-medium">
            Three Simple Steps
          </h2>
        </div>
      </div>

      {/* Steps Container with Connecting Line */}
      <div className="relative">
        {/* Vertical Connecting Line - Desktop Only */}
        <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px border-l-2 border-dashed border-primary/20 -translate-x-1/2 z-0" />

        {/* Step Cards */}
        {steps.map((step, index) => {
          const isReversed = index === 1;
          const bgClass = bgClasses[index];

          return (
            <div
              key={step.number}
              className={`relative py-12 sm:py-16 ${bgClass} group`}
            >
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div
                  className={`flex flex-col ${
                    isReversed ? "lg:flex-row-reverse" : "lg:flex-row"
                  } items-center gap-8 lg:gap-16`}
                >
                  {/* Image Side */}
                  <div className="w-full lg:w-1/2 relative z-10">
                    <div className="relative aspect-video rounded-2xl overflow-hidden shadow-lg">
                      <img
                        src={step.image}
                        alt={step.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Content Side */}
                  <div
                    className={`w-full lg:w-1/2 relative ${
                      isReversed ? "lg:text-right" : "lg:text-left"
                    } text-center`}
                  >
                    {/* Large Watermark Number */}
                    <div
                      className={`absolute ${
                        isReversed ? "lg:right-0" : "lg:left-0"
                      } -top-4 lg:-top-8 left-1/2 lg:left-auto -translate-x-1/2 lg:translate-x-0 font-display text-8xl lg:text-9xl font-bold text-primary/10 group-hover:text-primary/30 transition-colors duration-500 select-none pointer-events-none`}
                    >
                      {step.number}
                    </div>

                    {/* Title */}
                    <h3 className="font-display text-2xl sm:text-3xl font-medium mb-4 relative z-10 pt-16 lg:pt-20">
                      {step.title}
                    </h3>

                    {/* Description */}
                    <p
                      className={`text-muted-foreground text-base sm:text-lg leading-relaxed max-w-md relative z-10 ${
                        isReversed ? "lg:ml-auto" : "lg:mr-auto"
                      } mx-auto lg:mx-0`}
                    >
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ThreeStepProcess;
