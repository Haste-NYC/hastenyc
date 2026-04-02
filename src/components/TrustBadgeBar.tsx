import { motion } from "framer-motion";
import nipcLogo from "@/assets/nipc-logo.png";
import wavelengthLogo from "@/assets/wavelength-logo.png";
import roastnpostLogo from "@/assets/roastnpost-logo.png";
import tabuLogo from "@/assets/tabu-logo.png";
import raremediumLogo from "@/assets/raremedium-logo.svg";
import dungeonbeachLogo from "@/assets/dungeonbeach-logo.png";
import niceshoesLogo from "@/assets/niceshoes-logo.png";
import panupLogo from "@/assets/panup-logo.png";

// Shared classes for consistent logo sizing
const svgClass = "h-7 sm:h-8 md:h-10 w-auto fill-current";

const RareMediumLogo = () => (
  <img src={raremediumLogo} alt="Rare Medium" className="h-7 sm:h-8 md:h-10 w-auto opacity-40" />
);


const DungeonBeachLogo = () => (
  <img src={dungeonbeachLogo} alt="Dungeon Beach" className="h-5 sm:h-6 md:h-7 w-auto brightness-0 invert opacity-40" />
);

const NiceShoesLogo = () => (
  <img src={niceshoesLogo} alt="Nice Shoes" className="h-8 sm:h-10 md:h-12 w-auto opacity-40" />
);

const TransientLogo = () => (
  <svg viewBox="0 0 130 30" className="h-6 sm:h-7 md:h-8 w-auto fill-current">
    <text x="0" y="22" fontSize="18" fontWeight="300" fontFamily="'Helvetica Neue', Helvetica, Arial, sans-serif" letterSpacing="4">TRANSIENT</text>
  </svg>
);

// Image-based logos: brightness-0 invert turns dark logos white; opacity-40 matches SVG text-white/40
const imgClass = "h-7 sm:h-8 md:h-10 w-auto opacity-40";

const TabuLogo = () => (
  <img src={tabuLogo} alt="Tabu Productions" className="h-4 sm:h-5 md:h-6 w-auto opacity-40" />
);

const WavelengthLogo = () => (
  <img src={wavelengthLogo} alt="Wavelength Productions" className="h-auto max-w-[100px] sm:max-w-[120px] md:max-w-[140px] opacity-40" />
);

const NIPCLogo = () => (
  <img src={nipcLogo} alt="New International Picture Company" className="h-auto max-w-[90px] sm:max-w-[110px] md:max-w-[130px] brightness-0 invert opacity-40" />
);

const RoastNPostLogo = () => (
  <img src={roastnpostLogo} alt="Roast N Post" className="h-10 sm:h-12 md:h-14 w-auto opacity-40" />
);

const PanUpLogo = () => (
  <img src={panupLogo} alt="Pan Up" className="h-auto max-w-[80px] sm:max-w-[90px] md:max-w-[110px] opacity-40" />
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

const TrustBadgeBar = () => {
  // Quadruple partners so logos always fill the viewport, even on ultrawide screens
  const duplicatedPartners = [...partners, ...partners, ...partners, ...partners];

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
        Built for Leading Production Companies
      </motion.p>

      {/* Scrolling container */}
      <div
        className="relative w-full overflow-hidden"
        style={{
          maskImage: "linear-gradient(to right, transparent, black 128px, black calc(100% - 128px), transparent)",
          WebkitMaskImage: "linear-gradient(to right, transparent, black 128px, black calc(100% - 128px), transparent)",
        }}
      >
        {/* Scrolling logos - two sets for seamless loop */}
        <div className="flex animate-scroll-right-to-left items-center w-max">
          {duplicatedPartners.map((partner, index) => (
            <div
              key={`${partner.name}-${index}`}
              className="flex-shrink-0 px-6 sm:px-8 md:px-12 flex items-center justify-center text-white/40 hover:text-white/60 transition-colors duration-300"
            >
              <partner.Logo />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBadgeBar;
