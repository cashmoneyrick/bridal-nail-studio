import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ProductDetail from "./pages/ProductDetail";
import CustomStudio from "./pages/CustomStudio";
import Shop from "./pages/Shop";
import NailClub from "./pages/NailClub";
import HowTo from "./pages/HowTo";
import Contact from "./pages/Contact";
import Favorites from "./pages/Favorites";
import Account from "./pages/Account";
import Auth from "./pages/Auth";
import PerfectFitProfile from "./pages/PerfectFitProfile";
import NotFound from "./pages/NotFound";
import EmailPopup from "./components/EmailPopup";
import FaqChatbot from "./components/FaqChatbot";
import { useAuthStore } from "./stores/authStore";

const queryClient = new QueryClient();

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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthInitializer>
        <Toaster />
        <Sonner />
        <EmailPopup />
        <FaqChatbot />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/product/:handle" element={<ProductDetail />} />
            <Route path="/custom-studio" element={<CustomStudio />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/club" element={<NailClub />} />
            <Route path="/how-to" element={<HowTo />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/account" element={<Account />} />
            <Route path="/account/perfect-fit" element={<PerfectFitProfile />} />
            <Route path="/auth" element={<Auth />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthInitializer>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
