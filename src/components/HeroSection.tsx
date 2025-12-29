import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import conformLogo from "@/assets/conform-studio-logo.png";

const HeroSection = () => {
  return (
    <section className="flex flex-col items-center px-6 pt-8 pb-24">
      <div className="text-center max-w-5xl mx-auto space-y-2">
        {/* Intro text - white/muted */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-foreground text-xs md:text-sm uppercase tracking-[0.25em] mb-4"
        >
          Introducing from HASTE.NYC
        </motion.p>
        
        {/* Main logo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="py-2"
        >
          <h1 className="sr-only">Haste.NYC's Conform Studio - Instant project migration from Adobe Premiere to Davinci Resolve</h1>
          <img
            src={conformLogo}
            alt="Conform Studio"
            className="w-full max-w-4xl mx-auto h-auto"
          />
        </motion.div>
        
        {/* Tagline - muted gray, after logo */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-foreground text-xs md:text-sm uppercase tracking-[0.25em] pt-2"
        >
          AI-Powered Automation for Seamless Post Workflows
        </motion.p>
        
        {/* Description - white text, uppercase */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="text-foreground/90 text-xs md:text-sm max-w-3xl mx-auto leading-relaxed uppercase tracking-[0.06em] pt-6"
        >
          Conform Studio connects previously siloed creative software—Premiere, Resolve, Avid, Pro Tools—and bridges the gaps between them. Say goodbye to relinking errors, round-trip workflows, and days of manual QC.
        </motion.p>
        
        {/* CTA Button */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="pt-6"
        >
          <a href="https://calendar.app.google/NCawKSixwhy3DA5r9" target="_blank" rel="noopener noreferrer">
            <Button variant="hero" size="xl">
              Schedule a Demo
            </Button>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;