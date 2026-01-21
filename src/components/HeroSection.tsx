import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import conformLogo from "@/assets/conform-studio-logo.png";

const HeroSection = () => {
  const scrollToPricing = () => {
    const element = document.getElementById("pricing");
    if (!element) return;

    const headerOffset = 80;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  };

  return (
    <section className="relative flex flex-col items-center px-6 pt-8 pb-12 min-h-[calc(100vh-80px)]">
      {/* Ethereal gradient background - soft purple/blue glow */}
      <div
        className="absolute pointer-events-none z-0"
        style={{
          top: "40%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "200vw",
          height: "200vh",
          background:
            "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(200, 100, 255, 0.3) 0%, rgba(150, 100, 255, 0.15) 20%, rgba(100, 150, 255, 0.08) 35%, transparent 55%)",
        }}
      />

      <div className="text-center max-w-5xl mx-auto space-y-2 relative z-10">
        {/* Intro text - white/muted */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-foreground text-xs md:text-sm uppercase tracking-[0.25em] mb-4"
        >
          Introducing from HASTE.NYC
        </motion.p>

        {/* Main logo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="py-2"
        >
          <h1 className="sr-only">
            Haste Conform Studio - Instant project migration from Adobe Premiere
            to Davinci Resolve
          </h1>
          <img
            src={conformLogo}
            alt="Haste Conform Studio"
            className="w-full max-w-4xl mx-auto h-auto"
          />
        </motion.div>

        {/* Tagline - bold value proposition */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-foreground text-xs md:text-sm uppercase tracking-[0.25em] pt-2"
        >
          300X Faster Timeline Conform
        </motion.p>

        {/* Description - core value prop */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="text-foreground/90 text-xs md:text-sm max-w-3xl mx-auto leading-relaxed uppercase tracking-[0.06em] pt-6"
        >
          Premiere to Resolve timeline conversion in seconds, not days. 100%
          frame-accurate, TPN+ compliant, trusted by major studios.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="pt-6 flex flex-col items-center gap-4"
        >
          <Button variant="hero" size="xl" onClick={scrollToPricing}>
            Start Free Trial
          </Button>
          <a
            href="#video"
            onClick={(e) => {
              e.preventDefault();
              const videoEl = document.getElementById("video");
              if (videoEl) {
                const headerOffset = 80;
                const elementPosition = videoEl.getBoundingClientRect().top;
                const offsetPosition =
                  elementPosition + window.pageYOffset - headerOffset;
                window.scrollTo({ top: offsetPosition, behavior: "smooth" });
              }
            }}
            className="text-foreground/70 hover:text-foreground text-xs uppercase tracking-[0.15em] transition-colors"
          >
            Watch Demo
          </a>
        </motion.div>

        {/* Product Screenshot Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="pt-12 max-w-[800px] mx-auto"
        >
          {/* TODO: Replace with actual product screenshot from /src/assets/ */}
          <div className="aspect-[16/9] bg-gray-800/50 rounded-xl border border-gray-700/50 flex items-center justify-center shadow-2xl">
            <span className="text-gray-500 text-sm uppercase tracking-wider">
              Product Screenshot
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;