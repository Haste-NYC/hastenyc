import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Terms of Service"
        description="Terms of Service for HASTE.NYC and Haste Conform Studio. Review our service agreement and usage policies."
        canonical="/terms"
      />
      <Header />
      <main className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-display text-4xl md:text-5xl font-normal text-foreground mb-2 uppercase tracking-wide">
            Terms of Service
          </h1>
          <p className="text-foreground/60 text-xs uppercase tracking-[0.15em] mb-10">
            Effective Date: July 25, 2025
          </p>
          
          <div className="text-foreground/80 text-sm leading-relaxed uppercase tracking-[0.04em] space-y-8">
            <p>
              Welcome to Conform Studio, a service provided by Haste NYC LLC ("Company," "we," "our," or "us"). These Terms of Service ("Terms") govern your access to and use of Conform Studio, available at www.haste.nyc (the "Site").
            </p>
            
            <p>
              By accessing or using our service, you agree to be bound by these terms. If you do not agree, you may not use the service.
            </p>

            <div>
              <h2 className="text-foreground font-medium mb-2">1. Use of the Service</h2>
              <p>
                Conform Studio is a subscription-based SaaS product. You may use the service only in compliance with these terms and all applicable laws.
              </p>
            </div>

            <div>
              <h2 className="text-foreground font-medium mb-2">2. Account Registration</h2>
              <p>
                To access Conform Studio, you must create an account. You agree to provide accurate and complete information, including your name, email, and billing details.
              </p>
            </div>

            <div>
              <h2 className="text-foreground font-medium mb-2">3. Subscription and Billing</h2>
              <p>
                All payments are processed via Paddle.com. Subscription fees are charged in advance and billed on a recurring basis unless cancelled. Users are responsible for all charges incurred.
              </p>
            </div>

            <div>
              <h2 className="text-foreground font-medium mb-2">4. Cancellation and Termination</h2>
              <p>
                You may cancel your subscription at any time through your account settings. After any applicable free trial, all fees are non-refundable. We reserve the right to suspend or terminate your account for violations of these terms.
              </p>
            </div>

            <div>
              <h2 className="text-foreground font-medium mb-2">5. Intellectual Property</h2>
              <p>
                All content, code, and branding related to Conform Studio remain the intellectual property of Haste NYC LLC. You may not copy, modify, distribute, or reverse engineer any part of the service.
              </p>
            </div>

            <div>
              <h2 className="text-foreground font-medium mb-2">6. Limitation of Liability</h2>
              <p>
                We provide the service "as is" and disclaim all warranties. To the maximum extent allowed by law, we are not liable for any indirect or consequential damages.
              </p>
            </div>

            <div>
              <h2 className="text-foreground font-medium mb-2">7. Governing Law</h2>
              <p>
                These terms are governed by the laws of the State of New York, USA, without regard to conflict of laws principles.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
