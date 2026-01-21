import { motion, Variants } from "framer-motion";

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
  statistic: string;
  statisticSuffix?: string;
  title: string;
  description: string;
  useGradientStat?: boolean;
}

const features: FeatureData[] = [
  {
    statistic: "300X",
    statisticSuffix: "Faster",
    title: "Premiere to Resolve, Instantly",
    description:
      "What once took days now takes seconds. Migrate timelines from Adobe Premiere to DaVinci Resolve with AI-powered automation that preserves every edit, every effect, every frame.",
    useGradientStat: true,
  },
  {
    statistic: "100%",
    statisticSuffix: "Frame Accuracy",
    title: "100% Accurate, Every Time",
    description:
      "Multi-track timelines, complex effects, speed ramps, bezier curves—all preserved perfectly. No manual fixes, no frame offsets, no lost work.",
    useGradientStat: true,
  },
  {
    statistic: "Unlimited",
    statisticSuffix: "Projects",
    title: "Complex Effects, Zero Compromises",
    description:
      "Speed ramps, motion keyframes, Essential Graphics, transitions—Haste Conform Studio handles the effects that break other tools. Built for professional film and TV workflows.",
    useGradientStat: false,
  },
  {
    statistic: "TPN+",
    statisticSuffix: "Certified",
    title: "TPN+ Compliant, Studio Ready",
    description:
      "Your media never leaves your pipeline. Built for high-security post-production environments trusted by studios and networks. SOC2 compliant, on-premise deployment available.",
    useGradientStat: false,
  },
];

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
  return (
    <div className="min-h-screen flex items-center py-24 px-6">
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
            {/* Statistic */}
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
            </motion.div>

            {/* Headline */}
            <motion.h3
              variants={itemVariants}
              className="font-display text-2xl md:text-4xl font-normal text-foreground uppercase tracking-wide"
            >
              {feature.title}
            </motion.h3>

            {/* Description */}
            <motion.p
              variants={itemVariants}
              className="text-foreground/80 text-sm md:text-base leading-relaxed max-w-lg"
            >
              {feature.description}
            </motion.p>
          </motion.div>

          {/* Image Placeholder */}
          <motion.div variants={imageVariants}>
            {/* TODO: Replace with actual UI screenshot from /src/assets/ */}
            <div className="aspect-[16/9] bg-gray-800/50 rounded-xl border border-gray-700/50 flex items-center justify-center">
              <span className="text-gray-500 text-sm uppercase tracking-wider">
                UI Screenshot {index + 1}
              </span>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

const FeatureSection = () => {
  return (
    <section>
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