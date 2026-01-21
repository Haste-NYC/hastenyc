import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const StudioHome = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-5xl md:text-7xl font-bold">
            Haste Studio
          </h1>
          <p className="text-2xl md:text-3xl text-gray-300">
            Production Company Portfolio
          </p>
          <p className="text-xl text-gray-400">
            Placeholder - Portfolio content will be migrated from Webflow
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
            <Button asChild variant="outline" className="w-full">
              <Link to="/studio/work">WORK</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link to="/studio/press">PRESS</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link to="/studio/talent">TALENT</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link to="/studio/inquire">INQUIRE</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudioHome;
