import { motion } from "framer-motion";

const AboutSection = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 pb-10 sm:pb-20">
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
        About Haste
      </motion.h2>

      {/* Company Story */}
      <div className="space-y-6">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-foreground/80 text-sm md:text-base leading-relaxed uppercase tracking-[0.04em]"
        >
          Haste builds AI-powered automation tools for post-production professionals. Founded by editors who've felt the pain of manual conform workflows, we're on a mission to eliminate the tedious parts of post and free creative professionals to do what they do best: create.
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
    </div>
  );
};

export default AboutSection;
