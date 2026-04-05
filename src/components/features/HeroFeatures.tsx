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

// Abstract visuals for each feature on mobile
function ColorContextVisual() {
  return (
    <div className="relative w-full h-full flex items-end justify-center pb-8">
      {/* Color wheels / grading abstraction */}
      <svg viewBox="0 0 300 160" className="w-full max-w-[280px] opacity-40">
        {/* Two overlapping timeline bars with color */}
        <rect x="20" y="20" width="120" height="8" rx="2" fill="rgba(255,255,255,0.15)" />
        <rect x="20" y="20" width="80" height="8" rx="2" fill="rgba(100,130,255,0.3)" />
        <rect x="20" y="34" width="120" height="8" rx="2" fill="rgba(255,255,255,0.15)" />
        <rect x="20" y="34" width="95" height="8" rx="2" fill="rgba(180,100,200,0.3)" />
        <rect x="20" y="48" width="120" height="8" rx="2" fill="rgba(255,255,255,0.15)" />
        <rect x="20" y="48" width="60" height="8" rx="2" fill="rgba(80,200,120,0.3)" />
        {/* Arrow */}
        <path d="M160 35 L185 35" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeDasharray="4 3" />
        <path d="M182 30 L190 35 L182 40" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" fill="none" />
        {/* Graded output */}
        <rect x="200" y="15" width="80" height="50" rx="4" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
        <rect x="206" y="21" width="68" height="38" rx="2" fill="rgba(140,100,200,0.12)" />
        <circle cx="240" cy="40" r="10" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
        <circle cx="240" cy="40" r="6" fill="none" stroke="rgba(180,100,200,0.25)" strokeWidth="1" />
        {/* Label */}
        <text x="150" y="100" textAnchor="middle" fill="rgba(255,255,255,0.12)" fontSize="9" fontWeight="600" letterSpacing="0.15em" fontFamily="-apple-system, sans-serif">PREMIERE</text>
        <text x="150" y="130" textAnchor="middle" fill="rgba(255,255,255,0.08)" fontSize="22" fontWeight="800" letterSpacing="-0.02em" fontFamily="-apple-system, sans-serif">RESOLVE</text>
      </svg>
    </div>
  );
}

function OneClickVisual() {
  return (
    <div className="relative w-full h-full flex items-end justify-center pb-8">
      <svg viewBox="0 0 300 160" className="w-full max-w-[280px] opacity-40">
        {/* Source file */}
        <rect x="30" y="30" width="60" height="70" rx="4" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        <rect x="38" y="40" width="30" height="3" rx="1" fill="rgba(100,130,255,0.3)" />
        <rect x="38" y="48" width="44" height="3" rx="1" fill="rgba(255,255,255,0.1)" />
        <rect x="38" y="56" width="36" height="3" rx="1" fill="rgba(255,255,255,0.1)" />
        <rect x="38" y="64" width="40" height="3" rx="1" fill="rgba(255,255,255,0.1)" />
        <rect x="38" y="72" width="28" height="3" rx="1" fill="rgba(255,255,255,0.1)" />
        <rect x="38" y="80" width="44" height="3" rx="1" fill="rgba(255,255,255,0.1)" />
        <text x="60" y="22" textAnchor="middle" fill="rgba(255,255,255,0.12)" fontSize="8" fontWeight="500" fontFamily="-apple-system, sans-serif">.prproj</text>
        {/* Arrow with click icon */}
        <circle cx="150" cy="65" r="18" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        <path d="M143 60 L150 55 L150 75 L157 70" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        {/* Output file */}
        <rect x="210" y="30" width="60" height="70" rx="4" fill="rgba(255,255,255,0.04)" stroke="rgba(46,172,80,0.2)" strokeWidth="1" />
        <rect x="218" y="40" width="30" height="3" rx="1" fill="rgba(46,172,80,0.3)" />
        <rect x="218" y="48" width="44" height="3" rx="1" fill="rgba(255,255,255,0.1)" />
        <rect x="218" y="56" width="36" height="3" rx="1" fill="rgba(255,255,255,0.1)" />
        <rect x="218" y="64" width="40" height="3" rx="1" fill="rgba(255,255,255,0.1)" />
        <rect x="218" y="72" width="28" height="3" rx="1" fill="rgba(255,255,255,0.1)" />
        <rect x="218" y="80" width="44" height="3" rx="1" fill="rgba(255,255,255,0.1)" />
        <text x="240" y="22" textAnchor="middle" fill="rgba(255,255,255,0.12)" fontSize="8" fontWeight="500" fontFamily="-apple-system, sans-serif">.drp</text>
        {/* Bottom label */}
        <text x="150" y="130" textAnchor="middle" fill="rgba(255,255,255,0.08)" fontSize="22" fontWeight="800" letterSpacing="-0.02em" fontFamily="-apple-system, sans-serif">CLICK</text>
      </svg>
    </div>
  );
}

