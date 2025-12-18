import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Save, Hand, Loader2, Check, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useAuthStore } from "@/stores/authStore";
import { updateCustomerNailSizes, type NailSizes } from "@/lib/shopify-auth";

// Finger names for each hand
const LEFT_HAND_FINGERS = ['Pinky', 'Ring', 'Middle', 'Index', 'Thumb'];
const RIGHT_HAND_FINGERS = ['Thumb', 'Index', 'Middle', 'Ring', 'Pinky'];

// Size options 00-10
const SIZE_OPTIONS = ['00', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

const DEFAULT_SIZES: NailSizes = {
  leftPinky: '',
  leftRing: '',
  leftMiddle: '',
  leftIndex: '',
  leftThumb: '',
  rightThumb: '',
  rightIndex: '',
  rightMiddle: '',
  rightRing: '',
  rightPinky: '',
};

const PerfectFitProfile = () => {
  const navigate = useNavigate();
  const { customer, accessToken, refreshCustomer } = useAuthStore();
  const [sizes, setSizes] = useState<NailSizes>(DEFAULT_SIZES);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved sizes from customer metafields
  useEffect(() => {
    if (customer?.nailSizes) {
      setSizes(customer.nailSizes);
    }
    setIsLoading(false);
  }, [customer]);

  const handleSizeChange = (finger: keyof NailSizes, value: string) => {
    setSizes(prev => ({ ...prev, [finger]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!accessToken) {
      toast.error("Please sign in to save your sizes", { position: "top-center" });
      navigate("/auth");
      return;
    }

    setIsSaving(true);
    
    try {
      const result = await updateCustomerNailSizes(accessToken, sizes);
      
      if (result.success) {
        // Refresh customer data to get updated metafields
        await refreshCustomer();
        setHasChanges(false);
        toast.success("Your nail sizes have been saved to your account!", { position: "top-center" });
      } else if (result.customerUserErrors?.length) {
        toast.error(result.customerUserErrors[0].message, { position: "top-center" });
      } else {
        toast.error("Failed to save sizes. Please try again.", { position: "top-center" });
      }
    } catch (error) {
      console.error("Error saving nail sizes:", error);
      toast.error("Failed to save sizes. Please try again.", { position: "top-center" });
    } finally {
      setIsSaving(false);
    }
  };

  const isComplete = Object.values(sizes).every(size => size !== '');
  const filledCount = Object.values(sizes).filter(size => size !== '').length;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          {/* Back link */}
          <Link to="/account" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Account
          </Link>

          {/* Header */}
          <div className="text-center mb-10">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-secondary/50 to-primary/30 flex items-center justify-center mb-4">
              <Hand className="h-8 w-8 text-primary" />
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-medium mb-3">
              My Perfect Fit Profile
            </h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              Save your nail sizes so we can create perfectly fitted press-ons every time you order.
            </p>
            {customer && (
              <p className="text-sm text-primary mt-2">
                Signed in as {customer.email}
              </p>
            )}
          </div>

          {/* Sign in prompt if not logged in */}
          {!customer && (
            <Card className="mb-8 border-primary/20 bg-primary/5">
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                  <div className="p-3 rounded-full bg-primary/10 shrink-0">
                    <LogIn className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium mb-1">Sign in to save your sizes</h3>
                    <p className="text-sm text-muted-foreground">
                      Create an account or sign in to save your nail sizes to your profile. Your nail artist will be able to see your sizes when preparing your order.
                    </p>
                  </div>
                  <Link to="/auth">
                    <Button className="btn-primary">Sign In</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Progress indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">Profile completion</span>
              <span className="font-medium">{filledCount}/10 sizes entered</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-300 rounded-full"
                style={{ width: `${(filledCount / 10) * 100}%` }}
              />
            </div>
          </div>

          {/* Sizing Info Card */}
          <Card className="mb-8 border-primary/20 bg-primary/5">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <div className="p-3 rounded-full bg-primary/10 shrink-0">
                  <svg viewBox="0 0 24 24" className="w-6 h-6 text-primary" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 16v-4M12 8h.01" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium mb-1">How to find your sizes</h3>
                  <p className="text-sm text-muted-foreground">
                    Use our sizing kit to measure each nail. Match your natural nail width to the numbered tips 
                    and record each size below. If you're between sizes, choose the larger size for the most comfortable fit.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Hand Size Inputs */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Left Hand */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="font-display text-xl flex items-center gap-2">
                  <span className="text-2xl">🤚</span>
                  Left Hand
                </CardTitle>
                <CardDescription>Enter sizes from pinky to thumb</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {LEFT_HAND_FINGERS.map((finger) => {
                  const key = `left${finger}` as keyof NailSizes;
                  return (
                    <div key={key} className="flex items-center justify-between gap-4">
                      <Label className="text-sm font-medium min-w-[80px]">
                        {finger}
                      </Label>
                      <Select
                        value={sizes[key]}
                        onValueChange={(value) => handleSizeChange(key, value)}
                      >
                        <SelectTrigger className="w-[120px] rounded-full">
                          <SelectValue placeholder="Size" />
                        </SelectTrigger>
                        <SelectContent>
                          {SIZE_OPTIONS.map(size => (
                            <SelectItem key={size} value={size}>
                              Size {size}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Right Hand */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="font-display text-xl flex items-center gap-2">
                  <span className="text-2xl transform scale-x-[-1]">🤚</span>
                  Right Hand
                </CardTitle>
                <CardDescription>Enter sizes from thumb to pinky</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {RIGHT_HAND_FINGERS.map((finger) => {
                  const key = `right${finger}` as keyof NailSizes;
                  return (
                    <div key={key} className="flex items-center justify-between gap-4">
                      <Label className="text-sm font-medium min-w-[80px]">
                        {finger}
                      </Label>
                      <Select
                        value={sizes[key]}
                        onValueChange={(value) => handleSizeChange(key, value)}
                      >
                        <SelectTrigger className="w-[120px] rounded-full">
                          <SelectValue placeholder="Size" />
                        </SelectTrigger>
                        <SelectContent>
                          {SIZE_OPTIONS.map(size => (
                            <SelectItem key={size} value={size}>
                              Size {size}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Save Button */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-muted/50 rounded-2xl">
            <div>
              {isComplete ? (
                <div className="flex items-center gap-2 text-primary">
                  <Check className="h-5 w-5" />
                  <span className="font-medium">All sizes entered!</span>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Enter all 10 sizes for a complete profile
                </p>
              )}
            </div>
            <Button 
              onClick={handleSave}
              disabled={isSaving || !hasChanges || !customer}
              className="btn-primary min-w-[160px]"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save My Sizes
                </>
              )}
            </Button>
          </div>

          {customer && (
            <p className="text-xs text-center text-muted-foreground mt-4">
              Your sizes will be saved to your Shopify account and visible to our nail artists when you place an order.
            </p>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PerfectFitProfile;