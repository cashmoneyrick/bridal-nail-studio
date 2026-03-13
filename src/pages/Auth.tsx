import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { z } from "zod";
import { Eye, EyeOff, Loader2, ArrowLeft, Check, CalendarIcon, Sparkles, Heart, Tag } from "lucide-react";
import { format, differenceInYears } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/authStore";

// Validation schemas
const loginSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address"),
  password: z.string().min(5, "Password must be at least 5 characters"),
});

const signupSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(50),
  lastName: z.string().trim().min(1, "Last name is required").max(50),
  email: z.string().trim().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const benefits = [
  { icon: Sparkles, label: "Save your sizes" },
  { icon: Heart, label: "Track favorites" },
  { icon: Tag, label: "Member discounts" },
];

const Auth = () => {
  const navigate = useNavigate();
  const { login, signup, recoverPassword, isLoading, user, initialized } = useAuthStore();

  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginErrors, setLoginErrors] = useState<Record<string, string>>({});

  // Signup form state
  const [signupFirstName, setSignupFirstName] = useState("");
  const [signupLastName, setSignupLastName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");
  const [signupBirthday, setSignupBirthday] = useState<Date | undefined>(undefined);
  const [signupErrors, setSignupErrors] = useState<Record<string, string>>({});

  // Forgot password state
  const [forgotEmail, setForgotEmail] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    if (initialized && user) {
      navigate("/account");
    }
  }, [user, initialized, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginErrors({});

    const validation = loginSchema.safeParse({ email: loginEmail, password: loginPassword });
    if (!validation.success) {
      const errors: Record<string, string> = {};
      validation.error.errors.forEach((err) => {
        if (err.path[0]) errors[err.path[0] as string] = err.message;
      });
      setLoginErrors(errors);
      return;
    }

    const result = await login(loginEmail, loginPassword);
    if (result.success) {
      toast.success("Welcome back!", { position: "top-center" });
      navigate("/account");
    } else {
      toast.error(result.error || "Login failed", { position: "top-center" });
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupErrors({});

    const validation = signupSchema.safeParse({
      firstName: signupFirstName,
      lastName: signupLastName,
      email: signupEmail,
      password: signupPassword,
      confirmPassword: signupConfirmPassword,
    });

    if (!validation.success) {
      const errors: Record<string, string> = {};
      validation.error.errors.forEach((err) => {
        if (err.path[0]) errors[err.path[0] as string] = err.message;
      });
      setSignupErrors(errors);
      return;
    }

    // Validate birthday if provided (must be 13-60 years old)
    if (signupBirthday) {
      const age = differenceInYears(new Date(), signupBirthday);
      if (age < 13 || age > 60) {
        setSignupErrors({ birthday: "You must be between 13 and 60 years old" });
        return;
      }
    }

    const birthdayStr = signupBirthday ? format(signupBirthday, "yyyy-MM-dd") : undefined;
    const result = await signup(signupEmail, signupPassword, signupFirstName, signupLastName, birthdayStr);
    if (result.success) {
      toast.success("Account created! Welcome to YourPrettySets", { position: "top-center" });
      navigate("/account");
    } else {
      toast.error(result.error || "Signup failed", { position: "top-center" });
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!forgotEmail || !z.string().email().safeParse(forgotEmail).success) {
      toast.error("Please enter a valid email address", { position: "top-center" });
      return;
    }

    const result = await recoverPassword(forgotEmail);
    if (result.success) {
      toast.success("Password reset email sent! Check your inbox.", { position: "top-center" });
      setShowForgotPassword(false);
      setForgotEmail("");
    } else {
      toast.error(result.error || "Failed to send reset email", { position: "top-center" });
    }
  };

  // Show loading while initializing
  if (!initialized) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const inputStyles = "h-12 rounded-xl transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:border-primary bg-background/80 border-foreground/[0.08] text-base placeholder:text-muted-foreground/50";

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Full-bleed atmospheric background */}
      <div className="absolute inset-0 z-0">
        {/* Base warm gradient */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(160deg, hsl(30 6% 97%) 0%, hsl(125 12% 90%) 35%, hsl(30 8% 94%) 65%, hsl(207 30% 92%) 100%)",
          }}
        />
        {/* Soft radial glow */}
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse 70% 50% at 50% 30%, hsla(125 15% 75% / 0.15) 0%, transparent 70%)",
          }}
        />
        {/* Noise texture */}
        <div
          className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />
        {/* Decorative botanical SVG flourish — top right */}
        <svg
          className="absolute -top-20 -right-20 sm:top-0 sm:right-0 w-[320px] h-[320px] sm:w-[420px] sm:h-[420px] opacity-[0.04] pointer-events-none"
          viewBox="0 0 400 400"
          fill="none"
        >
          <path
            d="M300,50 C300,50 340,120 320,200 C300,280 240,320 200,350 C200,350 220,260 200,200 C180,140 120,100 100,80 C100,80 180,60 240,80 C260,86 280,70 300,50 Z"
            fill="currentColor"
            className="text-primary"
          />
          <path
            d="M350,150 C350,150 320,200 280,230 C240,260 200,260 180,250 C180,250 220,220 240,190 C260,160 260,120 250,90 C250,90 300,100 330,130 C340,140 350,150 350,150 Z"
            fill="currentColor"
            className="text-primary"
          />
        </svg>
        {/* Decorative flourish — bottom left */}
        <svg
          className="absolute -bottom-10 -left-10 sm:bottom-10 sm:left-10 w-[250px] h-[250px] sm:w-[300px] sm:h-[300px] opacity-[0.03] pointer-events-none rotate-180"
          viewBox="0 0 400 400"
          fill="none"
        >
          <path
            d="M300,50 C300,50 340,120 320,200 C300,280 240,320 200,350 C200,350 220,260 200,200 C180,140 120,100 100,80 C100,80 180,60 240,80 C260,86 280,70 300,50 Z"
            fill="currentColor"
            className="text-primary"
          />
        </svg>
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-md mx-auto px-5 py-10 sm:py-16">
        {/* Brand header */}
        <div className="animate-stagger-1 text-center mb-8">
          <Link to="/" className="inline-block group">
            <h1 className="font-display text-3xl sm:text-4xl text-foreground tracking-tight">
              YourPrettySets
            </h1>
            <div className="h-px w-12 mx-auto mt-2 bg-primary/30 group-hover:w-20 transition-all duration-500" />
          </Link>
        </div>

        {/* Form card */}
        <div className="animate-stagger-2 rounded-2xl bg-background/60 backdrop-blur-xl border border-foreground/[0.06] shadow-[0_8px_40px_-12px_rgba(0,0,0,0.08)] p-6 sm:p-8">
          {showForgotPassword ? (
            /* Forgot Password Form */
            <div className="space-y-6">
              <div className="text-center space-y-1.5">
                <h2 className="font-display text-2xl text-foreground">Reset Password</h2>
                <p className="text-muted-foreground text-sm">
                  Enter your email and we'll send you a reset link
                </p>
              </div>

              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="forgot-email" className="text-xs font-medium text-foreground/60 uppercase tracking-wider">Email</Label>
                  <Input
                    id="forgot-email"
                    type="email"
                    placeholder="you@example.com"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className={inputStyles}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full btn-primary rounded-xl h-12 text-base font-medium tracking-wide"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </Button>

                <button
                  type="button"
                  className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
                  onClick={() => setShowForgotPassword(false)}
                >
                  Back to Sign In
                </button>
              </form>
            </div>
          ) : (
            /* Main Auth Form */
            <div className="space-y-6">
              {/* Tab heading */}
              <div className="text-center space-y-1">
                <h2 className="font-display text-2xl text-foreground">
                  {activeTab === "login" ? "Welcome Back" : "Join the Family"}
                </h2>
                <p className="text-muted-foreground text-sm">
                  {activeTab === "login"
                    ? "Sign in to your account"
                    : "Create your account in seconds"}
                </p>
              </div>

              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "login" | "signup")}>
                <TabsList className="grid w-full grid-cols-2 mb-5 rounded-xl h-11 bg-foreground/[0.04] border border-foreground/[0.06]">
                  <TabsTrigger value="login" className="rounded-lg text-sm font-medium data-[state=active]:shadow-sm">Sign In</TabsTrigger>
                  <TabsTrigger value="signup" className="rounded-lg text-sm font-medium data-[state=active]:shadow-sm">Create Account</TabsTrigger>
                </TabsList>

                <TabsContent value="login" className="mt-0">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="login-email" className="text-xs font-medium text-foreground/60 uppercase tracking-wider">Email</Label>
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="you@example.com"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className={`${inputStyles} ${loginErrors.email ? 'border-destructive' : ''}`}
                      />
                      {loginErrors.email && (
                        <p className="text-sm text-destructive">{loginErrors.email}</p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="login-password" className="text-xs font-medium text-foreground/60 uppercase tracking-wider">Password</Label>
                        <button
                          type="button"
                          onClick={() => setShowForgotPassword(true)}
                          className="text-xs text-primary/70 hover:text-primary transition-colors"
                        >
                          Forgot password?
                        </button>
                      </div>
                      <div className="relative">
                        <Input
                          id="login-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          className={`${inputStyles} pr-10 ${loginErrors.password ? 'border-destructive' : ''}`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-foreground transition-colors"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {loginErrors.password && (
                        <p className="text-sm text-destructive">{loginErrors.password}</p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      className="w-full btn-primary rounded-xl h-12 text-base font-medium tracking-wide mt-2"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Signing in...
                        </>
                      ) : (
                        "Sign In"
                      )}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup" className="mt-0">
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="signup-first-name" className="text-xs font-medium text-foreground/60 uppercase tracking-wider">First Name</Label>
                        <Input
                          id="signup-first-name"
                          placeholder="Jane"
                          value={signupFirstName}
                          onChange={(e) => setSignupFirstName(e.target.value)}
                          className={`${inputStyles} ${signupErrors.firstName ? 'border-destructive' : ''}`}
                        />
                        {signupErrors.firstName && (
                          <p className="text-xs text-destructive">{signupErrors.firstName}</p>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="signup-last-name" className="text-xs font-medium text-foreground/60 uppercase tracking-wider">Last Name</Label>
                        <Input
                          id="signup-last-name"
                          placeholder="Doe"
                          value={signupLastName}
                          onChange={(e) => setSignupLastName(e.target.value)}
                          className={`${inputStyles} ${signupErrors.lastName ? 'border-destructive' : ''}`}
                        />
                        {signupErrors.lastName && (
                          <p className="text-xs text-destructive">{signupErrors.lastName}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="signup-email" className="text-xs font-medium text-foreground/60 uppercase tracking-wider">Email</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="you@example.com"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        className={`${inputStyles} ${signupErrors.email ? 'border-destructive' : ''}`}
                      />
                      {signupErrors.email && (
                        <p className="text-sm text-destructive">{signupErrors.email}</p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="signup-password" className="text-xs font-medium text-foreground/60 uppercase tracking-wider">Password</Label>
                      <div className="relative">
                        <Input
                          id="signup-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={signupPassword}
                          onChange={(e) => setSignupPassword(e.target.value)}
                          className={`${inputStyles} pr-10 ${signupErrors.password ? 'border-destructive' : ''}`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-foreground transition-colors"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {signupErrors.password && (
                        <p className="text-sm text-destructive">{signupErrors.password}</p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="signup-confirm-password" className="text-xs font-medium text-foreground/60 uppercase tracking-wider">Confirm Password</Label>
                      <Input
                        id="signup-confirm-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={signupConfirmPassword}
                        onChange={(e) => setSignupConfirmPassword(e.target.value)}
                        className={`${inputStyles} ${signupErrors.confirmPassword ? 'border-destructive' : ''}`}
                      />
                      {signupErrors.confirmPassword && (
                        <p className="text-sm text-destructive">{signupErrors.confirmPassword}</p>
                      )}
                    </div>

                    {/* Birthday Field (Optional) */}
                    <div className="space-y-1.5">
                      <Label htmlFor="signup-birthday" className="text-xs font-medium text-foreground/60 uppercase tracking-wider">Birthday <span className="normal-case tracking-normal font-normal">(optional)</span></Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              `w-full justify-start text-left font-normal ${inputStyles}`,
                              !signupBirthday && "text-muted-foreground/50",
                              signupErrors.birthday && "border-destructive"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {signupBirthday ? format(signupBirthday, "MMMM d, yyyy") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={signupBirthday}
                            onSelect={setSignupBirthday}
                            defaultMonth={new Date(new Date().getFullYear() - 25, 0)}
                            fromYear={new Date().getFullYear() - 60}
                            toYear={new Date().getFullYear() - 13}
                            captionLayout="dropdown-buttons"
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <p className="text-xs text-muted-foreground/60">
                        We'll send you a birthday surprise
                      </p>
                      {signupErrors.birthday && (
                        <p className="text-sm text-destructive">{signupErrors.birthday}</p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      className="w-full btn-primary rounded-xl h-12 text-base font-medium tracking-wide mt-2"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Creating account...
                        </>
                      ) : (
                        "Create Account"
                      )}
                    </Button>

                    <p className="text-[11px] text-center text-muted-foreground/50 leading-relaxed">
                      By creating an account, you agree to our Terms of Service and Privacy Policy
                    </p>
                  </form>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>

        {/* Trust signals */}
        <div className="animate-stagger-3 mt-6">
          <div className="flex items-center justify-center gap-5 sm:gap-8">
            {benefits.map((benefit, i) => (
              <span key={i} className="flex items-center gap-1.5 text-[11px] sm:text-xs text-foreground/40">
                <benefit.icon className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-primary/40 shrink-0" />
                {benefit.label}
              </span>
            ))}
          </div>
        </div>

        {/* Continue shopping link */}
        <div className="animate-stagger-4 mt-6 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground/60 hover:text-foreground/80 transition-colors group"
          >
            <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Auth;
