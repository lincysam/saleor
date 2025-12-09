
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Provider } from 'react-redux';
import store from '@/redux/store';
import { Header } from '@/components/Header';
import { CategoryNav } from '@/components/CategoryNav';
import { Footer } from '@/components/Footer';
import { useState } from 'react';
import Home from "./pages/Home";
import ProductList from "./pages/ProductList";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import Auth from "./pages/Auth";
import ConfirmAccount from "./pages/ConfirmAccount";
import ResetPassword from "./pages/ResetPassword";
import Wishlist from "./pages/Wishlist";
import NotFound from "./pages/NotFound";
import AuthInitializer from "./components/AuthInitializer"; // Import the new component

const queryClient = new QueryClient();

const AppContent = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Routes where CategoryNav should be hidden
  const hideCategoryNavRoutes = ["/auth", "/confirm-account", "/reset-password"];
  const shouldShowCategoryNav = !hideCategoryNavRoutes.includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen">
      <Header onMobileMenuToggle={() => setMobileMenuOpen(true)} />

      {shouldShowCategoryNav && (
        <div className="sticky top-0 z-40 bg-background shadow-sm">
          <CategoryNav 
            mobileOpen={mobileMenuOpen} 
            onMobileOpenChange={setMobileMenuOpen}
          />
        </div>
      )}

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/search" element={<ProductList />} />
          <Route path="/category/:categoryId" element={<ProductList />} />
          <Route path="/category/:categoryId/:subcategoryId" element={<ProductList />} />
          <Route path="/category/:categoryId/:subcategoryId/:subSubcategoryId" element={<ProductList />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/confirm-account" element={<ConfirmAccount />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </Provider>
  );
};

export default App;

