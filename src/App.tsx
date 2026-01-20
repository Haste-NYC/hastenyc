import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Product pages (Conform Studio - main haste.nyc site)
import ProductHome from "./pages/product/ProductHome";
import Privacy from "./pages/product/Privacy";
import Terms from "./pages/product/Terms";
import Refund from "./pages/product/Refund";

// Studio pages (Portfolio - formerly haste.studio)
import StudioHome from "./pages/studio/StudioHome";
import Work from "./pages/studio/Work";
import Press from "./pages/studio/Press";
import Talent from "./pages/studio/Talent";
import Inquire from "./pages/studio/Inquire";

// Blog pages (formerly blog.haste.nyc)
import BlogIndex from "./pages/blog/BlogIndex";
import BlogPost from "./pages/blog/BlogPost";
import FigmaSchemaPost from "./pages/blog/FigmaSchemaPost";

// Auth pages
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Checkout from "./pages/Checkout";
import CheckoutSuccess from "./pages/CheckoutSuccess";
import { ProtectedRoute } from "./components/ProtectedRoute";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Product pages - Main haste.nyc site */}
          <Route path="/" element={<ProductHome />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/refund" element={<Refund />} />

          {/* Studio pages - Portfolio (formerly haste.studio) */}
          <Route path="/studio" element={<StudioHome />} />
          <Route path="/studio/work" element={<Work />} />
          <Route path="/studio/press" element={<Press />} />
          <Route path="/studio/talent" element={<Talent />} />
          <Route path="/studio/inquire" element={<Inquire />} />

          {/* Blog pages (formerly blog.haste.nyc) */}
          <Route path="/blog" element={<BlogIndex />} />
          <Route path="/blog/adobe-max-2025" element={<BlogPost />} />
          <Route path="/blog/figma-schema-2025" element={<FigmaSchemaPost />} />

          {/* Auth pages */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/checkout/success" element={<CheckoutSuccess />} />

          {/* 404 - Catch all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
