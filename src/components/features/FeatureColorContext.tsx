import { motion } from "framer-motion";

export default function FeatureColorContext() {
  return (
    <div className="px-4 sm:px-6 md:px-12 lg:px-20">
      <motion.div
        className="max-w-7xl mx-auto"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
          {/* App screenshot */}
          <div className="rounded-xl overflow-hidden border border-white/10 bg-white/5">
            <img
              src="/app-screens/screen-configure.png"
              alt="Conform Studio - project configuration"
              className="w-full h-auto"
              loading="lazy"
            />
          </div>

          {/* Text */}
          <div>
            <p className="text-xs md:text-sm uppercase tracking-[0.15em] text-foreground/40 mb-4">
              The End of Roundtrip Workflows
            </p>
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold uppercase tracking-tight leading-[0.95]">
              View Color
              <br />
              in Context
            </h2>
            <p className="mt-6 md:mt-8 text-sm md:text-base text-foreground/60 leading-relaxed max-w-lg">
              Getting rid of the need for roundtripping projects back and forth between editorial and color, clients can now review color versions in context.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
