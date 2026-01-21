import { motion } from "framer-motion";
import PricingPlans from "@/components/PricingPlans";

const PricingSection = () => {
  return (
    <div className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-5xl font-bold text-center mb-12 uppercase tracking-wide"
        >
          Choose Your Plan
        </motion.h2>
        <PricingPlans />
      </div>
    </div>
  );
};

export default PricingSection;
