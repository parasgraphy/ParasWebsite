"use client";

import { useState } from "react";

interface Photo {
  _id: string;
  url: string;
}

export default function FeaturedSlider({ photos }: { photos: Photo[] }) {
  const [current, setCurrent] = useState(0);

  if (!photos.length) return null;

  const prev = () => setCurrent((i) => (i === 0 ? photos.length - 1 : i - 1));
  const next = () => setCurrent((i) => (i === photos.length - 1 ? 0 : i + 1));

  return (
    <section
      style={{
        background: "#1a1410",
        padding: "80px 48px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: "40px",
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
            Featured
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
            Selected Work
          </h2>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={prev}
            style={{
              width: "48px",
              height: "48px",
              background: "none",
              border: "1px solid #6b5a42",
              color: "#f0e8d8",
              fontSize: "18px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ←
          </button>
          <button
            onClick={next}
            style={{
              width: "48px",
              height: "48px",
              background: "none",
              border: "1px solid #6b5a42",
              color: "#f0e8d8",
              fontSize: "18px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            →
          </button>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "12px",
          height: "420px",
        }}
      >
        {/* Main large photo */}
        <div style={{ overflow: "hidden", height: "420px" }}>
          <img
            src={photos[current].url}
            alt=""
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
              transition: "opacity 0.4s",
            }}
          />
        </div>
        {/* Two smaller photos */}
        <div
          style={{
            display: "grid",
            gridTemplateRows: "1fr 1fr",
            gap: "12px",
            height: "420px",
          }}
        >
          {[1, 2].map((offset) => {
            const idx = (current + offset) % photos.length;
            return (
              <div key={offset} style={{ overflow: "hidden" }}>
                <img
                  src={photos[idx].url}
                  alt=""
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Counter */}
      <div style={{ textAlign: "right", marginTop: "16px" }}>
        <span
          style={{ fontSize: "11px", letterSpacing: "0.2em", color: "#6b5a42" }}
        >
          {String(current + 1).padStart(2, "0")} /{" "}
          {String(photos.length).padStart(2, "0")}
        </span>
      </div>
    </section>
    
  );
}
