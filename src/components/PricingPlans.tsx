import { useState } from "react";
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
    yearlyPrice: 490,
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
    yearlyPrice: 1290,
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
  const [isYearly, setIsYearly] = useState(false);

  const handleSelectPlan = (tier: PricingTier) => {
    if (tier.isEnterprise) {
      if (onScheduleCall) {
        onScheduleCall();
      } else {
        window.open("mailto:sales@haste.nyc?subject=Enterprise%20Inquiry", "_blank");
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

  const yearlySavings = Math.round(((49 * 12 - 490) / (49 * 12)) * 100);

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
          className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-pink-500 data-[state=checked]:to-purple-500 data-[state=unchecked]:bg-gray-700"
        />
        <span className={`text-sm ${isYearly ? "text-white font-medium" : "text-gray-400"}`}>
          Yearly
        </span>
        {isYearly && (
          <Badge className="bg-gradient-to-r from-pink-500 to-purple-500 text-white border-0">
            Save {yearlySavings}%
          </Badge>
        )}
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {tiers.map((tier) => (
          <Card
            key={tier.name}
            className={`bg-gray-900 border-2 transition-all duration-200 relative ${
              isSelected(tier)
                ? "border-pink-500 shadow-lg shadow-pink-500/20"
                : tier.popular
                ? "border-purple-500"
                : "border-gray-700 hover:border-gray-600"
            }`}
          >
            {tier.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-pink-500 to-purple-500 text-white border-0 px-3">
                  Most Popular
                </Badge>
              </div>
            )}

            <CardHeader className="text-center pb-2 pt-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="p-2 rounded-lg bg-gray-800">
                  {tier.icon}
                </div>
              </div>
              <CardTitle className="text-white text-xl">{tier.name}</CardTitle>
              <p className="text-gray-400 text-sm">{tier.description}</p>

              <div className="mt-4">
                {tier.monthlyPrice !== null ? (
                  <>
                    <span className="text-4xl font-bold text-white">
                      ${isYearly ? tier.yearlyPrice : tier.monthlyPrice}
                    </span>
                    <span className="text-gray-400 ml-2">
                      /{isYearly ? "year" : "month"}
                    </span>
                    {isYearly && tier.yearlyPrice && tier.monthlyPrice && (
                      <p className="text-sm text-gray-400 mt-1">
                        ${Math.round(tier.yearlyPrice / 12)}/month when billed yearly
                      </p>
                    )}
                  </>
                ) : (
                  <span className="text-3xl font-bold text-white">Custom Pricing</span>
                )}
              </div>

              <p className="text-sm text-gray-300 mt-2 font-medium">
                {tier.seats}
              </p>

              {!tier.isEnterprise && (
                <p className="text-sm text-green-400 mt-1 font-medium">
                  7-day free trial included
                </p>
              )}
            </CardHeader>

            <CardContent className="space-y-4">
              <ul className="space-y-2">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-4 h-4 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-white" />
                    </div>
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter>
              <Button
                onClick={() => handleSelectPlan(tier)}
                className={`w-full font-semibold py-5 ${
                  isSelected(tier)
                    ? "bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
                    : tier.popular
                    ? "bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
                    : "bg-gray-800 hover:bg-gray-700 text-white border border-gray-600"
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
        ))}
      </div>
    </div>
  );
};

export default PricingPlans;
