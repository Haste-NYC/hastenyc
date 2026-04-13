import { useState } from "react";
import { Loader2, ArrowRight, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

import conformStudioLogo from "@/assets/conform-studio-logo.svg";
import Header from "@/components/Header";
import SEO from "@/components/SEO";

const GetConformStudio = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.trim())) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/promo/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error || "Something went wrong. Please try again.");
        return;
      }

      setSubmitted(true);

      setTimeout(() => {
        window.location.href = "https://www.haste.nyc";
      }, 5000);
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Get Conform Studio -- 90-Day Free Trial"
        description="Claim your 90-day free trial of Conform Studio. AI-powered automation for seamless post-production workflows."
        canonical="/get"
      />
      <Header />

      <section className="relative overflow-hidden pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto text-center space-y-8">
            <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground">
              Introducing from{" "}
              <a
                href="https://www.haste.nyc"
                className="hover:text-primary transition-colors"
              >
                Haste.NYC
              </a>
            </p>

            <div className="flex justify-center py-4">
              <img
                src={conformStudioLogo}
                alt="Conform Studio"
                className="w-full max-w-md h-auto"
              />
            </div>

            {!submitted ? (
              <div className="glass-card p-8 md:p-10 rounded-2xl text-center space-y-6 border border-border">
                <div className="space-y-2">
                  <h1 className="text-2xl font-bold tracking-tight">
                    Claim Your 90-Day Free Trial
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Enter your email to receive a coupon code
                    for 90 days of Conform&nbsp;Studio, completely&nbsp;free.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
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
                      disabled={isSubmitting}
                      className="h-10 px-5 rounded-lg bg-white text-black text-sm font-medium transition-all hover:bg-white/90 disabled:opacity-50 disabled:pointer-events-none inline-flex items-center gap-2"
                    >
                      {isSubmitting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          Claim
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </form>

                <p className="text-xs text-muted-foreground/60">
                  AI-powered automation for seamless post-production workflows.
                  <br />
                  Premiere to Resolve and beyond.
                </p>
              </div>
            ) : (
              <div className="glass-card p-8 md:p-10 rounded-2xl text-center space-y-4 border border-border">
                <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto" />
                <h2 className="text-2xl font-bold tracking-tight">
                  Check Your Email
                </h2>
                <p className="text-sm text-muted-foreground">
                  We've sent your 90-day coupon code to{" "}
                  <span className="text-foreground font-medium">{email}</span>.
                  <br />
                  Use it when you subscribe to get 3 months free.
                </p>
                <p className="text-xs text-muted-foreground/50 pt-2">
                  Redirecting to haste.nyc...
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default GetConformStudio;
