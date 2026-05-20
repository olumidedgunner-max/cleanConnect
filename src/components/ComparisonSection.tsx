const rows = [
  { feature: "AI Pricing Estimates", basic: true, plus: true, platinum: true },
  { feature: "Escrow Payment Protection", basic: true, plus: true, platinum: true },
  { feature: "Platform Fee", basic: "5%", plus: "3.5%", platinum: "0%" },
  { feature: "Response Time", basic: "24-48h", plus: "12h", platinum: "24/7" },
  { feature: "Priority Job Visibility", basic: false, plus: true, platinum: true },
  { feature: "Same-Day Booking Guarantee", basic: false, plus: true, platinum: true },
  { feature: "Dedicated Account Manager", basic: false, plus: false, platinum: true },
  { feature: "Emergency 4-Hour Service", basic: false, plus: false, platinum: true },
  { feature: "White-Glove Concierge", basic: false, plus: false, platinum: true },
  { feature: "Unlimited Properties", basic: false, plus: false, platinum: true },
  { feature: "Custom Cleaning Protocols", basic: false, plus: false, platinum: true },
  { feature: "Video Pre-Booking Consultation", basic: false, plus: false, platinum: true },
];

function Cell({ value, isPlatinum }: { value: boolean | string; isPlatinum?: boolean }) {
  if (typeof value === "string") {
    return (
      <div style={{ textAlign: "center", color: isPlatinum ? "#c084fc" : value === "3.5%" ? "#ff9500" : "#9fb0c1", fontWeight: isPlatinum ? 800 : 400, fontSize: "13px" }}>
        {value}
      </div>
    );
  }
  return value ? (
    <div style={{ textAlign: "center", fontSize: "20px", color: "#57c7ff" }}>✓</div>
  ) : (
    <div style={{ textAlign: "center", color: "#4a5568" }}>—</div>
  );
}

export default function ComparisonSection() {
  return (
    <section style={{ padding: "90px 30px", background: "#0a1420" }}>
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
          Compare All Features
        </h2>
        <p style={{ fontSize: "20px", color: "#9fb0c1" }}>See exactly what&apos;s included in each premium tier</p>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", background: "#0d1727", borderRadius: "26px", overflow: "hidden", border: "1px solid rgba(255,255,255,.06)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", background: "#101d30", padding: "25px", fontWeight: 800, borderBottom: "2px solid rgba(255,255,255,.08)" }}>
          <div>Feature</div>
          <div style={{ textAlign: "center" }}>Basic</div>
          <div style={{ textAlign: "center" }}>Plus</div>
          <div style={{ textAlign: "center" }}>Platinum</div>
        </div>
        {rows.map((row, i) => (
          <div key={i} style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr",
            padding: "20px 25px",
            borderBottom: i < rows.length - 1 ? "1px solid rgba(255,255,255,.05)" : "none",
            alignItems: "center",
          }}>
            <div style={{ fontWeight: 600, color: "#c5d0dc" }}>{row.feature}</div>
            <Cell value={row.basic} />
            <Cell value={row.plus} />
            <Cell value={row.platinum} isPlatinum={typeof row.platinum === "string"} />
          </div>
        ))}
      </div>
    </section>
  );
}
