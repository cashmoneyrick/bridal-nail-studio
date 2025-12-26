import { useState, useEffect } from 'react';
import { MapPin, Gift, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/stores/authStore';

interface ClaimDropModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentMonth: string;
  monthName: string;
  onSuccess: () => void;
}

interface ShippingAddress {
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export const ClaimDropModal = ({
  open,
  onOpenChange,
  currentMonth,
  monthName,
  onSuccess,
}: ClaimDropModalProps) => {
  const { user, profile, fetchProfile } = useAuthStore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [address, setAddress] = useState<ShippingAddress>({
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    zip: '',
    country: 'US',
  });

  // Pre-fill address from profile when modal opens
  useEffect(() => {
    if (open && profile) {
      setAddress({
        address_line1: (profile as any).shipping_address_line1 || '',
        address_line2: (profile as any).shipping_address_line2 || '',
        city: (profile as any).shipping_city || '',
        state: (profile as any).shipping_state || '',
        zip: (profile as any).shipping_zip || '',
        country: (profile as any).shipping_country || 'US',
      });
    }
  }, [open, profile]);

  const handleInputChange = (field: keyof ShippingAddress, value: string) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
  };

  const validateAddress = (): boolean => {
    if (!address.address_line1.trim()) {
      toast({ title: 'Address required', description: 'Please enter your street address', variant: 'destructive' });
      return false;
    }
    if (!address.city.trim()) {
      toast({ title: 'City required', description: 'Please enter your city', variant: 'destructive' });
      return false;
    }
    if (!address.state.trim()) {
      toast({ title: 'State required', description: 'Please enter your state', variant: 'destructive' });
      return false;
    }
    if (!address.zip.trim()) {
      toast({ title: 'ZIP code required', description: 'Please enter your ZIP code', variant: 'destructive' });
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!user) return;
    if (!validateAddress()) return;

    setIsSubmitting(true);

    try {
      // 1. Save/update address to profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          shipping_address_line1: address.address_line1.trim(),
          shipping_address_line2: address.address_line2.trim(),
          shipping_city: address.city.trim(),
          shipping_state: address.state.trim(),
          shipping_zip: address.zip.trim(),
          shipping_country: address.country,
        })
        .eq('user_id', user.id);

      if (profileError) {
        throw new Error('Failed to save address');
      }

      // 2. Create drop claim with address snapshot
      const addressSnapshot = {
        address_line1: address.address_line1.trim(),
        address_line2: address.address_line2.trim(),
        city: address.city.trim(),
        state: address.state.trim(),
        zip: address.zip.trim(),
        country: address.country,
      };

      const { error: claimError } = await supabase
        .from('drop_claims')
        .insert({
          user_id: user.id,
          month: currentMonth,
          status: 'claimed',
          address_snapshot: addressSnapshot,
        });

      if (claimError) {
        if (claimError.code === '23505') {
          // Unique violation - already claimed
          toast({
            title: 'Already Claimed',
            description: 'You have already claimed this month\'s drop.',
            variant: 'destructive',
          });
        } else {
          throw new Error('Failed to claim drop');
        }
        return;
      }

      // Refresh profile to get updated address
      await fetchProfile();

      toast({
        title: 'Drop Claimed! 🎉',
        description: `Your ${monthName} Drop will ship by the 15th.`,
      });

      onSuccess();
    } catch (error) {
      console.error('Error claiming drop:', error);
      toast({
        title: 'Something went wrong',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-primary" />
            Claim Your {monthName} Drop
          </DialogTitle>
          <DialogDescription>
            Confirm your shipping address to receive this month's exclusive nail set.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <MapPin className="h-4 w-4" />
            <span>Shipping Address</span>
          </div>

          <div className="space-y-3">
            <div>
              <Label htmlFor="address_line1">Street Address *</Label>
              <Input
                id="address_line1"
                value={address.address_line1}
                onChange={(e) => handleInputChange('address_line1', e.target.value)}
                placeholder="123 Main St"
                maxLength={200}
              />
            </div>

            <div>
              <Label htmlFor="address_line2">Apt, Suite, etc. (optional)</Label>
              <Input
                id="address_line2"
                value={address.address_line2}
                onChange={(e) => handleInputChange('address_line2', e.target.value)}
                placeholder="Apt 4B"
                maxLength={100}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={address.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="New York"
                  maxLength={100}
                />
              </div>
              <div>
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  value={address.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  placeholder="NY"
                  maxLength={50}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="zip">ZIP Code *</Label>
                <Input
                  id="zip"
                  value={address.zip}
                  onChange={(e) => handleInputChange('zip', e.target.value)}
                  placeholder="10001"
                  maxLength={20}
                />
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={address.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  placeholder="US"
                  maxLength={50}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            className="flex-1"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Claiming...
              </>
            ) : (
              <>
                <Gift className="h-4 w-4 mr-2" />
                Confirm & Claim
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
