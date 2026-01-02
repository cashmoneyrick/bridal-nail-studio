const steps = [
  {
    number: "01",
    title: "Order Your Set",
    description: "Pick your favorite design",
  },
  {
    number: "02",
    title: "Get Your Kit",
    description: "We send everything to size your nails",
  },
  {
    number: "03",
    title: "Submit Your Sizes",
    description: "Tell us your fit on our site",
  },
];

const ThreeStepProcess = () => {
  return (
    <section className="relative">
      {/* Section Header */}
      <div className="text-center py-12 sm:py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-medium tracking-[0.2em] uppercase text-primary mb-3">
            How It Works
          </p>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-medium">
            Three Simple Steps
          </h2>
        </div>
      </div>

      {/* Step Cards */}
      <div className="flex flex-col lg:flex-row">
        {steps.map((step, index) => {
          const isImageLeft = index !== 1; // Steps 1 and 3 have image on left
          const bgClass = index === 1 ? "bg-background" : "bg-primary/10";

          return (
            <div
              key={step.number}
              className={`${bgClass} flex-1`}
            >
              <div className="container mx-auto px-4 sm:px-6 lg:px-0">
                {/* Mobile/Tablet: Stacked card layout */}
                <div className="lg:hidden py-10 sm:py-12">
                  <div
                    className={`flex items-center gap-5 sm:gap-8 ${
                      isImageLeft ? "flex-row" : "flex-row-reverse"
                    }`}
                  >
                    {/* Image Placeholder */}
                    <div className="w-2/5 sm:w-1/3 flex-shrink-0">
                      <div className="aspect-[4/5] rounded-2xl bg-muted/40 border-2 border-dashed border-muted-foreground/20 flex items-center justify-center">
                        <span className="text-muted-foreground/40 text-xs font-medium">Photo</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className={`flex-1 ${isImageLeft ? "text-left" : "text-right"}`}>
                      <span className="font-display italic text-4xl sm:text-5xl text-primary/80 block mb-2">
                        {step.number}
                      </span>
                      <h3 className="font-display text-xl sm:text-2xl font-medium mb-1">
                        {step.title}
                      </h3>
                      <p className="text-muted-foreground text-sm sm:text-base">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Desktop: Vertical card layout */}
                <div className="hidden lg:flex flex-col items-center text-center py-16 px-8">
                  {/* Image Placeholder */}
                  <div className="w-full max-w-[200px] mb-6">
                    <div className="aspect-square rounded-2xl bg-muted/40 border-2 border-dashed border-muted-foreground/20 flex items-center justify-center">
                      <span className="text-muted-foreground/40 text-sm font-medium">Photo</span>
                    </div>
                  </div>

                  {/* Step Number */}
                  <span className="font-display italic text-5xl text-primary/80 block mb-3">
                    {step.number}
                  </span>

                  {/* Title */}
                  <h3 className="font-display text-2xl font-medium mb-2">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-muted-foreground text-base max-w-[250px]">
                    {step.description}
                  </p>
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
