import { motion } from "framer-motion";

const VideoSection = () => {
  return (
    <section id="video" className="py-12 px-6 relative">
      {/* Blue gradient background - centered on video, extends beyond section */}
      <div
        className="absolute pointer-events-none z-0"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "200vw",
          height: "200vh",
          background: "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(30, 120, 255, 0.4) 0%, rgba(59, 130, 246, 0.2) 20%, rgba(59, 130, 246, 0.08) 35%, transparent 55%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7 }}
        className="max-w-4xl mx-auto relative z-10"
      >
        {/* Accent label above video - Frame.io style */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center text-xs mb-6 uppercase tracking-[0.2em] section-label-accent"
        >
          See it in action
        </motion.p>

        {/* Video container with Vimeo embed */}
        <div className="relative rounded-lg overflow-hidden">
          <div style={{ padding: "52.5% 0 0 0", position: "relative" }}>
            <iframe
              src="https://player.vimeo.com/video/1081347302?badge=0&autopause=0&player_id=0&app_id=58479"
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
              }}
              title="CONFORMSTUDIO-WEBSITE-R1"
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default VideoSection;
