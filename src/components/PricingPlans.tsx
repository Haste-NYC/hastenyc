import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import { stripeConfig } from "@/config/stripe";

interface PricingPlansProps {
  onSelectPlan?: (priceId: string, planType: "monthly" | "yearly", tierName: string) => void | Promise<void>;
  selectedPriceId?: string;
  isCheckoutLoading?: boolean;
  onScheduleCall?: () => void;
}

interface PricingTier {
  name: string;
  category: string;
  description: string;
  monthlyPrice: number | null;
  yearlyPrice: number | null;
  seats: string;
  features: string[];
  popular?: boolean;
  priceIdMonthly?: string;
  priceIdYearly?: string;
  isEnterprise?: boolean;
}

const tiers: PricingTier[] = [
  {
    name: "Freelancer",
    category: "FOR INDIVIDUALS",
    description: "Everything you need to get started with professional conforming workflows.",
    monthlyPrice: 49,
    yearlyPrice: 468,
    seats: "1 user / device license",
    features: [
      "1 user / device license",
      "Email support",
      "7-day free trial",
    ],
    priceIdMonthly: stripeConfig.priceMonthly,
    priceIdYearly: stripeConfig.priceYearly,
  },
  {
    name: "Team",
    category: "FOR SMALL TEAMS",
    description: "Collaborate with your team on conforming projects with shared access and priority support.",
    monthlyPrice: 129,
    yearlyPrice: 1188,
    seats: "3 users / device licenses",
    features: [
      "3 users / device licenses",
      "Priority support",
      "7-day free trial",
    ],
    popular: true,
    priceIdMonthly: stripeConfig.studioPriceMonthly,
    priceIdYearly: stripeConfig.studioPriceYearly,
  },
  {
    name: "Enterprise",
    category: "FOR ORGANIZATIONS",
    description: "Custom solutions for larger teams with dedicated support and full pipeline integration.",
    monthlyPrice: null,
    yearlyPrice: null,
    seats: "Unlimited seats",
    features: [
      "Full CLI for pipelines",
      "Priority support and training",
      "Custom integrations",
    ],
    isEnterprise: true,
  },
];

