import { motion } from "framer-motion";

const trustSignals = [
  "TPN+ Certified for studio security",
  "Used by post-production facilities in LA, NYC, London",
  "SOC2 Type II compliant",
  "99.9% uptime SLA for Enterprise customers",
];

const AboutSection = () => {
  return (
    <div className="max-w-4xl mx-auto py-24 px-6">
      {/* Section Label */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-6"
      >
        <span className="section-label">Company</span>
      </motion.div>

      {/* Section Title */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-3xl md:text-5xl font-bold text-center mb-12 uppercase tracking-wide"
      >
        About Haste NYC
      </motion.h2>

      {/* Company Story */}
      <div className="space-y-6 mb-16">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-foreground/80 text-sm md:text-base leading-relaxed uppercase tracking-[0.04em]"
        >
          Haste NYC builds AI-powered automation tools for post-production professionals. Founded by editors who've felt the pain of manual conform workflows, we're on a mission to eliminate the tedious parts of post and free creative professionals to do what they do best: create.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-foreground/80 text-sm md:text-base leading-relaxed uppercase tracking-[0.04em]"
        >
          Conform Studio is our first product—a solution to the timeline migration problem that's plagued the industry for decades. What started as an internal tool for high-volume conform projects is now available to studios and freelancers worldwide.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-foreground/80 text-sm md:text-base leading-relaxed uppercase tracking-[0.04em]"
        >
          We believe post-production should be about creativity, not file format headaches. That's why we built Conform Studio to handle the technical complexity so you can focus on what matters—telling great stories.
        </motion.p>
      </div>

      {/* Trust Signals */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <h3 className="text-xl font-semibold text-center mb-8 uppercase tracking-wide">
          Trusted By
        </h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {trustSignals.map((signal, index) => (
            <li
              key={index}
              className="flex items-center gap-3 text-foreground/70 text-sm uppercase tracking-[0.04em]"
            >
              <span className="w-2 h-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex-shrink-0" />
              {signal}
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
};

export default AboutSection;
