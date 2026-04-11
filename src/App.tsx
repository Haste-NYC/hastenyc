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
import Cookies from "./pages/Cookies";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import FigmaSchemaPost from "./pages/FigmaSchemaPost";
import EntertainmentShakeupPost from "./pages/EntertainmentShakeupPost";
import VfxStoragePost from "./pages/VfxStoragePost";
import FinalCutProPost from "./pages/FinalCutProPost";
import GoogleFlowPost from "./pages/GoogleFlowPost";
import StyleGuide from "./pages/StyleGuide";
import PremiereRewind from "./pages/PremiereRewind";
import Schedule from "./pages/Schedule";
import Download from "./pages/Download";
import About from "./pages/About";
import LavaLampExperiments from "./pages/LavaLampExperiments";
import HeroMockup from "./pages/HeroMockup";
import OgImagePreview from "./pages/OgImagePreview";

import ConformDocs from "./pages/conform-studio/Docs";
import ConformSupport from "./pages/conform-studio/Support";
import ConformChangelog from "./pages/conform-studio/Changelog";
import ConformDocsEnterprise from "./pages/conform-studio/DocsEnterprise";
import ConformDocsQC from "./pages/conform-studio/DocsQC";
import ConformDocsGettingStarted from "./pages/conform-studio/DocsGettingStarted";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const VisitorBeacon = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    if (sessionStorage.getItem('_vb')) return;
    sessionStorage.setItem('_vb', '1');
    fetch('/api/identify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: pathname }),
    }).catch(() => {});
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
          <VisitorBeacon />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/eula" element={<Eula />} />
            <Route path="/refund" element={<Refund />} />
            <Route path="/cookies" element={<Cookies />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/adobe-max-2025" element={<BlogPost />} />
            <Route path="/blog/figma-schema-2025" element={<FigmaSchemaPost />} />
            <Route path="/blog/entertainment-shakeup" element={<EntertainmentShakeupPost />} />
            <Route path="/blog/global-storage-post" element={<VfxStoragePost />} />
            <Route path="/blog/final-cut-pro" element={<FinalCutProPost />} />
            <Route path="/blog/google-flow-workspace" element={<GoogleFlowPost />} />
            <Route path="/style-guide" element={<StyleGuide />} />
            <Route path="/premiere-rewind" element={<PremiereRewind />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/download" element={<Download />} />
            <Route path="/about" element={<About />} />
            <Route path="/experiments/lava-lamp" element={<LavaLampExperiments />} />
            <Route path="/experiments/hero-mockup" element={<HeroMockup />} />
            <Route path="/og-preview" element={<OgImagePreview />} />

            <Route path="/conform-studio/docs" element={<ConformDocs />} />
            <Route path="/conform-studio/docs/getting-started" element={<ConformDocsGettingStarted />} />
            <Route path="/conform-studio/docs/enterprise" element={<ConformDocsEnterprise />} />
            <Route path="/conform-studio/docs/qc" element={<ConformDocsQC />} />
            <Route path="/conform-studio/docs/qc/*" element={<ConformDocsQC />} />
            <Route path="/conform-studio/support" element={<ConformSupport />} />
            <Route path="/conform-studio/changelog" element={<ConformChangelog />} />
            <Route path="/conform-studio/download" element={<Download />} />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </SmoothScrollProvider>
  </QueryClientProvider>
);

export default App;