const PricingPlans = ({
  onSelectPlan,
  selectedPriceId,
  isCheckoutLoading = false,
  onScheduleCall,
}: PricingPlansProps) => {
  const navigate = useNavigate();
  const [isYearly, setIsYearly] = useState(true);
  const [activeCardIndex, setActiveCardIndex] = useState(1);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Scroll to Studio card (index 1) on mount for mobile
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || window.innerWidth >= 640) return;
    requestAnimationFrame(() => {
      const cardWidth = container.offsetWidth * 0.85;
      const gap = 16;
      container.scrollTo({ left: cardWidth + gap, behavior: "instant" });
    });
  }, []);

  // Track which card is most visible using Intersection Observer
  // Responds to viewport changes (e.g. device rotation) via matchMedia
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const mql = window.matchMedia("(max-width: 639px)");
    let observer: IntersectionObserver | null = null;
    let rafId: number | null = null;

    const setupObserver = () => {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
              const index = cardRefs.current.indexOf(entry.target as HTMLDivElement);
              if (index !== -1) {
                setActiveCardIndex(index);
              }
            }
          });
        },
        {
          root: container,
          threshold: 0.5,
        }
      );

      cardRefs.current.forEach((card) => {
        if (card) observer!.observe(card);
      });
    };

    const teardownObserver = () => {
      if (observer) {
        observer.disconnect();
        observer = null;
      }
    };

    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      teardownObserver();
      if (rafId !== null) cancelAnimationFrame(rafId);
      if (e.matches) {
        // Wait for next paint to ensure container has final dimensions
        rafId = requestAnimationFrame(() => {
          setupObserver();
        });
      }
    };

    // Initialize based on current viewport
    handleChange(mql);

    // Listen for viewport changes (e.g. device rotation)
    mql.addEventListener("change", handleChange);

    return () => {
      mql.removeEventListener("change", handleChange);
      if (rafId !== null) cancelAnimationFrame(rafId);
      teardownObserver();
    };
  }, []);

  const handleSelectPlan = (tier: PricingTier) => {
    if (tier.isEnterprise) {
      if (onScheduleCall) {
        onScheduleCall();
      } else {
        navigate("/schedule");
      }
      return;
    }

    if (onSelectPlan) {
      const priceId = isYearly ? tier.priceIdYearly : tier.priceIdMonthly;
      if (priceId) {
        onSelectPlan(priceId, isYearly ? "yearly" : "monthly", tier.name);
      }
    }
  };

  const isSelected = (tier: PricingTier) => {
    if (tier.isEnterprise) return false;
    const priceId = isYearly ? tier.priceIdYearly : tier.priceIdMonthly;
    return selectedPriceId === priceId;
  };

  const isRedirecting = (tier: PricingTier) => {
    if (tier.isEnterprise) return false;
    const priceId = isYearly ? tier.priceIdYearly : tier.priceIdMonthly;
    return isCheckoutLoading && selectedPriceId === priceId;
  };


  return (
    <div className="w-full space-y-8">
      {/* Billing Toggle */}
      <div className="flex items-center justify-center">
        <div className="relative flex items-center gap-4">
          <span className={`text-sm ${!isYearly ? "text-white font-medium" : "text-gray-400"}`}>
            Monthly
          </span>
          <Switch
            checked={isYearly}
            onCheckedChange={setIsYearly}
            disabled={isCheckoutLoading}
            className="data-[state=checked]:bg-white data-[state=unchecked]:bg-gray-700"
          />
          <span className={`text-sm ${isYearly ? "text-white font-medium" : "text-gray-400"}`}>
            Yearly
          </span>
        </div>
      </div>

      {/* Pricing Cards - Horizontal scroll on mobile, grid on md+ */}
      <div
        ref={scrollContainerRef}
        className="
          flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 -mx-4 px-4
          md:grid md:grid-cols-2 md:overflow-visible md:snap-none md:mx-0 md:px-0 md:pb-0
          md:gap-6
          lg:grid-cols-3
          [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]
        "
      >
        {tiers.map((tier, index) => (
          <motion.div
            key={tier.name}
            ref={(el) => (cardRefs.current[index] = el)}
            className={`flex-shrink-0 w-[85vw] md:w-auto snap-center ${
              tier.isEnterprise ? "md:col-span-2 lg:col-span-1" : ""
            }`}
          >
            <div
              className={`rounded-2xl border transition-all duration-300 relative h-full flex flex-col overflow-hidden ${
                isSelected(tier)
                  ? "border-white bg-white/[0.03] backdrop-blur-xl"
                  : index === activeCardIndex
                  ? "border-white/60 md:border-white/[0.08] md:hover:border-white/20 bg-white/[0.03] backdrop-blur-xl"
                  : tier.popular
                  ? "md:border-white/30 md:hover:border-white/50 border-white/[0.08] bg-white/[0.03] backdrop-blur-xl"
                  : "border-white/[0.08] hover:border-white/20 bg-white/[0.03] backdrop-blur-xl"
              }`}
            >
              {/* Card content */}
              <div className="p-6 sm:p-8 flex flex-col h-full">
                {/* Category label */}
                <span className="text-[11px] font-medium tracking-[0.15em] text-blue-400 uppercase mb-4">
                  {tier.category}
                </span>

                {/* Plan name */}
                <h3 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
                  {tier.name}
                </h3>

                {/* Price */}
                <div className="mt-1 mb-4">
                  {tier.monthlyPrice !== null ? (
                    <span className="text-2xl sm:text-3xl font-bold text-gray-400">
                      ${isYearly && tier.yearlyPrice ? Math.round(tier.yearlyPrice / 12) : tier.monthlyPrice}
                      <span className="text-base font-normal text-gray-500 ml-0.5">/mo</span>
                    </span>
                  ) : (
                    <span className="text-2xl sm:text-3xl font-bold text-gray-400">
                      Custom
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-sm text-gray-400 leading-relaxed mb-6">
                  {tier.description}
                  {tier.monthlyPrice !== null && (
                    <span className="text-gray-500">
                      {" "}{isYearly ? "Billed yearly." : "Billed monthly."}
                    </span>
                  )}
                </p>

                {/* Divider */}
                <div className="border-t border-white/[0.08] mb-6" />

                {/* Features header */}
                <p className="text-[11px] font-semibold tracking-[0.15em] text-gray-300 uppercase mb-4">
                  {tier.isEnterprise ? "Everything in Team, plus" : `${tier.name} plan includes`}
                </p>

                {/* Features list */}
                <ul className="space-y-3 flex-grow">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="text-sm text-gray-400">
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <div className="mt-8">
                  <Button
                    onClick={() => handleSelectPlan(tier)}
                    disabled={isCheckoutLoading}
                    className={`w-full rounded-full py-5 text-sm font-medium transition-all duration-200 ${
                      isRedirecting(tier) || isSelected(tier)
                        ? "bg-white hover:bg-gray-100 text-gray-900"
                        : tier.popular
                        ? "bg-white hover:bg-gray-100 text-gray-900"
                        : "bg-transparent hover:bg-white/5 text-white border border-white/20 hover:border-white/40"
                    }`}
                  >
                    {isRedirecting(tier) ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Redirecting...
                      </>
                    ) : tier.isEnterprise ? (
                      "Schedule a Call"
                    ) : isSelected(tier) ? (
                      "Selected"
                    ) : (
                      "Select Plan"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Carousel indicator dots - mobile/tablet only */}
      <div className="flex justify-center gap-2 md:hidden">
        {tiers.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              const container = scrollContainerRef.current;
              if (container) {
                const cardWidth = container.offsetWidth * 0.85;
                const gap = 16;
                container.scrollTo({
                  left: index * (cardWidth + gap),
                  behavior: "smooth",
                });
              }
            }}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === activeCardIndex
                ? "bg-white w-4"
                : "bg-white/30"
            }`}
            aria-label={`Go to pricing card ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default PricingPlans;
