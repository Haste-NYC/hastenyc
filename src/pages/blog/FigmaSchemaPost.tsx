import { Link } from "react-router-dom";
import Header from "@/components/Header";

import SEO from "@/components/SEO";
import Breadcrumbs from "@/components/Breadcrumbs";
import RelatedArticles from "@/components/RelatedArticles";
import figmaSchemaKeynote from "@/assets/figma-schema-keynote.jpg";
import mcpIntegration from "@/assets/mcp-integration.jpg";
import figmaSlotsDemo from "@/assets/figma-slots-demo.png";

const FigmaSchemaPost = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Figma Schema 2025 - The Future of Design Systems"
        description="Figma Schema 2025 brings MCP server integration, component slots, extended collections, and 10x performance improvements. The future of design systems is here."
        canonical="/blog/figma-schema-2025"
        type="article"
        image={figmaSchemaKeynote}
        article={{
          publishedTime: "2025-10-28",
          section: "Design Systems",
          author: "Dilcia Alvarado",
        }}
      />
      <Header />

      {/* Hero Section */}
      <section className="border-b border-border py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl">
            <Breadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: "Blog", href: "/blog" },
                { label: "Figma Schema 2025" },
              ]}
            />
            <p className="text-sm text-brand-orange uppercase tracking-wider font-bold mb-4">
              OCTOBER 28, 2025 • DILCIA ALVARADO
            </p>
            <h1 className="text-6xl md:text-8xl font-bold uppercase leading-none mb-6">
              FIGMA
              <br />
              <span className="bg-gradient-to-r from-brand-orange via-brand-pink to-brand-blue bg-clip-text text-transparent">SCHEMA</span>
              <br />
              <span className="bg-gradient-to-r from-brand-orange via-brand-pink to-brand-blue bg-clip-text text-transparent">2025</span>
            </h1>
            <p className="text-xl text-foreground/80 max-w-2xl">
              The future of design systems is here
            </p>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="border-b border-border py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl">
            <p className="text-lg leading-relaxed mb-6">
              We're absolutely thrilled to share our excitement about Figma Schema 2025. The announcements from October 28 represent a massive leap forward in how we build, scale, and maintain design systems at Haste Conform Studio.
            </p>
            <p className="text-lg leading-relaxed mb-6">
              This isn't just an incremental update—it's a fundamental reimagining of the design-to-development workflow. And we're here for it.
            </p>
          </div>
          <div className="mt-8">
            <img
              src={figmaSchemaKeynote}
              alt="Figma Schema 2025 Keynote Stage"
              className="w-full h-auto rounded-lg"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* MCP Server Section */}
      <section className="border-b border-border py-16 bg-card">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl">
            <h2 className="text-4xl md:text-5xl font-bold uppercase mb-8">
              MCP SERVER:
              <br />
              <span className="bg-gradient-to-r from-brand-orange via-brand-pink to-brand-blue bg-clip-text text-transparent">OUR NEW SECRET WEAPON</span>
            </h2>
            <p className="text-lg leading-relaxed mb-6">
              The Model Context Protocol (MCP) server integration is a game-changer for Haste Conform Studio's development workflow. We're already incorporating this into our process, bringing Figma context directly into VS Code, Claude Code, and Cursor.
            </p>
            <p className="text-lg leading-relaxed mb-6 font-bold">
              This means richer AI generation, live code mapping, and a truly seamless bridge between design and production code.
            </p>
            <img
              src={mcpIntegration}
              alt="MCP Server Integration in Development Workflow"
              className="w-full h-auto rounded-lg"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="border-b border-border py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl">
            <h2 className="text-4xl md:text-5xl font-bold uppercase mb-12">
              THE BIGGEST
              <br />
              <span className="bg-gradient-to-r from-brand-orange via-brand-pink to-brand-blue bg-clip-text text-transparent">HIGHLIGHTS</span>
            </h2>
            
            <div className="space-y-12">
              {/* Extended Collections */}
              <div className="space-y-4">
                <div className="h-1 w-16 bg-brand-orange"></div>
                <h3 className="text-2xl font-bold uppercase">
                  EXTENDED COLLECTIONS
                </h3>
                <p className="text-foreground/80 leading-relaxed">
                  Multi-brand design system management is now effortless. You can duplicate collections while retaining links to originals, switch between brands seamlessly, and keep your base flexible without messy overrides. This is huge for agencies like us managing multiple client identities.
                </p>
              </div>

              {/* Slots */}
              <div className="space-y-4">
                <div className="h-1 w-16 bg-brand-pink"></div>
                <h3 className="text-2xl font-bold uppercase">
                  SLOTS (COMPONENT SLOTS)
                </h3>
                <p className="text-foreground/80 leading-relaxed mb-4">
                  Components can now have slots—allowing custom elements to be packed inside for maximum flexibility. Designers can specify what goes where, dramatically reducing maintenance overhead and keeping complex UI kits organized and scalable.
                </p>
                <img
                  src={figmaSlotsDemo}
                  alt="Component Slots Demo in Haste Conform Studio"
                  className="w-full h-auto rounded-lg"
                  loading="lazy"
                />
              </div>

              {/* Check Designs */}
              <div className="space-y-4">
                <div className="h-1 w-16 bg-brand-blue"></div>
                <h3 className="text-2xl font-bold uppercase">
                  CHECK DESIGNS
                </h3>
                <p className="text-foreground/80 leading-relaxed">
                  Automated auditing scans and fixes off-brand layers, spots missing styles, and applies variables instantly. AI-powered auto-fixes smooth the developer handoff process and ensure brand consistency at scale.
                </p>
              </div>

              {/* Performance */}
              <div className="space-y-4">
                <div className="h-1 w-16 bg-brand-green"></div>
                <h3 className="text-2xl font-bold uppercase">
                  PERFORMANCE UPGRADES
                </h3>
                <p className="text-foreground/80 leading-relaxed">
                  Figma has dramatically improved speed—updates and state swaps are up to ten times faster. This allows effortless scaling of large libraries without the lag we used to tolerate.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Developer Integration */}
      <section className="border-b border-border py-16 bg-card">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl">
            <h2 className="text-4xl md:text-5xl font-bold uppercase mb-8">
              DEVELOPER &
              <br />
              <span className="bg-gradient-to-r from-brand-orange via-brand-pink to-brand-blue bg-clip-text text-transparent">WORKFLOW INTEGRATION</span>
            </h2>
            
            <div className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold uppercase">
                  MAKE KITS & NPM IMPORTS
                </h3>
                <p className="text-foreground/80 leading-relaxed">
                  Generate React and CSS kits from Figma libraries, import both public and private npm packages directly into Figma Make. Use production React components as building blocks in Figma.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl font-bold uppercase">
                  CODE CONNECT ENHANCEMENTS
                </h3>
                <p className="text-foreground/80 leading-relaxed">
                  Map components to source code in one click. Example code and guidelines attached directly to components facilitate full-circle design-to-development workflows.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl font-bold uppercase">
                  VARIABLE IMPORT/EXPORT
                </h3>
                <p className="text-foreground/80 leading-relaxed">
                  Import and export variables as JSON directly, keeping design artifacts and code perfectly synced.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Table */}
      <section className="border-b border-border py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-4 px-4 font-bold uppercase text-sm">Feature</th>
                    <th className="text-left py-4 px-4 font-bold uppercase text-sm">Description</th>
                    <th className="text-left py-4 px-4 font-bold uppercase text-sm">Availability</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border">
                    <td className="py-4 px-4">Extended Collections</td>
                    <td className="py-4 px-4">Multi-brand design system management</td>
                    <td className="py-4 px-4">November 2025</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-4 px-4">Slots</td>
                    <td className="py-4 px-4">Custom elements in components</td>
                    <td className="py-4 px-4">Early access</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-4 px-4">Check Designs</td>
                    <td className="py-4 px-4">Automated layer audit and fixes</td>
                    <td className="py-4 px-4">Early access</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-4 px-4">MCP Server</td>
                    <td className="py-4 px-4">Figma context in code editors</td>
                    <td className="py-4 px-4 font-bold">GA THIS WEEK</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-4 px-4">Make Kits</td>
                    <td className="py-4 px-4">Auto-generate React/CSS kits</td>
                    <td className="py-4 px-4">Rolling out</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-4 px-4">Variables Expansion</td>
                    <td className="py-4 px-4">More modes, improved authoring</td>
                    <td className="py-4 px-4">November 2025</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-4 px-4">Performance Upgrade</td>
                    <td className="py-4 px-4">10x faster instance operations</td>
                    <td className="py-4 px-4 font-bold">IMMEDIATE</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Closing Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold uppercase">
                THIS IS
                <br />
                <span className="bg-gradient-to-r from-brand-orange via-brand-pink to-brand-blue bg-clip-text text-transparent">THE FUTURE</span>
              </h2>
              <p className="text-lg leading-relaxed">
                Schema 2025 marks Figma's evolution towards being a unified, extensible platform powering design, code, and AI at scale. At Haste Conform Studio, we're not just watching this transformation—we're actively integrating it into every project.
              </p>
              <p className="text-lg leading-relaxed font-bold">
                The MCP server integration alone changes everything about how we build. Faster. Smarter. More connected.
              </p>
              <p className="text-sm text-muted-foreground mt-8">
                Written by Dilcia Alvarado
              </p>
            </div>
          </div>
        </div>
      </section>

      <RelatedArticles currentSlug="/blog/figma-schema-2025" />


    </div>
  );
};

export default FigmaSchemaPost;
