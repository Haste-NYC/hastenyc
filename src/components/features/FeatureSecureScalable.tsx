import { motion } from "framer-motion";

export default function FeatureSecureScalable() {
  return (
    <div className="px-4 sm:px-6 md:px-12 lg:px-20">
      <motion.div
        className="max-w-7xl mx-auto"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold uppercase tracking-tight leading-[0.95]">
          Secure.
          <br />
          Scalable.
          <br />
          Studio-Ready.
        </h2>
        <p className="mt-6 md:mt-8 text-sm md:text-base text-foreground/60 leading-relaxed max-w-xl">
          Your media stays secure within your pipeline.
          <br />
          Privacy-focused, TPN-compliant, Trusted by industry leaders.
        </p>
      </motion.div>
    </div>
  );
}
