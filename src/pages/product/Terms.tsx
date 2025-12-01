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
          <p className="text-gray-400 mb-12">EFFECTIVE DATE: JULY 25, 2025</p>

          <div className="space-y-8 text-gray-300 leading-relaxed">
            <div>
              <p className="mb-4">
                WELCOME TO CONFORM STUDIO, A SERVICE PROVIDED BY HASTE NYC LLC ("COMPANY,"
                "WE," "OUR," OR "US"). THESE TERMS OF SERVICE ("TERMS") GOVERN YOUR ACCESS TO
                AND USE OF CONFORM STUDIO, AVAILABLE AT WWW.HASTE.NYC (THE "SITE").
              </p>
              <p>
                BY ACCESSING OR USING OUR SERVICE, YOU AGREE TO BE BOUND BY THESE TERMS. IF
                YOU DO NOT AGREE, YOU MAY NOT USE THE SERVICE.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-3">1. USE OF THE SERVICE</h2>
              <p>
                CONFORM STUDIO IS A SUBSCRIPTION-BASED SAAS PRODUCT. YOU MAY USE THE
                SERVICE ONLY IN COMPLIANCE WITH THESE TERMS AND ALL APPLICABLE LAWS.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-3">2. ACCOUNT REGISTRATION</h2>
              <p>
                TO ACCESS CONFORM STUDIO, YOU MUST CREATE AN ACCOUNT. YOU AGREE TO PROVIDE
                ACCURATE AND COMPLETE INFORMATION, INCLUDING YOUR NAME, EMAIL, AND BILLING
                DETAILS.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-3">3. SUBSCRIPTION AND BILLING</h2>
              <p>
                ALL PAYMENTS ARE PROCESSED VIA PADDLE.COM. SUBSCRIPTION FEES ARE CHARGED IN
                ADVANCE AND BILLED ON A RECURRING BASIS UNLESS CANCELLED. USERS ARE
                RESPONSIBLE FOR ALL CHARGES INCURRED.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-3">4. CANCELLATION AND TERMINATION</h2>
              <p>
                YOU MAY CANCEL YOUR SUBSCRIPTION AT ANY TIME THROUGH YOUR ACCOUNT
                SETTINGS. AFTER ANY APPLICABLE FREE TRIAL, ALL FEES ARE NON-REFUNDABLE. WE
                RESERVE THE RIGHT TO SUSPEND OR TERMINATE YOUR ACCOUNT FOR VIOLATIONS OF
                THESE TERMS.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-3">5. INTELLECTUAL PROPERTY</h2>
              <p>
                ALL CONTENT, CODE, AND BRANDING RELATED TO CONFORM STUDIO REMAIN THE
                INTELLECTUAL PROPERTY OF HASTE NYC LLC. YOU MAY NOT COPY, MODIFY, DISTRIBUTE,
                OR REVERSE ENGINEER ANY PART OF THE SERVICE.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-3">6. LIMITATION OF LIABILITY</h2>
              <p>
                WE PROVIDE THE SERVICE "AS IS" AND DISCLAIM ALL WARRANTIES. TO THE MAXIMUM
                EXTENT ALLOWED BY LAW, WE ARE NOT LIABLE FOR ANY INDIRECT OR CONSEQUENTIAL
                DAMAGES.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-3">7. GOVERNING LAW</h2>
              <p>
                THESE TERMS ARE GOVERNED BY THE LAWS OF THE STATE OF NEW YORK, USA, WITHOUT
                REGARD TO CONFLICT OF LAWS PRINCIPLES.
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

export default Terms;