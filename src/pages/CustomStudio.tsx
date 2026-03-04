import { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useCustomStudioStore } from '@/stores/customStudioStore';
import QuizProgress from '@/components/custom-studio/QuizProgress';
import ShapeCard from '@/components/custom-studio/ShapeCard';
import LengthCard from '@/components/custom-studio/LengthCard';
import FinishCard from '@/components/custom-studio/FinishCard';
import ColorCard from '@/components/custom-studio/ColorCard';
import SelectionSummary from '@/components/custom-studio/SelectionSummary';
import ExtrasSection from '@/components/custom-studio/ExtrasSection';
import AccentExtras from '@/components/custom-studio/AccentExtras';
import EffectsExtras from '@/components/custom-studio/EffectsExtras';
import SparkleExtras from '@/components/custom-studio/SparkleExtras';
import ArtworkExtras from '@/components/custom-studio/ArtworkExtras';
import PriceSidebar from '@/components/custom-studio/PriceSidebar';
import MobileOrderBar from '@/components/custom-studio/MobileOrderBar';
import ReviewSheet from '@/components/custom-studio/ReviewSheet';
import { Textarea } from '@/components/ui/textarea';
import { Hand, Sparkles, Gem, Palette, ChevronLeft } from 'lucide-react';

const CustomStudio = () => {
  const {
    quizStep,
    setQuizStep,
    nextQuizStep,
    prevQuizStep,
    goToHub,
    getPriceBreakdown,
    accentNails,
    effects,
    rhinestoneTier,
    charmTier,
    predefinedArtwork,
    customArtwork,
    notes,
    setNotes,
    shape,
    length,
    baseFinish,
    colorPalette,
  } = useCustomStudioStore();

  const [reviewOpen, setReviewOpen] = useState(false);

  const priceBreakdown = getPriceBreakdown();
  const hasCustomArtwork = customArtwork !== null;
  const isHub = quizStep >= 4;

  // Build extras badges
  const accentBadge = accentNails.size > 0 ? `${accentNails.size} nail${accentNails.size !== 1 ? 's' : ''}` : undefined;
  const effectsBadge = effects.length > 0 ? `${effects.length} effect${effects.length !== 1 ? 's' : ''}` : undefined;
  const sparkleBadge = (rhinestoneTier !== 'none' || charmTier !== 'none')
    ? [rhinestoneTier !== 'none' && 'Rhinestones', charmTier !== 'none' && 'Charms'].filter(Boolean).join(' + ')
    : undefined;
  const artBadge = (predefinedArtwork.length > 0 || customArtwork)
    ? [predefinedArtwork.length > 0 && `${predefinedArtwork.length} design${predefinedArtwork.length !== 1 ? 's' : ''}`, customArtwork && 'Custom'].filter(Boolean).join(' + ')
    : undefined;

  // Handlers for quiz navigation
  const handleQuizNext = () => {
    if (quizStep < 3) {
      nextQuizStep();
    } else {
      goToHub();
    }
  };

  const handleQuizBack = () => {
    prevQuizStep();
  };

  const handleEditBasics = () => {
    setQuizStep(0);
  };

  // Stub handlers for ordering (passed to PriceSidebar and ReviewSheet)
  const handleAddToCart = () => setReviewOpen(true);
  const handleRequestQuote = () => setReviewOpen(true);

  const quizCards: Record<number, React.ReactNode> = {
    0: <ShapeCard onNext={handleQuizNext} />,
    1: <LengthCard onNext={handleQuizNext} />,
    2: <FinishCard onNext={handleQuizNext} />,
    3: <ColorCard onNext={handleQuizNext} />,
  };

  const renderQuizCard = () => {
    const card = quizCards[quizStep];
    if (!card) return null;

    return (
      <div key={quizStep} className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] px-4 py-8">
        <div className="w-full max-w-xl mx-auto">
          {quizStep > 0 && (
            <button
              onClick={handleQuizBack}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 group"
            >
              <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
              Back
            </button>
          )}
          {card}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-x-hidden w-full max-w-full">
      <Navigation />

      <main className="flex-1 pt-20">
        {!isHub ? (
          /* ===== QUIZ PHASE ===== */
          <div className="relative">
            {/* Progress bar */}
            <div className="pt-6 pb-2">
              <QuizProgress currentStep={quizStep} />
            </div>

            {/* Quiz cards */}
            {renderQuizCard()}
          </div>
        ) : (
          /* ===== HUB PHASE ===== */
          <div>
            {/* Header */}
            <div className="bg-gradient-to-b from-primary/5 to-transparent py-8 md:py-10">
              <div className="container mx-auto px-4">
                <div className="text-center max-w-2xl mx-auto">
                  <h1 className="font-display text-3xl md:text-4xl text-foreground mb-2">
                    Make It Yours
                  </h1>
                  <p className="text-muted-foreground">
                    Your base set is ready — now add the extras that make it uniquely you
                  </p>
                </div>
              </div>
            </div>

            {/* Hub content */}
            <div className="container mx-auto px-4 pb-32 lg:pb-12">
              <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
                {/* Main content */}
                <div className="lg:col-span-2 space-y-4">
                  {/* Selection summary */}
                  <SelectionSummary onEditBasics={handleEditBasics} />

                  {/* Extras heading */}
                  <div className="pt-2">
                    <h2 className="text-lg font-semibold text-foreground mb-1">Customize further</h2>
                    <p className="text-sm text-muted-foreground">All optional — skip what you don't need</p>
                  </div>

                  {/* Accordion extras */}
                  <ExtrasSection
                    id="accents"
                    title="Accent Nails"
                    subtitle="Make specific nails stand out"
                    icon={<Hand className="w-5 h-5" />}
                    badge={accentBadge}
                  >
                    <AccentExtras />
                  </ExtrasSection>

                  <ExtrasSection
                    id="effects"
                    title="Special Effects"
                    subtitle="Chrome, glitter, French tips"
                    icon={<Sparkles className="w-5 h-5" />}
                    badge={effectsBadge}
                  >
                    <EffectsExtras />
                  </ExtrasSection>

                  <ExtrasSection
                    id="sparkle"
                    title="Rhinestones & Charms"
                    subtitle="Add 3D sparkle and dimension"
                    icon={<Gem className="w-5 h-5" />}
                    badge={sparkleBadge}
                  >
                    <SparkleExtras />
                  </ExtrasSection>

                  <ExtrasSection
                    id="artwork"
                    title="Nail Art"
                    subtitle="Hand-painted designs & custom artwork"
                    icon={<Palette className="w-5 h-5" />}
                    badge={artBadge}
                  >
                    <ArtworkExtras />
                  </ExtrasSection>

                  {/* Notes */}
                  <div className="pt-2 space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Additional notes (optional)
                    </label>
                    <Textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Any special requests or details for our nail artist..."
                      className="min-h-[80px] resize-none rounded-xl text-sm"
                    />
                  </div>
                </div>

                {/* Desktop sidebar */}
                <div className="hidden lg:block lg:col-span-1">
                  <div className="lg:sticky lg:top-24">
                    <PriceSidebar
                      breakdown={priceBreakdown}
                      onAddToCart={handleAddToCart}
                      onRequestQuote={handleRequestQuote}
                      isSubmitting={false}
                      hasCustomArtwork={hasCustomArtwork}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile bottom bar */}
            <MobileOrderBar
              breakdown={priceBreakdown}
              onReview={() => setReviewOpen(true)}
            />

            {/* Review sheet (mobile) */}
            <ReviewSheet
              isOpen={reviewOpen}
              onClose={() => setReviewOpen(false)}
              breakdown={priceBreakdown}
            />
          </div>
        )}
      </main>

      {isHub && <Footer />}
    </div>
  );
};

export default CustomStudio;
