import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface Article {
  slug: string;
  date: string;
  category: string;
  title: string[];
  description: string;
}

const allArticles: Article[] = [
  {
    slug: "/blog/vfx-storage-ilm-weta",
    date: "JANUARY 5, 2025",
    category: "INDUSTRY ANALYSIS",
    title: ["ILM & WĒTĀ", "VFX STORAGE", "INSIGHTS"],
    description: "How Industrial Light & Magic and Wētā FX engineer storage for global-scale visual effects pipelines.",
  },
  {
    slug: "/blog/figma-schema-2025",
    date: "OCTOBER 28, 2025",
    category: "DESIGN SYSTEMS",
    title: ["FIGMA", "SCHEMA", "2025"],
    description: "The future of design systems is here. MCP server integration, component slots, and 10x performance improvements.",
  },
  {
    slug: "/blog/adobe-max-2025",
    date: "NOVEMBER 3, 2025",
    category: "AI / CREATIVE TOOLS",
    title: ["THE ULTIMATE", "ADOBE MAX", "2025"],
    description: "The creative industry just hit a new level. AI-powered tools redefining what's possible for creators everywhere.",
  },
  {
    slug: "/blog/entertainment-shakeup",
    date: "DECEMBER 19, 2024",
    category: "BREAKING NEWS",
    title: ["HOSTILE", "TAKEOVER", "ATTEMPT"],
    description: "Paramount launches hostile bid for Warner Bros. Netflix vs Paramount battle for streaming dominance.",
  },
];

interface RelatedArticlesProps {
  currentSlug: string;
}

const RelatedArticles = ({ currentSlug }: RelatedArticlesProps) => {
  const relatedArticles = allArticles.filter((article) => article.slug !== currentSlug);

  return (
    <section className="border-t border-border py-16">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold uppercase mb-8">
            RELATED
            <br />
            <span className="bg-gradient-to-r from-brand-orange via-brand-pink to-brand-blue bg-clip-text text-transparent">
              ARTICLES
            </span>
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            {relatedArticles.map((article) => (
              <article
                key={article.slug}
                className="border border-border bg-card hover:bg-card/80 transition-colors flex flex-col"
              >
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className="text-xs text-brand-orange uppercase tracking-wider font-bold">
                      {article.date}
                    </span>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">
                      {article.category}
                    </span>
                  </div>

                  <h3 className="text-2xl md:text-3xl font-bold uppercase leading-tight mb-3">
                    <span className="gradient-orange-pink">{article.title[0]}</span>
                    <br />
                    <span className="gradient-pink-blue">{article.title[1]}</span>
                    {article.title[2] && (
                      <>
                        <br />
                        <span className="gradient-blue-green">{article.title[2]}</span>
                      </>
                    )}
                  </h3>

                  <p className="text-foreground/80 mb-4 leading-relaxed flex-grow">
                    {article.description}
                  </p>

                  <Button
                    asChild
                    variant="outline"
                    className="font-bold uppercase w-full mt-auto"
                  >
                    <Link to={article.slug}>Read Article</Link>
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RelatedArticles;
