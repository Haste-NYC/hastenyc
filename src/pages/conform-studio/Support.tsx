import { Link } from "react-router-dom";
import Header from "@/components/Header";
import SEO from "@/components/SEO";
import Footer from "@/components/Footer";

const contactChannels = [
  {
    title: "Email Support",
    description:
      "Reach us at info@haste.nyc. Freelancer plans receive a response within 24 hours. Team and Enterprise plans receive priority support.",
    href: "mailto:info@haste.nyc",
    linkLabel: "Send email",
    external: true,
  },
  {
    title: "Schedule a Call",
    description:
      "Book a 30-minute session for onboarding, demos, or technical questions.",
    href: "/schedule",
    linkLabel: "Book a time",
    external: false,
  },
  {
    title: "Documentation",
    description:
      "Guides for installation, QC tools, enterprise deployment, and CLI reference.",
    href: "/conform-studio/docs",
    linkLabel: "Browse docs",
    external: false,
  },
  {
    title: "FAQ",
    description:
      "Answers to the most common questions about Conform Studio.",
    href: "/#faq",
    linkLabel: "View FAQ",
    external: false,
  },
];

const commonIssues = [
  {
    title: "Premiere project won't import",
    solution:
      "Verify you are running Adobe Premiere Pro 2024 or later. Ensure the project file is saved and Premiere is closed before importing.",
  },
  {
    title: "Resolve timeline is empty after conform",
    solution:
      "Confirm you have DaVinci Resolve Studio 18 or later (the free version does not support all required APIs). Check that source media paths are accessible from the Resolve workstation.",
  },
  {
    title: "License activation issues",
    solution:
      "Ensure the machine has outbound HTTPS access. Check your subscription status in the app under Settings > Account. If you are in an air-gapped environment, contact us for offline activation.",
  },
  {
    title: "App won't launch",
    solution:
      "Conform Studio requires macOS Sonoma (14.0) or later. On first launch, you may need to approve the app in System Settings > Privacy & Security.",
  },
];

const Support = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO
        title="Support"
        description="Get help with Conform Studio. Email support, documentation, FAQs, and enterprise assistance."
        canonical="/conform-studio/support"
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
              Support
            </h1>
            <p className="text-base text-white/50 max-w-xl mx-auto">
              Get help with Conform Studio
            </p>
          </div>

          {/* Contact channels */}
          <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
            {contactChannels.map((channel) => {
              const inner = (
                <>
                  <h2 className="text-lg font-semibold text-white mb-2">
                    {channel.title}
                  </h2>
                  <p className="text-sm text-white/50 leading-relaxed mb-4">
                    {channel.description}
                  </p>
                  <span className="text-xs text-white/30 group-hover:text-white/50 transition-colors">
                    {channel.linkLabel} &rarr;
                  </span>
                </>
              );

              return channel.external ? (
                <a
                  key={channel.title}
                  href={channel.href}
                  className="group rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 transition-all hover:border-white/20 hover:bg-white/[0.05] no-underline"
                >
                  {inner}
                </a>
              ) : (
                <Link
                  key={channel.title}
                  to={channel.href}
                  className="group rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 transition-all hover:border-white/20 hover:bg-white/[0.05] no-underline"
                >
                  {inner}
                </Link>
              );
            })}
          </div>

          {/* Common Issues */}
          <div className="max-w-3xl mx-auto mb-16">
            <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-white/40 mb-6">
              Common Issues
            </p>
            <div className="space-y-4">
              {commonIssues.map((issue) => (
                <div
                  key={issue.title}
                  className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6"
                >
                  <h3 className="text-sm font-semibold text-white mb-2">
                    {issue.title}
                  </h3>
                  <p className="text-sm text-white/50 leading-relaxed">
                    {issue.solution}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Enterprise Support */}
          <div className="max-w-3xl mx-auto">
            <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-white/40 mb-6">
              Enterprise Support
            </p>
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-8 text-center">
              <h2 className="text-xl font-bold text-white mb-3">
                Dedicated enterprise assistance
              </h2>
              <p className="text-sm text-white/50 leading-relaxed max-w-lg mx-auto mb-6">
                Enterprise plans include a custom SLA, dedicated account manager,
                and hands-on pipeline integration support.
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

export default Support;
