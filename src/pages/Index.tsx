import { lazy, Suspense, useRef, useState, useEffect } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import TrustBadgeBar from "@/components/TrustBadgeBar";
import VideoSection from "@/components/VideoSection";
import ImpactStatement from "@/components/features/ImpactStatement";
import HeroFeatures from "@/components/features/HeroFeatures";
import FeatureGrid from "@/components/features/FeatureGrid";
import CLISection from "@/components/features/CLISection";
import PricingSection from "@/components/PricingSection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import LavaLampBackground from "@/components/LavaLampBackground";
import FeatureComparisonChart from "@/components/FeatureComparisonChart";
const Conform3DVisualization = lazy(() => import("@/components/Conform3DVisualization"));
import AppRoadmap from "@/components/AppRoadmap";


// Defers rendering until the wrapper scrolls near the viewport
const LazyOnView = ({ children, rootMargin = "200px" }: { children: React.ReactNode; rootMargin?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.disconnect(); } },
      { rootMargin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);
  return <div ref={ref}>{inView ? children : <div className="min-h-[200px]" />}</div>;
};

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

const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

const Index = () => {
  const heroRef = useRef<HTMLElement>(null);

  // Set --vh to the real visible viewport height (accounts for browser chrome)
  useEffect(() => {
    if (!isMobile) return;
    const setVh = () => {
      document.documentElement.style.setProperty("--vh", `${window.innerHeight}px`);
    };
    setVh();
    window.addEventListener("resize", setVh);
    return () => window.removeEventListener("resize", setVh);
  }, []);

  // On mobile, the outer div becomes an explicit scroll-snap container.
  // On desktop, it's a regular min-h-screen wrapper.
  const containerClass = isMobile
    ? "bg-background relative select-none snap-scroll-container"
    : "min-h-screen bg-background overflow-x-hidden relative select-none overscroll-none";

  return (
    <div className={containerClass}>
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
      {/* Lava lamp background - pauses when hero scrolls out of view */}
      <LavaLampBackground
        className="fixed inset-0 w-full h-full z-0"
        visibilityRef={heroRef}
      />
      {/* Continuous atmospheric gradients across all sections including footer */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <PageAtmosphere />
      </div>
      <Header />
      <main>
        {/* Hero - full viewport height on mobile */}
        <section id="hero" ref={heroRef} className="sm:pt-10 relative overflow-visible snap-section flex flex-col justify-center">
          <HeroSection />
        </section>

        <TrustBadgeBar />

        {/* Video Section */}
        <div className="relative overflow-visible bg-background snap-section-center flex flex-col justify-center">
          <VideoSection />
        </div>

        {/* Impact Statement */}
        <section id="features" className="relative overflow-visible bg-background">
          <div
            className="absolute left-0 right-0 pointer-events-none z-0"
            style={{
              top: "-100px",
              bottom: "-100px",
              background: "radial-gradient(ellipse 120% 90% at 50% 40%, rgba(70, 110, 245, 0.12) 0%, rgba(70, 110, 245, 0.03) 35%, transparent 60%)",
            }}
          />
          <ImpactStatement />
        </section>

        {/* 3D Visualization */}
        <section className="py-10 sm:py-20 px-4 sm:px-6 md:px-12 lg:px-20 relative overflow-visible bg-background snap-section-center flex flex-col justify-center">
          <div
            className="absolute left-0 right-0 pointer-events-none z-0"
            style={{
              top: "0",
              bottom: "0",
              background: "radial-gradient(ellipse 160% 140% at 50% 50%, rgba(70, 110, 245, 0.12) 0%, rgba(70, 110, 245, 0.04) 30%, transparent 55%)",
            }}
          />
          <div className="max-w-7xl mx-auto w-full min-h-[600px]">
            <LazyOnView>
              <Suspense fallback={<div className="h-[600px] flex items-center justify-center"><div className="w-8 h-8 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" /></div>}>
                <Conform3DVisualization />
              </Suspense>
            </LazyOnView>
          </div>
        </section>

        {/* Hero Features - top 3 */}
        <section className="relative overflow-visible bg-background">
          <div
            className="absolute left-0 right-0 pointer-events-none z-0"
            style={{
              top: "0",
              bottom: "0",
              background: "radial-gradient(ellipse 120% 80% at 85% 25%, rgba(120, 80, 220, 0.12) 0%, rgba(120, 80, 220, 0.03) 35%, transparent 60%)",
            }}
          />
          <div
            className="absolute left-0 right-0 pointer-events-none z-0"
            style={{
              top: "0",
              bottom: "0",
              background: "radial-gradient(ellipse 120% 80% at 15% 75%, rgba(60, 100, 255, 0.12) 0%, rgba(60, 100, 255, 0.03) 35%, transparent 60%)",
            }}
          />
          <HeroFeatures />
        </section>

        {/* App Roadmap */}
        <section className="py-10 sm:py-14 relative overflow-visible bg-background">
          <AppRoadmap />
        </section>

        {/* Feature Grid - detailed capabilities */}
        <section className="py-12 md:py-20 relative overflow-visible bg-background">
          <div
            className="absolute left-0 right-0 pointer-events-none z-0"
            style={{
              top: "-80px",
              bottom: "-80px",
              background: "radial-gradient(ellipse 120% 90% at 30% 50%, rgba(80, 120, 255, 0.10) 0%, rgba(80, 120, 255, 0.03) 35%, transparent 60%)",
            }}
          />
          <FeatureGrid />
        </section>

        {/* CLI / Pipeline Integration */}
        <section className="py-12 md:py-20 relative overflow-visible bg-background">
          <div
            className="absolute left-0 right-0 pointer-events-none z-0"
            style={{
              top: "-80px",
              bottom: "-80px",
              background: "radial-gradient(ellipse 120% 90% at 70% 40%, rgba(100, 70, 230, 0.10) 0%, rgba(100, 70, 230, 0.03) 35%, transparent 60%)",
            }}
          />
          <CLISection />
        </section>

        {/* Feature Comparison Chart */}
        <section className="py-10 sm:py-20 relative overflow-visible bg-background snap-section-center flex flex-col justify-center">
          <div
            className="absolute left-0 right-0 pointer-events-none z-0"
            style={{
              top: "0",
              bottom: "0",
              background: "radial-gradient(ellipse 120% 90% at 50% 50%, rgba(70, 110, 245, 0.10) 0%, rgba(70, 110, 245, 0.03) 35%, transparent 60%)",
            }}
          />
          <FeatureComparisonChart />
        </section>

        {/* Pricing - full viewport on mobile */}
        <section id="pricing" className="py-10 sm:py-20 relative overflow-visible bg-background snap-section-center flex flex-col justify-center">
          <div
            className="absolute left-0 right-0 pointer-events-none z-0"
            style={{
              top: "80px",
              bottom: "80px",
              background: "radial-gradient(ellipse 120% 90% at 80% 35%, rgba(90, 100, 240, 0.14) 0%, rgba(90, 100, 240, 0.04) 35%, transparent 60%)",
            }}
          />
          <div
            className="absolute left-0 right-0 pointer-events-none z-0"
            style={{
              top: "80px",
              bottom: "80px",
              background: "radial-gradient(ellipse 120% 90% at 15% 65%, rgba(80, 130, 255, 0.14) 0%, rgba(80, 130, 255, 0.04) 35%, transparent 60%)",
            }}
          />
          <PricingSection />
        </section>

        {/* FAQ - scrollable content */}
        <section id="faq" className="py-10 sm:py-20 relative overflow-visible bg-background snap-section-center flex flex-col justify-center">
          <div
            className="absolute left-0 right-0 pointer-events-none z-0"
            style={{
              top: "80px",
              bottom: "80px",
              background: "radial-gradient(ellipse 120% 90% at 70% 40%, rgba(80, 120, 255, 0.14) 0%, rgba(80, 120, 255, 0.04) 35%, transparent 60%)",
            }}
          />
          <FAQSection />
        </section>

      </main>
      <div className="relative overflow-hidden bg-background snap-section flex flex-col justify-center">
        {/* Blue gradient blob behind footer ASCII logo */}
        <div
          className="absolute left-0 right-0 pointer-events-none z-0"
          style={{
            top: "80px",
            bottom: 0,
            background: "radial-gradient(ellipse 80% 80% at 50% 55%, rgba(30, 120, 255, 0.10) 0%, rgba(59, 130, 246, 0.04) 25%, transparent 55%)",
          }}
        />
        <Footer />
      </div>
    </div>
  );
};

export default Index;
