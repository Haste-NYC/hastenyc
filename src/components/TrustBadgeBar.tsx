import { motion } from "framer-motion";

// SVG logos styled like Frame.io's trust banner
const FoxSportsLogo = () => (
  <svg viewBox="0 0 120 50" className="h-7 sm:h-8 md:h-10 w-auto fill-current">
    <text x="5" y="20" fontSize="14" fontWeight="900" fontFamily="Arial, sans-serif" letterSpacing="-0.5">(FOX)</text>
    <text x="5" y="38" fontSize="12" fontWeight="700" fontFamily="Arial, sans-serif" letterSpacing="2">SPORTS</text>
  </svg>
);

const NatGeoLogo = () => (
  <svg viewBox="0 0 160 50" className="h-7 sm:h-8 md:h-10 w-auto fill-current">
    <rect x="0" y="5" width="30" height="40" fill="none" stroke="currentColor" strokeWidth="3"/>
    <text x="40" y="22" fontSize="11" fontWeight="400" fontFamily="Georgia, serif" letterSpacing="0.5">NATIONAL</text>
    <text x="40" y="35" fontSize="11" fontWeight="400" fontFamily="Georgia, serif" letterSpacing="0.5">GEOGRAPHIC</text>
    <text x="40" y="48" fontSize="9" fontWeight="400" fontFamily="Georgia, serif" letterSpacing="1">SOCIETY</text>
  </svg>
);

const MediaMonksLogo = () => (
  <svg viewBox="0 0 100 50" className="h-7 sm:h-8 md:h-10 w-auto fill-current">
    <text x="0" y="25" fontSize="16" fontWeight="800" fontFamily="Arial, sans-serif" letterSpacing="1">MEDIA</text>
    <text x="0" y="44" fontSize="16" fontWeight="800" fontFamily="Arial, sans-serif" letterSpacing="1">MONKS</text>
  </svg>
);

const TurnerLogo = () => (
  <svg viewBox="0 0 100 35" className="h-7 sm:h-8 md:h-10 w-auto fill-current">
    <text x="0" y="26" fontSize="22" fontWeight="400" fontFamily="Arial, sans-serif" fontStyle="italic" letterSpacing="1">Turner</text>
  </svg>
);

const MasterclassLogo = () => (
  <svg viewBox="0 0 40 50" className="h-7 sm:h-8 md:h-10 w-auto fill-current">
    <path d="M20 5 L35 15 L35 35 L20 45 L5 35 L5 15 Z" fill="none" stroke="currentColor" strokeWidth="2"/>
    <text x="13" y="30" fontSize="14" fontWeight="700" fontFamily="Arial, sans-serif">M</text>
  </svg>
);

const GoogleLogo = () => (
  <svg viewBox="0 0 90 35" className="h-7 sm:h-8 md:h-10 w-auto fill-current">
    <text x="0" y="26" fontSize="24" fontWeight="400" fontFamily="Product Sans, Arial, sans-serif">Google</text>
  </svg>
);

const NetflixLogo = () => (
  <svg viewBox="0 0 110 35" className="h-7 sm:h-8 md:h-10 w-auto fill-current">
    <text x="0" y="26" fontSize="20" fontWeight="700" fontFamily="Arial, sans-serif" letterSpacing="2">NETFLIX</text>
  </svg>
);

const BBCLogo = () => (
  <svg viewBox="0 0 80 35" className="h-7 sm:h-8 md:h-10 w-auto fill-current">
    <rect x="0" y="5" width="24" height="24" rx="2"/>
    <rect x="28" y="5" width="24" height="24" rx="2"/>
    <rect x="56" y="5" width="24" height="24" rx="2"/>
    <text x="6" y="22" fontSize="14" fontWeight="700" fill="black">B</text>
    <text x="34" y="22" fontSize="14" fontWeight="700" fill="black">B</text>
    <text x="62" y="22" fontSize="14" fontWeight="700" fill="black">C</text>
  </svg>
);

const partners = [
  { name: "Fox Sports", Logo: FoxSportsLogo },
  { name: "National Geographic", Logo: NatGeoLogo },
  { name: "Media Monks", Logo: MediaMonksLogo },
  { name: "Turner", Logo: TurnerLogo },
  { name: "Masterclass", Logo: MasterclassLogo },
  { name: "Google", Logo: GoogleLogo },
  { name: "Netflix", Logo: NetflixLogo },
  { name: "BBC", Logo: BBCLogo },
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
        Trusted by Industry Leaders
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
