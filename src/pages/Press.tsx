import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import PressContent from "@/components/press/PressContent";

const Press = () => {
  return (
    <div className="min-h-screen bg-background select-none">
      <SEO
        title="Press Resources - Conform Studio"
        description="Press resources for Conform Studio by Haste. Download logos, product screenshots, demo video, and press materials for media coverage."
        canonical="/press"
      />
      <Header />
      <main className="pt-32 pb-24">
        <PressContent />
      </main>
      <Footer hideAsciiLogo />
    </div>
  );
};

export default Press;
