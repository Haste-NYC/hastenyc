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
}

const Checkout = () => {
  const { isAuthenticated, user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<SelectedPlan | null>(null);
  const { isLoading, startCheckout } = useCheckout();

  const handleSelectPlan = (priceId: string, planType: "monthly" | "yearly") => {
    setSelectedPlan({ priceId, planType });
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

  const monthlyPrice = 29;
  const yearlyPrice = 279;

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
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

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Plan Selection - 2 columns on large screens */}
          <div className="lg:col-span-2">
            <PricingPlans
              onSelectPlan={handleSelectPlan}
              selectedPriceId={selectedPlan?.priceId}
            />
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="bg-gray-900 border-gray-700 sticky top-8">
              <CardHeader>
                <CardTitle className="text-white">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedPlan ? (
                  <>
                    <div className="flex justify-between text-gray-300">
                      <span>{selectedPlan.planType === "yearly" ? "Yearly Plan" : "Monthly Plan"}</span>
                      <span>
                        ${selectedPlan.planType === "yearly" ? yearlyPrice : monthlyPrice}
                      </span>
                    </div>
                    <Separator className="bg-gray-700" />
                    <div className="flex justify-between text-white font-semibold">
                      <span>Total</span>
                      <span>
                        ${selectedPlan.planType === "yearly" ? yearlyPrice : monthlyPrice}
                        <span className="text-gray-400 font-normal">
                          /{selectedPlan.planType === "yearly" ? "year" : "month"}
                        </span>
                      </span>
                    </div>
                    {selectedPlan.planType === "yearly" && (
                      <p className="text-sm text-green-400">
                        You save ${monthlyPrice * 12 - yearlyPrice}/year with the yearly plan!
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-gray-400 text-center py-4">
                    Select a plan to see pricing details
                  </p>
                )}

                <Button
                  onClick={handleContinueToPayment}
                  disabled={!selectedPlan || isLoading}
                  className={`w-full font-semibold py-6 mt-4 ${
                    selectedPlan && !isLoading
                      ? "bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
                      : "bg-gray-800 text-gray-500 cursor-not-allowed"
                  }`}
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

                <p className="text-xs text-gray-500 text-center">
                  You will be redirected to Stripe for secure payment processing.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

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
