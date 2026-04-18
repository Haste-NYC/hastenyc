import { useState } from "react";
import { motion } from "framer-motion";
import { Download, Mail, ExternalLink, Copy, Check } from "lucide-react";
import conformLogoSvg from "@/assets/conform-studio-logo.svg";
import hasteLogoSvg from "@/assets/haste-logo.svg";

const PRESS_VIDEO_PATH = "/conform-studio-demo.mp4";
const PRESS_VIDEO_URL = "https://www.haste.nyc/conform-studio-demo.mp4";
const PRESS_EMBED_SNIPPET = `<video controls playsinline width="100%" src="${PRESS_VIDEO_URL}"></video>`;

const TESTIMONIAL_VIMEO_ID = "1081347302";
const TESTIMONIAL_VIMEO_URL = `https://vimeo.com/${TESTIMONIAL_VIMEO_ID}`;
const TESTIMONIAL_VIDEO_PATH = "/conform-studio-testimonial.mp4";
const TESTIMONIAL_EMBED_SNIPPET = `<div style="padding:56.25% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/${TESTIMONIAL_VIMEO_ID}?badge=0&autopause=0&player_id=0&app_id=58479" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" style="position:absolute;top:0;left:0;width:100%;height:100%;" title="Conform Studio Testimonial"></iframe></div>`;

function CopyEmbedButton({ snippet }: { snippet: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(snippet);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch {}
      }}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-white/[0.12] bg-white/[0.06] hover:bg-white/[0.1] transition-colors text-xs font-medium tracking-wide uppercase"
    >
      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? "Copied" : "Copy Embed Code"}
    </button>
  );
}

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

const screenshots = [
  { src: "/app-screens/screen-select.png", caption: "Project selection and timeline import" },
  { src: "/app-screens/screen-configure.png", caption: "Conversion settings and configuration" },
  { src: "/app-screens/screen-progress.png", caption: "Real-time conversion progress" },
  { src: "/app-screens/screen-complete.png", caption: "Completed conversion with QC results" },
  { src: "/ui-showcase-gathering.png", caption: "Gathering info from Premiere" },
  { src: "/ui-showcase-importing.png", caption: "Importing media" },
  { src: "/ui-showcase-linking.png", caption: "Linking media files" },
  { src: "/ui-showcase-complete.png", caption: "Conform complete — 0 errors detected" },
];

const stats = [
  { value: "300X", label: "Faster Than Manual" },
  { value: "4-40+", label: "Hours Saved / Project" },
  { value: "5+", label: "NLE Formats Supported" },
  { value: "macOS", label: "Native Application" },
];

const SectionLabel = ({ children }: { children: string }) => (
  <p className="text-[10px] uppercase tracking-[0.3em] text-white/30 mb-6">
    [ {children} ]
  </p>
);

const SectionTitle = ({ children }: { children: string }) => (
  <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-tight mb-6">
    {children}
  </h2>
);

const GlassCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`rounded-xl border border-white/[0.08] bg-white/[0.03] ${className}`}>
    {children}
  </div>
);

