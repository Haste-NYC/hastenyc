import { motion } from "framer-motion";

export default function FeatureSpeedProof() {
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
          {/* Text */}
          <div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold uppercase tracking-tight leading-[0.95]">
              40 Hours
              <br />
              Completed
              <br />
              in 4 Minutes*
            </h2>
            <p className="mt-4 text-xs text-foreground/30 uppercase tracking-wider">
              *Average time spent in conform labor on feature length film
            </p>
          </div>

          {/* App screenshot */}
          <div className="rounded-xl overflow-hidden border border-white/10 bg-white/5">
            <img
              src="/app-screens/screen-progress.png"
              alt="Conform Studio - conforming in progress"
              className="w-full h-auto"
              loading="lazy"
            />
          </div>
        </div>

        {/* Bottom statement */}
        <p className="mt-10 md:mt-14 text-sm md:text-base lg:text-lg font-bold uppercase tracking-wider text-center">
          There is <span className="text-[#e91e8c]">no other tool in existence</span> to automate the conform process
        </p>
      </motion.div>
    </div>
  );
}
