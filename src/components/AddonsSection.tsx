const addons = [
  { icon: "⚡", title: "Emergency Clean", price: "£25", desc: "Guaranteed cleaner arrival within 2 hours for urgent situations.", cta: "Add to Booking" },
  { icon: "📊", title: "Deep Inspection Report", price: "£15", desc: "Professional-grade room assessment with detailed PDF report.", cta: "Purchase Report" },
  { icon: "📹", title: "Video Supervision", price: "£10", perUnit: "/hour", desc: "Live stream access to monitor cleaning progress in real-time.", cta: "Enable Video" },
  { icon: "🛡️", title: "Extended Warranty", price: "£8", perUnit: "/job", desc: "7-day satisfaction guarantee vs standard 48-hour coverage.", cta: "Add Protection" },
  { icon: "🔍", title: "Premium Background Check", price: "£5", desc: "View enhanced cleaner verification and full history details.", cta: "View Details" },
  { icon: "💳", title: "Instant Payment", price: "£3", perUnit: "/job", desc: "Get paid immediately after job approval — no waiting period.", cta: "Enable Instant Pay" },
];

export default function AddonsSection() {
  return (
    <section style={{ padding: "90px 30px", maxWidth: "1400px", margin: "auto" }}>
      <div style={{ textAlign: "center", marginBottom: "70px" }}>
        <h2 style={{
          fontSize: "56px",
          fontWeight: 900,
          marginBottom: "18px",
          background: "linear-gradient(135deg,#57c7ff,#1ea7ff)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}>
          Premium Add-Ons
        </h2>
        <p style={{ fontSize: "20px", color: "#9fb0c1", maxWidth: "700px", margin: "auto", lineHeight: 1.6 }}>
          Boost your experience with à la carte features available to all members
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "25px" }}>
        {addons.map((a) => (
          <div key={a.title} style={{
            background: "linear-gradient(180deg,#0d1727,#101d30)",
            borderRadius: "22px",
            padding: "28px",
            border: "1px solid rgba(255,255,255,.06)",
          }}>
            <div style={{
              width: "60px",
              height: "60px",
              borderRadius: "16px",
              background: "linear-gradient(135deg,#1ea7ff,#0077ff)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "28px",
              marginBottom: "20px",
            }}>
              {a.icon}
            </div>
            <div style={{ fontSize: "22px", fontWeight: 800, marginBottom: "10px" }}>{a.title}</div>
            <div style={{ fontSize: "32px", fontWeight: 900, color: "#57c7ff", marginBottom: "15px" }}>
              {a.price}
              {a.perUnit && <span style={{ fontSize: "16px", color: "#9fb0c1" }}>{a.perUnit}</span>}
            </div>
            <div style={{ color: "#9fb0c1", lineHeight: 1.6, marginBottom: "20px" }}>{a.desc}</div>
            <button style={{
              padding: "12px 20px",
              borderRadius: "12px",
              border: "none",
              background: "linear-gradient(135deg,#1ea7ff,#0077ff)",
              color: "white",
              fontWeight: 700,
              fontSize: "15px",
              cursor: "pointer",
              width: "100%",
            }}>
              {a.cta}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
