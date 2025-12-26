import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Gift, Package, CheckCircle, Truck, Bell } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/stores/authStore';
import { ClaimDropModal } from '@/components/ClaimDropModal';
import { logError } from '@/lib/logger';
import { toast } from 'sonner';

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

  const currentMonth = format(new Date(), 'yyyy-MM');
  const monthName = format(new Date(), 'MMMM');

  const isNailObsessed = testMode;

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
        logError('Error fetching claim:', error);
      } else {
        setCurrentClaim(data as DropClaim | null);
      }
    } catch (error) {
      logError('Error fetching claim:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClaimSuccess = () => {
    setShowClaimModal(false);
    fetchCurrentClaim();
  };

  const handleNotifyMe = () => {
    toast.success("We'll notify you when premium membership launches!", { position: "top-center" });
  };

  // Locked state for non-paid members - compact/muted design
  if (!isNailObsessed) {
    return (
      <Card className="border-border/40 bg-muted/20 relative overflow-hidden h-full">
        <div className="absolute inset-0 bg-background/40 backdrop-blur-[1px] z-10" />
        <CardContent className="p-5 relative z-20 h-full flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium text-sm text-muted-foreground">Monthly Drop</span>
            </div>
            <Badge variant="outline" className="text-xs border-primary/40 text-primary/80">
              Premium
            </Badge>
          </div>
          
          <div className="flex-1 flex items-center justify-center py-4">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-muted/50 flex items-center justify-center">
                <Gift className="h-5 w-5 text-muted-foreground/50" />
              </div>
              <p className="text-xs text-muted-foreground max-w-[180px] mx-auto">
                Exclusive monthly nail sets for premium members
              </p>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            size="sm"
            className="w-full border-primary/30 text-primary/80 hover:bg-primary/10 gap-2 mt-auto"
            onClick={handleNotifyMe}
          >
            <Bell className="h-3.5 w-3.5" />
            Notify Me
          </Button>
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
          size="sm"
          className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
        >
          <Gift className="h-4 w-4 mr-2" />
          Claim My Drop
        </Button>
      );
    }

    if (currentClaim.status === 'claimed') {
      return (
        <div className="space-y-1">
          <Button disabled size="sm" className="w-full opacity-50">
            <CheckCircle className="h-4 w-4 mr-2" />
            Claimed ✓
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            Ships by the 15th
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-1">
        <Button disabled size="sm" className="w-full opacity-50">
          <Truck className="h-4 w-4 mr-2" />
          Shipped 📦
        </Button>
        <p className="text-xs text-muted-foreground text-center">
          On its way!
        </p>
      </div>
    );
  };

  return (
    <>
      <Card className="border-primary/20 bg-gradient-to-br from-card to-primary/5 h-full">
        <CardContent className="p-5 h-full flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-primary" />
              <span className="font-medium text-sm">Your Monthly Drop</span>
            </div>
            {testMode && (
              <Badge variant="outline" className="text-xs border-amber-500/50 text-amber-400">
                Preview
              </Badge>
            )}
          </div>

          {isLoading ? (
            <div className="animate-pulse flex-1 space-y-3">
              <div className="h-20 bg-muted rounded-lg" />
              <div className="h-8 bg-muted rounded" />
            </div>
          ) : (
            <div className="flex-1 flex flex-col">
              {/* Drop Card - Compact */}
              <div className="flex-1 rounded-lg overflow-hidden border border-border/50 mb-3">
                <div className="h-16 bg-gradient-to-br from-primary/20 via-primary/10 to-secondary/20 flex items-center justify-center">
                  <Gift className="h-6 w-6 text-primary/60" />
                </div>
                <div className="p-3 bg-card/80">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-sm">{monthName} Drop</h3>
                      <p className="text-xs text-muted-foreground">14 press-on tips</p>
                    </div>
                    {getStatusBadge()}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-auto">
                {getActionButton()}
              </div>
            </div>
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