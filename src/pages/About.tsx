import Header from "@/components/Header";
import SEO from "@/components/SEO";
import AboutSection from "@/components/AboutSection";

const About = () => {
  return (
    <div className="min-h-screen bg-background select-none">
      <SEO
        title="About"
        description="Haste builds AI-powered automation tools for post-production professionals. Founded by editors, we're on a mission to eliminate tedious conform workflows."
        canonical="/about"
      />
      <Header />
      <main className="pt-32 pb-24">
        <AboutSection />
      </main>

    </div>
  );
};

export default About;
