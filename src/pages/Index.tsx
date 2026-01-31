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

// Subtle section gradient overlay - frame.io inspired
// Each section gets a radial glow from a unique direction
const SectionGradient = ({
  position,
  color = "blue",
}: {
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center-left" | "center-right" | "top-center" | "bottom-center";
  color?: "blue" | "purple" | "mixed";
}) => {
  const positionMap = {
    "top-left": "15% 20%",
    "top-right": "85% 20%",
    "bottom-left": "15% 80%",
    "bottom-right": "85% 80%",
    "center-left": "5% 50%",
    "center-right": "95% 50%",
    "top-center": "50% 10%",
    "bottom-center": "50% 90%",
  };

  const colorMap = {
    blue: "rgba(30, 60, 160, 0.12)",
    purple: "rgba(70, 40, 150, 0.10)",
    mixed: "rgba(50, 50, 160, 0.11)",
  };

  const colorOuter = {
    blue: "rgba(25, 50, 130, 0.05)",
    purple: "rgba(55, 35, 120, 0.04)",
    mixed: "rgba(40, 40, 140, 0.045)",
  };

  return (
    <div
      className="absolute pointer-events-none left-0 right-0"
      style={{
        // Bleed 200px beyond section bounds so gradients overlap
        // into adjacent sections, eliminating hard transition lines
        top: "-200px",
        bottom: "-200px",
        background: `
          radial-gradient(ellipse 80% 50% at ${positionMap[position]}, ${colorMap[color]} 0%, ${colorOuter[color]} 40%, transparent 70%)
        `,
      }}
    />
  );
};

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
    <div className="min-h-screen bg-background overflow-x-hidden">
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
          <SectionGradient position="center-left" color="blue" />
          <FeatureSection />
        </section>

        {/* 3D Visualization - Interactive conform data visualization */}
        <section className="py-10 sm:py-20 px-4 sm:px-6 md:px-12 lg:px-20 relative overflow-visible">
          <SectionGradient position="bottom-right" color="mixed" />
          <div className="max-w-7xl mx-auto">
            <Suspense fallback={<SectionLoader />}>
              <Conform3DVisualization />
            </Suspense>
          </div>
        </section>

        {/* Pricing - full viewport on mobile */}
        <section id="pricing" className="py-10 sm:py-20 relative overflow-visible">
          <SectionGradient position="top-right" color="purple" />
          <PricingSection />
        </section>

        {/* FAQ - scrollable content */}
        <section id="faq" className="py-10 sm:py-20 relative overflow-visible">
          <SectionGradient position="center-right" color="blue" />
          <FAQSection />
        </section>

        {/* About */}
        <section
          id="about"
          className="relative overflow-visible py-24 sm:py-32"
        >
          <SectionGradient position="bottom-left" color="mixed" />
          <AboutSection />
          {/* Fade to pure black before footer */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none" />
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
