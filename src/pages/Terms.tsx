import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-display text-4xl md:text-5xl font-normal text-foreground mb-8 uppercase tracking-wide">
            Terms of Service
          </h1>
          <div className="text-foreground/80 text-sm leading-relaxed uppercase tracking-[0.04em] space-y-6">
            <p>
              Welcome to Haste.NYC. By using our services, you agree to these terms.
            </p>
            <p>
              Please contact us for the full terms of service documentation.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
