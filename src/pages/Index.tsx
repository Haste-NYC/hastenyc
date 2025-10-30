import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.svg";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-6 py-6">
          <img src={logo} alt="Conform Studio" className="h-6" />
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-6 py-32 text-left">
        <h2 className="text-7xl md:text-9xl font-bold uppercase leading-none mb-8 tracking-tight">
          DESIGN<br />
          SYSTEMS<br />
          <span className="gradient-text">AT SCALE</span>
        </h2>
        
        <p className="text-xl md:text-2xl max-w-2xl mb-12 text-muted-foreground">
          Building the future of design-to-development workflows with cutting-edge tools and uncompromising quality.
        </p>

        <Link to="/blog/figma-schema-2025">
          <Button 
            size="lg" 
            className="uppercase tracking-wider bg-brand-orange hover:bg-brand-pink transition-colors text-background font-bold px-8 py-6 text-lg"
          >
            READ OUR LATEST POST
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </Link>
      </section>

      {/* Blog Preview */}
      <section className="container mx-auto px-6 py-16 border-t border-border">
        <h3 className="text-4xl md:text-5xl font-bold uppercase mb-12 gradient-orange-pink">
          LATEST FROM THE BLOG
        </h3>
        
        <Link to="/blog/figma-schema-2025" className="block group">
          <article className="bg-card border border-border p-8 hover:border-brand-orange transition-colors">
            <div className="text-sm text-brand-orange uppercase tracking-wider mb-4">
              October 28, 2025
            </div>
            <h4 className="text-3xl md:text-4xl font-bold uppercase mb-4 group-hover:gradient-text transition-all">
              FIGMA SCHEMA 2025: THE FUTURE OF DESIGN SYSTEMS
            </h4>
            <p className="text-lg text-muted-foreground mb-6">
              We're thrilled to share our excitement about the groundbreaking announcements from Figma Schema 2025, and how we're incorporating MCP server into our development workflow at Conform Studio.
            </p>
            <div className="flex items-center gap-2 text-brand-orange uppercase text-sm font-bold">
              READ MORE
              <ArrowRight className="w-4 h-4" />
            </div>
          </article>
        </Link>
      </section>
    </div>
  );
};

export default Index;
