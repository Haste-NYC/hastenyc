import { Link } from "react-router-dom";
import HasteASCIIFooter from "./HasteASCIIFooter";

const Footer = () => {
  return (
    <footer
      id="contact"
      style={{
        background: 'transparent',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 20px 32px',
        overflow: 'hidden',
      }}
    >
      {/* ASCII Logo Animation */}
      <HasteASCIIFooter />

      {/* Tagline */}
      <p style={{
        color: 'rgba(255,255,255,0.45)',
        letterSpacing: '0.35em',
        fontSize: '10px',
        marginTop: '28px',
        textTransform: 'uppercase',
        fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
        fontWeight: 300
      }}>
        Software for Filmmakers
      </p>

      {/* Social & Contact Links */}
      <div className="flex flex-wrap justify-center items-center gap-x-2 gap-y-1.5 mt-6 px-4 max-w-sm sm:max-w-none sm:gap-x-0">
        {['E-MAIL', 'TELEPHONE', 'INSTAGRAM', 'YOUTUBE', 'TIKTOK', 'FACEBOOK', 'LINKEDIN', 'TWITTER'].map((link, i, arr) => (
          <span key={link} className="inline-flex items-center">
            <button
              type="button"
              className="text-white/50 hover:text-white no-underline transition-colors duration-200 bg-transparent border-none cursor-pointer p-0"
              style={{
                fontSize: '9px',
                letterSpacing: '0.15em',
                fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
              }}
            >
              {link}
            </button>
            {i < arr.length - 1 && (
              <span className="text-white/20 mx-2.5 text-[7px] select-none hidden sm:inline">&middot;</span>
            )}
          </span>
        ))}
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-wrap justify-center items-center gap-x-2 gap-y-1.5 mt-4 px-4 max-w-xs sm:max-w-none sm:gap-x-0">
        {[
          { label: 'Production Company', href: 'https://www.haste.studio', external: true },
          { label: 'Terms of Service', to: '/terms' },
          { label: 'Privacy Notice', to: '/privacy' },
          { label: 'Refund Policy', to: '/refund' },
          { label: 'Blog', to: '/blog' },
        ].map((item, i, arr) => (
          <span key={item.label} className="inline-flex items-center">
            {item.external ? (
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/30 hover:text-white/70 no-underline transition-colors duration-200 uppercase"
                style={{
                  fontSize: '9px',
                  letterSpacing: '0.12em',
                  fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
                }}
              >
                {item.label}
              </a>
            ) : (
              <Link
                to={item.to!}
                className="text-white/30 hover:text-white/70 no-underline transition-colors duration-200 uppercase"
                style={{
                  fontSize: '9px',
                  letterSpacing: '0.12em',
                  fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
                }}
              >
                {item.label}
              </Link>
            )}
            {i < arr.length - 1 && (
              <span className="text-white/15 mx-2.5 text-[7px] select-none hidden sm:inline">&middot;</span>
            )}
          </span>
        ))}
      </nav>

      {/* Copyright */}
      <p style={{
        color: 'rgba(255,255,255,0.2)',
        fontSize: '9px',
        marginTop: '20px',
        letterSpacing: '0.15em'
      }}>
        &copy; 2026 HASTE
      </p>
    </footer>
  );
};

export default Footer;
