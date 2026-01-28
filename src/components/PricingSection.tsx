import { motion } from "framer-motion";
import PricingPlans from "@/components/PricingPlans";
import { useCheckout } from "@/hooks/useCheckout";

const PricingSection = () => {
  const { isLoading, startCheckout } = useCheckout();

  const handleSelectPlan = (priceId: string) => {
    startCheckout({ priceId, customerEmail: "guest@checkout.com" });
  };

  return (
    <div className="py-20 px-6 md:px-20">
      <div className="max-w-7xl mx-auto">
        {/* Section Label */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6"
        >
          <span className="section-label">Pricing</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl md:text-5xl font-bold text-center mb-4 uppercase tracking-wide"
        >
          Choose Your Plan
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-center text-foreground/60 text-sm uppercase tracking-wider mb-12"
        >
          7 day free trial included
        </motion.p>
        <PricingPlans onSelectPlan={handleSelectPlan} />
        {isLoading && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="text-white text-lg">Redirecting to checkout...</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PricingSection;
