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

// Continuous page atmosphere - large diffuse gradient blobs
// Wide, tall, low-opacity blobs that create an ambient wash without localized hotspots
const atmosphereBlobs = [
  { top: "-200px",  at: "15% 50%",  color: "80, 130, 255" },
  { top: "1400px",  at: "85% 45%",  color: "120, 80, 220" },
  { top: "3200px",  at: "20% 55%",  color: "70, 110, 245" },
  { top: "5000px",  at: "80% 50%",  color: "90, 100, 240" },
  { top: "6800px",  at: "30% 50%",  color: "80, 120, 255" },
];

const PageAtmosphere = () => (
  <>
    {atmosphereBlobs.map((blob, i) => (
      <div
        key={i}
        className="absolute left-0 right-0 pointer-events-none z-0"
        style={{
          top: blob.top,
          height: "2400px",
          background: `radial-gradient(ellipse 120% 70% at ${blob.at}, rgba(${blob.color}, 0.09) 0%, rgba(${blob.color}, 0.025) 30%, transparent 60%)`,
        }}
      />
    ))}
  </>
);

// Window vignette - subtle darkening around viewport edges
const Vignette = () => (
  <div
    className="fixed inset-0 pointer-events-none z-50"
    style={{
      background: `
        radial-gradient(ellipse 85% 80% at 50% 50%, transparent 50%, rgba(0, 0, 0, 0.35) 100%)
      `,
    }}
  />
);

const Index = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden relative">
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
      {/* Persistent vignette overlay */}
      <Vignette />
      {/* Continuous atmospheric gradients across all sections including footer */}
      <PageAtmosphere />
      <Header />
      <main>
        {/* Hero - full viewport height on mobile */}
        <section id="hero" className="pt-10 relative overflow-visible">
          <HeroSection />
        </section>

        {/* Trust Badge Bar - combined with Video for better mobile flow */}
        <div className="relative overflow-visible">
          <TrustBadgeBar />
          <VideoSection />
        </div>

        {/* Features - scrollable content, each feature snaps */}
        <section id="features" className="py-10 sm:py-20 relative overflow-visible">
          <FeatureSection />
        </section>

        {/* 3D Visualization - Interactive conform data visualization */}
        <section className="py-10 sm:py-20 px-4 sm:px-6 md:px-12 lg:px-20 relative overflow-visible">
          <div className="max-w-7xl mx-auto">
            <Suspense fallback={<SectionLoader />}>
              <Conform3DVisualization />
            </Suspense>
          </div>
        </section>

        {/* Pricing - full viewport on mobile */}
        <section id="pricing" className="py-10 sm:py-20 relative overflow-visible">
          <PricingSection />
        </section>

        {/* FAQ - scrollable content */}
        <section id="faq" className="py-10 sm:py-20 relative overflow-visible">
          <FAQSection />
        </section>

        {/* About */}
        <section
          id="about"
          className="relative overflow-visible py-24 sm:py-32"
        >
          <AboutSection />
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
