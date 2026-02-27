import { useRef, useCallback, useState, useEffect } from "react";
import Header from "@/components/Header";
import SEO from "@/components/SEO";

const sections = [
  { id: "agreement", label: "Your Agreement with Haste" },
  { id: "intellectual-property", label: "Intellectual Property Rights" },
  { id: "restrictions", label: "Restrictions on Use" },
  { id: "your-content", label: "Your Content" },
  { id: "account-security", label: "Account and Security" },
  { id: "fees-payment", label: "Fees, Payment, and Taxes" },
  { id: "confidentiality", label: "Confidentiality" },
  { id: "warranty", label: "Warranty Disclaimers" },
  { id: "liability", label: "Limitation of Liability" },
  { id: "indemnification", label: "Indemnification" },
  { id: "termination", label: "Termination" },
  { id: "dispute-resolution", label: "Dispute Resolution and Arbitration" },
  { id: "export-controls", label: "Export Controls and Trade Compliance" },
  { id: "updates", label: "Updates and Modifications to Services" },
  { id: "audit-rights", label: "Audit Rights" },
  { id: "government", label: "Government End Users" },
  { id: "miscellaneous", label: "Miscellaneous" },
];

const Terms = () => {
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

    // Non-passive wheel handler so we can prevent default and own the scroll.
    // This is required on macOS where the browser otherwise routes trackpad
    // wheel events to the document elastic scroll instead of this container.
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
        title="Terms of Service"
        description="Terms of Service for Haste.NYC LLC. Review our service agreement and usage policies."
        canonical="/terms"
      />
      <Header />

      {/* Viewport-height container below fixed header — normal flow so wheel events reach inner scroll */}
      <div className="h-[calc(100vh-3.5rem)] mt-14 flex flex-col items-center px-6 pb-8 overflow-hidden">
        {/* Centered column */}
        <div className="w-full max-w-4xl flex flex-col h-full">

          {/* Title area */}
          <div className="pt-10 pb-6">
            <h1 className="font-display text-4xl md:text-5xl font-normal text-foreground mb-2 uppercase tracking-wide">
              Terms of Service
            </h1>
            <p className="text-foreground/60 text-xs uppercase tracking-[0.15em] mb-1">
              Effective Date: February 18, 2026
            </p>
            <p className="text-foreground/60 text-xs uppercase tracking-[0.15em]">
              Last Updated: February 18, 2026
            </p>
          </div>

          {/* Row: nav to the left, scroll box to the right — both start at the same top */}
          <div className="flex flex-1 min-h-0">

            {/* Jump to section nav — sits to the left, top-aligned with scroll box */}
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

          {/* Scrollable terms content */}
          <div ref={scrollRef} className="flex-1 min-w-0 overflow-y-auto border border-foreground/10 rounded-lg">
          <div className="text-foreground/80 text-sm leading-relaxed uppercase tracking-[0.04em] space-y-8 p-6">
            <p className="font-medium text-foreground">
              Important: Please read these Terms of Service carefully before using any Haste.NYC software, services, or website. By accessing, downloading, installing, or using any Haste product, you acknowledge that you have read, understood, and agree to be bound by these terms. If you do not agree to these terms, do not use any Haste products or services.
            </p>

            <p>
              These Terms of Service ("Terms"), together with any applicable Product-Specific Terms, End User License Agreements ("EULA"), and our Privacy Policy (collectively, the "Agreement"), constitute a legally binding agreement between you ("User," "you," or "your") and Haste.NYC LLC, a limited liability company organized under the laws of the State of New York, United States ("Haste," "Company," "we," "us," or "our"). This Agreement governs your access to and use of all Haste websites, applications, software products (including but not limited to Conform Studio), cloud services, APIs, documentation, support forums, and any other services or content provided by Haste (collectively, the "Services and Software").
            </p>

            <p>
              By using the Services and Software, you affirm that you are at least eighteen (18) years of age and are fully able and competent to enter into this Agreement. If you are entering into this Agreement on behalf of a company, organization, or other legal entity, you represent and warrant that you have the authority to bind such entity to this Agreement, in which case "you" and "your" shall refer to such entity.
            </p>

            {/* Section 1 */}
            <div id="agreement">
              <h2 className="text-foreground font-medium mb-4 text-base">1. Your Agreement with Haste</h2>

              <div className="space-y-4">
                <div>
                  <h3 className="text-foreground font-medium mb-2">1.1 Choice of Law and Contracting Entity</h3>
                  <p>
                    Your relationship is with Haste.NYC LLC, a New York limited liability company. These Terms are governed by, and construed and interpreted in accordance with, the laws of the State of New York, United States, without regard to its conflict of law principles, except as preempted by federal law. You may have additional rights under your local law. We do not seek to limit those rights where it is prohibited to do so by applicable law.
                  </p>
                </div>

                <div>
                  <h3 className="text-foreground font-medium mb-2">1.2 Product-Specific Terms and End User License Agreement</h3>
                  <p className="mb-2">
                    Our Services and Software are licensed, not sold, to you, and may be subject to additional terms specific to particular products or services ("Product-Specific Terms" or "EULA"). In the event of any conflict between these General Terms and any Product-Specific Terms or EULA, the Product-Specific Terms or EULA shall govern with respect to those particular Services or Software. Product-Specific Terms may include but are not limited to:
                  </p>
                  <p>
                    (a) Conform Studio End User License Agreement; (b) Haste API Terms of Use; (c) Haste Cloud Services Terms; (d) Beta and Pre-Release Software Terms; and (e) any other supplemental terms provided with specific products or services.
                  </p>
                </div>

                <div>
                  <h3 className="text-foreground font-medium mb-2">1.3 Updates to Terms</h3>
                  <p>
                    We reserve the right to modify, amend, or update these Terms at any time in our sole discretion. Material changes will be communicated to you via email to the address associated with your account, through in-product notifications, or by posting a prominent notice on our website. Your continued use of the Services and Software after any such modification constitutes your acceptance of the modified Terms. Any changes to these Terms will not apply retroactively to disputes arising prior to the date of the modified Terms. We recommend that you review these Terms periodically. If you do not agree with the amended Terms, you must immediately discontinue your use of the Services and Software and, if applicable, cancel your subscription.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 2 */}
            <div id="intellectual-property">
              <h2 className="text-foreground font-medium mb-4 text-base">2. Intellectual Property Rights</h2>

              <div className="space-y-4">
                <div>
                  <h3 className="text-foreground font-medium mb-2">2.1 Ownership</h3>
                  <p>
                    All right, title, and interest in and to the Services and Software, including but not limited to all source code, object code, algorithms, data structures, user interfaces, visual designs, graphics, icons, documentation, databases, data compilations, trade secrets, inventions, patents, patent applications, copyrights, trademarks, service marks, trade names, trade dress, domain names, know-how, and all other intellectual property rights of any kind (collectively, "Intellectual Property Rights"), are and shall remain the exclusive property of Haste.NYC LLC and its licensors. The Services and Software are protected by copyright, trade secret, patent, and other intellectual property laws of the United States and international treaties.
                  </p>
                  <p className="mt-2">
                    Nothing in this Agreement transfers or conveys to you any ownership interest in or to the Services and Software, or any Intellectual Property Rights therein. You acknowledge that the Services and Software contain proprietary and confidential information that is protected by applicable intellectual property and other laws. All rights not expressly granted herein are reserved by Haste.
                  </p>
                </div>

                <div>
                  <h3 className="text-foreground font-medium mb-2">2.2 License Grant</h3>
                  <p>
                    Subject to your compliance with this Agreement and applicable law, Haste hereby grants you a limited, non-exclusive, non-transferable, non-sublicensable, revocable license to install, access, and use the Services and Software solely for your internal business or personal purposes, as authorized by the specific license type you have purchased or been granted. Each license is for a single user and a single installation unless otherwise specified in your license agreement. You may not share, transfer, or sublicense your license to any third party.
                  </p>
                </div>

                <div>
                  <h3 className="text-foreground font-medium mb-2">2.3 Trademarks</h3>
                  <p>
                    "Haste," "Haste.NYC," "Conform Studio," the Haste logo, and all related names, logos, product and service names, designs, and slogans are trademarks of Haste.NYC LLC or its affiliates or licensors. You may not use such marks without the prior written permission of Haste. All other names, logos, product and service names, designs, and slogans on the Services are the trademarks of their respective owners. Any unauthorized use of Haste trademarks may constitute a violation of federal and state trademark laws.
                  </p>
                </div>

                <div>
                  <h3 className="text-foreground font-medium mb-2">2.4 Copyright and DMCA</h3>
                  <p>
                    We respect the intellectual property rights of others and expect our users to do the same. In accordance with the Digital Millennium Copyright Act of 1998 ("DMCA"), 17 U.S.C. 512, we will respond expeditiously to claims of copyright infringement committed using our Services that are reported to our designated copyright agent. If you believe that your copyrighted work has been copied in a way that constitutes copyright infringement, please provide our copyright agent with the following information in writing: (a) an electronic or physical signature of the person authorized to act on behalf of the copyright owner; (b) a description of the copyrighted work; (c) a description of where the allegedly infringing material is located; (d) your contact information; (e) a statement that you have a good faith belief that the use is not authorized; and (f) a statement, under penalty of perjury, that the information is accurate and that you are authorized to act on behalf of the copyright owner. Our designated agent for notice of claims of copyright infringement can be reached at: legal@haste.nyc.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 3 */}
            <div id="restrictions">
              <h2 className="text-foreground font-medium mb-4 text-base">3. Restrictions on Use</h2>

              <div className="space-y-4">
                <div>
                  <h3 className="text-foreground font-medium mb-2">3.1 Prohibited Activities</h3>
                  <p className="mb-2">
                    You agree that you shall not, directly or indirectly, and shall not permit, encourage, assist, or enable any third party to:
                  </p>
                  <div className="space-y-2 pl-4">
                    <p>(a) Copy, reproduce, distribute, publicly display, publicly perform, republish, download, store, transmit, sell, resell, lease, rent, sublicense, or otherwise exploit any portion of the Services or Software, except as expressly permitted under this Agreement;</p>
                    <p>(b) Modify, adapt, translate, port, or create derivative works based upon the Services or Software, or any portion thereof;</p>
                    <p>(c) Reverse engineer, disassemble, decompile, decode, decrypt, or otherwise attempt to derive or gain unauthorized access to the source code, object code, underlying algorithms, data structures, ideas, concepts, processes, methods, techniques, or any other proprietary component of the Services or Software, whether in whole or in part, by any means whatsoever. This prohibition applies regardless of the method used, including but not limited to static analysis, dynamic analysis, binary translation, protocol analysis, monitoring or tracking inputs and outputs, memory inspection, network traffic analysis, API probing, or any other technique designed to discover, reproduce, or reconstruct any aspect of the Services or Software;</p>
                    <p>(d) Circumvent, disable, interfere with, or otherwise bypass any security, access control, technical protection measures, digital rights management, encryption, obfuscation, license management, or other protective mechanisms in the Services or Software, including but not limited to any code signing, license key validation, activation systems, telemetry, or anti-tampering measures;</p>
                    <p>(e) Use the Services or Software, or any content, data, output, or other information received or derived from the Services or Software, to directly or indirectly create, design, develop, train, test, validate, benchmark, or otherwise improve any machine learning model, artificial intelligence system, neural network, algorithm, architecture, dataset, or any competing product or service;</p>
                    <p>(f) Remove, alter, obscure, cover, or deface any proprietary notice, label, mark, serial number, trademark, copyright notice, confidentiality legend, or other designation on or within the Services or Software;</p>
                    <p>(g) Use the Services or Software in violation of any applicable law, rule, regulation, or governmental order, including but not limited to export control laws, sanctions, anti-corruption laws, data protection laws, and intellectual property laws;</p>
                    <p>(h) Access the Services or Software in order to build, assist in building, or contribute to a competitive product or service, or to benchmark, evaluate, or copy any features, functions, interface, content, or performance of the Services or Software;</p>
                    <p>(i) Use any data mining, scraping, crawling, harvesting, robot, spider, or other automated means to access, collect, copy, monitor, or extract data or content from the Services or Software;</p>
                    <p>(j) Attempt to gain unauthorized access to the Services or Software, other user accounts, computer systems, or networks connected to the Services or Software, through hacking, password mining, social engineering, or any other means;</p>
                    <p>(k) Transmit any virus, worm, trojan horse, ransomware, spyware, adware, or any other malicious or technologically harmful code, file, or program through the Services or Software;</p>
                    <p>(l) Interfere with, disrupt, degrade, impair, overburden, or compromise the integrity, performance, security, or proper functioning of the Services or Software, or any servers, networks, systems, or infrastructure used to provide them;</p>
                    <p>(m) Use the Services or Software to generate, distribute, or facilitate the generation or distribution of unsolicited or unauthorized advertising, promotional materials, spam, chain letters, pyramid schemes, or any other form of solicitation;</p>
                    <p>(n) Impersonate or misrepresent your identity, affiliation, or relationship with any person or entity in connection with your use of the Services or Software;</p>
                    <p>(o) Use the Services or Software as part of any outsourced service bureau, time-sharing arrangement, hosted service, application service provider offering, or managed services engagement for the benefit of third parties without our express prior written consent; or</p>
                    <p>(p) Construct, compile, or create any database, dataset, index, or collection of data using content from or about the Services or Software for the purpose of reverse engineering, competitive analysis, machine learning, or any unauthorized commercial purpose.</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-foreground font-medium mb-2">3.2 Decompilation Exception</h3>
                  <p>
                    To the extent that applicable law grants you the right to decompile or reverse engineer any portion of the Services or Software to obtain information necessary to render the licensed portions interoperable with independently created software, you must first submit a written request to Haste at legal@haste.nyc specifying the interoperability information you seek. Haste may, in its sole discretion, either provide such information to you directly or impose reasonable conditions, including without limitation a reasonable fee and confidentiality obligations, on any permitted decompilation. Any information obtained through such authorized decompilation may be used solely for interoperability purposes and may not be disclosed to any third party or used for any other purpose, including but not limited to creating a product that is substantially similar to or competitive with the Services or Software.
                  </p>
                </div>

                <div>
                  <h3 className="text-foreground font-medium mb-2">3.3 AI and Machine Learning Restrictions</h3>
                  <p>
                    Without limiting the generality of Section 3.1(e), you specifically agree that you shall not use any content, output, data, telemetry, metadata, behavioral patterns, user interface elements, workflow sequences, file format specifications, API responses, error messages, or any other information obtained from or generated by the Services or Software as training data, validation data, fine-tuning data, or otherwise in connection with any machine learning, deep learning, artificial intelligence, or automated decision-making system. This restriction applies to all forms of machine learning including but not limited to supervised learning, unsupervised learning, semi-supervised learning, reinforcement learning, transfer learning, and generative models.
                  </p>
                </div>

                <div>
                  <h3 className="text-foreground font-medium mb-2">3.4 Competitive Analysis Prohibition</h3>
                  <p>
                    You may not use the Services or Software, or any information derived therefrom, to monitor availability, performance, functionality, or for any benchmarking, competitive analysis, competitive intelligence, or commercial evaluation purposes. You may not publish or disclose to any third party any performance data, benchmarks, test results, or comparative analyses relating to the Services or Software without the prior written consent of Haste. Any unauthorized benchmarking, testing, or analysis shall be considered a material breach of this Agreement and may result in immediate termination of your license and pursuit of all available legal remedies.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 4 */}
            <div id="your-content">
              <h2 className="text-foreground font-medium mb-4 text-base">4. Your Content</h2>

              <div className="space-y-4">
                <div>
                  <h3 className="text-foreground font-medium mb-2">4.1 Ownership of Your Content</h3>
                  <p>
                    "Your Content" means any text, data, files, media, project files, timelines, sequences, metadata, or other materials that you upload, import, create, or process using the Services and Software. As between you and Haste, you retain all rights and ownership in Your Content. Haste does not claim any ownership rights to Your Content.
                  </p>
                </div>

                <div>
                  <h3 className="text-foreground font-medium mb-2">4.2 License to Your Content</h3>
                  <p>
                    Solely for the purpose of operating, providing, improving, and supporting the Services and Software, you grant Haste a non-exclusive, worldwide, royalty-free, fully-paid license to access, store, reproduce, cache, process, and create derivative works of Your Content as necessary to provide the Services and Software to you (for example, to process your project files for format conversion, generate previews, or create backups). This license is limited to the purposes described and does not grant Haste any right to sell, distribute, publicly display, or commercially exploit Your Content.
                  </p>
                </div>

                <div>
                  <h3 className="text-foreground font-medium mb-2">4.3 Responsibility for Your Content</h3>
                  <p>
                    You are solely responsible for Your Content and the consequences of uploading, importing, or processing it through the Services and Software. You represent and warrant that (a) you have all necessary rights, licenses, consents, and permissions to use Your Content and to grant the license described in Section 4.2; (b) Your Content does not infringe, misappropriate, or violate any third party's intellectual property rights, privacy rights, publicity rights, or other rights; and (c) Your Content complies with all applicable laws, rules, and regulations.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 5 */}
            <div id="account-security">
              <h2 className="text-foreground font-medium mb-4 text-base">5. Account and Security</h2>

              <div className="space-y-4">
                <div>
                  <h3 className="text-foreground font-medium mb-2">5.1 Account Registration</h3>
                  <p>
                    You may be required to create an account to access certain Services and Software. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete. You are solely responsible for safeguarding the confidentiality of your account credentials and for all activity that occurs under your account.
                  </p>
                </div>

                <div>
                  <h3 className="text-foreground font-medium mb-2">5.2 Account Security</h3>
                  <p>
                    You agree to immediately notify Haste of any unauthorized use of your account or any other breach of security of which you become aware. Haste will not be liable for any loss or damage arising from your failure to comply with this Section 5.2. Haste may require you to enable multi-factor authentication or other security measures at any time.
                  </p>
                </div>

                <div>
                  <h3 className="text-foreground font-medium mb-2">5.3 Account Inactivity</h3>
                  <p>
                    For free or trial accounts, if your account remains inactive for a period of twelve (12) consecutive months, Haste reserves the right to deactivate or delete your account and any associated Content after providing reasonable notice to you.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 6 */}
            <div id="fees-payment">
              <h2 className="text-foreground font-medium mb-4 text-base">6. Fees, Payment, and Taxes</h2>

              <div className="space-y-4">
                <div>
                  <h3 className="text-foreground font-medium mb-2">6.1 Fees</h3>
                  <p>
                    You agree to pay all fees and charges associated with your use of the Services and Software in accordance with the pricing and payment terms presented to you at the time of purchase. All fees are non-refundable except as expressly set forth in this Agreement or as required by applicable law.
                  </p>
                </div>

                <div>
                  <h3 className="text-foreground font-medium mb-2">6.2 Taxes</h3>
                  <p>
                    You are responsible for all applicable taxes, duties, levies, and similar governmental charges arising from your purchase or use of the Services and Software (excluding taxes based on Haste's net income). If Haste is required to collect or remit any such taxes, the appropriate amount will be invoiced to and paid by you.
                  </p>
                </div>

                <div>
                  <h3 className="text-foreground font-medium mb-2">6.3 Price Changes</h3>
                  <p>
                    Haste reserves the right to change the fees for any Services and Software at any time upon reasonable notice to you. Price changes will become effective at the start of the next billing cycle following the date of the price change. Your continued use of the Services and Software after any price change constitutes your agreement to pay the modified fees.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 7 */}
            <div id="confidentiality">
              <h2 className="text-foreground font-medium mb-4 text-base">7. Confidentiality</h2>
              <p>
                You acknowledge that the Services and Software contain trade secrets and confidential proprietary information of Haste and its licensors ("Confidential Information"), including but not limited to source code, object code, algorithms, data structures, database schemas, API specifications, protocols, file format specifications, performance data, user interface designs, workflow methodologies, documentation, business plans, pricing, customer lists, and technical know-how. You agree to hold all Confidential Information in strict confidence, to use it only as authorized under this Agreement, and to protect it with at least the same degree of care that you use to protect your own confidential information, but in no event less than reasonable care. You shall not disclose any Confidential Information to any third party without the prior written consent of Haste.
              </p>
            </div>

            {/* Section 8 */}
            <div id="warranty">
              <h2 className="text-foreground font-medium mb-4 text-base">8. Warranty Disclaimers</h2>
              <p>
                The Services and Software are provided "as is" and "as available," with all faults and without warranty of any kind. To the maximum extent permitted by applicable law, Haste and its affiliates, licensors, suppliers, and service providers (collectively, the "Covered Parties") expressly disclaim all warranties, whether express, implied, statutory, or otherwise, including but not limited to the implied warranties of merchantability, fitness for a particular purpose, title, non-infringement, accuracy, reliability, completeness, quiet enjoyment, and any warranties arising from course of dealing, usage of trade, or course of performance.
              </p>
              <p className="mt-2">
                The Covered Parties do not warrant that (a) the Services and Software will meet your requirements or expectations; (b) the Services and Software will be uninterrupted, timely, secure, error-free, or free of viruses or other harmful components; (c) the results obtained from the use of the Services and Software will be accurate, reliable, or complete; (d) any defects or errors in the Services and Software will be corrected; or (e) the Services and Software will be compatible with any third-party software, hardware, or systems. Your use of the Services and Software is at your sole risk.
              </p>
            </div>

            {/* Section 9 */}
            <div id="liability">
              <h2 className="text-foreground font-medium mb-4 text-base">9. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by applicable law, in no event shall the Covered Parties be liable to you or any third party for any indirect, incidental, special, consequential, exemplary, or punitive damages of any kind, including but not limited to damages for loss of profits, revenue, business, goodwill, data, use, or other intangible losses, regardless of the cause of action or the theory of liability (whether in contract, tort, negligence, strict liability, product liability, or otherwise), even if the Covered Parties have been advised of the possibility of such damages.
              </p>
              <p className="mt-2">
                The total aggregate liability of the Covered Parties arising out of or relating to this Agreement or your use of the Services and Software shall not exceed the greater of (a) one hundred U.S. dollars (US $100.00); or (b) the total amount you paid to Haste for the specific Services or Software giving rise to the claim during the twelve (12) month period immediately preceding the event giving rise to such liability. The existence of multiple claims shall not enlarge this limitation. Nothing in this Agreement limits or excludes liability for (i) death or personal injury caused by negligence; (ii) fraud or fraudulent misrepresentation; or (iii) any other liability that cannot be limited or excluded by applicable law.
              </p>
            </div>

            {/* Section 10 */}
            <div id="indemnification">
              <h2 className="text-foreground font-medium mb-4 text-base">10. Indemnification</h2>
              <p>
                You agree to indemnify, defend, and hold harmless Haste and its affiliates, officers, directors, employees, agents, licensors, suppliers, and service providers from and against any and all claims, actions, demands, liabilities, damages, losses, costs, and expenses (including reasonable attorneys' fees and court costs) arising out of or relating to: (a) your use or misuse of the Services and Software; (b) Your Content; (c) your violation of this Agreement; (d) your violation of any applicable law, rule, or regulation; or (e) your violation of any rights of a third party. Haste reserves the right, at its own expense, to assume the exclusive defense and control of any matter otherwise subject to indemnification by you, in which event you will cooperate with Haste in asserting any available defenses.
              </p>
            </div>

            {/* Section 11 */}
            <div id="termination">
              <h2 className="text-foreground font-medium mb-4 text-base">11. Termination</h2>

              <div className="space-y-4">
                <div>
                  <h3 className="text-foreground font-medium mb-2">11.1 Termination by You</h3>
                  <p>
                    You may terminate this Agreement at any time by ceasing all use of the Services and Software and, if applicable, canceling your subscription in accordance with the applicable cancellation procedures. Cancellation or termination does not relieve you of any obligation to pay outstanding fees.
                  </p>
                </div>

                <div>
                  <h3 className="text-foreground font-medium mb-2">11.2 Termination by Haste</h3>
                  <p>
                    Haste may terminate or suspend your access to the Services and Software immediately, without prior notice or liability, if: (a) you breach any provision of this Agreement; (b) you fail to make timely payment of any fees; (c) your use of the Services or Software poses a security risk or may adversely affect the Services, Software, or other users; (d) such action is required by applicable law or governmental order; (e) Haste elects to discontinue the Services or Software in whole or in part; or (f) for any other reason in Haste's sole discretion upon thirty (30) days' prior written notice.
                  </p>
                </div>

                <div>
                  <h3 className="text-foreground font-medium mb-2">11.3 Effect of Termination</h3>
                  <p>
                    Upon termination of this Agreement for any reason: (a) all licenses granted to you hereunder shall immediately cease; (b) you must immediately cease all use of the Services and Software and destroy all copies in your possession or control; (c) you must return or destroy all Confidential Information; and (d) Haste may delete your account and any associated Content after thirty (30) days. Sections 2 (Intellectual Property Rights), 3 (Restrictions on Use), 7 (Confidentiality), 8 (Warranty Disclaimers), 9 (Limitation of Liability), 10 (Indemnification), 12 (Dispute Resolution), and any other provisions that by their nature should survive, shall survive any termination or expiration of this Agreement.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 12 */}
            <div id="dispute-resolution">
              <h2 className="text-foreground font-medium mb-4 text-base">12. Dispute Resolution and Arbitration</h2>

              <div className="space-y-4">
                <div>
                  <h3 className="text-foreground font-medium mb-2">12.1 Informal Resolution</h3>
                  <p>
                    Before initiating any formal dispute resolution proceedings, you agree to first attempt to resolve any dispute, claim, or controversy arising out of or relating to this Agreement informally by contacting Haste at legal@haste.nyc with a written description of the dispute, including the nature and basis of your claim and the relief you seek. If any dispute is not resolved within thirty (30) days of receipt of such notice, either party may proceed to formal resolution as set forth below.
                  </p>
                </div>

                <div>
                  <h3 className="text-foreground font-medium mb-2">12.2 Binding Arbitration</h3>
                  <p>
                    Any dispute, controversy, or claim arising out of or relating to this Agreement, or the breach, termination, enforcement, interpretation, or validity thereof, that is not resolved through the informal process described in Section 12.1, shall be finally resolved by binding arbitration administered by the American Arbitration Association ("AAA") in accordance with its Commercial Arbitration Rules. The arbitration shall be conducted by a single arbitrator in New York County, New York, United States. The arbitrator shall have the authority to grant any remedy or relief that would be available in a court of competent jurisdiction. The arbitrator's award shall be binding and may be entered as a judgment in any court of competent jurisdiction.
                  </p>
                </div>

                <div>
                  <h3 className="text-foreground font-medium mb-2">12.3 Class Action Waiver</h3>
                  <p>
                    You agree that any dispute resolution proceedings will be conducted only on an individual basis and not in a class, consolidated, or representative action. You waive any right to participate in a class action lawsuit or class-wide arbitration. If for any reason a claim proceeds in court rather than in arbitration, each party waives any right to a jury trial.
                  </p>
                </div>

                <div>
                  <h3 className="text-foreground font-medium mb-2">12.4 Injunctive Relief</h3>
                  <p>
                    Notwithstanding the foregoing, Haste shall be entitled to seek injunctive or other equitable relief in any court of competent jurisdiction to prevent the actual or threatened infringement, misappropriation, or violation of Haste's Intellectual Property Rights, Confidential Information, or other proprietary rights, without the requirement of posting a bond or other security and without the necessity of proving actual damages. Such injunctive relief shall be in addition to, and not in limitation of, any other rights or remedies available to Haste.
                  </p>
                </div>

                <div>
                  <h3 className="text-foreground font-medium mb-2">12.5 Limitation Period</h3>
                  <p>
                    Any claim or cause of action arising out of or related to this Agreement or the Services and Software must be filed within one (1) year after the date on which such claim or cause of action arose. Claims filed after this one-year limitation period are permanently barred.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 13 */}
            <div id="export-controls">
              <h2 className="text-foreground font-medium mb-4 text-base">13. Export Controls and Trade Compliance</h2>
              <p>
                The Services and Software may be subject to U.S. and international export control laws and regulations, including the Export Administration Regulations ("EAR"), International Traffic in Arms Regulations ("ITAR"), and economic sanctions administered by the U.S. Department of the Treasury's Office of Foreign Assets Control ("OFAC"). You agree to comply with all applicable export control and sanctions laws and regulations. You represent and warrant that you are not located in, under the control of, or a national or resident of any country subject to comprehensive U.S. sanctions, and that you are not on any U.S. government denied parties list.
              </p>
            </div>

            {/* Section 14 */}
            <div id="updates">
              <h2 className="text-foreground font-medium mb-4 text-base">14. Updates and Modifications to Services</h2>
              <p>
                Haste may, in its sole discretion, modify, update, enhance, or discontinue any portion of the Services and Software at any time, with or without notice. Such changes may include but are not limited to adding or removing features, changing system requirements, modifying file format specifications, updating user interfaces, or discontinuing legacy support. Haste shall not be liable to you or any third party for any such modification, suspension, or discontinuance. For paid subscriptions, Haste will make reasonable efforts to notify you of material changes that may adversely affect your use of the Services and Software.
              </p>
            </div>

            {/* Section 15 */}
            <div id="audit-rights">
              <h2 className="text-foreground font-medium mb-4 text-base">15. Audit Rights</h2>
              <p>
                Haste reserves the right, upon at least seven (7) days' prior written notice, to audit your use of the Services and Software to verify compliance with this Agreement. You agree to provide reasonable cooperation and access to records necessary to conduct such audit. If any audit reveals that your use exceeds the scope of your license, you shall promptly pay for any additional licenses required, together with any associated costs of the audit if the underpayment exceeds five percent (5%) of the amount owed.
              </p>
            </div>

            {/* Section 16 */}
            <div id="government">
              <h2 className="text-foreground font-medium mb-4 text-base">16. Government End Users</h2>
              <p>
                If you are a U.S. Government end user, the Services and Software are "commercial computer software" and "commercial computer software documentation" as those terms are defined in 48 C.F.R. 2.101, and are provided with restricted rights. Use, duplication, or disclosure by the U.S. Government is subject to the restrictions set forth in 48 C.F.R. 12.212 or 48 C.F.R. 227.7202-1 through 227.7202-4, as applicable. The manufacturer is Haste.NYC LLC.
              </p>
            </div>

            {/* Section 17 */}
            <div id="miscellaneous">
              <h2 className="text-foreground font-medium mb-4 text-base">17. Miscellaneous</h2>

              <div className="space-y-4">
                <div>
                  <h3 className="text-foreground font-medium mb-2">17.1 Entire Agreement</h3>
                  <p>
                    This Agreement, together with all incorporated documents, constitutes the entire agreement between you and Haste with respect to the subject matter hereof and supersedes all prior or contemporaneous communications, proposals, and agreements, whether oral or written.
                  </p>
                </div>

                <div>
                  <h3 className="text-foreground font-medium mb-2">17.2 Severability</h3>
                  <p>
                    If any provision of this Agreement is held to be invalid, illegal, or unenforceable by a court of competent jurisdiction, such provision shall be enforced to the maximum extent permissible and the remaining provisions shall continue in full force and effect.
                  </p>
                </div>

                <div>
                  <h3 className="text-foreground font-medium mb-2">17.3 No Waiver</h3>
                  <p>
                    The failure of Haste to exercise or enforce any right or provision of this Agreement shall not constitute a waiver of such right or provision. No waiver shall be effective unless made in writing and signed by an authorized representative of Haste.
                  </p>
                </div>

                <div>
                  <h3 className="text-foreground font-medium mb-2">17.4 Assignment</h3>
                  <p>
                    You may not assign, transfer, delegate, or sublicense any of your rights or obligations under this Agreement without the prior written consent of Haste. Haste may freely assign or transfer this Agreement without your consent. Any attempted assignment in violation of this Section shall be null and void.
                  </p>
                </div>

                <div>
                  <h3 className="text-foreground font-medium mb-2">17.5 Force Majeure</h3>
                  <p>
                    Neither party shall be liable for any delay or failure in performance (other than payment obligations) resulting from causes beyond its reasonable control, including but not limited to acts of God, natural disasters, war, terrorism, riots, epidemics, pandemics, embargoes, acts of civil or military authorities, fire, floods, labor disputes, power or internet failures, or governmental actions.
                  </p>
                </div>

                <div>
                  <h3 className="text-foreground font-medium mb-2">17.6 Notices</h3>
                  <p>
                    All legal notices required or permitted under this Agreement shall be in writing and shall be deemed given when delivered personally, sent by certified or registered mail (return receipt requested), or sent by overnight courier to Haste.NYC LLC at the following address: Haste.NYC LLC, 555 Morgan Avenue, #2, Brooklyn, New York 11222, United States; or by email to legal@haste.nyc. We may provide notice to you at the email address associated with your account.
                  </p>
                </div>

                <div>
                  <h3 className="text-foreground font-medium mb-2">17.7 Independent Contractors</h3>
                  <p>
                    Nothing in this Agreement shall be construed to create any agency, partnership, joint venture, or employment relationship between you and Haste. The parties are independent contractors.
                  </p>
                </div>

                <div>
                  <h3 className="text-foreground font-medium mb-2">17.8 English Language</h3>
                  <p>
                    The English language version of this Agreement shall be the controlling version regardless of any translation(s) made for any purpose.
                  </p>
                </div>

                <div>
                  <h3 className="text-foreground font-medium mb-2">17.9 Headings</h3>
                  <p>
                    Section headings are for reference purposes only and shall not affect the interpretation or construction of this Agreement.
                  </p>
                </div>
              </div>
            </div>

            {/* Divider and Contact */}
            <div className="border-t border-foreground/20 pt-8">
              <p>
                If you have any questions about these Terms of Service, please contact us at legal@haste.nyc.
              </p>
              <p className="mt-4 text-foreground/60">
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

export default Terms;
