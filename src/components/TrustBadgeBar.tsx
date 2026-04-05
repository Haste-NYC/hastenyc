import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import nipcLogo from "@/assets/nipc-logo.png";
import wavelengthLogo from "@/assets/wavelength-logo.png";
import roastnpostLogo from "@/assets/roastnpost-logo.png";
import tabuLogo from "@/assets/tabu-logo.png";
import raremediumLogo from "@/assets/raremedium-logo.svg";
import dungeonbeachLogo from "@/assets/dungeonbeach-logo.png";
import niceshoesLogo from "@/assets/niceshoes-logo.png";
import panupLogo from "@/assets/panup-logo.png";

const RareMediumLogo = () => (
  <img src={raremediumLogo} alt="Rare Medium" className="h-7 sm:h-8 md:h-10 w-auto opacity-40" loading="eager" />
);

const DungeonBeachLogo = () => (
  <img src={dungeonbeachLogo} alt="Dungeon Beach" className="h-5 sm:h-6 md:h-7 w-auto brightness-0 invert opacity-40" loading="eager" />
);

const NiceShoesLogo = () => (
  <img src={niceshoesLogo} alt="Nice Shoes" className="h-8 sm:h-10 md:h-12 w-auto opacity-40" loading="eager" />
);

const TransientLogo = () => (
  <svg viewBox="0 0 130 30" className="h-6 sm:h-7 md:h-8 w-auto fill-current">
    <text x="0" y="22" fontSize="18" fontWeight="300" fontFamily="'Helvetica Neue', Helvetica, Arial, sans-serif" letterSpacing="4">TRANSIENT</text>
  </svg>
);

const TabuLogo = () => (
  <img src={tabuLogo} alt="Tabu Productions" className="h-4 sm:h-5 md:h-6 w-auto opacity-40" loading="eager" />
);

const WavelengthLogo = () => (
  <img src={wavelengthLogo} alt="Wavelength Productions" className="h-auto max-w-[100px] sm:max-w-[120px] md:max-w-[140px] opacity-40" loading="eager" />
);

const NIPCLogo = () => (
  <img src={nipcLogo} alt="New International Picture Company" className="h-auto max-w-[90px] sm:max-w-[110px] md:max-w-[130px] brightness-0 invert opacity-40" loading="eager" />
);

const RoastNPostLogo = () => (
  <img src={roastnpostLogo} alt="Roast N Post" className="h-10 sm:h-12 md:h-14 w-auto opacity-40" loading="eager" />
);

const PanUpLogo = () => (
  <img src={panupLogo} alt="Pan Up" className="h-auto max-w-[80px] sm:max-w-[90px] md:max-w-[110px] opacity-40" loading="eager" />
);

const partners = [
  { name: "Tabu Productions", Logo: TabuLogo },
  { name: "Rare Medium", Logo: RareMediumLogo },
  { name: "Dungeon Beach", Logo: DungeonBeachLogo },
  { name: "Wavelength Productions", Logo: WavelengthLogo },
  { name: "Roast N Post", Logo: RoastNPostLogo },
  { name: "New International Picture Company", Logo: NIPCLogo },
  { name: "Nice Shoes", Logo: NiceShoesLogo },
  { name: "Transient Pictures", Logo: TransientLogo },
  { name: "Pan Up", Logo: PanUpLogo },
];

const LogoSet = () => (
  <>
    {partners.map((partner) => (
      <div
        key={partner.name}
        className="flex-shrink-0 px-6 sm:px-8 md:px-12 flex items-center justify-center text-white/40 hover:text-white/60 transition-colors duration-300"
      >
        <partner.Logo />
      </div>
    ))}
  </>
);

const TrustBadgeBar = () => {
  const trackRef = useRef<HTMLDivElement>(null);
  const firstSetRef = useRef<HTMLDivElement>(null);
  const [scrollWidth, setScrollWidth] = useState<number | null>(null);

  useEffect(() => {
    const firstSet = firstSetRef.current;
    if (!firstSet) return;

    // Wait for all images inside to load before measuring
    const images = firstSet.querySelectorAll("img");
    let loaded = 0;
    const total = images.length;

    const measure = () => {
      setScrollWidth(firstSet.offsetWidth);
    };

    if (total === 0) {
      measure();
      return;
    }

    const onLoad = () => {
      loaded++;
      if (loaded >= total) measure();
    };

    images.forEach((img) => {
      if (img.complete) {
        loaded++;
      } else {
        img.addEventListener("load", onLoad);
        img.addEventListener("error", onLoad);
      }
    });

    if (loaded >= total) measure();

    return () => {
      images.forEach((img) => {
        img.removeEventListener("load", onLoad);
        img.removeEventListener("error", onLoad);
      });
    };
  }, []);

  return (
    <section className="py-6 sm:py-12 relative" style={{ background: 'transparent' }}>
      {/* Label */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center text-xs uppercase tracking-[0.25em] text-foreground/40 mb-8"
      >
        Built for Industry Leaders
      </motion.p>

      {/* Scrolling container */}
      <div
        className="relative w-full overflow-hidden"
        style={{
          maskImage: "linear-gradient(to right, transparent, black 128px, black calc(100% - 128px), transparent)",
          WebkitMaskImage: "linear-gradient(to right, transparent, black 128px, black calc(100% - 128px), transparent)",
        }}
      >
        <div
          ref={trackRef}
          className="flex w-max items-center"
          style={{
            willChange: "transform",
            backfaceVisibility: "hidden",
            animation: scrollWidth
              ? `trust-scroll ${30}s linear infinite`
              : "none",
            opacity: scrollWidth ? 1 : 0,
            // Use a custom property so the keyframes know the exact pixel offset
            ["--scroll-distance" as string]: scrollWidth ? `-${scrollWidth}px` : "0px",
          }}
        >
          <div ref={firstSetRef} className="flex items-center flex-shrink-0">
            <LogoSet />
          </div>
          <div className="flex items-center flex-shrink-0" aria-hidden="true">
            <LogoSet />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustBadgeBar;
