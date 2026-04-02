import { Link, useSearchParams } from "react-router-dom";
import conformLogo from "@/assets/conform-studio-logo.png";

const CheckoutSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <img
        src={conformLogo}
        alt="Conform Studio"
        className="w-64 sm:w-80 h-auto mb-10"
      />

      <h1 className="text-white text-base font-medium mb-2">
        Payment successful
      </h1>

      <p className="text-white/40 text-sm mb-8">
        Your subscription is now active. Download Conform Studio to get started.
      </p>

      <Link
        to="/download"
        className="text-white/50 text-sm hover:text-white transition-colors"
      >
        Download Conform Studio
      </Link>

      {sessionId && (
        <p className="text-white/15 text-xs font-mono mt-12">
          {sessionId.slice(0, 24)}...
        </p>
      )}
    </div>
  );
};

export default CheckoutSuccess;
