import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import Breadcrumbs from "@/components/Breadcrumbs";
import RelatedArticles from "@/components/RelatedArticles";
import heroImage from "@/assets/warner-bros-battle-hero.jpg";

const EntertainmentShakeupPost = () => {
  const [showWarnerInfo, setShowWarnerInfo] = useState(false);
  const [showNetflixInfo, setShowNetflixInfo] = useState(false);
  const [showParamountInfo, setShowParamountInfo] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Paramount's Hostile Takeover Attempt on Warner Bros"
        description="Paramount launches hostile bid for Warner Bros as Netflix competes for streaming dominance. Analysis of the $82.7B deal and its economic implications."
        canonical="/blog/entertainment-shakeup"
        type="article"
        image={heroImage}
        article={{
          publishedTime: "2024-12-19",
          section: "Breaking News",
          author: "HASTE.NYC",
        }}
      />
      <Header />

      <article>
        {/* Hero Section */}
        <header className="relative h-[70vh] min-h-[500px] overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={heroImage}
              alt="Corporate battle between Netflix, Paramount, and Warner Bros - Hostile takeover news"
              className="w-full h-full object-cover"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          </div>

          <div className="relative z-10 h-full flex flex-col justify-end px-6 md:px-12 lg:px-24 pb-12">
            <div className="max-w-5xl">
              <Breadcrumbs
                items={[
                  { label: "Home", href: "/" },
                  { label: "Blog", href: "/blog" },
                  { label: "Entertainment Shakeup" },
                ]}
              />
              <span className="inline-block px-4 py-1 mb-6 text-sm font-bold uppercase tracking-wider bg-brand-orange text-black">
                Breaking News
              </span>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold uppercase leading-none mb-6 text-gradient-brand">
                Hostile Takeover Attempt by Paramount
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl font-normal normal-case animate-fade-in" style={{ animationDelay: "0.2s" }}>
                And its possible repercussions on the economy
              </p>
              <div className="flex items-center gap-6 mt-8 text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: "0.4s" }}>
                <time dateTime="2024-12-19">December 19, 2024</time>
                <span className="w-1 h-1 rounded-full bg-brand-orange" />
                <span>12 min read</span>
              </div>
            </div>
          </div>
        </header>

        {/* Article Content */}
        <main className="px-6 md:px-12 lg:px-24 py-16">
          <div className="max-w-4xl mx-auto">

            {/* Lead Section */}
            <section className="mb-16">
              <p className="text-xl md:text-2xl leading-relaxed text-foreground/90 font-normal normal-case">
                Two of the biggest competitors on the market are battling for full control of a global entertainment leader that has dominated the industry for decades. That is the giant media that also owns a major Hollywood studio for producing movies, the iconic HBO brand, HBO Max, all of that combined with Discovery, which Warner Brothers also owns, and it is the fourth largest streaming service in America.
              </p>
            </section>

            {/* Highlighted Quote */}
            <blockquote className="border-l-4 border-brand-orange pl-6 py-4 my-12">
              <p className="text-2xl md:text-3xl font-black uppercase text-gradient-brand">
                Last week, Warner Brothers announced that Netflix had won the bidding war. But now, Paramount is launching what's called a hostile bid.
              </p>
            </blockquote>

            {/* The Stakes */}
            <section className="mb-16">
              <h2 className="text-3xl md:text-4xl font-bold uppercase mb-8 text-gradient-cool">The Stakes</h2>
              <p className="text-lg leading-relaxed text-foreground/80 mb-6 font-normal normal-case">
                Warner Bros is on the lead between Netflix and Paramount Pictures, because both companies want to take different ways. This entire Warner Bros bidding war raises red flags, because we're talking about some of the biggest media conglomerates in the world getting even bigger. And when one company dominates an industry and there's less competition, a few things can happen.
              </p>

              <div className="grid md:grid-cols-3 gap-6 my-12">
                <div className="bg-card p-6 border border-border hover:border-brand-orange transition-colors duration-300">
                  <div className="text-4xl font-black text-brand-orange mb-2">^</div>
                  <h3 className="text-lg mb-2 font-bold text-gradient-brand">Rising Costs</h3>
                  <p className="text-muted-foreground text-sm font-normal normal-case">Your subscription fees will probably go up significantly</p>
                </div>
                <div className="bg-card p-6 border border-border hover:border-brand-pink transition-colors duration-300">
                  <div className="text-4xl font-black text-brand-pink mb-2">v</div>
                  <h3 className="text-lg mb-2 font-bold text-gradient-cool">Fewer Options</h3>
                  <p className="text-muted-foreground text-sm font-normal normal-case">Your options for shows and movies will likely get worse</p>
                </div>
                <div className="bg-card p-6 border border-border hover:border-destructive transition-colors duration-300">
                  <div className="text-4xl font-black text-destructive mb-2">X</div>
                  <h3 className="text-lg mb-2 font-bold text-gradient-brand">Job Losses</h3>
                  <p className="text-muted-foreground text-sm font-normal normal-case">Union workers just might lose their jobs</p>
                </div>
              </div>
            </section>

            {/* Market Impact */}
            <section className="mb-16">
              <h2 className="text-3xl md:text-4xl font-bold uppercase mb-8 text-gradient-cool">Market Impact</h2>
              <p className="text-lg leading-relaxed text-foreground/80 mb-6 font-normal normal-case">
                This is a jolt for Hollywood and for streamers all around the world, yet we live in a streaming era that has been defined by Netflix. Netflix has been growing by leaps and bounds for years, being the king of the streaming services and now will have the power to upper the prices for every movie on streaming, which can affect the market.
              </p>
              <p className="text-lg leading-relaxed text-foreground/80 mb-6 font-normal normal-case">
                Higher subscription fees become probable as the merged entity controls major libraries like HBO and Warner studios, limiting alternatives. Netflix projects $2-3 billion in annual savings by year three, potentially passed to shareholders rather than consumers, mirroring past price hikes from $7.99 to $17.99 monthly. Content diversity may decline, shifting spending from cable to bundled streaming at elevated costs.
              </p>
            </section>

            {/* Economic Warning */}
            <div className="bg-gradient-to-r from-brand-orange/20 to-brand-pink/20 p-8 md:p-12 my-16 border-l-4 border-brand-orange">
              <h3 className="text-2xl md:text-3xl mb-4 text-gradient-brand font-bold">Economic Warning Signs</h3>
              <p className="text-foreground/80 font-normal normal-case">
                Job losses loom large, with unions warning of layoffs akin to Disney's post-Fox cuts, affecting writers, actors, crew, and global freelancers. Fewer films and series would follow, shrinking Hollywood's output amid an industry downturn and reducing vendor revenue worldwide. While Netflix claims boosted U.S. production and creative jobs, historical mergers show net reductions.
              </p>
            </div>

            {/* Latest Developments */}
            <section className="mb-16">
              <h2 className="text-3xl md:text-4xl font-bold uppercase mb-8 text-gradient-cool">Latest Developments</h2>
              <div className="space-y-8">
                <div className="border-b border-border pb-8">
                  <span className="text-sm text-brand-orange font-bold uppercase tracking-wider">December 17</span>
                  <h3 className="text-xl mt-2 mb-4 font-bold text-gradient-brand">Warner Rejects Paramount's Offer</h3>
                  <p className="text-foreground/80 font-normal normal-case">
                    WBD's board unanimously rejected Paramount's offer as "illusory" due to financing risks, regulatory hurdles, and inferior terms, reaffirming the Netflix agreement. Paramount may raise its bid to $33/share ($90-119 billion range), but WBD urges shareholders to ignore it ahead of a January 8 deadline.
                  </p>
                </div>

                <div className="border-b border-border pb-8">
                  <span className="text-sm text-brand-pink font-bold uppercase tracking-wider">Netflix Response</span>
                  <h3 className="text-xl mt-2 mb-4 font-bold text-gradient-cool">Co-CEO Peters Defends the Deal</h3>
                  <p className="text-foreground/80 font-normal normal-case">
                    Greg Peters, Co-CEO of Netflix, frames the Warner Bros. deal as a strategic move that strengthens competition in the streaming market. By presenting the arrangement as pro-consumer, he suggests regulators will view it favorably because it could spur rival offerings, push for more competitive pricing, and incentivize broader access to a wider catalog of content.
                  </p>
                </div>
              </div>
            </section>

            {/* Financial Certainty */}
            <section className="mb-16">
              <h2 className="text-3xl md:text-4xl font-bold uppercase mb-8 text-gradient-cool">Why Netflix Has the Edge</h2>
              <p className="text-lg leading-relaxed text-foreground/80 mb-6 font-normal normal-case">
                Warner Bros has highlighted that they favor Netflix's offer because it is backed by a company with a market capitalization exceeding $400 billion and provides financial certainty through binding financing commitments. This reduces risks from lengthy and costly regulatory processes, although both deals could face scrutiny.
              </p>

              <div className="bg-card border border-border p-8 mt-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-orange to-brand-pink flex items-center justify-center text-lg font-black text-black">
                    $400B+
                  </div>
                  <div>
                    <div className="font-bold uppercase text-foreground">Netflix Market Cap</div>
                    <div className="text-sm text-muted-foreground font-normal normal-case">Financial backing for the deal</div>
                  </div>
                </div>
              </div>
            </section>

            {/* Conclusion */}
            <section className="mb-16">
              <h2 className="text-3xl md:text-4xl font-bold uppercase mb-8 text-gradient-cool">What This Means for the Future</h2>
              <p className="text-lg leading-relaxed text-foreground/80 mb-6 font-normal normal-case">
                In this framing, competition is the driver of consumer benefits. Peters likely contends that the merger or partnership would compel other players to improve their own services, leading to more dynamic pricing models, accelerated content innovation, and expanded access across devices and regions.
              </p>
              <p className="text-lg leading-relaxed text-foreground/80 font-normal normal-case">
                Warner Bros Discovery's decision to back Netflix's offer instead of accepting Paramount's hostile bid marks a pivotal moment in the consolidation of the entertainment and streaming sector. Depending on the final outcome, it could redefine the competitive landscape of Hollywood and global content distribution platforms.
              </p>
            </section>

            {/* Tags */}
            <footer className="border-t border-border pt-8 mt-16" aria-label="Article tags">
              <nav aria-label="Related topics" className="flex justify-center">
                <ul className="flex flex-wrap justify-center gap-3 list-none p-0 m-0">
                  {["Warner Bros", "Netflix", "Paramount"].map((tag) => (
                    <li key={tag}>
                      {tag === "Warner Bros" ? (
                        <button
                          onClick={() => setShowWarnerInfo(!showWarnerInfo)}
                          title={`View more information about ${tag}`}
                          aria-label={`Toggle information about ${tag}`}
                          className={`inline-block px-4 py-2 text-sm font-bold uppercase tracking-wider border transition-colors ${showWarnerInfo ? 'border-brand-orange text-brand-orange bg-brand-orange/10' : 'border-border hover:border-brand-orange hover:text-brand-orange'}`}
                        >
                          {tag}
                        </button>
                      ) : tag === "Netflix" ? (
                        <button
                          onClick={() => setShowNetflixInfo(!showNetflixInfo)}
                          title={`View more information about ${tag}`}
                          aria-label={`Toggle information about ${tag}`}
                          className={`inline-block px-4 py-2 text-sm font-bold uppercase tracking-wider border transition-colors ${showNetflixInfo ? 'border-brand-pink text-brand-pink bg-brand-pink/10' : 'border-border hover:border-brand-pink hover:text-brand-pink'}`}
                        >
                          {tag}
                        </button>
                      ) : tag === "Paramount" ? (
                        <button
                          onClick={() => setShowParamountInfo(!showParamountInfo)}
                          title={`View more information about ${tag}`}
                          aria-label={`Toggle information about ${tag}`}
                          className={`inline-block px-4 py-2 text-sm font-bold uppercase tracking-wider border transition-colors ${showParamountInfo ? 'border-destructive text-destructive bg-destructive/10' : 'border-border hover:border-destructive hover:text-destructive'}`}
                        >
                          {tag}
                        </button>
                      ) : (
                        <Link
                          to={`/topics/${tag.toLowerCase().replace(/\s+/g, '-')}`}
                          title={`View more articles about ${tag}`}
                          aria-label={`Browse articles tagged with ${tag}`}
                          className="inline-block px-4 py-2 text-sm font-bold uppercase tracking-wider border border-border hover:border-brand-orange hover:text-brand-orange transition-colors"
                        >
                          {tag}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Warner Bros Info Panel */}
              {showWarnerInfo && (
                <div className="mt-8 bg-card border border-brand-orange/30 p-8 animate-fade-in">
                  <h3 className="text-2xl font-bold text-gradient-brand mb-6">Warner Bros. Discovery Strategic Review</h3>

                  <div className="space-y-6 text-foreground/80 font-normal normal-case">
                    <p className="text-lg leading-relaxed">
                      Warner Bros. Discovery (WBD) initiated a strategic review in October 2025 to maximize shareholder value amid unsolicited acquisition interest from parties like Netflix, Comcast, and Paramount Skydance. The company faces heavy debt exceeding $35 billion, declining linear TV revenues, and industry shifts favoring streaming over traditional cable. This led to a preferred merger with Netflix announced December 5, 2025, separating high-value studios/streaming (HBO, Warner Bros. Pictures, Max) for $27.75 per share while spinning off Discovery Global networks.
                    </p>

                    <p className="text-lg leading-relaxed">
                      WBD carries significant debt from past mergers, pressuring the board to unlock asset value through sales or separations rather than standalone operations. Analysts note bids must exceed $30 per share to gain approval, reflecting premiums for franchises like DC, Harry Potter, and HBO libraries. The Netflix deal addresses this by providing certain value without assuming full company debt.
                    </p>

                    <p className="text-lg leading-relaxed">
                      Streaming growth outpaces cable, prompting WBD's June 2025 plan to split into studios/streaming and linear networks by mid-2026. External bids accelerated the review, with Netflix positioned to boost production, content libraries, and global reach. The board views this as superior to rivals like Paramount's hostile bid due to execution certainty.
                    </p>
                  </div>

                  <div className="mt-6 grid md:grid-cols-3 gap-4">
                    <div className="bg-background p-4 border border-border">
                      <div className="text-2xl font-black text-destructive">$35B+</div>
                      <div className="text-sm text-muted-foreground">Company Debt</div>
                    </div>
                    <div className="bg-background p-4 border border-border">
                      <div className="text-2xl font-black text-brand-orange">$27.75</div>
                      <div className="text-sm text-muted-foreground">Per Share (Netflix Deal)</div>
                    </div>
                    <div className="bg-background p-4 border border-border">
                      <div className="text-2xl font-black text-brand-pink">$30+</div>
                      <div className="text-sm text-muted-foreground">Min Bid for Approval</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Netflix Info Panel */}
              {showNetflixInfo && (
                <div className="mt-8 bg-card border border-brand-pink/30 p-8 animate-fade-in">
                  <h3 className="text-2xl font-bold text-gradient-cool mb-6">Netflix's Strategic Vision</h3>

                  <div className="space-y-6 text-foreground/80 font-normal normal-case">
                    <p className="text-lg leading-relaxed">
                      Netflix emphasizes uniting WBD's iconic franchises like DC, Harry Potter, and Game of Thrones with its 300 million subscribers for unmatched entertainment scale.
                    </p>

                    <p className="text-lg leading-relaxed">
                      The company commits to preserving Warner Bros.' theatrical releases and operations, viewing the merger as bolstering Hollywood's future.
                    </p>

                    <p className="text-lg leading-relaxed">
                      Co-CEOs expressed no change in position post-Paramount's bid, calling it "entirely expected".
                    </p>
                  </div>

                  <div className="mt-6 grid md:grid-cols-3 gap-4">
                    <div className="bg-background p-4 border border-border">
                      <div className="text-2xl font-black text-brand-pink">300M</div>
                      <div className="text-sm text-muted-foreground">Global Subscribers</div>
                    </div>
                    <div className="bg-background p-4 border border-border">
                      <div className="text-2xl font-black text-brand-orange">DC</div>
                      <div className="text-sm text-muted-foreground">Iconic Franchise</div>
                    </div>
                    <div className="bg-background p-4 border border-border">
                      <div className="text-2xl font-black text-brand-blue">Film</div>
                      <div className="text-sm text-muted-foreground">Theatrical Preserved</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Paramount Info Panel */}
              {showParamountInfo && (
                <div className="mt-8 bg-card border border-destructive/30 p-8 animate-fade-in">
                  <h3 className="text-2xl font-bold text-gradient-brand mb-6">Paramount's Hostile Bid Strategy</h3>

                  <div className="space-y-6 text-foreground/80 font-normal normal-case">
                    <p className="text-lg leading-relaxed">
                      Paramount seeks to create a media powerhouse by absorbing WBD's full portfolio, including CNN, TBS, TNT, HBO, Warner Bros. studios, and Discovery networks, to challenge Netflix's streaming dominance.
                    </p>

                    <p className="text-lg leading-relaxed">
                      This counters WBD's planned split and Netflix's $82.7 billion deal for only studios/streaming, offering shareholders the entire company at a premium over market and debt-laden value.
                    </p>

                    <p className="text-lg leading-relaxed">
                      Ellison emphasizes building rather than cutting, enhancing competition, consumer choice, and creative talent support.
                    </p>
                  </div>

                  <div className="mt-6 grid md:grid-cols-3 gap-4">
                    <div className="bg-background p-4 border border-border">
                      <div className="text-2xl font-black text-destructive">$82.7B</div>
                      <div className="text-sm text-muted-foreground">Netflix Deal Value</div>
                    </div>
                    <div className="bg-background p-4 border border-border">
                      <div className="text-2xl font-black text-brand-orange">CNN</div>
                      <div className="text-sm text-muted-foreground">Included in Bid</div>
                    </div>
                    <div className="bg-background p-4 border border-border">
                      <div className="text-2xl font-black text-brand-pink">Premium</div>
                      <div className="text-sm text-muted-foreground">Premium Offer</div>
                    </div>
                  </div>
                </div>
              )}
            </footer>
          </div>
        </main>
      </article>

      <RelatedArticles currentSlug="/blog/entertainment-shakeup" />

      <Footer />
    </div>
  );
};

export default EntertainmentShakeupPost;
