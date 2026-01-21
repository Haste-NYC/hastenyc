import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "framer-motion";
import { useLenis } from "lenis/react";
import conformLogo from "@/assets/conform-studio-logo.png";

const HeroSection = () => {
  const lenis = useLenis();
  const sectionRef = useRef<HTMLElement>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  // Check for desktop breakpoint on client
  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.matchMedia("(min-width: 768px)").matches);
    };
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  // Set up scroll tracking for parallax
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Create parallax transform (only applied on desktop)
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  const scrollToPricing = () => {
    lenis?.scrollTo("#pricing", {
      offset: -80,
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
  };

  return (
    <section
      ref={sectionRef}
      className="relative flex flex-col items-center px-6 pt-8 pb-12 min-h-[calc(100vh-80px)]"
    >
      {/* Ethereal gradient background - soft purple/blue glow with parallax on desktop */}
      <motion.div
        className="absolute pointer-events-none z-0"
        style={{
          top: "40%",
          left: "50%",
          x: "-50%",
          y: isDesktop ? backgroundY : "-50%",
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
            width={1952}
            height={352}
            // @ts-expect-error fetchpriority is valid HTML but React doesn't have types yet
            fetchpriority="high"
            decoding="async"
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
          className="pt-6"
        >
          <Button variant="hero" size="xl" onClick={scrollToPricing}>
            Start Free Trial
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;