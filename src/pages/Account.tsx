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

      <main className="pt-24 pb-24 sm:pb-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">

          {/* ========== HEADER ========== */}
          <div className="relative mb-16 sm:mb-20 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-12 sm:py-16 overflow-hidden animate-fade-in">
            {/* Gradient mesh background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/15" />
            <div
              className="absolute inset-0"
              style={{
                background: `
                  radial-gradient(ellipse 60% 50% at 20% 80%, hsl(var(--secondary) / 0.15), transparent),
                  radial-gradient(ellipse 50% 50% at 80% 20%, hsl(var(--accent) / 0.12), transparent)
                `,
              }}
            />

            {/* Floating blur orbs */}
            <div className="absolute top-0 right-[10%] w-48 h-48 rounded-full bg-secondary/10 blur-3xl animate-float" />
            <div
              className="absolute bottom-0 left-[15%] w-64 h-64 rounded-full bg-primary/[0.06] blur-3xl animate-float"
              style={{ animationDelay: "1.5s" }}
            />

            {/* Content */}
            <div className="relative z-10 max-w-6xl mx-auto">
              {user ? (
                <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
                  <span className="inline-block px-4 py-1.5 border border-primary/20 rounded-full text-[10px] font-semibold tracking-[0.3em] uppercase text-primary/70 mb-6">
                    My Account
                  </span>

                  <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-medium leading-[1.05] text-foreground">
                    {profile?.first_name ? (
                      <>
                        <span className="text-foreground">Welcome back,</span>
                        <br className="hidden sm:block" />
                        <span className="italic font-light text-primary/70">
                          {' '}{profile.first_name}
                        </span>
                      </>
                    ) : (
                      <>
                        Welcome{' '}
                        <span className="italic font-light text-primary/70">Back</span>
                      </>
                    )}
                  </h1>

                  <div className="mt-6 sm:mt-8">
                    <div className="w-12 h-px bg-primary/30 mx-auto sm:mx-0 mb-4" />
                    <p className="text-muted-foreground text-sm">{user.email}</p>
                    <p className="text-muted-foreground/60 text-xs mt-1">
                      Member since {memberSinceDate}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <span className="inline-block px-4 py-1.5 border border-primary/20 rounded-full text-[10px] font-semibold tracking-[0.3em] uppercase text-primary/70 mb-6">
                    My Account
                  </span>
                  <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-medium">
                    My <span className="italic font-light text-primary/70">Account</span>
                  </h1>
                  <div className="w-12 h-px bg-primary/30 mx-auto mt-6 mb-4" />
                  <p className="text-muted-foreground text-sm">Sign in to access your account</p>
                </div>
              )}
            </div>
          </div>

          {/* Sign In Prompt - Show only when not logged in */}
          {!user && (
            <div className="mb-16 sm:mb-20 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="bg-card rounded-2xl border border-border/40 p-8 sm:p-10 text-center">
                <div className="w-14 h-14 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <User className="h-7 w-7 text-primary" />
                </div>
                <h2 className="font-display text-xl sm:text-2xl font-medium mb-3">
                  Sign in to access your account
                </h2>
                <p className="text-muted-foreground text-sm max-w-md mx-auto leading-relaxed">
                  Create an account or sign in to view your orders, manage your favorites, and save your perfect nail sizes.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-6">
                  <Link to="/auth">
                    <Button className="btn-primary px-8">Sign In</Button>
                  </Link>
                  <Link to="/auth?tab=signup">
                    <Button variant="outline" className="px-8 rounded-full">Create Account</Button>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {user && (
            <>
              {/* ========== TOP PRIORITY ROW ========== */}
              <div className="mb-16 sm:mb-20 animate-fade-in" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
                <div className="flex items-center gap-5 mb-8 sm:mb-10">
                  <div className="flex-1 h-px bg-border/40" />
                  <p className="text-[10px] font-semibold tracking-[0.35em] uppercase text-muted-foreground/50 shrink-0">
                    Your Essentials
                  </p>
                  <div className="flex-1 h-px bg-border/40" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  {/* Discount Codes */}
                  <DiscountCodesSection />

                  {/* Perfect Fit Profile */}
                  <Card className="h-full hover:shadow-md transition-all duration-300 group border-border/40 hover:border-primary/30 rounded-2xl">
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
              </div>

              {/* ========== QUICK ACTIONS GRID ========== */}
              <div className="mb-16 sm:mb-20 animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
                <div className="mb-10 sm:mb-12">
                  <div className="flex items-center gap-5 mb-8">
                    <div className="flex-1 h-px bg-border/40" />
                    <p className="text-[10px] font-semibold tracking-[0.35em] uppercase text-muted-foreground/50 shrink-0">
                      Quick Actions
                    </p>
                    <div className="flex-1 h-px bg-border/40" />
                  </div>
                  <h2 className="font-display text-3xl sm:text-4xl font-medium text-foreground text-center">
                    What would you{' '}
                    <span className="italic font-light text-foreground/60">like to do?</span>
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                  {quickLinks.map((link) => (
                    <Link key={link.title} to={link.href}>
                      <div className="group bg-card rounded-2xl p-6 sm:p-7 border border-border/40 hover:border-primary/30 hover:shadow-md transition-all duration-300 cursor-pointer h-full">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-xl bg-primary/[0.07] group-hover:bg-primary/15 flex items-center justify-center transition-colors duration-300 flex-shrink-0">
                            <link.icon className="h-5 w-5 text-primary/70 group-hover:text-primary transition-colors duration-300" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-display text-base sm:text-lg font-medium text-foreground group-hover:text-primary transition-colors duration-300">
                              {link.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                              {link.description}
                            </p>
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-primary/60 group-hover:translate-x-0.5 transition-all duration-300 flex-shrink-0 mt-1" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* ========== MEMBERSHIP SECTION ========== */}
              <div className="mb-16 sm:mb-20 animate-fade-in" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
                <MembershipSection memberSince={profile?.created_at} />
              </div>

              {/* ========== REWARDS & EXTRAS ========== */}
              <div className="mb-16 sm:mb-20 animate-fade-in" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
                <div className="mb-10 sm:mb-12">
                  <div className="flex items-center gap-5 mb-8">
                    <div className="flex-1 h-px bg-border/40" />
                    <p className="text-[10px] font-semibold tracking-[0.35em] uppercase text-muted-foreground/50 shrink-0">
                      Rewards & Extras
                    </p>
                    <div className="flex-1 h-px bg-border/40" />
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 sm:gap-12">
                    <h2 className="font-display text-3xl sm:text-4xl font-medium leading-[1.05]">
                      <span className="italic font-light text-foreground/60">Your</span>{' '}
                      Perks
                    </h2>
                    <p className="text-muted-foreground text-sm sm:text-right sm:max-w-[240px] sm:pb-1 leading-relaxed">
                      Exclusive rewards just for being you
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                  <MonthlyDropSection testMode={testMode} />
                  <BirthdaySurpriseSection testMode={testBirthday} />
                </div>
              </div>

              {/* Birthday Picker - Show only when logged in and birthday not set */}
              {!profile?.birthday && (
                <div className="mb-16 sm:mb-20 animate-fade-in" style={{ animationDelay: '0.5s', animationFillMode: 'both' }}>
                  <div className="bg-muted/20 rounded-3xl p-6 sm:p-8">
                    <Card className="border-border/40 rounded-2xl shadow-sm">
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 rounded-xl bg-primary/10">
                            <Cake className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="font-display text-lg font-medium">Set Your Birthday</CardTitle>
                            <CardDescription className="text-sm">
                              Unlock birthday surprises and special gifts
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
                  </div>
                </div>
              )}

              {/* Sign Out */}
              <div className="pt-8 sm:pt-12">
                <div className="h-px bg-border/30 mb-8" />
                <div className="text-center">
                  <button
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground/60 hover:text-foreground transition-colors duration-300 group"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-3.5 w-3.5 group-hover:translate-x-[-2px] transition-transform duration-300" />
                    <span className="relative">
                      Sign Out
                      <span className="absolute bottom-0 left-0 w-0 h-px bg-foreground/40 group-hover:w-full transition-all duration-300" />
                    </span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </main>

    </div>
  );
};

export default Account;
