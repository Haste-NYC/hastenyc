import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import PricingPlans from "@/components/PricingPlans";
import { useCheckout } from "@/hooks/useCheckout";

function parsePromoDays(code: string): number | null {
  const trimmed = code.trim().toUpperCase();
  if (trimmed.includes("90")) return 90;
  if (trimmed.includes("60")) return 60;
  if (trimmed.includes("30")) return 30;
  return null;
}

function useCountUp(target: number, duration = 2000) {
  const [value, setValue] = useState(target);
  const prevTarget = useRef(target);

  useEffect(() => {
    const from = prevTarget.current;
    prevTarget.current = target;
    if (from === target) return;

    const start = performance.now();
    let raf: number;

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      // ease-in-out cubic: slow start, fast middle, slow end
      const eased = t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2;
      setValue(Math.round(from + (target - from) * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return value;
}

const PricingSection = () => {
  const { isLoading, startCheckout } = useCheckout();
  const [redirectingPriceId, setRedirectingPriceId] = useState<string>();
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [trialDays, setTrialDays] = useState(7);
  const displayDays = useCountUp(trialDays);

  const handleApplyPromo = () => {
    if (!promoCode.trim()) return;
    setPromoApplied(true);
    const days = parsePromoDays(promoCode);
    if (days) setTrialDays(days);
  };

  const handleSelectPlan = async (priceId: string) => {
    setRedirectingPriceId(priceId);
    const didStartRedirect = await startCheckout({
      priceId,
      customerEmail: "",
      promoCode: promoCode.trim() || undefined,
    });

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
          className="text-center mb-2 sm:mb-6 hidden sm:block"
        >
          <span className="section-label">Pricing</span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-center text-foreground/60 text-xs sm:text-sm uppercase tracking-wider mb-4 sm:mb-12"
        >
          <span className="inline-block tabular-nums">{displayDays}</span> day free {trialDays > 7 ? "subscription" : "trial"} included
        </motion.p>
        <PricingPlans
          onSelectPlan={handleSelectPlan}
          selectedPriceId={redirectingPriceId}
          isCheckoutLoading={isLoading}
          promoCode={promoCode}
          onPromoCodeChange={(val) => {
            setPromoCode(val);
            if (promoApplied) {
              setPromoApplied(false);
              setTrialDays(7);
            }
          }}
          promoApplied={promoApplied}
          onApplyPromo={handleApplyPromo}
        />
      </div>
    </div>
  );
};

export default PricingSection;
