import { useRef, useState, useEffect } from "react";
import { motion, Variants, useScroll, useTransform } from "framer-motion";

// Animation variants for staggered reveal
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const imageVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

interface FeatureData {
  id: string;
  statistic: string;
  statisticSuffix?: string;
  title: string;
  titleMuted?: string;
  titleEmphasis?: string;
  description: string;
  citation?: string;
  useGradientStat?: boolean;
  mockupType: "timeline" | "accuracy" | "effects" | "security";
}

const features: FeatureData[] = [
  {
    id: "feature-speed",
    statistic: "300X",
    statisticSuffix: "Faster",
    titleMuted: "Premiere to Resolve,",
    titleEmphasis: "Instantly",
    title: "Premiere to Resolve, Instantly",
    description:
      "What once took days now takes seconds. Migrate timelines from Adobe Premiere to DaVinci Resolve with AI-powered automation that preserves every edit, every effect, every frame.",
    citation: "Internal Performance Testing",
    useGradientStat: true,
    mockupType: "timeline",
  },
  {
    id: "feature-accuracy",
    statistic: "100%",
    statisticSuffix: "Frame Accuracy",
    titleMuted: "100% Accurate,",
    titleEmphasis: "Every Time",
    title: "100% Accurate, Every Time",
    description:
      "Multi-track timelines, complex effects, speed ramps, bezier curves—all preserved perfectly. No manual fixes, no frame offsets, no lost work.",
    citation: "Verified Frame Analysis",
    useGradientStat: true,
    mockupType: "accuracy",
  },
  {
    id: "feature-effects",
    statistic: "Unlimited",
    statisticSuffix: "Projects",
    titleMuted: "Complex Effects,",
    titleEmphasis: "Zero Compromises",
    title: "Complex Effects, Zero Compromises",
    description:
      "Speed ramps, motion keyframes, Essential Graphics, transitions—Haste Conform Studio handles the effects that break other tools. Built for professional film and TV workflows.",
    useGradientStat: false,
    mockupType: "effects",
  },
  {
    id: "feature-security",
    statistic: "TPN+",
    statisticSuffix: "Certified",
    titleMuted: "TPN+ Compliant,",
    titleEmphasis: "Studio Ready",
    title: "TPN+ Compliant, Studio Ready",
    description:
      "Your media never leaves your pipeline. Built for high-security post-production environments trusted by studios and networks. SOC2 compliant, on-premise deployment available.",
    citation: "TPN Certification 2024",
    useGradientStat: false,
    mockupType: "security",
  },
];

