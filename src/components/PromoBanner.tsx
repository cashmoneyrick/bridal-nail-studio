import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";

const messages = [
  {
    headline: "Spring Collection",
    detail: "garden-inspired sets, handmade to order",
  },
  {
    headline: "Free Sizing Kit",
    detail: "included with every nail set purchase",
  },
  {
    headline: "Custom Designs",
    detail: "your vision, handcrafted — starting at $45",
  },
];

const DISPLAY_DURATION = 5000; // 5s per message

const PromoBanner = () => {
  const [index, setIndex] = useState(0);

  const advance = useCallback(() => {
    setIndex((prev) => (prev + 1) % messages.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(advance, DISPLAY_DURATION);
    return () => clearInterval(timer);
  }, [advance]);

  const current = messages[index];

  return (
    <div id="promo" className="relative z-20 -mt-6 sm:-mt-8">
      {/* Dark banner with rounded top edges for organic transition */}
      <div
        className="relative overflow-hidden rounded-t-[2rem] sm:rounded-t-[3rem]"
        style={{
          background:
            "linear-gradient(135deg, hsl(130 15% 12%) 0%, hsl(25 12% 16%) 50%, hsl(130 12% 14%) 100%)",
        }}
      >
        {/* Subtle noise texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Warm glow accent */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 100% at 50% 50%, hsla(35 40% 50% / 0.06) 0%, transparent 70%)",
          }}
        />

        <div className="relative z-20 pt-6 pb-6 sm:pt-8 sm:pb-8 px-6">
          <div className="flex flex-col items-center justify-center min-h-[56px] sm:min-h-[64px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                className="flex flex-col items-center text-center"
              >
                <h3
                  className="font-display italic font-medium tracking-wide leading-tight"
                  style={{
                    color: "hsl(38 45% 65%)",
                    fontSize: "clamp(1.25rem, 3.5vw, 1.6rem)",
                  }}
                >
                  {current.headline}
                </h3>
                <p
                  className="mt-1 tracking-wider uppercase"
                  style={{
                    color: "hsl(35 25% 55%)",
                    fontSize: "clamp(0.65rem, 1.8vw, 0.8rem)",
                    letterSpacing: "0.14em",
                  }}
                >
                  {current.detail}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Progress dots */}
            <div className="flex items-center gap-2 mt-3">
              {messages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  aria-label={`Go to announcement ${i + 1}`}
                  className="relative h-[3px] rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: i === index ? "20px" : "4px",
                    backgroundColor:
                      i === index
                        ? "hsl(38 45% 65%)"
                        : "hsla(35 25% 55% / 0.3)",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave — subtle cream curve at the bottom edge */}
      <div
        className="w-full leading-[0]"
        style={{
          background:
            "linear-gradient(135deg, hsl(130 15% 12%) 0%, hsl(25 12% 16%) 50%, hsl(130 12% 14%) 100%)",
        }}
      >
        <svg
          viewBox="0 0 1440 24"
          preserveAspectRatio="none"
          className="w-full h-4 sm:h-6 block"
        >
          <path
            d="M0,0 C360,24 1080,24 1440,0 L1440,24 L0,24 Z"
            fill="hsl(30 6% 97%)"
          />
        </svg>
      </div>
    </div>
  );
};

export default PromoBanner;
