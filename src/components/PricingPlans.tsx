import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { stripeConfig } from "@/config/stripe";

interface PricingPlansProps {
  onSelectPlan?: (priceId: string, planType: "monthly" | "yearly") => void;
  selectedPriceId?: string;
}

const features = [
  "Unlimited access to all tools",
  "Priority support",
  "Advanced analytics",
  "Custom exports",
  "Team collaboration",
];

const PricingPlans = ({ onSelectPlan, selectedPriceId }: PricingPlansProps) => {
  const [isYearly, setIsYearly] = useState(false);

  const monthlyPrice = 49;
  const yearlyPrice = 490;
  const yearlySavings = Math.round(((monthlyPrice * 12 - yearlyPrice) / (monthlyPrice * 12)) * 100);

  const currentPriceId = isYearly ? stripeConfig.priceYearly : stripeConfig.priceMonthly;
  const isSelected = selectedPriceId === currentPriceId;

  const handleSelectPlan = () => {
    if (onSelectPlan) {
      onSelectPlan(currentPriceId, isYearly ? "yearly" : "monthly");
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto space-y-8">
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

      {/* Pricing Card */}
      <Card
        className={`bg-gray-900 border-2 transition-all duration-200 ${
          isSelected
            ? "border-pink-500 shadow-lg shadow-pink-500/20"
            : "border-gray-700 hover:border-gray-600"
        }`}
      >
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-white text-xl">
            {isYearly ? "Yearly Plan" : "Monthly Plan"}
          </CardTitle>
          <div className="mt-4">
            <span className="text-5xl font-bold text-white">
              ${isYearly ? yearlyPrice : monthlyPrice}
            </span>
            <span className="text-gray-400 ml-2">
              /{isYearly ? "year" : "month"}
            </span>
          </div>
          {isYearly && (
            <p className="text-sm text-gray-400 mt-2">
              ${Math.round(yearlyPrice / 12)}/month when billed yearly
            </p>
          )}
        </CardHeader>

        <CardContent className="space-y-4">
          <ul className="space-y-3">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center gap-3">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <span className="text-gray-300">{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>

        <CardFooter>
          <Button
            onClick={handleSelectPlan}
            className={`w-full font-semibold py-6 ${
              isSelected
                ? "bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
                : "bg-gray-800 hover:bg-gray-700 text-white border border-gray-600"
            }`}
          >
            {isSelected ? "Selected" : "Select Plan"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PricingPlans;
