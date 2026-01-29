import { lazy, Suspense } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import TrustBadgeBar from "@/components/TrustBadgeBar";
import VideoSection from "@/components/VideoSection";
import FeatureSection from "@/components/FeatureSection";
import PricingSection from "@/components/PricingSection";
import FAQSection from "@/components/FAQSection";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

// Only lazy load the heavy Three.js component
const Conform3DVisualization = lazy(() => import("@/components/Conform3DVisualization"));

// Minimal loading placeholder
const SectionLoader = () => (
  <div className="min-h-[200px] flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
  </div>
);

const Index = () => {
  return (
    <div className="min-h-screen bg-background snap-sections overflow-x-hidden">
      <SEO
        title="Haste Conform Studio - Premiere to Resolve"
        description="Instant project migration from Adobe Premiere to Davinci Resolve. Haste Conform Studio uses AI to automate post-production. 300X faster timeline conform for film and TV. Built for studios, secure, and scalable."
        canonical="/"
        video={{
          name: "Haste Conform Studio Demo - Premiere to Resolve Timeline Migration",
          description: "See how Haste Conform Studio instantly migrates your Adobe Premiere timeline to DaVinci Resolve. 300X faster timeline conform for film and TV post-production.",
          thumbnailUrl: "https://www.haste.nyc/og-image.png",
          uploadDate: "2025-01-01",
          contentUrl: "https://vimeo.com/1081347302",
          embedUrl: "https://player.vimeo.com/video/1081347302",
          duration: "PT1M30S",
        }}
      />
      <Header />
      <main>
        {/* Hero - full viewport height on mobile */}
        <section id="hero" className="pt-10 relative snap-section-full">
          <HeroSection />
          {/* Gradient fade to next section */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
        </section>

        {/* Trust Badge Bar - combined with Video for better mobile flow */}
        <div className="snap-section-full relative">
          <TrustBadgeBar />
          <VideoSection />
        </div>

        {/* Features - scrollable content, each feature snaps */}
        <section id="features" className="py-10 sm:py-20 relative">
          <FeatureSection />
        </section>

        {/* 3D Visualization - Interactive conform data visualization */}
        <section className="py-10 sm:py-20 px-4 sm:px-6 md:px-12 lg:px-20">
          <div className="max-w-7xl mx-auto">
            <Suspense fallback={<SectionLoader />}>
              <Conform3DVisualization />
            </Suspense>
          </div>
        </section>

        {/* Pricing - full viewport on mobile */}
        <section id="pricing" className="py-10 sm:py-20 relative snap-section-full">
          <PricingSection />
        </section>

        {/* FAQ - scrollable content */}
        <section id="faq" className="py-10 sm:py-20 relative">
          <FAQSection />
        </section>

        {/* About */}
        <section
          id="about"
          className="relative"
        >
          <AboutSection />
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
