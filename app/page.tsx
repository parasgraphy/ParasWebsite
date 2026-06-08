"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import PhotoStrip from "./components/PhotoStrip";
import FeaturedSlider from "./components/FeaturedSlider";

interface Photo {
  _id: string;
  url: string;
}

interface HomepageSettings {
  heroPhotos: Photo[];
  portfolioPhotos: Photo[];
  weddingBanner: { url: string } | null;
  aboutPhoto: string | null;
}

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return { ref, inView };
}

function AnimatedSection({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const { ref, inView } = useInView();
  return (
    <div
      ref={ref}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(40px)",
        transition: `opacity 0.8s ease ${delay}s, transform 0.8s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

export default function HomePage() {
  const [settings, setSettings] = useState<HomepageSettings>({
    heroPhotos: [],
    portfolioPhotos: [],
    weddingBanner: null,
    aboutPhoto: null,
  });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/homepage")
      .then((res) => res.json())
      .then((data) => {
        setSettings({
          heroPhotos: data.heroPhotos || [],
          portfolioPhotos: data.portfolioPhotos || [],
          weddingBanner: data.weddingBanner || null,
          aboutPhoto: data.aboutPhoto || null,
        });
        setLoaded(true);
      });
  }, []);

  return (
    <div
      style={{
        background: "#1a1410",
        color: "#f0e8d8",
        fontFamily: "Georgia, serif",
        overflowX: "hidden",
        paddingTop: "75px",
      }}
    >
      {/* ── HERO ── */}
      <div
        style={{
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.8s ease",
        }}
      >
        <PhotoStrip photos={settings.heroPhotos} />
      </div>

      <div
        style={{ padding: "clamp(24px, 4vw, 32px) clamp(24px, 5vw, 48px) 0" }}
      >
        <AnimatedSection>
          <p
            style={{
              fontSize: "11px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#c8b89a",
              marginBottom: "16px",
            }}
          >
            Wedding & Portrait Photographer
          </p>
          <h1
            style={{
              fontSize: "clamp(3rem, 10vw, 9rem)",
              fontWeight: 400,
              letterSpacing: "0.03em",
              lineHeight: 0.9,
              color: "#f0e8d8",
              textTransform: "uppercase",
            }}
          >
            Paras Ranjit
          </h1>
        </AnimatedSection>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          padding:
            "clamp(20px, 4vw, 32px) clamp(24px, 5vw, 48px) clamp(40px, 8vw, 80px)",
          flexWrap: "wrap",
          gap: "24px",
        }}
      >
        <AnimatedSection delay={0.1}>
          <a
            href="#contact"
            style={{
              display: "inline-block",
              padding: "clamp(12px, 2vw, 14px) clamp(24px, 4vw, 40px)",
              border: "1px solid #f0e8d8",
              color: "#f0e8d8",
              textDecoration: "none",
              fontSize: "11px",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              transition: "all 0.3s",
              minHeight: "48px",
              display: "inline-flex",
              alignItems: "center",
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
            Book a Session
          </a>
        </AnimatedSection>
        <AnimatedSection delay={0.2}>
          <p
            style={{
              fontSize: "11px",
              letterSpacing: "0.1em",
              color: "#c8b89a",
              textTransform: "uppercase",
              textAlign: "right",
              maxWidth: "280px",
              lineHeight: 1.8,
            }}
          >
            Wedding, Portrait & Family
            <br />
            photography in an authentic,
            <br />
            sincere and aesthetic style.
          </p>
        </AnimatedSection>
      </div>

      {/* ── ABOUT ── */}
      <section
        id="about"
        style={{
          background: "#f0e8d8",
          color: "#1a1410",
          padding: "clamp(40px, 8vw, 80px) clamp(24px, 5vw, 48px)",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "clamp(32px, 6vw, 64px)",
            alignItems: "center",
          }}
        >
          <AnimatedSection>
            <p
              style={{
                fontSize: "11px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#6b5a42",
                marginBottom: "24px",
              }}
            >
              About me
            </p>
            <h2
              style={{
                fontSize: "clamp(2rem, 4vw, 3.5rem)",
                fontWeight: 400,
                letterSpacing: "0.02em",
                lineHeight: 1,
                textTransform: "uppercase",
                marginBottom: "32px",
                color: "#1a1410",
              }}
            >
              My name is
              <br />
              Paras Ranjit.
            </h2>
            <p
              style={{
                fontSize: "clamp(14px, 1.8vw, 15px)",
                lineHeight: 1.9,
                color: "#3a2e20",
                marginBottom: "16px",
                maxWidth: "480px",
              }}
            >
              I am a wedding and portrait photographer based in Sydney,
              Australia. I believe every moment has a story — my job is to
              capture it with honesty, warmth and artistry.
            </p>
            <p
              style={{
                fontSize: "clamp(14px, 1.8vw, 15px)",
                lineHeight: 1.9,
                color: "#3a2e20",
                marginBottom: "40px",
                maxWidth: "480px",
              }}
            >
              I work with couples, families and individuals who want photos that
              feel real — not staged. Come as you are.
            </p>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              {[
                { label: "IG", href: "https://www.instagram.com/parasgraphy/" },
                {
                  label: "FB",
                  href: "https://www.facebook.com/share/1BNsJeauTY/?mibextid=wwXIfr",
                },
                { label: "WA", href: "https://wa.me/61424744569" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    width: "48px",
                    height: "48px",
                    border: "1px solid #1a1410",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textDecoration: "none",
                    color: "#1a1410",
                    fontSize: "11px",
                    letterSpacing: "0.1em",
                    transition: "all 0.3s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#1a1410";
                    e.currentTarget.style.color = "#f0e8d8";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "#1a1410";
                  }}
                >
                  {s.label}
                </a>
              ))}
            </div>
          </AnimatedSection>

          {/* About photo */}
          <AnimatedSection delay={0.2}>
            {settings.aboutPhoto ? (
              <img
                src={settings.aboutPhoto}
                alt="Paras Ranjit"
                style={{
                  width: "100%",
                  aspectRatio: "3/4",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            ) : (
              <div
                style={{
                  aspectRatio: "3/4",
                  background: "#d4c9b5",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#6b5a42",
                  fontSize: "11px",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                }}
              >
                Upload photo in admin
              </div>
            )}
          </AnimatedSection>
        </div>
      </section>

      {/* ── PORTFOLIO PREVIEW ── */}
      <section
        id="portfolio"
        style={{
          background: "#1a1410",
          padding: "clamp(40px, 8vw, 80px) clamp(24px, 5vw, 48px)",
        }}
      >
        <AnimatedSection>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: "40px",
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            <div>
              <p
                style={{
                  fontSize: "11px",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "#c8b89a",
                  marginBottom: "12px",
                }}
              >
                Selected work
              </p>
              <h2
                style={{
                  fontSize: "clamp(2rem, 4vw, 3.5rem)",
                  fontWeight: 400,
                  letterSpacing: "0.02em",
                  textTransform: "uppercase",
                  color: "#f0e8d8",
                  lineHeight: 1,
                }}
              >
                Portfolio
              </h2>
            </div>
            <Link
              href="/gallery"
              style={{
                color: "#c8b89a",
                textDecoration: "none",
                fontSize: "11px",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                borderBottom: "1px solid #6b5a42",
                paddingBottom: "4px",
              }}
            >
              View all →
            </Link>
          </div>
        </AnimatedSection>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "12px",
          }}
        >
          {settings.portfolioPhotos.map((photo, i) => (
            <AnimatedSection key={photo._id} delay={i * 0.05}>
              <div style={{ overflow: "hidden" }}>
                <img
                  src={photo.url}
                  alt=""
                  style={{
                    width: "100%",
                    height: "clamp(200px, 25vw, 300px)",
                    objectFit: "cover",
                    display: "block",
                    transition: "transform 0.6s ease",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "scale(1.04)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                />
              </div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection delay={0.2}>
          <div style={{ textAlign: "center", marginTop: "48px" }}>
            <Link
              href="/gallery"
              style={{
                display: "inline-block",
                padding: "clamp(12px, 2vw, 14px) clamp(32px, 5vw, 48px)",
                border: "1px solid #c8b89a",
                color: "#c8b89a",
                textDecoration: "none",
                fontSize: "11px",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                transition: "all 0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#c8b89a";
                e.currentTarget.style.color = "#1a1410";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "#c8b89a";
              }}
            >
              View Full Gallery
            </Link>
          </div>
        </AnimatedSection>
      </section>

      {/* ── SERVICES ── */}
      <section
        style={{
          background: "#f0e8d8",
          color: "#1a1410",
          padding: "clamp(40px, 8vw, 80px) clamp(24px, 5vw, 48px)",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "clamp(32px, 6vw, 64px)",
            alignItems: "start",
          }}
        >
          <AnimatedSection>
            <p
              style={{
                fontSize: "11px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#6b5a42",
                marginBottom: "24px",
              }}
            >
              What I offer
            </p>
            <h2
              style={{
                fontSize: "clamp(2rem, 4vw, 3.5rem)",
                fontWeight: 400,
                letterSpacing: "0.02em",
                lineHeight: 1,
                textTransform: "uppercase",
                color: "#1a1410",
              }}
            >
              Shoot
              <br />
              Types
            </h2>
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            {[
              {
                title: "Wedding",
                desc: "Full day coverage of your most important moments — from preparation to celebration.",
              },
              {
                title: "Family",
                desc: "Natural, relaxed sessions that capture your family as you truly are.",
              },
              {
                title: "Newborn",
                desc: "Gentle, warm photography of your newest family member in their first days.",
              },
            ].map((service, i) => (
              <div
                key={i}
                style={{
                  borderTop: "1px solid #c8b89a",
                  padding: "clamp(16px, 3vw, 24px) 0",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "12px",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "clamp(16px, 2vw, 18px)",
                      fontWeight: 400,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "#1a1410",
                    }}
                  >
                    {service.title}
                  </h3>
                  <span style={{ fontSize: "20px", color: "#6b5a42" }}>→</span>
                </div>
                <p
                  style={{
                    fontSize: "clamp(13px, 1.5vw, 14px)",
                    lineHeight: 1.8,
                    color: "#3a2e20",
                  }}
                >
                  {service.desc}
                </p>
              </div>
            ))}
            <div style={{ borderTop: "1px solid #c8b89a" }} />
          </AnimatedSection>
        </div>
      </section>

      {/* ── WEDDING BANNER ── */}
      <section
        style={{
          position: "relative",
          height: "clamp(300px, 50vw, 600px)",
          background: "#2a1f15",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {settings.weddingBanner && (
          <img
            src={settings.weddingBanner.url}
            alt=""
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: 0.4,
            }}
          />
        )}
        <div
          style={{
            position: "relative",
            textAlign: "center",
            padding: "0 clamp(24px, 5vw, 48px)",
          }}
        >
          <AnimatedSection>
            <p
              style={{
                fontSize: "11px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#c8b89a",
                marginBottom: "24px",
              }}
            >
              Wedding photography
            </p>
            <h2
              style={{
                fontSize: "clamp(1.8rem, 4vw, 4rem)",
                fontWeight: 400,
                letterSpacing: "0.03em",
                lineHeight: 1.1,
                color: "#f0e8d8",
                textTransform: "uppercase",
                marginBottom: "32px",
                maxWidth: "700px",
              }}
            >
              What matters is not the frames — but the feelings
            </h2>
            <Link
              href="/gallery"
              style={{
                display: "inline-block",
                padding: "clamp(12px, 2vw, 14px) clamp(24px, 4vw, 40px)",
                border: "1px solid #f0e8d8",
                color: "#f0e8d8",
                textDecoration: "none",
                fontSize: "11px",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
              }}
            >
              View Wedding Gallery
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* ── STATS ── */}
      <section
        style={{
          background: "#0f0c09",
          padding: "clamp(32px, 5vw, 48px) clamp(24px, 5vw, 48px)",
          borderTop: "1px solid #2a2018",
          borderBottom: "1px solid #2a2018",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: "clamp(24px, 4vw, 32px)",
            textAlign: "center",
          }}
        >
          {[
            { number: "5+", label: "Years experience" },
            { number: "120+", label: "Weddings shot" },
            { number: "300+", label: "Happy clients" },
            { number: "15k+", label: "Photos delivered" },
          ].map((stat, i) => (
            <AnimatedSection key={i} delay={i * 0.1}>
              <p
                style={{
                  fontSize: "clamp(2rem, 4vw, 3rem)",
                  fontWeight: 400,
                  color: "#f0e8d8",
                  letterSpacing: "0.05em",
                  marginBottom: "8px",
                }}
              >
                {stat.number}
              </p>
              <p
                style={{
                  fontSize: "10px",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "#6b5a42",
                }}
              >
                {stat.label}
              </p>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* ── FEATURED SLIDER ── */}
      <FeaturedSlider photos={settings.portfolioPhotos} />

      {/* ── REVIEWS ── */}
      <section
        style={{
          background: "#f0e8d8",
          padding: "clamp(40px, 8vw, 80px) clamp(24px, 5vw, 48px)",
        }}
      >
        <AnimatedSection>
          <div
            style={{
              textAlign: "center",
              marginBottom: "clamp(32px, 5vw, 56px)",
            }}
          >
            <p
              style={{
                fontSize: "11px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#6b5a42",
                marginBottom: "16px",
              }}
            >
              Kind words
            </p>
            <h2
              style={{
                fontSize: "clamp(2rem, 4vw, 3.5rem)",
                fontWeight: 400,
                letterSpacing: "0.02em",
                textTransform: "uppercase",
                color: "#1a1410",
                lineHeight: 1,
              }}
            >
              Client Reviews
            </h2>
          </div>
        </AnimatedSection>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "clamp(16px, 3vw, 32px)",
          }}
        >
          {[
            {
              name: "Sarah & James",
              type: "Wedding",
              text: "Paras captured our day perfectly. Every photo tells a story — we cry happy tears every time we look at them.",
            },
            {
              name: "The Mitchell Family",
              type: "Family",
              text: "We were nervous about family photos but Paras made it so easy and fun. The kids were themselves and the photos are magical.",
            },
            {
              name: "Emily R.",
              type: "Newborn",
              text: "The most beautiful photos of our baby girl. So gentle, so warm. We will treasure these forever.",
            },
          ].map((review, i) => (
            <AnimatedSection key={i} delay={i * 0.1}>
              <div
                style={{
                  background: "#e8dece",
                  padding: "clamp(20px, 4vw, 32px)",
                  borderRadius: "2px",
                }}
              >
                <div
                  style={{ display: "flex", gap: "4px", marginBottom: "20px" }}
                >
                  {[...Array(5)].map((_, s) => (
                    <span
                      key={s}
                      style={{ color: "#c8a870", fontSize: "14px" }}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <p
                  style={{
                    fontSize: "clamp(13px, 1.8vw, 15px)",
                    lineHeight: 1.9,
                    color: "#3a2e20",
                    marginBottom: "24px",
                    fontStyle: "italic",
                  }}
                >
                  "{review.text}"
                </p>
                <p
                  style={{
                    fontSize: "12px",
                    fontWeight: 400,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "#1a1410",
                  }}
                >
                  {review.name}
                </p>
                <p
                  style={{
                    fontSize: "11px",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: "#6b5a42",
                    marginTop: "4px",
                  }}
                >
                  {review.type} session
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section
        id="contact"
        style={{
          background: "#0f0c09",
          padding: "clamp(40px, 8vw, 80px) clamp(24px, 5vw, 48px)",
          textAlign: "center",
        }}
      >
        <AnimatedSection>
          <p
            style={{
              fontSize: "11px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#6b5a42",
              marginBottom: "24px",
            }}
          >
            Get in touch
          </p>
          <h2
            style={{
              fontSize: "clamp(2.5rem, 6vw, 6rem)",
              fontWeight: 400,
              letterSpacing: "0.03em",
              lineHeight: 0.9,
              color: "#f0e8d8",
              textTransform: "uppercase",
              marginBottom: "48px",
            }}
          >
            Let's Work
            <br />
            Together
          </h2>
          <div
            style={{
              width: "40px",
              height: "1px",
              background: "#6b5a42",
              margin: "0 auto 48px",
            }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "clamp(24px, 5vw, 64px)",
              flexWrap: "wrap",
            }}
          >
            {[
              {
                label: "WhatsApp",
                value: "+61 424 744 569",
                href: "https://wa.me/61424744569",
              },
              {
                label: "Instagram",
                value: "@parasgraphy",
                href: "https://www.instagram.com/parasgraphy/",
              },
              {
                label: "Facebook",
                value: "Paras Ranjit Photography",
                href: "https://www.facebook.com/share/1BNsJeauTY/?mibextid=wwXIfr",
              },
            ].map((item, i) => (
              <div key={i}>
                <p
                  style={{
                    fontSize: "10px",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "#6b5a42",
                    marginBottom: "8px",
                  }}
                >
                  {item.label}
                </p>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "#f0e8d8",
                    textDecoration: "none",
                    fontSize: "clamp(14px, 2vw, 18px)",
                    letterSpacing: "0.05em",
                    transition: "color 0.3s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#c8b89a")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "#f0e8d8")
                  }
                >
                  {item.value}
                </a>
              </div>
            ))}
          </div>
          <p
            style={{
              marginTop: "64px",
              fontSize: "11px",
              letterSpacing: "0.1em",
              color: "#6b5a42",
              textTransform: "uppercase",
              lineHeight: 2,
            }}
          >
            Based in Sydney, Australia — Available for travel worldwide
          </p>
          <p
            style={{
              marginTop: "24px",
              fontSize: "10px",
              letterSpacing: "0.1em",
              color: "#3a2e20",
              textTransform: "uppercase",
            }}
          >
            © {new Date().getFullYear()} Paras Ranjit Photography
          </p>
        </AnimatedSection>
      </section>
    </div>
  );
}
