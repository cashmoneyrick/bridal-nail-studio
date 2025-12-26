import { Crown, Check, Lock, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface MembershipSectionProps {
  memberSince?: string;
}

const nailLoverPerks = [
  "10% off orders $50+",
  "Early access to new releases",
  "Members-only newsletter",
];

const nailObsessedPerks = [
  "20% off everything",
  "Free shipping on all orders",
  "Monthly nail drop",
  "Birthday surprise",
  "Priority support",
];

export const MembershipSection = ({ memberSince }: MembershipSectionProps) => {
  const formattedDate = memberSince 
    ? format(new Date(memberSince), "MMMM yyyy")
    : "Recently";

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-2">
        <Crown className="h-5 w-5 text-primary" />
        <h2 className="font-display text-xl font-semibold">My Membership</h2>
      </div>

      {/* Current Tier Card */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-display text-lg font-semibold">Nail Lover</span>
                <Badge variant="secondary" className="text-xs">Free</Badge>
              </div>
              <Badge className="bg-green-500/10 text-green-600 border-green-500/20 hover:bg-green-500/10">
                Active
              </Badge>
            </div>
            <div className="text-right text-sm text-muted-foreground">
              <p>Member since</p>
              <p className="font-medium text-foreground">{formattedDate}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* My Perks */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium">My Perks</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Active Perks - Nail Lover */}
          <div className="space-y-2">
            {nailLoverPerks.map((perk) => (
              <div key={perk} className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-primary flex-shrink-0" />
                <span>{perk}</span>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="border-t border-border/50 pt-4">
            <p className="text-xs text-muted-foreground mb-3 flex items-center gap-1">
              <Lock className="h-3 w-3" />
              Nail Obsessed perks
            </p>
            {/* Locked Perks - Nail Obsessed */}
            <div className="space-y-2">
              {nailObsessedPerks.map((perk) => (
                <div key={perk} className="flex items-center gap-2 text-sm text-muted-foreground/60">
                  <Lock className="h-3.5 w-3.5 flex-shrink-0" />
                  <span>{perk}</span>
                  <span className="text-xs text-muted-foreground/40 ml-auto">Upgrade to unlock</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upgrade Banner */}
      <Card className="bg-gradient-to-r from-secondary/30 via-primary/10 to-secondary/30 border-primary/20">
        <CardContent className="pt-6 pb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="h-5 w-5 text-primary" />
                <h3 className="font-display font-semibold">Want more perks?</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Unlock 20% off everything, free shipping, monthly nail drops, and more!
              </p>
            </div>
            <Button disabled className="opacity-60 cursor-not-allowed">
              Coming Soon
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MembershipSection;
