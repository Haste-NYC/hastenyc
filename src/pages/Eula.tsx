import { useRef, useCallback, useState, useEffect } from "react";
import Header from "@/components/Header";
import SEO from "@/components/SEO";

const sections = [
  { id: "definitions", label: "Definitions" },
  { id: "license-grant", label: "License Grant" },
  { id: "restrictions", label: "Restrictions on Use" },
  { id: "activation", label: "Software Activation and License Verification" },
  { id: "updates", label: "Updates and Modifications" },
  { id: "intellectual-property", label: "Intellectual Property and Ownership" },
  { id: "confidentiality", label: "Confidentiality and Trade Secrets" },
  { id: "usage-monitoring", label: "Usage Monitoring, Telemetry, and Data Collection" },
  { id: "compliance", label: "License Compliance, Audit, and Enforcement" },
  { id: "warranty", label: "Warranty Disclaimer" },
  { id: "liability", label: "Limitation of Liability" },
  { id: "indemnification", label: "Indemnification" },
  { id: "termination", label: "Termination" },
  { id: "dispute-resolution", label: "Dispute Resolution" },
  { id: "general", label: "General Provisions" },
];

const Eula = () => {
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
        title="License Agreement"
        description="End User License Agreement for Conform Studio by Haste.NYC LLC."
        canonical="/eula"
      />
      <Header />

      <div className="h-[calc(100vh-3.5rem)] mt-14 flex flex-col items-center px-6 pb-8 overflow-hidden">
        <div className="w-full max-w-4xl flex flex-col h-full">

          {/* Title area */}
          <div className="pt-10 pb-6">
            <h1 className="font-display text-4xl md:text-5xl font-normal text-foreground mb-2 uppercase tracking-wide">
              End User License Agreement
            </h1>
            <p className="text-foreground/60 text-xs uppercase tracking-[0.15em] mb-1">
              Conform Studio — Effective Date: February 18, 2026
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

          {/* Scrollable EULA content */}
          <div ref={scrollRef} className="flex-1 min-w-0 overflow-y-auto border border-foreground/10 rounded-lg">
          <div className="text-foreground/80 text-sm leading-relaxed uppercase tracking-[0.04em] space-y-8 p-6">

            <p className="font-medium text-foreground">
              Important — Read carefully before installing, copying, or using this software. By clicking "I Accept," downloading, installing, activating, or using Conform Studio, you acknowledge that you have read this End User License Agreement ("EULA"), understand it, and agree to be bound by its terms and conditions. If you do not agree to the terms of this EULA, do not install, activate, or use the Software. You may return the Software to the place of purchase for a full refund within thirty (30) days of purchase.
            </p>

            <p>
              This End User License Agreement ("EULA" or "Agreement") is a legally binding contract between you (either an individual or a single legal entity, "Licensee," "you," or "your") and Haste.NYC LLC, a limited liability company organized under the laws of the State of New York, United States ("Haste," "Licensor," "Company," "we," "us," or "our"), governing your use of Conform Studio software, including all associated media, printed materials, online or electronic documentation, updates, patches, hotfixes, and any related services (collectively, the "Software").
            </p>

            <p>
              This EULA supplements and is incorporated into the Haste.NYC Terms of Service (available at https://www.haste.nyc/terms) and Privacy Policy (available at https://www.haste.nyc/privacy). In the event of a conflict between this EULA and the Terms of Service, this EULA shall govern with respect to the Software. Capitalized terms not defined herein have the meanings given in the Terms of Service.
            </p>

            {/* Section 1 */}
            <div id="definitions">
              <h2 className="text-foreground font-medium mb-4 text-base">1. Definitions</h2>
              <p className="mb-4">The following definitions shall apply throughout this Agreement:</p>
              <div className="space-y-4">
                <p><span className="text-foreground font-medium">"Authorized User"</span> means an individual natural person who is expressly authorized under the applicable License Tier to access and use the Software. For Freelancer Tier licenses, the Authorized User is the individual subscriber. For Enterprise Tier licenses, Authorized Users are the specific individuals designated by the Enterprise licensee in accordance with the terms of their Enterprise agreement.</p>
                <p><span className="text-foreground font-medium">"Commercial Entity"</span> means any corporation, limited liability company, partnership, sole proprietorship, joint venture, government agency, or other business organization, including any subsidiary, parent company, affiliate, division, or department thereof, that (a) employs or engages five (5) or more individuals (whether full-time, part-time, contract, or freelance); or (b) generates annual gross revenue exceeding Two Hundred Fifty Thousand U.S. Dollars (US $250,000); or (c) operates as a post-production facility, broadcast network, streaming platform, studio, production company, media conglomerate, or advertising agency; or (d) uses the Software to process, conform, or migrate projects on behalf of third-party clients in exchange for compensation.</p>
                <p><span className="text-foreground font-medium">"Enterprise Tier"</span> means the license tier designed for Commercial Entities, teams, departments, and organizations requiring multi-user access, volume processing, or use of the Software in a commercial production environment. Enterprise Tier licenses are subject to separate Enterprise licensing agreements and pricing as determined by Haste.</p>
                <p><span className="text-foreground font-medium">"Freelancer Tier"</span> means the individual, single-user self-service subscription license tier available through the Haste website at a monthly subscription rate, designed exclusively for use by a single natural person operating as an independent freelance professional and not acting on behalf of, or for the primary benefit of, a Commercial Entity.</p>
                <p><span className="text-foreground font-medium">"License Key"</span> means the unique alphanumeric code, activation token, credential, or digital entitlement issued by Haste that enables access to and use of the Software under the applicable License Tier.</p>
                <p><span className="text-foreground font-medium">"License Tier"</span> means the specific category of license under which the Software is licensed to you, as determined at the time of purchase or subscription. Current License Tiers include the Freelancer Tier and the Enterprise Tier, each with distinct usage rights, restrictions, and pricing as described in this EULA and on the Haste website.</p>
                <p><span className="text-foreground font-medium">"Project"</span> means a discrete editorial timeline, sequence, composition, or conform operation processed through the Software.</p>
                <p><span className="text-foreground font-medium">"Usage Data"</span> means telemetry, diagnostic information, and usage metrics collected by the Software as described in Section 8 of this EULA, including but not limited to Project volume, processing frequency, file sizes, session duration, feature utilization, and operational patterns.</p>
              </div>
            </div>

            {/* Section 2 */}
            <div id="license-grant">
              <h2 className="text-foreground font-medium mb-4 text-base">2. License Grant</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-foreground font-medium mb-2">2.1 Grant of License</h3>
                  <p>Subject to your compliance with all terms and conditions of this EULA and payment of all applicable fees, Haste hereby grants you a limited, non-exclusive, non-transferable, non-sublicensable, revocable license to install and use the Software on compatible devices solely in accordance with the permissions and restrictions of your applicable License Tier, the documentation, and this EULA. The Software is licensed, not sold. Haste and its licensors retain all right, title, and interest in and to the Software, including all Intellectual Property Rights therein.</p>
                </div>
                <div>
                  <h3 className="text-foreground font-medium mb-2">2.2 License Tiers and Permitted Use</h3>
                  <p className="mb-3">Your rights to use the Software are strictly limited to those granted by your License Tier. Using the Software outside the scope of your License Tier constitutes a material breach of this EULA and may result in immediate termination, retroactive billing, and pursuit of all available legal remedies.</p>
                  <div className="space-y-3 pl-4">
                    <div>
                      <h4 className="text-foreground font-medium mb-2">2.2.1 Freelancer Tier</h4>
                      <p className="mb-2">The Freelancer Tier license grants a single natural person the right to install and use one (1) copy of the Software on up to two (2) devices owned or controlled by that individual, provided that the Software is not used simultaneously on more than one (1) device at any given time. The Freelancer Tier is subject to the following conditions and restrictions:</p>
                      <div className="space-y-2">
                        <p>(a) <span className="text-foreground font-medium">Individual Use Only.</span> The Freelancer Tier license is intended exclusively for use by a single individual acting as an independent freelance professional. The Licensee must be a natural person, not a Commercial Entity. You may not register for, maintain, or use a Freelancer Tier license if you are a Commercial Entity or if the Software will be used primarily for the benefit of, at the direction of, or on behalf of a Commercial Entity.</p>
                        <p>(b) <span className="text-foreground font-medium">No Shared or Pooled Access.</span> The Freelancer Tier license may not be shared with, transferred to, or used by any other individual. You may not allow any other person to access or operate the Software using your License Key, account credentials, or activation. Sharing credentials or License Keys constitutes a material breach of this EULA.</p>
                        <p>(c) <span className="text-foreground font-medium">Volume Limitations.</span> The Freelancer Tier is designed for individual freelance workloads. Haste reserves the right to establish and enforce reasonable usage thresholds that reflect typical individual freelance use. Usage patterns that are materially inconsistent with individual freelance use — including but not limited to sustained high-volume processing, batch automation at commercial scale, or processing volumes typical of a post-production facility, department, or team — may indicate a violation of this License Tier and may trigger a license review as described in Section 9.</p>
                        <p>(d) <span className="text-foreground font-medium">No Enterprise Circumvention.</span> You may not use one or more Freelancer Tier licenses as a substitute for, or to avoid the purchase of, an Enterprise Tier license. The following activities are expressly prohibited under the Freelancer Tier: (i) Using the Software to process Projects on behalf of a Commercial Entity as an employee, contractor, consultant, or agent unless acting as an independent freelancer; (ii) Procuring multiple Freelancer Tier licenses for employees or agents of a single Commercial Entity to avoid Enterprise Tier pricing; (iii) Rotating a single Freelancer Tier license among multiple individuals; (iv) Installing or operating the Software on hardware owned or controlled by a Commercial Entity under a Freelancer Tier license; (v) Using the Software in any production pipeline or batch processing system operated by or for a Commercial Entity; or (vi) Any other arrangement whose primary purpose is to obtain Software functionality at Freelancer Tier pricing for a Commercial Entity.</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-foreground font-medium mb-2">2.2.2 Enterprise Tier</h4>
                      <p className="mb-2">The Enterprise Tier license grants a Commercial Entity the right to install and use the Software across its organization in accordance with the specific terms, seat counts, usage allocations, and conditions set forth in a separate Enterprise License Agreement. Enterprise Tier licenses include: (a) Multi-User Access for multiple Authorized Users subject to seat limits; (b) Volume Processing for high-volume commercial production workflows; (c) Priority customer support and dedicated account management; (d) Custom contractual terms, SLAs, and data processing agreements; and (e) Pricing based on scope of use, Authorized Users, and processing volume. For Enterprise pricing inquiries, contact licensing@haste.nyc.</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-foreground font-medium mb-2">2.3 License Tier Determination</h3>
                  <p className="mb-2">If there is any question as to whether your use requires a Freelancer Tier or Enterprise Tier license, the following rules apply:</p>
                  <div className="space-y-2 pl-4">
                    <p>(a) If you are a natural person operating independently as a freelancer for your own individual freelance work, you are eligible for the Freelancer Tier.</p>
                    <p>(b) If you are a Commercial Entity, or if the Software is being used primarily for the benefit of a Commercial Entity, you must obtain an Enterprise Tier license.</p>
                    <p>(c) If your usage patterns are materially inconsistent with the Freelancer Tier, Haste may determine that your use requires an Enterprise Tier license.</p>
                    <p>(d) In the event of any dispute regarding License Tier classification, the determination of Haste shall be final and binding, subject to dispute resolution through the procedures in the Terms of Service.</p>
                    <p>(e) If you are uncertain whether your use requires a Freelancer Tier or Enterprise Tier license, contact Haste at licensing@haste.nyc before purchasing or activating a license.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3 */}
            <div id="restrictions">
              <h2 className="text-foreground font-medium mb-4 text-base">3. Restrictions on Use</h2>
              <p className="mb-4">In addition to the restrictions in the Haste.NYC Terms of Service (incorporated herein by reference), you agree that you shall not, and shall not permit any third party to:</p>
              <div className="space-y-2 pl-4">
                <p>(a) Install, use, or activate the Software on more devices than permitted by your License Tier;</p>
                <p>(b) Share, loan, rent, lease, sublicense, distribute, or otherwise make the Software or any License Key available to any unauthorized person or entity;</p>
                <p>(c) Use the Software under a License Tier for which you are not eligible, including using a Freelancer Tier license for purposes that require an Enterprise Tier license;</p>
                <p>(d) Copy, reproduce, or duplicate the Software, in whole or in part, except for a single backup copy for archival purposes;</p>
                <p>(e) Modify, adapt, translate, port, or create derivative works based upon the Software;</p>
                <p>(f) Reverse engineer, disassemble, decompile, decode, decrypt, or otherwise attempt to derive the source code, underlying algorithms, data structures, file format specifications, or any other proprietary component of the Software by any means;</p>
                <p>(g) Circumvent, disable, tamper with, or bypass any license management, activation, copy protection, usage monitoring, telemetry, digital rights management, or other technological protection measures in the Software;</p>
                <p>(h) Remove, alter, obscure, or deface any proprietary notices, labels, trademarks, watermarks, serial numbers, or license information in or on the Software;</p>
                <p>(i) Use the Software to develop, train, test, benchmark, or improve any competing product, service, or technology;</p>
                <p>(j) Use any content, output, data, logs, or information generated by or derived from the Software to train, validate, or improve any machine learning model, artificial intelligence system, or automated decision-making system;</p>
                <p>(k) Use the Software in any service bureau, time-sharing, outsourcing, or managed services arrangement for the benefit of third parties without an appropriate Enterprise Tier license;</p>
                <p>(l) Transfer, assign, or sublicense your license or License Key to any other person or entity without the prior written consent of Haste;</p>
                <p>(m) Use the Software in violation of any applicable law, regulation, or governmental order; or</p>
                <p>(n) Attempt to do, or assist or encourage any third party to do, any of the foregoing.</p>
              </div>
            </div>

            {/* Section 4 */}
            <div id="activation">
              <h2 className="text-foreground font-medium mb-4 text-base">4. Software Activation and License Verification</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-foreground font-medium mb-2">4.1 Activation</h3>
                  <p>The Software requires activation with a valid License Key and may require periodic online verification to confirm the validity and scope of your license. You agree to provide accurate and complete information during the activation process. The Software may be limited or non-functional without successful activation.</p>
                </div>
                <div>
                  <h3 className="text-foreground font-medium mb-2">4.2 Online Verification</h3>
                  <p>The Software may periodically communicate with Haste servers to verify license validity, confirm License Tier compliance, deliver updates, and transmit Usage Data as described in Section 8. You agree to maintain an Internet connection sufficient to permit such communications. If the Software is unable to verify your license for a period exceeding thirty (30) consecutive days, the Software may enter a reduced-functionality mode until verification is successfully completed.</p>
                </div>
                <div>
                  <h3 className="text-foreground font-medium mb-2">4.3 License Integrity</h3>
                  <p>You agree not to circumvent, disable, interfere with, or manipulate any license verification, activation, or compliance mechanisms in the Software. Any attempt to spoof, forge, clone, or otherwise manipulate License Keys, activation tokens, device identifiers, usage metrics, or telemetry data constitutes a material breach of this EULA and may result in immediate termination of your license and pursuit of all available legal remedies, including claims for fraud and misappropriation.</p>
                </div>
              </div>
            </div>

            {/* Section 5 */}
            <div id="updates">
              <h2 className="text-foreground font-medium mb-4 text-base">5. Updates and Modifications</h2>
              <p>Haste may, from time to time and at its sole discretion, develop and provide Software updates, which may include bug fixes, patches, feature enhancements, new features, new modules, updated documentation, and system requirement changes (collectively, "Updates"). Updates may be automatically downloaded and installed without additional notice to you. You agree that Haste has no obligation to provide any Updates or to continue to provide or enable any particular feature or functionality of the Software. All Updates shall be deemed part of the Software and subject to this EULA.</p>
            </div>

            {/* Section 6 */}
            <div id="intellectual-property">
              <h2 className="text-foreground font-medium mb-4 text-base">6. Intellectual Property and Ownership</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-foreground font-medium mb-2">6.1 Haste Ownership</h3>
                  <p>The Software is the valuable intellectual property of Haste.NYC LLC and its licensors. All right, title, and interest in and to the Software, including all source code, object code, algorithms, data structures, user interfaces, visual designs, file format specifications, databases, documentation, trade secrets, inventions, patents, patent applications, copyrights, trademarks, service marks, trade names, trade dress, and all other Intellectual Property Rights, are and shall remain the exclusive property of Haste and its licensors. The Software is protected by the copyright laws of the United States and international copyright treaties, as well as other intellectual property laws and treaties.</p>
                </div>
                <div>
                  <h3 className="text-foreground font-medium mb-2">6.2 Your Content</h3>
                  <p>As between you and Haste, you retain all rights in the project files, media, timelines, sequences, and other content that you process through the Software ("Your Content"). Haste does not claim ownership of Your Content. The license you grant to Haste with respect to Your Content is limited to what is necessary to provide, operate, and improve the Software and Services as described in the Terms of Service.</p>
                </div>
                <div>
                  <h3 className="text-foreground font-medium mb-2">6.3 Feedback</h3>
                  <p>Any feedback, suggestions, ideas, enhancement requests, recommendations, or other information you provide regarding the Software ("Feedback") shall be deemed non-confidential, and Haste shall be free to use, reproduce, disclose, and exploit such Feedback without restriction or obligation of any kind.</p>
                </div>
              </div>
            </div>

            {/* Section 7 */}
            <div id="confidentiality">
              <h2 className="text-foreground font-medium mb-4 text-base">7. Confidentiality and Trade Secrets</h2>
              <p className="mb-4">You acknowledge that the Software embodies valuable trade secrets and confidential proprietary information of Haste and its licensors ("Confidential Information"), including but not limited to: source code, object code, algorithms, data structures, processing methods, conversion techniques, file format parsers, metadata handling routines, timeline reconstruction logic, conform algorithms, user interface designs, API specifications, database schemas, and all related technical and business information. You agree to:</p>
              <div className="space-y-2 pl-4">
                <p>(a) Hold all Confidential Information in strict confidence using at least the same degree of care you use to protect your own most sensitive confidential information, but in no event less than reasonable care;</p>
                <p>(b) Not disclose, publish, disseminate, or otherwise make available any Confidential Information to any third party without the prior written consent of Haste;</p>
                <p>(c) Not use any Confidential Information for any purpose other than exercising your rights under this EULA;</p>
                <p>(d) Not reverse engineer, analyze, or study the Software for the purpose of discovering Confidential Information; and</p>
                <p>(e) Immediately notify Haste of any unauthorized disclosure or use of Confidential Information of which you become aware.</p>
              </div>
              <p className="mt-4">Your obligations under this Section 7 shall survive the termination or expiration of this EULA and shall continue for so long as the Confidential Information remains a trade secret under applicable law.</p>
            </div>

            {/* Section 8 */}
            <div id="usage-monitoring">
              <h2 className="text-foreground font-medium mb-4 text-base">8. Usage Monitoring, Telemetry, and Data Collection</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-foreground font-medium mb-2">8.1 Consent to Usage Monitoring</h3>
                  <p>By installing and using the Software, you expressly acknowledge and consent to the collection, transmission, storage, and analysis of Usage Data as described in this Section 8. This usage monitoring is an essential and integral component of the Software and the license granted hereunder. You may not disable, circumvent, block, or interfere with the collection or transmission of Usage Data without violating this EULA.</p>
                </div>
                <div>
                  <h3 className="text-foreground font-medium mb-2">8.2 What We Collect</h3>
                  <p className="mb-2">The Software automatically collects and transmits Usage Data to Haste servers. Usage Data may include, but is not limited to:</p>
                  <div className="space-y-1 pl-4">
                    <p>(a) License and Account Data: License Key, License Tier, account identifier, activation status, and subscription status;</p>
                    <p>(b) Device and Environment Data: hardware identifiers, device fingerprints, operating system type and version, Software version, installed plugins, system configuration information, and network identifiers;</p>
                    <p>(c) Usage and Volume Metrics: number of Projects processed, frequency of Software sessions, processing duration, volume of files processed, file sizes, types of conform operations performed, features utilized, error rates, and timestamps of activity;</p>
                    <p>(d) Performance and Diagnostic Data: processing times, rendering metrics, crash reports, error logs, and diagnostic information; and</p>
                    <p>(e) Operational Patterns: session frequency, peak usage times, batch processing indicators, concurrent usage signals, and any other patterns relevant to determining whether the Software is being used in accordance with the applicable License Tier.</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-foreground font-medium mb-2">8.3 How We Use Usage Data</h3>
                  <p className="mb-2">Haste uses Usage Data for the following purposes:</p>
                  <div className="space-y-1 pl-4">
                    <p>(a) License Compliance and Tier Enforcement: To verify that the Software is being used in accordance with the applicable License Tier, detect unauthorized use, and identify patterns indicative of License Tier misuse;</p>
                    <p>(b) Software Improvement: To analyze usage trends, identify bugs, improve functionality, and develop new features;</p>
                    <p>(c) Security and Fraud Prevention: To detect and prevent unauthorized access, license fraud, and credential sharing;</p>
                    <p>(d) Customer Support: To diagnose and resolve technical issues; and</p>
                    <p>(e) Billing and Account Management: To ensure accurate billing and manage subscriptions.</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-foreground font-medium mb-2">8.4 Usage Data and Privacy</h3>
                  <p>Our collection, use, and storage of Usage Data is subject to our Privacy Policy (available at https://www.haste.nyc/privacy). Usage Data is stored securely and access is limited to authorized Haste personnel. We do not sell Usage Data to third parties. Usage Data may be aggregated and anonymized for statistical analysis and benchmarking purposes.</p>
                </div>
                <div>
                  <h3 className="text-foreground font-medium mb-2">8.5 Tampering Prohibited</h3>
                  <p>You shall not tamper with, disable, circumvent, block, intercept, modify, spoof, or interfere with the collection, transmission, or accuracy of Usage Data, telemetry systems, license verification mechanisms, or any other monitoring or compliance features of the Software. Any such tampering constitutes a material breach of this EULA and may result in immediate termination of your license and pursuit of all available legal remedies.</p>
                </div>
              </div>
            </div>

            {/* Section 9 */}
            <div id="compliance">
              <h2 className="text-foreground font-medium mb-4 text-base">9. License Compliance, Audit, and Enforcement</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-foreground font-medium mb-2">9.1 Right to Review and Audit</h3>
                  <p>Haste reserves the right to review Usage Data at any time to verify compliance with this EULA. If Usage Data or other information indicates that the Software is being used inconsistently with the applicable License Tier, Haste may initiate a license compliance review. Haste also reserves the right, upon at least seven (7) days' prior written notice, to conduct an audit of your use of the Software. You agree to cooperate fully with any such audit.</p>
                </div>
                <div>
                  <h3 className="text-foreground font-medium mb-2">9.2 Indicators of Tier Misuse</h3>
                  <p className="mb-2">The following factors may be considered in determining whether a Freelancer Tier license is being used in violation of this EULA:</p>
                  <div className="space-y-1 pl-4">
                    <p>(a) Processing volume significantly exceeding typical individual freelance workloads;</p>
                    <p>(b) Sustained high-frequency usage patterns including daily processing of large numbers of Projects;</p>
                    <p>(c) Usage during business hours consistent with full-time employment at a Commercial Entity;</p>
                    <p>(d) Software installed on hardware owned or controlled by a Commercial Entity;</p>
                    <p>(e) IP addresses or device information associated with a Commercial Entity's infrastructure;</p>
                    <p>(f) Multiple Freelancer Tier licenses registered from the same organization, office, network, or IP address range;</p>
                    <p>(g) Usage patterns consistent with batch processing or pipeline automation typical of a post-production facility;</p>
                    <p>(h) Account registration information associated with a Commercial Entity; and</p>
                    <p>(i) Any other factors indicating that the Software is being used for the primary benefit of a Commercial Entity.</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-foreground font-medium mb-2">9.3 Remedies for Tier Misuse</h3>
                  <p className="mb-2">If Haste determines that you are using the Software under an incorrect License Tier, Haste may take one or more of the following actions: (a) notify you of the issue and provide a cure period not to exceed thirty (30) days; (b) invoice you for the difference between Freelancer Tier fees paid and Enterprise Tier fees applicable for the entire period of non-compliant use; (c) suspend your access until the compliance issue is resolved; (d) terminate your license immediately upon written notice; (e) pursue all available legal and equitable remedies; and (f) charge interest on unpaid amounts at 1.5% per month plus collection costs and attorneys' fees.</p>
                </div>
                <div>
                  <h3 className="text-foreground font-medium mb-2">9.4 Liquidated Damages for Enterprise Circumvention</h3>
                  <p>In the event that Haste determines that you have intentionally used one or more Freelancer Tier licenses as a substitute for an Enterprise Tier license, you agree to pay, as liquidated damages and not as a penalty, an amount equal to three (3) times the Enterprise Tier license fees that would have been applicable for the entire period of non-compliant use. The parties agree this represents a reasonable estimate of the anticipated harm.</p>
                </div>
                <div>
                  <h3 className="text-foreground font-medium mb-2">9.5 No Limitation on Other Remedies</h3>
                  <p>The remedies set forth in this Section 9 are cumulative and in addition to all other rights and remedies available to Haste under this EULA, at law, or in equity.</p>
                </div>
              </div>
            </div>

            {/* Section 10 */}
            <div id="warranty">
              <h2 className="text-foreground font-medium mb-4 text-base">10. Warranty Disclaimer</h2>
              <p className="mb-4">The Software is provided "as is" and "as available," with all faults and without warranty of any kind. To the maximum extent permitted by applicable law, Haste and its affiliates, licensors, suppliers, and service providers (collectively, the "Covered Parties") expressly disclaim all warranties, whether express, implied, statutory, or otherwise, including but not limited to the implied warranties of merchantability, fitness for a particular purpose, title, non-infringement, accuracy, reliability, completeness, quiet enjoyment, and any warranties arising from course of dealing, usage of trade, or course of performance.</p>
              <p>The Covered Parties do not warrant that (a) the Software will meet your requirements; (b) the Software will operate without interruption or be error-free; (c) defects in the Software will be corrected; (d) the Software will be compatible with any third-party software, hardware, NLE, or system, including but not limited to Adobe Premiere Pro, DaVinci Resolve, Final Cut Pro, or Avid Media Composer; or (e) the results obtained from the use of the Software will be accurate or reliable. Your use of the Software is at your sole risk.</p>
            </div>

            {/* Section 11 */}
            <div id="liability">
              <h2 className="text-foreground font-medium mb-4 text-base">11. Limitation of Liability</h2>
              <p className="mb-4">To the maximum extent permitted by applicable law, in no event shall the Covered Parties be liable to you or any third party for any indirect, incidental, special, consequential, exemplary, or punitive damages of any kind, including but not limited to damages for loss of profits, revenue, business, goodwill, data, media files, project files, editorial work, or use, regardless of the cause of action or the theory of liability, even if the Covered Parties have been advised of the possibility of such damages.</p>
              <p>The total aggregate liability of the Covered Parties arising out of or relating to this EULA or your use of the Software shall not exceed the total amount you paid to Haste for the Software during the twelve (12) month period immediately preceding the event giving rise to such liability, or one hundred U.S. dollars (US $100.00), whichever is greater.</p>
            </div>

            {/* Section 12 */}
            <div id="indemnification">
              <h2 className="text-foreground font-medium mb-4 text-base">12. Indemnification</h2>
              <p>You agree to indemnify, defend, and hold harmless Haste and its affiliates, officers, directors, employees, agents, licensors, suppliers, and service providers from and against any and all claims, actions, demands, liabilities, damages, losses, costs, and expenses (including reasonable attorneys' fees and court costs) arising out of or relating to: (a) your use or misuse of the Software; (b) your breach of this EULA; (c) your use of the Software under an incorrect License Tier; (d) your violation of any applicable law; or (e) your violation of any rights of a third party. Haste reserves the right, at its own expense, to assume the exclusive defense and control of any matter subject to indemnification by you.</p>
            </div>

            {/* Section 13 */}
            <div id="termination">
              <h2 className="text-foreground font-medium mb-4 text-base">13. Termination</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-foreground font-medium mb-2">13.1 Termination by You</h3>
                  <p>You may terminate this EULA at any time by uninstalling and destroying all copies of the Software in your possession or control and canceling your subscription. Termination does not relieve you of any obligation to pay outstanding fees.</p>
                </div>
                <div>
                  <h3 className="text-foreground font-medium mb-2">13.2 Termination by Haste</h3>
                  <p>Haste may terminate this EULA and your license immediately, without prior notice, if: (a) you breach any term of this EULA; (b) you fail to pay any applicable fees; (c) your use of the Software poses a security risk or may adversely affect the Software or other users; (d) Haste determines that you are using the Software under an incorrect License Tier and you fail to cure such non-compliance within the cure period provided; (e) you tamper with or disable any license verification, usage monitoring, or telemetry mechanisms; or (f) such termination is required by applicable law.</p>
                </div>
                <div>
                  <h3 className="text-foreground font-medium mb-2">13.3 Effect of Termination</h3>
                  <p>Upon termination of this EULA for any reason: (a) all licenses and rights granted to you hereunder shall immediately cease; (b) you must immediately cease all use of the Software; (c) you must uninstall the Software from all devices and destroy all copies, including backup copies; (d) you must return or destroy all Confidential Information; and (e) you must, upon request, certify in writing to Haste that you have complied with the foregoing obligations. Sections 3, 6, 7, 8, 9, 10, 11, 12, 14, and 15 shall survive any termination or expiration of this EULA.</p>
                </div>
              </div>
            </div>

            {/* Section 14 */}
            <div id="dispute-resolution">
              <h2 className="text-foreground font-medium mb-4 text-base">14. Dispute Resolution</h2>
              <p>Any dispute, controversy, or claim arising out of or relating to this EULA shall be resolved in accordance with the Dispute Resolution and Arbitration provisions set forth in the Haste.NYC Terms of Service, which are incorporated herein by reference. Notwithstanding the foregoing, Haste shall be entitled to seek immediate injunctive or other equitable relief in any court of competent jurisdiction to prevent or restrain any breach or threatened breach of Sections 3, 6, 7, or 9 of this EULA, without the requirement of posting a bond or proving actual damages.</p>
            </div>

            {/* Section 15 */}
            <div id="general">
              <h2 className="text-foreground font-medium mb-4 text-base">15. General Provisions</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-foreground font-medium mb-2">15.1 Entire Agreement</h3>
                  <p>This EULA, together with the Haste.NYC Terms of Service, Privacy Policy, and any applicable Enterprise License Agreement or Product-Specific Terms, constitutes the entire agreement between you and Haste with respect to the Software and supersedes all prior or contemporaneous understandings, communications, or agreements, whether written or oral.</p>
                </div>
                <div>
                  <h3 className="text-foreground font-medium mb-2">15.2 Governing Law</h3>
                  <p>This EULA shall be governed by and construed in accordance with the laws of the State of New York, United States, without regard to its conflict of law principles.</p>
                </div>
                <div>
                  <h3 className="text-foreground font-medium mb-2">15.3 Severability</h3>
                  <p>If any provision of this EULA is held to be invalid, illegal, or unenforceable, such provision shall be modified to the minimum extent necessary to make it valid and enforceable, and the remaining provisions shall continue in full force and effect.</p>
                </div>
                <div>
                  <h3 className="text-foreground font-medium mb-2">15.4 No Waiver</h3>
                  <p>The failure of Haste to exercise or enforce any right or provision of this EULA shall not constitute a waiver of such right or provision.</p>
                </div>
                <div>
                  <h3 className="text-foreground font-medium mb-2">15.5 Assignment</h3>
                  <p>You may not assign, transfer, or sublicense this EULA or any of your rights hereunder without the prior written consent of Haste. Haste may freely assign this EULA without your consent.</p>
                </div>
                <div>
                  <h3 className="text-foreground font-medium mb-2">15.6 Export Compliance</h3>
                  <p>You agree to comply with all applicable export control and sanctions laws and regulations of the United States and other jurisdictions in connection with your use of the Software.</p>
                </div>
                <div>
                  <h3 className="text-foreground font-medium mb-2">15.7 U.S. Government End Users</h3>
                  <p>The Software is "commercial computer software" as defined in 48 C.F.R. § 2.101. If you are a U.S. Government end user, your rights with respect to the Software are limited to those rights granted under this EULA in accordance with 48 C.F.R. §§ 12.212 and 227.7202.</p>
                </div>
                <div>
                  <h3 className="text-foreground font-medium mb-2">15.8 Contact Information</h3>
                  <p className="mb-4">For questions about this EULA, licensing, or to report a compliance concern:</p>
                  <div className="space-y-1">
                    <p>Haste.NYC LLC</p>
                    <p>555 Morgan Avenue, #2, Brooklyn, New York 11222, United States</p>
                    <p>Licensing inquiries: licensing@haste.nyc</p>
                    <p>Legal inquiries: legal@haste.nyc</p>
                    <p>Privacy inquiries: privacy@haste.nyc</p>
                    <p>General support: support@haste.nyc</p>
                    <p>Website: https://www.haste.nyc</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Closing acknowledgment */}
            <div className="border-t border-foreground/20 pt-8">
              <p className="font-medium text-foreground mb-4">
                By clicking "I Accept," downloading, installing, or using Conform Studio, you acknowledge that you have read this EULA, understand it, and agree to be bound by its terms and conditions.
              </p>
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

export default Eula;
