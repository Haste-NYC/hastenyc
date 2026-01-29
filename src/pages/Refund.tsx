import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const Refund = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Refund Policy"
        description="Refund Policy for Haste Conform Studio. Review our refund procedures and satisfaction guarantee."
        canonical="/refund"
      />
      <Header />
      <main className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-display text-4xl md:text-5xl font-normal text-foreground mb-2 uppercase tracking-wide">
            Refund Policy
          </h1>
          <p className="text-foreground/60 text-xs uppercase tracking-[0.15em] mb-10">
            Effective Date: January 12, 2026
          </p>
          
          <div className="text-foreground/80 text-sm leading-relaxed uppercase tracking-[0.04em] space-y-8">
            <p>
              Conform Studio is offered with an optional free trial. After the trial period ends, all subscription fees are final and non-refundable. By subscribing, you agree to be charged automatically via Paddle.com.
            </p>

            <div>
              <h2 className="text-foreground font-medium mb-2">Cancellation</h2>
              <p>
                You may cancel your subscription at any time via your account dashboard. Cancellation stops future billing but does not provide a refund for prior charges.
              </p>
            </div>

            <p>
              If you believe you were charged in error, please contact us at support@haste.nyc within 7 days of the charge.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Refund;