function BatchVisual() {
  return (
    <div className="relative w-full h-full flex items-end justify-center pb-8">
      <svg viewBox="0 0 300 160" className="w-full max-w-[280px] opacity-40">
        {/* Stacked timeline files */}
        {[0, 1, 2, 3, 4].map((j) => (
          <g key={j}>
            <rect
              x={30 + j * 8}
              y={20 + j * 14}
              width="100"
              height="50"
              rx="3"
              fill="rgba(255,255,255,0.02)"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="1"
            />
            <rect x={38 + j * 8} y={28 + j * 14} width="50" height="2.5" rx="1" fill="rgba(255,255,255,0.1)" />
            <rect x={38 + j * 8} y={34 + j * 14} width="70" height="2.5" rx="1" fill="rgba(255,255,255,0.06)" />
            <rect x={38 + j * 8} y={40 + j * 14} width="40" height="2.5" rx="1" fill="rgba(255,255,255,0.06)" />
          </g>
        ))}
        {/* Format labels */}
        <text x="200" y="35" fill="rgba(255,255,255,0.15)" fontSize="8" fontWeight="600" fontFamily="-apple-system, sans-serif">.AAF</text>
        <text x="200" y="50" fill="rgba(255,255,255,0.12)" fontSize="8" fontWeight="600" fontFamily="-apple-system, sans-serif">.EDL</text>
        <text x="200" y="65" fill="rgba(255,255,255,0.10)" fontSize="8" fontWeight="600" fontFamily="-apple-system, sans-serif">.FCPXML</text>
        <text x="200" y="80" fill="rgba(255,255,255,0.08)" fontSize="8" fontWeight="600" fontFamily="-apple-system, sans-serif">.XML</text>
        <text x="200" y="95" fill="rgba(255,255,255,0.06)" fontSize="8" fontWeight="600" fontFamily="-apple-system, sans-serif">.AVB</text>
        {/* Bottom label */}
        <text x="150" y="140" textAnchor="middle" fill="rgba(255,255,255,0.08)" fontSize="22" fontWeight="800" letterSpacing="-0.02em" fontFamily="-apple-system, sans-serif">BATCH</text>
      </svg>
    </div>
  );
}

function PixelPerfectVisual() {
  return (
    <div className="relative w-full h-full flex items-end justify-center pb-8">
      <svg viewBox="0 0 300 160" className="w-full max-w-[280px] opacity-40">
        {/* Two frames side by side */}
        <rect x="20" y="20" width="110" height="70" rx="4" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        <rect x="170" y="20" width="110" height="70" rx="4" fill="rgba(255,255,255,0.03)" stroke="rgba(46,172,80,0.15)" strokeWidth="1" />
        {/* Frame content bars */}
        {[0, 1, 2, 3].map((j) => (
          <g key={j}>
            <rect x="28" y={30 + j * 13} width={70 - j * 10} height="6" rx="1" fill="rgba(255,255,255,0.08)" />
            <rect x="178" y={30 + j * 13} width={70 - j * 10} height="6" rx="1" fill="rgba(255,255,255,0.08)" />
          </g>
        ))}
        {/* Match indicator */}
        <text x="150" y="58" textAnchor="middle" fill="rgba(46,172,80,0.3)" fontSize="14" fontWeight="700" fontFamily="-apple-system, sans-serif">=</text>
        {/* SSIM score */}
        <rect x="110" y="96" width="80" height="20" rx="10" fill="rgba(46,172,80,0.08)" stroke="rgba(46,172,80,0.15)" strokeWidth="1" />
        <text x="150" y="110" textAnchor="middle" fill="rgba(46,172,80,0.4)" fontSize="9" fontWeight="700" fontFamily="-apple-system, sans-serif">SSIM 0.997</text>
        {/* Bottom label */}
        <text x="150" y="145" textAnchor="middle" fill="rgba(255,255,255,0.08)" fontSize="22" fontWeight="800" letterSpacing="-0.02em" fontFamily="-apple-system, sans-serif">VERIFIED</text>
      </svg>
    </div>
  );
}

const mobileVisuals = [ColorContextVisual, OneClickVisual, BatchVisual, PixelPerfectVisual];

export default function HeroFeatures() {
  return (
    <div className="space-y-0">
      {heroFeatures.map((feature, i) => {
        const MobileVisual = mobileVisuals[i];
        return (
          <motion.div
            key={i}
            className="px-4 sm:px-6 md:px-12 lg:px-20 py-6 md:py-10 border-b border-white/[0.04] min-h-[var(--vh,100dvh)] md:min-h-0 flex flex-col justify-start pt-[72px] md:pt-6 snap-section-flow md:!scroll-snap-align-none"
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

            {/* Mobile visual at bottom */}
            <div className="flex-1 md:hidden">
              <MobileVisual />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
