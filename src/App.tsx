
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import ProductList from "./pages/ProductList";
import Auth from "./pages/Auth";
import AdminDashboard from "./pages/AdminDashboard";
import SellerDashboard from "./pages/SellerDashboard";
import UserDashboard from "./pages/UserDashboard";
import BecomeSeller from "./pages/BecomeSeller";
import LegalPages from "./pages/LegalPages";
import FAQ from "./pages/FAQ";
import CGU from "./pages/CGU";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/produits" element={<ProductList />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/seller-dashboard" element={<SellerDashboard />} />
            <Route path="/user-dashboard" element={<UserDashboard />} />
            <Route path="/become-seller" element={<BecomeSeller />} />
            <Route path="/legal" element={<LegalPages />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/cgu" element={<CGU />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
