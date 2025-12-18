import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Star, ThumbsUp, CheckCircle2, Camera, X } from "lucide-react";
import { toast } from "sonner";

interface Review {
  id: string;
  author: string;
  rating: number;
  title: string;
  content: string;
  date: string;
  verified: boolean;
  helpful: number;
  images?: string[];
}

// Sample reviews for testing
const sampleReviews: Review[] = [
  {
    id: "1",
    author: "Sarah M.",
    rating: 5,
    title: "Absolutely stunning! Better than salon nails",
    content: "I was skeptical about press-ons but these completely changed my mind. The quality is incredible - they look like I just left the salon. Easy to apply with the included instructions and lasted me 12 days with no lifting. Will definitely be ordering more designs!",
    date: "December 12, 2024",
    verified: true,
    helpful: 24,
    images: [],
  },
  {
    id: "2",
    author: "Jessica T.",
    rating: 5,
    title: "Perfect for my wedding!",
    content: "Used these for my bridal shower and got SO many compliments. The sizing kit was a game changer - got the perfect fit on the first try. The attention to detail in the design is beautiful. Already ordered another set for my honeymoon!",
    date: "December 8, 2024",
    verified: true,
    helpful: 18,
  },
  {
    id: "3",
    author: "Amanda K.",
    rating: 4,
    title: "Great quality, minor sizing issue",
    content: "Love the design and quality of these nails! Only giving 4 stars because I had to file down a couple to fit my nail beds, but that's probably just my unique nail shape. The included file made it easy. Customer service was also super helpful when I had questions.",
    date: "December 3, 2024",
    verified: true,
    helpful: 12,
  },
  {
    id: "4",
    author: "Michelle R.",
    rating: 5,
    title: "My new favorite nail brand",
    content: "I've tried so many press-on brands and these are by far the best. The shape options are amazing, the designs are unique, and they actually last. Plus the packaging is so pretty - feels like a luxury experience. Already on my third set!",
    date: "November 28, 2024",
    verified: true,
    helpful: 31,
  },
];

const StarRating = ({ rating, interactive = false, onRate }: { rating: number; interactive?: boolean; onRate?: (rating: number) => void }) => {
  const [hoverRating, setHoverRating] = useState(0);
  
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => onRate?.(star)}
          onMouseEnter={() => interactive && setHoverRating(star)}
          onMouseLeave={() => interactive && setHoverRating(0)}
          className={interactive ? "cursor-pointer" : "cursor-default"}
        >
          <Star
            className={`h-5 w-5 transition-colors ${
              star <= (hoverRating || rating)
                ? "fill-amber-400 text-amber-400"
                : "text-muted-foreground/30"
            }`}
          />
        </button>
      ))}
    </div>
  );
};

