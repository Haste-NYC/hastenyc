import { motion } from "framer-motion";

const apps = [
  { name: "Premiere", status: "live" as const, icon: "/app-icons/premiere.svg" },
  { name: "Resolve", status: "live" as const, icon: "/app-icons/resolve.svg" },
  { name: "Media Composer", status: "beta" as const, icon: "/app-icons/media-composer.svg" },
  { name: "Final Cut Pro", status: "planned" as const, icon: "/app-icons/final-cut.svg" },
  { name: "After Effects", status: "planned" as const, icon: "/app-icons/after-effects.svg" },
  { name: "Pro Tools", status: "planned" as const, icon: "/app-icons/pro-tools.svg" },
  { name: "Nuke", status: "planned" as const, icon: "/app-icons/nuke.svg" },
];

const statusStyles = {
  live: { dot: "bg-green-400", label: "Live", labelColor: "text-green-400" },
  beta: { dot: "bg-yellow-400", label: "In Beta", labelColor: "text-yellow-400" },
  planned: { dot: "bg-white/20", label: "Planned", labelColor: "text-white/30" },
};

export default function AppRoadmap() {
  return (
    <div className="w-full px-4 sm:px-6 md:px-12 lg:px-20">
      <motion.div
        className="max-w-5xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "200px" }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <h3 className="text-[9px] md:text-sm uppercase tracking-[0.2em] text-white/40 mb-4 md:mb-10 text-center">
          Application Support Roadmap
        </h3>

        {/* Timeline */}
        <div className="relative">
          {/* Horizontal line - animates width left to right */}
          <motion.div
            className="absolute top-[26px] md:top-[46px] left-0 h-px bg-white/10 origin-left"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "200px" }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.7 }}
            style={{ width: "100%" }}
          />

          {/* App nodes */}
          <div className="flex justify-between">
            {apps.map((app, i) => {
              const style = statusStyles[app.status];
              const isPlanned = app.status === "planned";
              const delay = 0.7 + i * 0.12;
              return (
                <motion.div
                  key={app.name}
                  className="flex flex-col items-center relative"
                  style={{ flex: "1 1 0" }}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "200px" }}
                  transition={{ duration: 0.4, delay, ease: "easeOut" }}
                >
                  {/* Logo */}
                  <motion.img
                    src={app.icon}
                    alt={app.name}
                    className={`w-5 h-5 md:w-9 md:h-9 rounded-md md:rounded-lg relative z-10 ${isPlanned ? "opacity-25 grayscale" : "opacity-80"}`}
                    loading="eager"
                    initial={{ scale: 0.5 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true, margin: "200px" }}
                    transition={{ duration: 0.35, delay: delay + 0.1, ease: [0.34, 1.56, 0.64, 1] }}
                  />

                  {/* Dot */}
                  <motion.div
                    className={`w-[4px] h-[4px] md:w-[5px] md:h-[5px] rounded-full ${style.dot} mt-1.5 md:mt-2`}
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true, margin: "200px" }}
                    transition={{ duration: 0.3, delay: delay + 0.15, ease: [0.34, 1.56, 0.64, 1] }}
                  />

                  {/* App name - hidden on mobile */}
                  <motion.span
                    className={`mt-1 md:mt-2 text-[6px] md:text-[11px] font-medium uppercase tracking-[0.04em] md:tracking-[0.06em] text-center leading-tight hidden md:block ${
                      isPlanned ? "text-white/30" : "text-white/70"
                    }`}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, margin: "200px" }}
                    transition={{ duration: 0.3, delay: delay + 0.2 }}
                  >
                    {app.name}
                  </motion.span>

                  {/* Status label - hidden on mobile */}
                  <motion.span
                    className={`mt-1 text-[7px] md:text-[8px] uppercase tracking-[0.1em] hidden md:block ${
                      isPlanned ? "text-white/20" : style.labelColor
                    }`}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, margin: "200px" }}
                    transition={{ duration: 0.3, delay: delay + 0.25 }}
                  >
                    {isPlanned ? "Coming Soon" : style.label}
                  </motion.span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
