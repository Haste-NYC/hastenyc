import { useRef } from "react";
import { motion } from "framer-motion";
import FluidMetaballs from "@/components/FluidMetaballs";
import conformLogo from "@/assets/conform-studio-logo.png";

// SVG trust logos (inline, same as TrustBadgeBar)
const logos = [
  { name: "Fox Sports", el: () => <svg viewBox="0 0 120 50" className="h-6 sm:h-8 w-auto fill-current"><text x="5" y="20" fontSize="14" fontWeight="900" fontFamily="Arial, sans-serif" letterSpacing="-0.5">(FOX)</text><text x="5" y="38" fontSize="12" fontWeight="700" fontFamily="Arial, sans-serif" letterSpacing="2">SPORTS</text></svg> },
  { name: "National Geographic", el: () => <svg viewBox="0 0 160 50" className="h-6 sm:h-8 w-auto fill-current"><rect x="0" y="5" width="30" height="40" fill="none" stroke="currentColor" strokeWidth="3"/><text x="40" y="22" fontSize="11" fontWeight="400" fontFamily="Georgia, serif" letterSpacing="0.5">NATIONAL</text><text x="40" y="35" fontSize="11" fontWeight="400" fontFamily="Georgia, serif" letterSpacing="0.5">GEOGRAPHIC</text></svg> },
  { name: "Media Monks", el: () => <svg viewBox="0 0 100 50" className="h-6 sm:h-8 w-auto fill-current"><text x="0" y="25" fontSize="16" fontWeight="800" fontFamily="Arial, sans-serif" letterSpacing="1">MEDIA</text><text x="0" y="44" fontSize="16" fontWeight="800" fontFamily="Arial, sans-serif" letterSpacing="1">MONKS</text></svg> },
  { name: "Turner", el: () => <svg viewBox="0 0 100 35" className="h-6 sm:h-8 w-auto fill-current"><text x="0" y="26" fontSize="22" fontWeight="400" fontFamily="Arial, sans-serif" fontStyle="italic" letterSpacing="1">Turner</text></svg> },
  { name: "Masterclass", el: () => <svg viewBox="0 0 40 50" className="h-6 sm:h-8 w-auto fill-current"><path d="M20 5 L35 15 L35 35 L20 45 L5 35 L5 15 Z" fill="none" stroke="currentColor" strokeWidth="2"/><text x="13" y="30" fontSize="14" fontWeight="700" fontFamily="Arial, sans-serif">M</text></svg> },
  { name: "Google", el: () => <svg viewBox="0 0 90 35" className="h-6 sm:h-8 w-auto fill-current"><text x="0" y="26" fontSize="24" fontWeight="400" fontFamily="Product Sans, Arial, sans-serif">Google</text></svg> },
  { name: "Netflix", el: () => <svg viewBox="0 0 110 35" className="h-6 sm:h-8 w-auto fill-current"><text x="0" y="26" fontSize="20" fontWeight="700" fontFamily="Arial, sans-serif" letterSpacing="2">NETFLIX</text></svg> },
  { name: "BBC", el: () => <svg viewBox="0 0 80 35" className="h-6 sm:h-8 w-auto fill-current"><rect x="0" y="5" width="24" height="24" rx="2"/><rect x="28" y="5" width="24" height="24" rx="2"/><rect x="56" y="5" width="24" height="24" rx="2"/><text x="6" y="22" fontSize="14" fontWeight="700" fill="white">B</text><text x="34" y="22" fontSize="14" fontWeight="700" fill="white">B</text><text x="62" y="22" fontSize="14" fontWeight="700" fill="white">C</text></svg> },
];

const HeroMockup = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className="relative w-full h-screen overflow-hidden">
      {/* 3D metaballs background - black fluid on white */}
      <FluidMetaballs
        className="absolute inset-0"
        bgColor={[0.95, 0.95, 0.95]}
        baseColor={[0.06, 0.06, 0.08]}
      />

      {/* Hero content overlay - pointer-events-none so hover/click pass through to canvas */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-4 sm:px-6 pointer-events-none">
        <div className="text-center max-w-5xl mx-auto space-y-2">
          {/* Intro */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-black/50 text-xs md:text-sm uppercase tracking-[0.25em] mb-4"
          >
            Introducing from HASTE
          </motion.p>

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="py-2 relative"
          >
            <h1 className="sr-only">
              Haste Conform Studio - Instant project migration from Adobe Premiere to Davinci Resolve
            </h1>
            <img
              src={conformLogo}
              alt="Haste Conform Studio"
              className="w-full max-w-4xl mx-auto h-auto relative z-10 invert drop-shadow-[0_0_40px_rgba(0,0,0,0.08)]"
              width={1952}
              height={352}
            />
          </motion.div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xs md:text-sm uppercase tracking-[0.25em] pt-2"
          >
            <span className="text-black/40">Premiere to Resolve</span>{" "}
            <span className="text-black">in Seconds</span>
          </motion.p>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="text-xs md:text-sm max-w-3xl mx-auto leading-relaxed uppercase tracking-[0.06em] pt-6"
          >
            <span className="text-black/40">Project migration that once took days</span>{" "}
            <span className="text-black">now takes seconds.</span>
            <br />
            <span className="text-black/70">100% frame-accurate, TPN+ compliant, trusted by major studios.</span>
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="pt-8 sm:pt-6"
          >
            <button className="pointer-events-auto bg-black text-white font-medium text-sm sm:text-base px-6 sm:px-8 py-2.5 sm:py-3 rounded-full hover:bg-gray-800 transition-colors">
              Start Free Trial
            </button>
          </motion.div>
        </div>

        {/* Trust badge bar - pinned near bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="absolute bottom-8 sm:bottom-12 left-0 right-0"
        >
          <p className="text-center text-xs uppercase tracking-[0.25em] text-black/25 mb-6">
            Trusted by Industry Leaders
          </p>
          <div
            className="relative w-full overflow-hidden"
            style={{
              maskImage: "linear-gradient(to right, transparent, black 80px, black calc(100% - 80px), transparent)",
              WebkitMaskImage: "linear-gradient(to right, transparent, black 80px, black calc(100% - 80px), transparent)",
            }}
          >
            <div className="flex animate-scroll-right-to-left items-center w-max">
              {[...logos, ...logos, ...logos, ...logos].map((logo, i) => (
                <div
                  key={`${logo.name}-${i}`}
                  className="flex-shrink-0 px-5 sm:px-8 md:px-10 flex items-center justify-center text-black/20 transition-colors duration-300"
                >
                  <logo.el />
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Back link */}
      <a
        href="/experiments/lava-lamp"
        className="absolute top-6 right-6 z-30 bg-black/5 backdrop-blur-sm text-black/40 hover:text-black text-xs uppercase tracking-wider px-4 py-2 rounded-full border border-black/10 transition-colors"
      >
        Back to Grid
      </a>
    </div>
  );
};

export default HeroMockup;
