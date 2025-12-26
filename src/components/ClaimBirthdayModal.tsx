import { useState } from "react";
import { Loader2, Gift, MapPin, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/stores/authStore";
import { useDiscountCodesStore } from "@/stores/discountCodesStore";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ClaimBirthdayModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  giftType: string;
  requiresAddress: boolean;
  yearsWithUs: number;
  discountAmount: number;
  onSuccess: () => void;
}

export const ClaimBirthdayModal = ({
  open,
  onOpenChange,
  giftType,
  requiresAddress,
  yearsWithUs,
  discountAmount,
  onSuccess,
}: ClaimBirthdayModalProps) => {
  const { user, profile } = useAuthStore();
  const { addCode } = useDiscountCodesStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Address form state
  const [address, setAddress] = useState({
    line1: (profile as any)?.shipping_address_line1 || "",
    line2: (profile as any)?.shipping_address_line2 || "",
    city: (profile as any)?.shipping_city || "",
    state: (profile as any)?.shipping_state || "",
    zip: (profile as any)?.shipping_zip || "",
    country: (profile as any)?.shipping_country || "US",
  });

  const currentYear = new Date().getFullYear();

  const getGiftLabel = () => {
    switch (giftType) {
      case "age_discount":
        return `$${discountAmount} off your next order`;
      case "free_set":
        return "Free nail set";
      case "store_credit":
        return "$25 store credit";
      case "loyalty_box":
        return "Exclusive loyalty box";
      default:
        return "Birthday gift";
    }
  };

  const generateDiscountCode = () => {
    const shortId = user?.id.substring(0, 6).toUpperCase() || "BDAY";
    return `BDAY-${shortId}-${currentYear}`;
  };

  const handleClaimDiscount = async () => {
    if (!user) return;
    
    setIsSubmitting(true);
    
    try {
      const discountCode = generateDiscountCode();
      
      // Save to birthday_claims table
      const { error } = await supabase.from("birthday_claims").insert({
        user_id: user.id,
        year: currentYear,
        gift_type: giftType,
        years_with_us: yearsWithUs,
        discount_code: discountCode,
      });

      if (error) {
        console.error("Error saving birthday claim:", error);
        toast.error("Failed to claim gift. Please try again.", { position: "top-center" });
        setIsSubmitting(false);
        return;
      }

      // Add to local discount codes store
      addCode({
        code: discountCode,
        description: getGiftLabel(),
        source: "birthday_surprise",
        receivedAt: new Date().toISOString(),
        used: false,
      });

      setSuccess(true);
      toast.success("Discount added to your account!", { position: "top-center" });
      
      setTimeout(() => {
        onSuccess();
        setSuccess(false);
      }, 2000);
    } catch (error) {
      console.error("Error claiming discount:", error);
      toast.error("Failed to claim gift. Please try again.", { position: "top-center" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClaimPhysical = async () => {
    if (!user) return;
    
    // Validate address
    if (!address.line1 || !address.city || !address.state || !address.zip) {
      toast.error("Please fill in all required address fields", { position: "top-center" });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Save to birthday_claims table with address snapshot
      const { error } = await supabase.from("birthday_claims").insert({
        user_id: user.id,
        year: currentYear,
        gift_type: giftType,
        years_with_us: yearsWithUs,
        address_snapshot: address,
        shipped: false,
      });

      if (error) {
        console.error("Error saving birthday claim:", error);
        toast.error("Failed to claim gift. Please try again.", { position: "top-center" });
        setIsSubmitting(false);
        return;
      }

      setSuccess(true);
      toast.success("Your birthday gift is on the way!", { position: "top-center" });
      
      setTimeout(() => {
        onSuccess();
        setSuccess(false);
      }, 2000);
    } catch (error) {
      console.error("Error claiming physical gift:", error);
      toast.error("Failed to claim gift. Please try again.", { position: "top-center" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <Check className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-display font-medium mb-2">
              {requiresAddress ? "Your gift is on the way!" : "Discount added!"}
            </h3>
            <p className="text-muted-foreground">
              {requiresAddress
                ? "We'll ship your birthday gift to the address you provided."
                : "Check your available discount codes to use it."}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-primary" />
            Claim Your Birthday Gift
          </DialogTitle>
          <DialogDescription>
            {requiresAddress
              ? "Confirm your shipping address to receive your gift."
              : "Your gift will be added to your account."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Gift preview */}
          <div className="p-4 rounded-lg bg-primary/10 border border-primary/20 text-center">
            <p className="font-medium text-foreground">{getGiftLabel()}</p>
          </div>

          {/* Address form for physical gifts */}
          {requiresAddress && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>Shipping Address</span>
              </div>
              
              <div className="space-y-3">
                <div>
                  <Label htmlFor="line1">Address Line 1 *</Label>
                  <Input
                    id="line1"
                    value={address.line1}
                    onChange={(e) => setAddress({ ...address, line1: e.target.value })}
                    placeholder="123 Main St"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="line2">Address Line 2</Label>
                  <Input
                    id="line2"
                    value={address.line2}
                    onChange={(e) => setAddress({ ...address, line2: e.target.value })}
                    placeholder="Apt 4B"
                    className="mt-1"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      placeholder="New York"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      value={address.state}
                      onChange={(e) => setAddress({ ...address, state: e.target.value })}
                      placeholder="NY"
                      className="mt-1"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="zip">ZIP Code *</Label>
                    <Input
                      id="zip"
                      value={address.zip}
                      onChange={(e) => setAddress({ ...address, zip: e.target.value })}
                      placeholder="10001"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={address.country}
                      onChange={(e) => setAddress({ ...address, country: e.target.value })}
                      placeholder="US"
                      className="mt-1"
                      disabled
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          <Button
            className="w-full btn-primary"
            onClick={requiresAddress ? handleClaimPhysical : handleClaimDiscount}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Claiming...
              </>
            ) : requiresAddress ? (
              "Confirm & Claim Gift"
            ) : (
              "Add to My Discounts"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
