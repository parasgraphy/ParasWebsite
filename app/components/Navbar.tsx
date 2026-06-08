"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  if (pathname?.startsWith("/admin") || pathname?.startsWith("/studio"))
    return null;

  return (
    <>
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "24px clamp(20px, 5vw, 48px)",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: "rgba(26, 20, 16, 0.95)",
          backdropFilter: "blur(8px)",
          borderBottom: "1px solid #2a2018",
        }}
      >
        {/* Desktop left links */}
        <div style={{ display: "flex", gap: "48px" }} className="desktop-nav">
          <Link
            href="/#about"
            style={{
              color: "#c8b89a",
              textDecoration: "none",
              fontSize: "11px",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}
          >
            About
          </Link>
          <Link
            href="/gallery"
            style={{
              color: pathname === "/gallery" ? "#f0e8d8" : "#c8b89a",
              textDecoration: "none",
              fontSize: "11px",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}
          >
            Portfolio
          </Link>
        </div>

        {/* Logo — always centred */}
        <Link
          href="/"
          style={{
            fontSize: "24px",
            color: "#f0e8d8",
            textDecoration: "none",
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          ✦
        </Link>

        {/* Desktop right links */}
        <div style={{ display: "flex", gap: "48px" }} className="desktop-nav">
          <Link
            href="/gallery"
            style={{
              color: "#c8b89a",
              textDecoration: "none",
              fontSize: "11px",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}
          >
            Gallery
          </Link>
          <Link
            href="/contact"
            style={{
              color: pathname === "/contact" ? "#f0e8d8" : "#c8b89a",
              textDecoration: "none",
              fontSize: "11px",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}
          >
            Contact
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="mobile-nav"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "4px",
            display: "flex",
            flexDirection: "column",
            gap: "5px",
            marginLeft: "auto",
          }}
          aria-label="Toggle menu"
        >
          <span
            style={{
              display: "block",
              width: "22px",
              height: "1px",
              background: menuOpen ? "transparent" : "#f0e8d8",
              transition: "all 0.3s",
            }}
          />
          <span
            style={{
              display: "block",
              width: "22px",
              height: "1px",
              background: "#f0e8d8",
              transition: "all 0.3s",
              transform: menuOpen
                ? "rotate(45deg) translate(4px, 4px)"
                : "none",
            }}
          />
          <span
            style={{
              display: "block",
              width: "22px",
              height: "1px",
              background: "#f0e8d8",
              transition: "all 0.3s",
              transform: menuOpen
                ? "rotate(-45deg) translate(4px, -4px)"
                : "none",
            }}
          />
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        className="mobile-nav"
        style={{
          position: "fixed",
          top: "73px",
          left: 0,
          right: 0,
          background: "rgba(15, 12, 9, 0.98)",
          zIndex: 99,
          borderBottom: "1px solid #2a2018",
          transform: menuOpen ? "translateY(0)" : "translateY(-100%)",
          opacity: menuOpen ? 1 : 0,
          transition: "transform 0.35s ease, opacity 0.35s ease",
          pointerEvents: menuOpen ? "all" : "none",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {[
          { label: "Home", href: "/" },
          { label: "About", href: "/#about" },
          { label: "Portfolio", href: "/gallery" },
          { label: "Gallery", href: "/gallery" },
          { label: "Contact", href: "/contact" },
        ].map((link, i) => (
          <Link
            key={i}
            href={link.href}
            onClick={() => setMenuOpen(false)}
            style={{
              display: "block",
              padding: "18px clamp(20px, 5vw, 48px)",
              color: "#c8b89a",
              textDecoration: "none",
              fontSize: "12px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              borderBottom: "1px solid #2a2018",
              transition: "color 0.2s",
            }}
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* CSS for show/hide */}
      <style>{`
        @media (min-width: 768px) {
          .mobile-nav { display: none !important; }
          .desktop-nav { display: flex !important; }
        }
        @media (max-width: 767px) {
          .mobile-nav { display: flex !important; }
          .desktop-nav { display: none !important; }
        }
      `}</style>
    </>
  );
}
