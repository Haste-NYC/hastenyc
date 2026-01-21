import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCheckout } from "@/hooks/useCheckout";
import PricingPlans from "@/components/PricingPlans";

interface SelectedPlan {
  priceId: string;
  planType: "monthly" | "yearly";
  tierName: string;
}

// Pricing configuration
const tierPricing: Record<string, { monthly: number; yearly: number }> = {
  Freelancer: { monthly: 49, yearly: 490 },
  Studio: { monthly: 129, yearly: 1290 },
};

const Checkout = () => {
  const { isAuthenticated, user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<SelectedPlan | null>(null);
  const { isLoading, startCheckout } = useCheckout();

  const handleSelectPlan = (priceId: string, planType: "monthly" | "yearly", tierName: string) => {
    setSelectedPlan({ priceId, planType, tierName });
  };

  const handleContinueToPayment = async () => {
    if (!selectedPlan || !user?.email) return;

    await startCheckout({
      priceId: selectedPlan.priceId,
      customerEmail: user.email,
    });
  };

  // If not authenticated, show sign-in/sign-up prompt
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
        <div className="w-full max-w-md space-y-8 text-center">
          <div>
            <Link to="/" className="inline-block mb-8">
              <span className="text-2xl font-bold tracking-wider">CONFORM STUDIO</span>
            </Link>
            <h1 className="text-3xl font-bold">Sign in to continue</h1>
            <p className="text-gray-400 mt-2">
              You need to sign in or create an account to subscribe.
            </p>
          </div>

          <div className="space-y-4">
            <Link to="/signin" className="block">
              <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold py-2">
                Sign In
              </Button>
            </Link>
            <Link to="/signup" className="block">
              <Button
                variant="outline"
                className="w-full bg-transparent border-gray-600 text-white hover:bg-gray-800 font-semibold py-2"
              >
                Create Account
              </Button>
            </Link>
          </div>

          <p className="text-gray-500 text-sm">
            Already have a subscription?{" "}
            <Link to="/signin" className="text-pink-400 hover:text-pink-300">
              Sign in to manage it
            </Link>
          </p>
        </div>
      </div>
    );
  }

  const getPrice = () => {
    if (!selectedPlan) return 0;
    const pricing = tierPricing[selectedPlan.tierName];
    if (!pricing) return 0;
    return selectedPlan.planType === "yearly" ? pricing.yearly : pricing.monthly;
  };

  const getMonthlyEquivalent = () => {
    if (!selectedPlan) return 0;
    const pricing = tierPricing[selectedPlan.tierName];
    if (!pricing) return 0;
    return selectedPlan.planType === "yearly"
      ? Math.round(pricing.yearly / 12)
      : pricing.monthly;
  };

  const getYearlySavings = () => {
    if (!selectedPlan || selectedPlan.planType !== "yearly") return 0;
    const pricing = tierPricing[selectedPlan.tierName];
    if (!pricing) return 0;
    return pricing.monthly * 12 - pricing.yearly;
  };

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-block mb-8">
            <span className="text-2xl font-bold tracking-wider">CONFORM STUDIO</span>
          </Link>
          <h1 className="text-3xl font-bold">Choose your plan</h1>
          <p className="text-gray-400 mt-2">
            Select a subscription plan to get started
          </p>
        </div>

        {/* Pricing Plans - Full Width */}
        <PricingPlans
          onSelectPlan={handleSelectPlan}
          selectedPriceId={selectedPlan?.priceId}
        />

        {/* Order Summary - Centered below plans */}
        {selectedPlan && (
          <div className="max-w-md mx-auto">
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-gray-300">
                  <span>{selectedPlan.tierName} - {selectedPlan.planType === "yearly" ? "Yearly" : "Monthly"}</span>
                  <span>${getPrice()}</span>
                </div>
                <Separator className="bg-gray-700" />
                <div className="flex justify-between text-white font-semibold">
                  <span>Total</span>
                  <span>
                    ${getPrice()}
                    <span className="text-gray-400 font-normal">
                      /{selectedPlan.planType === "yearly" ? "year" : "month"}
                    </span>
                  </span>
                </div>
                {selectedPlan.planType === "yearly" && (
                  <p className="text-sm text-green-400">
                    You save ${getYearlySavings()}/year with the yearly plan!
                  </p>
                )}

                <Button
                  onClick={handleContinueToPayment}
                  disabled={isLoading}
                  className="w-full font-semibold py-6 mt-4 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Redirecting to Stripe...
                    </>
                  ) : (
                    "Continue to Payment"
                  )}
                </Button>

                <p className="text-xs text-green-400 text-center font-medium">
                  Start your 7-day free trial today
                </p>
                <p className="text-xs text-gray-500 text-center">
                  You will be redirected to Stripe for secure payment processing.
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* User info */}
        <div className="text-center text-gray-500 text-sm">
          Signed in as <span className="text-gray-300">{user?.email}</span>
          {" | "}
          <Link to="/signin" className="text-pink-400 hover:text-pink-300">
            Switch account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
