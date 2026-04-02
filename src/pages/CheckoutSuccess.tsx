import { useSearchParams } from "react-router-dom";

const LOGO_URL =
  "https://cdn.builder.io/api/v1/image/assets%2F25af603265884417b23b761757dff1ec%2F2c25ef9dc2684d0187030022dab8721e?format=webp&width=800";

const CheckoutSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  return (
    <div
      style={{
        margin: 0,
        padding: 0,
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', sans-serif",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "#000000",
        color: "#ffffff",
      }}
    >
      <div style={{ textAlign: "center", maxWidth: 320, width: "90%" }}>
        <img
          src={LOGO_URL}
          alt="Conform Studio"
          style={{ height: 14, width: "auto", opacity: 0.7, marginBottom: 48 }}
        />

        <p
          style={{
            fontSize: 13,
            color: "rgba(255,255,255,0.5)",
            marginBottom: 8,
          }}
        >
          Payment successful
        </p>

        <p
          style={{
            fontSize: 11,
            color: "rgba(255,255,255,0.2)",
            marginBottom: 16,
          }}
        >
          Your subscription is now active
        </p>

        <a
          href="/download"
          style={{
            fontSize: 11,
            color: "rgba(255,255,255,0.25)",
            background: "none",
            border: "none",
            fontFamily: "inherit",
            cursor: "pointer",
            textDecoration: "none",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.color = "rgba(255,255,255,0.4)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "rgba(255,255,255,0.25)")
          }
        >
          Download Conform Studio
        </a>

        {sessionId && (
          <p
            style={{
              fontSize: 10,
              color: "rgba(255,255,255,0.1)",
              marginTop: 48,
              fontFamily: "monospace",
            }}
          >
            {sessionId.slice(0, 24)}
          </p>
        )}
      </div>
    </div>
  );
};

export default CheckoutSuccess;
