import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, CreditCard, Calendar, ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const CheckoutSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { user, updateSubscriptionStatus } = useAuth();
  const [subscriptionUpdated, setSubscriptionUpdated] = useState(false);

  // Update subscription status on mount
  useEffect(() => {
    if (!subscriptionUpdated && sessionId) {
      updateSubscriptionStatus("active");
      setSubscriptionUpdated(true);
    }
  }, [sessionId, subscriptionUpdated, updateSubscriptionStatus]);

  // Calculate next billing date (placeholder - 1 month from now)
  const getNextBillingDate = () => {
    const date = new Date();
    date.setMonth(date.getMonth() + 1);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg space-y-8">
        {/* Success Icon and Message */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/10 mb-4">
            <CheckCircle2 className="w-12 h-12 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold">Payment Successful!</h1>
          <p className="text-gray-400">
            Thank you for subscribing to Conform Studio. Your subscription is now active.
          </p>
        </div>

        {/* Subscription Details Card */}
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-pink-500" />
              Subscription Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Plan</span>
              <span className="text-white font-medium">Conform Studio Pro</span>
            </div>
            <Separator className="bg-gray-700" />
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Status</span>
              <span className="inline-flex items-center gap-1.5 text-green-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-green-400"></span>
                Active
              </span>
            </div>
            <Separator className="bg-gray-700" />
            <div className="flex justify-between items-center">
              <span className="text-gray-400 flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                Next billing date
              </span>
              <span className="text-white">{getNextBillingDate()}</span>
            </div>
            {sessionId && (
              <>
                <Separator className="bg-gray-700" />
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Session ID</span>
                  <span className="text-gray-500 text-sm font-mono truncate max-w-[200px]">
                    {sessionId.slice(0, 20)}...
                  </span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Account Info */}
        {user && (
          <div className="text-center text-gray-400 text-sm">
            Subscription activated for <span className="text-white">{user.email}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link to="/account" className="block">
            <Button
              variant="outline"
              className="w-full bg-transparent border-gray-600 text-white hover:bg-gray-800 font-semibold py-6"
            >
              <CreditCard className="mr-2 h-4 w-4" />
              Manage Subscription
            </Button>
          </Link>
          <Link to="/" className="block">
            <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold py-6">
              Go to Home
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Help text */}
        <p className="text-center text-gray-500 text-sm">
          Need help?{" "}
          <a href="mailto:support@haste.nyc" className="text-pink-400 hover:text-pink-300">
            Contact support
          </a>
        </p>
      </div>
    </div>
  );
};

export default CheckoutSuccess;
