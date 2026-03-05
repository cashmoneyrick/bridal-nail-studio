import { ShoppingBag, MessageCircle } from 'lucide-react';
import { useCustomStudioStore } from '@/stores/customStudioStore';
import { cn } from '@/lib/utils';

interface IntentStepProps {
  onNext: () => void;
}

export function IntentStep({ onNext }: IntentStepProps) {
  const { orderPath, setOrderPath } = useCustomStudioStore();

  const handleSelect = (path: 'cart' | 'quote') => {
    setOrderPath(path);
    setTimeout(onNext, 300);
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="font-studio-display text-4xl md:text-5xl font-light text-foreground">
          What brings you in today?
        </h1>
        <p className="font-studio-body text-muted-foreground text-base">
          Choose how you'd like to work with us
        </p>
      </div>

      {/* Two path cards */}
      <div className="space-y-4">
        <button
          onClick={() => handleSelect('cart')}
          className={cn(
            'w-full p-8 text-left transition-all duration-300 card-soft',
            orderPath === 'cart'
              ? 'card-soft-selected scale-[1.02]'
              : 'hover:-translate-y-1'
          )}
        >
          <div className="flex items-start gap-5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center flex-shrink-0">
              <ShoppingBag className="w-6 h-6 text-primary" />
            </div>
            <div>
              <span className="font-studio-display text-xl text-foreground block mb-1.5">
                I have a design in mind
              </span>
              <span className="font-studio-body text-sm text-muted-foreground leading-relaxed">
                Show us your inspo, pick your options, and checkout
              </span>
            </div>
          </div>
        </button>

        <button
          onClick={() => handleSelect('quote')}
          className={cn(
            'w-full p-8 text-left transition-all duration-300 card-soft',
            orderPath === 'quote'
              ? 'card-soft-selected scale-[1.02]'
              : 'hover:-translate-y-1'
          )}
        >
          <div className="flex items-start gap-5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center flex-shrink-0">
              <MessageCircle className="w-6 h-6 text-primary" />
            </div>
            <div>
              <span className="font-studio-display text-xl text-foreground block mb-1.5">
                I want something custom
              </span>
              <span className="font-studio-body text-sm text-muted-foreground leading-relaxed">
                Share your ideas and we'll send you a quote
              </span>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}

export default IntentStep;
