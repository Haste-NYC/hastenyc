# HASTE.NYC Blog Post Creation Guide

## AI Agent Prompt Template

Use this template when instructing an AI agent to create a new blog post for haste.nyc.

---

## Prompt Structure

```
Create a new blog post for haste.nyc with the following details:

**Topic:** [Brief description of the news/topic]
**Beat:** [AI/Creative Tools | Design Systems | Entertainment/Media | Security | Startups | Consumer Tech]
**Target Keywords:** [Primary keyword, secondary keywords]
**News Hook:** [What makes this timely/newsworthy]
**Angle:** [HASTE.NYC/Conform Studio perspective or industry analysis]
```

---

## Writing Style Selection

Choose the most appropriate journalist style based on the beat:

### AI / Creative Tools / Product Reviews
- **Joanna Stern (WSJ)**: In-depth product analysis, hands-on testing, consumer-focused. Use for tool reviews, software comparisons, creative workflow analysis.
- **David Pogue**: Clear, accessible explanations of complex tech. Use for tutorials, explainers, beginner-friendly content.
- **Molly Wood**: Tech trends and economics angle. Use for industry shifts, business implications of new tools.

### Big Tech / Platform News / Social Media
- **Mike Isaac (NYT)**: Deep investigative style, platform power dynamics. Use for major acquisitions, corporate battles, industry shakeups.
- **Casey Newton (The Verge)**: Platform accountability, social media trends. Use for content moderation, creator economy, algorithm changes.
- **Kara Swisher**: Fearless, direct, no-nonsense Silicon Valley coverage. Use for executive profiles, controversial takes, industry criticism.

### Privacy / Security / Surveillance
- **Kashmir Hill (NYT)**: Privacy-focused, facial recognition, surveillance tech. Use for data privacy, AI ethics, tracking technologies.
- **Kim Zetter**: Cybersecurity expert, technical depth. Use for security breaches, hacking, cyber threats.

### Design Systems / Developer Tools
- **Technical blog style**: Clear, structured, code-aware. Reference Figma's blog, Vercel's blog for tone.

### Startups / Business / Deals
- **Erin Griffith (NYT)**: Startup ecosystem, labor issues, funding. Use for startup news, VC trends, tech employment.
- **Shira Ovide (WaPo)**: Big tech business analysis, digital markets. Use for antitrust, market dynamics, business strategy.

### Entertainment / Media / Streaming
- **Emily Chang (Bloomberg)**: Global tech and media leadership. Use for streaming wars, media consolidation, entertainment tech.

---

## SEO Checklist

### Pre-Writing Research
- [ ] Identify primary keyword (search volume 1k+)
- [ ] Identify 3-5 secondary keywords
- [ ] Research competitor articles on topic
- [ ] Identify unique angle for HASTE.NYC

### Content Structure
- [ ] H1: Include primary keyword, compelling hook (60 chars max for SERP)
- [ ] Meta description: 150-160 chars, include primary keyword, call to action
- [ ] URL slug: Short, keyword-rich, lowercase, hyphens (e.g., `/blog/figma-schema-2025`)
- [ ] H2/H3 headers: Include secondary keywords naturally
- [ ] First paragraph: Primary keyword in first 100 words
- [ ] Internal links: Link to 2-3 existing blog posts
- [ ] Word count: 1,500-2,500 words for comprehensive coverage

### Image Requirements
- [ ] Hero image: High-quality, relevant, 1200x630px minimum for og:image
- [ ] Alt text: Descriptive, include keywords naturally
- [ ] File naming: Lowercase, hyphens, descriptive (e.g., `adobe-max-2025-keynote.jpg`)
- [ ] Lazy loading: Add `loading="lazy"` to below-fold images
- [ ] WebP format preferred for performance

---

## File Creation Checklist

### 1. Create the Blog Post Component

**File:** `src/pages/[PostName]Post.tsx`

```tsx
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import Breadcrumbs from "@/components/Breadcrumbs";
import RelatedArticles from "@/components/RelatedArticles";
import heroImage from "@/assets/[post-name]-hero.jpg";

const [PostName]Post = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="[Post Title - 60 chars max]"
        description="[Meta description - 150-160 chars with primary keyword]"
        canonical="/blog/[post-slug]"
        type="article"
        image={heroImage}
        article={{
          publishedTime: "[YYYY-MM-DD]",
          section: "[Category]",
          author: "[Author Name or HASTE.NYC]",
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
                { label: "[Post Title Short]" },
              ]}
            />
            <p className="text-sm text-brand-orange uppercase tracking-wider font-bold mb-4">
              [DATE] • [AUTHOR]
            </p>
            <h1 className="text-6xl md:text-8xl font-bold uppercase leading-none mb-6">
              [HEADLINE LINE 1]
              <br />
              <span className="bg-gradient-to-r from-brand-orange via-brand-pink to-brand-blue bg-clip-text text-transparent">
                [HEADLINE LINE 2]
              </span>
            </h1>
            <p className="text-xl text-foreground/80 max-w-2xl">
              [Subheadline/Hook - 1-2 sentences]
            </p>
          </div>
        </div>
      </section>

      {/* Article Content Sections */}
      {/* ... content sections ... */}

      <RelatedArticles currentSlug="/blog/[post-slug]" />

      <Footer />
    </div>
  );
};

export default [PostName]Post;
```

