import { useRef, useCallback, useState, useEffect } from "react";
import Header from "@/components/Header";
import SEO from "@/components/SEO";

const sections = [
  { id: "who-we-are", label: "Who We Are" },
  { id: "information-we-collect", label: "Information We Collect" },
  { id: "how-we-use", label: "How We Use Your Information" },
  { id: "how-we-share", label: "How We Share Your Information" },
  { id: "data-retention", label: "Data Retention" },
  { id: "data-security", label: "Data Security" },
  { id: "international-transfers", label: "International Data Transfers" },
  { id: "your-rights", label: "Your Rights and Choices" },
  { id: "state-rights", label: "State-Specific Privacy Rights" },
  { id: "gdpr", label: "GDPR and International Rights" },
  { id: "childrens-privacy", label: "Children's Privacy" },
  { id: "third-party", label: "Third-Party Links and Services" },
  { id: "changes", label: "Changes to This Privacy Policy" },
  { id: "contact", label: "Contact Us" },
];

const Privacy = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState<string>("");

  const scrollToSection = useCallback((id: string) => {
    const container = scrollRef.current;
    const target = document.getElementById(id);
    if (container && target) {
      const containerTop = container.getBoundingClientRect().top;
      const targetTop = target.getBoundingClientRect().top;
      container.scrollTop += targetTop - containerTop - 24;
    }
  }, []);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      const containerTop = container.getBoundingClientRect().top;
      let current = "";
      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el && el.getBoundingClientRect().top - containerTop <= 80) {
          current = section.id;
        }
      }
      setActiveSection(current);
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      container.scrollTop += e.deltaY;
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      container.removeEventListener("scroll", handleScroll);
      container.removeEventListener("wheel", handleWheel);
    };
  }, []);

  return (
    <div className="bg-background">
      <SEO
        title="Privacy Policy"
        description="Privacy Policy for Haste.NYC LLC. Learn how we collect, use, share, and protect your personal information."
        canonical="/privacy"
      />
      <Header />

      <div className="h-[calc(100vh-3.5rem)] mt-14 flex flex-col items-center px-6 pb-8 overflow-hidden">
        <div className="w-full max-w-4xl flex flex-col h-full">

          {/* Title area */}
          <div className="pt-10 pb-6">
            <h1 className="font-display text-4xl md:text-5xl font-normal text-foreground mb-2 uppercase tracking-wide">
              Privacy Policy
            </h1>
            <p className="text-foreground/60 text-xs uppercase tracking-[0.15em] mb-1">
              Effective Date: February 18, 2026
            </p>
            <p className="text-foreground/60 text-xs uppercase tracking-[0.15em]">
              Last Updated: February 18, 2026
            </p>
          </div>

          {/* Row: nav left, scroll box right */}
          <div className="flex flex-1 min-h-0">

            {/* Jump to section nav */}
            <nav className="w-52 shrink-0 pr-8 overflow-y-auto hidden xl:block">
              <p className="text-foreground/50 text-xs font-medium uppercase tracking-[0.15em] mb-4">
                Jump to section
              </p>
              <ol className="space-y-0.5">
                {sections.map((section, i) => (
                  <li key={section.id}>
                    <button
                      onClick={() => scrollToSection(section.id)}
                      className={`text-left w-full text-xs uppercase tracking-[0.06em] py-1.5 transition-colors border-l-2 pl-3 ${
                        activeSection === section.id
                          ? "text-foreground border-foreground"
                          : "text-foreground/35 border-transparent hover:text-foreground/60 hover:border-foreground/20"
                      }`}
                    >
                      {i + 1}. {section.label}
                    </button>
                  </li>
                ))}
              </ol>
            </nav>

          {/* Scrollable privacy content */}
          <div ref={scrollRef} className="flex-1 min-w-0 overflow-y-auto border border-foreground/10 rounded-lg">
          <div className="text-foreground/80 text-sm leading-relaxed uppercase tracking-[0.04em] space-y-8 p-6">

            <p className="font-medium text-foreground">
              Your privacy is important to Haste.NYC LLC ("Haste," "Company," "we," "us," or "our"). This Privacy Policy describes how we collect, use, share, store, and protect your personal information when you access or use our websites (including https://www.haste.nyc), software products (including Conform Studio), cloud services, APIs, customer support, forums, and all other products and services we offer (collectively, the "Services and Software"). This Privacy Policy also explains your rights and choices regarding your personal information.
            </p>

            <p>
              By accessing or using our Services and Software, you acknowledge that you have read, understood, and agree to be bound by this Privacy Policy. If you do not agree with any part of this Privacy Policy, please do not use our Services and Software. We encourage you to review this Privacy Policy periodically to stay informed of any updates.
            </p>

            {/* Section 1 */}
            <div id="who-we-are">
              <h2 className="text-foreground font-medium mb-4 text-base">1. Who We Are</h2>
              <p>
                Haste.NYC LLC is a limited liability company organized under the laws of the State of New York, United States. Our principal address is Haste.NYC LLC, 555 Morgan Avenue, #2, Brooklyn, New York 11222, United States. We are the controller of personal information collected through our Services and Software, meaning we determine the purposes and means of processing your personal information. For questions or concerns about this Privacy Policy or our data practices, you may contact our Privacy team at privacy@haste.nyc.
              </p>
            </div>

            {/* Section 2 */}
            <div id="information-we-collect">
              <h2 className="text-foreground font-medium mb-4 text-base">2. Information We Collect</h2>

              <div className="space-y-4">
                <div>
                  <h3 className="text-foreground font-medium mb-2">2.1 Information You Provide Directly</h3>
                  <p>
                    We may collect information that you voluntarily provide when you interact with us, including but not limited to: (a) account registration information such as your name, email address, username, and password; (b) billing and payment information such as your credit card number, billing address, and payment method details (processed and stored by our third-party payment processors); (c) profile information such as your company name, job title, industry, and professional interests; (d) communications you send to us, including customer support inquiries, feedback, feature requests, and correspondence; (e) information you provide when participating in surveys, contests, promotions, or beta programs; and (f) any other information you choose to provide.
                  </p>
                </div>

                <div>
                  <h3 className="text-foreground font-medium mb-2">2.2 Information Collected Automatically</h3>
                  <p>
                    When you access or use our Services and Software, we may automatically collect certain technical and usage information, including but not limited to: (a) device information such as your device type, operating system, hardware model, unique device identifiers, and browser type; (b) network information such as your Internet Protocol (IP) address, Internet service provider, and general geographic location derived from your IP address; (c) usage data such as pages visited, features used, actions taken within the Software, time spent on pages, clickstream data, and referring and exit URLs; (d) log data such as access times, error logs, crash reports, and diagnostic data; (e) software environment data such as installed plugins, system configurations, and version information relevant to the operation of our Software; and (f) performance data such as processing times, rendering metrics, and feature utilization patterns.
                  </p>
                </div>

                <div>
                  <h3 className="text-foreground font-medium mb-2">2.3 Information from Third Parties</h3>
                  <p>
                    We may receive information about you from third-party sources, including: (a) analytics providers, advertising partners, and marketing platforms; (b) resellers, distributors, and channel partners through which you purchase or license our products; (c) public databases, social media platforms, and professional networks; (d) credit reporting agencies and identity verification services (in connection with payment processing); and (e) other users who may provide your information when using collaborative features.
                  </p>
                </div>

                <div>
                  <h3 className="text-foreground font-medium mb-2">2.4 Cookies and Similar Technologies</h3>
                  <p>
                    We use cookies, web beacons, pixel tags, local storage, and similar tracking technologies to collect information about your interactions with our Services and Software. Cookies are small data files placed on your device that help us improve our Services and your experience, deliver personalized content, and analyze usage patterns. You may control cookies through your browser settings, though disabling cookies may affect the functionality of certain features of our Services. For more information about the specific cookies we use and your choices regarding cookies, please contact us at privacy@haste.nyc.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 3 */}
            <div id="how-we-use">
              <h2 className="text-foreground font-medium mb-4 text-base">3. How We Use Your Information</h2>
              <p className="mb-4">We use the information we collect for the following purposes:</p>
              <div className="space-y-2 pl-4">
                <p>(a) To provide, maintain, operate, and improve the Services and Software, including processing transactions, authenticating users, and delivering customer support;</p>
                <p>(b) To personalize and customize your experience, including tailoring content, recommendations, and communications based on your preferences and usage patterns;</p>
                <p>(c) To communicate with you about your account, including sending service-related notices, security alerts, administrative messages, and updates to our Terms and policies;</p>
                <p>(d) To send you marketing and promotional communications about products, services, features, and events that may be of interest to you, subject to your opt-out rights;</p>
                <p>(e) To analyze usage trends, monitor and improve the effectiveness of our Services, and conduct research and development;</p>
                <p>(f) To detect, prevent, investigate, and address fraud, security breaches, violations of our Terms, and other harmful, unauthorized, or illegal activities;</p>
                <p>(g) To enforce our Terms of Service and other agreements, and to protect the rights, property, and safety of Haste, our users, and others;</p>
                <p>(h) To comply with legal obligations, respond to lawful requests from public authorities, and cooperate with law enforcement and regulatory agencies;</p>
                <p>(i) To process and fulfill your orders, manage your subscriptions, and administer your account; and</p>
                <p>(j) For any other purpose with your consent or as otherwise permitted or required by applicable law.</p>
              </div>
            </div>

            {/* Section 4 */}
            <div id="how-we-share">
              <h2 className="text-foreground font-medium mb-4 text-base">4. How We Share Your Information</h2>

              <div className="space-y-4">
                <div>
                  <h3 className="text-foreground font-medium mb-2">4.1 Service Providers</h3>
                  <p>
                    We may share your personal information with third-party service providers who perform services on our behalf, such as payment processing, data analytics, cloud hosting, email delivery, customer support, marketing, and advertising. These service providers are contractually obligated to protect your personal information and may only use it for the specific purposes for which it was provided.
                  </p>
                </div>

                <div>
                  <h3 className="text-foreground font-medium mb-2">4.2 Business Transfers</h3>
                  <p>
                    In the event of a merger, acquisition, reorganization, dissolution, asset sale, bankruptcy, or other change of control, your personal information may be transferred or disclosed as part of the transaction. We will notify you of any such change and any choices you may have regarding your personal information.
                  </p>
                </div>

                <div>
                  <h3 className="text-foreground font-medium mb-2">4.3 Legal Requirements</h3>
                  <p>
                    We may disclose your personal information if we believe in good faith that such disclosure is necessary to: (a) comply with applicable law, regulation, legal process, or governmental request; (b) enforce our Terms of Service and other agreements; (c) protect and defend the rights, property, or safety of Haste, our users, or the public; (d) detect, prevent, or otherwise address fraud, security, or technical issues; or (e) respond to an emergency involving danger of death or serious physical injury.
                  </p>
                </div>

                <div>
                  <h3 className="text-foreground font-medium mb-2">4.4 Aggregated and De-Identified Data</h3>
                  <p>
                    We may share aggregated, anonymized, or de-identified data that cannot reasonably be used to identify you with third parties for any purpose, including research, analytics, marketing, and industry benchmarking.
                  </p>
                </div>

                <div>
                  <h3 className="text-foreground font-medium mb-2">4.5 With Your Consent</h3>
                  <p>
                    We may share your personal information with third parties when you have provided your explicit consent to do so.
                  </p>
                </div>

                <div>
                  <h3 className="text-foreground font-medium mb-2">4.6 No Sale of Personal Information</h3>
                  <p>
                    Haste does not sell your personal information to third parties for monetary consideration. We do not rent, lease, or trade your personal information.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 5 */}
            <div id="data-retention">
              <h2 className="text-foreground font-medium mb-4 text-base">5. Data Retention</h2>
              <p>
                We retain your personal information for as long as your account is active, as necessary to fulfill the purposes for which it was collected, to provide you with our Services and Software, to comply with our legal obligations, to resolve disputes, to enforce our agreements, and as permitted by applicable law. When we no longer need your personal information, we will securely delete, destroy, or de-identify it in accordance with our data retention policies and applicable legal requirements. We typically retain account data for a period of up to six (6) years after account closure or termination, or longer if required by law.
              </p>
            </div>

            {/* Section 6 */}
            <div id="data-security">
              <h2 className="text-foreground font-medium mb-4 text-base">6. Data Security</h2>
              <p>
                We implement and maintain commercially reasonable administrative, technical, organizational, and physical security measures designed to protect your personal information from unauthorized access, disclosure, alteration, destruction, and loss. These measures include but are not limited to encryption of data in transit and at rest, access controls, regular security assessments, employee training, and incident response procedures. However, no method of transmission over the Internet and no method of electronic storage is completely secure. While we strive to use commercially reasonable means to protect your personal information, we cannot guarantee its absolute security. You are responsible for maintaining the confidentiality of your account credentials and for notifying us immediately of any unauthorized access to your account.
              </p>
            </div>

            {/* Section 7 */}
            <div id="international-transfers">
              <h2 className="text-foreground font-medium mb-4 text-base">7. International Data Transfers</h2>
              <p>
                Haste is based in the United States, and your personal information may be transferred to, stored, and processed in the United States or other countries where we or our service providers maintain facilities. These countries may have data protection laws that are different from the laws of your jurisdiction. By using our Services and Software, you consent to the transfer of your personal information to the United States and other jurisdictions as described in this Privacy Policy. Where required by applicable law, we implement appropriate safeguards for cross-border data transfers, such as Standard Contractual Clauses approved by the relevant authorities.
              </p>
            </div>

            {/* Section 8 */}
            <div id="your-rights">
              <h2 className="text-foreground font-medium mb-4 text-base">8. Your Rights and Choices</h2>

              <div className="space-y-4">
                <div>
                  <h3 className="text-foreground font-medium mb-2">8.1 Access and Portability</h3>
                  <p>
                    You may request access to the personal information we hold about you, including a copy of your personal information in a structured, commonly used, and machine-readable format.
                  </p>
                </div>

                <div>
                  <h3 className="text-foreground font-medium mb-2">8.2 Correction</h3>
                  <p>
                    You may request that we correct any inaccurate or incomplete personal information we hold about you.
                  </p>
                </div>

                <div>
                  <h3 className="text-foreground font-medium mb-2">8.3 Deletion</h3>
                  <p>
                    You may request that we delete your personal information, subject to certain legal exceptions. We may retain certain information as required by law or for legitimate business purposes.
                  </p>
                </div>

                <div>
                  <h3 className="text-foreground font-medium mb-2">8.4 Opt-Out of Marketing</h3>
                  <p>
                    You may opt out of receiving promotional or marketing communications from us at any time by following the unsubscribe instructions in the communication, adjusting your account settings, or contacting us at privacy@haste.nyc. Even if you opt out of marketing communications, we may still send you non-promotional, service-related communications.
                  </p>
                </div>

                <div>
                  <h3 className="text-foreground font-medium mb-2">8.5 Cookie Preferences</h3>
                  <p>
                    Most web browsers are set to accept cookies by default. You can usually adjust your browser settings to remove or reject cookies. Please note that removing or rejecting cookies may affect the availability and functionality of our Services.
                  </p>
                </div>

                <div>
                  <h3 className="text-foreground font-medium mb-2">8.6 Do Not Track Signals</h3>
                  <p>
                    Some web browsers transmit "Do Not Track" signals. Because there is no common industry standard for interpreting such signals, our Services do not currently respond to "Do Not Track" signals. However, you can control your privacy settings through the mechanisms described in this Privacy Policy.
                  </p>
                </div>

                <div>
                  <h3 className="text-foreground font-medium mb-2">8.7 Exercising Your Rights</h3>
                  <p>
                    To exercise any of the rights described above, please submit a request to privacy@haste.nyc. We may require verification of your identity before processing your request. We will respond to your request within the timeframes required by applicable law and will not discriminate against you for exercising your rights.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 9 */}
            <div id="state-rights">
              <h2 className="text-foreground font-medium mb-4 text-base">9. State-Specific Privacy Rights</h2>

              <div className="space-y-4">
                <div>
                  <h3 className="text-foreground font-medium mb-2">9.1 California Residents</h3>
                  <p>
                    If you are a California resident, you may have additional rights under the California Consumer Privacy Act ("CCPA") and the California Privacy Rights Act ("CPRA"), including the right to know what personal information we have collected, the right to delete personal information, the right to opt out of the sale or sharing of personal information, and the right to non-discrimination for exercising your privacy rights. To exercise these rights, please contact us at privacy@haste.nyc or visit our website. We will verify your identity before processing any requests. California's "Shine the Light" law (Civil Code § 1798.83) permits California residents to request certain information regarding our disclosure of personal information to third parties for their direct marketing purposes. To make such a request, please contact us at privacy@haste.nyc.
                  </p>
                </div>

                <div>
                  <h3 className="text-foreground font-medium mb-2">9.2 Virginia, Colorado, Connecticut, Utah, and Other State Residents</h3>
                  <p>
                    Residents of Virginia, Colorado, Connecticut, Utah, Texas, and other states with comprehensive privacy laws may have similar rights to access, correct, delete, and port their personal information, as well as the right to opt out of targeted advertising, profiling, and the sale of personal information. To exercise these rights, please contact us at privacy@haste.nyc.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 10 */}
            <div id="gdpr">
              <h2 className="text-foreground font-medium mb-4 text-base">10. GDPR and International Rights</h2>
              <p>
                If you are located in the European Economic Area ("EEA"), the United Kingdom ("UK"), or Switzerland, you may have additional rights under the General Data Protection Regulation ("GDPR") or equivalent laws. These include the right to access, rectification, erasure, restriction of processing, data portability, and the right to object to processing. Our legal bases for processing your personal information include: (a) performance of a contract with you; (b) our legitimate business interests; (c) your consent; and (d) compliance with legal obligations. You also have the right to lodge a complaint with a supervisory authority in the EU/EEA member state where you reside or work, or where the alleged violation occurred.
              </p>
            </div>

            {/* Section 11 */}
            <div id="childrens-privacy">
              <h2 className="text-foreground font-medium mb-4 text-base">11. Children's Privacy</h2>
              <p>
                Our Services and Software are not directed to individuals under the age of sixteen (16), and we do not knowingly collect personal information from children under sixteen (16). If we learn that we have collected personal information from a child under the age of sixteen (16) without verifiable parental consent, we will take steps to delete such information as quickly as possible. If you believe that a child under sixteen (16) has provided us with personal information, please contact us at privacy@haste.nyc.
              </p>
            </div>

            {/* Section 12 */}
            <div id="third-party">
              <h2 className="text-foreground font-medium mb-4 text-base">12. Third-Party Links and Services</h2>
              <p>
                Our Services and Software may contain links to, or integrate with, third-party websites, services, plug-ins, and applications that are not operated or controlled by Haste. This Privacy Policy does not apply to such third-party services, and we are not responsible for the privacy practices of any third party. We encourage you to read the privacy policies of every third-party service you access through our Services.
              </p>
            </div>

            {/* Section 13 */}
            <div id="changes">
              <h2 className="text-foreground font-medium mb-4 text-base">13. Changes to This Privacy Policy</h2>
              <p>
                We may update or modify this Privacy Policy from time to time in our sole discretion. If we make material changes, we will notify you by posting the revised Privacy Policy on our website and, where appropriate, by sending you an email notification or providing an in-product notice. The "Last Updated" date at the top of this Privacy Policy indicates when it was last revised. Your continued use of the Services and Software after any changes to this Privacy Policy constitutes your acceptance of such changes. We encourage you to review this Privacy Policy periodically.
              </p>
            </div>

            {/* Section 14 */}
            <div id="contact">
              <h2 className="text-foreground font-medium mb-4 text-base">14. Contact Us</h2>
              <p className="mb-4">
                If you have any questions, comments, concerns, or complaints about this Privacy Policy, our data practices, or your personal information, please contact us at:
              </p>
              <div className="space-y-1">
                <p>Haste.NYC LLC</p>
                <p>Attention: Privacy Officer</p>
                <p>555 Morgan Avenue, #2, Brooklyn, New York 11222, United States</p>
                <p>Email: privacy@haste.nyc</p>
                <p>Website: https://www.haste.nyc</p>
              </div>
              <div className="mt-4 space-y-1">
                <p>For general inquiries: support@haste.nyc</p>
                <p>For legal inquiries: legal@haste.nyc</p>
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
    </div>
  );
};

export default Privacy;
