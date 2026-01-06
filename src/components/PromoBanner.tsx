import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

const messages = [
  "💝 Order by Feb 5th for guaranteed Valentine's delivery",
];

const PromoBanner = () => {
  const [emblaRef] = useEmblaCarousel(
    { loop: true },
    [Autoplay({ delay: 4000, stopOnInteraction: false })]
  );

  return (
    <div className="bg-[#9D4A54] text-[#FDF8F5] shadow-sm overflow-hidden">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {messages.map((message, index) => (
            <div
              key={index}
              className="flex-none w-full py-3"
            >
              <p className="text-sm font-medium tracking-wide leading-relaxed text-center">
                {message}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PromoBanner;
