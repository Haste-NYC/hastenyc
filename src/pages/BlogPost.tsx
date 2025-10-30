import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import keynoteImage from "@/assets/figma-schema-keynote.jpg";
import designSystemImage from "@/assets/figma-design-system.jpg";
import mcpImage from "@/assets/mcp-integration.jpg";

import logo from "@/assets/logo.svg";
const BlogPost = () => {
  return <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-6 py-8 flex items-center gap-4">
          <Link to="/" className="inline-flex items-center gap-2 text-foreground hover:text-brand-orange transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="uppercase tracking-wide">Back</span>
          </Link>
          <div className="flex-1 flex justify-center">
            <Link to="/">
              <img src={logo} alt="Conform Studio" className="h-6" />
            </Link>
          </div>
        </div>
      </header>

      {/* Article */}
      <article className="container mx-auto px-6 py-16 max-w-5xl">
        {/* Title */}
        <h1 className="text-6xl md:text-8xl font-bold uppercase mb-6 leading-none tracking-tight">
          FIGMA SCHEMA 2025
        </h1>
        
        <p className="text-xl md:text-2xl gradient-text mb-8 uppercase font-bold">THE FUTURE OF DESIGN SYSTEMS IS HERE</p>

        <div className="text-muted-foreground mb-12 uppercase text-sm tracking-wider">OCTOBER 28, 2025 • DILCIA ALVARADO</div>

        {/* Hero Image */}
        <div className="mb-16 rounded-none overflow-hidden">
          <img src={keynoteImage} alt="Figma Schema 2025 Keynote Stage" className="w-full h-auto" />
        </div>

        {/* Intro */}
        <div className="prose prose-invert prose-lg max-w-none mb-16">
          <p className="text-xl leading-relaxed text-foreground mb-6">
            WE'RE ABSOLUTELY THRILLED TO SHARE OUR EXCITEMENT ABOUT FIGMA SCHEMA 2025. The announcements from October 28 represent a massive leap forward in how we build, scale, and maintain design systems at Conform Studio.
          </p>
          
          <p className="text-xl leading-relaxed text-foreground mb-6">
            This isn't just an incremental update—it's a fundamental reimagining of the design-to-development workflow. AND WE'RE HERE FOR IT.
          </p>
        </div>

        {/* MCP Server Highlight */}
        <div className="bg-card border border-brand-orange p-8 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold uppercase mb-4 gradient-orange-pink">
            MCP SERVER: OUR NEW SECRET WEAPON
          </h2>
          <p className="text-lg text-foreground mb-4">
            The Model Context Protocol (MCP) server integration is a game-changer for Conform Studio's development workflow. We're already incorporating this into our process, bringing Figma context directly into VS Code, Claude Code, and Cursor.
          </p>
          <p className="text-lg text-foreground">
            THIS MEANS RICHER AI GENERATION, LIVE CODE MAPPING, AND A TRULY SEAMLESS BRIDGE BETWEEN DESIGN AND PRODUCTION CODE.
          </p>
        </div>

        <div className="mb-16 rounded-none overflow-hidden">
          <img src={mcpImage} alt="MCP Server Integration in Development Workflow" className="w-full h-auto" />
        </div>

        {/* Key Features */}
        <h2 className="text-5xl md:text-6xl font-bold uppercase mb-12 leading-tight">
          THE BIGGEST <span className="gradient-text">HIGHLIGHTS</span>
        </h2>

        <div className="space-y-12 mb-16">
          {/* Extended Collections */}
          <div>
            <h3 className="text-3xl md:text-4xl font-bold uppercase mb-4 text-brand-orange">
              EXTENDED COLLECTIONS
            </h3>
            <p className="text-lg leading-relaxed text-foreground">Multi-brand design system management is now effortless. You can duplicate collections while retaining links to originals, switch between brands seamlessly, and keep your base flexible without messy overrides.</p>
          </div>

          {/* Slots */}
          <div>
            <h3 className="text-3xl md:text-4xl font-bold uppercase mb-4 text-brand-pink">
              SLOTS (COMPONENT SLOTS)
            </h3>
            <p className="text-lg leading-relaxed text-foreground">
              Components can now have slots—allowing custom elements to be packed inside for maximum flexibility. Designers can specify what goes where, dramatically reducing maintenance overhead and keeping complex UI kits organized and scalable.
            </p>
          </div>

          <div className="rounded-none overflow-hidden mb-6">
            <img 
              src="https://dev-to-uploads.s3.amazonaws.com/uploads/articles/yh55yarz11mdeyn5kbnf.png" 
              alt="Component Slots Demo in Conform Studio" 
              className="w-full h-auto" 
              loading="lazy"
              decoding="async"
            />
          </div>

          {/* Check Designs */}
          <div>
            <h3 className="text-3xl md:text-4xl font-bold uppercase mb-4 text-brand-blue">
              CHECK DESIGNS
            </h3>
            <p className="text-lg leading-relaxed text-foreground">
              Automated auditing scans and fixes off-brand layers, spots missing styles, and applies variables instantly. AI-powered auto-fixes smooth the developer handoff process and ensure brand consistency at scale.
            </p>
          </div>

          {/* Performance */}
          <div>
            <h3 className="text-3xl md:text-4xl font-bold uppercase mb-4 text-brand-green">
              PERFORMANCE UPGRADES
            </h3>
            <p className="text-lg leading-relaxed text-foreground">
              Figma has dramatically improved speed—updates and state swaps are UP TO TEN TIMES FASTER. This allows effortless scaling of large libraries without the lag we used to tolerate.
            </p>
          </div>
        </div>

        {/* Developer Integration */}
        <h2 className="text-5xl md:text-6xl font-bold uppercase mb-12 leading-tight">
          DEVELOPER & <span className="gradient-blue-green">WORKFLOW INTEGRATION</span>
        </h2>

        <div className="space-y-8 mb-16">
          <div className="border-l-4 border-brand-orange pl-6">
            <h4 className="text-2xl font-bold uppercase mb-2">MAKE KITS & NPM IMPORTS</h4>
            <p className="text-lg text-foreground">
              Generate React and CSS kits from Figma libraries, import both public and private npm packages directly into Figma Make. Use production React components as building blocks IN FIGMA.
            </p>
          </div>

          <div className="border-l-4 border-brand-pink pl-6">
            <h4 className="text-2xl font-bold uppercase mb-2">CODE CONNECT ENHANCEMENTS</h4>
            <p className="text-lg text-foreground">
              Map components to source code in one click. Example code and guidelines attached directly to components facilitate full-circle design-to-development workflows.
            </p>
          </div>

          <div className="border-l-4 border-brand-blue pl-6">
            <h4 className="text-2xl font-bold uppercase mb-2">VARIABLE IMPORT/EXPORT</h4>
            <p className="text-lg text-foreground">
              Import and export variables as JSON directly, keeping design artifacts and code PERFECTLY SYNCED.
            </p>
          </div>
        </div>

        {/* Feature Table */}
        <div className="bg-card border border-border mb-16 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary">
                <tr>
                  <th className="text-left p-4 uppercase text-brand-orange">Feature</th>
                  <th className="text-left p-4 uppercase text-brand-pink">Description</th>
                  <th className="text-left p-4 uppercase text-brand-blue">Availability</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="p-4 font-bold">Extended Collections</td>
                  <td className="p-4">Multi-brand design system management</td>
                  <td className="p-4">November 2025</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold">Slots</td>
                  <td className="p-4">Custom elements in components</td>
                  <td className="p-4">Early access</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold">Check Designs</td>
                  <td className="p-4">Automated layer audit and fixes</td>
                  <td className="p-4">Early access</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold">MCP Server</td>
                  <td className="p-4">Figma context in code editors</td>
                  <td className="p-4 gradient-text font-bold">GA THIS WEEK</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold">Make Kits</td>
                  <td className="p-4">Auto-generate React/CSS kits</td>
                  <td className="p-4">Rolling out</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold">Variables Expansion</td>
                  <td className="p-4">More modes, improved authoring</td>
                  <td className="p-4">November 2025</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold">Performance Upgrade</td>
                  <td className="p-4">10x faster instance operations</td>
                  <td className="p-4 gradient-text font-bold">IMMEDIATE</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Conclusion */}
        <div className="bg-gradient-to-br from-brand-orange/10 via-brand-pink/10 to-brand-blue/10 p-12 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold uppercase mb-6 gradient-text">
            THIS IS THE FUTURE
          </h2>
          <p className="text-xl leading-relaxed text-foreground mb-6">
            Schema 2025 marks Figma's evolution towards being a unified, extensible platform powering design, code, and AI at scale. At Conform Studio, we're not just watching this transformation—WE'RE ACTIVELY INTEGRATING IT INTO EVERY PROJECT.
          </p>
          <p className="text-xl leading-relaxed text-foreground">
            The MCP server integration alone changes everything about how we build. FASTER. SMARTER. MORE CONNECTED.
          </p>
        </div>

        {/* Footer */}
        <div className="border-t border-border pt-8">
          <p className="text-muted-foreground uppercase text-sm tracking-wider">
            Written by Dilcia Alvarado
          </p>
        </div>
      </article>
    </div>;
};
export default BlogPost;