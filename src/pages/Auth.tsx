import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { z } from "zod";
import { Eye, EyeOff, Loader2, ArrowLeft, Check, CalendarIcon } from "lucide-react";
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
  "Save your nail sizes",
  "Track orders & favorites",
  "Exclusive member discounts",
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

  const inputStyles = "rounded-xl transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:border-primary bg-background";

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Panel - Hidden on mobile */}
      <div className="hidden lg:flex lg:w-[40%] relative overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: `url('https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&q=80')` 
          }}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/60 to-primary/30" />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-end p-10 text-primary-foreground">
          {/* Testimonial */}
          <blockquote className="font-display text-2xl xl:text-3xl leading-relaxed mb-8">
            "Join 10,000+ happy customers who found their perfect set"
          </blockquote>
          
          {/* Benefits */}
          <ul className="space-y-3">
            {benefits.map((benefit, index) => (
              <li key={index} className="flex items-center gap-3 text-primary-foreground/90">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                  <Check className="h-3 w-3" />
                </div>
                <span className="text-sm font-medium">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 lg:w-[60%] flex flex-col">
        {/* Mobile Decorative Header */}
        <div className="lg:hidden h-24 bg-gradient-to-b from-primary/15 via-primary/5 to-transparent" />
        
        {/* Centered Form Container */}
        <div className="flex-1 flex items-center justify-center px-6 py-8 lg:py-12">
          <div className="w-full max-w-md">
            {/* Brand Logo */}
            <Link to="/" className="block text-center mb-8">
              <h1 className="font-display text-3xl lg:text-4xl text-foreground">
                YourPrettySets
              </h1>
              <p className="text-muted-foreground text-sm mt-1">Premium Press-On Nails</p>
            </Link>

            {showForgotPassword ? (
              /* Forgot Password Form */
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="font-display text-2xl text-foreground">Reset Password</h2>
                  <p className="text-muted-foreground text-sm">
                    Enter your email and we'll send you a reset link
                  </p>
                </div>
                
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="forgot-email">Email</Label>
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
                    className="w-full btn-primary rounded-xl h-11"
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
                  
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full"
                    onClick={() => setShowForgotPassword(false)}
                  >
                    Back to Login
                  </Button>
                </form>
              </div>
            ) : (
              /* Main Auth Form */
              <div className="space-y-6">
                <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "login" | "signup")}>
                  <TabsList className="grid w-full grid-cols-2 mb-6 rounded-xl h-11">
                    <TabsTrigger value="login" className="rounded-lg">Sign In</TabsTrigger>
                    <TabsTrigger value="signup" className="rounded-lg">Create Account</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="login" className="mt-0">
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="login-email">Email</Label>
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
                      
                      <div className="space-y-2">
                        <Label htmlFor="login-password">Password</Label>
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
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                        {loginErrors.password && (
                          <p className="text-sm text-destructive">{loginErrors.password}</p>
                        )}
                      </div>
                      
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => setShowForgotPassword(true)}
                          className="text-sm text-primary hover:underline"
                        >
                          Forgot password?
                        </button>
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full btn-primary rounded-xl h-11"
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
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="signup-first-name">First Name</Label>
                          <Input
                            id="signup-first-name"
                            placeholder="Jane"
                            value={signupFirstName}
                            onChange={(e) => setSignupFirstName(e.target.value)}
                            className={`${inputStyles} ${signupErrors.firstName ? 'border-destructive' : ''}`}
                          />
                          {signupErrors.firstName && (
                            <p className="text-sm text-destructive">{signupErrors.firstName}</p>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="signup-last-name">Last Name</Label>
                          <Input
                            id="signup-last-name"
                            placeholder="Doe"
                            value={signupLastName}
                            onChange={(e) => setSignupLastName(e.target.value)}
                            className={`${inputStyles} ${signupErrors.lastName ? 'border-destructive' : ''}`}
                          />
                          {signupErrors.lastName && (
                            <p className="text-sm text-destructive">{signupErrors.lastName}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="signup-email">Email</Label>
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
                      
                      <div className="space-y-2">
                        <Label htmlFor="signup-password">Password</Label>
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
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                        {signupErrors.password && (
                          <p className="text-sm text-destructive">{signupErrors.password}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="signup-confirm-password">Confirm Password</Label>
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
                      <div className="space-y-2">
                        <Label htmlFor="signup-birthday">Birthday (Optional)</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                `w-full justify-start text-left font-normal ${inputStyles}`,
                                !signupBirthday && "text-muted-foreground",
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
                        <p className="text-xs text-muted-foreground">
                          Get a special birthday surprise on us! 🎂
                        </p>
                        {signupErrors.birthday && (
                          <p className="text-sm text-destructive">{signupErrors.birthday}</p>
                        )}
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full btn-primary rounded-xl h-11"
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
                      
                      <p className="text-xs text-center text-muted-foreground">
                        By creating an account, you agree to our Terms of Service and Privacy Policy
                      </p>
                    </form>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </div>
        </div>
        
        {/* Back to Home Link */}
        <div className="p-6">
          <Link 
            to="/" 
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Auth;
