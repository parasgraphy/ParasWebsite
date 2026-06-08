"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin") || pathname?.startsWith("/studio"))
    return null;

  return (
    <footer
      style={{
        background: "#0f0c09",
        borderTop: "1px solid #2a2018",
        padding: "clamp(32px, 6vw, 48px) clamp(20px, 5vw, 48px)",
        fontFamily: "Georgia, serif",
      }}
    >
      {/* Top section */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "clamp(32px, 5vw, 48px)",
          marginBottom: "clamp(32px, 5vw, 48px)",
        }}
      >
        {/* Brand */}
        <div>
          <span
            style={{
              fontSize: "24px",
              color: "#f0e8d8",
              display: "block",
              marginBottom: "16px",
            }}
          >
            ✦
          </span>
          <p
            style={{
              fontSize: "11px",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#6b5a42",
              lineHeight: 2,
            }}
          >
            Paras Ranjit Photography
            <br />
            Sydney, Australia
          </p>
        </div>

        {/* Navigation */}
        <div>
          <p
            style={{
              fontSize: "10px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#6b5a42",
              marginBottom: "20px",
            }}
          >
            Navigation
          </p>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            {[
              { label: "Home", href: "/" },
              { label: "Portfolio", href: "/gallery" },
              { label: "Gallery", href: "/gallery" },
              { label: "Contact", href: "/contact" },
            ].map((link) => (
              <Link
                key={link.label}
                href={link.href}
                style={{
                  color: "#c8b89a",
                  textDecoration: "none",
                  fontSize: "12px",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#f0e8d8")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#c8b89a")}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div>
          <p
            style={{
              fontSize: "10px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#6b5a42",
              marginBottom: "20px",
            }}
          >
            Contact
          </p>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            <a
              href="https://wa.me/61424744569"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "#c8b89a",
                textDecoration: "none",
                fontSize: "12px",
                letterSpacing: "0.05em",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#f0e8d8")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#c8b89a")}
            >
              WhatsApp
            </a>
            <a
              href="https://www.instagram.com/parasgraphy/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "#c8b89a",
                textDecoration: "none",
                fontSize: "12px",
                letterSpacing: "0.05em",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#f0e8d8")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#c8b89a")}
            >
              Instagram
            </a>
            <a
              href="https://www.facebook.com/share/1BNsJeauTY/?mibextid=wwXIfr"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "#c8b89a",
                textDecoration: "none",
                fontSize: "12px",
                letterSpacing: "0.05em",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#f0e8d8")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#c8b89a")}
            >
              Facebook
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        style={{
          borderTop: "1px solid #2a2018",
          paddingTop: "clamp(16px, 3vw, 24px)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <p
          style={{
            fontSize: "10px",
            letterSpacing: "0.1em",
            color: "#3a2e20",
            textTransform: "uppercase",
          }}
        >
          © {new Date().getFullYear()} Paras Ranjit Photography
        </p>
        <p
          style={{
            fontSize: "10px",
            letterSpacing: "0.1em",
            color: "#3a2e20",
            textTransform: "uppercase",
          }}
        >
          Sydney, Australia
        </p>
      </div>
    </footer>
  );
}
