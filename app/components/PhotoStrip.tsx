"use client";

interface Photo {
  _id: string;
  url: string;
}

export default function PhotoStrip({ photos }: { photos: Photo[] }) {
  const rotations = [-3, 2, -1.5, 3, -2, 1, -2.5];
  const heights = [200, 240, 210, 260, 220, 230, 200];
  const widths = [140, 160, 130, 170, 150, 145, 135];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
        padding: "20px 48px",
        height: "280px",
      }}
    >
      {photos.map((photo, i) => (
        <div
          key={photo._id}
          style={{
            width: `${widths[i]}px`,
            height: `${heights[i]}px`,
            flexShrink: 0,
            transform: `rotate(${rotations[i]}deg)`,
            overflow: "hidden",
            borderRadius: "2px",
            transition: "transform 0.3s ease",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.transform = `rotate(0deg) scale(1.05)`)
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.transform = `rotate(${rotations[i]}deg)`)
          }
        >
          <img
            src={photo.url}
            alt=""
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        </div>
      ))}
    </div>
  );
}
