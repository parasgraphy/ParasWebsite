"use client";

import { useState, useEffect, useRef } from "react";

interface Album {
  _id: string;
  title: string;
  category: string;
}

interface Photo {
  _id: string;
  url: string;
  albumId: string;
}

interface Props {
  albums: Album[];
  photos: Photo[];
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

function PhotoScroller({
  photos,
  scheme,
  isLight,
  onPhotoClick,
}: {
  photos: Photo[];
  scheme: { bg: string; text: string; muted: string; border: string };
  isLight: boolean;
  onPhotoClick: (index: number) => void;
}) {
  const [offset, setOffset] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const [visible, setVisible] = useState(3);

  useEffect(() => {
    const update = () =>
      setVisible(window.innerWidth < 640 ? 1 : window.innerWidth < 900 ? 2 : 3);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const canPrev = offset > 0;
  const canNext = offset + visible < photos.length;

  function go(dir: "left" | "right") {
    if (animating) return;
    setDirection(dir);
    setAnimating(true);
    setTimeout(() => {
      setOffset((o) =>
        dir === "right"
          ? Math.min(photos.length - visible, o + visible)
          : Math.max(0, o - visible),
      );
      setAnimating(false);
    }, 350);
  }

  return (
    <div>
      <div style={{ overflow: "hidden" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${visible}, 1fr)`,
            gap: "10px",
            opacity: animating ? 0 : 1,
            transform: animating
              ? `translateX(${direction === "right" ? "-20px" : "20px"})`
              : "translateX(0)",
            transition: "opacity 0.35s ease, transform 0.35s ease",
          }}
        >
          {photos.slice(offset, offset + visible).map((photo, i) => (
            <PhotoCard
              key={photo._id}
              photo={photo}
              index={offset + i}
              isLight={isLight}
              onPhotoClick={onPhotoClick}
              delay={i * 0.08}
            />
          ))}
        </div>
      </div>

      {/* Controls */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "20px",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <p
          style={{
            fontSize: "11px",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: scheme.muted,
          }}
        >
          {offset + 1}–{Math.min(offset + visible, photos.length)} of{" "}
          {photos.length}
        </p>

        {/* Dots */}
        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
          {Array.from({ length: Math.ceil(photos.length / visible) }).map(
            (_, i) => (
              <div
                key={i}
                onClick={() => {
                  setDirection(i * visible > offset ? "right" : "left");
                  setOffset(i * visible);
                }}
                style={{
                  width: i === Math.floor(offset / visible) ? "20px" : "6px",
                  height: "6px",
                  borderRadius: "3px",
                  background:
                    i === Math.floor(offset / visible)
                      ? scheme.text
                      : scheme.border,
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
              />
            ),
          )}
        </div>

        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={() => go("left")}
            disabled={!canPrev}
            style={{
              width: "44px",
              height: "44px",
              background: "none",
              border: `1px solid ${canPrev ? scheme.text : scheme.border}`,
              color: canPrev ? scheme.text : scheme.muted,
              fontSize: "18px",
              cursor: canPrev ? "pointer" : "default",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: canPrev ? 1 : 0.3,
              transition: "all 0.2s",
            }}
          >
            ←
          </button>
          <button
            onClick={() => go("right")}
            disabled={!canNext}
            style={{
              width: "44px",
              height: "44px",
              background: "none",
              border: `1px solid ${canNext ? scheme.text : scheme.border}`,
              color: canNext ? scheme.text : scheme.muted,
              fontSize: "18px",
              cursor: canNext ? "pointer" : "default",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: canNext ? 1 : 0.3,
              transition: "all 0.2s",
            }}
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}

function PhotoCard({
  photo,
  index,
  isLight,
  onPhotoClick,
  delay,
}: {
  photo: Photo;
  index: number;
  isLight: boolean;
  onPhotoClick: (index: number) => void;
  delay: number;
}) {
  const [hovered, setHovered] = useState(false);
  const { ref, inView } = useInView(0.1);

  return (
    <div
      ref={ref}
      onClick={() => onPhotoClick(index)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        cursor: "zoom-in",
        position: "relative",
        overflow: "hidden",
        height: "clamp(260px, 50vw, 340px)",
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(30px)",
        transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`,
      }}
    >
      <img
        src={photo.url}
        alt=""
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
          transform: hovered ? "scale(1.06)" : "scale(1)",
          transition: "transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          objectPosition: "top center",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: isLight ? "rgba(26,20,16,0.25)" : "rgba(26,20,16,0.4)",
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.4s ease",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: "44px",
            height: "44px",
            border: "1px solid #f0e8d8",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "22px",
            color: "#f0e8d8",
            transform: hovered
              ? "scale(1) rotate(0deg)"
              : "scale(0.6) rotate(-45deg)",
            transition: "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        >
          +
        </div>
      </div>
    </div>
  );
}

export default function GalleryClient({ albums, photos }: Props) {
  const [lightbox, setLightbox] = useState<{
    albumId: string;
    index: number;
  } | null>(null);
  const [lightboxAnimating, setLightboxAnimating] = useState(false);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!lightbox) return;
      const filtered = photos.filter((p) => p.albumId === lightbox.albumId);
      if (e.key === "ArrowRight") navigateLightbox("next");
      if (e.key === "ArrowLeft") navigateLightbox("prev");
      if (e.key === "Escape") setLightbox(null);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightbox, photos]);

  function navigateLightbox(dir: "next" | "prev") {
    if (!lightbox || lightboxAnimating) return;
    const filtered = photos.filter((p) => p.albumId === lightbox.albumId);
    setLightboxAnimating(true);
    setTimeout(() => {
      setLightbox({
        ...lightbox,
        index:
          dir === "next"
            ? lightbox.index === filtered.length - 1
              ? 0
              : lightbox.index + 1
            : lightbox.index === 0
              ? filtered.length - 1
              : lightbox.index - 1,
      });
      setLightboxAnimating(false);
    }, 250);
  }

  const backgrounds = [
    { bg: "#f0e8d8", text: "#1a1410", muted: "#6b5a42", border: "#d4c9b5" },
    { bg: "#1a1410", text: "#f0e8d8", muted: "#6b5a42", border: "#2a2018" },
    { bg: "#e8dece", text: "#1a1410", muted: "#6b5a42", border: "#c8b89a" },
    { bg: "#0f0c09", text: "#f0e8d8", muted: "#6b5a42", border: "#2a2018" },
  ];

  return (
    <div style={{ fontFamily: "Georgia, serif", paddingTop: "70px" }}>
      {/* ── PAGE HEADER ── */}
      <div
        style={{
          background: "#1a1410",
          padding:
            "clamp(40px, 8vw, 80px) clamp(20px, 5vw, 48px) clamp(32px, 6vw, 56px)",
          borderBottom: "1px solid #2a2018",
        }}
      >
        <AnimatedSection>
          <p
            style={{
              fontSize: "10px",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "#6b5a42",
              marginBottom: "16px",
            }}
          >
            Portfolio
          </p>
          <h1
            style={{
              fontSize: "clamp(2.5rem, 7vw, 7rem)",
              fontWeight: 400,
              letterSpacing: "0.03em",
              lineHeight: 0.9,
              color: "#f0e8d8",
              textTransform: "uppercase",
            }}
          >
            The Work
          </h1>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <div
            style={{
              display: "flex",
              gap: "clamp(16px, 3vw, 32px)",
              marginTop: "40px",
              flexWrap: "wrap",
            }}
          >
            {albums.map((album) => (
              <a
                key={album._id}
                href={`#${album._id}`}
                style={{
                  fontSize: "11px",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "#c8b89a",
                  textDecoration: "none",
                  borderBottom: "1px solid #3a2e20",
                  paddingBottom: "4px",
                  transition: "color 0.3s, border-color 0.3s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#f0e8d8";
                  e.currentTarget.style.borderColor = "#f0e8d8";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#c8b89a";
                  e.currentTarget.style.borderColor = "#3a2e20";
                }}
              >
                {album.title} →
              </a>
            ))}
          </div>
        </AnimatedSection>
      </div>

      {/* ── ALBUM SECTIONS ── */}
      {albums.map((album, albumIndex) => {
        const scheme = backgrounds[albumIndex % backgrounds.length];
        const filtered = photos.filter((p) => p.albumId === album._id);
        const isLight = scheme.bg === "#f0e8d8" || scheme.bg === "#e8dece";

        return (
          <section
            key={album._id}
            id={album._id}
            style={{
              background: scheme.bg,
              padding: "clamp(40px, 8vw, 80px) clamp(20px, 5vw, 48px)",
              borderBottom: `1px solid ${scheme.border}`,
            }}
          >
            <AnimatedSection>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                  marginBottom: "32px",
                  flexWrap: "wrap",
                  gap: "16px",
                }}
              >
                <div>
                  <p
                    style={{
                      fontSize: "10px",
                      letterSpacing: "0.25em",
                      textTransform: "uppercase",
                      color: scheme.muted,
                      marginBottom: "12px",
                    }}
                  >
                    {String(albumIndex + 1).padStart(2, "0")}
                  </p>
                  <h2
                    style={{
                      fontSize: "clamp(2rem, 5vw, 5rem)",
                      fontWeight: 400,
                      letterSpacing: "0.03em",
                      lineHeight: 0.9,
                      color: scheme.text,
                      textTransform: "uppercase",
                    }}
                  >
                    {album.title}
                  </h2>
                </div>
                <p
                  style={{
                    fontSize: "11px",
                    letterSpacing: "0.15em",
                    color: scheme.muted,
                    textTransform: "uppercase",
                  }}
                >
                  {filtered.length} {filtered.length === 1 ? "photo" : "photos"}
                </p>
              </div>
              <div
                style={{
                  width: "100%",
                  height: "1px",
                  background: scheme.border,
                  marginBottom: "40px",
                }}
              />
            </AnimatedSection>

            {filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 0" }}>
                <p
                  style={{
                    fontSize: "11px",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: scheme.muted,
                  }}
                >
                  No photos yet
                </p>
              </div>
            ) : (
              <PhotoScroller
                photos={filtered}
                scheme={scheme}
                isLight={isLight}
                onPhotoClick={(index) =>
                  setLightbox({ albumId: album._id, index })
                }
              />
            )}
          </section>
        );
      })}

      {/* ── LIGHTBOX ── */}
      {lightbox !== null &&
        (() => {
          const filtered = photos.filter((p) => p.albumId === lightbox.albumId);
          const current = filtered[lightbox.index];
          if (!current) return null;
          return (
            <div
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(10,8,6,0.97)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000,
                padding: "clamp(16px, 4vw, 40px)",
              }}
              onClick={() => setLightbox(null)}
            >
              <img
                src={current.url}
                alt=""
                style={{
                  maxWidth: "90vw",
                  maxHeight: "88vh",
                  objectFit: "contain",
                  display: "block",
                  opacity: lightboxAnimating ? 0 : 1,
                  transform: lightboxAnimating ? "scale(0.96)" : "scale(1)",
                  transition: "opacity 0.25s ease, transform 0.25s ease",
                }}
                onClick={(e) => e.stopPropagation()}
              />

              <button
                onClick={() => setLightbox(null)}
                style={{
                  position: "fixed",
                  top: "16px",
                  right: "16px",
                  background: "rgba(26,20,16,0.8)",
                  border: "1px solid #2a2018",
                  color: "#f0e8d8",
                  width: "40px",
                  height: "40px",
                  fontSize: "18px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                ✕
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigateLightbox("prev");
                }}
                style={{
                  position: "fixed",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "rgba(26,20,16,0.8)",
                  border: "1px solid #2a2018",
                  color: "#f0e8d8",
                  width: "44px",
                  height: "44px",
                  fontSize: "20px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                ←
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigateLightbox("next");
                }}
                style={{
                  position: "fixed",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "rgba(26,20,16,0.8)",
                  border: "1px solid #2a2018",
                  color: "#f0e8d8",
                  width: "44px",
                  height: "44px",
                  fontSize: "20px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                →
              </button>

              <div
                style={{
                  position: "fixed",
                  bottom: "20px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  fontSize: "11px",
                  letterSpacing: "0.2em",
                  color: "#6b5a42",
                  textTransform: "uppercase",
                }}
              >
                {String(lightbox.index + 1).padStart(2, "0")} /{" "}
                {String(filtered.length).padStart(2, "0")}
              </div>
            </div>
          );
        })()}
    </div>
  );
}
