import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { Eye, EyeOff, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useAuthStore } from "@/stores/authStore";
import { Link } from "react-router-dom";

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

    const result = await signup(signupEmail, signupPassword, signupFirstName, signupLastName);
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

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-md">
          {/* Back link */}
          <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>

          {showForgotPassword ? (
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="font-display text-2xl">Reset Password</CardTitle>
                <CardDescription>
                  Enter your email and we'll send you a reset link
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="forgot-email">Email</Label>
                    <Input
                      id="forgot-email"
                      type="email"
                      placeholder="you@example.com"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="rounded-full"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full btn-primary"
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
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="font-display text-2xl">Welcome</CardTitle>
                <CardDescription>
                  Sign in to your account or create a new one
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "login" | "signup")}>
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="login">Sign In</TabsTrigger>
                    <TabsTrigger value="signup">Create Account</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="login">
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="login-email">Email</Label>
                        <Input
                          id="login-email"
                          type="email"
                          placeholder="you@example.com"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          className={`rounded-full ${loginErrors.email ? 'border-destructive' : ''}`}
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
                            className={`rounded-full pr-10 ${loginErrors.password ? 'border-destructive' : ''}`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
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
                        className="w-full btn-primary"
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
                  
                  <TabsContent value="signup">
                    <form onSubmit={handleSignup} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="signup-first-name">First Name</Label>
                          <Input
                            id="signup-first-name"
                            placeholder="Jane"
                            value={signupFirstName}
                            onChange={(e) => setSignupFirstName(e.target.value)}
                            className={`rounded-full ${signupErrors.firstName ? 'border-destructive' : ''}`}
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
                            className={`rounded-full ${signupErrors.lastName ? 'border-destructive' : ''}`}
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
                          className={`rounded-full ${signupErrors.email ? 'border-destructive' : ''}`}
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
                            className={`rounded-full pr-10 ${signupErrors.password ? 'border-destructive' : ''}`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
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
                          className={`rounded-full ${signupErrors.confirmPassword ? 'border-destructive' : ''}`}
                        />
                        {signupErrors.confirmPassword && (
                          <p className="text-sm text-destructive">{signupErrors.confirmPassword}</p>
                        )}
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full btn-primary"
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
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Auth;
