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
          <h1 className="font-display text-4xl md:text-5xl font-normal text-foreground mb-2 uppercase tracking-wide">
            Privacy Notice
          </h1>
          <p className="text-foreground/60 text-xs uppercase tracking-[0.15em] mb-10">
            Effective Date: January 12, 2026
          </p>
          
          <div className="text-foreground/80 text-sm leading-relaxed uppercase tracking-[0.04em] space-y-8">
            <p>
              This Privacy Notice describes how Haste NYC LLC ("we," "our," or "us") collects, uses, and protects your personal information when you use Conform Studio.
            </p>

            <div>
              <h2 className="text-foreground font-medium mb-2">1. Information We Collect</h2>
              <p>
                We collect the following personal data: - Name - Email address - Billing information (via Paddle.com) - Usage data within the app (non-identifiable analytics)
              </p>
            </div>

            <div>
              <h2 className="text-foreground font-medium mb-2">2. How We Use Your Information</h2>
              <p>
                We use your data to: - Provide access to the service - Process billing via Paddle.com - Monitor usage to improve features
              </p>
            </div>

            <div>
              <h2 className="text-foreground font-medium mb-2">3. Data Sharing</h2>
              <p>
                We do not sell or rent your personal data. We share it only with Paddle.com for payment processing.
              </p>
            </div>

            <div>
              <h2 className="text-foreground font-medium mb-2">4. International Users</h2>
              <p>
                By using the service, you consent to the transfer and storage of your information in the United States. We comply with applicable data protection laws, including GDPR where applicable.
              </p>
            </div>

            <div>
              <h2 className="text-foreground font-medium mb-2">5. Data Retention</h2>
              <p>
                We retain your data as long as your account is active or as needed to comply with legal obligations.
              </p>
            </div>

            <div>
              <h2 className="text-foreground font-medium mb-2">6. Your Rights</h2>
              <p>
                Depending on your location, you may have rights to access, correct, or delete your personal data. Contact us at support@haste.nyc to make a request.
              </p>
            </div>

            <div>
              <h2 className="text-foreground font-medium mb-2">7. Security</h2>
              <p>
                We implement reasonable security measures to protect your data.
              </p>
            </div>

            <div>
              <h2 className="text-foreground font-medium mb-2">8. Contact</h2>
              <p>
                For questions or concerns: support@haste.nyc
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;
