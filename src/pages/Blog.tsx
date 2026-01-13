import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import vfxStorageHero from "@/assets/vfx-storage-hero.jpg";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const Blog = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Blog - Creative Technology Insights"
        description="Explore the latest insights on AI-powered creative tools, design systems, and post-production automation from HASTE.NYC."
        canonical="/blog"
      />
      <Header />

      {/* Hero Section */}
      <section className="border-b border-border">
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-4xl mb-8">
            <p className="text-sm text-brand-orange uppercase tracking-wider font-bold mb-4">
              LATEST FROM THE STUDIO
            </p>
            <h2 className="text-5xl md:text-7xl font-bold uppercase leading-none mb-6 gradient-text">
              THE FUTURE OF
              <br />
              CREATIVE
              <br />
              TECHNOLOGY
            </h2>
            <p className="text-xl text-foreground/80 max-w-2xl mb-8">
              Exploring innovation at the intersection of design, AI, and creative production.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-brand-orange hover:bg-brand-orange/90 text-white font-bold uppercase"
            >
              <Link to="/blog/vfx-storage-ilm-weta">Read Latest Article</Link>
            </Button>
          </div>
        </div>
        <div className="relative h-[60vh] min-h-[400px] overflow-hidden">
          <img
            src={vfxStorageHero}
            alt="VFX Storage Infrastructure"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Blog Preview Section */}
      <section className="py-20 border-b border-border">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="mb-12">
              <h2 className="text-4xl md:text-5xl font-bold uppercase mb-4">
                FEATURED
                <br />
                <span className="bg-gradient-to-r from-brand-orange to-brand-pink bg-clip-text text-transparent">ARTICLES</span>
              </h2>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {/* VFX Storage Post */}
              <article className="border border-border bg-card hover:bg-card/80 transition-colors flex flex-col">
                <div className="p-8 flex flex-col flex-grow">
                  <div className="flex flex-wrap items-center gap-4 mb-6">
                    <span className="text-xs text-brand-orange uppercase tracking-wider font-bold">
                      JANUARY 5, 2025
                    </span>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">
                      INDUSTRY ANALYSIS
                    </span>
                  </div>

                  <h3 className="text-3xl md:text-4xl font-bold uppercase leading-tight mb-4">
                    <span className="gradient-orange-pink">ENGINEERING</span>
                    <br />
                    <span className="gradient-pink-blue">STORAGE FOR</span>
                    <br />
                    <span className="gradient-blue-green">GLOBAL-SCALE POST</span>
                  </h3>

                  <p className="text-lg text-foreground/80 mb-6 leading-relaxed flex-grow">
                    How the world's leading VFX studios and editorial post houses engineer storage for global-scale pipelines.
                  </p>

                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="font-bold uppercase w-full mt-auto"
                  >
                    <Link to="/blog/vfx-storage-ilm-weta">Read Article</Link>
                  </Button>
                </div>
              </article>

              {/* Figma Schema Post */}
              <article className="border border-border bg-card hover:bg-card/80 transition-colors flex flex-col">
                <div className="p-8 flex flex-col flex-grow">
                  <div className="flex flex-wrap items-center gap-4 mb-6">
                    <span className="text-xs text-brand-orange uppercase tracking-wider font-bold">
                      OCTOBER 28, 2025
                    </span>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">
                      DESIGN SYSTEMS
                    </span>
                  </div>

                  <h3 className="text-3xl md:text-4xl font-bold uppercase leading-tight mb-4">
                    <span className="gradient-orange-pink">FIGMA</span>
                    <br />
                    <span className="gradient-pink-blue">SCHEMA</span>
                    <br />
                    <span className="gradient-blue-green">2025</span>
                  </h3>

                  <p className="text-lg text-foreground/80 mb-6 leading-relaxed flex-grow">
                    The future of design systems is here. MCP server integration, component slots, and 10x performance improvements.
                  </p>

                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="font-bold uppercase w-full mt-auto"
                  >
                    <Link to="/blog/figma-schema-2025">Read Article</Link>
                  </Button>
                </div>
              </article>

              {/* Adobe MAX Post */}
              <article className="border border-border bg-card hover:bg-card/80 transition-colors flex flex-col">
                <div className="p-8 flex flex-col flex-grow">
                  <div className="flex flex-wrap items-center gap-4 mb-6">
                    <span className="text-xs text-brand-orange uppercase tracking-wider font-bold">
                      NOVEMBER 3, 2025
                    </span>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">
                      AI / CREATIVE TOOLS
                    </span>
                  </div>

                  <h3 className="text-3xl md:text-4xl font-bold uppercase leading-tight mb-4">
                    <span className="gradient-orange-pink">THE ULTIMATE</span>
                    <br />
                    <span className="gradient-pink-blue">ADOBE MAX</span>
                    <br />
                    <span className="gradient-blue-green">2025</span>
                  </h3>

                  <p className="text-lg text-foreground/80 mb-6 leading-relaxed flex-grow">
                    The creative industry just hit a new level. AI-powered tools redefining what's possible for creators everywhere.
                  </p>

                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="font-bold uppercase w-full mt-auto"
                  >
                    <Link to="/blog/adobe-max-2025">Read Article</Link>
                  </Button>
                </div>
              </article>

              {/* Entertainment Shakeup Post */}
              <article className="border border-border bg-card hover:bg-card/80 transition-colors flex flex-col">
                <div className="p-8 flex flex-col flex-grow">
                  <div className="flex flex-wrap items-center gap-4 mb-6">
                    <span className="text-xs text-brand-orange uppercase tracking-wider font-bold">
                      DECEMBER 19, 2024
                    </span>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">
                      BREAKING NEWS
                    </span>
                  </div>

                  <h3 className="text-3xl md:text-4xl font-bold uppercase leading-tight mb-4">
                    <span className="gradient-orange-pink">HOSTILE</span>
                    <br />
                    <span className="gradient-pink-blue">TAKEOVER</span>
                    <br />
                    <span className="gradient-blue-green">ATTEMPT</span>
                  </h3>

                  <p className="text-lg text-foreground/80 mb-6 leading-relaxed flex-grow">
                    Paramount launches hostile bid for Warner Bros. Netflix vs Paramount battle for streaming dominance.
                  </p>

                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="font-bold uppercase w-full mt-auto"
                  >
                    <Link to="/blog/entertainment-shakeup">Read Article</Link>
                  </Button>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold uppercase mb-6">
              BUILDING THE
              <br />
              <span className="bg-gradient-to-r from-brand-orange to-brand-pink bg-clip-text text-transparent">NEXT GENERATION</span>
            </h2>
            <p className="text-lg text-foreground/80 leading-relaxed">
              At <span className="font-bold">Haste Conform Studio</span>, we're dedicated to pushing the boundaries
              of what's possible in creative technology. From AI-powered workflows to intelligent automation,
              we're shaping the future of digital creation.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blog;
