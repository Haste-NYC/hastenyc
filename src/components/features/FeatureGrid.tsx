import { motion } from "framer-motion";

const gridFeatures = [
  {
    title: "Automated Media Relinking",
    hours: "1-8h",
    desc: "Automatically locates source media across drives, matches filenames, handles proxy-to-full-res switching and volume remapping.",
  },
  {
    title: "Conform Verification",
    hours: "1-4h",
    desc: "Compares your source project against the Resolve timeline clip-by-clip. Detects timecode, duration, and track discrepancies. Auto-corrects issues.",
  },
  {
    title: "Speed & Retime Preservation",
    hours: "1-3h",
    desc: "Translates constant and variable speed effects including bezier-curve retimes. Validates frame-by-frame and corrects drift automatically.",
  },
  {
    title: "Bezier Keyframe Transfer",
    hours: "1-3h",
    desc: "Preserves scale, position, rotation, opacity, and crop keyframes with bezier curve data intact. Visual SSIM validation ensures accuracy.",
  },
  {
    title: "Multicam Clip Flattening",
    hours: "0.5-2h",
    desc: "Detects multicam clips and flattens to the active angle's source media. Resolve receives clean, single-source clips.",
  },
  {
    title: "Subtitle & Caption Conversion",
    hours: "0.5-2h",
    desc: "Extracts caption data and creates native Resolve subtitle tracks with styling preserved. Generates SRT for delivery.",
  },
  {
    title: "Audio Gain Verification",
    hours: "0.5-2h",
    desc: "Per-track RMS comparison between Premiere and Resolve audio. Configurable dB tolerance detects gain mismatches before final mix.",
  },
  {
    title: "Text & Graphics Transfer",
    hours: "0.5-2h",
    desc: "Converts text layers to Resolve Text+ / Fusion nodes with font mapping, positioning, and scale. Generates Fusion backgrounds.",
  },
  {
    title: "Markers & Metadata",
    hours: "0.5-1h",
    desc: "Transfers markers with colors, names, notes. Preserves clip labels, disabled states, and custom metadata fields.",
  },
  {
    title: "Effects & Transitions",
    hours: "0.5-1h",
    desc: "Converts opacity, transform, and crop effects with keyframe data. Maps Premiere transitions to Resolve equivalents.",
  },
  {
    title: "Offline Reference Generation",
    hours: "1-4h",
    desc: "Automatically renders a reference video from your source program for pixel-level QC comparison, or link your own. Runs in the background during conform.",
  },
  {
    title: "Clip Label & Color Mapping",
    hours: "0.5-1h",
    desc: "Transfers clip label colors and naming conventions between Premiere and Resolve. Maintains editorial organization and color-coded workflows.",
  },
];

export default function FeatureGrid() {
  return (
    <div className="px-4 sm:px-6 md:px-12 lg:px-20">
      <motion.div
        className="max-w-7xl mx-auto"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
      >
        <h2
          className="font-black uppercase tracking-tight leading-[0.95] mb-10 md:mb-12"
          style={{ fontSize: "clamp(28px, 5vw, 56px)", letterSpacing: "-0.02em" }}
        >
          <span className="text-foreground/40">Every detail,</span>
          <br />
          Preserved.
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.04] border border-white/[0.06] rounded-xl overflow-hidden">
          {gridFeatures.map((f, i) => (
            <div key={i} className="bg-black/80 p-6 md:p-7 flex flex-col gap-2.5 md:min-h-[140px]">
              <h4 className="text-[13px] font-bold uppercase tracking-wide leading-snug">
                {f.title}
              </h4>
              <p className="text-xs text-foreground/40 leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
