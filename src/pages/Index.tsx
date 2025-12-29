import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import VideoSection from "@/components/VideoSection";
import FeatureSection from "@/components/FeatureSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Conform Studio - AI-Powered Post Production Automation"
        description="Conform Studio uses AI to automate post-production. 300X faster timeline conform for film and TV. Built for studios, secure, and scalable."
        canonical="/"
      />
      <Header />
      <main>
        <HeroSection />
        <VideoSection />
        <FeatureSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
