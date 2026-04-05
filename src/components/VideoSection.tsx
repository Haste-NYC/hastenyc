import { useState } from "react";
import { motion } from "framer-motion";

const VideoSection = () => {
  const [activated, setActivated] = useState(false);
  return (
    <section id="video" className="py-12 sm:py-16 px-4 sm:px-6 md:px-12 lg:px-24 relative w-full min-h-screen flex flex-col justify-center">
      {/* Atmospheric blue glow behind video - extends well beyond section to eliminate seams */}
      <div
        className="absolute pointer-events-none z-0"
        style={{
          top: "-300px",
          bottom: "-400px",
          left: "-30%",
          right: "-30%",
          background: "radial-gradient(ellipse 70% 55% at 50% 45%, rgba(40, 100, 255, 0.18) 0%, rgba(50, 120, 255, 0.10) 20%, rgba(60, 130, 255, 0.05) 40%, rgba(60, 130, 255, 0.015) 60%, transparent 80%)",
          filter: "blur(80px)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7 }}
        className="max-w-6xl mx-auto relative z-10 w-full"
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
        <div className="relative rounded-lg overflow-hidden bg-black/40">
          <div style={{ padding: "52.5% 0 0 0", position: "relative" }}>
            {/* Loading placeholder */}
            <div className="absolute inset-0 flex items-center justify-center z-0">
              <div className="w-6 h-6 border-2 border-white/10 border-t-white/40 rounded-full animate-spin" />
            </div>
            <iframe
              src="https://player.vimeo.com/video/1081347302?badge=0&autopause=0&player_id=0&app_id=58479"
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
              loading="lazy"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
              }}
              title="CONFORMSTUDIO-WEBSITE-R1"
              className="relative z-10"
            />
            {/* Scroll pass-through overlay - click to activate iframe interaction */}
            {!activated && (
              <div
                className="absolute inset-0 z-20 cursor-pointer"
                onClick={() => setActivated(true)}
              />
            )}
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default VideoSection;
