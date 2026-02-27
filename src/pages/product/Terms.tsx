import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const Terms = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-sm border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold tracking-wider">haste</span>
            </Link>
            <div className="flex items-center gap-6">
              <Link to="/studio" className="text-gray-300 hover:text-white transition-colors">
                PRODUCTION COMPANY
              </Link>
              <Link to="/privacy" className="text-gray-300 hover:text-white transition-colors">
                PRIVACY NOTICE
              </Link>
              <Link to="/refund" className="text-gray-300 hover:text-white transition-colors">
                REFUND POLICY
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="pt-24 pb-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <Button asChild variant="ghost" className="mb-8 text-gray-400 hover:text-white">
            <Link to="/">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">TERMS OF SERVICE</h1>
          <p className="text-gray-400 mb-2">EFFECTIVE DATE: FEBRUARY 18, 2026</p>
          <p className="text-gray-400 mb-12">LAST UPDATED: FEBRUARY 18, 2026</p>

          <div className="space-y-8 text-gray-300 leading-relaxed">
            <div>
              <p className="mb-4 font-medium text-white">
                IMPORTANT: PLEASE READ THESE TERMS OF SERVICE CAREFULLY BEFORE USING ANY HASTE.NYC SOFTWARE, SERVICES, OR WEBSITE. BY ACCESSING, DOWNLOADING, INSTALLING, OR USING ANY HASTE PRODUCT, YOU ACKNOWLEDGE THAT YOU HAVE READ, UNDERSTOOD, AND AGREE TO BE BOUND BY THESE TERMS. IF YOU DO NOT AGREE TO THESE TERMS, DO NOT USE ANY HASTE PRODUCTS OR SERVICES.
              </p>
              <p className="mb-4">
                THESE TERMS OF SERVICE ("TERMS"), TOGETHER WITH ANY APPLICABLE PRODUCT-SPECIFIC TERMS, END USER LICENSE AGREEMENTS ("EULA"), AND OUR PRIVACY POLICY (COLLECTIVELY, THE "AGREEMENT"), CONSTITUTE A LEGALLY BINDING AGREEMENT BETWEEN YOU ("USER," "YOU," OR "YOUR") AND HASTE.NYC LLC, A LIMITED LIABILITY COMPANY ORGANIZED UNDER THE LAWS OF THE STATE OF NEW YORK, UNITED STATES ("HASTE," "COMPANY," "WE," "US," OR "OUR"). THIS AGREEMENT GOVERNS YOUR ACCESS TO AND USE OF ALL HASTE WEBSITES, APPLICATIONS, SOFTWARE PRODUCTS (INCLUDING BUT NOT LIMITED TO CONFORM STUDIO), CLOUD SERVICES, APIS, DOCUMENTATION, SUPPORT FORUMS, AND ANY OTHER SERVICES OR CONTENT PROVIDED BY HASTE (COLLECTIVELY, THE "SERVICES AND SOFTWARE").
              </p>
              <p>
                BY USING THE SERVICES AND SOFTWARE, YOU AFFIRM THAT YOU ARE AT LEAST EIGHTEEN (18) YEARS OF AGE AND ARE FULLY ABLE AND COMPETENT TO ENTER INTO THIS AGREEMENT. IF YOU ARE ENTERING INTO THIS AGREEMENT ON BEHALF OF A COMPANY, ORGANIZATION, OR OTHER LEGAL ENTITY, YOU REPRESENT AND WARRANT THAT YOU HAVE THE AUTHORITY TO BIND SUCH ENTITY TO THIS AGREEMENT, IN WHICH CASE "YOU" AND "YOUR" SHALL REFER TO SUCH ENTITY.
              </p>
            </div>

            {/* Section 1 */}
            <div>
              <h2 className="text-xl font-bold text-white mb-3">1. YOUR AGREEMENT WITH HASTE</h2>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">1.1 CHOICE OF LAW AND CONTRACTING ENTITY</h3>
                  <p>
                    YOUR RELATIONSHIP IS WITH HASTE.NYC LLC, A NEW YORK LIMITED LIABILITY COMPANY. THESE TERMS ARE GOVERNED BY, AND CONSTRUED AND INTERPRETED IN ACCORDANCE WITH, THE LAWS OF THE STATE OF NEW YORK, UNITED STATES, WITHOUT REGARD TO ITS CONFLICT OF LAW PRINCIPLES, EXCEPT AS PREEMPTED BY FEDERAL LAW. YOU MAY HAVE ADDITIONAL RIGHTS UNDER YOUR LOCAL LAW. WE DO NOT SEEK TO LIMIT THOSE RIGHTS WHERE IT IS PROHIBITED TO DO SO BY APPLICABLE LAW.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">1.2 PRODUCT-SPECIFIC TERMS AND END USER LICENSE AGREEMENT</h3>
                  <p className="mb-2">
                    OUR SERVICES AND SOFTWARE ARE LICENSED, NOT SOLD, TO YOU, AND MAY BE SUBJECT TO ADDITIONAL TERMS SPECIFIC TO PARTICULAR PRODUCTS OR SERVICES ("PRODUCT-SPECIFIC TERMS" OR "EULA"). IN THE EVENT OF ANY CONFLICT BETWEEN THESE GENERAL TERMS AND ANY PRODUCT-SPECIFIC TERMS OR EULA, THE PRODUCT-SPECIFIC TERMS OR EULA SHALL GOVERN WITH RESPECT TO THOSE PARTICULAR SERVICES OR SOFTWARE. PRODUCT-SPECIFIC TERMS MAY INCLUDE BUT ARE NOT LIMITED TO:
                  </p>
                  <p>
                    (A) CONFORM STUDIO END USER LICENSE AGREEMENT; (B) HASTE API TERMS OF USE; (C) HASTE CLOUD SERVICES TERMS; (D) BETA AND PRE-RELEASE SOFTWARE TERMS; AND (E) ANY OTHER SUPPLEMENTAL TERMS PROVIDED WITH SPECIFIC PRODUCTS OR SERVICES.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">1.3 UPDATES TO TERMS</h3>
                  <p>
                    WE RESERVE THE RIGHT TO MODIFY, AMEND, OR UPDATE THESE TERMS AT ANY TIME IN OUR SOLE DISCRETION. MATERIAL CHANGES WILL BE COMMUNICATED TO YOU VIA EMAIL TO THE ADDRESS ASSOCIATED WITH YOUR ACCOUNT, THROUGH IN-PRODUCT NOTIFICATIONS, OR BY POSTING A PROMINENT NOTICE ON OUR WEBSITE. YOUR CONTINUED USE OF THE SERVICES AND SOFTWARE AFTER ANY SUCH MODIFICATION CONSTITUTES YOUR ACCEPTANCE OF THE MODIFIED TERMS. ANY CHANGES TO THESE TERMS WILL NOT APPLY RETROACTIVELY TO DISPUTES ARISING PRIOR TO THE DATE OF THE MODIFIED TERMS. WE RECOMMEND THAT YOU REVIEW THESE TERMS PERIODICALLY. IF YOU DO NOT AGREE WITH THE AMENDED TERMS, YOU MUST IMMEDIATELY DISCONTINUE YOUR USE OF THE SERVICES AND SOFTWARE AND, IF APPLICABLE, CANCEL YOUR SUBSCRIPTION.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 2 */}
            <div>
              <h2 className="text-xl font-bold text-white mb-3">2. INTELLECTUAL PROPERTY RIGHTS</h2>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">2.1 OWNERSHIP</h3>
                  <p className="mb-2">
                    ALL RIGHT, TITLE, AND INTEREST IN AND TO THE SERVICES AND SOFTWARE, INCLUDING BUT NOT LIMITED TO ALL SOURCE CODE, OBJECT CODE, ALGORITHMS, DATA STRUCTURES, USER INTERFACES, VISUAL DESIGNS, GRAPHICS, ICONS, DOCUMENTATION, DATABASES, DATA COMPILATIONS, TRADE SECRETS, INVENTIONS, PATENTS, PATENT APPLICATIONS, COPYRIGHTS, TRADEMARKS, SERVICE MARKS, TRADE NAMES, TRADE DRESS, DOMAIN NAMES, KNOW-HOW, AND ALL OTHER INTELLECTUAL PROPERTY RIGHTS OF ANY KIND (COLLECTIVELY, "INTELLECTUAL PROPERTY RIGHTS"), ARE AND SHALL REMAIN THE EXCLUSIVE PROPERTY OF HASTE.NYC LLC AND ITS LICENSORS.
                  </p>
                  <p>
                    NOTHING IN THIS AGREEMENT TRANSFERS OR CONVEYS TO YOU ANY OWNERSHIP INTEREST IN OR TO THE SERVICES AND SOFTWARE, OR ANY INTELLECTUAL PROPERTY RIGHTS THEREIN. YOU ACKNOWLEDGE THAT THE SERVICES AND SOFTWARE CONTAIN PROPRIETARY AND CONFIDENTIAL INFORMATION THAT IS PROTECTED BY APPLICABLE INTELLECTUAL PROPERTY AND OTHER LAWS. ALL RIGHTS NOT EXPRESSLY GRANTED HEREIN ARE RESERVED BY HASTE.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">2.2 LICENSE GRANT</h3>
                  <p>
                    SUBJECT TO YOUR COMPLIANCE WITH THIS AGREEMENT AND APPLICABLE LAW, HASTE HEREBY GRANTS YOU A LIMITED, NON-EXCLUSIVE, NON-TRANSFERABLE, NON-SUBLICENSABLE, REVOCABLE LICENSE TO INSTALL, ACCESS, AND USE THE SERVICES AND SOFTWARE SOLELY FOR YOUR INTERNAL BUSINESS OR PERSONAL PURPOSES, AS AUTHORIZED BY THE SPECIFIC LICENSE TYPE YOU HAVE PURCHASED OR BEEN GRANTED.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">2.3 TRADEMARKS</h3>
                  <p>
                    "HASTE," "HASTE.NYC," "CONFORM STUDIO," THE HASTE LOGO, AND ALL RELATED NAMES, LOGOS, PRODUCT AND SERVICE NAMES, DESIGNS, AND SLOGANS ARE TRADEMARKS OF HASTE.NYC LLC OR ITS AFFILIATES OR LICENSORS. YOU MAY NOT USE SUCH MARKS WITHOUT THE PRIOR WRITTEN PERMISSION OF HASTE.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">2.4 COPYRIGHT AND DMCA</h3>
                  <p>
                    WE RESPECT THE INTELLECTUAL PROPERTY RIGHTS OF OTHERS AND EXPECT OUR USERS TO DO THE SAME. IN ACCORDANCE WITH THE DIGITAL MILLENNIUM COPYRIGHT ACT OF 1998 ("DMCA"), 17 U.S.C. 512, WE WILL RESPOND EXPEDITIOUSLY TO CLAIMS OF COPYRIGHT INFRINGEMENT. OUR DESIGNATED AGENT FOR NOTICE OF CLAIMS OF COPYRIGHT INFRINGEMENT CAN BE REACHED AT: LEGAL@HASTE.NYC.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 3 */}
            <div>
              <h2 className="text-xl font-bold text-white mb-3">3. RESTRICTIONS ON USE</h2>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">3.1 PROHIBITED ACTIVITIES</h3>
                  <p className="mb-2">
                    YOU AGREE THAT YOU SHALL NOT, DIRECTLY OR INDIRECTLY, AND SHALL NOT PERMIT, ENCOURAGE, ASSIST, OR ENABLE ANY THIRD PARTY TO:
                  </p>
                  <div className="space-y-2 pl-4">
                    <p>(A) COPY, REPRODUCE, DISTRIBUTE, PUBLICLY DISPLAY, PUBLICLY PERFORM, REPUBLISH, DOWNLOAD, STORE, TRANSMIT, SELL, RESELL, LEASE, RENT, SUBLICENSE, OR OTHERWISE EXPLOIT ANY PORTION OF THE SERVICES OR SOFTWARE;</p>
                    <p>(B) MODIFY, ADAPT, TRANSLATE, PORT, OR CREATE DERIVATIVE WORKS BASED UPON THE SERVICES OR SOFTWARE;</p>
                    <p>(C) REVERSE ENGINEER, DISASSEMBLE, DECOMPILE, DECODE, DECRYPT, OR OTHERWISE ATTEMPT TO DERIVE OR GAIN UNAUTHORIZED ACCESS TO THE SOURCE CODE OR ANY OTHER PROPRIETARY COMPONENT OF THE SERVICES OR SOFTWARE;</p>
                    <p>(D) CIRCUMVENT, DISABLE, INTERFERE WITH, OR OTHERWISE BYPASS ANY SECURITY, ACCESS CONTROL, OR TECHNICAL PROTECTION MEASURES IN THE SERVICES OR SOFTWARE;</p>
                    <p>(E) USE THE SERVICES OR SOFTWARE TO DIRECTLY OR INDIRECTLY CREATE, DESIGN, DEVELOP, TRAIN, TEST, VALIDATE, BENCHMARK, OR OTHERWISE IMPROVE ANY MACHINE LEARNING MODEL, ARTIFICIAL INTELLIGENCE SYSTEM, OR ANY COMPETING PRODUCT OR SERVICE;</p>
                    <p>(F) REMOVE, ALTER, OBSCURE, COVER, OR DEFACE ANY PROPRIETARY NOTICE, LABEL, MARK, OR OTHER DESIGNATION ON OR WITHIN THE SERVICES OR SOFTWARE;</p>
                    <p>(G) USE THE SERVICES OR SOFTWARE IN VIOLATION OF ANY APPLICABLE LAW, RULE, REGULATION, OR GOVERNMENTAL ORDER;</p>
                    <p>(H) ACCESS THE SERVICES OR SOFTWARE IN ORDER TO BUILD A COMPETITIVE PRODUCT OR SERVICE, OR TO BENCHMARK, EVALUATE, OR COPY ANY FEATURES, FUNCTIONS, OR PERFORMANCE OF THE SERVICES OR SOFTWARE;</p>
                    <p>(I) USE ANY DATA MINING, SCRAPING, CRAWLING, OR OTHER AUTOMATED MEANS TO ACCESS, COLLECT, COPY, MONITOR, OR EXTRACT DATA OR CONTENT FROM THE SERVICES OR SOFTWARE;</p>
                    <p>(J) ATTEMPT TO GAIN UNAUTHORIZED ACCESS TO THE SERVICES OR SOFTWARE, OTHER USER ACCOUNTS, OR NETWORKS CONNECTED TO THE SERVICES OR SOFTWARE;</p>
                    <p>(K) TRANSMIT ANY VIRUS, WORM, TROJAN HORSE, RANSOMWARE, SPYWARE, ADWARE, OR ANY OTHER MALICIOUS OR TECHNOLOGICALLY HARMFUL CODE;</p>
                    <p>(L) INTERFERE WITH, DISRUPT, DEGRADE, IMPAIR, OVERBURDEN, OR COMPROMISE THE INTEGRITY, PERFORMANCE, SECURITY, OR PROPER FUNCTIONING OF THE SERVICES OR SOFTWARE;</p>
                    <p>(M) USE THE SERVICES OR SOFTWARE TO GENERATE OR DISTRIBUTE UNSOLICITED ADVERTISING, SPAM, CHAIN LETTERS, PYRAMID SCHEMES, OR ANY OTHER FORM OF SOLICITATION;</p>
                    <p>(N) IMPERSONATE OR MISREPRESENT YOUR IDENTITY OR AFFILIATION IN CONNECTION WITH YOUR USE OF THE SERVICES OR SOFTWARE;</p>
                    <p>(O) USE THE SERVICES OR SOFTWARE AS PART OF ANY OUTSOURCED SERVICE BUREAU, TIME-SHARING ARRANGEMENT, OR MANAGED SERVICES ENGAGEMENT FOR THE BENEFIT OF THIRD PARTIES WITHOUT OUR EXPRESS PRIOR WRITTEN CONSENT; OR</p>
                    <p>(P) CONSTRUCT, COMPILE, OR CREATE ANY DATABASE, DATASET, INDEX, OR COLLECTION OF DATA USING CONTENT FROM THE SERVICES OR SOFTWARE FOR THE PURPOSE OF REVERSE ENGINEERING, COMPETITIVE ANALYSIS, MACHINE LEARNING, OR ANY UNAUTHORIZED COMMERCIAL PURPOSE.</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">3.2 DECOMPILATION EXCEPTION</h3>
                  <p>
                    TO THE EXTENT THAT APPLICABLE LAW GRANTS YOU THE RIGHT TO DECOMPILE OR REVERSE ENGINEER ANY PORTION OF THE SERVICES OR SOFTWARE TO OBTAIN INFORMATION NECESSARY TO RENDER THE LICENSED PORTIONS INTEROPERABLE WITH INDEPENDENTLY CREATED SOFTWARE, YOU MUST FIRST SUBMIT A WRITTEN REQUEST TO HASTE AT LEGAL@HASTE.NYC SPECIFYING THE INTEROPERABILITY INFORMATION YOU SEEK.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">3.3 AI AND MACHINE LEARNING RESTRICTIONS</h3>
                  <p>
                    WITHOUT LIMITING THE GENERALITY OF SECTION 3.1(E), YOU SPECIFICALLY AGREE THAT YOU SHALL NOT USE ANY CONTENT, OUTPUT, DATA, TELEMETRY, METADATA, BEHAVIORAL PATTERNS, USER INTERFACE ELEMENTS, WORKFLOW SEQUENCES, FILE FORMAT SPECIFICATIONS, API RESPONSES, ERROR MESSAGES, OR ANY OTHER INFORMATION OBTAINED FROM OR GENERATED BY THE SERVICES OR SOFTWARE AS TRAINING DATA, VALIDATION DATA, FINE-TUNING DATA, OR OTHERWISE IN CONNECTION WITH ANY MACHINE LEARNING, DEEP LEARNING, ARTIFICIAL INTELLIGENCE, OR AUTOMATED DECISION-MAKING SYSTEM.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">3.4 COMPETITIVE ANALYSIS PROHIBITION</h3>
                  <p>
                    YOU MAY NOT USE THE SERVICES OR SOFTWARE, OR ANY INFORMATION DERIVED THEREFROM, TO MONITOR AVAILABILITY, PERFORMANCE, FUNCTIONALITY, OR FOR ANY BENCHMARKING, COMPETITIVE ANALYSIS, COMPETITIVE INTELLIGENCE, OR COMMERCIAL EVALUATION PURPOSES. YOU MAY NOT PUBLISH OR DISCLOSE TO ANY THIRD PARTY ANY PERFORMANCE DATA, BENCHMARKS, TEST RESULTS, OR COMPARATIVE ANALYSES RELATING TO THE SERVICES OR SOFTWARE WITHOUT THE PRIOR WRITTEN CONSENT OF HASTE.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 4 */}
            <div>
              <h2 className="text-xl font-bold text-white mb-3">4. YOUR CONTENT</h2>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">4.1 OWNERSHIP OF YOUR CONTENT</h3>
                  <p>
                    "YOUR CONTENT" MEANS ANY TEXT, DATA, FILES, MEDIA, PROJECT FILES, TIMELINES, SEQUENCES, METADATA, OR OTHER MATERIALS THAT YOU UPLOAD, IMPORT, CREATE, OR PROCESS USING THE SERVICES AND SOFTWARE. AS BETWEEN YOU AND HASTE, YOU RETAIN ALL RIGHTS AND OWNERSHIP IN YOUR CONTENT. HASTE DOES NOT CLAIM ANY OWNERSHIP RIGHTS TO YOUR CONTENT.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">4.2 LICENSE TO YOUR CONTENT</h3>
                  <p>
                    SOLELY FOR THE PURPOSE OF OPERATING, PROVIDING, IMPROVING, AND SUPPORTING THE SERVICES AND SOFTWARE, YOU GRANT HASTE A NON-EXCLUSIVE, WORLDWIDE, ROYALTY-FREE, FULLY-PAID LICENSE TO ACCESS, STORE, REPRODUCE, CACHE, PROCESS, AND CREATE DERIVATIVE WORKS OF YOUR CONTENT AS NECESSARY TO PROVIDE THE SERVICES AND SOFTWARE TO YOU.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">4.3 RESPONSIBILITY FOR YOUR CONTENT</h3>
                  <p>
                    YOU ARE SOLELY RESPONSIBLE FOR YOUR CONTENT AND THE CONSEQUENCES OF UPLOADING, IMPORTING, OR PROCESSING IT THROUGH THE SERVICES AND SOFTWARE.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 5 */}
            <div>
              <h2 className="text-xl font-bold text-white mb-3">5. ACCOUNT AND SECURITY</h2>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">5.1 ACCOUNT REGISTRATION</h3>
                  <p>
                    YOU MAY BE REQUIRED TO CREATE AN ACCOUNT TO ACCESS CERTAIN SERVICES AND SOFTWARE. YOU AGREE TO PROVIDE ACCURATE, CURRENT, AND COMPLETE INFORMATION DURING THE REGISTRATION PROCESS AND TO UPDATE SUCH INFORMATION TO KEEP IT ACCURATE, CURRENT, AND COMPLETE.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">5.2 ACCOUNT SECURITY</h3>
                  <p>
                    YOU AGREE TO IMMEDIATELY NOTIFY HASTE OF ANY UNAUTHORIZED USE OF YOUR ACCOUNT OR ANY OTHER BREACH OF SECURITY OF WHICH YOU BECOME AWARE. HASTE WILL NOT BE LIABLE FOR ANY LOSS OR DAMAGE ARISING FROM YOUR FAILURE TO COMPLY WITH THIS SECTION 5.2.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">5.3 ACCOUNT INACTIVITY</h3>
                  <p>
                    FOR FREE OR TRIAL ACCOUNTS, IF YOUR ACCOUNT REMAINS INACTIVE FOR A PERIOD OF TWELVE (12) CONSECUTIVE MONTHS, HASTE RESERVES THE RIGHT TO DEACTIVATE OR DELETE YOUR ACCOUNT AND ANY ASSOCIATED CONTENT AFTER PROVIDING REASONABLE NOTICE TO YOU.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 6 */}
            <div>
              <h2 className="text-xl font-bold text-white mb-3">6. FEES, PAYMENT, AND TAXES</h2>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">6.1 FEES</h3>
                  <p>
                    YOU AGREE TO PAY ALL FEES AND CHARGES ASSOCIATED WITH YOUR USE OF THE SERVICES AND SOFTWARE IN ACCORDANCE WITH THE PRICING AND PAYMENT TERMS PRESENTED TO YOU AT THE TIME OF PURCHASE. ALL FEES ARE NON-REFUNDABLE EXCEPT AS EXPRESSLY SET FORTH IN THIS AGREEMENT OR AS REQUIRED BY APPLICABLE LAW.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">6.2 TAXES</h3>
                  <p>
                    YOU ARE RESPONSIBLE FOR ALL APPLICABLE TAXES, DUTIES, LEVIES, AND SIMILAR GOVERNMENTAL CHARGES ARISING FROM YOUR PURCHASE OR USE OF THE SERVICES AND SOFTWARE (EXCLUDING TAXES BASED ON HASTE'S NET INCOME).
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">6.3 PRICE CHANGES</h3>
                  <p>
                    HASTE RESERVES THE RIGHT TO CHANGE THE FEES FOR ANY SERVICES AND SOFTWARE AT ANY TIME UPON REASONABLE NOTICE TO YOU. PRICE CHANGES WILL BECOME EFFECTIVE AT THE START OF THE NEXT BILLING CYCLE FOLLOWING THE DATE OF THE PRICE CHANGE.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 7 */}
            <div>
              <h2 className="text-xl font-bold text-white mb-3">7. CONFIDENTIALITY</h2>
              <p>
                YOU ACKNOWLEDGE THAT THE SERVICES AND SOFTWARE CONTAIN TRADE SECRETS AND CONFIDENTIAL PROPRIETARY INFORMATION OF HASTE AND ITS LICENSORS ("CONFIDENTIAL INFORMATION"). YOU AGREE TO HOLD ALL CONFIDENTIAL INFORMATION IN STRICT CONFIDENCE, TO USE IT ONLY AS AUTHORIZED UNDER THIS AGREEMENT, AND TO PROTECT IT WITH AT LEAST THE SAME DEGREE OF CARE THAT YOU USE TO PROTECT YOUR OWN CONFIDENTIAL INFORMATION, BUT IN NO EVENT LESS THAN REASONABLE CARE. YOU SHALL NOT DISCLOSE ANY CONFIDENTIAL INFORMATION TO ANY THIRD PARTY WITHOUT THE PRIOR WRITTEN CONSENT OF HASTE.
              </p>
            </div>

            {/* Section 8 */}
            <div>
              <h2 className="text-xl font-bold text-white mb-3">8. WARRANTY DISCLAIMERS</h2>
              <p className="mb-2">
                THE SERVICES AND SOFTWARE ARE PROVIDED "AS IS" AND "AS AVAILABLE," WITH ALL FAULTS AND WITHOUT WARRANTY OF ANY KIND. TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, HASTE AND ITS AFFILIATES, LICENSORS, SUPPLIERS, AND SERVICE PROVIDERS (COLLECTIVELY, THE "COVERED PARTIES") EXPRESSLY DISCLAIM ALL WARRANTIES, WHETHER EXPRESS, IMPLIED, STATUTORY, OR OTHERWISE.
              </p>
              <p>
                THE COVERED PARTIES DO NOT WARRANT THAT (A) THE SERVICES AND SOFTWARE WILL MEET YOUR REQUIREMENTS OR EXPECTATIONS; (B) THE SERVICES AND SOFTWARE WILL BE UNINTERRUPTED, TIMELY, SECURE, ERROR-FREE, OR FREE OF VIRUSES; (C) THE RESULTS OBTAINED WILL BE ACCURATE, RELIABLE, OR COMPLETE; (D) ANY DEFECTS OR ERRORS WILL BE CORRECTED; OR (E) THE SERVICES AND SOFTWARE WILL BE COMPATIBLE WITH ANY THIRD-PARTY SOFTWARE, HARDWARE, OR SYSTEMS. YOUR USE OF THE SERVICES AND SOFTWARE IS AT YOUR SOLE RISK.
              </p>
            </div>

            {/* Section 9 */}
            <div>
              <h2 className="text-xl font-bold text-white mb-3">9. LIMITATION OF LIABILITY</h2>
              <p className="mb-2">
                TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL THE COVERED PARTIES BE LIABLE TO YOU OR ANY THIRD PARTY FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES OF ANY KIND, REGARDLESS OF THE CAUSE OF ACTION OR THE THEORY OF LIABILITY, EVEN IF THE COVERED PARTIES HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
              </p>
              <p>
                THE TOTAL AGGREGATE LIABILITY OF THE COVERED PARTIES SHALL NOT EXCEED THE GREATER OF (A) ONE HUNDRED U.S. DOLLARS (US $100.00); OR (B) THE TOTAL AMOUNT YOU PAID TO HASTE FOR THE SPECIFIC SERVICES OR SOFTWARE GIVING RISE TO THE CLAIM DURING THE TWELVE (12) MONTH PERIOD IMMEDIATELY PRECEDING THE EVENT GIVING RISE TO SUCH LIABILITY. NOTHING IN THIS AGREEMENT LIMITS OR EXCLUDES LIABILITY FOR (I) DEATH OR PERSONAL INJURY CAUSED BY NEGLIGENCE; (II) FRAUD OR FRAUDULENT MISREPRESENTATION; OR (III) ANY OTHER LIABILITY THAT CANNOT BE LIMITED OR EXCLUDED BY APPLICABLE LAW.
              </p>
            </div>

            {/* Section 10 */}
            <div>
              <h2 className="text-xl font-bold text-white mb-3">10. INDEMNIFICATION</h2>
              <p>
                YOU AGREE TO INDEMNIFY, DEFEND, AND HOLD HARMLESS HASTE AND ITS AFFILIATES, OFFICERS, DIRECTORS, EMPLOYEES, AGENTS, LICENSORS, SUPPLIERS, AND SERVICE PROVIDERS FROM AND AGAINST ANY AND ALL CLAIMS, ACTIONS, DEMANDS, LIABILITIES, DAMAGES, LOSSES, COSTS, AND EXPENSES ARISING OUT OF OR RELATING TO: (A) YOUR USE OR MISUSE OF THE SERVICES AND SOFTWARE; (B) YOUR CONTENT; (C) YOUR VIOLATION OF THIS AGREEMENT; (D) YOUR VIOLATION OF ANY APPLICABLE LAW; OR (E) YOUR VIOLATION OF ANY RIGHTS OF A THIRD PARTY.
              </p>
            </div>

            {/* Section 11 */}
            <div>
              <h2 className="text-xl font-bold text-white mb-3">11. TERMINATION</h2>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">11.1 TERMINATION BY YOU</h3>
                  <p>
                    YOU MAY TERMINATE THIS AGREEMENT AT ANY TIME BY CEASING ALL USE OF THE SERVICES AND SOFTWARE AND, IF APPLICABLE, CANCELING YOUR SUBSCRIPTION IN ACCORDANCE WITH THE APPLICABLE CANCELLATION PROCEDURES.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">11.2 TERMINATION BY HASTE</h3>
                  <p>
                    HASTE MAY TERMINATE OR SUSPEND YOUR ACCESS TO THE SERVICES AND SOFTWARE IMMEDIATELY, WITHOUT PRIOR NOTICE OR LIABILITY, IF: (A) YOU BREACH ANY PROVISION OF THIS AGREEMENT; (B) YOU FAIL TO MAKE TIMELY PAYMENT OF ANY FEES; (C) YOUR USE POSES A SECURITY RISK OR MAY ADVERSELY AFFECT OTHER USERS; (D) SUCH ACTION IS REQUIRED BY APPLICABLE LAW; (E) HASTE ELECTS TO DISCONTINUE THE SERVICES OR SOFTWARE; OR (F) FOR ANY OTHER REASON IN HASTE'S SOLE DISCRETION UPON THIRTY (30) DAYS' PRIOR WRITTEN NOTICE.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">11.3 EFFECT OF TERMINATION</h3>
                  <p>
                    UPON TERMINATION: (A) ALL LICENSES GRANTED SHALL IMMEDIATELY CEASE; (B) YOU MUST IMMEDIATELY CEASE ALL USE AND DESTROY ALL COPIES; (C) YOU MUST RETURN OR DESTROY ALL CONFIDENTIAL INFORMATION; AND (D) HASTE MAY DELETE YOUR ACCOUNT AND ASSOCIATED CONTENT AFTER THIRTY (30) DAYS. SECTIONS 2, 3, 7, 8, 9, 10, 12, AND ANY OTHER PROVISIONS THAT BY THEIR NATURE SHOULD SURVIVE, SHALL SURVIVE ANY TERMINATION OR EXPIRATION OF THIS AGREEMENT.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 12 */}
            <div>
              <h2 className="text-xl font-bold text-white mb-3">12. DISPUTE RESOLUTION AND ARBITRATION</h2>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">12.1 INFORMAL RESOLUTION</h3>
                  <p>
                    BEFORE INITIATING ANY FORMAL DISPUTE RESOLUTION PROCEEDINGS, YOU AGREE TO FIRST ATTEMPT TO RESOLVE ANY DISPUTE INFORMALLY BY CONTACTING HASTE AT LEGAL@HASTE.NYC.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">12.2 BINDING ARBITRATION</h3>
                  <p>
                    ANY DISPUTE NOT RESOLVED THROUGH THE INFORMAL PROCESS SHALL BE FINALLY RESOLVED BY BINDING ARBITRATION ADMINISTERED BY THE AMERICAN ARBITRATION ASSOCIATION ("AAA") IN ACCORDANCE WITH ITS COMMERCIAL ARBITRATION RULES. THE ARBITRATION SHALL BE CONDUCTED BY A SINGLE ARBITRATOR IN NEW YORK COUNTY, NEW YORK, UNITED STATES.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">12.3 CLASS ACTION WAIVER</h3>
                  <p>
                    YOU AGREE THAT ANY DISPUTE RESOLUTION PROCEEDINGS WILL BE CONDUCTED ONLY ON AN INDIVIDUAL BASIS AND NOT IN A CLASS, CONSOLIDATED, OR REPRESENTATIVE ACTION. YOU WAIVE ANY RIGHT TO PARTICIPATE IN A CLASS ACTION LAWSUIT OR CLASS-WIDE ARBITRATION. IF FOR ANY REASON A CLAIM PROCEEDS IN COURT RATHER THAN IN ARBITRATION, EACH PARTY WAIVES ANY RIGHT TO A JURY TRIAL.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">12.4 INJUNCTIVE RELIEF</h3>
                  <p>
                    NOTWITHSTANDING THE FOREGOING, HASTE SHALL BE ENTITLED TO SEEK INJUNCTIVE OR OTHER EQUITABLE RELIEF IN ANY COURT OF COMPETENT JURISDICTION TO PREVENT THE ACTUAL OR THREATENED INFRINGEMENT, MISAPPROPRIATION, OR VIOLATION OF HASTE'S INTELLECTUAL PROPERTY RIGHTS, CONFIDENTIAL INFORMATION, OR OTHER PROPRIETARY RIGHTS.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">12.5 LIMITATION PERIOD</h3>
                  <p>
                    ANY CLAIM OR CAUSE OF ACTION ARISING OUT OF OR RELATED TO THIS AGREEMENT MUST BE FILED WITHIN ONE (1) YEAR AFTER THE DATE ON WHICH SUCH CLAIM OR CAUSE OF ACTION AROSE. CLAIMS FILED AFTER THIS ONE-YEAR LIMITATION PERIOD ARE PERMANENTLY BARRED.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 13 */}
            <div>
              <h2 className="text-xl font-bold text-white mb-3">13. EXPORT CONTROLS AND TRADE COMPLIANCE</h2>
              <p>
                THE SERVICES AND SOFTWARE MAY BE SUBJECT TO U.S. AND INTERNATIONAL EXPORT CONTROL LAWS AND REGULATIONS. YOU AGREE TO COMPLY WITH ALL APPLICABLE EXPORT CONTROL AND SANCTIONS LAWS AND REGULATIONS. YOU REPRESENT AND WARRANT THAT YOU ARE NOT LOCATED IN, UNDER THE CONTROL OF, OR A NATIONAL OR RESIDENT OF ANY COUNTRY SUBJECT TO COMPREHENSIVE U.S. SANCTIONS, AND THAT YOU ARE NOT ON ANY U.S. GOVERNMENT DENIED PARTIES LIST.
              </p>
            </div>

            {/* Section 14 */}
            <div>
              <h2 className="text-xl font-bold text-white mb-3">14. UPDATES AND MODIFICATIONS TO SERVICES</h2>
              <p>
                HASTE MAY, IN ITS SOLE DISCRETION, MODIFY, UPDATE, ENHANCE, OR DISCONTINUE ANY PORTION OF THE SERVICES AND SOFTWARE AT ANY TIME, WITH OR WITHOUT NOTICE. HASTE SHALL NOT BE LIABLE TO YOU OR ANY THIRD PARTY FOR ANY SUCH MODIFICATION, SUSPENSION, OR DISCONTINUANCE. FOR PAID SUBSCRIPTIONS, HASTE WILL MAKE REASONABLE EFFORTS TO NOTIFY YOU OF MATERIAL CHANGES.
              </p>
            </div>

            {/* Section 15 */}
            <div>
              <h2 className="text-xl font-bold text-white mb-3">15. AUDIT RIGHTS</h2>
              <p>
                HASTE RESERVES THE RIGHT, UPON AT LEAST SEVEN (7) DAYS' PRIOR WRITTEN NOTICE, TO AUDIT YOUR USE OF THE SERVICES AND SOFTWARE TO VERIFY COMPLIANCE WITH THIS AGREEMENT.
              </p>
            </div>

            {/* Section 16 */}
            <div>
              <h2 className="text-xl font-bold text-white mb-3">16. GOVERNMENT END USERS</h2>
              <p>
                IF YOU ARE A U.S. GOVERNMENT END USER, THE SERVICES AND SOFTWARE ARE "COMMERCIAL COMPUTER SOFTWARE" AND "COMMERCIAL COMPUTER SOFTWARE DOCUMENTATION" AS THOSE TERMS ARE DEFINED IN 48 C.F.R. 2.101, AND ARE PROVIDED WITH RESTRICTED RIGHTS. THE MANUFACTURER IS HASTE.NYC LLC.
              </p>
            </div>

            {/* Section 17 */}
            <div>
              <h2 className="text-xl font-bold text-white mb-3">17. MISCELLANEOUS</h2>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">17.1 ENTIRE AGREEMENT</h3>
                  <p>
                    THIS AGREEMENT, TOGETHER WITH ALL INCORPORATED DOCUMENTS, CONSTITUTES THE ENTIRE AGREEMENT BETWEEN YOU AND HASTE WITH RESPECT TO THE SUBJECT MATTER HEREOF.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">17.2 SEVERABILITY</h3>
                  <p>
                    IF ANY PROVISION OF THIS AGREEMENT IS HELD TO BE INVALID, ILLEGAL, OR UNENFORCEABLE, SUCH PROVISION SHALL BE ENFORCED TO THE MAXIMUM EXTENT PERMISSIBLE AND THE REMAINING PROVISIONS SHALL CONTINUE IN FULL FORCE AND EFFECT.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">17.3 NO WAIVER</h3>
                  <p>
                    THE FAILURE OF HASTE TO EXERCISE OR ENFORCE ANY RIGHT OR PROVISION SHALL NOT CONSTITUTE A WAIVER OF SUCH RIGHT OR PROVISION.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">17.4 ASSIGNMENT</h3>
                  <p>
                    YOU MAY NOT ASSIGN, TRANSFER, DELEGATE, OR SUBLICENSE ANY OF YOUR RIGHTS OR OBLIGATIONS UNDER THIS AGREEMENT WITHOUT THE PRIOR WRITTEN CONSENT OF HASTE. HASTE MAY FREELY ASSIGN OR TRANSFER THIS AGREEMENT WITHOUT YOUR CONSENT.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">17.5 FORCE MAJEURE</h3>
                  <p>
                    NEITHER PARTY SHALL BE LIABLE FOR ANY DELAY OR FAILURE IN PERFORMANCE (OTHER THAN PAYMENT OBLIGATIONS) RESULTING FROM CAUSES BEYOND ITS REASONABLE CONTROL.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">17.6 NOTICES</h3>
                  <p>
                    ALL LEGAL NOTICES REQUIRED OR PERMITTED UNDER THIS AGREEMENT SHALL BE IN WRITING AND SHALL BE DEEMED GIVEN WHEN DELIVERED PERSONALLY, SENT BY CERTIFIED OR REGISTERED MAIL, OR SENT BY OVERNIGHT COURIER TO HASTE.NYC LLC, 555 MORGAN AVENUE, #2, BROOKLYN, NEW YORK 11222, UNITED STATES; OR BY EMAIL TO LEGAL@HASTE.NYC.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">17.7 INDEPENDENT CONTRACTORS</h3>
                  <p>
                    NOTHING IN THIS AGREEMENT SHALL BE CONSTRUED TO CREATE ANY AGENCY, PARTNERSHIP, JOINT VENTURE, OR EMPLOYMENT RELATIONSHIP BETWEEN YOU AND HASTE. THE PARTIES ARE INDEPENDENT CONTRACTORS.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">17.8 ENGLISH LANGUAGE</h3>
                  <p>
                    THE ENGLISH LANGUAGE VERSION OF THIS AGREEMENT SHALL BE THE CONTROLLING VERSION REGARDLESS OF ANY TRANSLATION(S) MADE FOR ANY PURPOSE.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">17.9 HEADINGS</h3>
                  <p>
                    SECTION HEADINGS ARE FOR REFERENCE PURPOSES ONLY AND SHALL NOT AFFECT THE INTERPRETATION OR CONSTRUCTION OF THIS AGREEMENT.
                  </p>
                </div>
              </div>
            </div>

            {/* Divider and Contact */}
            <div className="border-t border-gray-800 pt-8">
              <p>
                IF YOU HAVE ANY QUESTIONS ABOUT THESE TERMS OF SERVICE, PLEASE CONTACT US AT LEGAL@HASTE.NYC.
              </p>
              <p className="mt-4 text-gray-500">
                &copy;2026 HASTE.NYC LLC. ALL RIGHTS RESERVED.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <Link to="/" className="text-2xl font-bold mb-4 inline-block">
            haste
          </Link>
          <p className="text-gray-500 text-sm mb-8">
            &copy;2026 HASTE NYC LLC &bull; ALL RIGHTS RESERVED
          </p>
          <div className="flex gap-6 justify-center text-sm">
            <Link to="/studio" className="text-gray-400 hover:text-white">
              PRODUCTION COMPANY
            </Link>
            <Link to="/terms" className="text-gray-400 hover:text-white">
              TERMS OF SERVICE
            </Link>
            <Link to="/privacy" className="text-gray-400 hover:text-white">
              PRIVACY NOTICE
            </Link>
            <Link to="/refund" className="text-gray-400 hover:text-white">
              REFUND POLICY
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Terms;
