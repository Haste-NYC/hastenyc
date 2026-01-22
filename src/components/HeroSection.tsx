import { useRef, useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "framer-motion";
import { useLenis } from "lenis/react";
import conformLogo from "@/assets/conform-studio-logo.png";
import GlowingSphere from "@/components/GlowingSphere";
import { LoadingAnimation } from "@/components/LoadingAnimation";
import { AppFlowAnimation } from "@/components/AppFlowAnimation";

// Particle component for constellation effect
const Particles = () => {
  const particles = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 5,
      duration: Math.random() * 3 + 5,
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-white/20"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            opacity: [0.1, 0.4, 0.1],
            scale: [1, 1.3, 1],
            y: [0, -20, 0],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
      {/* Connection lines between some particles */}
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255,255,255,0)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.1)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
        </defs>
        {particles.slice(0, 10).map((p, i) => {
          const next = particles[(i + 3) % particles.length];
          return (
            <motion.line
              key={`line-${i}`}
              x1={`${p.x}%`}
              y1={`${p.y}%`}
              x2={`${next.x}%`}
              y2={`${next.y}%`}
              stroke="url(#lineGradient)"
              strokeWidth="1"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: [0, 0.3, 0] }}
              transition={{
                duration: 8,
                delay: i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          );
        })}
      </svg>
    </div>
  );
};

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
      offset: -40,
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
  };

  return (
    <section
      ref={sectionRef}
      className="relative flex flex-col items-center px-6 pt-8 pb-12 min-h-[calc(100vh-80px)] overflow-hidden"
    >
      {/* Particle constellation effect */}
      <Particles />

      {/* Glowing Sphere - positioned behind content */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[800px] md:h-[800px] pointer-events-none z-0 opacity-40">
        <GlowingSphere className="w-full h-full" />
      </div>

      {/* Loading Animation - spinning animation over the orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[1]">
        <LoadingAnimation
          spriteSheet="/loading_sprite_604.png"
          size={400}
          className="opacity-60"
        />
      </div>

      {/* App Flow Animation - shows the app workflow screenshots */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[2]">
        <AppFlowAnimation size={340} className="opacity-95" />
      </div>

      {/* Atmospheric glow - x.ai inspired with blue/white light emanation */}
      <motion.div
        className="absolute pointer-events-none z-0"
        style={{
          top: "30%",
          left: "50%",
          x: "-50%",
          y: isDesktop ? backgroundY : "-50%",
          width: "200vw",
          height: "200vh",
          background: `
            radial-gradient(ellipse 40% 30% at 50% 40%, rgba(255, 255, 255, 0.08) 0%, transparent 50%),
            radial-gradient(ellipse 60% 50% at 50% 50%, rgba(100, 150, 255, 0.2) 0%, rgba(150, 100, 255, 0.12) 25%, rgba(200, 100, 255, 0.06) 40%, transparent 60%)
          `,
        }}
      />

      {/* Secondary glow for depth */}
      <motion.div
        className="absolute pointer-events-none z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        style={{
          top: "25%",
          left: "50%",
          x: "-50%",
          y: "-50%",
          width: "100vw",
          height: "60vh",
          background:
            "radial-gradient(ellipse 50% 40% at 50% 50%, rgba(200, 180, 255, 0.1) 0%, transparent 60%)",
          filter: "blur(60px)",
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

        {/* Main logo with 3D glow effect */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="py-2 relative img-glow-container"
        >
          <h1 className="sr-only">
            Haste Conform Studio - Instant project migration from Adobe Premiere
            to Davinci Resolve
          </h1>
          {/* Glow layer behind logo */}
          <div
            className="absolute inset-0 z-0"
            style={{
              background: "radial-gradient(ellipse 60% 80% at 50% 50%, rgba(255, 255, 255, 0.06) 0%, transparent 50%)",
              filter: "blur(30px)",
            }}
          />
          <img
            src={conformLogo}
            alt="Haste Conform Studio"
            className="w-full max-w-4xl mx-auto h-auto relative z-10 drop-shadow-[0_0_30px_rgba(255,255,255,0.15)]"
            width={1952}
            height={352}
            // @ts-expect-error fetchpriority is valid HTML but React doesn't have types yet
            fetchpriority="high"
            decoding="async"
          />
        </motion.div>

        {/* Two-tone tagline - Frame.io style */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xs md:text-sm uppercase tracking-[0.25em] pt-2 text-glow-subtle"
        >
          <span className="text-foreground/60">Premiere to Resolve</span>{" "}
          <span className="text-foreground">in Seconds</span>
        </motion.p>

        {/* Description - core value prop with two-tone pattern */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="text-xs md:text-sm max-w-3xl mx-auto leading-relaxed uppercase tracking-[0.06em] pt-6"
        >
          <span className="text-foreground/60">Timeline conversion that once took days</span>{" "}
          <span className="text-foreground">now takes seconds.</span>{" "}
          <span className="text-foreground/90">100% frame-accurate, TPN+ compliant, trusted by major studios.</span>
        </motion.p>

        {/* CTA Button - white pill style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="pt-6"
        >
          <button
            onClick={scrollToPricing}
            className="bg-white text-gray-900 font-medium text-base px-8 py-3 rounded-full hover:bg-gray-100 transition-colors"
          >
            Start Free Trial
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
