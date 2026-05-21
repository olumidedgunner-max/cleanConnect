"use client";
import { useState, useEffect, useRef } from "react";

const SLIDES = [
  {
    video: "/ladycleaningtable.mp4",
    step: "Step 1",
    tag: "Post a Job",
    headline: "Tell us your rooms. Upload photos. AI prices it instantly.",
    body: "Add your room count — kitchen, bedrooms, bathrooms, living rooms. Upload a photo of each room and Claude AI analyses it in seconds: room type, size, dirtiness score 1–10, estimated hours, and a fair price. No photo? We quote at the heavy-clean rate.",
    accent: "#57c7ff",
    accentRGB: "87,199,255",
  },
  {
    video: "/happycleaner.mp4",
    step: "Step 2",
    tag: "A Cleaner Accepts",
    headline: "A local cleaner accepts. Both parties are verified.",
    body: "Your job goes live on the marketplace. A vetted cleaner in your area accepts it. At this point both parties complete full identity verification and Stripe account registration. Your full address is only revealed after escrow is funded — never before.",
    accent: "#22c55e",
    accentRGB: "34,197,94",
  },
  {
    video: "/mancleaning.mp4",
    step: "Step 3",
    tag: "Job In Progress",
    headline: "Escrow holds the payment. Cleaner arrives and gets to work.",
    body: "Your payment is held securely in escrow via Stripe — the cleaner cannot touch it yet. The cleaner takes arrival photos before starting, then uploads completion photos when done. Every step is timestamped and recorded.",
    accent: "#f59e0b",
    accentRGB: "245,158,11",
  },
  {
    video: "/floorcleaning.mp4",
    step: "Step 4",
    tag: "AI Verifies & You're Paid",
    headline: "AI checks the after photos. Money releases automatically.",
    body: "Once the cleaner uploads the after photos, AI compares them against the before photos. If the room passes — money drops to the cleaner immediately. If unclear, you get an SMS and email notification to approve. No response in 4 hours? Payment releases automatically.",
    accent: "#c084fc",
    accentRGB: "192,132,252",
  },
];

const DURATION = 6000;

export default function ExplainerVideo() {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setProgress(0);
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {});
    }
    const start = Date.now();
    const interval = setInterval(() => {
      const pct = Math.min(((Date.now() - start) / DURATION) * 100, 100);
      setProgress(pct);
      if (pct >= 100) {
        setActive((a) => (a + 1) % SLIDES.length);
        clearInterval(interval);
      }
    }, 50);
    return () => clearInterval(interval);
  }, [active]);

  const slide = SLIDES[active];

  return (
    <section style={{ padding: "90px 30px", background: "#0a1420" }}>
      <div style={{ maxWidth: "1100px", margin: "auto" }}>
        <h2 style={{ fontSize: "46px", fontWeight: 900, marginBottom: "12px" }}>How CleanConnect Works</h2>
        <p style={{ color: "#9fb0c1", fontSize: "18px", marginBottom: "50px", maxWidth: "600px", lineHeight: 1.7 }}>
          From room photo to clean home and paid cleaner — four steps, fully verified, every penny protected.
        </p>

        {/* Main player */}
        <div style={{ borderRadius: "28px", overflow: "hidden", position: "relative", aspectRatio: "16/7", marginBottom: "24px", background: "#050c17" }}>
          {/* Background video */}
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0 }}
          >
            <source src={slide.video} type="video/mp4" />
          </video>
          {/* Overlay */}
          <div style={{ position: "absolute", inset: 0, zIndex: 1, background: "linear-gradient(90deg, rgba(4,10,20,.93) 50%, rgba(4,10,20,.55))" }} />

          {/* Content */}
          <div style={{ position: "relative", zIndex: 2, padding: "50px 60px", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ display: "flex", gap: "10px", marginBottom: "18px", flexWrap: "wrap" }}>
              <div style={{ padding: "6px 14px", background: `rgba(${slide.accentRGB},.2)`, border: `1px solid ${slide.accent}`, borderRadius: "999px", color: slide.accent, fontSize: "12px", fontWeight: 700 }}>
                {slide.step} of 4
              </div>
              <div style={{ padding: "6px 14px", background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.12)", borderRadius: "999px", color: "white", fontSize: "12px", fontWeight: 700 }}>
                {slide.tag}
              </div>
            </div>
            <h3 style={{ fontSize: "38px", fontWeight: 900, marginBottom: "18px", maxWidth: "520px", lineHeight: 1.1 }}>
              {slide.headline}
            </h3>
            <p style={{ color: "#c5d0dc", fontSize: "16px", lineHeight: 1.8, maxWidth: "500px" }}>
              {slide.body}
            </p>
          </div>

          {/* Progress bar */}
          <div style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: "4px", background: "rgba(255,255,255,.1)", zIndex: 3 }}>
            <div style={{ height: "100%", width: `${progress}%`, background: slide.accent, transition: "width 0.05s linear" }} />
          </div>
        </div>

        {/* Step thumbnails */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px" }}>
          {SLIDES.map((s, i) => (
            <button key={i} onClick={() => setActive(i)} style={{
              padding: "18px",
              borderRadius: "16px",
              border: `2px solid ${active === i ? s.accent : "rgba(255,255,255,.06)"}`,
              background: active === i ? `rgba(${s.accentRGB},.08)` : "linear-gradient(180deg,#0d1727,#101d30)",
              color: "white",
              textAlign: "left",
              cursor: "pointer",
              transition: "border-color 0.3s",
            }}>
              <div style={{ fontSize: "11px", color: s.accent, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "6px" }}>{s.step}</div>
              <div style={{ fontWeight: 800, fontSize: "13px", lineHeight: 1.4 }}>{s.tag}</div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