// UI Mockup Component
const UIMockup = ({ type }: { type: string }) => {
  const mockupContent = {
    timeline: (
      <>
        {/* Timeline mockup */}
        <div className="absolute inset-4 flex flex-col">
          {/* Top bar */}
          <div className="h-8 bg-white/5 rounded flex items-center px-3 gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-red-500/60" />
            <div className="w-2 h-2 rounded-full bg-yellow-500/60" />
            <div className="w-2 h-2 rounded-full bg-green-500/60" />
            <div className="flex-1" />
            <div className="w-16 h-3 bg-white/10 rounded" />
          </div>
          {/* Timeline tracks */}
          <div className="flex-1 flex flex-col gap-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-8 bg-white/5 rounded flex items-center px-2 gap-1">
                <div className="w-8 h-4 bg-purple-500/30 rounded text-[8px] text-white/60 flex items-center justify-center">V{i + 1}</div>
                <div className="flex-1 flex gap-1">
                  {[...Array(Math.floor(Math.random() * 4) + 2)].map((_, j) => (
                    <div
                      key={j}
                      className="h-5 rounded"
                      style={{
                        width: `${Math.random() * 60 + 20}px`,
                        background: `rgba(${168 + Math.random() * 40}, ${85 + Math.random() * 40}, ${247}, ${0.3 + Math.random() * 0.3})`,
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
          {/* Playhead */}
          <div className="absolute top-12 left-1/3 w-0.5 h-[calc(100%-60px)] bg-teal-400/60" />
        </div>
      </>
    ),
    accuracy: (
      <>
        {/* Frame accuracy mockup */}
        <div className="absolute inset-4 flex flex-col">
          <div className="flex-1 grid grid-cols-2 gap-4">
            {/* Source frame */}
            <div className="bg-white/5 rounded p-2 flex flex-col">
              <span className="text-[9px] text-white/40 uppercase tracking-wider mb-2">Source</span>
              <div className="flex-1 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded flex items-center justify-center">
                <div className="w-12 h-12 border-2 border-green-400/60 rounded flex items-center justify-center">
                  <span className="text-green-400/80 text-xs">01:23:45:12</span>
                </div>
              </div>
            </div>
            {/* Output frame */}
            <div className="bg-white/5 rounded p-2 flex flex-col">
              <span className="text-[9px] text-white/40 uppercase tracking-wider mb-2">Output</span>
              <div className="flex-1 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded flex items-center justify-center">
                <div className="w-12 h-12 border-2 border-green-400/60 rounded flex items-center justify-center">
                  <span className="text-green-400/80 text-xs">01:23:45:12</span>
                </div>
              </div>
            </div>
          </div>
          {/* Match indicator */}
          <div className="mt-3 h-8 bg-green-500/20 border border-green-500/30 rounded flex items-center justify-center">
            <span className="text-green-400 text-xs uppercase tracking-wider">100% Frame Match</span>
          </div>
        </div>
      </>
    ),
    effects: (
      <>
        {/* Effects panel mockup */}
        <div className="absolute inset-4 flex flex-col">
          <div className="h-8 bg-white/5 rounded flex items-center px-3 mb-3">
            <span className="text-[10px] text-white/60 uppercase tracking-wider">Effects Panel</span>
          </div>
          <div className="flex-1 space-y-2 overflow-hidden">
            {["Speed Ramp", "Motion Blur", "Color Grade", "Essential GFX", "Transitions"].map((effect, i) => (
              <div key={i} className="h-10 bg-white/5 rounded px-3 flex items-center justify-between group hover:bg-white/10 transition-colors">
                <span className="text-xs text-white/70">{effect}</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"
                      style={{ width: `${70 + Math.random() * 30}%` }}
                    />
                  </div>
                  <span className="text-[9px] text-green-400">OK</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
    ),
    security: (
      <>
        {/* Security mockup */}
        <div className="absolute inset-4 flex flex-col items-center justify-center">
          {/* Shield icon */}
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-teal-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center mb-4">
            <svg className="w-10 h-10 text-teal-400/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <span className="text-xs text-white/60 uppercase tracking-wider mb-2">Security Status</span>
          <div className="flex gap-2">
            {["TPN+", "SOC2", "ENCRYPTED"].map((badge, i) => (
              <span key={i} className="text-[9px] px-2 py-1 bg-teal-500/20 border border-teal-500/30 rounded text-teal-400 uppercase tracking-wider">
                {badge}
              </span>
            ))}
          </div>
        </div>
      </>
    ),
  };

  return (
    <div className="aspect-[16/9] glass-card-glow rounded-xl relative overflow-hidden">
      {/* Subtle inner glow on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      {mockupContent[type as keyof typeof mockupContent]}
    </div>
  );
};

interface FeatureSectionItemProps {
  feature: FeatureData;
  index: number;
  isReversed: boolean;
}

const FeatureSectionItem = ({
  feature,
  index,
  isReversed,
}: FeatureSectionItemProps) => {
  const imageRef = useRef<HTMLDivElement>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.matchMedia("(min-width: 768px)").matches);
    };
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  const { scrollYProgress } = useScroll({
    target: imageRef,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["5%", "-5%"]);

  return (
    <div id={feature.id} className="min-h-[85vh] flex items-center py-16 px-6">
      <motion.div
        className="max-w-7xl mx-auto w-full"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <div
          className={`grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center ${
            isReversed ? "md:[&>*:first-child]:order-2" : ""
          }`}
        >
          {/* Text Content - staggered children */}
          <motion.div variants={itemVariants} className="space-y-6">
            {/* Statistic with citation */}
            <motion.div variants={itemVariants} className="space-y-1">
              <span
                className={`block text-6xl md:text-8xl font-bold tracking-tight ${
                  feature.useGradientStat
                    ? "bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent"
                    : "text-foreground"
                }`}
              >
                {feature.statistic}
              </span>
              {feature.statisticSuffix && (
                <span className="block text-2xl md:text-3xl font-medium text-foreground/80 uppercase tracking-wider">
                  {feature.statisticSuffix}
                </span>
              )}
              {/* Citation text - Frame.io style */}
              {feature.citation && (
                <span className="block mt-2 citation-text">
                  — {feature.citation}
                </span>
              )}
            </motion.div>

            {/* Two-tone headline */}
            <motion.h3
              variants={itemVariants}
              className="font-display text-2xl md:text-4xl font-normal uppercase tracking-wide"
            >
              {feature.titleMuted && feature.titleEmphasis ? (
                <>
                  <span className="text-foreground/60">{feature.titleMuted}</span>{" "}
                  <span className="text-foreground">{feature.titleEmphasis}</span>
                </>
              ) : (
                <span className="text-foreground">{feature.title}</span>
              )}
            </motion.h3>

            {/* Description */}
            <motion.p
              variants={itemVariants}
              className="text-foreground/80 text-sm md:text-base leading-relaxed max-w-lg"
            >
              {feature.description}
            </motion.p>
          </motion.div>

          {/* UI Mockup with parallax */}
          <motion.div
            ref={imageRef}
            variants={imageVariants}
            className="group"
            style={{
              y: isDesktop ? imageY : 0,
            }}
          >
            <UIMockup type={feature.mockupType} />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

const FeatureSection = () => {
  return (
    <section className="relative">
      {features.map((feature, index) => (
        <FeatureSectionItem
          key={index}
          feature={feature}
          index={index}
          isReversed={index % 2 === 1}
        />
      ))}
    </section>
  );
};

export default FeatureSection;
