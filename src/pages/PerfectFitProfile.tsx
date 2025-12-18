import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Save, Hand, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useAuthStore } from "@/stores/authStore";

// Finger names for each hand
const LEFT_HAND_FINGERS = ['Pinky', 'Ring', 'Middle', 'Index', 'Thumb'];
const RIGHT_HAND_FINGERS = ['Thumb', 'Index', 'Middle', 'Ring', 'Pinky'];

// Size options 00-10
const SIZE_OPTIONS = ['00', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

interface NailSizes {
  leftPinky: string;
  leftRing: string;
  leftMiddle: string;
  leftIndex: string;
  leftThumb: string;
  rightThumb: string;
  rightIndex: string;
  rightMiddle: string;
  rightRing: string;
  rightPinky: string;
}

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
  const { customer } = useAuthStore();
  const [sizes, setSizes] = useState<NailSizes>(DEFAULT_SIZES);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Load saved sizes from localStorage
  useEffect(() => {
    const savedSizes = localStorage.getItem('yourprettysets-nail-sizes');
    if (savedSizes) {
      setSizes(JSON.parse(savedSizes));
    }
  }, []);

  const handleSizeChange = (finger: keyof NailSizes, value: string) => {
    setSizes(prev => ({ ...prev, [finger]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    // Simulate API call - In production, this would save to Shopify Customer Metafields
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Save to localStorage for now
    localStorage.setItem('yourprettysets-nail-sizes', JSON.stringify(sizes));
    
    setIsSaving(false);
    setHasChanges(false);
    toast.success("Your nail sizes have been saved!", { position: "top-center" });
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
                {LEFT_HAND_FINGERS.map((finger, index) => {
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
                {RIGHT_HAND_FINGERS.map((finger, index) => {
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

          {/* Size Reference Chart */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="font-display text-lg">Size Reference Chart</CardTitle>
              <CardDescription>Approximate nail widths for each size</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-12 gap-2 text-center text-xs">
                {SIZE_OPTIONS.map(size => (
                  <div key={size} className="p-2 bg-muted rounded-lg">
                    <div className="font-semibold text-foreground">{size}</div>
                    <div className="text-muted-foreground mt-1">
                      {size === '00' ? '5mm' : 
                       size === '0' ? '6mm' :
                       size === '1' ? '7mm' :
                       size === '2' ? '8mm' :
                       size === '3' ? '9mm' :
                       size === '4' ? '10mm' :
                       size === '5' ? '11mm' :
                       size === '6' ? '12mm' :
                       size === '7' ? '13mm' :
                       size === '8' ? '14mm' :
                       size === '9' ? '15mm' : '16mm'}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

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
              disabled={isSaving || !hasChanges}
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
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PerfectFitProfile;