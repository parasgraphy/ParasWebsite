"use client";

import { useEffect, useState, useRef } from "react";

export default function ContactPage() {
  const [loaded, setLoaded] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setTimeout(() => setLoaded(true), 100);
    const handleMouse = (e: MouseEvent) => {
      setMousePos({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  return (
    <div
      style={{
        background: "#1a1410",
        minHeight: "100vh",
        fontFamily: "Georgia, serif",
        paddingTop: "85px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* ── ANIMATED SVG BACKGROUND ── */}
      <svg
        style={{
          position: "fixed",
          inset: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
          pointerEvents: "none",
        }}
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <style>{`
            @keyframes rotate-slow {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
            @keyframes rotate-reverse {
              from { transform: rotate(360deg); }
              to { transform: rotate(0deg); }
            }
            @keyframes float-up {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-20px); }
            }
            @keyframes pulse-ring {
              0%, 100% { opacity: 0.03; }
              50% { opacity: 0.08; }
            }
            @keyframes draw-line {
              from { stroke-dashoffset: 1000; }
              to { stroke-dashoffset: 0; }
            }
            .ring-1 { transform-origin: 720px 450px; animation: rotate-slow 40s linear infinite; }
            .ring-2 { transform-origin: 720px 450px; animation: rotate-reverse 30s linear infinite; }
            .ring-3 { transform-origin: 720px 450px; animation: rotate-slow 60s linear infinite; }
            .float-1 { animation: float-up 6s ease-in-out infinite; }
            .float-2 { animation: float-up 8s ease-in-out infinite 2s; }
            .float-3 { animation: float-up 7s ease-in-out infinite 4s; }
            .pulse { animation: pulse-ring 4s ease-in-out infinite; }
            .line-draw { stroke-dasharray: 1000; animation: draw-line 3s ease forwards; }
          `}</style>
        </defs>

        {/* Large outer rings */}
        <g className="pulse">
          <circle
            cx="720"
            cy="450"
            r="600"
            fill="none"
            stroke="#c8b89a"
            strokeWidth="0.5"
            opacity="0.05"
          />
          <circle
            cx="720"
            cy="450"
            r="500"
            fill="none"
            stroke="#c8b89a"
            strokeWidth="0.5"
            opacity="0.05"
          />
          <circle
            cx="720"
            cy="450"
            r="400"
            fill="none"
            stroke="#c8b89a"
            strokeWidth="0.5"
            opacity="0.05"
          />
        </g>

        {/* Rotating ring with dashes */}
        <g className="ring-1">
          <circle
            cx="720"
            cy="450"
            r="350"
            fill="none"
            stroke="#c8b89a"
            strokeWidth="0.8"
            strokeDasharray="4 20"
            opacity="0.08"
          />
        </g>

        {/* Rotating ring reverse */}
        <g className="ring-2">
          <circle
            cx="720"
            cy="450"
            r="280"
            fill="none"
            stroke="#f0e8d8"
            strokeWidth="0.5"
            strokeDasharray="2 30"
            opacity="0.06"
          />
        </g>

        {/* Inner rotating ring */}
        <g className="ring-3">
          <circle
            cx="720"
            cy="450"
            r="200"
            fill="none"
            stroke="#c8b89a"
            strokeWidth="1"
            strokeDasharray="1 15"
            opacity="0.06"
          />
        </g>

        {/* Floating star marks */}
        <g className="float-1" style={{ transformOrigin: "200px 200px" }}>
          <text
            x="190"
            y="210"
            fill="#c8b89a"
            fontSize="20"
            opacity="0.08"
            fontFamily="Georgia, serif"
          >
            ✦
          </text>
        </g>
        <g className="float-2" style={{ transformOrigin: "1200px 300px" }}>
          <text
            x="1190"
            y="310"
            fill="#c8b89a"
            fontSize="14"
            opacity="0.08"
            fontFamily="Georgia, serif"
          >
            ✦
          </text>
        </g>
        <g className="float-3" style={{ transformOrigin: "400px 700px" }}>
          <text
            x="390"
            y="710"
            fill="#c8b89a"
            fontSize="10"
            opacity="0.06"
            fontFamily="Georgia, serif"
          >
            ✦
          </text>
        </g>

        {/* Diagonal lines */}
        <line
          x1="0"
          y1="0"
          x2="300"
          y2="900"
          stroke="#c8b89a"
          strokeWidth="0.5"
          opacity="0.04"
        />
        <line
          x1="1440"
          y1="0"
          x2="1140"
          y2="900"
          stroke="#c8b89a"
          strokeWidth="0.5"
          opacity="0.04"
        />
        <line
          x1="0"
          y1="450"
          x2="1440"
          y2="450"
          stroke="#c8b89a"
          strokeWidth="0.3"
          opacity="0.03"
        />
        <line
          x1="720"
          y1="0"
          x2="720"
          y2="900"
          stroke="#c8b89a"
          strokeWidth="0.3"
          opacity="0.03"
        />

        {/* Corner brackets */}
        <g opacity="0.08" stroke="#c8b89a" strokeWidth="1" fill="none">
          <polyline points="20,20 20,60 60,60" />
          <polyline points="1420,20 1420,60 1380,60" />
          <polyline points="20,880 20,840 60,840" />
          <polyline points="1420,880 1420,840 1380,840" />
        </g>
      </svg>

      {/* ── CONTENT ── */}
      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Hero */}
        <div
          style={{
            padding: "clamp(50px, 8vw, 100px) clamp(24px, 6vw, 80px)",
            borderBottom: "1px solid #2a2018",
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateY(0)" : "translateY(40px)",
            transition: "opacity 0.9s ease, transform 0.9s ease",
          }}
        >
          <p
            style={{
              fontSize: "10px",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "#6b5a42",
              marginBottom: "20px",
            }}
          >
            Get in touch
          </p>
          <h1
            style={{
              fontSize: "clamp(2.8rem, 8vw, 8rem)",
              fontWeight: 400,
              letterSpacing: "0.02em",
              lineHeight: 0.9,
              color: "#f0e8d8",
              textTransform: "uppercase",
              marginBottom: "32px",
            }}
          >
            Let's Work
            <br />
            Together
          </h1>
          <p
            style={{
              fontSize: "clamp(14px, 2vw, 17px)",
              lineHeight: 1.9,
              color: "#c8b89a",
              maxWidth: "480px",
            }}
          >
            Whether you're planning a wedding, a family session or welcoming a
            new baby — I'd love to hear from you.
          </p>
        </div>

        {/* Contact cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "0",
            borderBottom: "1px solid #2a2018",
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateY(0)" : "translateY(40px)",
            transition: "opacity 0.9s ease 0.15s, transform 0.9s ease 0.15s",
          }}
        >
          {[
            {
              label: "WhatsApp",
              value: "+61 424 744 569",
              sub: "Message anytime",
              href: "https://wa.me/61424744569",
              cta: "Send a message",
            },
            {
              label: "Based in",
              value: "Sydney, Australia",
              sub: "Available worldwide",
              href: undefined,
              cta: undefined,
            },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                padding: "clamp(32px, 5vw, 56px) clamp(24px, 5vw, 48px)",
                borderRight: "1px solid #2a2018",
                borderBottom: "1px solid #2a2018",
              }}
            >
              <p
                style={{
                  fontSize: "10px",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "#6b5a42",
                  marginBottom: "12px",
                }}
              >
                {item.label}
              </p>
              <p
                style={{
                  fontSize: "clamp(18px, 2.5vw, 24px)",
                  color: "#f0e8d8",
                  letterSpacing: "0.02em",
                  marginBottom: "8px",
                }}
              >
                {item.value}
              </p>
              <p
                style={{
                  fontSize: "12px",
                  color: "#3a2e20",
                  letterSpacing: "0.08em",
                  marginBottom: item.cta ? "24px" : "0",
                }}
              >
                {item.sub}
              </p>
              {item.cta && item.href && (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "14px 28px",
                    border: "1px solid #f0e8d8",
                    color: "#f0e8d8",
                    textDecoration: "none",
                    fontSize: "11px",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    transition: "background 0.3s, color 0.3s",
                    minHeight: "48px",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#f0e8d8";
                    e.currentTarget.style.color = "#1a1410";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "#f0e8d8";
                  }}
                >
                  {item.cta} →
                </a>
              )}
            </div>
          ))}
        </div>

        {/* Social links */}
        <div
          style={{
            padding: "clamp(40px, 6vw, 80px) clamp(24px, 6vw, 80px)",
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateY(0)" : "translateY(40px)",
            transition: "opacity 0.9s ease 0.3s, transform 0.9s ease 0.3s",
          }}
        >
          <p
            style={{
              fontSize: "10px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#6b5a42",
              marginBottom: "24px",
            }}
          >
            Follow along
          </p>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            {[
              {
                label: "Instagram",
                handle: "@parasgraphy",
                href: "https://www.instagram.com/parasgraphy/",
                icon: "IG",
                desc: "Behind the scenes & latest work",
              },
              {
                label: "Facebook",
                handle: "Paras Ranjit Photography",
                href: "https://www.facebook.com/share/1BNsJeauTY/?mibextid=wwXIfr",
                icon: "FB",
                desc: "Updates & client stories",
              },
              {
                label: "WhatsApp",
                handle: "+61 424 744 569",
                href: "https://wa.me/61424744569",
                icon: "WA",
                desc: "Quick enquiries welcome",
              },
            ].map((s, i) => (
              <a
                key={i}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "clamp(16px, 3vw, 24px)",
                  padding: "clamp(16px, 3vw, 24px) clamp(20px, 4vw, 32px)",
                  border: "1px solid #2a2018",
                  textDecoration: "none",
                  transition: "border-color 0.3s, background 0.3s",
                  minHeight: "72px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#c8b89a";
                  e.currentTarget.style.background = "rgba(200,184,154,0.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#2a2018";
                  e.currentTarget.style.background = "transparent";
                }}
              >
                {/* Icon box */}
                <div
                  style={{
                    width: "clamp(44px, 8vw, 56px)",
                    height: "clamp(44px, 8vw, 56px)",
                    border: "1px solid #2a2018",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "11px",
                    letterSpacing: "0.1em",
                    color: "#c8b89a",
                    flexShrink: 0,
                  }}
                >
                  {s.icon}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontSize: "10px",
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      color: "#6b5a42",
                      marginBottom: "4px",
                    }}
                  >
                    {s.label}
                  </p>
                  <p
                    style={{
                      fontSize: "clamp(14px, 2vw, 17px)",
                      color: "#f0e8d8",
                      letterSpacing: "0.02em",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {s.handle}
                  </p>
                  <p
                    style={{
                      fontSize: "11px",
                      color: "#3a2e20",
                      marginTop: "2px",
                    }}
                  >
                    {s.desc}
                  </p>
                </div>

                {/* Arrow */}
                <div
                  style={{
                    fontSize: "20px",
                    color: "#3a2e20",
                    flexShrink: 0,
                    transition: "color 0.3s, transform 0.3s",
                  }}
                >
                  →
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
