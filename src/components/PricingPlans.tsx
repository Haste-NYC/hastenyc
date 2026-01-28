import { useState, useRef, useEffect } from "react";
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
    seats: "1 seat / device license",
    icon: <Users className="w-5 h-5" />,
    features: [
      "1 seat / device license",
      "Unlimited projects",
      "All conform tools",
      "Standard export formats",
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
    seats: "3 seats / device licenses",
    icon: <Building2 className="w-5 h-5" />,
    features: [
      "3 seats / device licenses",
      "Unlimited projects",
      "All conform tools",
      "All export formats",
      "Priority support",
      "Team collaboration",
      "Advanced analytics",
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
      "Unlimited seats / devices",
      "Unlimited projects",
      "All conform tools",
      "All export formats",
      "Dedicated account manager",
      "24/7 priority support",
      "Custom integrations",
      "SLA guarantee",
      "On-premise deployment option",
      "Custom training",
    ],
    isEnterprise: true,
  },
];

const PricingPlans = ({ onSelectPlan, selectedPriceId, onScheduleCall }: PricingPlansProps) => {
  const [isYearly, setIsYearly] = useState(true);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Track which card is most visible using Intersection Observer
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Only run on mobile (< 640px)
    if (window.innerWidth >= 640) return;

    const observer = new IntersectionObserver(
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
      if (card) observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

  const handleSelectPlan = (tier: PricingTier) => {
    if (tier.isEnterprise) {
      if (onScheduleCall) {
        onScheduleCall();
      } else {
        window.open("https://calendar.app.google/BBFibVC74CU2MQY37", "_blank");
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

  const yearlySavings = Math.round(((49 * 12 - 468) / (49 * 12)) * 100);

  return (
    <div className="w-full space-y-8">
      {/* Billing Toggle */}
      <div className="flex items-center justify-center gap-4">
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
        {isYearly && (
          <Badge className="bg-white/10 text-white border border-white/20">
            Save {yearlySavings}%
          </Badge>
        )}
      </div>

      {/* Pricing Cards - Horizontal scroll on mobile, grid on larger screens */}
      <div
        ref={scrollContainerRef}
        className="
          flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 -mx-4 px-4
          sm:grid sm:grid-cols-2 sm:overflow-visible sm:snap-none sm:mx-0 sm:px-0 sm:pb-0
          lg:grid-cols-3 sm:gap-6
          [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]
        "
      >
        {tiers.map((tier, index) => (
          <motion.div
            key={tier.name}
            ref={(el) => (cardRefs.current[index] = el)}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="flex-shrink-0 w-[85vw] sm:w-auto snap-center"
          >
            <Card
              className={`bg-transparent border transition-all duration-300 relative h-[580px] sm:h-full flex flex-col ${
                isSelected(tier)
                  ? "border-white"
                  : index === activeCardIndex
                  ? "border-white/60 sm:border-white/10 sm:hover:border-white/20"
                  : tier.popular
                  ? "sm:border-white/40 sm:hover:border-white/60 border-white/10"
                  : "border-white/10 hover:border-white/20"
              }`}
            >
            {/* Most Popular badge - hidden on mobile to prevent cutoff */}
            {tier.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 hidden sm:block">
                <Badge className="bg-white text-gray-900 border-0 px-3">
                  Most Popular
                </Badge>
              </div>
            )}

            <CardHeader className="text-center pb-2 pt-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="p-2.5 rounded-lg bg-white/5 border border-white/10">
                  {tier.icon}
                </div>
              </div>
              <CardTitle className="text-white text-xl uppercase tracking-wider">{tier.name}</CardTitle>
              <p className="text-gray-400 text-xs uppercase tracking-wider">{tier.description}</p>

              <div className="mt-4">
                {tier.monthlyPrice !== null ? (
                  <>
                    <span className="text-3xl sm:text-4xl font-bold text-white">
                      ${isYearly && tier.yearlyPrice ? Math.round(tier.yearlyPrice / 12) : tier.monthlyPrice}
                    </span>
                    <span className="text-gray-400 ml-2">
                      /month
                    </span>
                    {isYearly && tier.yearlyPrice && (
                      <p className="text-sm text-gray-400 mt-1">
                        billed yearly
                      </p>
                    )}
                  </>
                ) : (
                  <span className="text-3xl font-bold text-white">Custom Pricing</span>
                )}
              </div>

            </CardHeader>

            <CardContent className="space-y-4 flex-grow">
              <ul className="space-y-2">
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

      {/* Carousel indicator dots - mobile only */}
      <div className="flex justify-center gap-2 sm:hidden">
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
