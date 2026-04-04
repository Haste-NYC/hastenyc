import { motion } from "framer-motion";

export default function RoundtripCallout() {
  return (
    <div className="px-4 sm:px-6 md:px-12 lg:px-20 py-16 md:py-24">
      <motion.div
        className="max-w-7xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
      >
        <span className="text-[11px] uppercase tracking-[0.15em] text-white/30 block mb-4">
          The end of roundtrip workflows
        </span>
        <h2
          className="font-black tracking-tight leading-none uppercase"
          style={{ fontSize: "clamp(32px, 7vw, 72px)", letterSpacing: "-0.03em" }}
        >
          View Color
          <br />
          <span className="text-foreground/40">in Context</span>
        </h2>
        <p className="mt-5 text-sm md:text-[15px] text-foreground/45 leading-relaxed max-w-xl">
          Stop bouncing between applications to check your work. Conform once, grade in Resolve, and never rebuild a timeline again.
        </p>
      </motion.div>
    </div>
  );
}
