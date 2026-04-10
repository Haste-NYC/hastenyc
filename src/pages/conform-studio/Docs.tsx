import { Link } from "react-router-dom";
import Header from "@/components/Header";
import SEO from "@/components/SEO";
import Footer from "@/components/Footer";

const docSections = [
  {
    title: "Getting Started",
    description:
      "Download the app, sign in, open a Premiere project, configure your conform settings, and migrate your first timeline to Resolve.",
    to: "/conform-studio/docs/getting-started",
  },
  {
    title: "Quality Control",
    description:
      "Render analysis, NDI live analysis, verification settings, threshold tuning, and CSV export.",
    to: "/conform-studio/docs/qc",
  },
  {
    title: "Enterprise Deployment",
    description:
      "Volume licensing, CLI/pipeline integration, MDM deployment, and TPN-compliant environments.",
    to: "/conform-studio/docs/enterprise",
  },
  {
    title: "Changelog",
    description: "Release notes and version history.",
    to: "/conform-studio/changelog",
  },
];

const Docs = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO
        title="Documentation"
        description="Conform Studio documentation — getting started, QC verification, enterprise deployment, and CLI reference."
        canonical="/conform-studio/docs"
      />
      <Header />

      <main className="flex-1 pt-32 pb-24">
        <div className="container mx-auto px-4">
          {/* Hero */}
          <div className="max-w-3xl mx-auto text-center mb-16">
            <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-white/40 mb-4">
              Conform Studio
            </p>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
              Documentation
            </h1>
            <p className="text-base text-white/50 max-w-xl mx-auto">
              Everything you need to install, configure, and get the most out of
              Conform Studio.
            </p>
          </div>

          {/* Doc section cards */}
          <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
            {docSections.map((section) => (
              <Link
                key={section.title}
                to={section.to}
                className="group rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 transition-all hover:border-white/20 hover:bg-white/[0.05] no-underline"
              >
                <h2 className="text-lg font-semibold text-white mb-2 group-hover:text-white/90">
                  {section.title}
                </h2>
                <p className="text-sm text-white/50 leading-relaxed mb-4">
                  {section.description}
                </p>
                <span className="text-xs text-white/30 group-hover:text-white/50 transition-colors">
                  Read more &rarr;
                </span>
              </Link>
            ))}
          </div>

          {/* System Requirements */}
          <div className="max-w-3xl mx-auto mt-16">
            <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-white/40 mb-6">
              System Requirements
            </p>
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 space-y-3">
              {[
                "macOS Sonoma (14.0) or later",
                "Adobe Premiere Pro 2024 or later",
                "DaVinci Resolve Studio 18 or later",
              ].map((req) => (
                <p key={req} className="text-sm text-white/60">
                  {req}
                </p>
              ))}
            </div>
          </div>

          {/* Need help */}
          <div className="max-w-3xl mx-auto mt-12 text-center">
            <p className="text-sm text-white/40">
              Need help?{" "}
              <Link
                to="/conform-studio/support"
                className="text-white/60 hover:text-white underline underline-offset-4 transition-colors"
              >
                Contact support
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer hideAsciiLogo />
    </div>
  );
};

export default Docs;
