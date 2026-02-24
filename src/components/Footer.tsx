import { Link } from "react-router-dom";
import HasteASCIIFooter from "./HasteASCIIFooter";

const Footer = ({ hideAsciiLogo = false }: { hideAsciiLogo?: boolean }) => {
  return (
    <footer
      id="contact"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 20px 32px',
        overflow: 'hidden',
      }}
    >
      {/* ASCII Logo Animation or static logo */}
      {!hideAsciiLogo ? <HasteASCIIFooter /> : (
        <svg
          className="h-6 w-auto mt-4"
          viewBox="0 0 89 33"
          fill="none"
        >
          <path d="M0 0V32.0003H7.56428V0H0Z" fill="white" />
          <path d="M13.5425 16.152V32.0003H21.0458V18.5808C21.0458 12.6908 16.5926 9.04752 9.82137 12.6301C9.82137 12.6301 13.5425 12.2658 13.5425 16.152Z" fill="white" />
          <path d="M33.3592 16.152V32.0003H40.8625V18.5808C40.8625 14.1481 36.7143 9.89762 29.211 11.5978C29.211 11.5978 33.3592 12.2658 33.3592 16.152Z" fill="white" />
          <path d="M22.4398 16.152C22.4398 18.2165 24.0868 19.856 26.1609 19.856C28.174 19.856 29.882 18.2165 29.882 16.152C29.882 14.1481 28.174 12.5087 26.1609 12.5087C24.0868 12.5087 22.4398 14.1481 22.4398 16.152Z" fill="white" />
          <path d="M23.1108 31.5145C24.3918 32.8504 26.4049 32.9111 28.174 32.5468C29.394 32.3039 30.9801 31.8181 31.9561 30.968C30.1261 31.3324 28.357 30.1787 27.869 28.4177C27.1369 25.6853 28.967 22.5277 30.4921 21.2526C29.394 21.2526 28.418 21.3133 27.381 21.6169C25.3679 22.2848 23.4158 23.4993 22.4398 25.3816C21.3417 27.264 21.5247 29.875 23.1108 31.5145Z" fill="white" />
          <path d="M52.3907 28.357C52.3907 30.0572 51.6587 31.636 50.1944 32.729C54.5868 32.729 58.3689 29.3893 58.3689 25.9281C58.3689 22.0818 55.2413 20.7057 52.2879 19.4063C49.6464 18.2441 47.1443 17.1432 47.1443 14.391C47.1443 13.1766 47.7543 12.2658 49.0353 11.2942C44.6432 11.2942 41.5931 14.6339 41.5931 17.4878C41.5931 21.0344 44.5827 22.3449 47.4157 23.5868C49.9667 24.7051 52.3907 25.7677 52.3907 28.357Z" fill="white" />
          <path d="M50.0114 14.4517C50.0114 16.152 51.4147 17.5486 53.1227 17.5486C54.8308 17.5486 56.1729 16.152 56.1729 14.4517C56.1729 12.7515 54.7698 11.3549 53.1227 11.3549C51.4147 11.3549 50.0114 12.7515 50.0114 14.4517Z" fill="white" />
          <path d="M41.349 28.6606C41.349 30.7252 43.0571 32.3646 45.0702 32.3646C47.1443 32.3646 48.7913 30.7252 48.7913 28.6606C48.7913 26.5961 47.1443 24.9566 45.0702 24.9566C43.0571 24.9566 41.349 26.5961 41.349 28.6606Z" fill="white" />
          <path d="M58.8745 25.3816C58.8745 31.2716 63.2666 34.9149 70.0989 31.3324C70.0989 31.3324 66.3777 31.6967 66.3777 27.8105V3.64329C65.4627 8.01525 62.2296 11.3549 58.8745 11.78V25.3816Z" fill="white" />
          <path d="M67.4774 21.9812C67.4774 27.932 72.3576 32.729 78.3358 32.729C80.2879 32.7897 82.1789 32.2432 83.826 31.2716C80.1049 32.1217 75.4077 30.3001 75.4077 26.171V21.0115H81.7674V21.0097H88.3402C88.3402 18.3987 87.1201 11.2335 78.6408 11.2335C80.0439 11.4157 81.5689 12.6908 81.5689 16.0912V20.4395H75.4077V14.4517C75.4077 12.6908 76.5057 11.4764 77.9698 11.2335C72.1136 11.4157 67.4774 16.152 67.4774 21.9812Z" fill="white" />
        </svg>
      )}

      {/* Tagline */}
      <p className="mt-6 sm:mt-8" style={{
        color: 'rgba(255,255,255,0.45)',
        letterSpacing: '0.35em',
        fontSize: '10px',
        textTransform: 'uppercase',
        fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
        fontWeight: 300
      }}>
        Software for Filmmakers
      </p>

      {/* Social & Contact Links */}
      <div className="flex flex-wrap justify-center items-center gap-x-2 gap-y-1.5 mt-6 sm:mt-8 px-4 max-w-sm sm:max-w-none sm:gap-x-0">
        {[
          { label: 'E-MAIL', href: 'mailto:info@haste.nyc' },
          { label: 'INSTAGRAM', href: 'https://instagram.com/haste.nyc' },
          { label: 'YOUTUBE', href: 'https://www.youtube.com/channel/UCXtE1RONg-_D5EUI9-sxB_g' },
          { label: 'TIKTOK', href: 'https://www.tiktok.com/@haste.nyc' },
          { label: 'FACEBOOK', href: 'https://facebook.com/313745985146389' },
          { label: 'LINKEDIN', href: 'https://linkedin.com/company/98756314' },
          { label: 'TWITTER', href: 'https://twitter.com/@haste_nyc' },
        ].map((link, i, arr) => (
          <span key={link.label} className="inline-flex items-center">
            <a
              href={link.href}
              target={link.href.startsWith('mailto:') || link.href.startsWith('tel:') ? undefined : '_blank'}
              rel={link.href.startsWith('mailto:') || link.href.startsWith('tel:') ? undefined : 'noopener noreferrer'}
              className="text-white/50 hover:text-white no-underline transition-colors duration-200"
              style={{
                fontSize: '9px',
                letterSpacing: '0.15em',
                fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
              }}
            >
              {link.label}
            </a>
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
        &copy; 2026 Haste NYC LLC
      </p>
    </footer>
  );
};

export default Footer;
