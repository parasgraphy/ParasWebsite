"use client";

import { useState, useEffect, useRef } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import Link from "next/link";

interface Album {
  _id: string;
  title: string;
  category: string;
}

interface Photo {
  _id: string;
  image: { url: string };
  visible: boolean;
  order: number;
  album: { _ref: string };
}

type ActiveSection = "gallery" | "albums" | "upload" | "homepage";

const C = {
  bg: "#0f0c09",
  surface: "#1a1410",
  surface2: "#231c15",
  border: "#2a2018",
  border2: "#3a2e20",
  cream: "#f0e8d8",
  creamMuted: "rgba(240,232,216,0.5)",
  creamFaint: "rgba(240,232,216,0.15)",
  creamGhost: "rgba(240,232,216,0.07)",
  gold: "#c8b89a",
  goldMuted: "#6b5a42",
  goldFaint: "#3a2e20",
  green: "#4a7c59",
  greenBg: "#1a2e20",
  greenText: "#6ab86a",
  red: "#7c3a3a",
  redBg: "#2e1a1a",
  redText: "#e06060",
};

export default function AdminPage() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [newAlbumTitle, setNewAlbumTitle] = useState("");
  const [newAlbumCategory, setNewAlbumCategory] = useState("wedding");
  const [showNewAlbum, setShowNewAlbum] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [activeSection, setActiveSection] = useState<ActiveSection>("gallery");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const aboutPhotoInputRef = useRef<HTMLInputElement>(null);
  const [homepageSettings, setHomepageSettings] = useState<{
    heroPhotos: string[];
    portfolioPhotos: string[];
    weddingBanner: string;
    aboutPhotoUrl: string;
  }>({
    heroPhotos: [],
    portfolioPhotos: [],
    weddingBanner: "",
    aboutPhotoUrl: "",
  });
  const [allPhotos, setAllPhotos] = useState<Photo[]>([]);
  const [savingHomepage, setSavingHomepage] = useState(false);
  const [uploadingAbout, setUploadingAbout] = useState(false);

  useEffect(() => {
    fetchAlbums();
    fetchAllPhotos();
    fetchHomepageSettings();
  }, []);
  useEffect(() => {
    if (selectedAlbum) fetchPhotos(selectedAlbum);
  }, [selectedAlbum]);

  async function fetchAlbums() {
    const res = await fetch("/api/albums");
    const data = await res.json();
    setAlbums(data);
    if (data.length > 0) setSelectedAlbum(data[0]._id);
    setLoading(false);
  }

  async function fetchPhotos(albumId: string) {
    const res = await fetch(`/api/photos?albumId=${albumId}`);
    const data = await res.json();
    setPhotos(data);
  }
  async function fetchAllPhotos() {
    const res = await fetch("/api/photos/featured?limit=100");
    const data = await res.json();
    setAllPhotos(data);
  }

  async function fetchHomepageSettings() {
    const res = await fetch("/api/homepage");
    const data = await res.json();
    setHomepageSettings({
      heroPhotos: data.heroPhotos?.map((p: any) => p._id) || [],
      portfolioPhotos: data.portfolioPhotos?.map((p: any) => p._id) || [],
      weddingBanner: data.weddingBanner?._id || "",
      aboutPhotoUrl: data.aboutPhoto || "",
    });
  }

  async function saveHomepageSettings() {
    setSavingHomepage(true);
    await fetch("/api/homepage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        heroPhotos: homepageSettings.heroPhotos,
        portfolioPhotos: homepageSettings.portfolioPhotos,
        weddingBanner: homepageSettings.weddingBanner,
      }),
    });
    setSavingHomepage(false);
    showSuccess("Homepage settings saved!");
  }

  async function handleAboutPhotoUpload(
    e: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingAbout(true);
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/homepage/about-photo", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (data.url) {
      setHomepageSettings((s) => ({ ...s, aboutPhotoUrl: data.url }));
    }
    setUploadingAbout(false);
    showSuccess("About photo updated!");
  }

  function toggleHeroPhoto(photoId: string) {
    setHomepageSettings((s) => {
      if (s.heroPhotos.includes(photoId)) {
        return {
          ...s,
          heroPhotos: s.heroPhotos.filter((id) => id !== photoId),
        };
      }
      if (s.heroPhotos.length >= 6) {
        alert("Maximum 6 photos allowed in hero strip");
        return s;
      }
      return { ...s, heroPhotos: [...s.heroPhotos, photoId] };
    });
  }

  function togglePortfolioPhoto(photoId: string) {
    setHomepageSettings((s) => {
      if (s.portfolioPhotos.includes(photoId)) {
        return {
          ...s,
          portfolioPhotos: s.portfolioPhotos.filter((id) => id !== photoId),
        };
      }
      if (s.portfolioPhotos.length >= 9) {
        alert("Maximum 9 photos allowed in portfolio preview");
        return s;
      }
      return { ...s, portfolioPhotos: [...s.portfolioPhotos, photoId] };
    });
  }
  function showSuccess(msg: string) {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3000);
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (!files.length || !selectedAlbum) return;
    setUploading(true);
    setUploadProgress(0);
    for (let i = 0; i < files.length; i++) {
      const formData = new FormData();
      formData.append("file", files[i]);
      formData.append("albumId", selectedAlbum);
      formData.append("order", String(photos.length + i));
      await fetch("/api/upload", { method: "POST", body: formData });
      setUploadProgress(Math.round(((i + 1) / files.length) * 100));
    }
    await fetchPhotos(selectedAlbum);
    setUploading(false);
    setUploadProgress(0);
    showSuccess(`${files.length} photo${files.length > 1 ? "s" : ""} uploaded`);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function toggleVisibility(photoId: string, current: boolean) {
    await fetch("/api/photos", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ photoId, visible: !current }),
    });
    setPhotos(
      photos.map((p) => (p._id === photoId ? { ...p, visible: !current } : p)),
    );
    showSuccess(`Photo ${!current ? "shown" : "hidden"}`);
  }

  async function deletePhoto(photoId: string) {
    if (!confirm("Delete this photo? This cannot be undone.")) return;
    await fetch(`/api/photos?photoId=${photoId}`, { method: "DELETE" });
    setPhotos(photos.filter((p) => p._id !== photoId));
    showSuccess("Photo deleted");
  }

  async function onDragEnd(result: DropResult) {
    if (!result.destination) return;
    const reordered = Array.from(photos);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    const updated = reordered.map((p, i) => ({ ...p, order: i }));
    setPhotos(updated);
    await fetch("/api/photos", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        photos: updated.map((p) => ({ id: p._id, order: p.order })),
      }),
    });
    showSuccess("Order saved");
  }

  async function createAlbum() {
    if (!newAlbumTitle.trim()) return;
    const res = await fetch("/api/albums", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: newAlbumTitle,
        category: newAlbumCategory,
      }),
    });
    if (!res.ok) {
      const err = await res.text();
      console.error("Create album error:", err);
      showSuccess("Error creating album — check console");
      return;
    }
    const data = await res.json();
    setAlbums([...albums, data]);
    setSelectedAlbum(data._id);
    setNewAlbumTitle("");
    setShowNewAlbum(false);
    showSuccess(`Album "${newAlbumTitle}" created`);
  }

  async function deleteAlbum(albumId: string, albumTitle: string) {
    if (
      !confirm(`Delete album "${albumTitle}"? All photos will also be deleted.`)
    )
      return;
    await fetch(`/api/albums?albumId=${albumId}`, { method: "DELETE" });
    const remaining = albums.filter((a) => a._id !== albumId);
    setAlbums(remaining);
    if (remaining.length > 0) setSelectedAlbum(remaining[0]._id);
    else setPhotos([]);
    showSuccess("Album deleted");
  }

  const navItem = (
    section: ActiveSection,
    label: string,
    icon: React.ReactNode,
  ) => (
    <button
      onClick={() => setActiveSection(section)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "9px 12px",
        borderRadius: "4px",
        fontSize: "12px",
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: activeSection === section ? C.cream : C.creamMuted,
        background: activeSection === section ? C.creamFaint : "transparent",
        cursor: "pointer",
        marginBottom: "2px",
        border: "none",
        width: "100%",
        textAlign: "left",
        fontFamily: "Georgia, serif",
        borderLeft:
          activeSection === section
            ? `2px solid ${C.gold}`
            : "2px solid transparent",
      }}
    >
      {icon}
      {label}
    </button>
  );

  if (loading)
    return (
      <div
        style={{
          background: C.bg,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "32px", color: C.cream }}>✦</div>
          <p
            style={{
              fontSize: "10px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: C.goldMuted,
              marginTop: "16px",
              fontFamily: "Georgia, serif",
            }}
          >
            Loading...
          </p>
        </div>
      </div>
    );

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: C.bg,
        fontFamily: "Georgia, serif",
      }}
    >
      {/* ── SIDEBAR ── */}
      <div
        style={{
          width: "220px",
          background: C.surface,
          borderRight: `1px solid ${C.border}`,
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
        }}
      >
        {/* Brand */}
        <div
          style={{
            padding: "24px 16px",
            borderBottom: `1px solid ${C.border}`,
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div
            style={{
              width: "34px",
              height: "34px",
              background: C.cream,
              borderRadius: "2px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "16px",
              color: C.surface,
              flexShrink: 0,
            }}
          >
            ✦
          </div>
          <div>
            <div
              style={{
                fontSize: "12px",
                fontWeight: 600,
                color: C.cream,
                letterSpacing: "0.05em",
              }}
            >
              Gallery Admin
            </div>
            <div
              style={{
                fontSize: "10px",
                color: C.goldMuted,
                marginTop: "2px",
                letterSpacing: "0.08em",
              }}
            >
              Paras Ranjit
            </div>
          </div>
        </div>

        {/* Nav */}
        <div style={{ padding: "20px 8px", flex: 1 }}>
          <div
            style={{
              fontSize: "9px",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: C.goldFaint,
              padding: "0 12px",
              marginBottom: "10px",
            }}
          >
            Main
          </div>
          {navItem(
            "gallery",
            "Gallery",
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
            </svg>,
          )}
          {navItem(
            "albums",
            "Albums",
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </svg>,
          )}
          {navItem(
            "homepage",
            "Homepage",
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>,
          )}
          {navItem(
            "upload",
            "Upload",
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>,
          )}
        </div>

        {/* Footer */}
        <div
          style={{ padding: "12px 8px", borderTop: `1px solid ${C.border}` }}
        >
          <Link
            href="/"
            target="_blank"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "9px 12px",
              borderRadius: "4px",
              fontSize: "12px",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: C.creamMuted,
              textDecoration: "none",
              marginBottom: "2px",
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            View Site
          </Link>
          <button
            onClick={async () => {
              await fetch("/api/admin/logout", { method: "POST" });
              window.location.href = "/admin/login";
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "9px 12px",
              borderRadius: "4px",
              fontSize: "12px",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: C.creamMuted,
              background: "none",
              border: "none",
              cursor: "pointer",
              width: "100%",
              fontFamily: "Georgia, serif",
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Logout
          </button>
        </div>
      </div>

      {/* ── MAIN ── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
        }}
      >
        {/* Topbar */}
        <div
          style={{
            background: C.surface,
            borderBottom: `1px solid ${C.border}`,
            padding: "16px 28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <h1
            style={{
              fontSize: "13px",
              fontWeight: 400,
              color: C.cream,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              margin: 0,
            }}
          >
            {activeSection === "gallery" && "Gallery"}
            {activeSection === "albums" && "Albums"}
            {/* ── HOMEPAGE ── */}
            {activeSection === "homepage" && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "24px",
                }}
              >
                {/* Save button */}
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <button
                    onClick={saveHomepageSettings}
                    disabled={savingHomepage}
                    style={{
                      padding: "10px 28px",
                      background: C.cream,
                      color: C.surface,
                      border: "none",
                      borderRadius: "2px",
                      fontSize: "10px",
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      cursor: savingHomepage ? "not-allowed" : "pointer",
                      fontFamily: "Georgia, serif",
                      opacity: savingHomepage ? 0.6 : 1,
                    }}
                  >
                    {savingHomepage ? "Saving..." : "Save Changes"}
                  </button>
                </div>

                {/* About Photo */}
                <div
                  style={{
                    background: C.surface,
                    border: `1px solid ${C.border}`,
                    borderRadius: "2px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      padding: "16px 20px",
                      borderBottom: `1px solid ${C.border}`,
                    }}
                  >
                    <h2
                      style={{
                        fontSize: "12px",
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        color: C.cream,
                        margin: 0,
                      }}
                    >
                      About / Bio Photo
                    </h2>
                    <p
                      style={{
                        fontSize: "11px",
                        color: C.goldMuted,
                        marginTop: "4px",
                      }}
                    >
                      This appears in the About section on the homepage
                    </p>
                  </div>
                  <div
                    style={{
                      padding: "20px",
                      display: "flex",
                      alignItems: "center",
                      gap: "24px",
                      flexWrap: "wrap",
                    }}
                  >
                    {homepageSettings.aboutPhotoUrl ? (
                      <img
                        src={homepageSettings.aboutPhotoUrl}
                        alt=""
                        style={{
                          width: "120px",
                          height: "160px",
                          objectFit: "cover",
                          borderRadius: "2px",
                          border: `1px solid ${C.border}`,
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "120px",
                          height: "160px",
                          background: C.surface2,
                          border: `1px solid ${C.border}`,
                          borderRadius: "2px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "10px",
                            color: C.goldMuted,
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                          }}
                        >
                          No photo
                        </span>
                      </div>
                    )}
                    <div>
                      <p
                        style={{
                          fontSize: "11px",
                          color: C.gold,
                          marginBottom: "12px",
                          letterSpacing: "0.05em",
                        }}
                      >
                        {homepageSettings.aboutPhotoUrl
                          ? "Photo uploaded ✓"
                          : "No photo yet"}
                      </p>
                      <button
                        onClick={() => aboutPhotoInputRef.current?.click()}
                        disabled={uploadingAbout}
                        style={{
                          padding: "10px 24px",
                          background: "none",
                          border: `1px solid ${C.border}`,
                          color: C.gold,
                          fontSize: "10px",
                          letterSpacing: "0.15em",
                          textTransform: "uppercase",
                          cursor: "pointer",
                          fontFamily: "Georgia, serif",
                        }}
                      >
                        {uploadingAbout ? "Uploading..." : "Upload Photo"}
                      </button>
                      <input
                        ref={aboutPhotoInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleAboutPhotoUpload}
                        style={{ display: "none" }}
                      />
                    </div>
                  </div>
                </div>

                {/* Hero Photos */}
                <div
                  style={{
                    background: C.surface,
                    border: `1px solid ${C.border}`,
                    borderRadius: "2px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      padding: "16px 20px",
                      borderBottom: `1px solid ${C.border}`,
                    }}
                  >
                    <h2
                      style={{
                        fontSize: "12px",
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        color: C.cream,
                        margin: 0,
                      }}
                    >
                      Hero Strip Photos
                    </h2>
                    <p
                      style={{
                        fontSize: "11px",
                        color: C.goldMuted,
                        marginTop: "4px",
                      }}
                    >
                      Select up to 6 photos —{" "}
                      {homepageSettings.heroPhotos.length}/6 selected
                    </p>
                  </div>
                  <div style={{ padding: "16px 20px" }}>
                    <div
                      style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}
                    >
                      {allPhotos.map((photo) => {
                        const selected = homepageSettings.heroPhotos.includes(
                          photo._id,
                        );
                        return (
                          <div
                            key={photo._id}
                            onClick={() => toggleHeroPhoto(photo._id)}
                            style={{
                              width: "120px",
                              cursor: "pointer",
                              position: "relative",
                              border: `2px solid ${selected ? C.cream : C.border}`,
                              borderRadius: "2px",
                              overflow: "hidden",
                              opacity:
                                !selected &&
                                homepageSettings.heroPhotos.length >= 6
                                  ? 0.3
                                  : 1,
                              transition: "border-color 0.2s, opacity 0.2s",
                            }}
                          >
                            <img
                              src={photo.image?.url || photo.url}
                              alt=""
                              style={{
                                width: "100%",
                                height: "90px",
                                objectFit: "cover",
                                display: "block",
                              }}
                            />
                            {selected && (
                              <div
                                style={{
                                  position: "absolute",
                                  inset: 0,
                                  background: "rgba(240,232,216,0.15)",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <div
                                  style={{
                                    width: "24px",
                                    height: "24px",
                                    background: C.cream,
                                    borderRadius: "50%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "12px",
                                    color: C.surface,
                                  }}
                                >
                                  ✓
                                </div>
                              </div>
                            )}
                            <div
                              style={{
                                padding: "4px 6px",
                                background: C.surface2,
                              }}
                            >
                              <span
                                style={{
                                  fontSize: "9px",
                                  color: selected ? C.cream : C.goldMuted,
                                  letterSpacing: "0.05em",
                                }}
                              >
                                {selected
                                  ? `#${homepageSettings.heroPhotos.indexOf(photo._id) + 1}`
                                  : "Select"}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Portfolio Photos */}
                <div
                  style={{
                    background: C.surface,
                    border: `1px solid ${C.border}`,
                    borderRadius: "2px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      padding: "16px 20px",
                      borderBottom: `1px solid ${C.border}`,
                    }}
                  >
                    <h2
                      style={{
                        fontSize: "12px",
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        color: C.cream,
                        margin: 0,
                      }}
                    >
                      Portfolio Preview Photos
                    </h2>
                    <p
                      style={{
                        fontSize: "11px",
                        color: C.goldMuted,
                        marginTop: "4px",
                      }}
                    >
                      Select up to 9 photos —{" "}
                      {homepageSettings.portfolioPhotos.length}/9 selected
                    </p>
                  </div>
                  <div style={{ padding: "16px 20px" }}>
                    <div
                      style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}
                    >
                      {allPhotos.map((photo) => {
                        const selected =
                          homepageSettings.portfolioPhotos.includes(photo._id);
                        return (
                          <div
                            key={photo._id}
                            onClick={() => togglePortfolioPhoto(photo._id)}
                            style={{
                              width: "120px",
                              cursor: "pointer",
                              position: "relative",
                              border: `2px solid ${selected ? C.cream : C.border}`,
                              borderRadius: "2px",
                              overflow: "hidden",
                              opacity:
                                !selected &&
                                homepageSettings.portfolioPhotos.length >= 9
                                  ? 0.3
                                  : 1,
                              transition: "border-color 0.2s, opacity 0.2s",
                            }}
                          >
                            <img
                              src={photo.image?.url || photo.url}
                              alt=""
                              style={{
                                width: "100%",
                                height: "90px",
                                objectFit: "cover",
                                display: "block",
                              }}
                            />
                            {selected && (
                              <div
                                style={{
                                  position: "absolute",
                                  inset: 0,
                                  background: "rgba(240,232,216,0.15)",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <div
                                  style={{
                                    width: "24px",
                                    height: "24px",
                                    background: C.cream,
                                    borderRadius: "50%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "12px",
                                    color: C.surface,
                                  }}
                                >
                                  ✓
                                </div>
                              </div>
                            )}
                            <div
                              style={{
                                padding: "4px 6px",
                                background: C.surface2,
                              }}
                            >
                              <span
                                style={{
                                  fontSize: "9px",
                                  color: selected ? C.cream : C.goldMuted,
                                  letterSpacing: "0.05em",
                                }}
                              >
                                {selected
                                  ? `#${homepageSettings.portfolioPhotos.indexOf(photo._id) + 1}`
                                  : "Select"}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Wedding Banner */}
                <div
                  style={{
                    background: C.surface,
                    border: `1px solid ${C.border}`,
                    borderRadius: "2px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      padding: "16px 20px",
                      borderBottom: `1px solid ${C.border}`,
                    }}
                  >
                    <h2
                      style={{
                        fontSize: "12px",
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        color: C.cream,
                        margin: 0,
                      }}
                    >
                      Wedding Banner Photo
                    </h2>
                    <p
                      style={{
                        fontSize: "11px",
                        color: C.goldMuted,
                        marginTop: "4px",
                      }}
                    >
                      Full-width background image on the homepage
                    </p>
                  </div>
                  <div style={{ padding: "16px 20px" }}>
                    <div
                      style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}
                    >
                      {allPhotos.map((photo) => {
                        const selected =
                          homepageSettings.weddingBanner === photo._id;
                        return (
                          <div
                            key={photo._id}
                            onClick={() =>
                              setHomepageSettings((s) => ({
                                ...s,
                                weddingBanner: selected ? "" : photo._id,
                              }))
                            }
                            style={{
                              width: "120px",
                              cursor: "pointer",
                              position: "relative",
                              border: `2px solid ${selected ? C.cream : C.border}`,
                              borderRadius: "2px",
                              overflow: "hidden",
                              transition: "border-color 0.2s",
                            }}
                          >
                            <img
                              src={photo.image?.url || photo.url}
                              alt=""
                              style={{
                                width: "100%",
                                height: "90px",
                                objectFit: "cover",
                                display: "block",
                              }}
                            />
                            {selected && (
                              <div
                                style={{
                                  position: "absolute",
                                  inset: 0,
                                  background: "rgba(240,232,216,0.15)",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <div
                                  style={{
                                    width: "24px",
                                    height: "24px",
                                    background: C.cream,
                                    borderRadius: "50%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "12px",
                                    color: C.surface,
                                  }}
                                >
                                  ✓
                                </div>
                              </div>
                            )}
                            <div
                              style={{
                                padding: "4px 6px",
                                background: C.surface2,
                              }}
                            >
                              <span
                                style={{
                                  fontSize: "9px",
                                  color: selected ? C.cream : C.goldMuted,
                                  letterSpacing: "0.05em",
                                }}
                              >
                                {selected ? "Selected" : "Select"}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}
            {activeSection === "upload" && "Upload Photos"}
          </h1>
          {activeSection === "gallery" && (
            <button
              onClick={() => fileInputRef.current?.click()}
              style={{
                padding: "8px 20px",
                background: C.cream,
                color: C.surface,
                border: "none",
                borderRadius: "2px",
                fontSize: "10px",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "Georgia, serif",
              }}
            >
              + Upload
            </button>
          )}
        </div>

        {/* Success toast */}
        {successMsg && (
          <div
            style={{
              background: C.greenBg,
              borderBottom: `1px solid ${C.green}`,
              padding: "10px 28px",
              fontSize: "11px",
              color: C.greenText,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {successMsg}
          </div>
        )}

        <div style={{ padding: "28px", flex: 1, overflowY: "auto" }}>
          {/* ── GALLERY ── */}
          {activeSection === "gallery" && (
            <>
              {/* Stat cards */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: "12px",
                  marginBottom: "24px",
                }}
              >
                {[
                  {
                    label: "Total Photos",
                    value: photos.length,
                    sub: "in this album",
                    color: C.cream,
                  },
                  {
                    label: "Visible",
                    value: photos.filter((p) => p.visible).length,
                    sub: "shown on site",
                    color: C.greenText,
                  },
                  {
                    label: "Hidden",
                    value: photos.filter((p) => !p.visible).length,
                    sub: "not shown",
                    color: C.redText,
                  },
                  {
                    label: "Albums",
                    value: albums.length,
                    sub: "total",
                    color: C.gold,
                  },
                ].map((stat, i) => (
                  <div
                    key={i}
                    style={{
                      background: C.surface,
                      border: `1px solid ${C.border}`,
                      borderRadius: "2px",
                      padding: "16px 20px",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "10px",
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        color: C.goldMuted,
                        marginBottom: "8px",
                      }}
                    >
                      {stat.label}
                    </p>
                    <p
                      style={{
                        fontSize: "28px",
                        fontWeight: 400,
                        color: stat.color,
                        lineHeight: 1,
                      }}
                    >
                      {stat.value}
                    </p>
                    <p
                      style={{
                        fontSize: "10px",
                        color: C.goldFaint,
                        marginTop: "6px",
                        letterSpacing: "0.1em",
                      }}
                    >
                      {stat.sub}
                    </p>
                  </div>
                ))}
              </div>

              {/* Panel */}
              <div
                style={{
                  background: C.surface,
                  border: `1px solid ${C.border}`,
                  borderRadius: "2px",
                }}
              >
                {/* Album tabs */}
                <div
                  style={{
                    padding: "14px 20px",
                    borderBottom: `1px solid ${C.border}`,
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    flexWrap: "wrap",
                  }}
                >
                  {albums.map((album) => (
                    <button
                      key={album._id}
                      onClick={() => setSelectedAlbum(album._id)}
                      style={{
                        padding: "6px 16px",
                        fontSize: "10px",
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        cursor: "pointer",
                        fontFamily: "Georgia, serif",
                        borderRadius: "2px",
                        border:
                          selectedAlbum === album._id
                            ? "none"
                            : `1px solid ${C.border}`,
                        background:
                          selectedAlbum === album._id ? C.cream : "transparent",
                        color: selectedAlbum === album._id ? C.surface : C.gold,
                      }}
                    >
                      {album.title}
                    </button>
                  ))}
                  <p
                    style={{
                      fontSize: "10px",
                      color: C.goldFaint,
                      marginLeft: "auto",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                    }}
                  >
                    Drag to reorder
                  </p>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleUpload}
                  style={{ display: "none" }}
                />

                {/* Upload progress */}
                {uploading && (
                  <div
                    style={{
                      padding: "14px 20px",
                      borderBottom: `1px solid ${C.border}`,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "8px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "11px",
                          color: C.gold,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                        }}
                      >
                        Uploading...
                      </span>
                      <span style={{ fontSize: "11px", color: C.cream }}>
                        {uploadProgress}%
                      </span>
                    </div>
                    <div
                      style={{
                        background: C.border,
                        height: "2px",
                        borderRadius: "1px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          background: C.gold,
                          width: `${uploadProgress}%`,
                          transition: "width 0.3s",
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Photos */}
                {photos.length === 0 ? (
                  <div style={{ padding: "80px", textAlign: "center" }}>
                    <p
                      style={{
                        fontSize: "11px",
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        color: C.goldMuted,
                      }}
                    >
                      No photos in this album yet
                    </p>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      style={{
                        marginTop: "16px",
                        padding: "10px 28px",
                        background: C.cream,
                        color: C.surface,
                        border: "none",
                        borderRadius: "2px",
                        fontSize: "10px",
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        cursor: "pointer",
                        fontFamily: "Georgia, serif",
                      }}
                    >
                      Upload first photo
                    </button>
                  </div>
                ) : (
                  <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="photos" direction="horizontal">
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "12px",
                            padding: "20px",
                          }}
                        >
                          {photos.map((photo, index) => (
                            <Draggable
                              key={photo._id}
                              draggableId={photo._id}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  style={{
                                    width: "180px",
                                    background: C.surface2,
                                    border: `1px solid ${snapshot.isDragging ? C.gold : C.border}`,
                                    borderRadius: "2px",
                                    overflow: "hidden",
                                    opacity: photo.visible ? 1 : 0.45,
                                    cursor: "grab",
                                    ...provided.draggableProps.style,
                                  }}
                                >
                                  <div style={{ position: "relative" }}>
                                    <img
                                      src={photo.image.url}
                                      alt=""
                                      style={{
                                        width: "100%",
                                        height: "140px",
                                        objectFit: "cover",
                                        display: "block",
                                      }}
                                    />
                                    {!photo.visible && (
                                      <div
                                        style={{
                                          position: "absolute",
                                          inset: 0,
                                          background: "rgba(15,12,9,0.65)",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                        }}
                                      >
                                        <span
                                          style={{
                                            fontSize: "10px",
                                            color: C.gold,
                                            letterSpacing: "0.15em",
                                            textTransform: "uppercase",
                                          }}
                                        >
                                          Hidden
                                        </span>
                                      </div>
                                    )}
                                    <button
                                      onClick={() =>
                                        setPreview(photo.image.url)
                                      }
                                      style={{
                                        position: "absolute",
                                        top: "6px",
                                        right: "6px",
                                        background: "rgba(15,12,9,0.75)",
                                        border: `1px solid ${C.border}`,
                                        color: C.cream,
                                        width: "26px",
                                        height: "26px",
                                        borderRadius: "2px",
                                        cursor: "pointer",
                                        fontSize: "13px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                      }}
                                    >
                                      ⤢
                                    </button>
                                  </div>
                                  <div style={{ padding: "8px 10px" }}>
                                    <div
                                      style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        marginBottom: "8px",
                                      }}
                                    >
                                      <span
                                        style={{
                                          fontSize: "10px",
                                          color: C.goldFaint,
                                          letterSpacing: "0.1em",
                                        }}
                                      >
                                        #{index + 1}
                                      </span>
                                      <span
                                        style={{
                                          fontSize: "9px",
                                          padding: "2px 8px",
                                          borderRadius: "2px",
                                          letterSpacing: "0.08em",
                                          textTransform: "uppercase",
                                          background: photo.visible
                                            ? C.greenBg
                                            : C.border,
                                          color: photo.visible
                                            ? C.greenText
                                            : C.goldMuted,
                                        }}
                                      >
                                        {photo.visible ? "Visible" : "Hidden"}
                                      </span>
                                    </div>
                                    <div
                                      style={{ display: "flex", gap: "6px" }}
                                    >
                                      <button
                                        onClick={() =>
                                          toggleVisibility(
                                            photo._id,
                                            photo.visible,
                                          )
                                        }
                                        style={{
                                          flex: 1,
                                          padding: "5px",
                                          border: `1px solid ${C.border}`,
                                          background: "transparent",
                                          borderRadius: "2px",
                                          fontSize: "10px",
                                          letterSpacing: "0.08em",
                                          textTransform: "uppercase",
                                          color: C.gold,
                                          cursor: "pointer",
                                          fontFamily: "Georgia, serif",
                                        }}
                                      >
                                        {photo.visible ? "Hide" : "Show"}
                                      </button>
                                      <button
                                        onClick={() => deletePhoto(photo._id)}
                                        style={{
                                          padding: "5px 8px",
                                          border: `1px solid ${C.red}`,
                                          background: "transparent",
                                          borderRadius: "2px",
                                          fontSize: "10px",
                                          color: C.redText,
                                          cursor: "pointer",
                                          fontFamily: "Georgia, serif",
                                        }}
                                      >
                                        ✕
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                )}
              </div>
            </>
          )}

          {/* ── ALBUMS ── */}
          {activeSection === "albums" && (
            <div
              style={{
                background: C.surface,
                border: `1px solid ${C.border}`,
                borderRadius: "2px",
              }}
            >
              <div
                style={{
                  padding: "16px 24px",
                  borderBottom: `1px solid ${C.border}`,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h2
                  style={{
                    fontSize: "12px",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: C.cream,
                    margin: 0,
                  }}
                >
                  All Albums
                </h2>
                <button
                  onClick={() => setShowNewAlbum(!showNewAlbum)}
                  style={{
                    padding: "8px 20px",
                    background: C.cream,
                    color: C.surface,
                    border: "none",
                    borderRadius: "2px",
                    fontSize: "10px",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    fontFamily: "Georgia, serif",
                  }}
                >
                  + New Album
                </button>
              </div>

              {showNewAlbum && (
                <div
                  style={{
                    padding: "20px 24px",
                    borderBottom: `1px solid ${C.border}`,
                    background: C.surface2,
                    display: "flex",
                    gap: "10px",
                    alignItems: "flex-end",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <label
                      style={{
                        fontSize: "10px",
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        color: C.goldMuted,
                        display: "block",
                        marginBottom: "8px",
                      }}
                    >
                      Title
                    </label>
                    <input
                      type="text"
                      value={newAlbumTitle}
                      onChange={(e) => setNewAlbumTitle(e.target.value)}
                      placeholder="e.g. Wedding"
                      onKeyDown={(e) => e.key === "Enter" && createAlbum()}
                      style={{
                        width: "100%",
                        padding: "9px 12px",
                        background: C.bg,
                        border: `1px solid ${C.border}`,
                        borderRadius: "2px",
                        color: C.cream,
                        fontSize: "13px",
                        fontFamily: "Georgia, serif",
                        outline: "none",
                        boxSizing: "border-box" as const,
                      }}
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        fontSize: "10px",
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        color: C.goldMuted,
                        display: "block",
                        marginBottom: "8px",
                      }}
                    >
                      Category
                    </label>
                    <select
                      value={newAlbumCategory}
                      onChange={(e) => setNewAlbumCategory(e.target.value)}
                      style={{
                        padding: "9px 12px",
                        background: C.bg,
                        border: `1px solid ${C.border}`,
                        borderRadius: "2px",
                        color: C.cream,
                        fontSize: "13px",
                        fontFamily: "Georgia, serif",
                        outline: "none",
                        cursor: "pointer",
                      }}
                    >
                      <option value="wedding">Wedding</option>
                      <option value="portrait">Portrait</option>
                      <option value="family">Family</option>
                      <option value="baby">Baby</option>
                      <option value="newborn">Newborn</option>
                      <option value="pictures">Pictures</option>
                    </select>
                  </div>
                  <button
                    onClick={createAlbum}
                    style={{
                      padding: "9px 24px",
                      background: C.cream,
                      color: C.surface,
                      border: "none",
                      borderRadius: "2px",
                      fontSize: "10px",
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      cursor: "pointer",
                      fontFamily: "Georgia, serif",
                    }}
                  >
                    Create
                  </button>
                  <button
                    onClick={() => setShowNewAlbum(false)}
                    style={{
                      padding: "9px 16px",
                      background: "transparent",
                      border: `1px solid ${C.border}`,
                      borderRadius: "2px",
                      fontSize: "10px",
                      color: C.goldMuted,
                      cursor: "pointer",
                      fontFamily: "Georgia, serif",
                    }}
                  >
                    Cancel
                  </button>
                </div>
              )}

              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                    {["Album", "Category", "Actions"].map((h) => (
                      <th
                        key={h}
                        style={{
                          padding: "12px 24px",
                          textAlign: "left",
                          fontSize: "10px",
                          fontWeight: 400,
                          color: C.goldMuted,
                          textTransform: "uppercase",
                          letterSpacing: "0.12em",
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {albums.map((album, i) => (
                    <tr
                      key={album._id}
                      style={{
                        borderBottom: `1px solid ${C.border}`,
                        background: i % 2 === 0 ? "transparent" : C.surface2,
                      }}
                    >
                      <td
                        style={{
                          padding: "16px 24px",
                          fontSize: "13px",
                          color: C.cream,
                          letterSpacing: "0.05em",
                        }}
                      >
                        {album.title}
                      </td>
                      <td style={{ padding: "16px 24px" }}>
                        <span
                          style={{
                            fontSize: "10px",
                            padding: "3px 10px",
                            borderRadius: "2px",
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            background: C.border,
                            color: C.gold,
                          }}
                        >
                          {album.category}
                        </span>
                      </td>
                      <td style={{ padding: "16px 24px" }}>
                        <div style={{ display: "flex", gap: "8px" }}>
                          <button
                            onClick={() => {
                              setSelectedAlbum(album._id);
                              setActiveSection("gallery");
                            }}
                            style={{
                              padding: "6px 14px",
                              border: `1px solid ${C.border}`,
                              background: "transparent",
                              borderRadius: "2px",
                              fontSize: "10px",
                              letterSpacing: "0.1em",
                              textTransform: "uppercase",
                              color: C.gold,
                              cursor: "pointer",
                              fontFamily: "Georgia, serif",
                            }}
                          >
                            View
                          </button>
                          <button
                            onClick={() => deleteAlbum(album._id, album.title)}
                            style={{
                              padding: "6px 14px",
                              border: `1px solid ${C.red}`,
                              background: "transparent",
                              borderRadius: "2px",
                              fontSize: "10px",
                              letterSpacing: "0.1em",
                              textTransform: "uppercase",
                              color: C.redText,
                              cursor: "pointer",
                              fontFamily: "Georgia, serif",
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ── UPLOAD ── */}
          {activeSection === "upload" && (
            <div
              style={{
                background: C.surface,
                border: `1px solid ${C.border}`,
                borderRadius: "2px",
                padding: "32px",
              }}
            >
              <h2
                style={{
                  fontSize: "12px",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: C.cream,
                  marginBottom: "8px",
                }}
              >
                Upload Photos
              </h2>
              <p
                style={{
                  fontSize: "13px",
                  color: C.goldMuted,
                  marginBottom: "28px",
                  lineHeight: 1.8,
                }}
              >
                Select an album then upload your photos.
              </p>

              <div style={{ marginBottom: "24px" }}>
                <label
                  style={{
                    fontSize: "10px",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: C.goldMuted,
                    display: "block",
                    marginBottom: "10px",
                  }}
                >
                  Select Album
                </label>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {albums.map((album) => (
                    <button
                      key={album._id}
                      onClick={() => setSelectedAlbum(album._id)}
                      style={{
                        padding: "8px 18px",
                        borderRadius: "2px",
                        fontSize: "10px",
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        cursor: "pointer",
                        fontFamily: "Georgia, serif",
                        border:
                          selectedAlbum === album._id
                            ? "none"
                            : `1px solid ${C.border}`,
                        background:
                          selectedAlbum === album._id ? C.cream : "transparent",
                        color: selectedAlbum === album._id ? C.surface : C.gold,
                      }}
                    >
                      {album.title}
                    </button>
                  ))}
                </div>
              </div>

              <div
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: `1px dashed ${C.border2}`,
                  borderRadius: "2px",
                  padding: "60px",
                  textAlign: "center",
                  cursor: "pointer",
                  transition: "border-color 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderColor = C.gold)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderColor = C.border2)
                }
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleUpload}
                  style={{ display: "none" }}
                />
                {uploading ? (
                  <div>
                    <p
                      style={{
                        fontSize: "12px",
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        color: C.gold,
                        marginBottom: "16px",
                      }}
                    >
                      Uploading... {uploadProgress}%
                    </p>
                    <div
                      style={{
                        background: C.border,
                        height: "2px",
                        borderRadius: "1px",
                        overflow: "hidden",
                        maxWidth: "300px",
                        margin: "0 auto",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          background: C.gold,
                          width: `${uploadProgress}%`,
                          transition: "width 0.3s",
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <div
                      style={{
                        fontSize: "28px",
                        color: C.goldMuted,
                        marginBottom: "12px",
                      }}
                    >
                      ↑
                    </div>
                    <p
                      style={{
                        fontSize: "12px",
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: C.gold,
                        marginBottom: "8px",
                      }}
                    >
                      Click to upload photos
                    </p>
                    <p
                      style={{
                        fontSize: "11px",
                        color: C.goldFaint,
                        letterSpacing: "0.08em",
                      }}
                    >
                      JPG, PNG, WEBP — multiple files supported
                    </p>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── LIGHTBOX ── */}
      {preview && (
        <div
          onClick={() => setPreview(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(10,8,6,0.97)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            cursor: "zoom-out",
            padding: "40px",
          }}
        >
          <img
            src={preview}
            alt=""
            style={{
              maxWidth: "90vw",
              maxHeight: "90vh",
              objectFit: "contain",
            }}
          />
          <button
            onClick={() => setPreview(null)}
            style={{
              position: "fixed",
              top: "20px",
              right: "24px",
              background: C.surface,
              border: `1px solid ${C.border}`,
              color: C.cream,
              width: "36px",
              height: "36px",
              borderRadius: "2px",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
