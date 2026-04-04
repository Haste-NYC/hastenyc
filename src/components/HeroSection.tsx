import { useRef, useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "framer-motion";
import { useLenis } from "lenis/react";
import conformLogo from "@/assets/conform-studio-logo.png";


// Particle component for constellation effect - desktop only for performance
const Particles = () => {
  const [isMobile, setIsMobile] = useState(true); // Default to mobile to prevent flash

  // Generate particles once - must be called unconditionally (React hooks rule)
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

  useEffect(() => {
    // Check once on mount - no resize listener needed
    setIsMobile(window.innerWidth < 768);
  }, []);

  // Skip particles entirely on mobile for maximum performance
  if (isMobile) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[2]">
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
      {/* Connection lines between particles */}
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
      className="relative flex flex-col items-center justify-center px-4 sm:px-6 py-4 min-h-[calc(100vh-320px)] sm:min-h-[calc(100vh-200px)] overflow-visible"
    >
      {/* Particle constellation effect */}
      <Particles />

      {/* Subtle atmospheric glow - restrained white light */}
      <div
        className="absolute inset-0 pointer-events-none z-[2]"
        style={{
          background: `
            radial-gradient(ellipse 60% 50% at 50% 45%, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.02) 40%, transparent 70%)
          `,
        }}
      />

      <div className="text-center max-w-5xl mx-auto space-y-2 relative z-10">
        {/* Intro text - white/muted */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-foreground text-xs md:text-sm uppercase tracking-[0.25em] mb-4 mt-4 sm:mt-0"
        >
          Introducing from HASTE
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
          className="text-xs md:text-sm max-w-[300px] md:max-w-3xl mx-auto leading-relaxed uppercase tracking-[0.06em] pt-6"
        >
          <span className="text-foreground/60">We believe creatives should spend their time creating.</span>
          <br className="hidden md:block" />{" "}
          <span className="text-foreground">Frame-accurate, TPN+ compliant, built by filmmakers for filmmakers.</span>
        </motion.p>

        {/* CTA Button - white pill style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="pt-8 sm:pt-6"
        >
          <button
            onClick={scrollToPricing}
            className="bg-transparent text-white font-medium text-sm sm:text-base px-6 sm:px-8 py-2.5 sm:py-3 rounded-full border border-white/80 hover:bg-white/10 transition-colors"
          >
            Get Started
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
