import { useState } from "react";
import { User, Heart, Package, MapPin, CreditCard, Settings, LogOut, CalendarIcon, Cake, Loader2, Bell, Ruler, ChevronRight, Gift, Check, Cloud } from "lucide-react";
import { format, differenceInYears, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import DiscountCodesSection from "@/components/DiscountCodesSection";
import MembershipSection from "@/components/MembershipSection";
import { MonthlyDropSection } from "@/components/MonthlyDropSection";
import { BirthdaySurpriseSection } from "@/components/BirthdaySurpriseSection";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useFavoritesStore } from "@/stores/favoritesStore";
import { useAuthStore } from "@/stores/authStore";
import { useNailProfilesStore } from "@/stores/nailProfilesStore";
import { useNailProfileSync } from "@/hooks/useNailProfileSync";
import { toast } from "sonner";

const Account = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const testMode = searchParams.get('testMode') === 'true';
  const testBirthday = searchParams.get('testBirthday') === 'true';
  const favoritesCount = useFavoritesStore(state => state.items.length);
  const { user, profile, logout, updateProfile, isLoading } = useAuthStore();
  const { profiles, selectedProfileId, selectProfile, getSelectedProfile, isLoading: profilesLoading } = useNailProfilesStore();
  const { isSynced } = useNailProfileSync();
  const selectedProfile = getSelectedProfile();
  const filledSizesCount = selectedProfile 
    ? Object.values(selectedProfile.sizes).filter(s => s && s.trim() !== '').length 
    : 0;

  const handleProfileChange = async (profileId: string) => {
    await selectProfile(profileId);
    const profile = profiles.find(p => p.id === profileId);
    if (profile) {
      toast.success(`Switched to "${profile.name}"`, { position: "top-center" });
    }
  };
  
  const [birthday, setBirthday] = useState<Date | undefined>(undefined);
  const [birthdayError, setBirthdayError] = useState<string | null>(null);
  const [isSavingBirthday, setIsSavingBirthday] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success("You've been signed out", { position: "top-center" });
    navigate("/");
  };

  const handleSaveBirthday = async () => {
    if (!birthday) return;
    
    setBirthdayError(null);
    const age = differenceInYears(new Date(), birthday);
    
    if (age < 13 || age > 60) {
      setBirthdayError("You must be between 13 and 60 years old");
      return;
    }
    
    setIsSavingBirthday(true);
    const birthdayStr = format(birthday, "yyyy-MM-dd");
    const result = await updateProfile({ birthday: birthdayStr });
    setIsSavingBirthday(false);
    
    if (result.success) {
      toast.success("Birthday saved! You'll receive a special surprise! 🎂", { position: "top-center" });
    } else {
      toast.error(result.error || "Failed to save birthday", { position: "top-center" });
    }
  };

  const quickLinks = [
    { icon: Package, title: "Order History", description: "View past orders", href: "/orders" },
    { icon: MapPin, title: "Addresses", description: "Shipping addresses", href: "/settings/addresses" },
    { icon: Settings, title: "Account Settings", description: "Email & password", href: "/settings" },
    { icon: CreditCard, title: "Payment Methods", description: "Saved cards", href: "/payment" },
    { icon: Heart, title: "My Favorites", description: `${favoritesCount} saved`, href: "/favorites" },
  ];

  const memberSinceDate = profile?.created_at 
    ? format(new Date(profile.created_at), "MMMM yyyy")
    : "Recently";

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          
          {/* ========== HEADER ========== */}
          <div className="mb-10 animate-fade-in">
            <Card className="border-0 bg-gradient-to-r from-primary/5 via-secondary/10 to-primary/5 shadow-sm">
              <CardContent className="py-6">
                {user ? (
                  <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 ring-2 ring-primary/20">
                      <User className="h-8 w-8 text-primary" />
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                      <h1 className="font-display text-2xl sm:text-3xl font-medium text-foreground">
                        {profile?.first_name ? `Hi, ${profile.first_name}!` : 'Welcome Back!'}
                      </h1>
                      <p className="text-muted-foreground text-sm mt-1">{user.email}</p>
                    </div>
                    <div className="text-center sm:text-right text-sm text-muted-foreground">
                      <p>Member since</p>
                      <p className="font-medium text-foreground">{memberSinceDate}</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <h1 className="font-display text-2xl sm:text-3xl font-medium mb-2">My Account</h1>
                    <p className="text-muted-foreground text-sm">Sign in to access your account</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sign In Prompt - Show only when not logged in */}
          {!user && (
            <Card className="mb-10 border-primary/20 bg-primary/5 animate-fade-in">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <h2 className="font-display text-xl font-medium">
                    Sign in to access your account
                  </h2>
                  <p className="text-muted-foreground text-sm max-w-md mx-auto">
                    Create an account or sign in to view your orders, manage your favorites, and save your perfect nail sizes.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                    <Link to="/auth">
                      <Button className="btn-primary px-8">Sign In</Button>
                    </Link>
                    <Link to="/auth?tab=signup">
                      <Button variant="outline" className="px-8">Create Account</Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {user && (
            <>
              {/* ========== TOP PRIORITY ROW ========== */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                {/* Discount Codes */}
                <DiscountCodesSection />
                
                {/* Perfect Fit Profile */}
                <Card className="h-full hover:shadow-md transition-all duration-300 group border-border/50 hover:border-primary/30">
                  <CardContent className="p-6 h-full flex flex-col">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/15 transition-colors">
                        <Ruler className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-display text-lg font-medium mb-1">My Perfect Fit Profile</h3>
                        
                {profilesLoading ? (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Syncing profiles...
                          </div>
                        ) : profiles.length > 0 ? (
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <p className="text-sm text-muted-foreground">
                                {profiles.length} profile{profiles.length !== 1 ? 's' : ''} saved
                              </p>
                              {user && isSynced && (
                                <span className="inline-flex items-center gap-1 text-xs text-primary/70">
                                  <Cloud className="h-3 w-3" />
                                  Synced
                                </span>
                              )}
                            </div>
                            
                            <Select 
                              value={selectedProfileId || ""} 
                              onValueChange={handleProfileChange}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a profile" />
                              </SelectTrigger>
                              <SelectContent>
                                {profiles.map((profile) => (
                                  <SelectItem key={profile.id} value={profile.id}>
                                    <span className="flex items-center gap-2">
                                      {profile.id === selectedProfileId && (
                                        <Check className="h-3 w-3 text-primary" />
                                      )}
                                      {profile.name}
                                    </span>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            
                            {selectedProfile && (
                              <p className="text-xs text-muted-foreground">
                                {filledSizesCount}/10 sizes filled
                              </p>
                            )}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground mb-4">
                            Save your nail sizes for faster checkout and perfect press-ons every time.
                          </p>
                        )}
                      </div>
                    </div>
                    <Link to="/account/perfect-fit" className="mt-auto pt-4">
                      <Button variant="outline" className="w-full group-hover:border-primary/50 group-hover:text-primary transition-colors">
                        {profiles.length > 0 ? 'Manage Profiles' : 'Set Up My Sizes'}
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>

              {/* ========== QUICK ACTIONS GRID ========== */}
              <div className="mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <h2 className="font-display text-lg font-medium mb-4 text-foreground/80">Quick Actions</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  {quickLinks.map((link) => (
                    <Link key={link.title} to={link.href}>
                      <Card className="h-full hover:border-primary/40 hover:shadow-md transition-all duration-300 cursor-pointer group border-border/50">
                        <CardContent className="p-4 text-center">
                          <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-muted group-hover:bg-primary/10 flex items-center justify-center transition-colors">
                            <link.icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                          </div>
                          <p className="font-medium text-sm text-foreground">{link.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{link.description}</p>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>

              {/* ========== MEMBERSHIP SECTION ========== */}
              <div className="mb-8 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <MembershipSection memberSince={profile?.created_at} />
              </div>

              {/* ========== REWARDS & EXTRAS ========== */}
              <div className="mb-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <div className="flex items-center gap-2 mb-4">
                  <Gift className="h-4 w-4 text-muted-foreground" />
                  <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Rewards & Extras</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <MonthlyDropSection testMode={testMode} />
                  <BirthdaySurpriseSection testMode={testBirthday} />
                </div>
              </div>

              {/* Birthday Picker - Show only when logged in and birthday not set */}
              {!profile?.birthday && (
                <Card className="mb-8 border-border/50 animate-fade-in" style={{ animationDelay: '0.5s' }}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-primary/10">
                        <Cake className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-base">Set Your Birthday</CardTitle>
                        <CardDescription className="text-sm">
                          Unlock birthday surprises
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap items-center gap-3">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full sm:w-[200px] justify-start text-left font-normal",
                              !birthday && "text-muted-foreground",
                              birthdayError && "border-destructive"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {birthday ? format(birthday, "MMM d, yyyy") : <span>Pick date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={birthday}
                            onSelect={setBirthday}
                            defaultMonth={new Date(new Date().getFullYear() - 25, 0)}
                            fromYear={new Date().getFullYear() - 60}
                            toYear={new Date().getFullYear() - 13}
                            captionLayout="dropdown-buttons"
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      {birthday && (
                        <Button 
                          onClick={handleSaveBirthday}
                          disabled={isSavingBirthday}
                          size="sm"
                          className="btn-primary"
                        >
                          {isSavingBirthday ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
                        </Button>
                      )}
                    </div>
                    {birthdayError && (
                      <p className="text-sm text-destructive mt-2">{birthdayError}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">Once saved, your birthday can't be changed.</p>
                  </CardContent>
                </Card>
              )}

              {/* Sign Out */}
              <div className="text-center animate-fade-in" style={{ animationDelay: '0.6s' }}>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-muted-foreground hover:text-foreground"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Account;