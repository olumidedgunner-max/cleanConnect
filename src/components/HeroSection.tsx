"use client";
import { useRef } from "react";
import Navbar from "./Navbar";

const BG_IMAGE = "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=1600&auto=format&fit=crop";
const VIDEO_URL = "https://assets.mixkit.co/videos/preview/mixkit-woman-cleaning-and-polishing-furniture-4792-large.mp4";

export default function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <section style={{ minHeight: "100vh", position: "relative", overflow: "hidden", padding: "30px" }}>

      {/* Fallback background image — always visible, video layers on top */}
      <div style={{
        position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0,
        background: `url('${BG_IMAGE}') center/cover no-repeat`,
      }} />

      {/* Background video — sits on top of image, same crop */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        poster={BG_IMAGE}
        onError={() => { if (videoRef.current) videoRef.current.style.display = "none"; }}
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 1 }}
      >
        <source src={VIDEO_URL} type="video/mp4" />
      </video>

      {/* Dark overlay */}
      <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "linear-gradient(rgba(4,10,20,.75), rgba(4,10,20,.90))", zIndex: 2 }} />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 3 }}>
        <Navbar />
        <div style={{ maxWidth: "650px", marginTop: "100px" }}>
          <div style={{ display: "inline-block", padding: "8px 16px", background: "rgba(30,167,255,.15)", border: "1px solid rgba(30,167,255,.3)", borderRadius: "999px", color: "#57c7ff", fontSize: "13px", fontWeight: 700, marginBottom: "24px" }}>
            AI-Powered Cleaning Marketplace
          </div>
          <h1 style={{ fontSize: "70px", lineHeight: 1.0, marginBottom: "25px", fontWeight: 900 }}>
            Get Your Home Cleaned. Fast. Verified. Secure.
          </h1>
          <p style={{ fontSize: "20px", lineHeight: 1.6, color: "#c5d0dc", marginBottom: "35px" }}>
            Tell us your rooms, upload photos, and our AI prices your job instantly.
            Students and individuals earn money cleaning. Businesses post at scale.
            Every job protected by escrow.
          </p>
          <div style={{ display: "flex", gap: "18px", flexWrap: "wrap" }}>
            <button style={{ padding: "16px 28px", borderRadius: "14px", border: "none", fontSize: "16px", fontWeight: 700, cursor: "pointer", background: "linear-gradient(135deg,#1ea7ff,#0077ff)", color: "white" }}>
              Post a Cleaning Job
            </button>
            <button style={{ padding: "16px 28px", borderRadius: "14px", border: "1px solid rgba(255,255,255,.1)", fontSize: "16px", fontWeight: 700, cursor: "pointer", background: "rgba(255,255,255,.08)", backdropFilter: "blur(12px)", color: "white" }}>
              Start Earning as a Cleaner
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "20px", marginTop: "70px" }}>
            {[
              { stat: "4.9★", label: "Average cleaner rating" },
              { stat: "100%", label: "AI-verified room photos" },
              { stat: "£2M+", label: "Secured via escrow" },
              { stat: "24/7", label: "Dispute monitoring" },
            ].map((s) => (
              <div key={s.stat} style={{ background: "rgba(255,255,255,.06)", padding: "25px", borderRadius: "22px", backdropFilter: "blur(14px)", border: "1px solid rgba(255,255,255,.08)" }}>
                <div style={{ fontSize: "32px", fontWeight: 900, color: "#57c7ff", marginBottom: "8px" }}>{s.stat}</div>
                <div style={{ color: "#9fb0c1", fontSize: "14px" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
