import { Link } from "react-router-dom";
import HasteASCIIFooter from "./HasteASCIIFooter";

const Footer = () => {
  return (
    <footer
      style={{
        background: '#000',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px 32px',
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

      {/* Social & Contact Links — single row with middot separators */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '0',
        marginTop: '24px'
      }}>
        {['E-MAIL', 'TELEPHONE', 'INSTAGRAM', 'YOUTUBE', 'TIKTOK', 'FACEBOOK', 'LINKEDIN', 'TWITTER'].map((link, i, arr) => (
          <span key={link} style={{ display: 'inline-flex', alignItems: 'center' }}>
            <a
              href="#"
              style={{
                color: 'rgba(255,255,255,0.5)',
                textDecoration: 'none',
                fontSize: '9px',
                letterSpacing: '0.15em',
                fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => (e.target as HTMLElement).style.color = '#fff'}
              onMouseLeave={(e) => (e.target as HTMLElement).style.color = 'rgba(255,255,255,0.5)'}
            >
              {link}
            </a>
            {i < arr.length - 1 && (
              <span style={{
                color: 'rgba(255,255,255,0.2)',
                margin: '0 10px',
                fontSize: '7px',
                userSelect: 'none'
              }}>&middot;</span>
            )}
          </span>
        ))}
      </div>

      {/* Navigation Links */}
      <nav style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '0',
        marginTop: '16px'
      }}>
        {[
          { label: 'Production Company', href: 'https://www.haste.studio', external: true },
          { label: 'Terms of Service', to: '/terms' },
          { label: 'Privacy Notice', to: '/privacy' },
          { label: 'Refund Policy', to: '/refund' },
          { label: 'Blog', to: '/blog' },
        ].map((item, i, arr) => (
          <span key={item.label} style={{ display: 'inline-flex', alignItems: 'center' }}>
            {item.external ? (
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: 'rgba(255,255,255,0.3)',
                  textDecoration: 'none',
                  fontSize: '9px',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
                  transition: 'color 0.2s ease'
                }}
                onMouseEnter={(e) => (e.target as HTMLElement).style.color = 'rgba(255,255,255,0.7)'}
                onMouseLeave={(e) => (e.target as HTMLElement).style.color = 'rgba(255,255,255,0.3)'}
              >
                {item.label}
              </a>
            ) : (
              <Link
                to={item.to!}
                style={{
                  color: 'rgba(255,255,255,0.3)',
                  textDecoration: 'none',
                  fontSize: '9px',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
                  transition: 'color 0.2s ease'
                }}
                onMouseEnter={(e) => (e.target as HTMLElement).style.color = 'rgba(255,255,255,0.7)'}
                onMouseLeave={(e) => (e.target as HTMLElement).style.color = 'rgba(255,255,255,0.3)'}
              >
                {item.label}
              </Link>
            )}
            {i < arr.length - 1 && (
              <span style={{
                color: 'rgba(255,255,255,0.15)',
                margin: '0 10px',
                fontSize: '7px',
                userSelect: 'none'
              }}>&middot;</span>
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
        &copy; 2026 HASTE.NYC
      </p>
    </footer>
  );
};

export default Footer;
