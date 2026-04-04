import { motion } from "framer-motion";

export default function FeatureHeroStat() {
  return (
    <div className="px-4 sm:px-6 md:px-12 lg:px-20">
      <motion.div
        className="max-w-7xl mx-auto"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <h2
          className="font-black uppercase text-left"
          style={{ fontSize: "clamp(72px, 21vw, 280px)", letterSpacing: "-0.03em", lineHeight: 1 }}
        >
          300<span style={{ fontSize: "0.65em" }}>&times;</span>
        </h2>
        <h2
          className="font-black uppercase text-left"
          style={{ fontSize: "clamp(34px, 9.8vw, 130px)", letterSpacing: "-0.02em", lineHeight: 1, marginTop: 26 }}
        >
          Faster*and
        </h2>
        <h2
          className="font-black uppercase text-left"
          style={{ fontSize: "clamp(34px, 9.8vw, 130px)", letterSpacing: "-0.02em", lineHeight: 1, margin: 0 }}
        >
          100% Accurate
        </h2>
        <p
          className="uppercase text-foreground/35"
          style={{ fontSize: "clamp(10px, 1.2vw, 16px)", letterSpacing: "0.08em", marginTop: 70 }}
        >
          *Than manual conform
        </p>
      </motion.div>
    </div>
  );
}
