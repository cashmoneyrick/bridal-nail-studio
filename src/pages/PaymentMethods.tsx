import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, CreditCard, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useAuthStore } from "@/stores/authStore";

const PaymentMethods = () => {
  const navigate = useNavigate();
  const { user, initialized } = useAuthStore();

  useEffect(() => {
    if (initialized && !user) {
      navigate("/auth");
    }
  }, [user, initialized, navigate]);

  if (!initialized) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <Link 
          to="/account" 
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Account
        </Link>

        <div className="flex items-center gap-3 mb-2">
          <CreditCard className="h-8 w-8 text-primary" />
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Payment Methods</h1>
        </div>
        <p className="text-muted-foreground mb-8">Manage your saved payment methods</p>

        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-6">
              <CreditCard className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">Secure Payment Storage</h2>
            <p className="text-muted-foreground mb-6 max-w-sm">
              Payment methods are securely saved when you complete checkout. Your saved cards will appear here.
            </p>
            <Button asChild className="btn-primary">
              <Link to="/shop">Continue Shopping</Link>
            </Button>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default PaymentMethods;
