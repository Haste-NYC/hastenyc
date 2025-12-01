import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Inquire = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-8">INQUIRE</h1>
          <p className="text-xl text-gray-400 mb-12">
            Contact form and information will be migrated from Webflow
          </p>
          <div className="space-y-4 text-lg">
            <p>Email: info@haste.nyc</p>
            <p>Phone: (646) 580-3442</p>
          </div>
          <div className="mt-12">
            <Button asChild variant="outline">
              <Link to="/studio">Back to Studio Home</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inquire;
