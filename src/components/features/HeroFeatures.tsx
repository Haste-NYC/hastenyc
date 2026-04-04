import { motion } from "framer-motion";

const heroFeatures = [
  {
    stat: "View Color",
    statSmall: true,
    suffix: "In Context",
    title: "The End of Roundtrip Workflows",
    description:
      "Stop bouncing between applications to check your work. Conform once, grade in Resolve, and never rebuild a timeline again.",
    hours: "Eliminates round trips",
  },
  {
    stat: "One-Click",
    statSmall: true,
    suffix: "Conversion",
    title: "We Handle the Conform / You Focus on the Grade",
    description:
      "Converts an entire Adobe Premiere Pro timeline into DaVinci Resolve in minutes, not hours. Clips, tracks, timecodes, markers, audio levels, and media references transfer automatically — no manual rebuild required.",
    hours: "4-40+ hours saved",
  },
  {
    stat: "Batch",
    statSmall: true,
    suffix: "Timeline Support",
    title: "Less Rebuilding / More Finishing",
    description:
      "Import timelines from Avid Media Composer, Final Cut Pro 7, Final Cut Pro X, and industry-standard interchange formats. AAF, EDL, FCPXML, FCP7 XML, AVB — a single tool replaces format-specific workarounds and manual re-edits.",
    hours: "2-20 hours saved",
  },
  {
    stat: "Pixel-Perfect",
    statSmall: true,
    suffix: "QC Verification",
    title: "Every Frame Verified / Nothing Slips Through",
    description:
      "Pixel-level comparison between Premiere and Resolve outputs using SSIM scoring. Runs in real-time over NDI or offline against rendered frames. Flags every clip that doesn't match, with configurable pass/fail thresholds and optional CSV report.",
    hours: "2-6 hours saved",
  },
];

export default function HeroFeatures() {
  return (
    <div className="space-y-0">
      {heroFeatures.map((feature, i) => (
        <motion.div
          key={i}
          className="px-4 sm:px-6 md:px-12 lg:px-20 py-6 md:py-10 border-b border-white/[0.04]"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          <div className={`max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-start`}>
            {/* Stat */}
            <div className={i % 2 === 1 ? "md:order-2 md:text-right" : ""}>
              <span
                className="font-black leading-none tracking-tight block"
                style={{
                  fontSize: feature.statSmall
                    ? "clamp(36px, 7vw, 90px)"
                    : "clamp(48px, 10vw, 120px)",
                  letterSpacing: "-0.03em",
                }}
              >
                {feature.stat}
              </span>
              <span className={`block text-sm md:text-base font-bold tracking-wider text-foreground/50 uppercase -mt-1 md:-mt-2 ${i === 0 ? "pl-[0.35em]" : ""}`}>
                {feature.suffix}
              </span>
            </div>

            {/* Content */}
            <div className={i % 2 === 1 ? "md:order-1" : ""}>
              <h3 className="text-lg md:text-2xl font-bold uppercase tracking-tight leading-tight mb-4">
                {feature.title}
              </h3>
              <p className="text-sm md:text-[15px] text-foreground/55 leading-relaxed max-w-lg">
                {feature.description}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
