import { motion } from "framer-motion";

const partners = [
  { name: "Rare Medium", initials: "RM" },
  { name: "Post Works", initials: "PW" },
  { name: "Harbor", initials: "HB" },
  { name: "Company3", initials: "C3" },
  { name: "The New York Times", initials: "NYT" },
  { name: "Disney", initials: "DIS" },
  { name: "ABC", initials: "ABC" },
  { name: "A24", initials: "A24" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const TrustBadgeBar = () => {
  return (
    <section className="py-16 px-6 relative overflow-hidden">
      {/* Subtle background gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 80% 50% at 50% 100%, rgba(168, 85, 247, 0.05) 0%, transparent 70%)",
        }}
      />

      <motion.div
        className="max-w-6xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        {/* Label */}
        <motion.p
          variants={itemVariants}
          className="text-center text-xs uppercase tracking-[0.25em] text-foreground/40 mb-10"
        >
          Trusted by Industry Leaders
        </motion.p>

        {/* Logo grid */}
        <motion.div
          className="grid grid-cols-4 md:grid-cols-8 gap-8 md:gap-12 items-center justify-items-center"
        >
          {partners.map((partner, index) => (
            <motion.div
              key={partner.name}
              variants={itemVariants}
              className="group relative"
            >
              {/* Text-based logo placeholder with grayscale effect */}
              <div className="logo-grayscale flex flex-col items-center justify-center px-4 py-2 transition-all duration-300">
                <span className="text-lg md:text-xl font-bold text-white/80 tracking-tight">
                  {partner.initials}
                </span>
                <span className="text-[9px] md:text-[10px] text-white/40 uppercase tracking-wider mt-0.5 whitespace-nowrap">
                  {partner.name}
                </span>
              </div>

              {/* Hover glow effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-teal-500/10 blur-xl" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default TrustBadgeBar;
