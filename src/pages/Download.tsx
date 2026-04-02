import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Download as DownloadIcon, CheckCircle2 } from "lucide-react";
import { TermsOfService } from "@/components/download/TermsOfService";
import { toast } from "sonner";
import conformStudioLogo from "@/assets/conform-studio-logo.svg";
import Header from "@/components/Header";


const Download = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleDownload = () => {
    toast.success("Download started!", {
      description: "Your software is being downloaded.",
    });
    window.location.href = "https://fpgieuoozfvoqjsdltgh.supabase.co/storage/v1/object/public/conform-studio/releases/1.9.10.2/ConformStudio-1.9.10.2-Installer.pkg";
  };

  return (
    <div className="min-h-screen bg-background">
      <Header minimal />

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
          {/* Terms Section */}
          <section>
            <TermsOfService onScrollToBottom={setHasScrolledToBottom} />
          </section>

          {/* Download Section */}
          <section className="max-w-3xl mx-auto">
            <div className="glass-card p-8 md:p-12 rounded-2xl text-center space-y-6 border border-border">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">
                  Ready to get started?
                </h2>
                <p className="text-muted-foreground">
                  {agreedToTerms
                    ? "Click the button below to download the latest version."
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

              <button
                className="h-9 px-5 rounded-md border border-white/[0.12] bg-white/[0.06] text-[11px] font-normal tracking-[0.15px] text-white/70 transition-all hover:border-white/[0.18] hover:bg-white/[0.09] hover:text-white/90 disabled:opacity-40 disabled:pointer-events-none inline-flex items-center justify-center gap-2"
                disabled={!agreedToTerms}
                onClick={handleDownload}
              >
                <DownloadIcon className="w-3.5 h-3.5" />
                Download
              </button>

              {!hasScrolledToBottom && (
                <p className="text-sm text-muted-foreground animate-pulse">
                  Scroll through the terms to enable agreement
                </p>
              )}

              <div className="pt-6 border-t border-border text-xs text-muted-foreground">
                <p>Version 1.9.10.2 -- Compatible with macOS</p>
              </div>
            </div>
          </section>

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
