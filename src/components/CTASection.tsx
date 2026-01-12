import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const CTASection = () => {
  return (
    <section className="py-24 px-6">
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7 }}
        className="max-w-4xl mx-auto text-center space-y-6"
      >
        <h2 className="font-display text-2xl md:text-4xl font-normal uppercase tracking-wide bg-gradient-to-r from-[hsl(340,60%,65%)] via-[hsl(20,80%,65%)] to-[hsl(45,80%,60%)] bg-clip-text text-transparent">
          Help Shape the Future of Post
        </h2>
        
        <p className="text-foreground/80 text-xs md:text-sm leading-relaxed uppercase tracking-[0.04em]">
          Haste is building the future of automated post production. Haste Conform Studio is just the start. With more AI-powered tools on the horizon, we're streamlining the entire post-production pipeline—so creatives can spend more time creating and less time waiting.
        </p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="pt-4"
        >
          <a href="https://calendar.app.google/NCawKSixwhy3DA5r9" target="_blank" rel="noopener noreferrer">
            <Button variant="hero" size="xl">
              Schedule a Demo
            </Button>
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default CTASection;