import { Crown, Check, Lock, Bell } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { toast } from "sonner";

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
  "Free shipping",
  "Monthly nail drop",
  "Birthday surprise",
  "Priority support",
];

export const MembershipSection = ({ memberSince }: MembershipSectionProps) => {
  const formattedDate = memberSince 
    ? format(new Date(memberSince), "MMMM yyyy")
    : "Recently";

  const handleNotifyMe = () => {
    toast.success("We'll notify you when premium membership launches!", { position: "top-center" });
  };

  return (
    <Card className="border-primary/20 overflow-hidden">
      <CardContent className="p-0">
        {/* Main Content */}
        <div className="p-6">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/10">
                <Crown className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-display text-lg font-semibold">Nail Lover</h2>
                  <Badge variant="secondary" className="text-xs">Free</Badge>
                </div>
                <p className="text-sm text-muted-foreground">Member since {formattedDate}</p>
              </div>
            </div>
            <Badge className="bg-green-500/10 text-green-600 border-green-500/20 hover:bg-green-500/10 w-fit">
              Active
            </Badge>
          </div>

          {/* Perks Grid */}
          <div className="grid sm:grid-cols-2 gap-6">
            {/* Active Perks */}
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">Your Perks</p>
              <div className="space-y-2">
                {nailLoverPerks.map((perk) => (
                  <div key={perk} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary flex-shrink-0" />
                    <span>{perk}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Locked Perks */}
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-1">
                <Lock className="h-3 w-3" />
                Nail Obsessed
              </p>
              <div className="space-y-2">
                {nailObsessedPerks.map((perk) => (
                  <div key={perk} className="flex items-center gap-2 text-sm text-muted-foreground/60">
                    <Lock className="h-3 w-3 flex-shrink-0" />
                    <span>{perk}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Upgrade Banner */}
        <div className="bg-gradient-to-r from-secondary/30 via-primary/10 to-secondary/30 border-t border-primary/10 p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <p className="font-medium text-sm text-foreground">Want 20% off everything + free shipping?</p>
              <p className="text-xs text-muted-foreground">Be the first to know when premium launches.</p>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              className="border-primary/40 text-primary hover:bg-primary/10 gap-2"
              onClick={handleNotifyMe}
            >
              <Bell className="h-4 w-4" />
              Notify Me
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MembershipSection;