export default function PressContent() {
  return (
    <div className="container mx-auto px-4 sm:px-6 max-w-4xl space-y-24 md:space-y-32">

      {/* ── Hero ── */}
      <section className="text-center">
        <motion.div {...fadeUp} transition={{ duration: 0.5 }}>
          <SectionLabel>Press Resources</SectionLabel>
        </motion.div>
        <motion.h1
          {...fadeUp}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl md:text-6xl font-bold uppercase tracking-tight mb-6"
        >
          Press Resources
        </motion.h1>
        <motion.a
          {...fadeUp}
          transition={{ duration: 0.5, delay: 0.3 }}
          href="https://fpgieuoozfvoqjsdltgh.supabase.co/storage/v1/object/public/press-kit/conform-studio-press-kit.zip"
          download
          className="inline-flex items-center gap-2.5 px-8 py-3 rounded-md border border-white/[0.12] bg-white/[0.06] hover:bg-white/[0.1] transition-colors text-sm font-medium tracking-wide uppercase"
        >
          <Download className="w-4 h-4" />
          Download All Assets
        </motion.a>
      </section>

      {/* ── Company Boilerplate ── */}
      <motion.section {...fadeUp} transition={{ duration: 0.5 }}>
        <SectionLabel>About</SectionLabel>
        <SectionTitle>Company</SectionTitle>
        <div className="space-y-4 text-sm md:text-[15px] text-white/60 leading-relaxed">
          <p>
            Haste is a software company building automation tools for the film and television
            post-production industry. Founded by editors and post-production professionals,
            Haste builds technology that eliminates the tedious, error-prone workflows that
            have been a pain point in the industry for decades.
          </p>
          <p>
            Conform Studio is the company's flagship product: a native macOS application for
            post-production professionals that handles project migration of editorial timelines
            from Adobe Premiere Pro to DaVinci Resolve in minutes instead of days. It transfers
            clips, tracks, timecodes, markers, audio levels, effects, and media references
            automatically, with auto media relinking and pixel-level QC verification. It handles
            complex time remapping and preserves effects and transitions that would otherwise be
            lost in traditional exchange formats.
          </p>
          <p>
            The application also supports batch import from Avid Media Composer (currently in
            beta), Final Cut Pro 7, Final Cut Pro X, and industry-standard interchange formats
            including AAF, EDL, FCPXML, FCP7 XML, and AVB. Additional application support is
            underway.
          </p>
        </div>
      </motion.section>

      {/* ── Press Release ── */}
      <motion.section {...fadeUp} transition={{ duration: 0.5 }}>
        <SectionLabel>Press Releases</SectionLabel>
        <SectionTitle>Launch Announcement</SectionTitle>
        <GlassCard className="p-6 md:p-8">
          <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-white/40 mb-3">
            April 2026
          </p>
          <h3 className="text-lg md:text-xl font-bold uppercase tracking-tight mb-4">
            Haste Releases Conform Studio: Instant Timeline Migration for the Post-Production Industry
          </h3>
          <div className="space-y-3 text-sm text-white/55 leading-relaxed">
            <p>
              NAB LAS VEGAS -- Haste today releases its flagship product, Conform Studio, a native
              macOS application for post-production industry professionals that handles project
              migration of editorial timelines from Adobe Premiere Pro to DaVinci Resolve. What
              traditionally takes editors 4 to 40+ hours of manual rebuilding can now be completed
              in minutes.
            </p>
            <p>
              Conform Studio addresses one of the most persistent pain points in film and television
              post-production: the conform process. When projects move from editorial (Premiere Pro)
              to color grading and finishing (DaVinci Resolve), timelines must be manually recreated
              -- or effects stripped and reapplied after color, visual effects, and other downstream
              work -- a process that is slow, expensive, and error-prone.
            </p>
            <p>
              "Every post house in the world deals with this problem," said Jordan Taylor Fuller,
              founder of Haste. "We built Conform Studio because we've lived the problem. The
              process hadn't changed in 20 years and was overdue for an update."
            </p>
            <p>
              Key features include one-click Premiere-to-Resolve conversion, auto media relinking,
              complex time remapping, pixel-level QC verification using SSIM scoring, batch timeline
              import from multiple NLE formats, and a full CLI for facility pipeline integration.
              Avid Media Composer support is currently in beta; Avid recently approved the Conform
              Studio panel extension, which Haste is shipping with the initial release. Additional
              application support is underway.
            </p>
            <p>
              Conform Studio is available now starting at $59/month for individuals, with team and
              enterprise plans available. A 7-day free trial is included with all plans.
            </p>
          </div>
        </GlassCard>
      </motion.section>

      {/* ── Key Stats ── */}
      <motion.section {...fadeUp} transition={{ duration: 0.5 }}>
        <SectionLabel>Key Stats</SectionLabel>
        <SectionTitle>By the Numbers</SectionTitle>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="h-full"
            >
              <GlassCard className="p-6 text-center h-full flex flex-col justify-center">
                <p className="text-3xl md:text-4xl font-bold tracking-tight">{stat.value}</p>
                <p className="text-[11px] text-white/40 uppercase tracking-wider mt-2">{stat.label}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ── Testimonial Video ── */}
      <motion.section {...fadeUp} transition={{ duration: 0.5 }}>
        <SectionLabel>Testimonial</SectionLabel>
        <SectionTitle>Testimonial Video</SectionTitle>
        <GlassCard className="overflow-hidden">
          <div style={{ padding: "56.25% 0 0 0", position: "relative" }}>
            <iframe
              src={`https://player.vimeo.com/video/${TESTIMONIAL_VIMEO_ID}?badge=0&autopause=0&player_id=0&app_id=58479`}
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
              title="Conform Studio Testimonial"
            />
          </div>
        </GlassCard>

        <div className="flex flex-wrap gap-3 mt-4 justify-center">
          <a
            href={TESTIMONIAL_VIDEO_PATH}
            download="conform-studio-testimonial.mp4"
            className="inline-flex items-center gap-2 px-5 py-2 rounded-md border border-white/[0.12] bg-white/[0.06] hover:bg-white/[0.1] transition-colors text-xs font-medium tracking-wide uppercase"
          >
            <Download className="w-3.5 h-3.5" />
            Download MP4 (1080p)
          </a>
          <CopyEmbedButton snippet={TESTIMONIAL_EMBED_SNIPPET} />
        </div>

        <div className="mt-4">
          <p className="text-[11px] uppercase tracking-[0.2em] text-white/40 mb-2">Embed code</p>
          <pre className="rounded-lg border border-white/[0.08] bg-white/[0.03] p-4 text-[12px] text-white/70 overflow-x-auto whitespace-pre-wrap break-all">
{TESTIMONIAL_EMBED_SNIPPET}
          </pre>
          <p className="text-xs text-white/30 mt-3 text-center">
            Free to download, embed, and redistribute for editorial coverage. Direct link:{" "}
            <a
              href={TESTIMONIAL_VIMEO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/50 hover:text-white underline underline-offset-2 transition-colors"
            >
              vimeo.com/{TESTIMONIAL_VIMEO_ID}
            </a>
          </p>
        </div>
      </motion.section>

      {/* ── Premiere to Resolve Workflow (downloadable + embeddable) ── */}
      <motion.section {...fadeUp} transition={{ duration: 0.5 }}>
        <SectionLabel>Product Demo</SectionLabel>
        <SectionTitle>Premiere to Resolve Workflow</SectionTitle>
        <GlassCard className="overflow-hidden">
          <video
            controls
            playsInline
            preload="metadata"
            src={PRESS_VIDEO_PATH}
            className="w-full block bg-black"
          />
        </GlassCard>

        <div className="flex flex-wrap gap-3 mt-4 justify-center">
          <a
            href={PRESS_VIDEO_PATH}
            download="conform-studio-demo.mp4"
            className="inline-flex items-center gap-2 px-5 py-2 rounded-md border border-white/[0.12] bg-white/[0.06] hover:bg-white/[0.1] transition-colors text-xs font-medium tracking-wide uppercase"
          >
            <Download className="w-3.5 h-3.5" />
            Download MP4 (1080p)
          </a>
          <CopyEmbedButton snippet={PRESS_EMBED_SNIPPET} />
        </div>

        <div className="mt-4">
          <p className="text-[11px] uppercase tracking-[0.2em] text-white/40 mb-2">Embed code</p>
          <pre className="rounded-lg border border-white/[0.08] bg-white/[0.03] p-4 text-[12px] text-white/70 overflow-x-auto whitespace-pre-wrap break-all">
{PRESS_EMBED_SNIPPET}
          </pre>
          <p className="text-xs text-white/30 mt-3 text-center">
            Free to download, embed, and redistribute for editorial coverage.
          </p>
        </div>
      </motion.section>

      {/* ── Product Screenshots ── */}
      <motion.section {...fadeUp} transition={{ duration: 0.5 }}>
        <SectionLabel>Product Screenshots</SectionLabel>
        <SectionTitle>Screenshots</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {screenshots.map((shot, i) => (
            <motion.div
              key={shot.src}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
            >
              <a href={shot.src} target="_blank" rel="noopener noreferrer" className="block group">
                <GlassCard className="p-3 transition-colors group-hover:border-white/[0.15]">
                  <img
                    src={shot.src}
                    alt={shot.caption}
                    className="w-full rounded-lg"
                    loading="lazy"
                  />
                  <p className="text-xs text-white/40 mt-3 px-1 flex items-center justify-between">
                    <span>{shot.caption}</span>
                    <ExternalLink className="w-3 h-3 text-white/20 group-hover:text-white/40 transition-colors" />
                  </p>
                </GlassCard>
              </a>
            </motion.div>
          ))}
        </div>
        <p className="text-xs text-white/30 mt-3 text-center">
          Click any screenshot to view full resolution. All images are free to use for press coverage.
        </p>
      </motion.section>

      {/* ── Logo Pack ── */}
      <motion.section {...fadeUp} transition={{ duration: 0.5 }}>
        <SectionLabel>Logo Pack</SectionLabel>
        <SectionTitle>Logos</SectionTitle>

        {/* Conform Studio */}
        <p className="text-[11px] uppercase tracking-[0.2em] text-white/40 mb-3">Conform Studio</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <GlassCard className="p-8 flex items-center justify-center min-h-[160px]">
            <img src={conformLogoSvg} alt="Conform Studio logo on dark" className="h-10 w-auto" />
          </GlassCard>
          <div className="rounded-xl border border-white/[0.08] bg-white p-8 flex items-center justify-center min-h-[160px]">
            <img
              src={conformLogoSvg}
              alt="Conform Studio logo on light"
              className="h-10 w-auto"
              style={{ filter: "invert(1)" }}
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-3 mt-4 justify-center">
          <a
            href={conformLogoSvg}
            download="conform-studio-logo.svg"
            className="inline-flex items-center gap-2 px-5 py-2 rounded-md border border-white/[0.12] bg-white/[0.06] hover:bg-white/[0.1] transition-colors text-xs font-medium tracking-wide uppercase"
          >
            <Download className="w-3.5 h-3.5" />
            SVG
          </a>
          <a
            href="/conform-studio-logo.png"
            download="conform-studio-logo.png"
            className="inline-flex items-center gap-2 px-5 py-2 rounded-md border border-white/[0.12] bg-white/[0.06] hover:bg-white/[0.1] transition-colors text-xs font-medium tracking-wide uppercase"
          >
            <Download className="w-3.5 h-3.5" />
            PNG
          </a>
        </div>

        {/* Haste */}
        <p className="text-[11px] uppercase tracking-[0.2em] text-white/40 mt-12 mb-3">Haste</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <GlassCard className="p-8 flex items-center justify-center min-h-[160px]">
            <img src={hasteLogoSvg} alt="Haste logo on dark" className="h-10 w-auto" />
          </GlassCard>
          <div className="rounded-xl border border-white/[0.08] bg-white p-8 flex items-center justify-center min-h-[160px]">
            <img
              src={hasteLogoSvg}
              alt="Haste logo on light"
              className="h-10 w-auto"
              style={{ filter: "invert(1)" }}
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-3 mt-4 justify-center">
          <a
            href={hasteLogoSvg}
            download="haste-logo.svg"
            className="inline-flex items-center gap-2 px-5 py-2 rounded-md border border-white/[0.12] bg-white/[0.06] hover:bg-white/[0.1] transition-colors text-xs font-medium tracking-wide uppercase"
          >
            <Download className="w-3.5 h-3.5" />
            SVG
          </a>
          <a
            href="/haste-logo.png"
            download="haste-logo.png"
            className="inline-flex items-center gap-2 px-5 py-2 rounded-md border border-white/[0.12] bg-white/[0.06] hover:bg-white/[0.1] transition-colors text-xs font-medium tracking-wide uppercase"
          >
            <Download className="w-3.5 h-3.5" />
            PNG
          </a>
        </div>

        <p className="text-xs text-white/30 mt-6 text-center">
          Please do not modify, distort, or recolor the logos. Maintain clear space around the marks.
        </p>
      </motion.section>

      {/* ── Team ── */}
      <motion.section {...fadeUp} transition={{ duration: 0.5 }}>
        <SectionLabel>Team</SectionLabel>
        <SectionTitle>Leadership</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: "Jordan Taylor Fuller",
              title: "Founder, CEO",
              headshot: "/headshot-jordan.png",
              bio: "14 years in TV and film. 3-time Emmy Award winner, 4-time Telly Award winner. Past clients include The New York Times, ABC, NBC, and TruTV.",
            },
            {
              name: "Fred Benenson",
              title: "Advisor",
              headshot: "/headshot-fred.png",
              bio: "Executive Producer. General Partner at 22 Ventures. CEO of Breadwinner. Former VP of Data at Kickstarter and Admissions Manager at Y Combinator.",
            },
            {
              name: "Ryan Gray",
              title: "Director, Design",
              headshot: "/headshot-ryan.png",
              bio: "14 years in user interface design and design strategy. Past clients include Nike, Disney, Outdoor Voices, KitchenAid, The Economist, and Alamo Drafthouse.",
            },
          ].map((person, i) => (
            <motion.div
              key={person.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <GlassCard className="p-6">
                <img
                  src={person.headshot}
                  alt={person.name}
                  className="w-20 h-20 rounded-full object-cover mb-4"
                />
                <h3 className="text-base font-bold uppercase tracking-tight">{person.name}</h3>
                <p className="text-xs text-white/50 uppercase tracking-wider mt-1">{person.title}</p>
                <p className="text-sm text-white/40 leading-relaxed mt-3">{person.bio}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ── Press Contact ── */}
      <motion.section {...fadeUp} transition={{ duration: 0.5 }} className="text-center">
        <SectionLabel>Press Contact</SectionLabel>
        <SectionTitle>Get in Touch</SectionTitle>
        <p className="text-sm text-white/50 mb-6">
          For press inquiries, review copies, interview requests, and media partnerships.
        </p>
        <a
          href="mailto:press@haste.nyc"
          className="inline-flex items-center gap-2.5 px-8 py-3 rounded-md border border-white/[0.12] bg-white/[0.06] hover:bg-white/[0.1] transition-colors text-sm font-medium tracking-wide uppercase"
        >
          <Mail className="w-4 h-4" />
          press@haste.nyc
        </a>
      </motion.section>

      {/* ── Download All CTA ── */}
      <motion.section {...fadeUp} transition={{ duration: 0.5 }} className="text-center pb-8">
        <div className="border-t border-white/[0.06] pt-16">
          <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-tight mb-4">
            Download All Assets
          </h2>
          <p className="text-sm text-white/40 max-w-md mx-auto mb-8">
            Logo files, product screenshots, headshots, and brand guidelines in one ZIP.
          </p>
          <a
            href="https://fpgieuoozfvoqjsdltgh.supabase.co/storage/v1/object/public/press-kit/conform-studio-press-kit.zip"
          download
            className="inline-flex items-center gap-2.5 px-10 py-3.5 rounded-md border border-white/[0.15] bg-white/[0.06] hover:bg-white/[0.1] transition-colors text-sm font-medium tracking-wide uppercase"
          >
            <Download className="w-4 h-4" />
            Download ZIP
          </a>
          <p className="text-[11px] text-white/25 mt-4">
            Includes SVG, PNG, and high-resolution assets
          </p>
        </div>
      </motion.section>
    </div>
  );
}
