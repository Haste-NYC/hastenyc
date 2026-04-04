import { useRef, useCallback } from "react";
import Header from "@/components/Header";
import SEO from "@/components/SEO";

const Cookies = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    const container = scrollRef.current;
    if (!container) return;
    e.preventDefault();
    container.scrollTop += e.deltaY;
  }, []);

  return (
    <div className="bg-background">
      <SEO
        title="Cookies Policy"
        description="Cookies Policy for Haste.NYC LLC. Learn how we use cookies and similar technologies on our websites and services."
        canonical="/cookies"
      />
      <Header />

      <div className="h-[calc(100vh-3.5rem)] mt-14 flex flex-col items-center px-6 pb-8 overflow-hidden">
        <div className="w-full max-w-4xl flex flex-col h-full">

          {/* Title area */}
          <div className="pt-10 pb-6">
            <h1 className="font-display text-4xl md:text-5xl font-normal text-foreground mb-2 uppercase tracking-wide">
              Cookies Policy
            </h1>
            <p className="text-foreground/60 text-xs uppercase tracking-[0.15em] mb-1">
              Effective Date: April 3, 2026
            </p>
            <p className="text-foreground/60 text-xs uppercase tracking-[0.15em]">
              Last Updated: April 3, 2026
            </p>
          </div>

          {/* Scrollable cookies content */}
          <div
            ref={scrollRef}
            onWheel={handleWheel}
            className="flex-1 min-w-0 overflow-y-auto border border-foreground/10 rounded-lg"
          >
            <div className="text-foreground/80 text-sm leading-relaxed uppercase tracking-[0.04em] space-y-8 p-6">

              <p className="font-medium text-foreground">
                This Cookies Policy explains how Haste.NYC LLC ("Haste," "we," "us," or "our") uses cookies and similar tracking technologies when you visit our websites (including https://www.haste.nyc) and use our products and services, including Conform Studio and Premiere Rewind (collectively, the "Services"). This policy should be read together with our Privacy Policy.
              </p>

              {/* Section 1 */}
              <div>
                <h2 className="text-foreground font-medium mb-4 text-base">1. What Are Cookies</h2>
                <p>
                  Cookies are small text files that are placed on your device (computer, tablet, or mobile phone) when you visit a website. They are widely used to make websites work more efficiently, to provide a better browsing experience, and to supply information to the owners of the website. Cookies may be "persistent" cookies, which remain on your device until they expire or are deleted, or "session" cookies, which are temporary and are deleted when you close your browser. Cookies can be set by the website you are visiting ("first-party cookies") or by third-party services that the website uses ("third-party cookies").
                </p>
              </div>

              {/* Section 2 */}
              <div>
                <h2 className="text-foreground font-medium mb-4 text-base">2. How We Use Cookies</h2>
                <p className="mb-4">We use the following categories of cookies on our Services:</p>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-foreground font-medium mb-2">2.1 Essential and Functional Cookies</h3>
                    <p>
                      These cookies are strictly necessary for the operation of our Services. They enable core functionality such as user authentication, session management, security features, and load balancing. Without these cookies, the Services cannot function properly. Essential cookies do not require your consent as they are necessary to provide you with the Services you have requested.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-foreground font-medium mb-2">2.2 Analytics Cookies</h3>
                    <p>
                      These cookies help us understand how visitors interact with our Services by collecting and reporting information about usage patterns. Analytics cookies allow us to measure and improve the performance of our Services, identify which pages and features are most popular, and understand how users navigate through the website. The data collected is aggregated and used solely for statistical purposes.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-foreground font-medium mb-2">2.3 Preference Cookies</h3>
                    <p>
                      These cookies allow our Services to remember choices you make, such as your preferred language, region, display settings, and other customizable elements of the user interface. Preference cookies enhance your experience by providing personalized features without requiring you to reconfigure your settings each time you visit.
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 3 */}
              <div>
                <h2 className="text-foreground font-medium mb-4 text-base">3. Third-Party Cookies</h2>
                <p className="mb-4">
                  In addition to our own cookies, we may use cookies set by third-party services that are integrated into our Services. These third-party cookies are governed by the respective privacy policies of the third parties that set them. The third-party services we use include:
                </p>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-foreground font-medium mb-2">3.1 Stripe</h3>
                    <p>
                      We use Stripe to process payments for our products and services. Stripe may set cookies on your device to facilitate secure payment processing, detect and prevent fraud, and remember your payment preferences. For more information about how Stripe uses cookies, please visit Stripe's privacy policy at https://stripe.com/privacy.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-foreground font-medium mb-2">3.2 Vercel Analytics</h3>
                    <p>
                      We use Vercel Analytics to monitor the performance and usage of our website. Vercel Analytics may collect data about page views, visitor counts, and web performance metrics. Vercel's analytics are designed to be privacy-focused and do not use cookies for cross-site tracking. For more information, please refer to Vercel's privacy policy at https://vercel.com/legal/privacy-policy.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-foreground font-medium mb-2">3.3 Google Analytics</h3>
                    <p>
                      We may use Google Analytics to collect and analyze information about how visitors use our Services. Google Analytics uses cookies to gather data such as the number of visitors, the pages they visit, and the time spent on the website. This information helps us understand usage trends and improve our Services. You can opt out of Google Analytics by installing the Google Analytics opt-out browser add-on, available at https://tools.google.com/dlpage/gaoptout. For more information about Google's data practices, please visit https://policies.google.com/privacy.
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 4 */}
              <div>
                <h2 className="text-foreground font-medium mb-4 text-base">4. Managing Cookies</h2>
                <p className="mb-4">
                  You have the right to decide whether to accept or reject cookies. You can manage your cookie preferences through the following methods:
                </p>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-foreground font-medium mb-2">4.1 Browser Settings</h3>
                    <p>
                      Most web browsers allow you to control cookies through their settings. You can set your browser to refuse all cookies, accept only first-party cookies, or delete cookies when you close your browser. The method for managing cookies varies by browser. Please consult your browser's help documentation for instructions specific to your browser. Common browsers include Google Chrome, Mozilla Firefox, Apple Safari, and Microsoft Edge.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-foreground font-medium mb-2">4.2 Impact of Disabling Cookies</h3>
                    <p>
                      Please note that if you choose to disable or reject cookies, some features of our Services may not function properly or may become unavailable. Essential cookies cannot be disabled as they are required for the basic operation of the Services. Disabling analytics or preference cookies may result in a less personalized experience but will not prevent you from using the core features of our Services.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-foreground font-medium mb-2">4.3 Do Not Track</h3>
                    <p>
                      Some browsers include a "Do Not Track" feature that signals to websites that you do not want your online activity tracked. Because there is no widely accepted standard for how to respond to Do Not Track signals, our Services do not currently respond to such signals. However, you can use the cookie management options described above to control tracking on our Services.
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 5 */}
              <div>
                <h2 className="text-foreground font-medium mb-4 text-base">5. Changes to This Policy</h2>
                <p>
                  We may update this Cookies Policy from time to time to reflect changes in technology, applicable law, our data practices, or other factors. If we make material changes, we will notify you by posting the revised policy on our website and updating the "Last Updated" date at the top of this policy. Your continued use of the Services after any changes constitutes your acceptance of the updated Cookies Policy. We encourage you to review this policy periodically to stay informed about how we use cookies.
                </p>
              </div>

              {/* Section 6 */}
              <div>
                <h2 className="text-foreground font-medium mb-4 text-base">6. Contact Us</h2>
                <p className="mb-4">
                  If you have any questions or concerns about this Cookies Policy or our use of cookies, please contact us at:
                </p>
                <div className="space-y-1">
                  <p>Haste.NYC LLC</p>
                  <p>555 Morgan Avenue, #2, Brooklyn, New York 11222, United States</p>
                  <p>Email: privacy@haste.nyc</p>
                  <p>Website: https://www.haste.nyc</p>
                </div>
              </div>

              {/* Divider and Copyright */}
              <div className="border-t border-foreground/20 pt-8">
                <p className="text-foreground/60">
                  2026 Haste.NYC LLC. All rights reserved.
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cookies;
