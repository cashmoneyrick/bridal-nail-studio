const steps = [
  {
    number: "01",
    title: "Find Your Fit",
    description: "Use our sizing guide or save your measurements to your profile for perfectly fitted nails every time.",
  },
  {
    number: "02",
    title: "Choose Your Set",
    description: "Browse our curated collections or design your own custom set in our studio.",
  },
  {
    number: "03",
    title: "Apply & Shine",
    description: "Follow our easy application guide for a flawless, long-lasting manicure at home.",
  },
];

const ThreeStepProcess = () => {
  return (
    <section className="section-padding bg-background">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="w-12 h-0.5 bg-primary mx-auto mb-4" />
          <p className="text-sm font-medium tracking-[0.2em] uppercase text-primary mb-3">
            How It Works
          </p>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-medium">
            Three Simple Steps
          </h2>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step) => (
            <div key={step.number} className="text-center group">
              {/* Large Hero Number */}
              <div className="font-display text-6xl sm:text-7xl lg:text-8xl font-medium text-primary/20 group-hover:text-primary transition-colors duration-300 mb-4">
                {step.number}
              </div>

              {/* Title */}
              <h3 className="font-display text-xl sm:text-2xl font-medium mb-3">
                {step.title}
              </h3>

              {/* Description */}
              <p className="text-muted-foreground text-sm sm:text-base max-w-xs mx-auto leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ThreeStepProcess;
