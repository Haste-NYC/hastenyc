import { Link } from "react-router-dom";
import Header from "@/components/Header";
import SEO from "@/components/SEO";
import Footer from "@/components/Footer";

const DocsEnterprise = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO
        title="Enterprise Deployment"
        description="Conform Studio enterprise deployment guide — volume licensing, CLI integration, MDM deployment, and TPN-compliant environments."
        canonical="/conform-studio/docs/enterprise"
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
                <span className="text-white/60">Enterprise</span>
              </p>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-4">
              Enterprise Deployment
            </h1>
            <p className="text-base text-white/50 mb-12">
              Conform Studio Enterprise is designed for organizations with 5 or more
              users requiring centralized management, TPN-compliant deployment,
              and CLI/pipeline integration.
            </p>

            {/* System Requirements */}
            <section className="mb-12">
              <h2 className="text-xl font-bold text-white mb-4">
                System Requirements
              </h2>
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 space-y-2">
                {[
                  "macOS Sonoma (14.0) or later",
                  "Adobe Premiere Pro 2024 or later",
                  "DaVinci Resolve Studio 18 or later",
                  "Network: outbound HTTPS for license activation only -- no media leaves the facility",
                ].map((req) => (
                  <p key={req} className="text-sm text-white/60">
                    {req}
                  </p>
                ))}
              </div>
            </section>

            {/* Deployment Options */}
            <section className="mb-12">
              <h2 className="text-xl font-bold text-white mb-4">
                Deployment Options
              </h2>
              <div className="space-y-4">
                <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6">
                  <h3 className="text-sm font-semibold text-white mb-2">
                    Manual Installation
                  </h3>
                  <p className="text-sm text-white/50 leading-relaxed">
                    Standard .pkg installer. Deploy via MDM tools such as Jamf,
                    Mosyle, or Munki.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6">
                  <h3 className="text-sm font-semibold text-white mb-2">
                    CLI Installation
                  </h3>
                  <div className="bg-white/[0.04] border border-white/[0.08] rounded-lg p-4 font-mono text-sm text-white/80 overflow-x-auto">
                    conform-studio install --license-key &lt;KEY&gt;
                  </div>
                </div>
                <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6">
                  <h3 className="text-sm font-semibold text-white mb-2">
                    Silent / Headless Mode
                  </h3>
                  <p className="text-sm text-white/50 leading-relaxed mb-3">
                    Run Conform Studio without a GUI for pipeline integration.
                  </p>
                  <div className="bg-white/[0.04] border border-white/[0.08] rounded-lg p-4 font-mono text-sm text-white/80 overflow-x-auto">
                    conform-studio --headless --config /path/to/config.json
                  </div>
                </div>
              </div>
            </section>

            {/* License Management */}
            <section className="mb-12">
              <h2 className="text-xl font-bold text-white mb-4">
                License Management
              </h2>
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 space-y-3">
                {[
                  "Volume license keys for bulk seat provisioning",
                  "Offline activation available for air-gapped environments",
                  "Centralized license server for seat management and usage tracking",
                ].map((item) => (
                  <p key={item} className="text-sm text-white/60">
                    {item}
                  </p>
                ))}
              </div>
            </section>

            {/* CLI Reference */}
            <section className="mb-12">
              <h2 className="text-xl font-bold text-white mb-4">
                CLI Reference
              </h2>
              <div className="space-y-3">
                {[
                  {
                    cmd: "conform-studio conform --input <premiere_project> --output <resolve_project>",
                    desc: "Run a full timeline migration",
                  },
                  {
                    cmd: "conform-studio qc --input <project> --report <output_path>",
                    desc: "Generate a QC verification report",
                  },
                  {
                    cmd: "conform-studio status",
                    desc: "Check license and version information",
                  },
                ].map((entry) => (
                  <div key={entry.cmd}>
                    <div className="bg-white/[0.04] border border-white/[0.08] rounded-lg p-4 font-mono text-sm text-white/80 overflow-x-auto">
                      {entry.cmd}
                    </div>
                    <p className="text-xs text-white/40 mt-1.5 ml-1">
                      {entry.desc}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Security & Compliance */}
            <section className="mb-12">
              <h2 className="text-xl font-bold text-white mb-4">
                Security &amp; Compliance
              </h2>
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 space-y-3">
                {[
                  "TPN-compliant: no media data is transmitted externally",
                  "All processing happens locally on the workstation",
                  "License checks use encrypted HTTPS -- no project data included",
                  "SOC 2 Type II audit in progress",
                ].map((item) => (
                  <p key={item} className="text-sm text-white/60">
                    {item}
                  </p>
                ))}
              </div>
            </section>

            {/* CTA */}
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-8 text-center">
              <h2 className="text-xl font-bold text-white mb-3">
                Get started with Enterprise
              </h2>
              <p className="text-sm text-white/50 leading-relaxed max-w-lg mx-auto mb-6">
                Schedule a call with our enterprise team to discuss deployment,
                licensing, and custom integration requirements.
              </p>
              <Link
                to="/schedule"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/20 hover:border-white/40 text-sm text-white/70 hover:text-white transition-colors no-underline"
              >
                Schedule a Call &rarr;
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer hideAsciiLogo />
    </div>
  );
};

export default DocsEnterprise;
