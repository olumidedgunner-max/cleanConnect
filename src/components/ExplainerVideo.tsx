"use client";
import { useState, useEffect } from "react";

const SLIDES = [
  {
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1600&auto=format&fit=crop",
    step: "Step 1",
    headline: "Tell us your rooms. Upload a photo.",
    body: "Add how many kitchens, bedrooms, living rooms, play rooms and bathrooms you have. Upload a photo of each room and our AI determines how dirty it is — pricing your job fairly in seconds.",
    accent: "#57c7ff",
  },
  {
    image: "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?q=80&w=1600&auto=format&fit=crop",
    step: "Step 2",
    headline: "A local cleaner accepts your job.",
    body: "Verified cleaners and students in your area see your job listing. Once someone accepts, payment is held securely in escrow via Stripe. The cleaner only receives your full address after funds are confirmed.",
    accent: "#22c55e",
  },
  {
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=1600&auto=format&fit=crop",
    step: "Step 3",
    headline: "Before & after proof. You approve. Done.",
    body: "The cleaner uploads photos on arrival and again after completing the job. You review the evidence and approve. Escrow releases instantly. Both sides leave verified reviews. Simple, safe, and transparent.",
    accent: "#f59e0b",
  },
];

export default function ExplainerVideo() {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const DURATION = 5000;

  useEffect(() => {
    setProgress(0);
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min((elapsed / DURATION) * 100, 100);
      setProgress(pct);
      if (elapsed >= DURATION) {
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
        <h2 style={{ fontSize: "46px", fontWeight: 900, marginBottom: "12px" }}>See How It Works</h2>
        <p style={{ color: "#9fb0c1", fontSize: "18px", marginBottom: "50px", maxWidth: "600px", lineHeight: 1.7 }}>
          Three simple steps from messy room to spotless home — all protected by AI and escrow.
        </p>

        {/* Main video-like player */}
        <div style={{ borderRadius: "28px", overflow: "hidden", position: "relative", aspectRatio: "16/7", marginBottom: "24px" }}>
          {/* Background photo */}
          <div style={{
            position: "absolute", inset: 0, zIndex: 0,
            background: `url('${slide.image}') center/cover no-repeat`,
            transition: "background-image 0.6s ease",
          }} />
          {/* Dark overlay */}
          <div style={{ position: "absolute", inset: 0, zIndex: 1, background: "linear-gradient(90deg, rgba(4,10,20,.92) 50%, rgba(4,10,20,.5))" }} />

          {/* Content */}
          <div style={{ position: "relative", zIndex: 2, padding: "50px 60px", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ display: "inline-block", padding: "8px 16px", background: `rgba(${slide.accent === "#57c7ff" ? "87,199,255" : slide.accent === "#22c55e" ? "34,197,94" : "245,158,11"},.2)`, border: `1px solid ${slide.accent}`, borderRadius: "999px", color: slide.accent, fontSize: "13px", fontWeight: 700, marginBottom: "20px", width: "fit-content" }}>
              {slide.step} of 3
            </div>
            <h3 style={{ fontSize: "42px", fontWeight: 900, marginBottom: "20px", maxWidth: "500px", lineHeight: 1.1 }}>
              {slide.headline}
            </h3>
            <p style={{ color: "#c5d0dc", fontSize: "17px", lineHeight: 1.8, maxWidth: "480px" }}>
              {slide.body}
            </p>
          </div>

          {/* Progress bar */}
          <div style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: "4px", background: "rgba(255,255,255,.1)", zIndex: 3 }}>
            <div style={{ height: "100%", width: `${progress}%`, background: slide.accent, transition: "width 0.05s linear" }} />
          </div>
        </div>

        {/* Slide thumbnails */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
          {SLIDES.map((s, i) => (
            <button key={i} onClick={() => setActive(i)} style={{
              padding: "20px",
              borderRadius: "18px",
              border: `2px solid ${active === i ? s.accent : "rgba(255,255,255,.06)"}`,
              background: active === i ? `rgba(${s.accent === "#57c7ff" ? "87,199,255" : s.accent === "#22c55e" ? "34,197,94" : "245,158,11"},.08)` : "linear-gradient(180deg,#0d1727,#101d30)",
              color: "white",
              textAlign: "left",
              cursor: "pointer",
              transition: "border-color 0.3s",
            }}>
              <div style={{ fontSize: "12px", color: s.accent, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>{s.step}</div>
              <div style={{ fontWeight: 800, fontSize: "15px", lineHeight: 1.4 }}>{s.headline}</div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
