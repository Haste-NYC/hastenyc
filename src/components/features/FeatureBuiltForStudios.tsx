import { motion } from "framer-motion";

export default function FeatureBuiltForStudios() {
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
          Built
          <br />
          Specifically
          <br />
          for Studios
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-8 md:gap-16 mt-10 md:mt-14">
          {/* Left: availability statement */}
          <p className="text-lg md:text-xl lg:text-2xl font-bold uppercase tracking-tight leading-snug text-foreground/60">
            Conform Studio is available exclusively for qualifying post facilities
          </p>

          {/* Right: feature lists */}
          <div className="space-y-8">
            <div>
              <p className="text-xs uppercase tracking-[0.15em] text-foreground/40 mb-3">
                Available Today:
              </p>
              <ul className="space-y-1.5 text-sm text-foreground/70">
                <li className="flex items-start gap-2">
                  <span className="text-foreground/30 mt-0.5">&bull;</span>
                  Premiere to Resolve Adaptor
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-foreground/30 mt-0.5">&bull;</span>
                  Quality Control Automation
                </li>
              </ul>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.15em] text-foreground/40 mb-3">
                Coming Soon:
              </p>
              <ul className="space-y-1.5 text-sm text-foreground/70">
                <li className="flex items-start gap-2">
                  <span className="text-foreground/30 mt-0.5">&bull;</span>
                  Avid Media Composer &amp; Final Cut Support
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-foreground/30 mt-0.5">&bull;</span>
                  Batch XML, EDL, AAF Support with Media Relinking
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-foreground/30 mt-0.5">&bull;</span>
                  ProTools Support
                </li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
