import { lazy, Suspense, useRef, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import TrustBadgeBar from "@/components/TrustBadgeBar";
import VideoSection from "@/components/VideoSection";
const UIShowcase = lazy(() => import("@/components/UIShowcase"));
import ImpactStatement from "@/components/features/ImpactStatement";
import { motion, useScroll, useTransform } from "framer-motion";
import HeroFeatures from "@/components/features/HeroFeatures";
import FeatureGrid from "@/components/features/FeatureGrid";
import CLISection from "@/components/features/CLISection";
import PricingSection from "@/components/PricingSection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Helmet } from "react-helmet-async";
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

// Mobile: text with play button at bottom, video launches fullscreen
function MobileTextWithVideo() {
  const [showVideo, setShowVideo] = useState(false);

  const handlePlay = () => {
    setShowVideo(true);
  };

  const words = [
    { text: "Stop", dim: false },
    { text: "rebuilding", dim: false },
    { text: "timelines.", dim: false },
    { text: "Start", dim: false },
    { text: "finishing.", dim: false },
    { text: "Let", dim: true },
    { text: "us", dim: true },
    { text: "handle", dim: true },
    { text: "the", dim: true },
    { text: "hard", dim: true },
    { text: "work", dim: true },
    { text: "for", dim: true },
    { text: "you.", dim: true },
    { text: "Project", dim: false },
    { text: "migration", dim: false },
    { text: "done", dim: false },
    { text: "in", dim: false },
    { text: "minutes,", dim: false },
    { text: "not", dim: false },
    { text: "days.", dim: false },
  ];

  return (
    <div className="flex flex-col bg-background">

      <div className="snap-section flex flex-col justify-between px-5">
        <div className="flex-1" />
        <div>
          <h2
            className="font-black tracking-tight leading-[1.1] uppercase flex flex-wrap gap-x-[0.22em]"
            style={{ fontSize: "clamp(34px, 10vw, 54px)", letterSpacing: "-0.03em" }}
          >
            {words.map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: word.dim ? 0.4 : 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.25, delay: i * 0.08 }}
                style={{ display: "inline-block" }}
              >
                {word.text}
              </motion.span>
            ))}
          </h2>
        </div>
        <div className="flex-1" />

        {/* Play button at bottom */}
        <motion.div
          className="flex flex-col items-center gap-3 pb-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 1.5 }}
        >
          <span className="text-[10px] uppercase tracking-[0.2em] text-white/30">
            See it in action
          </span>
          <button
            onClick={handlePlay}
            className="flex items-center gap-2.5 px-6 py-3 rounded-full border border-white/20 hover:border-white/40 transition-colors"
          >
            <svg className="w-4 h-4 text-white/70" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
            <span className="text-sm text-white/70 font-medium tracking-wide">Play Video</span>
          </button>
        </motion.div>
      </div>

      {/* Fullscreen video overlay */}
      {showVideo && (
        <motion.div
          className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <button
            onClick={() => setShowVideo(false)}
            className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/10"
          >
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          <div className="w-full px-2" style={{ padding: "56.25% 0 0 0", position: "relative" }}>
            <iframe
              src="https://player.vimeo.com/video/1081347302?autoplay=1&badge=0&autopause=0&player_id=0&app_id=58479"
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
              title="CONFORMSTUDIO-WEBSITE-R1"
            />
          </div>
        </motion.div>
      )}
    </div>
  );
}

// Single word component that can safely use hooks
function RevealWord({ word, dim, index, total, progress }: {
  word: string; dim: boolean; index: number; total: number;
  progress: import("framer-motion").MotionValue<number>;
}) {
  const opacity = useTransform(
    progress,
    [index / total, (index + 1) / total],
    [0, dim ? 0.4 : 1]
  );
  return <motion.span style={{ opacity, display: "inline-block" }}>{word}</motion.span>;
}

const impactWords = [
  "Stop", "rebuilding", "timelines.", "Start", "finishing.",
  "Let", "us", "handle", "the", "hard", "work", "for", "you.",
  "Project", "migration", "done", "in", "minutes,", "not", "days.",
];

