import { useState } from "react";
import { motion } from "framer-motion";
import PricingPlans from "@/components/PricingPlans";
import { useCheckout } from "@/hooks/useCheckout";

const PricingSection = () => {
  const { isLoading, startCheckout } = useCheckout();
  const [redirectingPriceId, setRedirectingPriceId] = useState<string>();

  const handleSelectPlan = async (priceId: string) => {
    setRedirectingPriceId(priceId);
    const didStartRedirect = await startCheckout({ priceId, customerEmail: "" });

    if (!didStartRedirect) {
      setRedirectingPriceId(undefined);
    }
  };

  return (
    <div className="px-4 sm:px-6 md:px-20">
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
        <PricingPlans
          onSelectPlan={handleSelectPlan}
          selectedPriceId={redirectingPriceId}
          isCheckoutLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default PricingSection;
