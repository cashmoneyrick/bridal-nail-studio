import { useState } from "react";
import { User, Heart, Package, MapPin, CreditCard, Settings, LogOut, CalendarIcon, Cake, Loader2 } from "lucide-react";
import { format, differenceInYears, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import DiscountCodesSection from "@/components/DiscountCodesSection";
import MembershipSection from "@/components/MembershipSection";
import { Link, useNavigate } from "react-router-dom";
import { useFavoritesStore } from "@/stores/favoritesStore";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "sonner";

const Account = () => {
  const navigate = useNavigate();
  const favoritesCount = useFavoritesStore(state => state.items.length);
  const { user, profile, logout, updateProfile, isLoading } = useAuthStore();
  
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

  const accountLinks = [
    { 
      icon: Package, 
      title: "Order History", 
      description: "View past orders and track shipments",
      href: "/orders"
    },
    { 
      icon: Heart, 
      title: "My Favorites", 
      description: `${favoritesCount} saved items`,
      href: "/favorites"
    },
    { 
      icon: MapPin, 
      title: "Addresses", 
      description: "Manage shipping addresses",
      href: "/addresses"
    },
    { 
      icon: CreditCard, 
      title: "Payment Methods", 
      description: "Manage saved payment methods",
      href: "/payment"
    },
    { 
      icon: Settings, 
      title: "Account Settings", 
      description: "Update email, password, and preferences",
      href: "/settings"
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <User className="h-10 w-10 text-primary" />
            </div>
            {user ? (
              <>
                <h1 className="font-display text-3xl sm:text-4xl font-medium mb-2">
                  Hi, {profile?.first_name || 'Beautiful'}!
                </h1>
                <p className="text-muted-foreground">
                  {user.email}
                </p>
              </>
            ) : (
              <>
                <h1 className="font-display text-3xl sm:text-4xl font-medium mb-2">
                  My Account
                </h1>
                <p className="text-muted-foreground">
                  Manage your orders, favorites, and account settings
                </p>
              </>
            )}
          </div>

          {/* Sign In Prompt - Show only when not logged in */}
          {!user && (
            <>
              <Card className="mb-8 border-primary/20 bg-primary/5">
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
                        <Button className="btn-primary px-8">
                          Sign In
                        </Button>
                      </Link>
                      <Link to="/auth?tab=signup">
                        <Button variant="outline" className="px-8">
                          Create Account
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Separator className="my-8" />
            </>
          )}

          {/* Membership Section - Show only when logged in */}
          {user && (
            <div className="mb-8">
              <MembershipSection memberSince={profile?.created_at} />
            </div>
          )}

          {/* Quick Links Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {accountLinks.map((link) => (
              <Link key={link.title} to={link.href}>
                <Card className="h-full hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-muted group-hover:bg-primary/10 transition-colors">
                        <link.icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <div>
                        <CardTitle className="text-base font-medium">
                          {link.title}
                        </CardTitle>
                        <CardDescription className="text-sm">
                          {link.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>

          {/* Birthday Section - Show only when logged in */}
          {user && (
            <Card className="mt-8">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Cake className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Birthday Surprise</CardTitle>
                    <CardDescription>
                      Get a special gift during your birthday month
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {profile?.birthday ? (
                  // Birthday is set - show read-only
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">
                        {format(parseISO(profile.birthday), "MMMM d, yyyy")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Your birthday is locked and can't be changed
                      </p>
                    </div>
                  </div>
                ) : (
                  // Birthday not set - show date picker
                  <div className="space-y-4">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full sm:w-[280px] justify-start text-left font-normal",
                            !birthday && "text-muted-foreground",
                            birthdayError && "border-destructive"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {birthday ? format(birthday, "MMMM d, yyyy") : <span>Pick your birthday</span>}
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
                    <p className="text-sm text-muted-foreground">
                      Get a special birthday surprise on us! 🎂
                    </p>
                    {birthdayError && (
                      <p className="text-sm text-destructive">{birthdayError}</p>
                    )}
                    {birthday && (
                      <Button 
                        onClick={handleSaveBirthday}
                        disabled={isSavingBirthday}
                        className="btn-primary"
                      >
                        {isSavingBirthday ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          "Save Birthday"
                        )}
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Discount Codes Section */}
          <div className="mt-8">
            <DiscountCodesSection />
          </div>

          {/* Perfect Fit Profile Card */}
          <Card className="mt-8 overflow-hidden">
            <div className="bg-gradient-to-r from-secondary/30 to-primary/20 p-6">
              <CardHeader className="p-0 pb-4">
                <CardTitle className="font-display text-xl">
                  My Perfect Fit Profile
                </CardTitle>
                <CardDescription>
                  Save your nail sizes for faster checkout
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-sm text-muted-foreground mb-4">
                  Once you know your sizes from our sizing kit, save them here so we can create your perfect press-ons every time.
                </p>
                <Link to="/account/perfect-fit">
                  <Button variant="secondary" className="bg-background hover:bg-background/80">
                    Set Up My Sizes
                  </Button>
                </Link>
              </CardContent>
            </div>
          </Card>

          {/* Sign Out Button - Show only when logged in */}
          {user && (
            <div className="mt-8 text-center">
              <Button 
                variant="ghost" 
                className="text-muted-foreground hover:text-foreground"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Account;