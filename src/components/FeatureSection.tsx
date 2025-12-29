import { motion } from "framer-motion";

interface FeatureProps {
  title: string;
  description: React.ReactNode;
  index: number;
}

const Feature = ({ title, description, index }: FeatureProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="text-left max-w-4xl py-8 last:pb-0"
    >
      <h3 className="font-display text-2xl md:text-4xl font-normal text-foreground mb-4 uppercase tracking-wide">
        {title}
      </h3>
      <p className="text-foreground/80 text-xs md:text-sm leading-relaxed uppercase tracking-[0.04em]">
        {description}
      </p>
    </motion.div>
  );
};

const FeatureSection = () => {
  const features: { title: string; description: React.ReactNode }[] = [
    {
      title: "Rapid Timeline Conform for Film & TV",
      description: (
        <>
          Conform Studio uses AI to automate the most tedious, time-consuming part of post-production:{" "}
          <span className="bg-gradient-to-r from-[hsl(200,80%,60%)] via-[hsl(170,70%,50%)] to-[hsl(140,60%,50%)] bg-clip-text text-transparent">migrating projects between editorial, VFX, color, and sound.</span>{" "}
          It's faster than humanly possible—and dead accurate.
        </>
      ),
    },
    {
      title: "300X Faster, 100% Accurate",
      description: (
        <>
          <span className="text-coral">What once took days now takes seconds.</span>{" "}
          Conform Studio completes complex conform tasks at 300X the speed of human teams, without sacrificing a single frame of accuracy. It's speed you can trust, and time you can use for real creative work.
        </>
      ),
    },
    {
      title: "Built for Studios",
      description: (
        <>
          Conform Studio is currently being offered to qualifying post facilities. We're{" "}
          <a href="https://calendar.app.google/NCawKSixwhy3DA5r9" target="_blank" rel="noopener noreferrer" className="bg-gradient-to-r from-[hsl(200,80%,60%)] via-[hsl(170,70%,50%)] to-[hsl(140,60%,50%)] bg-clip-text text-transparent hover:underline">
            onboarding Early Customers
          </a>{" "}
          who want to help shape the future of automated post workflows—while getting first access to speed, savings, and support.
        </>
      ),
    },
    {
      title: "Secure. Scalable. Studio-Ready.",
      description: (
        <>
          Your media never leaves your pipeline. Our platform is privacy-forward, built for TPN-compliant environments, and trusted by industry leaders.
        </>
      ),
    },
  ];

  return (
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        {features.map((feature, index) => (
          <Feature key={index} index={index} {...feature} />
        ))}
      </div>
    </section>
  );
};

export default FeatureSection;