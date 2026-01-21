import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { ChevronRight, Zap, Shield, Gauge, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const ProductHome = () => {
  const { user, isAuthenticated, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-sm border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold tracking-wider">CONFORM STUDIO</span>
            </Link>
            <div className="flex items-center gap-6">
              <Link to="/studio" className="text-gray-300 hover:text-white transition-colors">
                haste
              </Link>
              <Link to="/blog" className="text-gray-300 hover:text-white transition-colors">
                Blog
              </Link>
              {isAuthenticated ? (
                <>
                  {user?.subscriptionStatus !== "active" && (
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      className="border-pink-500 text-pink-500 hover:bg-pink-500/10"
                    >
                      <Link to="/checkout">Subscribe</Link>
                    </Button>
                  )}
                  <span className="text-gray-300 text-sm">{user?.email}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleSignOut}
                    className="text-gray-300 hover:text-white hover:bg-gray-800"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/signin" className="text-gray-300 hover:text-white transition-colors">
                    Sign In
                  </Link>
                  <Button
                    asChild
                    size="sm"
                    className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                  >
                    <Link to="/signup">Sign Up</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-8">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold">
              <span className="bg-gradient-to-r from-white via-gray-300 to-gray-500 bg-clip-text text-transparent">
                CONFORM
              </span>
              <br />
              <span className="bg-gradient-to-r from-white via-gray-300 to-gray-500 bg-clip-text text-transparent">
                STUDIO
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto">
              AI-Powered Automation for Seamless Post Workflows
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-lg px-8"
              >
                <a href="https://calendly.com/conform-studio" target="_blank" rel="noopener noreferrer">
                  Get Started
                  <ChevronRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg px-8 border-gray-700">
                <Link to="/blog">
                  Read Blog
                </Link>
              </Button>
            </div>
          </div>

          {/* Video/Image Placeholder */}
          <div className="mt-20 relative">
            <div className="aspect-video bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg border border-gray-700 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
                <p className="text-gray-400">Product Demo Video</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 border-t border-gray-800">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            RAPID TIMELINE CONFORM FOR FILM & TV
          </h2>
          <p className="text-gray-400 text-center mb-16 max-w-3xl mx-auto">
            Transform your post-production workflow with AI-powered automation that delivers results 300X faster
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Zap className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold">300X FASTER</h3>
              <p className="text-gray-400">
                100% accurate timeline conforms in minutes, not days
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Shield className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold">TPN+ COMPLIANT</h3>
              <p className="text-gray-400">
                Enterprise-grade security meeting industry standards
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Gauge className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold">BUILT FOR STUDIOS</h3>
              <p className="text-gray-400">
                Designed for professional post-production environments
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Haste Section */}
      <section className="py-20 px-4 border-t border-gray-800">
        <div className="container mx-auto max-w-6xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">
            HASTE: SCALE READY PRODUCTION
          </h2>
          <p className="text-gray-400 max-w-3xl mx-auto mb-8">
            Our production company arm delivers world-class content for leading brands
          </p>
          <Button asChild variant="outline" size="lg" className="border-gray-700">
            <Link to="/studio">
              View Our Work
              <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">CONFORM STUDIO</h3>
              <p className="text-gray-400">
                AI-powered post-production automation
              </p>
            </div>
            <div className="text-right">
              <div className="flex gap-6 justify-end mb-4">
                <Link to="/privacy" className="text-gray-400 hover:text-white">
                  Privacy
                </Link>
                <Link to="/terms" className="text-gray-400 hover:text-white">
                  Terms
                </Link>
                <Link to="/refund" className="text-gray-400 hover:text-white">
                  Refund Policy
                </Link>
              </div>
              <p className="text-gray-500 text-sm">
                © 2024 Conform Studio. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ProductHome;
