import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Gift, Package, CheckCircle, Truck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/stores/authStore';
import { ClaimDropModal } from '@/components/ClaimDropModal';

interface DropClaim {
  id: string;
  month: string;
  status: 'claimed' | 'shipped';
  claimed_at: string;
}

interface MonthlyDropSectionProps {
  testMode?: boolean;
}

export const MonthlyDropSection = ({ testMode = false }: MonthlyDropSectionProps) => {
  const { user, profile } = useAuthStore();
  const [currentClaim, setCurrentClaim] = useState<DropClaim | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showClaimModal, setShowClaimModal] = useState(false);

  // Get current month in format "2025-01"
  const currentMonth = format(new Date(), 'yyyy-MM');
  const monthName = format(new Date(), 'MMMM');

  // For now, tier is always "Nail Lover" - paid tier not connected yet
  // TODO: Replace with actual tier logic when paid subscriptions are connected
  const isNailObsessed = testMode; // Will be true when user has paid tier

  useEffect(() => {
    if (user && isNailObsessed) {
      fetchCurrentClaim();
    } else {
      setIsLoading(false);
    }
  }, [user, currentMonth, isNailObsessed]);

  const fetchCurrentClaim = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('drop_claims')
        .select('*')
        .eq('user_id', user.id)
        .eq('month', currentMonth)
        .maybeSingle();

      if (error) {
        console.error('Error fetching claim:', error);
      } else {
        setCurrentClaim(data as DropClaim | null);
      }
    } catch (error) {
      console.error('Error fetching claim:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClaimSuccess = () => {
    setShowClaimModal(false);
    fetchCurrentClaim();
  };

  // Show locked state for non-paid members
  if (!isNailObsessed) {
    return (
      <Card className="border-border/50 bg-gradient-to-br from-card to-muted/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px] z-10" />
        <CardHeader className="pb-4 relative z-20">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg text-muted-foreground">
              <Package className="h-5 w-5" />
              Monthly Drop
            </CardTitle>
            <Badge variant="outline" className="text-xs border-primary/50 text-primary">
              Nail Obsessed Perk
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 relative z-20">
          <div className="rounded-lg overflow-hidden border border-border/30 opacity-60">
            <div className="h-24 bg-gradient-to-br from-muted/50 via-muted/30 to-muted/20 flex items-center justify-center">
              <Gift className="h-8 w-8 text-muted-foreground/50" />
            </div>
            <div className="p-3 bg-card/50">
              <h3 className="font-medium text-muted-foreground text-sm">{monthName} Drop</h3>
              <p className="text-xs text-muted-foreground/70">
                Exclusive monthly set — 14 press-on tips
              </p>
            </div>
          </div>
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Upgrade to <span className="font-semibold text-primary">Nail Obsessed</span> to unlock monthly drops!
            </p>
            <Button variant="outline" className="w-full border-primary/30 text-primary hover:bg-primary/10" disabled>
              Coming Soon
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusBadge = () => {
    if (!currentClaim) {
      return (
        <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
          <Gift className="h-3 w-3 mr-1" />
          Ready to Claim
        </Badge>
      );
    }

    if (currentClaim.status === 'shipped') {
      return (
        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
          <Truck className="h-3 w-3 mr-1" />
          Shipped
        </Badge>
      );
    }

    return (
      <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
        <CheckCircle className="h-3 w-3 mr-1" />
        Claimed
      </Badge>
    );
  };

  const getActionButton = () => {
    if (!currentClaim) {
      return (
        <Button
          onClick={() => setShowClaimModal(true)}
          className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
        >
          <Gift className="h-4 w-4 mr-2" />
          Claim My Drop
        </Button>
      );
    }

    if (currentClaim.status === 'claimed') {
      return (
        <div className="space-y-2">
          <Button disabled className="w-full opacity-50">
            <CheckCircle className="h-4 w-4 mr-2" />
            Claimed ✓
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            You're all set! Your drop will ship by the 15th.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        <Button disabled className="w-full opacity-50">
          <Truck className="h-4 w-4 mr-2" />
          Shipped 📦
        </Button>
        <p className="text-xs text-muted-foreground text-center">
          Your drop is on its way!
        </p>
      </div>
    );
  };

  return (
    <>
      <Card className="border-primary/20 bg-gradient-to-br from-card to-primary/5">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Package className="h-5 w-5 text-primary" />
              Your Monthly Drop
            </CardTitle>
            {testMode && (
              <Badge variant="outline" className="text-xs border-amber-500/50 text-amber-400">
                Preview Mode
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="animate-pulse space-y-3">
              <div className="h-32 bg-muted rounded-lg" />
              <div className="h-8 bg-muted rounded" />
            </div>
          ) : (
            <>
              {/* Drop Card */}
              <div className="relative rounded-lg overflow-hidden border border-border/50">
                {/* Placeholder Image */}
                <div className="h-32 bg-gradient-to-br from-primary/30 via-primary/10 to-secondary/20 flex items-center justify-center">
                  <div className="text-center">
                    <Gift className="h-10 w-10 text-primary/60 mx-auto mb-2" />
                    <span className="text-sm text-muted-foreground">Surprise Design</span>
                  </div>
                </div>
                
                {/* Drop Info */}
                <div className="p-4 bg-card/80 backdrop-blur-sm">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-foreground">{monthName} Drop</h3>
                      <p className="text-sm text-muted-foreground">
                        This month's exclusive set — 14 press-on tips in a surprise design
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    {getStatusBadge()}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              {getActionButton()}
            </>
          )}
        </CardContent>
      </Card>

      <ClaimDropModal
        open={showClaimModal}
        onOpenChange={setShowClaimModal}
        currentMonth={currentMonth}
        monthName={monthName}
        onSuccess={handleClaimSuccess}
      />
    </>
  );
};
