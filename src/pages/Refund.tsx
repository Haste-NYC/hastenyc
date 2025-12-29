import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Refund = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-display text-4xl md:text-5xl font-normal text-foreground mb-8 uppercase tracking-wide">
            Refund Policy
          </h1>
          <div className="text-foreground/80 text-sm leading-relaxed uppercase tracking-[0.04em] space-y-6">
            <p>
              We want you to be satisfied with our services. This policy outlines our refund procedures.
            </p>
            <p>
              Please contact us for the full refund policy documentation.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Refund;