// Desktop: Standalone video section after hero
function DesktopVideoSection() {
  return (
    <section className="relative bg-background">
      <div className="text-center mb-8 pt-16">
        <span className="text-[10px] uppercase tracking-[0.3em] text-white/30">
          [ See it in action ]
        </span>
      </div>
      <div style={{ padding: "56.25% 0 0 0", position: "relative" }}>
        <iframe
          src="https://player.vimeo.com/video/1081347302?badge=0&autopause=0&player_id=0&app_id=58479"
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture"
          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
          title="CONFORMSTUDIO-WEBSITE-R1"
        />
      </div>
    </section>
  );
}

// Desktop: UIShowcase with impact text overlay, pinned with scroll-driven word reveal
function DesktopShowcaseWithImpactText() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const wordProgress = useTransform(scrollYProgress, [0.05, 0.80], [0, 1]);

  return (
    <div ref={sectionRef} className="relative" style={{ height: "300vh" }}>
      <div className="sticky top-0 h-screen overflow-hidden bg-background">
        {/* UIShowcase as background */}
        <div className="absolute inset-0 z-0">
          <Suspense fallback={<div className="w-full h-full" />}>
            <UIShowcase />
          </Suspense>
        </div>

        {/* Dark overlay for text readability */}
        <div
          className="absolute inset-0 z-[1] pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 120% 90% at 50% 40%, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.3) 50%, transparent 80%)",
          }}
        />

        {/* Impact text overlay */}
        <div
          className="absolute inset-0 z-[2] flex items-center"
          style={{ pointerEvents: "none" }}
        >
          <div className="px-4 sm:px-6 md:px-12 lg:px-20 text-left w-full">
            <h2
              className="font-black tracking-tight leading-[1.05] uppercase"
              style={{ fontSize: "clamp(28px, 6vw, 64px)", letterSpacing: "-0.03em" }}
            >
              <span className="flex flex-wrap gap-x-[0.28em]">
                {impactWords.map((word, i) => (
                  <RevealWord
                    key={i}
                    word={word}
                    dim={i >= 5 && i < 13}
                    index={i}
                    total={impactWords.length}
                    progress={wordProgress}
                  />
                ))}
              </span>
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}

