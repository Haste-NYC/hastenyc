import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import TrustBadgeBar from "@/components/TrustBadgeBar";
import VideoSection from "@/components/VideoSection";
import FeatureSection from "@/components/FeatureSection";
import AboutSection from "@/components/AboutSection";
import FAQSection from "@/components/FAQSection";
import PricingSection from "@/components/PricingSection";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

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
        {/* Hero - full height minus header */}
        <section id="hero" className="pt-10 relative snap-section">
          <HeroSection />
          {/* Gradient fade to next section */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
        </section>

        {/* Trust Badge Bar - Partner logos */}
        <div className="snap-section">
          <TrustBadgeBar />
        </div>

        {/* Video Demo */}
        <div className="snap-section">
          <VideoSection />
        </div>

        {/* Features - stacked sections with peek effect */}
        <section id="features" className="py-20 relative snap-section">
          <FeatureSection />
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-20 relative snap-section">
          <PricingSection />
        </section>

        {/* FAQ */}
        <section id="faq" className="py-20 relative snap-section">
          <FAQSection />
        </section>

        {/* About */}
        <section id="about" className="py-20 relative snap-section">
          <AboutSection />
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
