import { Link } from "react-router-dom";
import Header from "@/components/Header";
import SEO from "@/components/SEO";
import Footer from "@/components/Footer";

const steps = [
  {
    number: "01",
    title: "Download & Install",
    description:
      "Download the macOS installer from the download page. Requires macOS Sonoma (14.0) or later. On first launch you may need to approve the app in System Settings > Privacy & Security.",
    link: { to: "/conform-studio/download", label: "Download" },
  },
  {
    number: "02",
    title: "Sign In",
    description:
      "Create an account or sign in with Google or Apple. Your subscription and device license are managed through your account. A 7-day free trial is included with every plan.",
  },
  {
    number: "03",
    title: "Open a Project",
    description:
      "From the dashboard, open your Premiere Pro project using the file browser, the open projects dropdown, or drag and drop. Supported formats include .prproj, .aaf, .avb, .edl, .xml, and .fcpxml.",
  },
  {
    number: "04",
    title: "Configure Your Conform",
    description:
      "Select which elements to include or exclude: disabled tracks, empty tracks, graphics, effects, offline clips, transitions, subtitles, through edits, multicam handling, and more. Format-specific options are shown automatically based on your project type.",
    image: { src: "/app-screens/screen-configure.png", alt: "Project configuration panel" },
  },
  {
    number: "05",
    title: "Run the Migration",
    description:
      "Hit the Run button. Conform Studio migrates your timeline in real time, showing progress with elapsed time. The conversion continues even if you minimize the app (configurable in Settings).",
    image: { src: "/app-screens/screen-progress.png", alt: "Migration in progress" },
  },
  {
    number: "06",
    title: "Review Results",
    description:
      "When complete, you'll see a summary of the migration. Your Resolve project is ready to open. From here you can switch to QC mode to verify the migration frame by frame.",
    image: { src: "/app-screens/screen-complete.png", alt: "Migration complete" },
    link: { to: "/conform-studio/docs/qc", label: "Learn about QC" },
  },
];

const DocsGettingStarted = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO
        title="Getting Started"
        description="Get started with Conform Studio — download, sign in, open a project, and run your first timeline migration from Premiere to Resolve."
        canonical="/conform-studio/docs/getting-started"
      />
      <Header />

      <main className="flex-1 pt-32 pb-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Breadcrumb */}
            <div className="mb-8">
              <p className="text-[11px] tracking-[0.15em] uppercase text-white/40">
                <Link to="/conform-studio/docs" className="hover:text-white/60 transition-colors no-underline text-white/40">
                  Docs
                </Link>
                <span className="mx-2">/</span>
                <span className="text-white/60">Getting Started</span>
              </p>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-4">
              Getting Started
            </h1>
            <p className="text-base text-white/50 mb-12">
              From download to your first migrated timeline in under 5 minutes.
            </p>

            {/* Steps */}
            <div className="space-y-8">
              {steps.map((step) => (
                <div key={step.number} className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 md:p-8">
                  <div className="flex items-start gap-4">
                    <span className="text-2xl font-bold text-white/20 font-mono flex-shrink-0">
                      {step.number}
                    </span>
                    <div className="flex-1">
                      <h2 className="text-lg font-semibold text-white mb-2">
                        {step.title}
                      </h2>
                      <p className="text-sm text-white/60 leading-relaxed">
                        {step.description}
                      </p>
                      {step.link && (
                        <Link
                          to={step.link.to}
                          className="inline-block mt-3 text-xs text-white/40 hover:text-white/60 transition-colors no-underline"
                        >
                          {step.link.label} &rarr;
                        </Link>
                      )}
                    </div>
                  </div>
                  {step.image && (
                    <div className="mt-6 rounded-xl border border-white/[0.06] overflow-hidden">
                      <img
                        src={step.image.src}
                        alt={step.image.alt}
                        className="w-full"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* System Requirements */}
            <div className="mt-12">
              <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-white/40 mb-4">
                System Requirements
              </p>
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 space-y-2">
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

            {/* Supported Formats */}
            <div className="mt-8">
              <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-white/40 mb-4">
                Supported Project Formats
              </p>
              <div className="flex flex-wrap gap-2">
                {[".prproj", ".aaf", ".avb", ".avp", ".edl", ".xml", ".fcpxml", ".ale"].map((fmt) => (
                  <span
                    key={fmt}
                    className="inline-flex px-2.5 py-1 rounded-full text-xs font-mono bg-white/[0.06] border border-white/[0.08] text-white/60"
                  >
                    {fmt}
                  </span>
                ))}
              </div>
            </div>

            {/* Back to docs */}
            <div className="mt-12 text-center">
              <Link
                to="/conform-studio/docs"
                className="text-sm text-white/40 hover:text-white/60 transition-colors no-underline"
              >
                &larr; Back to Documentation
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer hideAsciiLogo />
    </div>
  );
};

export default DocsGettingStarted;
