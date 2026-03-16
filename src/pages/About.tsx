import Header from "@/components/Header";

import AboutSection from "@/components/AboutSection";

const About = () => {
  return (
    <div className="min-h-screen bg-background select-none">
      <Header minimal />
      <main className="pt-32 pb-24">
        <AboutSection />
      </main>

    </div>
  );
};

export default About;