const ReviewCard = ({ review }: { review: Review }) => {
  const [helpfulCount, setHelpfulCount] = useState(review.helpful);
  const [hasVoted, setHasVoted] = useState(false);

  const handleHelpful = () => {
    if (!hasVoted) {
      setHelpfulCount(prev => prev + 1);
      setHasVoted(true);
      toast.success("Thanks for your feedback!", { position: "top-center" });
    }
  };

  return (
    <div className="border-b border-border pb-6 last:border-0">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <StarRating rating={review.rating} />
            {review.verified && (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                <CheckCircle2 className="h-3 w-3" />
                Verified Purchase
              </span>
            )}
          </div>
          <h4 className="font-medium text-foreground">{review.title}</h4>
        </div>
      </div>
      
      <p className="text-muted-foreground text-sm leading-relaxed mb-3">
        {review.content}
      </p>

      {review.images && review.images.length > 0 && (
        <div className="flex gap-2 mb-3">
          {review.images.map((img, idx) => (
            <div key={idx} className="w-16 h-16 rounded-lg overflow-hidden bg-muted">
              <img src={img} alt="Review" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      )}
      
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-3 text-muted-foreground">
          <span className="font-medium text-foreground">{review.author}</span>
          <span>•</span>
          <span>{review.date}</span>
        </div>
        <button
          onClick={handleHelpful}
          disabled={hasVoted}
          className={`inline-flex items-center gap-1.5 text-sm transition-colors ${
            hasVoted 
              ? "text-primary" 
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <ThumbsUp className={`h-4 w-4 ${hasVoted ? "fill-primary" : ""}`} />
          Helpful ({helpfulCount})
        </button>
      </div>
    </div>
  );
};

interface ProductReviewsProps {
  productTitle: string;
}

export const ProductReviews = ({ productTitle }: ProductReviewsProps) => {
  const [reviews, setReviews] = useState<Review[]>(sampleReviews);
  const [isWriteDialogOpen, setIsWriteDialogOpen] = useState(false);
  const [newReview, setNewReview] = useState({
    name: "",
    email: "",
    rating: 0,
    title: "",
    content: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  const ratingCounts = [5, 4, 3, 2, 1].map(
    (rating) => reviews.filter((r) => r.rating === rating).length
  );

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newReview.rating === 0) {
      toast.error("Please select a star rating", { position: "top-center" });
      return;
    }
    
    if (!newReview.name.trim() || !newReview.title.trim() || !newReview.content.trim()) {
      toast.error("Please fill in all required fields", { position: "top-center" });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const review: Review = {
      id: Date.now().toString(),
      author: newReview.name,
      rating: newReview.rating,
      title: newReview.title,
      content: newReview.content,
      date: new Date().toLocaleDateString("en-US", { 
        year: "numeric", 
        month: "long", 
        day: "numeric" 
      }),
      verified: false,
      helpful: 0,
    };
    
    setReviews(prev => [review, ...prev]);
    setNewReview({ name: "", email: "", rating: 0, title: "", content: "" });
    setIsWriteDialogOpen(false);
    setIsSubmitting(false);
    
    toast.success("Thank you! Your review has been submitted.", { 
      position: "top-center",
      description: "It may take a moment to appear."
    });
  };

  return (
    <section className="mt-16 lg:mt-24 border-t border-border pt-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-medium mb-2">
            Customer Reviews
          </h2>
          <p className="text-muted-foreground text-sm">
            {reviews.length} reviews for {productTitle}
          </p>
        </div>
        
        <Dialog open={isWriteDialogOpen} onOpenChange={setIsWriteDialogOpen}>
          <DialogTrigger asChild>
            <Button className="btn-primary">
              Write a Review
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-display text-xl">Write a Review</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmitReview} className="space-y-4 pt-4">
              {/* Star Rating */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Overall Rating *</label>
                <StarRating 
                  rating={newReview.rating} 
                  interactive 
                  onRate={(rating) => setNewReview(prev => ({ ...prev, rating }))} 
                />
              </div>

              {/* Name & Email */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Name *</label>
                  <Input
                    placeholder="Your name"
                    value={newReview.name}
                    onChange={(e) => setNewReview(prev => ({ ...prev, name: e.target.value }))}
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={newReview.email}
                    onChange={(e) => setNewReview(prev => ({ ...prev, email: e.target.value }))}
                    className="rounded-xl"
                  />
                  <p className="text-xs text-muted-foreground">Not published</p>
                </div>
              </div>

              {/* Review Title */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Review Title *</label>
                <Input
                  placeholder="Sum up your experience"
                  value={newReview.title}
                  onChange={(e) => setNewReview(prev => ({ ...prev, title: e.target.value }))}
                  className="rounded-xl"
                  maxLength={100}
                />
              </div>

              {/* Review Content */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Your Review *</label>
                <Textarea
                  placeholder="What did you like or dislike? How was the fit and quality?"
                  value={newReview.content}
                  onChange={(e) => setNewReview(prev => ({ ...prev, content: e.target.value }))}
                  className="rounded-xl min-h-[120px]"
                  maxLength={1000}
                />
                <p className="text-xs text-muted-foreground text-right">
                  {newReview.content.length}/1000
                </p>
              </div>

              {/* Photo Upload Placeholder */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Add Photos (optional)</label>
                <button
                  type="button"
                  className="w-full border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary/50 transition-colors"
                  onClick={() => toast.info("Photo upload coming soon!", { position: "top-center" })}
                >
                  <Camera className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <span className="text-sm text-muted-foreground">Click to upload photos</span>
                </button>
              </div>

              {/* Submit */}
              <div className="flex gap-3 pt-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex-1 rounded-full"
                  onClick={() => setIsWriteDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Review"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Rating Summary */}
      <div className="bg-muted/30 rounded-2xl p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Average Rating */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
              <span className="font-display text-5xl font-medium">{averageRating.toFixed(1)}</span>
              <div>
                <StarRating rating={Math.round(averageRating)} />
                <p className="text-sm text-muted-foreground mt-1">Based on {reviews.length} reviews</p>
              </div>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-2 mt-4">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">100% Verified Purchases</span>
            </div>
          </div>

          {/* Rating Breakdown */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating, idx) => (
              <div key={rating} className="flex items-center gap-3">
                <span className="text-sm w-6">{rating}</span>
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-amber-400 rounded-full transition-all"
                    style={{ width: `${(ratingCounts[idx] / reviews.length) * 100}%` }}
                  />
                </div>
                <span className="text-sm text-muted-foreground w-8">{ratingCounts[idx]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="flex flex-wrap items-center justify-center gap-6 mb-8 py-4 border-y border-border">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CheckCircle2 className="h-5 w-5 text-primary" />
          <span>All reviews verified</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
          <span>Honest customer feedback</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <ThumbsUp className="h-5 w-5 text-primary" />
          <span>No incentivized reviews</span>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>

      {/* Load More */}
      {reviews.length > 4 && (
        <div className="text-center mt-8">
          <Button variant="outline" className="rounded-full">
            Load More Reviews
          </Button>
        </div>
      )}
    </section>
  );
};

export default ProductReviews;
