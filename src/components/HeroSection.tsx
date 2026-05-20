import Navbar from "./Navbar";

export default function HeroSection() {
  return (
    <section style={{
      minHeight: "100vh",
      background: "linear-gradient(rgba(4,10,20,.72), rgba(4,10,20,.88)), url('https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=1600&auto=format&fit=crop')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      padding: "30px",
    }}>
      <Navbar />
      <div style={{ maxWidth: "650px", marginTop: "120px" }}>
        <h1 style={{ fontSize: "70px", lineHeight: 1.0, marginBottom: "25px", fontWeight: 900 }}>
          Upgrade to Premium. Unlock Elite Benefits.
        </h1>
        <p style={{ fontSize: "20px", lineHeight: 1.6, color: "#c5d0dc", marginBottom: "35px" }}>
          Get priority access to top-rated cleaners, zero platform fees, 24/7 VIP support,
          and exclusive features designed for luxury home care.
        </p>
        <div style={{ display: "flex", gap: "18px", flexWrap: "wrap" }}>
          <button style={{
            padding: "16px 28px",
            borderRadius: "14px",
            border: "none",
            fontSize: "16px",
            fontWeight: 700,
            cursor: "pointer",
            background: "linear-gradient(135deg,#ff9500,#ff6b00)",
            color: "white",
          }}>
            Explore Premium Plans
          </button>
          <button style={{
            padding: "16px 28px",
            borderRadius: "14px",
            border: "1px solid rgba(255,255,255,.1)",
            fontSize: "16px",
            fontWeight: 700,
            cursor: "pointer",
            background: "rgba(255,255,255,.08)",
            backdropFilter: "blur(12px)",
            color: "white",
          }}>
            See All Features
          </button>
        </div>
      </div>
    </section>
  );
}
