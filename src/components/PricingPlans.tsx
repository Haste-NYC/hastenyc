import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Check, Users, Building2, Calendar } from "lucide-react";
import { stripeConfig } from "@/config/stripe";

interface PricingPlansProps {
  onSelectPlan?: (priceId: string, planType: "monthly" | "yearly", tierName: string) => void;
  selectedPriceId?: string;
  onScheduleCall?: () => void;
}

interface PricingTier {
  name: string;
  description: string;
  monthlyPrice: number | null;
  yearlyPrice: number | null;
  seats: string;
  icon: React.ReactNode;
  features: string[];
  popular?: boolean;
  priceIdMonthly?: string;
  priceIdYearly?: string;
  isEnterprise?: boolean;
}

const tiers: PricingTier[] = [
  {
    name: "Freelancer",
    description: "Perfect for independent creators",
    monthlyPrice: 49,
    yearlyPrice: 468,
    seats: "1 user / device license",
    icon: <Users className="w-5 h-5" />,
    features: [
      "1 user / device license",
      "Email support",
      "7-day free trial",
    ],
    priceIdMonthly: stripeConfig.priceMonthly,
    priceIdYearly: stripeConfig.priceYearly,
  },
  {
    name: "Studio",
    description: "For small teams and studios",
    monthlyPrice: 129,
    yearlyPrice: 1188,
    seats: "3 users / device licenses",
    icon: <Building2 className="w-5 h-5" />,
    features: [
      "3 users / device licenses",
      "Priority support",
      "7-day free trial",
    ],
    popular: true,
    // Placeholder - will be replaced with actual Stripe price IDs
    priceIdMonthly: "price_studio_monthly_placeholder",
    priceIdYearly: "price_studio_yearly_placeholder",
  },
  {
    name: "Enterprise",
    description: "For large organizations",
    monthlyPrice: null,
    yearlyPrice: null,
    seats: "Unlimited seats",
    icon: <Calendar className="w-5 h-5" />,
    features: [
      "Unlimited seats / devices / projects",
      "Priority support and training",
      "Custom integrations",
      "SLA guarantee",
      "On-premise deployment option",
    ],
    isEnterprise: true,
  },
];

const PricingPlans = ({ onSelectPlan, selectedPriceId, onScheduleCall }: PricingPlansProps) => {
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
            <Card
              className={`bg-transparent border transition-all duration-300 relative h-full flex flex-col overflow-hidden ${
                isSelected(tier)
                  ? "border-white"
                  : index === activeCardIndex
                  ? "border-white/60 md:border-white/10 md:hover:border-white/20"
                  : tier.popular
                  ? "md:border-white/40 md:hover:border-white/60 border-white/10"
                  : "border-white/10 hover:border-white/20"
              }`}
            >
              {/* Gradient top accent for popular card */}
              {tier.popular && (
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-purple-500/40 via-blue-500/30 to-purple-500/40" />
              )}

            <CardHeader className="text-center pb-2 pt-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="p-2.5 rounded-lg bg-white/5 border border-white/10">
                  {tier.icon}
                </div>
              </div>
              <CardTitle className="text-white text-xl uppercase tracking-wider">{tier.name}</CardTitle>
              <p className="text-gray-400 text-xs uppercase tracking-wider">{tier.description}</p>
            </CardHeader>

            <CardContent className={`flex-grow flex flex-col ${
              tier.isEnterprise ? "lg:justify-center" : ""
            }`}>
              {tier.monthlyPrice !== null && (
                <>
                  <div className="hidden md:block md:flex-grow" />
                  <div className="text-center mb-8">
                    <span className="text-3xl sm:text-4xl font-bold text-white">
                      ${isYearly && tier.yearlyPrice ? Math.round(tier.yearlyPrice / 12) : tier.monthlyPrice}
                      <span className="text-sm font-normal text-gray-400 ml-1">/mo</span>
                    </span>
                    <p className="text-sm text-gray-400 mt-1">
                      {isYearly ? "billed yearly" : "billed monthly"}
                    </p>
                  </div>
                  <div className="hidden md:block md:flex-grow" />
                </>
              )}
              <ul className={`space-y-2 ${
                tier.isEnterprise
                  ? "md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-2 md:space-y-0 lg:block lg:space-y-2"
                  : ""
              }`}>
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-4 h-4 rounded-full bg-white/20 flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-white" />
                    </div>
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter className="mt-auto">
              <Button
                onClick={() => handleSelectPlan(tier)}
                className={`w-full font-semibold py-5 btn-with-arrow group ${
                  isSelected(tier)
                    ? "bg-white hover:bg-gray-100 text-gray-900"
                    : tier.popular
                    ? "bg-white hover:bg-gray-100 text-gray-900"
                    : "bg-white/10 hover:bg-white/20 text-white border border-white/20"
                }`}
              >
                {tier.isEnterprise
                  ? "Schedule a Call"
                  : isSelected(tier)
                  ? "Selected"
                  : "Select Plan"}
              </Button>
            </CardFooter>
            </Card>
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
