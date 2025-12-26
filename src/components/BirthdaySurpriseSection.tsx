import { useState, useEffect } from "react";
import { Gift, Cake, Lock, Loader2, PartyPopper, Bell } from "lucide-react";
import { format, parseISO, differenceInDays, differenceInYears } from "date-fns";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/stores/authStore";
import { supabase } from "@/integrations/supabase/client";
import { ClaimBirthdayModal } from "./ClaimBirthdayModal";
import { logError } from "@/lib/logger";
import { toast } from "sonner";

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
  const currentMonth = new Date().getMonth();

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

  const hasBirthday = !!profile?.birthday;
  const birthdayDate = hasBirthday ? parseISO(profile.birthday!) : null;
  const birthdayMonth = birthdayDate ? birthdayDate.getMonth() : -1;
  const isInBirthdayMonth = birthdayMonth === currentMonth;
  
  const accountCreatedAt = profile?.created_at ? parseISO(profile.created_at) : null;
  const accountAgeDays = accountCreatedAt ? differenceInDays(new Date(), accountCreatedAt) : 0;
  const isAccountOldEnough = accountAgeDays >= 30;
  
  const hasPurchased = (profile as any)?.has_purchased ?? false;
  const hasClaimedThisYear = !!currentClaim;

  const yearsWithUs = accountCreatedAt
    ? differenceInYears(new Date(currentYear, birthdayMonth, 1), accountCreatedAt) + 1
    : 1;

  const getGiftForYear = (years: number) => {
    const cycle = ((years - 1) % 4) + 1;
    switch (cycle) {
      case 1: return { type: "age_discount", requiresAddress: false };
      case 2: return { type: "free_set", requiresAddress: true };
      case 3: return { type: "store_credit", requiresAddress: false };
      case 4: return { type: "loyalty_box", requiresAddress: true };
      default: return { type: "age_discount", requiresAddress: false };
    }
  };

  const userAge = birthdayDate ? differenceInYears(new Date(), birthdayDate) : 0;
  const discountAmount = Math.min(userAge, 40);

  const getGiftDisplayText = () => {
    const gift = getGiftForYear(yearsWithUs);
    switch (gift.type) {
      case "age_discount": return `$${discountAmount} off`;
      case "free_set": return "Free nail set";
      case "store_credit": return "$25 credit";
      case "loyalty_box": return "Loyalty box";
      default: return "Special gift";
    }
  };

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
      <Card className="border-border/40 bg-muted/20 h-full">
        <CardContent className="p-5 flex items-center justify-center h-full min-h-[200px]">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  // State 1: No birthday set - Compact muted design
  if (!hasBirthday) {
    return (
      <Card className="border-border/40 bg-muted/20 h-full">
        <CardContent className="p-5 h-full flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Cake className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium text-sm text-muted-foreground">Birthday Surprise</span>
            </div>
            <Badge variant="outline" className="text-xs border-muted-foreground/30">
              <Lock className="h-3 w-3 mr-1" />
              Locked
            </Badge>
          </div>
          
          <div className="flex-1 flex items-center justify-center py-4">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-muted/50 flex items-center justify-center">
                <Gift className="h-5 w-5 text-muted-foreground/50" />
              </div>
              <p className="text-xs text-muted-foreground max-w-[180px] mx-auto">
                Add your birthday to unlock annual gifts
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // State 2: Already claimed this year
  if (hasClaimedThisYear) {
    return (
      <Card className="border-border/40 bg-muted/20 h-full">
        <CardContent className="p-5 h-full flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Cake className="h-4 w-4 text-primary" />
              <span className="font-medium text-sm">Birthday Surprise</span>
            </div>
            <Badge variant="secondary" className="text-xs">Claimed</Badge>
          </div>
          
          <div className="flex-1 flex items-center justify-center py-4">
            <div className="text-center">
              <PartyPopper className="h-8 w-8 mx-auto mb-2 text-primary" />
              <p className="font-medium text-sm">{currentYear} gift claimed!</p>
              <p className="text-xs text-muted-foreground mt-1">See you next year 🎂</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // State 3: Birthday set but not fully eligible
  if (!isFullyEligible && !testMode) {
    return (
      <Card className="border-border/40 bg-muted/20 h-full">
        <CardContent className="p-5 h-full flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Cake className="h-4 w-4 text-primary" />
              <span className="font-medium text-sm">Birthday Surprise</span>
            </div>
            <Badge variant="outline" className="text-xs border-primary/50 text-primary">
              {format(birthdayDate!, "MMM")}
            </Badge>
          </div>
          
          <div className="flex-1 flex items-center justify-center py-4">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-muted/50 flex items-center justify-center">
                <Gift className="h-5 w-5 text-muted-foreground/50" />
              </div>
              <p className="text-xs text-muted-foreground max-w-[180px] mx-auto">
                Your surprise is waiting... keep shopping to unlock it!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // State 4: Fully eligible - show gift card
  const currentGift = getGiftForYear(yearsWithUs);

  return (
    <>
      <Card className="border-primary/30 bg-gradient-to-br from-primary/10 via-secondary/10 to-card overflow-hidden h-full">
        {testMode && (
          <div className="bg-amber-500/20 text-amber-700 text-xs text-center py-1 font-medium">
            Preview Mode
          </div>
        )}
        <CardContent className="p-5 h-full flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <PartyPopper className="h-4 w-4 text-primary" />
              <span className="font-medium text-sm">Happy Birthday! 🎉</span>
            </div>
            <Badge className="bg-primary text-primary-foreground text-xs">
              Ready
            </Badge>
          </div>
          
          <div className="flex-1 flex items-center justify-center py-4">
            <div className="text-center">
              <Gift className="h-8 w-8 mx-auto mb-2 text-primary" />
              <p className="font-display font-medium text-foreground">
                {getGiftDisplayText()}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Our gift to you!
              </p>
            </div>
          </div>
          
          <Button
            size="sm"
            className="w-full btn-primary mt-auto"
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