import { Hand, Package, Sparkles } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Hand,
    title: "Find Your Fit",
    description: "Use our sizing guide or save your measurements to your profile for perfectly fitted nails every time.",
  },
  {
    number: "02",
    icon: Package,
    title: "Choose Your Set",
    description: "Browse our curated collections or design your own custom set in our studio.",
  },
  {
    number: "03",
    icon: Sparkles,
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
          <p className="text-sm font-medium tracking-[0.2em] uppercase text-primary mb-3">
            How It Works
          </p>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-medium">
            Three Simple Steps
          </h2>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <div key={step.number} className="relative text-center group">
              {/* Connector Line (desktop only) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-[60%] w-[80%] h-px bg-border" />
              )}

              {/* Step Content */}
              <div className="relative">
                {/* Number Badge */}
                <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                  {step.number}
                </div>

                {/* Icon */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors duration-300">
                  <step.icon className="w-8 h-8 sm:w-10 sm:h-10 text-foreground/70 group-hover:text-primary transition-colors duration-300" strokeWidth={1.5} />
                </div>

                {/* Text */}
                <h3 className="font-display text-xl sm:text-2xl font-medium mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm sm:text-base max-w-xs mx-auto leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ThreeStepProcess;