import { Link } from "react-router-dom";
import Header from "@/components/Header";
import SEO from "@/components/SEO";
import Footer from "@/components/Footer";

const DocsQC = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO
        title="Quality Control Documentation"
        description="Conform Studio QC tools — render analysis, NDI live analysis, verification settings, and CSV export."
        canonical="/conform-studio/docs/qc"
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
                <span className="text-white/60">Quality Control</span>
              </p>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-4">
              Quality Control
            </h1>
            <p className="text-base text-white/50 mb-12">
              Conform Studio's QC tools verify migration accuracy by comparing
              your source Premiere timeline against the generated Resolve project.
              Every clip, transition, effect, and marker is validated frame by frame.
            </p>

            {/* App Screenshot */}
            <section className="mb-12">
              <div className="rounded-2xl border border-white/[0.08] overflow-hidden">
                <img
                  src="/app-screens/screen-configure.png"
                  alt="Conform Studio project configuration"
                  className="w-full"
                />
              </div>
              <p className="text-xs text-white/30 mt-2 text-center">
                Conform Studio project configuration panel
              </p>
            </section>

            {/* How QC Works */}
            <section className="mb-12">
              <h2 className="text-xl font-bold text-white mb-4">
                How It Works
              </h2>
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 space-y-4">
                <p className="text-sm text-white/60 leading-relaxed">
                  After running a conform, switch to QC mode from the bottom dock.
                  Conform Studio detects your active DaVinci Resolve timeline
                  automatically (polling every 5 seconds) and displays it with a
                  pink highlight when connected.
                </p>
                <p className="text-sm text-white/60 leading-relaxed">
                  Choose an analysis mode, configure your quality settings, and hit
                  Run. The tool renders reference frames from Premiere and compares
                  them against the Resolve output, reporting any mismatches with
                  specific frame and timecode references.
                </p>
              </div>
            </section>

            {/* Analysis Modes */}
            <section className="mb-12">
              <h2 className="text-xl font-bold text-white mb-4">
                Analysis Modes
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6">
                  <h3 className="text-sm font-semibold text-white mb-2">
                    Render Analysis
                  </h3>
                  <p className="text-sm text-white/50 leading-relaxed">
                    The default mode. Exports a reference video from your Premiere
                    timeline and compares it frame-by-frame against the Resolve
                    output. Best for final verification after a conform.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6">
                  <h3 className="text-sm font-semibold text-white mb-2">
                    NDI Live Analysis
                  </h3>
                  <p className="text-sm text-white/50 leading-relaxed">
                    Uses a live Network Device Interface feed from DaVinci Resolve
                    for real-time comparison. Requires the Haste NDI node to be
                    enabled in Settings. Ideal for spot-checking during editing.
                  </p>
                </div>
              </div>
            </section>

            {/* Quality Control Settings */}
            <section className="mb-12">
              <h2 className="text-xl font-bold text-white mb-4">
                Settings
              </h2>
              <div className="space-y-4">
                <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6">
                  <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-white/40 mb-3">
                    Reference Video Track
                  </p>
                  <p className="text-sm text-white/60 leading-relaxed">
                    Select which video track to use as the comparison reference.
                    Auto-populated from your active Resolve timeline. Defaults to
                    Video Track 2. In NDI mode, the reference source is the live
                    NDI feed instead.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6">
                  <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-white/40 mb-3">
                    Render Scale
                  </p>
                  <p className="text-sm text-white/60 leading-relaxed mb-3">
                    Controls the resolution of the rendered reference frames.
                    Lower scales are faster; higher scales catch finer detail.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {["1/16 Res", "1/8 Res (default)", "1/4 Res", "1/2 Res", "Full Res"].map((scale) => (
                      <span
                        key={scale}
                        className="inline-flex px-2.5 py-1 rounded-full text-xs bg-white/[0.06] border border-white/[0.08] text-white/60"
                      >
                        {scale}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6">
                  <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-white/40 mb-3">
                    Render Quality
                  </p>
                  <p className="text-sm text-white/60 leading-relaxed mb-3">
                    Sets the encoding quality of reference renders. Higher quality
                    produces more accurate comparisons but takes longer.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {["Low (default)", "Medium", "High"].map((q) => (
                      <span
                        key={q}
                        className="inline-flex px-2.5 py-1 rounded-full text-xs bg-white/[0.06] border border-white/[0.08] text-white/60"
                      >
                        {q}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6">
                  <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-white/40 mb-3">
                    Analysis Threshold
                  </p>
                  <p className="text-sm text-white/60 leading-relaxed mb-3">
                    The minimum similarity percentage required for a frame to pass.
                    Higher thresholds are stricter but may flag acceptable
                    compression artifacts.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {["95%", "97%", "98%", "98.5% (default)", "99%", "99.5%"].map((t) => (
                      <span
                        key={t}
                        className="inline-flex px-2.5 py-1 rounded-full text-xs bg-white/[0.06] border border-white/[0.08] text-white/60"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* CSV Export */}
            <section className="mb-12">
              <h2 className="text-xl font-bold text-white mb-4">
                CSV Export
              </h2>
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6">
                <p className="text-sm text-white/60 leading-relaxed">
                  Enable "Export Results to CSV" to save a detailed frame-by-frame
                  comparison report. Use the Set Path button to choose your output
                  directory. The report includes timecodes, similarity scores, and
                  pass/fail status for every analyzed frame.
                </p>
              </div>
            </section>

            {/* Tips */}
            <section className="mb-12">
              <h2 className="text-xl font-bold text-white mb-4">
                Tips
              </h2>
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 space-y-3">
                {[
                  "Start with 1/8 Render Scale and Low Quality for a fast initial check, then re-run at higher settings for final verification.",
                  "If you see failures around cuts or transitions, try lowering the Analysis Threshold to 97% to account for render differences between Premiere and Resolve.",
                  "QC will stop early if 4 consecutive frames fail to capture -- this usually means Resolve is not on the correct page or the timeline is not active.",
                  "The active timeline indicator turns pink when Conform Studio is connected to Resolve. If it stays gray, make sure Resolve is open with a timeline selected.",
                ].map((tip, i) => (
                  <p key={i} className="text-sm text-white/60 leading-relaxed">
                    {tip}
                  </p>
                ))}
              </div>
            </section>

            {/* Back to docs */}
            <div className="text-center">
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

export default DocsQC;
