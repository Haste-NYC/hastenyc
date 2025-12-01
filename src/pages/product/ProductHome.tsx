import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const ProductHome = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
            Conform Studio
          </h1>
          <p className="text-2xl md:text-3xl text-gray-300">
            AI-Powered Automation for Seamless Post Workflows
          </p>
          <p className="text-xl text-gray-400">
            Placeholder - Product homepage content will be migrated from Figma Sites
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg" className="bg-orange-500 hover:bg-orange-600">
              <Link to="/blog">View Blog</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/studio">View Portfolio</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductHome;
