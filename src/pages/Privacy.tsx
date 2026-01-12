import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Privacy Notice"
        description="Privacy Notice for HASTE.NYC and Haste Conform Studio. Learn how we collect, use, and protect your information."
        canonical="/privacy"
      />
      <Header />
      <main className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-display text-4xl md:text-5xl font-normal text-foreground mb-8 uppercase tracking-wide">
            Privacy Notice
          </h1>
          <div className="text-foreground/80 text-sm leading-relaxed uppercase tracking-[0.04em] space-y-6">
            <p>
              Your privacy is important to us. This notice explains how we collect, use, and protect your information.
            </p>
            <p>
              Please contact us for the full privacy notice documentation.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;
