import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import Index from "./pages/Index";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Eula from "./pages/Eula";
import Refund from "./pages/Refund";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import FigmaSchemaPost from "./pages/FigmaSchemaPost";
import EntertainmentShakeupPost from "./pages/EntertainmentShakeupPost";
import VfxStoragePost from "./pages/VfxStoragePost";
import FinalCutProPost from "./pages/FinalCutProPost";
import StyleGuide from "./pages/StyleGuide";
import PremiereRewind from "./pages/PremiereRewind";
import Schedule from "./pages/Schedule";
import Download from "./pages/Download";
import About from "./pages/About";
import LavaLampExperiments from "./pages/LavaLampExperiments";
import HeroMockup from "./pages/HeroMockup";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SmoothScrollProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/eula" element={<Eula />} />
            <Route path="/refund" element={<Refund />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/adobe-max-2025" element={<BlogPost />} />
            <Route path="/blog/figma-schema-2025" element={<FigmaSchemaPost />} />
            <Route path="/blog/entertainment-shakeup" element={<EntertainmentShakeupPost />} />
            <Route path="/blog/global-storage-post" element={<VfxStoragePost />} />
            <Route path="/blog/final-cut-pro" element={<FinalCutProPost />} />
            <Route path="/style-guide" element={<StyleGuide />} />
            <Route path="/premiere-rewind" element={<PremiereRewind />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/download" element={<Download />} />
            <Route path="/about" element={<About />} />
            <Route path="/experiments/lava-lamp" element={<LavaLampExperiments />} />
            <Route path="/experiments/hero-mockup" element={<HeroMockup />} />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </SmoothScrollProvider>
  </QueryClientProvider>
);

export default App;
