import { useState, useEffect } from "react";
import { Gift, Cake, Lock, Loader2, PartyPopper } from "lucide-react";
import { format, parseISO, differenceInDays, differenceInYears } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/stores/authStore";
import { supabase } from "@/integrations/supabase/client";
import { ClaimBirthdayModal } from "./ClaimBirthdayModal";
import { Link } from "react-router-dom";
import { logError } from "@/lib/logger";

interface BirthdayClaim {
  id: string;
  year: number;
  gift_type: string;
  claimed_at: string;
}

interface BirthdaySurpriseProps {
  testMode?: boolean;
}

export const BirthdaySurpriseSection = ({ testMode = false }: BirthdaySurpriseProps) => {
  const { user, profile } = useAuthStore();
  const [currentClaim, setCurrentClaim] = useState<BirthdayClaim | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showClaimModal, setShowClaimModal] = useState(false);

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth(); // 0-indexed

  useEffect(() => {
    if (user) {
      fetchCurrentClaim();
    } else {
      setIsLoading(false);
    }
  }, [user, currentYear]);

  const fetchCurrentClaim = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("birthday_claims")
        .select("*")
        .eq("user_id", user.id)
        .eq("year", currentYear)
        .maybeSingle();

      if (error) {
        logError("Error fetching birthday claim:", error);
      } else {
        setCurrentClaim(data);
      }
    } catch (error) {
      logError("Error fetching birthday claim:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate eligibility
  const hasBirthday = !!profile?.birthday;
  const birthdayDate = hasBirthday ? parseISO(profile.birthday!) : null;
  const birthdayMonth = birthdayDate ? birthdayDate.getMonth() : -1;
  const isInBirthdayMonth = birthdayMonth === currentMonth;
  
  const accountCreatedAt = profile?.created_at ? parseISO(profile.created_at) : null;
  const accountAgeDays = accountCreatedAt ? differenceInDays(new Date(), accountCreatedAt) : 0;
  const isAccountOldEnough = accountAgeDays >= 30;
  
  // has_purchased flag from profile (we need to cast since TypeScript doesn't know about the new column yet)
  const hasPurchased = (profile as any)?.has_purchased ?? false;
  
  const hasClaimedThisYear = !!currentClaim;

  // Calculate years with us (from account creation to current birthday)
  const yearsWithUs = accountCreatedAt
    ? differenceInYears(new Date(currentYear, birthdayMonth, 1), accountCreatedAt) + 1
    : 1;

  // Gift rotation logic (hidden from user)
  const getGiftForYear = (years: number) => {
    const cycle = ((years - 1) % 4) + 1;
    switch (cycle) {
      case 1:
        return { type: "age_discount", requiresAddress: false };
      case 2:
        return { type: "free_set", requiresAddress: true };
      case 3:
        return { type: "store_credit", requiresAddress: false };
      case 4:
        return { type: "loyalty_box", requiresAddress: true };
      default:
        return { type: "age_discount", requiresAddress: false };
    }
  };

  // Get user age for discount calculation
  const userAge = birthdayDate ? differenceInYears(new Date(), birthdayDate) : 0;
  const discountAmount = Math.min(userAge, 40); // Cap at $40

  // Get display text for gift (without revealing rotation)
  const getGiftDisplayText = () => {
    const gift = getGiftForYear(yearsWithUs);
    switch (gift.type) {
      case "age_discount":
        return `$${discountAmount} off your next order`;
      case "free_set":
        return "A free nail set";
      case "store_credit":
        return "$25 store credit";
      case "loyalty_box":
        return "An exclusive loyalty box";
      default:
        return "A special gift";
    }
  };

  // Full eligibility (all must be true)
  const isFullyEligible = testMode || (
    hasBirthday &&
    isAccountOldEnough &&
    hasPurchased &&
    isInBirthdayMonth &&
    !hasClaimedThisYear
  );

  const handleClaimSuccess = () => {
    fetchCurrentClaim();
    setShowClaimModal(false);
  };

  if (!user) return null;

  if (isLoading) {
    return (
      <Card className="border-border/50">
        <CardContent className="py-8 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  // State 1: No birthday set
  if (!hasBirthday) {
    return (
      <Card className="border-border/50 bg-gradient-to-br from-card to-muted/30">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Cake className="h-5 w-5 text-primary" />
              Birthday Surprise
            </CardTitle>
            <Badge variant="outline" className="text-xs border-muted-foreground/30">
              <Lock className="h-3 w-3 mr-1" />
              Locked
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-lg bg-muted/50 text-center">
            <Gift className="h-8 w-8 mx-auto mb-3 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">
              Add your birthday to unlock a special surprise!
            </p>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Set your birthday in your account to receive an annual gift.
          </p>
        </CardContent>
      </Card>
    );
  }

  // State 2: Already claimed this year
  if (hasClaimedThisYear) {
    return (
      <Card className="border-border/50 bg-gradient-to-br from-card to-muted/30">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Cake className="h-5 w-5 text-primary" />
              Birthday Surprise
            </CardTitle>
            <Badge variant="secondary" className="text-xs">
              Claimed
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="p-4 rounded-lg bg-muted/50 text-center">
            <PartyPopper className="h-8 w-8 mx-auto mb-3 text-primary" />
            <p className="font-medium text-foreground">
              You've claimed your {currentYear} birthday gift!
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              See you next year 🎂
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // State 3: Birthday set but not fully eligible
  if (!isFullyEligible && !testMode) {
    return (
      <Card className="border-border/50 bg-gradient-to-br from-card to-muted/30">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Cake className="h-5 w-5 text-primary" />
              Birthday Surprise
            </CardTitle>
            <Badge variant="outline" className="text-xs border-primary/50 text-primary">
              {format(birthdayDate!, "MMMM")}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-lg bg-muted/50 text-center">
            <Gift className="h-8 w-8 mx-auto mb-3 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">
              Your birthday surprise is waiting... keep shopping to unlock it!
            </p>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Birthday on {format(birthdayDate!, "MMMM d")}
          </p>
        </CardContent>
      </Card>
    );
  }

  // State 4: Fully eligible - show gift card
  const currentGift = getGiftForYear(yearsWithUs);

  return (
    <>
      <Card className="border-primary/30 bg-gradient-to-br from-primary/10 via-secondary/10 to-card overflow-hidden">
        {testMode && (
          <div className="bg-amber-500/20 text-amber-700 text-xs text-center py-1 font-medium">
            Preview Mode — Testing birthday gift flow
          </div>
        )}
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <PartyPopper className="h-5 w-5 text-primary" />
              Happy Birthday! 🎉
            </CardTitle>
            <Badge className="bg-primary text-primary-foreground text-xs">
              Ready to Claim
            </Badge>
          </div>
          <CardDescription>
            Here's a special gift just for you!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/20 text-center">
            <Gift className="h-10 w-10 mx-auto mb-3 text-primary" />
            <p className="text-lg font-display font-medium text-foreground">
              {getGiftDisplayText()}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Our gift to you for being part of the family
            </p>
          </div>
          <Button
            className="w-full btn-primary"
            onClick={() => setShowClaimModal(true)}
          >
            Claim My Gift
          </Button>
        </CardContent>
      </Card>

      <ClaimBirthdayModal
        open={showClaimModal}
        onOpenChange={setShowClaimModal}
        giftType={currentGift.type}
        requiresAddress={currentGift.requiresAddress}
        yearsWithUs={yearsWithUs}
        discountAmount={discountAmount}
        onSuccess={handleClaimSuccess}
      />
    </>
  );
};
