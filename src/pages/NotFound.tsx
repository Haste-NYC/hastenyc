import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";


const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Helmet>
        <title>Page Not Found | HASTE</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="description" content="The page you're looking for doesn't exist. Return to HASTE homepage or explore our blog." />
      </Helmet>

      <Header />

      <main className="flex-1 flex items-center justify-center px-6">
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-8xl md:text-9xl font-bold text-gradient-brand mb-4">404</h1>
          <p className="text-2xl md:text-3xl font-bold uppercase mb-4">Page Not Found</p>
          <p className="text-lg text-muted-foreground mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center px-6 py-3 bg-brand-orange text-black font-bold uppercase tracking-wider hover:bg-brand-orange/90 transition-colors"
            >
              Go Home
            </Link>
            <Link
              to="/blog"
              className="inline-flex items-center justify-center px-6 py-3 border border-border font-bold uppercase tracking-wider hover:border-brand-orange hover:text-brand-orange transition-colors"
            >
              Read Our Blog
            </Link>
          </div>

          <div className="mt-12 pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground mb-4">Popular pages:</p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link to="/blog/adobe-max-2025" className="hover:text-brand-orange transition-colors">
                Adobe MAX 2025
              </Link>
              <span className="text-border">/</span>
              <Link to="/blog/figma-schema-2025" className="hover:text-brand-pink transition-colors">
                Figma Schema 2025
              </Link>
              <span className="text-border">/</span>
              <Link to="/blog/entertainment-shakeup" className="hover:text-brand-blue transition-colors">
                Entertainment News
              </Link>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
};

export default NotFound;
