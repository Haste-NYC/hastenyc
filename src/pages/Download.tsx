import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import { Download as DownloadIcon, CheckCircle2, Loader2, ArrowRight, Monitor } from "lucide-react";
import { TermsOfService } from "@/components/download/TermsOfService";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import conformStudioLogo from "@/assets/conform-studio-logo.svg";
import Header from "@/components/Header";

const STORAGE_KEY = "conform_studio_email";

const METADATA_URL =
  "https://fpgieuoozfvoqjsdltgh.supabase.co/storage/v1/object/public/conform-studio/metadata.json";

interface ReleaseInfo {
  version: string;
  arm64Url: string;
  x64Url: string;
  hasArchSplit: boolean;
}

function useReleaseInfo(): ReleaseInfo & { isLoading: boolean } {
  const [info, setInfo] = useState<ReleaseInfo>({
    version: "",
    arm64Url: "",
    x64Url: "",
    hasArchSplit: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchMetadata() {
      try {
        const res = await fetch(METADATA_URL, { cache: "no-store" });
        if (!res.ok) throw new Error("metadata not found");
        const data = await res.json();

        if (cancelled) return;

        // Supabase may return a JSON error body (e.g. {"statusCode":"404"}) with a non-404 status
        if (data.statusCode || data.error) throw new Error("metadata returned error response");

        const version = data.latest_version;
        if (!version) throw new Error("no latest_version in metadata");

        const release = data.releases?.[version];
        if (!release) throw new Error(`no release entry for ${version}`);

        const darwin = release.downloads?.darwin;
        const darwinX64 = release.downloads?.darwin_x64;

        if (darwinX64) {
          // Architecture-specific builds available
          setInfo({
            version,
            arm64Url: darwin?.url || "",
            x64Url: darwinX64.url,
            hasArchSplit: true,
          });
        } else if (darwin) {
          // Universal build only
          setInfo({
            version,
            arm64Url: darwin.url,
            x64Url: darwin.url,
            hasArchSplit: false,
          });
        }
      } catch (err) {
        console.error("[Download] Failed to fetch release metadata:", err);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchMetadata();
    return () => { cancelled = true; };
  }, []);

  return { ...info, isLoading };
}

const Download = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const release = useReleaseInfo();

  // Email gate state -- skip if user came from Stripe checkout or already provided email
  const storedEmail = localStorage.getItem(STORAGE_KEY);
  const [emailCaptured, setEmailCaptured] = useState(!!sessionId || !!storedEmail);
  const [email, setEmail] = useState(storedEmail || "");
  const [isSubmittingEmail, setIsSubmittingEmail] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.trim())) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSubmittingEmail(true);

    try {
      const { error } = await supabase
        .from("mailing_list")
        .insert({ email: email.trim().toLowerCase(), source: "conform-studio-download" });

      if (error) {
        console.error("[Download] Email insert error:", error);
      }

      localStorage.setItem(STORAGE_KEY, email.trim().toLowerCase());
      setEmailCaptured(true);
    } catch (err) {
      console.error("[Download] Email error:", err);
      setEmailCaptured(true);
    } finally {
      setIsSubmittingEmail(false);
    }
  };

  const handleDownload = (url: string, label: string) => {
    if (!url) {
      toast.error("Download unavailable. Please refresh the page and try again.");
      return;
    }
    toast.success("Download started!", {
      description: `Downloading ${label} installer.`,
    });
    // Open in new tab so the current page state is preserved
    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Payment Success Banner */}
      {sessionId && (
        <div className="pt-20 pb-0">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto flex items-center justify-center gap-3 py-4 px-6 rounded-lg border border-green-500/20 bg-green-500/5">
              <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
              <p className="text-sm text-green-400">
                Payment successful -- your subscription is now active. Agree to the terms below to download.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto text-center space-y-6">
            <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground">
              Introducing from{" "}
              <a href="https://www.haste.nyc" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                Haste.NYC
              </a>
            </p>

            <div className="flex justify-center py-8">
              <img
                src={conformStudioLogo}
                alt="Conform Studio"
                className="w-full max-w-3xl h-auto"
              />
            </div>

            <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              AI-POWERED AUTOMATION FOR SEAMLESS POST WORKFLOWS
            </p>

            <p className="text-base md:text-lg text-foreground/80 max-w-3xl mx-auto pt-4">
              Conform Studio connects previously siloed creative software -- Premiere, Resolve, Avid,
              Pro Tools -- and bridges the gaps between them. Say goodbye to relinking errors, round-trip
              workflows, and days of manual QC.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16">
        <div className="space-y-12">

          {/* Email Capture -- shown only if user hasn't provided email and didn't come from Stripe */}
          {!emailCaptured && (
            <section className="max-w-xl mx-auto">
              <div className="glass-card p-8 md:p-10 rounded-2xl text-center space-y-6 border border-border">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold tracking-tight">
                    Download Conform Studio
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Enter your email to get started. You'll create an account and activate your subscription when you launch the app.
                  </p>
                </div>

                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <div className="flex gap-3">
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoFocus
                      className="flex-1 h-10 px-4 rounded-lg border border-white/[0.12] bg-white/[0.04] text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-white/30 transition-colors"
                    />
                    <button
                      type="submit"
                      disabled={isSubmittingEmail}
                      className="h-10 px-5 rounded-lg bg-white text-black text-sm font-medium transition-all hover:bg-white/90 disabled:opacity-50 disabled:pointer-events-none inline-flex items-center gap-2"
                    >
                      {isSubmittingEmail ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          Continue
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground/60">
                    Free download -- 7-day trial included. No credit card required.
                  </p>
                </form>
              </div>
            </section>
          )}

          {/* Terms Section -- only shown after email is captured */}
          {emailCaptured && (
            <section>
              <TermsOfService onScrollToBottom={setHasScrolledToBottom} />
            </section>
          )}

          {/* Download Section -- only shown after email is captured */}
          {emailCaptured && (
          <section className="max-w-3xl mx-auto">
            <div className="glass-card p-8 md:p-12 rounded-2xl text-center space-y-6 border border-border">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">
                  Ready to get started?
                </h2>
                <p className="text-muted-foreground">
                  {agreedToTerms
                    ? "Select your installer below to download the latest version."
                    : hasScrolledToBottom
                      ? "Please agree to the Terms of Service to continue."
                      : "Please read the Terms of Service above to continue."}
                </p>
              </div>

              <div className="flex items-center justify-center space-x-3">
                <Checkbox
                  id="terms"
                  checked={agreedToTerms}
                  onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
                  disabled={!hasScrolledToBottom}
                  className="h-5 w-5"
                />
                <label
                  htmlFor="terms"
                  className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed ${
                    hasScrolledToBottom ? "text-foreground cursor-pointer" : "text-muted-foreground opacity-50"
                  }`}
                >
                  I agree to the Terms of Service
                </label>
              </div>

              {/* Download buttons */}
              {release.hasArchSplit ? (
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    className="h-10 px-6 rounded-md border border-white/[0.12] bg-white/[0.06] text-xs font-normal tracking-[0.15px] text-white/70 transition-all hover:border-white/[0.18] hover:bg-white/[0.09] hover:text-white/90 disabled:opacity-40 disabled:pointer-events-none inline-flex items-center justify-center gap-2"
                    disabled={!agreedToTerms || release.isLoading || !release.arm64Url}
                    onClick={() => handleDownload(release.arm64Url, "Apple Silicon")}
                  >
                    <DownloadIcon className="w-3.5 h-3.5" />
                    Apple Silicon (M1/M2/M3/M4)
                  </button>
                  <button
                    className="h-10 px-6 rounded-md border border-white/[0.12] bg-white/[0.06] text-xs font-normal tracking-[0.15px] text-white/70 transition-all hover:border-white/[0.18] hover:bg-white/[0.09] hover:text-white/90 disabled:opacity-40 disabled:pointer-events-none inline-flex items-center justify-center gap-2"
                    disabled={!agreedToTerms || release.isLoading || !release.x64Url}
                    onClick={() => handleDownload(release.x64Url, "Intel")}
                  >
                    <DownloadIcon className="w-3.5 h-3.5" />
                    Intel
                  </button>
                </div>
              ) : (
                <button
                  className="h-9 px-5 rounded-md border border-white/[0.12] bg-white/[0.06] text-[11px] font-normal tracking-[0.15px] text-white/70 transition-all hover:border-white/[0.18] hover:bg-white/[0.09] hover:text-white/90 disabled:opacity-40 disabled:pointer-events-none inline-flex items-center justify-center gap-2"
                  disabled={!agreedToTerms || release.isLoading || !release.arm64Url}
                  onClick={() => handleDownload(release.arm64Url, "macOS")}
                >
                  {release.isLoading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <DownloadIcon className="w-3.5 h-3.5" />
                  )}
                  Download
                </button>
              )}

              {!hasScrolledToBottom && (
                <p className="text-sm text-muted-foreground animate-pulse">
                  Scroll through the terms to enable agreement
                </p>
              )}

              {/* Version + system requirements */}
              <div className="pt-6 border-t border-border text-xs text-muted-foreground space-y-3">
                <p>{release.isLoading ? "Loading version..." : `Version ${release.version}`}</p>

                <div className="flex items-start justify-center gap-2 text-muted-foreground/60">
                  <Monitor className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                  <div className="text-left">
                    <p>Requires macOS Sonoma (14.0) or later</p>
                    <p>Adobe Premiere Pro 2024 or later</p>
                    <p>DaVinci Resolve Studio 18 or later</p>
                  </div>
                </div>

                <p className="text-muted-foreground/60">
                  After installing, you'll be prompted to create an account and start your free trial.
                </p>
              </div>
            </div>
          </section>
          )}

          {/* Features Section */}
          <section className="max-w-5xl mx-auto pt-12">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="glass-card p-6 rounded-xl space-y-3 transition-all hover:border-primary/50 border border-border">
                <h3 className="text-lg font-bold tracking-wide uppercase">300X FASTER</h3>
                <p className="text-sm text-muted-foreground">
                  What once took days now takes seconds. 100% accurate conform tasks at unprecedented speed.
                </p>
              </div>

              <div className="glass-card p-6 rounded-xl space-y-3 transition-all hover:border-primary/50 border border-border">
                <h3 className="text-lg font-bold tracking-wide uppercase">Studio Ready</h3>
                <p className="text-sm text-muted-foreground">
                  Built for TPN-compliant environments. Your media never leaves your pipeline.
                </p>
              </div>

              <div className="glass-card p-6 rounded-xl space-y-3 transition-all hover:border-primary/50 border border-border">
                <h3 className="text-lg font-bold tracking-wide uppercase">Seamless Integration</h3>
                <p className="text-sm text-muted-foreground">
                  Premiere to Resolve workflow shipping now. Avid Media Composer and Pro Tools support in beta.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>


    </div>
  );
};

export default Download;
