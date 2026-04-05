import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Header from "@/components/Header";

import SEO from "@/components/SEO";
import Breadcrumbs from "@/components/Breadcrumbs";
import RelatedArticles from "@/components/RelatedArticles";
import adobeFireflyDemo from "@/assets/adobe-firefly-demo.webp";
import adobeMaxConference from "@/assets/adobe-max-conference.jpg";
import adobeMaxHero from "@/assets/adobe-max-hero.jpg";

const BlogPost = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Adobe MAX 2025"
        description="Adobe MAX 2025 redefines creativity with AI-powered tools including Project Frame Forward, AI Light Control, and Smart Audio Correction. The future of creative production."
        canonical="/blog/adobe-max-2025"
        type="article"
        image={adobeMaxHero}
        article={{
          publishedTime: "2025-11-03",
          section: "AI / Creative Tools",
          author: "HASTE",
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
                { label: "Adobe MAX 2025" },
              ]}
            />
            <p className="text-sm text-brand-orange uppercase tracking-wider font-bold mb-4">
              NOVEMBER 3RD, 2025
            </p>
            <h1 className="text-6xl md:text-8xl font-bold uppercase leading-none mb-6">
              THE ULTIMATE
              <br />
              <span className="text-foreground/90">ADOBE MAX</span>
              <br />
              <span className="text-foreground/90">2025</span>
            </h1>
            <p className="text-xl text-foreground/80 max-w-2xl">
              The creative industry just hit a new level. Adobe MAX 2025 has arrived and it's 
              redefining what's possible for designers, editors, and digital creators everywhere.
            </p>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="border-b border-border py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl">
            <p className="text-lg leading-relaxed mb-6">
              From next-gen AI assistants to intelligent automation across the Creative Cloud ecosystem, 
              this year's MAX wasn't just an update, it was a declaration of what creativity looks like 
              in the AI era. And as a studio built on innovation, <span className="font-bold">Haste Conform Studio</span> couldn't 
              be more excited.
            </p>
          </div>
          <div className="mt-8">
            <img
              src={adobeMaxConference}
              alt="Adobe MAX 2025 Conference - Concepting, Creating, Collaborating"
              className="w-full h-auto rounded-lg"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* Quick Look Section */}
      <section className="border-b border-border py-16 bg-card">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl">
            <h2 className="text-4xl md:text-5xl font-bold uppercase mb-8">
              A QUICK LOOK AT
              <br />
              <span className="text-foreground/90">ADOBE MAX 2025</span>
            </h2>
            <p className="text-lg leading-relaxed mb-8">
              At this year's MAX, Adobe unveiled a collection of experimental AI tools internally 
              known as "Sneaks" showcasing the next frontier of creative intelligence. These projects 
              explore new, intuitive ways to edit photos, videos, and audio with unprecedented precision 
              and speed.
            </p>
            <img
              src={adobeFireflyDemo}
              alt="Adobe Firefly AI-powered creative tools interface"
              className="w-full h-auto rounded-lg"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="border-b border-border py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="space-y-4">
                <div className="h-1 w-16 bg-brand-orange"></div>
                <h3 className="text-2xl font-bold uppercase">
                  PROJECT FRAME
                  <br />
                  FORWARD
                </h3>
                <p className="text-foreground/80 leading-relaxed">
                  A revolutionary video editing tool that lets you add or remove elements from footage, 
                  no masks, no manual tracking. You can delete a subject in one frame, and the AI automatically 
                  applies the change across the entire sequence, seamlessly filling in the background. It's 
                  like Photoshop's Context-Aware Fill, reimagined for moving images.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="space-y-4">
                <div className="h-1 w-16 bg-brand-pink"></div>
                <h3 className="text-2xl font-bold uppercase">
                  AI LIGHT
                  <br />
                  CONTROL
                </h3>
                <p className="text-foreground/80 leading-relaxed">
                  Enabling creators to manipulate lighting conditions within an image as naturally as 
                  dragging sunlight across a virtual scene. This breakthrough tool gives unprecedented 
                  control over mood, atmosphere, and visual storytelling.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="space-y-4">
                <div className="h-1 w-16 bg-brand-blue"></div>
                <h3 className="text-2xl font-bold uppercase">
                  SMART AUDIO
                  <br />
                  CORRECTION
                </h3>
                <p className="text-foreground/80 leading-relaxed">
                  Capable of identifying and fixing mispronunciations in recorded dialogue, saving hours 
                  of post-production cleanup. This AI-powered tool understands context and naturally 
                  corrects speech patterns while maintaining authentic vocal characteristics.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MCP Integration Section */}
      <section className="border-b border-border py-16 bg-card">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl">
            <h2 className="text-4xl md:text-5xl font-bold uppercase mb-8">
              INCORPORATING
              <br />
              <span className="text-foreground/90">MCP SERVER</span>
            </h2>
            <p className="text-lg leading-relaxed mb-6">
              At <span className="font-bold">Haste Conform Studio</span>, we're not just excited observers, we're 
              active participants in this creative revolution. As we integrate these powerful new Adobe 
              tools into our workflow, we're also leveraging the Model Context Protocol (MCP) server to 
              streamline our development process.
            </p>
            <p className="text-lg leading-relaxed mb-6">
              MCP allows us to create intelligent, context-aware development environments that understand 
              our creative intent and technical requirements. By combining Adobe's cutting-edge AI tools 
              with MCP's intelligent automation, we're building a workflow that's not just faster, it's smarter.
            </p>
            <p className="text-lg leading-relaxed">
              This integration means our team can prototype faster, iterate more intelligently, and deliver 
              higher-quality creative solutions to our clients. The future of creative production isn't just 
              about powerful tools, it's about how those tools work together seamlessly.
            </p>
          </div>
        </div>
      </section>

      {/* Closing Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold uppercase">
                THE FUTURE IS
                <br />
                <span className="text-foreground/90">CREATIVE</span>
              </h2>
              <p className="text-lg leading-relaxed">
                Adobe MAX 2025 has shown us that the boundaries between imagination and execution are
                dissolving. With AI-powered tools becoming more intuitive and powerful, and frameworks
                like MCP enabling smarter workflows, we're entering an era where creative vision can be
                realized faster and more beautifully than ever before.
              </p>
              <p className="text-lg leading-relaxed">
                At <span className="font-bold">Haste Conform Studio</span>, we're ready for this future and we're building it.
              </p>
            </div>
          </div>
        </div>
      </section>

      <RelatedArticles currentSlug="/blog/adobe-max-2025" />


    </div>
  );
};

export default BlogPost;
