import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect, useState } from "react";

interface GlowingSphereProps {
  className?: string;
}

const GlowingSphere = ({ className = "" }: GlowingSphereProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  // Check for desktop breakpoint
  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.matchMedia("(min-width: 768px)").matches);
    };
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Parallax transforms
  const sphereY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const sphereScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 0.95]);
  const glowOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.6, 1, 0.7]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Outermost glow layer */}
      <motion.div
        className="absolute inset-0 sphere-glow-outer"
        style={{
          opacity: isDesktop ? glowOpacity : 0.8,
        }}
      />

      {/* Middle glow layer */}
      <motion.div
        className="absolute inset-0 sphere-glow-middle"
        style={{
          y: isDesktop ? sphereY : 0,
        }}
      />

      {/* Inner glow - main sphere effect */}
      <motion.div
        className="relative w-full h-full sphere-glow-inner"
        style={{
          y: isDesktop ? sphereY : 0,
          scale: isDesktop ? sphereScale : 1,
        }}
      >
        {/* Core sphere */}
        <div className="absolute inset-[15%] rounded-full sphere-core">
          {/* Highlight reflection */}
          <div className="absolute top-[10%] left-[20%] w-[30%] h-[20%] bg-white/20 rounded-full blur-md" />

          {/* Secondary highlight */}
          <div className="absolute bottom-[20%] right-[15%] w-[15%] h-[10%] bg-white/10 rounded-full blur-sm" />
        </div>

        {/* Animated ring */}
        <motion.div
          className="absolute inset-[5%] rounded-full border border-white/10"
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {/* Orbiting dot */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-teal-400/60 rounded-full blur-[2px]" />
        </motion.div>

        {/* Second animated ring */}
        <motion.div
          className="absolute inset-[10%] rounded-full border border-white/10"
          animate={{
            rotate: -360,
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {/* Orbiting dot */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-1.5 h-1.5 bg-purple-400/50 rounded-full blur-[1px]" />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default GlowingSphere;
