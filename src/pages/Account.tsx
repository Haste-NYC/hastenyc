import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { User, CreditCard, Calendar, LogOut, Settings } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Account = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

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

  const handleSignOut = () => {
    signOut();
    navigate("/");
  };

  const isSubscriptionActive = user?.subscriptionStatus === "active";

  return (
    <div className="min-h-screen bg-black text-white px-4 py-12">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Account</h1>
          <p className="text-gray-400">
            Manage your account settings and subscription.
          </p>
        </div>

        {/* User Info Card */}
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <User className="w-5 h-5 text-pink-500" />
              Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Name</span>
              <span className="text-white font-medium">{user?.name || "Not set"}</span>
            </div>
            <Separator className="bg-gray-700" />
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Email</span>
              <span className="text-white font-medium">{user?.email}</span>
            </div>
          </CardContent>
        </Card>

        {/* Subscription Card */}
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-pink-500" />
              Subscription
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Plan</span>
              <span className="text-white font-medium">
                {isSubscriptionActive ? "Conform Studio Pro" : "No active plan"}
              </span>
            </div>
            <Separator className="bg-gray-700" />
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Status</span>
              {isSubscriptionActive ? (
                <span className="inline-flex items-center gap-1.5 text-green-400 font-medium">
                  <span className="w-2 h-2 rounded-full bg-green-400"></span>
                  Active
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-gray-400 font-medium">
                  <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                  Inactive
                </span>
              )}
            </div>
            {isSubscriptionActive && (
              <>
                <Separator className="bg-gray-700" />
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    Next billing date
                  </span>
                  <span className="text-white">{getNextBillingDate()}</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          {isSubscriptionActive ? (
            <Button
              variant="outline"
              className="w-full bg-transparent border-gray-600 text-white hover:bg-gray-800 font-semibold py-6"
            >
              <Settings className="mr-2 h-4 w-4" />
              Manage Subscription
            </Button>
          ) : (
            <Link to="/checkout" className="block">
              <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold py-6">
                <CreditCard className="mr-2 h-4 w-4" />
                Subscribe Now
              </Button>
            </Link>
          )}
          <Button
            variant="outline"
            onClick={handleSignOut}
            className="w-full bg-transparent border-gray-600 text-white hover:bg-gray-800 font-semibold py-6"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>

        {/* Back to Home Link */}
        <div className="text-center">
          <Link to="/" className="text-gray-400 hover:text-white text-sm">
            Back to Home
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

export default Account;
