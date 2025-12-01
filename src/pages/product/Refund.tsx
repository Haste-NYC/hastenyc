import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const Refund = () => {
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
              <Link to="/privacy" className="text-gray-300 hover:text-white transition-colors">
                PRIVACY NOTICE
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

          <h1 className="text-4xl md:text-5xl font-bold mb-4">REFUND POLICY</h1>
          <p className="text-gray-400 mb-12">EFFECTIVE DATE: JULY 25, 2025</p>

          <div className="space-y-8 text-gray-300 leading-relaxed">
            <div>
              <p>
                CONFORM STUDIO IS OFFERED WITH AN OPTIONAL FREE TRIAL. AFTER THE TRIAL PERIOD
                ENDS, ALL SUBSCRIPTION FEES ARE FINAL AND NON-REFUNDABLE. BY SUBSCRIBING, YOU
                AGREE TO BE CHARGED AUTOMATICALLY VIA PADDLE.COM.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-3">CANCELLATION</h2>
              <p>
                YOU MAY CANCEL YOUR SUBSCRIPTION AT ANY TIME VIA YOUR ACCOUNT DASHBOARD.
                CANCELLATION STOPS FUTURE BILLING BUT DOES NOT PROVIDE A REFUND FOR PRIOR
                CHARGES.
              </p>
            </div>

            <div>
              <p>
                IF YOU BELIEVE YOU WERE CHARGED IN ERROR, PLEASE CONTACT US AT
                SUPPORT@HASTE.NYC WITHIN 7 DAYS OF THE CHARGE.
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

export default Refund;