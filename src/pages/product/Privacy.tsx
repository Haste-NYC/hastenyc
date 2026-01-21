import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const Privacy = () => {
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
              <Link to="/terms" className="text-gray-300 hover:text-white transition-colors">
                TERMS OF SERVICE
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

          <h1 className="text-4xl md:text-5xl font-bold mb-4">PRIVACY NOTICE</h1>
          <p className="text-gray-400 mb-12">EFFECTIVE DATE: JULY 25, 2025</p>

          <div className="space-y-8 text-gray-300 leading-relaxed">
            <div>
              <p className="mb-4">
                THIS PRIVACY NOTICE DESCRIBES HOW HASTE NYC LLC ("WE," "OUR," OR "US")
                COLLECTS, USES, AND PROTECTS YOUR PERSONAL INFORMATION WHEN YOU USE
                CONFORM STUDIO.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-3">1. INFORMATION WE COLLECT</h2>
              <p>
                WE COLLECT THE FOLLOWING PERSONAL DATA: - NAME - EMAIL ADDRESS - BILLING
                INFORMATION (VIA PADDLE.COM) - USAGE DATA WITHIN THE APP (NON-IDENTIFIABLE
                ANALYTICS)
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-3">2. HOW WE USE YOUR INFORMATION</h2>
              <p>
                WE USE YOUR DATA TO: - PROVIDE ACCESS TO THE SERVICE - PROCESS BILLING VIA
                PADDLE.COM - MONITOR USAGE TO IMPROVE FEATURES
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-3">3. DATA SHARING</h2>
              <p>
                WE DO NOT SELL OR RENT YOUR PERSONAL DATA. WE SHARE IT ONLY WITH PADDLE.COM
                FOR PAYMENT PROCESSING.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-3">4. INTERNATIONAL USERS</h2>
              <p>
                BY USING THE SERVICE, YOU CONSENT TO THE TRANSFER AND STORAGE OF YOUR
                INFORMATION IN THE UNITED STATES. WE COMPLY WITH APPLICABLE DATA PROTECTION
                LAWS, INCLUDING GDPR WHERE APPLICABLE.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-3">5. DATA RETENTION</h2>
              <p>
                WE RETAIN YOUR DATA AS LONG AS YOUR ACCOUNT IS ACTIVE OR AS NEEDED TO COMPLY
                WITH LEGAL OBLIGATIONS.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-3">6. YOUR RIGHTS</h2>
              <p>
                DEPENDING ON YOUR LOCATION, YOU MAY HAVE RIGHTS TO ACCESS, CORRECT, OR
                DELETE YOUR PERSONAL DATA. CONTACT US AT SUPPORT@HASTE.NYC TO MAKE A
                REQUEST.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-3">7. SECURITY</h2>
              <p>
                WE IMPLEMENT REASONABLE SECURITY MEASURES TO PROTECT YOUR DATA.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-3">8. CONTACT</h2>
              <p>
                FOR QUESTIONS OR CONCERNS: SUPPORT@HASTE.NYC
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
            ©2025 HASTE NYC LLC • ALL RIGHTS RESERVED
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

export default Privacy;