### 2. Add Route to App.tsx

**File:** `src/App.tsx`

```tsx
// Add import at top
import [PostName]Post from "@/pages/[PostName]Post";

// Add route ABOVE the catch-all "*" route
<Route path="/blog/[post-slug]" element={<[PostName]Post />} />
```

### 3. Update RelatedArticles Component

**File:** `src/components/RelatedArticles.tsx`

Add new article to the `allArticles` array:

```tsx
{
  slug: "/blog/[post-slug]",
  date: "[MONTH DD, YYYY]",
  category: "[CATEGORY]",
  title: ["[LINE 1]", "[LINE 2]", "[LINE 3]"],
  description: "[Short description for card - ~100 chars]",
},
```

### 4. Update Blog.tsx Featured Articles

**File:** `src/pages/Blog.tsx`

Add new article card to the grid (follow existing pattern).

### 5. Update Sitemap

**File:** `public/sitemap.xml`

Add new URL entry:

```xml
<url>
  <loc>https://www.haste.nyc/blog/[post-slug]</loc>
  <lastmod>[YYYY-MM-DD]</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.8</priority>
</url>
```

### 6. Add Hero Image

- [ ] Save hero image to `src/assets/[post-name]-hero.jpg`
- [ ] Optimize image (compress, proper dimensions)
- [ ] Ensure image is at least 1200x630px for og:image

---

## Content Style Guidelines

### HASTE.NYC Voice
- Professional but accessible
- Forward-looking, innovation-focused
- Connect topics to creative production workflows
- Reference Conform Studio where relevant
- Bold, uppercase headlines with gradient text
- Technical accuracy without jargon overload

### Article Structure Template

```
1. HOOK (Hero Section)
   - Attention-grabbing headline
   - Timely news hook
   - Stakes/why it matters

2. CONTEXT
   - Background information
   - Industry context
   - Key players involved

3. ANALYSIS (2-3 sections)
   - Deep dive into specifics
   - Expert perspectives
   - Data/statistics where available

4. HASTE.NYC PERSPECTIVE
   - How this affects creative workflows
   - Conform Studio integration opportunities
   - Practical applications

5. CONCLUSION
   - Key takeaways
   - Future implications
   - Call to action (if appropriate)
```

### Formatting Rules
- Use sentence case for body text
- UPPERCASE for headlines and H2s
- Bold for emphasis and key terms
- Pull quotes for impactful statements
- Bullet points for lists/features
- Tables for comparisons/data

---

## Post-Publication Checklist

### Technical Verification
- [ ] Page loads without errors
- [ ] All images display correctly
- [ ] Internal links work
- [ ] Mobile responsive
- [ ] Meta tags render correctly (check view-source)

### SEO Verification
- [ ] Test og:image with Facebook Debugger (https://developers.facebook.com/tools/debug/)
- [ ] Test Twitter Card with Card Validator (https://cards-dev.twitter.com/validator)
- [ ] Verify sitemap updated at /sitemap.xml
- [ ] Submit URL to Google Search Console for indexing

### Analytics
- [ ] Verify GA4 tracking fires on new page
- [ ] Set up any custom events if needed

### Promotion
- [ ] Share on social media
- [ ] Update "Read Latest Article" button on /blog if this is newest
- [ ] Cross-link from relevant existing posts

---

## Example Prompt

```
Create a new blog post for haste.nyc:

**Topic:** Apple's new Final Cut Pro 11 with AI-powered features
**Beat:** AI/Creative Tools
**Target Keywords:** Final Cut Pro 11, AI video editing, Apple AI features
**News Hook:** Apple just announced FCP 11 with magnetic timeline AI
**Angle:** How this impacts post-production workflows and compares to Premiere/Resolve

**Writing Style:** Joanna Stern (WSJ) - hands-on product analysis with clear explanations

Complete the full checklist:
1. Create the blog post component with proper SEO
2. Add the route to App.tsx
3. Update RelatedArticles with the new post
4. Update Blog.tsx featured articles grid
5. Update sitemap.xml
6. Specify hero image requirements

Include internal links to:
- Adobe MAX 2025 article (AI creative tools comparison)
- Figma Schema article (workflow integration)
```

---

## Quick Reference: File Locations

| Purpose | File Path |
|---------|-----------|
| Blog post component | `src/pages/[Name]Post.tsx` |
| Routes | `src/App.tsx` |
| Related articles | `src/components/RelatedArticles.tsx` |
| Blog listing page | `src/pages/Blog.tsx` |
| Sitemap | `public/sitemap.xml` |
| SEO component | `src/components/SEO.tsx` |
| Hero images | `src/assets/` |
| Global meta tags | `index.html` |

---

## Journalist Style Quick Reference

| Beat | Primary Style | Backup Style |
|------|--------------|--------------|
| AI/Creative Tools | Joanna Stern | David Pogue |
| Big Tech/Platforms | Mike Isaac | Kara Swisher |
| Privacy/Security | Kashmir Hill | Kim Zetter |
| Design/Dev Tools | Technical blog | Molly Wood |
| Startups/Business | Erin Griffith | Shira Ovide |
| Entertainment/Media | Emily Chang | Mike Isaac |
| Social Media | Casey Newton | Mike Isaac |
