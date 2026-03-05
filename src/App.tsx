import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import ProductDetail from "./pages/ProductDetail";
import Create from "./pages/Create";
import Shop from "./pages/Shop";
import NailClub from "./pages/NailClub";
import HowTo from "./pages/HowTo";
import HowToSizing from "./pages/HowToSizing";
import HowToApplication from "./pages/HowToApplication";
import HowToTroubleshooting from "./pages/HowToTroubleshooting";
import HowToRemoval from "./pages/HowToRemoval";
import HowToBridal from "./pages/HowToBridal";
import Contact from "./pages/Contact";
import Favorites from "./pages/Favorites";
import Account from "./pages/Account";
import Auth from "./pages/Auth";
import PerfectFitProfile from "./pages/PerfectFitProfile";
import AccountSettings from "./pages/AccountSettings";
import Addresses from "./pages/Addresses";
import OrderHistory from "./pages/OrderHistory";
import PaymentMethods from "./pages/PaymentMethods";
import Cart from "./pages/Cart";
import NotFound from "./pages/NotFound";
import EmailPopup from "./components/EmailPopup";
import FaqChatbot from "./components/FaqChatbot";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import { useAuthStore } from "./stores/authStore";

const queryClient = new QueryClient();

function FaqChatbotConditional() {
  const { pathname } = useLocation();
  if (pathname === '/create') return null;
  return <FaqChatbot />;
}

// Auth initializer component
const AuthInitializer = ({ children }: { children: React.ReactNode }) => {
  const { initialize, initialized } = useAuthStore();

  useEffect(() => {
    if (!initialized) {
      initialize();
    }
  }, [initialize, initialized]);

  return <>{children}</>;
};

// Layout with footer for all main site pages
const MainLayout = () => (
  <>
    <Outlet />
    <Footer />
  </>
);

const App = () => (
  <div className="overflow-x-hidden w-full max-w-full">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthInitializer>
          <Toaster />
          <Sonner />
          <EmailPopup />
          <BrowserRouter>
            <FaqChatbotConditional />
            <ScrollToTop />
            <Routes>
              {/* Standalone route — no nav/footer */}
              <Route path="/create" element={<Create />} />

              {/* Main site routes with footer */}
              <Route element={<MainLayout />}>
                <Route path="/" element={<Index />} />
                <Route path="/product/:handle" element={<ProductDetail />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/club" element={<NailClub />} />
                <Route path="/how-to" element={<HowTo />} />
                <Route path="/how-to/sizing" element={<HowToSizing />} />
                <Route path="/how-to/application" element={<HowToApplication />} />
                <Route path="/how-to/troubleshooting" element={<HowToTroubleshooting />} />
                <Route path="/how-to/removal" element={<HowToRemoval />} />
                <Route path="/how-to/bridal" element={<HowToBridal />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/account" element={<Account />} />
                <Route path="/account/perfect-fit" element={<PerfectFitProfile />} />
                <Route path="/settings" element={<AccountSettings />} />
                <Route path="/settings/addresses" element={<Addresses />} />
                <Route path="/orders" element={<OrderHistory />} />
                <Route path="/payment" element={<PaymentMethods />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/cart" element={<Cart />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </AuthInitializer>
      </TooltipProvider>
    </QueryClientProvider>
  </div>
);

export default App;