const Index = () => {
  const heroRef = useRef<HTMLElement>(null);
  const location = useLocation();

  // Scroll to hash section when arriving from another page (e.g. /#features)
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.slice(1);
      // Small delay to let the page render before scrolling
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [location.hash]);

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
    : "min-h-screen bg-background relative select-none overscroll-none";

  return (
    <div className={containerClass}>
      <SEO
        title="Conform Studio"
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
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Haste Conform Studio",
            "applicationCategory": "MultimediaApplication",
            "operatingSystem": "macOS 14.0+",
            "url": "https://www.haste.nyc",
            "description": "AI-powered project migration from Adobe Premiere to DaVinci Resolve. 300X faster timeline conform for film and TV post-production.",
            "offers": [
              {
                "@type": "Offer",
                "name": "Freelancer",
                "price": "59",
                "priceCurrency": "USD",
                "priceValidUntil": "2027-12-31",
                "availability": "https://schema.org/InStock",
                "description": "For individuals. 1 user seat, email support, 7-day free trial."
              },
              {
                "@type": "Offer",
                "name": "Team",
                "price": "249",
                "priceCurrency": "USD",
                "priceValidUntil": "2027-12-31",
                "availability": "https://schema.org/InStock",
                "description": "For small teams. 4 user seats, priority support, 7-day free trial."
              },
              {
                "@type": "Offer",
                "name": "Enterprise",
                "price": "0",
                "priceCurrency": "USD",
                "availability": "https://schema.org/InStock",
                "description": "Custom pricing for organizations. Unlimited seats, full CLI, custom integrations."
              }
            ],
            "publisher": {
              "@type": "Organization",
              "name": "HASTE.NYC",
              "url": "https://www.haste.nyc"
            }
          })}
        </script>
      </Helmet>
      {/* Persistent vignette overlay */}
      <Vignette />
      {/* Lava lamp background removed from fixed layer -- now confined to hero section */}
      {/* Continuous atmospheric gradients across all sections including footer */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <PageAtmosphere />
      </div>
      <Header />
      <main>
        {/* Hero - full viewport height on mobile */}
        <section id="hero" ref={heroRef} className="sm:pt-10 relative overflow-hidden snap-section flex flex-col justify-center">
          {/* Lava lamp confined to hero -- scrolls away naturally, no z-bleed */}
          <LavaLampBackground
            className="absolute inset-0 w-full h-full z-0"
          />
          <HeroSection />
          <TrustBadgeBar />
        </section>

        {/* Video Section */}
        {!isMobile && (
          <DesktopVideoSection />
        )}

        {/* Hero Features */}
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

        {/* UIShowcase - 3D monitor with impact text overlay, pinned */}
        {isMobile ? (
          <MobileTextWithVideo />
        ) : (
          <DesktopShowcaseWithImpactText />
        )}

        {/* Feature Grid - detailed capabilities (desktop only) */}
        <section className="hidden md:block py-12 md:py-20 relative overflow-visible bg-background">
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

        {/* CLI / Pipeline Integration - after comparison chart on mobile */}
        <section className="py-12 md:py-20 relative overflow-visible bg-background snap-section hidden md:block md:order-none">
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

        {/* 3D Visualization + Roadmap */}
        <section className="py-4 sm:py-10 px-4 sm:px-6 md:px-12 lg:px-20 relative overflow-visible bg-background snap-section flex flex-col justify-start pt-[56px] md:justify-center md:pt-0 md:snap-section-center">
          <div
            className="absolute left-0 right-0 pointer-events-none z-0"
            style={{
              top: "0",
              bottom: "0",
              background: "radial-gradient(ellipse 160% 140% at 50% 50%, rgba(70, 110, 245, 0.12) 0%, rgba(70, 110, 245, 0.04) 30%, transparent 55%)",
            }}
          />
          <div className="max-w-7xl mx-auto w-full flex-1 md:min-h-[600px] md:flex-none">
            <LazyOnView>
              <Suspense fallback={<div className="h-full md:h-[600px] flex items-center justify-center"><div className="w-8 h-8 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" /></div>}>
                <Conform3DVisualization />
              </Suspense>
            </LazyOnView>
          </div>
          <div className="relative z-10 pb-3 md:pt-2">
            <AppRoadmap />
          </div>
        </section>

        {/* Feature Comparison Chart */}
        <section className="py-10 sm:py-20 relative overflow-y-auto bg-background snap-section flex flex-col justify-start pt-[60px] md:justify-center md:pt-0 md:snap-section-center">
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

        {/* CLI / Pipeline Integration - mobile only, after comparison chart */}
        <section className="py-12 relative overflow-visible bg-background snap-section md:hidden">
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

        {/* Pricing - full viewport on mobile */}
        <section id="pricing" className="py-10 sm:py-20 md:pb-32 relative overflow-y-auto bg-background snap-section flex flex-col justify-start pt-[60px] md:justify-center md:pt-0 md:snap-section-center">
          <div
            className="absolute left-0 right-0 pointer-events-none z-0"
            style={{
              top: "80px",
              bottom: "80px",
              background: "radial-gradient(ellipse 160% 120% at 80% 35%, rgba(90, 100, 240, 0.03) 0%, rgba(90, 100, 240, 0.01) 40%, transparent 70%)",
            }}
          />
          <div
            className="absolute left-0 right-0 pointer-events-none z-0"
            style={{
              top: "80px",
              bottom: "80px",
              background: "radial-gradient(ellipse 160% 120% at 15% 65%, rgba(80, 130, 255, 0.03) 0%, rgba(80, 130, 255, 0.01) 40%, transparent 70%)",
            }}
          />
          <PricingSection />
        </section>

        {/* FAQ - scrollable content */}
        <section id="faq" className="py-10 sm:py-20 relative overflow-y-auto bg-background snap-section-auto flex flex-col justify-start pt-[60px] md:justify-center md:pt-0 md:snap-section-center">
          <div
            className="absolute left-0 right-0 pointer-events-none z-0"
            style={{
              top: "80px",
              bottom: "80px",
              background: "radial-gradient(ellipse 160% 120% at 70% 40%, rgba(80, 120, 255, 0.06) 0%, rgba(80, 120, 255, 0.02) 40%, transparent 70%)",
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
            background: "radial-gradient(ellipse 140% 120% at 50% 55%, rgba(30, 120, 255, 0.05) 0%, rgba(59, 130, 246, 0.015) 30%, transparent 65%)",
          }}
        />
        <Footer />
      </div>
    </div>
  );
};

export default Index;
