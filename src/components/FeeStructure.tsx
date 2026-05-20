const fees = [
  {
    title: "Individual Posting a Job",
    icon: "🏠",
    color: "#1ea7ff",
    items: [
      "5% platform & matching fee on job value",
      "Bare minimum to post: email + phone only",
      "Full ID & Stripe registration after acceptance",
      "Funds held in escrow until job approved",
    ],
    example: "£100 job → you pay £105 total",
  },
  {
    title: "Cleaner / Student Accepting",
    icon: "🧹",
    color: "#22c55e",
    items: [
      "7.5% matching & validation fee from payout",
      "Great for students & people with spare time",
      "Get paid via Stripe after job approval",
      "Build reviews on verified completed jobs only",
    ],
    example: "£100 job → you receive £92.50",
  },
  {
    title: "Business Posting Jobs",
    icon: "🏢",
    color: "#f59e0b",
    items: [
      "15% platform fee (vs 5% for individuals)",
      "Higher rate reflects commercial scale & volume",
      "Cleaner still pays 7.5% from their payout",
      "Full business registration required upfront",
    ],
    example: "£100 job → business pays £115 total",
  },
];

export default function FeeStructure() {
  return (
    <section style={{ padding: "90px 30px", background: "#0a1420" }}>
      <div style={{ maxWidth: "1100px", margin: "auto" }}>
        <h2 style={{ fontSize: "46px", fontWeight: 900, marginBottom: "15px" }}>Clear & Transparent Fees</h2>
        <p style={{ color: "#9fb0c1", fontSize: "18px", lineHeight: 1.7, marginBottom: "55px", maxWidth: "700px" }}>
          No hidden charges. Everyone knows exactly what they pay before committing.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "25px" }}>
          {fees.map((f) => (
            <div key={f.title} style={{ background: "linear-gradient(180deg,#0d1727,#101d30)", borderRadius: "26px", padding: "32px", border: "1px solid rgba(255,255,255,.06)" }}>
              <div style={{ fontSize: "40px", marginBottom: "16px" }}>{f.icon}</div>
              <h3 style={{ fontSize: "22px", fontWeight: 800, marginBottom: "20px" }}>{f.title}</h3>
              <ul style={{ listStyle: "none", marginBottom: "24px" }}>
                {f.items.map((item) => (
                  <li key={item} style={{ display: "flex", gap: "10px", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,.04)", color: "#c5d0dc", lineHeight: 1.6, fontSize: "15px" }}>
                    <span style={{ color: f.color, fontWeight: 900, minWidth: "16px" }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <div style={{ background: `rgba(${f.color === "#1ea7ff" ? "30,167,255" : f.color === "#22c55e" ? "34,197,94" : "245,158,11"},.1)`, border: `1px solid rgba(${f.color === "#1ea7ff" ? "30,167,255" : f.color === "#22c55e" ? "34,197,94" : "245,158,11"},.25)`, borderRadius: "12px", padding: "14px 18px", fontSize: "14px", fontWeight: 700, color: f.color }}>
                Example: {f.example}
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: "40px", background: "linear-gradient(180deg,#0d1727,#101d30)", borderRadius: "22px", padding: "28px 32px", border: "1px solid rgba(255,255,255,.06)", display: "flex", gap: "20px", alignItems: "flex-start" }}>
          <span style={{ fontSize: "28px" }}>🔒</span>
          <div>
            <h4 style={{ fontWeight: 800, marginBottom: "8px", fontSize: "18px" }}>Escrow & Identity Protection</h4>
            <p style={{ color: "#9fb0c1", lineHeight: 1.7, fontSize: "15px" }}>
              Full name, address, and bank details for both parties are only revealed <strong style={{ color: "white" }}>after</strong> a job is accepted and escrow is funded.
              All payments are processed via Stripe. Funds release only after the client confirms completion — never before.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
