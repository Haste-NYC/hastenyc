import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Press = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-8">PRESS</h1>
          <p className="text-xl text-gray-400 mb-12">
            Press coverage will be migrated from Webflow
          </p>
          <Button asChild variant="outline">
            <Link to="/studio">Back to Studio Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Press;
